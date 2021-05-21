//new超简化
function _new(Con, ...args) {
  let obj = Object.create(Con.prototype);
  let res = Con.apply(obj, args);
  return res instanceof Object ? res : obj;
}

function Test(age, name) {
  this.age = age;
  this.name = name;
}
Test.prototype.sayName = function () {
  console.log(this.name);
};
let obj = _new(Test, 13, "张三");
console.log(obj.age);
obj.sayName();
console.log(obj instanceof Test);
