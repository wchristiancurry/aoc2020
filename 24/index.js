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
  let directionsToTiles = parseDirections(input);
  let tiles = getFlippedTiles(directionsToTiles);
  return countTotalBlackTiles(tiles);
}

function problem2(input) { 
  let directionsToTiles = parseDirections(input);
  let tiles = getFlippedTiles(directionsToTiles);
  
  for(let i = 0; i < 100; i++) {
    addNonExistingNeighbors(tiles);
    let newArray = copy3dArray(tiles);
    flipTiles(tiles, newArray);
    tiles = copy3dArray(newArray);
  }

  return countTotalBlackTiles(tiles);
}

function flipTiles(tiles, newArray) {
  let [yLength, xLength, zLength] = getLongestNestedArrays(tiles);
  for(let y = 0; y < yLength; y++) {
    for(let x = 0; x < xLength; x++) {
      for(let z = 0; z < zLength; z++) {
        let [cx, cy, cz] = convertPointForGraphWithPositivesOnlyToNegative(x, y, z);
        if(cx + cy + cz === 0) {
          // if(tiles[y] && tiles[y][x]) {
            newArray[y][x][z] = countNeighborsAndSetValue(tiles, x, y, z)
          // }  
        }
      }
    }
  }
}

function countNeighborsAndSetValue(tiles, x, y, z) {
  let possibleDirections = ['se','ne','sw','nw','e','w'];
  let numBlackTileNeighbors = 0;
  for(let i = 0; i < possibleDirections.length; i++) {
    let [cx, cy, cz] = convertPointForGraphWithPositivesOnlyToNegative(x, y, z);
    [cx, cy, cz] = applyDirection(possibleDirections[i], cx, cy, cz);
    [cx, cy, cz] = convertPointForGraphWithNegativesToPositivesOnly(cx, cy, cz);

    if(tiles[cy] && tiles[cy][cx] && tiles[cy][cx][cz] === 1) {
      numBlackTileNeighbors += 1; 
    }
  }

  if(tiles[y][x][z] === 1) {
    if(numBlackTileNeighbors === 0 || numBlackTileNeighbors > 2) {
      return 0;
    } else {
      return 1;
    }
  } else {
    if(numBlackTileNeighbors === 2) {
      return 1;
    } else {
      return 0;
    }
  }
}

function addNonExistingNeighbors(tiles) {
  //traverse array and fill array with immediate neighbors that aren't in the array yet
  let [yLength, xLength, zLength] = getLongestNestedArrays(tiles);
  for(let y = 0; y < yLength; y++) {
    for(let x = 0; x < xLength; x++) {
      for(let z = 0; z < zLength; z++) {
        let [cx, cy, cz] = convertPointForGraphWithPositivesOnlyToNegative(x, y, z);
        if(cx + cy + cz === 0) {
          addNonExistingNeighborsForTile(tiles, x, y, z);
        }
      }
    }
  }
}

function addNonExistingNeighborsForTile(tiles, x, y, z) {
  let possibleDirections = ['se','ne','sw','nw','e','w'];
  for(let i = 0; i < possibleDirections.length; i++) {
    let [cx, cy, cz] = convertPointForGraphWithPositivesOnlyToNegative(x, y, z);
    [cx, cy, cz] = applyDirection(possibleDirections[i], cx, cy, cz);
    [cx, cy, cz] = convertPointForGraphWithNegativesToPositivesOnly(cx, cy, cz);

    if(!tiles[cy]) {
      tiles[cy] = []; 
    }
    if(!tiles[cy][cx]) {
      tiles[cy][cx] = [];
    }

    if(tiles[cy][cx][cz] !== 1) {
      tiles[cy][cx][cz] = 0;
    }
  }
}

function parseDirections(input) {
  //e, se, sw, w, nw, and ne
  let directionsToTiles = [];
  for(let i = 0; i < input.length; i++) {
    let line = input[i];

    let directions = [];
    let match = line.match(/(se)|(ne)|(sw)|(nw)|(e)|(w)/g);
    for(let j = 0; j < match.length; j++) {
      directions.push(match[j]);
    }
    directionsToTiles.push(directions);
  }

  return directionsToTiles;
}

function getFlippedTiles(directionsToTiles) {
  //https://www.redblobgames.com/grids/hexagons/
  let tiles = [[]];
  let x = 0, y = 0, z = 0;
  for(let i = 0; i < directionsToTiles.length; i++) {
    let directions = directionsToTiles[i];
    for(let j = 0; j < directions.length; j++) {
      [x, y, z] = applyDirection(directions[j], x, y, z);
    }

    [x, y, z] = convertPointForGraphWithNegativesToPositivesOnly(x, y, z);

    if(!tiles[y]) {
      tiles[y] = [];
    }
    if(!tiles[y][x]) {
      tiles[y][x] = [];
    }
    tiles[y][x][z] = (tiles[y][x][z] === 1) ? 0 : 1;

    x = 0;
    y = 0;
    z = 0;
  }

  return tiles;
}

function applyDirection(direction, x, y, z) {
  switch(direction) {
    case 'e':
      x += 1;
      y -= 1;
      break;
    case 'se':
      z += 1;
      y -= 1;
      break;
    case 'sw':
      x -= 1;
      z += 1;
      break;
    case 'w':
      x -= 1;
      y += 1;
      break;
    case 'nw':
      z -= 1;
      y += 1;
      break;
    case 'ne':
      x += 1;
      z -= 1;
      break;
  }

  return [x, y, z];
}

function convertPointForGraphWithNegativesToPositivesOnly(x, y, z) {
  return [
    convertIndexForGraphWithNegativesToPositiveOnly(x),
    convertIndexForGraphWithNegativesToPositiveOnly(y),
    convertIndexForGraphWithNegativesToPositiveOnly(z)
  ];
}

function convertIndexForGraphWithNegativesToPositiveOnly(index) {
  if(index < 0) {
    return (-index * 2 - 1);
  } else {
    return (index * 2);
  }
}

function convertPointForGraphWithPositivesOnlyToNegative(x, y, z) {
  return [
    convertIndexForGraphWithPositiveOnlyToNegative(x),
    convertIndexForGraphWithPositiveOnlyToNegative(y),
    convertIndexForGraphWithPositiveOnlyToNegative(z)
  ];
}

function convertIndexForGraphWithPositiveOnlyToNegative(index) {
  if(index % 2 === 0) {
    return (index / 2);
  } else {
    return -(Math.floor(index / 2) + 1);
  }
}

function getLongestNestedArrays(tiles) {
  let longestY = tiles.length;
  let longestX = -1;
  let longestZ = -1;
  for(let y = 0; y < tiles.length; y++) {
    if(tiles[y]) {
      if(tiles[y].length > longestX) {
        longestX = tiles[y].length;
      }
      for(let x = 0; x < tiles[y].length; x++) {
        if(tiles[y][x]) {
          if(tiles[y][x].length > longestZ) {
            longestZ = tiles[y][x].length;
          }
        }
      }
    }
  }

  return [longestY, longestX, longestZ];
}

function countTotalBlackTiles(tiles) {
  let total = 0;
  for(let y = 0; y < tiles.length; y++) {
    if(tiles[y]) {
      for(let x = 0; x < tiles[y].length; x++) {
        if(tiles[y][x]) {
          for(let z = 0; z < tiles[y][x].length; z++) {
            if(tiles[y][x][z] === 1) {
              total += 1;
            }
          }
        }
      }
    }
  }

  return total;
}

function copy3dArray(arr) {
  let [yLength, xLength, zLength] = getLongestNestedArrays(arr);

  let newArray = [];
  for(let y = 0; y < yLength; y++) {
    if(arr[y]) {
      newArray[y] = [];
      for(let x = 0; x < xLength; x++) {
        if(arr[y][x]) {
          newArray[y][x] = [];
          for(let z = 0; z < zLength; z++) {
            if(arr[y][x][z]) {
              newArray[y][x][z] = arr[y][x][z];
            }
          }
        }
      }
    }
  }

  return newArray;
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