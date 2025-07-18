const socket = io();

const joinBtn = document.getElementById('joinBtn');
const leaveBtn = document.getElementById('leaveBtn');
const usernameInput = document.getElementById('username');
const roomInput = document.getElementById('room');
const setupDiv = document.getElementById('setup');
const gameDiv = document.getElementById('game');
const statusDiv = document.getElementById('status');
const boardDiv = document.getElementById('board');

let room = null;
let username = null;
let myTurn = false;
let symbol = null; // 'X' or 'O'
let board = Array(9).fill(null);

function renderBoard() {
  boardDiv.innerHTML = '';
  board.forEach((cell, idx) => {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    if (!myTurn || cell !== null) cellDiv.classList.add('disabled');
    cellDiv.textContent = cell ? cell : '';
    cellDiv.addEventListener('click', () => {
      if (myTurn && !cell) {
        playTurn(idx);
      }
    });
    boardDiv.appendChild(cellDiv);
  });
}

function playTurn(index) {
  board[index] = symbol;
  renderBoard();
  myTurn = false;
  statusDiv.textContent = "Tour de l'adversaire...";
  socket.emit('playTurn', { index, symbol, room });
}

joinBtn.onclick = () => {
  username = usernameInput.value.trim();
  room = roomInput.value.trim();
  if (!username || !room) {
    alert('Merci de remplir le pseudo et le code de la partie.');
    return;
  }
  socket.emit('joinRoom', { username, room });
};

leaveBtn.onclick = () => {
  location.reload(); // Simple reload pour quitter la partie
};

socket.on('roomFull', () => {
  alert('Cette salle est pleine, veuillez en choisir une autre.');
});

socket.on('startGame', players => {
  if (!players.includes(username)) return;
  setupDiv.style.display = 'none';
  gameDiv.style.display = 'block';
  statusDiv.textContent = 'Partie démarrée !';
  board = Array(9).fill(null);
  symbol = players[0] === username ? 'X' : 'O';
  myTurn = symbol === 'X'; // X commence toujours
  renderBoard();
  if (myTurn) statusDiv.textContent = 'Ton tour !';
  else statusDiv.textContent = "Tour de l'adversaire...";
});

socket.on('opponentPlayed', ({ index, symbol: oppSymbol }) => {
  board[index] = oppSymbol;
  renderBoard();
  myTurn = true;
  statusDiv.textContent = 'Ton tour !';
});

socket.on('opponentLeft', () => {
  alert('Ton adversaire a quitté la partie.');
  location.reload();
});
