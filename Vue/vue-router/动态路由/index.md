# 动态路由

#### 什么是动态路由?

我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。例如，我们有一个 User 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 vue-router 的路由路径中使用“动态路径参数”(dynamic segment) 来达到这个效果：

```
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }
  ]
})
```

#### 响应路由参数的变化

当使用路由参数时，例如从 /user/foo 导航到 /user/bar，**原来的组件实例会被复用**。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，**这也意味着组件的生命周期钩子不会再被调用。**

复用组件时，想对路由参数的变化作出响应的话，可以有以下几种方法：

- 通过 watch 监听路由参数再发请求

```
watch: {
    $route(to, from) {
        // 对路由变化作出响应...
    }
}
```

- 使用 `beforeRouteUpdate` 导航守卫

```
beforeRouteUpdate(to, from, next) {
    // react to route changes...
    // don't forget to call next()
}
```

- 用 `:key` 来阻止“复用”

```
<router-view :key="$route.fullPath" />
```

