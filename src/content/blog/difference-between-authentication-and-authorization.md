---
title: "Authentication 和 Authorization 之间的区别"
pubDate: 2019-09-23T21:00:30+08:00
lastmod: 2019-09-23T21:00:30+08:00
keywords: [Authentication, Authorization, 身份验证, 授权, 身份验证 授权 区别]
description: "介绍了 Authentication 和 Authorization 之间的区别。"
categories: [Misc]

---

**Authentication 和 Authorization 分别被译为身份验证和授权**，这两个术语经常在我们谈及计算机安全的时候经常同时出现，再加上它们的的英语单词非常相似，所以我们经常分不清楚，但实际上它们所表达的意思是截然不同的。

本文将介绍 Authentication 和 Authorization 之间的区别，以及它们又包含了什么意思。

<!--more-->

![Authentication and Authorization Logo](/images/difference-between-authentication-and-authorization/authentication-and-authorization-logo.webp "Authentication and Authorization Logo")

## Authentication

**Authentication（身份验证）** 是关于检查你的凭据以验证你的身份，如：用户名和密码。

有时还与身份验证因素结合使用，身份验证因素决定了系统在向某人授予任何访问权限之前用来验证其身份的各种元素。

根据安全级别，身份验证因素有以下几种：

* 单因素（Single-Factor）身份验证：这是最简单的身份验证方法，通常依靠用户名和密码来授予用户对系统的访问权限。
* 双因素（Two-Factor）身份验证：顾名思义，这是一个两步验证过程，不仅需要用户名和密码，而且还需要用户知道的一些内容，以确保附加的安全级别，如：安全提问、手机验证码。
* 多因素（Multi-Factor）身份验证：这是相当安全的身份验证方法，使用超过两个的因素来授予用户对系统的访问权限。所有因素都应相互独立，以消除系统中的漏洞。金融组织，银行和政府机关使用多因素身份验证来保护其数据和应用程序免受潜在威胁。

举个例子，当你在 ATM 机中插入银行卡后，机器会要求你输入密码。正确输入密码后，银行会确认你的身份，该卡确实属于你，并且你是该卡的合法所有者。

通过验证你的银行卡密码，银行实际上是在验证你的身份，这被称为身份验证。它仅仅识别你的身份，不做其它工作。

## Authorization

**Authorization（授权）** 是确定经过身份验证的用户是否有权访问特定资源的过程。

它验证您访问诸如数据库、文件等资源的权利。授权通常在身份验证之后进行，以确认您的执行特权。也就是说，授权决定了您访问系统的能力以及访问程度。

对系统的访问受身份验证和授权保护，任何访问系统的请求都可以通过输入有效的凭据进行身份验证，但是只有在成功授权后才会被接受。如果请求已通过验证但未获得授权，则系统将拒绝对系统的访问。

再举个例子，验证和确认组织中员工 ID 和密码的过程被称为身份验证，但确定哪个员工有权访问哪个楼层才被称为授权。

## 总结

| Authentication | Authorization |
| --- | --- |
| 身份验证确认您的身份以授予对系统的访问权限 | 授权确定您是否有权访问资源 |
| 这是验证用户凭据以获得用户访问权限的过程 | 这是验证是否允许访问的过程 |
| 它确定用户是否是他声称的身份 | 它确定用户可以访问和不能访问的内容 |
| 身份验证通常需要用户名和密码 | 授权所需的身份验证因素可能会有所不同，具体取决于安全级别 |
| 身份验证是授权的第一步，因此始终优先 | 成功进行身份验证后，将完成授权 |
| 特定大学的学生在访问大学官方网站的学生链接之前，必须先进行身份验证 | 授权可以确定成功认证后学生有权在大学网站上访问的信息 |

总的来说，身份验证和授权之间的区别在于：**身份验证意味着确认您自己的身份，而授权意味着授予对系统的访问权限；身份验证是验证您身份的过程，而授权是验证您有权访问的过程。**

## 参考链接

[身份验证 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E8%BA%AB%E4%BB%BD%E9%AA%8C%E8%AF%81 "身份验证 - 维基百科，自由的百科全书")

[授权 (信息安全) - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E6%8E%88%E6%AC%8A_(%E8%B3%87%E5%AE%89) "授权 (信息安全) - 维基百科，自由的百科全书")

[Difference between Authentication and Authorization | Difference Between](http://www.differencebetween.net/technology/difference-between-authentication-and-authorization/ "Difference between Authentication and Authorization | Difference Between")
