---
layout: post
title: 正则表达式中的 .+*？
tags: [js, regexp]
comments: true
date: 2021-08-21 22:11:01
---

(.+)默认是贪婪匹配

(.+?)为惰性匹配

<!-- mroe -->

### 正则表达式的惰性匹配

疑问号让.+的搜索模式从贪婪模式变成惰性模式。

`var str = 'aaa<div style="font-color:red;">123456</div>bbb'`

`<.+?>`会匹配`<div style="font-color:red;">`

`<.+>`会匹配`<div style="font-color:red;">123456</div>`

要在浏览器测试结果的话，输入:

```js
var str = 'aaa<div style="font-color:red;">123456</div>bbb';

str.match(/<.+?>/);

str.match(/<.+>/);
```
