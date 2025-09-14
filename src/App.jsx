import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import InputCard from './components/InputCard'
import TasksCard from './components/TasksCard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main >
        <Header />
        <InputCard/>
        <TasksCard/>
      </main>
    </>
  )
}

export default App
