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
  return sumOfAllInputProblems(input, false);
}

function problem2(input) { 
  return sumOfAllInputProblems(input, true);
}

function sumOfAllInputProblems(input, addHasPrecedence) {
  let total = 0;
  for(let i = 0; i < input.length; i++) {
    let problem = input[i].replace(/ /g, '');
    let solution = solveProblem(problem, addHasPrecedence);

    total += solution;
  }

  return total;
}

function solveProblem(problem, addHasPrecedence) {
  let index = 0;
  while(problem.includes('(')) {
    if(problem[index] === '(') {
      let subProblem = extractParenthesesGroup(problem, index);
      let solution = solveProblem(subProblem.substring(1, subProblem.length-1), addHasPrecedence);
      problem = problem.replace(subProblem, solution);
    } else {
      index++;
    }
  }

  problem = (addHasPrecedence) ? parseAndSolveWithAddPrecedence(problem) : parseAndSolveWithoutAddPrecedence(problem);
  return parseInt(problem);
}

function extractParenthesesGroup(problem, index) {
  let startingIndex = index;
  let numOpenParentheses = 1;
  
  while(numOpenParentheses > 0) {
    let current = problem[++index];
    if(current === '(') {
      numOpenParentheses += 1;
    } else if(current === ')') {
      numOpenParentheses -= 1;
    }
  }

  return problem.substring(startingIndex, index+1); //cut out the start and end parenthesis
}

function parseAndSolveWithAddPrecedence(problem) {
  let adds = parseAndSolve(problem, /([\d]+)(\+)([\d]+)/);
  return parseAndSolve(adds, /([\d]+)([+*])([\d]+)/);
}

function parseAndSolveWithoutAddPrecedence(problem) {
  return parseAndSolve(problem, /([\d]+)([+*])([\d]+)/);
}

function parseAndSolve(problem, regex) {
  let match = problem.match(regex);
  while(match && match.length > 0) {
    let solution = solveSubProblem(match[1], match[2], match[3]);

    problem = problem.replace(match[0], solution);
    match = problem.match(regex);
  }

  return problem;
}

function solveSubProblem(operand1, operator, operand2) {
  let solution;
  switch(operator) {
    case '+':
      solution = parseInt(operand1) + parseInt(operand2);
      break;
    case '*':
      solution = parseInt(operand1) * parseInt(operand2);
      break;
  }

  return solution;
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