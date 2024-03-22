---
title: "查询 MySQL 所有数据库中的表名和字段名"
pubDate: 2021-05-13T16:43:21+08:00
lastmod: 2021-05-13T16:43:21+08:00
keywords: []
description: ""
categories: [Database]

---

因为需要熟悉公司的新业务，而公司的数据库架构是根据表的字段来区分的多租户架构，会有很多业务库混在一起，导致了需要查某个字段的时候会比较麻烦。

![MySQL Logo](/images/query-table-and-field-names-in-all-mysql-databases/mysql-logo.webp "MySQL Logo")

MySQL 的 information_schema 库中有以下字段：

* table_schema：数据库名；
* table_name：表名；
* column_name：字段名；

## 查询表名

```sql
SELECT * FROM information_schema.TABLES WHERE table_name = 'table1';
```

`TABLES` 必须是大写，不然会导致冲突。

## 查询字段名

```sql
SELECT * FROM information_schema.columns WHERE table_schema = 'schema1' AND column_name LIKE '%field1%';
```

也可以加上 `table_name` 的条件：

```sql
SELECT * FROM information_schema.columns WHERE table_schema = 'schema1' AND table_name = 'table1' AND column_name LIKE '%field1%';
```