const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send text message to others only
  socket.on('chat message', (data) => {
    socket.broadcast.emit('chat message', data); // Not back to self
  });

  // Send image to others only
  socket.on('chat image', (data) => {
    socket.broadcast.emit('chat image', data); // Not back to self
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
