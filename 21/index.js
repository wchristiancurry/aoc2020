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
  let [recipes, allergens, ingredients] = parseInput(input);
  let possibleIngredientToAllergen = buildPossibleIngredientToAllergenMap(ingredients, allergens, recipes);

  let nonAllergens = [];
  for(let i = 0; i < ingredients.length; i++) {
    if(!possibleIngredientToAllergen.get(ingredients[i])) {
      nonAllergens.push(ingredients[i]);
    }
  }

  let totalTimesIngredientsUsed = 0;
  for(let i = 0; i < nonAllergens.length; i++) {
    for(let j = 0; j < recipes.length; j++) {
      if(recipes[j].ingredients.includes(nonAllergens[i])) {
        totalTimesIngredientsUsed+=1;
      }
    }
  }
  
  return totalTimesIngredientsUsed;
}

function problem2(input) { 
  let [recipes, allergens, ingredients] = parseInput(input);
  let possibleIngredientToAllergen = buildPossibleIngredientToAllergenMap(ingredients, allergens, recipes);

  let solved = new Map();
  while(possibleIngredientToAllergen.size > 0) {
    for (const [ingredient, allergens] of possibleIngredientToAllergen.entries()) {
      if(allergens.length === 1) {
        solved.set(ingredient, allergens[0]);
        break;
      } else {
        //do something
      }
    }

    for(const [ingredient, allergens] of solved.entries()) {
      possibleIngredientToAllergen.delete(ingredient);
    }
    for(const [ingredient, allergens] of possibleIngredientToAllergen.entries()) {
      for(const [i, a] of solved.entries()) {
        possibleIngredientToAllergen.set(ingredient, allergens.filter(allergen => allergen !== a));
      }
    }
  }

  //i'm not sure the right way to do this right now
  let allergenToIngredientMap = new Map();
  for(const [ingredient, allergen] of solved.entries()) {
    allergenToIngredientMap.set(allergen, ingredient);
  }

  allergens.sort();
  let returnString = '';
  for(let i = 0; i < allergens.length; i++) {
    returnString += allergenToIngredientMap.get(allergens[i]);
    if(i < allergens.length-1) {
      returnString += ','
    }
  }

  return returnString;
}

function buildPossibleIngredientToAllergenMap(ingredients, allergens, recipes) {
  let possibleIngredientToAllergen = new Map();
  for(let i = 0; i < ingredients.length; i++) {
    let ingredient = ingredients[i];
    
    for(let j = 0; j < allergens.length; j++) {
      let allergen = allergens[j];

      let ingredientAlwaysPresentWithAllergen = true;
      for(let k = 0; k < recipes.length; k++) {
        let recipe = recipes[k];
        if(recipe.allergens.includes(allergen)
          && !recipe.ingredients.includes(ingredient)) {
            ingredientAlwaysPresentWithAllergen = false;
            break;
        }
      }

      if(ingredientAlwaysPresentWithAllergen) {
        if(possibleIngredientToAllergen.get(ingredient)) {
          let existing = possibleIngredientToAllergen.get(ingredient).slice();
          existing.push(allergen);
          possibleIngredientToAllergen.set(ingredient, existing);
        } else {
          possibleIngredientToAllergen.set(ingredient, [allergen]);
        }
      }
    }
  }

  return possibleIngredientToAllergen;
}

function parseInput(input) {
  let recipes = [];
  let uniqueAllergens = [];
  let uniqueIngredients = [];
  for(let i = 0; i < input.length; i++) {
    let line = input[i];
    line = line.split(' ');

    let ingredients = [];
    let allergens = [];

    isIngredient = true;
    for(let i = 0; i < line.length; i++) {
      let word = line[i];
      word = word.replace(/[\(\),]+/g, '');

      if(word === 'contains') {
        isIngredient = false;
      } else if(isIngredient) {
        ingredients.push(word);

        if(!uniqueIngredients.includes(word)) {
          uniqueIngredients.push(word);
        }
      } else {
        allergens.push(word);

        if(!uniqueAllergens.includes(word)) {
          uniqueAllergens.push(word);
        }
      }
    }

    recipes.push({
      ingredients: ingredients,
      allergens: allergens
    })
  }

  return [recipes, uniqueAllergens, uniqueIngredients];
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