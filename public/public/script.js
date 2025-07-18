const socket = io();

socket.on('connect', () => {
  console.log('Connecté au serveur avec ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Déconnecté du serveur');
});

document.getElementById('joinBtn').addEventListener('click', () => {
  console.log('Bouton rejoint cliqué');

  const username = document.getElementById('username').value.trim();
  const room = document.getElementById('room').value.trim();

  if (!username || !room) {
    alert('Merci de remplir pseudo et code de partie.');
    return;
  }

  console.log(`Envoi joinRoom: username=${username}, room=${room}`);
  socket.emit('joinRoom', { username, room });
});
