## 同源策略

### 什么是同源策略
同源策略是浏览器为了防止一些恶意行为做的一种安全机制，需要满足三方面：协议相同、域名相同、端口相同。

### 哪些地方需要用到同源
- ajax通信
- cookie
- localStorage
- indexDB
- DOM操作

## 跨域资源共享
同源策略对于用户的安全是必不可少的，当然合理的跨域请求也是很重要的，因此W3C就制定了一个名叫CORS（Cross-Origin Resource Sharing）的草案，名叫**跨域资源共享**。其基本思想就是利用自定义的HTTP头部信息来让浏览器与服务器进行沟通，从而决定响应是成功你还是失败。

### CORS 的简单请求原理
浏览器发送请求的时候会在HTTP头部携带一个`Origin`的头，包含页面的源信息（协议、域名和端口），如：
```
Origin: http://domain.com
```
若服务器接受该请求，就在`Access-Control-Allow-Origin`头部回发相同的源信息

### 图像 Ping
该跨域技术主要是利用`<img>`标签设置`src`属性（请求地址通常都带有查询字符串），然后监听该`<img>`的`onload`或`onerror`事件来判断请求是否成功。响应的内容通常是一张 1 像素的图片或者204响应。

图片 Ping 有两个缺点：

1. 因为是通过<img>标签实现，所以只支持GET请求。
2. 无法访问服务器响应脚本，只能用于在浏览器与服务器之间进行单向通行。  

由于以上特点，图片 Ping 方法常用于跟踪用户点击页面或动态广告的曝光次数。

### JSONP
`JSONP` 是 `JSON with padding` 的简写，其主要是利用动态创建`<script>`标签向服务器发送 `GET` 请求，服务器收到请求后将数据放在一个指定名字的回调函数中并传送回来。

### 其他的跨域方法
- HTML5 的 `postMessage`
- `WebSocket`（当然协议就不一样了）
- `document.domain（iframe）`
- `location.hash（iframe）`
- `window.name`
- `nginx` 反向代理