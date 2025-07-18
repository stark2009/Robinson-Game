io.on('connection', socket => {
  console.log('Un client est connecté:', socket.id);

  // Juste pour vérifier la connexion
  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});
