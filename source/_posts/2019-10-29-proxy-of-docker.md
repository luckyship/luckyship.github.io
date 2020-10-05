---
layout: post
title: "docker的http代理"
date: 2019-10-29
excerpt: "docker无法上网时，需要配置http代理"
tags: [docker]
comments: true
---

## 步骤
解决代理的方法，参考官网教程   
[https://docs.docker.com/config/daemon/systemd/#httphttps-proxy](https://docs.docker.com/config/daemon/systemd/#httphttps-proxy)

### 创建文件夹
```
sudo mkdir -p /etc/systemd/system/docker.service.d
```
### 创建配置文件
```
cd /etc/systemd/system/docker.service.d
touch http-proxy.conf
```
### 在http-proxy.conf中添加http代理
```
[Service] Environment="HTTP_PROXY=http://proxy.example.com:80/" "NO_PROXY=localhost,127.0.0.1"
```
### 更新，使配置文件生效
```
sudo systemctl daemon-reload
```
### 重启docker服务
```
sudo systemctl restart docker
```
### 检查配置是否生效
```
$ systemctl show --property=Environment docker
```
## 转载
[配置Docker的HTTP代理](https://blog.csdn.net/talang376763947/article/details/79281009)