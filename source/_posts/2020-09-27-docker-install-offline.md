---
layout: post
title: "linux下离线安装docker"
date: 2020-09-27
excerpt: "使用docker下载的安装包，安装docker"
tags: [linux, docker]
comments: true
---

## 环境准备
1、操作系统：CentOS 7.3
2、Docker版本：18.06.1 [官方下载地址（打不开可能需要科学上网](https://download.docker.com/linux/static/stable/x86_64/)
3、官方参考文档：https://docs.docker.com/install/linux/docker-ce/binaries/#install-static-binaries

## Docker安装
1、解压
```
tar -xvf docker-18.06.1-ce.tgz
```
2、将解压出来的docker文件内容移动到 /usr/bin/ 目录下
```
cp docker/* /usr/bin/
```
3、将docker注册为service
```
vim /etc/systemd/system/docker.service
```
将下列配置复制到docker.service中并保存
```
[Unit]

Description=Docker Application Container Engine

Documentation=https://docs.docker.com

After=network-online.target firewalld.service

Wants=network-online.target

[Service]

Type=notify

# the default is not to use systemd for cgroups because the delegate issues still

# exists and systemd currently does not support the cgroup feature set required

# for containers run by docker

ExecStart=/usr/bin/dockerd

ExecReload=/bin/kill -s HUP $MAINPID

# Having non-zero Limit*s causes performance problems due to accounting overhead

# in the kernel. We recommend using cgroups to do container-local accounting.

LimitNOFILE=infinity

LimitNPROC=infinity

LimitCORE=infinity

# Uncomment TasksMax if your systemd version supports it.

# Only systemd 226 and above support this version.

#TasksMax=infinity

TimeoutStartSec=0

# set delegate yes so that systemd does not reset the cgroups of docker containers

Delegate=yes

# kill only the docker process, not all processes in the cgroup

KillMode=process

# restart the docker process if it exits prematurely

Restart=on-failure

StartLimitBurst=3

StartLimitInterval=60s

 

[Install]

WantedBy=multi-user.target
```
4、启动
```
chmod +x /etc/systemd/system/docker.service             #添加文件权限并启动docker
systemctl daemon-reload                                 #重载unit配置文件
systemctl start docker                                  #启动Docker
systemctl enable docker.service                         #设置开机自启
```
5、验证
```
systemctl status docker                                 #查看Docker状态
docker -v                                               #查看Docker版本
```
## 参考
[Linux下离线安装Docker](https://www.cnblogs.com/luoSteel/p/10038954.html)