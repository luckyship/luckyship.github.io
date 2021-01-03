---
layout: post
title: js数据类型判断
excerpt: ''
tags: [javascript]
comments: true
date: 2021-01-01 11:19:20
---

javascrip中有几种判断数据类型的办法，不同的场景使用不同的方法
<!-- morme -->

## typeof
typeof 是一个一元运算，放在一个运算数之前，运算数可以是任意类型。
返回值是一个字符串，该字符串说明运算数的类型。
typeof 一般只能返回如下几个结果：
`number,boolean,string,function,object,undefined`。一般可以使用 `typeof` 来获取一个变量是否存在，如 
```
if(typeof a!="undefined"){alert("ok")}
```
而不要去使用 `if(a)` 因为如果 `a` 不存在（未声明）则会出错，对于 `Array`,`Null` 等特殊对象使用 `typeof` 一律返回 `object`，这正是 `typeof` 的局限性。

## Object.prototype.toString.call
### 1.判断基本类型：
```
Object.prototype.toString.call(null);//"[object Null]"
Object.prototype.toString.call(undefined);//"[object Undefined]"
Object.prototype.toString.call("abc");//"[object String]"
Object.prototype.toString.call(123);//"[object Number]"
Object.prototype.toString.call(true);//"[object Boolean]"
```
### 2.判断原生引用类型：
```
函数类型
Function fn(){console.log("test");}
Object.prototype.toString.call(fn);//"[object Function]"
日期类型
var date = new Date();
Object.prototype.toString.call(date);//"[object Date]"
数组类型
var arr = [1,2,3];
Object.prototype.toString.call(arr);//"[object Array]"
正则表达式
var reg = /[hbc]at/gi;
Object.prototype.toString.call(arr);//"[object RegExp]"
自定义类型
function Person(name, age) {
    this.name = name;
    this.age = age;
}
var person = new Person("Rose", 18);
Object.prototype.toString.call(person); //"[object Object]"
```

## instance of

`instanceof` 用于判断一个变量是否某个对象的实例，如 
```
var a=new Array();
alert(a instanceof Array);
```
 会返回 `true，同时` `alert(a instanceof Object)` 也会返回 `true`;这是因为 `Array` 是 `object` 的子类。  
 但是当我们用变量直接赋值时，它不是由构造函数产生的，`instanceof`为`false`
```
var a = '123'
undefined
a instanceof Object
false

var a = new String('123')
undefined
a instanceof Object
true
```