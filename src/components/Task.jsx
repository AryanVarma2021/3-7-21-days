const Task = ({ task, onDone }) => {
  const handleDownload = () => {
    if (task.file) {
      const url = URL.createObjectURL(task.file);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${task.text || "task"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex justify-between border p-2 items-center">
      <div>
        <h1>{task.text}</h1>
        <p>{new Date(task.dueDate).toDateString()}</p>
        {task.file && (
          <button
            onClick={handleDownload}
            className="text-sm text-blue-600 underline"
          >
            Download PDF
          </button>
        )}
      </div>
      <button
        onClick={() => onDone(task.id)}
        className="bg-green-500 text-white px-2 py-1 rounded"
      >
        Done
      </button>
    </div>
  );
};

export default Task;
