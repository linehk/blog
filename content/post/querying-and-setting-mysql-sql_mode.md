---
title: "查询和设置 MySQL sql_mode"
date: 2021-03-15T11:32:08+08:00
lastmod: 2021-03-15T11:32:08+08:00
keywords: []
description: ""
categories: [Database]

---

因为公司规定需要使用新的内部测试系统，而测试系统的 MySQL 运行在 Docker 里面，并且生产环境的 sql_mode 不是默认值，所以写了这篇博客来记录如何查询和设置 sql_mode。

<!--more-->

![MySQL Logo](/images/querying-and-setting-mysql-sql_mode/mysql-logo.webp "MySQL Logo")

## 查询 sql_mode

* `SELECT @@sql_mode;`
* `SHOW VARIABLES LIKE 'sql_mode';`

## 设置 sql_mode

* 写入 SQL 查询，数据库链接关闭后失效：`SET GLOBAL sql_mode='';`
* 写入 MySQL 配置文件，Docker 重启后失效：`echo [mysqld] >> /etc/mysql/my.cnf; echo "sql_mode=''" >> /etc/mysql/my.cnf`
* 写入 Docker 配置文件，Docker 重启后还可以生效：`echo "sql_mode=''" >> /etc/mysql/conf.d/docker.cnf`

## 参考链接

[5.1.10 Server SQL Modes](https://dev.mysql.com/doc/refman/5.7/en/sql-mode.html "5.1.10 Server SQL Modes")