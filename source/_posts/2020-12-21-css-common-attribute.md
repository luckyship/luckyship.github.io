---
layout: post
title: css共通属性
excerpt: 'initial、inherit、unset、revert'
tags: [web, css]
comments: true
date: 2020-12-21 17:24:15
---

## css通用属性

* initial
* inherit
* unset
* revert

## initial

`initial` 关键字用于设置 CSS 属性为它的默认值，可作用于任何 CSS 样式。（IE 不支持该关键字）

## inherit

每一个 CSS 属性都有一个特性就是，这个属性必然是默认继承的 `(inherited: Yes)` 或者是默认不继承的 `(inherited: no)` 其中之一，我们可以在 MDN 上通过这个索引查找，判断一个属性的是否继承特性。

### 可继承属性

最后罗列一下默认为 `inherited: Yes` 的属性：
* 所有元素可继承：visibility 和 cursor
* 内联元素可继承：letter-spacing、word-spacing、white-space、line-height、color、font、 font-family、font-size、font-style、font-variant、font-weight、text- decoration、text-transform、direction
* 块状元素可继承：text-indent和text-align
* 列表元素可继承：list-style、list-style-type、list-style-position、list-style-image
* 表格元素可继承：border-collapse

## unset

名如其意， `unset` 关键字我们可以简单理解为不设置。其实，它是关键字 `initial` 和 `inherit` 的组合。

什么意思呢？也就是当我们给一个 CSS 属性设置了 `unset` 的话：
* 如果该属性是默认继承属性，该值等同于 `inherit`
* 如果该属性是非继承属性，该值等同于 `initial`

## revert

revert - 表示样式表中定义的元素属性的默认值。若用户定义样式表中显式设置，则按此设置；否则，按照浏览器定义样式表中的样式设置；否则，等价于unset 。

> 只有safari9.1+和ios9.3+支持
