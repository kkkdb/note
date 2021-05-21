# 柯里化

[参考文档](https://juejin.cn/post/6844903882208837645)

## 什么是柯里化（curry）

柯里化就是将一个多个参数的函数转变成一系列一个参数函数的技术。

```
//普通函数
function fn(a,b,c,d,e) {
  console.log(a,b,c,d,e)
}
//生成的柯里化函数
let _fn = curry(fn);

_fn(1,2,3,4,5);     // print: 1,2,3,4,5
_fn(1)(2)(3,4,5);   // print: 1,2,3,4,5
_fn(1,2)(3,4)(5);   // print: 1,2,3,4,5
_fn(1)(2)(3)(4)(5); // print: 1,2,3,4,5

作者：云中桥
链接：https://juejin.cn/post/6844903882208837645
来源：掘金
```

## 柯里化的用途

柯里化实际是把简答的问题复杂化了，但是复杂化的同时，我们在使用函数时拥有了更加多的自由度。 而这里对于函数参数的自由处理，正是柯里化的核心所在。 柯里化本质上是降低通用性，提高适用性。柯里化的这种用途可以被理解为：**参数复用**

## 如何封装柯里化工具函数

```
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
```