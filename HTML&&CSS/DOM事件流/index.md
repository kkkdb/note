### 什么是事件流

事件流一共有三个阶段分别是：

1. 捕获阶段
2. 目标阶段
3. 冒泡阶段

```
<div id="box1">
  box1
  <div id="box2">
    box2
    <div id="box3">box3</div>
  </div>
</div>
<script>
  function log(txt) {
    return () => {
      console.log(txt);
    };
  }

  box1.onclick = log("box1 onclick6666666");
  box2.onclick = log("box2 onclick");
  box3.onclick = log("box3 onclick");
  box1.onclick = log("box1 onclick");

  box1.addEventListener("click", log("box1冒泡"), false);
  box2.addEventListener("click", log("box2冒泡"), false);
  box3.addEventListener("click", log("box3冒泡"), false);
  box1.addEventListener("click", log("box1捕获"), true);
  box2.addEventListener("click", log("box2捕获"), true);
  box3.addEventListener("click", log("box3捕获"), true); //第三个参数true冒泡执行，false或不填为捕获执行
</script>
```

输出结果：

```
box1捕获
box2捕获
box3捕获
box3 onclick
box3冒泡
box2 onclick
box2冒泡
box1 onclick
box1冒泡
```

可以看到 onclick 事件会被后者覆盖。看结果好像是先执行捕获，接着目标，再接着冒泡。那换下 onclick 事件定义的位置试试。

```
  box1.addEventListener("click", log("box1冒泡"), false);
  box2.addEventListener("click", log("box2冒泡"), false);
  box3.addEventListener("click", log("box3冒泡"), false);
  box1.addEventListener("click", log("box1捕获"), true);
  box2.addEventListener("click", log("box2捕获"), true);
  box3.addEventListener("click", log("box3捕获"), true); //第三个参数true冒泡执行，false或不填为捕获执行

  box1.onclick = log("box1 onclick6666666");
  box2.onclick = log("box2 onclick");
  box3.onclick = log("box3 onclick");
  box1.onclick = log("box1 onclick");

```

输出结果：

```
box1捕获
box2捕获
box3捕获
box3冒泡
box3 onclick
box2冒泡
box2 onclick
box1冒泡
box1 onclick
```

发现先执行了冒泡，在执行目标。这是为什么呢？
因为在触发事件的目标元素身上不区分冒泡捕获，按绑定的顺序来执行。