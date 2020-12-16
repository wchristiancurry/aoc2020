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
  let [ fields, myTicket, nearbyTickets ] = parseInput(input);
  let [invalidValues, invalidTickets, validTickets] = determineTicketValidity(nearbyTickets, fields);

  let total = 0;
  for(let i = 0; i < invalidValues.length; i++) {
    total += invalidValues[i];
  }

  return total;
}

function problem2(input) { 
  let [ fields, myTicket, nearbyTickets ] = parseInput(input);
  let [ invalidValues, invalidTickets, validTickets ] = determineTicketValidity(nearbyTickets, fields);

  let fieldToValidIndexMap = new Map();
  for(let i = 0; i < fields.length; i++) {
    let field = fields[i];

    for(let index = 0; index < validTickets.length; index++) {
      let indexValidForField = true;
      for(let j = 0; j < validTickets.length; j++) {
        let ticket = validTickets[j];
        if(!valueInRangeForField(ticket[index], field)) {
          indexValidForField = false;
          break;
        }
      }

      if(indexValidForField) {
        let validIndexes = fieldToValidIndexMap.get(field.label);
        if(validIndexes) {
          validIndexes.push(index);
        } else {
          validIndexes = [index];
        }

        fieldToValidIndexMap.set(field.label, validIndexes);
      }
    }
  }

  let fieldToValidIndexMapFinished = new Map();
  do {
    let finalFieldToIndex;
    for(const [key, value] of fieldToValidIndexMap.entries()) {
      if(value.length === 1) {
        finalFieldToIndex = {
          label: key, 
          index: value[0]
        };
        break;
      }
    }
    
    fieldToValidIndexMap.delete(finalFieldToIndex.label);
    fieldToValidIndexMapFinished.set(finalFieldToIndex.label, finalFieldToIndex.index);

    for(const key of fieldToValidIndexMap.keys()) {
      let value = fieldToValidIndexMap.get(key);
      value = value.filter(i => i !== finalFieldToIndex.index);
      fieldToValidIndexMap.set(key, value);
    }

  } while(fieldToValidIndexMap.size > 0);

  let total = 1;
  for(const [key, value] of fieldToValidIndexMapFinished.entries()) {
    if(key.includes('departure')) {
      total *= myTicket[value];
    }
  }

  return total;
}

function parseInput(input) {
  let fieldRegex = /^([\w]+[ [\w]+]?): ([\d]+-[\d]+) or ([\d]+-[\d]+)$/;
  let fields = [];
  let myTicket;
  let nearbyTickets = [];

  for(let i = 0; i < input.length; i++) {
    let line = input[i];

    let match = line.match(fieldRegex);
    if(match && match.length > 0) {
      fields.push({
        label: match[1],
        range1Lower: parseInt(match[2].split('-')[0]),
        range1Upper: parseInt(match[2].split('-')[1]),
        range2Lower: parseInt(match[3].split('-')[0]),
        range2Upper: parseInt(match[3].split('-')[1])
      });

    } else if(line === 'your ticket:') {
      myTicket = input[++i].split(',').map(n => parseInt(n));
    } else if(line === 'nearby tickets:') {
      i++;
      for(; i < input.length; i++) {
        nearbyTickets.push(input[i].split(',').map(n => parseInt(n)));
      }
    }
  }

  return [ fields, myTicket, nearbyTickets ];
}

function determineTicketValidity(nearbyTickets, fields) {
  let invalidValues = [];
  let invalidTickets = [];
  let validTickets = [];
  for(let i = 0; i < nearbyTickets.length; i++) {
    if(!checkTicket(nearbyTickets[i], fields, invalidValues)) {
      invalidTickets.push(nearbyTickets[i]);
    } else {
      validTickets.push(nearbyTickets[i]);
    }
  }

  return [invalidValues, invalidTickets, validTickets];
}

function checkTicket(ticket, fields, invalidValues) { 
  for(let i = 0; i < ticket.length; i++) {
    let value = ticket[i];
    if(!checkValueInRange(fields, value)) {
      invalidValues.push(value);
      return false;
    } 
  }

  return true;
}

function checkValueInRange(fields, value) {
  for(let j = 0; j < fields.length; j++) {
    let field = fields[j];
    if(valueInRangeForField(value, field)) {
      return true;
    }
  }

  return false;
}

function valueInRangeForField(value, field) {
  if(inRange(value, field.range1Lower, field.range1Upper) 
    || inRange(value, field.range2Lower, field.range2Upper)) {
      return true;
  }
  return false;
}

function inRange(value, min, max) {
  return (value >= min && value <= max);
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
