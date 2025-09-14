import React, { useState, useRef } from "react";
import { createTask } from "../services/taskService";

const InputCard = ({ onTaskAdded }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  // ref to the hidden file input
  const fileInputRef = useRef(null);

  async function handlePostBtn() {
    if (!text.trim()) {
      alert("Please enter some text");
      return;
    }

    await createTask({ text, file });
    setText("");
    setFile(null);
    onTaskAdded?.();
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a PDF file");
    }
  }

  return (
    <div className="flex items-end p-8">
      <div className="relative w-full max-w-3xl">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="4"
          placeholder="Add your comment..."
          className="w-full resize-none placeholder-gray-500 text-black rounded-xl border border-gray-700/50 p-4 pr-36 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm"
        ></textarea>

        {/* Hidden file input */}
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <div className="absolute left-4 bottom-4 flex items-center gap-3 text-gray-400">
          {/* Attach button */}
          <button
            type="button"
            aria-label="Attach file"
            className="p-1 rounded-md hover:bg-white/3 transition"
            onClick={() => fileInputRef.current.click()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.44 11.05l-8.48 8.48a5 5 0 01-7.07-7.07l7.07-7.07a3 3 0 014.24 4.24L8.59 19.59a1 1 0 01-1.41-1.41l8.48-8.48"
              />
            </svg>
          </button>

          {/* Show file name if selected */}
          {file && (
            <span className="text-xs text-gray-600">
              {file.name}
            </span>
          )}
        </div>

        <div className="absolute right-4 bottom-4">
          <button
            id="postBtn"
            onClick={handlePostBtn}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg transition"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputCard;
