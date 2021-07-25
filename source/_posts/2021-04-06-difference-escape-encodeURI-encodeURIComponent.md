---
layout: post
title: escape,encodeURI,encodeURIComponent有什么区别
tags: [javascript]
categories: review
comments: true
date: 2021-04-06 14:27:26
---

`escape`,`encodeURI`,`encodeURIComponent`都是`javascript`的编码方法
<!-- more -->
## escape
简单来说，escape是对字符串(string)进行编码(而另外两种是对URL)，作用是让它们在所有电脑上可读。编码之后的效果是%XX或者%uXXXX这种形式。其中 `ASCII字母 、 数字 、 @*/+`   这几个字符**不会**被编码，其余的都会。最关键的是，当你需要对URL编码时，请忘记这个方法，这个方法是针对字符串使用的，不适用于URL。

## encodeURI和encodeURIComponent区别
对URL编码是常见的事，所以这两个方法应该是实际中要特别注意的。它们都是编码URL，唯一区别就是编码的字符范围，其中`encodeURI`方法不会对下列字符编码  `ASCII字母  数字  ~!@#$&*()=:/,;?+'`

encodeURIComponent方法不会对下列字符编码 `ASCII字母  数字  ~!*()'`

所以`encodeURIComponent`比`encodeURI`编码的范围更大。实际例子来说，`encodeURIComponent`会把 `http://`  编码成  `http%3A%2F%2F` 而`encodeURI`却不会。

## 使用场景
1、如果只是编码字符串，不和URL有半毛钱关系，那么用`escape`。

2、如果你需要编码整个URL，然后需要使用这个URL，那么用`encodeURI`。

3、当你需要编码URL中的参数的时候，那么encodeURIComponent是最好方法。
```
var param = "http://www.cnblogs.com/season-huang/"; //param为参数
param = encodeURIComponent(param);
var url = "http://www.cnblogs.com?next=" + param;
console.log(url) //"http://www.cnblogs.com?next=http%3A%2F%2Fwww.cnblogs.com%2Fseason-huang%2F"
```
## 参考
[escape,encodeURI,encodeURIComponent有什么区别](https://www.zhihu.com/question/21861899)