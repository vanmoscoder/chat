const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// When a user connects
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When they send a message
  socket.on('chat message', (msg) => {
    console.log('Message from', socket.id, ':', msg);
    // Broadcast to everyone *else* (not back to self)
    socket.broadcast.emit('chat message', msg);
  });

  // When they disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
