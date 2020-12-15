const fs = require('fs');
const { performance } = require('perf_hooks');

function problem1(input, stop) { 
  let startTime = performance.now();
  let solution = spokenNumberGame(input, stop);
  console.log('execution time: ' + (performance.now() - startTime));
  return solution;
}

function problem2(input, stop) { 
  let startTime = performance.now();
  let solution = spokenNumberGame(input, stop);
  console.log('execution time: ' + (performance.now() - startTime));
  return solution;
}

function spokenNumberGame(input, stop) {
  let spokenNumbers = new Map();
  let previousNumber;
  let currentNumber;
  for(let i = 1; i <= stop; i++) {
    if((i-1) < input.length) {
      currentNumber = input[i-1];
    } else {
      let previousTurnsSpoken = spokenNumbers.get(previousNumber);
      if(previousTurnsSpoken.length === 1) {
        currentNumber = 0;
      } else {
        let mostRecent = previousTurnsSpoken[previousTurnsSpoken.length-1];
        let nextMostRecent = previousTurnsSpoken[previousTurnsSpoken.length-2];
        currentNumber = mostRecent - nextMostRecent;
      }
    }

    let turnsSpoken = spokenNumbers.get(currentNumber);
    if(turnsSpoken) {
      turnsSpoken.push(i);
      spokenNumbers.set(currentNumber, turnsSpoken);
    } else {
      spokenNumbers.set(currentNumber, [i]);
    }

    previousNumber = currentNumber;
  }

  return currentNumber;
}

let input = [5,2,8,16,18,0,1];
console.log('problem 1: ' + problem1(input, 2020));
console.log('problem 2: ' + problem2(input, 30000000));