// sum(100,200)(300)()  600

function add(a, b, c) {
  return a + b + c;
}

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args2) {
        return curried.bind(this, ...args.concat(args2));
      };
    }
  };
}

const sum = curry(add);

console.log(sum(100, 200)(300)()); //600
