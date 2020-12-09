const fs = require('fs');

function getInput() {
  try {
    input = fs.readFileSync('./in.txt', 'utf8');
    input = input.split("\n");

    for(let i = 0; i < input.length; i++) {
      input[i] = parseInt(input[i]);
    }
  } catch (err) {
    console.error(err);
  }

  return input;
}

function findInvalidNumber(input, preambleLength) {
  for(let i = preambleLength; i < input.length; i++) {
    let num1 = input[i];
    
    let validNumberFound = false;
    for(let j = (i - preambleLength); j < i; j++) {
      let num2 = input[j];
      if(num2 >= num1) {
        continue;
      } else {
        let num3 = num1 - num2
        if(num3 === num2) {
          continue;
        } else {
          for(let k = (i - preambleLength); k < i; k++) {
            let num4 = input[k];
            if(num4 === num3) {
              validNumberFound = true;
              break;
            };
          }
        }
      }

      if(validNumberFound) {
        break;
      }
    }

    if(!validNumberFound) {
      return num1;
    }
  }
}

function problem1(input) { 
  let preambleLength = 25;
  return findInvalidNumber(input, preambleLength);
}

function problem2(input) { 
  let preambleLength = 25;
  let invalidNumber = findInvalidNumber(input, preambleLength);

  //find some set of conitigous numbers that adds up to the invalid number

  let setSize = 2;
  let set = [];
  let setFound = false;
  while(!setFound) {
    for(let i = 0; i < input.length; i++) {
      let result = 0;
      for(let j = 0; j < setSize; j++) {
        result += input[i+j];
        set.push(input[i+j]);
      }

      if(result === invalidNumber) {
        setFound = true;
        break;
      } else {
        set = [];
      }
    }

    if(!setFound) {
      setSize++;
    }
  }

  let weakness = Math.max(...set) + Math.min(...set);
  return weakness;
}

var input = getInput();
console.log('problem 1: ' + problem1(input));
console.log('problem 2: ' + problem2(input));