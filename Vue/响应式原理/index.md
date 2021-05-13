# 响应式原理

首先什么是响应式呢？Vue是基于MVVM模型研发的，响应式就是数据驱动视图，视图改变数据。

那么是如何实现响应式的呢？Vue的整体思路就是**数据劫持+观察者模式**。

对象内部通过defineReactive方法，使用Object.defineProperty将属性进行劫持，数组则是通过重写数组方法来实现。当页面使用对应的属性时，每个属性都有自己对应的dep属性，用来存放他所以来的watcher（依赖收集）。当属性发生变化时会通知对应的watcher去更新（派发更新）。

相关代码如下
```
class Observer {
  // 观测值
  constructor(value) {
    this.walk(value);
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