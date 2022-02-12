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
    hideGame();
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
function closeGame() {singleplayerGame.style.display = 'none';}

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
        console.log(selectedEnemy);
    })
}
