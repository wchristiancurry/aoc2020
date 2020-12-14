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

function processInput(input, writeMemoryFunc, memory) {
  let mask;
  for(let i = 0; i < input.length; i++)  {
    let line = input[i];

    let maskRegex = /^(mask = )([0-1X]+)$/;
    let memRegex = /^(mem\[([\d]+)\] = ([\d]+))$/;

    let maskMatch = line.match(maskRegex);
    let memMatch = line.match(memRegex);
    if(maskMatch) {
      mask = maskMatch[2];
      mask = mask.split('');
    } else if(memMatch) {
      let address = parseInt(memMatch[2]);
      let value = parseInt(memMatch[3]);
      writeMemoryFunc(address, value, mask, memory);
    }
  }
}

function writeMemoryWithBitmaskedValue(address, value, mask, memory) {
  memory[address] = applyNonFloatingMaskProblem1(value, mask);
}

function writeMemoryWithFloatingAddresses(address, value, mask, memory) {
  let valueWithNonFloatingMask = applyNonFloatingMaskProblem2(address, mask);
  let addressesToWrite = applyFloatingMask(valueWithNonFloatingMask, mask);

  for(let i = 0; i < addressesToWrite.length; i++) {
    let address = addressesToWrite[i];
    memory.set(address, value);
  }
}

function applyNonFloatingMaskProblem1(value, mask) {
  let binaryValueArray = getXBitBinaryFromNumber(36, value).split('');
  for(let j = 0; j < mask.length; j++) {
    binaryValueArray[j] = (mask[j] === 'X' ? binaryValueArray[j] : mask[j]);
  }

  return parseInt(binaryValueArray.join(''), 2);
}

function applyNonFloatingMaskProblem2(value, mask) {
  let binaryValueArray = getXBitBinaryFromNumber(36, value).split('');
  for(let j = 0; j < mask.length; j++) {
    binaryValueArray[j] = mask[j] === '1' ? mask[j] : binaryValueArray[j];
  }

  return parseInt(binaryValueArray.join(''), 2);
}

function applyFloatingMask(value, mask) {
  value = getXBitBinaryFromNumber(36, value);
  let numX = mask.filter(v => v === 'X').length;
  let possibleAddressCount = Math.pow(2, numX);
  let xIndexes = [];
  mask.forEach((x, index) => {
    if(x === 'X') {
       xIndexes.push(index);
    }
  });
  
  let values = [];
  for(let i = 0; i < possibleAddressCount; i++) {
    let binaryNumber = getXBitBinaryFromNumber(numX, i);
    let newValue = value.slice().split('');
    for(let j = 0; j < binaryNumber.length; j++) {
      let xIndex = xIndexes[j];
      newValue[xIndex] = binaryNumber[j];
    }

    values.push(parseInt(newValue.join(''), 2));
  }

  return values;
}

function getXBitBinaryFromNumber(x, number) {
  let binaryValue = number.toString(2);
  let padding = '';
  for(let i = 0; i < (x-binaryValue.length); i++) {
    padding += '0';
  }
  
  return (padding + binaryValue);
}

function problem1(input) { 
  let memory = [];
  processInput(input, writeMemoryWithBitmaskedValue, memory);

  let total = 0;
  for(let i = 0; i < memory.length; i++) {
    if(memory[i]) {
      total += memory[i];
    }
  }

  return total;
}

function problem2(input) {
  let memory = new Map();
  processInput(input, writeMemoryWithFloatingAddresses, memory);

  let total = 0;
  for(let key of memory.keys()) {
    total += memory.get(key);
  }

  return total;
}

var input = getInput();
console.log('problem 1: ' + problem1(input));
console.log('problem 2: ' + problem2(input));