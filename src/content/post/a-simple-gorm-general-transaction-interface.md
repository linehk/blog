---
title: "一个简单的 GORM 通用事务接口"
pubDate: 2020-12-12T12:55:45+08:00
lastmod: 2020-12-12T12:55:45+08:00
keywords: []
description: ""
categories: [Golang]

---

本文介绍了一个简单的 GORM 通用事务接口。

![GORM Logo](/images/a-simple-gorm-general-transaction-interface/gorm-logo.webp "GORM Logo")

```go
import (
	"database/sql"
	"log"

	"gorm.io/gorm"
)

// Transaction 指定事务必须的三种方法
type Transaction interface {
	Begin(*gorm.DB) (*gorm.DB, error)
	Rollback(*gorm.DB) error
	Commit(*gorm.DB) error
}

type handler func(db *gorm.DB) error

// Do 在事务中执行函数
func Do(db *gorm.DB, transaction Transaction, call handler) error {
	t, err := transaction.Begin(db)
	if err != nil {
		return err
	}
	// panic 时回滚，并打印日志
	defer func() {
		if err := transaction.Rollback(t); err != nil && err != sql.ErrTxDone {
			log.Fatalf("Rollback err: %v", err)
		}
	}()
	if err := call(t); err != nil {
		return err
	}
	// 没有错误才 commit
	if err := transaction.Commit(t); err != nil {
		return err
	}
	return nil
}
```

详细说明请看代码注释。