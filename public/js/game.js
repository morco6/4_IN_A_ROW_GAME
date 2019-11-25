class game {

    constructor() {
        this.HEIGHT = 6; // rows
        this.WIDTH = 7; // columns
        this.FOUR = 4; // for in a row
        this.turn = 0; // 0: player1, 1: player2
        this.empty_cells = this.HEIGHT * this.WIDTH; // count empty cells to (0 - DRAW!)
        this.matrix = []; // game board
        this.initGame(); // initialize the game
        this.fourConnected = 0; // counter to check winner  
    }


    /**
     * @description Initialize the game: 
     * matrix (game board) (initialize to -1).
     * an array which stores the last inserted row for each turn (start from -1).
     * two players (propertys: name and color).
     */
    initGame() {
        this.last_inserted = Array(this.WIDTH).fill(-1);
        this.players = [{ name: "Player1", color: "yellow" }, { name: "Player2", color: "red" }];
        for (let y = 0; y < this.HEIGHT; y++) {
            let arr = new Array(this.WIDTH);
            for (let x = 0; x < this.WIDTH; x++)
                arr[x] = -1;
            this.matrix.push(arr);
        }
        this.initDOMboard();
    }


    /**
     * @param {Number} col - represent the current index column.
     * @description activate by click event and responsible about move of the opponent. 
     */
    playTurn(col) {
        if (this.insert_token_into_matrix(col))
            this.updateDOM(this.last_inserted[col], col);
    }


    /**
     * @param {Number} col - represent the current index column.
     * @description - Insert a new token to the bottom of the game board.
     */
    insert_token_into_matrix(col) {
        if (this.last_inserted[col] < this.HEIGHT) {
            this.last_inserted[col]++;
            this.matrix[this.last_inserted[col]][col] = this.turn;
            this.empty_cells--;
            return true;
        }
        return false;
    }


    /**
     * @param {Number} row - represent the current index row.
     * @param {Number} col - represent the current index column.
     * @description response for the interaction between the pc to the user. It tells the user
     * about the current state.
     */
    updateDOM(row, col) {
        let cell = document.getElementById(col + ',' + row);
        cell.style.backgroundColor = this.players[this.turn].color;
        this.win(row, col) ? setTimeout(() => {
                alert("GAME-OVER : The winner is" + this.players[this.turn].name);
                location.reload();
            }, 100) :
            this.empty_cells == 0 ? alert("GAME-OVER : Draw!") :
            this.changeTurn();
    }


    /**
     * @description it response to switch turns between players, at the end of each turn.
     */
    changeTurn() {
        this.turn == 0 ? this.turn = 1 : this.turn = 0;
        document.getElementById("playerTurn").innerText = this.players[this.turn].name;
    }


    /**
     * @param {Number} row - represent the current index row.
     * @param {Number} col - represent the current index column.
     * @description manage calls to "checkWin" method.
     */
    win(row, col) {
        return this.checkWin(row, col, "vertical") ? true :
            this.checkWin(row, col, "horizontal") ? true :
            this.checkWin(row, col, "diagonalUp") ? true :
            this.checkWin(row, col, "diagonalDown") ? true : false;
    }


    /**
     * 
     * @param {Number} row - represent the current index row.
     * @param {Number} col - represent the current index column.
     * @param {String} key - distinguish between actions to find a winner. 
     */
    checkWin(row, col, key) {
        this.fourConnected++;
        for (let i = 1; i < this.FOUR; i++) {

            if (key == "vertical") {
                if (row + i < this.HEIGHT && this.matrix[row + i][col] == this.turn) this.fourConnected++;
                if (row - i >= 0 && this.matrix[row - i][col] == this.turn) this.fourConnected++;

            } else if (key == "horizontal") {
                if (col + i < this.WIDTH && this.matrix[row][col + i] == this.turn) this.fourConnected++;
                if (col - i >= 0 && this.matrix[row][col - i] == this.turn) this.fourConnected++;

            } else if (key == "diagonalUp") {
                if (row - i >= 0 && col - i >= 0 && this.matrix[row - i][col - i] == this.turn) this.fourConnected++;
                if (row + i < this.HEIGHT && col + i < this.WIDTH && this.matrix[row + i][col + i] == this.turn) this.fourConnected++;

            } else if (key == "diagonalDown") {
                if (row + i < this.HEIGHT && col - i >= 0 && this.matrix[row + i][col - i] == this.turn) this.fourConnected++;
                if (row - i >= 0 && col + i < this.WIDTH && this.matrix[row - i][col + i] == this.turn) this.fourConnected++;

            }
            if (this.fourConnected == this.FOUR) return true;
        }
        this.fourConnected = 0;
        return false;
    }


    /**
     * @description Build the graphic game board at the client side, and excute changes on the DOM.
     */
    initDOMboard() {
        let matrixDOM = document.createElement("div");
        matrixDOM.id = "grid-table";
        matrixDOM.className = "wrapper shadow";

        for (let x = this.WIDTH - 1; x >= 0; x--) {

            let col_element = document.createElement("div");
            col_element.id = x;

            for (let y = 0; y < this.HEIGHT; y++) {
                let row_element = document.createElement("div");
                row_element.id = x + ',' + y;
                col_element.appendChild(row_element);
            }
            matrixDOM.appendChild(col_element);
        }

        document.getElementById("section").appendChild(matrixDOM);
        matrixDOM.addEventListener("click", e => this.playTurn(parseInt(event.path[1].id)), false);

    }


}


new game();