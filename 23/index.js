const fs = require('fs');
const { performance } = require('perf_hooks');

function getInput() {
  try {
    input = fs.readFileSync('./in.txt', 'utf8');
    // input = input.split("\n");
  } catch (err) {
    console.error(err);
  }

  return input;
}

function problem1(input) { 
  input = input.split('').map(i => parseInt(i));
  return doCupGame(input, 100);
}

function problem2(input) { 
  input = input.split('').map(i => parseInt(i));
  let max = Math.max(...input);
  for(let i = input.length; i < 1000000; i++) {
    input.push(max+i);
  }
  let s = input.toString();
  s = s.replace(/,/g, '');
  console.log(s.length);
  let a = BigInt(s);
  console.log(a);
  doCupGame(input, 10000000);
}

function doCupGame(input, numMoves) {
  let move = 1;

  let minCupValue = Number.MAX_SAFE_INTEGER;
  let maxCupValue = -1;
  for(let i = 0; i < input.length; i++) {
    let val = input[i];
    if(val < minCupValue) {
      minCupValue = val;
    }

    if(val > maxCupValue) {
      maxCupValue = val;
    }
  }

  let currentCupIndex = 0;
  let destination = 0;
  while(move <= numMoves) {
    // console.log('move ' + move);
    // console.log(input);

    //get pick up cups
    let pickUp = [];
    for(let i = currentCupIndex+1; i < currentCupIndex+4; i++) {
      let idx = getWrapAroundIndex(i, input.length);
      pickUp.push(input[idx]);
    }

    //remove pick up cups from circle
    for(let i = 0; i < pickUp.length; i++) {
      let idx = -1;
      for(let j = 0; j < input.length; j++) {
        if(input[j] === pickUp[i]) {
          idx = j;
          break;
        }
      }

      input[idx] = undefined;
    }

    //get destination
    destination = input[currentCupIndex]-1;
    while(!input.includes(destination)) {
      destination -= 1;
      if(destination < minCupValue) {
        destination = maxCupValue;
      }

      if(destination === undefined) {
        destination = -1;
      }
    }

    let destinationIndex = -1;
    for(let i = 0; i < input.length; i++) {
      if(input[i] === destination) {
        destinationIndex = i;
        break;
      }
    }

    //add pick up cups to the right of the destination cup
    for(let i = 0; i < pickUp.length; i++) {
      //always insert at destinationIndex
      //shift the element at destinationIndex to the left, then insert
      //if theres something to the left of what is shifted, shift it as well
      //if not, stop
      let tmp = input[destinationIndex];
      input[destinationIndex] = pickUp[i];

      let idx = getWrapAroundIndex(destinationIndex-1, input.length);
      do {
        let newtmp = input[idx];
        input[idx] = tmp;
        tmp = newtmp;
        idx = getWrapAroundIndex(idx-1, input.length);
      } while (tmp !== undefined);
    }

    currentCupIndex = getWrapAroundIndex(currentCupIndex+1, input.length);

    // console.log('pick up: ' + pickUp);
    // console.log('destination: ' + destination);
    // console.log();
    move++;
   }

  let finalCupConfig = input;

  let indexOfCupOne = -1;
  for(let i = 0; i < finalCupConfig.length; i++) {
    if(finalCupConfig[i] === 1) {
      indexOfCupOne = i;
    }
  }

  let i = 0;
  let solution = '';
  let index = indexOfCupOne+1;
  while(i < finalCupConfig.length-1) {
    index = getWrapAroundIndex(index, input.length);
    solution += finalCupConfig[index].toString();
    i++;
    index++;
  }

  return solution;
}

function getWrapAroundIndex(index, length) {
  if(index >= length) {
    index = (index-length);
  }

  if(index < 0) {
    index = length-1;
  }

  return index;
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