---
layout: post
title: vue生命周期钩子函数
excerpt: 'vue在渲染页面时，各个阶段都做了些什么，dom在哪里产生'
tags: [vue, javascript]
comments: true
date: 2020-12-20 17:25:12
---

## vue的生命周期

简单的说生命周期就是事物从产生到消失的一个时间过程。那么vue的生命周期就是从其被创建到销毁的过程，其中包含了开始创建、初始化数据、编译模板、挂载dom（渲染） ，渲染->更新->渲染、销毁（卸载）等一系列过程。

那么其中的钩子函数都担负着自己的职责，较为常用的就是created和mounted函数，可以在函数中编写相关的业务逻辑。

## 钩子函数

### beforeCreate

在实例初始化之后，数据观测和事件、生命周期初始化配置之前被调用。

### created

实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测，属性和方法的运算，事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。

### beforeMount

在挂载开始之前被调用：相关的 render 函数首次被调用，此时有了虚拟DOM。

### mounted

el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子，渲染为真实DOM。

### beforeUpdate

在数据更新之前时调用，发生在虚拟 DOM 重新渲染和打补丁之前。 你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。

### updated

由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。

当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态，因为这可能会导致更新无限循环。

值得注意的是：该钩子在服务器端渲染期间不被调用。

### beforeDestroy

实例销毁之前调用。此时，实例仍然是可用的。

### destroyed

vue 实例销毁后调用。调用后，vue 实例指示的所有东西都会解绑，所有的事件监听器会被卸载移除，所有的子实例也会被销毁。 

值得注意的是：该钩子在服务器端渲染期间不被调用。

## 参考
[VueJS生命周期](https://blog.csdn.net/jian_xi/article/details/79249300)