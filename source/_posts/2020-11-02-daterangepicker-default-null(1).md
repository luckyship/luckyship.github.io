---
layout: post
title: daterangepicker默认显示为空
excerpt: 'jquery 日期插件daterangepicker，在不选择的情况，输入框显示为空'
tags: [javascript, es6]
comments: true
date: 2020-10-23 16:14:11
---

## daterangepicker 默认显示为空

目前官网提供属性`autoUpdateInput: false`，输入框就可以显示为空，但是再次选择日期的时候不会发生变化
我们对组件进行一些修改，让它可以显示为空值。

```
$('.date').daterangepicker({
    singleDatePicker:true,
    autoUpdateInput: false,
    showDropdowns:true,
    locale: {
        format: "YYYY-MM-DD",
    },
    }, function(start, end, label) {
        $(el).val(start.format('YYYY-MM-DD'));
});
```
利用回调函数，为输入框赋值我们选择的日期
