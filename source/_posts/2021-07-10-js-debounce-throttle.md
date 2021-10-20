---
layout: post
title: js防抖和节流
tags: [javascript]
categories: review
comments: true
date: 2021-07-10 12:09:42
---

### 防抖(debounce)

`在第一次触发事件时，不立即执行函数，而是给出一个期限值比如200ms` ，然后：
如果在 `200ms` 内没有再次触发滚动事件，那么就执行函数
如果在 `200ms` 内再次触发滚动事件，那么当前的计时取消，重新开始计时

```js
function debounce(func, wait) {
  var timer = null;
  return function () {
    var self = this;
    var args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      typeof func === 'function' && func.apply(self, args);
    }, wait);
  };
}
```

<!-- more -->

### 节流(throttle)

类似控制阀门一样定期开放的函数，也就是让函数执行一次后，在某个时间段内暂时失效，过了这段时间后再重新激活（类似于技能冷却时间）

如果短时间内大量触发同一事件，那么在函数执行一次之后，该函数在指定的时间期限内不再工作，直至过了这段时间才重新生效。

```js
function throttle(func, wait) {
  var timer = null;
  return function () {
    var self = this;
    var args = arguments;
    if (timer) {
      return;
    }

    typeof func === 'function' && func.apply(self, args);
    timer = setTimeout(function () {
      timer = null;
    }, wait);
  };
}
```

### 应用

讲完了这两个技巧，下面介绍一下平时开发中常遇到的场景：

#### 防抖

- 登录、发短信等按钮避免用户点击太快，以致于发送了多次请求，需要防抖
- 调整浏览器窗口大小时，`resize` 次数过于频繁，造成计算过多，此时需要一次到位，就用到了防抖
- 文本编辑器实时保存，当无任何更改操作一秒后进行保存

#### 节流

- `DOM` 元素的拖拽功能实现（`mousemove`）
- 射击游戏的 `mousedown`/`keydown` 事件（单位时间只能发射一颗子弹）
