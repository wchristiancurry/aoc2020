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
  let subject = 7;  
  let cardPublicKey = parseInt(input[0]);
  let doorPublicKey = parseInt(input[1]);

  let cardPublicKeyLoop = findLoop(subject, cardPublicKey);
  let doorPublicKeyLoop = findLoop(subject, doorPublicKey);

  return transform(doorPublicKey, cardPublicKeyLoop);
}

function problem2(input) { 
}

function findLoop(subject, publicKey) {
  let loop = 0;
  let value = 1;
  while(value != publicKey) {
    value = transformValue(value, subject);
    loop += 1;
  }

  return loop;
}

function transform(subject, loop) {
  let i = 0;
  let value = 1;
  while(i < loop) {
    value = transformValue(value, subject);
    i++;
  }

  return value;
}

function transformValue(value, subject) {
  value = value * subject;
  value = value % 20201227;
  return value;
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