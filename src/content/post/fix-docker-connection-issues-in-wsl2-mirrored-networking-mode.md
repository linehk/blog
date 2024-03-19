---
title: "修复 WSL2 镜像网络模式下无法连接 Docker 的问题"
pubDate: 2024-01-02T13:22:18+08:00
lastmod: 2024-01-02T13:22:18+08:00
keywords: []
description: ""
categories: [Misc]

---

<!--more-->

## 问题

在 2023 年 9 月的 Windows 11 更新中，WSL2 支持了新的网络模式：镜像（mirrored）。它能够通过 localhost 地址从 WSL2 内部连接到 Windows 的 127.0.0.1 地址。

可以在 %UserProfile%/.wslconfig 添加 networkingMode=mirrored 来启用它。

但是这会导致无法连接到 Docker 的问题：dial tcp 127.0.0.1:3306: connect: connection refused。

该问题的原因是 Docker 使用了 iptables 来转发端口。

可以通过以下方法来修复这个问题。

## 使用 Docker Desktop

### 方法 1

直接将 Docker Desktop 升级到 4.26 以上版本即可，[该版本](https://docs.docker.com/desktop/release-notes/#for-windows-1 "该版本")添加了对镜像网络模式的支持。

### 方法 2

或者在 .wslconfig 中添加：

```plaintext
[experimental]
networkingMode=mirrored
hostAddressLoopback=true
ignoredPorts = 8000,8080
```

通过 ignoredPorts 来设置你需要访问的应用的端口。

## 使用其它 Docker 发行版

在 .wslconfig 中添加：

```plaintext
[experimental]
networkingMode=mirrored
hostAddressLoopback=true
```

并且编辑 docker 配置文件：/etc/docker/daemon.json，添加：

```json
{
"iptables": false
}
```

缺点是这样无法使用 iptables。

## 参考链接

[WSL 2.0: networkingMode=mirrored makes Docker unable to forward ports #10494](https://github.com/microsoft/WSL/issues/10494 "WSL 2.0: networkingMode=mirrored makes Docker unable to forward ports #10494")

[Windows Subsystem for Linux September 2023 update](https://devblogs.microsoft.com/commandline/windows-subsystem-for-linux-september-2023-update/ "Windows Subsystem for Linux September 2023 update")