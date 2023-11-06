document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restart-button');

    let currentPlayer = 'X';
    let gameOver = false;

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (cells[a].innerHTML && cells[a].innerHTML === cells[b].innerHTML && cells[a].innerHTML === cells[c].innerHTML) {
                return cells[a].innerHTML;
            }
        }

        return null;
    }

    function checkDraw() {
        return Array.from(cells).every(cell => cell.innerHTML !== '');
    }

    function handleCellClick(index) {
        if (!gameOver && cells[index].innerHTML === '') {
            cells[index].innerHTML = currentPlayer;

            const winner = checkWinner();
            if (winner) {
                gameOver = true;
                status.innerHTML = `Winner: ${winner}`;
            } else if (checkDraw()) {
                gameOver = true;
                status.innerHTML = 'It\'s a draw!';
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                status.innerHTML = `Current player: ${currentPlayer}`;
                if (currentPlayer === 'O') {
                    setTimeout(computerMove, 500); // Delay for computer move
                }
            }
        }
    }

    function computerMove() {
        if (!gameOver) {
            const bestMove = minimax(cells, currentPlayer).index;
            cells[bestMove].innerHTML = 'O';

            const winner = checkWinner();
            if (winner) {
                gameOver = true;
                status.innerHTML = `Winner: ${winner}`;
            } else if (checkDraw()) {
                gameOver = true;
                status.innerHTML = 'It\'s a draw!';
            } else {
                currentPlayer = 'X';
                status.innerHTML = `Current player: ${currentPlayer}`;
            }
        }
    }

    function minimax(board, player) {
        const emptyCells = Array.from(board).filter(cell => cell.innerHTML === '');
        if (checkWinner(board) === 'X') {
            return { score: -1 };
        } else if (checkWinner(board) === 'O') {
            return { score: 1 };
        } else if (emptyCells.length === 0) {
            return { score: 0 };
        }

        const moves = [];

        for (const cell of emptyCells) {
            const move = {};
            move.index = Array.from(board).indexOf(cell);

            board[move.index].innerHTML = player;
            if (player === 'O') {
                move.score = minimax(board, 'X').score;
            } else {
                move.score = minimax(board, 'O').score;
            }
            board[move.index].innerHTML = '';

            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (const move of moves) {
                if (move.score > bestScore) {
                    bestScore = move.score;
                    bestMove = move;
                }
            }
        } else {
            let bestScore = Infinity;
            for (const move of moves) {
                if (move.score < bestScore) {
                    bestScore = move.score;
                    bestMove = move;
                }
            }
        }

        return bestMove;
    }

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
    });

    restartButton.addEventListener('click', () => {
        cells.forEach(cell => cell.innerHTML = '');
        currentPlayer = 'X';
        gameOver = false;
        status.innerHTML = 'Current player: X';
    });
});
