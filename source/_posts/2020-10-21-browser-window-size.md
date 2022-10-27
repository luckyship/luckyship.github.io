---
layout: post
title: 各种js、jquery浏览器高度、宽度
excerpt: "各种js、jquery浏览器高度、宽度"
tags: [javascript, jquery, web]
comments: true
date: 2020-10-21 17:29:48
---

## Javascript

```js
IE中：
document.body.clientWidth == > BODY对象宽度
document.body.clientHeight == > BODY对象高度
document.documentElement.clientWidth == > 可见区域宽度
document.documentElement.clientHeight == > 可见区域高度
FireFox中：
document.body.clientWidth == > BODY对象宽度
document.body.clientHeight == > BODY对象高度
document.documentElement.clientWidth == > 可见区域宽度
document.documentElement.clientHeight == > 可见区域高度
Opera中：
document.body.clientWidth == > 可见区域宽度
document.body.clientHeight == > 可见区域高度
document.documentElement.clientWidth == > 页面对象宽度（ 即BODY对象宽度加上Margin宽）
document.documentElement.clientHeight == > 页面对象高度（ 即BODY对象高度加上Margin高）

alert(document.body.clientWidth); //网页可见区域宽(body)
alert(document.body.clientHeight); //网页可见区域高(body)
alert(document.body.offsetWidth); //网页可见区域宽(body)，包括border、margin等
alert(document.body.offsetHeight); //网页可见区域宽(body)，包括border、margin等
alert(document.body.scrollWidth); //网页正文全文宽，包括有滚动条时的未见区域
alert(document.body.scrollHeight); //网页正文全文高，包括有滚动条时的未见区域
alert(document.body.scrollTop); //网页被卷去的Top(滚动条)
alert(document.body.scrollLeft); //网页被卷去的Left(滚动条)
alert(window.screenTop); //浏览器距离Top
alert(window.screenLeft); //浏览器距离Left
alert(window.screen.height); //屏幕分辨率的高
alert(window.screen.width); //屏幕分辨率的宽
alert(window.screen.availHeight); //屏幕可用工作区的高
alert(window.screen.availWidth); //屏幕可用工作区的宽
```

> scrollTop 是一个非整数，而 scrollHeight 和 clientHeight 是四舍五入的，因此确定滚动区域是否滚动到底的唯一方法是查看滚动量是否足够接近某个阈值 (在本例中为 1)：

> `Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 1`

> [参考](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollHeight)

## jquery

```js
alert($(window).height()); //浏览器当前窗口可视区域高度
alert($(document).height()); //浏览器当前窗口文档的高度
alert($(document.body).height()); //浏览器当前窗口文档body的高度
alert($(document.body).outerHeight(true)); //浏览器当前窗口文档body的总高度 包括border padding margin
alert($(window).width()); //浏览器当前窗口可视区域宽度
alert($(document).width()); //浏览器当前窗口文档对象宽度
alert($(document.body).width()); //浏览器当前窗口文档body的宽度
alert($(document.body).outerWidth(true)); //浏览器当前窗口文档body的总宽度 包括border padding margin
```
