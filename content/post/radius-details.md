---
title: "RADIUS 详解"
date: 2019-10-25T01:16:20+08:00
lastmod: 2019-10-25T01:16:20+08:00
keywords: [RADIUS 知识点, RADIUS 介绍, RADIUS 工作过程, RADIUS 包格式, RADIUS 认证机制]
description: "详细介绍了跟 RADIUS 有关的知识点。"
categories: [RADIUS]

---

**RADIUS，即远程用户拨入验证服务（Remote Authentication Dial In User Service）**，是应用最为广泛的 AAA 协议之一。

而 AAA 是身份验证（Authentication）、授权（Authorization）和计费（Accounting）的简称，是进行访问控制的一种框架，可用多种协议来实现，其中最常见的一种就是 RADIUS。

RADIUS 是一种 C/S 架构的协议，由 [RFC 2865](https://tools.ietf.org/html/rfc2865 "RFC 2865") 和 [RFC 2866](https://tools.ietf.org/html/rfc2866 "RFC 2866") 定义，最初的客户端为 NAS 服务器。

实际上任何运行了 RADIUS 客户端软件（如 [FreeRADIUS](https://freeradius.org/ "FreeRADIUS")）的计算机都可以被看作是 RADIUS 的客户端。

<!--more-->

![RADIUS Logo](/images/radius-details/radius-logo.webp "RADIUS Logo")

## 工作过程

RADIUS 的工作过程如下图所示：

![RADIUS Workflow](/images/radius-details/radius-workflow.webp "RADIUS Workflow")

使用文字来叙述则是：

1. 用户输入用户名和口令。
2. RADIUS 客户端根据获取到的用户名和口令向 RADIUS 服务器发送认证请求包（Access-Request）。
3. RADIUS 服务器对接收到的用户名和口令进行认证（如查询数据库），如果认证成功，则返回认证接受包（Access-Accept）；如果认证失败，则返回认证拒绝包（Access-Reject）；如果具体认证机制需要进行 Challenge，则返回认证挑战包（Access-Challenge）。
4. RADIUS 客户端向 RADIUS 服务器发送计费开始请求包（Accounting-Request），该包中的 Acct-Status-Type 取值为 1，意为开始。
5. RADIUS 服务器接收到计费开始请求包后返回计费开始响应包（Accounting-Response）。
6. 用户这时在给定的权限限制下访问资源。
7. 用户访问资源结束后，RADIUS 客户端向 RADIUS 服务器发送计费停止请求包（Accounting-Request），该包中的 Acct-Status-Type 取值为 2，意为停止。
8. RADIUS 服务器接收到计费停止请求包后返回计费结束响应包（Accounting-Response）。
9. RADIUS 客户端通知用户访问结束。

## 包格式

RADIUS 的包格式如下：

![RADIUS Packet Format](/images/radius-details/radius-packet-format.webp "RADIUS Packet Format")

这些字段从左到右依次传输，即从 Code 开始到 AVPs 结束。

所有 Code 分配如下：

| Code | Assignment |
| --- | --- |
| 1 | Access-Request |
| 2 | Access-Accept |
| 3 | Access-Reject |
| 4 | Accounting-Request |
| 5 | Accounting-Response |
| 11 | Access-Challenge |
| 12 | Status-Server (experimental) |
| 13 | Status-Client (experimental) |
| 40 | Disconnect-Request |
| 41 | Disconnect-ACK |
| 42 | Disconnect-NAK |
| 43 | CoA-Request |
| 44 | CoA-ACK |
| 45 | CoA-NAK |
| 255 | Reserved |

其中的属性值对（AVPs, Attribute value pairs）为一个个三元组，结构如下：

![RADIUS AVP Layout](/images/radius-details/radius-avp-layout.webp "RADIUS AVP Layout")

部分 Type 分配如下：

| AVP type | Assignment |
| --- | --- |
| 1 | User-Name |
| 2 | User-Password |
| 3 | CHAP-Password |
| 4 | NAS-IP-Address |
| 5 | NAS-Port |
| 6 | Service-Type |
| 7 | Framed-Protocol |
| 8 | Framed-IP-Address |
| 9 | Framed-IP-Netmask |
| 10 | Framed-Routing |
| 11 | Filter-Id |
| 12 | Framed-MTU |
| 13 | Framed-Compression |
| 14 | Login-IP-Host |
| 15 | Login-Service |
| 16 | Login-TCP-Port |
| ... | ... |

其余分配见 [Attribute_value_pairs](https://en.wikipedia.org/wiki/RADIUS#Attribute_value_pairs "Attribute_value_pairs")。

## 其它细节

和其它 AAA 协议不同，RADIUS 协议合并了身份验证和授权的过程，即在身份验证响应报文中携带了授权信息。

RADUIS 服务器和 NAS 服务器之间通过 UDP 协议进行通信，还规定了重传机制，并由 1812 端口负责认证，1813 端口负责计费。

如果 NAS 向某个 RADIUS 服务器发起请求没有收到响应，那么可以要求备份 RADUIS 服务器重传。由于有多个备份 RADIUS 服务器，因此 NAS 可以采用轮询的方法。

如果备份 RADIUS 服务器的密钥和以前的 RADIUS 服务器的密钥不同，则需要重新进行认证。

RADIUS 还支持代理功能，即作为 RADIUS 代理服务器，只负责转发 RADIUS 数据包到其它 RADIUS 服务器。如下图所示：

![RADIUS Proxy](/images/radius-details/radius-proxy.webp "RADIUS Proxy")

## 认证机制

RADIUS 的认证机制可以采用 PAP、CHAP、MS-CHAP 等方法，而采用不同的方法，RADIUS 的具体工作过程也不相同。

### PAP

**密码认证协议（PAP, Password Authentication Protocol）** 由 [RFC 1334](https://tools.ietf.org/html/rfc1334 "RFC 1334") 定义，是典型的二次握手简单认证协议，它是一种弱密码认证方法，其密码以 ASCII 格式在线路上进行传输，对于窃听和重放没有任何保护。

在 PAP 中，只由 NAS 来验证 PC，即单向验证。所以 PAP 工作过程其实相当简单，首先由客户端发送认证请求（Authentication-Request），包含用户名和密码，然后由服务器来验证，如果凭据正确，服务器发送认证确认（Authentication-Ack），否则发送认证否定（Authentication-Nak）。

具体工作细节如下：

1. PC <---> NAS：这部分的传输信息是否为明文由数据链路层上的协议来决定，如果在 PPP 协议上运行，则为明文；如果在 TTLS 协议上运行，则外层隧道是加密的，即使 PAP 使用的是明文密码，从隧道外来说仍然是加密的。
2. NAS <---> AAA：NAS 将密码加密，放到 RADIUS 数据包中的 User-Password 属性中发送到 RADIUS 服务器，服务器收到认证请求后，使用和 NAS 预先共享的密钥加上数据包中的 Authenticator 属性进行解密，然后跟数据库中的密码进行对比来得到认证结果。

具体包格式如下：

| Description | 1 byte | 1 byte | 2 bytes | 1 byte | Variable | 1 byte | Variable |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Authentication-Request | Code = 1 | ID | Length | Username length | Username | Password length | Password |
| Authentication-Ack | Code = 2 | ID | Length | Message length | Message |  |  |
| Authentication-Nak | Code = 3 | ID | Length | Message length | Message |  |  |

并被嵌入到 PPP 协议的帧中，Protocol 的值为十六进制的 C023。

| Flag | Address | Control | Protocol (C023 (hex)) | Payload (table above) | FCS | Flag |
| --- | --- | --- | --- | --- | --- | --- |

### CHAP

**询问握手认证协议（CHAP, Challenge-Handshake Authentication Protocol）** 由 [RFC 1994](https://tools.ietf.org/html/rfc1994 "RFC 1994") 定义，是一种三次握手协议。

因为通过使用递增更改的 Packet Identifier 和可变的 Challenge value 来提供保护，所以防止了重放攻击，相对于 PAP 来说安全性高一些。

在 CHAP 中，通过三次握手周期性的验证对端的身份，可在初始链路建立时进行，也可以在链路建立之后重复进行。

举个例子，如果 NAS 要对 PC 进行验证，步骤如下：

1. 在链路建立后，NAS 向 PC 发送一个 Challenge 包。
2. PC 收到该包后，对该包和密码组合后使用哈希函数（如 MD5）计算出密文放入 Response 包中，并发送回 NAS。
3. NAS 收到密文后，对原本的 Challenge 和密码进行哈希，得到另一组密文。如果这两组密文相同则表示验证通过并发送 Success 包，不相同则表示验证失败并发送 Failure 包。

具体工作细节如下：

1. PC <---> NAS：NAS 向 PC 发送一个 Challenge 包，该包中的值是随机的，然后 PC 将用户输入的明文密码和接收到的 Challenge 包加密后将用户名和密文打包后发送给 NAS。
2. NAS <---> AAA：NAS 收到 PC 发送的认证请求后，将用户名和密文打包进 RADIUS 数据包中的 User-Name 和 CHAP-Passowrd 中，还需要携带 Challenge 给 RADIUS 服务器，否则服务器无法验证，一般选择放入 CHAP-Challenge 或 Authenticator 中。NAS 将以上数据发送给 RADIUS 服务器后，服务器在本地读取明文密码，加上 Challenge 后用相同哈希函数计算出密文，与 CHAP-Password 进行对比后得到认证结果。

在 FreeRADIUS 中，一般是先从复杂的协议开始确认，比如先在属性中查找是否有 CHAP-Password 属性，如果有就当作 CHAP 处理，如果没有找到 CHAP-Password ，再查找是否有 User-Password 属性，如果有就当作 PAP 处理。

特点有：

* 要求客户端和服务器都知道密钥，而这个密钥不是通过链路传输的。
* 虽然认证是单向的，但是在两个方向都可以进行，同一密钥可以很容易的实现相互认证。
* 在大型网络中不适用，因为每个密钥由链路的两端共同维护，这样会开销会指数性提升。

具体包格式如下：

| Description | 1 byte | 1 byte | 2 bytes | 1 byte | Variable | variable |
| --- | --- | --- | --- | --- | --- | --- |
| Challenge | Code = 1 | ID | Length | Challenge Length | Challenge value | Name |
| Response | Code = 2 | ID | Length | Response Length | Response value | Name |
| Success | Code = 3 | ID | Length |  | Message |  |
| Failure | Code = 4 | ID | Length |  | Message |  |

### MS-CHAP

**微软询问握手认证协议（MS-CHAP, Microsoft Challenge-Handshake Authentication Protocol）** 有两个版本 MS-CHAPv1 和 MS-CHAPv2，这两个版本分别由 [RFC 2433](https://tools.ietf.org/html/rfc2433 "RFC 2433") 和 [RFC 2759](https://tools.ietf.org/html/rfc2759 "RFC 2759") 定义，用作与 IEEE 802.1X 一起使用的 RADIUS 服务器的身份验证选项（如使用 WPA-Enterprise 的 WiFi 认证），更进一步用作 PEAP 的主要身份验证选项。

MS-CHAPv1 的基本思想就是发送的 Response 包不再是 CHAP 中的 MD5(明文密码 + Challenge) 的形式了，而是把明文密码改成 MS 加密后的密文，也就是说 PC 发送密码时使用单向加密后的密码再加密。

所以认证端也不用明文密码，但只有明文密码的话，可以对明文密码进行和 MS 一样的加密来获取密文。

现在大多数厂商都已经弃用 MS-CHAPv1，而在其基础上 MS-CHAPv2 可以通过在 Response 包上承载对等质询，并在 Success 包上承载身份验证器响应，来提供对等方之间的相互身份验证。

MS-CHAPv2 的具体工作细节如下：

1. PC <---> NAS：NAS 向 PC 发送一个 Challenge 包，PC 进行响应。
2. NAS <---> AAA：NAS 收到 PC 的响应后，组织好 MSCHAP-Challenge 和 MSCHAP-Response 属性发送给 RADIUS 服务器，然后服务器在本地读取明文密码（或 LM-Password、NT-Password），加上 MSCHAP-Challenge 后计算出密文，与收到的 MSCHAP-Response 进行对比后得到认证结果。

与单纯的 CHAP 相比，MS-CHAP 的特点有：

* 通过协商 LCP 选项三身份验证协议中的 CHAP 算法为 0x80 来启用 MS-CHAPv1，对于 MS-CHAPv2 来说则是 0x81。
* 新增了一个认证者控制的密码变更机制。
* 新增了一个认证者控制的认证重试机制。
* 新增了一个在失败数据包消息字段中返回的失败代码。

MS-CHAPv1 和 MS-CHAPv2 的包格式基本与 CHAP 相同。

## 参考链接

[RADIUS - Wikipedia](https://en.wikipedia.org/wiki/RADIUS "RADIUS - Wikipedia")

[RFC 2865 - Remote Authentication Dial In User Service (RADIUS)](https://tools.ietf.org/html/rfc2865 "RFC 2865 - Remote Authentication Dial In User Service (RADIUS)")

[RFC 2866 - RADIUS Accounting](https://tools.ietf.org/html/rfc2866 "RFC 2866 - RADIUS Accounting")

[Radius · GitBook](https://tonydeng.github.io/sdn-handbook/sdn/aaa/radius.html "Radius · GitBook")

[EAP 认证](http://lishiwen4.github.io/wifi/EAP-method "EAP 认证")
