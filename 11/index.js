const fs = require('fs');

function getInput() {
  try {
    input = fs.readFileSync('./in.txt', 'utf8');
    input = input.split("\n");

    //probably will be easier to work with nested array instead of the string
    for(let i = 0; i < input.length; i++) {
      input[i] = input[i].split('');
    }
  } catch (err) {
    console.error(err);
  }

  return input;
}

function shiftSeats(input, adjacentSeatTolerance, getOccupied) {
  let nestedArraysEqual = false;
  let originalState = deepCopyNested(input);
  let workingState = deepCopyNested(input);
  let previousState = deepCopyNested(input);
  do {
    // printBoard(originalState);
    for(let i = 0; i < originalState.length; i++) {
      for(let j = 0; j < originalState[i].length; j++) {

        if(originalState[i][j] === '.') {
          //nobody will sit here
          continue;
        }

        let numOccupied = getOccupied(originalState, i, j);

        if(originalState[i][j] === 'L') {
          //If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
          if(numOccupied === 0) {
            workingState[i][j] = '#';
          }
        } else if(originalState[i][j] === '#') {
          //and four or more seats adjacent to it are also occupied, the seat becomes empty.
          if(numOccupied >= adjacentSeatTolerance){
            workingState[i][j] = 'L';
          }
        }
      }
    }

    if(nestedArraysAreEqual(workingState, previousState)) {
      nestedArraysEqual = true;
      return countOccupied(workingState);
    } else {
      previousState = deepCopyNested(workingState);
      originalState = deepCopyNested(workingState);
    }
  } while(!nestedArraysEqual);
}

function getOccupiedImmediatelyAdjacent(originalState, i, j) {
  let numOccupied = 0;
  // console.log('checking i: ' + i + ', j: ' + j);
  for(let k = -1; k <= 1; k++) {
    for(let l = -1; l <= 1; l++) {
      // console.log('i: ' + (i+k) + ', j: ' + (j+l));
      if((i + k) >= 0 
          && (j + l) >= 0
          && (i + k) < originalState.length
          && (j + l) < originalState[i].length
          && !((i + k) === i && (j + l) === j))  {
        let spot = originalState[i+k][j+l];
        if(spot === '#') {
          numOccupied += 1;
        }
      }
    }
  }

  return numOccupied;
}

function getOccupiedDistancedAdjacent(originalState, i, j) {
  let numOccupied = 0;
  
  for(let k = -1; k <= 1; k++) {
    for(let l = -1; l <= 1; l++) {
      
      if(k === 0 && l === 0) {
        continue;
      }

      let x = k;
      let y = l;
      do {
        if((i + x) >= 0 
            && (j + y) >= 0
            && (i + x) < originalState.length
            && (j + y) < originalState[i].length
            && !((i + x) === i && (j + y) === j))  {
          let spot = originalState[i+x][j+y];
          if(spot === '#') {
            numOccupied += 1;
            break;
          } else if(spot === 'L') {
            break;
          }
        }

        x += k;
        y += l;
      } while((i + x) >= 0 
          && (j + y) >= 0
          && (i + x) < originalState.length
          && (j + y) < originalState[i].length);

    }
  }

  return numOccupied;
}

function deepCopyNested(array) {
  let copy = [];
  for (let i = 0; i < array.length; i++) {
    copy[i] = array[i].slice();
  }
  return copy;
}

function printBoard(input) {
  for(let i = 0; i < input.length; i++) {
    let line = '';
    for(let j = 0; j < input[i].length; j++) {
      line += input[i][j];
    }
    console.log(line);
  }
  console.log('');
}

function countOccupied(input) {
  let numOccupied = 0;
  for(let i = 0; i < input.length; i++) {
    for(let j = 0; j < input[i].length; j++) {
      if(input[i][j] == '#') {
        numOccupied += 1;
      }
    }
  }

  return numOccupied;
}

function nestedArraysAreEqual(array1, array2) {
  if(array1.length !== array2.length) {
    return false;
  }

  for(let i = 0; i < array1.length; i++) {
    
    if(array1[1].length !== array2[i].length) {
      return false;
    }

    for(let j = 0; j < array1.length; j++) {
      if(array1[i][j] !== array2[i][j]) {
        return false;
      }
    }
  }

  return true;
}

function problem1(input) {
  return shiftSeats(input, 4, getOccupiedImmediatelyAdjacent);
}

function problem2(input) { 
  return shiftSeats(input, 5, getOccupiedDistancedAdjacent);
}

var input = getInput();
console.log('problem 1: ' + problem1(input));
console.log('problem 2: ' + problem2(input));