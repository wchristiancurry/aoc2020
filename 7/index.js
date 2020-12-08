const { count } = require('console');
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

function parseInput(input) {
  let regex = /(\w+ \w+ bags contain)( no other bags.|( \d \w+ \w+ bag[s]?[,.])+)$/;
  let bagMap = new Map();
  input.forEach((line) => {
    let found = line.match(regex);
    let bag = found[1].replace(' bags contain', '');
    let bagsContained = found[2].trim();

    //make sure the bag is in the map, if not, initialize with an empty array
    if(!bagMap.has(bag)) {
      bagMap.set(bag, []);
    }

    if(bagsContained !== 'no other bags.') {
      let currentBags = bagMap.get(bag);

      bagsContained = bagsContained.replace('.', '').trim().split(',');
      bagsContained.forEach((bagContained) => {
        if(!currentBags.includes(bagContained)) {
          bagContained = bagContained.trim();
          let numberContained = bagContained.substring(0, 1);
          let containedType = bagContained.substring(1).replace('bags', '').replace('bag', '').trim();

          currentBags.push({
            numContained: numberContained,
            type: containedType
          });
        }
      });

      bagMap.set(bag, currentBags);
    }
  });

  return bagMap;
}

function digForShinyGold(bagMap, bag) {
  let containedBags = bagMap.get(bag.type);
  let shinyGoldFound = false;
  for(let i = 0; i < containedBags.length; i++) {

    if(containedBags[i].type === 'shiny gold') {
      shinyGoldFound = true;
      break;
    } else {
      shinyGoldFound = digForShinyGold(bagMap, containedBags[i]);
      if(shinyGoldFound) {
        break;
      }
    }
  }

  return shinyGoldFound;
}

function countBagsInBag(bagMap, bag) {
  let containedBags = bagMap.get(bag);
  let count = 0;
  for(let i = 0; i < containedBags.length; i++) {
    let numContained = parseInt(containedBags[i].numContained);
    count += (numContained);
    count += (countBagsInBag(bagMap, containedBags[i].type, count, numContained) * numContained);
  }

  return count;
}

function problem1(input) { 
  let bagMap = parseInput(input);

  let count = 0;
  let keys = Array.from(bagMap.keys());
  keys.forEach((key) => {
    let bag = {
      type: key,
      numContained: 0
    }
    
    if(digForShinyGold(bagMap, bag)) {
      count += 1;
    }
  });

  return count;
}

function problem2(input) {
  let bagMap = parseInput(input);
  return countBagsInBag(bagMap, 'shiny gold');
}

var input = getInput();
console.log('problem 1: ' + problem1(input));
console.log('problem 2: ' + problem2(input));