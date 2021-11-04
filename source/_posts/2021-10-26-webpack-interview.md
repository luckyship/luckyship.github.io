---
layout: post
title: 2021-10-26-webpack-interview
tags: []
comments: true
date: 2021-10-26 15:15:01
---

# [关于 webpack 的面试题](https://www.cnblogs.com/gaoht/p/11310365.html)

随着现代前端开发的复杂度和规模越来越庞大，已经不能抛开工程化来独立开发了，如 react 的 jsx 代码必须编译后才能在浏览器中使用；又如 sass 和 less 的代码浏览器也是不支持的。 而如果摒弃了这些开发框架，那么开发的效率将大幅下降。在众多前端工程化工具中，webpack 脱颖而出成为了当今最流行的前端构建工具。 然而大多数的使用者都只是单纯的会使用，而并不知道其深层的原理。希望通过以下的面试题总结可以帮助大家温故知新、查缺补漏，知其然而又知其所以然。

## 问题一览

1.  webpack 与 grunt、gulp 的不同？
2.  与 webpack 类似的工具还有哪些？谈谈你为什么最终选择（或放弃）使用 webpack？
3.  有哪些常见的 Loader？他们是解决什么问题的？
4.  有哪些常见的 Plugin？他们是解决什么问题的？
5.  Loader 和 Plugin 的不同？
6.  webpack 的构建流程是什么?从读取配置到输出文件这个过程尽量说全
7.  是否写过 Loader 和 Plugin？描述一下编写 loader 或 plugin 的思路？
8.  webpack 的热更新是如何做到的？说明其原理？
9.  如何利用 webpack 来优化前端性能？（提高性能和体验）
10. 如何提高 webpack 的构建速度？
11. 怎么配置单页应用？怎么配置多页应用？
12. npm 打包时需要注意哪些？如何利用 webpack 来更好的构建？
13. 如何在 vue 项目中实现按需加载？

## 问题解答

### 1\. webpack 与 grunt、gulp 的不同？

三者都是前端构建工具，grunt 和 gulp 在早期比较流行，现在 webpack 相对来说比较主流，不过一些轻量化的任务还是会用 gulp 来处理，比如单独打包 CSS 文件等。

grunt 和 gulp 是基于任务和流（Task、Stream）的。类似 jQuery，找到一个（或一类）文件，对其做一系列链式操作，更新流上的数据， 整条链式操作构成了一个任务，多个任务就构成了整个 web 的构建流程。

webpack 是基于入口的。webpack 会自动地递归解析入口所需要加载的所有资源文件，然后用不同的 Loader 来处理不同的文件，用 Plugin 来扩展 webpack 功能。

所以总结一下：

- 从构建思路来说

gulp 和 grunt 需要开发者将整个前端构建过程拆分成多个\`Task\`，并合理控制所有\`Task\`的调用关系 webpack 需要开发者找到入口，并需要清楚对于不同的资源应该使用什么 Loader 做何种解析和加工

- 对于知识背景来说

gulp 更像后端开发者的思路，需要对于整个流程了如指掌 webpack 更倾向于前端开发者的思路

### 2\. 与 webpack 类似的工具还有哪些？谈谈你为什么最终选择（或放弃）使用 webpack？

同样是基于入口的打包工具还有以下几个主流的：

- webpack
- rollup
- parcel

**从应用场景上来看：**

- webpack 适用于大型复杂的前端站点构建
- rollup 适用于基础库的打包，如 vue、react
- parcel 适用于简单的实验性项目，他可以满足低门槛的快速看到效果

由于 parcel 在打包过程中给出的调试信息十分有限，所以一旦打包出错难以调试，所以不建议复杂的项目使用 parcel

### 3.有哪些常见的 Loader？他们是解决什么问题的？

- file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
- url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去
- source-map-loader：加载额外的 Source Map 文件，以方便断点调试
- image-loader：加载并且压缩图片文件
- babel-loader：把 ES6 转换成 ES5
- css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
- style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS。
- eslint-loader：通过 ESLint 检查 JavaScript 代码

### 4.有哪些常见的 Plugin？他们是解决什么问题的？

- define-plugin：定义环境变量
- commons-chunk-plugin：提取公共代码
- uglifyjs-webpack-plugin：通过 UglifyES 压缩 ES6 代码

### 5.Loader 和 Plugin 的不同？

**不同的作用**

- **Loader**直译为"加载器"。Webpack 将一切文件视为模块，但是 webpack 原生是只能解析 js 文件，如果想将其他文件也打包的话，就会用到 loader。 所以 Loader 的作用是让 webpack 拥有了加载和解析非 JavaScript 文件的能力。
- **Plugin**直译为"插件"。Plugin 可以扩展 webpack 的功能，让 webpack 具有更多的灵活性。 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

**不同的用法**

- **Loader**在 module.rules 中配置，也就是说他作为模块的解析规则而存在。 类型为数组，每一项都是一个 Object，里面描述了对于什么类型的文件（test），使用什么加载(loader)和使用的参数（options）
- **Plugin**在 plugins 中单独配置。 类型为数组，每一项是一个 plugin 的实例，参数都通过构造函数传入。

### 6.webpack 的构建流程是什么?从读取配置到输出文件这个过程尽量说全

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

1.  初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
2.  开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
3.  确定入口：根据配置中的 entry 找出所有的入口文件；
4.  编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
5.  完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
6.  输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
7.  输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

### 7.是否写过 Loader 和 Plugin？描述一下编写 loader 或 plugin 的思路？

Loader 像一个"翻译官"把读到的源文件内容转义成新的文件内容，并且每个 Loader 通过链式操作，将源文件一步步翻译成想要的样子。

编写 Loader 时要遵循单一原则，每个 Loader 只做一种"转义"工作。 每个 Loader 的拿到的是源文件内容（source），可以通过返回值的方式将处理后的内容输出，也可以调用 this.callback()方法，将内容返回给 webpack。 还可以通过 this.async()生成一个 callback 函数，再用这个 callback 将处理后的内容输出出去。 此外 webpack 还为开发者准备了开发 loader 的工具函数集——loader-utils。

相对于 Loader 而言，Plugin 的编写就灵活了许多。 webpack 在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

### 8.webpack 的热更新是如何做到的？说明其原理？

webpack 的热更新又称热替换（Hot Module Replacement），缩写为 HMR。 这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

原理：

首先要知道 server 端和 client 端都做了处理工作

1.  第一步，在 webpack 的 watch 模式下，文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的 JavaScript 对象保存在内存中。
2.  第二步是 webpack-dev-server 和 webpack 之间的接口交互，而在这一步，主要是 dev-server 的中间件 webpack-dev-middleware 和 webpack 之间的交互，webpack-dev-middleware 调用 webpack 暴露的 API 对代码变化进行监控，并且告诉 webpack，将代码打包到内存中。
3.  第三步是 webpack-dev-server 对文件变化的一个监控，这一步不同于第一步，并不是监控代码变化重新打包。当我们在配置文件中配置了 devServer.watchContentBase 为 true 的时候，Server 会监听这些配置文件夹中静态文件的变化，变化后会通知浏览器端对应用进行 live reload。注意，这儿是浏览器刷新，和 HMR 是两个概念。
4.  第四步也是 webpack-dev-server 代码的工作，该步骤主要是通过 sockjs（webpack-dev-server 的依赖）在浏览器端和服务端之间建立一个 websocket 长连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端，同时也包括第三步中 Server 监听静态文件变化的信息。浏览器端根据这些 socket 消息进行不同的操作。当然服务端传递的最主要信息还是新模块的 hash 值，后面的步骤根据这一 hash 值来进行模块热替换。
5.  webpack-dev-server/client 端并不能够请求更新的代码，也不会执行热更模块操作，而把这些工作又交回给了 webpack，webpack/hot/dev-server 的工作就是根据 webpack-dev-server/client 传给它的信息以及 dev-server 的配置决定是刷新浏览器呢还是进行模块热更新。当然如果仅仅是刷新浏览器，也就没有后面那些步骤了。
6.  HotModuleReplacement.runtime 是客户端 HMR 的中枢，它接收到上一步传递给他的新模块的 hash 值，它通过 JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，服务端返回一个 json，该 json 包含了所有要更新的模块的 hash 值，获取到更新列表后，该模块再次通过 jsonp 请求，获取到最新的模块代码。这就是上图中 7、8、9 步骤。
7.  而第 10 步是决定 HMR 成功与否的关键步骤，在该步骤中，HotModulePlugin 将会对新旧模块进行对比，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用。
8.  最后一步，当 HMR 失败后，回退到 live reload 操作，也就是进行浏览器刷新来获取最新打包代码。

### 9.如何利用 webpack 来优化前端性能？（提高性能和体验）

用 webpack 优化前端性能是指优化 webpack 的输出结果，让打包的最终结果在浏览器运行快速高效。

- 压缩代码。删除多余的代码、注释、简化代码的写法等等方式。可以利用 webpack 的 UglifyJsPlugin 和 ParallelUglifyPlugin 来压缩 JS 文件， 利用 cssnano（css-loader?minimize）来压缩 css
- 利用[CDN](https://cloud.tencent.com/product/cdn?from=10680)加速。在构建过程中，将引用的静态资源路径修改为 CDN 上对应的路径。可以利用 webpack 对于 output 参数和各 loader 的 publicPath 参数来修改资源路径
- 删除死代码（Tree Shaking）。将代码中永远不会走到的片段删除掉。可以通过在启动 webpack 时追加参数--optimize-minimize 来实现
- 提取公共代码。

### 10.如何提高 webpack 的构建速度？

1.  多入口情况下，使用 CommonsChunkPlugin 来提取公共代码
2.  通过 externals 配置来提取常用库
3.  利用 DllPlugin 和 DllReferencePlugin 预编译资源模块 通过 DllPlugin 来对那些我们引用但是绝对不会修改的 npm 包来进行预编译，再通过 DllReferencePlugin 将预编译的模块加载进来。
4.  使用 Happypack 实现多线程加速编译
5.  使用 webpack-uglify-parallel 来提升 uglifyPlugin 的压缩速度。 原理上 webpack-uglify-parallel 采用了多核并行压缩来提升压缩速度
6.  使用 Tree-shaking 和 Scope Hoisting 来剔除多余代码

### 11.怎么配置单页应用？怎么配置多页应用？

单页应用可以理解为 webpack 的标准模式，直接在 entry 中指定单页应用的入口即可，这里不再赘述

多页应用的话，可以使用 webpack 的 AutoWebPlugin 来完成简单自动化的构建，但是前提是项目的目录结构必须遵守他预设的规范。 多页应用中要注意的是：

- 每个页面都有公共的代码，可以将这些代码抽离出来，避免重复的加载。比如，每个页面都引用了同一套 css 样式表
- 随着业务的不断扩展，页面可能会不断的追加，所以一定要让入口的配置足够灵活，避免每次添加新页面还需要修改构建配置

### 12.npm 打包时需要注意哪些？如何利用 webpack 来更好的构建？

Npm 是目前最大的 JavaScript 模块仓库，里面有来自全世界开发者上传的可复用模块。你可能只是 JS 模块的使用者，但是有些情况你也会去选择上传自己开发的模块。 关于 NPM 模块上传的方法可以去官网上进行学习，这里只讲解如何利用 webpack 来构建。

NPM 模块需要注意以下问题：

1.  要支持 CommonJS 模块化规范，所以要求打包后的最后结果也遵守该规则。
2.  Npm 模块使用者的环境是不确定的，很有可能并不支持 ES6，所以打包的最后结果应该是采用 ES5 编写的。并且如果 ES5 是经过转换的，请最好连同 SourceMap 一同上传。
3.  Npm 包大小应该是尽量小（有些仓库会限制包大小）
4.  发布的模块不能将依赖的模块也一同打包，应该让用户选择性的去自行安装。这样可以避免模块应用者再次打包时出现底层模块被重复打包的情况。
5.  UI 组件类的模块应该将依赖的其它资源文件，例如.css 文件也需要包含在发布的模块里。

基于以上需要注意的问题，我们可以对于 webpack 配置做以下扩展和优化：

1.  CommonJS 模块化规范的解决方案： 设置 output.libraryTarget='commonjs2'使输出的代码符合 CommonJS2 模块化规范，以供给其它模块导入使用
2.  输出 ES5 代码的解决方案：使用 babel-loader 把 ES6 代码转换成 ES5 的代码。再通过开启 devtool: 'source-map'输出 SourceMap 以发布调试。
3.  Npm 包大小尽量小的解决方案：Babel 在把 ES6 代码转换成 ES5 代码时会注入一些辅助函数，最终导致每个输出的文件中都包含这段辅助函数的代码，造成了代码的冗余。解决方法是修改.babelrc 文件，为其加入 transform-runtime 插件
4.  不能将依赖模块打包到 NPM 模块中的解决方案：使用 externals 配置项来告诉 webpack 哪些模块不需要打包。
5.  对于依赖的资源文件打包的解决方案：通过 css-loader 和 extract-text-webpack-plugin 来实现，配置如下：

### 13.如何在 vue 项目中实现按需加载？

Vue UI 组件库的按需加载 为了快速开发前端项目，经常会引入现成的 UI 组件库如 ElementUI、iView 等，但是他们的体积和他们所提供的功能一样，是很庞大的。 而通常情况下，我们仅仅需要少量的几个组件就足够了，但是我们却将庞大的组件库打包到我们的源码中，造成了不必要的开销。

不过很多组件库已经提供了现成的解决方案，如 Element 出品的 babel-plugin-component 和 AntDesign 出品的 babel-plugin-import 安装以上插件后，在.babelrc 配置中或 babel-loader 的参数中进行设置，即可实现组件按需加载了。

单页应用的按需加载 现在很多前端项目都是通过单页应用的方式开发的，但是随着业务的不断扩展，会面临一个严峻的问题——首次加载的代码量会越来越多，影响用户的体验。

通过 import(\*)语句来控制加载时机，webpack 内置了对于 import(\*)的解析，会将 import(\*)中引入的模块作为一个新的入口在生成一个 chunk。 当代码执行到 import(\*)语句时，会去加载 Chunk 对应生成的文件。import()会返回一个 Promise 对象，所以为了让浏览器支持，需要事先注入 Promise polyfill

### webpack 示例

```js
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin'); // 用terser-webpack-plugin替换掉uglifyjs-webpack-plugin解决uglifyjs不支持es6语法问题

const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

process.env.NODE_ENV = 'production'; // 定义nodejs环境变量，设置browserslist使用哪个参数

/**
 * 开发环境性能优化：
 * 优化打包速度：
 * # HMR
 * 优化代码调试：
 * # source-map
 *
 * 生产环境性能优化：
 * 1. 优化打包构建速度
 * # oneOf
 * # babel缓存
 * # 多进程打包
 * # externals (CDN链接)
 * # dll
 *
 *
 * 2. 优化代码运行时的性能
 * # 缓存（hash/chunkhash/contenthash）
 * # tree shaking 去除代码中没有用的代码，减少打包体积
 * # 代码分割
 * # 懒加载、预加载
 * # pwa
 * #
 */

/**
 * 缓存：最终确定使用contenthash
 * 1. babel缓存：--> 让第二次打包构建速度更快
 *      cacheDirectory: true
 * 2. 文件资源缓存：--> 让代码上线运行缓存使用
 *      hash 使用hash值做缓存，文件资源缓存，每次webpack构建打包生成的hash值
 *      问题： 重新打包所有缓存失效，css和js同时使用一个hash
 *      chunkhash: 根据chunk生成的hash值，如果打包来源一个chunk，则hash值一样
 *      问题：css是js中被引入的，所以同属于一个chunk
 *      contenthash: 根据文件的内容生成hash，不同的文件hash值不一样
 */

/**
 * tree shaking: 去除无用代码，减少打包体积
 * 前提：1. 必须使用ES6模块化；2. 开启production模式
 * 在package.json中配置
 * "sideEffects": false, // 所有代码都没有副作用（都可以进行tree shaking)
 *  问题：可能把css/@babel/polyfill （副作用）文件干掉
 * "sideEffects": ["*.css", "*.less"] // 不会把css文件当副作用文件
 */

/**
 * PWA: 渐进式网络开发应用程序（离线可访问）
 * workbox --> workbox-webpack-plugin
 */

/**
 * 多进程
 * 进程启动大概600ms,进程通信也有开销，只有工作销毁时间比较长才需要多进程打包
 * js代码： 使用 thread-loader 在最后使用该loader
 */

/**
 * DLL: 对某些第三方的库（jQuery, react, vue...）进行单独打包
 * 需要新创建一个配置文件webpack.dll.js
 * 运行webpack 默认查找webpack.config.js文件
 * 运行webpack.dll.js需要制定配置文件 --> webpack --config webpack.dll.js
 * module.exports = {
    entry: {
        // 最终打包生成的[name]
        jquery: ['jquery']
    },
    output: {
        path: path.join(__dirname, 'dll'),
        filename: '[name].js',
        library: '[name]_[hash]'
    },
    plugins: {
        // 打包生成一个manifest.json文件-->提供和jquery的映射
        new webpack.DllPlugin({
            name: '[name]_[hash]', // 映射库的暴露的内容的名称
            path: path.join(__dirname, 'dll/manifest.json') // 输出文件路径
        })
    }
};
 */

// 复用cssloader
const commonCssLoader = [
  // 'style-loader', // 创建style标签，将js中的样式资源进行插入，添加到head中生效
  MiniCssExtractPlugin.loader, // 替换'style-loader'，提取js中的css成单独文件
  'css-loader', // 将css文件变成commonjs模块加载到js中，里面内容是样式字符串
  {
    /**还需要再package.json这两年个定义 browserslist
     * "browserslist": {
     *   "development": [
     *      "last 1 chrome version",
     *      "last 1 firefox version",
     *      "last 1 safari version",
     *    ],
     *    "production": [
     *      ">0.2%",
     *      "not dead",
     *      "not op_mini all"
     *     ]
     * }
     * */
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => {
        require('postcss-preset-env')();
      },
    },
  },
];

module.exports = {
  // 入口起点
  entry: path.join(__dirname, 'src/index.js'), // 单入口
  // entry: { // 多入口：几个入口就有几个bundle
  //     app: path.join(__dirname, 'src/index.js'),
  // },
  // 输出
  output: {
    // 输出文件目录
    path: path.join(__dirname, 'dist'),
    // 文件名称
    filename: 'js/[name].[contenthash:10].js',
    // 所有资源引入公共路径前缀--> 用于生产环境
    publicPath: '/',
    chunkFilename: 'js/[name].[contenthash:10]_chunk.js', // 非入口chunk的名称
    library: '[name]', // 整个库向外暴露的变量名
    libraryTarget: 'window', // 变量名添加到哪一个上 browser; 'global'(node)/'commonjs'
  },
  /**
   * 代码分割：chunk表示一个文件 chunk表示一个文件
   * 1. 将node_modules中的代码单独打包成一个chunk最终输出
   * 2. 自动分析多入口chunk中，有没有公共的文件，如果有会打包成单独的一个chunk
   */
  optimization: {
    // 配置生产环境的
    minimizer: [
      // 配置生产环境的压缩方案：js和css
      new TerserWebpackPlugin({
        cache: true, // 开启缓存
        parallel: true, // 开启多进程打包
        sourceMap: true,
      }),
    ],
    // 一定要加: 将当前模块的记录其他模块的hash单独打包成为一个runtime
    // 解决：修改a文件导致b文件的contenthash变化
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
    splitChunks: {
      chunks: 'all',
      minSize: 30 * 1024, // 分割的chunk最小为30kb，小于30kb不提取
      maxSize: 0, // 无最大的限制
      minChunks: 1, // 要提取的chunk最少被引用一次
      maxAsyncRequests: 5, // 按需加载时并行加载的文件的最大数量
      maxInitialRequests: 3, // 入口js文件最大并行请求数量
      automaticNameDelimiter: '~', // 名称连接符
      name: true, // 可以使用命名规则
      cacheGroups: {
        // 分割chunk的组
        // node_modules文件会被打包到vendors组的chunk中
        // 满足上面的公共规则
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 优先级
        },
        default: {
          minChunks: 2, // 要提取的chunk至少被引用2次
          prority: -20,
          reuseExistingChunk: true, // 如果当前要打包的模块和之前已经被提取的模块是用一个就会复用，不会重新打包模块
        },
      },
    },
  },
  externals: {
    // 使用CDN: 拒绝jQuery被打包进来（忽略的库名，npm包名），需要手动引入进来使用CDN，速度更快
    // 不适用CDN可以使用DLL
    jquery: 'jquery',
  },
  // 解析模块的规则
  resolve: {
    // 配置解析模块的路径别名: 简写路径，缺点是路径没有提示
    alias: {
      $css: path.join(__dirname, 'src/css'),
    },
    // 配置省略文件路径的后缀名
    extensions: ['.js', '.json', '.jsx'],
    // 告诉webpack 解析模块去哪个目录找
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        /** 语法检查：-->eslint-loader eslint
         * 只检查源代码, 设置检查规则package.json 中的 eslintConfig
         * "eslintConfig": {
         *   "extends": "airbnb-base"
         * }
         * airbnb--> eslint eslint-config-airbnb-base eslint-plugin-import
         */
        test: '/.js$/',
        loader: 'eslint-loader',
        enforce: 'pre', // pre: 优先执行; post: 推迟执行
        exculde: /node_modules/, // 排除一些文件
        include: path.join(__dirname, 'src'), // 只检查src目录下的
        options: {
          fix: true,
        },
      },
      // 以下loader只会匹配一个，注意不能有两个配置处理同一种类型的文件
      {
        oneOf: [
          {
            /** js兼容性处理：
             *  1. 基本js兼容性: --> babel-loader @babel/core @babel/preset-env
             *     问题：只能转换基本语法，如promise不能转换
             *  2. 全部js兼容性处理：--> @babel/polyfill
             *     在index.js 中 import '@babel/polyfill'既可
             *     问题：将所有兼容性代码全部引入，体积太大
             *  3. 需要做兼容性处理的就做：按需加载 --> core-js
             * */
            test: '/.js$/',
            exclude: '/node_modules/',
            use: [
              {
                loader: 'thread-loader', // 开启多进程打包
                options: {
                  workers: 2,
                },
              },
              {
                loader: 'babel-loader',
                options: {
                  // 预设：指示babel做怎么样的兼容性处理
                  presets: [
                    '@babel/preset-env', // 方法1
                    {
                      // 方法3-按需加载（不能使用方法2 @babel/polyfill）
                      useBuiltIns: 'usage',
                      corejs: {
                        // 指定core-js版本
                        version: 3,
                      },
                      // 兼容的浏览器版本
                      targets: {
                        chrome: '60',
                        firefox: '60',
                        ie: '9',
                        safari: '10',
                        egde: '17',
                      },
                    },
                  ],
                  // 开启babel缓存，第二次构建时会读取之前的缓存
                  cacheDirectory: true,
                },
              },
            ],
          },
          {
            // 处理css资源
            test: '/.css$/',
            use: [
              // use数组中loader 执行顺序：从右向左，从下向上依次执行
              ...commonCssLoader,
            ],
          },
          {
            // 处理less资源
            test: '/.less$/',
            use: [
              // 需要下载 --> less-loader less
              ...commonCssLoader,
              'less-loader', // 将less文件编译成css文件
            ],
          },
          {
            // 处理图片资源
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            // 默认处理不了html中的img图片
            // 下载-- > url-loader file-loader
            loader: 'url-loader',
            options: {
              outputPath: 'img/', // 图片输出的路径
              limit: 5 * 1024, // 图片大小小于5kb，就会被base64处理，优点：减少请求数量；缺点：图片体积会更大
              // url-loader默认使用es6模块化解析，html-loader引入图片是commonjs，解析会出问题
              esModule: false,
            },
          },
          {
            test: '/.html$/',
            // 处理html中的umg图片（负责引入img，从而被url-loader处理）
            // 下载 --> html-loader
            loader: 'html-loader',
          },
          {
            // 打包其他资源（除了html/js/css以外资源)
            exclude: /\.(css|js|html|less)$/,
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash:10].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // 默认创建空的HTML，自动引入打包输出的所有资源
    new HtmlWebpackPlugin({
      // 复制template的html文件，自动引入打包输出的所有资源
      template: 'src/index.html',
      // html压缩
      minify: {
        collapseWhitespace: true, // 移除空格
        removeComments: true, //移除注释
      },
    }),
    // css提取成单独文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:10].css',
    }),
    // 压缩css
    new OptimizeCssAssetsPlugin(),
    new WorkboxWebpackPlugin({
      /**
       * 1. 帮助serviceworker快速启动
       * 2. 删除旧的 serviceworker
       *  生产一个serviceworker配置文件
       */
      clientClaim: true,
      skipWaiting: true,
    }),
    // 告诉webpack 哪些库不参与打包, 同时使用时的名称也得改变
    new webpack.DllReferencePlugin({
      manifest: path.join(__dirname, 'dll/manifest.json'),
    }),
    // 将某个文件打包输出出去，并在html中自动引入该资源
    new AddAssetHtmlWebpackPlugin({
      filename: path.join(__dirname, 'dll/jquery.js'),
    }),
  ],
  mode: 'development', // 'production', // 生产环境自动压缩js代码
  devServer: {
    // 开发服务器：自动化编译，自动化刷新浏览器等
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true, // 检视contentBase目录下的所有文件，一点文件变化就reload
    watchOptions: {
      // 忽略监视文件
      ignored: /node_modules/,
    },
    compress: true, // 启动gzip压缩
    port: 3000, // 指定端口号
    host: '0.0.0.0', // 指定域名 localhost
    open: true,
    hot: true, // 热替换 开启HMR功能
    stats: { colors: true },
    clientLogLevel: 'none', // 不要显示启动服务器日志信息
    quiet: true, // 除一些基本启动信息以外，其他内容不要展示
    overlay: false, //如果出错不要全屏提示
    // 服务器代理，解决开发环境的跨域问题
    prxoy: {
      // 一旦接受到/api/xxx 穷奇就会转发到另一个服务器3000
      '/api': {
        target: 'http://localhost:3000',
        // 发生请求时，请求路径重写，去掉api
        pathRewrite: {
          '^api': '',
        },
      },
    },
  },
  devtool: 'source-map', // 'eval-source-map'
};
```
