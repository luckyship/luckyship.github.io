---
layout: post
title: vue3 的一些疑问
tags: []
comments: true
date: 2025-06-21 13:11:32
---

主要讨论一些 vue3 的疑问

## vue3 的动态组件有什么使用场景，为什么不使用 v-show 或者 v-if 这种直接切换不同组件展示呢

🌟 一句话总结：

> 动态组件适合在多个组件之间 **频繁切换，且需要保持各自状态** 的场景；而 `v-if` / `v-show` 更适合简单的展示/隐藏控制。

<!-- more -->

### 📌 动态组件的语法

`<component :is="currentView"></component>`

`currentView` 可以是一个组件名、组件对象、异步组件、字符串模板等。

### ✅ 使用动态组件的典型场景

#### 1\. **多组件切换，保留状态**

例如一个 Tab 页切换：

```html
<template>
  <button @click="currentTab = 'TabA'">TabA</button> <button @click="currentTab = 'TabB'">TabB</button>
  <keep-alive> <component :is="currentTab" /> </keep-alive>
</template>
```

```ts
components: { TabA, TabB },
setup() {
  const currentTab = ref('TabA')
  return {
    currentTab
  }
}
```

- 优点：每个组件切换时 **不会销毁**，表单输入、滚动条等状态会被保留。
- 可配合 `<keep-alive>` 使用，进一步优化性能和体验。

#### 2\. **运行时决定加载哪个组件**

比如根据服务端返回的数据类型决定使用哪个组件展示内容。

`<component :is="getComponentByType(data.type)" :data="data" />`

- 适合可插拔式架构，组件复用性高。
- 动态组件支持异步加载，降低首次加载体积。

#### 3\. **表单组件动态渲染**

根据配置项渲染不同表单项，比如：

`<component :is="field.component" v-bind="field.props" />`

- 类似 ElementPlus 的 `el-form` 动态生成。
- 优雅实现复杂动态表单。

### 🔍 为什么不直接用 `v-if` 或 `v-show`？

| 功能对比   | `v-if`            | `v-show`           | `<component :is="...">`               |
| ---------- | ----------------- | ------------------ | ------------------------------------- |
| 是否渲染   | 条件满足时才渲染  | 始终渲染，只是隐藏 | 渲染当前指定组件                      |
| 组件销毁   | 会销毁 DOM / 实例 | 不销毁，只隐藏     | 可以选择是否保留（配合 `keep-alive`） |
| 切换性能   | 频繁切换性能差    | 切换快但内存高     | 切换快，可控制状态保留                |
| 多组件切换 | 不适合            | 不适合             | 非常适合                              |

---

### ✅ 总结：何时选什么？

- ✅ **多个组件频繁切换 + 需要状态保留** → 用 `<component :is="..."> + keep-alive`
- ✅ **组件类型动态决定** → 用 `<component :is="...">`
- 🚫 **简单条件渲染（如登录/未登录）** → 用 `v-if`
- 🚫 **仅控制显示隐藏（不需要重新渲染）** → 用 `v-show`

## vue3 是不是移除了 created，beforecreate 生命周期，为什么要移除

是的，**Vue 3 并没有移除 `created` 和 `beforeCreate` 生命周期**，但在**组合式 API（Composition API）中不再推荐使用这些钩子**，取而代之的是 **`setup()` 函数**。我们来详细解释一下：

### ✅ Vue 3 中的生命周期变化概览

| 生命周期        | 选项式 API | 组合式 API（setup 中）    |
| --------------- | ---------- | ------------------------- |
| `beforeCreate`  | ✅ 有      | ❌ 不存在，合并入 `setup` |
| `created`       | ✅ 有      | ❌ 不存在，合并入 `setup` |
| `beforeMount`   | ✅ 有      | ✅ `onBeforeMount()`      |
| `mounted`       | ✅ 有      | ✅ `onMounted()`          |
| `beforeUpdate`  | ✅ 有      | ✅ `onBeforeUpdate()`     |
| `updated`       | ✅ 有      | ✅ `onUpdated()`          |
| `beforeUnmount` | ✅ 有      | ✅ `onBeforeUnmount()`    |
| `unmounted`     | ✅ 有      | ✅ `onUnmounted()`        |

> ✅：依然支持  
> ❌：不再单独存在（但功能可以通过 `setup()` 达成）

### ❓ 那为什么说 `beforeCreate` / `created` 被“合并”了？

在 Vue 2 中：

```js
export default {
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
};
```

在 Vue 3 中使用组合式 API：

```js
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    // 等价于 beforeCreate + created 的逻辑
    console.log("setup called"); // 此时响应式、props、context 已可用
  },
});
```

所以：

- `setup()` 本身就承担了 `beforeCreate` 和 `created` 的责任；
- 因此不再需要这两个生命周期钩子。

### 💡 为什么 Vue 3 要“合并”掉 `beforeCreate` 和 `created`？

#### 1\. **`setup()` 更统一简洁**

- 在组合式 API 中，组件逻辑集中在 `setup()` 里，无需多个钩子函数。
- 减少学习成本，开发体验更一致。

#### 2\. **它们的作用非常有限**

- `beforeCreate`：此时 `data` / `props` / `computed` / `methods` 都还不可访问，几乎没有实际用途。
- `created`：虽然可以访问 `data` 和 `props`，但没有 DOM，也无法做很多实际操作。

很多开发者在 Vue 2 中就很少真正用 `beforeCreate`。

#### 3\. **更易于类型推导和逻辑复用**

- 使用 `setup()` + `onXxx` 生命周期，更容易做类型推断、代码拆分、逻辑复用。

### ✅ 总结

- Vue 3 没有移除 `created` / `beforeCreate`，在选项式 API 中依然存在。
- 但在组合式 API 中，它们已经被 `setup()` 取代，不再需要这些钩子。
- **益处**：
  - 简化 API 设计；
  - 强化逻辑聚合；
  - 提高类型支持与逻辑复用能力；
  - 清理掉低价值钩子。
