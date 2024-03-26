---
title: "修复 WSL2 中 git commit 报错的问题"
pubDate: 2024-03-26T12:21:25+08:00
lastmod: 2024-03-26T12:21:25+08:00
keywords: []
description: ""
categories: [Misc]

---

## 描述

在 WSL2 中，使用 git 提交经过 GPG 签名的 commit 时，会出现以下错误：

```plaintext
error: gpg failed to sign the data
fatal: failed to write commit object
```

## 原因

这是因为 WSL2 的网络模式会造成回环（loopback），使得用于读取密码的工具 pinentry 出错，进而导致 GPG 无法对 commit 进行签名。

## 解决方法

通过以下命令配置 pinentry 允许回环来修复：

```bash
echo -e '\nuse-agent\npinentry-mode loopback' >> ~/.gnupg/gpg.conf
echo -e '\nallow-loopback-pinentry' >> ~/.gnupg/gpg-agent.conf
```

## 参考链接

[How to understand the `gpg failed to sign the data` problem in git](https://gist.github.com/paolocarrasco/18ca8fe6e63490ae1be23e84a7039374 "How to understand the `gpg failed to sign the data` problem in git")