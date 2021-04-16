function Parents(name) {
  this.name = name;
}

Parents.prototype.say = function () {
  console.log("my name is" + this.name);
};

function Child(...args) {
  Parents.call(this, ...args);
}

var m = new Child("小明");
var n = new Child("小红");
console.log(m.name);
console.log(n.name);
// m.say(); 会报错 没法继承原型链上的属性和方法
