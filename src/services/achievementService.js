import { ACHIEVEMENT_DEFS } from '../data/constants';
import { AchievementsRepo, TasksRepo, GoalsRepo, DailyProgressRepo, CoupleGoalsRepo, uid } from '../db/repository';

export async function computeUserStats(userId) {
  const [tasks, goals, progress, coupleGoals] = await Promise.all([
    TasksRepo.all(), GoalsRepo.all(), DailyProgressRepo.all(), CoupleGoalsRepo.all(),
  ]);

  const userTasks = tasks.filter((t) => t.userId === userId);
  const userProgress = progress.filter((p) => p.userId === userId).sort((a, b) => (a.date < b.date ? 1 : -1));

  const totalTasksCompleted = userTasks.filter((t) => t.completed).length;
  const studyHoursTotal = userProgress.reduce((sum, p) => sum + (p.studyHours || 0), 0);
  const codingDays = userProgress.filter((p) => (p.codingHours || 0) > 0).length;
  const goalsCompleted = goals.filter((g) => g.userId === userId && g.progress >= 100).length;
  const coupleGoalsCompleted = coupleGoals.filter((g) => g.progress >= 100).length;

  // streak: consecutive days (from today backwards) with percentage > 0
  let streak = 0;
  for (const p of userProgress) {
    if ((p.percentage || 0) > 0) streak += 1;
    else break;
  }

  return { totalTasksCompleted, studyHoursTotal, codingDays, goalsCompleted, coupleGoalsCompleted, streak };
}

export async function checkAndUnlockAchievements(userId) {
  const stats = await computeUserStats(userId);
  const existing = await AchievementsRepo.all();
  const existingIds = new Set(existing.filter((a) => a.userId === userId).map((a) => a.achievementId));
  const newlyUnlocked = [];

  for (const def of ACHIEVEMENT_DEFS) {
    if (!existingIds.has(def.id) && def.check(stats)) {
      const record = {
        id: uid('ach'),
        userId,
        achievementId: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
        unlockedAt: Date.now(),
      };
      await AchievementsRepo.save(record);
      newlyUnlocked.push(record);
    }
  }
  return { stats, newlyUnlocked };
}
