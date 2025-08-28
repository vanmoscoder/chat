const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Track connected users (optional, for future use)
const connectedUsers = new Set();

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // When a user sends their username upon joining
  socket.on('user joined', (username) => {
    socket.username = username; // Store username in socket
    connectedUsers.add(username);
    // Broadcast to others
    socket.broadcast.emit('system message', `${username} joined the chat`);
  });

  // When a user sends a chat message
  socket.on('chat message', (data) => {
    // Send to everyone (including sender, but we handle UI cleanly)
    io.emit('chat message', data);
  });

  // When user disconnects
  socket.on('disconnect', () => {
    if (socket.username) {
      console.log('User disconnected:', socket.username);
      connectedUsers.delete(socket.username);
      // Tell others
      socket.broadcast.emit('system message', `${socket.username} left the chat`);
    } else {
      console.log('Anonymous user disconnected');
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
