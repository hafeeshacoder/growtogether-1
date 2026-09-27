import * as XLSX from 'xlsx';
import {
  UsersRepo, ActivitiesRepo, TasksRepo, GoalsRepo, CoupleGoalsRepo,
  DailyProgressRepo, AchievementsRepo, ReflectionsRepo, SettingsRepo,
  setMeta,
} from '../db/repository';
import { dbClearAll } from '../db/db';
import { toISODate } from '../utils/dateUtils';

const SHEET_COLUMNS = {
  Users: ['id', 'name', 'role', 'avatar', 'careerGoal', 'quote', 'createdAt'],
  Routines: ['id', 'userId', 'mode', 'day', 'activityId'],
  Activities: ['id', 'userId', 'mode', 'title', 'category', 'startTime', 'endTime', 'repeat', 'completed', 'color', 'icon'],
  Tasks: ['id', 'userId', 'title', 'category', 'date', 'completed', 'priority'],
  Goals: ['id', 'userId', 'title', 'description', 'progress', 'category', 'deadline'],
  Daily_Progress: ['id', 'userId', 'date', 'completedTasks', 'totalTasks', 'percentage', 'studyHours', 'codingHours'],
  Achievements: ['id', 'userId', 'title', 'description', 'icon', 'unlockedAt'],
  Reflections: ['id', 'userId', 'date', 'mood', 'reflection', 'tomorrowFocus'],
  Settings: ['key', 'value'],
};

function rowsFor(columns, items) {
  return items.map((item) => {
    const row = {};
    columns.forEach((c) => {
      let v = item[c];
      if (c === 'reflection') v = item.proud ? `Proud: ${item.proud}\nLearned: ${item.learned || ''}` : (item.reflection || '');
      if (typeof v === 'object' && v !== null) v = JSON.stringify(v);
      row[c] = v === undefined || v === null ? '' : v;
    });
    return row;
  });
}

export async function exportToExcel() {
  const [users, activities, tasks, goals, coupleGoals, dailyProgress, achievements, reflections, settings] = await Promise.all([
    UsersRepo.all(), ActivitiesRepo.all(), TasksRepo.all(), GoalsRepo.all(), CoupleGoalsRepo.all(),
    DailyProgressRepo.all(), AchievementsRepo.all(), ReflectionsRepo.all(), SettingsRepo.all(),
  ]);

  const routines = activities.map((a) => ({ id: `${a.id}_routine`, userId: a.userId, mode: a.mode, day: a.day, activityId: a.id }));

  const wb = XLSX.utils.book_new();
  const addSheet = (name, columns, items) => {
    const ws = XLSX.utils.json_to_sheet(rowsFor(columns, items), { header: columns });
    XLSX.utils.book_append_sheet(wb, ws, name);
  };

  addSheet('Users', SHEET_COLUMNS.Users, users);
  addSheet('Routines', SHEET_COLUMNS.Routines, routines);
  addSheet('Activities', SHEET_COLUMNS.Activities, activities);
  addSheet('Tasks', SHEET_COLUMNS.Tasks, tasks);
  addSheet('Goals', SHEET_COLUMNS.Goals, goals);
  addSheet('Daily_Progress', SHEET_COLUMNS.Daily_Progress, dailyProgress);
  addSheet('Achievements', SHEET_COLUMNS.Achievements, achievements);
  addSheet('Reflections', SHEET_COLUMNS.Reflections, reflections);
  addSheet('Settings', SHEET_COLUMNS.Settings, settings);
  // Bonus: couple goals sheet for completeness
  addSheet('Couple_Goals', ['id', 'title', 'description', 'progress', 'deadline', 'createdBy', 'shared'], coupleGoals);

  const filename = `GrowTogether_Backup_${toISODate(new Date())}.xlsx`;
  XLSX.writeFile(wb, filename);
  await setMeta('lastBackup', Date.now());
  return filename;
}

function sheetToJson(wb, name) {
  const ws = wb.Sheets[name];
  if (!ws) return [];
  return XLSX.utils.sheet_to_json(ws, { defval: '' });
}

function toBool(v) {
  return v === true || v === 'true' || v === 1 || v === '1';
}

function toNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function importFromExcel(file) {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });

  const requiredAny = ['Users', 'Tasks', 'Activities'];
  const hasValidSheet = requiredAny.some((s) => wb.SheetNames.includes(s));
  if (!hasValidSheet) {
    throw new Error('INVALID_BACKUP');
  }

  const users = sheetToJson(wb, 'Users').map((r) => ({
    id: String(r.id), name: r.name, role: r.role, avatar: r.avatar,
    careerGoal: r.careerGoal, quote: r.quote, createdAt: toNum(r.createdAt, Date.now()),
  })).filter((u) => u.id);

  const activities = sheetToJson(wb, 'Activities').map((r) => ({
    id: String(r.id), userId: String(r.userId), mode: r.mode || 'normal', day: r.day || 'all',
    title: r.title, category: r.category || 'other', startTime: r.startTime, endTime: r.endTime,
    repeat: r.repeat || 'daily', completed: toBool(r.completed), color: r.color || '#EC4899',
    icon: r.icon || '✨', notes: '', createdAt: Date.now(),
  })).filter((a) => a.id);

  const tasks = sheetToJson(wb, 'Tasks').map((r) => ({
    id: String(r.id), userId: String(r.userId), title: r.title, category: r.category || 'other',
    date: r.date, completed: toBool(r.completed), priority: r.priority || 'medium', createdAt: Date.now(),
  })).filter((t) => t.id);

  const goals = sheetToJson(wb, 'Goals').map((r) => ({
    id: String(r.id), userId: String(r.userId), title: r.title, description: r.description,
    progress: toNum(r.progress, 0), category: r.category || 'personal', deadline: r.deadline, createdAt: Date.now(),
  })).filter((g) => g.id);

  const dailyProgress = sheetToJson(wb, 'Daily_Progress').map((r) => ({
    id: String(r.id), userId: String(r.userId), date: r.date, completedTasks: toNum(r.completedTasks),
    totalTasks: toNum(r.totalTasks), percentage: toNum(r.percentage), studyHours: toNum(r.studyHours),
    codingHours: toNum(r.codingHours),
  })).filter((d) => d.id);

  const achievements = sheetToJson(wb, 'Achievements').map((r) => ({
    id: String(r.id), userId: String(r.userId), achievementId: r.achievementId || r.title,
    title: r.title, description: r.description, icon: r.icon, unlockedAt: toNum(r.unlockedAt, Date.now()),
  })).filter((a) => a.id);

  const reflections = sheetToJson(wb, 'Reflections').map((r) => ({
    id: String(r.id), userId: String(r.userId), date: r.date, mood: r.mood || 'good',
    proud: (r.reflection || '').split('\n')[0]?.replace('Proud: ', '') || '',
    learned: (r.reflection || '').split('\n')[1]?.replace('Learned: ', '') || '',
    tomorrowFocus: r.tomorrowFocus || '', createdAt: Date.now(),
  })).filter((r) => r.id);

  const settingsRows = sheetToJson(wb, 'Settings').map((r) => ({ key: r.key, value: r.value }));

  const couponGoalsRows = sheetToJson(wb, 'Couple_Goals').map((r) => ({
    id: String(r.id), title: r.title, description: r.description, progress: toNum(r.progress),
    deadline: r.deadline, createdBy: r.createdBy, shared: toBool(r.shared), createdAt: Date.now(),
  })).filter((c) => c.id);

  await dbClearAll();
  if (users.length) await UsersRepo.bulkPut(users);
  if (activities.length) await ActivitiesRepo.bulkPut(activities);
  if (tasks.length) await TasksRepo.bulkPut(tasks);
  if (goals.length) await GoalsRepo.bulkPut(goals);
  if (dailyProgress.length) await DailyProgressRepo.bulkPut(dailyProgress);
  if (achievements.length) await AchievementsRepo.bulkPut(achievements);
  if (reflections.length) await ReflectionsRepo.bulkPut(reflections);
  if (couponGoalsRows.length) await CoupleGoalsRepo.bulkPut(couponGoalsRows);
  if (settingsRows.length) await SettingsRepo.bulkPut(settingsRows);
  if (users[0] && !settingsRows.find((s) => s.key === 'activeUserId')) {
    await SettingsRepo.save({ key: 'activeUserId', value: users[0].id });
  }
  await SettingsRepo.save({ key: 'onboarded', value: true });

  return { users, activities, tasks, goals, dailyProgress, achievements, reflections };
}
