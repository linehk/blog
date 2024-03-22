---
title: "解决 Ubuntu 上搜狗拼音候选字的乱码错误"
pubDate: 2018-03-13T20:00:23+08:00
lastmod: 2018-03-13T20:00:23+08:00
keywords: [Ubuntu 搜狗拼音错误, Ubuntu 搜狗输入法乱码错误]
description: "介绍了在 Ubuntu 上使用搜狗输入法时发生候选字乱码错误的两个解决方法。"
categories: [Ubuntu]

---

在 Ubuntu 上使用搜狗拼音输入法，有时候会出现了候选词都变成不知名编码的错误。

下面列出两个在网上搜索可用的解决方法。

![Sogou Pinyin Logo](/images/solve-sogoupinyin-error-on-ubuntu/sogoupinyin-logo.webp "Sogou Pinyin Logo")

## 方法一：修改 fctix 有关配置

打开 fctix 配置界面。

```shell
fcitx-config-gtk3
```

![fctix 配置界面](/images/solve-sogoupinyin-error-on-ubuntu/fctix.webp "fctix 配置界面")

在出现的界面里，最下面的工具栏里共有 6 个小图标，打开第 5 个。

![Ubuntu 键盘布局](/images/solve-sogoupinyin-error-on-ubuntu/ubuntu-keyboard.webp "Ubuntu 键盘布局")

把键盘布局（keyboard layout）修改为汉语（chinese），然后注销重新登录即可。

## 方法二：删除一些有关文件

删除 `~/.config/` 下的几个关于搜狗拼音输入法的文件。

```shell
sudo rm -rf SogouPY* sogou*
```

删除后注销重新登录即可。

这个方法似乎并不能完全解决问题。