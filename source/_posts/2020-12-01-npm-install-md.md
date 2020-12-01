---
layout: post
title: npm安装配置
excerpt: 'npm安装配置记录'
tags: [nodejs, npm]
comments: true
date: 2020-12-01 16:49:16
---

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