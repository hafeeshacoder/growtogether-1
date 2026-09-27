import {
  UsersRepo, ActivitiesRepo, TasksRepo, GoalsRepo, CoupleGoalsRepo,
  DailyProgressRepo, AchievementsRepo, ReflectionsRepo, LittleThingsRepo,
  setSetting, setMeta, uid,
} from '../db/repository';
import { dbClearAll } from '../db/db';
import { buildDemoData } from '../data/demoData';

export async function loadDemoData() {
  await dbClearAll();
  const data = buildDemoData();
  await UsersRepo.bulkPut(data.users);
  await ActivitiesRepo.bulkPut(data.activities);
  await TasksRepo.bulkPut(data.tasks);
  await GoalsRepo.bulkPut(data.goals);
  await CoupleGoalsRepo.bulkPut(data.coupleGoals);
  await DailyProgressRepo.bulkPut(data.dailyProgress);
  await AchievementsRepo.bulkPut(data.achievements);
  await ReflectionsRepo.bulkPut(data.reflections);
  await LittleThingsRepo.bulkPut(data.littleThings);
  await setSetting('isDemo', true);
  await setSetting('activeUserId', data.users[0].id);
  await setSetting('onboarded', true);
  await setMeta('seededAt', Date.now());
  return data;
}

export async function createFreshProfile(name, careerGoal, avatar) {
  await dbClearAll();
  const user = {
    id: uid('user'),
    name,
    role: 'Partner 1',
    avatar: avatar || '🌸',
    careerGoal: careerGoal || '',
    quote: '',
    createdAt: Date.now(),
  };
  await UsersRepo.save(user);
  await setSetting('isDemo', false);
  await setSetting('activeUserId', user.id);
  await setSetting('onboarded', true);
  return user;
}

export async function clearAllData() {
  await dbClearAll();
}
