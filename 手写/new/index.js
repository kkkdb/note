function Test(age, name) {
  this.age = age;
  this.name = name;
}
Test.prototype.sayName = function () {
  console.log(this.name);
};
let obj = new Test(13, "张三");
console.log(obj.age); //13
obj.sayName(); //张三
console.log(obj instanceof Test); //true

/*
  实现手写new，先了解一下new做了些什么：
  1.new 会返回一个对象，所以在内部新建一个对象
  2.这个对象可以访问原型上的属性，所以需要将对象和构造函数连接起来
  3.这个对象的this可以访问到挂载在构造函数this上的任意属性
  4.如果构造函数返回对象，就直接返回这个对象
*/
function _new(Con, ...args) {
  let obj = {};
  Object.setPrototypeOf(obj, Con.prototype); //等同于obj.__proto__ = Con.prototype
  let result = Con.apply(obj, args); //绑定其他属性
  return result instanceof Object ? result : obj;
}
let obj2 = _new(Test, 15, "李四");
console.log(obj2.age); //15
obj2.sayName(); //李四
console.log(obj2 instanceof Test); // true
