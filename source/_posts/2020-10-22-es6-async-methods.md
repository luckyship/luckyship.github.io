---
layout: post
title: es6异步的写法
excerpt: '由于有些业务逻辑的有序性，代码需要按顺序执行，这就需要用到异步的操作，es6中提供多种异步操作的方法，例如：promise函数，Generator函数，async函数'
tags: []
comments: true
date: 2020-10-22 15:21:00
---

## Promise

新界`promise`对象，在其中写入需要异步的代码

```
var p1 = new Promise(function(resolve, reject){
	//做一些异步操作
	setTimeout(function(){
		console.log('执行完成Promise');
		resolve('要返回的数据可以任何数据例如接口返回数据');
	}, 2000);
});
p1.then(function(data){console.log(data)});


执行完成Promise
要返回的数据可以任何数据例如接口返回数据
```

### 注意
```
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```
上面代码中，调用`resolve(1)`以后，后面的`console.log(2)`还是会执行，并且会首先打印出来。这是因为立即`resolved`的`Promise`是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。  
一般来说，调用`resolve`或`reject`以后，`Promise`的使命就完成了，后继操作应该放到`then`方法里面，而不应该直接写在`resolve`或`reject`的后面。所以，最好在它们前面加上`return`语句，这样就不会有意外。
```
new Promise((resolve, reject) => {
  return resolve(1);
  // 后面的语句不会执行
  console.log(2);
})
```

## Generator函数
Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同
```
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}
```

上面代码定义了一个 Generator 函数helloWorldGenerator，它内部有两个yield表达式（hello和world），即该函数有三个状态：hello，world 和 return 语句（结束执行）。

然后，Generator 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是上一章介绍的遍历器对象（Iterator Object）。

下一步，必须调用遍历器对象的next方法，使得指针移向下一个状态。也就是说，每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield表达式（或return语句）为止。换言之，Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行。


```
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```
上面代码一共调用了四次next方法。

第一次调用，`Generator` 函数开始执行，直到遇到第一个`yield`表达式为止。`next`方法返回一个对象，它的`value`属性就是当前`yield`表达式的值`hello`，`done`属性的值`false`，表示遍历还没有结束。

第二次调用，`Generator` 函数从上次`yield`表达式停下的地方，一直执行到下一个`yield`表达式。`next`方法返回的对象的`value`属性就是当前`yield`表达式的值`world`，`done`属性的值`false`，表示遍历还没有结束。

第三次调用，`Generator` 函数从上次`yield`表达式停下的地方，一直执行到`return`语句（如果没有`return`语句，就执行到函数结束）。`next`方法返回的对象的`value`属性，就是紧跟在`return`语句后面的表达式的值（如果没有`return`语句，则`value`属性的值为`undefined`），`done`属性的值`true`，表示遍历已经结束。

第四次调用，此时 `Generator` 函数已经运行完毕，`next`方法返回对象的`value`属性为`undefined`，`done`属性为`true`。以后再调用`next`方法，返回的都是这个值。

总结一下，调用` Generator `函数，返回一个遍历器对象，代表 `Generator `函数的内部指针。以后，每次调用遍历器对象的`next`方法，就会返回一个有着`value`和`done`两个属性的对象。`value`属性表示当前的内部状态的值，是`yield`表达式后面那个表达式的值；`done`属性是一个布尔值，表示是否遍历结束。


## async函数

async 函数是什么？一句话，它就是 Generator 函数的语法糖。

```
const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

```

上面代码的函数`gen`可以写成`async`函数，就是下面这样。
```
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```
一比较就会发现，`async`函数就是将`Generator`函数的星号`（*）`替换成`async`，将`yield`替换成`await`，仅此而已。  
`async`函数对`Generator`函数的改进，体现在以下四点。  
### （1）内置执行器。  
Generator 函数的执行必须靠执行器，所以才有了co模块，而async函数自带执行器。也就是说，async函数的执行，与普通函数一模一样，只要一行。
```
asyncReadFile();
```
上面的代码调用了`asyncReadFile`函数，然后它就会自动执行，输出最后结果。这完全不像` Generator `函数，需要调用`next`方法，或者用`co`模块，才能真正执行，得到最后结果。

### （2）更好的语义。

`async`和`await`，比起星号和`yield`，语义更清楚了。`async`表示函数里有异步操作，`await`表示紧跟在后面的表达式需要等待结果。

### （3）更广的适用性。

`co`模块约定，`yield`命令后面只能是 `Thunk `函数或 `Promise`对象，而`async`函数的`await`命令后面，可以是 `Promise `对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 `resolved `的` Promise` 对象）。

### （4）返回值是 Promise。

`async`函数的返回值是` Promise` 对象，这比` Generator` 函数的返回值是` Iterator `对象方便多了。你可以用`then`方法指定下一步的操作。

进一步说，`async`函数完全可以看作多个异步操作，包装成的一个 `Promise `对象，而`await`命令就是内部then命令的语法糖。

下面是一个例子。

```
async function getStockPriceByName(name) {
  const symbol = await getStockSymbol(name);
  const stockPrice = await getStockPrice(symbol);
  return stockPrice;
}

getStockPriceByName('goog').then(function (result) {
  console.log(result);
});
```
### Promise对象的状态变化 
`async`函数返回的 `Promise `对象，必须等到内部所有`await`命令后面的 `Promise` 对象执行完，才会发生状态改变，除非遇到`return`语句或者抛出错误。也就是说，只有`async`函数内部的异步操作执行完，才会执行`then`方法指定的回调函数。

下面是一个例子。

```
async function getTitle(url) {
  let response = await fetch(url);
  let html = await response.text();
  return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}
getTitle('https://tc39.github.io/ecma262/').then(console.log)
// "ECMAScript 2017 Language Specification"

```

上面代码中，函数`getTitle`内部有三个操作：抓取网页、取出文本、匹配页面标题。只有这三个操作全部完成，才会执行`then`方法里面的`console.log`。

### await 命令
正常情况下，`await`命令后面是一个 `Promise `对象，返回该对象的结果。如果不是 `Promise `对象，就直接返回对应的值。
```
async function f() {
  // 等同于
  // return 123;
  return await 123;
}

f().then(v => console.log(v))
// 123
```
上面代码中，`await`命令的参数是数值`123`，这时等同于`return 123`。

另一种情况是，`await`命令后面是一个`thenable`对象（即定义了`then`方法的对象），那么`await`会将其等同于 `Promise` 对象。
```
class Sleep {
  constructor(timeout) {
    this.timeout = timeout;
  }
  then(resolve, reject) {
    const startTime = Date.now();
    setTimeout(
      () => resolve(Date.now() - startTime),
      this.timeout
    );
  }
}

(async () => {
  const sleepTime = await new Sleep(1000);
  console.log(sleepTime);
})();
// 1000

```
上面代码中，`await`命令后面是一个`Sleep`对象的实例。这个实例不是 `Promise` 对象，但是因为定义了`then`方法，`await`会将其视为`Promise`处理。


## 参考
[Promise 对象](https://es6.ruanyifeng.com/#docs/promise)
[Generator 函数的语法](https://es6.ruanyifeng.com/#docs/generator)
[async函数](https://es6.ruanyifeng.com/#docs/async)