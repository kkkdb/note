class Parents {
  constructor(name) {
    this.name = name;
  }
  say() {
    console.log("my name is" + this.name);
  }
}

class Child extends Parents {
  constructor(props) {
    super(props);
  }
}

var p = new Child("小明");
console.log(p.name);
p.say();

let idol = {
  name: "蔡*坤",
  phone: 10086,
  price: 10
};

const guangkun = new Proxy(idol, {
  get: (target, key, value) => {
    return "经纪人电话10000";
  },
  set: (target, key, value) => {
    if (key === "price") {
      if (value < target.price) return console.error("打发叫花子呢！");
      target.price = value;
    }
  }
});
console.log(guangkun.phone);
guangkun.price = 1000;
console.log(guangkun);
