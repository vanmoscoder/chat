const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Track connected users
const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins
  socket.on('user joined', (data) => {
    const oldUsername = users.get(socket.id);
    if (oldUsername) {
      users.delete(oldUsername);
    }
    users.set(socket.id, data.username);
    console.log(`${data.username} joined`);

    // Broadcast to others
    io.emit('user joined', { username: data.username });
  });

  // User disconnects
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      console.log(`${username} left`);
      users.delete(socket.id);
      io.emit('user left', username);
    }
  });

  // Text message
  socket.on('chat message', (data) => {
    socket.broadcast.emit('chat message', data);
  });

  // Image message
  socket.on('chat image', (data) => {
    socket.broadcast.emit('chat image', data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
