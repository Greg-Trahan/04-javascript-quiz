// Generate global variables
const generateBtn = document.querySelector("#generate");
const buttonDiv = document.querySelector(".start-button");
const highScoreBtn = document.querySelector("#high-score")
let numberField = document.querySelector("#intro");
let questionField = document.querySelector("#instructions");
let optionsField = document.querySelector("#options");
let optionsList = document.querySelector("#options-list")
let viewScores = document.querySelector(".view")
let scoreList = document.querySelector("#score-list")
let questionNumber = 1;
let count = 0
let correct = 0
let done = false
var leaderBoard = []




// Generate timer vairable and set the time available
const timeElement = document.querySelector(".timer");
let secondsLeft = 60
timeElement.textContent = secondsLeft + " seconds";

// An array of objects detailing the questions, options, and answers
const questionArray = [
  {
    question: "Commonly used data types do NOT inclue:", 
    options: ["strings", "booleans", "alerts", "numbers"], 
    answer: "alerts" },
  
  {
  question: "The condition in an if/else statement is enclosed with ______.", 
  options: ["quotes", "curley brackets", "parenthesis", "square brackets"], 
  answer: "parenthesis" },

  {
    question: "Arrays in JavaScript can be used to store _______.", 
    options: ["numbers and strings", "other arrays", "booleans", "all of the above"], 
    answer: "all of the above" },
  
  {
    question: "String values must be enclosed winthin _____ when being assigned to variables.", 
    options: ["commas", "curley brackets", "quotes", "parenthasis"], 
    answer: "quotes" },

  {
    question: "A very useful tool used during development and debuggin for printing content tot eh debugger is:", 
    options: ["JavaScript", "termainal", "for loops", "console log"], 
    answer: "console log" }
]

//When on the main page you can either start the quiz, or view the high score page
highScoreBtn.addEventListener("click", showHighScore);
generateBtn.addEventListener("click", startQuiz);

// Start the quiz and the timer
function startQuiz() {
  timer()
  questionGeneration()
  buttonDiv.innerHTML = ""
  checkAnswer()
}

// This function starts the timer counting down
function timer(){
  var countdown = setInterval(function() {
    
    secondsLeft--;
    timeElement.textContent = secondsLeft + " seconds remaining";
    
    if(secondsLeft < 1) {
      clearInterval(countdown);
      if (done === false){
        finish()
      }
    }
  }, 1000);
}

//This will display each new questions and the answers
function questionGeneration(questionNumber){
  if (count+1 <= questionArray.length){
    //Clear previous elements
    scoreList.innerHTML = ""
    optionsList.innerHTML = ""

    numberField.textContent= `Question #${count+1}`;
    questionField.textContent = questionArray[count].question
    
    //Create an unordered list of buttons with the attribute 'response'
    questionArray[count].options.forEach(function (option, idx){
      let li = document.createElement("li");
      let button = document.createElement("button");

      button.setAttribute("response", questionArray[count].options[idx]);
      button.setAttribute("class", "answer")
      button.textContent = questionArray[count].options[idx];

      li.appendChild(button);
      optionsList.appendChild(li);
    })
  } else {
    finish()
  }
}

function checkAnswer(){
  optionsList.addEventListener("click", function(event){
    if (event.target.matches("button")){
      if (event.target.getAttribute('response') === questionArray[count].answer){
        rightAnswer()
      } else{
        wrongAnswer()
      }
    }
  })
}

// This funciton will run if the user gets a question right
function rightAnswer(){
  count++
  correct++
  buttonDiv.textContent = "Correct!"
  questionGeneration()
}

// This function will run if the user gets a question wrong
function wrongAnswer(){
  secondsLeft = secondsLeft - 10;
  count++
  buttonDiv.textContent = "Incorrect"
  questionGeneration()
}

//Display score and let user type initials
function finish(){
  done = true
  let form = document.createElement("form");
  let type = document.createElement("input");
  const submitBtn = document.createElement("input");
  buttonDiv.innerHTML = ""
  optionsList.innerHTML = ""

  //Create submit button and text field for user to iput initials
  submitBtn.setAttribute("type", "submit");
  submitBtn.setAttribute("value", "Submit");
  submitBtn.setAttribute("id", "submit");
  // form.setAttribute("style", "padding: 5px")
  type.setAttribute("id", "initials")
  type.setAttribute("type", "text");

  form.appendChild(type);
  optionsField.appendChild(form);
  form.appendChild(submitBtn);
  

  numberField.textContent= `You got ${correct}/5 correct. Congraguations!`;
  questionField.textContent = "Please enter your initials"

  timeElement.style.display = "none"
  submitBtn.addEventListener("click", submitScore)

}

//Pull scores from local storage, add new score and restore new scores
function submitScore(event){
  event.preventDefault();

  let score = {};
  let initialField = document.querySelector("#initials").value;
  score = {name: initialField, score: correct};
  
  leaderBoard = JSON.parse(localStorage.getItem("highScores"));
  if (leaderBoard === null){
    leaderBoard = []
  };

  leaderBoard.push(score);
  localStorage.setItem("highScores", JSON.stringify(leaderBoard));
  
  showHighScore();
}


//Pull up an ordered list of the high scores
function showHighScore(){
  //Parse local storage
  leaderBoard = JSON.parse(localStorage.getItem("highScores"));
  if (leaderBoard === null){
    leaderBoard = []
  }

  //Clear previous content
  numberField.textContent = "High Scores"
  questionField.innerHTML = ""
  viewScores.innerHTML = ""
  optionsField.innerHTML = ""
  scoreList.innerHTML = ""
  optionsList.innerHTML = ""
  timeElement.style.display = "none"

  //Create Back button
  buttonDiv.innerHTML = ""
  const backBtn = document.createElement("button");
  backBtn.setAttribute("id", "start");
  backBtn.setAttribute("class", "btn");
  backBtn.textContent = "Go back";
  buttonDiv.appendChild(backBtn);

  //Create Reset Button
  const resetBtn = document.createElement("button");
  resetBtn.setAttribute("id", "reset");
  resetBtn.setAttribute("class", "btn");
  resetBtn.textContent = "Reset High Scores";
  buttonDiv.appendChild(resetBtn);

  //Back button functionality
  backBtn.addEventListener("click", function(){
    location.reload()
  })

  //Reset button functionality
  resetBtn.addEventListener("click", function(){
    leaderBoard = []
    localStorage.setItem("highScores", JSON.stringify(leaderBoard));
    showHighScore()
  })

  //Display high scores
  let title = document.createElement("p")
  title.textContent = ("Player ----  Score")
  scoreList.appendChild(title)

  //Orders my leaderBoard array from highest score to lowest.
  leaderBoard.sort((a, b) => (a.score < b.score) ? 1: -1)

  leaderBoard.forEach(function(score, i){
    let liTag = document.createElement("li");
    let pTag = document.createElement("p");
    pTag.setAttribute("class", "score")
    scoreList.appendChild(liTag)
    liTag.appendChild(pTag)
    pTag.textContent = `${leaderBoard[i]["name"]} ------ ${leaderBoard[i]["score"]}`
  })
}



