---
layout: post
title: "apt命令的一些使用方法"
date: 2020-09-27
excerpt: "debian系列（ubuntu）的apt命令"
tags: [linux, debian, ubuntu]
comments: true
---

```bash
apt-cache madison xxx             // 查看软件包可以安装的版本
apt download xxx                  // 只下载deb包，不安装
```

## apt-cache madison

```bash
$ apt-cache madison kubelet | head -n 5
   kubelet |  1.18.8-00 | http://apt.kubernetes.io kubernetes-xenial/main amd64 Packages
   kubelet |  1.18.6-00 | http://apt.kubernetes.io kubernetes-xenial/main amd64 Packages
   kubelet |  1.18.5-00 | http://apt.kubernetes.io kubernetes-xenial/main amd64 Packages
   kubelet |  1.18.4-01 | http://apt.kubernetes.io kubernetes-xenial/main amd64 Packages
   kubelet |  1.18.4-00 | http://apt.kubernetes.io kubernetes-xenial/main amd64 Packages

$ apt install kubelet=1.18.8-00
```

## apt download

```bash
$ apt-get download libssl1.1
获取:1 http://mirrors.163.com/debian stretch/main amd64 libssl1.1 amd64 1.1.0l-1~deb9u1 [1,358 kB]
已下载 1,358 kB，耗时 0秒 (2,830 kB/s)

```
