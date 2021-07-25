---
layout: post
title: 什么是BFC
tags: [css, web]
comments: true
date: 2021-05-06 11:49:52
---
## BFC
`Formatting context`(格式化上下文) 是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。


那么 BFC 是什么呢？

BFC 即 `Block Formatting Contexts` (块级格式化上下文)，它属于上述定位方案的普通流。

`具有 BFC 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素`，并且 BFC 具有普通容器所没有的一些特性。

通俗一点来讲，可以把 BFC 理解为一个封闭的大箱子，箱子内部的元素无论如何翻江倒海，都不会影响到外部。

<!-- more -->

### 创建新的块格式上下文
只要元素满足下面任一条件即可触发 BFC 特性：

* body 根元素
* 浮动元素：float 除 none 以外的值
* 绝对定位元素：position (absolute、fixed)
* display 为 inline-block、table-cells、flex
* overflow 除了 visible 以外的值 (hidden、auto、scroll)

这很有用，因为新的BFC的行为与最外层的文档非常相似，它在主布局中创造了一个小布局。BFC包含其内部的所有内容，float 和 clear 仅适用于同一格式上下文中的项目，而页边距仅在同一格式上下文中的元素之间折叠。

### 边距上的运用
从效果上看，因为两个 div 元素都处于同一个 `BFC` 容器下 (这里指 body 元素) 所以第一个 div 的下边距和第二个 div 的上边距发生了重叠，所以两个盒子之间距离只有 50px，而不是 100px。

首先这不是 CSS 的 bug，我们可以理解为一种规范，如果想要避免外边距的重叠，可以将其放在不同的 BFC 容器中。
```
<style type="text/css">
.container {
    overflow: hidden;
}
p {
    width: 100px;
    height: 100px;
    background: lightblue;
    margin: 50px;
}
</style>
<body>
<div>
    <p></p>
</div>
<div>
    <p></p>
</div>
<hr>
<div class="container">
    <p></p>
</div>
<div class="container">
    <p></p>
</div>
</body>
```
<iframe width="100%" height="350px" srcdoc='
<style type="text/css">
.container {
    overflow: hidden;
}
p {
    width: 100px;
    height: 100px;
    background: lightblue;
    margin: 50px;
}
</style>
<body>
<div>
    <p></p>
</div>
<div>
    <p></p>
</div>
<hr>
<div class="container">
    <p></p>
</div>
<div class="container">
    <p></p>
</div>
</body>
'>
</iframe>

### BFC 可以包含浮动的元素（清除浮动）
我们都知道，浮动的元素会脱离普通文档流，来看下下面一个例子
```
<div style="border: 1px solid #000;">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```
<iframe width="100%" height="150px" srcdoc='
<body>
<div style="border: 1px solid #000;">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
</body>
'>
</iframe>

```
<div style="border: 1px solid #000;overflow: hidden">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```

<iframe width="100%" height="150px" srcdoc='
<body>
<div style="border: 1px solid #000;overflow: hidden">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
</body>
'>
</iframe>

### BFC 可以阻止元素被浮动元素覆盖
先来看一个文字环绕效果：
```
<div style="height: 100px;width: 100px;float: left;background: lightblue">我是一个左浮动的元素</div>
<div style="width: 200px; height: 200px;background: #eee">我是一个没有设置浮动, 
也没有触发 BFC 元素, width: 200px; height:200px; background: #eee;</div>
```
<iframe width="100%" height="150px" srcdoc='
<body>
<div style="height: 100px;width: 100px;float: left;background: lightblue">我是一个左浮动的元素</div>
<div style="width: 200px; height: 200px;background: #eee;">我是一个没有设置浮动, 
也没有触发 BFC 元素, width: 200px; height:200px; background: #eee;</div>
</body>
'>
</iframe>

这时候其实第二个元素有部分被浮动元素所覆盖，(但是文本信息不会被浮动元素所覆盖) 如果想避免元素被覆盖，可触第二个元素的 BFC 特性，在第二个元素中加入 overflow: hidden，就会变成：

<iframe width="100%" height="150px" srcdoc='
<body>
<div style="height: 100px;width: 100px;float: left;background: lightblue">我是一个左浮动的元素</div>
<div style="width: 200px; height: 200px;background: #eee;overflow: hidden;">我是一个没有设置浮动, 
也没有触发 BFC 元素, width: 200px; height:200px; background: #eee;</div>
</body>
'>
</iframe>

> 这个方法可以用来实现两列自适应布局，效果不错，这时候左边的宽度固定，右边的内容自适应宽度(去掉上面右边内容的宽度)。
## 行内格式化上下文
内联格式上下文存在于其他格式上下文中，可以将其视为段落的上下文。段落创建了一个内联格式上下文，其中在文本中使用诸如 `<strong>`、`<a>`或 `<span>` 元素等内容。

box model 不完全适用于参与内联格式上下文。在水平书写模式行中，水平填充、边框和边距将应用于元素，并左右移动文本。但是，元素上方和下方边距将不适用。应用垂直填充和边框可能会在内容的上方和下方重叠，因为在内联格式上下文中，填充和边框不会将行框撑开。

<iframe width="100%" height="150px" srcdoc="
<style type='text/css'>
    strong {
    margin: 20px;
    padding: 20px;
    border: 5px solid rebeccapurple;
}
</style>
<body>
<p>Before that night—<strong>a memorable night</strong>, as it was to prove—hundreds of millions of people had watched the rising smoke-wreaths of their fires without drawing any special inspiration from the fact.”</p>
</body>
">
</iframe>


## 参考
[Intro_to_formatting_contexts](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flow_Layout/Intro_to_formatting_contexts)

[10 分钟理解 BFC 原理](https://zhuanlan.zhihu.com/p/25321647)