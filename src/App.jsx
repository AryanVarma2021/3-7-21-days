import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import InputCard from './components/InputCard';
import TasksCard from './components/TasksCard';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  // trigger re-fetch in TasksCard by incrementing the key
  const handleTaskAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <main>
      <Header />
      <InputCard onTaskAdded={handleTaskAdded} />
      <TasksCard refreshKey={refreshKey} />
    </main>
  );
}

export default App;
