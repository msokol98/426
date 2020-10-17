class Game {
    
    constructor(dimension) {
        this.dimension = dimension;
        this.setupNewGame()
    }

    setupNewGame() {
        const board  = this.blankGrid();
        this.addNumber(board);
        this.addNumber(board);

        this.gameState = {
            board: this.convertTo1D(board),
            score: 0,
            won: false,
            over: false
        }
    }

    loadGame(gameState) {
        this.gameState = gameState;
    }

    addNumber(board) {
        const openings = [], { dimension } = this;

        for (let i = 0; i < dimension; i++) {
            for (let j = 0; j < dimension; j++) {
                if (board[i][j] === 0) 
                    openings.push({col: i, row: j});
                
            }
        }

        if(openings.length === 0)
            return;

        const target = openings[this.getRandomArrayIndex(openings)];
        board[target.col][target.row] = this.getRandomNumber();
    }

    move(direction) {

        if(!direction)
            return;

        let turned = false, transposed = false, notArrowKey = false;
        let board = this.convertTo2D(this.gameState.board);

        switch(direction) {
            case 'up':
                board = this.turnBoard(board);
                turned = true;
                break;
            case 'left':
                board  = this.transposeBoard(board);
                board = this.turnBoard(board);
                turned = true;
                transposed = true;
                break;
            case 'right':
                board = this.transposeBoard(board);
                transposed = true;
                break;
            default: notArrowKey = direction !== 'down';
        }

        if(notArrowKey)
            return;

        const copy = this.duplicate(board);

        for(let i = 0; i < this.dimension; i++) 
            board[i] = this.handle(board[i]);

        const different = this.isDifferent(copy, board);

        if(turned)
            board = this.turnBoard(board);
        
        if(transposed)
            board = this.transposeBoard(board);

        if(different)
            this.addNumber(board);

        
        this.gameState.over = this.isGameOver(board);
        this.gameState.won = this.isGameWon(board);

        if(this.gameState.won && this.winCallback)
            this.winCallback(this.gameState);
        else if(!this.gameState.won && this.gameState.over && this.loseCallback)
            this.loseCallback(this.gameState);
        
        this.gameState.board = this.convertTo1D(board);
        this.moveCallback && this.moveCallback(this.gameState);
    }

    handle(row) {
        return this.translate(this.merge(this.translate(row)));
    }

    getRandomNumber = () => Math.random() > .1 ? 2 : 4;
    getRandomArrayIndex = arr => Math.floor(arr.length * Math.random());

    blankGrid() {
        const grid = [], { dimension } = this;
        for(let i = 0; i < dimension; i++) {
            grid.push(Array(dimension).fill(0));
        }
        return grid;
    }

    convertTo2D(board) {
        const board2D = this.blankGrid();
        board.forEach((value, idx) => board2D[Math.floor(idx % this.dimension)][Math.floor(idx / this.dimension)] = value);
        return board2D;
    }

    convertTo1D(board) {
        const { dimension } = this, board1D = Array(dimension*dimension).fill(0);

        let counter = 0;

        for(let row = 0; row < dimension; row++) {
            for(let col = 0; col < dimension; col++) {
                board1D[counter++] = board[col][row];
            }
        }
        return board1D;
    }

    duplicate(board) {
        const { dimension } = this, copy = this.blankGrid();

        for (let col = 0; col < dimension; col++) {
            for (let row = 0; row < dimension; row++) {
                copy[col][row] = board[col][row];
            }
        }

        return copy;
    }

    isDifferent(arr1, arr2) {
        const { dimension } = this;
        for (let i = 0; i < dimension; i++) {
            for (let j = 0; j < dimension; j++) {
                if (arr1[i][j] !== arr2[i][j]) 
                    return true;
            }
        }
        return false;
    }

    translate(row) {
        const rowNumbers = row.filter(number => number);
        const empties = Array(this.dimension-rowNumbers.length).fill(0);
        return empties.concat(rowNumbers);
    }

    merge(row) {
        for (let i = this.dimension-1; i >= 1; i--) {
            const val1 = row[i];
            const val2 = row[i-1];

            if (val1 === val2) {
                const combinedValue = val1 + val2;
                row[i] = combinedValue;
                this.gameState.score += combinedValue;
                row[i-1] = 0;
            }
        }
        return row;
    }

    turnBoard(board) {
        for(let i = 0; i < this.dimension; i++) 
            board[i].reverse();
        return board;
    }

    transposeBoard(board) {
        const transposedBoard = this.blankGrid(), { dimension } = this;

        for (let col = 0; col < dimension; col++) {
            for (let row = 0; row < dimension; row++) {
                transposedBoard[col][row] = board[row][col];
            }
        }
        
        return transposedBoard;
    }

    isGameWon = board => {
        const { dimension } = this;

        for (let i = 0; i < dimension; i++) {
          for (let j = 0; j < dimension; j++) {
            if (board[i][j] === 2048) {
              return true;
            }
          }
        }
        return false;
    }

    isGameOver = board => {

        const { dimension } = this;

        for (let col = 0; col < dimension; col++) {
            for (let row = 0; row < dimension; row++) {
                
                if ((board[col][row] === 0) || (col !== dimension-1 && board[col][row] === board[col + 1][row]) 
                        || (row !== dimension-1 && board[col][row] === board[col][row + 1])) 
                    return false;
            
            }
        }
        return true;
    }

    getGameState() {
        return this.gameState;
    }

    toString() {
        const board = this.convertTo2D(this.gameState.board), { dimension } = this;
        for(let i = 0; i < dimension; i++) {
            console.log(board[i]);
        }
    }

    onMove = callback => this.moveCallback = callback;
    onWin = callback => this.winCallback = callback;
    onLose = callback => this.loseCallback = callback;

}

export default Game;