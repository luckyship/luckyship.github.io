---
layout: post
title: vite 插件 实现为catch自动添加console.error
tags: [vue, vite, javascript]
comments: true
date: 2025-07-27 15:56:54
---

好的，咱们来详细聊聊 `vite-plugin-try-catch-console` 这个插件的实现思路，这可不是简单的代码堆砌，里面藏着不少“黑科技”和“踩坑”经验呢！

### 插件的“初心”：为什么需要它？

在前端开发中，`try...catch` 块是处理异常的利器。但很多时候，开发者可能会写出这样的代码：

```javascript
try {
  // 可能会出错的代码
  throw new Error("Something went wrong");
} catch (e) {
  // 捕获了错误，但可能没有处理，或者处理不当
}
```

<!-- more -->

或者更“偷懒”的：

```javascript
try {
  // 可能会出错的代码
  throw new Error("Something went wrong");
} catch {} // 捕获了，但啥也没干
```

这样一来，错误虽然被捕获了，但并没有被有效地记录下来（比如 `console.error`），导致问题难以追踪。这个插件的“初心”就是为了解决这个问题：**自动在所有 `try...catch` 块的 `catch` 部分注入 `console.error(error)`，确保每一个被捕获的错误都能被打印出来。**

### 核心思路：AST 转换

要实现这个功能，我们不能简单地做字符串替换，因为代码结构复杂，容易出错。最可靠的方法是进行 **抽象语法树（AST）转换**。简单来说，就是把代码解析成一棵树形结构，然后在这棵树上找到 `catch` 节点，修改它，最后再把修改后的树重新生成为代码。

这里用到的主要工具是 Babel，它是一个强大的 JavaScript 编译器，能够帮助我们完成 AST 的解析、遍历和生成。

### 插件实现步骤详解

1.  **Vite 插件的骨架**

    首先，我们需要创建一个 Vite 插件。Vite 插件通常是一个返回 `Plugin` 对象的函数，其中最核心的是 `transform` 钩子。`transform` 钩子会在每个模块被 Vite 处理时调用，我们可以在这里拿到原始代码 `code` 和模块 ID `id`。

    ```typescript
    import { Plugin } from "vite";
    // ... 其他导入

    const vitePluginTryCatchConsole = (): Plugin => {
      return {
        name: "vite-plugin-try-catch-console",
        enforce: "post", // 确保在其他转换之后执行
        async transform(code, id) {
          // 1. 过滤文件类型，只处理 JS/TS/JSX/TSX/Vue 文件，并跳过 node_modules
          if (!/\.(js|ts|jsx|tsx|vue)$/.test(id) || id.includes("node_modules")) {
            return null; // 不处理这些文件
          }

          // 2. 解析代码生成 AST
          const ast = parse(code, {
            /* ...配置 */
          });
          if (!ast) return null;

          let transformed = false; // 标记是否进行了转换

          // 3. 遍历 AST，找到 CatchClause 节点并修改
          traverse(ast, {
            CatchClause(path) {
              // ... 核心逻辑
              transformed = true;
            },
          });

          // 4. 如果有修改，重新生成代码和 Source Map
          if (transformed) {
            const output = generate(ast, { sourceMaps: true, sourceFileName: id }, code);
            return { code: output.code, map: output.map };
          }

          return null; // 没有修改则返回 null
        },
      };
    };

    export default vitePluginTryCatchConsole;
    ```

2.  **Babel 的引入与配置**

    - `@babel/core`：用于解析代码 (`parse`)。
    - `@babel/traverse`：用于遍历 AST (`traverse`)。
    - `@babel/generator`：用于将 AST 重新生成代码 (`generate`)。
    - `@babel/types`：提供了创建 AST 节点的方法 (`t`)。

    在 `parse` 代码时，需要根据文件类型配置 Babel 插件，例如：

    ```typescript
    import * as babel from "@babel/core";
    import { parse } from "@babel/core";
    import _traverse from "@babel/traverse";
    const traverse = typeof _traverse === "function" ? _traverse : (_traverse as any).default; // 兼容不同导入方式
    import { generate } from "@babel/generator"; // 注意这里是命名导入
    import * as t from "@babel/types";

    // ...

    const ast = parse(code, {
      sourceType: "module",
      filename: id,
      plugins: [
        "@babel/plugin-transform-typescript", // 处理 TypeScript
        "@vue/babel-plugin-jsx", // 处理 Vue 中的 JSX，这是个坑点！
      ],
    });
    ```

    **踩坑点 1：`generate` 的导入方式**
    一开始我可能写成了 `import * as generate from '@babel/generator';`，导致 `generate is not a function`。这是因为 `@babel/generator` 的 `generate` 函数是作为命名导出（named export）的，而不是默认导出（default export）或整个模块的命名空间。正确的导入方式应该是 `import { generate } from '@babel/generator';`。

    **踩坑点 2：JSX 插件的选择**
    在处理 Vue 文件时，如果代码中包含 JSX 语法（比如 `render` 函数里写 JSX），需要正确的 Babel JSX 插件。一开始我可能用了 `@babel/plugin-transform-react-jsx`，这是 React 专用的。在 Vue 项目中，应该使用 `@vue/babel-plugin-jsx`，否则会导致 JSX 语法解析失败，进而引发后续的错误。

3.  **核心逻辑：`CatchClause` 节点的处理**

    这是插件的“心脏”部分。我们通过 `traverse` 找到所有的 `CatchClause` 节点（即 `catch (error) { ... }` 中的 `catch` 部分）。

    ```typescript
    traverse(ast, {
      CatchClause(path: babel.NodePath<t.CatchClause>) {
        const block = path.node.body; // 获取 catch 块的函数体

        // 检查 catch 块中是否已经有 console.error(error) 了
        const hasConsoleError = block.body.some((statement: t.Statement) => {
          return (
            t.isExpressionStatement(statement) &&
            t.isCallExpression(statement.expression) &&
            t.isMemberExpression(statement.expression.callee) &&
            t.isIdentifier(statement.expression.callee.object, { name: "console" }) &&
            t.isIdentifier(statement.expression.callee.property, { name: "error" })
          );
        });

        if (!hasConsoleError) {
          // 踩坑点 3：处理空的 catch 块和错误参数
          // 如果 catch 块没有参数 (catch {})，我们需要手动给它添加一个参数
          if (!path.node.param) {
            path.node.param = t.identifier("error"); // 添加一个名为 'error' 的标识符作为参数
          }
          const errorArg = path.node.param as t.Identifier; // 获取 catch 块的错误参数

          // 创建 console.error(errorArg) 语句
          const consoleErrorStatement = t.expressionStatement(
            t.callExpression(
              t.memberExpression(t.identifier("console"), t.identifier("error")), // console.error
              [errorArg] // 传入错误参数
            )
          );

          // 将新语句插入到 catch 块的最前面
          block.body.unshift(consoleErrorStatement);
          transformed = true;
        }
      },
    });
    ```

    **踩坑点 3：`ReferenceError: e is not defined` 或 `error is not defined`**
    这个问题是最“磨人”的。当遇到 `try { ... } catch {}` 这种没有显式错误参数的 `catch` 块时，`path.node.param` 是 `null`。如果直接尝试使用 `path.node.param` 作为 `console.error` 的参数，就会导致 `ReferenceError`。解决方案是：**在 `path.node.param` 为空时，手动创建一个 `t.identifier('error')` 并赋值给 `path.node.param`，这样 `catch` 块就会变成 `catch (error) {}`，然后我们再使用这个 `error` 标识符来构建 `console.error(error)` 语句。**

### 插件所需依赖

要让这个 `vite-plugin-try-catch-console` 插件正常工作，你需要安装以下 Babel 相关的核心依赖：

```bash
npm install --save-dev @babel/core @babel/traverse @babel/generator @babel/types @babel/plugin-transform-typescript @vue/babel-plugin-jsx
# 或者使用 yarn
yarn add --dev @babel/core @babel/traverse @babel/generator @babel/types @babel/plugin-transform-typescript @vue/babel-plugin-jsx
# 或者使用 pnpm
pnpm add --save-dev @babel/core @babel/traverse @babel/generator @babel/types @babel/plugin-transform-typescript @vue/babel-plugin-jsx
```

这些包的作用分别是：

- `@babel/core`: Babel 的核心库，用于解析和转换代码。
- `@babel/traverse`: 用于遍历 AST（抽象语法树）。
- `@babel/generator`: 用于将 AST 重新生成为代码。
- `@babel/types`: 提供了用于创建、验证和转换 AST 节点的工具函数。
- `@babel/plugin-transform-typescript`: Babel 插件，用于处理 TypeScript 语法。
- `@vue/babel-plugin-jsx`: Babel 插件，用于处理 Vue 项目中的 JSX 语法。

### 完整的 `vite-plugin-try-catch-console.ts` 文件内容

经过我们之前的“打磨”，最终的插件代码如下：

```typescript
import { Plugin } from "vite";
import * as babel from "@babel/core";
import { parse } from "@babel/core";
import _traverse from "@babel/traverse";
const traverse = typeof _traverse === "function" ? _traverse : (_traverse as any).default;
import { generate } from "@babel/generator";
import * as t from "@babel/types";

const vitePluginTryCatchConsole = (): Plugin => {
  return {
    name: "vite-plugin-try-catch-console",
    enforce: "post", // 确保在其他转换之后执行
    async transform(code, id) {
      // 1. 过滤文件类型，只处理 JS/TS/JSX/TSX/Vue 文件，并跳过 node_modules
      if (!/\.(js|ts|jsx|tsx|vue)$/.test(id) || id.includes("node_modules")) {
        return null; // 不处理这些文件
      }

      // 2. 解析代码生成 AST
      const ast = parse(code, {
        sourceType: "module",
        filename: id,
        plugins: [
          "@babel/plugin-transform-typescript", // 处理 TypeScript
          "@vue/babel-plugin-jsx", // 处理 Vue 中的 JSX
        ],
      });

      if (!ast) {
        return null;
      }

      let transformed = false; // 标记是否进行了转换

      // 3. 遍历 AST，找到 CatchClause 节点并修改
      traverse(ast, {
        CatchClause(path: babel.NodePath<t.CatchClause>) {
          const block = path.node.body; // 获取 catch 块的函数体

          // 检查 catch 块中是否已经有 console.error(error) 了
          const hasConsoleError = block.body.some((statement: t.Statement) => {
            return (
              t.isExpressionStatement(statement) &&
              t.isCallExpression(statement.expression) &&
              t.isMemberExpression(statement.expression.callee) &&
              t.isIdentifier(statement.expression.callee.object, { name: "console" }) &&
              t.isIdentifier(statement.expression.callee.property, { name: "error" })
            );
          });

          if (!hasConsoleError) {
            // 如果 catch 块没有参数 (catch {})，我们需要手动给它添加一个参数
            if (!path.node.param) {
              path.node.param = t.identifier("error"); // 添加一个名为 'error' 的标识符作为参数
            }
            const errorArg = path.node.param as t.Identifier; // 获取 catch 块的错误参数

            // 创建 console.error(errorArg) 语句
            const consoleErrorStatement = t.expressionStatement(
              t.callExpression(
                t.memberExpression(t.identifier("console"), t.identifier("error")), // console.error
                [errorArg] // 传入错误参数
              )
            );

            // 将新语句插入到 catch 块的最前面
            block.body.unshift(consoleErrorStatement);
            transformed = true;
          }
        },
      });

      // 4. 如果有修改，重新生成代码和 Source Map
      if (transformed) {
        const output = generate(ast, { sourceMaps: true, sourceFileName: id }, code);
        return { code: output.code, map: output.map };
      }

      return null; // 没有修改则返回 null
    },
  };
};

export default vitePluginTryCatchConsole;
```

### 如何在 Vite 项目中引入插件

1.  **将插件文件放置到项目根目录**

    将上述代码保存为 文件，并放置在你的 Vite 项目的根目录下（与 `vite.config.ts` 同级）。

2.  **修改 `vite.config.ts` 文件**

    打开你项目中的文件，然后按照以下方式引入并使用这个插件：

    ```typescript
    import { defineConfig } from "vite";
    import vue from "@vitejs/plugin-vue";
    import vitePluginTryCatchConsole from "./vite-plugin-try-catch-console"; // 引入你的插件

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [
        vue(),
        vitePluginTryCatchConsole(), // 在这里添加你的插件
      ],
    });
    ```

    **注意：** 插件的引入路径 `./vite-plugin-try-catch-console` 是相对于 `vite.config.ts` 文件的。确保路径正确。

3.  **运行项目**

    保存所有修改后，重新运行你的 Vite 项目：

    ```bash
    npm run dev
    ```

    现在，你的 `try...catch` 块就会被这个“尽职尽责”的插件自动注入 `console.error` 语句了！你可以尝试在 `src/App.vue` 中添加一个 `try { throw new Error('test error'); } catch {}` 这样的代码，然后打开浏览器控制台，看看是否能看到错误信息被打印出来。

希望这份详细的“使用说明书”能帮助你更好地理解和使用这个插件！

### 总结

这个 `vite-plugin-try-catch-console` 插件的实现，本质上就是利用 Babel 对 JavaScript 代码进行 AST 级别的静态分析和转换。通过精确地定位 `CatchClause` 节点，并根据需要注入 `console.error` 语句，我们实现了在编译时自动增强代码的错误日志功能。
