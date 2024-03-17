---
title: "修改 macOS 上的 easy_install 和 pip 为国内清华镜像源"
pubDate: 2019-05-30T19:35:08+08:00
lastmod: 2019-05-30T19:35:08+08:00
keywords: [macOS easy_install 镜像源, macOS pip 镜像源]
description: "介绍了如何修改 macOS 上的 easy_install 和 pip 的配置文件设置为国内清华镜像源。"
categories: [macOS]

---

本文介绍了如何通过修改 macOS 上的 easy_install 和 pip 的配置文件，设置为国内清华镜像源，从而加快速度。

<!--more-->

![macOS Logo](/images/modify-easy_install-and-pip-for-china-tsinghua-mirror-on-macos/macos-logo.webp "macOS Logo")

## easy_install

如果没有对应的文件，则需手动创建。

文件地址：

```
~/.pydistutils.cfg
```

替换成如下文本：

```text
[easy_install]
index_url = https://pypi.tuna.tsinghua.edu.cn/simple
```

## pip

如果没有对应的文件，则需手动创建。

文件地址：
 
```
~/.pip/pip.conf
```

替换成如下文本：

```text
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
```