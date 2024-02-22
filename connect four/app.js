const board = document.getElementById('board');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const resultScreenPlayer1 = document.getElementById('result-screen-player1');
const resultMessagePlayer1 = document.getElementById('result-message-player1');
const restartResultButtonPlayer1 = document.getElementById('restartResultButtonPlayer1');
const resultScreenPlayer2 = document.getElementById('result-screen-player2');
const resultMessagePlayer2 = document.getElementById('result-message-player2');
const restartResultButtonPlayer2 = document.getElementById('restartResultButtonPlayer2');

let currentPlayer = '1'; 
let gameBoard = Array.from({ length: 7 }, () => Array(6).fill('')); // 7 columns x 6 rows
let gameActive = true;

function renderBoard() {
  board.innerHTML = '';
  for (let row = 5; row >= 0; row--) {
    for (let col = 0; col < 7; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.column = col;
      cell.dataset.row = row;
      cell.addEventListener('click', handleCellClick);
      updateCellContent(cell, gameBoard[col][row]);
      board.appendChild(cell);
    }
  }
}

function handleCellClick(event) {
  const column = Number(event.target.dataset.column);
  const row = findAvailableRow(column);
  if (row !== -1 && gameActive) {
    gameBoard[column][row] = currentPlayer;
    renderBoard();
    if (checkWinner(column, row)) {
      openResultScreen(`${currentPlayer === '1' ? 'Red' : 'Yellow'} Player Wins!`);
      gameActive = false;
    } else if (isBoardFull()) {
      openResultScreen('It\'s a draw!');
      gameActive = false;
    } else {
      currentPlayer = currentPlayer === '1' ? '2' : '1';
      updateMessage();
    }
  }
}

function findAvailableRow(column) {
  for (let row = 0; row < 6; row++) {
    if (gameBoard[column][row] === '') {
      return row;
    }
  }
  return -1; // Column is full
}

function checkWinner(col, row) {
  const directions = [
    { dx: 1, dy: 0 }, // Horizontal
    { dx: 0, dy: 1 }, // Vertical
    { dx: 1, dy: 1 }, // Diagonal \
    { dx: 1, dy: -1 }, // Diagonal /
  ];

  for (const dir of directions) {
    const count = countConnected(col, row, dir);
    if (count >= 4) {
      return true;
    }
  }

  return false;
}

function countConnected(col, row, dir) {
  const player = gameBoard[col][row];
  let count = 1;

  for (let i = 1; i < 4; i++) {
    const newCol = col + i * dir.dx;
    const newRow = row + i * dir.dy;

    if (
      newCol >= 0 &&
      newCol < 7 &&
      newRow >= 0 &&
      newRow < 6 &&
      gameBoard[newCol][newRow] === player
    ) {
      count++;
    } else {
      break;
    }
  }

  for (let i = 1; i < 4; i++) {
    const newCol = col - i * dir.dx;
    const newRow = row - i * dir.dy;

    if (
      newCol >= 0 &&
      newCol < 7 &&
      newRow >= 0 &&
      newRow < 6 &&
      gameBoard[newCol][newRow] === player
    ) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

function isBoardFull() {
  return gameBoard.every((column) => column.every((cell) => cell !== ''));
}

function openResultScreen(result) {
  const resultScreenPlayer1 = document.getElementById('result-screen-player1');
  const resultMessagePlayer1 = document.getElementById('result-message-player1');
  const restartResultButtonPlayer1 = document.getElementById('restartResultButtonPlayer1');

  const resultScreenPlayer2 = document.getElementById('result-screen-player2');
  const resultMessagePlayer2 = document.getElementById('result-message-player2');
  const restartResultButtonPlayer2 = document.getElementById('restartResultButtonPlayer2');

  if (result.includes('Red')) {
    resultMessagePlayer1.textContent = "Red Player Wins!";
    restartResultButtonPlayer1.addEventListener('click', restartGame);
    resultScreenPlayer1.style.display = 'flex';
  } else if (result.includes('Yellow')) {
    resultMessagePlayer2.textContent = "Yellow Player Wins!";
    restartResultButtonPlayer2.addEventListener('click', restartGame);
    resultScreenPlayer2.style.display = 'flex';
  }
}

function restartGame() {
  currentPlayer = '1';
  gameBoard = Array.from({ length: 7 }, () => Array(6).fill(''));
  gameActive = true;
  renderBoard();
  updateMessage();
  closeResultScreens();
}

function updateMessage() {
  const player1Message = document.getElementById('player1Message');
  const player2Message = document.getElementById('player2Message');

  if (currentPlayer === '1') {
    player1Message.textContent = "Red Player's Turn!";
    player1Message.classList.add('player1');
    player2Message.classList.remove('player2');
  } else {
    player2Message.textContent = "Yellow Player's Turn!";
    player1Message.classList.remove('player1');
    player2Message.classList.add('player2');
  }
}

function closeResultScreens() {
  resultScreenPlayer1.style.display = 'none';
  resultScreenPlayer2.style.display = 'none';
}

function updateCellContent(cell, playerSymbol) {
  cell.innerHTML = playerSymbol === '1' ? '<div class="red-dot"></div>' : playerSymbol === '2' ? '<div class="yellow-dot"></div>' : '';
}

restartButton.addEventListener('click', restartGame);

renderBoard();
updateMessage();
