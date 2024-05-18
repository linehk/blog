---
title: "sqlc 配合 pgx 使用事务"
pubDate: 2024-05-26T14:51:09+08:00
lastmod: 2024-05-26T14:51:09+08:00
keywords: []
description: ""
categories: [sqlc]

---

## 获取链接

首先，需要通过 pgx 获取一个链接：

```go
func Setup(ctx context.Context, DSN string) *pgx.Conn {
	conn, err := pgx.Connect(ctx, DSN)
	if err != nil {
		log.Fatal(err)
	}
	return conn
}
```

## 开始事务

然后，在返回的链接结构体上，调用 Begin 方法来开始一个事务：

```go
transaction, err := conn.Begin(ctx)
if err != nil {
	Err(w, errcode.Database)
	return
}
```

## 回滚数据

如果需要在发生错误时回滚，可以通过 defer 捕捉错误：

```go
defer func() {
	err := transaction.Rollback(ctx)
	if !errors.Is(err, pgx.ErrTxClosed) {
		panic(err)
	}
}()
```

## 查询

查询时，需要使用 sqlc 生成的代码来和 pgx 配合。

sqlc 生成的代码如下：

```go
func New(db DBTX) *Queries {
	return &Queries{db: db}
}
```

通过传入 Begin 返回的事务来配合 sqlc：

```go
query := New(transaction)

exist, err := query.CheckUserByUsername(ctx, params.Username)
if err != nil {
	Err(w, errcode.Database)
	return
}
if exist {
	Err(w, errcode.UsernameOccupy)
	return
}
```

## 提交

最后，通过调用 Commit 完成提交：

```go
err = transaction.Commit(ctx)
if err != nil {
	Err(w, errcode.Database)
	return
}
```