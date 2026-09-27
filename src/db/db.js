import { openDB } from 'idb';

export const DB_NAME = 'growtogether-db';
export const DB_VERSION = 1;

export const STORES = {
  users: 'users',
  activities: 'activities',
  tasks: 'tasks',
  goals: 'goals',
  coupleGoals: 'coupleGoals',
  dailyProgress: 'dailyProgress',
  achievements: 'achievements',
  reflections: 'reflections',
  littleThings: 'littleThings',
  settings: 'settings',
  meta: 'meta',
};

let dbPromise = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const ensure = (name, keyPath = 'id') => {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, { keyPath });
          }
        };
        ensure(STORES.users);
        ensure(STORES.activities);
        ensure(STORES.tasks);
        ensure(STORES.goals);
        ensure(STORES.coupleGoals);
        ensure(STORES.dailyProgress);
        ensure(STORES.achievements);
        ensure(STORES.reflections);
        ensure(STORES.littleThings);
        ensure(STORES.settings, 'key');
        ensure(STORES.meta, 'key');
      },
    });
  }
  return dbPromise;
}

export async function dbGetAll(store) {
  try {
    const db = await getDB();
    return await db.getAll(store);
  } catch (e) {
    console.error(`dbGetAll(${store}) failed`, e);
    return [];
  }
}

export async function dbGet(store, id) {
  try {
    const db = await getDB();
    return await db.get(store, id);
  } catch (e) {
    console.error(`dbGet(${store}) failed`, e);
    return undefined;
  }
}

export async function dbPut(store, value) {
  const db = await getDB();
  await db.put(store, value);
  return value;
}

export async function dbBulkPut(store, values) {
  const db = await getDB();
  const tx = db.transaction(store, 'readwrite');
  await Promise.all([...values.map((v) => tx.store.put(v)), tx.done]);
}

export async function dbDelete(store, id) {
  const db = await getDB();
  await db.delete(store, id);
}

export async function dbClear(store) {
  const db = await getDB();
  await db.clear(store);
}

export async function dbClearAll() {
  const db = await getDB();
  await Promise.all(Object.values(STORES).map((s) => db.clear(s)));
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function isIndexedDBAvailable() {
  try {
    if (!('indexedDB' in window)) return false;
    await getDB();
    return true;
  } catch {
    return false;
  }
}
