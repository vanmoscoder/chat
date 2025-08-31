const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Handle connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // --- Chat Messages ---
  socket.on('chat message', (data) => {
    socket.broadcast.emit('chat message', data);
  });

  socket.on('chat image', (data) => {
    socket.broadcast.emit('chat image', data);
  });

  // --- WebRTC Signaling for Calls ---
  socket.on('call:offer', (data) => {
    socket.broadcast.emit('call:offer', { ...data, from: socket.id });
  });

  socket.on('call:answer', (data) => {
    socket.broadcast.emit('call:answer', data);
  });

  socket.on('call:ice-candidate', (data) => {
    socket.broadcast.emit('call:ice-candidate', data);
  });

  socket.on('call:hangup', () => {
    socket.broadcast.emit('call:hangup');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    socket.broadcast.emit('call:hangup'); // Notify if user leaves mid-call
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
