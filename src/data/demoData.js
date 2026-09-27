import { uid } from '../db/db';
import { daysAgoISO, todayISO } from '../utils/dateUtils';

function activity(userId, mode, day, title, startTime, endTime, category, icon, color, completed = false) {
  return {
    id: uid('act'),
    userId,
    mode,
    day, // 'all' or specific weekday e.g. 'Mon'
    title,
    startTime,
    endTime,
    category,
    icon,
    color,
    repeat: 'daily',
    completed,
    notes: '',
    createdAt: Date.now(),
  };
}

function task(userId, title, category, date, completed, priority) {
  return {
    id: uid('task'),
    userId,
    title,
    category,
    date,
    completed,
    priority,
    createdAt: Date.now(),
  };
}

function goal(userId, title, description, progress, category, deadline) {
  return {
    id: uid('goal'),
    userId,
    title,
    description,
    progress,
    category,
    deadline,
    createdAt: Date.now(),
  };
}

export function buildDemoData() {
  const hafeeza = {
    id: 'user_hafeeza',
    name: 'Hafeeza',
    role: 'Partner 1',
    avatar: '🌸',
    careerGoal: 'AI Engineer',
    quote: 'Building intelligent systems, one line at a time. 🤖',
    createdAt: Date.now(),
  };
  const partner = {
    id: 'user_partner',
    name: 'Partner',
    role: 'Partner 2',
    avatar: '💙',
    careerGoal: 'Software Developer',
    quote: 'Crafting clean code and better products. 💻',
    createdAt: Date.now(),
  };

  const users = [hafeeza, partner];

  const activities = [];
  const makeRoutineFor = (u, mode) => {
    if (mode === 'normal') {
      activities.push(activity(u.id, mode, 'all', 'Wake Up', '07:00 AM', '07:30 AM', 'wellness', '☀️', '#F59E0B', true));
      activities.push(activity(u.id, mode, 'all', 'Study', '08:00 AM', '09:30 AM', 'study', '📚', '#EC4899', true));
      activities.push(activity(u.id, mode, 'all', 'College', '10:00 AM', '04:00 PM', 'college', '🎓', '#F472B6', true));
      activities.push(activity(u.id, mode, 'all', 'AI Practice', '05:30 PM', '06:30 PM', 'ai_ml', '🤖', '#9D174D', true));
      activities.push(activity(u.id, mode, 'all', 'DSA Practice', '07:00 PM', '08:00 PM', 'coding', '💻', '#BE185D', false));
      activities.push(activity(u.id, mode, 'all', 'Project Work', '08:00 PM', '09:30 PM', 'career', '🚀', '#DB2777', false));
      activities.push(activity(u.id, mode, 'all', 'Daily Reflection', '10:00 PM', '10:15 PM', 'personal', '🌙', '#8B6475', false));
    } else if (mode === 'holiday') {
      activities.push(activity(u.id, mode, 'all', 'Wake Up', '08:30 AM', '09:00 AM', 'wellness', '☀️', '#F59E0B', false));
      activities.push(activity(u.id, mode, 'all', 'Light Reading', '10:00 AM', '11:00 AM', 'study', '📚', '#EC4899', false));
      activities.push(activity(u.id, mode, 'all', 'Side Project', '12:00 PM', '02:00 PM', 'career', '🚀', '#DB2777', false));
      activities.push(activity(u.id, mode, 'all', 'Workout', '05:00 PM', '06:00 PM', 'health', '🏃', '#22C55E', false));
      activities.push(activity(u.id, mode, 'all', 'Time Together', '07:00 PM', '08:30 PM', 'relationship', '❤️', '#F43F5E', false));
    } else if (mode === 'exam') {
      activities.push(activity(u.id, mode, 'all', 'Wake Up Early', '06:00 AM', '06:30 AM', 'wellness', '☀️', '#F59E0B', false));
      activities.push(activity(u.id, mode, 'all', 'Revision Block 1', '07:00 AM', '10:00 AM', 'study', '📚', '#EC4899', false));
      activities.push(activity(u.id, mode, 'all', 'Mock Tests', '10:30 AM', '12:30 PM', 'college', '🎓', '#F472B6', false));
      activities.push(activity(u.id, mode, 'all', 'Revision Block 2', '02:00 PM', '05:00 PM', 'study', '📚', '#EC4899', false));
      activities.push(activity(u.id, mode, 'all', 'Quick Break', '05:00 PM', '05:30 PM', 'wellness', '🧘', '#34D399', false));
      activities.push(activity(u.id, mode, 'all', 'Final Revision', '06:00 PM', '08:00 PM', 'study', '📚', '#EC4899', false));
    }
  };
  makeRoutineFor(hafeeza, 'normal');
  makeRoutineFor(hafeeza, 'holiday');
  makeRoutineFor(hafeeza, 'exam');
  makeRoutineFor(partner, 'normal');
  makeRoutineFor(partner, 'holiday');
  makeRoutineFor(partner, 'exam');

  const tasks = [];
  const today = todayISO();
  const taskSeed = (u, list) => list.forEach(([title, category, completed, priority, dayOffset]) => {
    tasks.push(task(u.id, title, category, dayOffset === 0 ? today : daysAgoISO(dayOffset), completed, priority));
  });
  taskSeed(hafeeza, [
    ['Complete ML assignment', 'ai_ml', true, 'high', 0],
    ['Solve 5 DSA problems', 'coding', true, 'high', 0],
    ['Read research paper', 'ai_ml', false, 'medium', 0],
    ['Attend college lecture', 'college', true, 'medium', 0],
    ['Update portfolio site', 'career', false, 'medium', 0],
    ['Morning workout', 'health', true, 'low', 0],
    ['Write daily reflection', 'personal', false, 'low', 0],
    ['Revise linear algebra', 'study', true, 'high', 1],
    ['Mock interview practice', 'career', true, 'medium', 1],
    ['Plan weekend project', 'goals', false, 'low', 1],
  ]);
  taskSeed(partner, [
    ['Finish React component', 'coding', true, 'high', 0],
    ['Code review for team', 'career', true, 'medium', 0],
    ['Study system design', 'study', false, 'high', 0],
    ['Attend standup meeting', 'college', true, 'low', 0],
    ['Fix production bug', 'coding', true, 'high', 0],
    ['Evening jog', 'health', false, 'low', 0],
    ['Write reflection notes', 'personal', false, 'low', 0],
    ['Practice SQL queries', 'study', true, 'medium', 1],
    ['Update resume', 'career', true, 'medium', 1],
    ['Plan next sprint tasks', 'goals', true, 'low', 1],
  ]);

  const goals = [];
  goals.push(goal(hafeeza.id, 'Become an AI Engineer', 'Master ML, deep learning and deploy real projects.', 72, 'career', '2027-06-01'));
  goals.push(goal(hafeeza.id, 'Complete 3 portfolio projects', 'Build and publish 3 strong AI/ML projects.', 60, 'career', '2026-12-01'));
  goals.push(goal(hafeeza.id, 'Complete DSA roadmap', 'Finish structured DSA practice roadmap.', 45, 'learning', '2026-11-15'));
  goals.push(goal(hafeeza.id, 'Read 12 books this year', 'Personal growth through reading.', 33, 'personal', '2026-12-31'));
  goals.push(goal(partner.id, 'Become a Senior Developer', 'Grow into a senior full-stack role.', 65, 'career', '2027-03-01'));
  goals.push(goal(partner.id, 'Complete DSA roadmap', 'Finish structured DSA practice roadmap.', 50, 'learning', '2026-11-15'));
  goals.push(goal(partner.id, 'Ship 3 side projects', 'Build and launch 3 independent apps.', 40, 'career', '2026-12-01'));

  const coupleGoals = [
    { id: uid('cgoal'), title: 'Complete our portfolios', description: 'Both of us finish polished portfolio sites.', progress: 55, deadline: '2026-12-15', createdBy: hafeeza.id, shared: true, createdAt: Date.now() },
    { id: uid('cgoal'), title: 'Learn consistently for 30 days', description: 'A shared streak challenge to stay consistent.', progress: 70, deadline: '2026-10-20', createdBy: partner.id, shared: true, createdAt: Date.now() },
    { id: uid('cgoal'), title: 'Build 5 projects together', description: 'Collaborate on 5 small projects this year.', progress: 40, deadline: '2027-01-01', createdBy: hafeeza.id, shared: true, createdAt: Date.now() },
    { id: uid('cgoal'), title: 'Improve DSA together', description: 'Solve problems together weekly.', progress: 48, deadline: '2026-11-30', createdBy: partner.id, shared: true, createdAt: Date.now() },
    { id: uid('cgoal'), title: 'Prepare for interviews', description: 'Mock interviews and resume polish.', progress: 30, deadline: '2027-02-01', createdBy: hafeeza.id, shared: true, createdAt: Date.now() },
  ];

  const dailyProgress = [];
  [hafeeza, partner].forEach((u, idx) => {
    for (let i = 6; i >= 0; i--) {
      const date = daysAgoISO(i);
      const totalTasks = 7 + (i % 3);
      const completedTasks = Math.max(1, totalTasks - ((i + idx) % 4));
      dailyProgress.push({
        id: uid('prog'),
        userId: u.id,
        date,
        completedTasks,
        totalTasks,
        percentage: Math.round((completedTasks / totalTasks) * 100),
        studyHours: +(1.5 + ((i + idx) % 4) * 0.5).toFixed(1),
        codingHours: +(1 + ((i + idx * 2) % 3) * 0.7).toFixed(1),
      });
    }
  });

  const achievements = [];
  [hafeeza, partner].forEach((u) => {
    achievements.push({ id: uid('ach'), userId: u.id, achievementId: 'first_step', title: 'First Step', description: 'Complete your first task.', icon: '🌱', unlockedAt: Date.now() - 6 * 86400000 });
    achievements.push({ id: uid('ach'), userId: u.id, achievementId: 'streak_7', title: '7 Day Streak', description: 'Stay consistent for 7 days.', icon: '🔥', unlockedAt: Date.now() - 1 * 86400000 });
    achievements.push({ id: uid('ach'), userId: u.id, achievementId: 'study_champion', title: 'Study Champion', description: 'Complete 20 study hours.', icon: '📚', unlockedAt: Date.now() - 2 * 86400000 });
  });
  achievements.push({ id: uid('ach'), userId: hafeeza.id, achievementId: 'goal_getter', title: 'Goal Getter', description: 'Complete your first goal.', icon: '🎯', unlockedAt: Date.now() - 3 * 86400000 });
  achievements.push({ id: uid('ach'), userId: partner.id, achievementId: 'coding_week', title: 'Coding Week', description: 'Complete coding tasks for 7 days.', icon: '💻', unlockedAt: Date.now() - 4 * 86400000 });

  const reflections = [];
  [hafeeza, partner].forEach((u, idx) => {
    reflections.push({
      id: uid('refl'),
      userId: u.id,
      date: daysAgoISO(0),
      mood: 'good',
      proud: 'I finished my ML assignment ahead of schedule.',
      learned: 'Learned about gradient boosting in more depth.',
      tomorrowFocus: 'Start the new portfolio project.',
      createdAt: Date.now(),
    });
    reflections.push({
      id: uid('refl'),
      userId: u.id,
      date: daysAgoISO(1),
      mood: idx === 0 ? 'amazing' : 'okay',
      proud: 'Stayed consistent with my routine.',
      learned: 'Small breaks actually improve my focus.',
      tomorrowFocus: 'Push through the DSA roadmap.',
      createdAt: Date.now() - 86400000,
    });
    reflections.push({
      id: uid('refl'),
      userId: u.id,
      date: daysAgoISO(2),
      mood: 'tired',
      proud: 'Still showed up even when tired.',
      learned: 'Need to sleep earlier for better focus.',
      tomorrowFocus: 'Sleep by 11 PM tonight.',
      createdAt: Date.now() - 2 * 86400000,
    });
  });

  const littleThings = [
    { id: uid('lt'), templateId: 'goals_together', date: today, done: true },
    { id: uid('lt'), templateId: 'encouraged', date: today, done: true },
    { id: uid('lt'), templateId: 'learned', date: today, done: false },
    { id: uid('lt'), templateId: 'careers', date: today, done: true },
  ];

  return { users, activities, tasks, goals, coupleGoals, dailyProgress, achievements, reflections, littleThings };
}
