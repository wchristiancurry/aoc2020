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

function problem1(input) {

  //each joltage adapter has specific output joltage
  //any adapter can take in 1, 2, or 3 jolts lower than rating and still produce output
  //device has built in joltage adapter rated for 3 jolts higher than the highest rated device
  //outlet has joltage rating of 0

  let indexesUsed = [];
  let differencesOfOne = 0;
  let differencesOfThree = 0;
  let joltage = 0;
  do {
    let [ nextMinimum, indexOfMinimum ] = getMinimumValueNotAlreadyUsed(input, indexesUsed);
    indexesUsed.push(indexOfMinimum);

    let difference = nextMinimum - joltage;
    if(difference === 1) {
      differencesOfOne += 1;
    } else if (difference === 3) {
      differencesOfThree += 1;
    }

    joltage = nextMinimum;
  } while(indexesUsed.length < input.length);

  let deviceBuiltInJoltage = joltage + 3;
  differencesOfThree += 1;

  return (differencesOfOne * differencesOfThree);
}

function getMinimumValueNotAlreadyUsed(input, indexesUsed) {
  let minimum = Number.MAX_SAFE_INTEGER;
  let indexOfMinimum = -1;

  input.forEach((number, index) => {
    if(!indexesUsed.includes(index)) {
      if(number < minimum) {
        minimum = number;
        indexOfMinimum = index;
      }
    }
  });

  return [ minimum, indexOfMinimum ];
}

//[0, 1, 4, 5, 6, 7, 10, 11, 12, 15, 16, 19]
function problem23(input) {
  input = input.sort(function(a,b){return a-b});
  input.unshift(0);
  
  let pathsPossible = []
  pathsPossible[0] = 1;
  for(let i = 1; i < input.length; i++) {
    let prev = (i-3 < 0) ? 0 : i-3; //go back up to 3 spaces (no point in going back further because input is sorted and numbers are unique)
    let iterationPaths = 0;
    for(let j = prev; j < i; j++) {
      if(input[i] - input[j] <= 3) {
        iterationPaths += pathsPossible[j];
      }
    }

    pathsPossible[i] = iterationPaths;
  }

  return pathsPossible[pathsPossible.length-1];
}

//this is really slow too and uses too much memory
function problem2(input) {
  input = input.sort(function(a,b){return a-b});

  let paths = [];
  let finalPaths = [];
  for(let i = 0; i <= input.length; i++) {
    paths[i] = [];
  }
  paths[0] = ['0'];

  //numbers in input are alwasy 1 and 3 apart even though the problem says 2 is possible
  //[0, 1, 4, 5, 6, 7, 10, 11, 12, 15, 16, 19]
  input.unshift(0);
  for(let i = 1; i < input.length; i++) {
    for(let j = 0; j < paths[i-1].length; j++) {
      let previous = getLast(paths[i-1][j]);
      
      for(let k = 0; k < 3; k++) {
        let index = getIndexInInput(input, previous)+1;
        let next = input[index+k];
        let difference = next-previous;
        if(difference <= 3 && difference > 0) {
          let newPath = paths[i-1][j] + ',' + next.toString();
          
          if(getLast(newPath) == Math.max(...input)) {
            finalPaths.push(newPath);
          } else {
            paths[i].push(newPath);
          }
        }
      }
    }
    console.log(i);
  }

  return finalPaths.length;
}

function getLast(path) {
  path = path.split(',');
  let previous = parseInt(path[path.length-1]);
  return previous;
}

function getIndexInInput(input, num) {
  for(let i = 0; i < input.length; i++) {
    if(input[i] === num) {
      return i;
    }
  }
}

//NOTE: way too slow

// function problem2() {
//   let combinations = [];
//   let joltage = 0;
//   let goal = Math.max(...input); //last element in the combination must be the highest number from the input

//   getCombinations(input, joltage, goal, [], combinations);
//   return combinations.length;
// }
// function getCombinations(input, joltage, goal, combination, combinations) {

//   for(let i = 1; i <= 3; i++) {
//     let newCombo = Array.from(combination);

//     let nextValue = getNextValueWithDifferenceFromJoltage(input, joltage, i);
//     if(nextValue != -1) {
//       newCombo.push(nextValue);
//       getCombinations(input, nextValue, goal, newCombo, combinations);
//     }

//     if(newCombo[newCombo.length-1] === goal) {
//       let arrayAlreadyFound = false;
//       for(let i = 0; i < combinations.length; i++) {
//         if(arraysEqual(combinations[i], newCombo)) {
//           arrayAlreadyFound = true;
//           break;
//         }
//       }

//       if(!arrayAlreadyFound) {
//         combinations.push(newCombo);
//       }
//     }
//   }
// }

// function getNextValueWithDifferenceFromJoltage(input, joltage, difference) {
//   for(let i = 0; i < input.length; i++) {
//     if((input[i] - joltage) === difference) {
//       return input[i];
//     }
//   }

//   return -1;
// }

// function arraysEqual(array1, array2){
//   if(array1.length !== array2.length) {
//     return false;
//   }

//   for(let i = 0; i < array1.length; i++){
//     if(array1[i] !== array2[i]) {
//       return false;
//     }
//   }

//   return true;
// }

var input = getInput();
console.log('problem 1: ' + problem1(input));
console.log('problem 2: ' + problem23(input));