---
layout: post
title: nginx安装配置
excerpt: 'nginx功能非常强大，可以转发http请求，很多用它来解决各种跨域问题'
tags: []
comments: true
date: 2020-12-16 17:42:39
---


## 安装编译
### 下载nginx安装包
```
wget http://nginx.org/download/nginx-1.8.0.tar.gz
```
### 解压
```
tar -zxvf nginx-1.8.0.tar.gz
```
### 安装依赖
```
yum install -y pcre pcre-devel openssl openssl-devel gcc gcc gcc-c++ ncurses-devel perl 
```
### 编译前准备
#将这句注释掉 取消Debug编译模式，在179行

```
vim auto/cc/gcc
#CFLAGS="$CFLAGS -g"
```
### 配置
```
$ cd nginx

$ ./configure --prefix=/usr/local/nginx --user=www --group=www --with-http_stub_status_module --with-http_ssl_module
```
### 编译、安装
```
$ make
$ make install
```
### 创建软连接
```
ln -s /usr/local/nginx/sbin/nginx /usr/local/sbin/
```

## nginx配置
### 简单配置
```
server {
    listen 3333;
    server_name xx.xxx.xxx.xxx;
    location / {
        proxy_pass xxx.xxx.xx.xxx;
    }
    location ^~ /asd {              # 正则字符串
        proxy_pass xxx.xxx.xx.xxx;
    }
}
```
### 目录解析
> conf : 存放配置文件  
> html: 网页文件  
> logs：存放日志  
> sbin：shell启动，停止脚本  

### conf/nginx.config文件组成
```
main                                # 全局配置

events {                            # nginx工作模式配置
    ....
}

http {                                # http设置
    ....

    server {                        # 服务器主机配置
        ....
        location {                    # 路由配置
            ....
        }
            upstream name {                    # 负载均衡配置
        ....
    }
}
```
如上述配置文件所示，主要由6个部分组成：
> main：用于进行nginx全局信息的配置  
> events：用于nginx工作模式的配置  
> http：用于进行http协议信息的一些配置  
> server：用于进行服务器访问信息的配置  
> location：用于进行访问路由的配置  
> upstream：用于进行负载均衡的配置  

### server模块
srever模块配置是http模块中的一个子模块，用来定义一个虚拟访问主机，也就是一个虚拟服务器的配置信息

```
server {
    listen        80;
    server_name localhost    192.168.1.100;
    root        /var/www/html;
    index        index.php index.html index.html;
    charset        utf-8;
    access_log    logs/access.log;
    error_log    logs/error.log;
    ......
}
```
核心配置信息如下：
>server：一个虚拟主机的配置，一个http中可以配置多个server  
>server_name：用力啊指定ip地址或者域名，多个配置之间用空格分隔  
>root：表示整个server虚拟主机内的根目录，所有当前主机中web项目的根目录  
>index：用户访问web网站时的全局首页  
>charset：用于设置www/路径中配置的网页的默认编码格式  
>access_log：用于指定该虚拟主机服务器中的访问记录日志存放路径  
>error_log：用于指定该虚拟主机服务器中访问错误日志的存放路径  
### location模块

`location`模块是`nginx`配置中出现最多的一个配置，主要用于配置路由访问信息  
在路由访问信息配置中关联到反向代理、负载均衡等等各项功能，所以`location`模块也是一个非常重要的配置模块  
基本配置  
```
location / {
    root    /nginx/www;
    index    index.php index.html index.htm;
}
```



## nginx启动
### 启动
```
# 默认为nginx.conf
$ ./nginx

# 以其他的config来执行nginx，
$ /usr/local/nginx/sbin/nginx -c conf/nginx.conf
```
### 刷新配置
```
$ ./nginx -s reload
```
### 重启配置
```
$ /usr/local/nginx/sbin/nginx -s reopen
```
### 停止
```
$ ./nginx -s stop
$ ./nginx -s quit

# 杀死nginx的进程
$ kill -s 9 
```
## 参考
[Nginx安装及配置详细教程
](https://blog.51cto.com/13363488/2349546)