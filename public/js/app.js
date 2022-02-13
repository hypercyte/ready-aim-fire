/**
 * app.js
 * RAF
 * Mujahid "hypercyte" Ahmed
 */

/*
Elements
*/

const homeButton                = document.getElementById('homeButton'); // Home button
const singleplayerButton        = document.getElementById('singleplayerButton'); // Singleplayer or "Play With Bots" button
const mutliplayerButton         = document.getElementById('multiplayerButton'); // Multiplayer button
const singleplayerStartButton   = document.getElementById('startGameButton'); // Singleplayer menu start game button
const botSlider                 = document.getElementById('botCount'); // Slider choosing the number of bots for a game
const botSliderOutput           = document.getElementById('botsliderOutput'); // The output of the number currently selected in the bot slider
const singleplayerSettings      = document.querySelector('.singleplayerSettings'); // Singleplayer game settings menu
const singleplayerGame          = document.querySelector('.singleplayerGame'); // Singleplayer in-game section

/*
Event listeners
*/

// Singleplayer button click listener
singleplayerButton.addEventListener('click', () => {
    openSingleplayerMenu();
    hideGamemodeButtons();
})

// Home button click listener
homeButton.addEventListener('click', () => {
    if (singleplayerButton.style.display !== 'none') return;
    closeSingleplayerMenu();
    showGamemodeButtons();
    closeGame();
    // TODO: Clicking home ends the game prematurely, thus should clear information about the game probably.
})

// Start button click listener
singleplayerStartButton.addEventListener('click', () => {
    const bots = botSlider.value;
    startSingleplayerGame(bots);
})

/*
Functions
*/

// Hide gamemode buttons
function hideGamemodeButtons() {
    singleplayerButton.style.display = 'none';
    mutliplayerButton.style.display = 'none';
}

// Show gamemode buttons
function showGamemodeButtons() {
    singleplayerButton.style.display = 'inline';
    mutliplayerButton.style.display = 'inline';
} 

// Open/close singleplayer game settings menu
function openSingleplayerMenu() {singleplayerSettings.style.display = 'block';}
function closeSingleplayerMenu() {singleplayerSettings.style.display = 'none';}

// Show/hide game window
function openGame() {singleplayerGame.style.display = 'block';}
function closeGame() {
    singleplayerGame.style.display = 'none';
    clearEnemies(document.getElementById('enemies'));
}

function clearEnemies(enemySelector) {
    // Code snippet from: https://stackoverflow.com/a/3364546
    // by Fabiano
    // Removing all elements from a select dropdown.
    var i, L = enemySelector.options.length - 1;
    for (i = L; i >= 0; i--) {
        enemySelector.remove(i);
    }
}

// Bot number slider value
botSliderOutput.innerHTML = botSlider.value;
botSlider.oninput = function () {
    botSliderOutput.innerHTML = this.value;
}

// Hide game settings and start the game.
// Probably should take in the number of bots as param.
function startSingleplayerGame(bots) {
    closeSingleplayerMenu();
    openGame();
    console.log(`Game started with ${bots} bots.`);

    /*
    Elements
    */

    const shootEnemyButton      = document.getElementById('shoot-enemy');
    const shootYourselfButton   = document.getElementById('shoot-yourself');
    const doNothingButton       = document.getElementById('do-nothing');
    const enemySelect           = document.getElementById('enemies');

    /*
    Variables
    */

    let roundNumber     = 0;  // Keeps track of which round we are currently on.
    const players       = []; // array of all players. will be populated later.
    const moves         = []; // array of all moves made by players each round.
    const targets       = []; // array of targets if shooting. null if not shooting.
    //let selectedAction  = 

    /*
    Player class
    */

    class Player {
        constructor(playerNumber) {
            this.playerNumber   = playerNumber;
            this.alive          = 1;
        }
        getPlayerNumber() {
            return this.playerNumber;
        }
        getAliveStatus() {
            return this.alive;
        }
        setAliveStatus(alive) {
            this.alive = alive;
        }
    }

    /*
    Creating playerbase
    */

    players.push(new Player(0)); // create the non-bot player first
    console.log('created player 0');
    // loop through chosen number of bots and create too.
    for(let i = 1; i <= bots; i++) {
        players.push(new Player(i));
        console.log(`created bot ${i}`);
    }

    /* testing
    for (p of players) {
        if (p.playerNumber === 4) p.setAliveStatus(0);
        const playerStatus = p.getAliveStatus() ? 'alive' : 'dead';
        console.log(`Player ${p.getPlayerNumber()} is ${playerStatus}`);
    }*/

    /*
    Populate the "enemies" dropdown selector
    */

    for (p of players) {
        const enemy     = p.getPlayerNumber();
        if (enemy === 0) continue;
        const el        = document.createElement("option");
        el.textContent  = `Bot ${enemy}`;
        el.value        = enemy;
        enemySelect.appendChild(el);
    }

    /*
    Event listeners
    */

    shootEnemyButton.addEventListener('click', () => {
        const selectedEnemy = enemySelect.value;
        moves.push(1);
        targets.push(selectedEnemy);
        ProcessMoves(players, moves, targets);
    })

    shootYourselfButton.addEventListener('click', () => {
        moves.push(2);
        // TODO
    })

    doNothingButton.addEventListener('click', () => {
        moves.push(3);
        // TODO
    })
}

// Calculate moves
function ProcessMoves(players, moves, targets) {
    const deathQueue = [];

    for (p of players) {
        const ply = p.getPlayerNumber();
        if (ply === 1) continue;
        const randomPlayer = (Math.ceil(Math.random() * players.length)) - 1;
        const randomMove = Math.ceil(Math.random() * 3);
        moves.push(randomMove);
        if (randomMove === 1) {
            targets.push(randomPlayer);
        } else {
            targets.push(null);
        }
    }
    
    /*console.log("targets:")
    for (t of targets) {
        console.log(t);
    }
    
    console.log("moves:")
    for (m of moves) {
        console.log(m);
    }*/

    for (let i = 0; i <= moves.length; i++) {
        if (moves[i] === 1) {
            if (i === 0) {
                if (moves[targets[0]] == 2) {
                    deathQueue.push(i);
                    console.log(`Player ${i} tried to shoot Player ${targets[0]} but they got hit instead...`);
                } else {
                    deathQueue.push(targets[0]);
                    console.log(`Player ${i} shot and killed Player ${targets[0]}`);
                }
            }
            else {
                if (moves[targets[i]] == 2) {
                    deathQueue.push(i);
                    console.log(`Player ${i} tried to shoot Player ${targets[i]} but they got hit instead...`);
                } else {
                    deathQueue.push(targets[i]);
                    console.log(`Player ${i} shot and killed Player ${targets[i]}`);
                }
            }
        }
        else if (moves[i] === 2) {
            if (!targets.includes(i)) {
                deathQueue.push(i);
                console.log(`Player ${i} shot themselves and died.`)
            } else {
                console.log(`Player ${i} shot themselves, and ducked when they noticed soemone and shot them instead lol.`)
            }
        }
        else {
            console.log(`Player ${i} did nothing.`)
        }
    }

    for (d of deathQueue) {
        players[d].setAliveStatus(0);
    }

    for (p of players) {
        console.log(`Player ${p.getPlayerNumber()} is ${p.getAliveStatus()}`);
    }
}

function roundEndResults(moves) {

}
