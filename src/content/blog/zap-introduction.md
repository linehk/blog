---
title: "ZAP 介绍"
pubDate: 2012-08-20T21:36:30+08:00
lastmod: 2012-08-20T21:37:30+08:00
keywords: [ZAP 介绍]
description: "ZAP 介绍"
categories: [Misc]

---

本文为 2012 年在 [FreeBuf](https://www.freebuf.com/ "FreeBuf") 发表的文章，原地址为：[ZAP 介绍](https://www.freebuf.com/sectool/5427.html "ZAP 介绍")。以下内容除了将图片转换为 WebP 外均无修改。

感谢[Line](http://linehk.blog.com/ "Line")投递，转载请注明出处！

Zed Attack Proxy简写为[ZAP](http://www.freebuf.com/sectool/103803.html "ZAP")，是一个简单易用的[渗透测试工具](http://www.freebuf.com/sectool/96574.html "渗透测试工具")，是发现Web应用中的漏洞的利器，更是渗透测试爱好者的好东西。

ZAP下载地址：[https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project](https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project "https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project")

ZAP中国：[http://www.owasp.org.cn/](http://www.owasp.org.cn/ "http://www.owasp.org.cn/")

BackTrack5R3中集成了ZAP，下面我来演示了一下ZAP的简单实用。

<!--more-->

打开方式：

1、

```shell
cd /pentest/web/owasp-zap
./zap.sh
```

2、

```text
Applications|BackTrack|Vulnerability Assessment|Web Application Assessment|Web Vulnerability Scanners|owasp-zap
```

使用方法：

1.设置

ZAP像Burp suite一样使用代理的方式来截取网站。

![ZAP 设置](/images/zap-introduction/zap-setting.webp "ZAP 设置")

在Tools|Local proxy中设置相关选项。

![ZAP 选项](/images/zap-introduction/zap-option.webp "ZAP 选项")

默认已经设置好了，如果端口冲突就自己改。

在Firefox中设置代理。

Edit|Preferences|Advanced|Network|Setting

选择Manual proxy configuration单选项。

![Firefox 设置](/images/zap-introduction/firefox-setting.webp "Firefox 设置")

浏览目标机器，这里使用Metasploitable2来示例。

用Firefox访问后，在ZAP中出现了Sites。

2.Spider site

右键选择Attack|Spider site

![Spider site](/images/zap-introduction/spider-site.webp "Spider site")

扫描要很久，因为是示例所以就先停了。

3.Brute Force

在Site选择目标，在List中选择字典。有big medium small等类型的字典。

![Brute Force](/images/zap-introduction/brute-force.webp "Brute Force")

4.Port Scanner

![Port Scanner](/images/zap-introduction/port-scanner.webp "Port Scanner")

虽然扫描速度很快，但是不够Nmap准确。

5.Active Scan

主动扫描是ZAP最强大的功能之一。

![Active Scan](/images/zap-introduction/active-scan.webp "Active Scan")

6.Alerts

扫描出来的漏洞就在这里了。

![Alerts](/images/zap-introduction/alerts.webp "Alerts")

7.插件

待续
