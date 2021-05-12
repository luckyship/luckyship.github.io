---
layout: post
title: npm安装配置
excerpt: 'npm安装配置记录'
tags: [nodejs, npm]
comments: true
date: 2020-12-01 16:49:16
---

## linux安装
```
tar -zvxf node-v14.tar.gz

ln -s /node-v14/bin/npm /usr/bin/npm
ln -s /node-v14/bin/npm /usr/local/bin/npm
```

## 查看npm配置
```
npm config list
```

## 代理设置
```
npm config set proxy=http://127.0.0.1:8087
npm config set https-proxy http://127.0.0.1:8087

// 需要用户名和密码
npm config set proxy http://username:password@server:port
npm confit set https-proxy http://username:password@server:port

// 取消代理
npm config delete proxy
npm config delete https-proxy
```

## npm安装设置
```
npm config set strict-ssl false // SSL错误

npm config get registry // 查看当前源
npm config set registry https://registry.npm.taobao.org  // 设置淘宝源
npm config set registry https://registry.npmjs.org/  // 设置官方源

npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
npm config set chromedriver_cdnurl https://cdn.npm.taobao.org/dist/chromedriver
npm config set electron_mirror https://npm.taobao.org/mirrors/electron/


yarn config set chromedriver_cdnurl https://cdn.npm.taobao.org/dist/chromedriver
yarn config set electron_mirror https://npm.taobao.org/mirrors/electron/
yarn config set registry https://registry.npm.taobao.org/
yarn config set registry https://registry.yarnpkg.com
yarn config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
yarn config set phantomjs_cdnurl http://cnpmjs.org/downloads
yarn config set sqlite3_binary_host_mirror https://foxgis.oss-cn-shanghai.aliyuncs.com/
yarn config set profiler_binary_host_mirror https://npm.taobao.org/mirrors/node-inspector/

```

## npm i 和 npm install的小区别
* 用`npm i `安装的模块无法用`npm uninstall`卸载，需要用`npm uninstall i`命令
* `npm i `会帮助检测与当前node版本最匹配的npm包 版本号，并匹配出来相互依赖的npm包应该提升的版本号
* 部分`npm`包在当前node版本下无法使用，必须使用建议版本
* 安装报错时intall肯定会出现`npm-debug.log `文件，`npm i`不一定

## npm install 的执行过程
1. 发出`npm install`命令
2. 查询 `node_modules` 目录之中是否已经存在指定模块
3. 若存在，不再重新安装
4. 若不存在`npm` 向 `registry` 查询模块压缩包的网址下载压缩包，存放在根目录下的.npm目录里
5. 解压压缩包到当前项目的 `node_modules` 目录