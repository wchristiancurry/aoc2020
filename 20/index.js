const fs = require('fs');
const { performance } = require('perf_hooks');

function getInput(filename) {
  try {
    input = fs.readFileSync(filename, 'utf8');
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
  let tileOrder = assemble(tiles, imageSize);

  let topLeftId = tileOrder[transformPointToIndex(0, 0, imageSize)].id;
  let bottomLeftId = tileOrder[transformPointToIndex(0, imageSize-1, imageSize)].id;
  let topRightId = tileOrder[transformPointToIndex(imageSize-1, 0, imageSize)].id;
  let bottomRightId = tileOrder[transformPointToIndex(imageSize-1, imageSize-1, imageSize)].id;
  return (topLeftId * bottomLeftId * topRightId * bottomRightId);
}

function problem2(input) { 
  let tiles = parseTiles(input);
  let imageSize = Math.sqrt(tiles.length);
  let tileOrder = assemble(tiles, imageSize);

  let monsterInput = getInput('./monster.txt').split('\n');
  let monster = [];
  for(let i = 0; i < monsterInput.length; i++) {
    let line = monsterInput[i];
    monster.push(line.split(''));
  }

  let combinedImage = combineTilesIntoImage(tileOrder, imageSize);
  let totalNonSpaces = countNonSpaces(combinedImage);
  console.log('break');

  //TODO: remove
  combinedImage = rotate270(combinedImage);
  combinedImage = flipV(combinedImage);


  let allTransformations = getPossibleTransformationsForImage(combinedImage);
  let numSeaMonsters = 0;
  for(let i = 0; i < allTransformations.length; i++) {
    let image = allTransformations[i];
    numSeaMonsters = checkForSeaMonsters(image, monster);
    if(numSeaMonsters > 0) {
      break;
    }
  }

  let nonSpacesInMonster = 0;
  for(let i = 0; i < monster.length; i++) {
    for(let j = 0; j < monster[i].length; j++) {
      if(monster[i][j] === '#') {
        nonSpacesInMonster += 1;
      }
    }
  }

  let nonSpacesInAllMonsters = nonSpacesInMonster * numSeaMonsters;
  return totalNonSpaces - nonSpacesInAllMonsters;
}

function checkForSeaMonsters(combinedImage, monster) {
  x = 0;
  y = 0;
  let numMonsters = 0;
  while((y+(monster.length)) < (combinedImage.length-1)) {
    let monsterFound = true;
    for(let i = 0; i < monster.length; i++) {
      for(let j = 0; j < monster[i].length; j++) {
        if(monster[i][j] === '#') {
          if(combinedImage[y+i][x+j] !== '#') {
            monsterFound = false;
            break;
          }
        }
      }

      if(!monsterFound) {
        break;
      }
    }

    if(monsterFound) {
        numMonsters++;
    }

    x++;
    if((x + monster.length) > combinedImage[0].length) {
      x = 0;
      y += 1;
    }
  }

  return numMonsters;
}

function countNonSpaces(image) {
  let nonSpaces = 0;
  for(let i = 0; i < image.length; i++) {
    for(let j = 0; j < image[i].length; j++) {
      if(image[i][j] === '#') {
        nonSpaces+=1;
      }
    }
  }

  return nonSpaces;
}

function combineTilesIntoImage(tiles, imageSize) {
  for(let i = 0; i < tiles.length; i++) {
    tiles[i].content.shift();
    tiles[i].content.pop();

    for(let x = 0; x < tiles[i].content.length; x++) {
      tiles[i].content[x].shift();
      tiles[i].content[x].pop();
    }
  }

  let combined = [];
  let length = imageSize*tiles[0].content.length;
  for(let i = 0; i < length; i++) {
    combined.push([]);
    for(let j = 0; j < length; j++) {
      let index = (Math.floor(i / tiles[0].content.length)*imageSize) + Math.floor(j / tiles[0].content.length);
      let tileI = i % tiles[0].content.length;
      let tileJ = j % tiles[0].content.length;
      combined[i][j] = tiles[index].content[tileI][tileJ];
    }
  }

  return combined;
}

function assemble(tiles, imageSize) {
  for(let i = 0; i < tiles.length; i++) {
    let tile = tiles[i];

    let transformedTiles = [];
    transformedTiles.push(tile);
    transformedTiles.push({ id: tile.id, content: rotate90(tile.content) });
    transformedTiles.push({ id: tile.id, content: rotate180(tile.content) });
    transformedTiles.push({ id: tile.id, content: rotate270(tile.content) });
    transformedTiles.push({ id: tile.id, content: flipV(tile.content) });
    transformedTiles.push({ id: tile.id, content: flipH(tile.content) });

    for(let j = 0; j < transformedTiles.length; j++) {
      let transformedTile = transformedTiles[j];
      let tileOrder = [];
      tileOrder.push(transformedTile);

      tileOrder = assembleForTileOrder(tiles.filter(i => i.id !== tile.id), 1, tileOrder, imageSize);
      if(tileOrderComplete(tileOrder, imageSize)) {
        return tileOrder;
      }
    }
  }
}

function assembleForTileOrder(tiles, index, tileOrder, imageSize) {
  if(index >= (imageSize*imageSize)) {
    return tileOrder;
  }

  for(let i = 0; i < tiles.length; i++) {
    let tileToCheck = tiles[i];
    let newTileOrder = deepCopyArray(tileOrder);
    //tileOrder.length === 5 && tileOrder[0].id === 1951 && tileOrder[1].id === 2311 && tileToCheck.id === 2473
    let validTile = undefined;
    let indexesToCheck = getPossibleNeighbors(index, tileOrder, imageSize);
    for(let j = 0; j < indexesToCheck.length; j++) {
      let indexToCheck = indexesToCheck[j];
      validTile = checkTileFitsWithTileAtIndex(tileToCheck, tileOrder[indexToCheck], index, indexToCheck, imageSize);

      if(typeof tileToCheck === 'undefined') {
        break;
      }
    }

    if(validTile) {
      newTileOrder[index] = validTile;

      let tileId = validTile.id;
      newTileOrder = assembleForTileOrder(tiles.filter(i => i.id !== tileId), index+1, newTileOrder, imageSize);
      
      if(tileOrderComplete(newTileOrder, imageSize)) {
        return newTileOrder;
      }
    }
  }

  return tileOrder;
}

function tileOrderComplete(tileOrder, imageSize) {
  if(tileOrder.length === imageSize*imageSize) {
    let done = true;
    for(let i = 0; i < tileOrder.length; i++) {
      if(typeof tileOrder[i] === 'undefined') {
        done = false;
      }
    }

    if(done) {
      return tileOrder;
    }
  }

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
    sideOfTileToCheck = SIDE.left;
    sideOfOtherTileToCheck = SIDE.right;
  } else if(tileToCheckCoords.y < otherTileCoords.y) {
    sideOfTileToCheck = SIDE.bottom;
    sideOfOtherTileToCheck = SIDE.top;
  } else if(tileToCheckCoords.y > otherTileCoords.y) {
    sideOfTileToCheck = SIDE.top;
    sideOfOtherTileToCheck = SIDE.bottom;
  }

  let otherTileSide = getSide(otherTile, sideOfOtherTileToCheck);

  let potential = [];
  let transformations = getPossibleTransformations(tileToCheck);
  for(let i = 0; i < transformations.length; i++) {
    let transformedTile = transformations[i];
    let side = getSide(transformedTile, sideOfTileToCheck);
    if(compareSideToSide(side, otherTileSide)) {
      potential.push(transformedTile);
    }
  }

  if(potential.length > 1) {
    // console.log('break'); probably an issue on the larger input
  }

  return potential[0];
}

function getPossibleTransformations(tile) {
  let transformations = [];
  transformations.push({ id: tile.id, content: tile.content });
  transformations.push({ id: tile.id, content: rotate90(tile.content) });
  transformations.push({ id: tile.id, content: rotate180(tile.content) });
  transformations.push({ id: tile.id, content: rotate270(tile.content) });
  transformations.push({ id: tile.id, content: flipV(tile.content) });
  transformations.push({ id: tile.id, content: flipH(tile.content) });
  
  let moreTransformations = [];
  for(let i = 1; i < transformations.length; i++) { //starting at 1 because we don't need to redo the original tile
    let transformedTile = transformations[i];
    moreTransformations.push(transformations[i]);
    moreTransformations.push({ id: transformedTile.id, content: rotate90(transformedTile.content) });
    moreTransformations.push({ id: transformedTile.id, content: rotate180(transformedTile.content) });
    moreTransformations.push({ id: transformedTile.id, content: rotate270(transformedTile.content) });
    moreTransformations.push({ id: transformedTile.id, content: flipV(transformedTile.content) });
    moreTransformations.push({ id: transformedTile.id, content: flipH(transformedTile.content) });
  }

  return moreTransformations;
}

//lazy
function getPossibleTransformationsForImage(image) {
  let transformations = [];
  transformations.push(image);
  transformations.push(rotate90(image));
  transformations.push(rotate180(image));
  transformations.push(rotate270(image));
  transformations.push(flipV(image));
  transformations.push(flipH(image));
  
  let moreTransformations = [];
  for(let i = 1; i < transformations.length; i++) { //starting at 1 because we don't need to redo the original tile
    let transformed = transformations[i];
    moreTransformations.push(transformed);
    moreTransformations.push(rotate90(transformed));
    moreTransformations.push(rotate180(transformed));
    moreTransformations.push(rotate270(transformed));
    moreTransformations.push(flipV(transformed));
    moreTransformations.push(flipH(transformed));
  }

  return moreTransformations;
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
      neighbors.push({x:coords.x,y:y});
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
  var input = getInput('./in.txt');

  let startTime = performance.now();
  console.log('problem 1 solution: ' + problem1(input));
  console.log('problem 1 execution time: ' + (performance.now() - startTime) + ' ms');

  startTime = performance.now();
  console.log('problem 2 solution: ' + problem2(input));
  console.log('problem 2 execution time: ' + (performance.now() - startTime) + ' ms');
}

solve();