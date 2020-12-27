const fs = require('fs');
const { performance } = require('perf_hooks');

function getInput() {
  try {
    input = fs.readFileSync('./in.txt', 'utf8');
    input = input.split("\n");
  } catch (err) {
    console.error(err);
  }

  return input;
}

function problem1(input) { 
  let player1 = [];
  let player2 = [];

  let index = parsePlayer(input, 1, player1);
  parsePlayer(input, index, player2);

  while(player1.length > 0 && player2.length > 0) {
    doRound(player1, player2);
  }

  return getWinnerScore(player1, player2);
}

function problem2(input) { 
  let player1 = [];
  let player2 = [];

  let index = parsePlayer(input, 1, player1);
  parsePlayer(input, index, player2);
  playGameProblem2(player1, player2);
  return getWinnerScore(player1, player2);
}

function playGameProblem2(player1, player2) {
  let turns = 0;
  let previousRounds = [];
  while(player1.length > 0 && player2.length > 0) {
    let isDuplicateRound = checkDuplicateRound(previousRounds, player1, player2);
    previousRounds.push({
      turns: turns++,
      player1Deck: player1.slice(),
      player2Deck: player2.slice()
    });

    if(isDuplicateRound) {
      player2 = []; //to force player1 win, make player2's deck empty
      return;
    } else {
      doRoundProblem2(player1, player2);
    }
  }
}

function doRoundProblem2(player1, player2) {
  let player1Card = player1.shift();
  let player2Card = player2.shift();

  if( (player1.length >= player1Card)
    && (player2.length >= player2Card) ) {
      let player1Wins = doRecursiveCombat(player1Card, player2Card, player1, player2);
      if(player1Wins) {
        player1.push(player1Card);
        player1.push(player2Card);
      } else {
        player2.push(player2Card);
        player2.push(player1Card);
      }
  } else {
    if(player1Card > player2Card) {
      player1.push(player1Card);
      player1.push(player2Card);
    } else {
      player2.push(player2Card);
      player2.push(player1Card);
    }
  }
}

function doRecursiveCombat(player1Length, player2Length, player1Original, player2Original) {
  let player1 = [];
  let player2 = [];

  for(let i = 0; i < player1Length; i++) {
    player1.push(player1Original[i]);
  }
  for(let i = 0; i < player2Length; i++) {
    player2.push(player2Original[i]);
  }

  playGameProblem2(player1, player2);
  return player1.length > 0;
}

function checkDuplicateRound(previousRounds, player1, player2) {
  for(let i = 0; i < previousRounds.length; i++) {
    let previousPlayer1 = previousRounds[i].player1Deck;
    let previousPlayer2 = previousRounds[i].player2Deck;

    let player1Same = compareArrays(previousPlayer1, player1);
    if(player1Same) {
      if(compareArrays(previousPlayer2, player2)) {
        return true;
      }
    }
  }

  return false;
}

function compareArrays(arr1, arr2) {
  if(arr1.length !== arr2.length) {
    return false;
  }

  for(let i = 0; i < arr1.length; i++) {
    if(arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

function getWinnerScore(player1, player2, forcePlayer1Win) {
  let winningDeck = (player1.length === 0) ? player2 : player1;
  let multiplier = 1;
  let score = 0;
  for(let i = winningDeck.length-1; i >= 0; i--) {
    score += (winningDeck[i] * multiplier);
    multiplier++;
  }

  return score;
}

function doRound(player1, player2) {
  let player1Card = player1.shift();
  let player2Card = player2.shift();

  if(player1Card > player2Card) {
    player1.push(player1Card);
    player1.push(player2Card);
  } else {
    player2.push(player2Card);
    player2.push(player1Card);
  }
}

function parsePlayer(input, index, arr) {
  let line = input[index];
  do {
    arr.push(parseInt(line));
    line = input[++index];
  } while (line && !line.includes('Player'));

  return index+=2; //skip player line and blank space
}

function solve() {
  var input = getInput();

  let startTime = performance.now();
  console.log('problem 1 solution: ' + problem1(input));
  console.log('problem 1 execution time: ' + (performance.now() - startTime) + ' ms');

  startTime = performance.now();
  console.log('problem 2 solution: ' + problem2(input));
  console.log('problem 2 execution time: ' + (performance.now() - startTime) + ' ms');
}

solve();