
function App(firstName, secondName) {

    function Player(name) {

        let score = 0

        const addScore = () => score++
        const getScore = () => score
        const removeScore = () => score = 0

        return { name, addScore, getScore, removeScore }
    }

    function Board() {

        let board = [
            [false, false, false],
            [false, false, false],
            [false, false, false]
        ]

        function setBoard(player, isFirstPlayer, coordinateX, coordinateY) {
            if (isFirstPlayer && board [coordinateY][coordinateX] === false) {
                board[coordinateY][coordinateX] = 'X'
            } else if (!isFirstPlayer && board [coordinateY][coordinateX] === false) {
                board[coordinateY][coordinateX] = 'O'
            }
        }

        function clearBoard() {
            board = board.map(row => row.map(cell => cell = false))
        }

        function checkBoard(boardObj, player) {
            const board = boardObj.getBoard()
            console.log(board)

            // check rows
            if (board.some(row => (row.every(cell => cell === 'X') || row.every(cell => cell === 'O')))) {
                    Round.endRound(player)
                    return
                }

            // check columns
            for (let i = 0; i <= 2; i++) {
                if ((board[0][i] === 'X' && board[1][i] === 'X' && board[2][i] === 'X')
                    || (board[0][i] === 'O' && board[1][i] === 'O' && board[2][i] === 'O')) {
                    Round.endRound(player)
                    return
                }
            }

            // check diagonals
            if ((board[0][0] === 'X' && board[1][1] === 'X' && board[2][2] === 'X')
                || (board[0][0] === 'O' && board[1][1] === 'O' && board[2][2] === 'O')) {
                Round.endRound(player)
                return
            }

            if ((board[0][2] === 'X' && board[1][1] === 'X' && board[2][0] === 'X')
                || (board[0][2] === 'O' && board[1][1] === 'O' && board[2][0] === 'O')) {
                Round.endRound(player)
                return
            }

            // draw
            if (board.every(row => row.every(cell => cell != false))) {
                Round.endRound('draw')
                return
            }
        }

        const getBoard = () => { return board }

        return { setBoard, getBoard, clearBoard, checkBoard }
    }

    function Game(firstPlayerName, secondPlayerName) {
        let isRoundOver = false
        let isFirstPlayer = true

        const firstPlayer = Player(firstPlayerName);
        const secondPlayer = Player(secondPlayerName);
        const getCurrentPlayer = () => (isFirstPlayer ? firstPlayer : secondPlayer);

        const board = Board()
    
        const step = (coordinateX, coordinateY) => {
            if (isRoundOver) return

            const currentPlayer = getCurrentPlayer();
            board.setBoard(currentPlayer, isFirstPlayer, coordinateX, coordinateY);
            board.checkBoard(board, currentPlayer);
                        
            isFirstPlayer = !isFirstPlayer
            displayGame(board, null, firstPlayer, secondPlayer, isFirstPlayer, isRoundOver)
        }

        const endRound = (winner = 'draw') => {
            isRoundOver = true; 
            winner != 'draw' ? winner.addScore() : winner
            displayGame(board, winner, firstPlayer, secondPlayer, isFirstPlayer, isRoundOver);
        }

        const startRound = () => {           
            board.clearBoard()
            isRoundOver = false
            isFirstPlayer = true
            displayGame(board, null, firstPlayer, secondPlayer, isFirstPlayer, isRoundOver)
        }

        return { step, endRound, startRound }
    }
   
    function displayGame(board, winner, firstPlayer, secondPlayer, isFirstPlayer, isRoundOver) {
        const boardData = board.getBoard()
        let currentIndex = 0;

        const cells = document.querySelectorAll(".cell")

        const container = createContainer();
        const gameField = createGameField(boardData);
        const results = createResultsBlock()
        const button = createNewRoundButton()
        container.append(gameField, results, button);

        function createContainer() {
            const container = document.querySelector(".game-container")
            container.textContent = ''
            return container
        }

        function createGameField(boardData) {
            const gameField = document.createElement('div');
            gameField.className = 'gameField';

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const cell = document.createElement("div");
                    cell.classList = `cell ${j}${i}`;
                    cell.textContent = boardData[i][j] ? boardData[i][j] : '';
                    gameField.appendChild(cell);
                }
            }
            return gameField;
        }

        function createResultsBlock() {
            const results = document.createElement('div');
            results.className = 'result';
            results.textContent = '...';
            return results;
        }

        function createNewRoundButton() {
            const button = document.createElement('button')
            button.textContent = 'New round'
            button.addEventListener('click', () => {
                Round.startRound()
            })
            return button
        }

        function updateCell(cell, value) {
            cell.textContent = value;
        }

        function handleClick(cell) {
            let row = cell.className[5]
            let col = cell.className[6]

            if (isFirstPlayer && !boardData[col][row]) {
                Round.step(row, col)
                updateCell(cell, "X")
            } else if (!isFirstPlayer && !boardData[col][row]) {                
                Round.step(row, col)
                updateCell(cell, "O")
            }
        }

        if (isRoundOver === false) {
            cells.forEach(cell => cell.addEventListener('click', () => handleClick(cell)))
        } if (isRoundOver) {
            cells.forEach(cell => cell.removeEventListener('click', () => handleClick(cell)))
            if (winner != "draw") {
                let text = `${winner.name} win. Score: ${`${firstPlayer.getScore()} : ${secondPlayer.getScore()}`}`
                showNextLetter(results, text)
            } else {
                let text = `It's a draw.`
                showNextLetter(results, text)
            }
        }

        function showNextLetter(resultDiv, text) {
            if (currentIndex < text.length) {
                resultDiv.textContent += text[currentIndex];
                currentIndex++;
                setTimeout(() => showNextLetter(resultDiv, text), 100);
            }
        }
    } 

    const Round = Game(firstName, secondName)
    Round.startRound()    
}

function getNames(callback) {
    const gameContainer = document.querySelector(".game-container")

    const firstContainer = document.createElement('div'); 
    firstContainer.className = 'input-container'
    const label = document.createElement('label');
    label.setAttribute('for', 'first-player'); // ??????
    label.textContent = 'Player 1';
    const firstInput = document.createElement('input');
    firstInput.className = 'name-input';
    firstInput.type = 'text';
    firstInput.id = 'first-player';
    firstInput.required = true;
    firstInput.maxLength = 10

    firstContainer.appendChild(label);
    firstContainer.appendChild(firstInput);
    gameContainer.appendChild(firstContainer);  

    const secondContainer = document.createElement('div');  
    secondContainer.className = 'input-container'
    const labelSecond = document.createElement('label');
    labelSecond.setAttribute('for', 'second-player'); // ??????
    labelSecond.textContent = 'Player 2';
    const secondInput = document.createElement('input');
    secondInput.className = 'name-input';
    secondInput.type = 'text';
    secondInput.id = 'second-player';
    secondInput.required = true;
    secondInput.maxLength = 10


    secondContainer.appendChild(labelSecond);
    secondContainer.appendChild(secondInput);
    gameContainer.appendChild(secondContainer); 


    const button = document.createElement('button')
    button.className = 'name-button'
    button.textContent = 'Start'
    gameContainer.appendChild(button)   

    button.addEventListener('click', () => {
        if (!firstInput.value || !secondInput.value) {
            alert('Both fields are required!');
            return;
        }
        
        let firstName = firstInput.value 
        let secondName = secondInput.value

        callback(firstName, secondName)
    })

}

getNames((firstName, secondName) => {
     App(firstName, secondName)
})