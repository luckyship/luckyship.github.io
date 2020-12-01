---
layout: post
title: jquery监听ajax事件
excerpt: '使用jquery监听ajax事件'
tags: [javascript, jquery]
comments: true
date: 2020-12-01 16:35:05
---

## jQuery.ajaxComplete()

回调函数handler有3个参数：其一是表示当前事件的`Event`对象，其二是发送当前AJAX请求的`jqXHR`对象，其三是包含为本次`AJAX`请求设置的所有参数选项(包括无需指定的默认参数选项)的`Object`对象。

> 从jQuery 1.8开始，ajaxComplete事件的处理函数必须绑定到document对象上才能生效。

> 如果在jQuery.ajax()或jQuery.ajaxSetup()中将选项参数global设为false，可以禁止该AJAX请求触发全局的AJAX事件。

因此，不论当前jQuery为何版本，如果不是特殊需求，我们都应该将ajaxComplete事件的处理函数绑定到document对象上。
```
$(document).ajaxComplete( function(event, jqXHR, options){
	alert("处理函数1：请求的url为" + options.url);
} );

$(document).ajaxComplete( function(event, jqXHR, options){
	alert("处理函数2：请求方式为" + options.type);
} );


// 执行该AJAX请求，会弹出2次对话框
// 因为document对象上绑定了2个事件处理函数
$.ajax( {
	url: "index.html"
// 	, global: false // 可以禁止触发全局的Ajax事件
} );


// 执行该AJAX请求，会弹出3次对话框
// 因为$.ajax()自己通过complete选项绑定了一个局部的ajaxComplete事件处理函数，它也在document对象上，会执行一次
// 我们还通过ajaxComplete()额外绑定了两个事件处理函数，会再弹出2次
$.ajax( {
	url: "myurl" ,
	complete: function(jqXHR, textStatus){
		// jqXHR 是经过jQuery封装的XMLHttpRequest对象
        // textStatus 可能为：null、'success'、 'notmodified'、 'error'、 'timeout'、 'abort'或'parsererror'等
       alert( "ajax()" );
	}
// 	, global: false // 可以禁止触发全局的Ajax事件
} );
```
## 参考
[原创 jQuery.ajaxComplete() 函数详解
](https://codeplayer.vip/p/j7ssg)
[jQuery.ajaxComplete() 函数详解](https://www.cnblogs.com/WuXuanKun/p/6195325.html)

