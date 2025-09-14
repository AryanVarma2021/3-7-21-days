// src/components/TasksCard.jsx
import React, { useEffect, useState, useCallback } from "react";
import Task from "./Task"; // explicit extension avoids case/path issues on linux
import { getAllChildTasks, completeTask } from "../services/taskService";

const TasksCard = ({ refreshKey }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const all = await getAllChildTasks();
      // Filter only pending tasks and tasks whose dueDate <= now (review queue)
      const nowISO = new Date().toISOString();
      const pendingDue = all.filter(
        (t) => t.status === "pending" && (t.dueDate || "") <= nowISO
      );
      // sort by dueDate ascending
      pendingDue.sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
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
    // refresh when refreshKey changes (passed from App)
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
