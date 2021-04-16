//手写apply
Function.prototype.myApply = function (context, args) {
  if (typeof this !== "function") {
    throw new TypeError("error");
  }
  context = context || window;
  context.fn = this;
  const result = context.fn(args);
  delete context.fn;
  return result;
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
obj.foo.myApply(a, [1, 2, 3, 4]);
//10 [ 1, 2, 3, 4 ]
