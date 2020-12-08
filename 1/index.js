const fs = require('fs');

var input;
try {
  input = fs.readFileSync('./in.txt', 'utf8');
  input = input.split("\n").map((item) => {
    return parseInt(item, 10)
  });
} catch (err) {
  console.error(err);
}

function problem1(input) {
  for(var i = 0; i < input.length; i++) {
    for(var j = 0; j < input.length; j++) {

      if((input[i] + input[j]) == 2020) {
        result = input[i] * input[j];
        return result;
      }
    }
  }
}

function problem2(input) {
  for(var i = 0; i < input.length; i++) {
    for(var j = 1; j < input.length; j++) {
      var result1 = input[i] + input[j];

      if(result1 < 2020) {
        for(var k = 0; k < input.length; k++) {

          if((result1 + input[k]) == 2020) {
            return input[i] * input[j] * input[k];
          }
        }
      }
    }
  }
}

let result1 = problem1(input);
let result2 = problem2(input);
console.log('problem 1: ' + result1);
console.log('problem 2: ' + result2);