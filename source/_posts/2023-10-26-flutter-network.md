---
layout: post
title: flutter抓包、查看网络请求
tags: [flutter]
comments: true
date: 2023-10-26 13:56:36
---

由于 `flutter` 的 `http` 请求代理不走系统，所以只能在代码中设置代理 ip, 使我们的抓包工具能获取到 http 的请求

## flutter 使用 Charles 代理爬虫

```dart
class MyHttpOverrides extends HttpOverrides {
  bool _badCertificateCallback(X509Certificate cert, String host, int port) {
    return true;
  }

  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback = _badCertificateCallback
      ..findProxy = (uri) {
        return 'PROXY 192.168.1.193:8888;DIRECT;';//192.168.1.193:8888是代理ip端口

     }
    ;
  }
}
```

<!-- more -->

在启动时设置 httpoverride

```dart
    HttpOverrides.global = MyHttpOverrides();
```

修改 Charles 的 ssl 代理设置，`Proxy->SSL Proxying Settings -> SSL Proxying->Include`,添加要需要爬取的域名。

有时我们需要抓 https 的请求，此时用 charles 抓包的内容是加密的，看不到明文，这时候需要安装下 Charles 的证书来解决。点击 help > SSL Proxying > Install Charles Root Certificate，安装到系统的钥匙串中。
