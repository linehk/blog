---
title: "sqlc 检查行是否存在"
pubDate: 2024-05-18T14:36:00+08:00
lastmod: 2024-05-18T14:36:00+08:00
keywords: []
description: ""
categories: [sqlc]

---

在使用 sqlc 时，有时候需要检查行是否存在。

这时可以使用 SQL 的 SELECT EXISTS 语法来实现，例如：

```sql
-- name: CheckUserByID :one
SELECT EXISTS (SELECT 1 FROM app_user WHERE id = $1);
```

生成的代码如下：

```go
func (q *Queries) CheckUserByID(ctx context.Context, id int32) (bool, error)
```

返回的 bool 为 true 时，表示行存在；为 false 时，表示行不存在。