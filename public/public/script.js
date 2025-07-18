const socket = io();
let board = [], mySymbol, myTurn = false;

function join() {
  const username = document.getElementById('username').value;
  const room = document.getElementById('room').value;
  socket.emit('joinRoom', { room, username });
}

socket.on('startGame', players => {
  board = Array(9).fill('');
  mySymbol = players[0] === document.getElementById('username').value ? 'X' : 'O';
  myTurn = mySymbol === 'X';
  document.getElementById('setup').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  document.getElementById('status').textContent = myTurn ? "Ton tour" : "Tour de l’adversaire";
  drawBoard();
});

function drawBoard() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  board.forEach((v, i) => {
    const cell = document.createElement('div');
    cell.textContent = v;
    cell.className = 'cell';
    cell.onclick = () => play(i);
    boardEl.appendChild(cell);
  });
}

function play(i) {
  if (!myTurn || board[i]) return;
  board[i] = mySymbol;
  drawBoard();
  myTurn = false;
  document.getElementById('status').textContent = "Tour de l’adversaire";
  socket.emit('playTurn', { index: i, symbol: mySymbol });
}

socket.on('opponentPlayed', ({ index, symbol }) => {
  board[index] = symbol;
  drawBoard();
  myTurn = true;
  document.getElementById('status').textContent = "Ton tour";
});
