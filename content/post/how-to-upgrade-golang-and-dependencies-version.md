---
title: "如何升级 Golang 和依赖的版本"
date: 2023-12-31T22:32:18+08:00
lastmod: 2023-12-31T22:32:18+08:00
keywords: []
description: ""
categories: [Golang]

---

<!--more-->

## 升级 Golang 版本

在项目下使用命令：`go mod edit -go=1.21.3`，也可以直接修改 go.mod 文件的 go 字段。

## 升级依赖项版本

在项目下使用命令：`go get -u ./...`，此命令会将项目中所有依赖项的版本更新为最新版本。

## 依赖项破坏性更新

如果依赖项的更新是破坏性的，即不兼容之前的版本，则无法通过 go 工具来自动更新。此时需要手动调整 go.mod 文件和导入的包名。

例如 beego 的升级：从 github.com/astaxie/beego v1.12.2 修改为 github.com/beego/beego/v2。

例如 gorm 的升级：从 github.com/jinzhu/gorm v1.9.12 修改为 gorm.io/gorm v1.25.5；数据库驱动则修改为 gorm.io/driver/mysql v1.5.2，其它的数据库名称在 [go-gorm](https://github.com/go-gorm "go-gorm") 查看。

## 参考链接

[How to upgrade the go version in a go mod](https://stackoverflow.com/questions/60675415/how-to-upgrade-the-go-version-in-a-go-mod "How to upgrade the go version in a go mod")

[How To Upgrade Golang Dependencies](https://golang.cafe/blog/how-to-upgrade-golang-dependencies.html "How To Upgrade Golang Dependencies")

[GORM 2.0 发布说明](https://gorm.io/zh_CN/docs/v2_release_note.html "GORM 2.0 发布说明")