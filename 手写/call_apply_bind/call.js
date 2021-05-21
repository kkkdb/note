//手写call call的作用就是改变this的指向
Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("error");
  }
  context = context || window;
  //创建唯一的key值 作为我们构造的内部context的方法名
  let fn = Symbol();
  context[fn] = this;
  return context[fn](...args);
};

let obj = {
  num: 233,
  foo(...args) {
    console.log(this.num, args);
  },
};

let a = {
  num: 10,
};

obj.foo.myCall(a, 1, 2, 3, 4);
//10 [ 1, 2, 3, 4 ]

Function.prototype.myCall2 = function (context, ...args) {
  if (typeof this !== "function") {
    return;
  }
  context = context || window;
  context.fn = this;
  let result = context.fn(...args);
  delete context.fn;
  return result;
};
