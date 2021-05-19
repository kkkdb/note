# 响应式原理

首先什么是响应式呢？Vue 是基于 MVVM 模型研发的，响应式就是数据驱动视图，视图改变数据。

那么是如何实现响应式的呢？Vue 的整体思路就是**数据劫持+观察者模式**。

### vue2.x

在 Vue2.x 中，对象内部通过 defineReactive 方法，使用 Object.defineProperty 将属性进行劫持，数组则是通过重写数组方法来实现。当页面使用对应的属性时，每个属性都有自己对应的 dep 属性，用来存放他所以来的 watcher（依赖收集）。当属性发生变化时会通知对应的 watcher 去更新（派发更新）。

为什么数组需要重写呢？Object.defineProperty 监听不了数组吗？答案是可以监控到数组下标的变化，但是由于性能问题，不对数组进行劫持。

尤大在 github 上的回答:

![image](https://tva1.sinaimg.cn/large/006tNbRwgy1gaqk0orjnqj30hq0njdjl.jpg)

相关代码如下

```
class Observer {
  // 观测值
  constructor(value) {
    if(Array.isArray(value)){
      //数组方法重写
      ...
    }else{
      this.walk(value);
    }
  }
  walk(data) {
    // 对象上的所有属性依次进行观测
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = data[key];
      defineReactive(data, key, value);
    }
  }
}
// Object.defineProperty数据劫持核心 兼容性在ie9以及以上
function defineReactive(data, key, value) {
  observe(value); // 递归关键
  // --如果value还是一个对象会继续走一遍odefineReactive 层层遍历一直到value不是对象才停止
  //   思考？如果Vue数据嵌套层级过深 >>性能会受影响
  Object.defineProperty(data, key, {
    get() {
      console.log("获取值");

      //需要做依赖收集过程 这里代码没写出来
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      console.log("设置值");
      //需要做派发更新过程 这里代码没写出来
      value = newValue;
    },
  });
}
export function observe(value) {
  // 如果传过来的是对象或者数组 进行属性劫持
  if (
    Object.prototype.toString.call(value) === "[object Object]" ||
    Array.isArray(value)
  ) {
    return new Observer(value);
  }
}
```

数组重写相关代码

```
// src/obserber/array.js
// 先保留数组原型
const arrayProto = Array.prototype;
// 然后将arrayMethods继承自数组原型
// 这里是面向切片编程思想（AOP）--不破坏封装的前提下，动态的扩展功能
export const arrayMethods = Object.create(arrayProto);
let methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "reverse",
  "sort",
];
methodsToPatch.forEach((method) => {
  arrayMethods[method] = function (...args) {
    //   这里保留原型方法的执行结果
    const result = arrayProto[method].apply(this, args);
    // 这句话是关键
    // this代表的就是数据本身 比如数据是{a:[1,2,3]} 那么我们使用a.push(4)  this就是a  ob就是a.__ob__ 这个属性就是上段代码增加的 代表的是该数据已经被响应式观察过了指向Observer实例
    const ob = this.__ob__;

    // 这里的标志就是代表数组有新增操作
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
      default:
        break;
    }
    // 如果有新增的元素 inserted是一个数组 调用Observer实例的observeArray对数组每一项进行观测
    if (inserted) ob.observeArray(inserted);
    // 之后咱们还可以在这里检测到数组改变了之后从而触发视图更新的操作--后续源码会揭晓
    return result;
  };
});

```

### vue3.x

那在 Vue3.x 中，采用 Proxy 替代了 `Object.defineProperty` ， `Proxy` 可以完美解决数组的问题吗？

1. `Object.defineProperty`只能劫持对象的属性，而`Proxy`可以直接代理对象，可监听对象和数组的变化，并且有多达 13 种拦截方法。

由于`Object.defineProperty`只能对属性进行劫持，需要遍历对象的每个属性，如果属性值也是对象，则需要深度遍历。而`Proxy`则是直接代理对象，不需要遍历。

2. `Object.defineProperty`对于新增属性需要手动进行`Observe`

新增属性时，需要使用`$set`才能保证新增属性的响应。

`set`相关代码如下

```
export function set(target: Array | Object, key: any, val: any): any {
  // 如果是数组 调用我们重写的splice方法 (这样可以更新视图)
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  // 如果是对象本身的属性，则直接添加即可
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  const ob = (target: any).__ob__;

  // 如果不是响应式的也不需要将其定义成响应式属性
  if (!ob) {
    target[key] = val;
    return val;
  }
  // 将属性定义成响应式的
  defineReactive(ob.value, key, val);
  // 通知视图更新
  ob.dep.notify();
  return val;
}

作者：Big shark@LX
链接：https://juejin.cn/post/6961222829979697165
来源：掘金
```

因为响应式数据，我们给对象和数组都加上了`__ob__`属性，代表的是`Observe`实例。当给对象新增不存在的属性时，首先会把新的属性进行响应式跟踪，然后触发对象的`__ob__`的 dep 收集到的`watchr`去更新，当修改数组索引时我们调用重写的`splice`方法去手动`Observe`。

`Vue3.x Proxy`相关代码如下

```
import { mutableHandlers } from "./baseHandlers"; // 代理相关逻辑
import { isObject } from "./util"; // 工具方法

export function reactive(target) {
  // 根据不同参数创建不同响应式对象
  return createReactiveObject(target, mutableHandlers);
}
function createReactiveObject(target, baseHandler) {
  if (!isObject(target)) {
    return target;
  }
  const observed = new Proxy(target, baseHandler);
  return observed;
}

const get = createGetter();
const set = createSetter();

function createGetter() {
  return function get(target, key, receiver) {
    // 对获取的值进行放射
    const res = Reflect.get(target, key, receiver);
    console.log("属性获取", key);
    if (isObject(res)) {
      // 如果获取的值是对象类型，则返回当前对象的代理对象
      return reactive(res);
    }
    return res;
  };
}
function createSetter() {
  return function set(target, key, value, receiver) {
    const oldValue = target[key];
    const hadKey = hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (!hadKey) {
      console.log("属性新增", key, value);
    } else if (hasChanged(value, oldValue)) {
      console.log("属性值被修改", key, value);
    }
    return result;
  };
}
export const mutableHandlers = {
  get, // 当获取属性时调用此方法
  set, // 当修改属性时调用此方法
};
```
