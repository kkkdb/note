# 根据 Promise/A+ 规范，手写 Promise

```js
function Promise(executor) {
    let self = this;

    self.status = 'pending';
    self.data = undefined;
    self.onResolvedCallback = [];
    self.onRejectedCallback = [];

    function resolve(value) {
        if (self.status === 'pending') {
            self.status = 'resolved';
            self.data = value;
            for (let i = 0; i < self.onResolvedCallback.length; i++) {
                self.onResolvedCallback[i](value);
            }
        }
    }

    function reject(err) {
        if (self.status === 'pending') {
            self.status = 'rejected';
            self.data = err;
            for (let i = 0; i < self.onRejectedCallback.length; i++) {
                self.onRejectedCallback[i](err);
            }
        }
    }

    executor(resolve, reject);
}

Promise.prototype.then = function (onResolved) {
    return new Promise((resolve, reject) => {
        try {
            const x = onResolved(this.data);
            if (x instanceof Promise) {
                x.then(resolve, reject);
            }
            resolve(x);
        } catch (err) {
            reject(err);
        }
    });
};
```

## 最简实现链式调用

```js
function Promise(fn) {
    this.cbs = [];

    const resolve = (value) => {
        setTimeout(() => {
            this.data = value;
            this.cbs.forEach((cb) => cb(value));
        });
    };

    fn(resolve);
}

Promise.prototype.then = function (onResolved) {
    return new Promise((resolve) => {
        this.cbs.push(() => {
            const res = onResolved(this.data);
            if (res instanceof Promise) {
                res.then(resolve);
            } else {
                resolve(res);
            }
        });
    });
};
```
