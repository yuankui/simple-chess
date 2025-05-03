import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';


const app = express();

interface MessageData {
  user: string;
  text: string;
}

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Vite's default port
    methods: ["GET", "POST"]
  }
});


// Socket.io connection handler
io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  
  // Send a welcome message when a user connects
  socket.emit('welcome', { message: 'Welcome to the server!' });
  
  // Listen for messages from the client
  socket.on('message', (data: MessageData) => {
    console.log('Message received:', data);
    // Broadcast the message to all connected clients
    io.emit('message', data);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});