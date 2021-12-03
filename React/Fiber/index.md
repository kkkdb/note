# React Fiber（时间分片）

## Fiber 是什么

对于 React 来说，Fiber 可以从两个角度来理解：

### 1. 一种流程控制原语

`Fiber`也称`协程`，类似于`ES6`的`Generator`。**协程和线程不一样，协程本身没有并发和并行能力（需要配合线程），它只是一种控制流程的让出机制。**函数不能被中断和回复，`Generator`可以

```
const tasks = []
function * run() {
  let task

  while (task = tasks.shift()) {
    // 🔴 判断是否有高优先级事件需要处理, 有的话让出控制权
    if (hasHighPriorityEvent()) {
      yield
    }

    // 处理完高优先级事件后，恢复函数调用栈，继续执行...
    execute(task)
  }
}
```

`React Fiber`的思想和协程的概念是契合的: `React`渲染的过程可以被中断，可以将控制权交回浏览器，让位给高优先级的任务，浏览器空闲后再恢复渲染。

### 2. 一个执行单元

`Fiber`的另外一种解读是’纤维‘: 这是一种**数据结构或者说执行单元**。我们暂且不管这个数据结构长什么样，**将它视作一个执行单元，每次执行完一个'执行单元', `React`就会检查现在还剩多少时间，如果没有时间就将控制权让出去.**

Fiber 本身是一个对象，`stateNode`属性管理`Instance`自身的特性,通过 `child` 和 `sibling` 表征当前工作单元的下一个工作单元，`return` 表示处理完成后返回结果所要合并的目标，通常指向父节点。整个结构是一个链表树。

```
fiber: {
  	stateNode: {},
    child: {},
    return: {},
    sibling: {},
}

```

## Fiber 执行过程

浏览器渲染过程可分为两个阶段：`Reconciliation(协调阶段)` 和 `Commit(提交阶段)`。

在页面渲染完成后会初始化一个`fiber-tree`，和`Virtual DOM tree`一样，与此同时，react 还会维护一个`workInProgressTree`，用于计算更新，完成`reconciliation`过程。在用户操作了 DOM 调用了`setState`之后，react 会把当前的更新送入组件对应的`update queue`中，但是 react 并不会立即执行更新，而是交给了`scheduler`（调度）去处理。

`scheduler`会根据当前主线程的使用情况去处理这次`update`。为了实现这种特性，使用了`requestIdelCallback`API，对于不支持这个 API 的浏览器，react 会加上`pollyfill`。

通俗的来讲，客户端线程执行任务时会以帧的形式划分，大部分设备控制在 30-60 帧是不会影响用户体验。在两个帧之间，主线程通常会有一小段空间时间，`requestIdelCallback`就是利用这个**空闲期（Idle Period）**调用**空闲期回调（Idle Callback）**去执行一些任务。

1. 低优先级的任务由`requestIdelCallback`处理
2. 高优先级任务，例如动画相关的有`requsetAnimationFrame`处理
3. `requestIdelCallback`可以在多个空闲期调用空闲期回调执行任务
4. `requestIdelCallback`方法提供`deadline`，即任务执行限制时间，以切分任务，避免长时间执行任务，阻塞 UI 导致掉帧

一旦`reconciliation`过程得到时间片，就开始进入`work loop`。`work loop`机制可以让 react 在计算状态和等待状态之间切换。为了达到这个目的，对于每个`loop`而言，需要追踪两个东西：下一个执行单元（下一个待处理的 fiber）和当前还能占用主线程的时间。

第一个 loop，下一个待处理单元为根节点。若当前节点的更新队列为空，直接从`fiber-tree`上 clone 节点到`workInProgressTree`中去，若当前节点包含了更新，则 react 会调用 setState 时传入的`updater function`获取最新的 state 值，更新当前节点的 props 和 state 的值，然后调用 render 生成新的`elements`，再根据`elements`的类型是否改变来决定是否重用。接着根据其`child`指针，把对应的`child`节点的`update queue`也复制到`workinprogress`中，`return`指向该节点，表示该节点已经处理完成。这时候 react 检查下时间片是否用完，如果没用完，根据保存的下一个执行单元的信息开始处理下一个节点。

对于有更新的节点，需要打上标记，并且在更新之后将产生的 effect 合并到父节点。此时 react 会维护一个列表`effect list`，用来记录所有产生的 effect。最终所有节点都标记完成，回到根节点，并携带着 merge effect。此时 react 将 workInProgress 标记为 pendingCommit。意思是可以进入 commit 阶段了。

进入 commit 阶段后，reactDOM 就会根据协调阶段生成的 effict list 去更新 DOM。更新完之后，workInProgress就完全和DOM保持一致，为了让当前的fiber-tree和DOM保持一致，react交换了current和workInProgress两个指针。

事实上，react大部分时间都在维护两个数（Double-buffering）。这样可以压缩下次更新时，分配内存、垃圾清理的时间。commit完成后，执行ComponentDidMount函数。

## 总结

**时间分片并没有降低整体的工作量，该做的还是要做**, 因此 React 也在考虑利用 CPU 空闲或者 I/O 空闲期间做一些预渲染。**`React Fiber` 本质上是为了解决 `React` 更新低效率的问题**，不要期望 `Fiber` 能给你现有应用带来质的提升, 如果性能问题是自己造成的，自己的锅还是得自己背。

### 参考链接

[https://juejin.cn/post/6844903975112671239](https://juejin.cn/post/6844903975112671239)
[https://juejin.cn/post/6844903582622285831](https://juejin.cn/post/6844903582622285831)
