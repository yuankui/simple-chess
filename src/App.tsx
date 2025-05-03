import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface WelcomeData {
  message: string;
}

interface MessageData {
  user: string;
  text: string;
}

function App() {
  const [count, setCount] = useState(0)
  const [messages, setMessages] = useState<string[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Create socket connection
    socketRef.current = io('http://localhost:3000')
    
    // Set up event listeners
    socketRef.current.on('connect', () => {
      console.log('Connected to server')
      setConnected(true)
    })
    
    socketRef.current.on('welcome', (data: WelcomeData) => {
      setMessages(prev => [...prev, `Server: ${data.message}`])
    })
    
    socketRef.current.on('message', (data: MessageData) => {
      setMessages(prev => [...prev, `${data.user}: ${data.text}`])
    })
    
    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server')
      setConnected(false)
    })
    
    // Clean up on unmount
    return () => {
      socketRef.current?.disconnect()
    }
  }, [])
  
  const sendMessage = () => {
    if (inputMessage.trim() && socketRef.current) {
      const messageData: MessageData = {
        user: 'You',
        text: inputMessage
      }
      socketRef.current.emit('message', messageData)
      setInputMessage('')
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Socket.IO</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      
      <div className="socket-demo">
        <h2>Socket.IO Demo</h2>
        <div className="connection-status">
          Status: {connected ? '✅ Connected' : '❌ Disconnected'}
        </div>
        
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">{msg}</div>
          ))}
        </div>
        
        <div className="message-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            disabled={!connected}
          />
          <button onClick={sendMessage} disabled={!connected}>Send</button>
        </div>
      </div>
      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
