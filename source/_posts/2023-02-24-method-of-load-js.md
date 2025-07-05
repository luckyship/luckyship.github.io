---
layout: post
title: html中javascript的6种加载方式
tags: [javascript]
comments: true
date: 2023-02-24 13:58:50
---

### JS 的 6 种加载方式

#### 1）正常模式

```html
<script src="index.js"></script>
```

这种情况下 JS 会阻塞 dom 渲染，浏览器必须等待 index.js 加载和执行完成后才能去做其它事情

#### 2）async 模式

```html
<script async src="index.js"></script>
```

async 模式下，它的加载是异步的，JS 不会阻塞 DOM 的渲染，async 加载是无顺序的，当它加载结束，JS 会立即执行

使用场景：若该 JS 资源与 DOM 元素没有依赖关系，也不会产生其他资源所需要的数据时，可以使用 async 模式，比如埋点统计

<!-- more -->

#### 3）defer 模式

```html
<script defer src="index.js"></script>
```

defer 模式下，JS 的加载也是异步的，defer 资源会在 `DOMContentLoaded` 事件触发之前执行，并且 defer 是有顺序的执行，不会阻塞 dom 解析

如果有多个设置了 defer 的 script 标签存在，则会按照引入的前后顺序执行，即便是后面的 script 资源先返回

所以 defer 可以用来控制 JS 文件的执行顺序，比如 element-ui.js 和 vue.js，因为 element-ui.js 依赖于 vue，所以必须先引入 vue.js，再引入 element-ui.js

```html
<script defer src="vue.js"></script>
<script defer src="element-ui.js"></script>
```

defer 使用场景：一般情况下都可以使用 defer，特别是需要控制资源加载顺序时

#### 4）module 模式

```html
<script type="module">
  import { a } from "./a.js";
</script>
```

在主流的现代浏览器中，script 标签的属性可以加上 `type="module"`，浏览器会对其内部的 import 引用发起 HTTP 请求，获取模块内容。这时 script 的行为会像是 defer 一样，在后台下载，并且等待 DOM 解析

Vite 就是利用浏览器支持原生的 `es module` 模块，开发时跳过打包的过程，提升编译效率

#### 5） preload

```html
<link rel="preload" as="script" href="index.js" />
```

值得关注的就是 as 属性，preload 的优先级顺序和这个属性指定的资源类型相关。
举一个例子，假如我们指定了 as 的值是 style，也就是把它当做 css 资源，那它的优先级就会变得最高。
但是也有一个例外：虽然 font 的优先级是最高，但把 as 的值指定为 font 并不会把此资源的优先级放到最高，文档专门为 font 的 preload 指定了优先级：位于第二级。目前来说，除了 font，其他都按照和资源优先级相同的规则。
as 属性可以说是必须要设置的，除了上面可以给优先级排级别以外，还有一个原因：如果不设置的话，它会被作为一个 XHR 请求去触发，浏览器可能不能正确的认识到，我们其实已经把资源预加载了，这样子就会加载两次了，完全没有了优化的效果。
不指定 as 浏览器也会有警告：

<img src="/img/2023-02-24-method-of-load-js/1.jpg"  />

preload 只会加载，真正执行要等到资源被用到的地方。

接下来再给大家介绍一个它的应用场景。

现在我们的文件是这样的：

```
index.html
|--main.js
   |--styles.css
```

我们有一个 main.js ，它会在 200 ms 后下载完，在它的内部会加载一段 CSS 来控制页面的样式，它也需要下载 200 ms。虽然 style.css 我们肯定会用到，但是浏览器必须要等下载、解析完 main.js 才开始下载 style.css，这就白白浪费了至少 200 ms。这里我们就可以把 style.css 用 preload 优化：把 style.css 标识为 preload 的资源。
也不是所有的资源都适合用 preload，它只适合用于 page load 阶段的资源。毕竟，它的优先级还是很高的，乱用的话，一个是占请求线程，一个是占浏览器的缓存。如果我们 preload 的资源在 load 事件几秒后没有用，控制台还会警告我们。比如我们上面的例子，没有实际引用 style.css，就有下面的警告：
<img src="/img/2023-02-24-method-of-load-js/2.jpg"  />

preload 特点：

1）preload 加载的资源是在浏览器渲染机制之前进行处理的，并且不会阻塞 onload 事件；

2）preload 加载的 JS 脚本其加载和执行的过程是分离的，即 preload 会预加载相应的脚本代码，待到需要时自行调用；

#### 6）prefetch

```html
<link rel="prefetch" as="script" href="index.js" />
```

prefetch 是利用浏览器的空闲时间，加载页面将来可能用到的资源的一种机制；通常可以用于加载其他页面（非首页）所需要的资源，以便加快后续页面的打开速度
prefetch 特点：

1）pretch 加载的资源可以获取非当前页面所需要的资源，并且将其放入缓存至少 5 分钟（无论资源是否可以缓存）

2）当页面跳转时，未完成的 prefetch 请求不会被中断

#### 加载方式总结

async、defer 是 script 标签的专属属性，对于网页中的其他资源，可以通过 link 的 preload、prefetch 属性来预加载

如今现代框架已经将 preload、prefetch 添加到打包流程中了，通过灵活的配置，去使用这些预加载功能，同时我们也可以审时度势地向 script 标签添加 async、defer 属性去处理资源，这样可以显著提升性能

### 参考

[性能优化之 preload、prefetch、preconnect 的区别与使用](https://juejin.cn/post/7128400578467594248)
[前端性能优化——首页资源压缩 63%、白屏时间缩短 86%](https://juejin.cn/post/7188894691356573754)
