---
layout: post
title: 手写javascript方法
tags: [javascript]
categories: review
comments: true
date: 2021-08-09 16:27:43
---

### 数组扁平化

效果：

```js
[1, [2, [3]]].flat(2); // [1, 2, 3]
```

<!-- more -->

#### es5 实现：递归调用

```js
Array.prototype.newFlat = function (depth) {
  var arr = this;
  var result = [];

  for (var i = 0; i < arr.lenght; i++) {
    if (Array.isArray(arr[i]) && depth >= 1) {
      depth--;
      result = result.concat(arr[i].newFlat(depth));
    } else {
      result.push(arr[i]);
    }
  }

  return result;
};
```

#### es6 实现

```js
Array.prototype.newFlat = function (depth) {
  var arr = this;
  // var result = [];

  while (arr.some(item => Array.isArray(item))) {
    if (depth >= 1) {
      depth--;
      arr = [].concat(...arr);
    }
  }

  return arr;
};
```

### 实现 new

实现要点：

- `new` 会产生一个新对象
- 新对象需要能够访问到构造函数的属性，所以需要重新指定它的原型
- 构造函数可能会显示返回

```js
function objectFactory() {
  var obj = new Object();
  // 取出第一个参数为构造函数，同时删除第一个参数，剩余参数为构造函数的参数
  var constructorFunction = [].shift.call(arguments);
  obj.__proto__ = constructorFunction.protoype;
  var result = constructorFunction.apply(obj, arguments);

  // result || obj 这里这么写，是考虑到构造函数返回为null
  return typeof result === 'object' ? ret || obj : obj;
}
```

实例

```js
function person(name, age) {
  this.name = name;
  this.age = age;
}

var p = objectFactory(person, 'asd', 13);

console.log(p);
```

### 实现 instanceof 关键字

`instanceof` 就是判断构造函数的 `prototype` 属性是否出现在实例的原型链上

```js
function newInstanceof(left, right) {
  var proto = left.__proto__;
  while (true) {
    if (proto === null) {
      return false;
    }
    if (proto === right.prototype) {
      return true;
    }

    proto = proto.__proto__;
  }
}
```
