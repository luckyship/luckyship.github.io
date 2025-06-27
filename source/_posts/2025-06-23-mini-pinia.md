---
layout: post
title: 自己实现一个简单版 Pinia（miniPinia）
tags: [vue, javascript]
comments: true
date: 2025-06-23 20:55:56
---

我们做一个极简 Pinia，实现：

- 创建 store
- 响应式 state
- 支持 actions
- 支持在组件中使用

<!-- more -->

### 创建 store

createPinia() —— 创建一个”全局容器”

```js
export function createPinia() {
  const stores = new Map();
  return {
    install(app) {
      app.provide(piniaSymbol, this);
    },
    _stores: stores,
    useStore(storeId, createStoreFn) {
      if (!this._stores.has(storeId)) {
        const store = createStoreFn();
        this._stores.set(storeId, store);
      }
      return this._stores.get(storeId);
    },
  };
}
```

相当于 `Pinia` 实例，持有所有的 `store`（用 `Map` 存储）

提供 useStore 方法，确保每个 store 是单例

在 `app.use(pinia)` 时通过 `provide` 将 `pinia` 实例挂进 Vue 的上下文中（用于 inject()）

🔁 store 是单例的，怎么实现的？

```js
if (!this._stores.has(storeId)) {
  const store = createStoreFn();
  this._stores.set(storeId, store);
}
```

每个 storeId 对应的 store 只会初始化一次

后续所有 useStore() 都返回同一个对象

### defineStore() —— 定义 store 的注册逻辑

```js
export function defineStore(id, setupFn) {
  return function useStore() {
    const pinia = inject(piniaSymbol);
    if (!pinia) throw new Error("Pinia not installed");
    return pinia.useStore(id, () => setupFn());
  };
}
```

使用者写：`defineStore('counter', () => { ... })`

返回一个函数 `useStore()`，用于组件中调用

内部调用 pinia 的 `useStore()`，传入 `storeId` 和 `setup` 逻辑

注入 pinia 实例，从 provide 中获取，确保 store 可以在全局访问

### setupFn() —— 创建响应式的 state 和 actions

```js
const state = reactive({ count: 0 });
function increment() {
  state.count++;
}
```

使用 Vue 3 的 reactive() 创建响应式数据

组合式 API 的方式将 state 和方法组织成一个 store

返回给组件使用

### useStore() in 组件中 —— 获取 store 实例

```js
const counter = useCounterStore();
```

### 整体代码

🔧 miniPinia.js

```js
// miniPinia.js
import { reactive, inject, provide } from "vue";

const piniaSymbol = Symbol("miniPinia");

export function createPinia() {
  const stores = new Map();
  return {
    install(app) {
      app.provide(piniaSymbol, this);
    },
    _stores: stores,
    useStore(storeId, createStoreFn) {
      if (!this._stores.has(storeId)) {
        const store = createStoreFn();
        this._stores.set(storeId, store);
      }
      return this._stores.get(storeId);
    },
  };
}

export function defineStore(id, setupFn) {
  return function useStore() {
    const pinia = inject(piniaSymbol);
    if (!pinia) throw new Error("Pinia not installed");
    return pinia.useStore(id, () => setupFn());
  };
}
```

```js
// counterStore.js
import { reactive } from "vue";
import { defineStore } from "./miniPinia";

export const useCounterStore = defineStore("counter", () => {
  const state = reactive({
    count: 0,
  });

  function increment() {
    state.count++;
  }

  return {
    state,
    increment,
  };
});
```

```html
<!-- App.vue -->
<template>
  <div>
    <h2>Count: {{ counter.state.count }}</h2>
    <button @click="counter.increment()">+1</button>
  </div>
</template>

<script setup>
  import { useCounterStore } from "./counterStore";

  const counter = useCounterStore();
</script>
```

```js
// main.js
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "./miniPinia";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.mount("#app");
```
