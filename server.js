const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const users = {}; // Track connected users

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Register user
  socket.on('register', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('users', Object.values(users));
  });

  // Public message
  socket.on('chat message', (data) => {
    socket.broadcast.emit('chat message', data);
  });

  socket.on('chat image', (data) => {
    socket.broadcast.emit('chat image', data);
  });

  // Private message
  socket.on('private message', (data) => {
    const recipientId = Object.keys(users).find(id => users[id] === data.to);
    if (recipientId) {
      io.to(recipientId).emit('private message', data);
    }
  });

  socket.on('private image', (data) => {
    const recipientId = Object.keys(users).find(id => users[id] === data.to);
    if (recipientId) {
      io.to(recipientId).emit('private image', data);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('users', Object.values(users));
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
