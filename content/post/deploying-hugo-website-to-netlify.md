---
title: "部署 Hugo 网站到 Netlify"
date: 2019-06-16T20:53:57+08:00
lastmod: 2019-06-16T20:53:57+08:00
keywords: [Hugo, Netlify, Deploy to Netlify, Hugo Netlify]
description: "介绍了如何部署一个 Hugo 网站到 Netlify 和一些额外设置。"
categories: [Website]

---

[Netlify](https://www.netlify.com/ "Netlify") 是什么？它是一家云计算公司，为静态网站提供托管和 serverless 后端服务。

关键在于，与 GitHub 相比，Netlify 托管的网站速度更快，也更稳定。

本文就来介绍如何部署一个 Hugo 网站到 Netlify 和一些额外设置。

<!--more-->

![Netlify Logo](/images/deploying-hugo-website-to-netlify/netlify-logo.webp "Netlify Logo")

## 主题子模块化

首先要 Fork 主题到你自己的账号，这样即可以自定义主题，又可以 Pull 到最新的更新。

然后要把 Hugo 网站的主题子模块化，因为 Netlify 不支持子模块以外的方法来使用主题，如最常见的：

```shell
git clone https://github.com/olOwOlo/hugo-theme-even themes/even
```

如果原来使用的是 *git clone* 则需要先删除主题（注意备份），再在网站根目录下输入添加主题子模块的命令：

```shell
git submodule add https://github.com/linehk/hugo-theme-even.git themes/even
```

如果在网站根目录下出现 *.gitmodules* 文件，且内容跟我的类似，则表示成功：

```INI
[submodule "themes/even"]
	path = themes/even
	url = https://github.com/linehk/hugo-theme-even.git
```

可以选择在 *.gitignore* 中加入 *public/* 来忽略掉 *public* 文件夹，因为已经不需要了。

然后 *git push* 到远程仓库即可。

## 部署

![部署总览](/images/deploying-hugo-website-to-netlify/deploy-summary.webp "部署总览")

跟官网宣传的一样，部署 Hugo 网站到 Netlify 非常简单，步骤如下：

1. 点击官网右上角的 *Sign up* 来注册登录
2. 登录成功后会转到类似 *https://app.netlify.com/teams/linehk/sites* 的链接，点击 *New site from Git* 新建网站
3. 选择前面部署到的代码托管平台，如：*GitHub*
4. 选择前面上传到的远程仓库
5. 【可选】在 *Build command* 加入 `--cleanDestinationDir --forceSyncStatic --gc --ignoreCache --minify` 等额外参数，这些参数的作用如下：
    * `--cleanDestinationDir`：构建前先清理目标文件夹，即 *public*
    * `--forceSyncStatic`：强制同步 *static* 文件夹
    * `--gc`：构建后执行一些清理任务（删除掉一些没用的缓存文件）
    * `--ignoreCache`：构建时忽略缓存
    * `--minify`：压缩网页（Debug 时慎用）
6. 最后点击 *Deploy site* 即可

经过部署后已经可以通过 Netlify 分配的域名来访问网站了，如：*https://sulinehk.netlify.com/*

## 自定义域名

对于想对网站使用**主域名**而言，自定义域名很简单：

1. 找到 *Domain settings* 选项卡，点击进入域名设置
2. 在 *Custom domains* 一项下点击 *Add domain alias* 来添加自定义域名
3. 在弹出来的输入框输出主域名即可，如：*www.sulinehk.com*
4. 在域名商处添加如下的 DNS 记录，等待 DNS 刷新，看到主域名处出现 *NETLIFY DNS* 的墨绿色标志即代表成功

```DNS
dns1.p01.nsone.net
dns2.p01.nsone.net
dns3.p01.nsone.net
dns4.p01.nsone.net
```

## 设置重定向

还是在 *Custom domains* 选项卡，点击 *How to redirect the default Netlify subdomain to your primary domain* 展开查看代码。

我的代码如下：

```_redirects
# These rules will change if you change your site’s custom domains or HTTPS settings

# Redirect default Netlify subdomain to primary domain
https://sulinehk.netlify.com/* https://www.sulinehk.com/:splat 301!
```

在 *static* 目录下新建文件 *_redirects*，粘贴代码进去。

## 开启 HTTPS

在 *HTTPS* 选项卡下的 *SSL/TLS certificate* 选项开启即可。

证书的签发者为 *Let’s Encrypt*，支持自动续期。也可以自定义别的签发者。

如果想在 *Chrome* 地址栏里看到小绿锁（小灰锁），还需要把所有链接都替换成以 *https://* 开头的链接。

接着在页面按下 *F12* 来打开开发者工具，并切换到 *Network*，刷新页面，查看有什么请求不是以 *https://* 发出的，修改相关页面来替换。

## 展示状态徽章

在 *Status badges* 选项卡下有个链接代码，该链接代码可以展示该网站的部署状态。

你可以在网站的 GitHub 仓库下的 *README.md* 文件中展示它，或者将它放在网站主页的 *footer* 上。

这是我的链接代码：

```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/04d31b4a-979e-4e29-970b-e769f41130df/deploy-status)](https://app.netlify.com/sites/sulinehk/deploys)
```

还有它的展示效果：[![Netlify Status](https://api.netlify.com/api/v1/badges/04d31b4a-979e-4e29-970b-e769f41130df/deploy-status)](https://app.netlify.com/sites/sulinehk/deploys)

## 参考链接

[Using git submodule for Hugo themes](https://www.andrewhoog.com/post/git-submodule-for-hugo-themes/ "Using git submodule for Hugo themes")