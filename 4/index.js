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

function getNumValidPassports(input, validationMethod) {
  let i = 0;
  let numValid = 0;
  let passport = [];
  while(i < input.length) {
    if(input[i] !== '') {
      let passportData = input[i].split(" ");
      passport = passport.concat(passportData);
    } else {
      numValid = validationMethod(passport) ? numValid+1 : numValid;
      passport = [];
    }

    i++;
  }

  return numValid;
}

function checkIfPassportValid(passport) {
  if(checkPassportContainsRequiredFields(passport)) {
    return checkPassportContainsValidValues(passport);
  }

  return false;
}

function checkPassportContainsRequiredFields(passport) {
  let fields = [];
  passport.forEach((keyAndValue) => {
    fields = fields.concat(keyAndValue.split(':', 1));
  });

  let passportCheck = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
  let isValid = true;
  passportCheck.forEach((fieldName) => {
    if(!fields.includes(fieldName)) {
      isValid = false;
      return;
    }
  });

  return isValid;
}

function checkPassportContainsValidValues(passport) {
  let isValid = true;
  passport.forEach((keyAndValue) => {
    [ key, value ] = keyAndValue.split(':');
    if(!valueIsValid(key, value)) {
      isValid = false;
      return;
    }
  });
  
  return isValid;
}

function valueIsValid(key, value) {
  switch(key) {
    case 'byr':
      return numberIsValid(value, 4, 1920, 2002);
    case 'iyr':
      return numberIsValid(value, 4, 2010, 2020);
    case 'eyr':
      return numberIsValid(value, 4, 2020, 2030);
    case 'hgt':
      return heightIsValid(value);
    case 'hcl':
      return hairColorIsValid(value);
    case 'ecl':
      return eyeColorIsValid(value);
    case 'pid':
      return (value.toString().length !== 9) ? false : true;
    case 'cid':
      //TODO: doesn't matter what this is, whether its here or not
      return true;
    default:
      return false;
  }
}

function numberIsValid(numberString, numDigits, minValue, maxValue) {
  try {
    if(numberString.length > numDigits) {
      return false;
    }

    let number = parseInt(numberString);
    if(number < minValue || number > maxValue) {
      return false;
    }
  } catch (err) {
    return false;
  }

  return true;
}

function heightIsValid(heightString) {
  try {
    let height = parseInt(heightString.match(/\d+/g)[0]);
    let units = heightString.match(/[a-zA-Z]+/g)[0];

    if(units === 'in') {
      if(height < 59 || height > 76) {
        return false;
      }
    } else if(units === 'cm') {
      if(height < 150 || height > 193) {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }

  return true;
}

function hairColorIsValid(value) {
  if(value.length !== 7) {
    return false;
  }

  if(value[0] !== '#') {
    return false;
  }

  let isValid = new RegExp(/^[a-f0-9]+$/).test(value.substring(1));
  return isValid;
}

function eyeColorIsValid(value) {
  let validEyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
  if(validEyeColors.includes(value)) {
    return true;
  }
  return false;
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       

function problem1(input) {
  return getNumValidPassports(input, checkPassportContainsRequiredFields);
}

function problem2(input) {
  return getNumValidPassports(input, checkIfPassportValid);
}

var input = getInput();
console.log('problem 1: ' + problem1(input));
console.log('problem 2: ' + problem2(input));