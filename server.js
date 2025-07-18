const socket = io();

document.getElementById('joinBtn').addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  const room = document.getElementById('room').value.trim();

  if (!username || !room) {
    alert('Merci de remplir le pseudo et le code de la partie.');
    return;
  }

  socket.emit('joinRoom', { username, room });
  alert(`Demande de rejoindre la salle ${room} envoyée.`);
});
io.on('connection', socket => {
  console.log('Un joueur s’est connecté:', socket.id);

  socket.on('joinRoom', ({ room, username }) => {
    console.log(`Requête joinRoom reçue: pseudo=${username}, room=${room}`);

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
      console.log(`Déconnexion de ${socket.id}`);
      rooms[room] = rooms[room].filter(p => p.id !== socket.id);
      socket.to(room).emit('opponentLeft');
      if (rooms[room].length === 0) delete rooms[room];
    });
  });
});
      
