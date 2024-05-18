---
title: "sqlc 使用切片作为查询条件"
pubDate: 2024-05-18T13:23:57+08:00
lastmod: 2024-05-18T13:23:57+08:00
keywords: []
description: ""
categories: [sqlc]

---

使用 sqlc 时，有时候需要使用切片作为查询条件。

这里有两种方法：

## 方法 1

在 `=` 号后面，使用 `ANY($1::int[])`。例如：

```sql
-- name: ListUserRoleByUserIDList :many
SELECT *
FROM user_role
WHERE user_id = ANY($1::int[]);
```

其中 `int` 表示 `$1` 字段的类型，`[]` 表示切片。

生成的代码如下：

```go
func (q *Queries) ListUserRoleByUserIDList(ctx context.Context, dollar_1 []int32) ([]UserRole, error)
```

这样就可以传入切片作为查询条件了。

## 方法 2

sqlc 更新后，可以使用 `sqlc.slice` 来表示切片。例如：

```sql
-- name: Foo :many
SELECT * FROM foo WHERE hash IN (sqlc.slice(hashes)) LIMIT 50;
```

生成的代码如下：

```go
func (q *Queries) Foo(ctx context.Context, hashes []string) ([]string, error)
```

## 参考链接

[Support dynamic sized IN clauses #167](https://github.com/sqlc-dev/sqlc/issues/167 "Support dynamic sized IN clauses #167")