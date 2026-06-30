---
layout: post
title: Ubuntu 22.04 锁屏后 VNC 连不上，最后我是这样搞定的
tags: [linux, ubuntu, vnc, gnome]
comments: true
date: 2026-06-30 10:30:00
---

最近在折腾一台 Ubuntu 22.04 机器，顺手把系统自带的共享功能打开了，外部通过 VNC 连进来，一开始看起来风平浪静。

结果好景不长，只要本机一锁屏，VNC 立刻失联，远程端仿佛被当场请出会议室。

一开始我还以为是 VNC 客户端抽风，后来才发现，这事和客户端关系真不大，锅主要在 GNOME 的默认行为上。

<!-- more -->

## 问题现象

具体表现非常稳定，稳定得让人有点想叹气:

- 本机解锁状态下，VNC 可以正常连接
- 本机一旦锁屏，VNC 就连不上
- 如果只是息屏但不锁屏，通常还能连

所以这里要先分清两个概念:

- 息屏: 显示器黑了，但会话还活着
- 锁屏: 进入锁定状态，需要输入密码

Ubuntu 22.04 默认的 GNOME 远程桌面，对“锁屏”这件事相当较真。它不是单纯把屏幕盖起来，而是顺手把远程连接这扇门也一起带上了。

## 一开始走过的弯路

最先想到的当然是，“那我不锁屏不就完了”。

这个办法确实简单粗暴，而且还真能用:

- 关闭自动锁屏
- 保留自动息屏
- 关闭自动挂起

这样机器看起来像睡着了，其实只是闭目养神，VNC 还能接着用。

如果你的诉求只是“远程别断”，这个方案已经够用了。

但问题在于，我的需求不是“别锁屏”，而是:

**我就想让它锁着，同时我还能远程连进去。**

这时就不能靠“假装没有锁屏需求”把自己糊弄过去了。

## 真正的原因

Ubuntu 22.04 用的是 GNOME 桌面，系统自带的屏幕共享，本质上是在共享当前这个用户会话。

默认情况下，GNOME 的思路大概是:

**锁屏了，就不该让远程桌面继续碰这个会话。**

于是结果就是:

- 你本地锁屏
- 远程连接失效
- VNC 客户端一脸无辜

所以这不是你哪里点错了，而是它默认就这么设计的。

## 最终解决方案

最后我走的是安装 GNOME 扩展这条路:

`Allow Locked Remote Desktop`

这个扩展干的事情很直接，就是把“锁屏后不允许远程连接当前桌面”这道门禁给放开。

### 第一步，确认系统环境

先看一下自己是不是 Ubuntu 22.04，以及当前 GNOME 版本:

```bash
lsb_release -ds
gnome-shell --version
echo $XDG_SESSION_TYPE
```

我这边看到的是:

```bash
Ubuntu 22.04.x
GNOME Shell 42.9
x11
```

`GNOME Shell 42.x` 对应这个扩展的 `v9` 版本，可以正常用。

### 第二步，下载扩展

我下载的是这个扩展包:

`allowlockedremotedesktopkamens.us.v9.shell-extension.zip`

如果你也是 Ubuntu 22.04，那大概率也是这个版本。

### 第三步，安装扩展

在下载目录执行:

```bash
gnome-extensions install ./allowlockedremotedesktopkamens.us.v9.shell-extension.zip
```

执行完不会有太多提示，属于那种“装了，但它不怎么吭声”的风格。

### 第四步，确认扩展的 UUID

这里是最容易踩坑的地方。

我一开始还很自信，直接敲了类似下面这种命令:

```bash
gnome-extensions enable [email protected]
```

然后系统很无情地告诉我:

```bash
扩展“[email protected]”不存在
```

后来一查才发现，这个扩展真正的 UUID 是:

```bash
allowlockedremotedesktop@kamens.us
```

可以直接看压缩包里的 `metadata.json`，也可以看安装目录:

```bash
~/.local/share/gnome-shell/extensions/allowlockedremotedesktop@kamens.us
```

### 第五步，别急着启用，先重新加载 GNOME 会话

扩展文件虽然已经装进去了，但当前这个 GNOME 会话不一定会立刻认账。

这也是另一个很容易让人怀疑人生的点:

- 目录里明明已经有扩展文件
- 但 `gnome-extensions list` 里就是看不见
- `gnome-extensions enable` 还会提示扩展不存在

解决方式有两个:

1. 注销当前桌面，然后重新登录
2. 如果你当前是 `X11`，按 `Alt + F2`，输入 `r`，回车，重载 GNOME Shell

我这边是 `X11`，所以这两种方式都能用。

### 第六步，启用扩展

等会话重新加载之后，再执行:

```bash
gnome-extensions enable allowlockedremotedesktop@kamens.us
```

然后检查一下:

```bash
gnome-extensions info allowlockedremotedesktop@kamens.us
```

如果能看到扩展信息，就说明它总算被系统正确认出来了。

也可以直接看列表:

```bash
gnome-extensions list | grep allowlocked
```

能搜出来就说明这一步基本没问题。

## 验证方法

这里别上来就一把梭，建议按下面这个顺序测:

1. 本地先登录到桌面
2. 确认系统自带共享已经打开
3. 远程先连一次，确认未锁屏状态正常
4. 本机执行锁屏
5. 再从远程发起连接

如果一切正常，你应该会看到:

- 锁屏状态下仍然可以连上
- 能看到锁屏界面
- 输入密码后进入当前桌面

如果走到这里都正常，这个问题基本就算收工了。

## 顺手说一下“息屏”和“锁屏”

这次排查还有个副产品，就是顺手把“息屏”和“锁屏”这两个概念彻底分清了。

如果你只是想让显示器黑掉，但不想影响 VNC，可以:

- 关闭自动锁屏
- 保留自动息屏
- 关闭自动挂起

这样机器表面上岁月静好，实际上远程那边还活得好好的。

手动息屏也可以用:

```bash
dbus-send --session --dest=org.gnome.ScreenSaver --type=method_call \
  /org/gnome/ScreenSaver org.gnome.ScreenSaver.SetActive boolean:true
```

当然，这个命令名字里虽然带了 `ScreenSaver`，但重点还是看你的锁屏设置。如果你没关自动锁屏，它黑着黑着，很可能顺手也把你锁上了。

## 这方案的代价

这个扩展当然不是毫无代价，它最大的代价就是:

**锁屏不再等于彻底隔绝远程访问。**

更准确一点说:

- 远程端可以连接到锁屏状态下的当前桌面
- 解锁以后，本地物理屏幕也会同步解锁

所以如果这台机器放在办公室、实验室或者公共区域，这事就得谨慎一点。不然你远程刚输完密码，旁边路过的人也顺便把你的桌面参观了一遍。

更稳妥的做法是:

- 机器只放在可信环境
- 不把 VNC 直接暴露到公网
- 最好再套一层内网、VPN 或其他访问控制

## 总结

这次问题的关键，不是 VNC 坏了，也不是 Ubuntu 突然闹情绪，而是 GNOME 默认就不允许“锁屏后继续远程接管当前会话”。

如果你的需求只是“远程别断”，那最省事的是:

- 不锁屏
- 只息屏
- 不挂起

如果你的需求和我一样，是:

**既要锁屏，又要继续远程连当前桌面**

那就装 `Allow Locked Remote Desktop`，然后记住两个核心坑:

- UUID 是 `allowlockedremotedesktop@kamens.us`
- 安装后要重新加载 GNOME 会话，不然系统一开始可能假装没看见它

折腾完之后回头看，这个问题其实不算复杂，它就是那种“每一步都不难，但每一步都很会气人”的典型代表。
