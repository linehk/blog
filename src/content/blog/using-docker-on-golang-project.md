---
title: "在 Go 语言项目中使用 Docker"
pubDate: 2019-08-20T21:31:24+08:00
lastmod: 2019-08-20T21:31:24+08:00
keywords: [Go 容器, Go Docker, Go 项目 Docker, Go Dockerfile]
description: "介绍了如何在 Go 语言项目中使用 Docker。"
categories: [Golang]

---

**容器（Container）** 将程序及其所需的任何内容捆绑在一起，包括依赖项、工具和配置文件等等。这样使得程序不受环境的干扰，真正意义上做到开发环境和生成环境完全一致。

而 Docker 在容器的基础上，进行了进一步的封装，从文件系统、网络互联到进程隔离等等，极大的简化了容器的创建和维护。与传统虚拟机相比，Docker 也有许多优点，如：更高效的系统资源利用和更快速的启动时间。

在本文中，通过一个简单的 Go 语言项目，您将学习如何在 Go 语言项目中使用 Docker。

<!--more-->

![Golang and Docker logo](/images/using-docker-on-golang-project/golang-and-docker-logo.webp "Golang and Docker logo")

## 创建一个简单的 Go 语言项目

让我们来创建一个作为示例的 Go 语言项目。在命令行下输入以下命令以创建文件夹：

```shell
mkdir gdp
```

我们将使用 Go Module 进行依赖性管理。转到项目的根目录，然后初始化 Go Module：

```shell
cd gdp
go mod init github.com/linehk/gdp
```

我们将创建一个简单的 hello 服务器。在项目根目录中创建一个名为 **hello_server.go** 的新文件：

```shell
touch hello_server.go
```

文件内容如下：

```go
package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

func handler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	name := query.Get("name")
	if name == "" {
		name = "Guest"
	}
	log.Printf("Received request for %s.\n", name)
	w.Write([]byte(fmt.Sprintf("Hello, %s!\n", name)))
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", handler)
	server := &http.Server{
		Handler:      r,
		Addr:         ":8080",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	log.Println("Starting Server.")
	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
```

该项目使用 *gorilla/mux* 包来创建 HTTP 路由（导入包是为了展示 Docker 容器捆绑依赖项的作用），地址是 *localhost:8080*。

## 尝试在本地编译并运行项目

让我们先尝试在本地编译和运行项目。可以在项目根目录输入以下命令来编译项目：

```shell
go build
```

go build 命令将会生成一个名为 **gdp** 的可执行文件。可以像这样运行该文件：

```shell
./gdp
2020/08/19 21:33:49 Starting Server.
```

我们的 hello 服务器现在正在运行，可以尝试使用 **curl** 或其它工具与其交互：

```shell
curl http://localhost:8080
Hello, Guest!
```

```shell
curl http://localhost:8080?name=sulinehk
Hello, sulinehk!
```

## 编写 Dockerfile 定义 Docker 镜像

让我们来为这个项目编写 **Dockerfile**，在根目录创建文件名为 Dockerfile 的文件，内容如下：

```Dockerfile
# 拉取 Go 语言最新的基础镜像
FROM golang:latest

# 在容器内设置 /app 为当前工作目录
WORKDIR /app

# 把文件复制到当前工作目录
COPY . .

# 设置 GOPROXY 环境变量
ENV GOPROXY="https://goproxy.cn"

# 下载全部依赖项
RUN go mod download

# 编译项目
RUN go build -o gdp .

# 暴露 8080 端口
EXPOSE 8080

# 执行可执行文件
CMD ["./gdp"]
```

## 构建镜像和运行容器

**镜像（Image）** 是实际的软件分发包，其中包含运行应用程序所需的所有内容。

而容器根据镜像构建，是镜像的运行示例，类似 Go 语言中结构体定义和结构体变量之间的关系。

* 构建镜像：

```shell
docker build -t gdp .
```

* 运行容器：

```shell
docker run -d -p 8080:8080 gdp
aa6a1afbe1b13ad0b0d1d656e157f762c5fe2229a8e0d95a025df26396ffc08f
```

* 与容器内运行的服务器交互：

```shell
curl http://localhost:8080
Hello, Guest!
```

```shell
curl http://localhost:8080?name=sulinehk
Hello, sulinehk!
```

下面是一些其它的 Docker 命令：

![Docker 命令](/images/using-docker-on-golang-project/docker-command.webp "Docker 命令")

## 总结

可以看出，一个定义良好的 Dockfile 文件在整个流程中起到承上启下的作用。

![Dockerfile](/images/using-docker-on-golang-project/dockerfile.webp "Dockerfile")

## 参考链接

[Docker — 从入门到实践](https://yeasy.gitbooks.io/docker_practice/ "Docker — 从入门到实践")

[Docker Documentation](https://docs.docker.com/ "Docker Documentation")
