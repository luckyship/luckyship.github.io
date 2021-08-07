---
layout: post
title: angular生命周期函数
tags: [angualr, javascript]
categories: review
comments: true
date: 2021-04-20 11:04:16
---

## 加载所有生命周期函数

```js
export class LifecircleComponent {

  constructor() {
    console.log('00构造函数执行了---除了使用简单的值对局部变量进行初始化之外，什么都不应该做')
  }

  ngOnChanges() {
    console.log('01ngOnChages执行了---当被绑定的输入属性的值发生变化时调用(父子组件传值的时候会触发)');
  }

  ngOnInit() {
    console.log('02ngOnInit执行了--- 请求数据一般放在这个里面');
  }
  ngDoCheck() {
    console.log('03ngDoCheck执行了---检测，并在发生 Angular 无法或不愿意自己检测的变化时作出反应');
  }
  ngAfterContentInit() {
    console.log('04ngAfterContentInit执行了---当把内容投影进组件之后调用');
  }
  ngAfterContentChecked() {
    console.log('05ngAfterContentChecked执行了---每次完成被投影组件内容的变更检测之后调用');
  }
  ngAfterViewInit(): void {
    console.log('06 ngAfterViewInit执行了----初始化完组件视图及其子视图之后调用（dom操作放在这个里面）');
  }
  ngAfterViewChecked() {
    console.log('07ngAfterViewChecked执行了----每次做完组件视图和子视图的变更检测之后调用');
  }

  ngOnDestroy() {
    console.log('08ngOnDestroy执行了····');
  }

  //自定义方法
  changeMsg() {
    this.msg = "数据改变了";
  }
}
```

<!-- more -->

## 生命周期钩子详解

### constructor

`constructor` ，来初始化类。 `Angular` 中的组件就是基于 `class` 类实现的，在 `Angular` 中， `constructor` 用于注入依赖。组件的构造函数会在所有的生命周期钩子之前被调用，它主要用于依赖注入或执行简单的数据初始化操作。

### ngOnChanges()

`@input` 属性(输入属性)发生变化时，会调用。非此属性，不会调用。 `当输入属性为对象时，当对象的属性值发生变化时，不会调用，当对象的引用变化时会触发` 。首次调用一 定会发生在 ngOnInit()之前。

### ngOnInit()

在 `Angular` 第一次显示数据绑定和设置指令/组件的输入属性之后，初始化指令/组件。在第一轮 `ngOnChanges` () 完成之后调用，只调用一次。可以请求数据

使用 `ngOnInit()` 有两个原因:

在构造函数之后马上执行复杂的初始化逻辑
在 `Angular` 设置完输入属性之后，对该组件进行准备。有经验的开发者会认同组件的构建应该很便宜和安全

### ngDoCheck()

检测，并在发生 Angular 无法或不愿意自己检测的变 化时作出反应。在每个 Angular 变更检测周期中调用， ngOnChanges() 和 ngOnInit()之后。

### ngAfterContentInit()

当把内容投影进组件之后调用。第一次 ngDoCheck() 之后调用，只调用一次

### ngAfterContentChecked()

每次完成被投影组件内容的变更检测之后调用。 ngAfterContentInit() 和每次 ngDoCheck() 之后调

### ngAfterViewInit()--掌握

初始化完组件视图及其子视图之后调用。第一 次 ngAfterContentChecked() 之后调用，只调用一次。在这里可以操作DOM

### ngAfterViewChecked()

每次做完组件视图和子视图的变更检测之后调用。 ngAfterViewInit()和每次 ngAfterContentChecked() 之后 调用。

### ngOnDestroy()--掌握

当 Angular 每次销毁指令/组件之前调用并清扫。在这儿反订阅可观察对象和分离事件处理器，以防内存泄 漏。在 Angular 销毁指令/组件之前调用。比如：移除事件监听、清除定时器、退订 Observable 等。
