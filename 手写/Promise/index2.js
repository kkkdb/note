class App {
  constructor() {
    this.callbacks = [];
    this.state = "pending";
    this.index = 0;
  }
  use = fn => {
    return new Promise(resolve => {
      this.handle({
        fn,
        resolve
      });
    }).then(() => {
      this.handle(this.callbacks[++this.index]);
    });
  };
  handle = callback => {
    if (this.state === "pending") {
      this.callbacks.push(callback);
      return;
    }
    if (!callback) return;
    callback.fn.call(this, callback.resolve);
  };
  run = () => {
    this.state = "fulfilled";
    this.handle(this.callbacks[this.index]);
  };
}

class App2 {
  constructor() {
    this.callbacks = [];
    this.index = 0;
  }
  use = fn => {
    this.callbacks.push(fn);
  };
  handle = () => {
    let fn = this.callbacks[this.index++];
    if (!fn) return;
    fn(this.handle);
  };
  run = () => {
    this.handle();
  };
}

var app = new App2();

app.use(next => {
  setTimeout(() => {
    console.log("aaa");
    next();
  }, 500);
});

app.use(next => {
  setTimeout(() => {
    console.log(123);
    next();
  }, 500);
});

app.run();
