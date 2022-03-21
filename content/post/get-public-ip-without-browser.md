---
title: "不通过浏览器获取公网 IP"
date: 2020-07-14T18:35:30+08:00
lastmod: 2020-07-14T18:35:30+08:00
keywords: [获取公网 IP, 不通过浏览器获取公网 IP, 不通过 HTTP 获取公网 IP, 通过 DNS 获取公网 IP]
description: "介绍了如何不通过浏览器获取公网 IP。"
categories: [Misc]

---

本文介绍了如何不通过浏览器获取公网 IP。

<!--more-->

![DNS Logo](/images/get-public-ip-without-browser/dns-logo.webp "DNS Logo")

有的时候我们的计算机处于受限状态，不能使用浏览器或者 HTTP 协议。

也就不能使用类似：

```shell
curl ifconfig.io
```

之类的命令来获取公网 IP。

但其实可以不通过浏览器，而是通过 DNS 来获取公网 IP，使用如下命令：

```shell
dig @ns1.google.com TXT o-o.myaddr.l.google.com +short
# 或者：nslookup -type=TXT o-o.myaddr.l.google.com ns1.google.com
```

其它的 DNS 提供商也可以：

```shell
# OpenDNS
dig myip.opendns.com @resolver1.opendns.com +short
# 或者：nslookup myip.opendns.com resolver1.opendns.com
```

```shell
# Akamai
dig whoami.akamai.net. @ns1-1.akamaitech.net. +short
# 或者：nslookup whoami.akamai.net. ns1-1.akamaitech.net.
```

这些命令会返回公网 IP 的原理是：

Google 等公司会编写程序，监听在它们类似 o-o.myaddr.l.google.com 的地址上。

只要有请求，就会将请求的源 IP 地址作为数据直接返回。
