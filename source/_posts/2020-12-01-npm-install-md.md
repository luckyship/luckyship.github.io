---
layout: post
title: npm安装配置
excerpt: "npm安装配置记录"
tags: [nodejs, npm]
comments: true
date: 2020-12-01 16:49:16
---

## linux 安装

```bash
tar -zvxf node-v14.tar.gz

ln -s /node-v14/bin/npm /usr/bin/npm
ln -s /node-v14/bin/npm /usr/local/bin/npm
```

## 查看 npm 配置

```bash
npm config list
```

## 代理设置

```bash
npm config set proxy=http://127.0.0.1:8087
npm config set https-proxy http://127.0.0.1:8087

// 需要用户名和密码
npm config set proxy http://username:password@server:port
npm confit set https-proxy http://username:password@server:port

// 取消代理
npm config delete proxy
npm config delete https-proxy
```

## npm 安装设置

```bash
npm config set strict-ssl false // SSL错误

npm config get registry // 查看当前源
npm config set registry https://registry.npmmirror.com/  // 设置淘宝源(已更新)
npm config set registry https://registry.npmjs.org/  // 设置官方源

npm config set sass_binary_site https://registry.npmmirror.com/mirrors/node-sass/
npm config set chromedriver_cdnurl https://cdn.npm.taobao.org/dist/chromedriver
npm config set electron_mirror https://registry.npmmirror.com/mirrors/electron/

yarn config set chromedriver_cdnurl https://cdn.npm.taobao.org/dist/chromedriver
yarn config set electron_mirror https://registry.npmmirror.com/mirrors/electron/
yarn config set registry https://registry.npmmirror.com//
yarn config set registry https://registry.yarnpkg.com
yarn config set sass_binary_site https://registry.npmmirror.com/mirrors/node-sass/
yarn config set phantomjs_cdnurl http://cnpmjs.org/downloads
yarn config set sqlite3_binary_host_mirror https://foxgis.oss-cn-shanghai.aliyuncs.com/
yarn config set profiler_binary_host_mirror https://registry.npmmirror.com/mirrors/node-inspector/

```

> 淘宝源已更新成：`https://registry.npmmirror.com/`

## npm i 和 npm install 的小区别

- 用`npm i `安装的模块无法用`npm uninstall`卸载，需要用`npm uninstall i`命令
- `npm i `会帮助检测与当前 node 版本最匹配的 npm 包 版本号，并匹配出来相互依赖的 npm 包应该提升的版本号
- 部分`npm`包在当前 node 版本下无法使用，必须使用建议版本
- 安装报错时 intall 肯定会出现`npm-debug.log `文件，`npm i`不一定

## npm install 的执行过程

1. 发出`npm install`命令
2. 查询 `node_modules` 目录之中是否已经存在指定模块
3. 若存在，不再重新安装
4. 若不存在`npm` 向 `registry` 查询模块压缩包的网址下载压缩包，存放在根目录下的.npm 目录里
5. 解压压缩包到当前项目的 `node_modules` 目录

> 如果有 `package-lock.json`，会优先按照 `package-lock.json` 中的版本来安装包

## npm 中的版本指定方式

- 指定版本：比如 `1.2.2` ，遵循“`大版本.次要版本.小版本`”的格式规定，安装时只安装指定版本。
- 波浪号（tilde）+指定版本：比如 `~1.2.2` ，表示安装 `1.2.x` 的最新版本（不低于 `1.2.2`），但是不安装 `1.3.x`，也就是说安装时不改变大版本号和次要版本号。
- 插入号（caret）+指定版本：比如 `ˆ1.2.2`，表示安装 `1.x.x` 的最新版本（不低于 `1.2.2`），但是不安装 `2.x.x`，也就是说安装时不改变大版本号。需要注意的- 是，如果大版本号为 0，则插入号的行为与波浪号相同，这是因为此时处于开发阶段，即使是次要版本号变动，也可能带来程序的不兼容。
- latest：安装最新版本。

## package.lock 的作用

### 5.0.x 版本：

不管 `package.json` 中依赖是否有更新，`npm install` 都会根据 `package-lock.json` 下载。针对这种安装策略，有人提出了这个 issue[6] ，然后就演变成了 5.1.0 版本后的规则。

### 5.1.0 版本后：

当 `package.json` 中的依赖项有新版本时，`npm install` 会无视 `package-lock.json` 去下载新版本的依赖项并且更新 `package-lock.json`。针对这种安装策略，又有人提出了一个 issue[7] 参考 npm 贡献者 iarna 的评论，得出 5.4.2 版本后的规则。

### 5.4.2 版本后：

如果只有一个 `package.json` 文件，运行 `npm install` 会根据它生成一个 `package-lock.json` 文件，这个文件相当于本次 install 的一个快照，它不仅记录了 `package.json` 指明的直接依赖的版本，也记录了间接依赖的版本。

如果 `package.json` 的 semver-range version 和 `package-lock.json` 中版本兼容(`package-lock.json` 版本在 `package.json` 指定的版本范围内)，即使此时 `package.json` 中有新的版本，执行 `npm install` 也还是会根据 `package-lock.json` 下载。

如果手动修改了 `package.json` 的 version ranges，且和 `package-lock.json` 中版本不兼容，那么执行 `npm install` 时 `package-lock.json` 将会更新到兼容 `package.json` 的版本。

## yarn

`yarn` 的出现主要目标是解决由于语义版本控制而导致的 npm 安装的不确定性问题。虽然可以使用 `npm shrinkwrap` 来实现可预测的依赖关系树，但它并不是默认选项，而是取决于所有的开发人员知道并且启用这个选项。yarn 采取了不同的做法。每个 `yarn` 安装都会生成一个类似于`npm-shrinkwrap.json` 的 yarn.lock 文件，而且它是默认创建的。除了常规信息之外，`yarn.lock` 文件还包含要安装的内容的校验和，以确保使用的库的版本相同。

### yarn 的主要优化

`yarn` 的出现主要做了如下优化：

- `并行安装`：无论 npm 还是 `yarn` 在执行包的安装时，都会执行一系列任务。npm 是按照队列执行每个 package，也就是说必须要等到当前 package 安装完成之后，才能继续后面的安装。而 `yarn` 是同步执行所有任务，提高了性能。
- `离线模式`：如果之前已经安装过一个软件包，用 `yarn` 再次安装时之间从缓存中获取，就不用像 npm 那样再从网络下载了。
- `安装版本统一`：为了防止拉取到不同的版本，`yarn` 有一个锁定文件 (lock file) 记录了被确切安装上的模块的版本号。每次只要新增了一个模块，`yarn` 就会创建（或更新）`yarn.lock` 这个文件。这么做就保证了，每一次拉取同一个项目依赖时，使用的都是一样的模块版本。
- `更好的语义化`：`yarn` 改变了一些 npm 命令的名称，比如 `yarn add/remove`，比 `npm` 原本的 `install/uninstall` 要更清晰。

### [参考](https://mp.weixin.qq.com/s/LfYHSiTSNjDndvzRNTU_sA)
