const fs = require('fs');
const { performance } = require('perf_hooks');

function getInput(filename) {
  try {
    input = fs.readFileSync(filename, 'utf8');
    input = input.split("\n");
  } catch (err) {
    console.error(err);
  }

  return input;
}

function problem1(input) { 
  let [rules, messages] = parseInput(input);
  
  let total = 0;
  for(let i = 0; i < messages.length; i++) {
    let [result, match] = checkMessageAgainstRule(rules, messages[i], rules[0], '');
    
    if(result && match.length === messages[i].length) {
      total += 1;
    }
  }

  return total;
}

function problem2(input) { 
  return problem1(input);
}

function checkMessageAgainstRule(rules, message, rule, match) {
  let pipeRegex = /([\d ]+) \| ([\d ]+)/;
  let letterRegex = /[ab]{1}/;

  let result;
  if(rule.match(pipeRegex)) {
    [result, match] = handlePipeRule(rules, message, match, rule.match(pipeRegex));
  } else if(rule.match(letterRegex)) {
    [result, match] = handleLetterRule(message, rule, match);
  } else {
    [result, match] = handleSequenceRule(rules, message, rule, match);
  }

  return [result, match];
}

function handlePipeRule(rules, message, match, regexMatch) {
  let leftSide = regexMatch[1].split(' ').map(i => parseInt(i));
  let rightSide = regexMatch[2].split(' ').map(i => parseInt(i));

  let checkMatch = match.slice();

  //check the left side first
  let result = false;
  [result, match] = doSequence(leftSide, rules, message, match);
  if(!result) {
    match = checkMatch.slice();
    [result, match] = doSequence(rightSide, rules, message, match);
  }

  return [result, match];
}

function handleLetterRule(message, rule, match) {
  match = match + rule;
  return [checkMatch(message, match), match];
}

function handleSequenceRule(rules, message, rule, match) {
  let ruleCopy = rule.slice().split(' ').map(i => parseInt(i));
  return doSequence(ruleCopy, rules, message, match);
}

function doSequence(sequence, rules, message, match) {
  for(let i = 0; i < sequence.length; i++) {
    let result;
    [result, match] = checkMessageAgainstRule(rules, message, rules[sequence[i]], match);
    if(!result) {
      return [false, match];
    }
  }
  return [true, match];
}

function checkMatch(message, match) {
  let matchLength = match.length;
  return (matchLength === message.length) ? (match === message) : (match === message.substring(0, matchLength));
}

function parseInput(input) {
  let rules = [];
  let messages = []

  let match;
  let i = 0;
  while(i < input.length) {
    match = input[i].match(/([\d]+: )(.+)/);
    if(!match || match.length === 0) {
      break;
    }

    let key = parseInt(match[1].replace(': ', ''));
    let value = match[2].replace(/"/g, '');

    rules[key] = value;
    i++;
  }

  while(i < input.length) {
    match = input[i].match(/([ab]+)/);

    if(match && match.length > 0) {
      messages.push(match[0]);
    }

    i++;
  }

  return [rules, messages];
}

function solve() {
  let input1 = getInput('./in.txt');
  let input2 = getInput('./in2.txt')

  let startTime = performance.now();
  console.log('problem 1 solution: ' + problem1(input1));
  console.log('problem 1 execution time: ' + (performance.now() - startTime) + ' ms');

  startTime = performance.now();
  console.log('problem 2 solution: ' + problem2(input2));
  console.log('problem 2 execution time: ' + (performance.now() - startTime) + ' ms');
}


solve();