---
title: "sqlc 动态查询方法"
pubDate: 2024-05-18T13:09:07+08:00
lastmod: 2024-05-18T13:09:07+08:00
keywords: []
description: ""
categories: [sqlc]

---

在使用 sqlc 时，有时候需要对字段进行动态查询，即字段不为空时，才使用该条件。

这时可以使用 SQL 的 OR 语法来实现，例如：

```sql
-- name: ListUser :many
SELECT *
FROM app_user
WHERE ($1::VARCHAR = '' OR $1::VARCHAR ILIKE '%' || $1 || '%')
AND ($2::VARCHAR = '' OR $2::VARCHAR ILIKE '%' || $2 || '%')
AND ($3::VARCHAR = '' OR $3::VARCHAR = $3)
AND id > $4;
```

* 当 $1、$2、$3 参数为空时，对应的条件子句对结果没影响；
* 当 $1、$2、$3 参数不为空时，对应的条件子句才会使用 OR 后面的条件。