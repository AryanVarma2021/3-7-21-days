// src/components/TasksCard.jsx
import React, { useEffect, useState, useCallback } from "react";
import Task from "./Task";
import { getAllChildTasks, completeTask } from "../services/taskService";

const TasksCard = ({ refreshKey }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const all = await getAllChildTasks();

      // compute limits
      const now = Date.now();
      const threeDaysLater = now + 3 * 24 * 60 * 60 * 1000;

      // Keep only pending tasks whose dueDate is <= threeDaysLater
      // (this includes overdue/past items as well)
      const pendingDue = (all || []).filter((t) => {
        if (t.status !== "pending") return false;
        if (!t.dueDate) return false; // skip tasks without dueDate (change if you want them)
        const dueTs = new Date(t.dueDate).getTime();
        return !isNaN(dueTs) && dueTs <= threeDaysLater;
      });

      // sort by dueDate ascending (safely handle missing/invalid dates)
      pendingDue.sort((a, b) => {
        const at = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bt = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return at - bt;
      });

      setTasks(pendingDue);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshKey]);

  async function onDoneBtn(taskId) {
    try {
      await completeTask(taskId);
      await fetchTasks();
    } catch (err) {
      console.error("Error marking done:", err);
      alert("Could not mark task as done");
    }
  }

  return (
    <div className="p-8 border overflow-auto" style={{ maxHeight: "65vh" }}>
      <h2 className="text-lg font-semibold mb-3">Due Tasks</h2>

      {loading && <div>Loading...</div>}

      {!loading && tasks.length === 0 && <div>No pending tasks 🎉</div>}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex p-4">
            <Task task={task} onDone={onDoneBtn} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksCard;
