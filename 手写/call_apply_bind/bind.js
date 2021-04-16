Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("error");
  }
  let _this = this;
  //函数两种调用方式,new 和 直接调用
  return function F() {
    if (this instanceof F) {
      return new _this(...args, ...arguments);
    }
    return _this.apply(context, [...args, ...arguments]);
  };
};
let obj = {
  nun: 233,
  foo(arr) {
    console.log(this.num, arr);
  }
};
let a = {
  num: 10
};
obj.foo.bind(a)([1, 2, 3, 4]);



Function.prototype.myBind2 = function (context, ...args) {
  //验证是否是函数
  let self = this;
  let fn = function () {
    self.apply(this instanceof self ? this : context, [...args, ...arguments]);
  };
  fn.prototype = Object.create(self.prototype);
  return fn;
};
