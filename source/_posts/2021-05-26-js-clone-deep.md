---
layout: post
title: js深拷贝和浅拷贝
tags: [javascript]
categories: interview
comments: true
date: 2021-05-26 22:29:56
---


## JSON方法
利用`JSON.stringify()`和`JSON.parse()`方法，不过这种方法不能拷贝`undefined`
```
> JSON.parse(JSON.stringify({a: 1}))
{a: 1}

> JSON.stringify({a:undefined})
"{}"
```

## 递归调用

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
