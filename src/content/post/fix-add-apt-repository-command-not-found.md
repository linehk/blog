---
title: "修复 add-apt-repository command not found 错误"
pubDate: 2019-09-21T22:36:30+08:00
lastmod: 2019-09-21T22:36:30+08:00
keywords: [Debian add-apt-repository command not found, Ubuntu add-apt-repository command not found]
description: "介绍了如何修复 add-apt-repository command not found。"
categories: [Ubuntu]

---

本文将向你展示如何修复在 Ubuntu、Debian 和其它基于 Debian 的 Linux 发行版上出现的 add-apt-repository command not found 错误。

![Debian Logo](/images/fix-add-apt-repository-command-not-found/debian-logo.webp "Debian Logo")

我们在 Ubuntu 和 Debian 上安装软件包时经常会使用到 PPA（Personal Package Archive）。

如果要添加新的 PPA 存储库，则需要使用 add-apt-repository 命令，如：

```shell
sudo add-apt-repository ppa:example/ppa
```

但有时会出现 add-apt-repository 命令未找到的错误，如：

```shell
sudo: add-apt-repository: command not found
```

发生这个错误的原因是该系统未安装 add-apt-repository 命令。

但如果你使用 *sudo apt-get install add-apt-repository* 是无法修复的。

这是因为 add-apt-repository 命令实际上是软件包 *software-properties-common* 的一部分。

所以我们应该安装该包，如：

```shell
sudo apt-get install software-properties-common
```

安装完成后应使用如下命令更新系统：

```shell
sudo apt-get update
```

更新完后使用 add-apt-repository 添加 PPA 时就不会发生错误了。
