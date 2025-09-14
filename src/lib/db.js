// src/lib/db.js
// initDB: opens (or creates) the IndexedDB database and sets up object stores & indexes.
// Uses the 'idb' wrapper: https://www.npmjs.com/package/idb
import { openDB } from 'idb';

export const DB_NAME = 'taskmaster-db';
export const DB_VERSION = 1;
export const TASK_MASTERS = 'taskMasters';
export const CHILD_TASKS = 'childTasks';

// cache the promise so we don't reopen DB many times
let dbPromise = null;

/**
 * Initialize and return the database instance (IDBPDatabase).
 * Call `await initDB()` at app startup (or the first time you need DB).
 */
export function initDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      // upgrade runs when DB is new or version increases
      upgrade(db, oldVersion, newVersion, transaction) {
        // oldVersion === 0 means database didn't exist before
        if (oldVersion < 1) {
          // Create TaskMaster store (parent tasks)
          // keyPath 'id' means each object must have an `id` property that is the primary key
          const tmStore = db.createObjectStore(TASK_MASTERS, { keyPath: 'id' });
          // Indexes help you query by fields quickly
          tmStore.createIndex('createdAt_idx', 'createdAt');
          tmStore.createIndex('isCompleted_idx', 'isCompleted');

          // Create ChildTasks store (the 3 scheduled subtasks)
          const ctStore = db.createObjectStore(CHILD_TASKS, { keyPath: 'id' });
          ctStore.createIndex('masterId_idx', 'masterId');      // find all children for a master
          ctStore.createIndex('dueDate_idx', 'dueDate');        // query tasks by due date
          ctStore.createIndex('status_idx', 'status');          // pending | done
          // composite index (useful if you frequently query by dueDate + masterId)
          ctStore.createIndex('dueDate_masterId_idx', ['dueDate', 'masterId']);
        }

        // FUTURE: when you bump DB_VERSION to 2, 3, ... use more if (oldVersion < 2) blocks here
      }
    });
  }

  return dbPromise;
}
