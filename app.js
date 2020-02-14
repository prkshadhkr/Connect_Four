/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let currentPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let resetButton = document.getElementById('rst-btn');
resetButton.addEventListener('click', () => location.reload());

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
    // TODO: set "board" to empty HEIGHT x WIDTH matrix array
    for (let y = 0; y < HEIGHT; y++) {
        board.push(Array.from({ length: WIDTH }))
    }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
    const displayBoard = document.querySelector('#board');

    for (let y = 0; y < HEIGHT; y++) {
        const trRow = document.createElement("tr");
        for (let x = 0; x < WIDTH; x++) {
            const tdCol = document.createElement("td");
            tdCol.setAttribute('id', `${y}-${x}`);
            tdCol.classList.add(`player${currentPlayer}`);
            tdCol.addEventListener('click', handleClick);
            trRow.append(tdCol);
        }
        displayBoard.append(trRow);
    }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
    // TODO: write the real version of this, rather than always returning 0
    for (let y = HEIGHT - 1; y >= 0; y--) {
        if (!board[y][x]) {
            return y;
        }
    }
    return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
    // TODO: make a div and insert into correct table cell
    const divMark = document.createElement('div');
    divMark.classList.add('piece', `p${currentPlayer}`); //, `${pxY}px`);
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(divMark);
}

/** endGame: announce game end */

function endGame(msg) {
    alert(msg);
}

function handleClick(e) {
    // retrieve x co-ordinate from id="y-x"
    const idStr = e.target.id;
    const x = Number(idStr.slice(-1));

    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);

    /*following testing to pass --yCoOrdinate to css
    let root = document.documentElement;
    root.style.setProperty('--yCoOrdinate', e.clientY - 450 + "px");
  */

    // place piece in board and add to HTML table
    board[y][x] = currentPlayer;
    placeInTable(y, x);

    // check for win
    if (checkForWin()) {
        return endGame(`Player ${currentPlayer} won!`);
    }

    // check for tie
    if (board.every(row => row.every(col => col))) {
        return endGame('Game Tie!!!!');
    }

    const prevPlayer = currentPlayer;
    // switch players
    currentPlayer = currentPlayer === 1 ? 2 : 1;

    const tdColumnArr = Array.from(document.querySelectorAll('td'));
    tdColumnArr.forEach(column => {
        // switching hover effect on the grids
        column.classList.replace(`player${prevPlayer}`, `player${currentPlayer}`);

        // remove event listener once job done
        if (column.hasChildNodes()) {
            column.removeEventListener('click', handleClick);
        }
    });

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
    // function win(cells) {
    //     // Check four cells to see if they're all color of current player
    //     //  - cells: list of four (y, x) cells
    //     //  - returns true if all are legal coordinates & all match currPlayer


    const win = (cells => cells.every(([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currentPlayer
    ));

    // TODO: read and understand this code. Add comments to help you.

    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const horiz = [
                [y, x],
                [y, x + 1],
                [y, x + 2],
                [y, x + 3]
            ];
            const vert = [
                [y, x],
                [y + 1, x],
                [y + 2, x],
                [y + 3, x]
            ];
            const diagDR = [
                [y, x],
                [y + 1, x + 1],
                [y + 2, x + 2],
                [y + 3, x + 3]
            ];
            const diagDL = [
                [y, x],
                [y + 1, x - 1],
                [y + 2, x - 2],
                [y + 3, x - 3]
            ];

            if (win(horiz) || win(vert) || win(diagDR) || win(diagDL)) {
                return true;
            }
        }
    }
}

makeBoard();
makeHtmlBoard();