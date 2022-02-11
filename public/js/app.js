/**
 * app.js
 * RAF
 * Mujahid "hypercyte" Ahmed
 */

// Home button
const homeButton = document.getElementById('homeButton');

// Singleplayer or "Play With Bots" button
const singleplayerButton = document.getElementById('singleplayerButton');

// Multiplayer button
const mutliplayerButton = document.getElementById('multiplayerButton');

// Singleplayer game settings menu
const singleplayerSettings = document.querySelector('.singleplayerSettings');

// Slider choosing the number of bots for a game
const botSlider = document.getElementById('botCount');

// The output of the number currently selected in the bot slider
const botSliderOutput = document.getElementById('botsliderOutput');

// Singleplayer button click listener
singleplayerButton.addEventListener('click', () => {
    openSingleplayerMenu();
    console.log("buttoin clicked and run")
})

// Home button click listener
homeButton.addEventListener('click', () => {
    if (singleplayerSettings.style.display === 'none') return;
    closeSingleplayerMenu();
})

// Open singleplayer settings and hide gamemode buttons
function openSingleplayerMenu() {
    singleplayerButton.style.display = 'none';
    mutliplayerButton.style.display = 'none';
    singleplayerSettings.style.display = 'block';
}

// Close singleplayer settings and reveal gamemode buttons
function closeSingleplayerMenu() {
    singleplayerButton.style.display = 'inline';
    mutliplayerButton.style.display = 'inline';
    singleplayerSettings.style.display = 'none';
}

// Bot number slider value
botSliderOutput.innerHTML = botSlider.value;
botSlider.oninput = function () {
    botSliderOutput.innerHTML = this.value;
}
