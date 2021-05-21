/**
 * @param {object || function} object
 * @return {object || function}
 */
function deepClone(object) {
  if (typeof object !== "object" && typeof object !== "function") {
    return object;
  }
  let newObject = Array.isArray(object) ? [] : {};
  Object.keys(object).forEach((item) => {
    newObject[item] =
      typeof object[item] == "object" ? deepClone(object[item]) : object[item];
  });
  return newObject;
}

let oldObject = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
};
let newObject = deepClone(oldObject);
newObject.b.c = 4;
console.log(newObject.b.c == oldObject.b.c); //false
