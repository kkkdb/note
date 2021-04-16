var arr = [{ a: 1 }, { a: 2 }, { a: 10 }, { a: 0 }, { a: 2.1 }];

/**
 *
 * @param {String} property
 * @param {Boolean} judge true升序 false降序
 */
function compare(property, judge) {
  return function (a, b) {
    let value1 = a[property],
      value2 = b[property];
    if (judge) {
      return value1 - value2;
    } else {
      return value2 - value1;
    }
  };
}

console.log(arr.sort(compare("a", true)));

function filterArr(arr) {
  return arr.filter(item => {
    return item.a % 1 === 0;
  });
}
console.log(filterArr(arr));

//0.1+0.2=0.30000000000000004
console.log(parseFloat((0.1 + 0.2).toFixed(10)));

//柯里化
function currying(fn, ...rest1) {
  console.log(fn, rest1);
  return function (...rest2) {
    fn.apply(this, [...rest1, ...rest2]);
  };
}
function curryingHelper(fn, len) {
  const length = len || fn.length; // 第一遍运行length是函数fn一共需要的参数个数，以后是剩余所需要的参数个数
  return function (...rest) {
    return rest.length >= length // 检查是否传入了fn所需足够的参数
      ? fn.apply(this, rest)
      : curryingHelper(currying.apply(this, [fn, ...rest]), length - rest.length); // 在通用currying函数基础上
  };
}
function sayHello(name, age, fruit) {
  console.log(`我叫 ${name},我 ${age} 岁了, 我喜欢吃 ${fruit}`);
}
const betterShowMsg = curryingHelper(sayHello);
betterShowMsg("小衰", 20, "西瓜"); // 我叫 小衰,我 20 岁了, 我喜欢吃 西瓜
betterShowMsg("小猪")(25, "南瓜"); // 我叫 小猪,我 25 岁了, 我喜欢吃 南瓜
betterShowMsg("小明", 22)("倭瓜"); // 我叫 小明,我 22 岁了, 我喜欢吃 倭瓜
betterShowMsg("小拽")(28)("冬瓜"); // 我叫 小拽,我 28 岁了, 我喜欢吃 冬瓜

new Promise((resolve, reject) => {
  resolve(a);
})
  .then(
    result => {
      console.log("成功", result);
    },
    reason => {
      console.log("失败", reason);
    }
  )
  .then(
    result => {
      console.log("成功2", result);
    },
    reason => {
      console.log("失败2", reason);
    }
  );

function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.sex = 1;
var p = new Person("小明", 11);
for (let key in p) {
  console.log(key, p.hasOwnProperty(key));
}
Object.keys(p).forEach(item => {
  console.log(item);
});

//手写深拷贝（浅拷贝 + 递归）

function deepClone(obj) {
  if (!isObject(obj)) {
    return obj;
  }
  let newObj = Array.isArray(obj) ? [] : {};
  Object.keys(obj).forEach(item => {
    newObj[item] = isObject(obj[item]) ? deepClone(obj[item]) : obj[item];
  });
  return newObj;
}

function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}
let obj = {
  a: 1,
  b: [1, 2, 3],
  c: {
    d: 4
  },
  d: null,
  e: undefined
};
let obj2 = deepClone(obj);
let obj3 = JSON.parse(JSON.stringify(obj));
obj.c.d = 5;
console.log(obj2, obj3);

//作用域
function a() {
  console.log(123);
}
var a;
console.log(a);

//js创建对象的几种方法
var a1 = { a: 123 };
var a2 = Object.create({ a: 123 });
var a3 = new Object({ a: 123 });
console.log(a1, a2, a3);

//继承
function Animal(name) {
  this.name = name;
  this.say = () => {
    console.log(233);
  };
}
function Cat(name) {
  this.name = name;
}
Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
var cc = new Cat("粒粒");
console.log(cc);
cc.say();
