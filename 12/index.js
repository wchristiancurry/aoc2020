const fs = require('fs');

function getInput() {
  try {
    input = fs.readFileSync('./in.txt', 'utf8');
    input = input.split("\n");
    for(let i = 0; i < input.length; i++) {
      let line = input[i];

      let regex = /^(.)(\d+)/;
      let match = line.match(regex);
      line = {
        action: match[1],
        value: parseInt(match[2])
      }

      input[i] = line;
    }
  } catch (err) {
    console.error(err);
  }

  return input;
}

function moveForAction(action, value, position) {
  switch(action) {
    case 'N':
      position.y += value;
      break;
    case 'S':
      position.y -= value;
      break;
    case 'E':
      position.x += value;
      break;
    case 'W':
      position.x -= value;
      break;
  }

  return position;
}

function turnShipNumTimes(action, value, currentDirection) {
  let numTurns = value / 90;
  for(let i = 0; i < numTurns; i++) {
    currentDirection = turnShip(action, currentDirection);
  }

  return currentDirection;
}

function turnShip(action, currentDirection) {
  switch(currentDirection) {
    case 'N':
      return (action === 'L') ? 'W' : 'E';
    case 'S':
      return (action === 'L') ? 'E' : 'W';
    case 'E':
      return (action === 'L') ? 'N' : 'S';
    case 'W':
      return (action === 'L') ? 'S' : 'N';
  }
}

function problem1(input) { 
  let currentDirection = 'E';
  let currentPosition = {
    x: 0,
    y: 0
  }
  for(let i = 0; i < input.length; i++) {
    let line = input[i];
    let action = line.action;
    let value = line.value;
    
    switch(action) {
      case 'L':
        currentDirection = turnShipNumTimes('L', value, currentDirection);
        break;
      case 'R':
        currentDirection = turnShipNumTimes('R', value, currentDirection);
        break;
      case 'F':
        currentPosition = moveForAction(currentDirection, value, currentPosition);
        break;
      default:
        currentPosition = moveForAction(action, value, currentPosition);
        break;
    }
  }

  return Math.abs(currentPosition.x) + Math.abs(currentPosition.y);
}

function problem2(input) { 
  let currentWaypointPosition = {
    x: 10,
    y: 1
  }
  let currentShipPosition = {
    x: 0,
    y: 0
  }
  for(let i = 0; i < input.length; i++) {
    let line = input[i];
    let action = line.action;
    let value = line.value;
    
    switch(action) {
      case 'L':
        currentWaypointPosition = moveWaypointAroundShip('L', value, currentWaypointPosition);
        break;
      case 'R':
        currentWaypointPosition = moveWaypointAroundShip('R', value, currentWaypointPosition);
        break;
      case 'F':
        currentShipPosition = moveToWaypoint(currentShipPosition, currentWaypointPosition, value);
        break;
      default:
        currentWaypointPosition = moveForAction(action, value, currentWaypointPosition);
        break;
    }
  }

  return Math.abs(currentShipPosition.x) + Math.abs(currentShipPosition.y);
}

function moveToWaypoint(currentShipPosition, currentWaypointPosition, value) {
  let newX = currentShipPosition.x + (currentWaypointPosition.x * value);
  let newY = currentShipPosition.y + (currentWaypointPosition.y * value);
  currentShipPosition = {
    x: newX,
    y: newY
  }

  return currentShipPosition;
}

function moveWaypointAroundShip(action, value, currentWaypointPosition) {
  let numTurns = value / 90;

  for(let i = 0; i < numTurns; i++) {
    let newX, newY;
    if(action === 'L') {
      newX = -currentWaypointPosition.y;
      newY = currentWaypointPosition.x;
    } else if(action === 'R') {
      newX = currentWaypointPosition.y;
      newY = -currentWaypointPosition.x;
    }
    currentWaypointPosition = {
      x: newX,
      y: newY
    }
  }

  return currentWaypointPosition;
}

// function turnShipNumTimes(action, value, currentDirection) {
//   let numTurns = value / 90;
//   for(let i = 0; i < numTurns; i++) {
//     currentDirection = turnShip(action, currentDirection);
//   }

//   return currentDirection;
// }

// function turnShip(action, currentDirection) {
//   switch(currentDirection) {
//     case 'N':
//       return (action === 'L') ? 'W' : 'E';
//     case 'S':
//       return (action === 'L') ? 'E' : 'W';
//     case 'E':
//       return (action === 'L') ? 'N' : 'S';
//     case 'W':
//       return (action === 'L') ? 'S' : 'N';
//   }
// }

var input = getInput();
console.log('problem 1: ' + problem1(input));
console.log('problem 2: ' + problem2(input));