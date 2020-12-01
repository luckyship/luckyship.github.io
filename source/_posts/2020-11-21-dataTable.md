---
layout: post
title: dataTable介绍
excerpt: 'dataTable是一款表格插件，具有分页，搜索，定制列的功能'
tags: [javascript, dataTable, web]
comments: true
date: 2020-11-21 09:48:04
---

## 使用npm 引入dataTable
### 引入datatables.net-dt
首先导入`npm`包
```
npm install datatables.net-dt
```

在需要引用的地方，导入`dataTable`
```
import $ from ‘jquery’
require('datatables.net')
require('datatables.net-dt/css/jquery.dataTables.css')
```

### 参考
[dataTable](https://datatables.net/download/)


## 获取api的三种方法

> $(selector).DataTable();  
> $(selector).dataTable().api();  
> $.fn.dataTable.Api( selector );

第三种方法比较特殊，我使用过一次，使用场景为：
无法引入`jquery`，`dataTable`不能初始化，这主要是因为使用`npm`进行模块加载的时候，主代码已经有`jquery`，再引入`jquery`回覆盖之前`jquery`的插件，所以使用

```
window.dt = require('datatables.net');

// 在使用到的模块里引入dt
window.$.fn.dataTable = window.dt;
```
这里使用 `$(selector).DataTable();`、`$(selector).dataTable().api();` 都无法返回Api;所以使用如下方式
```
$(selector).dataTable();
$.fn.dataTable.Api(selector); 
```

### 参考
[dataTable api](http://datatables.club/manual/api.html)

## 搜索匹配正则的问题
`DataTable`中的`search`搜索框功能非常强大，可以匹配表格中的任意数据。不仅如此`DataTable`还提供了`regex`选项可以使用正则表达式。
```
$('#example').dataTable( {
  "search": {
    "regex": true
  }
} );
```
但是，如果你有更多的要求，比如：对一行的多个列进行匹配，那么你就需要了解dataTable的匹配规则
DataTable搜索结果以行显示，那么每一行是怎么匹配正则的？

>每一行代表的字符串是以2个空格将没一列连成一个字符串

例如：
|example1|example2|example3|
|:-:|:-:|:-:|
|a|c|d|
|e|f|g|
|h|i|j|

如果我们在输入框中输入: `^a  c  d`  
即可匹配到第一行

>如果想要更多的验证DataTable的正则匹配规则，[可以点击连接验证](https://datatables.net/examples/api/regex.html)

## 多列使用搜索

很多人想到用`.columns()`，但是`.columns()`表示的是与`&&`, 例如`.columns([1,2]).search('')`表示的是第2，3列都有匹配的项

有一种替代方法，如下：
```
$('table').dataTable().api().column(1).search('李').column(0).search('1').draw();
```

## 添加外部html
可以在`dom`选项中添加类名为`toolbar`的`div`，再往其中加入代码即可
```
$(document).ready(function() {
    $('#example').DataTable( {
        "dom": '<"toolbar">frtip'
    } );
 
    $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
} );
```
### 参考
[dom_toolbar](https://datatables.net/examples/advanced_init/dom_toolbar.html)