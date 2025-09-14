import React, { useEffect, useState } from 'react';
import Task from './Task';
import { getAllChildTasks, completeTask } from '../services/taskService';

const TasksCard = ({ refreshKey }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const allTasks = await getAllChildTasks();
    setTasks(allTasks.filter(t => t.status === 'pending'));
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshKey]); // re-run when refreshKey changes

  async function onDoneBtn(taskId) {
    await completeTask(taskId);
    fetchTasks();
  }

  return (
    <div className="p-8 border overflow-auto" style={{ maxHeight: '65vh' }}>
      <h2 className="text-lg font-semibold mb-3">Pending Tasks</h2>
      {tasks.length === 0 && <div>No pending tasks 🎉</div>}
      <div className="space-y-3">
        {tasks.map(task => (
          <Task key={task.id} task={task} onDone={onDoneBtn} />
        ))}
      </div>
    </div>
  );
};

export default TasksCard;
