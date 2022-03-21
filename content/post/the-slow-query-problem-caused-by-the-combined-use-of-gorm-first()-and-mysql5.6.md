---
title: "GORM First() 和 MySQL 5.6 共同使用造成的慢查询问题"
date: 2021-01-17T09:52:32+08:00
lastmod: 2021-01-17T09:25:32+08:00
keywords: []
description: ""
categories: [Database]

---

因为在公司业务中遇到了这个问题，所以写了这篇博客来记录出现问题的原因和修复方法。

<!--more-->

![MySQL Logo](/images/the-slow-query-problem-caused-by-the-combined-use-of-gorm-first()-and-mysql5.6/mysql-logo.webp "MySQL Logo")

## 原因

MySQL 5.6 在使用有 `ORDER BY` 和 `LIMIT` 语句的查询时，如果数据不够 `LIMIT`，就会直接全索引扫描。

而 GORM 的 `First()` 方法也会嵌入这两种语句，如：`SELECT * FROM users ORDER BY id LIMIT 1;`。

这样就造成了比较难排查的慢查询问题。

## 修复

* 因为问题只出现在 MySQL 5.6，所以可以升级或降级；
* 对于业务上有用到 `ORDER BY` 和 `LIMIT` 语句的逻辑，考虑不用或放到内存中排序；
* 对于业务上需要任意取一行的逻辑，不要使用 GORM 的 `First()` 方法，而是手动实现。

## 参考链接

[MySQL Bugs: #78993: Optimizer use index scan instead of range scan by mistake](https://bugs.mysql.com/bug.php?id=78993 "MySQL Bugs: #78993: Optimizer use index scan instead of range scan by mistake")

[查询](https://gorm.io/zh_CN/docs/query.html "查询")