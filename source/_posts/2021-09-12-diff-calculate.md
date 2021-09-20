---
layout: post
title: diff算法
tags: [javascript, vue, react]
categories: review
comments: true
date: 2021-09-12 16:18:15
---

## Diff 算法核心原理

### 1、认识虚拟 DOM（Virtual DOM）

没有 vue 之前我们都是用 js 和 jq，操作 DOM—>视图更新

有了 vue，数据改变—>生成虚拟 DOM（计算变更）—>操作真实的 DOM—>视图更新

<!-- more -->

真实 DOM：

```
<ul id="list">
    <li class="item">哈哈</li>
    <li class="item">呵呵</li>
    <li class="item">嘿嘿</li>
</ul>
```

对应的虚拟 DOM 为：

```
let oldVDOM = { // 旧虚拟DOM
  tagName: 'ul', // 标签名
  props: { // 标签属性
    id: 'list'
  },
  children: [ // 标签子节点
    {
      tagName: 'li', props: { class: 'item' }, children: ['哈哈']
    },
    {
      tagName: 'li', props: { class: 'item' }, children: ['呵呵']
    },
    {
      tagName: 'li', props: { class: 'item' }, children: ['嘿嘿']
    },
  ]
}
```

虚拟 DOM 算法 = 虚拟 DOM + Diff 算法

好处：**虚拟 DOM 算法操作真实 DOM，性能高于直接操作真实 DOM**

### 2、什么是 Diff 算法

![](/img/diff-calculate/1.png)

上图中，其实只有一个 li 标签修改了文本，其他都是不变的，所以没必要所有的节点都要更新，只更新这个 li 标签就行，Diff 算法就是查出这个 li 标签的算法。

总结：**Diff 算法是一种对比算法**。对比两者是`旧虚拟DOM和新虚拟DOM`，对比出是哪个`虚拟节点`更改了，找出这个`虚拟节点`，并只更新这个虚拟节点所对应的`真实节点`，而不用更新其他数据没发生改变的节点，实现`精准`地更新真实 DOM，进而`提高效率`。

### 3、Diff 算法的原理

新旧虚拟 DOM 对比的时候，Diff 算法比较只会在同层级进行, 不会跨层级比较。

![](/img/diff-calculate/11.png)

![](/img/diff-calculate/2.png)

### 4、Diff 对比流程

![](/img/diff-calculate/3.png)

当数据改变时，会触发`setter`，并且通过`Dep.notify`去通知所有`订阅者Watcher`，订阅者们就会调用`patch方法`

![](/img/diff-calculate/15.png)

1、Data 通过 Observer 转换成了 getter/setter 的形式来追踪变化。

2、当外界通过 Watcher 读取数据时，会触发 getter 从而将 Watcher 添加到依赖中。

3、当数据发生了变化时，会触发 setter，从而 Dep 中的依赖（Watcher）发送通知。

4、Watcher 接收到通知后，会向外界发送通知，变化通知到外界后可能会触发视图更新，也有可能会触发用户返回的某个回调函数。

#### patch 方法

对比当前同层的虚拟节点是否为同一种类型的标签：

- 是：继续执行`patchVnode方法`进行深层比对
- 否：没必要比对了，直接整个节点替换成`新虚拟节点`

![](/img/diff-calculate/3.png)

`patch`的核心原理代码：

```
function patch(oldVnode, newVnode) {
  // 比较是否为一个类型的节点
  if (sameVnode(oldVnode, newVnode)) {
    // 是：继续进行深层比较
    patchVnode(oldVnode, newVnode)
  } else {
    // 否
    const oldEl = oldVnode.el // 旧虚拟节点的真实DOM节点
    const parentEle = api.parentNode(oldEl) // 获取父节点
    createEle(newVnode) // 创建新虚拟节点对应的真实DOM节点
    if (parentEle !== null) {
      api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl)) // 将新元素添加进父元素
      api.removeChild(parentEle, oldVnode.el)  // 移除以前的旧元素节点
      // 设置null，释放内存
      oldVnode = null
    }
  }

  return newVnode
}
```

#### sameVnode 方法

patch 关键的一步就是`sameVnode方法判断是否为同一类型节点`，

sameVnode 方法的核心原理代码：

```
function sameVnode(oldVnode, newVnode) {
  return (
    oldVnode.key === newVnode.key && // key值是否一样
    oldVnode.tagName === newVnode.tagName && // 标签名是否一样
    oldVnode.isComment === newVnode.isComment && // 是否都为注释节点
    isDef(oldVnode.data) === isDef(newVnode.data) && // 是否都定义了data
    sameInputType(oldVnode, newVnode) // 当标签为input时，type必须是否相同
  )
}
```

#### patchVnode 方法

这个函数做了以下事情：

- 找到对应的`真实DOM`，称为`el`
- 判断`newVnode`和`oldVnode`是否指向同一个对象，如果是，那么直接`return`
- 如果他们都有文本节点并且不相等，那么将`el`的文本节点设置为`newVnode`的文本节点。
- 如果`oldVnode`有子节点而`newVnode`没有，则删除`el`的子节点
- 如果`oldVnode`没有子节点而`newVnode`有，则将`newVnode`的子节点真实化之后添加到`el`
- 如果两者都有子节点，则执行`updateChildren`函数比较子节点，这一步很重要

```
function patchVnode(oldVnode, newVnode) {
  const el = newVnode.el = oldVnode.el // 获取真实DOM对象
  // 获取新旧虚拟节点的子节点数组
  const oldCh = oldVnode.children, newCh = newVnode.children
  // 如果新旧虚拟节点是同一个对象，则终止
  if (oldVnode === newVnode) return
  // 如果新旧虚拟节点是文本节点，且文本不一样
  if (oldVnode.text !== null && newVnode.text !== null && oldVnode.text !== newVnode.text) {
    // 则直接将真实DOM中文本更新为新虚拟节点的文本
    api.setTextContent(el, newVnode.text)
  } else {
    // 否则

    if (oldCh && newCh && oldCh !== newCh) {
      // 新旧虚拟节点都有子节点，且子节点不一样

      // 对比子节点，并更新
      updateChildren(el, oldCh, newCh)
    } else if (newCh) {
      // 新虚拟节点有子节点，旧虚拟节点没有

      // 创建新虚拟节点的子节点，并更新到真实DOM上去
      createEle(newVnode)
    } else if (oldCh) {
      // 旧虚拟节点有子节点，新虚拟节点没有

      //直接删除真实DOM里对应的子节点
      api.removeChild(el)
    }
  }
}
```

#### updateChildren 方法

updateChildren 的核心原理代码：

```
function updateChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0, newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx
  let idxInOld
  let elmToMove
  let before
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx]
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode)
      api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode)
      api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 使用key时的比较
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) // 有key生成index表
      }
      idxInOld = oldKeyToIdx[newStartVnode.key]
      if (!idxInOld) {
        api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
        newStartVnode = newCh[++newStartIdx]
      }
      else {
        elmToMove = oldCh[idxInOld]
        if (elmToMove.sel !== newStartVnode.sel) {
          api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
        } else {
          patchVnode(elmToMove, newStartVnode)
          oldCh[idxInOld] = null
          api.insertBefore(parentElm, elmToMove.el, oldStartVnode.el)
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
  }
  if (oldStartIdx > oldEndIdx) {
    before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
    addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}
```

首尾指针法：

![](/img/diff-calculate/5.png)

会进行互相进行比较，总共有五种比较情况：

- 1、`oldS 和 newS `使用`sameVnode方法`进行比较，`sameVnode(oldS, newS)`

- 2、`oldS 和 newE `使用`sameVnode方法`进行比较，`sameVnode(oldS, newE)`

- 3、`oldE 和 newS `使用`sameVnode方法`进行比较，`sameVnode(oldE, newS)`

- 4、`oldE 和 newE `使用`sameVnode方法`进行比较，`sameVnode(oldE, newE)`

- 5、如果以上逻辑都匹配不到，再把所有旧子节点的 `key` 做一个映射到旧节点下标的 `key -> index` 表，然后用新 `vnode` 的 `key` 去找出在旧节点中可以复用的位置。

  图例比较：

![](/img/diff-calculate/6.png)

##### 第一步：`oldS 和 newE` 相等，需要把`节点a`移动到`newE`所对应的位置，也就是末尾

![](/img/diff-calculate/7.png)

##### 第二步：`oldS 和 newS`相等，需要把`节点b`移动到`newS`所对应的位置

![](/img/diff-calculate/8.png)

##### 第三步：`oldS、oldE 和 newS`相等，需要把`节点c`移动到`newS`所对应的位置

![](/img/diff-calculate/9.png)

##### 第四步：`oldCh`先遍历完成了，而`newCh`还没遍历完，说明`newCh比oldCh多`，所以需要将多出来的节点，插入到真实 DOM 上对应的位置上

![](/img/diff-calculate/9-1.png)

##### 如果`oldCh比newCh多`的话，那就是`newCh`先走完循环，然后`oldCh`会有多出的节点，结果会在真实 DOM 里进行删除这些旧节点。

### 5、为什么不建议用 index 作为循环项的 key

![](/img/diff-calculate/13.png)

a，b，c`三个li标签都是复用之前的，因为他们三个根本没改变，改变的只是前面新增了一个`林三心

在进行子节点的 `diff算法` 过程中，会进行 旧首节点和新首节点的`sameNode`对比，这一步命中了逻辑，因为现在`新旧两次首部节点` 的 `key` 都是 `0`了，同理，key 为 1 和 2 的也是命中了逻辑，导致`相同key的节点`会去进行`patchVnode`更新文本，而原本就有的`c节点`，却因为之前没有 key 为 4 的节点，而被当做了新节点，所以使用 index 做 key，最后新增的居然是本来就已有的 c 节点。所以前三个都进行`patchVnode`更新文本，最后一个进行了`新增`，那就解释了为什么所有 li 标签都更新了。

![](/img/diff-calculate/12.png)

我们只要使用一个独一无二的值 id 来当做 key 就行了。

![](/img/diff-calculate/14.png)
