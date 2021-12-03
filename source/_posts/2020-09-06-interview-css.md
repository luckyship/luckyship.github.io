---
layout: post
title: "整理面试相关"
date: 2020-09-06
excerpt: "主要是一些关于web的知识, 记录一些要点"
tags: [web, javascript, html, css]
categories: review
comments: true
---

简单记录一下面试的一些要点

## javascript 事件机制

先捕获，后冒泡，捕获从上到下，冒泡从下到上

### 冒泡机制

IE 提出的事件流叫做事件冒泡，即事件开始时由最具体的元素接收，然后逐级向上传播到较为不具体的节点，看一下以下示例

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
  </head>

  <body onclick="bodyClick()">
    <div onclick="divClick()">
      <button onclick="btn()">
        <p onclick="p()">点击冒泡</p>
      </button>
    </div>
    <script>
      function p() {
        console.log("p标签被点击");
      }

      function btn() {
        console.log("button被点击");
      }

      function divClick(event) {
        console.log("div被点击");
      }

      function bodyClick() {
        console.log("body被点击");
      }
    </script>
  </body>
</html>
```

结果显而易见

```
p标签被点击
button被点击
div被点击
body被点击
```

### 捕获机制

事件捕获流的思想是不太具体的 DOM 节点应该更早接收到事件，而最具体的节点应该最后接收到事件，针对上面同样的例子，点击按钮，那么此时 click 事件会按照这样传播：（下面我们就借用 addEventListener 的第三个参数来模拟事件捕获流）

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
  </head>

  <body>
    <div>
      <button>
        <p>点击捕获</p>
      </button>
    </div>
    <script>
      var oP = document.querySelector("p");
      var oB = document.querySelector("button");
      var oD = document.querySelector("div");
      var oBody = document.querySelector("body");

      oP.addEventListener(
        "click",
        function () {
          console.log("p标签被点击");
        },
        true
      );

      oB.addEventListener(
        "click",
        function () {
          console.log("button被点击");
        },
        true
      );

      oD.addEventListener(
        "click",
        function () {
          console.log("div被点击");
        },
        true
      );

      oBody.addEventListener(
        "click",
        function () {
          console.log("body被点击");
        },
        true
      );
    </script>
  </body>
</html>
```

与冒泡相反的结果

```
 body被点击
 div被点击
 button被点击
 p标签被点击
```

### DOM 2 级事件处理程序

`DOM 2` 级事件定义了两方法：用于处理添加事件和删除事件的操作：

> 添加事件 addEventListener()  
> 删除事件 removeEventListener()

所有 DOM 节点中都包含这两个方法，并且他们都包含 3 个参数： （1） 要处理的事件方式（例如： `click，mouseover, dbclick.....` ） （2）事件处理的函数，可以为匿名函数，也可以为命名函数（但如果需要删除事件，必须是命名函数） （3）**一个布尔值，代表是处于事件冒泡阶段处理还是事件捕获阶段（true：表示在捕获阶段调用事件处理程序；false: 表示在冒泡阶段调用事件处理程序）**

使用 `DOM 2` 级事件处理程序的主要好处是可以添加多个事件处理程序，事件处理会按照他们的顺序触发，通过 `addEventListener` 添加的事件只能用 `removeEventListener` 来移除，移除时传入的参数与添加时使用的参数必须相同，这也意味着添加的匿名函数将无法移除，

> （注意：我们默认的第三个参数都是默认 `false` , 是指在冒泡阶段添加，大多数情况下，都是将事件处理程序添加到事件的冒泡阶段，这样可以最大限度的兼容各个浏览器）

## css 省略文字的实现

```css
 {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: allipsis;
}
```

## settimeout, setinterval，eval 在赋值时有什么问题？

## vue 解决跨域问题

### 什么是跨域

跨域：由于浏览器同源策略，凡是发送请求 url 的协议、域名、端口三者之间任意一个与当前页面地址不同即为跨域。存在跨域的情况：

- 网络协议不同，如 http 协议访问 https 协议。
- 端口不同，如 80 端口访问 8080 端口。
- 域名不同，如 qianduanblog.com 访问 baidu.com。
- 子域名不同，如 abc.qianduanblog.com 访问 def.qianduanblog.com。
- 域名和域名对应 ip, 如www.a.com访问20.205.28.90.

下面是项目使用 vue-cli 脚手架搭建  
使用 http-proxy-middleware 代理解决跨域问题  
例如请求的 url:“http://f.apiplus.cn/bj11x5.json”  
1、打开 config/index.js, 在 proxyTable 中添写如下代码：

```json
proxyTable: {
  '/api': {  //使用"/api"来代替"http://f.apiplus.c"
    target: 'http://f.apiplus.cn', //源地址
    changeOrigin: true, //是否跨域
    pathRewrite: {
      '^/api': 'http://f.apiplus.cn' //路径重写
      }
  }
}
```

2、使用 axios 请求数据时直接使用“/api”：

```js
getData() {
    axios.get('/api/bj11x5.json', function(res) {
      console.log(res)
    })
```

通过这中方法去解决跨域，打包部署时还按这种方法会出问题。解决方法如下：

```js
let serverUrl = "/api/"; //本地调试时
// let serverUrl = 'http://f.apiplus.cn/'  //打包部署上线时
```

## vue 解决 xss 注入问题

1. 在终端引入 xss, 命令：

```bash
npm install xss --save
```

2. 在 vue 的页面进行引入

```js
import xss from "xss";
```

3. 定义一个变量进行测试  
   首先测试一个没有进行防止 xss 攻击的测试

```js
< p v - html = "test" > < /p>

export default {
  data() {
    return {
      test: `<a onclick='alert("xss攻击")'>链接</a>`
    }
```

结果，js 事件直接被翻译了

```
xss攻击
```

因此应该杜绝这些情况，解决方法如下

```js
< p v - html = "$xss(test)" > < /p>
import xss from 'xss'
export default {
  data() {
    return {
      test: `<a onclick='alert("xss攻击")'>链接</a>`
    }
  }

Vue.prototype.$xss = xss;
```

此时 a 标签会保留，但是 onclick 事件被拦截了

## vue axios 的几种请求方式

axios 的请求方法：get、post、put、patch、delete

- get：获取数据
- post：提交数据（表单提交+文件上传）
- put：更新数据（所有数据推送到后端）
- patch：更新数据（只将更改的数据推送到后端）
- delete：删除数据

```js
//axios的get请求第一种写法不带参数
axios.get("/data.json").then(res => {
  console.log(res);
});

//axios的get请求第一种写法带参数
axios
  .get("/data.json", {
    params: {
      id: 12,
    },
  })
  .then(res => {
    console.log(res);
  });

//axios的get请求第二种写法不带参数
axios({
  method: "get",
  url: "/data.json",
}).then(res => {
  console.log(res);
});

//axios的get请求第二种写法带参数
axios({
  method: "get",
  url: "/data.json",
  params: {
    id: 12,
  },
}).then(res => {
  console.log(res);
});

//axios的post请求第一种写法
let data = {
  id: 12,
};
axios.post("/post", data).then(res => {
  console.log(res);
});

//axios的post请求第二种写法
axios({
  method: "post",
  url: "/post",
  data: data,
}).then(res => {
  console.log(res);
});

//form-data请求,图片上传、文件上传，文件格式为：multipart/form-data，其他请求为application/json

let formData = new formData();
for (let key in data) {
  formData.append(key, data[key]);
}
axios.post("/post", formData).then(res => {
  console.log(res);
});

//axios之put请求
axios.put("/put", data).then(res => {
  console.log(res);
});

//axios之patch请求
axios.patch("/patch", data).then(res => {
  console.log(res);
});

//axios之delete请求的第一种写法
axios
  .delete("/delete", {
    params: {
      id: 12,
    },
  })
  .then(res => {
    console.log(res);
  });
//说明:当使用第一种写法参数为params时，请求接口时参数是放在URL里面的。
// 例：http://localhost:8080/delete?id=12,而写成第二种方法data就不会，根据实际情况使用

//axios之delete请求的第二种写法
axios
  .delete("/delete", {
    data: {
      id: 12,
    },
  })
  .then(res => {
    console.log(res);
  });
```

## js 如何比较浮点数

浮点数的定义，非整数的 Number 类型无法用 `=` 来比较，这就是为什么在 JavaScript 中，0.1+0.2 不能=0.3：

```js
console.log(0.1 + 0.2 == 0.3);
false;
```

这里输出的结果是 `false` ，说明两边不相等的，这是浮点运算的特点，浮点数运算的精度问题导致等式左右的结果并不是严格相等，而是相差了个微小的值。

所以实际上，这里错误的不是结论，而是比较的方法，正确的比较方法是使用 `JavaScript` 提供的最小精度值：

```js
console.log(Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON);
```

## 项目做过哪些优化

- 减少 `HTTP` 请求数
- 减少`DNS`查询
- 使用 `CDN`
- 避免重定向
- 图片懒加载
- 减少 `DOM` 元素数量
- 减少 `DOM` 操作
- 使用外部 `JavaScript` 和 `CSS`
- 压缩 `JavaScript` 、 `CSS` 、字体、图片等
- 优化 `CSS Sprite`
- 使用 `iconfont`
- 字体裁剪
- 多域名分发划分内容到不同域名
- 尽量减少 `iframe` 使用
- 避免图片 `src` 为空
- 把样式表放在 中
- 把脚本放在页面底部

## 重排和重绘

- 部分渲染树（或者整个渲染树）需要重新分析并且节点尺寸需要重新计算。这被称为重排。注意这里至少会有一次重排-初始化页面布局。
- 由于节点的几何属性发生改变或者由于样式发生改变，例如改变元素背景色时，屏幕上的部分内容需要更新。这样的更新被称为重绘。

## 什么情况会触发重排和重绘？

- 添加、删除、更新 `DOM` 节点
- 通过 `display: none` 隐藏一个 `DOM` 节点-触发重排和重绘
- 通过 `visibility: hidden` 隐藏一个 `DOM` 节点-只触发重绘，因为没有几何变化
- 移动或者给页面中的 `DOM` 节点添加动画
- 添加一个样式表，调整样式属性
- 用户行为，例如调整窗口大小，改变字号，或者滚动。

## 浏览器缓存

- 浏览器缓存分为强缓存和协商缓存。当客户端请求某个资源时，获取缓存的流程如下：
- 先根据这个资源的一些 http header 判断它是否命中强缓存，如果命中，则直接从本地获取缓存资源，不\* 会发请求到服务器；
- 当强缓存没有命中时，客户端会发送请求到服务器，服务器通过另一些 request header 验证这个资源是否命* 中协商缓存，称为 http 再验证，如果命中，服务器将请求返回，但不返回资源，而是告诉客户端直接从缓存* 中获取，客户端收到返回后就会从缓存中获取资源；
- 强缓存和协商缓存共同之处在于，如果命中缓存，服务器都不会返回资源；
- 区别是，强缓存不对发送请求到服务器，但协商缓存会。
- 当协商缓存也没命中时，服务器就会将资源发送回客户端。
- 当 ctrl+f5 强制刷新网页时，直接从服务器加载，跳过强缓存和协商缓存；
- 当 f5 刷新网页时，跳过强缓存，但是会检查协商缓存；

### 强缓存

- Expires（该字段是 http1.0 时的规范，值为一个绝对时间的 GMT 格式的时间字符串，代表缓存资源的过\* 期时间）
- Cache-Control:max-age（该字段是 http1.1 的规范，强缓存利用其 max-age 值来判断缓存资源的最大生命周期，它的值单位为秒）

### 协商缓存

- Last-Modified（值为资源最后更新时间，随服务器 response 返回）
- If-Modified-Since（通过比较两个时间来判断资源在两次请求期间是否有过修改，如果没有修改，则命中\* 协商缓存）
- ETag（表示资源内容的唯一标识，随服务器 response 返回）
- If-None-Match（服务器通过比较请求头部的 If-None-Match 与当前资源的 ETag 是否一致来判断资源是否在两次请求之间有过修改，如果没有修改，则命中协商缓存）

### new 操作符具体干了什么

1. 创建空对象，并且 this 变量引用该对象同时继承该函数的原型
2. 属性和方法加入到 this 引用的对象中
3. 新创建的对象用 this 引用，并且隐式地返回 this

4. 创建一个新对象(\_\_proto\_\_ 指向构造函数的 prototype)
5. 把作用域（this）指给这个对象
6. 执行构造函数的代码
7. 如果构造函数中没有返回其它对象，那么返回 this，即创建的这个的新对象，否则，返回构造函数中返回的对象

```javascript
function Base() {
  this.id = "base";
}
var obj = new Base();
```

**new 干了什么？**

1. var obj = {};

2. obj.\_\_proto\_\_ = Base.protptype;

3. Base.call(obj);

- es5 使用 Object.create()来创建对象 new Object() 字面量写法{}
  使用 Object.create()是将对象继承到**proto**属性上，
  Object.create(null)没有继承任何原型方法，也就是说它的原型链没有上一层。
- es6 使用 class 关键字

- 构造器就是普通的函数, new 来作用称为构造方法(构造函数)

- 访问原型链会损耗性能, 不存在的属性会遍历原型链直到最后一层

- hasOwnProperty 是 JavaScript 中唯一处理属性并且不会遍历原型链的方法。通常在 for in 循环中使用。

### 实现 new 函数

```js
function _new(func) {
  // 第一步 创建新对象
  let obj = {};
  // 第二步 空对象的_proto_指向了构造函数的prototype成员对象
  obj.__proto__ = func.prototype; //
  // 一二步合并就相当于 let obj=Object.create(func.prototype)

  // 第三步 使用apply调用构造器函数，属性和方法被添加到 this 引用的对象中
  let result = func.apply(obj);
  if (result && (typeof result == "object" || typeof result == "function")) {
    // 如果构造函数执行的结果返回的是一个对象，那么返回这个对象
    return result;
  }
  // 如果构造函数返回的不是一个对象，返回创建的新对象
  return obj;
}
```
