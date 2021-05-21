/**
 * @param {type, type}
 * @return {Boolean}
 */
function _is(x, y) {
  if (x === y) {
    //判断 -0 +0
    return x !== 0 || 1 / x === 1 / y;
  }
  return x !== x && y !== y;
}
console.log(_is(1, 2)); //false
console.log(_is(1, 1)); //true
console.log(_is(-0, +0)); //false
console.log(_is(NaN, NaN)); //true
