---
title: "使用hexo在github上搭建博客"
date: 2020-10-07
excerpt: "hexo搭建博客流程，开发过程介绍."
tags: [hexo, web]
---

## 环境准备
* npm >= 6.14.8
* hexo >= 4.2.0
* hexo主题[yilia](https://github.com/luckyship/myblog.git)

## 部署应用
创建目录`hexo`，进入目录，执行命令
```
$ hexo init
$ ls
_config.yml  node_modules/  package-lock.json  scaffolds/  themes/
db.json      package.json   public/            source/
```
修改`_config.yml`，将其中的`theme`字段修改为`lucky`
```
$ cat _config.yml
theme: lucky
```
进入`themes`目录，克隆hexo主题仓库（注意名字为theme字段的修改值）
```
git clone https://github.com/luckyship/myblog.git ./lucky
```
退回hexo主目录，执行
```
hexo generate
hexo sever
```
即可看到web服务已经启动，端口默认为4000，访问`localhost:4000`即可

## 开发应用
### 修改主题代码
例如`css,js,html`等，需要重新打包主题代码
```
$ npm run dev
```
再清除hexo缓存，重新打包到hexo上
```
$ hexo c // 清除所有缓存
$ hexo g // 打包格式化md文件
$ hexo s // 本地环境
```
### 添加md文件
添加的文件可以实时显现到web上
```
$ hexo s -g --debug
```
### 上传至github
安装包
```
npm install hexo-deployer-git --save
```
在`_config.yml`中添加
```
deploy:
  type: git
  repo: git@github.com:luckyship/luckyship.github.io.git
  branch: main
  message: 'collect new post'
```
执行命令，`deploy`上传的每次`generate`过后的文件，所以上传之前需要`generate`
```
$ hexo g
$ hexo deploy
```