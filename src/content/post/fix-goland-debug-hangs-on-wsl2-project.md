---
title: "修复 GoLand 调试 WSL2 中的项目时卡住的问题"
pubDate: 2024-01-31T16:00:02+08:00
lastmod: 2024-01-31T16:00:02+08:00
keywords: []
description: ""
categories: [Misc]

---

<!--more-->

## 问题

在使用 GoLand 调试 WSL2 中的项目时，调试窗口会卡住，无法 Step Into，并且出现以下信息：

plaintext
2024-01-29T15:18:59+08:00 warning layer=rpc Listening for remote connections (co
nnections are not authenticated nor encrypted)
```

## 方法 1：关闭镜像网络模式

这实际上是 WSL2 的镜像网络模式造成，它无法监听调试工具 delve 使用的 0.0.0.0 地址。

可以在 %UserProfile%/.wslconfig 注释掉 networkingMode=mirrored 来关闭它。

## 方法 2：修改 delve

在 GitHub 上下载 [delve 源码](https://github.com/go-delve/delve "delve 源码")。

然后找到 delve\cmd\dlv\cmds\commands.go 下的 execute 函数，函数签名如下：

```go
func execute(attachPid int, processArgs []string, conf *config.Config, coreFile string, kind debugger.ExecuteKind, dlvArgs []string, buildFlags string) int 
```

在函数开头加上以下语句：

```go
addr = strings.ReplaceAll(addr, "0.0.0.0:", "127.0.0.1:")
```

作用是替换全局变量 `addr` 中的 `0.0.0.0:` 为 `127.0.0.1:`，使得可以正常监听。

可以通过命令 go test -v ./cmd/dlv/ 来运行测试。

然后编译成可执行文件：

```shell
CGO_ENABLED=0 GOOS=linux go build -o dlv cmd/dlv/main.go
```

最后用自己编译的可执行文件，替换掉 GoLand 的同名文件，文件路径在我的环境上如下：

plaintext
C:\Program Files\JetBrains\GoLand 2023.3.2\plugins\go-plugin\lib\dlv\linux\dlv
```

最后测试发现可以正常调试。

## 参考链接

[Debugger fails to connect when running with WSL 2](https://youtrack.jetbrains.com/issue/GO-15209/Debugger-fails-to-connect-when-running-with-WSL-2 "Debugger fails to connect when running with WSL 2")