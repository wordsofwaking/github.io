/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7; //X
const HEIGHT = 6; //Y

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x]) x=width and y=height

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
for (let x = 0; x < HEIGHT; x++) {
  board[x] = new Array(WIDTH);
  board[x].fill(); //The fill() method changes all elements in an array to a static value, from a start index (default 0) to an end index (default array.length). It returns the modified array. Copied from MDN
  }
  return board;
}
  // return board = [[HEIGHT][WIDTH]];
  // [
  //   [ null, null, null, null, null, null, null ],
  //   [ null, null, null, null, null, null, null ],
  //   [ null, null, null, null, null, null, null ],
  //   [ null, null, null, null, null, null, null ],
  //   [ null, null, null, null, null, null, null ],
  //   [ null, null, null, null, null, null, null ],
  // ]; }

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
const htmlBoard = document.getElementById('board');
  // TODO: add comment for this code
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
// this is adding the very top row to the board game and giving these an id of "column-top."  These cells have an event listener of "click" added to them to activate the functions toward the bottom everytime there is a click event.
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
} //Standard nested for loops.  Everytime first loop runs through 1 row, 2nd loop runs through all columns in that row.  These loops are creating the individual "cells" within the table one at a time and giving them all an id of "y-x" which correlates with its place in the table.  After the loop has fully completed it is appending to the html boards rows.

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
  // return 0;

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement("div");
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);

  const place = document.getElementById(`${y}-${x}`);
  place.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);
  // makeHtmlBoard.update();
  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }
   // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (checkForTie()){
    return endGame("Tie Game, try again");
  }
 
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1; //ternary operator truthy else falsey
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
} //This is running a nested for loop again as commented on function makeHtmlBoard().  Same logic as the above in how it searches the board for identifiers based on an x,y coordinate.  It is seeking for 3 in a row horizontally, then vertically, then diagnolly right, then last diagnolly left.  This function runs after every move as does function checkForTie().  The logic say if any of the mentioned ring true using logical operator OR (||) then return true which executes above win function and ends the game.

function checkForTie() {
  let tied = board.every((row) => {
    return row.every((cell) => cell === 1 || cell === 2 ? true : false);
  });
  if (tied) return true;
} //The every() method tests whether all elements in the array pass the test implemented by the provided function. It returns a Boolean value.  Row = tr, Cell = td with ID of X, Y
// First try at function checkForTie(){
//   function _tie(cells) {
//     // Check four cells to see if they're all color of current player
//     //  - cells: list of four (y, x) cells
//     //  - returns true if all are legal coordinates & all match currPlayer

//     return cells.every(
//       ([y, x]) =>
//         y >= 0 &&
//         y < HEIGHT &&
//         x >= 0 &&
//         x < WIDTH &&
//         board[y][x] === currPlayer
//     );
//   }

//   for (let y = 0; y < HEIGHT; y++) {
//     for (let x = 0; x < WIDTH; x++) {
//       const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3], [y, x + 4], [y, x + 5], [y, x + 6]];
//       const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x],[y + 4, x], [y + 5, x]];
//       if (_tie(horiz) && _tie(vert)) {
//         return true;
//       }
//     }
//   }
// }

makeBoard();
makeHtmlBoard();
