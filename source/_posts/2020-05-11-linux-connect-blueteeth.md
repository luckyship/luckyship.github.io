---
layout: post
title: "linux连接蓝牙的方法"
date: 2020-05-11
excerpt: "蓝牙连接"
tags: [linux]
comments: true
---

## 连接蓝牙
首先确定有蓝牙设备，没有去网上购买蓝牙发射器
```
$ lsusb
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 004: ID 17ef:608d Lenovo 
Bus 001 Device 003: ID 0a12:0001 Cambridge Silicon Radio, Ltd Bluetooth Dongle (HCI mode)
Bus 001 Device 002: ID 17ef:6099 Lenovo 
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub

```

然后运行激活蓝牙设备
```
$ hciconfig
hci0:	Type: Primary  Bus: USB
	BD Address: 00:1A:7D:DA:71:11  ACL MTU: 310:10  SCO MTU: 64:8
	UP RUNNING PSCAN 
	RX bytes:1009522 acl:55943 sco:0 events:201 errors:0
	TX bytes:4712 acl:49 sco:0 commands:90 errors:0
$ sudo hciconfig hci0 up
```

使用bluetoothctl去连接蓝牙
```
$ bluetoothctl
[bluetooth]# scan on 开始扫描
[bluetooth]# pair 01:02:03:04:05:06 后面的mac地址是你的键盘mac地址
[bluetooth]# trust 01:02:03:04:05:06 把键盘设置为可信设备

[bluetooth]# connect 01:02:03:04:05:06 进行对接

```

### 参考
[Linux下的蓝牙键盘对接](https://www.jianshu.com/p/a89c8a0fdd73)  
[在Linux系统中使用蓝牙功能的基本方法](https://www.jb51.net/LINUXjishu/379648.html)
