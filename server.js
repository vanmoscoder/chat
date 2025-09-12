const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Global state
let users = []; // All users who ever joined
let groups = {}; // { groupId: { name, members: [] } }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // When a user joins
  socket.on('user joined', (data) => {
    const { username } = data;
    if (!users.includes(username)) {
      users.push(username);
    }
    // Broadcast to everyone that a user joined
    io.emit('user joined', { username });
  });

  // Send message to group or general
  socket.on('chat message', (data) => {
    const { user, message, reply, groupId } = data;
    if (groupId) {
      // If it's a group message, broadcast only to group members
      const group = groups[groupId];
      if (group && group.members.includes(user)) {
        io.emit('chat message', { user, message, reply, groupId });
      }
    } else {
      // General chat — broadcast to all
      io.emit('chat message', { user, message, reply });
    }
  });

  // Send image to group or general
  socket.on('chat image', (data) => {
    const { user, image, reply, caption, groupId } = data;
    if (groupId) {
      const group = groups[groupId];
      if (group && group.members.includes(user)) {
        io.emit('chat image', { user, image, reply, caption, groupId });
      }
    } else {
      io.emit('chat image', { user, image, reply, caption });
    }
  });

  // Delete message
  socket.on('delete message', (data) => {
    const { messageId } = data;
    io.emit('message deleted', { messageId });
  });

  // Create group
  socket.on('create group', (data) => {
    const { name, members } = data;
    const groupId = Date.now().toString();
    groups[groupId] = {
      name,
      members,
      createdAt: Date.now()
    };
    // Notify everyone of new group
    io.emit('group created', { groupId, name, members });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
