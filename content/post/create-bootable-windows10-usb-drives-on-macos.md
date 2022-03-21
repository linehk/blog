---
title: "在 macOS 上制作 Windows 10 USB 启动盘"
date: 2019-06-01T12:20:26+08:00
lastmod: 2019-06-01T12:20:26+08:00
keywords: [Windows 10 USB 启动盘, macOS 上制作启动 U 盘]
description: "介绍了在 macOS 上制作 Windows 10 1903 版本 USB 启动盘的详细过程。"
categories: [macOS]

---

本文介绍了如何在 macOS 上制作 Windows 10 的 USB 启动盘。

<!--more-->

![Windows 10 Logo](/images/create-bootable-windows10-usb-drives-on-macos/windows10-logo.webp "Windows 10 Logo")

## 找到 U 盘路径和 Windows 10 镜像名

先插入 U 盘，并双击 Windows 10 镜像来挂载。

然后在终端输入如下命令：

```shell
diskutil list
```

可以看到类似于我的输出：

![diskutil-list](/images/create-bootable-windows10-usb-drives-on-macos/diskutil-list.webp "diskutil-list")

* U 盘路径可以根据 U 盘大小来找到：例如，我的 U 盘大小是 16 GB，所以我的 U 盘路径为 `/dev/disk3`
* Windows 10 镜像名可以根据注释来找到：例如，在 `/dev/disk4` 后面的括号注释着 `disk image`，所以我的镜像名为 `CPBA_X64FRE_ZH-CN_DV9`

## 把 U 盘格式化为 MS-DOS

```shell
diskutil eraseDisk MS-DOS "WINDOWS10" MBR disk3
```

命令中的 `disk3` 是我的 U 盘路径，你需要根据自己的情况修改。

## 通过复制文件来制作启动盘

```shell
cp -rp /Volumes/CPBA_X64FRE_ZH-CN_DV9/* /Volumes/WINDOWS10/
```

命令中的 `CPBA_X64FRE_ZH-CN_DV9` 是我的镜像名，你需要根据自己的情况修改。

复制完成也意味着整个制作过程的完成。

## 参考链接

[利用macOS制作Windows 10安装U盘](https://mcfly.cn/make-windows-installation-drive-on-mac/ "利用macOS制作Windows 10安装U盘")