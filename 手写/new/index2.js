/**
 * 手写new
 * new 做了什么
 * 1.创建一个对象，继承构造函数的原型对象
 * 2.执行构造函数，将this指定为新实例对象
 * 3.返回这个实例对象
 */

function _new(Con, ...args) {
  let obj = {};
  Object.setPrototypeOf(obj, Con.prototype);
  let result = Con.apply(obj, args);
  return result instanceof Object ? result : obj;
}
