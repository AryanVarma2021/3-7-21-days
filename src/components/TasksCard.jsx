// src/components/TasksCard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import Task from './Task';
import { getAllChildTasks, completeTask } from '../services/taskService';

const TasksCard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch pending child tasks due up to now
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const allTasks = await getAllChildTasks();
      // show only pending tasks (you can also filter by dueDate <= now)
      const pending = allTasks.filter((t) => t.status === 'pending');
      setTasks(pending);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      alert('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // fetch on mount
    fetchTasks();
  }, [fetchTasks]);

  // called when user clicks Done on a task
  async function onDoneBtn(taskId) {
    try {
      await completeTask(taskId); // marks child done and updates master in DB (transaction)
      // refresh list
      await fetchTasks();
    } catch (err) {
      console.error('Error marking done:', err);
      alert('Could not mark task as done');
    }
  }

  return (
    <div className="p-8 border overflow-auto" style={{ maxHeight: '65vh' }}>
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
