const { group } = require('console');
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

function getUniqueCharacters(groupCharacters) {
  let uniqueCharacters = [];
  groupCharacters.split('').forEach((character) => {
    if(!uniqueCharacters.includes(character)) {
      uniqueCharacters.push(character);
    }
  });

  return uniqueCharacters;
}

function problem1(input) {
  let i = 0; 
  let groupCharacters = '';
  let totalYesCount = 0;
  while(i <= input.length) {
    if(input[i] == '' || i === input.length) {
      let uniqueCharacters = getUniqueCharacters(groupCharacters);
      totalYesCount += uniqueCharacters.length;
      groupCharacters = '';
    } else if(i !== input.length) {
      groupCharacters += input[i];
    }

    i++;
  }

  return totalYesCount;
}

function problem2(input) {
  let i = 0; 
  let groupCharacters = '';
  let groupPeopleCount = 0;
  let totalYesCount = 0;
  while(i <= input.length) {
    if(input[i] == '' || i === input.length) {
      //each character in groupCharacters has to occur x times (where x is equal to groupPeopleCount)
      let uniqueCharacters = getUniqueCharacters(groupCharacters);
      uniqueCharacters.forEach((uniqueCharacter) => {
        let count = (groupCharacters.match(new RegExp(uniqueCharacter, "g")) || []).length;
        if(count == groupPeopleCount) {
          totalYesCount += 1;
        }
      });
      groupPeopleCount = 0;
      groupCharacters = '';
    } else if(i !== input.length) {
      groupCharacters += input[i];
      groupPeopleCount += 1;
    }

    i++;
  }

  return totalYesCount;
}

var input = getInput();
console.log('problem 1: ' + problem1(input));
console.log('problem 2: ' + problem2(input));

