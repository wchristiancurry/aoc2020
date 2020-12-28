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

  //https://www.redblobgames.com/grids/hexagons/
  let tiles = [];
  let x = 0, y = 0, z = 0;
  for(let i = 0; i < directionsToTiles.length; i++) {
    let directions = directionsToTiles[i];
    for(let j = 0; j < directions.length; j++) {
      switch(directions[j]) {
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
    }

    let tile = getTile(tiles, x, y, z);
    if(!tile) {
      tile = {
        x: x,
        y: y,
        z: z,
        value: 0
      };
      tiles.push(tile);
    }

    if(tile.value === 0) {
      tile.value = 1;
    } else {
      tile.value = 0;
    }

    x = 0;
    y = 0;
    z = 0;
  }

  let total = 0;
  for(let i = 0; i < tiles.length; i++) {
    total += tiles[i].value;
  }

  console.log('break');
  return total;
}

function problem2(input) { 
}

function getTile(tiles, x, y, z) {
  for(let i = 0; i < tiles.length; i++) {
    let tile = tiles[i];

    if(tile.x === x && tile.y === y && tile.z === z) {
      return tile;
    }
  }
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