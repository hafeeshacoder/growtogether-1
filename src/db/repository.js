import { STORES, dbGetAll, dbGet, dbPut, dbDelete, dbClear, dbBulkPut, uid } from './db';

// Generic factory for simple CRUD repositories
function makeRepo(storeName) {
  return {
    all: () => dbGetAll(storeName),
    get: (id) => dbGet(storeName, id),
    save: (item) => dbPut(storeName, item),
    remove: (id) => dbDelete(storeName, id),
    clear: () => dbClear(storeName),
    bulkPut: (items) => dbBulkPut(storeName, items),
  };
}

export const UsersRepo = makeRepo(STORES.users);
export const ActivitiesRepo = makeRepo(STORES.activities);
export const TasksRepo = makeRepo(STORES.tasks);
export const GoalsRepo = makeRepo(STORES.goals);
export const CoupleGoalsRepo = makeRepo(STORES.coupleGoals);
export const DailyProgressRepo = makeRepo(STORES.dailyProgress);
export const AchievementsRepo = makeRepo(STORES.achievements);
export const ReflectionsRepo = makeRepo(STORES.reflections);
export const LittleThingsRepo = makeRepo(STORES.littleThings);
export const SettingsRepo = makeRepo(STORES.settings);
export const MetaRepo = makeRepo(STORES.meta);

export async function getSetting(key, fallback = null) {
  const item = await dbGet(STORES.settings, key);
  return item ? item.value : fallback;
}

export async function setSetting(key, value) {
  return dbPut(STORES.settings, { key, value });
}

export async function getMeta(key, fallback = null) {
  const item = await dbGet(STORES.meta, key);
  return item ? item.value : fallback;
}

export async function setMeta(key, value) {
  return dbPut(STORES.meta, { key, value });
}

export { uid };
