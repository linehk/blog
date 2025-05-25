---
title: "go run main.go 返回未定义错误"
pubDate: 2025-05-04T20:09:09+08:00
lastmod: 2025-05-04T20:09:09+08:00
keywords: []
description: ""
categories: [Golang]

---

## 问题

在上一个项目 listdb 中，客户希望能够让第三方开发人员方便理解，所以没有使用流行的 Golang 项目结构，而是直接将所有文件平铺到 main 包。

但当 main.go 和它所依赖的 go 文件在 main 包时，只运行 `go run main.go` 会返回未定义错误：

```bash
# command-line-arguments
./main.go:42:13: undefined: Setup
```

其它 go 命令不会返回错误，如：`go build`

## 原因

这是因为 `go run main.go` 只传递了 main.go 作为源文件列表，没有自动解析依赖。

## 解决方案

* 直接传递所有依赖，如：`go run main.go dependency.go`
* 使用通配符传递所有依赖，如：`go run .` 或者 `go run *.go`。不过后者在有测试文件时不可用。
* 把依赖项移出 main 包，go 会自动解析依赖。

## 参考链接

[[golang]Go常见问题：# command-line-arguments: ***: undefined: ***](https://cloud.tencent.com/developer/article/1521790 "[golang]Go常见问题：# command-line-arguments: ***: undefined: ***")