---
layout: post
title: "DataTable搜索框，正则匹配规则"
date: 2019-03-12
excerpt: "每一行代表的字符串是以2个空格将每一列连成一个字符串"
tags: [DataTable, web, javascript]
comments: true
---

`DataTable`中的`search`搜索框功能非常强大，可以匹配表格中的任意数据。不仅如此`DataTable`还提供了`regex`选项可以使用正则表达式。

```
$('#example').dataTable( {
  "search": {
    "regex": true
  }
} );
```
值的一提的是，DataTable搜索结果以行显示，那么每一行是怎么匹配正则的？

>每一行代表的字符串是以2个空格将没一列连成一个字符串

>例如：

|example1|example2|example3|
|:-:|:-:|:-:|
|a|c|d|
|e|f|g|
|h|i|j|

如果我们在输入框中输入: `^a  c  d`  
即可匹配到第一行

>如果想要更多的验证DataTable的正则匹配规则，可以点击连接验证[https://datatables.net/examples/api/regex.html](https://datatables.net/examples/api/regex.html)



