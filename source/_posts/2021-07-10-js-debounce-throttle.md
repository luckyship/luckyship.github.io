---
layout: post
title: js防抖和节流
tags: [javascript]
categories: review
comments: true
date: 2021-07-10 12:09:42
---

## 防抖(debounce)

`在第一次触发事件时，不立即执行函数，而是给出一个期限值比如200ms` ，然后：
如果在 `200ms` 内没有再次触发滚动事件，那么就执行函数
如果在 `200ms` 内再次触发滚动事件，那么当前的计时取消，重新开始计时

```js
function debounce(func, wait) {
  var timer = null;
  return function () {
    var self = this;
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      timer = null;
      return typeof func === 'function' && func.apply(self, args);
    }, wait);
  };
}
```

<!-- more -->

## 节流(throttle)

类似控制阀门一样定期开放的函数，也就是让函数执行一次后，在某个时间段内暂时失效，过了这段时间后再重新激活（类似于技能冷却时间）

如果短时间内大量触发同一事件，那么在函数执行一次之后，该函数在指定的时间期限内不再工作，直至过了这段时间才重新生效。

```js
function throttle(func, wait) {
  var timer = null;
  return function () {
    var self = this;
    var args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      return typeof func === 'function' && func.apply(self, args);
    }, wait);
  };
}
```

## 应用

讲完了这两个技巧，下面介绍一下平时开发中常遇到的场景：

- 搜索框 `input` 事件，例如要支持输入实时搜索可以使用节流方案（间隔一段时间就必须查询相关内容），或者实现输入间隔大于某个值（如 500ms），就当做用户输入完成，然后开始搜索，具体使用哪种方案要看业务需求。
- 页面 `resize` 事件，常见于需要做页面适配的时候。需要根据最终呈现的页面情况进行 `dom` 渲染（这种情形一般是使用防抖，因为只需要判断最后一次的变化情况）
