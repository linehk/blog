---
title: "如何在 git 提交签名 commit 时不用输入密码"
pubDate: 2024-03-26T14:22:07+08:00
lastmod: 2024-03-26T14:22:07+08:00
keywords: []
description: ""
categories: [Misc]

---

## 描述

在使用 git 提交经过 GPG 签名的 commit 时，总是需要输入密码。

通过以下步骤可以把密码缓存到内存中。

## 步骤

1. 启用缓存：

```bash
echo -e '\nallow-preset-passphrase' >> ~/.gnupg/gpg-agent.conf
```

2. 重启 gpg-agent：

```bash
gpg-connect-agent reloadagent /bye
```

3. 列出自己的钥匙柄（Keygrip）：

```bash
gpg --list-secret-keys --with-keygrip
```

输出如下：

```plaintext
sec   rsa3072 2024-03-26 [SC]
      0E74F8A5B4DEC1A2438BBA99B9FFC9D459B25AAB
      Keygrip = 581BCFFCADF4B32D352CBA8364D5B32102348BAB
uid           [ultimate] example <example@gmail.com>
ssb   rsa3072 2024-03-26 [E]
      Keygrip = 32883E610AEF2CDC1D27F94B2B893D5E18E33052
```

4. 通过 gpg-preset-passphrase 把密码缓存到内存中：

```bash
/usr/lib/gnupg/gpg-preset-passphrase --preset 581BCFFCADF4B32D352CBA8364D5B32102348BAB
```

`--preset` 的参数是上一步输出中，sec 里面的 Keygrip。

## 参考链接

[Using 1password, GPG and git for seamless commits signing](https://bmaingret.github.io/blog/2022-02-15-1Password-gpg-git-seamless-commits-signing "Using 1password, GPG and git for seamless commits signing")