import getRandomFromRange from "./randomGen.js"
import config from "./configs.js"

const newGameBtnNode = document.getElementById("new-game-btn")
const finishedLevelNode = document.getElementById("finish-level");
const levelNode = document.getElementById("current-level-h3");
const timerNode = document.getElementById('timer-h4');
const buttons = Array.from(document.getElementsByClassName('circle-btn'))

let currentLevel = 0;
let timerId;
let {ALPHABET, DURATION: timeLeft, TIMER, LEVELS} = config

newGameBtnNode.addEventListener('click', () => {
    gameProcess();
    timer();
});


function gameProcess() {
    levelNode.innerHTML = LEVELS[currentLevel].label;
    document.getElementById("start-game-container").style.display = "none";
    document.getElementById("play-game-container").style.display = "block";
    let {question, answer, allAnswers} = questionGenerate();
    console.log("Answer: ", answer);
    document.getElementById('quiz-text').innerHTML = question;

    buttons.forEach((btn) => {
        btn.removeEventListener('click', success);
        btn.removeEventListener('click', fail);

        btn.firstChild.innerHTML = allAnswers[getRandomFromRange(0, allAnswers.length)];
        if(btn.firstChild.innerHTML === answer) {
            btn.addEventListener('click', success)
        } else {
            btn.addEventListener('click', fail)
        }
        allAnswers = allAnswers.filter((letter) => letter !== btn.firstChild.innerHTML)
    })
}


function timer() {
        timerId = setInterval(() => {
        if(timeLeft < 0 || currentLevel === LEVELS.length) {
            clearInterval(timerId);
            gameOver(currentLevel);
        } else {
            timerNode.innerHTML = "0:" + timeLeft;
            timeLeft -= 1;
        }
    }, 1000)
}
 

function questionGenerate() {
    let quizIndex = getRandomFromRange(0, ALPHABET.length);
    let quiz = ALPHABET[quizIndex];
    let plusNumber = getRandomFromRange(LEVELS[currentLevel].range[0], LEVELS[currentLevel].range[1]);
    let answerIndex = quizIndex + plusNumber;
    let correctLetter = (answerIndex < ALPHABET.length) ? ALPHABET[answerIndex] : "NO"
    let alphWithout = ALPHABET.filter((letter) => letter !== correctLetter)
    
    let wrongAnswers = [1, 2, 3].map(() => {
        let letter = alphWithout[getRandomFromRange(0, alphWithout.length)]
        alphWithout = alphWithout.filter((item) => item!== letter)
        return letter;
    });

    return {
        question: `${quiz} + ${plusNumber}`,
        answer: correctLetter,
        allAnswers: [...wrongAnswers, correctLetter]
    }
}


function success() {
    timeLeft += TIMER;
    currentLevel++;
    gameProcess();
}


function fail() {
    if(timeLeft > TIMER) {
        timeLeft -= TIMER;
        gameProcess();
    } else {
        clearInterval(timerId);
        gameOver();
    }
}


function gameOver() {
    levelNode.innerHTML = (currentLevel === LEVELS.length) ? "You Won!": "Time Expired";
    setTimeout(() => {
        timerNode.innerHTML = "";
        document.getElementById("play-game-container").style.display = "none"  
        document.getElementById('finish-game-container').style.display = "block";
        finishedLevelNode.innerHTML = 'Level ' + (currentLevel + 1);
        timeLeft = config.DURATION
        currentLevel = 0
    }, 1000);
}


document.getElementById('back-new-game-h1').addEventListener('click', () => {
    currentLevel = 0;
    timeLeft = config.DURATION;
    gameProcess();
    timer();
});

document.getElementById("back-arrow").addEventListener('click', () => {
    document.getElementById('finish-game-container').style.display = "none";
    document.getElementById("start-game-container").style.display = "block"
})


