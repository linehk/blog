---
title: "在 FreeRADIUS 上配置 rlm_rest"
pubDate: 2019-09-25T20:00:42+08:00
lastmod: 2019-09-25T20:00:42+08:00
keywords: [FreeRADIUS, rlm_rest, FreeRADIUS rlm_rest, FreeRADIUS HTTP, FreeRADIUS REST]
description: "介绍了如何在 FreeRADIUS 上配置 rlm_rest。"
categories: [RADIUS]

---

从 3.0.x 版本开始，FreeRADIUS 开始支持 rlm_rest 模块，顾名思义，该模块可用于将 RADIUS 身份验证请求转换为 HTTP 请求，该请求符合 REST 规范。

但是，模块当前未实现 RADIUS 的所有功能，例如质询响应身份验证和属性映射，所以不支持 MS-CHAPv2 等协议。

<!--more-->

![FreeRADIUS Logo](/images/config-rlm_rest-on-freeradius/freeradius-logo.webp "FreeRADIUS Logo")

## 安装

Ubuntu 17.04 和 Debian 9 是首个包含 FreeRADIUS 3.0.x 版本的操作系统。

在这些操作系统中，所需的软件包可以如下安装：

```shell
sudo apt-get install freeradius freeradius-rest
```

## 配置

首先，需要在 FreeRADIUS 上通过软连接启用 rlm_rest 模块：

```shell
cd /etc/freeradius/mods-enabled
ln -s ../mods-available/rest .
```

然后，在 */etc/freeradius/users* 文件中配置身份验证类型：

```plaintext
DEFAULT Auth-Type := rest
```

而站点配置应按以下方式调用该模块：

```plaintext
authenticate {
     Auth-Type rest {
        rest
     }
     digest
     unix
}
```

最后，通过 */etc/freeradius/mods-enabled/rest* 文件配置模块本身：

```plaintext
connect_uri = "https://127.0.0.1/"

authenticate
    uri = "${..connect_uri}/check"
    method = 'post'
    body = 'post'
    data = "user=%{urlquote:%{User-Name}}&pass=%{urlquote:%{User-Password}}"
    force_to = 'plain'
    tls = ${..tls}
}
```

## 测试

如果你的 *clients.conf* 已经正确配置，那么 FreeRADIUS 现在是可以正常响应身份验证请求的。可作如下测试：

```shell
echo "User-Name=username, User-Password=password" | radclient -sx RADIUSServerAdress auth secret
```

该命令的作用是发送一条身份验证请求到 RADIUS 服务器。

通过监听在 *https://127.0.0.1/check* 上的 HTTP 请求，可以正确得到用户名和密码信息。

## 参考链接

[rest | FreeRADIUS Documentation](https://networkradius.com/doc/current/raddb/mods-available/rest.html "rest | FreeRADIUS Documentation")

[Configuration of rlm_rest](https://privacyidea.readthedocs.io/en/latest/application_plugins/rlm_rest.html "Configuration of rlm_rest")
