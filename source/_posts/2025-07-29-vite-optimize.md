---
layout: post
title: vite 性能优化
tags: [vite, javascript, vue]
comments: true
date: 2025-07-29 07:19:29
---

Vite 本身因其原生 ESM、基于 `esbuild` 的极速构建和开发性能而被视为性能优秀的构建工具。但在大型项目中，Vite 性能依然可以进一步优化，主要可以从 **开发时性能（dev server）** 和 **构建性能（build）** 两大方向入手。

<!-- more -->

## 🔧 一、开发阶段性能优化（`vite dev`）

### 1. ✅ **优化依赖预构建（预打包）**

Vite 会自动通过 `esbuild` 对依赖进行预构建（预打包），加快冷启动速度。

- **配置优化**：

```ts
optimizeDeps: {
  include: ['lodash-es', 'dayjs'], // 指定预构建依赖（避免动态导入不被识别）
  exclude: ['jspdf'],     // 排除某些大型包，避免打包过慢，该用cdn方式引入、例如video.js 、 jspdf等
}
```

### 2. ✅ **禁用不必要插件 / 中间件**

- 一些插件（如 legacy、PWA、自动生成路由）会导致开发服务器变慢
- 推荐：仅在 build 环境中使用插件

```ts
plugins: isBuild ? [legacy(), compress(), visualizer()] : [vue()];
```

1. legacy 插件：用于兼容旧版浏览器，如 IE11。
2. compress 插件：用于压缩资源文件。
3. visualizer 插件：用于可视化打包分析。

---

### 3. ✅ **减少热更新开销（HMR）**

- 避免巨型模块（如 `store/index.ts`）频繁被修改
- 拆分为小模块，按需 import，可提升 HMR 速度
- 使用 `defineOptions()` / `defineStore()` 替代手动注册模块

---

### 4. ✅ **提升冷启动速度**

- 开启缓存（Vite 默认缓存到 `node_modules/.vite`）
- 避免项目根目录下存在大量无关文件（如 `.git`, `dist`, `temp`, 大图像等）
- 设置 `server.watch.ignored` 忽略监听无关路径：

```ts
server: {
  watch: {
    ignored: ['**/dist/**', '**/.git/**'],
  },
}
```

---

## 📦 二、构建阶段优化（`vite build`）

### 1. ✅ **合理使用 Rollup 选项**

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor' // 将 node_modules 单独打包
        }
      }
    }
  }
}
```

---

### 2. ✅ **开启构建缓存**

- 构建缓存是 Vite 4.x 后期引入的功能（通过 plugin 或自建缓存层）
- 可配合 `turbo`, `nx`, `vite-plugin-cache` 实现增量构建

---

### 3. ✅ **开启 CSS 代码分离 + 压缩**

```ts
build: {
  cssCodeSplit: true,
  minify: 'esbuild', // 或 'terser'，但 esbuild 更快
}
```

---

### 4. ✅ **压缩体积 + 可视化分析**

#### 插件推荐：

- [`rollup-plugin-visualizer`](https://github.com/btd/rollup-plugin-visualizer) —— 打包分析图
- [`vite-plugin-compression`](https://github.com/anncwb/vite-plugin-compression) —— 开启 gzip/br
- \[`vite-plugin-image-optimizer`] —— 图像压缩

---

## 🌐 三、网络优化（适用于部署后）

### ✅ 配合使用：

- HTTP/2
- CDN 静态资源缓存
- SSR with streaming (如 Vue SSR、React Server Component)
- 使用 `vite-ssg` 进行预渲染（静态化）

---

## 🧩 插件辅助优化（推荐）

| 插件                                                                           | 用途                      |
| ------------------------------------------------------------------------------ | ------------------------- |
| [`vite-plugin-imp`](https://github.com/onebay/vite-plugin-imp)                 | 按需引入组件库（如 antd） |
| [`vite-plugin-compression`](https://github.com/anncwb/vite-plugin-compression) | Gzip/Brotli 压缩          |
| [`vite-plugin-inspect`](https://github.com/antfu/vite-plugin-inspect)          | 插件执行链调试工具        |
| [`vite-plugin-cache`](https://github.com/gxmari007/vite-plugin-cache)          | 缓存构建文件，加速构建    |
| [`rollup-plugin-visualizer`](https://github.com/btd/rollup-plugin-visualizer)  | 打包体积分析              |

---

## 🎯 实战推荐：性能优化 Checklist

| 阶段 | 优化项                  | 建议                                 |
| ---- | ----------------------- | ------------------------------------ |
| 开发 | 缓存 node_modules/.vite | ✅ 开启增量预构建                    |
| 开发 | HMR 变慢                | ✅ 拆分模块，避免巨型文件            |
| 构建 | 构建慢                  | ✅ 使用 `manualChunks`, 开启缓存     |
| 构建 | 包大                    | ✅ 动态导入，gzip 压缩，Tree Shaking |
| 构建 | 编译慢                  | ✅ 使用 esbuild 替代 babel / terser  |
| 构建 | 依赖大                  | ✅ 替换大型库，如 moment → dayjs     |

---
