// Step Three: Checking for a Valid Word
// Now that you have a form built: when the user submits the form, send the guess to your server.
// The page should not refresh when the user submits the form: this means you’ll have to make an HTTP request without refreshing the page—you can use AJAX to do that!
// Make sure you include axios so that you can easily make AJAX requests.
// Using jQuery, take the form value and using axios, make an AJAX request to send it to the server.
// On the server, take the form value and check if it is a valid word in the dictionary using the words variable in your app.py.
// Next, make sure that the word is valid on the board using the check_valid_word function from the boggle.py file.
// Since you made an AJAX request to your server, you will need to respond with JSON using the jsonify function from Flask.
// Send a JSON response which contains either a dictionary of {“result”: “ok”}, {“result”: “not-on-board”}, or {“result”: “not-a-word”}, so the front-end can provide slightly different messages depending if the word is valid or not.
// On the front-end, display the response from the backend to notify the user if the word is valid and exists on the board, if the word is invalid, or if the word does not exist at all.

// Step Four: Posting a Score
// Now that you are checking to see if a word is valid, let’s start keeping score! The score for a word is equal to its length. If a valid word is guessed, add its score to the total and make sure to display the current score as it changes.
// You can store the score on the front-end for now: it does not need to persist.

// Step Five: Adding a timer
// Instead of letting the user guess for an infinite amount of time, ensure that a game can only be played for 60 seconds. Once 60 seconds has passed, disable any future guesses.

// Step Six: More statistics!
// Now that you have a functional game, let’s keep track of how many times the user has played as well as their highest score so far. When the game ends, send an AJAX request to the server with the score you have stored on the front-end and increment the number of times you have played on the backend.

// Since you will be sending this data as JSON when you make an axios request, you will see this data come in your Flask app inside of request.json not request.form. Use pdb or IPython to set a breakpoint and see what request.json looks like, it is not the same data structure as request.form.

// class Boggle {

//     constructor(boardId, seconds = 60){
//         this.board = $("#" + boardId);
//         this.seconds = seconds;
//         this.timer = setInterval(this.second.bind(this), 1000);
//         this.showTimer();
//         this.score = 0
//         this.words = new Set();

//         $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
//     }

//     showTimer(){
//         $(".timer", this.board).text(this.seconds);
//     }
    
//     async second(){
//         this.seconds -= 1;
//         this.showTimer();

//         if (this.seconds === 0) {
//             clearInterval(this.timer);
//             await this.scoreGame();
//         }
//     }

//     showScore(){
//         $(".score", this.board).text(this.score);
//     }

//     async scoreGame(){
//         $(".add-word", this.board).hide();
//         const response = await axios.post("/update-board", {score: this.score});
//         if (response.data.brokeRecord) {
//             this.showMessage(`New Highscore: ${this.score}`, "ok");
//         } else {
//             this.showMessage(`Your score: ${this.score}`, "ok");
//         }
//     }

//     showWord(word){
//         $(".words", this.board).append($("<li>", {test: word}));
//     }

//     showMessage(msg, cls){
//         $(".msg", this.board).text(msg).removeClass().addClass(`msg ${cls}`);
//     }

//     async handleSubmit(evt){
//         evt.preventDefault();
//         const $word = $(".word", this.board);

//         let word = $word.val();
//         if (!word) return;

//         if (this.words.has(word)) {
//             this.showMessage(`Already used ${word}`, "not-ok");
//             return;
//         }

//         const response = await axios.get("/check-word", {params: {word: word}});
//         if (response.data.result === "not-word") {
//             this.showMessage(`${word} is not a valid word`, "not-ok");
//         } else if (response.data.result === "not-on-board") {
//             this.showMessage(`${word} is not on this board`, "not-ok");
//         } else {
//             this.showWord(word);
//             this.score += word.length;
//             this.showScore();
//             this.words.add(word);
//             this.showMessage(`Added, ${word}`, "ok")
//         }

//         $word.val("").focus();
//     }
// }



class BoggleGame {
    /* make a new game at this DOM id */
  
    constructor(boardId, secs = 60) {
      this.secs = secs; // game length
      this.showTimer();
  
      this.score = 0;
      this.words = new Set();
      this.board = $("#" + boardId);
  
      // every 1000 msec, "tick"
      this.timer = setInterval(this.tick.bind(this), 1000);
  
      $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }
  
    /* show word in list of words */
  
    showWord(word) {
      $(".words", this.board).append($("<li>", { text: word }));
    }
  
    /* show score in html */
  
    showScore() {
      $(".score", this.board).text(this.score);
    }
  
    /* show a status message */
  
    showMessage(msg, cls) {
      $(".msg", this.board)
        .text(msg)
        .removeClass()
        .addClass(`msg ${cls}`);
    }
  
    /* handle submission of word: if unique and valid, score & show */
  
    async handleSubmit(evt) {
      evt.preventDefault();
      const $word = $(".word", this.board);
  
      let word = $word.val();
      if (!word) return;
  
      if (this.words.has(word)) {
        this.showMessage(`Already found ${word}`, "err");
        return;
      }
  
      // check server for validity
      const resp = await axios.get("/check-word", { params: { word: word }});
      if (resp.data.result === "not-word") {
        this.showMessage(`${word} is not a valid English word`, "err");
      } else if (resp.data.result === "not-on-board") {
        this.showMessage(`${word} is not a valid word on this board`, "err");
      } else {
        this.showWord(word);
        this.score += word.length;
        this.showScore();
        this.words.add(word);
        this.showMessage(`Added: ${word}`, "ok");
      }
  
      $word.val("").focus();
    }
  
    /* Update timer in DOM */
  
    showTimer() {
      $(".timer", this.board).text(this.secs);
    }
  
    /* Tick: handle a second passing in game */
  
    async tick() {
      this.secs -= 1;
      this.showTimer();
  
      if (this.secs === 0) {
        clearInterval(this.timer);
        await this.scoreGame();
      }
    }
  
    /* end of game: score and update message. */
  
    async scoreGame() {
      $(".add-word", this.board).hide();
      const resp = await axios.post("/post-score", { score: this.score });
      if (resp.data.brokeRecord) {
        this.showMessage(`New record: ${this.score}`, "ok");
      } else {
        this.showMessage(`Final score: ${this.score}`, "ok");
      }
    }
  }
  