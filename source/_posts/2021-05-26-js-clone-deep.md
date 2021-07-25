---
layout: post
title: js深拷贝和浅拷贝
tags: [javascript]
categories: review
comments: true
date: 2021-05-26 22:29:56
---

## 数组深拷贝
数组深拷贝实现主要用到`生成新数组`的方法
### silce
```
let a = [1,2,3]
a.slice(0)
```
<!-- more -->
### concat
```
let a = [1,2,3]
a.concat()
```

### ...运算符
```
let a = [1,2,3]
let b = [...a]
```
## 对象深拷贝
### JSON方法
利用`JSON.stringify()`和`JSON.parse()`方法
```
> JSON.parse(JSON.stringify({a: 1}))
{a: 1}

```

### 弊端
```
// 函数
var source = { name:function(){console.log(1);}, child:{ name:"child" } } 
var target = JSON.parse(JSON.stringify(source));
console.log(target.name); //undefined

// 正则
var source = { name:function(){console.log(1);}, child:new RegExp("e") }
var target = JSON.parse(JSON.stringify(source));
console.log(target.name); //undefined
console.log(target.child); //Object {}

// undefined
> JSON.stringify({a:undefined})
"{}"

// NaN、Infinity和-Infinity
> JSON.stringify({a: NaN, b: Infinity, c: -Infinity})
"{\"a\":null,\"b\":null,\"c\":null}"
```

### 递归调用

```
var cloneObj = function(obj){
    var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ?
            cloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
};
```
