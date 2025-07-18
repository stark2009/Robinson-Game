
const socket = io();

function join() {
  const username = document.getElementById('username').value.trim();
  const room = document.getElementById('room').value.trim();

  if (!username || !room) {
    alert('Veuillez saisir un pseudo et un code de partie.');
    return;
  }

  socket.emit('joinRoom', { room, username });
  
  // Masquer la configuration, afficher le jeu
  document.getElementById('setup').style.display = 'none';
  document.getElementById('game').style.display = 'block';
}

// Écoute les événements du serveur
socket.on('roomFull', () => {
  alert('Cette salle est pleine. Choisissez un autre code.');
  document.getElementById('setup').style.display = 'block';
  document.getElementById('game').style.display = 'none';
});

socket.on('startGame', players => {
  document.getElementById('status').textContent = 'Joueurs : ' + players.join(' vs ');
  // Ici tu peux initialiser le plateau, etc.
});

socket.on('opponentPlayed', data => {
  // Met à jour le jeu avec le coup de l’adversaire
});

socket.on('opponentLeft', () => {
  alert('Ton adversaire a quitté la partie.');
  // Retour à l’écran d’accueil ou gestion autre
});
