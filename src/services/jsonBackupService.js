import {
  UsersRepo, ActivitiesRepo, TasksRepo, GoalsRepo, CoupleGoalsRepo,
  DailyProgressRepo, AchievementsRepo, ReflectionsRepo, LittleThingsRepo, SettingsRepo,
  setMeta,
} from '../db/repository';
import { dbClearAll } from '../db/db';
import { toISODate } from '../utils/dateUtils';

export async function exportToJSON() {
  const [users, activities, tasks, goals, coupleGoals, dailyProgress, achievements, reflections, littleThings, settings] = await Promise.all([
    UsersRepo.all(), ActivitiesRepo.all(), TasksRepo.all(), GoalsRepo.all(), CoupleGoalsRepo.all(),
    DailyProgressRepo.all(), AchievementsRepo.all(), ReflectionsRepo.all(), LittleThingsRepo.all(), SettingsRepo.all(),
  ]);

  const payload = {
    app: 'GrowTogether',
    version: 1,
    exportedAt: Date.now(),
    data: { users, activities, tasks, goals, coupleGoals, dailyProgress, achievements, reflections, littleThings, settings },
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GrowTogether_Backup_${toISODate(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  await setMeta('lastBackup', Date.now());
  return payload;
}

export async function importFromJSON(file) {
  const text = await file.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error('INVALID_BACKUP');
  }
  if (!payload || payload.app !== 'GrowTogether' || !payload.data) {
    throw new Error('INVALID_BACKUP');
  }
  const { users, activities, tasks, goals, coupleGoals, dailyProgress, achievements, reflections, littleThings, settings } = payload.data;

  await dbClearAll();
  if (users?.length) await UsersRepo.bulkPut(users);
  if (activities?.length) await ActivitiesRepo.bulkPut(activities);
  if (tasks?.length) await TasksRepo.bulkPut(tasks);
  if (goals?.length) await GoalsRepo.bulkPut(goals);
  if (coupleGoals?.length) await CoupleGoalsRepo.bulkPut(coupleGoals);
  if (dailyProgress?.length) await DailyProgressRepo.bulkPut(dailyProgress);
  if (achievements?.length) await AchievementsRepo.bulkPut(achievements);
  if (reflections?.length) await ReflectionsRepo.bulkPut(reflections);
  if (littleThings?.length) await LittleThingsRepo.bulkPut(littleThings);
  if (settings?.length) await SettingsRepo.bulkPut(settings);

  return payload.data;
}
