const fs = require('fs');

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
  let earliestTimestamp = parseInt(input[0]);
  let busIds = input[1].split(',');

  let earliestValidTimestamp = Number.MAX_SAFE_INTEGER;
  let busIdIndex = -1;
  for(let i = 0; i < busIds.length; i++) {
    let busId = busIds[i];

    if(busId === 'x') {
      //bus is out out service
      continue;
    } else {
      busId = parseInt(busId);
      let potential = Math.floor(earliestTimestamp / busId);
      potential = potential * busId;

      while(potential < earliestTimestamp) {
        potential += busId;
      }

      if(potential < earliestValidTimestamp) {
        earliestValidTimestamp = potential;
        busIdIndex = i;
      }
    }
  }

  let waitTime = earliestValidTimestamp - earliestTimestamp;
  let result = parseInt(busIds[busIdIndex]) * waitTime;
  return result;
}

function problem2(input) {
  let busIds = input[1].split(',');

  let checkIndex = busIds.length-1;
  let timestamp = parseInt(busIds[0]);
  let addToTimestamp = timestamp;

  let iterations = 0;
  while(checkIndex > 0) {

    if(busIds[checkIndex] === 'x') {
      checkIndex -= 1;
    } else {
      let busId = parseInt(busIds[checkIndex]);
      [addToTimestamp, timestamp] = findCommon(busId, checkIndex, timestamp, addToTimestamp);
      checkIndex -= 1;

      if(checkIndex == 0 || noValidNumbersRemain(busIds, checkIndex)) { //verify we're done checking numbers (don't need to check first again) or only x's remain
        return timestamp;
      }
    }
    
    
    iterations += 1;
  }
}

function findCommon(busId, checkIndex, timestamp, addToTimestamp) {
  while(true) {
    //the goal is a valid timestamp (at timestamp) plus whatever spot in the array we're looking at. That goal should be divisible by busId
    let goal = timestamp + checkIndex; 
    if(goal % busId === 0) {

      //get a first timestamp divisible by original number.
      //adding to this timestamp "checkIndex" we also know that the busId at "checkIndex" is also divisible. Same for any busId already processed 
      let firstTimestamp = timestamp;
      while(true) {
        timestamp += addToTimestamp;
        goal = timestamp + checkIndex;
        if(goal % busId === 0) {
          //get a second timestamp to get difference between two timestamps. Now we can increase "timestamp" by this amount,
          //because only numbers divisble by timestamp-firstTimestamp will be valid for the first busId, this busId, and any others already processed
          return [timestamp-firstTimestamp, firstTimestamp];
        }
      }
    } else {
      timestamp += addToTimestamp;
    }
  }
}

function noValidNumbersRemain(busIds, checkIndex) {
  for(let i = checkIndex; i > 0; i--) { //already know first number is done, so don't need to check
    if(busIds[i] !== 'x') {
      return false;
    }
  }

  return true;
}

var input = getInput();
console.log('problem 1: ' + problem1(input));
console.log('problem 2: ' + problem2(input));