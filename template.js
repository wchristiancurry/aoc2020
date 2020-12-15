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
  let startTime = performance.now();
  console.log('execution time: ' + (performance.now() - startTime));
}

function problem2(input) { 
  let startTime = performance.now();
  console.log('execution time: ' + (performance.now() - startTime));
}

var input = getInput();
console.log('problem 1: ' + problem1(input));
console.log('problem 2: ' + problem2(input));