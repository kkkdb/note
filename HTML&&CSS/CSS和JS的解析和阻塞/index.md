在这里我们来讨论两种 DOM 元素的解析，即样式文件(link)和脚本文件(script)。HTML 文档的解析和渲染过程中，外部样式表和脚本 **顺序执行、并发加载**。
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
