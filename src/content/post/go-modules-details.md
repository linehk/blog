---
title: "Go Modules 详解"
pubDate: 2019-06-17T21:36:30+08:00
lastmod: 2019-06-17T21:36:30+08:00
keywords: [Go Modules, go.mod, go.sum, 语义化版本, GoLand Go Modules]
description: "介绍了大量与 Go Modules 有关的知识。"
categories: [Golang]

---

Go 1.11 和 Go 1.12 包含了初步的 **Go Modules** 支持，且计划在 2019 年 8 月发布的 Go 1.13 会在所有开发过程中默认使用 Go Modules。

Go Modules 是为了提升使用其他开发者代码，即添加 **依赖项（模块、包）** 时的体验，也是为了让代码的正确性、安全性得到保障。并且 Go Modules 可以使用 GOPROXY 环境变量来解决中国大陆无法使用 go get 的问题。

所以学习跟 Go Modules 有关的知识是很有必要的。

<!--more-->

![Golang Logo](/images/go-modules-details/golang-logo.webp "Golang Logo")

## 模式

Go Modules 在 Go 1.11 及 Go 1.12 中有三个模式，根据环境变量 GO111MODULE 定义：

* 默认模式（未设置该环境变量或 `GO111MODULE=auto`）：Go 命令行工具在同时满足以下两个条件时使用 Go Modules：
  * 当前目录不在 GOPATH/src/ 下；
  * 在当前目录或上层目录中存在 go.mod 文件。
* GOPATH 模式（`GO111MODULE=off`）：Go 命令行工具从不使用 Go Modules。相反，它查找 vendor 目录和 GOPATH 以查找依赖项。
* Go Modules 模式（`GO111MODULE=on`）：Go 命令行工具只使用 Go Modules，从不咨询 GOPATH。GOPATH 不再作为导入目录，但它仍然存储下载的依赖项（GOPATH/pkg/mod/）和已安装的命令（GOPATH/bin/），只移除了 GOPATH/src/。

Go 1.13 默认使用 Go Modules 模式，所以以上内容在 Go 1.13 发布并在生产环境中使用后都可以忽略。

## 核心文件：go.mod

以下就是 go.mod 文件的一个最全面的示例：

```plaintext
module my/thing
go 1.12
require other/thing v1.0.2 // 这是注释
require new/thing/v2 v2.3.4 // indirect
require（
	new/thing v2.3.4
	old/thing v0.0.0-20190603091049-60506f45cf65
）
exclude old/thing v1.2.3
replace bad/thing v1.4.5 => good/thing v1.4.5
```

很全面，也很复杂。但其实 go.mod 文件在实际项目没有这么复杂，而且一旦该文件存在，就不需要额外的步骤：像 go build、go test，甚至 go list 这样的命令都会根据需要自动添加新的依赖项以满足导入。

但现在我们还是来详细了解 go.mod 文件的组成：

go.mod 文件是面向行的, 当前模块（主模块）通常位于第一行，接下来是根据路径排序的依赖项。

每行包含一个指令，由一个前导动词后跟参数组成。

所有前导动词的作用如下：

* `module`：定义模块路径。
* `go`：设置预期的语言版本。
* `require`：要求给定版本或更高版本的特定模块。
* `exclude`：排除特定版本模块的使用，不允许的模块版本被视为不可用，并且查询无法返回。
* `replace`：使用不同的模块版本替换原有模块版本。

前导动词还可以按**块**的方式使用，用括号创建一个块（第 5-8 行），就像在 Go 语言中的导入一样：

```go
import (
	"errors"
	"fmt"
	"log"
)
```

注释（第 3-4 行）可以使用单行 `// 这是注释` 注释，但不能使用多行 `/* 这是注释 */` 注释。而 `indirect` 注释（第 4 行）标记了该模块不是被当前模块直接导入的，只是被间接导入。

go.mod 文件只存在于在模块的根目录下，子目录中的导入路径会使用**模块的导入路径 + 子目录路径**的形式。例如：如果创建了一个名叫 world 的子目录，并不需要在子目录中使用 `go mod init` 命令，Go 命令行工具会自动识别它作为 hello 模块的一部分，所以它的导入路径为 hello/world。

Go 命令行工具会自动处理 go.mod 中指定的模块版本。当源代码中 `import` 指向的模块不存在于 go.mod 文件中时，Go 命令行工具会自动搜索这个模块，并将最新版本（最后一个 tag 且非预发布的稳定版本）添加到 go.mod 文件中。

如果没有 tag，则使用伪版本（第 7 行），这是一种版本语法，专门用于标记没有 tag 的提交（一些 golang.org/x/ 下的包就是没有 tag 的）。如：`v0.0.0-20190603091049-60506f45cf65`。

前面部分为语义化版本号，用于标记版本；中间部分为 UTC 的提交时间，用于比较两个伪版本以其确定先后顺序；后面部分是 commit 哈希的前缀，用于标记该版本位于哪个 commit。

## 版本管理文件：go.sum

示例如下：

```plaintext
github.com/davecgh/go-spew v1.1.0 h1:ZDRjVQ15GmhC3fiQ8ni8+OwkZQO4DARzQgrnXU1Liz8=
github.com/davecgh/go-spew v1.1.0/go.mod h1:J7Y8YcW2NihsgmVo/mv3lAwl/skON4iLHjSsI+c5H38=
github.com/gin-gonic/gin v1.4.0 h1:3tMoCCfM7ppqsR0ptz/wi1impNpT7/9wQtMZ8lr1mCQ=
github.com/gin-gonic/gin v1.4.0/go.mod h1:OW2EZn3DO8Ln9oIKOvM++LBO+5UPHJJDH72/q/3rZdM=
github.com/golang/protobuf v1.3.1 h1:YF8+flBXS5eO826T4nzqPrxfhQThhXl0YzfuUPu4SBg=
github.com/golang/protobuf v1.3.1/go.mod h1:6lQm79b+lXiMfvg/cZm0SGofjICqVBUtrP5yJMmIC1U=
```

每行由模块导入路径、模块的特定版本和预期哈希组成。

在每次缺少模块时，如果缓存中不存在，则需要下载并计算其哈希添加到 go.sum 中；如果缓存中存在，则需要匹配 go.sum 中的已有条目。

这样，构建软件的用户就可以使用哈希验证其构建是否跟你的构建相同（`go mod verify`），而无论他们怎样获取依赖项，都可以得到相同的版本。同时也保证了项目依赖不会发生预料之外的恶意修改和其他问题。这也是为什么要将 go.sum 文件加入版本管理（Git）的原因。

再加上 Go Modules 选择的是**最小版本选择**策略（默认使用构建中涉及的每个模块的最旧允许版本，使得新版本的发布对构建没有影响）就可以实现可重现的构建（在重复构建时产生相同的结果）。

## 语义化版本

什么是**语义化版本**？语义化版本是一套由 Gravatars 创办者兼 GitHub 共同创办者 Tom Preston-Werner 所建立的约定。在这套约定下，语义化版本号及其更新方式包含了很多有用的信息。

语义化版本号格式为：`X.Y.Z`（主版本号.次版本号.修订号），使用方法如下：

* 进行不向下兼容的修改时，递增主版本号。
* API 保持向下兼容的新增及修改时，递增次版本号。
* 修复问题但不影响 API 时，递增修订号。

举个例子，有一个语义化版本号为：`v0.1.2`，则其主版本号为 0，次版本为 1，修订号为 2。而前面的 `v` 是 version（版本）的首字母，是 Go 语言惯例使用的，标准的语义化版本没有这个约定。

所以在使用 Go 命令行工具或 go.mod 文件时，就可以使用语义化版本号来进行**模块查询**，具体规则如下：

* 默认值（`@latest`）：将匹配最新的可用标签版本或源码库的最新未标签版本。
* 完全指定版本（`@v1.2.3`）：将匹配该指定版本。
* 版本前缀（`@v1` 或 `@v1.2`）：将匹配具有该前缀的最新可用标签版本。
* 版本比较（`@<v1.2.3` 或 `@>=v1.5.6`）：将匹配最接近比较目标的可用标签版本。`<` 则为小于该版本的最新版本，`>` 则为大于该版本的最旧版本。当使用类 Unix 系统时，需用引号将字符串包裹起来以防止大于小于号被解释为重定向。如：`go get 'github.com/gin-gonic/gin@<v1.2.3'`。
* 指定某个 commit（`@c856192`）：将匹配该 commit 时的版本。
* 指定某个分支（`@master`）：将匹配该分支版本。

![语义化导入版本](/images/go-modules-details/semantic-import-versioning.webp "语义化导入版本")

如上图所示，为了能让 Go Modules 的使用者能够从旧版本更方便地升级至新版本，Go 语言官方提出了两个重要的规则：

* 导入兼容性规则（import compatibility rule）：如果旧包和新包具有相同的导入路径，则新包必须向后兼容旧包。
* 语义化导入版本规则（semantic import versioning rule）：每个不同主版本（即不兼容的包 `v1` 或 `v2`）使用不同的导入路径，以主版本结尾，且每个主版本中最多一个。如：一个 `rsc.io/quote`、一个 `rsc.io/quote/v2`、一个 `rsc.io/quote/v3`。

而与 Git 分支的集成如下：

![Go Modules 分支](/images/go-modules-details/go-modules-using-major-branch.webp "Go Modules 分支")

## vendor 目录

以前使用 vendor 目录有两个目的：

* 可以使用依赖项的确切版本用来构建。
* 即使原始副本消失，也能保证这些依赖项是可用的。

而模块现在有了更好的机制来实现这两个目的：

* 通过在 go.mod 文件中指定依赖项的确切版本。
* 可用性则由缓存代理（`$GOPROXY`）实现。

而且 vendor 目录也很难管理这些依赖项，久而久之就会陷入与 node_modules 黑洞一样的窘境。

![node_modules 黑洞](/images/go-modules-details/node_modules.webp "node_modules 黑洞")

所以，默认情况下使用 Go Modules 将完全忽略 vendor 的依赖项，但是为了平稳过度，可以使用 `go mod vendor` 命令可以创建 vendor 目录。

并在 Go 命令行工具使用 `-mod=vendor` 参数，如：`go test -mod=vendor ./...`；或设置环境变量 GOFLAGS 为 `-mod=vendor`，这样会假定 vendor 目录包含正确的依赖项副本，并忽略 go.mod 文件中的依赖项描述来构建。

## 环境变量 GOPROXY

设置环境变量 GOPROXY 可以解决中国大陆无法使用 go get 的问题：

把 `export GOPROXY=https://goproxy.io` 写入 Shell 的配置文件即可。

## 常用命令

* `go mod init`：创建一个新模块，初始化 go.mod 文件，参数为该模块的导入路径，推荐使用这种形式。如：`go mod init github.com/linehk/example`。
* `go get`：更改依赖项版本（或添加新的依赖项）。
* `go build`、`go test` 等命令：Go 命令行工具会根据需要添加新的依赖项。如：`go test ./...`，测试当前模块。
* `go list -m all`：打印当前模块依赖。
* `go mod tidy`：移除无用依赖。
* `go list -m -versions github.com/gin-gonic/gin`：列出该模块的所有版本。
* `go mod verify`：验证哈希。

## 与 GoLand 集成

在 GoLand 2019.1.3 中使用 Go Modules 需要进行两个设置：

* Preferences -> Go -> Go Modules (vgo)，勾选 Enable Go Modules (vgo) integration 以启用 Go Modules，并在 Proxy 输入框中输入 `https://goproxy.io`。如图所示：
![在 GoLand 中使用 Go Modules 设置 1](/images/go-modules-details/goland-mod-preference1.webp "在 GoLand 中使用 Go Modules 设置 1")
* Preferences -> Go -> GOPATH，勾选上 Index entire GOPATH 以索引整个 GOPATH，不然无法导入包。如图所示：
![在 GoLand 中使用 Go Modules 设置 2](/images/go-modules-details/goland-mod-preference2.webp "在 GoLand 中使用 Go Modules 设置 2")

进行如上设置后，就可以在导入不在缓存中的包时，点击 Sync packages of... 下载该包了：

![下载包](/images/go-modules-details/sync-package.webp "下载包")

## 参考链接

[Command go](https://golang.org/cmd/go/ "Command go")

[Go & Versioning](https://research.swtch.com/vgo "Go & Versioning")

[语义化版本 2.0.0](https://semver.org/lang/zh-CN/ "语义化版本 2.0.0")
