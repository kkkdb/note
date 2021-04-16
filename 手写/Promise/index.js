class _Promise {
  callBacks = [];
  state = "pending";
  value = null;
  constructor(fn) {
    fn(this._resolve.bind(this));
  }
  then(onFullFiled) {
    if (this.state === "pending") {
      this.callBacks.push(onFullFiled);
    } else {
      onFullFiled(this.value);
    }
    return this;
  }
  _resolve(value) {
    this.state = "fulfilled";
    this.value = value;
    this.callBacks.forEach(fn => fn(value));
  }
}

let p = new _Promise(resolve => {
  resolve("666");
  console.log(123);
})
  .then(res => {
    console.log("p1", res);
  })
  .then(res => {
    console.log("p2", res);
  });
