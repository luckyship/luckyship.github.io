---
layout: post
title: "调用DataTable api"
date: 2019-03-12
excerpt: "初始化DataTable后，不用记录返回值,调用dataTable api"
tags: [DataTable, web, javascript]
comments: true
---

当我们要使用dataTable方法时，一般如下调用
```
var table = $('#example').DataTable();
table.clear().draw();
```
然而当在另一个函数中想用调用DataTable方法的话，就需要把`table`当作参数传值。
当dataTable 已经初始化完毕后，也可以用``.dataTable()``方法来取得返回值
```
$('#example').DataTable();
var table = $('#example').dataTable().api();
table.clear().draw();
```
这样就不需要再把`table`当作参数传值，这样可以简化函数的复杂度
