---
layout: post
title: css格式化上下文（BFC、IFC）
tags: [css, web]
comments: true
date: 2021-05-06 11:49:52
---

## BFC

`Formatting context` (格式化上下文) 是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。

那么 BFC 是什么呢？

BFC 即 `Block Formatting Contexts` (块级格式化上下文)，它属于上述定位方案的普通流。

`具有 BFC 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素` ，并且 BFC 具有普通容器所没有的一些特性。

通俗一点来讲，可以把 BFC 理解为一个封闭的大箱子，箱子内部的元素无论如何翻江倒海，都不会影响到外部。

<!-- more -->

### 创建新的块格式上下文

只要元素满足下面任一条件即可触发 BFC 特性：

- body 根元素
- 浮动元素：float 除 none 以外的值
- 绝对定位元素：position (absolute、fixed)
- display 为 inline-block、table-cells、flex
- overflow 除了 visible 以外的值 (hidden、auto、scroll)

这很有用，因为新的 BFC 的行为与最外层的文档非常相似，它在主布局中创造了一个小布局。BFC 包含其内部的所有内容，float 和 clear 仅适用于同一格式上下文中的项目，而页边距仅在同一格式上下文中的元素之间折叠。

### 边距上的运用

从效果上看，因为两个 div 元素都处于同一个 `BFC` 容器下 (这里指 body 元素) 所以第一个 div 的下边距和第二个 div 的上边距发生了重叠，所以两个盒子之间距离只有 50px，而不是 100px。

首先这不是 CSS 的 bug，我们可以理解为一种规范，如果想要避免外边距的重叠，可以将其放在不同的 BFC 容器中。

```html
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
  <hr />
  <div class="container">
    <p></p>
  </div>
  <div class="container">
    <p></p>
  </div>
</body>
```

<!-- /* md-file-format-disable */ -->
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
<!-- /* md-file-format-disable */ -->

### BFC 可以包含浮动的元素（清除浮动）

我们都知道，浮动的元素会脱离普通文档流，来看下下面一个例子

```html
<div style="border: 1px solid #000;">
  <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```

<!-- /* md-file-format-disable */ -->
<iframe width="100%" height="150px" srcdoc='
<body>
<div style="border: 1px solid #000; ">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
</body>
'>
</iframe>
<!-- /* md-file-format-disable */ -->

```html
<div style="border: 1px solid #000;overflow: hidden">
  <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```

<!-- /* md-file-format-disable */ -->
<iframe width="100%" height="150px" srcdoc='
<body>
<div style="border: 1px solid #000; overflow: hidden">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
</body>
'>
</iframe>
<!-- /* md-file-format-disable */ -->

### BFC 可以阻止元素被浮动元素覆盖

先来看一个文字环绕效果：

```html
<div style="height: 100px;width: 100px;float: left;background: lightblue">
  我是一个左浮动的元素
</div>
<div style="width: 200px; height: 200px;background: #eee">
  我是一个没有设置浮动, 也没有触发 BFC 元素, width: 200px; height:200px;
  background: #eee;
</div>
```

<iframe width="100%" height="150px" srcdoc='
<body>
<div style="height: 100px; width: 100px; float: left; background: lightblue">我是一个左浮动的元素</div>
<div style="width: 200px; height: 200px; background: #eee; ">我是一个没有设置浮动, 
也没有触发 BFC 元素, width: 200px; height:200px; background: #eee; </div>
</body>
'>
</iframe>

这时候其实第二个元素有部分被浮动元素所覆盖，(但是文本信息不会被浮动元素所覆盖) 如果想避免元素被覆盖，可触第二个元素的 BFC 特性，在第二个元素中加入 overflow: hidden，就会变成：

<iframe width="100%" height="150px" srcdoc='
<body>
<div style="height: 100px; width: 100px; float: left; background: lightblue">我是一个左浮动的元素</div>
<div style="width: 200px; height: 200px; background: #eee; overflow: hidden; ">我是一个没有设置浮动, 
也没有触发 BFC 元素, width: 200px; height:200px; background: #eee; </div>
</body>
'>
</iframe>

> 这个方法可以用来实现两列自适应布局，效果不错，这时候左边的宽度固定，右边的内容自适应宽度(去掉上面右边内容的宽度)。

## IFC(行内格式化上下文)

`Inline Formatting Contexts`，也就是“内联格式化上下文”。

符合以下条件即会生成一个 IFC

> 块级元素中仅包含内联级别元素

形成条件非常简单，需要注意的是当 IFC 中有块级元素插入时，会产生两个匿名块将父元素分割开来，产生两个 IFC，这里不做过多介绍。

IFC 布局规则

1. 子元素水平方向横向排列，并且垂直方向起点为元素顶部。
2. 子元素只会计算横向样式空间，`padding、border、margin`，垂直方向样式空间不会被计算，`padding、border、margin`。
3. 在垂直方向上，子元素会以不同形式来对齐（vertical-align）
4. 能把在一行上的框都完全包含进去的一个矩形区域，被称为该行的行框（line box）。行框的宽度是由包含块（containing box）和与其中的浮动来决定。
5. IFC 中的“line box”一般左右边贴紧其包含块，但 float 元素会优先排列。
6. IFC 中的“line box”高度由 CSS 行高计算规则来确定，同个 IFC 下的多个 line box 高度可能会不同。
7. 当 inline-level boxes 的总宽度少于包含它们的 line box 时，其水平渲染规则由 text-align 属性值来决定。
8. 当一个“inline box”超过父元素的宽度时，它会被分割成多个 boxes，这些 oxes 分布在多个“line box”中。如果子元素未设置强制换行的情况下，“inline box”将不可被分割，将会溢出父元素。

### 上下间距不生效

内联格式上下文存在于其他格式上下文中，可以将其视为段落的上下文。段落创建了一个内联格式上下文，其中在文本中使用诸如 `<strong>` 、 `<a>` 或 `<span>` 元素等内容。

box model 不完全适用于参与内联格式上下文。在水平书写模式行中，水平填充、边框和边距将应用于元素，并左右移动文本。但是，元素上方和下方边距将不适用。应用垂直填充和边框可能会在内容的上方和下方重叠，因为在内联格式上下文中，填充和边框不会将行框撑开。

<!-- /* md-file-format-disable */ -->
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
<!-- /* md-file-format-disable */ -->

### 多个元素水平居中

```css
.warp {
  border: 1px solid red;
  width: 200px;
  text-align: center;
}
.text {
  background: green;
}
```

```html
<div class="warp">
  <span class="text">文本一</span>
  <span class="text">文本二</span>
</div>
```

<!-- /* md-file-format-disable */ -->
<iframe width="100%" height="150px" srcdoc="
<style type='text/css'>
.warp { border: 1px solid red; width: 200px; text-align: center; }
.text { background: green; }
}
</style>
<body>
<div class='warp'>
    <span class='text'>文本一</span>
    <span class='text'>文本二</span>
</div>
</body>
">
</iframe>
<!-- /* md-file-format-disable */ -->

### float 元素优先排列

```css
.warp {
  border: 1px solid red;
  width: 200px;
}
.text {
  background: green;
}
.f-l {
  float: left;
}
```

```html
<div class="warp">
  <span class="text">这是文本1</span>
  <span class="text">这是文本2</span>
  <span class="text f-l">这是文本3</span>
  <span class="text">这是文本4</span>
</div>
```

<!-- /* md-file-format-disable */ -->
<iframe width="100%" height="150px" srcdoc="
<style type='text/css'>
.warp { border: 1px solid red; width: 200px; }
.text { background: green; }
.f-l { float: left; }
}
</style>
<body>
<div class='warp'>
    <span class='text'>这是文本1</span>
    <span class='text'>这是文本2</span>
    <span class='text f-l'>这是文本3</span>
    <span class='text'>这是文本4</span>
</div>
</body>
">
</iframe>
<!-- /* md-file-format-disable */ -->

IFC 中具备 float 属性值的元素优先排列，在很多场景中用来在文章段落开头添加“tag”可以用到。

### 图片无法和文字垂直居中

在图片上设置`vertical: middle`

```html
<div class="warp">
  <img src="/img/head.jpg" width="100" height="100" />
  <span>luckyship</span>
</div>
<div class="warp">
  <img
    src="/img/head.jpg"
    width="100"
    height="100"
    style="vertical-align: middle;"
  />
  <span>luckyship</span>
</div>
<div class="warp">
  <img
    src="/img/head.jpg"
    width="100"
    height="100"
    style="vertical-align: middle;"
  />
  <span>luckyship</span>
  <img src="/img/head.jpg" width="200" height="200" />
</div>
<div class="warp">
  <img
    src="/img/head.jpg"
    width="100"
    height="100"
    style="vertical-align: middle;"
  />
  <span>luckyship</span>
  <img
    src="/img/head.jpg"
    width="200"
    height="200"
    style="vertical-align: middle;"
  />
</div>
```

<!-- /* md-file-format-disable */ -->
<iframe width="100%" height="400px" srcdoc="
<style type='text/css'>
.warp { border: 1px solid red; width: auto; }
}
</style>
<body>
<div class='warp'>
    <img src='/img/head.jpg' width='100' height='100'>
    <span>luckyship</span>
</div>
<div class='warp'>
    <img src='/img/head.jpg' width='100' height='100' style='vertical-align: middle;'>
    <span>luckyship</span>
</div>
<div class='warp'>
    <img src='/img/head.jpg' width='100' height='100' style='vertical-align: middle;'>
    <span>luckyship</span>
    <img src='/img/head.jpg' width='200' height='200'>
</div>
<div class='warp'>
    <img src='/img/head.jpg' width='100' height='100' style='vertical-align: middle;'>
    <span>luckyship</span>
    <img src='/img/head.jpg' width='200' height='200' style='vertical-align: middle;'>
</div>
</body>
">
</iframe>
<!-- /* md-file-format-disable */ -->

> 这种设置垂直居中的方法，根本上是改变了行内元素的基线对齐方式

## 参考

[行内格式化上下文（Inline formatting context）](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Inline_formatting_context)

[10 分钟理解 BFC 原理](https://zhuanlan.zhihu.com/p/25321647)

[CSS 之 IFC](https://segmentfault.com/a/1190000017273573)
