const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);
const PORT = process.env.PORT || 3000;

const rooms = {};

app.use(express.static('public'));

io.on('connection', socket => {
  socket.on('joinRoom', ({ room, username }) => {
    if (!rooms[room]) rooms[room] = [];
    if (rooms[room].length >= 2) {
      socket.emit('roomFull');
      return;
    }
    rooms[room].push({ id: socket.id, name: username });
    socket.join(room);
    io.to(room).emit('startGame', rooms[room].map(p => p.name));
    socket.on('playTurn', data => socket.to(room).emit('opponentPlayed', data));
    socket.on('disconnect', () => {
      rooms[room] = rooms[room].filter(p => p.id !== socket.id);
      socket.to(room).emit('opponentLeft');
      if (rooms[room].length === 0) delete rooms[room];
    });
  });
});

http.listen(PORT, () => console.log(`Running on port ${PORT}`));
