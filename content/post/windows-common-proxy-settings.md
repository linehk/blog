---
title: "Windows 常见代理设置"
date: 2020-09-16T22:15:18+08:00
lastmod: 2020-09-16T22:15:18+08:00
keywords: []
description: ""
categories: [Misc]

---

因为最近把开发环境换成了 Windows 和 WSL 的组合，而 Windows 下面的代理设置太繁琐，所以写了这篇博客来记录。

<!--more-->

![Windows Logo](/images/windows-common-proxy-settings/windows-logo.webp "Windows Logo")

## 系统代理

设置 -> 网络和 Internet -> 代理。勾选使用代理服务器，输入对应的地址即可。

## Windows Store 下载

Windows Store 下载无法直接使用系统代理，这是因为它基于 winhttp，而不是系统代理的 wininet。

所以需要从系统代理（即，IE）中导入。在命令行中输入：

```shell
netsh winhttp import proxy source=ie
```

或者是手动设置：

```shell
netsh winhttp set proxy localhost:8081
```

## 系统自动更新

系统自动更新跟 Windows Store 下载类似，也需要改为 wininet。

## UWP 应用程序

UWP 应用程序同样无法直接使用系统代理，这是因为 UWP 应用程序默认运行在 AppContainers 独立进程上，它会限制网络流量发送到本地。

所以需要使用 [EnableLoopback Utility](https://telerik-fiddler.s3.amazonaws.com/fiddler/addons/enableloopbackutility.exe "EnableLoopback Utility") 解除该限制。

勾选对应的应用，然后点击 Save Changes 即可。

## 参考链接

[怎么设置win10自动更新走SS？](https://github.com/shadowsocks/shadowsocks-windows/issues/1741 "怎么设置win10自动更新走SS？")