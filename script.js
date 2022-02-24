const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

let firstPick = null;
let secondPick = null;
let flippedCards = 0;
let notClicked = false;
const restart = document.getElementById('restartBtn');

//FISHER YATES FUNCTION
function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledColors = shuffle(COLORS);

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add(color);
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  if (notClicked) return;
  if (event.target.classList.contains('flipped')) return;

  let newCol = event.target;
  newCol.style.backgroundColor = newCol.classList[0];

  if (!firstPick || !secondPick) {
    newCol.classList.add('flipped');
    firstPick = firstPick || newCol;
    //boolean statement ? true result : false result;
    secondPick = newCol === firstPick ? null : newCol;
  }

  if (firstPick && secondPick) {
    notClicked = true;
    let pic1 = firstPick.className;
    let pic2 = secondPick.className;

    if (pic1 === pic2) {
      flippedCards += 2;
      firstPick.removeEventListener('click', handleCardClick);
      secondPick.removeEventListener('click', handleCardClick);
      firstPick = null;
      secondPick = null;
      notClicked = false;
    } else {
      setTimeout(function() {
        firstPick.style.backgroundColor = '';
        secondPick.style.backgroundColor = '';
        firstPick.classList.remove('flipped');
        secondPick.classList.remove('flipped');
        firstPick = null;
        secondPick = null;
        notClicked = false;
      }, 1000);
    }
  }

  if (flippedCards === COLORS.length) alert('You did it, Game Over!');
}

// when the DOM loads
createDivsForColors(shuffledColors);

restart.addEventListener('click', function(e) {
  location.reload();
})

//ORIGINAL DIRECTION WITH ERRORS
// function handleCardClick(event) {
//   if (notClicked) return;
//   let newCol = event.target;
//   newCol.style.backgroundColor = event.target.classList;
//   newCol.classList.add('flipped');
// }

// function checkMatch(e){
//   let pickedCard = e.target;
//   let firstPicked = pickedCard[0];
//   let secondPicked = pickedCard[1];
//   if (cardPicked[0] === cardPicked[1] && firstPicked !== secondPicked){
//     console.log('matched pair');
//     matchPairs += 1;
//     setTimeout(checkWon, 1000)
//   } else {
//     firstPicked.classList.remove('flipped');
//     secondPicked.classList.remove('flipped');
//   }
//   cardPicked = [];
//   COLORS = [];
// }

// function checkWon(){
//   if (cardsWon == COLORS.length / 2) {
//     alert("WINNER WINNER!")
//   }
// }