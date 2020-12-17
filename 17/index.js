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
  
  //parse input
  let configuration = [[[]]];
  for(let y = 0; y < input.length; y++) {
    let line = input[y];
    configuration[0][y] = [];
    for(let x = 0; x < line.length; x++) {
      configuration[0][y].push(line[x]);
    }
  }

  let zIndex = 0;
  for(let i = 0; i < 6; i++) {
    let yLength = configuration[0].length + 2;
    let xLength = configuration[0].length + 2;
    configuration.unshift([]);
    configuration.push([]);
    for(let z = 0; z < configuration.length; z++) {
      
      let inactive = [];
      for(let i = 0; i < xLength; i++) {
        inactive.push('.');
      }

      if(configuration[z].length === 0) {
        for(let i = 0; i < yLength; i++) {
          configuration[z].push(inactive);
        }
      } else {
        configuration[z].unshift(inactive);
        configuration[z].push(inactive);
      }
      
      for(let y = 0; y < configuration[z].length; y++) {
        if(configuration[z][y].length !== xLength) {
          configuration[z][y].unshift('.');
          configuration[z][y].push('.');
        }
      }
    }
    zIndex += 1;


    let newConfiguration = copy3dArray(configuration);
    for(let z = zIndex; z < configuration.length; z++) {
      for(let y = 0; y < configuration[z].length; y++) {
        for(let x = 0; x < configuration[z][y].length; x++) {
          
          if(cubeIsActive(z, y, x, configuration)) {
            newConfiguration[z][y][x] = '#';
          } else {
            newConfiguration[z][y][x] = '.';
          }
        }
      }
    }

    let mirror = 1;
    for(let z = zIndex-1; z >= 0; z--) {
      for(let y = 0; y < newConfiguration[z].length; y++) {
        for(let x = 0; x < newConfiguration[z][y].length; x++) {
          newConfiguration[z][y][x] = newConfiguration[z+(2*mirror)][y][x]
        }
      }

      mirror += 1;
    }

    configuration = copy3dArray(newConfiguration);
  }

  
  let total = 0;
  for(let z = 0; z < configuration.length; z++) {
    for(let y = 0; y < configuration[z].length; y++) {
      for(let x = 0; x < configuration[z][y].length; x++) {
        if(configuration[z][y][x] === '#') {
          total += 1;
        }
      }
    }
  }

  return total;
}

function problem2(input) { 
  let configuration = [[[]]];
  for(let y = 0; y < input.length; y++) {
    let line = input[y];
    configuration[0][y] = [];
    for(let x = 0; x < line.length; x++) {
      configuration[0][y].push(line[x]);
    }
  }
  configuration = [configuration];

  let wIndex = 0;
  for(let i = 0; i < 6; i++) {
    //pad w array

    let wLengthGoal = configuration.length + 2;
    let zLengthGoal = configuration[0].length + 2;
    let yLengthGoal = configuration[0][0].length + 2;
    let xLengthGoal = configuration[0][0][0].length + 2;
    configuration.unshift([]);
    configuration.push([]);
    for(let w = 0; w < configuration.length; w++) {
      configuration[w].unshift([]);
      configuration[w].push([]);
      
      while(configuration[w].length < wLengthGoal) {
        configuration[w].push([]);
      }
      
      for(let z = 0; z < configuration[w].length; z++) {
        let inactive = [];
        for(let i = 0; i < xLengthGoal; i++) {
          inactive.push('.');
        }

        if(configuration[w][z].length === 0) {
          for(let i = 0; i < yLengthGoal; i++) {
            configuration[w][z].push(inactive);
          }
        } else {
          configuration[w][z].unshift(inactive);
          configuration[w][z].push(inactive);
        }
        
        for(let y = 0; y < configuration[w][z].length; y++) {
          if(configuration[w][z][y].length !== xLengthGoal) {
            configuration[w][z][y].unshift('.');
            configuration[w][z][y].push('.');
          }
        }
      }
    }
    wIndex += 1;


    let newConfiguration = copy4dArray(configuration);
    for(let w = wIndex; w < configuration.length; w++) {
      for(let z = 0; z < configuration[w].length; z++) {
        for(let y = 0; y < configuration[w][z].length; y++) {
          for(let x = 0; x < configuration[w][z][y].length; x++) {
            
            if(cubeIsActive4d(w, z, y, x, configuration)) {
              newConfiguration[w][z][y][x] = '#';
            } else {
              newConfiguration[w][z][y][x] = '.';
            }
          }
        }
      }
    }

    let mirror = 1;
    for(let w = wIndex-1; w >= 0; w--) {
      for(let z = 0; z < newConfiguration[w].length; z++) {
        for(let y = 0; y < newConfiguration[w][z].length; y++) {
          for(let x = 0; x < newConfiguration[w][z][y].length; x++) {
            newConfiguration[w][z][y][x] = newConfiguration[w+(2*mirror)][z][y][x]
          }
        }

      }
      mirror += 1;
    }

    configuration = copy4dArray(newConfiguration);
  }

  
  let total = 0;
  for(let w = 0; w < configuration.length; w++) {
    for(let z = 0; z < configuration[w].length; z++) {
      for(let y = 0; y < configuration[w][z].length; y++) {
        for(let x = 0; x < configuration[w][z][y].length; x++) {
          if(configuration[w][z][y][x] === '#') {
            total += 1;
          }
        }
      }
    }
  }
  return total;
}

function copy3dArray(array) {
  let newArray = [];
  for(let z = 0; z < array.length; z++) {
    newArray.push([]);
    for(let y = 0; y < array[z].length; y++) {
      newArray[z].push([]);
      for(let x = 0; x < array[z][y].length; x++) {
        newArray[z][y].push(array[z][y][x]);
      }
    }
  }

  return newArray;
}

function copy4dArray(array) {
  let newArray = [];

  for(let w = 0; w < array.length; w++) {
    newArray.push([]);
    for(let z = 0; z < array[w].length; z++) {
      newArray[w].push([]);
      for(let y = 0; y < array[w][z].length; y++) {
        newArray[w][z].push([]);
        for(let x = 0; x < array[w][z][y].length; x++) {
          newArray[w][z][y].push(array[w][z][y][x]);
        }
      }
    }
  }

  return newArray;
}

function cubeIsActive(z1, y1, x1, configuration) {
  /**
    If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
    If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
   */
  let isCurrentlyActive = (configuration[z1][y1][x1] === '#') ? true : false;
  let activeNeighborCount = 0;
  let neighbor = '.';
  for(let z = z1-1; z <= z1+1; z++) {
    for(let y = y1-1; y <= y1+1; y++) {
      for(let x = x1-1; x <= x1+1; x++) {
        if(!(x === x1 && y === y1 && z === z1)) {

          if(configuration[z] && configuration[z][y] && configuration[z][y][x]) {
            neighbor = configuration[z][y][x];
          } 

          if(neighbor === '#') {
            activeNeighborCount += 1;
          }

          neighbor = '.';
        }
      }
    }
  }

  if(isCurrentlyActive && (activeNeighborCount === 2 || activeNeighborCount === 3)) {
    return true;
  } else if(!isCurrentlyActive && activeNeighborCount === 3) {
    return true;
  }

  return false;
}

function cubeIsActive4d(w1, z1, y1, x1, configuration) {
  let isCurrentlyActive = (configuration[w1][z1][y1][x1] === '#') ? true : false;
  let activeNeighborCount = 0;
  let neighbor = '.';
  for(let w = w1-1; w <= w1+1; w++) {
    for(let z = z1-1; z <= z1+1; z++) {
      for(let y = y1-1; y <= y1+1; y++) {
        for(let x = x1-1; x <= x1+1; x++) {
          if(!(w === w1 && x === x1 && y === y1 && z === z1)) {

            if(configuration[w] && configuration[w][z] && configuration[w][z][y] && configuration[w][z][y][x]) {
              neighbor = configuration[w][z][y][x];
            } 

            if(neighbor === '#') {
              activeNeighborCount += 1;
            }

            neighbor = '.';
          }
        }
      }
    }
  }

  if(isCurrentlyActive && (activeNeighborCount === 2 || activeNeighborCount === 3)) {
    return true;
  } else if(!isCurrentlyActive && activeNeighborCount === 3) {
    return true;
  }

  return false;
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