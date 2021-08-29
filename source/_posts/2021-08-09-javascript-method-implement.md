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

### Promise.all

promiseAll 源码实现

```js
function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
}

const myPromiseAll = arr => {
  let result = [];
  return new Promise((resolve, reject) => {
    console.log('promiseAll');
    for (let i = 0; i < arr.length; i++) {
      if (isPromise(arr[i])) {
        arr[i].then(data => {
          result[i] = data;
          if (result.length === arr.length) {
            resolve(result);
          }
        }, reject);
      } else {
        result[i] = arr[i];
      }
    }
  });
};
let p1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 5000, 'foo1');
});
let p2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, 'foo2');
});
let p3 = new Promise((resolve, reject) => {
  setTimeout(function () {
    resolve('foo3');
  }, 10000);
});
myPromiseAll([p1, p2, p3]).then(values => {
  console.log(values); // ["foo1", "foo2", "foo3"]
});
```

## 函数柯里化

```js
function add(num) {
  var sum = 0;
  sum = sum + num;
  var tempFun = function (numB) {
    if (arguments.length === 0) {
      return sum;
    } else {
      sum = sum + numB;
      return tempFun;
    }
  };

  tempFun.valueOf = function () {
    return sum;
  };
  tempFun.toString = function () {
    return sum + '';
  };

  return tempFun;
}
```

[参考](https://segmentfault.com/q/1010000004342477)
