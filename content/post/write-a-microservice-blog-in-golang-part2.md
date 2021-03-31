---
title: "[译]用 Go 语言编写一个微服务博客 — 第二部分 — 构建我们的第一个微服务"
date: 2017-03-07T17:30:05+08:00
lastmod: 2017-03-07T17:30:05+08:00
keywords: [微服务, 微服务博客, Go 语言微服务博客, Go 语言微服务的介绍, 第一个微服务]
description: "介绍了如何构建我们的第一个微服务。"
categories: [Golang]

---

原文链接：[Go microservices, part 2 - building our first service](https://callistaenterprise.se/blogg/teknik/2017/02/21/go-blog-series-part2/ "Go microservices, part 2 - building our first service")

在本博客系列的第二部分，我们将：

* 设置我们的 Go 工作区
* 构建我们的第一个微服务
* 使用 Gorilla Web Toolkit，通过 HTTP 提供 JSON 服务

为了专注于 Go 的基本概念，我们稍后再将其部署到 Docker Swarm。

<!--more-->

![Building Microservices Logo](/images/write-a-microservice-blog-in-golang-part2/building-microservices-logo.webp "Building Microservices Logo")

## 序言

尽管通过 HTTP 提供 JSON 服务不是唯一选择，但在本博客系列中，我们将专注于 HTTP 和 JSON。

当外部的消费者服务是另一个系统时，对于服务间通信和外部通信，使用 RPC 工具和二进制消息格式，如：[Protocol Buffers](https://developers.google.com/protocol-buffers/ "Protocol Buffers")，是一个非常有趣的选择。

Go 有内置的 RPC 支持，而且 gRPC 也绝对值得使用。但是，现在我们先专注于内置的 [http 包](https://golang.org/pkg/net/http/ "http 包")和 [Gorilla Web Toolkit](http://www.gorillatoolkit.org/ "Gorilla Web Toolkit") 提供的 HTTP 服务。

另一个需要考虑的方面是，很多实用的框架都依赖于 HTTP 头在端点之间传递的状态。

我们将在后面的博客文章中看到的示例是：在 HTTP 头中传递相关 ID 和 OAuth 数据。

尽管其它协议一定支持类似的机制，但很多框架都是在考虑 HTTP 协议的情况下构建的，我更希望我们的实现越直观越好。

## 设置 Go 工作区

如果您已经是一位经验丰富的 Go 开发人员，可以随时跳过本节。以我的拙见，Go 工作区的结构需要一段时间才能习惯。

我通常将项目根目录当作工作区根目录，但关于如何正确创建工作区以使 Go 编译器可以找到源代码和依赖关系的规则有点不合理。将您的项目放在 src 文件夹下，如：src/project-name 然后使用类似 project-name 的路径来使用。

我强烈建议您在开始之前先阅读[官方指南](https://golang.org/doc/code.html "官方指南")和[这篇文章](https://astaxie.gitbooks.io/build-web-application-with-golang/content/en/01.2.html "这篇文章")。

### 安装 SDK

在编写第一行代码（或检出完整源代码）之前，我们需要安装 Go SDK。我建议遵循[官方指南](https://golang.org/doc/install "官方指南")，它足够直观。

### 设置开发环境

在本博客系列中，我们将使用刚安装的内置 Go SDK 工具来构建和运行，以及遵循惯用的方式来设置 Go 工作区。

#### 1. 在工作区创建一个根文件夹

所有命令均基于 OS X 或 Linux 开发环境。如果您使用的是 Windows，请酌情修改。

```shell
mkdir ~/goworkspace
cd goworkspace
export GOPATH=`pwd` // 译者注：pwd 表示使用当前目录
```

在以上命令中，我们创建了一个根文件夹，然后设置环境变量 GOPATH 为该路径。

这是我们工作区的根目录，在此工作区中，我们编写的所有 Go 源代码或将要使用的第三方包都将出现在这里。

我建议将 GOPATH 添加到您的 .bash_profile 或类似文件中，这样就不用在每次打开新的终端窗口后都需要重新设置。

#### 2. 为我们的第一个项目创建文件夹和文件

假设我们位于工作空间的根目录下（与 GOPATH 环境变量对应的值相同），请执行以下命令：

```shell
mkdir -p src/github.com/callistaenterprise
```

如果您想跟着我来编写代码，请执行以下命令：

```shell
cd src/github.com/callistaenterprise
mkdir -p goblog/accountservice
cd goblog/accountservice
touch main.go
mkdir service
```

或者，您可以 clone 包含示例代码的 Git 仓库，然后切换到 P2 分支。在上面创建的 *src/github.com/callistaenterprise* 目录下，执行以下命令：

```shell
git clone https://github.com/callistaenterprise/goblog.git
cd goblog
git checkout P2
```

注意：*$GOPATH/src/github.com/callistaenterprise/goblog* 是我们项目的根目录，也是 GitHub 上存储的内容。

现在，我们可以根据这些文件结构来开始了。

在你的 Go IDE 中打开 main.go。

在编写该博客系列的代码时，我用的是带 Go 插件的 IntelliJ IDEA。

其它流行的选择似乎是 [Eclipse](https://marketplace.eclipse.org/category/free-tagging/golang "Eclipse")、[Atom](https://atom.io/packages/go-plus "Atom")、[Sublime](https://github.com/DisposaBoy/GoSublime "Sublime")、[vim](https://github.com/fatih/vim-go "vim") 和 JetBrains 公司的新型商用 IDE：[GoLand](https://www.jetbrains.com/go/ "GoLand")。

## 创建服务 - main.go

main 函数在 Go 中正如您想的那样，是整个 Go 程序的入口点。

让我们创建足够多的代码来让其可以构建和运行。

```go
package main

import (
        "fmt"
        )
        
var appName = "accountservice"

func main() {
    fmt.Printf("Starting %v\n", appName)
}
```

现在，让我们运行它。

确保您位于与 *$GOPATH/src/github.com/callistaenterprise/goblog/accountservice* 对应的文件夹。

```shell
> go run *.go
Starting accountservice
>
```

完成了！但这个程序只会打印然后退出。是时候添加我们的第一个 HTTP 端点了。

## 构建一个 HTTP Web 服务器

注意：这些基础的 HTTP 示例来自一篇出色的[博客文章](https://thenewstack.io/make-a-restful-json-api-go/ "博客文章")。

为了简洁，我们将所有与 HTTP 服务有关的文件都放入 *service* 文件夹中。

### HTTP 服务器启动器

在 */services* 文件夹中创建文件 *webserver.go*：

```go
package service

import (
        "net/http"
        "log"
)

func StartWebServer(port string) {

        log.Println("Starting HTTP service at " + port)
        err := http.ListenAndServe(":" + port, nil)    // goroutine 将会阻塞在这里

        if err != nil {
                log.Println("An error occured starting HTTP listener at port " + port)
                log.Println("Error: " + err.Error())
        }
}
```

我们正在使用内置的 *net/http* 包来执行 *ListenAndServe*，它会在指定端口上启动 HTTP 服务器。

更新 *main.go*，以便我们使用暂时硬编码的端口来调用 *StartWebServer* 函数。

```go
package main

import (
        "fmt"
        "github.com/callistaenterprise/goblog/accountservice/service"  // 新的
)

var appName = "accountservice"

func main() {
        fmt.Printf("Starting %v\n", appName)
        service.StartWebServer("6767")           // 新的
}
```

再次运行程序：

```shell
> go run *.go
Starting accountservice
2017/01/30 19:36:00 Starting HTTP service at 6767
```

现在，我们有一个简单的 HTTP 服务器，用于监听 *localhost* 上的端口 6767。

使用 [curl](https://curl.haxx.se/ "curl") 访问它：

```shell
> curl http://localhost:6767
404 page not found
```

404 正是我们期望的，因为我们尚未声明任何路由。

通过快捷键 Ctrl+C 来停止 Web 服务器。

### 添加第一个路由

是时候该为我们的服务器提供服务了。

首先，我们将使用 [Go 结构体](https://gobyexample.com/structs "Go 结构体")声明我们的第一个[路由](http://www.gorillatoolkit.org/pkg/mux#Route "路由")，该结构体将用于填充 Gorilla 路由。

在 *service* 文件夹中，创建 *routes.go*：

```go
package service

import "net/http"

// 定义一个单独的 route，内容如下：名字、HTTP 方法、路由模式和访问路由时会执行的函数
type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

// 定义 Routes 类型，它只是 Route 结构的一个数组（切片）。
type Routes []Route

// 初始化我们的 routes
var routes = Routes{

	Route{
		"GetAccount",                                     // 名字
		"GET",                                            // HTTP 方法
		"/accounts/{accountId}",                          // 路由模式
		func(w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Content-Type", "application/json; charset=UTF-8")
            w.Write([]byte("{\"result\":\"OK\"}"))
        },
	},
}
```

在上面的代码段中，我们声明了 */accounts/{accountId}* 路径，等一下可以使用 curl 来试用。

Gorilla 对复杂的路由还支持正则表达式、schemes、HTTP 方法、查询参数 和 HTTP 头，因此当然不仅仅限于路径和路径参数。

现在，我们将仅返回一条已硬编码为响应的 JSON 消息：

```json
{"result":"OK"}
```

我们还需要一些样板代码，将实际的 [Gorilla Router](http://www.gorillatoolkit.org/pkg/mux#overview "Gorilla Router") 绑定到我们声明的路由。在 *service* 文件夹中，创建 *router.go*：

```go
package service

import (
	"github.com/gorilla/mux"
)

// 函数返回指向 mux.Router 的指针，我们可以用作 handler
func NewRouter() *mux.Router {

        // 创建一个 Gorilla router 的实例
	router := mux.NewRouter().StrictSlash(true)
	
	// 遍历在 route.go 中声明的路由，并将其附加到 router 实例
	for _, route := range routes {
	    
                // 附加每个 route，使用类似 Builder 的模式设置每个 route
		router.Methods(route.Method).
                Path(route.Pattern).
                Name(route.Name).
                Handler(route.HandlerFunc)
	}
	return router
}
```

### 导入依赖项

在 *router.go* 的 import 中，我们看到我们已经声明了对 [github.com/gorilla/mux](http://github.com/gorilla/mux "github.com/gorilla/mux") 包的依赖。

有关如何使用 *go get* 下载 Go 依赖项的详细说明，请参见[此处](https://github.com/golang/go/wiki/GOPATH#repository-integration-and-creating-go-gettable-projects "此处")。

为了构建并运行上述文件，我们需要使用 *go get* 将声明的包下载到我们的工作空间中：

```shell
> go get
```

由于 Go 工具实际上是从 [https://github.com/gorilla/mux](https://github.com/gorilla/mux "https://github.com/gorilla/mux") 下载 gorilla/mux 所需的所有源代码，因此可能需要一些时间。

此源代码将最终在本地文件系统上的 *$GOPATH/src/github.com/gorilla/mux* 中，并将其内置到您的静态链接二进制文件中。

### 调用

现在，重新编辑 *webserver.go* 并在 *StartWebServer* 函数的开始处添加以下两行：

```go
func StartWebServer(port string) {

        r := NewRouter()             // 新的
        http.Handle("/", r)          // 新的
```

这会将我们刚刚创建的路由关联到根路径为 / 的 http.Handle 中。让我们再次构建并运行服务器。

```go
> go run *.go
Starting accountservice
2017/01/31 15:15:57 Starting HTTP service at 6767
```

试试看 curl：

```shell
> curl http://localhost:6767/accounts/10000
{"result":"OK"}
```

很好！我们刚刚成功创建了第一个 HTTP 服务！

## 运行时和性能表现

我们最好做一个快速的基准测试，以了解基于 Go 的微服务的性能。

我已经开发了一个简单的 [Gatling](http://gatling.io/ "Gatling") 测试，可以使用 GET 请求对 */accounts/{accountId}* 进行评估。

如果您已检出此部分的代码，则可以在 */goblog/loadtest* 文件夹中找到该负载测试。

或者您可以在 [github](https://github.com/callistaenterprise/goblog/tree/master/loadtest "github") 上查看它。

### 运行负载测试

如果要运行负载测试，请确保 accountservice 已启动并在 localhost 上运行，并且已克隆了代码和签出了 P2分支。

您还需要安装 Java Runtime Environment 和 [Apache Maven](https://maven.apache.org/ "Apache Maven")。

进入 */goblog/loadtest* 目录，然后从命令行执行以下命令：

```shell
> mvn gatling:execute -Dusers=1000 -Dduration=30 -DbaseUrl=http://localhost:6767
```

该命令可以运行测试。参数的含义为：

* users：测试将模拟的并发用户数
* duration：测试将运行多少秒
* baseUrl：提供我们需要测试的服务主机的基本路径。当我们迁徙至 Docker Swarm 时，需要将baseUrl 更改为 Swarm 的公共 IP。

测试完成后，它会将结果写入控制台窗口，并将精美的 HTML 报告写入 *target/gatling/results/* 中。

### 结果

注意：当我们要构建的服务在 Docker Swarm 上的 Docker 容器内运行时，我们将在那里做基准测试和指标获取的工作。

在那之前，我的 *mid-2014 MacBook Pro* 必须有足够的性能。

在开始负载测试之前，根据 OS X 任务管理器，基于 Go 的 accountservice 的内存消耗如下：

![Result](/images/write-a-microservice-blog-in-golang-part2/result.webp "Result")

1.8 mb，还不错！让我们通过 1K req/s 的指标来运行 Gatling 测试。

请记住，这是一个非常简单的实现，只响应一个硬编码的字符串。

### 内存占用

![Memory Use](/images/write-a-microservice-blog-in-golang-part2/memory-use.webp "Memory Use")

好了，1K req/s 的指标会使 accountservice 消耗约 28 mb 的内存。

这只是 Spring Boot 应用程序启动时使用的 1/10。一旦我们开始向其添加实际功能，注意这个数字的变化将非常有趣。

### 性能和 CPU 占用率

![Performance And CPU Usage](/images/write-a-microservice-blog-in-golang-part2/performance-and-cpu-usage.webp "Performance And CPU Usage")

1K req/s 的指标约占单个核心的 8％。

![Gatling](/images/write-a-microservice-blog-in-golang-part2/gatling.webp "Gatling")

请注意 Gatling 如何舍入亚毫秒级（不到一毫秒）的延迟，但平均延迟报告为 0 毫秒，其中一个请求耗时 11 毫秒。

在这一点上，我们的 accountservice 表现出色，在亚毫秒范围内的平均速度为 745~req/s。

### 下一步是什么？

在接下来的系列中，我们会使我们的 accountservice 做些有用的事情。

我们将添加一个带有 Account 对象的简单嵌入式数据库，该对象将通过 HTTP 提供服务。

我们还将研究 JSON 序列化，并检查这些新增内容如何影响其内存占用和性能。
