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

function parseBinaryPartitioning(binaryParitionString, upper, lower, upChar) {
  for(let i = 0; i < binaryParitionString.length; i++) {
    if(binaryParitionString[i] === upChar) {
      upper -= Math.ceil((upper-lower)/2);
    } else {
      lower += Math.ceil((upper-lower)/2);
    }
  }

  return upper;
}

function problem1(input) {
  let highestSeatId = -1;
  input.forEach((boardingPass) => {
    
    //first seven characters are row
    let row = parseBinaryPartitioning(boardingPass.substring(0, 7), 127, 0, 'F');

    //last three characters are column
    let col = parseBinaryPartitioning(boardingPass.substring(7, boardingPass.length), 7, 0, 'L');

    let seatId = (row * 8) + col;
    if(seatId > highestSeatId) {
      highestSeatId = seatId;
    }
  });

  return highestSeatId;
}

function problem2(input) { 
  //lowest seat = 13
  //highest seat = 978
  //won't be row 0 or row 127 
  //row 0 ids (0 - 7)
  //row 127 ids (1024 + 1031)
  let highestSeatId = -1;
  let lowestSeatId = Number.MAX_SAFE_INTEGER;
  let seatIds = []
  input.forEach((boardingPass) => {
    
    //first seven characters are row
    let row = parseBinaryPartitioning(boardingPass.substring(0, 7), 127, 0, 'F');

    //last three characters are column
    let col = parseBinaryPartitioning(boardingPass.substring(7, boardingPass.length), 7, 0, 'L');

    let seatId = (row * 8) + col;
    if(seatId > highestSeatId) {
      highestSeatId = seatId;
    }
    if(seatId < lowestSeatId) {
      lowestSeatId = seatId;
    }

    seatIds.push(seatId);
  });

  //we have lowestSeatId and highestSeatId
  //It can't be less than lowestSeatId and greater than highestSeatId (because our ID has a neighbor on each side +1, -1)
  //so it must be somewhere x > lowestSeatId && x < highestSeatId

  seatIds = seatIds.sort();
  seatIds.sort(function(a, b){return a-b});

  let missingSeatId = -1
  for(let i = 0; i < seatIds.length; i++) {
    if((seatIds[i+1] - seatIds[i]) > 1) {
      missingSeatId = seatIds[i+1]-1;
      break;
    }
  }

  return missingSeatId;
}

var input = getInput();
console.log('problem 1: ' + problem1(input));
console.log('problem 2: ' + problem2(input));