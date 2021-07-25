---
layout: post
title: js事件运行机制event loop
excerpt: '我们都知道javascript是单线程运行的，那么javascript在执行一些异步操作时，是如何调度分配任务的'
tags: [javascript]
categories: review
comments: true
date: 2020-12-20 11:06:21
---

## 为什么会有event loop
js是一种单线程运行机制，可以预见的是，由于浏览器运行机制的特殊性，js以后将一直会是一种单线程语言，因为有dom操作的时候，如果可以多线程操作，就会让浏览器渲染变得混乱。  
单线程运行，意味着在同一时间，只能执行一个进程，对于某些会阻塞的服务，像http请求、I/O设备，js会挂起这些任务，让他们进入计划任务里面，等待所有主进程的任务运行完毕后，再执行被挂起的任务。

## 执行过程
任务队列存在多个，同一个任务队列中，按队列顺序被主线程取走；不同的任务队列中，存在着优先级，优先级高的现获取  
>step1:主线程读取JS代码，此时为同步环境，形成相应的堆和执行栈；  
>step2:主线程遇到异步任务，指给对应的异步进程进行处理（WEB API）；  
>step3:异步进程处理完毕（Ajax返回，DOM事件处理，Timer定时器等），将对应的异步任务推入异步队列中；  
>step4:主线程查询任务队列，执行microtask(宏任务) queue，将其按序执行，全部执行完毕；  
>step5:主线程查询任务队列，执行macrotask(微任务) queue，将其按序执行，全部执行完毕；  
>step6:重复step4，5；  

### 宏任务
浏览器为了能够使得JS内部task与DOM任务能够有序的执行，会在一个task执行结束后，在下一个 task 执行开始前，对页面进行重新渲染 （task->渲染->task->...）
鼠标点击会触发一个事件回调，需要执行一个宏任务，然后解析HTMl。

*`setTimeout`的作用是等待给定的时间后为它的回调产生一个新的宏任务*。这就是为什么打印‘setTimeout’在‘script end’之后。因为打印‘script end’是第一个宏任务里面的事情，而‘setTimeout’是另一个独立的任务里面打印的。

>setTimeout、setInterval和setImmediate  
>I/O操作、UI渲染、script脚本执行  
>MessageChannel(Vue的nexttick有使用)  
### 微任务
微任务通常来说就是需要在当前 task 执行结束后立即执行的任务，比如对一系列动作做出反馈，或或者是需要异步的执行任务而又不需要分配一个新的 task，这样便可以减小一点性能的开销。只要执行栈中没有其他的js代码正在执行且每个宏任务执行完，微任务队列会立即执行。如果在微任务执行期间微任务队列加入了新的微任务，会将新的微任务加入队列尾部，之后也会被执行。微任务包括了`mutation observe`的回调还有接下来的例子`promise`的回调。

>promise  
>MutationObserver  
>process.nextTick (Node)  

## 实例
事件循环的顺序，决定js代码的执行顺序。进入整体代码(宏任务)后，开始第一次循环。接着执行所有的微任务。然后再次从宏任务开始，找到其中一个任务队列执行完毕，再执行所有的微任务。听起来有点绕，我们用一段代码说明：
```
setTimeout(function() {
    console.log('setTimeout');
})

new Promise(function(resolve) {
    console.log('promise');
}).then(function() {
    console.log('then');
})

console.log('console');

```
* 这段代码作为宏任务，进入主线程。  
* 先遇到setTimeout，那么将其回调函数注册后分发到宏任务Event Queue。(注册过程与上同，下文不再描述)  
* 接下来遇到了Promise，new Promise立即执行，then函数分发到微任务Event Queue。  
* 遇到console.log()，立即执行。  
* 好啦，整体代码script作为第一个宏任务执行结束，看看有哪些微任务？我们发现了then在微任务Event Queue里面，执行。  
* ok，第一轮事件循环结束了，我们开始第二轮循环，当然要从宏任务Event Queue开始。我们发现了宏任务Event Queue中setTimeout对应的回调函数，立即执行。  
* 结束。

> 注意promise的异步是指`then`和`catch`,运行在`promise`中的代码会被当作同步任务

## 参考
[这一次，彻底弄懂 JavaScript 执行机制
](https://juejin.cn/post/6844903512845860872)  
[js面试——eventLoop
](https://blog.csdn.net/qq_26443535/article/details/106785350)
[面试题之Event Loop终极篇](https://segmentfault.com/a/1190000019494012)