---
layout: post
title: js浮点数计算
excerpt: '因为计算机的特性，浮点数计算很多时候不会等于我们想要的值'
tags: [javascript]
categories: review
comments: true
date: 2020-12-01 09:48:04
---

因为计算机的特性，浮点数计算很多时候不会等于我们想要的值
```
> 0.1 +0.2
0.30000000000000004

> 0.7 /10
0.06999999999999999
```
<!-- more -->

## 原因
`JavaScript` 内部只有一种数字类型`Number`，也就是说，`JavaScript`语言的底层根本没有整数，所有数字都是以IEEE-754标准格式64位浮点数形式储存，1与1.0是相同的。因为有些小数以二进制表示位数是无穷的。`JavaScript`会把超出`53`位之后的二进制舍弃，所以涉及小数的比较和运算要特别小心。

### 浮点数的运算过程
首先，十进制的0.1和0.2会转换成二进制的，但是由于浮点数用二进制表示是无穷的
```
 0.1——>0.0001 1001 1001 1001 ...(1001循环)
 0.2——>0.0011 0011 0011 0011 ...(0011循环)
```
`IEEE754`标准的`64`位双精度浮点数的小数部分最多支持`53`位二进制，多余的二进制数字被截断，所以两者相加之后的二进制之和是
```
 0.0100110011001100110011001100110011001100110011001101
```
将截断之后的二进制数字再转换为十进制，就成了`0.30000000000000004`，所以在计算时产生了误差

## 解决方法

### 转换为整数运算
在知道小数的位数情况下，我们将它转为整数，结果在除以对应的倍数
```
> 0.1 +0.2
0.30000000000000004

> (0.1 * 10 + 0.2 * 10) / 10
0.3
```

### 位数舍入法
小数部分最多支持53位， 对应的小数位支持17位，我们取15位，然后在用`Number`转换
```
> Number((0.1 +0.2).toPrecision(15))
0.3
```
适用于不知道位数的情况下，但是小数位不会超过15位

### 小数转整数运算
适用所有情况：  
把小数部分和整数部分都转换为整数运算，在通过字符串拼接回来
```
function add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}

function sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}

function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

function div(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}
```

## 参考
[Javascript优化后的加减乘除（解决js浮点数计算bug）
](https://blog.csdn.net/qinshenxue/article/details/43671763)

[解决JS浮点数运算结果不精确的Bug](https://juejin.cn/post/6844903903071322119)