---
layout: post
title: js箭头函数和普通函数区别
categories: review
tags: [javascript]
comments: true
date: 2021-01-16 17:51:10
---

普通函数在 es5 中就有了，箭头函数是 es6 中出现的函数形式，当然也可以继续用普通函数。

箭头函数代码少，更利于阅读，但是在有些情况下，会表现出和普通函数不一样的特性

<!-- more -->

## 箭头函数

### 语法

- 开发时根据实际情况可以省略一些东西
- 单条处理可以省略 return 和{大括号}
- 单个参数可以省略(小括号)

```js
> [1, 2, 3].map(item => item * 2)
  // (3)[2, 4, 6]
```

### 不能作为构造函数

箭头函数不能作为构造函数 不能 new。会报错

```js
let A = () => {};
// undefined
let a = new A();
// VM423: 1 Uncaught TypeError: A is not a constructor
// at < anonymous >: 1: 9
```

### 不绑定 arguments，但是可使用 `…rest` 参数

普通函数使用 `arguments`

```js
let A = function (a) {
  console.log(arguments);
};
// undefined

A(1, 2, 3, 4);
// VM530: 2 Arguments(4)[1, 2, 3, 4, callee: ƒ, Symbol(Symbol.iterator): ƒ]
// undefined
```

箭头函数使用，用了会报错。

但是可以使用 `...rest` 函数

```js
let A = (...a) => console.log(a);
// undefined

A(1, 2, 3, 4);
// VM680: 1(4)[1, 2, 3, 4]
// undefined
```

`arguments` 的一般使用场景是：允许传入 3 个参数，中间一个参数是可选。如果只传 1 个参就是参数 1 用，传入 2 个参就是参数 1 和参数 3 用…

```js
let f = function (a, b, c) {
  if (arguments.length == 2) {
    c = b;
    b = null;
  }
  console.log(a, b, c);
};

f(1);
// VM850: 6 1 undefined undefined

f(1, 2);
// VM850: 6 1 null 2

f(1, 2, 3);
// VM850: 6 1 2 3
```

rest 参数使用效果：
rest 默认是[]，多余的传参会加入数组

### `this` 指向不一样

- f1 是箭头函数，this 代表上层对象，若无自定义上层，则代表 window。
- f2 是普通函数，this 代表当前对象。

箭头函数的 call()或 apply()函数，不会影响到 this 的代表对象：

箭头函数没有原型属性：

prototype 是普通函数用于获取原型对象的。

## 总结

箭头函数内的 this 指向上层对象，bind()、call()、apply()均无法改变指向。

普通函数内的 this 执行调用其函数的对象。

## 参考

[理解普通函数和箭头函数的区别点](https://blog.csdn.net/qq_25753979/article/details/90237123)
