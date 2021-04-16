function Parents(name) {
  this.name = name;
}

Parents.prototype.say = function () {
  console.log("my name is" + this.name);
};

function Child(...args) {
  Parents.call(this, ...args);
}
Child.prototype = new Parents();
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
m.walk();
//缺点：每次创建子类实例都执行了两次构造函数(Parent.call()和new Parent())，虽然这并不影响对父类的继承，但子类创建实例时，原型中会存在两份相同的属性和方法，这并不优雅
