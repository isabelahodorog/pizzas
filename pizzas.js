// To run this script run `node pizzas.js` in the command line.
// The input should be in an 'input.txt' file in the same directory as the script.
let fs = require('fs');

const readInput = (fileName) => {
    const data = fs.readFileSync(`./${fileName}`).toString().split('\n');
    const [gridSize, noOfPizzerias] = data[0].split(' ');
    const pizzeriasInfo = [];
    let pizzeriaIndex = 1;
    while (pizzeriaIndex <= noOfPizzerias) {
        pizzeriasInfo.push(data[pizzeriaIndex]);
        pizzeriaIndex++;
    }
    return { gridSize, noOfPizzerias, pizzeriasInfo };
}

const createCity = (gridSize, noOfPizzerias, pizzeriasInfo) => {
    if (gridSize < 1 || gridSize > 1000) throw 'City size must be between 1 and 1000';
    if (noOfPizzerias < 1 || gridSize > 1000) throw 'City must have between 1 and 1000 pizzerias';

    let city = new Array(gridSize).fill(0).map(() => new Array(gridSize).fill(0));

    for (let index = 0; index < noOfPizzerias; index++) {
        let [ x, y, range ] = pizzeriasInfo[index].split(' ');
        // because javaScript arrays are 0-indexed
        if (x < 1 || y < 1 || x > gridSize || y > gridSize) throw `x and y must be in range 1 - ${gridSize}`;
        if (range < 1 || range > 100) throw 'The range of a pizzeria must be between 1 - 100';
        x--;
        y--;

        markBlocksForPizzeria(x, y, range, city, gridSize);
    }

    // return the reversed city as per what the problem asks
    return city.reverse();
}

const markBlocksForPizzeria = (x, y, range, city, gridSize) => {
    for (let i = 1; i <= range; i++) {
        if (x+i < gridSize) city[x+i][y]++;
        if (x-i >= 0) city[x-i][y]++;
        if (y+i < gridSize) city[x][y+i]++;
        if (y-i >= 0) city[x][y-i]++;
        if (i < range) {
            for (let j = 1; j <= range - i; j++ ) {
                if (x+i < gridSize && y+j < gridSize) city[x+i][y+j]++;
                if (x-i >= 0 && y-j >= 0) city[x-i][y-j]++;
                if (x+i < gridSize && y-j >= 0) city[x+i][y-j]++;
                if (x-i >= 0 && y+j < gridSize) city[x-i][y+j]++;
            }
        }
    }
    city[x][y]++;
    return city;
}

const getGreatestSelectionOfPizza = (fileName) => {
    const { gridSize, noOfPizzerias, pizzeriasInfo } = readInput(fileName);
    const city = createCity(parseInt(gridSize), parseInt(noOfPizzerias), pizzeriasInfo);
    console.log(city.join('\r\n'));
    const greatestSelectionsOfPizza = Math.max(...city.join().split(','));
    return greatestSelectionsOfPizza;
}

console.log('The greatest selection of pizza a block can have is ', getGreatestSelectionOfPizza('input.txt'));

//The complexity for this script is, including the file read: O(noOfPizzerias^2 * log(max(range of each pizzeria)))

/*
    I decided that the input will be coming from a file so that the format will be the exact same
    as the one from the requirement.
    First step was to read the input data.
    After reading the input, I chose a bidimensional array filled with 0 to represent the city, the area in question.
    The array is 0-indexed, so the first thing I'd had to do is substract 1 from the coordonates of each pizzeria from the input.
    Knowing the coordonates and the range, I can start going through the bidimensional array starting with the location of the
    pizzerias and spreading out within the allowed range. Each block that is visited is increased in value by 1.
    The rule that I followed while doing this is that for a block city[x][y], a block city[x+i][y+j] is wiithin the range if the
    sum of mod(i) and mod(j) is less than or equal to the range of the pizzeria.
    Next step is to flip the bidimensional array to represent it as it is represented in the question example and calculate the max in this array.
*/