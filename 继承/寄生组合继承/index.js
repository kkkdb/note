function Parents(name) {
  this.name = name;
}

Parents.prototype.say = function () {
  console.log("my name is" + this.name);
};

function Child(...args) {
  Parents.call(this, ...args);
}
Child.prototype = Object.create(Parents.prototype);
Child.prototype.constructor = Child;

Child.prototype.walk = function () {
  console.log("没事儿走两步");
};

var m = new Child("小明");
var n = new Child("小红");
console.log(m.name);
console.log(n.name);
m.say();
n.say();

var p = new Parents("爸爸");
p.say();
p.walk();
