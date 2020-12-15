---
layout: post
title: js小技巧
excerpt: '源于网络和平常的积累'
tags: [web, javascript]
comments: true
date: 2020-12-14 16:22:02
---

## 查找字符串中某个字符出现的次数
```
let str="21312312312312"
console.log(str.split("1").length-1)
```

## js正则匹配快速使用匹配项
```
let tel = "13122223333";

let reg = /^(\d{3})\d{4}(\d{4})$/;

tel = tel.replace(reg, "$1****$2");
```

## 最大公约数
```
const gcd = (x, y) => !y ? x : gcd(y, x % y);
```

## 自适应单位
vw：1vw等于视口宽度的1%。

vh：1vh等于视口高度的1%。

vmin：选取vw和vh中最小的那个。

vmax：选取vw和vh中最大的那个

CSS百分比是相对于包含它的最近的父元素的高度和宽度


## blur和click冲突
场景：平时做表单验证的时候一般都有个input框和删除按钮，然后习惯性在失去焦点的时候> 去验证输入的内容是否正确，做验证，发请求等等。 这个时候，那个点击删除按钮往往也就触发了input的失去焦点事件

给失去焦点的时间加上延迟时间，让blur时间在click事件后执行，这个方法固然能够解决问题，但是本人并不是很推荐，因为影响性能，不到最后不用这个方法；
event.relatedTarget.id事件属性返回与事件的目标节点相关的节点。（非IE）
mousedown事件替代处理click事件


## 随机数
```
// [0,1) 左闭右开 min-max 
Math.floor(min+Math.random()*(max-min+1))
// toString() this is object方法 toString() valueOf
// 随机颜色
item.style.backgroundColor = '#' + Math.random().toString(16).slice(2, 8);
// "#" + ("00000" + ((Math.random() * 0x1000000) << 0).toString(16)).slice(-6)
```

