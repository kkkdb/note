function Parents() {
  this.name = "小明";
}

Parents.prototype.say = function () {
  console.log("my name is" + this.name);
};

function Child() {}

//原型对象指向构造函数
Child.prototype = new Parents();
Child.prototype.constructor = CHild;

var m = new Child();
console.log(m.name);
m.say();

//缺点是 没法传参
