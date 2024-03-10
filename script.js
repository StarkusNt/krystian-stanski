    document.addEventListener('DOMContentLoaded', () => {
      const board = document.getElementById('board');
      const playWithBotButton = document.getElementById('play-with-bot');
      const playWithSecondPersonButton = document.getElementById('play-with-second-person');
      const restartButton = document.getElementById('restart-btn');
      const turnInfo = document.getElementById('turn-info');
      const winnerMessage = document.getElementById('winner-message');
      const modeInfo = document.getElementById('mode-info');

      let currentPlayer = 'X';
      let boardState = ['', '', '', '', '', '', '', '', ''];
      let gameActive = false;
      let isPlayingWithBot = false;
      let previousMode = '';

      // Create the game board
      function createBoard() {
        board.style.display = 'grid'; // Pokaż planszę
        board.innerHTML = ''; // Wyczyść istniejącą planszę
        for (let i = 0; i < 9; i++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.dataset.index = i;
          cell.addEventListener('click', handleCellClick);
          board.appendChild(cell);
        }
        restartButton.disabled = false; // Aktywuj przycisk restart po utworzeniu planszy
      }

      // Handle cell click
      function handleCellClick(event) {
        const clickedCell = event.target;
        const cellIndex = clickedCell.dataset.index;

        if (boardState[cellIndex] === '' && gameActive) {
          boardState[cellIndex] = currentPlayer;
          clickedCell.textContent = currentPlayer;
          
          if (checkWin()) {
            winnerMessage.textContent = `Gracz ${currentPlayer} wygrywa!`;
            gameActive = false;
          } else if (boardState.every(cell => cell !== '')) {
            winnerMessage.textContent = 'Remis!';
            gameActive = false;
          } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            turnInfo.textContent = `Tura gracza ${currentPlayer}`;
            if (isPlayingWithBot && currentPlayer === 'O') {
              makeBotMove();
            }
          }
        }
      }

      // Check for a win
      function checkWin() {
        const winPatterns = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
          [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
          [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winPatterns.some(pattern =>
          pattern.every(index => boardState[index] === currentPlayer)
        );
      }

      // Restart the game
      function restartGame() {
        currentPlayer = 'X';
        boardState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        turnInfo.textContent = 'Tura gracza X';
        winnerMessage.textContent = '';
        createBoard(); // Stwórz nową planszę
      }

      // Make a move for the bot
      function makeBotMove() {
        const emptyCells = boardState.reduce((acc, cell, index) => {
          if (cell === '') acc.push(index);
          return acc;
        }, []);

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const botMove = emptyCells[randomIndex];

        boardState[botMove] = currentPlayer;
        document.querySelector(`.cell[data-index="${botMove}"]`).textContent = currentPlayer;

        if (checkWin()) {
          winnerMessage.textContent = 'Bot wygrywa!';
          gameActive = false;
        } else if (boardState.every(cell => cell !== '')) {
          winnerMessage.textContent = 'Remis!';
          gameActive = false;
        } else {
          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
          turnInfo.textContent = `Tura gracza ${currentPlayer}`;
        }
      }

      // Event listeners
      playWithBotButton.addEventListener('click', () => {
        isPlayingWithBot = true;
        playWithBotButton.classList.add('active');
        playWithSecondPersonButton.classList.remove('active');
        previousMode = 'Graj z botem';
        modeInfo.textContent = `Tryb: ${previousMode}`;
        restartGame();
        if (currentPlayer === 'O' && isPlayingWithBot) {
          makeBotMove();
        }
      });

      playWithSecondPersonButton.addEventListener('click', () => {
        isPlayingWithBot = false;
        playWithSecondPersonButton.classList.add('active');
        playWithBotButton.classList.remove('active');
        previousMode = 'Graj z drugą osobą';
        modeInfo.textContent = `Tryb: ${previousMode}`;
        restartGame();
      });

      restartButton.addEventListener('click', () => {
        if (previousMode) {
          modeInfo.textContent = `Tryb: ${previousMode}`;
        } else {
          modeInfo.textContent = '';
        }
        restartGame();
      });

      // Initial board creation
      // Komentarz, aby plansza była widoczna dopiero po naciśnięciu przycisku
      // createBoard();
    });