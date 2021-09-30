---
layout: post
title: Vue你了解哪些
tags: [javascript, vue]
categories: review
comments: true
date: 2021-09-12 16:26:18
---

## 一、vue

### 1、vue 优点

- 轻量级框架：只关注视图层，是一个构建数据的视图集合，大小只有几十 kb；

- 简单易学：国人开发，中文文档，不存在语言障碍 ，易于理解和学习；

- 双向数据绑定：保留了 angular 的特点，在数据操作方面更为简单；

- 组件化：保留了 react 的优点，实现了 html 的封装和重用，在构建单页面应用方面有着独特的优势；

- 视图，数据，结构分离：使数据的更改更为简单，不需要进行逻辑代码的修改，只需要操作数据就能完成相关操作；

- 虚拟 DOM：dom 操作是非常耗费性能的， 不再使用原生的 dom 操作节点，极大解放 dom 操作，但具体操作的还是 dom 不过是换了另一种方式；

- 运行速度更快:相比较与 react 而言，同样是操作虚拟 dom，就性能而言，vue 存在很大的优势。

<!-- more -->

### 2、谈谈对 vue 渐进式的理解

![](/img/vue-interview/001.png)

### 3、vue 双向绑定原理 【原理题】

<img src="/img/vue-interview/002.png" style="zoom:50%;" />

核心实现类:
**Observer :** 它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新

**Dep :** 用于收集当前响应式对象的依赖关系,每个响应式对象包括子对象都拥有一个 Dep 实例（里面 subs 是 Watcher 实例数组）,当数据有变更时,会通过 dep.notify()通知各个 watcher。

**Watcher :** 观察者对象 , 实例分为渲染 watcher (render watcher),计算属性 watcher (computed watcher),侦听器 watcher（user watcher）三种

**Watcher 和 Dep 的关系**
watcher 中实例化了 dep 并向 dep.subs 中添加了订阅者,dep 通过 notify 遍历了 dep.subs 通知每个 watcher 更新。

**依赖收集**
initState 时,对 computed 属性初始化时,触发 computed watcher 依赖收集
initState 时,对侦听属性初始化时,触发 user watcher 依赖收集
render()的过程,触发 render watcher 依赖收集
re-render 时,vm.render()再次执行,会移除所有 subs 中的 watcer 的订阅,重新赋值。
**派发更新**
组件中对响应的数据进行了修改,触发 setter 的逻辑
调用 dep.notify()
遍历所有的 subs（Watcher 实例）,调用每一个 watcher 的 update 方法。
**原理**
<u>当创建 Vue 实例时,vue 会遍历 data 选项的属性,利用 Object.defineProperty 为属性添加 getter 和 setter 对数据的读取进行劫持（getter 用来依赖收集,setter 用来派发更新）,并且在内部追踪依赖,在属性被访问和修改时通知变化。</u>

<u>每个组件实例会有相应的 watcher 实例,会在组件渲染的过程中记录依赖的所有数据属性（进行依赖收集,还有 computed watcher,user watcher 实例）,之后依赖项被改动时,setter 方法会通知依赖与此 data 的 watcher 实例重新计算（派发更新）,从而使它关联的组件重新渲染。</u>

一句话总结:

**vue.js 采用数据劫持结合发布-订阅模式,通过 Object.defineproperty 来劫持各个属性的 setter,getter,在数据变动时发布消息给订阅者,触发响应的监听回调**

### 4、computed 的实现原理【原理题】

computed 本质是一个惰性求值的观察者。

computed 内部实现了一个惰性的 watcher,也就是 computed watcher,computed watcher 不会立刻求值,同时持有一个 dep 实例。

其内部通过 this.dirty 属性标记计算属性是否需要重新求值。

当 computed 的依赖状态发生改变时,就会通知这个惰性的 watcher,

computed watcher 通过 this.dep.subs.length 判断有没有订阅者,

有的话,会重新计算,然后对比新旧值,如果变化了,会重新渲染。 (Vue 想确保不仅仅是计算属性依赖的值发生变化，而是当计算属性最终计算的值发生变化时才会触发渲染 watcher 重新渲染，本质上是一种优化。)

没有的话,仅仅把 this.dirty = true。 (当计算属性依赖于其他数据时，属性并不会立即重新计算，只有之后其他地方需要读取属性的时候，它才会真正计算，即具备 lazy（懒计算）特性。)

### 5、 computed 和 watch 有什么区别及运用场景?【原理题】

- 区别

  - computed 计算属性 : 依赖其它属性值,并且 computed 的值有缓存,只有它依赖的属性值发生改变,下一次获取 computed 的值时才会重新计算 computed 的值。 【简单表达： 依赖缓存，依赖的值变化了才会自动变化】

  - watch 侦听器 : 更多的是「观察」的作用,无缓存性,类似于某些数据的监听回调,每当监听的数据变化时都会执行回调进行后续操作。 【简单表达：watch 监听数变化，无缓存依赖，监听的值变化了他就变化】

- 运用场景
  - **当我们需要进行数值计算,并且依赖于其它数据时,应该使用 computed,**因为可以利用 computed 的缓存特性,避免每次获取值时,都要重新计算。 【不能放异步】
  - **当我们需要在数据变化时执行异步或开销较大的操作时,应该使用 watch,**使用 watch 选项允许我们执行异步操作 ( 访问一个 API ),限制我们执行该操作的频率,并在我们得到最终结果前,设置中间状态。这些都是计算属性无法做到的。 【可以放异步处理】

### 6、为什么在 Vue3.0 采用了 Proxy,抛弃了 Object.defineProperty？【原理题】

Object.defineProperty 本身有一定的监控到数组下标变化的能力,但是在 Vue 中,从性能/体验的性价比考虑,尤大大就弃用了这个特性(Vue 为什么不能检测数组变动 )。为了解决这个问题,经过 vue 内部处理后可以使用以下几种方法来监听数组

```js
push();
pop();
shift();
unshift();
splice();
sort();
reverse();
```

由于只针对了以上 7 种方法进行了 hack 处理,所以其他数组的属性也是检测不到的,还是具有一定的局限性。

**Object.defineProperty 只能劫持对象的属性,**因此我们需要对每个对象的每个属性进行遍历。<u>Vue 2.x 里,是通过 递归 + 遍历 data 对象来实现对数据的监控的,如果属性值也是对象那么需要深度遍历,显然如果能劫持一个完整的对象是才是更好的选择。</u>
Proxy 可以劫持整个对象,并返回一个新的对象。Proxy 不仅可以代理对象,还可以代理数组。还可以代理动态增加的属性。

### 7、Vue 中的 key 到底有什么用？【原理题】

回答： 【简单表达：**为了防止就地复用！**】

key 是给每一个 vnode 的唯一 id,依靠 key,我们的 diff 操作可以更准确、更快速 (<u>对于简单列表页渲染来说 diff 节点也更快,但会产生一些隐藏的副作用,比如可能不会产生过渡效果,或者在某些节点有绑定数据（表单）状态，会出现状态错位。</u>)

**diff 算法的过程中,先会进行新旧节点的首尾交叉对比,当无法匹配的时候会用新节点的 key 与旧节点进行比对,从而找到相应旧节点.**

更准确 : 因为带 key 就不是就地复用了,在 sameNode 函数 a.key === b.key 对比中可以避免就地复用的情况。所以会更加准确,如果不加 key,会导致之前节点的状态被保留下来,会产生一系列的 bug。

更快速 : key 的唯一性可以被 Map 数据结构充分利用,相比于遍历查找的时间复杂度 O(n),Map 的时间复杂度仅仅为 O(1),源码如下:

```js
function createKeyToOldIdx(children, beginIdx, endIdx) {
  let i, key;
  const map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}
```

### 8、谈一谈 nextTick 的原理【原理题】

**JS 运行机制**

JS 执行是单线程的，它是基于事件循环的。事件循环大致分为以下几个步骤:

所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
主线程不断重复上面的第三步。

<img src="/img/vue-interview/003.png" style="zoom:40%;" />
主线程的执行过程就是一个 tick，而所有的异步结果都是通过 “任务队列” 来调度。 消息队列中存放的是一个个的任务（task）。 规范中规定 task 分为两大类，分别是 macro task 和 micro task，并且每个 macro task 结束后，都要清空所有的 micro task。

```js
for (macroTask of macroTaskQueue) {
  // 1. Handle current MACRO-TASK
  handleMacroTask();
  // 2. Handle all MICRO-TASK
  for (microTask of microTaskQueue) {
    handleMicroTask(microTask);
  }
}
```

在浏览器环境中 :

常见的 macro task 有 setTimeout、MessageChannel、postMessage、setImmediate

常见的 micro task 有 MutationObsever 和 Promise.then

**异步更新队列**

可能你还没有注意到，Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。

如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。

然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。

Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。

**在 vue2.5 的源码中，macrotask 降级的方案依次是：setImmediate、MessageChannel、setTimeout**

**<u>vue 的 nextTick 方法的实现原理:</u>**

vue 用异步队列的方式来控制 DOM 更新和 nextTick 回调先后执行 microtask 因为其高优先级特性，能确保队列中的微任务在一次事件循环前被执行完毕考虑兼容问题,vue 做了 microtask 向 macrotask 的降级方案

### 9、vue 是如何对数组方法进行变异的 ?【原理题】

我们先来看看源码

```js
const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);
const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
/**
 * Intercept mutating methods and emit events
 */

methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted);
    // notify change
    ob.dep.notify();
    return result;
  });
});
/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};
```

简单来说,Vue 通过原型拦截的方式重写了数组的 7 个方法,首先获取到这个数组的 ob,也就是它的 Observer 对象,如果有新的值,就调用 observeArray 对新的值进行监听,然后手动调用 notify,通知 render watcher,执行 update

### 10、 Vue 组件 data 为什么必须是函数 ?【原理题】

new Vue()实例中,data 可以直接是一个对象,为什么在 vue 组件中,data 必须是一个函数呢?
因为组件是可以复用的,JS 里对象是引用关系,如果组件 data 是一个对象,那么子组件中的 data 属性值会互相污染,产生副作用。

所以一个组件的 data 选项必须是一个函数,因此每个实例可以维护一份被返回对象的独立的拷贝。new Vue 的实例是不会被复用的,因此不存在以上问题。

### 11、谈谈 Vue 事件机制,手写$on,$off,$emit,$once 【原理题】

Vue 事件机制 本质上就是 一个 发布-订阅 模式的实现。

```js
class Vue {
  constructor() {
    //  事件通道调度中心
    this._events = Object.create(null);
  }
  $on(event, fn) {
    if (Array.isArray(event)) {
      event.map(item => {
        this.$on(item, fn);
      });
    } else {
      (this._events[event] || (this._events[event] = [])).push(fn);
    }
    return this;
  }
  $once(event, fn) {
    function on() {
      this.$off(event, on);
      fn.apply(this, arguments);
    }
    on.fn = fn;
    this.$on(event, on);
    return this;
  }

  $off(event, fn) {
    if (!arguments.length) {
      this._events = Object.create(null);
      return this;
    }
    if (Array.isArray(event)) {
      event.map(item => {
        this.$off(item, fn);
      });
      return this;
    }
    const cbs = this._events[event];
    if (!cbs) {
      return this;
    }
    if (!fn) {
      this._events[event] = null;
      return this;
    }
    let cb;
    let i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break;
      }
    }
    return this;
  }
  $emit(event) {
    let cbs = this._events[event];
    if (cbs) {
      const args = [].slice.call(arguments, 1);
      cbs.map(item => {
        args ? item.apply(this, args) : item.call(this);
      });
    }
    return this;
  }
}
```

### 12、说说 Vue 的渲染过程 【原理题】

调用 compile 函数,生成 render 函数字符串 ,编译过程如下:

- parse 函数解析 template,生成 ast(抽象语法树)

- optimize 函数优化静态节点 (标记不需要每次都更新的内容,diff 算法会直接跳过静态节点,从而减少比较的过程,优化了 patch 的性能)
  generate 函数生成 render 函数字符串

调用 new Watcher 函数,监听数据的变化,当数据发生变化时，Render 函数执行生成 vnode 对象
调用 patch 方法,对比新旧 vnode 对象,通过 DOM diff 算法,添加、修改、删除真正的 DOM 元素

<img src="/img/vue-interview/004.png" style="zoom:60%;" />

### 13、聊聊 keep-alive 的实现原理和缓存策略 【原理题】

```js
export default {
  name: 'keep-alive',
  abstract: true, // 抽象组件属性 ,它在组件实例建立父子关系的时候会被忽略,发生在 initLifecycle 的过程中
  props: {
    include: patternTypes, // 被缓存组件
    exclude: patternTypes, // 不被缓存组件
    max: [String, Number], // 指定缓存大小
  },
  created() {
    this.cache = Object.create(null); // 缓存
    this.keys = []; // 缓存的VNode的键
  },
  destroyed() {
    for (const key in this.cache) {
      // 删除所有缓存
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted() {
    // 监听缓存/不缓存组件
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name));
    });
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name));
    });
  },
  render() {
    // 获取第一个子元素的 vnode
    const slot = this.$slots.default;
    const vnode: VNode = getFirstComponentChild(slot);
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // name不在inlcude中或者在exlude中 直接返回vnode
      // check pattern
      const name: ?string = getComponentName(componentOptions);
      const { include, exclude } = this;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode;
      }
      const { cache, keys } = this;
      // 获取键，优先获取组件的name字段，否则是组件的tag
      const key: ?string =
        vnode.key == null
          ? // same constructor may get registered as different local components
            // so cid alone is not enough (#3269)
            componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
          : vnode.key;
      // 命中缓存,直接从缓存拿vnode 的组件实例,并且重新调整了 key 的顺序放在了最后一个
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      }
      // 不命中缓存,把 vnode 设置进缓存
      else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        // 如果配置了 max 并且缓存的长度超过了 this.max，还要从缓存中删除第一个
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }
      // keepAlive标记位
      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0]);
  },
};
```

**原理**

获取 keep-alive 包裹着的第一个子组件对象及其组件名
<u>根据设定的 include/exclude（如果有）进行条件匹配,决定是否缓存。不匹配,直接返回组件实例</u>
根据组件 ID 和 tag 生成缓存 Key,并在缓存对象中查找是否已缓存过该组件实例。如果存在,直接取出缓存值并更新该 key 在 this.keys 中的位置(更新 key 的位置是实现 LRU 置换策略的关键)
在 this.cache 对象中存储该组件实例并保存 key 值,之后检查缓存的实例数量是否超过 max 的设置值,超过则根据 LRU 置换策略删除最近最久未使用的实例（即是下标为 0 的那个 key）
最后组件实例的 keepAlive 属性设置为 true,这个在渲染和执行被包裹组件的钩子函数会用到,这里不细说

**LRU 缓存淘汰算法**

LRU（Least recently used）算法根据数据的历史访问记录来进行淘汰数据,其核心思想是“如果数据最近被访问过,那么将来被访问的几率也更高”。

<img src="/img/vue-interview/005.png" style="zoom:50%;" />

**keep-alive 的实现正是用到了 LRU 策略,将最近访问的组件 push 到 this.keys 最后面,this.keys[0]也就是最久没被访问的组件,当缓存实例超过 max 设置值,删除 this.keys[0]**

### 14、`vm.$set()`实现原理是什么? 【原理题】

受现代 JavaScript 的限制 (而且 Object.observe 也已经被废弃)，Vue 无法检测到对象属性的添加或删除。

由于 Vue 会在初始化实例时对属性执行 getter/setter 转化，所以属性必须在 data 对象上存在才能让 Vue 将它转换为响应式的。

对于已经创建的实例，Vue 不允许动态添加根级别的响应式属性。但是，可以使用 Vue.set(object, propertyName, value) 方法向嵌套对象添加响应式属性。

那么 Vue 内部是如何解决对象新增属性不能响应的问题的呢?

```js
export function set(target: Array | Object, key: any, val: any): any {
  // target 为数组
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 修改数组的长度, 避免索引>数组长度导致splice()执行有误
    target.length = Math.max(target.length, key);
    // 利用数组的splice变异方法触发响应式
    target.splice(key, 1, val);
    return val;
  }
  // target为对象, key在target或者target.prototype上 且必须不能在 Object.prototype 上,直接赋值
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  // 以上都不成立, 即开始给target创建一个全新的属性
  // 获取Observer实例
  const ob = (target: any).__ob__;
  // target 本身就不是响应式数据, 直接赋值
  if (!ob) {
    target[key] = val;
    return val;
  }
  // 进行响应式处理
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val;
}
```

如果目标是数组,使用 vue 实现的变异方法 splice 实现响应式
如果目标是对象,判断属性存在,即为响应式,直接赋值
如果 target 本身就不是响应式,直接赋值
如果属性不是响应式,则调用 defineReactive 方法进行响应式处理

### 15、什么是 MVVM？

MVVM 是是 Model-View-ViewModel 的缩写，Model 代表数据模型，定义数据操作的业务逻辑，View 代表视图层，负责将数据模型渲染到页面上，ViewModel 通过双向绑定把 View 和 Model 进行同步交互，不需要手动操作 DOM 的一种设计思想。

### 16、MVVM 和 MVC 区别？和其他框架(jquery)区别？那些场景适用？

MVVM 和 MVC 都是一种设计思想，主要就是 MVC 中的 Controller 演变成 ViewModel,，<u>MVVM 主要通过数据来显示视图层而不是操作节点，解决了 MVC 中大量的 DOM 操作使页面渲染性能降低，加载速度慢，影响用户体验问题。主要用于数据操作比较多的场景</u>。
场景：**数据操作比较多的场景，更加便捷**

### 17、v-show 和 v-if 指令的共同点和不同点?

- v-show 指令是通过修改元素的 displayCSS 属性让其显示或者隐藏。 【CSS 控制节点是否显示，节点一直存在】
- v-if 指令是直接销毁和重建 DOM 达到让元素显示和隐藏的效果。 【DOM 节点是否存在】
- 使用场景：需要反复展示就用`v-show`，如果一次决定不同模板内容就用`v-if`

### 18、vue 中 key 值的作用

**当 Vue.js 用 v-for 正在更新已渲染过的元素列表时，它默认用“就地复用”策略。**如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序， 而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。key 的作用主要是为了高效的更新虚拟 DOM 【防止采用就地复用策略进行改变】

### 19、如何在组件内部实现一个双向数据绑定？

- 该题目又可能称之为 ：**如何在组件上面使用 v-model**

**考察组件的 v-model**

文档地址：

https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model

https://cn.vuejs.org/v2/guide/components.html#%E5%9C%A8%E7%BB%84%E4%BB%B6%E4%B8%8A%E4%BD%BF%E7%94%A8-v-model

```js
import Vue from 'vue';
const component = {
  props: ['value'], // 默认props接收value属性
  template: ``,
  data() {
    return {};
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value); // 默认触发自定义事件input
    },
  },
};
new Vue({
  components: {
    CompOne: component,
  },
  el: '#root',
  template: ``,
  data() {
    return {
      value: '123',
    };
  },
});
```

### 20、常用指令

- v-model 双向数据绑定，一般用于表单元素。

- v-for 对数组或对象进行循环操作，使用是 v-for 不是 v-repeat

- v-on 用来绑定事件，用法：v-on:事件 = '函数'

- v-show/v-if 用来显示或隐藏元素，v-show 是通过 display 实现，v-if 是每次删除后在创建
- v-bind 属性绑定
- v-html 渲染文档，可以编译 HTML 字符串
- v-text 渲染文本，不可以编译 HTML 字符串

### 21、computed 和 method 区别

- computed 依赖于缓存，依赖的变量变化了才会变化，模板变化了，即使依赖变量没有变化也不会重新计算；
- method 是事件，method 里面的事件每次都会执行，只要模板更新都会再次执行。

### 22、什么是 vue 的单向数据流

- 文档地址：https://cn.vuejs.org/v2/guide/components-props.html#%E5%8D%95%E5%90%91%E6%95%B0%E6%8D%AE%E6%B5%81

- vue 的单向数据流指的是 vue 组件通信里面**父子通信是自上而下的，我们不能直接修改 props 里面属性。**

### 23、vue 里面如何操作样式

- 操作 style
  - 对象语法 `:style="{CSS属性名:变量}" `
  - 数组语法 `:style="[样式描述变量1，样式描述变量2]"`
  - 直接字符串 `style='css属性名:css属性值;css属性名2:css属性值2;...'`
- 操作 class
  - 对象语法 `:style="{class名:布尔变量}"`
  - 数组语法 `:class="[变量1,变量2,...]"`
  - 三木语法：` :class = "条件 ? 'class名1':'class名2'"`

### 24、v-if 和 v-for 为什么不推荐一起用

当 `v-if` 与 `v-for` 一起使用时，`v-for` 具有比 `v-if` 更高的优先级。 所以会导致每个列表项渲染的时候都会进行条件判断，从而让性能比较低。

### 25、数组更新检测有哪些方法

- 变更方法 【修改原数组】

  Vue 将被侦听的数组的变更方法进行了包裹，所以它们也将会触发视图更新。这些被包裹过的方法包括：

  ```js
  push();
  pop();
  shift();
  unshift();
  splice();
  sort();
  reverse();
  ```

- 替换数组

  变更方法，顾名思义，会变更调用了这些方法的原始数组。相比之下，也有非变更方法，例如 `filter()`、`concat()` 和 `slice()`。它们不会变更原始数组，而**总是返回一个新数组**。

### 26、如果获取事件对象

- 在书写事件函数的时候直接写上形参就表示事件对象

  ```js
  methods:{
  	fn(ev){   // ev就是事件对象

  	}
  }
  ```

- 如果既要传参又要获取事件对象，那么传入实参的时候传入一个`$event`表示事件对象，`$event`这个单词不能写错

  ```js
  <button @click="run(10,$event)">点击</button>

  methods:{
  		run(num,ev){  // 形参实参一一对应，ev和$event对应所以 就是事件对象

  		}
  }
  ```

### 27、哪些常见事件修饰符，有何作用

- `.stop ` 阻止冒泡
- `.prevent` 阻止默认行为
- `.capture` 捕获阶段触发
- `.self` 自己本身上面触发
- `.once` 一次性绑定
- `.passive` 一般给 scroll 或者 resize 事件绑定，等到调整完成之后触发。

### 28、有哪些常见按键修饰符，以及如何定义按键修饰符

- `.enter`
- `.tab`
- `.delete` (捕获“删除”和“退格”键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`
- 所有字母都也是按键修饰符

**自定义按键修饰符：`Vue.config.keyCodes.按键修饰符名 = 按键码`**

### 29、如何实现一个 v-model 指令

- v-model 其实是 属性绑定和事件综合使用的语法糖。

  ```js
  <input type="text"  :value="msg"   @input="msg=$event.target.value"  />
  // 先给输入框的value绑定变量，这叫做属性绑定
  // 再给输入框绑定input事件，一旦输入，就将输入框的值赋给msg变量，从而实现双向绑定
  ```

### 30、表单控件绑定需要什么？

- 给一组单选控件绑定给同一个变量，且每个单选控件都要有个一个 value
- 给一组多选控件绑定同一个变量，且这个变量是一个数组，且每个多选项都要有一个 value
- 如果 input 的 type 为 checkbox，我们用来做勾选的时候， 应该绑定一个布尔值类型的变量
- textarea 绑定数据，同样应该使用 v-model 直接给到标签，而不是插值表达式

### 31、有哪些常见的表单修饰符

- `.lazy` 在“change”时而非“input”时更新
- `.number` 将用户的输入值转为数值类型
- `.trim` 自动过滤用户输入的首尾空白字符

### 32、如何定义一个组件

- 全局注册

```js
Vue.component(组件名, { 组件配置选项 });
```

- 局部注册

  ```js
  // 组件或者vue实例的配置选项里面增加components属性。
  {
     ...,
  	 components:{
  	 	 组件名:{ 组件配置对象 }
  	 }
  }
  ```

### 33、组件 data 为啥是一个函数

因为组件是可以复用的,JS 里对象是引用关系,如果组件 data 是一个对象,那么子组件中的 data 属性值会互相污染,产生副作用。

**简而言之：组件的数据应该是各自独立的，互不干扰，所以 data 是函数返回一个对象，这样各自就独立了。**

### 34、组件的 props 是什么？如何定义

- props 是组件向外提供的一个接口，用来接收外部数据，也是父组件传递给子组件的主要方式

- 如何定义

  ```js
  // 方式1： 数组语法
  props:['自定义属性名1','自定义属性名2',...]

  // 方式2： 对象语法
  props:{
  	自定义属性名1:{
    		type:类型 或  [类型1，类型2,...],    // 类型有  Object,Array,String,Boolean,Number,Date,Function ，
    		default:默认值，  // 基本数据类型
        default(){        // 如果props的值是引用数据类型，那么设置默认值的时候应该是一个函数，返回数组或对象
          return []/{}
        },
        required:true/false,
        validator:function(val){  // val就是该属性对应的值，用于内部做判断使用
           return true/false   // true表示验证通过，false表示验证不通过，控制台会有警告
        }
  	}
  }
  ```

### 35、如何自定义组件的 v-model

一个组件上的 `v-model` 默认会利用名为 `value` 的 prop 和名为 `input` 的事件，但是像单选框、复选框等类型的输入控件可能会将 `value` attribute 用于[不同的目的](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value)。`model` 选项可以用来避免这样的冲突：

```js
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: Boolean,
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `,
});
```

现在在这个组件上使用 `v-model` 的时候：

```js
<base-checkbox v-model="lovingVue"></base-checkbox>
```

这里的 `lovingVue` 的值将会传入这个名为 `checked` 的 prop。同时当 `<base-checkbox>` 触发一个 `change` 事件并附带一个新的值的时候，这个 `lovingVue` 的 property 将会被更新。

注意你仍然需要在组件的 `props` 选项里声明 `checked` 这个 prop。

### 36、`.native`修饰符有何用

- 当我们给组件绑定原生事件无效的时候，可以加上`.native`修饰符就可以让组件上面的原生事件有效。

### 37、`.sync`修饰符有何作用

`.sync`的用法如下：

```html
<组件 :属性名.sync="变量" />
```

其实他本质是一个语法糖：

```html
<组件 :属性名="变量" @update:属性名 = "变量=$event" />
```

其实是 v-model 的另外一种使用展示。

这也是为什么我们推荐以 `update:myPropName` 的模式触发事件取而代之。举个例子，在一个包含 `title` prop 的假设的组件中，我们可以用以下方法表达对其赋新值的意图：

```html
this.$emit('update:title', newTitle)
```

然后父组件可以监听那个事件并根据需要更新一个本地的数据 property。例如：

```html
<text-document v-bind:title="doc.title" v-on:update:title="doc.title = $event"></text-document>
```

为了方便起见，我们为这种模式提供一个缩写，即 `.sync` 修饰符：

```html
<text-document v-bind:title.sync="doc.title"></text-document>
```

**注意带有 `.sync` 修饰符的 `v-bind` **不能**和表达式一起使用**

### 38、插槽是什么？ 有哪些分类？

- 插槽是用来自定义组件内部模板内容的一种方式；
- 分类：
  - 默认插槽
  - 具名插槽
  - 作用域插槽

### 39、写一个具名插槽

方式 1：(老写法)

```html
<!--组件外部-->
<组件名>
  <template slot="名称">
  	自定义HTML内容
  </template>
</组件名>

<!--组件内部-->
<slot name="名称"></slot>
```

方式 2：

```html
<!--组件外部-->
<组件名>
  <template v-slot:名称>
  	自定义HTML内容
  </template>
</组件名>

<!--组件内部-->
<slot name="名称"></slot>
```

方式 3：其实是方式 2 的简写

```html
<!--组件外部-->
<组件名>
  <template #名称>
  	自定义HTML内容
  </template>
</组件名>

<!--组件内部-->
<slot name="名称"></slot>
```

### 40、作用域插槽如何写

方式 1：(老写法)

```html
<!--组件外部-->
<组件名>
  <template slot="名称" slot-scope="作用域名">
  	自定义HTML内容
  </template>
</组件名>
```

方式 2：

```html
<!--组件外部-->
<组件名>
  <template v-slot:名称="作用域名">
  	自定义HTML内容
  </template>
</组件名>
```

方式 3：其实是方式 2 的简写

```html
<!--组件外部-->
<组件名>
  <template #名称="作用域名">
  	自定义HTML内容
  </template>
</组件名>
```

### 41、如何实现动态组件

```html
<component :is="变量"></component>
<!--变量的值就是组件名，这里就会展示什么组件-->
```

### 42、如何实现缓存组件

```html
<keep-alive>
	<组件名></组件名>
</keep-alive>
```

### 43、缓存组件要注意什么？

- 缓存组件抱起来的组件将会被缓存，下一次打开的时候不会被再次创建（所以前四个生命周期不会再次被创建），所以我们不能把组件一打开就要做的放在 created 或 mounted 里面，因为组件不会再次创建。我们需要放在`activated`钩子里面。具体可参见文档：https://cn.vuejs.org/v2/api/#activated

### 44、如何定义一个递归组件

- 所谓的递归组件就是内部不断调用自己，在我们的树形结构中非常常见，如无限极分类；无限极菜单都常用；

- 递归组件最核心的就是组件一定要定义好 name 名次，否则无法起作用。

- 递归组件一定要有不成立的时候，否则无限递归，就会出错。

  <img src="/img/vue-interview/006.png" style="zoom:50%;" />
  - 数据如下

  ```js
  var data = [
    {
      id: '1',
      data: {
        menuName: '项目管理',
        menuCode: '',
      },
      childTreeNode: [
        {
          data: {
            menuName: '项目',
            menuCode: 'BusProject',
          },
          childTreeNode: [],
        },
        {
          data: {
            menuName: '我的任务',
            menuCode: 'BusProject',
          },
          childTreeNode: [],
        },
        {
          data: {
            menuName: '人员周报',
            menuCode: 'BusProject',
          },
          childTreeNode: [],
        },
      ],
    },
    {
      id: '2',
      data: {
        menuName: '数据统计',
        menuCode: 'BusClock',
      },
      childTreeNode: [],
    },
    {
      id: '3',
      data: {
        menuName: '人事管理',
        menuCode: '',
      },
      childTreeNode: [],
    },
    {
      id: '4',
      data: {
        menuName: '基础管理',
        menuCode: '',
      },
      childTreeNode: [],
    },
  ];
  ```

  - 递归组件

    ```html
    父组件中引入items  
    <items :model="model" v-for="model in data"></items>
    <template>
      <li>
        <div @click="toggle">
          <i v-if="isFolder" class="fa " :class="[open ? 'fa-folder-open' : 'fa-folder']"></i>
          <!--isFolder判断是否存在子级改变图标-->
          <i v-if="!isFolder" class="fa fa-file-text"></i>
          {{ model.data.menuName }}
        </div>
        <ul v-show="open" v-if="isFolder">
          <items v-for="cel in model.childTreeNode" :model="cel"></items>
        </ul>
      </li>
    </template>
    <script type="text/javascript">
      export default {
        name: 'items',
        props: ['model'],
        components: {},
        data() {
          return {
            open: false,
            isFolder: true,
          };
        },
        computed: {
          isFolder: function () {
            return this.model.childTreeNode && this.model.childTreeNode.length;
          },
        },
        methods: {
          toggle: function () {
            if (this.isFolder) {
              this.open = !this.open;
            }
          },
        },
      };
    </script>
    ```

### 45、vue 如何强制刷新组件

**1.使用 `this.$forceUpdate` 强制重新渲染**

如果要在组件内部中进行强制刷新，则可以调用**`this.$forceUpdate()`**强制重新渲染组件，从而达到更新目的。

```xml
<template>
<button @click="reload()">刷新当前组件</button>
</template>
<script>
export default {
    name: 'comp',
    methods: {
        reload() {
            this.$forceUpdate()
        }
    }
}
</script>
```

**2.使用 v-if 指令**

如果是刷新某个子组件，则可以通过 v-if 指令实现。我们知道，当 v-if 的值发生变化时，组件都会被重新渲染一遍。因此，利用 v-if 指令的特性，可以达到强制刷新组件的目的。

```html
<template>
  <comp v-if="update"></comp>
  <button @click="reload()">刷新comp组件</button>
</template>
<script>
  import comp from '@/views/comp.vue';
  export default {
    name: 'parentComp',
    data() {
      return {
        update: true,
      };
    },
    methods: {
      reload() {
        // 移除组件
        this.update = false;
        // 在组件移除后，重新渲染组件
        // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
        this.$nextTick(() => {
          this.update = true;
        });
      },
    },
  };
</script>
```

### 46、什么时候使用 vue 动画

- 条件渲染 (使用 `v-if`)
- 条件展示 (使用 `v-show`)
- 动态组件
- 组件根节点

### 47、vue 动画有哪些类名

1. `v-enter`：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。
2. `v-enter-active`：定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。
3. `v-enter-to`：**2.1.8 版及以上**定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 `v-enter` 被移除)，在过渡/动画完成之后移除。
4. `v-leave`：定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。
5. `v-leave-active`：定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。
6. `v-leave-to`：**2.1.8 版及以上**定义离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 `v-leave` 被删除)，在过渡/动画完成之后移除。

![](https://cn.vuejs.org/images/transition.png)

### 48、有哪些自定义过渡类名

- `enter-class`
- `enter-active-class`
- `enter-to-class` (2.1.8+)
- `leave-class`
- `leave-active-class`
- `leave-to-class` (2.1.8+)

### 49、vue 中 mixins 配置选项是什么？有何作用

- mixins 是混入，用于实现复用组件所需要的配置选项，可以实现很多功能的复用。

- 文档地址：https://cn.vuejs.org/v2/guide/mixins.html

- 使用：

  ```js
  // 定义一个混入对象
  var myMixin = {
    created: function () {
      this.hello()
    },
    methods: {
      hello: function () {
        console.log('hello from mixin!')
      }
    }
  }

  // 定义一个使用混入对象的组件
  var Component = Vue.extend({
    mixins: [myMixin]
  })

  var
  ```

### 50、如何实现一个自定义指令

```js
// 全局注册指令
Vue.directive('指令名', {
  配置选项,
});

// 局部注册
{
  directives: {
    指令名: {
      配置选项;
    }
  }
}
```

### 51、自定义指令有何作用？ 有哪些钩子

- 作用：当我们希望对原生的 DOM 节点，或者组件 都做 某一类型的操作的时候（如：页面已进入输入框就获取焦点；如输入框一旦加上某个指令就可以实现自动验证），我们就可以用自定义指令来开发我们想要的功能。

- 钩子：

  ```js

  bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
  inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
  update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前
  我们会在稍后讨论渲染函数时介绍更多 VNodes 的细节。
  componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
  unbind：只调用一次，指令与元素解绑时调用。
  ```

  指令钩子函数会被传入以下参数：

  - `el`：指令所绑定的元素，可以用来直接操作 DOM。

  - ```
    binding
    ```

    ：一个对象，包含以下 property：

    - `name`：指令名，不包括 `v-` 前缀。
    - `value`：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。
    - `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。
    - `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。
    - `arg`：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`。
    - `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。

  - `vnode`：Vue 编译生成的虚拟节点。移步 [VNode API](https://cn.vuejs.org/v2/api/#VNode-接口) 来了解更多详情。

  - `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。

### 52、过滤器是什么？如何定义？如何使用？

- 是什么： 是对模板里面的数据进行某一类的操作，可以理解为模板的工具函数（如：直接在模板里面使用定义好的过滤器实现时间戳变格式化的时间；价格保留小数位等等处理）

- 如何定义：

  ```js
  // 全局注册
  Vue.filter('过滤器名',(val,形参)=>{   // val表示传入的值， 第二个参数开始才是传入的实参 这个函数一定要有返回值
  	// 处理
  	return 结果
  })


  // 局部注册
  {
    filters:{
      过滤器名(val,形参){
        return 结果
      },
      过滤器名2(val,形参){
        return 结果
      },
      ...
    }
  }
  ```

- 如何使用：

  ```js
  {{ 变量 | 过滤器 }}   // 单个使用
  {{ 变量 | 过滤器1 | 过滤器2 | ... }}   // 串联使用，下一个过滤器函数接收的是上一个过滤器处理的结果
  {{ 变量 | 过滤器(实参) }}   // 过滤器传参
  ```

### 53、Vue.use 是什么? 如何使用？

- 是什么： vue.use 是 vue 的插件安装函数。调用 use 我们可以安装很多第三方的插件，如 vue-router,vuex, element-ui,vant 等等，当然最重要的是可以安装我们自己开发的插件。

- 开发插件

  Vue.js 的插件应该暴露一个 `install` 方法。这个方法的第一个参数是 `Vue` 构造器，第二个参数是一个可选的选项对象：

  ```js
  MyPlugin.install = function (Vue, options) {
    // 1. 添加全局方法或 property
    Vue.myGlobalMethod = function () {
      // 逻辑...
    }

    // 2. 添加全局资源
    Vue.directive('my-directive', {
      bind (el, binding, vnode, oldVnode) {
        // 逻辑...
      }
      ...
    })

    // 3. 注入组件选项
    Vue.mixin({
      created: function () {
        // 逻辑...
      }
      ...
    })

    // 4. 添加实例方法
    Vue.prototype.$myMethod = function (methodOptions) {
      // 逻辑...
    }
  }
  ```

- 使用插件

  ```js
  Vue.use(MyPlugin, { someOption: true });
  ```

### 54、vue-loader 是什么？使用它的用途有哪些？

解析.vue 文件的一个加载器，跟 template/js/style 转换成 js 模块。

用途：js 可以写 es6、style 样式可以 scss 或 less、template 可以加 jade 等

### 55、聊聊你对 Vue.js 的 template 编译的理解？

**简而言之，就是先转化成 AST 树，再得到的 render 函数返回 VNode（Vue 的虚拟 DOM 节点）**

详情步骤：

首先，通过 compile 编译器把 template 编译成 AST 语法树（abstract syntax tree 即 源代码的抽象语法结构的树状表现形式），compile 是 createCompiler 的返回值，createCompiler 是用以创建编译器的。另外 compile 还负责合并 option。

然后，AST 会经过 generate（将 AST 语法树转化成 render funtion 字符串的过程）得到 render 函数，render 的返回值是 VNode，VNode 是 Vue 的虚拟 DOM 节点，里面有（标签名、子节点、文本等等）

### 56、什么是 vue 生命周期？

Vue 实例从创建到销毁的过程，就是生命周期。也就是从开始创建、初始化数据、编译模板、挂载 Dom→ 渲染、更新 → 渲染、卸载等一系列过程，我们称这是 Vue 的生命周期。

### 57、vue 生命周期的作用是什么？

它的生命周期中有多个事件钩子，让我们在控制整个 Vue 实例的过程时更容易形成好的逻辑。

### 58、vue 生命周期总共有几个阶段？

它可以总共分为 8 个阶段：创建前/后, 载入前/后,更新前/后,销毁前/销毁后

### 59、第一次页面加载会触发哪几个钩子？

第一次页面加载时会触发 beforeCreate, created, beforeMount, mounted 这几个钩子

### 60、DOM 渲染在 哪个周期中就已经完成？

DOM 渲染在 mounted 中就已经完成了

### 61、简单描述每个周期具体适合哪些场景？

beforecreate : 可以在这加个 loading 事件，出现加载框效果

在加载实例时触发 created : 初始化完成时的事件写在这里，如在这结束 loading 事件，异步请求也适宜在这里调用

mounted : 挂载元素，获取到 DOM 节点

updated : 如果对数据统一处理，在这里写上相应函数

beforeDestroy : 可以做一个确认停止事件的确认框

nextTick : 更新数据后立即操作 dom

### 62、vue 组件如何通信

- 方式 1：父子通信
  - 父传子 ：自定义属性 props
  - 子传父 ：自定义事件 `$emit`
- 方式 2：父子关系
  - $parent,$root 等方式找到父组件或根节点去对应调用它的方法或者设置他的属性
  - $children,$refs 找到某个子组件直接调用他的方法或者设置他的属性
- 方式 3： 祖先后代
  - 祖先组件定义 provide
  - 所有的后代组件定义 inject 就可接收传递过来的数据
- 方式 4： 任意两个组件（兄弟组件）
  - 通过事件主线： vue 本身就有 $on 和 $emit 方法。
  - A 组件中使用$on监听事件，B组件中通过$emit 触发事件
- 方式 5： vuex
- 方式 6： 本地存储

### 63、说出$mount、$watch、$delete、$refs、$slots、$forceUpdate、$nextTick、$destroy 这些 API 方法或属性的的作用

- `$mount` ：用于挂载 vue 实例到某个节点上面，功能类似 el 选项， 有了它可以不配置 el;
- `$watch`：用于监听数据的变化，功能类似内部配置选项 watch 一样的效果。
- `$delete`：用于删除 data 里面数据里面的对象的属性，可以实现响应式效果。 功能和`$set` 一致，只不过他是删除属性
- `$refs`：用于获取原生 DOM 节点，或者某个组件对象
- `$slot`： 用于获取当前组件传入的所有插槽内容
- `$forceUpdate`： 用于刷新当前组件或 vue 实例，它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。
- `$nextTick`：将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。【简单理解即使等到 DOM 渲染完成再做应该的逻辑操作】
- `$destroy()`：只是完全销毁一个实例。清理它与其它实例的连接，**解绑它的全部指令及事件监听器。**

### 64、**is 的用法（用于动态组件且基于 DOM 内模板的限制来工作。）**

**is 用来动态切换组件，DOM 模板解析**

```js
<table>
  {' '}
  <tr is="my-row"></tr>{' '}
</table>
```

### 65、vue 的两个核心是什么

**数据驱动、组件系统。**

> 数据驱动:Object.defineProperty 和存储器属性: getter 和 setter（所以只兼容 IE9 及以上版本），可称为基于依赖收集的观测机制,核心是 VM，即 ViewModel，保证数据和视图的一致性。
> 组件系统:[点此查看](https://link.zhihu.com/?target=https%3A//blog.csdn.net/tangxiujiang/article/details/79620542%23commentBox)

### 66、vue 的 render 函数式什么？如何使用

Vue 推荐在绝大多数情况下使用模板来创建你的 HTML。然而在一些场景中，你真的需要 JavaScript 的完全编程的能力。这时你可以用**渲染函数**，它比模板更接近编译器。 **无论 el 也好，template 最终都是通过 render 函数渲染，而且如果同时存在三者，render 函数权重最大！**

```js
render: function (createElement) {
  return createElement('标签名',{ 属性描述 },子元素)
}

// createElement  表示创建虚拟元素
// createElement('标签名',{ 属性描述 },子元素)


属性描述包括：
// 与 `v-bind:class` 的 API 相同，
  // 接受一个字符串、对象或字符串和对象组成的数组
  'class': {
    foo: true,
    bar: false
  },
  // 与 `v-bind:style` 的 API 相同，
  // 接受一个字符串、对象，或对象组成的数组
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 普通的 HTML attribute
  attrs: {
    id: 'foo'
  },
  // 组件 prop
  props: {
    myProp: 'bar'
  },
  // DOM property
  domProps: {
    innerHTML: 'baz'
  },
  // 事件监听器在 `on` 内，
  // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
  // 需要在处理函数中手动检查 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅用于组件，用于监听原生事件，而不是组件内部使用
  // `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
}
```

**案例**

```js
Vue.component('box',{
  template:`
			<div class="width:200px;height:200px;background-color:red">
					<h2 class='title' id='tit'>我是标题</h2>
					<p>
						<button @click='del'>减少</button>
						<span>{{msg}}</span>
						<button @click='add(2)'>增加</button>
					</p>
			</div>
	`
  data(){
  	return {
      msg:1
    }
	},
  methods:{
    add(val){
      this.msg+=val
    },
    del(){
      this.msg--
    }
  }
})
```

**通过 render 实现**

```js
Vue.component('box', {
  data() {
    return {
      msg: 1,
    };
  },
  methods: {
    add(val) {
      this.msg += val;
    },
    del() {
      this.msg--;
    },
  },
  render(h) {
    // 创建div，且返回
    return h(
      'div',
      {
        style: {
          width: '200px',
          height: '200px',
          backgroundColor: 'red',
        },
      },
      [
        // 创建h2
        h(
          'h2',
          {
            class: 'title',
            attrs: {
              id: 'tit',
            },
          },
          '我是标题'
        ),
        // 创建p
        h('p', {}, [
          // 创建button
          h(
            'button',
            {
              on: {
                click: this.del,
              },
            },
            '减少'
          ),
          // 创建span
          h('span', {}, this.msg),
          // 创建button
          h(
            'button',
            {
              on: {
                click: () => {
                  this.add(2);
                },
              },
            },
            '增加'
          ),
        ]),
      ]
    );
  },
});
```

**参考：https://www.jianshu.com/p/7508d2a114d3**

### 67、使用 key 要什么要注意的吗？

- 不要使用对象或数组之类的非基本类型值作为 key，请用字符串或数值类型的值；

- 不要使用数组的 index 作为 key 值，因为在删除数组某一项，index 也会随之变化，导致 key 变化，渲染会出错。

例：在渲染`[a,b,c]`用 index 作为 key，那么在删除第二项的时候，index 就会从 0 1 2 变成 0 1（而不是 0 2)，随之第三项的 key 变成 1 了，就会误把第三项删除了。

### 68、组件的 name 选项有什么作用？

- 递归组件时，组件调用自身使用；
- 用`is`特殊特性和`component`内置组件标签时使用；
- `keep-alive`内置组件标签中`include `和`exclude`属性中使用。

### 69、什么是递归组件？举个例子说明下？

递归引用可以理解为组件调用自身，在开发多级菜单组件时就会用到，调用前要先设置组件的 name 选项， **注意一定要配合 v-if 使用，避免形成死循环**，用 element-vue 组件库中 NavMenu 导航菜单组件开发多级菜单为例：

```html
<template>
  <el-submenu :index="menu.id" popper-class="layout-sider-submenu" :key="menu.id">
    <template slot="title">
      <Icon :type="menu.icon" v-if="menu.icon" />
      <span>{{ menu.title }}</span>
    </template>
    <template v-for="(child, i) in menu.menus">
      <side-menu-item v-if="Array.isArray(child.menus) && child.menus.length" :menu="child"></side-menu-item>
      <el-menu-item :index="child.id" :key="child.id" v-else>
        <Icon :type="child.icon" v-if="child.icon" />
        <span>{{ child.title }}</span>
      </el-menu-item>
    </template>
  </el-submenu>
</template>
<script>
  export default {
    name: 'sideMenuItem',
    props: {
      menu: {
        type: Object,
        default() {
          return {};
        },
      },
    },
  };
</script>
```

### 70、说下`$attrs`和`$listeners`的使用场景？

`$attrs`: 包含了父作用域中（组件标签）不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。 在创建基础组件时候经常使用，可以和组件选项`inheritAttrs:false`和配合使用在组件内部标签上用`v-bind="$attrs"`将非 prop 特性绑定上去；

`$listeners`: 包含了父作用域中（组件标签）的 (不含`.native`) v-on 事件监听器。 在组件上监听一些特定的事件，比如 focus 事件时，如果组件的根元素不是表单元素的，则监听不到，那么可以用`v-on="$listeners"`绑定到表单元素标签上解决。

### 71、EventBus 注册在全局上时，路由切换时会重复触发事件，如何解决呢？

在有使用`$on`的组件中要在`beforeDestroy`钩子函数中用`$off`销毁。

### 72、Vue 怎么改变插入模板的分隔符？

用`delimiters`选项,其默认是`["{{", "}}"]`

```
// 将分隔符变成ES6模板字符串的风格
new Vue({
  delimiters: ['${', '}']
})
```

### 73、Vue 变量名如果以`_`、`$`开头的属性会发生什么问题？怎么访问到它们的值？

以 `_ `或 `$` 开头的属性 不会 被 Vue 实例代理，因为它们可能和 Vue 内置的属性、API 方法冲突，你可以使用例如 `vm.$data._property` 的方式访问这些属性。

### 74、怎么捕获 Vue 组件的错误信息？

- `errorCaptured`是组件内部钩子，当捕获一个来自子孙组件的错误时被调用，接收`error`、`vm`、`info`三个参数，`return false`后可以阻止错误继续向上抛出。

- `errorHandler`为全局钩子，使用`Vue.config.errorHandler`配置，接收参数与`errorCaptured`一致，2.6 后可捕捉`v-on`与`promise`链的错误，可用于统一错误处理与错误兜底。

### 75、Vue 项目中如何配置 favicon？

- 静态配置 `<link rel="icon" href="<%= BASE_URL %>favicon.ico">`,

其中`<%= BASE_URL %>`等同 vue.config.js 中`publicPath`的配置;

- 动态配置

  ```
  <link rel="icon" type="image/png" href="">
  ```

  ```javascript
  import browserImg from 'images/kong.png'; //为favicon的默认图片
  const imgurl = '后端传回来的favicon.ico的线上地址';
  let link = document.querySelector('link[type="image/png"]');
  if (imgurl) {
    link.setAttribute('href', imgurl);
  } else {
    link.setAttribute('href', browserImg);
  }
  ```

### 77、Vue 为什么要求组件模板只能有一个根元素？

当前的 virtualDOM 差异和 diff 算法在很大程度上依赖于每个子组件总是只有一个根元素。

### 76、说说你对单向数据流和双向数据流的理解

单向数据流是指数据只能从父级向子级传递数据，子级不能改变父级向子级传递的数据。

双向数据流是指数据从父级向子级传递数据，子级可以通过一些手段改变父级向子级传递的数据。

比如用`v-model`、`.sync`来实现双向数据流。

## 二、vue-router

### 1、vue-route 如何使用？

```js
// 【1、安装 】
npm i vue-router
// 【2、配置】
// src/router/index.js 创建配置文件
import Vue from 'vuex'
import Router  from "vue-router"
// 安装
Vue.use(Router)
// 定义路由映射
const routes = [
  {
    path:"/地址",component:()=>import('组件位置路径')
  }
]
// 创建路由实例
const router = new Router({
  routes,
})
// 暴露
export default router

// 【3、注入vue实例】
// main.js中操作
...
import router from './router'
...
new Vue({
  ...,
  router,  // 一旦注入，所有组件中都有$router和$route; $router表示路由对象实例； $route表示当前页面路由信息
  ...
})

// 【4、定义路由出口】
// App.vue中操作
<router-view></router-view>

// 【5、使用router-link跳转】
<router-link to="/地址"></router-link>
```

### 2、何为命名路由？

- 其实就是给路由取一个名字,增加一个 name 属性。

  ```js
  // 映射关系
  const routes = [{ name: '名称', path: '/地址', component: 组件 }];
  ```

  定义了命名路由，那么就可以通过路由名称实现跳转

  ```html
  // 原来写法
  <router-link to="/地址"></router-link>
  // 新写法
  <router-link :to="{name:'名称'}"></router-link>

  // 编程式导航 router.push('/地址') router.push({name:'名称'})
  ```

### 3、如何定义动态路由，获取动态参数

```js
// 映射关系
const routes = [{ name: '名称', path: '/地址/:标识符', component: 组件 }];
```

```html
<router-link to="/地址/数据"></router-link>
<router-link :to="{ name: '名称', params: { 标识符: 数据 } }"></router-link>

// 编程式导航 router.push('/地址/数据') router.push({name:'名称',params:{标识符:数据}})
```

**获取动态参数**

**`this.$route.params.`标识符 得到 数据**

---

**但是这里我们有更加高级的用法，使用 props 将组件解耦**

```js
// 映射关系
const routes = [
  { name: '名称', path: '/地址/:标识符', component: 组件, props: true },
  // // 开启props传参，说白了将路由参数传递到组件的props中
];
```

```js
// 组件中，下面是组件的配置选型 export default { ..., props:['标识符'] //
props定义和动态路由后面标识符一致的定义属性。 ... } // 组件中可以直接通过
this.标识符 直接获得路由参数数据。
```

**如案例：**

```js
// 路由配置
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      props: true,
    },
  ],
});
```

```js
// A页面
this.$router.push('/user/123')
或者
<router-link to='/user'>去user页面</router-link>
```

```js
// User页面
const User = {
  props: ['id'], // this.id 就是动态路由数据值为 123
  template: '<div>User {{ id }}</div>', // 这里就是会渲染123
};
```

### 4、有哪些编程式导航方法

- 编程式导航方法都存在 路由实例里面。 组件中可以使用`this.$router`访问，其他 JS 文件中可以通过导入路由实例调用
  - `this.$router.push('/地址')` 跳转到某个新地址，历史记录栈中增加一个
  - `this.$router.replace('/地址')` 跳转到某个地址，新地址替换当前地址在历史记录中的位置
  - `this.$router.go(数字)` 正数前进几步；负数后退几步；0 表示刷新
  - `this.$router.back()` 后退
  - `this.$router.forward()` 前进

### 5、何为命名视图？如何使用

- 所谓的命名视图的意思是默认情况下我们一个路由地址渲染一个组件到一个 router-view 里面去；而命名视图的目的是 **可以实现一个路由地址，渲染多个组件到不同的 router-view 里去进行展示**

- 使用：

  ```js
  // 映射关系
  const routes = [
  	{
  		name:'名称' ,
  		path:'/地址',
  		//component:组件    //只能渲染一个组件
          components:{
              default:组件X
              视图名A:组件A,
              视图名B:组件B
          }
  	}
  ]
  ```

  ```html
  <router-view></router-view>
  <!--默认视图，渲染组件X-->
  上面这句其实是：
  <router-view name="default"></router-view>

  <router-view name="视图名A"></router-view>
  <!--渲染组件A-->
  <router-view name="视图名B"></router-view>
  <!--渲染组件B-->
  ```

### 6、何为嵌套路由？ 如何使用？何时使用？

- 定义：所谓的嵌套路由，指的的是在一个路由组件里面还有会有 router-view 展示下一级的路由组件信息。

- 何时使用：我们开发一些特定功能模块的时候，包含有子模块页面，就可以采用嵌套路由。 如：用户中心是一个大模块页面，用户订单、用户资料、收货地址等等都会有侧边栏信息，诸如此类有共同模块布局，且内容不同的，则可以使用嵌套路由。

  <img src="/img/vue-interview/008.png" style="zoom:100%;" />

- 如何使用：

  ```js
  // 映射关系
  const routes = [
  	{
  		name:'名称' ,
  		path:'/地址',
  		component:组件
   		children:[   // 子级路由会渲染上级路由的组件里面的router-view里面进行展示
   			{ name:'名称1', path:"/地址/子地址1",  component: ()=>import(组件地址) },
   			{ name:'名称2', path:"/地址/子地址2",  component: ()=>import(组件地址) },
              // 子级的地址也可以不加  /地址，  这样会自动拼接 上一级的前缀。 注意不能加 /
   			{ name:'名称3', path:"子地址3",  component: ()=>import(组件地址) }
  			// 上述  path就单独写一个  子地址3  就表示   /地址/子地址3
   		]
  	}
  ]
  ```

### 7、怎么通过路由实现面包屑

- 认识面包屑

  ![](/img/vue-interview/009.png)

- 前后端分离实现面包屑有 2 中方式：

  - 方式 1： 每个页面直接写死
  - 方式 2： 通过`$route.matched` 属性 去遍历 生成。

- 方式 2 实现思路：

  - 要有面包屑一般肯定要是一个嵌套路由，否则一般就只能展示 2 级。
  - 每个路由都要有 meta 元信息， 然后里面设置一个 tilte，设置为标题。
  - 我们的`$route` 表示当前页面路由信息，如果是一个嵌套路由，那么`$route.matched` 属性是一个数组，里面的内容就是一个上上级到下一级的路由信息，我们可以通过遍历数组，取出每个里面的 path 地址和 meta 里面的 title 来进行设置即可。

### 8、页面之间如何传参

- 本地存储，一个页面设置，一个页面读取
- 动态路由
  - /地址/数据 【A 页面】
  - `this.$route.params.`标识符 获取数据 【B 页面】
- query 传参
  - /地址?属性名=值 【A 页面】
  - `this.$route.query.`属性名 【B 页面】
- hash 传参
  - /地址#属性名=值 【A 页面】
  - `this.$route.hash` 然后再处理得到信息 【B 页面】
- vue 存储和读取

### 9、vue-router 有哪几种导航钩子？

三种

第一种是全局导航钩子：

- `router.beforeEach( (to,from,next)=>{ ... } )`
- `router.afterEach((to, from) => { ... })`

第二种：组件内的钩子

- `beforeRouteEnter(to, from, next) { ... }`
- `beforeRouteUpdate (to, from, next) {...}`
- `beforeRouteLeave (to, from, next) {...}`

第三种：单独路由独享组件

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // 配置在路由映射里面
        // ...
      },
    },
  ],
});
```

### 10、$route和$router 的区别

- `$route` 是“**路由信息**对象”
  - path 路径地址
  - params 动态路由数据
  - hash hash 数据
  - query search 数据
  - fullPath 完整地址
  - matched 路由匹配 （可用于制作面包屑）
  - name 路由名称
- `$router` 是“**路由实例**”对象包括了路由的跳转方法，钩子函数等
  - push/replace/go/back/forward
  - beforeEach/afterEach/...
  - addRoutes 方法，增加映射

### 11、路由元信息是什么？有何作用？

- 设置每个路由映对象的时候，可以增加一个 meta 属性，里面可以自定义相关数据

  ```js
  // 路由映射
  {
  	path:'/地址',
  	component: ()=>import(组件地址),
  	meta:{
  	 	属性名:"属性值",
  	 	....
  	}
  }
  ```

  组件中读取： **`this.$route.meta.属性名`**

- 作用：

  - 可以通过这个设置标题，在拦截器里面进行设置；
  - meta 里面放入权限验证字段，判断是否有权限访问页面
  - ...

### 12、如何实现页面的过渡效果

```html
<transition>
  <router-view></router-view>
</transition>
```

### 13、如何实现路由重定向

```js
// 路由映射
{
	path:'/地址A',
	component: ()=>import(组件地址),
	redirect:'/地址B'    // 访问地址A的时候将会跳转到地址B
}
```

### 14、路由懒加载是什么？ 如何实现？为什么要懒加载？

- 为什么： 当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然**后当路由被访问的时候才加载对应组件，这样就更加高效了。**

- 是什么：**路由被访问的时候才加载对应组件**

- 如何实现：

  ```js
  // 路由映射
  {
  	path:'/地址A',
  	component: ()=>import(组件地址)   // 懒加载
  }
  ```

### 15、导航钩子有何作用？

- 导航钩子类似中间件的味道，对导航的发生过程进行拦截，满足条件才可以继续向下走，否则路由就会被挂起来。 所以我们很多时候需要注意是否需要在导航守卫里面调用 next
- 全局前置守卫：（`router.beforeEach((to, from, next) => { ... }`）
  - 权限判断、标题设置、进度条开始 等，需要所有路由都做的事情
- 全局守后置守卫：（`router.afterEach((to, from) => {...}`）
  - 进度条结束等
- 路由独享守卫：（ `beforeEnter: (to, from, next) => { ... }`）
  - 权限判断、针对某一个路由要做的事情都放在这里。
- 局部前置守卫: （`beforeRouteEnter (to, from, next) { ... }`）
  - 进入页面之前要做的事情，注意这里不能使用 this，因为组件还没有初始化
- 局部更新守卫： （`beforeRouteUpdate (to, from, next) { ... }`）
  - 同路由跳转同路由的更新监测，**如详情页跳转到详情页，可以放在这里监听**
- 局部后置守卫： （`beforeRouteLeave (to, from, next) { ... }`）
  - 某个页面要消失的时候做的事情，如判断是否要离开，是否保存了数据等。

### 16、如何实现激活导航

- 默认如果`router-link`组件的地址和当前路由地址一致，会加上`router-link-active`的 class 名（这是模糊匹配）或者 `router-link-exact-active`的 class 名（这是严格匹配）

- 修改激活 class 名：

  ```js
  // 路由中配置
  new VueRouter({
  	linkActiveClass:'class名',      // 非严格模式下的激活class名
  	linkExactActiveClass:'class名', // 严格模式的激活的时候class名
  	routes:[...]   // 映射
  })
  ```

### 17、有哪些路由模式？ 实现的具体原理是什么？

- 路由模式 2 中：
  - history 模式 原理： html5 的 history 里面的 api， 如 pushState,replaceState
  - hash 模式 原理： 监听 window 的 hashchange 事件，展示不同组件

### 18、history 模式路由要注意什么？

- 如果不想要很丑的 hash，我们可以用路由的 **history 模式**，这种模式充分利用 `history.pushState` API 来完成 URL 跳转而无须重新加载页面。

- 注意点：不过这种模式要玩好，还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 `http://oursite.com/user/id` 就会返回 404，这就不好看了。

  所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 `index.html` 页面，这个页面就是你 app 依赖的页面

- **简而言之： history 模式需要后台配置，否则会和真正的服务器端路由地址冲突。**

### 19、addRoutes 方法是什么？有何作用？

- 是什么：动态添加更多的路由规则。参数必须是一个符合 `routes` 选项要求的数组。

- 作用： 可以实现根据需求动态加载路由配置映射关系数据信息，我们一般在**管理系统中，通过这个方法来实现 按需加载路由映射，从而实现不同的角色看到不同的菜单。**

### 20、base 配置项的作用

- 配置路由地址的基准前缀地址，增加这个选项之后所有的路由地址会全部自动增加上这个前缀，但是我们写`router-link` 的时候不需要加这个前缀。

- 使用：

  ```js
  // 路由中配置
  new VueRouter({
  	base:"/前缀地址"
  	routes:[...]   // 映射
  })
  ```

### 21、如何处理滚动行为

- **history 模式下**

  ```js
  new VueRouter({
  	...,
       // savedPosition 这个参数当且仅当导航 (通过浏览器的 前进/后退 按钮触发) 时才可用  效果和 router.go() 或 router.back()
  	scrollBehavior (to, from, savedPosition) {
        // 返回savedPosition 其实就是 当用户点击 返回的话，保持之前游览的高度
        if (savedPosition) {
          return savedPosition
        } else {
          return { x: 0, y: 0 }
        }
      },
      ...
  })
  ```

  > 注意：scrollBehavior 属性仅在 history 模式下才可以使用。

- **hash 模式下**

  ```js
  router.beforeEach((to, from, next) => {
    // 直接使用window的scroll方法滚动回顶部
    window.scrollTo(0, 0);
    next();
  });
  ```

### 22、路由里面有哪些常用组件

- `router-link`

- `router-view`

### 23、路由里面详情页跳转详情页，组件不重新创建如何处理？

- 我们的`vue-router`同路由跳转到同路由，组件是不会更新的。 如：文章详情路由`/article/11` 页面里面有个链接跳转到`/article/22` 这篇文章，其实就是同路由组件跳转。这个时候文章详情组件是不会再次被创建的，所以我们不能把获取数据请求的方法写在 `created`或者 `mounted`里面或者在里面去调用，因为组件不会被再次创建，如果写在生命周期里面去调用，从而导致跳转到`/article/22`的时候无法请求数据，
- 如何解决：
  - 方式 1：使用 `beforeRouteUpdate`，因为`/article/11`跳转到`/article/22` 这个跳转属于同路由组件更新，`beforeRouteUpdate`会被触发
  - 方式 2： 使用`watch`去监听`$route`的变化，在监听的函数里面去发送请求。

### 24、如何实现页面加载进度条

**核心使用：`nprogress`插件**

- 第一步， 安装

```
npm install --save nprogress
```

- 第二步， main.js 中引入插件

```js
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
```

- 第三步，在 main.js 文件配置插件的功能

```js
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});
```

- 第四步，监听路由跳转，进入页面执行插件动画。

  路由跳转中

  ```js
  // router.js
  // 导航全局前置守卫
  router.beforeEach((to, from, next) => {
    // 每次切换页面时，调用进度条
    NProgress.start();

    // 这个一定要加，没有next()页面不会跳转的。这部分还不清楚的去翻一下官网就明白了
    next();
  });
  ```

  跳转结束了

  ```js
  // router.js
  router.afterEach(() => {
    // 在即将进入新的页面组件前，关闭掉进度条
    NProgress.done();
  });
  ```

### 25、如何实现刷新页面

- **实现思路有 3 种**
- 方式 1：
  - 通过给`router-view`添加`v-if`指令，控制组件重新渲染，从而实现刷新。
- 方式 2：
  - 采用`window.reload()`，或者`router.go(0)`刷新时，整个浏览器进行了重新加载，闪烁，体验不好
- 方式 3：
  - 为了实现刷新页面，可以先跳转到一个空页面，然后马上跳回来，从而实现这个功能

---

**方式 1 实现方式**

**provide / inject 组合**

作用：允许一个祖先组件向其所有子孙后代注入一个依赖，**不论组件层次有多深**，并在起上下游关系成立的时间里始终生效。

**<u>App.vue: 声明 reload 方法，控制 router-view 的显示或隐藏，从而控制页面的再次加载</u>**

<img src="/img/vue-interview/010.png"  />

**某个组件中：**在页面注入 App.vue 组件提供（provide）的 reload 依赖，在逻辑完成之后（删除或添加...）,直接 this.reload()调用，即可刷新当前页面。

![](/img/vue-interview/011.png)

**需要理解 provide/inject 的使用**，不熟悉看文档地址：https://cn.vuejs.org/v2/api/#provide-inject

---

**方式 3 的实现方法**

**一、原理**

![](/img/vue-interview/012.png)

如上图所示，我们需要为要刷新的页面 A 编写一个自动跳回的空页面，当用户操作了 A 页面后，A 页面先跳转到空页面，然后空页面马上跳回 A 页面，这时候 vue 会去重新加载 A 页面。这种方法可以变相实现自我刷新，缺点是当需要刷新的页面较多时，空页面也会随之变多。

**二、当前页面事件监听**

![](/img/vue-interview/013.png)

如上图所示，我们定义了 refreshPage 方法，这个方法是对特定事件的回调，在这个方法会处理业务逻辑，然后在最后使用 vue 的 router 跳转到一个空页面，这个空页面路由路径是/user/back，这个路径是随便取的，大家可以选择自己的路径

**三、空页面的编写**

![](/img/vue-interview/014.png)

如上图所示，在空页面中立即执行路由，跳回原来的页面，这时候原来的页面会进行重新加载，从而实现了刷新。这里的/user/index 就是跳回原来页面的路由路径，大家需要根据自己的项目情况写。

**四、注意事项**

本文所使用的方法，其实是一种 hack 方法，在极端情况下，比如网络极端恶劣，那么可能出现跳到空页面后跳不会来，或者干脆跳不到空页面的情况，大家需要根据自己的项目情况酌情选择。

### 26、如何使用路由实现标签页

![](/img/vue-interview/007.png)

```html
<template>
  <ul class="tag-list">
    <!-- 循环这个li -->
    <li :class="$route.fullPath === item.path ? 'on' : ''" v-for="(item, index) in list" :key="index">
      <router-link :to="item.path"> {{ item.name }} </router-link>
      <i @click="del(item, index)">X</i>
    </li>
    <li @click="delOther">关闭其他</li>
    <li @click="delAll">关闭所有</li>
  </ul>
</template>

<script>
  export default {
    name: 'TagsList',
    data() {
      // 从本地存储读取是否有！
      let list = localStorage.getItem('taglist');
      return {
        list: list ? JSON.parse(list) : [], // 菜单地址池
      };
    },
    watch: {
      // 监听$route的变化，从而实现增加标签页信息
      $route: {
        immediate: true, // 一开始就要做一次监听
        handler() {
          // 判断是否已经有
          const hasPath = this.list.some(val => val.path === this.$route.fullPath);
          // 如果没有就写入
          !hasPath &&
            this.list.push({
              name: this.$route.meta.title,
              path: this.$route.fullPath,
            });
          // 写入本地存储持久化
          localStorage.setItem('taglist', JSON.stringify(this.list));
        },
      },
    },
    methods: {
      // 删除单个标签页
      del(val, index) {
        //删除的元素，删除元素的下标
        // 删除的是否为激活元素
        if (val.path === this.$route.fullPath) {
          // 是激活
          // 跳转到index-1的那个路由地址去！ 左边激活
          this.list.splice(index, 1); // 删除对应元素！
          if (this.list.length) {
            // 还有值！
            if (index == 0) {
              // 删除第是第一个，说明右边还有，那么就向后走，但是其实还是index下标这个，因为数组已经发生变化了
              this.$router.push(this.list[index].path);
            } else {
              // 删除的不是第一个（说明左边还有），那么就展示左边的一个
              this.$router.push(this.list[index - 1].path);
            }
          } else {
            // 最一个元素，跳转到制定地址去
            this.$router.push('/welcome');
          }
        } else {
          // 不是激活
          this.list.splice(index, 1);
        }
        // 持久化存储
        localStorage.setItem('taglist', JSON.stringify(this.list));
      },
      // 删除其他标签页
      delOther() {
        // 直接赋值为当前页面元素
        this.list = [{ name: this.$route.meta.title, path: this.$route.fullPath }];
        // 持久化存储
        localStorage.setItem('taglist', JSON.stringify(this.list));
      },
      // 删除所有标签
      delAll() {
        this.list = [];
        // 持久化存储
        localStorage.setItem('taglist', JSON.stringify(this.list));
        // 跳转地址
        this.$router.push('/welcome');
      },
    },
  };
  /*
思路：
    1、有一个数组，用于存储打开过的标签信息
        // 数组格式： [{ name:'名称',path:'/地址' },...]
    2、增加：
        // 用watch监听$route的变化
            // 有变化，插入到数组中去（判断一下数组中是否已经存在）
	3、删除：
		删除所有： 直接赋值为空数组，然后跳转到默认地址
		删除其他： 直接赋值为一个元素，就是当前路由的信息
		删除单个：
			// 是否为激活
				// 不是激活项 直接删除
				// 是激活项：
					//  首先删除元素
					//  删除完之后数组是否还有长度：
						// 没有长度，说明删除的是最后一个元素且还是激活项，那么跳转到默认地址
						// 有长度，就判断删除的元素下标是否为0，也就是判断是否为首位
							// 如果是0，【删完后还有长度，且删除的那个是首位，说明右边还有内容】，所以展示右边的内容。而右边那个元素的下标就是index
							// 如果不是0 【删完后还有长度，且删除的不是首位，说明左边还有内容】，所以展示左边的内容，以此类推，直到左边没有了，就会去判断右边是否还有。
*/
</script>
<style scoped>
  .tag-list {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background-color: #eee;
    border-bottom: 1px solid #aaa;
    height: 50px;
  }
  .tag-list li {
    display: inline-block;
    list-style: none;
    padding-left: 10px;
    padding-right: 30px;
    line-height: 30px;
    border: 1px solid blue;
    color: blue;
    margin: 10px;
    position: relative;
  }
  .tag-list li a {
    text-decoration: none;
    color: inherit;
  }
  .tag-list li i {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 20px;
    height: 20px;
    display: inline-block;
    text-align: center;
    line-height: 20px;
    font-style: normal;
    border-radius: 50%;
    cursor: pointer;
  }
  .tag-list li i:hover {
    background-color: blue;
    color: #fff;
  }
  .tag-list li.on {
    background-color: blue;
    color: #fff;
  }
  .tag-list li.on i:hover {
    background-color: #fff;
    color: #000;
  }
</style>
```

### 27、说一下路由实现的原理

- hash 模式：**监听 window 的 hashchange 事件，从而实现更换展示不同的组件**
- history 模式： <u>从 HTML5 开始，**History interface** 提供了 2 个新的方法：**pushState()**、**replaceState()** 使得我们可以对浏览器历史记录栈进行修改</u>
- 参考文档地址：https://www.cnblogs.com/gaosirs/p/10606266.html
- vue-router 原理文档：https://blog.csdn.net/derivation/article/details/105085951

### 28、完整的 vue-router 导航解析流程

> 1.导航被触发； 2.在失活的组件里调用 beforeRouteLeave 守卫； 3.调用全局 beforeEach 守卫； 4.在复用组件里调用 beforeRouteUpdate 守卫； 5.调用路由配置里的 beforeEnter 守卫； 6.解析异步路由组件； 7.在被激活的组件里调用 beforeRouteEnter 守卫； 8.调用全局 beforeResolve 守卫； 9.导航被确认；
> 10..调用全局的 afterEach 钩子；
> 11.DOM 更新； 12.用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。

### 29、切换路由时，需要保存草稿的功能，怎么实现呢？

```html
<keep-alive :include="include">
  <router-view></router-view>
</keep-alive>
```

其中 include 可以是个数组，数组内容为路由的 name 选项的值。

### 30、说说你对 router-link 的了解

`<router-link>`是 Vue-Router 的内置组件，在具有路由功能的应用中作为声明式的导航使用。

`<router-link>`有 8 个 props，其作用是：

- to：必填，表示目标路由的链接。当被点击后，内部会立刻把`to`的值传到`router.push()`，所以这个值可以是一个字符串或者是描述目标位置的对象。

  ```html
  <router-link to="home">Home</router-link>
  <router-link :to="'home'">Home</router-link>
  <router-link :to="{ path: 'home' }">Home</router-link>
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
  <router-link :to="{ path: 'user', query: { userId: 123 }}">User</router-link>
  ```

  注意 path 存在时 params 不起作用，只能用 query

- `replace`：默认值为 false，若设置的话，当点击时，会调用`router.replace()`而不是`router.push()`，于是导航后不会留下 history 记录。

- `append`：设置 append 属性后，则在当前 (相对) 路径前添加基路径。

- `tag`：让`<router-link>`渲染成`tag`设置的标签，如`tag:'li`,渲染结果为`<li>foo</li>`。

- `active-class`：默认值为`router-link-active`,设置链接激活时使用的 CSS 类名。默认值可以通过路由的构造选项 linkActiveClass 来全局配置。

- `exact-active-class`：默认值为`router-link-exact-active`,设置链接被精确匹配的时候应该激活的 class。默认值可以通过路由构造函数选项 linkExactActiveClass 进行全局配置的。

- ```
  exact
  ```

  ：是否精确匹配，默认为 false。

  ```html
  <!-- 这个链接只会在地址为 / 的时候被激活 -->
  <router-link to="/" exact></router-link>
  ```

- `event`：声明可以用来触发导航的事件。可以是一个字符串或是一个包含字符串的数组，默认是`click`。

### 31、Vue 路由怎么跳转打开新窗口？

```js
const obj = {
  path: xxx, //路由地址
  query: {
    mid: data.id, //可以带参数
  },
};
const { href } = this.$router.resolve(obj);
window.open(href, '_blank');
```

## 三、vuex

### 1、vuex 和本地存储的区别

- vuex 刷新就丢失，本地存储一直在

- vuex 它可以实时更新，本地存储不能

### 2、什么是 Vuex？

Vuex 是一个专为 Vue.js 应用程序开发的状态管理插件。它采用集中式存储管理应用的所有组件的状态，而更改状态的唯一方法是提交 mutation，例`this.$store.commit('SET_VIDEO_PAUSE', video_pause)`，SET_VIDEO_PAUSE 为 mutations 属性中定义的方法。

### 3、Vuex 解决了什么问题？

- 多个组件依赖于同一状态时，对于多层嵌套的组件的传参将会非常繁琐，并且对于兄弟组件间的状态传递无能为力。

- 来自不同组件的行为需要变更同一状态。以往采用父子组件直接引用或者通过事件来变更和同步状态的多份拷贝。以上的这些模式非常脆弱，通常会导致无法维护的代码。

### 4、怎么引用 Vuex？

- 先安装依赖`nnpm install vuex --save`

- 在项目目录 src 中建立 store 文件夹

- 在 store 文件夹下新建 index.js 文件,写入

```js
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
//不是在生产环境debug为true
const debug = process.env.NODE_ENV !== 'production';
//创建Vuex实例对象
const store = new Vuex.Store({
  strict: debug, //在不是生产环境下都开启严格模式
  state: {},
  getters: {},
  mutations: {},
  actions: {},
});
export default store;
复制代码;
```

- 然后再 main.js 文件中引入 Vuex,这么写

```js
import Vue from 'vue';
import App from './App.vue';
import store from './store';
const vm = new Vue({
  store: store, // 一旦挂载，组件中this.$store就可以得到仓库实例
  render: h => h(App),
}).$mount('#app');
```

### 5、Vuex 的 5 个核心属性是什么？

分别是 state、getters、mutations、actions、modules 。

### 6、Vuex 中状态储存在哪里，怎么改变它？

存储在 state 中，改变 Vuex 中的状态的唯一途径就是显式地提交 (commit) mutation。

### 7、Vuex 中状态是对象时，使用时要注意什么？

因为对象是引用类型，复制后改变属性还是会影响原始数据，这样会改变 state 里面的状态，是不允许，所以先用深度克隆复制对象，再修改。

### 8、怎么在组件中批量使用 Vuex 的 state 状态？

使用 mapState 辅助函数, 利用对象展开运算符将 state 混入 computed 对象中

```js
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['price', 'number']),
  },
};
```

### 9、Vuex 中要从 state 派生一些状态出来，且多个组件使用它，该怎么做，？

使用 getter 属性，相当 Vue 中的计算属性 computed，只有原状态改变派生状态才会改变。

getter 接收两个参数，第一个是 state，第二个是 getters(可以用来访问其他 getter)。

```js
const store = new Vuex.Store({
  state: {
    price: 10,
    number: 10,
    discount: 0.7,
  },
  getters: {
    total: state => {
      return state.price * state.number;
    },
    discountTotal: (state, getters) => {
      return state.discount * getters.total;
    },
  },
});
```

然后在组件中可以用计算属性 computed 通过`this.$store.getters.total`这样来访问这些派生转态。

```js
computed: {
    total() {
        return this.$store.getters.total
    },
    discountTotal() {
        return this.$store.getters.discountTotal
    }
    // 或者直接计算属性，上述代码可以简写为
	...mapGetters(['total','discountTotal'])
}

```

### 10、怎么通过 getter 来实现在组件内可以通过特定条件来获取 state 的状态？

通过让 getter 返回一个函数，来实现给 getter 传参。然后通过参数来进行判断从而获取 state 中满足要求的状态

```js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false },
    ],
  },
  getters: {
    getTodoById: state => id => {
      return state.todos.find(todo => todo.id === id);
    },
  },
});
```

然后在组件中可以用计算属性 computed 通过`this.$store.getters.getTodoById(2)`这样来访问这些派生转态。

```js
computed: {
    getTodoById() {
        return this.$store.getters.getTodoById
    },
}
mounted(){
    console.log(this.getTodoById(2).done)//false
}
```

### 11、怎么在组件中批量使用 Vuex 的 getter 属性

使用 mapGetters 辅助函数, 利用对象展开运算符将 getter 混入 computed 对象中

```js
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters(['total', 'discountTotal']),
  },
};
```

### 12、怎么在组件中批量给 Vuex 的 getter 属性取别名并使用

使用 mapGetters 辅助函数, 利用对象展开运算符将 getter 混入 computed 对象中

```js
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      myTotal: 'total',
      myDiscountTotal: 'discountTotal',
    }),
  },
};
```

### 13、在 Vuex 的 state 中有个状态 number 表示货物数量，在组件怎么改变它。

首先要在 mutations 中注册一个 mutation

```js
const store = new Vuex.Store({
  state: {
    number: 10,
  },
  mutations: {
    SET_NUMBER(state, data) {
      state.number = data;
    },
  },
});
```

在组件中使用`this.$store.commit`提交 mutation，改变 number

```js
this.$store.commit('SET_NUMBER', 10);
```

### 14、在 Vuex 中使用 mutation 要注意什么。

mutation 必须是同步函数

### 15、在组件中多次提交同一个 mutation，怎么写使用更方便。

使用 mapMutations 辅助函数,在组件中这么使用

```js
import { mapMutations } from 'vuex'
methods:{
    ...mapMutations({
        setNumber:'SET_NUMBER',
    })
}
```

然后调用`this.setNumber(10)`相当调用`this.$store.commit('SET_NUMBER',10)`

### 16、Vuex 中 action 和 mutation 有什么区别？

- action 提交的是 mutation，而不是直接变更状态。mutation 可以直接变更状态。

- action 可以包含任意异步操作。mutation 只能是同步操作。

- 提交方式不同，action 是用`this.$store.dispatch('ACTION_NAME',data)`来提交。mutation 是用`this.$store.commit('SET_NUMBER',10)`来提交。

- 接收参数不同，mutation 第一个参数是 state，而 action 第一个参数是 context，其包含了

```js
{
  state, // 等同于 `store.state`，若在模块中则为局部状态
    rootState, // 等同于 `store.state`，只存在于模块中
    commit, // 等同于 `store.commit`
    dispatch, // 等同于 `store.dispatch`
    getters, // 等同于 `store.getters`
    rootGetters; // 等同于 `store.getters`，只存在于模块中
}
```

### 17、Vuex 中 action 和 mutation 有什么相同点？

第二参数都可以接收外部提交时传来的参数。 `this.$store.dispatch('ACTION_NAME',data)`和`this.$store.commit('SET_NUMBER',10)`

### 18、在组件中多次提交同一个 action，怎么写使用更方便。

使用 mapActions 辅助函数,在组件中这么使用

```js
methods:{
    ...mapActions({
        setNumber:'SET_NUMBER',
    })
}
```

然后调用`this.setNumber(10)`相当调用`this.$store.dispatch('SET_NUMBER',10)`

### 19、Vuex 中 action 通常是异步的，那么如何知道 action 什么时候结束呢？

在 action 函数中返回 Promise，然后再提交时候用 then 处理

```js
actions:{
    SET_NUMBER_A({commit},data){
        return new Promise((resolve,reject) =>{
            setTimeout(() =>{
                commit('SET_NUMBER',10);
                resolve();
            },2000)
        })
    }
}
this.$store.dispatch('SET_NUMBER_A').then(() => {
  // ...
})
```

### 20、Vuex 中有两个 action，分别是 actionA 和 actionB，其内都是异步操作，在 actionB 要提交 actionA，需在 actionA 处理结束再处理其它操作，怎么实现？

利用 ES6 的`async`和`await`来实现。

```js
actions:{
    async actionA({commit}){
        //...
    },
    async actionB({dispatch}){
        await dispatch ('actionA')//等待actionA完成
        // ...
    }
}
```

### 21、有用过 Vuex 模块吗，为什么要使用，怎么使用。

有，因为使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。所以将 store 分割成模块（module）。每个模块拥有自己的 state、mutations、actions、getters，甚至是嵌套子模块，从上至下进行同样方式的分割。

在 module 文件新建 moduleA.js 和 moduleB.js 文件。在文件中写入

```js
const state = {
  //...
};
const getters = {
  //...
};
const mutations = {
  //...
};
const actions = {
  //...
};
export default {
  state,
  getters,
  mutations,
  actions,
};
```

然后再 index.js 引入模块

```js
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import moduleA from './module/moduleA';
import moduleB from './module/moduleB';
const store = new Vuex.Store({
  modules: {
    moduleA,
    moduleB,
  },
});
export default store;
```

### 22、在模块中，getter 和 mutation 接收的第一个参数 state，是全局的还是模块的？

第一个参数 state 是模块的 state，也就是局部的 state。

### 23、在模块中，getter 和 mutation 和 action 中怎么访问全局的 state 和 getter？

- 在 getter 中可以通过第三个参数 rootState 访问到全局的 state,可以通过第四个参数 rootGetters 访问到全局的 getter。

- 在 mutation 中不可以访问全局的 satat 和 getter，只能访问到局部的 state。

- 在 action 中第一个参数 context 中的`context.rootState`访问到全局的 state，`context.rootGetters`访问到全局的 getter。

### 24、在组件中怎么访问 Vuex 模块中的 getter 和 state,怎么提交 mutation 和 action？

- 直接通过`this.$store.getters.xxx`和`this.$store.模块名.xxx`来访问模块中的 getter 和 state。

- 直接通过`this.$store.commit('mutationA',data)`提交模块中的 mutation。

- 直接通过`this.$store.dispatch('actionA',data)`提交模块中的 action。
- **以上是没有命名空间的，如果有命名空间那么就是下面这样**
- 直接通过`this.$store.getters['模块名/xxx']`和`this.$store.模块名.xxx`来访问模块中的 getter 和 state。

- 直接通过`this.$store.commit('模块名/mutationA',data)`提交模块中的 mutation。

- 直接通过`this.$store.dispatch('模块名/actionA',data)`提交模块中的 action。

### 25、用过 Vuex 模块的命名空间吗？为什么使用，怎么使用。

默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间，如果多个模块中 action、mutation 的命名是一样的，那么提交 mutation、action 时，将会触发所有模块中命名相同的 mutation、action。

这样有太多的耦合，如果要使你的模块具有更高的封装度和复用性，你可以通过添加`namespaced: true` 的方式使其成为带命名空间的模块。

```js
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
```

### 26、怎么在带命名空间的模块内提交全局的 mutation 和 action？

将` { root: true }` 作为第三参数传给 dispatch 或 commit 即可。

```js
this.$store.dispatch('actionA', null, { root: true });
this.$store.commit('mutationA', null, { root: true });
```

### 27、怎么在带命名空间的模块内注册全局的 action？

```js
actions: {
    actionA: {
        root: true,  // 带上root为true表示就是根的action了
        handler (context, data) { ... }
    }
  }
```

### 28、组件中怎么提交 modules 中的带命名空间的 moduleA 中的 mutationA？

```js
this.$store.commit('moduleA/mutationA', data);
```

### 29、怎么使用 mapState，mapGetters，mapActions 和 mapMutations 这些函数来绑定带命名空间的模块？

**使用`createNamespacedHelpers`创建基于某个命名空间辅助函数**

```js
import { createNamespacedHelpers } from 'vuex';
const { mapState, mapActions,mapGetters,mapMutations } = createNamespacedHelpers('moduleA');
export default {
    computed: {
        // 在 `module/moduleA` 中查找
        ...mapState({
            a: state => state.a,
            b: state => state.b
        }),
        ...mapGetters(['getterA','getterB'])
    },
    methods: {
        // 在 `module/moduleA` 中查找
        ...mapActions([
            'actionA',
            'actionB'
        ])，
        ...mapMutations([
        	'mutationA',
        	'mutationB'
        ])
    }
}
```

**如果不使用`createNamespacedHelpers`就需要注意，不能直接用数组语去获取**

```js
import { mapState, mapActions } from 'vuex';
export default {
    computed: {
        // 在 `module/moduleA` 中查找
        ...mapState({
            a: state => state.模块名.a,
            b: state => state.模块名.b
        }),
        ...mapGetters({
            gettersA:'模块名/gettersA'
            gettersB:'模块名/gettersB'
        })
    },
    methods: {
        // 在 `module/moduleA` 中查找
        ...mapActions({
            actionA:'模块名/actionA',
            actionB:'模块名/actionB'
        }),
        ...mapMutations({
            mutationA:'模块名/mutationA',
            mutationB:'模块名/mutationB'
        })
    }
}
```

### 30、Vuex 插件有用过吗？怎么用简单介绍一下？

Vuex 插件就是一个函数，它接收 store 作为唯一参数。在 Vuex.Store 构造器选项 plugins 引入。 在 store/plugin.js 文件中写入

```js
export default function createPlugin(param) {
  return store => {
    //...
  };
}
```

然后在 store/index.js 文件中写入

```js
import createPlugin from './plugin.js';
const myPlugin = createPlugin();
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin],
});
```

### 31、在 Vuex 插件中怎么监听组件中提交 mutation 和 action？

- 用 Vuex.Store 的实例方法`subscribe`监听组件中提交 mutation
- 用 Vuex.Store 的实例方法`subscribeAction`监听组件中提交 action 在 store/plugin.js 文件中写入

```js
export default function createPlugin(param) {
  return store => {
    store.subscribe((mutation, state) => {
      console.log(mutation.type); //是那个mutation
      console.log(mutation.payload);
      console.log(state);
    });
    // store.subscribeAction((action, state) => {
    //     console.log(action.type)//是那个action
    //     console.log(action.payload)//提交action的参数
    // })
    store.subscribeAction({
      before: (action, state) => {
        //提交action之前
        console.log(`before action ${action.type}`);
      },
      after: (action, state) => {
        //提交action之后
        console.log(`after action ${action.type}`);
      },
    });
  };
}
```

```js
import createPlugin from './plugin.js';
const myPlugin = createPlugin();
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin],
});
```

### 32、在 v-model 上怎么用 Vuex 中 state 的值？

需要通过 computed 计算属性来转换。

```js
<input v-model="message">
// ...
computed: {
    message: {
        get () {
            return this.$store.state.message
        },
        set (value) {
            this.$store.commit('updateMessage', value)
        }
    }
}
```

### 33、Vuex 的严格模式是什么,有什么作用,怎么开启？

在严格模式下，**无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。**这能保证所有的状态变更都能被调试工具跟踪到。（有效防止了直接赋值 state 里面的内容进行修改）

在 Vuex.Store 构造器选项中开启,如下

```js
const store = new Vuex.Store({
  strict: true,
});
```

### 34、为什么不推荐直接赋值修改 state

组件里直接修改 state 也是生效的,但是不推荐这种直接修改 state 的方式，**因为这样不能使用 vuex 的浏览器插件来跟踪状态的变化，不利于调试。如果是严格模式下，直接会抛出错误。**

## 四、axios

### 1、axios 是什么

1. Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。前端最流行的 ajax 请求库，

2. react/vue 官方都推荐使用 axios 发 ajax 请求

### 2、axios 特点

1. 基于 promise 的异步 ajax 请求库，支持 promise 所有的 API

2. 浏览器端/node 端都可以使用，浏览器中创建 XMLHttpRequests

3. 支持请求／响应拦截器

4. 支持请求取消

5. 可以转换请求数据和响应数据，并对响应回来的内容自动转换成 JSON 类型的数据

6. 批量发送多个请求

7. 安全性更高，客户端支持防御 XSRF，就是让你的每个请求都带一个从 cookie 中拿到的 key, 根据浏览器同源策略，假冒的网站是拿不到你 cookie 中得 key 的，这样，后台就可以轻松辨别出这个请求是否是用户在假冒网站上的误导输入，从而采取正确的策略。

### 3、axios 常用语法

- **axios(config): 通用/最本质的发任意类型请求的方式**

- **axios(url[, config]): 可以只指定 url 发 get 请求**

- **axios.request(config): 等同于 axios(config)**

- **axios.get(url[, config]): 发 get 请求**

- **axios.delete(url[, config]): 发 delete 请求**

- **axios.post(url[, data, config]): 发 post 请求**

- **axios.put(url[, data, config]): 发 put 请求**

- axios.defaults.xxx: 请求的默认全局配置

- axios.interceptors.request.use(): 添加请求拦截器

- axios.interceptors.response.use(): 添加响应拦截器

- axios.create([config]): 创建一个新的 axios(它没有下面的功能)

- axios.Cancel(): 用于创建取消请求的错误对象

- axios.CancelToken(): 用于创建取消请求的 token 对象

- axios.isCancel(): 是否是一个取消请求的错误

- **axios.all(promises): 用于批量执行多个异步请求**

- axios.spread(): 用来指定接收所有成功数据的回调函数的方法

### 4、axios 为什么既能在浏览器环境运行又能在服务器(node)环境运行？

axios 在浏览器端使用`XMLHttpRequest`对象发送 ajax 请求；在 node 环境使用`http`对象发送 ajax 请求。

```js
var defaults.adapter = getDefaultAdapter();
function getDefaultAdapter () {
	var adapter;
    if (typeof XMLHttpRequest !== 'undefined') {
    	// 浏览器环境
        adapter = require('./adapter/xhr');
    } else if (typeof process !== 'undefined') {
    	// node环境
        adapter = require('./adapter/http');
    }
   return adapter;
}
```

上面几行代码，可以看出：XMLHttpRequest 是一个 API，它为客户端提供了在客户端和服务器之间传输数据的功能；process 对象是一个 global （全局变量），提供有关信息，控制当前 Node.js 进程。原来作者是通过判断 XMLHttpRequest 和 process 这两个全局变量来判断程序的运行环境的，从而在不同的环境提供不同的 http 请求模块，实现客户端和服务端程序的兼容。

### 5、axios 相比原生 ajax 的优点

ajax 的缺点

- 本身是针对 MVC 的编程,不符合现在前端 MVVM 的浪潮
- 基于原生的 XHR 开发，XHR 本身的架构不清晰。
- JQuery 整个项目太大，单纯使用 ajax 却要引入整个 JQuery 非常的不合理（采取个性化打包的方案又不能享受 CDN 服务）
- 不符合关注分离（Separation of Concerns）的原则
- 配置和调用方式非常混乱，而且基于事件的异步模型不友好。

### 6、说下你了解的 axios 相关配置属性？

- `url`是用于请求的服务器 URL

- `method`是创建请求时使用的方法,默认是 get

- `baseURL`将自动加在`url`前面，除非`url`是一个绝对 URL。它可以通过设置一个`baseURL`便于为 axios 实例的方法传递相对 URL

- `transformRequest`允许在向服务器发送前，修改请求数据，只能用在'PUT','POST'和'PATCH'这几个请求方法

- `headers`是即将被发送的自定义请求头
  headers:{'X-Requested-With':'XMLHttpRequest'},

- `params`是即将与请求一起发送的 URL 参数，必须是一个无格式对象(plainobject)或 URLSearchParams 对象

  ```js
  params: {
    ID: 12345;
  }
  ```

- `auth`表示应该使用 HTTP 基础验证，并提供凭据
  这将设置一个`Authorization`头，覆写掉现有的任意使用`headers`设置的自定义`Authorization`头

  ```js
  auth:{
  username:'janedoe',
  password:'s00pers3cret'
  }
  ```

- 'proxy'定义代理服务器的主机名称和端口，这里的`auth`表示 HTTP 基础验证应当用于连接代理，并提供凭据
  这将会设置一个`Proxy-Authorization`头，覆写掉已有的通过使用`header`设置的自定义`Proxy-Authorization`头。

  ```js
  proxy:{
      host:'127.0.0.1',
      port:9000,
      auth::{
          username:'mikeymike',
          password:'rapunz3l'
      }
  }
  ```

### 7、什么是 axios 拦截器

- 什么是拦截器： 在我们实际发送请求到我们的服务器之前进行拦截处理；在我们的服务器端正式返回数据给具体请求方法前进行拦截。

- 效果图

  <img src="/img/vue-interview/019.jpg" style="zoom:50%;" />

- 请求拦截器的作用是在请求发送前进行一些操作，例如在每个请求体里加上 token，统一做了处理如果以后要改也非常容易。
- 响应拦截器的作用是在接收到响应后进行一些操作，例如在服务器返回登录状态失效，需要重新登录的时候，跳转到登录页等。

### 8、拦截器如何使用

```js
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
```

### 9、如何创建一个 axios 实例

```js
const $axios = axios.create({
  配置信息,
});
// 注意创建的axios实例对象是没有all方法的。
```

### 10、axios 处理 token 过期后如何继续之前的请求

```js
/**
 * 封装 axios 请求模块
 */
import axios from 'axios';
import store from '@/store';
import router from '@/router';

// axios.create 方法：复制一个 axios
const request = axios.create({
  baseURL: 'http://xxxx.cn/', // 基础路径
});

// 请求拦截器  【携带token】
request.interceptors.request.use(
  function (config) {
    const user = store.state.user;
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  // 响应成功进入第1个函数
  // 该函数的参数是响应对象
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  // 响应失败进入第2个函数，该函数的参数是错误对象
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // 如果响应码是 401 ，则请求获取新的 token

    // 响应拦截器中的 error 就是那个响应的错误对象
    console.dir(error);
    if (error.response && error.response.status === 401) {
      // 校验是否有 refresh_token
      const user = store.state.user;

      if (!user || !user.refresh_token) {
        router.push('/login');

        // 代码不要往后执行了
        return;
      }

      // 如果有refresh_token，则请求获取新的 token
      try {
        const res = await axios({
          method: 'PUT',
          url: 'http://xxxx/authorizations', // 更新token的地址
          headers: {
            Authorization: `Bearer ${user.refresh_token}`,
          },
        });

        // 如果获取成功，则把新的 token 更新到容器中
        console.log('刷新 token  成功', res);
        store.commit('setUser', {
          token: res.data.data.token, // 最新获取的可用 token
          refresh_token: user.refresh_token, // 还是原来的 refresh_token
        });

        // 把之前失败的用户请求继续发出去
        // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
        // return 把 request 的请求结果继续返回给发请求的具体位置
        return request(error.config); // 【核心：继续之前的上一次请求】
      } catch (err) {
        // 如果获取失败，直接跳转 登录页
        console.log('请求刷线 token 失败', err);
        router.push('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default request;
```

### 11、vue 中如何使用 axios

- 安装 axios `npm i axios -S`

vue 中使用 axios 一般主要是 2 中方法

- **方法 1：直接将 axios 或者 axios 的实例挂载到 vue 的原型上面，这样在所有的组件里面都可以直接使用；**

  ```js
  // main.js中

  此处很多其他代码...,

  import axios from "axios"  // 导入
  const $axios = axios.create({ // 创建axios实例
      baseUrl:"基准地址",
      timeout:3000
  })
  Vue.prototype.$axios = $axios  // 挂载到vue原型上面

  此处很多其他代码...,
  ```

  ```js
  // 任意组件中  通过this.$axios 直接获取实例然后调用即可

  this.$axios.get/post(...)
  ```

- **方法 2：封装单独的 axios，且将所有的数据请求独立到 api 目录，然后将请求方法传递到页面使用，实际工作里面这种用的最多**

  - **创建一个 axios 实例，配置基本信息，和拦截器 放在`utils/http.js`**

    ```js
    import axios from 'axios';

    // 创建一个axios实例
    let $axios = axios.create({
      baseURL: 'http://122.51.249.55:3000/index.php/Api/', // 基准前缀地址！
      timeout: 3000, // 请求时长！
    });

    // 添加请求拦截器
    $axios.interceptors.request.use(
      function (config) {
        return config;
      },
      function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
      }
    );

    // 添加响应拦截器
    $axios.interceptors.response.use(
      function (response) {
        // 对数据进行处理
        if (response.data.status == 1) {
          return response.data.result;
        } else {
          alert(response.data.msg);
        }
      },
      function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
      }
    );

    // 暴露axios实例！
    export default $axios;
    ```

  - **创建`api/index.js` 文件，文件里面的为请求数据的方法，返回 promise 对象，可以让模板里面直接读取数据**

    ```js
    // 导入axios实例
    import $axios from '@/utils/http';
    import axios from 'axios'; // 因为axios实例没有all方法，所以还是要导入axios

    // 获取首页相关数据
    export async function getIndex() {
      let p1 = $axios.get('/Index/favourite');
      let p2 = $axios.get('/Index/home');
      return await axios.all([p1, p2]); // 返回promise对象
    }
    // 获取商品列表
    export async function getList(data) {
      return $axios.get('Good/list', { params: data });
    }
    ```

  - **在组件中调用封装的业务请求方法**

    ```js
    import { getIndex, getList } from '@/common/request'; // 导入数据请求方法
    export default {
      // 要加上async 修饰符
      async mounted() {
        try {
          this.indexdata = await getIndex();
          this.list = await getList({ page: 1, size: 10 });
        } catch (err) {
          console.log('数据请求出错');
        }
      },
    };
    ```

## 五、vue-cli

### 1、**vue 等单页面应用及其优缺点**

**缺点：**

> 不支持低版本的浏览器，最低只支持到 IE9；
> 不利于 SEO 的优化（如果要支持 SEO，建议通过服务端来进行渲染组件）；
> 第一次加载首页耗时相对长一些；
> 不可以使用浏览器的导航按钮需要自行实现前进、后退。

**优点：**

> 无刷新体验,提升了用户体验；
> 前端开发不再以页面为单位，更多地采用组件化的思想，代码结构和组织方式更加规范化，便于修改和调整；
> API 共享，同一套后端程序代码不用修改就可以用于 Web 界面、手机、平板等多种客户端
> 用户体验好、快，内容的改变不需要重新加载整个页面。

### 2、vue-cli 如何安装 2.x 版本模板

- 查看 vue-cli 版本号

  ```
  vue -V
  或者
  vue --version

  如果是vue不是内部活外部命令说明根本没有装脚手架
  ```

- 安装 vue-cli 最新脚手架

  ```
  npm  i  @vue/cli -g   // 全局安装脚手架
  ```

- 新脚手架创建项目

  ```
  vue create 项目名
  ```

- **如何用新脚手架拉取老脚手架模板**

  **安装**

  ```js
  npm install -g @vue/cli-init
  ```

  **初始化项目**

  ```js
  // vue-cli 2.x 初始化项目命令
  vue init webpack 项目名
  ```

  **启动项目**

  ```
  npm run dev
  npm start

  // 打包
  npm run build
  ```

### 3、vue-cli2.x 如何配置 less

安装模块

```javascript
npm install less@3.9 less-loader@5.0.0 --save-dev    // 注意版本号，这里写的版本号实测过没有问题，版本太高可能编译出错
```

### 4、vue-cli2.x 如何配置跨域

然后`config/index.js`里

```js
 dev: {
    ...,
    proxyTable: {
      '/api': {  //使用"/api"来代替
            target: 'http://xxxx:xx/xx', //接口域名
            changeOrigin:true, //改变源
            pathRewrite: {
              '^/api': '' //路径重写
            }
      }
}
```

### 5、vue-cli2.x 如何进行打包配置

- 默认打包出来的 index.html 和静态资源文件是绝对路径关系，很多时候需要使用相对路径关系，方便部署！

- 操作

  - **config/index.js**

    <img src="/img/vue-interview/016.jpg" style="zoom:50;" />

  - **build/webpack.prod.conf.js**

    <img src="/img/vue-interview/017.jpg" style="zoom:50;" />

  - **build/utils.js**

    <img src="/img/vue-interview/018.jpg" style="zoom:50;" />

## 六、SSR

## 七、其他

### 1、vue 常用 UI 库有哪些

### 2、vue 常用插件

### 3、vue 项目如何实现权限管理

- 权限管理是基于 RBAC 完成的， 就是不同用户会有不同的角色，每个角色会有不同的菜单信息，从而决定了我们的用户能看到不同的菜单页面。
- 权限前后端都要做：后端是做接口访问权限，保证数据安全；前端做权限是保证用户访问到不同的页面，操作不同的功能。
- 前端如何做：
  - **最核心的是让不同的用户有不同的路由映射表，也就觉得了他可以看到不同的页面，且不能访问他没有路由映射的页面。**
  - 代码逻辑：
    - 登录成功之后，获取到 token，跳转到系统首页
    - 导航守卫里面判断是否有角色信息，
      - 如果没有就拉取用户信息，获取用户资料，
      - 结束之后再去请求该用户所对应的的角色的 菜单（路由）列表信息。
      - 有时候可能需要处理成路由映射的格式，
      - 处理完成之后，通过 **router.addRoutes**方法添加到路由映射表里面。
      - 这样就决定了不同的用户有不同的映射表，访问不同的页面。
    - **如果是节点级别的权限管理，后端返回该用户所对应角色的所有可以操作的节点标识符，我们通过自定义指令实现判断这些标识符所对应的按钮是否可以显示。**

### 4、说说你对 SPA 单页面的理解，它的优缺点分别是什么？

是一种只需要将单个页面加载到服务器之中的 web 应用程序。当浏览器向服务器发出第一个请求时，服务器会返回一个 index.html 文件，它所需的 js，css 等会在显示时统一加载，部分页面按需加载。url 地址变化时不会向服务器在请求页面，通过路由才实现页面切换。

优点：

- 良好的交互体验，用户不需要重新刷新页面，获取数据也是通过 Ajax 异步获取，页面显示流畅；
- 良好的前后端工作分离模式。

缺点：

- SEO 难度较高，由于所有的内容都在一个页面中动态替换显示，所以在 SEO 上其有着天然的弱势。

- 首屏加载过慢（初次加载耗时多）

### 5、SPA 单页面的实现方式有哪些？

- 在 hash 模式中，在 window 上监听 hashchange 事件（地址栏中 hash 变化触发）驱动界面变化；

- 在 history 模式中，在 window 上监听 popstate 事件（浏览器的前进或后退按钮的点击触发）驱动界面变化，监听 a 链接点击事件用 history.pushState、history.replaceState 方法驱动界面变化；

- 直接在界面用显示隐藏事件驱动界面变化。

### 6、Vue 如何优化首页加载速度

**减少请求的次数**

- 1.请求合并：将同一时间需要的 js 合并，目的是节省 dns 查找的时间
- 2.按需加载
  - 1.单页应用下的按照路由的需要加载
  - 2.缓存
- 3.css sprite base64 iconfont
- 4.cdn 托管
- 5.延迟加载：图片的延迟加载：（就是先不设置 img 的 src 属性，等合适的时机（比如滚动、滑动、出现在视窗内等）再把图片真实 url 放到 img 的 src 属性上。） js 的延迟加载：

**减少量**

- 1.精简代码（tree-shaking）

  - (1)去除无用的代码

  - (2)规范些代码的方式

  - (3)外部 cdn 的引入

- 2.懒加载 ---路由的懒加载
- 3.压缩 ---
  - （1）webpack 压缩 UglifyJsPlugin
  - （2）gzip 压缩
  - (3)图片压缩、JPG 优化
- 4.缓存 http 代码：---浏览器的强缓存（max-age Etag）和协商(弱)缓存（last-modified）
- 5.第三方组件---第三方组件作为外部依赖使用，会被打爆进业务代码。
- 6.按需加载 ---
  - （1）第三方库和工具的按需加载，如 echarts
  - （2）选择更优的工具 day.js 代替 moment
  - （3）可用代码拆分（Code-splitting）只传送用户需要的代码

**减少内存的消耗**

- 1.减少全局变量；
- 2.减少全局组件；
- 3.减少 dom 操作， 减少 DOM 访问，使用事件代理
  1. css 样式放在页面前面
  2. 延迟 js 加载
  3. 避免 CSS 表达式，避免@import
