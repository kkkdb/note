var numOne = [0, 2, 4, 6, 8, 8];
var numTwo = [1, 2, 3, 4, 5, 6];
var duplicatedValues = [...new Set(numOne)].filter(item => numTwo.includes(item));
console.log(duplicatedValues);
//[ 2, 4, 6 ]
