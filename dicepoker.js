//////////////////
//Global variables
//////////////////

class Person {
    constructor(name, skill, confidence, hand, handName, handScore, handValue, money, winner, playingRound) {
        this.name = name;
        this.skill = skill;
        this.confidence = confidence;
        this.hand = hand;
        this.handName = handName;
        this.handScore = handScore;
        this.handValue = handValue;
        this.money = money;
        this.winner = winner; 
        this.playingRound = playingRound
    }
}

let player = new Person('TJ', 0, 0, [], '', 0, 0, 100.00, false, true); //can be prompted for name but I removed as it was too annoying for testing
let opponent1 = new Person('Babbles', 5, 5, [], '', 0, 0, 100.00, false, true);
let opponent2 = new Person('Levi', 5, 5, [], '', 0, 0, 100.00, false, true);
let opponent3 = new Person('Macy', 5, 5, [], '', 0, 0, 100.00, false, true);
let opponent4 = new Person('Milo', 5, 5, [], '', 0, 0, 100.00, false, true);

let playerList = [player, opponent1, opponent2, opponent3, opponent4]

const gameDisplay = document.querySelector('#gameNumber');
const gameButton = document.querySelector('#gameButton');
const roundDisplay = document.querySelector('#round');

const potDisplay = document.querySelector('#pot');
const playerMoneyDisplay = document.querySelector('#playerMoney');

const playerListDisplay = document.querySelector('#playerList');

const communalRollDisplay = document.querySelector('#communalRoll');
const communalRollButton1 = document.querySelector('#rollButtonC1');
const communalRollButton2 = document.querySelector('#rollButtonC2');


const playerRollDisplay = document.querySelector('#playerRoll');
const playerRollButton = document.querySelector('#rollButtonP');

const playerHandNumberDisplay = document.querySelector('#playerHand');
const playerHandNameDisplay = document.querySelector('#hand');
const betButton = document.querySelector('#betButton');
const raiseButton = document.querySelector('#raiseButton');
const foldButton = document.querySelector('#foldButton');
const seeButton = document.querySelector('#seeButton');
const showButton = document.querySelector('#showButton');

const actionButtons = document.querySelectorAll('.actionButtons');

const allButtons = document.querySelectorAll('button');
allButtons.forEach(btn =>{
    btn.disabled = true;
    gameButton.disabled = false;
    playerRollButton.disabled = false;
})

let hand = '';
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



const gameRound = ['Pregame', 'One', 'Two', 'Showdown']



//////////////////////////////////////
//Button Listeners - in order of usage
//////////////////////////////////////

//Button to start a game and increase the game counter
gameButton.addEventListener('click', function(){
    gameDisplay.textContent = gameCounter++;
    roundDisplay.textContent = gameRound[roundCounter];
    disable(gameButton);
    enable(playerRollButton);
    clearHands();
    return gameCounter;
})

//Button to set the player list and the pot money for the first game that is started
gameButton.addEventListener('click', function(){
    if(isStartofGame){
        // prompt('How much money do you want to start with? (multiples of 5)'); - removed for now for speedier testing - set each player to have 100 instead
        playerMoneyDisplay.textContent = playerList[0].money;
        //shuffle(playerList); - removed for now for testing purposes
        for (let i = 0; i < playerList.length; i++){
            let li = document.createElement('li');
            li.innerText = playerList[i].name ;
            playerListDisplay.appendChild(li);
        }
    } else{
        playerList.unshift(playerList.pop()) //need to test this
        roundCount();
    }
    

    communalRollDisplay.textContent = null;
    playerRollDisplay.textContent = null;
    playerHandNumberDisplay.textContent = null;
    playerHandNameDisplay.textContent = null;

    return isStartofGame = false;
})


//Button to roll the first three dice for each player and add it to their hand. It also calculates the hand value, hand score, and hand name of their 3-dice roll 
playerRollButton.addEventListener('click', function(){
    roundCount()
    console.log(`Round count is: ${roundCounter}`)
    playersRoll();
    rollSort();
    playerRollDisplay.textContent = playerList[0].hand;
    playerHandNumberDisplay.textContent = playerList[0].hand;
    disable(playerRollButton);
    enableActionButtons();
    

    for(let i = 0; i < playerList.length; i++){
        calculateValueScore(playerList[i].hand, i); 
    }

    for(let i = 0; i < playerList.length; i++){
        evaluatePlayerRoll(playerList[i].hand, i); 
    }

    for(let i = 1; i < playerList.length; i++){
        firstRollAI(i);
    }
    // return playerList[0].hand; - do I need this
})

//Button to roll the first community dice. It also pushes that dice to all hands.
communalRollButton1.addEventListener('click', function(){
    roundCount()
    clearScores()

    diceRoll(communalRoll1)
    
    disable(communalRollButton1);
    enable(communalRollButton2);



    for(let i = 0; i < playerList.length; i++){
        playerList[i].hand.push(communalRoll1[0]);
    }
    rollSort();

    for(let i = 0; i < playerList.length; i++){
        calculateValueScore(playerList[i].hand, i); 
    }

    for(let i = 0; i < playerList.length; i++){
        evaluateComRoll1(playerList[i].hand, i); 
    }

    communalRollDisplay.textContent = communalRoll1;
    playerHandNumberDisplay.textContent = playerList[0].hand;

    for(let i = 1; i < playerList.length; i++){
        secondRollAI(i);
    }

    //return hands; 
})

//Button to roll the second community dice. It also pushes that dice to all hands and evaluates those hands and value scores.
communalRollButton2.addEventListener('click', function(){
    roundCount()
    clearScores()

    diceRoll(communalRoll2)
    
    disable(communalRollButton2);
    enable(showButton);



    for(let i = 0; i < playerList.length; i++){
        playerList[i].hand.push(communalRoll2[0]);
    }
    rollSort();

    communalRollDisplay.textContent = communalRoll1.concat(communalRoll2);
    playerHandNumberDisplay.textContent = playerList[0].hand;
    
    for(let i = 0; i < playerList.length; i++){
        evaluateHand(playerList[i].hand, i); 
    }

    for(let i = 0; i < playerList.length; i++){
        calculateValueScore(playerList[i].hand, i); 
    }

    for(let i = 1; i < playerList.length; i++){
        finalRollAI(i);
    }

    //for testing
    for(let i = 0; i < playerList.length; i++){
        console.log(`${playerList[i].name} has a ${playerList[i].handName} with rolls of ${playerList[i].hand} and a hand value of ${playerList[i].handValue}`); 
        
    }

    playerHandNameDisplay.textContent = playerList[0].handName;

})


//Button to bet. It is set to always bet $5, which can be adjusted in the future.
betButton.addEventListener('click', function(){
    //pot += 5;
    //bets the same for each player - will be changed

    disable(playerRollButton);
    enable(communalRollButton1);

    for (let i = 0; i < playerList.length; i++){
        pot += 5;
    }
    potDisplay.textContent = pot;
    return pot;
})


//Additional listener for the bet button which removed player money when they bet
betButton.addEventListener('click', function(){
    //playerList[0].money -= 5;

    //bets the same for each player - will be changed
    for (let i = 0; i < playerList.length; i++){
        playerList[i].money -= 5;
    }

    if (playerList[0].money < 5){
        disableActionButtons();
    } 
    playerMoneyDisplay.textContent = playerList[0].money;
    //return playerMoney;
})

//The show button determines the final winner for the game
showButton.addEventListener('click', function(){
    determineWinner()
    enable(gameButton);
})





////////////////////////
//Functions 
////////////////////////


//Bets $5 which will be the default for now. This function removed the money from the player, adds it to the pot, and then displays the pot. It also increased the current bet counter to 5 (which is relevant for limiting raising)
function bet(i){
    playerList[i].money -= 5;
    pot += 5;

    if(currentBet == 0 || currentBet == 5){
        currentBet += 5;
    }

    potDisplay.textContent = pot;
    return pot;
}

//Raises the current bet to 10 which is the limit for raising. It uses the same principles as the bet function, but will either increase an existing bet by 5 (making 10), or immediately raising to the limit of 10
function raise(i){
    if(currentBet == 0){
        playerList[i].money -= 10;
        pot += 10;
        currentBet += 10;
    } else if(currentBet == 5) {
        playerList[i].money -= 5;
        pot += 5;
        currentBet += 5; 
    }

    potDisplay.textContent = pot;
    return pot;
}

//Removes the player from playing the round/game
function fold(i){
    playerList[i].playingRound = false;
}

// removing this for now as it might be possible to just use the bet function repeatedly 
// function see(i){
//     playerList[i].money
// }

//Enables buttons with the class of action button (bet, raise, fold, see)
function enableActionButtons(){
    actionButtons.forEach(btn =>{
        btn.disabled = false;
    })
}

//Disables buttons with the class of action button (bet, raise, fold, see) 
function disableActionButtons(){
    actionButtons.forEach(btn =>{
        btn.disabled = true;
    })
}


//Basic dice roll function
function diceRoll(hand){
    let roll = Math.floor(Math.random() * 6) + 1;
    return hand.push(roll); 
}

//Basic function to disable a button
function disable(btn){
    btn.disabled = true;
}

//Basic function to enable a button
function enable(btn){
    btn.disabled = false;
}

// Function to roll the first three dice for each player
function playersRoll(){
    for(let i = 0; i < playerList.length; i++){
        diceRoll(playerList[i].hand)    
        diceRoll(playerList[i].hand)    
        diceRoll(playerList[i].hand)    
    }
}

//Sorts the hand for every player (from smallest to largest number) in an array
function rollSort(){
    for(let i = 0; i < playerList.length; i++){
        playerList[i].hand.sort(); 
        // console.log(playerList[i].hand) // this is for testing
    }
}

//Clears the hand scores of each player for the next round of calculation
function clearHands(){
    communalRoll1 = [];
    communalRoll2 = [];
    for (let i = 0; i < playerList.length; i++){
        playerList[i].hand = [];
        playerList[i].handScore = 0;
        playerList[i].handValue = 0;
        playerList[i].handName = '';
    } 
}

//function to clear scores betweeb each round
function clearScores(){
    for (let i = 0; i < playerList.length; i++){
        playerList[i].handScore = 0;
        playerList[i].handValue = 0;
        playerList[i].handName = '';
    } 
}

//Evaluates the four dice hand of each player with their roll and the first com roll - need to check the probabilities of various hands so this list is a guess
function evaluateComRoll1(handArray, i){
    if (handArray[0] === handArray[[3]]){
        playerList[i].handScore = 6;
        playerList[i].handName = 'Four-of-a-Kind';
    } else if (handArray[0] === handArray[2] || handArray[1] === handArray[3]){
        playerList[i].handScore = 5;
        playerList[i].handName = 'Three-of-a-Kind';
    } else if (handArray[0] === handArray[1] && handArray[2] === handArray[3]){
        playerList[i].handScore = 4;
        playerList[i].handName = 'Two Pair';
    } else if (handArray === [[1,2,3,4]] || handArray === [2,3,4,5] || handArray === [3,4,5,6]){
        playerList[i].handScore = 3;
        playerList[i].handName = 'Four-Dice-Straight'; // same with first roll - this can be improved
    } else if (handArray[0] === handArray[1] || handArray[1] === handArray[2] || handArray[2] === handArray[3]){
        playerList[i].handScore = 2;
        playerList[i].handName = 'Pair';
    } else{
        playerList[i].handScore = 1;
        playerList[i].handName = 'High Dice';
    }
}

//Evaluates the first roll of three dice - this can be used for each player
function evaluatePlayerRoll(handArray, i){
    if (handArray[0] === handArray[2]){
        playerList[i].handScore = 4;
        playerList[i].handName = 'Three-of-a-Kind';
    } else if (handArray[0] === handArray[1] || handArray[1] === handArray[2]){
        playerList[i].handScore = 2;
        playerList[i].handName = 'Pair';
    } else if (handArray === [1,2,3] || handArray === [2,3,4] || handArray === [3,4,5] || handArray === [4,5,6]){
        playerList[i].handScore = 1;
        playerList[i].handName = 'Three dice straight'; // this can be split later on based on probability e.g. a straight in the middle is worth more as it has more chance, low straight is worth less
    } else{
        playerList[i].handScore = 1;
        playerList[i].handName = 'High Dice';
    }
}

//Function to evaluate a full hand array of fice dice - i can reduce compolexity on the straights to match the firstplayerroll 
function evaluateHand(handArray, i){ 
    if (handArray[0] === handArray[4]){
        playerList[i].handScore = 9;
        playerList[i].handName = 'Five-of-a-Kind';
    } else if(handArray[0] === handArray[3] || handArray[1] === handArray[4]){
        playerList[i].handScore = 8;
        playerList[i].handName = 'Four-of-a-Kind';
    } else if(handArray[0] === handArray[2] && handArray[3] === handArray[4] || handArray[0] === handArray[1] && handArray[2] === handArray[4]){
        playerList[i].handScore = 7;
        playerList[i].handName = 'Full House';
    } else if(handArray[0] === 2 && handArray[1] === 3 && handArray[2] === 4 && handArray[3] === 5 && handArray[4] === 6){
        playerList[i].handScore = 6;
        playerList[i].handName = 'Six-High Straight';
    } else if(handArray[0] === 1 && handArray[1] === 2 && handArray[2] === 3 && handArray[3] === 4 && handArray[4] === 5){
        playerList[i].handScore = 5;
        playerList[i].handName = 'Five-High Straight';
    } else if(handArray[0] === handArray[2] || handArray[1] === handArray[3] || handArray[2] === handArray[4]){
        playerList[i].handScore = 4;
        playerList[i].handName = 'Three-of-a-Kind';
    } else if(  (handArray[0] === handArray[1] && handArray[2] === handArray[3]) || (handArray[0] === handArray[1] && handArray[3] === handArray[4]) || (handArray[1] === handArray[2] && handArray[3] === handArray[4])){
        playerList[i].handScore = 3;
        playerList[i].handName = 'Two Pair';
    } else if (handArray[0] === handArray[1] || handArray[1] === handArray[2] || handArray[2] === handArray[3] || handArray[3] === handArray[4]){
        playerList[i].handScore = 2;
        playerList[i].handName = 'Pair';
    } else{
        playerList[i].handScore = 1;
        playerList[i].handName = 'High Dice';
    }

    //return handScore;
};

//Sums the score for the player's first roll. This is not an ideal solution as it is only for the one roll but I couldn't figure out how to do it better
function calculateValueScore(handArray, i) {
    for (let p = 0; p < handArray.length; p++){
        
        if (roundCounter === 1){
            playerList[i].handValue = (handArray[0] + handArray[1] + handArray[2])
        } else if(roundCounter === 2){
            playerList[i].handValue = (handArray[0] + handArray[1] + handArray[2] + handArray[3])
        } else if(roundCounter === 3){
            playerList[i].handValue = (handArray[0] + handArray[1] + handArray[2] + handArray[3] + handArray[4])
        }
    }
    //return playerList;
  }


//Shuffle function which would be used to shuffle the order of players - not in use at the moment
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

//Determines the winner based on the hand score and value (not yet) of each player. This needs to be updated to provide pot to winner, and to split pot between joint winners
function determineWinner(){
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


    for (let i = 0; i < playerList.length; i++){
        if (playerList[i].handValue == highestValue && playerList[i].playingRound) {
            playerList[i].winner = true;
            } else{
                playerList[i].playingRound = false;
            }
    }

    // print the winners - this can be shortened
    for (let i = 0; i < playerList.length; i++){
        if (playerList[i].winner){
            console.log(`${playerList[i].name} is the winner`);
        }
    }

    payout();
    return playerList;
}

//Function to pay the pot money to all winners - first it counts the number of winners then divides and distributes the pot
function payout(){
    let winnerCount = 0;
    for (let i = 0; i < playerList.length; i++){
        if (playerList[i].winner == 2){
            winnerCount ++;
        } 
    }

    let potSplit = (pot / winnerCount);
    potSplit = Math.round(potSplit * 100) / 100;
    //potSplit.toFixed(2); // i will need to test this further for when there are three winners

    for (let i = 0; i < playerList.length; i++){
        if (playerList[i].winner == 2){
            playerList[i].money = playerList[i].money + potSplit;
        } 
    }

    pot = 0;

    //console log for testing purposes
    console.log(playerList[0].money)
    console.log(playerList[1].money)
    console.log(playerList[2].money)
    console.log(playerList[3].money)
    console.log(playerList[4].money)
}

//Function to see if AI opponents will either bet, raise, fold, see - this will be adjusted for turns later
function firstRollAI(i){
    if(playerList[i].playingRound){
        confidenceModifier();
        playerList[i].confidence = (playerList[i].handScore * confidenceMod) + playerList[i].handValue; 
        console.log(`${playerList[i].name} confidence is ${playerList[i].confidence}`);
        if(playerList[i].confidence >= 25){
            raise(i);
            console.log(`${playerList[i].name} has raised`)
        } else if(playerList[i].confidence < 25 && playerList[i].confidence > 15){
            bet(i);
            console.log(`${playerList[i].name} has betted`)
        } else{
            fold(i)
            console.log(`${playerList[i].name} has folded`)
        } // no idea how to implement see yet
    } else{
        playingRoundCounter -= 1;
    }
}

// need to increase the confidence if others have folded - will create an isPlaying counter

//Function to see if AI opponents will either bet, raise, fold, see - this will be adjusted for turns later - maybe can combine functions later
function secondRollAI(i){
    if(playerList[i].playingRound){
        confidenceModifier();
        playerList[i].confidence = (playerList[i].handScore * confidenceMod) + playerList[i].handValue; 
        console.log(`${playerList[i].name} confidence is ${playerList[i].confidence}`);
        if(playerList[i].confidence >= 40){
            raise(i);
            console.log(`${playerList[i].name} has raised`)
        } else if(playerList[i].confidence < 39 && playerList[i].confidence > 15){
            bet(i);
            console.log(`${playerList[i].name} has betted`)
        } else{
            fold(i)
            console.log(`${playerList[i].name} has folded`)
        } // no idea how to implement see yet
    } else{
        playingRoundCounter -= 1;
    }

}



//Function to see if AI opponents will either bet, raise, fold, see - this will be adjusted for turns later - maybe can combine functions later
function finalRollAI(i){
    if(playerList[i].playingRound){
        confidenceModifier();
        playerList[i].confidence = (playerList[i].handScore * confidenceMod) + playerList[i].handValue; 
        console.log(`${playerList[i].name} confidence is ${playerList[i].confidence}`);
        if(playerList[i].confidence >= 40){
            raise(i);
            console.log(`${playerList[i].name} has raised`)
        } else if(playerList[i].confidence < 39 && playerList[i].confidence > 15){
            bet(i);
            console.log(`${playerList[i].name} has betted`)
        } else{
            fold(i)
            console.log(`${playerList[i].name} has folded`)
        } // no idea how to implement see yet
    } else{
        playingRoundCounter -= 1;
    }
}

//Function to increase the confidence of a player as per the remaining number of players - I will adjust the numbers later
function confidenceModifier(){
    if (playingRoundCounter == 4){
        confidenceMod = 9;
    } else if(playingRoundCounter == 3){
        confidenceMod = 10;
    } else if(playingRoundCounter == 2){
        confidenceMod = 12;
    } else if(playingRoundCounter == 1){
        confidenceMod = 100;
    }
    return confidenceMod;
}


//Function to increment rounds or set them to zero during play - this has replaced the round button so it can happen automatically
function roundCount(){
    if (roundCounter < 3){
        roundCounter++;
    } else{
        roundCounter = 0;
    }
    roundDisplay.textContent = gameRound[roundCounter];
    return roundCounter;
}