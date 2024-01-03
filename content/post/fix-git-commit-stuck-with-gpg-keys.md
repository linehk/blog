---
title: "修复使用 GPG 密钥时 git commit 卡住的问题"
date: 2024-01-03T22:34:33+08:00
lastmod: 2024-01-03T22:34:33+08:00
keywords: []
description: ""
categories: [Misc]

---

<!--more-->

使用 GPG 密钥时 git commit 有时候会卡住。

可以通过一下命令来重启 gpg-agent 和 ssh-agent：

```shell
gpgconf --kill gpg-agent && killall ssh-agent
```