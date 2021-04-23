#### 主要流程

呈现引擎一开始会从网络层获取请求文档的内容，随后开始解析 HTML 文档，并将各标记逐个转化成“内容树”上的 DOM 节点。同时也会解析外部 CSS 文件以及样式元素中的样式数据。HTML 中这些带有视觉指令的样式信息将用于创建另一个树结构：**呈现树**。

呈现树包含多个带有视觉属性（如颜色和尺寸）的矩形。这些矩形的排列顺序就是它们将在屏幕上显示的顺序。

呈现树构建完毕之后，进入“布局”处理阶段，也就是为每个节点分配一个应出现在屏幕上的确切坐标。下一个阶段是“绘制” - 呈现引擎会遍历呈现树，由用户界面后端层将每个节点绘制出来。

需要着重指出的是，这是一个渐进的过程。为达到更好的用户体验，**呈现引擎会力求尽快将内容显示在屏幕上。它不必等到整个 HTML 文档解析完毕之后，就会开始构建呈现树和设置布局**。在不断接收和处理来自网络的其余内容的同时，呈现引擎会将部分内容解析并显示出来。

解析渲染该过程主要分为以下步骤：

1. 解析 HTML
2. 构建 DOM 树
3. DOM 树与 CSS 样式进行附着构造呈现树
4. 布局
5. 绘制
#### 解析与构建 DOM 树

在这里我们讨论两种 DOM 元素的解析，即样式文件(link)和脚本文件(script)。
由于浏览器采用自上而下的方式解析，在遇到这两种元素时都会阻塞浏览器的解析，直到外部资源加载并解析或执行完毕后才会继续向下解析 html。

经过测试得出以下四条结论：

**1. 外部样式会阻塞后续脚本执行，直到外部样式加载并解析完毕。**

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>JS Bin</title>
    <script>
      var start = +new Date();
    </script>
    <link href="http://udacity-crp.herokuapp.com/style.css?rtt=2" rel="stylesheet" />
  </head>
  <body>
    <span id="result"></span>
    <script>
      var end = +new Date();
      document.getElementById("result").innerHTML = end - start;
    </script>
  </body>
</html>
```

![样式文件阻塞](https://images0.cnblogs.com/blog/412020/201409/201357415969516.jpg)

**2. 外部样式不会阻塞后续外部脚本的加载，但会阻塞外部脚本的执行。**

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>JS Bin</title>
  <script>var start = +new Date;</script>
  <link href="http://udacity-crp.herokuapp.com/style.css?rtt=2" rel="stylesheet">
</head>
<body>
  test
  <script src="http://udacity-crp.herokuapp.com/time.js?rtt=1&a"></script>
  <div id="result"></div>
  <script>var end = +new Date;document.getElementById("result").innerHTML = end-start;</script>
</body>
</html>
```

外部脚本代码

```
var loadTime = document.createElement('div');
loadTime.innerText = document.currentScript.src + ' executed @ ' + window.performance.now();
loadTime.style.color = 'blue';
document.body.appendChild(loadTime);
```

![2](https://images0.cnblogs.com/blog/412020/201409/201407227214213.jpg)
从结果可以看到开始加载时间不受影响，但执行时间受阻塞

**3. 如果后续外部脚本含有 async 属性（IE 下为 defer），则外部样式不会阻塞该脚本的加载与执行**

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>JS Bin</title>
  <script>var start = +new Date;</script>
  <link href="http://udacity-crp.herokuapp.com/style.css?rtt=2" rel="stylesheet">
</head>

<body>
  test
  <script src="http://udacity-crp.herokuapp.com/time.js?rtt=1&a" async></script>
  <div id="result"></div>
  <script>var end = +new Date;document.getElementById("result").innerHTML = end-start;</script>
</body>
</html>
```

![3](https://images0.cnblogs.com/blog/412020/201409/201417036284209.jpg)
从结果看得到开始加载和执行都没有受阻塞

**4. 对于动态创建的 link 标签不会阻塞其后动态创建的 script 的加载与执行，不管 script 标签是否具有 async 属性，但对于其他非动态创建的 script，以上三条结论仍适用**

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>JS Bin</title>
  <script>var start = +new Date;</script>

</head>
<body>
  test
  <script>
    //动态引入样式文件
    var link = document.createElement('link');
    link.href = "http://udacity-crp.herokuapp.com/style.css?rtt=2";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    //动态引入脚本文件
    var script = document.createElement('script');
    script.src = "http://udacity-crp.herokuapp.com/time.js?rtt=1&a";
    document.head.appendChild(script);
  </script>
  <div id="result"></div>
  <script>var end = +new Date;document.getElementById("result").innerHTML = end-start;</script>
</body>
</html>
```

这是最终浏览器内的结构
![4.1](https://images0.cnblogs.com/blog/412020/201409/201427440654419.jpg)
![4.2](https://images0.cnblogs.com/blog/412020/201409/201429598156546.jpg)
通过结构图和瀑布图可以看出，动态引入的样式文件对于动态引入的脚本文件的加载和执行都不会阻塞。

#### 构建呈现树
什么是呈现树？它由可视化元素按照其显示顺序而组成的树，也是文档的可视化表示。它的作用是让您按照正确的顺序绘制内容。



参考文献： [HTML 渲染过程详解](https://www.cnblogs.com/dojo-lzz/p/3983335.html)
