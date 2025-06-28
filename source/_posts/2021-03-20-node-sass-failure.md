---
layout: post
title: node-sass安装失败问题汇总
tags: [npm, nodejs, sass]
comments: true
date: 2021-03-20 17:17:45
---

`node-scss` 是我们常见的依赖包，但是安装的时候， `node-scss` 总是报错，特地汇总一下，以避免踩坑

<!-- more -->

## npm 源速度慢

由于众所周知的国内网络环境，从国内安装官方源的依赖包会很慢。可以将 npm 源设置成国内镜像源(如淘宝 npm)：

```bash
npm config set registry https://registry.npm.taobao.org
```

或者通过 `.npmrc` 文件设置:

```bash
// .npmrc
registry=https://registry.npm.taobao.org/
```

## binding.node 源无法访问或速度慢

`node-sass` 除了 npm 部分的代码，还会下载二进制文件 `binding.node` ，默认源是 github，国内访问较慢, 特殊时期甚至无法访问。我们也可以将其改成国内源：

```bash
// linux、mac 下
SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ npm install node-sass

// window 下
set SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ && npm install node-sass
```

有类似问题的还有 chromedriver, phantomjs, electron 等常见依赖包, 我们可以一并写到.npmrc 中:

```bash
// .npmrc
sass_binary_site=https://npm.taobao.org/mirrors/node-sass
chromedriver_cdnurl=https://npm.taobao.org/mirrors/chromedriver
phantomjs_cdnurl=https://npm.taobao.org/mirrors/phantomjs
electron_mirror=https://npm.taobao.org/mirrors/electron
```

可以参考[npm 安装](https://luckyship.github.io/2020/12/01/2020-12-01-npm-install-md)

## node 版本与 node-sass 版本不兼容

node-sass 版本兼容性并不好，老项目中依赖的 node-sass 很可能已经不兼容新的 node，对应版本兼容如下(或参考[官方仓库](https://github.com/sass/node-sass))：

| NodeJS  | Minimum node-sass version | Node Module |
| ------- | :-----------------------: | ----------- |
| Node 8  |          4.5.3+           | 57          |
| Node 13 |           4.13+           | 79          |
| Node 12 |           4.12+           | 72          |
| Node 11 |           4.10+           | 67          |
| Node 10 |           4.9+            | 64          |

## 缓存中 binding.node 版本不一致

假如本地 node 版本改了，或在不同机器上运行，node 版本不一致，会报类似错误：

```
Found bindings for the following environments:
  - Windows 64-bit with Node.js 6.x
```

这是因为原有 `binding.node` 缓存跟现 node 版本不一致。按提示 `npm rebuild node-sass` 或清除缓存重新安装即可。

## 安装失败后重新安装

安装失败后重新安装，有可能无权限删除已安装内容，此时 `npm uninstall node-sass` 或手动删掉原目录后再安装即可。

## 提示没有安装 python、build 失败等

假如拉取 `binding.node` 失败，node-sass 会尝试在本地编译 `binding.node` ，过程就需要 `python` 。假如你遇到前面几种情况解决了，实际上也不会出现在本地构建的情况了，我们就不谈这种失败中失败的情况吧 :-)
