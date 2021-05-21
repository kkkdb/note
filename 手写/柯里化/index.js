/**
 * 形参个数大于传参的个数返回一个函数，可继续传参执行
 * 形参个数等于传参个数执行该函数
 * @param {function} fn
 */

function curry(fn) {
  let len = fn.length;
  return _curry.call(this, fn, len);
}

function _curry(fn, len, ...args) {
  return function (...params) {
    let _args = [...args, ...params];
    if (_args.length >= len) {
      return fn.apply(this, _args);
    } else {
      return _curry.call(this, fn, len, ..._args);
    }
  };
}

//普通函数
function fn(a, b, c, d, e) {
  console.log(a, b, c, d, e);
}
//生成的柯里化函数
let _fn = curry(fn);

_fn(1, 2, 3, 4, 5); // print: 1,2,3,4,5
_fn(1)(2)(3, 4, 5); // print: 1,2,3,4,5
_fn(1, 2)(3, 4)(5); // print: 1,2,3,4,5
_fn(1)(2)(3)(4)(5); // print: 1,2,3,4,5
