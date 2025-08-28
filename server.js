const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Track who is typing
const typingUsers = new Set();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // When user starts typing
  socket.on('typing', (username) => {
    if (username) {
      typingUsers.add(username);
      socket.broadcast.emit('update typing', Array.from(typingUsers));
    }
  });

  // When user stops typing
  socket.on('stop typing', (username) => {
    if (username) {
      typingUsers.delete(username);
      socket.broadcast.emit('update typing', Array.from(typingUsers));
    }
  });

  // Chat message
  socket.on('chat message', (data) => {
    io.emit('chat message', data); // Send to everyone
  });

  // On disconnect
  socket.on('disconnect', () => {
    // Remove user from typing list if they disconnect
    for (let user of typingUsers) {
      if (user.includes(socket.id) || user === /* you can't know username here, so client handles */ ) {
        // We’ll clean up on frontend
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
