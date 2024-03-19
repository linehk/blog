---
title: "GitHub 多账户设置"
pubDate: 2018-03-13T11:35:41+08:00
lastmod: 2018-03-13T11:35:41+08:00
keywords: [GitHub 多账户, 设置 SSH, 配置 SSH 文件]
description: "介绍了在拥有多个 GitHub 账号的时候如何通过配置 SSH 文件来让各个账户正常工作且不发生冲突。"
categories: [GitHub]

---

我的两个 GitHub 账户分别为主账户（参与开源项目和自己的代码）和副账户（更新 Hexo 博客）。

本文会介绍在拥有多个 GitHub 账号的时候，如何通过配置 SSH 文件来让各个账户正常工作且不发生冲突。

<!--more-->

![SSH Logo](/images/github-multiple-account-setttings/ssh-logo.webp "SSH Logo")

## 生成 SSH

由于不同的 GitHub 不能使用同一个 SSH 公钥，所以要生成两个不同的 SSH 分别对应两个主账户和副账户。

Ubuntu 生成 SSH 的命令如下：

```shell
ssh-keygen -t rsa -f ~/.ssh/id_rsa_blog -C "blogemail@gmail.com"
ssh-keygen -t rsa -f ~/.ssh/id_rsa -C "mainemail@gmail.com"
```

**`-f` 选项指定生成钥匙对的文件名**。

正确操作后目录 `.ssh/` 下应该是这样的：

![正确的 .ssh 目录](/images/github-multiple-account-setttings/ssh-path.webp "正确的 .ssh 目录")

## SSH 配置

编辑 `~/.ssh/config` SSH 配置文件，没有该文件则新建。

```plaintext
# mainemail@gmail.com
Host github-main.com
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa

# blogemail@gmail.com
Host github-blog.com
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa_blog
```

然后，以后使用 main 账户添加远程仓库需要这样添加：

```shell
git remote add origin git@github-main.com:username/demo.git
```

类似，使用 blog 账户时是这样：

```shell
git remote add origin git@github-blog.com:username/demo.git
```

而非原来的：

```shell
git remote add origin git@github.com:username/demo.git
```

## 测试是否配置成功

部署相应的 SSH 公钥到 GitHub 后，尝试在相应的本地仓库 `git push` 几个文件测试。