---
title: "EAP 详解"
pubDate: 2019-11-20T04:27:00+08:00
lastmod: 2019-11-20T04:27:00+08:00
keywords: [EAP 知识点, EAP 架构, EAP 工作过程, EAP 包格式, EAP 认证机制, EAP 封装]
description: "详细介绍了跟 EAP 有关的知识点。"
categories: [RADIUS]

---

**EAP，即扩展认证协议（Extensible Authentication Protocol）**，由 [RFC 3748](https://tools.ietf.org/html/rfc3748 "RFC 3748") 定义，是一个在网络中经常使用的身份验证框架，并在 WiFi（IEEE 802.11）下的 WPA 和 WPA2 标准中作为规范认证机制。

![WiFi Logo](/images/eap-details/wifi-logo.webp "WiFi Logo")

## 出现原因

在 RADIUS 中，NAS 作为中间人需要了解 PC 客户端和 AAA 服务器之间的各种认证方式。

比如说，在使用 PAP 时，它就需要知道如何组织 User-Password 属性；在使用 CHAP 时，它就需要知道如何组织 CHAP-Password 和 CHAP-Challenge 属性。

在这种背景下，一旦要支持新的认证方式，那么参与认证的三方都需要进行修改和支持，这其中作为发起者的 PC 客户端和作为认证结束端的 AAA 服务器是必须进行修改的。

如果有一种协议能让作为中间人的 NAS 透明的转发 PC 和 AAA 之间的数据包，这样 NAS 就可以不进行修改。

基于以上考虑，EAP 应运而生。

## 架构

EAP 身份验证架构主要包含三个组件：

* 请求方（PC）
* 身份验证器（NAS）
* 身份验证服务器（AAA）

具体架构如下图所示：

![EAP Architecture](/images/eap-details/eap-architecture.webp "EAP Architecture")

EAP 的交换过程例子如下图所示：

![EAP Exchange Sample](/images/eap-details/eap-exchange-sample.webp "EAP Exchange Sample")

## 包格式

EAP 的基础包格式如下表所示：

| Code | Identifier | Length | Data |
| --- | --- | --- | --- |
| 1 byte | 1 byte | 2 bytes | variable length |

其中 Code 的分配如下表所示：

| Code | Assignment |
| --- | --- |
| 1 | Request |
| 2 | Response |
| 3 | Success |
| 4 | Failure |
| 5 | Initiate |
| 6 | Finish |

EAP 的 Request 和 Response 包格式如下表所示：

| Code | Identifier | Length | Type | Type-Data |
| --- | --- | --- | --- | --- |
| 1 byte | 1 byte | 2 bytes | 1 byte | variable length |

EAP 的 Success 和 Failure 包格式如下表所示：

| Code | Identifier | Length |
| --- | --- | --- |
| 1 byte | 1 byte | 2 bytes |

其中部分 Type 分配如下表所示：

| Type | Assignment |
| --- | --- |
| 0 | Reserved |
| 1 | Identify |
| 2 | Notification |
| 3 | NAK (Response Only) |
| 4 | MD5-Challenge |
| 5 | OTP, One Time Password |
| 6 | GTC, Generic Token Card |
| ... | ... |

其余分配见：[EAP Types – Extensible Authentication Protocol Types information](https://www.vocal.com/secure-communication/eap-types/ "EAP Types – Extensible Authentication Protocol Types information")。

## 封装

EAP 一般运行在数据链路层上，作为一种身份验证框架，而不是一种特定的身份验证机制，它为扩展和协商认证协议提供了一个标准，是为了承载多种认证协议而生的。

所以每个使用 EAP 的协议都定义了一种将用户 EAP 消息封装到该协议的消息中的方法。

PPP：EAP 最初是 PPP 的身份验证扩展。自从 EAP 被创建为 CHAP 和 PAP 的替代产品以来，PPP 就一直支持着 EAP。在 PPP 中的 EAP 由 [RFC 3748](https://tools.ietf.org/html/rfc3748 "RFC 3748") 定义。

IEEE 802.1X：EAPoL（EAP over LAN）即 IEEE 802 的 EAP 封装，在 IEEE 802.1X 中定义。

RADIUS：像 RADIUS 这种 AAA 协议也可以封装 EAP 消息。NAS 设备经常使用它们在 IEEE 802.1X 端点和 AAA 服务器之间转发 EAP 数据包，以促进 IEEE 802.1X。

## EAPoL

在 PC 和 NAS 之间，EAP 报文使用 EAPoL（EAP over LAN）封装格式，直接承载于 LAN 环境中。

在 NAS 和 AAA 之间，EAP 报文可以使用 EAPoR（EAP over RADIUS）封装格式，承载于 RADIUS 协议中；也可以由 NAS 终结转换，直接在 PC 与 AAA 之间传送 PAP 报文或 CHAP 等报文。

EAP 上承载的认证协议对 NAS 来说是透明的，NAS 不需要了解，也不需要支持，它只需要支持 EAP 即可。

EAPoL 是一种 EAP 在 LAN 上运行的简单封装。在有线环境下，共有三个组件：

* 请求方（访问网络资源的 PAE）
* 身份验证器（控制网络访问的 PAE）
* 身份验证服务器（RADIUS/AAA）

EAPoL 的具体架构如下图所示：

![EAPoL Architecture](/images/eap-details/eapol-architecture.webp "EAPoL Architecture")

EAPoL 的帧格式如下表所示：

| MAC Header | Ethernet Type | Version | Packet Type | Packet Body Length | Packet Body | FCS |
| --- | --- | --- | --- | --- | --- | --- |
| 12 bytes | 2 bytes | 1 byte | 1 byte | 2 bytes | variable length | 4 bytes |

* MAC Header 表示 MAC 地址，前 6 个字节是目标地址，后 6 个字节是源地址。
* Ethernet Type 表示类型代码，分配给 EAPoL 的是 0x888e。
* Version 表示 802.1X 版本。
* Packet Type 表示帧的类型，分配如下表所示：

| Packet Type | Assignment |
| --- | --- |
| 0 | EAP-Packet |
| 1 | EAPOL-Start |
| 2 | EAPOL-Logoff |
| 3 | EAPOL-Key |
| 4 | EAPOL-Encapsulated-ASF-Alert |

EAPoL 的交换过程例子如下图所示：

![EAPoL Exchange Sample](/images/eap-details/eapol-exchange-sample.webp "EAPoL Exchange Sample")

## 认证机制

EAP 一般运行在数据链路层上，可以直接运行于 PPP 或者 IEEE 802 之上，而不必依赖于 IP。在有线局域网和无线局域网中都可使用。

EAP 支持重传机制，但依赖于底层保证报文的有序传输，也就是说不支持乱序报文的接收。协议本身不支持分片与重组，当一些 EAP 认证方法需要传输大于 MTU 的数据包时，需要认证方法自身处理分片与重组。

EAP 提供了一些常用功能和被称为 EAP 方法的身份验证机制。当前定义了约 40 种不同的方法。RFC 中定义的方法包括 EAP-MD5、EAP-TLS、EAP-TTLS、EAP-FAST、EAP-SIM 等，这其中的大部分方法都可以在 WiFi 中使用。

此外，还存在许多特定于供应商的方法和建议。

### EAP-MD5

**EAP-MD5** 由 [RFC 2284](https://tools.ietf.org/html/rfc2284 "RFC 2284") 定义，是标准中第一个定义的 EAP 方法，只提供最小的安全性。

由于 MD5 散列函数容易受到字典攻击，并且不支持密钥生成，这使得它不能被动态 WEP 和 WPA/WPA2 Enterprise 使用。

EAP-MD5 与其他 EAP 方法的不同之处在于，它仅向 EAP 服务器提供对方的身份验证，而不能提供相互身份验证，所以 EAP-MD5 容易受到中间人攻击。

### LEAP

**LEAP（Lightweight Extensible Authentication Protocol）** 是一个 Cisco 开发的专用认证方法。

它本质上就是一个增加了动态 WEP 密钥和互验证（在客户端和 RADIUS 服务器之间）功能的 EAP-MD5。

动态 WEP 密钥意为：LEAP 允许客户端频繁地重新认证，所以在每次成功的身份验证后，客户端将获得一个新的 WEP 密钥，由此来希望该 WEP 密钥的寿命不足以被破解。

由于 EAP-MD5 最初并不是针对一个不受信的无线网络环境设计的，而是针对一个拥有一定物理安全的有线网络环境设计的，所以 LEAP 不适合用于无线局域网身份验证。

LEAP 本身的安全也很薄弱，无法抵御离线的字典攻击，因为它只是单纯的依靠 MS-CHAPv2 来保护用于无线局域网身份验证的用户证书。

由于 MS-CHAPv2 并没有在 NT Hash 中加盐，而是采用了两个字节的 DES 密钥，而且用户名使用明文传输，所以离线的字典攻击或者类似的暴力破解可以使用一个巨大的字典库对该系统进行有效的破解。

### EAP-TLS

**EAP-TLS（EAP Transport Layer Security）** 由 [RFC 5216](https://tools.ietf.org/html/rfc5216 "RFC 5216") 定义，是一个基于 TLS 协议的 EAP 方法，在供应商中有着良好的支持，截止至 2005 年 4 月，EAP－TLS 是供应商唯一需要保证实现的 WPA 和 WPA2 的 EAP 方法。

TLS 认证基于互验证，即客户端和服务器双方互相验证数字证书。

服务器提供自己的证书给客户端，客户端验证服务器证书通过后再提交自己的数字证书给服务器，所以一个脆弱的密码并不会导致基于 EAP-TLS 的系统遭到入侵，因为攻击者仍然需要客户端的证书。

客户端证书的要求使得 EAP-TLS 仍然被认为是可用的最安全的 EAP 标准之一。

可用的最高安全实践是将客户端证书的私钥放在智能卡中时，所以如果不窃取智能卡本身，就无法从智能卡窃取客户端证书的对应私钥。

与常见的密码盗窃相比，智能卡的物理盗窃更有可能被注意到，而且还能随时吊销智能卡。

此外，智能卡上的私钥通常使用仅智能卡所有者知道的 PIN 码进行加密，这样在智能卡被盗和发现并吊销的这段时间里，也能最大程度的防止被冒用。

EAP-TLS 的安全等级之所以如此之高，是因为它在传统的便利性与安全性之间选择了安全性。

TLS 基于的 PKI 证书体系，即是 TLS 的安全基础，也是 TLS 的缺点，这是因为 PKI 十分庞大和复杂。如果企业中原本没有部署 PKI 系统，那么单纯地为了这个认证方法而部署 PKI 则不是很合适。

EAP-TLS 的缺点还有客户端在认证时的负载较高和证书管理困难等。

### EAP-TTLS

**EAP-TTLS（EAP Tunneled Transport Layer Security）** 由 Funk Software 和 Certicom 共同开发，并在各个平台上得到广泛支持，是一个基于隧道 TLS 的 EAP 方法。

它有两个版本，分别是 EAP-TTLSv0 和 EAP-TTLSv1，分别由 [RFC 5281](https://tools.ietf.org/html/rfc5281 "RFC 5281") 和 [draft-funk-eap-ttls-v1-01](https://tools.ietf.org/html/draft-funk-eap-ttls-v1-01 "draft-funk-eap-ttls-v1-01") 定义。

为了解决 EAP-TLS 需要部署 PKI 系统的缺点，所以出现了 EAP-TTLS 方法，这样就不用建立 PKI 系统，而是直接在 TLS 隧道内部使用原有的认证方法，这样即保证了安全性，也减小了复杂度。

EAP-TTLS 是典型的两段式认证，第一阶段时建立 TLS 安全隧道，通过服务器发送证书给客户端实现认证，该阶段虽然也使用证书，但都是服务器证书，管理起来比 EAP-TLS 的客户端证书要简单。当安全隧道建立后，再开始第二阶段，也就是协商认证方法，对客户端进行认证。

客户端可以但不必通过 CA 签名的 PKI 证书对服务器进行身份验证。由于不需要在每个客户端上使用证书，因此可以大大简化设置过程。

EAP-TTLS 可以使用现有的且广泛部署的身份验证协议和基础结构，并结合了旧的密码机制和身份验证数据库，而安全隧道则提供了防止窃听和中间人攻击的保护。用户名也不会以未加密的明文形式传输，从而提高了隐私性。

### PEAP

**PEAP（Protected Extensible Authentication Protocol）**，是一种把 EAP 封装到 TLS 隧道中的协议。

PEAP 由 Cisco Systems、Microsoft 和 RSA Security 联合开发。它有三个版本，分别是 PEAPv0、PEAPv1 和 PEAPv2，分别由 [draft-kamath-pppext-peapv0-00](https://tools.ietf.org/html/draft-kamath-pppext-peapv0-00 "draft-kamath-pppext-peapv0-00")、[draft-josefsson-pppext-eap-tls-eap-00](https://tools.ietf.org/html/draft-josefsson-pppext-eap-tls-eap-00 "draft-josefsson-pppext-eap-tls-eap-00") [draft-josefsson-pppext-eap-tls-eap-05](https://tools.ietf.org/html/draft-josefsson-pppext-eap-tls-eap-05 "draft-josefsson-pppext-eap-tls-eap-05") 和 [draft-josefsson-pppext-eap-tls-eap-06](https://tools.ietf.org/html/draft-josefsson-pppext-eap-tls-eap-06 "draft-josefsson-pppext-eap-tls-eap-06") 定义。

EAP 默认拥有安全的通信线路，如有物理安全保护的通信线路，因此未提供用于保护 EAP 对话的机制。但是广泛使用的无线局域网中是没有物理安全保护的，所以提出 Protected EAP 来改进这个缺陷。

PEAP 在设计上和 EAP-TTLS 类似，只需要服务器端 PKI 证书，就能创建安全的 TLS 隧道来保护身份验证。

PEAP 没有指定特定方法，它可以和多个 EAP 方法搭配使用。最普遍支持使用的是 PEAPv0/EAP-MSCHAPv2 和 PEAPv1/EAP-GTC。截至 2005 年 5 月，这两种 PEAP 子类型已经获得了 WPA/WPA2 标准的认证。

### EAP-FAST

**EAP-FAST（EAP Flexible Authentication via Secure Tunneling）** 由 [RFC 4851](https://tools.ietf.org/html/rfc4851 "RFC 4851") 定义，由 Cisco Systems 提出，用于代替 LEAP，旨在解决 LEAP 的弱点，同时保留轻量。

EAP-FAST 和 PEAP 类似，有两个主要阶段。第一阶段是建立一个安全的加密隧道，第二阶段是通过 MS-CHAPv2 来对客户端身份进行验证。由于 MS-CHAPv2 是一个相当脆弱的协议，通过字典攻击很容易被破解，因此第一阶段建立的安全加密隧道为 MS-CHAPv2 提供了一个安全的环境。

EAP-FAST 与 PEAP 不同之处，在于建立安全隧道的方式：EAP-FAST 采用 PAC（受保护的访问凭据）来建立隧道，而 PEAP 则是采用服务器端的数字证书建立 TLS 隧道（与 HTTPS 的工作方式类似）。

EAP-FAST 的验证服务器会为每个用户提供一个特殊的 PAC 文件，而配发这个 PAC 的过程可以被认作是阶段零，即自动提供。如果不使用 PAC 文件，则可以当作普通的 EAP-TLS 使用。

### 其它认证机制

#### EAP-SIM

EAP-SIM（EAP Subscriber Identity Module）由 [RFC 4186](https://tools.ietf.org/html/rfc4186 "RFC 4186") 定义，它通过全球移动通信系统（GSM）中的用户身份模块（SIM）进行身份验证和会话密钥分发。

EAP-SIM 在客户端和 AAA 服务器之间使用 SIM 身份验证算法来提供互验证。

在 EAP-SIM 中，SIM 卡与身份验证中心（AuC）之间的通信取代了客户端与 AAA 服务器之间需要预先建立密码的要求。

#### EAP-AKA

EAP-AKA（EAP Authentication and Key Agreement）由 [RFC 4187](https://tools.ietf.org/html/rfc4187 "RFC 4187") 定义，它通过 USIM 进行身份验证和会话密钥分发。

#### EAP-AKA'

EAP-AKA'（EAP Authentication and Key Agreement prime）由 [RFC 5448](https://tools.ietf.org/html/rfc5448 "RFC 5448") 定义，对 EAP-AKA 进行了以下两个主要修改：更新了密钥导出机制和防止降级攻击（Downgrade attack），即中间人可能操作认证过程，使双方在协商认证算法时使用安全程度较低的算法，如 EAP-AKA’ 降级为 EAP-AKA。

#### EAP-GTC

EAP-GTC（EAP Generic Token Card）由 [RFC 2284](https://tools.ietf.org/html/rfc2284 "RFC 2284") 和 [RFC 3748](https://tools.ietf.org/html/rfc3748 "RFC 3748") 定义，用于代替 PEAPv0/EAP-MSCHAPv2。它通过使用来自身份验证服务器的文本质询和由安全令牌生成的回复来进行身份验证。

#### EAP-IKEv2

EAP-IKEv2（EAP Internet Key Exchange v. 2）由 [RFC 5106](https://tools.ietf.org/html/rfc5106 "RFC 5106") 定义，原型实现为 [EAP-IKEv2 Project
](https://sourceforge.net/projects/eap-ikev2/ "EAP-IKEv2 Project")。

EAP-IKEv2 是基于 [Internet Key Exchange](https://en.wikipedia.org/wiki/Internet_Key_Exchange "Internet Key Exchange") 的 EAP 方法，它提供 EAP 对等方和服务器之间的相互身份验证和会话密钥建立。

#### EAP-PWD

EAP-PWD（EAP Password）由 [RFC 5931](https://tools.ietf.org/html/rfc5931 "RFC 5931") 定义，它是一种通过使用共享密码进行身份验证的 EAP 方法。该密码可以是低熵密码，并且可以从一组可能的密码中获取，如字典，攻击者可以使用该密码。底层的密钥交换可以抵抗主动攻击、被动攻击和字典攻击。

#### EAP-PSK

EAP-PSK（EAP Pre-Shared Key）由 [RFC 4764](https://tools.ietf.org/html/rfc4764 "RFC 4764") 定义，它通过使用 [PSK](https://en.wikipedia.org/wiki/Pre-shared_key "PSK") 来进行相互身份验证和会话密钥派生。

当互验证成功时，它为双方通信提供了一个受保护的线路，并设计用于通过不安全的网络（如 IEEE 802.11）进行认证。

#### EAP-EKE

EAP-EKE（EAP Encrypted Key Exchange）由 [RFC 6124](https://tools.ietf.org/html/rfc6124 "RFC 6124") 定义，通过使用短密码来提供安全的互验证，而不需要公钥证书。

#### EAP-NOOB

EAP-NOOB（Nimble out-of-band authentication for EAP）由 [draft-aura-eap-noob-08](https://tools.ietf.org/html/draft-aura-eap-noob-08 "draft-aura-eap-noob-08") 定义，是一种通用的自举解决方案，适用于没有预先配置身份验证凭据，且尚未在任何服务器上注册的设备。如没有任何所有者、网络或服务器信息的物联网（IoT）设备。

#### EAP-POTP

EAP-POTP（EAP Protected One-Time Password）由 [RFC 4793](https://tools.ietf.org/html/rfc4793 "RFC 4793") 定义，是由 RSA Laboratories 使用一次性密码（OTP）令牌（如手持式硬件设备、硬件或软件模块）开发的 EAP 方法。

EAP-POTP 在个人计算机上运行，​​以生成身份验证密钥。可用于在其它 EAP 方法中提供互验证和密钥材料。

EAP-POTP 提供了双因素的用户身份验证，这意味着用户既需要对令牌进行物理访问，又需要知道 PIN 才能通过身份验证。

#### TEAP

TEAP（Tunnel Extensible Authentication Protocol）由 [RFC 7170](https://tools.ietf.org/html/rfc7170 "RFC 7170") 定义，是一种基于隧道的 EAP 方法，可通过使用 TLS 协议建立隧道，来实现对等方和服务器之间的安全通信。

TEAP 在隧道内通过 TLV（Type-Length-Value）对象来传递与身份验证相关的数据。

TEAP 允许通过发送特定格式的请求来向服务器询问证书和提供证书，还允许通过该格式将受信任的根证书分发给对等方。这两种操作都封装在相应的 TLV 中，并且以安全的方式在先前建立的 TLS 隧道内进行。

## 协议与密码兼容性

密码能够以多种形式存储在数据库中，如明文、MD5 散列、NT 散列或其他形式。

在 EAP 和 RADIUS 中，你想使用的身份验证协议有时候和你的密码存储方式不兼容。

身份验证协议和密码存储方式的兼容性如下表所示：

| | Clear-text | NT hash | MD5 hash | Salted MD5 hash | SHA1 hash | Salted SHA1 hash | Unix Crypt |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PAP | yes | yes | yes | yes | yes | yes | yes |
| CHAP | yes | no | no | no | no | no | no | no |
| Digest | yes | no | no | no | no | no | no | no |
| MS-CHAP | yes | yes | no | no | no | no | no | no |
| PEAP | yes | yes | no | no | no | no | no | no |
| EAP-MSCHAPv2 | yes | yes | no | no | no | no | no | no |
| LEAP | yes | yes | no | no | no | no | no | no |
| EAP-GTC | yes | yes | yes | yes | yes | yes | yes |
| EAP-MD5 | yes | no | no | no | no | no | no | no |
| EAP-SIM | yes | no | no | no | no | no | no | no |
| EAP-TLS | no | no | no | no | no | no | no | no |

如果对应的单元格为 yes，则表示相应的密码存储方式和协议兼容，并且可以进行身份​​验证。

如果对应的单元格为 no，则表示相应的密码存储方式和协议不兼容，并且无法进行身份验证。解决方法是停止尝试使用该身份验证协议，或者以与该身份验证协议兼容的形式存储密码，也就是说让用户更改密码。

## 参考链接

[Extensible Authentication Protocol - Wikipedia](https://en.wikipedia.org/wiki/Extensible_Authentication_Protocol "Extensible Authentication Protocol - Wikipedia")

[RFC 3748 - Extensible Authentication Protocol (EAP)](https://tools.ietf.org/html/rfc3748 "RFC 3748 - Extensible Authentication Protocol (EAP)")

[EAP - Extensible Authentication Protocol](https://www.vocal.com/secure-communication/eap/ "EAP - Extensible Authentication Protocol")

[EAPoL - Extensible Authentication Protocol over LAN](https://www.vocal.com/secure-communication/eapol-extensible-authentication-protocol-over-lan/ "EAPoL - Extensible Authentication Protocol over LAN")

[EAP 认证](http://lishiwen4.github.io/wifi/EAP-method "EAP 认证")

[Deploying RADIUS: Protocol and Password Compatibility](http://deployingradius.com/documents/protocols/compatibility.html "Deploying RADIUS: Protocol and Password Compatibility")
