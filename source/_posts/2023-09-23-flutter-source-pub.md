---
layout: post
title: flutter安装包切换国内源
tags: [flutter]
comments: true
date: 2023-09-23 11:43:19
---

在学习`Flutter`，发现无法安装，控制台提示

```bash
Got TLS error trying to find package flutter_inappwebview at https://pub.dev.

```

经过网上查找资料，发现：

如果在中国安装 flutter，配置国内镜像是很好的解决办法。 到此，解决方法找到。

配置本地环境方法

对于 Linux 和 MacOS 来说，添加如下两条环境变量即可：

```bash
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
```

对于 Window

创建上述两个系统变量即可

```
name: PUB_HOSTED_URL;
value: https://pub.flutter-io.cn

name: FLUTTER_STORAGE_BASE_URL;
value: https://storage.flutter-io.cn
```
