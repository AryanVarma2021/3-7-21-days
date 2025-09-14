// src/services/taskService.js
import { CHILD_TASKS, initDB, TASK_MASTERS } from "../lib/db";
import { v4 as uuidv4 } from "uuid";

const nowISO = () => new Date().toISOString();

// helper that returns the opened DB instance
async function getDB() {
  return await initDB();
}

/**
 * Get all child tasks (optionally you can pass a query)
 * Here we return all child tasks sorted by dueDate.
 */
export async function getAllChildTasks() {
  const db = await getDB();
  //console.log("db is :", db);
  
  // getAllFromIndex(storeName, indexName) returns all records from index
  const all = await db.getAllFromIndex(CHILD_TASKS, 'dueDate_idx');
  // index results may already be in index order, but we can explicitly sort by dueDate to be safe
  all.filter((task) => task.status === "pending");
  return all.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
}

/**
 * Create a TaskMaster and its 3 child tasks (3, 7, 21 days).
 * `task` parameter is expected to be { text: string, ...optional }
 */


export async function completeTask(id) {
    const db = await getDB();

    const tx = db.transaction([TASK_MASTERS, CHILD_TASKS], 'readwrite');
    const childStore = tx.objectStore(CHILD_TASKS);
    const parentStore = tx.objectStore(TASK_MASTERS);


    const childTask = await childStore.get(id);

    if(!childTask) {
        throw new Error("Child task not found");
    }

    childTask.status = "done";
    await childStore.put(childTask);

    const parentTask = await parentStore.get(childTask.masterId);
    if(!parentTask) {
        throw new Error("Parent task not found");
    }

    parentTask.count = (parentTask.count || 0) + 1;
    if(parentTask.count >= 3) {
        parentTask.isCompleted = true;
        const index = childStore.index('masterId_idx');
        let cursor = await index.openCursor(parentTask.id);
        while(cursor) {
            await cursor.delete();
            cursor = await cursor.continue();
        }
    }

    await parentStore.put(parentTask);

    await tx.done;

    



    
}
export async function createTask(task) {
  try {
    if (!task || !task.text || !task.text.trim()) {
      alert("Please enter some text");
      return;
    }

    const ParentId = uuidv4();
    const createdAt = nowISO();

    const parentTask = {
      id: ParentId,
      text: task.text.trim(),
      createdAt,
      user: null,        // or some user id later
      isCompleted: false,
      count: 0
    };

    // compute due dates
    const inDays = (d) => new Date(Date.now() + d * 24 * 60 * 60 * 1000).toISOString();

    const childTask1 = {
      id: uuidv4(),
        text : task.text.trim(), 
      masterId: ParentId,
      dueDate: inDays(3),
      status: "pending"
    };
    const childTask2 = {
      id: uuidv4(),
      text : task.text.trim(), 
      masterId: ParentId,
      dueDate: inDays(7),
      status: "pending"
    };
    const childTask3 = {
      id: uuidv4(),
      text : task.text.trim(), 
      masterId: ParentId,
      dueDate: inDays(21),
      status: "pending"
    };

    const db = await getDB();

    // Use a transaction to ensure atomic writes (either all succeed or none)
    const tx = db.transaction([TASK_MASTERS, CHILD_TASKS], 'readwrite');
    await tx.objectStore(TASK_MASTERS).add(parentTask);
    await tx.objectStore(CHILD_TASKS).add(childTask1);
    await tx.objectStore(CHILD_TASKS).add(childTask2);
    await tx.objectStore(CHILD_TASKS).add(childTask3);
    await tx.done; // wait for transaction to complete

    alert("Task Added Successfully");

    return parentTask; // useful if caller wants to do something else
  } catch (error) {
    alert(error.message || "Error creating task");
    console.error("Error creating task:", error);
    throw error; // rethrow so caller can handle if needed
  }
}
