import React from 'react';
import { createTask } from '../services/taskService';

const InputCard = ({ onTaskAdded }) => {
  const [text, setText] = React.useState('');

  async function handlePostBtn() {
    if (!text || text.trim().length === 0) {
      alert('Please enter some text');
      return;
    }

    await createTask({ text });
    setText('');           // clear textarea
    onTaskAdded?.();       // tell parent to refresh TasksCard
  }

  return (
    <div className="flex items-end p-8">
      <div className="relative w-full max-w-3xl">
        <textarea
          id="comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="4"
          placeholder="Add your comment..."
          className="w-full resize-none placeholder-gray-500 text-black rounded-xl border border-gray-700/50 p-4 pr-36 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm"
        ></textarea>

        <div className="absolute right-4 bottom-4">
          <button
            id="postBtn"
            onClick={handlePostBtn}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium shadow-lg transition"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputCard;
