const words = 'in one good real one not school set they state high life consider on and not come what also for set point can want as while with of order child about school thing never hold find order each too between program work end you home place around while place problem end begin interest while public or where see time those increase interest be give end think seem small as both another a child same eye you between way do who into again good fact than under very head become real possible some write know however late each that with because that place nation only for each change form consider we would interest with world so order or run more open that large write turn never over open each over change still old take hold need give by consider line only leave while what set up number part form want against great problem can because head so first this here would course become help year first end want both fact public long word down also long for without new turn against the because write seem line interest call not if line thing what work people way may old consider leave hold want life between most place may if go who need fact such program where which end off child down change to from people high during people find to however into small new general it do that could old for last get another hand much eye great no work and with but good there last think can around use like number never since world need what we around part show new come seem while some and since still small these you general which seem will place come order form how about just also they with state late use both early too lead general seem there point take general seem few out like might under if ask while such interest feel word right again how about system such between late want fact up problem stand new say move a lead small however large public out by eye here over so be way use like say people work for since interest so face order school good not most run problem group run she late other problem real form what just high no man do under would to each too end point give number child through so this large see get form also all those course to work during about he plan still so like down he look down where course at who plan way so since come against he all who at world because while so few last these mean take house who old way large no first too now off would in this course present order home public school back own little about he develop of do over help day house stand present another by few come that down last or use say take would each even govern play around back under some line think she even when from do real problem between long as there school do as mean to all on other good may from might call world thing life turn of he look last problem after get show want need thing old other during be again develop come from consider the now number say life interest to system only group world same state school one problem between for turn run at very against eye must go both still all a as so after play eye little be those should out after which these both much house become both school this he real and may mean time by real number other as feel at end ask plan come turn by all head increase he present increase use stand after see order lead than system here ask in of look point little too without each for both but right we come world much own set we right off long those stand go both but under now must real general then before with much those at no of we only back these person plan from run new as own take early just increase only look open follow get that on system the mean plan man over it possible if most late line would first without real hand say turn point small set at in system however to be home show new again come under because about show face child know person large program how over could thing from out world while nation stand part run have look what many system order some one program you great could write day do he any also where child late face eye run still again on by as call high the must by late little mean never another seem to leave because for day against public long number word about after much need open change also'.split(' ');
const wordsCount = words.length;
let gameTime = 30 * 1000; // default 30 seconds
let timer = null;
let gameStart = null;
let pauseTime = 0;
let typingData = [];
let chartVisible = false;

// Add this at the beginning of your file where you get other DOM elements
const timerSelect = document.getElementById('timerSelect');

function addClass(el,name) {
  el.className += ' '+name;
}
function removeClass(el,name) {
  el.className = el.className.replace(name,'');
}

function randomWord() {
  const randomIndex = Math.ceil(Math.random() * wordsCount);
  return words[randomIndex - 1];
}

function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function getWPM() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        return letters.every(letter => letter.classList.contains('correct'));
    });
    const minutes = (gameTime / 1000) / 60;
    return Math.round(correctWords.length / minutes);
}

function getAccuracy() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0, lastTypedWordIndex);
    
    let totalLetters = 0;
    let correctLetters = 0;
    
    typedWords.forEach(word => {
        const letters = [...word.children];
        letters.forEach(letter => {
            totalLetters++;
            if (letter.classList.contains('correct')) {
                correctLetters++;
            }
        });
    });
    
    return Math.round((correctLetters / totalLetters) * 100) || 0;
}

// Create a timer display div
const timerDisplay = document.createElement('div');
timerDisplay.id = 'timer';
timerDisplay.className = 'timer-display';
document.getElementById('info').appendChild(timerDisplay);

function updateTimer() {
    if (!gameStart) return;
    
    const timeElapsed = Date.now() - gameStart;
    const timeLeft = gameTime - timeElapsed;
    
    if (timeLeft <= 0) {
        gameOver();
        return;
    }
    
    timerDisplay.textContent = Math.round(timeLeft / 1000);
}

function calculateCurrentWPM(timeElapsed) {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        return letters.every(letter => letter.classList.contains('correct'));
    });
    
    // Convert time to minutes (timeElapsed is in seconds)
    const minutes = timeElapsed / 60;
    return Math.round(correctWords.length / minutes);
}

function gameOver() {
    clearInterval(timer);
    addClass(document.getElementById('game'), 'over');
    const wpm = getWPM();
    const accuracy = getAccuracy();
    timerDisplay.textContent = `WPM: ${wpm} | Accuracy: ${accuracy}%`;
    
    // Collect typing data
    const timeElapsed = (Date.now() - gameStart) / 1000;
    const currentWPM = calculateCurrentWPM(timeElapsed);
    typingData.push({
        time: timeElapsed,
        wpm: currentWPM
    });
    
    // Create and show the graph
    createGraph();
}

function createGraph() {
    // Remove existing graph if any
    const existingGraph = document.getElementById('graphContainer');
    if (existingGraph) {
        existingGraph.remove();
    }
    
    // Create graph container
    const graphContainer = document.createElement('div');
    graphContainer.id = 'graphContainer';
    document.querySelector('main').appendChild(graphContainer);
    
    // Create canvas for the graph
    const canvas = document.createElement('canvas');
    graphContainer.appendChild(canvas);
    
    // Create the graph using Chart.js
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: typingData.map(data => Math.round(data.time) + 's'),
            datasets: [{
                label: 'WPM Over Time',
                data: typingData.map(data => data.wpm),
                borderColor: '#f1c40f',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });
}

function newGame() {
    clearInterval(timer);
    gameStart = null;
    
    // Reset game state
    document.getElementById('words').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('words').innerHTML += formatWord(randomWord());
    }
    
    // Reset timer display
    gameTime = parseInt(document.getElementById('timerSelect').value) * 1000;
    timerDisplay.textContent = Math.round(gameTime / 1000);
    
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    removeClass(document.getElementById('game'), 'over');
    
    // Clear typing data and remove existing graph
    typingData = [];
    const existingGraph = document.getElementById('graphContainer');
    if (existingGraph) {
        existingGraph.remove();
    }
}

function showConfetti() {
  let confetti = document.createElement("div");
  confetti.innerHTML = "🎉";
  confetti.style.position = "fixed";
  confetti.style.top = Math.random() * window.innerHeight + "px";
  confetti.style.left = Math.random() * window.innerWidth + "px";
  confetti.style.fontSize = "2rem";
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 2000);
}

// Handle typing
document.getElementById('game').addEventListener('keydown', ev => {
    const game = document.getElementById('game');
    
    if (ev.key === 'Tab') {
        ev.preventDefault();
        newGame();
        return;
    }
    
    if (game.classList.contains('over')) return;

    // Start timer on first keypress
    if (!gameStart) {
        gameStart = Date.now();
        timer = setInterval(() => {
            updateTimer();
            // Collect WPM data every second
            const timeElapsed = (Date.now() - gameStart) / 1000;
            const currentWPM = calculateCurrentWPM(timeElapsed);
            typingData.push({
                time: timeElapsed,
                wpm: currentWPM
            });
        }, 1000); // Collect data every second
    }
    
    const key = ev.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;

    console.log({key,expected});

    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current');
            }
        } else {
            const incorrectLetter = document.createElement('span');
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'letter incorrect extra';
            currentWord.appendChild(incorrectLetter);
        }
    }

    if (isSpace) {
        if (expected !== ' ') {
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            });
        }
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');
        if (currentLetter) {
            removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextSibling.firstChild, 'current');
    }

    if (isBackspace) {
        if (currentLetter && isFirstLetter) {
            // make prev word current, last letter current
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
        }
        if (currentLetter && !isFirstLetter) {
            // move back one letter, invalidate letter
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
        }
        if (!currentLetter) {
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
        }
    }

    // move lines / words
    if (currentWord.getBoundingClientRect().top > 250) {
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin - 35) + 'px';
    }

    // move cursor
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
});

document.getElementById('newGameBtn').addEventListener('click', () => {
  gameOver();
  newGame();
});

// Initialize the game
newGame();

// Add event listener for timer selection
document.getElementById('timerSelect').addEventListener('change', newGame);
