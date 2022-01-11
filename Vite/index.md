# Vite

## 为什么选 Vite？

Vite 旨在利用生态系统中的新进展解决上述问题：浏览器开始原生支持 ES 模块，且越来越多的 JavaScript 工具使用编译型语言编写。

### 服务启动

一般打包器的方式启动必须优先抓取并构建你的整个应用，然后才能提供服务。随着包体积越来越大，启动的时间和 HMR 的时间也会越来越长。

而 Vite 的话一开始将应用的模块分为 **依赖** 和 **源码** 两类，改进了开发服务器的启动时间。

- **依赖** 大多数为开发是不会变动的纯 JavaScript。Vite 将会使用 **esbuild 预构建依赖**。EsBuild 使用 Go 编写，比 JavaScript 编写的打包器构建依赖快 10~100 倍。

- **源码** 通常包含一些并非直接是 JavaScript 的文件，需要转换（列入 JSX、CSS 或者 Vue 组件），时常会被编辑。同时，并不是所有的源码需要同时被夹在。

Vite 以**原生 ESM**方式提供源码，这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。

![](https://cn.vitejs.dev/assets/bundler.37740380.png)
![](https://cn.vitejs.dev/assets/esm.3070012d.png)

### HMR

基于打包器启动时，重建整个包的效率很低。原因显而易见：因为这样更新速度会随着应用体积增长而直线下降。

在 Vite 中,HMR 是基于原生 ESM 上执行的，当编辑一个文件时，Vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失活（大多数时候只是模块本身），是的无论应用大小如何，HMR 始终能保持快速更新。

Vite 同时也利用 HTTP 头来加速整个二面的重新加载（再次让浏览器为我们做更多事情）：源码模块的请求会根据 `304 Not Modified` 进行协商缓存，而依赖模块请求则会通过 `Cache-Control: max-age=31536000,immutable` 进行强缓存，因此一旦被缓存它们将不需要再次请求。

![](https://udh.oss-cn-hangzhou.aliyuncs.com/2019e4bc-c144-4a4f-9ca6-c0fed8b437501803240.pic.jpg)
![](https://udh.oss-cn-hangzhou.aliyuncs.com/c31f53f2-6b7e-4f51-a309-b8a0783ab9271803174.pic.jpg)
