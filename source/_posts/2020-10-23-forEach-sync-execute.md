---
layout: post
title: js forEach函数有什么缺陷
excerpt: 'forEach()作为数组类的内置方法被引入ECMAScript 2015'
tags: [javascript, es6]
comments: true
date: 2020-10-23 16:14:11
---


## forEach是不能阻塞的，默认是请求并行发起

来看一个例子
```
const list = [1, 2, 3]
const square = num => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num * num)
    }, 1000)
  })
}

function test() {
  list.forEach(async x=> {
    const res = await square(x)
    console.log(res)
  })
}
test()

```
上面函数执行，虽然加了异步函数，但是执行结果是同时输出`1、4、9`

如果想要能够异步执行，需要使用`for`循环
```
async function test() {
  for (let i = 0; i < list.length; i++) {
    let x = list[i]
    const res = await square(x)
    console.log(res)
  }
}
```

或者`for..of`
```
async function test() {
  for (let x of list) {
    const res = await square(x)
    console.log(res)
  }
}
```