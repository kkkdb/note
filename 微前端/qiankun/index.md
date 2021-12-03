# 基于 qiankun 的微前端应用实践

## 业务背景

商城管理后台需要将标签系统整个这一块儿独立拆分出去。当初一开始没有建新工程去写标签系统其实是有决策失误，以为只是商城的一个附属产品。当初没考虑长久，如今希望能独立出来。那必然是件好事，首先商城的代码可以减轻不少，其次开发也更方便，单独的项目工程管理。

当时听到这个需求，脑海中大致有这么几个方案：

- 新工程、新域名，完全独立
- 微前端

![系统框架](https://udh.oss-cn-hangzhou.aliyuncs.com/b521013d-6a82-4a06-8b1c-e13e930144fb38169299002.png)

首先来看下之前系统的布局。头部是和侧边栏是通用的。登录之后可以通过切换按钮在商城和标签系统之间切换，切换之后侧边栏会显示不同的菜单列表。这时候第一种方案就会有个问题，因为标签系统是新的域名，切换系统时必须在域名跳转的时候携带登录信息。两个系统之间通信也有问题，没法共享一些公共的属性。太独立了。

## 乾坤(qiankun)

当时刚好在看微前端相关知识，那就让我们来看下微前端能干什么，首先什么是微前端？

- **技术栈无关**

  主框架不限制接入应用的技术栈，微应用具备完全自主权

- **独立开发，独立部署**

  微应用仓库独立，前后端可独立开发，部署完成后主框架自动完成同步更新

- **增量升级**

  在面对各种复杂场景时，我们通常很难对一个已经存在的系统做全量的技术栈升级或重构，而微前端是一种非常好的实施渐进式重构的手段和策略

- **独立运行时**

  每个微应用之间状态隔离，运行时状态不共享

其实微前端当初衍生的作用是解决不同框架带来的影响，将一整个的应用拆分成若干个微应用，各个微应用之间又可以做到技术栈无关。

qiankun（乾坤）是由蚂蚁金服推出的基于 `Single-Spa` 实现的前端微服务框架，本质上还是**路由分发式**的服务框架，不同于原本 `Single-Spa` 采用 `JS Entry` 加载子应用的方案，qiankun 采用 `HTML Entry` 方式进行了替代优化。只需要配置好入口文件，qiankun 会自行`Fetch`请求资源，解析出 CSS 和 JS 文件资源后，插入到给定的容器中。

![HTML Entry](https://udh.oss-cn-hangzhou.aliyuncs.com/df78fca0-524c-4ade-9b1d-a58fe1ccf62584HTMLEntry.png)

> `JS Entry` 的方式通常是子应用将资源打成一个 `Entry Script`

# 方案实践

接下来将我们系统的布局稍做一下处理。

![系统框架-改](https://udh.oss-cn-hangzhou.aliyuncs.com/e0baa257-e047-41a9-9e9a-b76418bc41d038173373497.png)

主应用内控制用户的登录、注册还有头部模块。当用户登录之后，用户信息被缓存，qiankun 通过应用间的通信可以告知子应用用户已登录。切换按钮点击之后主应用直接通过`window.history.pushState()`修改路由实现不同子应用之间的切换。每个子应用单独管理菜单和展示的内容。

因为是从一个项目里面脱离出两个子引用，因此子应用都是用的`React`框架，主应用这边为了统一方便也用了`React`。

## 主应用

用 `Create React App` 新建了个项目，然后安装 `qiankun`

```
yarn add qiankun
```

或者

```
npm i qiankun -S
```

### 在主应用中注册微应用

1. 修改 index.js

```
// src/index.js
import { registerMicroApps, addGlobalUncaughtErrorHandler, start } from 'qiankun';

//配置子应用apps路由
const microApps = [
  /**
   * name: 微应用名称 - 具有唯一性
   * entry: 微应用入口 - 通过该地址加载微应用，通过配置引入区分测试和正式环境
   * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
   * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
   */
  {
    name: "xiaodian_admin",
    entry: config.sub_admin_entry,
    activeRule: "/xiaodianAdmin",
    container: "#subapp-viewport",
  },
  {
    name: "xiaodian_tag",
    entry: config.sub_tag_entry,
    activeRule: "/xiaodianTag",
    container: "#subapp-viewport",
  },
];

/**
 * 注册微应用
 * 第一个参数 - 微应用的注册信息
 * 第二个参数 - 全局生命周期钩子
 */
registerMicroApps(microApps, {
  // qiankun 生命周期钩子 - 微应用加载前
  beforeLoad: (app) => {
    console.log("before load app.name====>>>>>", app.name);
  },
  // qiankun 生命周期钩子 - 微应用挂载前
  beforeMount: [
    (app) => {
      console.log("[LifeCycle] before mount %c%s", "color: green;", app.name);
    },
  ],
  // qiankun 生命周期钩子 - 微应用挂载后
  afterMount: [
    (app) => {
      console.log("[LifeCycle] after mount %c%s", "color: green;", app.name);
    },
  ],
  // qiankun 生命周期钩子 - 微应用卸载后
  afterUnmount: [
    (app) => {
      console.log("[LifeCycle] after unmount %c%s", "color: green;", app.name);
    },
  ],
});

/**
 * 添加全局的未捕获异常处理器
 */
addGlobalUncaughtErrorHandler((event) => {
  console.error(event);
  const { msg } = event;
  // 加载失败时提示
  if (msg && msg.includes("died in status LOADING_SOURCE_CODE")) {
    console.error("微应用加载失败，请检查应用是否可运行");
  }
});

/**
 * 添加全局的未捕获异常处理器
 */
start();

```

这里会用到 qiankun 的两个重要的 API ：

- registerMicroApps
- start

通过图示具体理解一下 qiankun 注册子应用的过程：

![qiankun注册子应用](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ea9b444e6344baa8923c6e3b5bb4aa6~tplv-k3u1fbpfcp-watermark.awebp)

- 依赖注入后，会先初始化标识变量参数 xx_QIANKUN\_\_，用于子应用判断所处环境等

- 当 qiankun 会通过 activeRule 的规则来判断是否激活子应用

  - activeRule 为字符串时，以路由拦截方式进行自主拦截
  - activeRule 为函数时，根据函数返回值判断是否激活

- 当激活子应用时，会通过 HTML-Entry 来解析子应用静态资源地址，挂载到对应容器上

- 创建沙箱环境，查找子应用生命周期函数，初始化子应用

当微应用信息注册完之后，一旦浏览器的 url 发生变化，便会自动触发 qiankun 的匹配逻辑，所有 activeRule 规则匹配上的微应用就会被插入到指定的 container 中，同时依次调用微应用暴露出的生命周期钩子。接下来修改 App.js 文件，必须保证在执行`start()`函数，container 已存在。

2. 修改 App.js

```
// src/App.js
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/router"; //路由文件
import TopBar from "./views/component/TopBar"; //公共顶部
import store from "./store/store"; //通信方法
import Loading from "./views/component/Loading.jsx"; //loading

const App = (props) => {
  const { loading } = props;
  const storeState = store.getGlobalState();
  return (
    <div className="App">
      <BrowserRouter>
        {/* 登录页头部不展示;当子应用加载时会赋值mainMenuType，头部被展示出来 */}
        {storeState.mainMenuType ? <TopBar></TopBar> : null}
        <Router></Router>
      </BrowserRouter>
      <div className="mainapp-main">
        {/* 子应用 */}
        <Loading loading={loading} />
        <main id="subapp-viewport"></main>
      </div>
    </div>
  );
};
```

## 子应用

1. 新增 `public-path.js` 文件
   当子应用挂载在主应用下的时候，一些静态资源如果沿用了`publicPath=/`的配置，拿到的域名将会是主应用域名，资源加载会出错，好在 Webpack 提供了修改方法，如下：

```
// src/public-path.js
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

> 子应用可以通过 `window.__POWERED_BY_QIANKUN__` 判断当前是否挂在在主应用下

2. 路由 base 设置

因为通常来说，主应用会拦截浏览器路由变化以激活加载子应用。主应用配置了 `activeRule: xiaodianAdmin` 为 `xiaodian_admin` 的激活规则，因此 `xiaodian_admin` 工程的路由文件需要修改下：

```
<BrowserRouter
  basename={window.__POWERED_BY_QIANKUN__ ? "/xiaodianAdmin" : "/"}
>
  ...
</BrowserRouter>
```

3. 导出生命周期函数

子应用的入口文件需要导出 `bootstrap、mount、unmount` 三个生命周期钩子，以供主应用在适当的时机调用。

```
// src/index.js

...

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log("react app bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log("props from main framework", props);
  /** 去设置mainMenuType  */
  render(props);
}

/**
 * 应用每次切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(document.getElementById("root"));
}

```

> 注意：所有的生明周期函数都必须是 Promise

4. 修改打包配置

为了不`eject`所有 webpack 配置，这边用`react-app-rewired`去重写 webpack 配置。

首先 `npm install react-app-rewired --save-dev`

接着 src 目录下新建一个 `config-override.js`文件

```
const {
  override,
  overrideDevServer,
  fixBabelImports,
  addWebpackAlias,
  addWebpackExternals,
} = require("customize-cra");
const path = require("path");
const { name } = require("./package");

const addCustomize = () => (config) => {
  if (process.env.NODE_ENV === "production") {
    // 关闭sourceMap
    config.devtool = false;
  }
  config.output.library = `${name}-[name]`;
  // 将你的 library 暴露为所有的模块定义下都可运行的方式
  config.output.libraryTarget = "umd";
  // 按需加载相关
  config.output.jsonpFunction = `webpackJsonp_${name}`;
  config.output.globalObject = "window";
  return config;
};

const devServerConfig = () => (config) => {
  // 配置跨域请求头，解决开发环境的跨域问题
  config.headers = {
    "Access-Control-Allow-Origin": "*",
  };
  // 配置 history 模式
  config.historyApiFallback = true;
  config.hot = false;
  config.watchContentBase = false;
  // config.liveReload = false;
  // 配置代理服务
  config.proxy = [
    {
      context: [
        "/xiaodian_admin",
        //...
      ],
      target: "...",
      changeOrigin: true,
    },
  ];
  return config;
};

module.exports = {
  webpack: override(
    addCustomize(),
    fixBabelImports("import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: "css",
    }),
    addWebpackAlias({
      //  别名： 绝对路径
      "@": pathResolve("./src"),
    }),
    addWebpackExternals({
      // 不做打包处理配置，如直接以cdn引入的
      xlsx: "XLSX",
      echarts: "echarts",
      html2canvas: "html2canvas",
    })
  ),
  devServer: overrideDevServer(devServerConfig()),
};

```

> 注意：配置的修改为了达到两个目的，一个是暴露生命周期函数给主应用调用，第二点是允许跨域访问，修改的注意点可以参考代码的注释。

- **暴露生命周期：** UMD 可以让 qiankun 按应用名称匹配到生命周期函数
- **允许跨域访问：** 主应用是通过 Fetch 获取数据，本地开发需要允许跨域请求。线上项目需要修改 nginx 配置

## 主应用与子应用间通信

主应用新建 `store.js`

```
// src/store/store.js
import { initGlobalState } from "qiankun";

const initialState = {
  mainMenuType: localStorage.getItem("mainMenuType") || "",
};

const actions = initGlobalState(initialState);

actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  for (const key in state) {
    initialState[key] = state[key];
  }
});

actions.getGlobalState = (key) => {
  return key ? initialState[key] : initialState;
};

export default actions;
```

子应用可以在 mount 的生命周期函数里面获取通信方法，props 默认会有 `onGlobalStateChange` 和 `setGlobalState` 两个 api

```
export async function mount(props) {
  // 通过props.setGlobalState去修改主应用的全局变量
  props.setGlobalState({
    mainMenuType: "tag",
  });
  localStorage.setItem("mainMenuType", "tag");
  render(props);
}

```

> 这其实是一个发布-订阅的设计模式。

## Nginx 配置

## 遇到的问题

1. 部署上有点繁琐，需要手动解决跨域问题。Nginx 子域名的配置需要加上跨域配置，子应用的域名访问也需要配置 CORS。

2. 子应用挂载在主应用下时

- 需要将 window.open 方法重写

```
if (window.__POWERED_BY_QIANKUN__){
  window.open = (function (naviteOpen) {
    return function (url, windowName, windowFeatures) {
      const originUrl = window.location.origin;
      let newUrl = url;
      if (url.indexOf(originUrl) === 0 && !url.includes("xiaodianAdmin")) {
        newUrl = originUrl + "/xiaodianAdmin" + url.substr(originUrl.length);
      }
      return naviteOpen(newUrl, windowName, windowFeatures);
    };
  })(window.open);
}
```

- 返回子应用的登录页需要直接跳回主应用的登录页。
  `https://xxx.xx.com/xiaodianAdmin/login` => `https://xxx.xx.com/login`

```
if (window.__POWERED_BY_QIANKUN__) {
    window.history.pushState({}, "/login", "/login");
  }
```

- Topbar 需要隐藏。

3. 子应用是通过 fetch 去加载 entry，然后每次发布之后子应用都会有缓存，导致页面加载不出来。在 index.html 里面设置`Cache-Control no-cache`，但貌似不生效。问题一直存在。。。

## 优化

1. 微前端部署完成之后现有三个项目，本地开发的需要`git clone`三次，`npm run install`三次，`npm run start`三次，这明显有点繁琐，需要弄个项目聚合管理。

- 使用 git submodule
- 使用 git subtree
- 单纯地将所有子仓库放到聚合目录下并.gitignore 掉
- 使用 lerna 管理

看起来第三种方法实现比较简单，在主应用下面 clone 所有的子应用并 gitignore，在 package.json 里面的 scripts 里面加一条：

```
 "scripts": {
    "clone:all": "bash ./scripts/clone-all.sh",
  },
```

执行 npm run clone:all 就可以做到一键 clone 所有子仓库了。

一键 install 和一键启动整个项目，我们参考 qiankun 的 examples，使用 `npm-run-all` 来做这个事情。

    1. 聚合库安装npm i npm-run-all -D。
    2. 聚合库的package.json增加install和start命令：

```
"scripts": {
    ...
    "install": "npm-run-all --serial install:*",
    "install:main": "cd main && npm i",
    "install:sub-vue": "cd sub-vue && npm i",
    "install:sub-react": "cd sub-react && npm i",
    "start": "npm-run-all --parallel start:*",
    "start:sub-react": "cd sub-react && npm start",
    "start:sub-vue": "cd sub-vue && npm start",
    "start:main": "cd main && npm start"
  },
```

> npm-run-all 的--serial 表示有顺序地一个个执行，--parallel 表示同时并行地运行。

配好以上，一键安装 npm i,一键启动 npm start。

2. 之后的第三方授权操作都放到主应用里面去。

参考文献：

[qiankun](https://qiankun.umijs.org/zh)

[基于 qiankun 的微前端应用实践](https://juejin.cn/post/6938207400457404430#heading-2)
