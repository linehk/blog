---
title: "在 Ubuntu 上安装 Nvidia 专有驱动"
pubDate: 2018-03-09T11:44:23+08:00
lastmod: 2018-03-09T11:44:23+08:00
keywords: [安装 Nvidia 专有驱动, 禁用 nouveau 开源驱动, 安装 prime 双显卡切换器]
description: "介绍了如何通过在 Ubuntu 上禁用开源驱动，安装 Nvidia 私有驱动和 prime 双显卡切换器来解决双显卡笔记本电脑的黑屏和过热问题。"
categories: [Ubuntu]

---

对比各类操作系统对显卡驱动程序的支持，Windows 使用广泛并且作为最多游戏玩家的平台，驱动厂商自然会优先适配。

macOS 作为苹果公司专用的操作系统，驱动厂商也会开发定制化的驱动程序，可以更好地利用硬件。

至于主要面对服务器领域的 Linux，对显卡性能的诉求自然没另外两种操作系统强烈。所以就造成了有些使用 Linux 作为桌面操作系统的用户出现了诸多关于显卡驱动或别的硬件驱动的问题。

在如今笔记本电脑很大一部分是双显卡设计的时代，这种设计在 Linux 上在并没有被驱动厂商完美的解决。开源驱动有着这样或那样的问题。从而出现了诸多例如黑屏、卡死等问题。还有双显卡同时运行时，发热过量的问题。

值得庆幸的是，这样的问题可以通过禁用开源驱动，安装 Nvidia 专有驱动并且安装双显卡切换器来缓解。虽然不能完美解决，但也聊胜于无。

<!--more-->

![Nvidia Logo](/images/install-nvidia-proprietary-driver-on-ubuntu/nvidia-logo.webp "Nvidia Logo")

## 禁用开源驱动 nouveau

```shell
sudo chmod 666 /etc/modprobe.d/blacklist.conf  # 改文件权限
sudo vim /etc/modprobe.d/blacklist.conf   # 修改文件
```

在文件最后新添加一行 `blacklist nouveau` 保存关闭。

## 安装双显卡切换器 prime-indicator

```shell
sudo add-apt-repository ppa:nilarimogard/webupd8    # 添加 PPA 更新源
sudo apt-get update    # 更新源列表
sudo apt-get install prime-indicator    # 安装 prime-indicator
```

安装成功后可以通过 `nvidia-settings` 打开图形化界面在 `PRIME Profiles` 选项卡进行切换：

![PRIME Profiles 选项](/images/install-nvidia-proprietary-driver-on-ubuntu/prime-profiles.webp "PRIME Profiles 选项")

或者，通过如下命令查看命令行选项然后直接进行切换：

```shell
prime-select
```

## 安装 Ubuntu 推荐的驱动版本

1. 查看自己的 `Ubuntu 系统设置 -> 软件和更新 -> 附加驱动`。记录下 Ubuntu 推荐你安装的驱动版本，我这里是 `nvidia-390`。

![nvidia-390 推荐版本](/images/install-nvidia-proprietary-driver-on-ubuntu/nvidia-390.webp "nvidia-390 推荐版本")

2. 使用快捷键 `Ctrl+Alt+F1` 进入文字命令界面，输入如下命令。

```shell
sudo service lightdm stop    # 关闭图形系统
sudo apt-get install nvidia-390    # 通过官方源安装驱动，我这里是 390
sudo service lightdm start    # 启动图形系统
```

## 验证是否安装成功

```shell
nvidia-settings # 打开 Nvidia 设置
nvidia-smi # 显示驱动信息
```

输入这两个命令，能正常看到信息就说明安装成功了。

![nvidia-smi 查看显卡信息](/images/install-nvidia-proprietary-driver-on-ubuntu/nvidia-smi.webp "nvidia-smi 查看显卡信息")