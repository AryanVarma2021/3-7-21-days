// src/components/Task.jsx
import React from 'react';

const Task = ({ task, onDone }) => {
  return (
    <div className="flex justify-between border w-full p-1 items-center">
      <div>
        <h1 className="font-medium">{task.text}</h1>
        <div className="text-sm text-gray-600">{new Date(task.dueDate).toDateString()}</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm">{task.status}</div>
        <button
          onClick={() => onDone(task.id)}
          className="bg-green-500 cursor-pointer text-white rounded-md p-1"
          disabled={task.status === 'done'}
        >
          {task.status === 'done' ? 'Done' : 'Mark Done'}
        </button>
      </div>
    </div>
  );
};

export default Task;
