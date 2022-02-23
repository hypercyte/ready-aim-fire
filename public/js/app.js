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

/* 
Round results storage
*/
const results = new Map(); 

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
    let selectedEnemy = 0;
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
        // selected enemy is the one that is selected by player
        selectedEnemy = parseInt(enemySelect.value);
        ProcessMoves2(players, selectedEnemy);
        finaliseRound(players,);
    })

    shootYourselfButton.addEventListener('click', () => {
        // selected enemy is 0 as in yourself
        ProcessMoves2(players, 0);
        finaliseRound(players);
    })

    doNothingButton.addEventListener('click', () => {
        // selected enemy null
        ProcessMoves2(players, null);
        finaliseRound(players);
    })
}

function ProcessMoves2(players, selectedEnemy) {
    const movesMap  = new Map();

    for (p of players) {
        const ply = p.getPlayerNumber();
        if (ply !== 0) {
            // Choose a random move and player to be targetted.
            let randomMove = Math.ceil(Math.random() * 3);
            let randomPlayer = (Math.ceil(Math.random() * players.length)) - 1;

            // Set moves based on randomly selected move.
            switch (randomMove) {
                case 1:
                    // Change the target until its someone else.
                    while (randomPlayer === ply) randomPlayer = Math.ceil(Math.random() * 3);
                    movesMap.set(ply, randomPlayer);
                    break;
                case 2:
                    // Set target to self as theyre shooting themselves.
                    movesMap.set(ply, ply);
                    break;
                case 3:
                    // Player targets no-one because they did nothing.
                    movesMap.set(ply, null);
                    break;
            }
        } else {
            // Set move for our player.
            movesMap.set(ply, selectedEnemy);
        }
    }

    movesMap.forEach(function(target, player) {
        // If they shot themself:
        if (player === target) {

            // Targetted by another player?
            let targetted = false;

            // Check if anyone is targetting player.
            movesMap.forEach(function(t, p) {
                // If player is targetted && (not including the self-target)
                if (t === player && p !== player) {
                    targetted = true;
                }
            })
            
            // Output based on whether targetted by another player or not.
            if (targetted) {
                console.log(`${player} tried to shoot themself but missed.`);
                results.set(player, {action: "suicide", target: player, success: false})
            } else {
                console.log(`${player} shot themself.`);
                results.set(player, {action: "suicide", target: player, success: true})
            }

        }
        // If they did nothing:
        else if (target === null) {
            console.log(`${player} did nothing.`)
            results.set(player, {action: "nothing", target: null, success: true})
        }
        // If they shot someone:
        else {
            // If their target shot themself, player dies instead.
            if (movesMap.get(target) === target) {
                console.log(`${player} tried to shoot ${target} but they got shot instead somehow.`);
                results.set(player, {action: "shoot", target: player, success: false})
            }
            // Otherwise, target dies.
            else {
                console.log(`${player} shot ${target}.`)
                results.set(player, {action: "shoot", target: target, success: true})
            }
        }
    })
}

function finaliseRound(players) {
    console.log(results);
    results.forEach(function(result, player) {
        if (result.action === "shoot" && result.success === true) {
            console.log(`Logged: ${result.target} is now dead (SHOT).`)
            unalivePlayer(players, result.target);
        }
        else if (result.action === "shoot" && result.success === false) {
            console.log(`Logged: ${result.target} is now dead (FAILED SHOT).`)
            unalivePlayer(players, result.target);
        }
        else if (result.action === "suicide" && result.success === true) {
            console.log(`Logged: ${result.target} is now dead (SUICIDE).`)
            unalivePlayer(players, result.target);
        }
    });
}

function unalivePlayer(players, target) {
    for (p of players) {
        if (p.getPlayerNumber === target) {
            p.setAliveStatus(0);
        }
    }
}