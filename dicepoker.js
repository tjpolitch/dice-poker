let comDie = {
    die1: diceRoll(),
    die2: diceRoll(),
}

let playerHand = {
    die1: diceRoll(),
    die2: diceRoll(),
    die3: diceRoll(),
    die4: diceRoll(), //just for testing
    die5: diceRoll()  //just for testing
}

const playerFullHand = Object.values(playerHand);
console.log(playerFullHand);

let opponent1Hand = {
    die1: diceRoll(),
    die2: diceRoll(),
    die3: diceRoll(),
    die4: diceRoll(), //just for testing
    die5: diceRoll()  //just for testing
}

const opponentFullHand = Object.values(opponent1Hand);
console.log(opponentFullHand);

let opponent2Hand = {
    die1: diceRoll(),
    die2: diceRoll(),
    die3: diceRoll()
}



const gameRound = ['Round One', 'Round Two', 'Showdown']

function diceRoll(){
    let roll = Math.floor(Math.random() * 6) + 1;
    return roll; 
}


//console.log('Rolling dice...');
console.log(`You rolled ${playerHand.die1}, ${playerHand.die2}, and ${playerHand.die3}`);

//console.log('Do you want to bet?')

let testHand1 = [3,2,1,4,5];
let testHand2 = [1,3,3,4,5];
let testHand3 = [4,4,2,2,2];
let testHand4 = [6,6,6,6,6];
let testHand5 = [3,3,3,3,4];
let testHand6 = [1,3,3,1,3];
let testHand7 = [1,1,1,3,3];
let testHand8 = [2,3,4,5,6];
let testHand9 = [1,2,2,2,6];
let testHand10 = [1,2,2,3,3];
let testHand11 = [1,2,3,4,6];

let valueScoreP = 0;
let valueScoreO = 0;

function calculateValueScore(arr, value) {
    for (let a of arr) {
      value += a;
    }
    return value;
  }



function evaluateHand(arr){
    
    let hand = '';
    let handScore = 0

    const handArray = arr.sort();
    // calculateValueScore(handArray);  


    // Count the occurance of a number
    // const occurrences = {};
    // handArray.forEach((number) => {
    //     occurrences[number] = (occurrences[number] || 0) + 1;
    // });

    // console.log(`The count for number 1 is: ${occurrences[1]}`)
    

    if (handArray[0] === handArray[4]){
        handScore = 1;
        hand = 'Five-of-a-Kind';
    } else if(handArray[0] === handArray[3]){
        handScore = 2;
        hand = 'Four-of-a-Kind';
    } else if(handArray[0] === handArray[2] && handArray[3] === handArray[4] || handArray[0] === handArray[1] && handArray[2] === handArray[4]){
        handScore = 3;
        hand = 'Full House';
    } else if(handArray[0] === 2 && handArray[1] === 3 && handArray[2] === 4 && handArray[3] === 5 && handArray[4] === 6){
        handScore = 4;
        hand = 'Six-High Straight';
    } else if(handArray[0] === 1 && handArray[1] === 2 && handArray[2] === 3 && handArray[3] === 4 && handArray[4] === 5){
        handScore = 5;
        hand = 'Five-High Straight';
    } else if(handArray[0] === handArray[2] || handArray[1] === handArray[3] || handArray[2] === handArray[4]){
        handScore = 6;
        hand = 'Three-of-a-Kind';
    } else if(  (handArray[0] === handArray[1] && handArray[2] === handArray[3]) || (handArray[0] === handArray[1] && handArray[3] === handArray[4]) || (handArray[1] === handArray[2] && handArray[3] === handArray[4])){
        handScore = 7;
        hand = 'Two Pair';
    } else if (handArray[0] === handArray[1] || handArray[1] === handArray[2] || handArray[2] === handArray[3] || handArray[3] === handArray[4]){
        handScore = 8;
        hand = 'Pair';
    } else{
        handScore = 9;
        hand = 'High Dice';
    }


    // console.log(`You rolled: ${handArray[0]}, ${handArray[1]}, ${handArray[2]}, ${handArray[3]}, ${handArray[4]}`)
    // console.log(`Value Score is: ${valueScore}`);
    // console.log(`Hand Score is: ${handScore}`);
    // console.log(`Hand is: ${hand}`);

    return handScore
};

let playerHandScore = evaluateHand(playerFullHand);
let playerHandValue = calculateValueScore(playerFullHand, valueScoreP);
console.log(playerHandScore);
console.log(playerHandValue);

let opponentHandScore = evaluateHand(opponentFullHand);
let opponentHandValue = calculateValueScore(opponentFullHand, valueScoreO)
console.log(opponentHandScore);
console.log(opponentHandValue);

function evaluateWinner(p, o, pv, ov){
    if (p < o){
        console.log('Player wins!')
    } else if(p > o){
        console.log('Opponent wins!')
    } else {
        if (pv < ov){
            console.log('Opponent wins!')    
        } else if(pv > o){
            console.log('Player wins!')
        } else{
            console.log('Split pot!')
        }
    }
}

evaluateWinner(playerHandScore, opponentHandScore, playerHandValue, opponentHandValue);


