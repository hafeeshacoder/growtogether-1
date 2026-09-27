import { DailyProgressRepo, TasksRepo, ActivitiesRepo, uid } from '../db/repository';
import { todayISO, timeToMinutes } from '../utils/dateUtils';

function hoursForCategories(activities, categories) {
  return activities
    .filter((a) => categories.includes(a.category) && a.completed)
    .reduce((sum, a) => {
      const start = timeToMinutes(a.startTime);
      let end = timeToMinutes(a.endTime);
      if (end < start) end += 24 * 60;
      return sum + Math.max(0, (end - start) / 60);
    }, 0);
}

/** Recomputes and persists today's progress record for a user based on tasks + activities. */
export async function recomputeTodayProgress(userId) {
  if (!userId) return null;
  const today = todayISO();
  const [tasks, activities, existing] = await Promise.all([
    TasksRepo.all(),
    ActivitiesRepo.all(),
    DailyProgressRepo.all(),
  ]);

  const todayTasks = tasks.filter((t) => t.userId === userId && t.date === today);
  const totalTasks = todayTasks.length;
  const completedTasks = todayTasks.filter((t) => t.completed).length;
  const percentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const userActivities = activities.filter((a) => a.userId === userId);
  const studyHours = +hoursForCategories(userActivities, ['study', 'college', 'ai_ml']).toFixed(1);
  const codingHours = +hoursForCategories(userActivities, ['coding']).toFixed(1);

  const existingRec = existing.find((p) => p.userId === userId && p.date === today);
  const record = {
    id: existingRec?.id || uid('prog'),
    userId,
    date: today,
    completedTasks,
    totalTasks,
    percentage,
    studyHours,
    codingHours,
  };
  await DailyProgressRepo.save(record);
  return record;
}

export default { recomputeTodayProgress };
