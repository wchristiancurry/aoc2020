const fs = require('fs');
const { performance } = require('perf_hooks');

function getInput() {
  try {
    input = fs.readFileSync('./in.txt', 'utf8');
    // input = input.split("\n");
  } catch (err) {
    console.error(err);
  }

  return input;
}

const SIDE = {
  left: 0,
  right: 1,
  top: 2, 
  bottom: 3
}

function problem1(input) { 
  let tiles = parseTiles(input);
  let imageSize = Math.sqrt(tiles.length);

  let tileOrder = assemble(tiles, 0, [], imageSize);
  console.log('break');
}

function problem2(input) { 
}

function assemble(tiles, index, tileOrder, imageSize) {
  if(index >= (imageSize*imageSize)) {
    return tileOrder;
  }

  for(let i = 0; i < tiles.length; i++) {
    let tileToCheck = tiles[i];
    let newTileOrder = deepCopyArray(tileOrder);

    //if tiles[i] fits at newTileOrder[index], then add it
    let isValidNextTile = true;
    let indexesToCheck = getPossibleNeighbors(index, tileOrder, imageSize);
    for(let j = 0; j < indexesToCheck.length; j++) {
      let indexToCheck = indexesToCheck[j];
      tileToCheck = checkTileFitsWithTileAtIndex(tileToCheck, tileOrder[indexToCheck], index, indexToCheck, imageSize);

      if(typeof tileToCheck === 'undefined') {
        isValidNextTile = false;
        break;
      }
    }

    if(isValidNextTile) {
      newTileOrder[index] = tileToCheck;

      let tileId = tileToCheck.id;
      newTileOrder = assemble(tiles.filter(i => i.id !== tileId), index+1, newTileOrder, imageSize);
    }
    //TODO: not sure what to do in this situation. 
    //if you get to this breakpoint:
    //index === 2 && tileOrder[0].id === 1951 && tileToCheck.id === 3079
    //it fails and does not try the tileOrder again. It should, because tileOrder[0].id === 1951 is correct.
    // } else {
    //   newTileOrder = assemble(tiles, index, )
    // }

    if(newTileOrder.length === imageSize*imageSize) {
      let done = true;
      for(let i = 0; i < newTileOrder.length; i++) {
        if(typeof newTileOrder[i] === 'undefined') {
          done = false;
        }
      }

      if(done) {
        return newTileOrder;
      }
    }
  }

  return tileOrder;
}

function checkTileFitsWithTileAtIndex(tileToCheck, otherTile, tileToCheckIndex, otherTileIndex, imageSize) {
  //have to determine which side of "otherTile" to use to compare against "tileToCheck"
  //need to perform all of the translations on "tileToCheck" to see if it fits

  let tileToCheckCoords = transfromIndexToPoint(tileToCheckIndex, imageSize);
  let otherTileCoords = transfromIndexToPoint(otherTileIndex, imageSize);

  let sideOfTileToCheck;
  let sideOfOtherTileToCheck;
  if(tileToCheckCoords.x < otherTileCoords.x) {
    sideOfTileToCheck = SIDE.right;
    sideOfOtherTileToCheck = SIDE.left;
  } else if(tileToCheckCoords.x > otherTileCoords.x) {
    sideOfTileToCheck = SIDE.right;
    sideOfOtherTileToCheck = SIDE.right;
  } else if(tileToCheckCoords.y < otherTileCoords.y) {
    sideOfTileToCheck = SIDE.right;
    sideOfOtherTileToCheck = SIDE.top;
  } else if(tileToCheckCoords.y > otherTileCoords.y) {
    sideOfTileToCheck = SIDE.right;
    sideOfOtherTileToCheck = SIDE.bottom;
  }

  let otherTileSide = getSide(otherTile, sideOfOtherTileToCheck);

  let nonTransformTile = { id: tileToCheck.id, content: tileToCheck.content };
  let rotate90Tile =  { id: tileToCheck.id, content: rotate90(tileToCheck.content) };
  let rotate180Tile = { id: tileToCheck.id, content: rotate180(tileToCheck.content) };
  let rotate270Tile = { id: tileToCheck.id, content: rotate270(tileToCheck.content) };
  let flipVTile = { id: tileToCheck.id, content: flipV(tileToCheck.content) };
  let flipHTile = { id: tileToCheck.id, content: flipH(tileToCheck.content) };

  let nonTransformTileSide = getSide(nonTransformTile, sideOfTileToCheck);
  let rotate90TileSide =  getSide(rotate90Tile, sideOfTileToCheck);
  let rotate180TileSide = getSide(rotate180Tile, sideOfTileToCheck);
  let rotate270TileSide = getSide(rotate270Tile, sideOfTileToCheck);
  let flipVTileSide = getSide(flipVTile, sideOfTileToCheck);
  let flipHTileSide = getSide(flipHTile, sideOfTileToCheck);


  //TODO: could potentially see if there are ever multiple transformations that work. Return an array and go from there. 
  let potential = [];
  if(compareSideToSide(nonTransformTileSide, otherTileSide)) {
    potential.push(nonTransformTile);
  } else if(compareSideToSide(rotate90TileSide, otherTileSide)) {
    potential.push(rotate90Tile);
  } else if(compareSideToSide(rotate180TileSide, otherTileSide)) {
    potential.push(rotate180Tile);
  } else if(compareSideToSide(rotate270TileSide, otherTileSide)) {
    potential.push(rotate270Tile);
  } else if(compareSideToSide(flipVTileSide, otherTileSide)) {
    potential.push(flipVTile);
  } else if(compareSideToSide(flipHTileSide, otherTileSide)) {
    potential.push(flipHTile);
  }

  // if(potential.length > 1) {
  //   console.log('break');
  // } else if(potential.length == 1) {
  //   console.log('break');
  // }

  return potential[0];
}

function getPossibleNeighbors(index, tileOrder, imageSize) {
  let coords = transfromIndexToPoint(index, imageSize);

  let neighbors = [];
  for(let x = coords.x-1; x <= (coords.x+1); x++) {
    if(x >= 0 && x < imageSize) {
      neighbors.push({x:x,y:coords.y});
    }
  }
  for(let y= coords.y-1; y <= (coords.y+1); y++) {
    if(y >= 0 && y < imageSize) {
      neighbors.push({x:coords.x,y:coords.y});
    }
  }

  let actualNeighbors = [];
  for(let i = 0; i < neighbors.length; i++) {
    let index = transformPointToIndex(neighbors[i].x, neighbors[i].y, imageSize)
    if(typeof tileOrder[index] !== 'undefined') {
      if(!actualNeighbors.includes(index)) {
        actualNeighbors.push(index);
      }
    }
  }

  return actualNeighbors;
}

function compareSideToSide(side1, side2) {
  if(side1.length !== side2.length) {
    return false;
  }

  for(let i = 0; i < side1.length; i++) {
    if(side1[i] !== side2[i]) {
      return false;
    }
  }

  return true;
}

function getSide(tile, side) {
  let sideArr = [];
  let tileContent = tile.content;

  switch(side) {
    case SIDE.left:
      for(let x = 0; x < tileContent[0].length; x++) { 
        sideArr.push(tileContent[x][0]);
      }
      break;
    case SIDE.right:
      for(let x = 0; x < tileContent[0].length; x++) { 
        sideArr.push(tileContent[x][tileContent[0].length-1]);
      }
      break;
    case SIDE.top:
      for(let y = 0; y < tileContent.length; y++) { 
        sideArr.push(tileContent[0][y]);
      }
      break;
    case SIDE.bottom:
      for(let y = 0; y < tileContent.length; y++) { 
        sideArr.push(tileContent[tileContent.length-1][y]);
      }
      break;
  }

  return sideArr;
}

function parseTiles(input) {
  let regex = /Tile ([\d]+):\n([.#\n]+)/g;
  let matches = Array.from(input.matchAll(regex));

  let tiles = []; 
  for(let i = 0; i < matches.length; i++) {
    let match = matches[i];
    let tile = {
      id: parseInt(match[1]),
      content: match[2].split('\n').filter(i => i !== '').map(i => i.split(''))
    }
    tiles.push(tile);
  }

  return tiles;
}

function rotate90(arr) {
  let newArr = [];
  for(let i = 0; i < arr.length; i++) {
    newArr.push([]);
    for(let j = 0; j < arr[i].length; j++) {
      newArr[i][j] = arr[arr.length - j - 1][i];
    }
  }

  return newArr;
}

function rotate180(arr) {
  arr = rotate90(arr);
  return rotate90(arr);
}

function rotate270(arr) {
  arr = rotate90(arr);
  arr = rotate90(arr);
  return rotate90(arr);
}

function flipV(arr) {
  let newArr = [];
  for(let i = 0; i < arr.length; i++) {
    newArr.push([]);
  }

  for(let y = 0; y < arr.length; y++) {
    for(let x = 0; x < (arr.length/2); x++) {
      let tmp = arr[arr.length - x - 1][y];
      newArr[arr.length - x - 1][y] = arr[x][y];
      newArr[x][y] = tmp;
    }
  }

  return newArr;
}

function flipH(arr) {
  let newArr = [];
  for(let i = 0; i < arr.length; i++) {
    newArr.push([]);
  }

  for(let x = 0; x < arr.length; x++) {
    for(let y = 0; y < (arr.length/2); y++) {
      let tmp = arr[x][arr.length - y - 1];
      newArr[x][arr.length - y - 1] = arr[x][y];
      newArr[x][y] = tmp;
    }
  }

  return newArr;
}

function transformPointToIndex(x, y, size) {
  return x + (y * size); 
}

function transfromIndexToPoint(index, size) {
  let x = Math.floor(index % size);
  let y = Math.floor(index / size);
  return { x: x, y: y };
}

function deepCopy2dArray(arr) {
  let copy = [];
  for (let i = 0; i < arr.length; i++) {
    copy[i] = arr[i].slice();
  }
  return copy;
}

function deepCopyArray(arr) {
  let copy = [];
  for(let i = 0; i < arr.length; i++) {
    if(typeof arr[i] !== 'undefined') {
      copy[i] = JSON.parse(JSON.stringify(arr[i]));
    } else {
      copy[i] = undefined;
    }
  }
  return copy;
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