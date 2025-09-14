import React from 'react'
import { createTask } from '../services/taskService'



const InputCard = () => {
  const [text, setText] = React.useState("")
  async function handlePostBtn () {

    if(text.length === 0 || text === "" || text === null) {
      alert("Please enter some text")
      return 
    }


    const res = await createTask({text})
    
    


  }
  return (
   <div class=" flex items-end  p-8">

  <div class="relative w-full max-w-3xl">
    
    <textarea
      id="comment"
      onChange={(e) => {setText(e.target.value)}}
      rows="4"
      placeholder="Add your comment..."
      class="w-full resize-none  placeholder-gray-500 text-black rounded-xl border border-gray-700/50 p-4 pr-36 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm"
      aria-label="Add your comment"
    ></textarea>

   
    <div class="absolute left-4 bottom-4 flex items-center gap-3 text-gray-400">
   
      <button  type="button" aria-label="Attach file" class="p-1 rounded-md hover:bg-white/3 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.44 11.05l-8.48 8.48a5 5 0 01-7.07-7.07l7.07-7.07a3 3 0 014.24 4.24L8.59 19.59a1 1 0 01-1.41-1.41l8.48-8.48" />
        </svg>
      </button>

     
      <button type="button" aria-label="Add emoji" class="p-1 rounded-md hover:bg-white/3 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-3.5 8a1 1 0 110 2 1 1 0 010-2zm7 0a1 1 0 110 2 1 1 0 010-2zM12 17.5a5.5 5.5 0 01-4.47-2.23.75.75 0 011.14-.96A4 4 0 0012 16a4 4 0 003.33-1.69.75.75 0 011.14.96A5.5 5.5 0 0112 17.5z"/>
        </svg>
      </button>
    </div>


    <div class="absolute right-4 bottom-4">
      <button
        id="postBtn"
        onClick={handlePostBtn}
        class="inline-flex items-center justify-center rounded-md px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium shadow-lg transition"
        aria-disabled="true"
      >
        Post
      </button>
    </div>
  </div>
</div>
  )
}

export default InputCard