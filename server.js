const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from 'public' folder
app.use(express.static('public'));

// Handle new connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle text message
  socket.on('chat message', (data) => {
    // Broadcast to everyone except sender
    socket.broadcast.emit('chat message', data);
  });

  // Handle image message (with optional caption)
  socket.on('chat image', (data) => {
    // Broadcast to everyone except sender
    socket.broadcast.emit('chat image', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
