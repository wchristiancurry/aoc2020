const fs = require('fs');

var input;
try {
  input = fs.readFileSync('./in.txt', 'utf8');
  input = input.split("\n");
} catch (err) {
  console.error(err);
}

function findTrees(input, right, down) {
  let treeCount = 0;
  let x = 0; 
  let y = 0;
  let lineLength = input[0].length;
  let offset = 0;
  for(; y < input.length-down; y+=down) {

    x += right;
    if((x-offset) >= lineLength) {
      offset += lineLength;
    }

    treeCount = (input[y+down].charAt(x-offset) === '#') ? treeCount+1 : treeCount;
  }

  return treeCount;
}

function problem1(input) {
  return findTrees(input, 3, 1);
}

function problem2(input) {
  let r1 = findTrees(input, 1, 1)
  let r2 = findTrees(input, 3, 1)
  let r3 = findTrees(input, 5, 1)
  let r4 = findTrees(input, 7, 1)
  let r5 = findTrees(input, 1, 2);
  return r1 * r2 * r3 * r4 * r5;
}

console.log('problem 1: ' + problem1(input));
console.log('problem 2: ' + problem2(input));