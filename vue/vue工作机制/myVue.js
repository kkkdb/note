class MyVue {
  constructor(options) {
    this.$el = options.el;
    this.$options = options;
    this.$data = options.data;
    this.observer(this.$data);

    // new Watch();
    // this.$data.name;
    // new Watch();
    // this.$data.foo.bar;
    new Complie(this.$el, this);

    //created 执行
    if (options.created) {
      options.created.call(this);
    }
  }

  observer(data) {
    if (typeof data !== "object" && data !== null) {
      return;
    }
    Object.keys(data).forEach(key => {
      this.defineProperty(data, key, data[key]);
      this.proxyData(key);
    });
  }

  defineProperty(data, key, val) {
    this.observer(val);
    let dep = new Dep();
    Object.defineProperty(data, key, {
      get() {
        Dep.target && dep.addDep(Dep.target);
        return val;
      },
      set(newVal) {
        if (newVal === val) return;
        val = newVal;
        dep.notify();
      }
    });
  }

  proxyData(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key];
      },
      set(newVal) {
        this.$data[key] = newVal;
      }
    });
  }
}

class Dep {
  constructor() {
    this.deps = [];
  }
  addDep(dep) {
    this.deps.push(dep);
  }
  notify() {
    this.deps.forEach(dep => dep.update());
  }
}

class Watch {
  constructor(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;

    Dep.target = this;
    this.vm[exp];
    Dep.target = null;
  }
  update() {
    this.cb && this.cb(this.vm[this.exp]);
  }
}
