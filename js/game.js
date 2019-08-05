import Mole from './mole.js';

const GAME_TIME = 1, // in minutes
    HOLE_WIDTH = 100,
    HOLE_SPACING = 20,
    LEVELS_TIME = [2000, 1500, 1000, 600];

var moles = [],
    availableMoles = [],
    startTime,
    timerEnd = false, 
    hits = 0,
    level = 0,
    callbacks = {
        onHitsChange() {

        },
        onGameEnd() {

        }
    };

/** Initialize moles */
function initializeMoles(pockets) {
    // Create Moles
    var moleHTML = `<div class="mole">
        <div class="eye left">.</div>
        <div class="eye right">.</div>
        <div class="plaster">x</div>
        <div class="mouth">
            <div class="teeth"></div>
            <div class="teeth"></div>
        </div>
    </div>`;
    var landHTML = `${Array(pockets).fill().map(() => `<div class="mole-hole">${moleHTML}</div>`).join('')}`;
    var land = document.querySelector('.land');
    land.innerHTML = landHTML;
    
    // Layout the land
    let molesPerRow = Math.floor(Math.sqrt(pockets)); // Assuming number of pockets is a square
    land.style.width = `${(HOLE_WIDTH + HOLE_SPACING) * molesPerRow + HOLE_SPACING / 2}px`;

    // Create instances for each created Mole
    document.querySelectorAll('.mole-hole').forEach(($mole/*, index*/) => {
        var mole = new Mole($mole);
        moles.push(mole);
        $mole.style.width = `${HOLE_WIDTH}px`;
        $mole.style.margin = `${HOLE_SPACING / 2}px`;
    });
}

async function runGame(timeLimit) {
    let gap = LEVELS_TIME[level];
    await wait(gap);
    
    // Pick a random number b/w 0 and MAX_NUMBER_OF_MOLES - 1
    let moleIndex = Math.floor(Math.random() * Math.floor(availableMoles.length - 1));
    let chosenMole = availableMoles[moleIndex];
    // Trigger the Mole corresponding to the picked number
    chosenMole && chosenMole.show();
    availableMoles.splice(moleIndex, 1);
    
    let currentTime = new Date();
    let timeElapsed = currentTime - startTime;
    let levelTime = (timeLimit * 60) / LEVELS_TIME.length;
    timeElapsed /= 1000;
    level = Math.floor(timeElapsed / levelTime);

    chosenMole.shownTime = currentTime;
    // Add event listener for the mole
    chosenMole.$el.onclick = () => {
        if (chosenMole.shown) {
            addHits();
            callbacks.onHitsChange && callbacks.onHitsChange(hits);
        }
        hideMole(chosenMole, 0, currentTime, true);
    };
    // Hide the Mole after the gap time
    hideMole(chosenMole, gap, currentTime);
    
    if (timerEnd/* timeElapsed > GAME_TIME * 60 */) {
        callbacks.onGameEnd && callbacks.onGameEnd();
        return;
    }
    runGame(...arguments);
}

async function hideMole(mole, gap, triggerTime, hit = false) {
    await wait(gap);
    if (mole.shown && mole.shownTime === triggerTime) {
        let hideMole = hit && mole.hit.bind(mole) || mole.miss.bind(mole);
        hideMole().then(() => availableMoles.push(mole));
    }
}


function wait(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}
function addHits() {
    hits++;
}

async function startTimer(time, $displayEl) {
    let timeElapsed = 0;
    while (timeElapsed < time * 60) {
        await wait(1000);
        timeElapsed++;
        $displayEl.innerHTML = `${Math.floor(timeElapsed / 60)}:${('0' + (timeElapsed % 60)).slice(-2)}`;
    }
    timerEnd = true;
}


/** Start game */
export default function game(pockets, cbs) {
    initializeMoles(pockets);
    if (!moles.length) {
        alert('This lawn is safe! There are no moles for you to worry about!');
        return;
    }
    // Reset all values
    callbacks = cbs;
    timerEnd = false;
    level = 0;
    hits = 0;
    availableMoles = [...moles];
    startTime = new Date();

    startTimer(GAME_TIME, document.querySelector('.timer .time'));
    // Run the game
    runGame(GAME_TIME);
}

// Wait for timer
// Start timer when user is ready
// Show Moles at random places
    // Pick a random number b/w 0 and MAX_NUMBER_OF_MOLES - 1
    // Trigger the Mole corresponding to the picked number
// If the user clicks on a Mole correctly, show HIT animation
    // Add HIT count
    // Calculate average time taken
// Else, hide the mole with MISS animation
    // Add MISS count
// Divide the total time into NUMBER_OF_LEVELS
// If the user reaches a level by time or a certain total point,
    // Increase the speed