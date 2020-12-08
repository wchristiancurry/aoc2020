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

function getInstruction(line, index) {
  let regex = /^([\w]+) (-|\+)([\d]+)/;
  let matches = line.match(regex);
  if(matches === null) {
    console.log('break');
  }
  let op = matches[1];
  let sign = matches[2];
  let value = parseInt(matches[3]);
  value = (sign === '-') ? -value : value;
  let instruction = {
    index: index,
    op: op,
    value: value,
    sign: sign
  }

  return instruction;
}

function executeProgram(input) {
  let accumulator = 0;
  let index = 0;
  let instructionsExecuted = [];
  for(; index < input.length;) {
    let line = input[index];
    let instruction = getInstruction(line, index);

    // console.log('index: ' + index + ' op: ' + instruction.op + ' value: ' + instruction.value);

    let instructionAlreadyExecuted = instructionsExecuted.filter(executedInstruction => 
      executedInstruction.index === instruction.index
      && executedInstruction.op === instruction.op 
      && executedInstruction.value === instruction.value).length > 0;
    if(instructionAlreadyExecuted) {
      return [ accumulator, instructionsExecuted, false ];
    } else {
      instructionsExecuted.push(instruction);
      switch(instruction.op) {
        case 'acc':
          accumulator += instruction.value;
          index++;
          break;
        case 'jmp':
          index += instruction.value;
          break;
        default:
          index++;
          break;
      }
    }
  }

  return [ accumulator, instructionsExecuted, true ];
}

function problem1(input) {
  let [accumulator, instructionsExecuted, endOfProgram ] = executeProgram(input);
  return accumulator;
}

function problem2(input) { 
  let originalInput = input.slice();
  let alreadyReplaced = Number.MAX_SAFE_INTEGER;
  let [accumulator, instructionsExecuted, endOfProgram] = executeProgram(input);
  while (!endOfProgram) {
    input = originalInput.slice();

    for(let i = instructionsExecuted.length-1; i >= 0; i--) {
      let instruction = instructionsExecuted[i];
      if((instruction.op === 'jmp' || (instruction.op === 'nop' && instruction.value !== 0))
          && (i < alreadyReplaced)) {
        alreadyReplaced = i;

        let newInstruction = (instruction.op === 'jmp') ? 'nop' : 'jmp';
        newInstruction = newInstruction + ' ' + instruction.sign + Math.abs(instruction.value).toString();
        input[instruction.index] = newInstruction;
        break;
      }
    }

    [accumulator, , endOfProgram] = executeProgram(input);
  };
  
  return accumulator;
}

var input = getInput();
console.log('problem 1: ' + problem1(input));
console.log('problem 2: ' + problem2(input));