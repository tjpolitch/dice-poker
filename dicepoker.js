//////////////////
//Global variables
//////////////////

class Person {
  constructor(
    name,
    skill,
    confidence,
    hand,
    handName,
    handScore,
    handValue,
    money,
    winner,
    playingRound
  ) {
    this.name = name;
    this.skill = skill;
    this.confidence = confidence;
    this.hand = hand;
    this.handName = handName;
    this.handScore = handScore;
    this.handValue = handValue;
    this.money = money;
    this.winner = winner;
    this.playingRound = playingRound;
  }
}

let player = new Person("TJ", 0, 0, [], "", 0, 0, 100.0, false, true); //can be prompted for name but I removed as it was too annoying for testing
let opponent1 = new Person("Babbles", 5, 5, [], "", 0, 0, 100.0, false, true);
let opponent2 = new Person("Levi", 5, 5, [], "", 0, 0, 100.0, false, true);
let opponent3 = new Person("Macy", 5, 5, [], "", 0, 0, 100.0, false, true);
let opponent4 = new Person("Milo", 5, 5, [], "", 0, 0, 100.0, false, true);

let playerList = [player, opponent1, opponent2, opponent3, opponent4];

const gameDisplay = document.querySelector("#gameNumber");
const gameButton = document.querySelector("#gameButton");
const roundDisplay = document.querySelector("#round");

const potDisplay = document.querySelector("#pot");
const playerMoneyDisplay = document.querySelector("#playerMoney");

const playerListDisplay = document.querySelector("#playerList");
const playersMoneyDisplay = document.querySelector("#playersMoney");

const communalRollDisplay = document.querySelector("#communalRoll");
const communalRollButton1 = document.querySelector("#rollButtonC1");
const communalRollButton2 = document.querySelector("#rollButtonC2");

const playerRollDisplay = document.querySelector("#playerRoll");
const playerRollButton = document.querySelector("#rollButtonP");

const playerHandNumberDisplay = document.querySelector("#playerHand");
const playerHandNameDisplay = document.querySelector("#hand");
const betButton = document.querySelector("#betButton");
const raiseButton = document.querySelector("#raiseButton");
const foldButton = document.querySelector("#foldButton");
const seeButton = document.querySelector("#seeButton");
const showButton = document.querySelector("#showButton");

const actionButtons = document.querySelectorAll(".actionButtons");

const allButtons = document.querySelectorAll("button");
allButtons.forEach((btn) => {
  btn.disabled = true;
  gameButton.disabled = false;
  playerRollButton.disabled = true;
});

let hand = "";
let handScore = 0;
let gameCounter = 1;
let roundCounter = 0;
let isStartofGame = true;
//let playerMoney = 0;
let pot = 0;
let communalRoll1 = [];
let communalRoll2 = [];
let currentBet = 0;
let playingRoundCounter = 5;
let confidenceMod = 8;

const gameRound = ["Pregame", "One", "Two", "Showdown"];

//////////////////////////////////////
//Button Listeners - in order of usage
//////////////////////////////////////

//Button to start a game and increase the game counter
gameButton.addEventListener("click", function () {
  gameDisplay.textContent = gameCounter++;
  roundDisplay.textContent = gameRound[roundCounter];
  disable(gameButton);
  enable(playerRollButton);
  clearHands();
  logEvent("A new game has started!");
  return gameCounter;
});

//Button to set the player list and the pot money for the first game that is started
gameButton.addEventListener("click", function () {
  if (isStartofGame) {
    // prompt('How much money do you want to start with? (multiples of 5)'); - removed for now for speedier testing - set each player to have 100 instead
    playerMoneyDisplay.textContent = playerList[0].money;
    //shuffle(playerList); - removed for now for testing purposes
    for (let i = 0; i < playerList.length; i++) {
      let li = document.createElement("li");
      li.innerText = playerList[i].name;
      playerListDisplay.appendChild(li);
    }
    for (let i = 0; i < playerList.length; i++) {
      let li = document.createElement("li");
      li.innerText = "$" + playerList[i].money;
      playersMoneyDisplay.appendChild(li);
    }

    isStartofGame = false;
  } else {
    //playerList.unshift(playerList.pop()); //need to test this
    //roundCount(); - removed as it was causing issues
  }

  communalRollDisplay.textContent = null;
  playerRollDisplay.textContent = null;
  playerHandNumberDisplay.textContent = null;
  playerHandNameDisplay.textContent = null;
});

//Button to roll the first three dice for each player and add it to their hand. It also calculates the hand value, hand score, and hand name of their 3-dice roll
playerRollButton.addEventListener("click", function () {
  roundCount();
  playersRoll();
  rollSort();
  playerRollDisplay.textContent = playerList[0].hand;
  playerHandNumberDisplay.textContent = playerList[0].hand;
  disable(playerRollButton);
  enableActionButtons();
  logEvent("Players have rolled their dice.");

  for (let i = 0; i < playerList.length; i++) {
    calculateValueScore(playerList[i].hand, i);
  }

  for (let i = 0; i < playerList.length; i++) {
    evaluatePlayerRoll(playerList[i].hand, i);
  }

  for (let i = 1; i < playerList.length; i++) {
    firstRollAI(i);
  }
  // return playerList[0].hand; - do I need this
});

//Button to roll the first community dice. It also pushes that dice to all hands.
communalRollButton1.addEventListener("click", function () {
  roundCount();
  clearScores();

  diceRoll(communalRoll1);

  disable(communalRollButton1);
  enableActionButtons();
  logEvent("The first communal dice is rolled.");

  for (let i = 0; i < playerList.length; i++) {
    playerList[i].hand.push(communalRoll1[0]);
  }
  rollSort();

  for (let i = 0; i < playerList.length; i++) {
    calculateValueScore(playerList[i].hand, i);
  }

  for (let i = 0; i < playerList.length; i++) {
    evaluateComRoll1(playerList[i].hand, i);
  }

  communalRollDisplay.textContent = communalRoll1;
  playerHandNumberDisplay.textContent = playerList[0].hand;

  for (let i = 1; i < playerList.length; i++) {
    secondRollAI(i);
  }

  //return hands;
});

//Button to roll the second community dice. It also pushes that dice to all hands and evaluates those hands and value scores.
communalRollButton2.addEventListener("click", function () {
  roundCount();
  clearScores();

  diceRoll(communalRoll2);

  //rollButtonPerRound();
  disable(communalRollButton2);
  enableActionButtons();

  logEvent("The second communal dice is rolled.");

  for (let i = 0; i < playerList.length; i++) {
    playerList[i].hand.push(communalRoll2[0]);
  }
  rollSort();

  communalRollDisplay.textContent = communalRoll1.concat(communalRoll2);
  playerHandNumberDisplay.textContent = playerList[0].hand;

  for (let i = 0; i < playerList.length; i++) {
    evaluateHand(playerList[i].hand, i);
  }

  for (let i = 0; i < playerList.length; i++) {
    calculateValueScore(playerList[i].hand, i);
  }

  for (let i = 1; i < playerList.length; i++) {
    finalRollAI(i);
  }

  playerHandNameDisplay.textContent = playerList[0].handName;
});

//Button to bet. It is set to always bet $5, which can be adjusted in the future.
betButton.addEventListener("click", function () {
  rollButtonPerRound();
  disableActionButtons();

  playerList[0].money -= 5;
  playerMoneyDisplay.textContent = playerList[0].money;

  // if (playerList[0].money < 5) {
  //   disableActionButtons();
  // }
  pot += 5;
  potDisplay.textContent = pot;

  logBet(playerList[0]);
  updateMoney();
});

//The show button determines the final winner for the game
showButton.addEventListener("click", function () {
  logEvent("Remaining players have shown their dice");
  // Displays the hand of each player on thte game log
  for (let i = 0; i < playerList.length; i++) {
    const playerResult = `${playerList[i].name} has a ${playerList[i].handName} with rolls of ${playerList[i].hand} and a hand value of ${playerList[i].handValue}`;
    logEvent(playerResult);
  }
  determineWinner();
  enable(gameButton);
  disable(showButton);
});

////////////////////////
//Functions
////////////////////////

//Bets $5 which will be the default for now. This function removed the money from the player, adds it to the pot, and then displays the pot. It also increased the current bet counter to 5 (which is relevant for limiting raising)
function bet(i) {
  playerList[i].money -= 5;
  pot += 5;

  if (currentBet == 0 || currentBet == 5) {
    currentBet = 5;
  }
  updateMoney();
  potDisplay.textContent = pot;
  return pot;
}

//Raises the current bet to 10 which is the limit for raising. It uses the same principles as the bet function, but will either increase an existing bet by 5 (making 10), or immediately raising to the limit of 10
function raise(i) {
  if (currentBet == 0) {
    playerList[i].money -= 10;
  } else if (currentBet == 5) {
    playerList[i].money -= 10;
  }
  pot += 10;
  currentBet += 10;
  updateMoney();
  potDisplay.textContent = pot;
  return pot;
}

//Removes the player from playing the round/game
function fold(i) {
  playerList[i].playingRound = false;
}

// Sees the current bet
function see(i) {
  playerList[i].money -= currentBet;
  pot += currentBet;
  updateMoney();
  potDisplay.textContent = pot;
  return pot;
}

//Enables buttons with the class of action button (bet, raise, fold, see)
function enableActionButtons() {
  actionButtons.forEach((btn) => {
    btn.disabled = false;
  });
}

//Disables buttons with the class of action button (bet, raise, fold, see)
function disableActionButtons() {
  actionButtons.forEach((btn) => {
    btn.disabled = true;
  });
}

//Basic dice roll function
function diceRoll(hand) {
  let roll = Math.floor(Math.random() * 6) + 1;
  return hand.push(roll);
}

//Basic function to disable a button
function disable(btn) {
  btn.disabled = true;
}

//Basic function to enable a button
function enable(btn) {
  btn.disabled = false;
}

// Function to roll the first three dice for each player
function playersRoll() {
  for (let i = 0; i < playerList.length; i++) {
    diceRoll(playerList[i].hand);
    diceRoll(playerList[i].hand);
    diceRoll(playerList[i].hand);
  }
}

//Sorts the hand for every player (from smallest to largest number) in an array
function rollSort() {
  for (let i = 0; i < playerList.length; i++) {
    playerList[i].hand.sort();
  }
}

//Clears the hand scores of each player for the next round of calculation
function clearHands() {
  communalRoll1 = [];
  communalRoll2 = [];
  for (let i = 0; i < playerList.length; i++) {
    playerList[i].hand = [];
    playerList[i].handScore = 0;
    playerList[i].handValue = 0;
    playerList[i].handName = "";
  }
}

//function to clear scores betweeb each round
function clearScores() {
  for (let i = 0; i < playerList.length; i++) {
    playerList[i].handScore = 0;
    playerList[i].handValue = 0;
    playerList[i].handName = "";
  }
}

//Evaluates the four dice hand of each player with their roll and the first com roll - need to check the probabilities of various hands so this list is a guess
function evaluateComRoll1(handArray, i) {
  if (handArray[0] === handArray[[3]]) {
    playerList[i].handScore = 6;
    playerList[i].handName = "Four-of-a-Kind";
  } else if (handArray[0] === handArray[2] || handArray[1] === handArray[3]) {
    playerList[i].handScore = 5;
    playerList[i].handName = "Three-of-a-Kind";
  } else if (handArray[0] === handArray[1] && handArray[2] === handArray[3]) {
    playerList[i].handScore = 4;
    playerList[i].handName = "Two Pair";
  } else if (
    handArray === [[1, 2, 3, 4]] ||
    handArray === [2, 3, 4, 5] ||
    handArray === [3, 4, 5, 6]
  ) {
    playerList[i].handScore = 3;
    playerList[i].handName = "Four-Dice-Straight"; // same with first roll - this can be improved
  } else if (
    handArray[0] === handArray[1] ||
    handArray[1] === handArray[2] ||
    handArray[2] === handArray[3]
  ) {
    playerList[i].handScore = 2;
    playerList[i].handName = "Pair";
  } else {
    playerList[i].handScore = 1;
    playerList[i].handName = "High Dice";
  }
}

//Evaluates the first roll of three dice - this can be used for each player
function evaluatePlayerRoll(handArray, i) {
  if (handArray[0] === handArray[2]) {
    playerList[i].handScore = 4;
    playerList[i].handName = "Three-of-a-Kind";
  } else if (handArray[0] === handArray[1] || handArray[1] === handArray[2]) {
    playerList[i].handScore = 2;
    playerList[i].handName = "Pair";
  } else if (
    handArray === [1, 2, 3] ||
    handArray === [2, 3, 4] ||
    handArray === [3, 4, 5] ||
    handArray === [4, 5, 6]
  ) {
    playerList[i].handScore = 1;
    playerList[i].handName = "Three dice straight"; // this can be split later on based on probability e.g. a straight in the middle is worth more as it has more chance, low straight is worth less
  } else {
    playerList[i].handScore = 1;
    playerList[i].handName = "High Dice";
  }
}

//Function to evaluate a full hand array of fice dice - i can reduce compolexity on the straights to match the firstplayerroll
function evaluateHand(handArray, i) {
  if (handArray[0] === handArray[4]) {
    playerList[i].handScore = 9;
    playerList[i].handName = "Five-of-a-Kind";
  } else if (handArray[0] === handArray[3] || handArray[1] === handArray[4]) {
    playerList[i].handScore = 8;
    playerList[i].handName = "Four-of-a-Kind";
  } else if (
    (handArray[0] === handArray[2] && handArray[3] === handArray[4]) ||
    (handArray[0] === handArray[1] && handArray[2] === handArray[4])
  ) {
    playerList[i].handScore = 7;
    playerList[i].handName = "Full House";
  } else if (
    handArray[0] === 2 &&
    handArray[1] === 3 &&
    handArray[2] === 4 &&
    handArray[3] === 5 &&
    handArray[4] === 6
  ) {
    playerList[i].handScore = 6;
    playerList[i].handName = "Six-High Straight";
  } else if (
    handArray[0] === 1 &&
    handArray[1] === 2 &&
    handArray[2] === 3 &&
    handArray[3] === 4 &&
    handArray[4] === 5
  ) {
    playerList[i].handScore = 5;
    playerList[i].handName = "Five-High Straight";
  } else if (
    handArray[0] === handArray[2] ||
    handArray[1] === handArray[3] ||
    handArray[2] === handArray[4]
  ) {
    playerList[i].handScore = 4;
    playerList[i].handName = "Three-of-a-Kind";
  } else if (
    (handArray[0] === handArray[1] && handArray[2] === handArray[3]) ||
    (handArray[0] === handArray[1] && handArray[3] === handArray[4]) ||
    (handArray[1] === handArray[2] && handArray[3] === handArray[4])
  ) {
    playerList[i].handScore = 3;
    playerList[i].handName = "Two Pair";
  } else if (
    handArray[0] === handArray[1] ||
    handArray[1] === handArray[2] ||
    handArray[2] === handArray[3] ||
    handArray[3] === handArray[4]
  ) {
    playerList[i].handScore = 2;
    playerList[i].handName = "Pair";
  } else {
    playerList[i].handScore = 1;
    playerList[i].handName = "High Dice";
  }

  //return handScore;
}

//Sums the score for the player's first roll. This is not an ideal solution as it is only for the one roll but I couldn't figure out how to do it better
function calculateValueScore(handArray, i) {
  for (let p = 0; p < handArray.length; p++) {
    if (roundCounter === 1) {
      playerList[i].handValue = handArray[0] + handArray[1] + handArray[2];
    } else if (roundCounter === 2) {
      playerList[i].handValue =
        handArray[0] + handArray[1] + handArray[2] + handArray[3];
    } else if (roundCounter === 3) {
      playerList[i].handValue =
        handArray[0] +
        handArray[1] +
        handArray[2] +
        handArray[3] +
        handArray[4];
    }
  }
  //return playerList;
}

//Shuffle function which would be used to shuffle the order of players - not in use at the moment
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

//Determines the winner based on the hand score and value (not yet) of each player. This needs to be updated to provide pot to winner, and to split pot between joint winners
function determineWinner() {
  let highestScore = 0;
  let highestValue = 0;

  //iterates through the player list to find the highest hand score
  for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].handScore > highestScore) {
      highestScore = playerList[i].handScore;
    }
  }

  //iterates through the player list to push any current player with the highest hand score to the scoreWinners list (can be more than one), and takes everyone else out of the round
  for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].handScore < highestScore && playerList[i].playingRound) {
      playerList[i].playingRound = false;
    }
  }

  //iterates through the player list to find the highest handvalue for players that are currently playing
  for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].handValue > highestValue && playerList[i].playingRound) {
      highestValue = playerList[i].handValue;
    }
  }

  for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].handValue == highestValue && playerList[i].playingRound) {
      playerList[i].winner = true;
    } else {
      playerList[i].playingRound = false;
    }
  }

  // log the winners
  for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].winner) {
      let winner = `${playerList[i].name} is the winner`;
      logEvent(winner);
    }
  }

  payout();
  return playerList;
}

//Function to pay the pot money to all winners - first it counts the number of winners then divides and distributes the pot
function payout() {
  let winnerCount = 0;
  for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].winner == true) {
      winnerCount++;
    }
  }

  let potSplit = pot / winnerCount;
  potSplit = Math.round(potSplit * 100) / 100;
  //potSplit.toFixed(2); // i will need to test this further for when there are three winners

  for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].winner == true) {
      playerList[i].money = playerList[i].money + potSplit;
    }
  }

  updateMoney();
  pot = 0;
  potDisplay.textContent = pot;
}

//Function to see if AI opponents will either bet, raise, fold, see - this will be adjusted for turns later
function firstRollAI(i) {
  if (playerList[i].playingRound) {
    confidenceModifier();
    playerList[i].confidence =
      playerList[i].handScore * confidenceMod + playerList[i].handValue;
    console.log(
      `${playerList[i].name} confidence is ${playerList[i].confidence}`
    );
    if (playerList[i].confidence >= 25) {
      raise(i);
      logRaise(playerList[i]);
    } else if (playerList[i].confidence < 25 && playerList[i].confidence > 15) {
      bet(i);
      logBet(playerList[i]);
    } else {
      fold(i);
      logFold(playerList[i]);
    } // no idea how to implement see yet
  } else {
    playingRoundCounter -= 1;
  }
}

//Function to see if AI opponents will either bet, raise, fold, see - this will be adjusted for turns later - maybe can combine functions later
function secondRollAI(i) {
  if (playerList[i].playingRound) {
    confidenceModifier();
    playerList[i].confidence =
      playerList[i].handScore * confidenceMod + playerList[i].handValue;
    console.log(
      `${playerList[i].name} confidence is ${playerList[i].confidence}`
    );
    if (playerList[i].confidence >= 40) {
      raise(i);
      logRaise(playerList[i]);
    } else if (playerList[i].confidence < 39 && playerList[i].confidence > 15) {
      bet(i);
      logBet(playerList[i]);
    } else {
      fold(i);
      logFold(playerList[i]);
    } // no idea how to implement see yet
  } else {
    playingRoundCounter -= 1;
  }
}

//Function to see if AI opponents will either bet, raise, fold, see - this will be adjusted for turns later - maybe can combine functions later
function finalRollAI(i) {
  if (playerList[i].playingRound) {
    confidenceModifier();
    playerList[i].confidence =
      playerList[i].handScore * confidenceMod + playerList[i].handValue;
    console.log(
      `${playerList[i].name} confidence is ${playerList[i].confidence}`
    );
    if (playerList[i].confidence >= 40) {
      raise(i);
      logRaise(playerList[i]);
    } else if (playerList[i].confidence < 39 && playerList[i].confidence > 15) {
      bet(i);
      logBet(playerList[i]);
    } else {
      fold(i);
      logFold(playerList[i]);
    } // no idea how to implement see yet
  } else {
    playingRoundCounter -= 1;
  }
}

//Function to increase the confidence of a player as per the remaining number of players - I will adjust the numbers later
function confidenceModifier() {
  if (playingRoundCounter == 4) {
    confidenceMod = 9;
  } else if (playingRoundCounter == 3) {
    confidenceMod = 10;
  } else if (playingRoundCounter == 2) {
    confidenceMod = 12;
  } else if (playingRoundCounter == 1) {
    confidenceMod = 100;
  }
  return confidenceMod;
}

//Function to increment rounds or set them to zero during play - this has replaced the round button so it can happen automatically, also sets the current bet back to 0
function roundCount() {
  if (roundCounter < 3) {
    roundCounter++;
  } else {
    roundCounter = 0;
  }
  currentBet = 0;
  roundDisplay.textContent = gameRound[roundCounter];
  return roundCounter;
}

//Function to enable/disable roll buttons based on the current round
function rollButtonPerRound() {
  if (roundCounter == 1) {
    disable(playerRollButton);
    enable(communalRollButton1);
  } else if (roundCounter == 2) {
    disable(communalRollButton1);
    enable(communalRollButton2);
  } else if (roundCounter == 3) {
    disable(communalRollButton2);
    enable(showButton);
  }
}

//Function to count the actions that a player has taken within a round - will begin with bets - expected to reset after each round
// function actionCounter(i){
//     playerList[i].bets ++;
//     if
// }

//Function to log bet values of a player
function logBet(player) {
  const gameLog = document.getElementById("gameLog");
  const logElem = document.createElement("div");

  logElem.textContent = player.name + " has betted $5";
  gameLog.insertBefore(logElem, gameLog.firstChild);
  //document.getElementById("gameLog").appendChild(logElem);
}

//Function to log raise values of a player
function logRaise(player) {
  const gameLog = document.getElementById("gameLog");
  const logElem = document.createElement("div");

  logElem.textContent = player.name + " has raised $10";
  gameLog.insertBefore(logElem, gameLog.firstChild);
  //document.getElementById("gameLog").appendChild(logElem);
}

//Function to log the fold of a player
function logFold(player) {
  const gameLog = document.getElementById("gameLog");
  const logElem = document.createElement("div");

  logElem.textContent = player.name + " has folded";
  gameLog.insertBefore(logElem, gameLog.firstChild);
  //document.getElementById("gameLog").appendChild(logElem);
}

//General function for adding a game event to the game log e.g. a new game has started
function logEvent(event) {
  const gameLog = document.getElementById("gameLog");
  const logElem = document.createElement("div");

  logElem.textContent = event;
  gameLog.insertBefore(logElem, gameLog.firstChild);
}

//Function to update the money in the playersMoneyDisplay for each player
function updateMoney() {
  //Selects list and deletes each item
  let li = document.getElementById("playersMoney");
  while (li.firstChild) {
    li.removeChild(li.firstChild);
  }
  //Creates a new list and adds each players money - this can later be split into a smaller function
  for (let i = 0; i < playerList.length; i++) {
    let li = document.createElement("li");
    li.innerText = "$" + playerList[i].money;
    playersMoneyDisplay.appendChild(li);
  }
  playerMoneyDisplay.textContent = playerList[0].money;
}
