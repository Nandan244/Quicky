import React from 'react'
import { useAuthStore } from '../store/authstore.js'

function ChatPage() {

  const { logout } = useAuthStore()
  return (
    <div className='z-10'>
      <button className='btn btn-primary ' onClick={logout}>Logout</button>
    </div>
  )
}

export default ChatPage
