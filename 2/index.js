const fs = require('fs');

var input;
try {
  input = fs.readFileSync('./in.txt', 'utf8');
  input = input.split("\n");
} catch (err) {
  console.error(err);
}

function parseElement(element) {
  let lowerLimit = element.split("-", 2)[0];
  let upperLimit = element.split("-", 2)[1];
  let requiredCharacter = upperLimit.split(" ", 2)[1].substring(0, 1);
  upperLimit = upperLimit.split(" ", 2)[0];
  let password = element.split(":", 2)[1].trim();

  lowerLimit = parseInt(lowerLimit, 10);
  upperLimit = parseInt(upperLimit, 10);

  return [ lowerLimit, upperLimit, requiredCharacter, password ];
}

function problem1(input) {
  let validCount = 0;
  input.forEach(element => {
    let [ lowerLimit, upperLimit, requiredCharacter, password ] = parseElement(element);

    let occurances = password.split(requiredCharacter).length - 1;
    if (occurances >= lowerLimit && occurances <= upperLimit) {
      validCount += 1;
    }
  });

  return validCount;
}

function problem2(input) {
  let validCount = 0;
  input.forEach(element => {
    let [ index1, index2, requiredCharacter, password ] = parseElement(element);
    if(password[index1-1] === requiredCharacter 
        && password[index2-1] !== requiredCharacter) {
      validCount += 1;
    } else if(password[index1-1] !== requiredCharacter 
        && password[index2-1] === requiredCharacter) {
      validCount += 1;
    }
  })


  return validCount;
}

console.log('problem1: ' + problem1(input));
console.log('problem2: ' + problem2(input));