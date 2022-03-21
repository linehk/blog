---
title: "Ubuntu 安装后的常用系统配置"
date: 2018-02-02T01:01:15+08:00
lastmod: 2018-02-02T01:01:15+08:00
keywords: [Ubuntu 系统配置, Ubuntu 常用设置, Ubuntu 安装后]
description: "介绍了安装 Ubuntu 系统后一些常用的配置。"
categories: [Ubuntu]

---

本文介绍了安装 Ubuntu 系统后一些常用的配置。

<!--more-->

![Ubuntu Logo](/images/common-system-configuration-after-ubuntu-installation/ubuntu-logo.webp "Ubuntu Logo")

## 权限相关

### 启用 root 并修改密码

新安装的 Ubuntu 默认时没有 root 账户的，需要手动使用 `sudo` 命令修改 root 密码。

```shell
sudo passwd root
```

### 取消 sudo 密码

Ubuntu 下使用 `sudo` 命令默认是需要密码的，可以使用下面的命令并修改配置取消。

```shell
sudo visudo
```

找到 `%sudo ALL=(ALL:ALL) :ALL` 改成 `%sudo ALL=(ALL:ALL) NOPASSWD:ALL`。

## 更换 Ubuntu 镜像源

apt-get 用默认的源速度不是很快，可以更换成国内源来提升速度，国内源有很多，这里使用的是 [清华大学Ubuntu镜像源](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/ "清华大学Ubuntu镜像源")。

编辑 `/etc/apt/sources.list` 备份后替换。

```txt
## 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ xenial main restricted universe multiverse
## deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ xenial main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ xenial-updates main restricted universe multiverse
## deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ xenial-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ xenial-backports main restricted universe multiverse
## deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ xenial-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ xenial-security main restricted universe multiverse
## deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ xenial-security main restricted universe multiverse

## 预发布软件源，不建议启用
## deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ xenial-proposed main restricted universe multiverse
## deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ xenial-proposed main restricted universe multiverse
```

## 开机自动启动小键盘

Ubuntu 默认开机是不打开小键盘的，每次重启后使用小键盘是都要开启，是有点繁琐。

先安装 numlockx 这个软件：

```shell
sudo apt-get install numlockx
```

后面有两种方法，你可以依次尝试。

1. 编辑 `/usr/share/lightdm/lightdm.conf.d/50-unity-greeter.conf` 这个文件，在最后一行添加 `greeter-setup-script=/usr/bin/numlockx on`。
2. 编辑 `/etc/rc.local` 在最后一行 `exit 0` 前写入如下代码：

```shell
if [-x /usr/bin/numlockx]; then
numlockx on
fi
```

重新启动后小键盘就会自动开启。

## Chrome 浏览器取消密码环

在 Ubuntu 安装了 Chrome 后，每次重启启动 Chrome 时都要输入一次密码环。为了方便，可以取消掉这个密码环。

在终端输入 `seahorse` 在弹出的窗口中选中**登录**，右键**更改密码**，输入旧密码后连按两个回车把密码置为空。

## 修改 grub 引导等待时间

grub 的配置文件是 `/boot/grub/grub.cfg`，但这个文件是由 `/etc/default/grub` 的配置生成的，所以修改这个文件就好。
打开文件之后，将 `GRUB_TIMEOUT=0` 改成 `GRUB_TIMEOUT=5`，这里的 5 即为等待 5秒的意思。

更新设置：

```shell
sudo update-grub
```

## 禁止开机后的系统错误弹窗

Ubuntu 中只要 `/var/crash/` 目录下有文件存在，会导致每次开机后都会弹窗提示**检查到系统程序错误**。如果删除该目录下的文件，别的文件生成时问题又会出现，可以编辑 `/etc/default/apport`，并将其中的 `enabled` 属性改成 `0`。

## 更正系统时间（双系统）

双系统会导致时间显示不正确，更正命令如下：

```shell
sudo timedatectl set-local-rtc 1
```

## 将常用中文目录改为英文

安装 Ubuntu 的时候语言选择为中文时，生成的用户目录也变成了中文，不利于命令行的操作。

```shell
export LANG=en_US
xdg-user-dirs-gtk-update
export LANG=zh_CN
```

在弹出的窗口中将文件夹改成英文，下次启动选择不改成中文并不再提示即可。

## 笔记本触摸板设置

* 打开：`sudo modprobe psmouse`。
* 关闭：`sudo modprobe -r psmouse`。