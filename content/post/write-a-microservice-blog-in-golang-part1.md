---
title: "[译]用 Go 语言编写一个微服务博客 — 第一部分 — Go 语言微服务介绍和使用 Go 语言编写微服务的原因"
date: 2017-03-01T17:31:04+08:00
lastmod: 2017-03-01T17:31:04+08:00
keywords: [微服务, 微服务博客, Go 语言微服务博客, Go 语言微服务介绍, 使用 Go 语言编写微服务的原因]
description: "介绍了 Go 语言微服务的关键概念和使用 Go 语言编写微服务的原因。"
categories: [Golang]

---

原文链接：[Go Microservices blog series, part 1](https://callistaenterprise.se/blogg/teknik/2017/02/17/go-blog-series-part1/ "Go Microservices blog series, part 1")

在本博客系列中，我们将会使用 [Go 语言](https://golang.org/ "Go 语言")编写一个微服务博客系统，通过逐步添加组件，使得整个微服务能够以 [Docker Swarm 模式](https://www.docker.com/products/docker-swarm "Docker Swarm 模式")在 [Spring Cloud/Netflix OSS](https://cloud.spring.io/spring-cloud-netflix/ "Spring Cloud/Netflix OSS") 上正常运行。

如果您不知道什么是微服务，我建议您阅读 [Martin Fowler’s 的文章](https://martinfowler.com/articles/microservices.html "Martin Fowler’s 的文章")来学习它。

有关微服务的更多信息，我的同事 [Magnus](https://callistaenterprise.se/om/medarbetare/magnuslarsson/ "Magnus") 的[一篇博客文章](https://callistaenterprise.se/blogg/teknik/2015/03/25/an-operations-model-for-microservices/ "一篇博客文章")很好地解释了其中的一些关键概念。

本博客系列不是 Go 语言的指南，尽管在整个过程中会编写一些代码，但我只会解释一些 Go 语言的关键概念。

我们将在第一部分阅读大量代码，包括基本功能、单元测试和其它核心主题。

注意：在本博客系列中提及 Docker Swarm 时，我指的是以 [swarm 模式](https://docs.docker.com/engine/swarm/ "swarm 模式")运行 Docker 1.12+。作为独立概念的 [Docker Swarm](https://docs.docker.com/swarm/ "Docker Swarm") 在 Docker 1.12 版本后不再使用。

<!--more-->

![Building Microservices Logo](/images/write-a-microservice-blog-in-golang-part1/building-microservices-logo.webp "Building Microservices Logo")

## 全局概述

下图展示了我们将在整个系列中编写的系统，我们将从编写第一个 Go 语言微服务开始，然后会越来越接近下图所示的内容。

![Overview](/images/write-a-microservice-blog-in-golang-part1/overview.webp "Overview")

图例说明：

* 白色虚线框：在一个或多个节点上运行的逻辑 Docker Swarm 集群；
* 蓝框：支持 Spring Cloud/Netflix OSS 技术栈的服务和一些其它服务，如：Zipkin；
* 土黄色框和白色框：实际的微服务。

整个环境几乎与 [Magnus Larssons 微服务博客系列](https://callistaenterprise.se/blogg/teknik/2015/05/20/blog-series-building-microservices/ "Magnus Larssons 微服务博客系列") 中的相同，主要区别在于实际的微服务由 Go 语言编写，而不是 Java。

但 quotes-service 是个例外，它基于 JVM，专门用来测试与 Go 语言微服务的集成。

## 使用 Go 语言编写微服务的原因 — 运行时空间

可能有人会问，为什么我们要用 Go 语言编写微服务？

除了 Go 语言是一门非常有趣且高效的语言外，使用 Go 语言编写微服务的主要原因是它有着少量的内存占用。

让我们看一下下面的截图，我们在 Docker Swarm 中运行了几个微服务：

![Stats](/images/write-a-microservice-blog-in-golang-part1/stats.webp "Stats")

其中，quotes-service 基于 [Spring Boot](https://projects.spring.io/spring-boot/ "Spring Boot") 和 [Spring Cloud](https://spring.io/projects/spring-cloud "Spring Cloud")；compservice 和 accountservice 基于 Go 语言。

两者都是 HTTP 服务器，里面部署了许多库来处理与 Spring Cloud 的集成。

让人感到疑惑的是，内存占用在 2017 年真的重要吗？我们现在很容易获取到大容量内存服务器，而这些大容量内存服务器可以轻松地容纳大量基于 Java 的应用程序。

但一个大型的企业不会只有十个左右的微服务，他们可能会在云服务器上运行成百上千个容器化的微服务。当运行大量容器时，少量的内存占用可以随着时间的推移为您的公司节省大量资金。

让我们来看一下按需计费的通用 Amazon EC2 实例的定价（2017-02-15 前）：

![Amazon EC2](/images/write-a-microservice-blog-in-golang-part1/amazon-ec2.webp "Amazon EC2")

比较各种 t2 实例，我们可以看到对于给定的 CPU 核数，如果将内存数量翻倍（例如：从 t2.medium 的 4 GB 到 t2.large 的 8 GB），那么每小时费用也增加了一倍。

如果不是 CPU 密集型的应用，这意味着在指定实例中能够容纳两倍数量的微服务，从理论上来说，这使您的云服务器费用减少一半。

在接下来的博客系列中，我们也会看到一个复杂的 Go 语言微服务使用的内存也比一个简单的 Spring Boot 微服务使用的内存要少很多。

## 该微服务的非功能需求

本博客系列不仅涉及如何编写基于 Go 语言的微服务，还涉及如何使其在 Spring Cloud 环境中良好运行，并达到生产级别的质量。

非功能性需求如下：

* 配置集中
* 服务发现
* 日志
* 分布式链路跟踪
* 断路器模式（熔断）
* 负载均衡
* 边缘计算
* 实时监控
* 安全

无论是使用 Go、Java、JavaScript、Python、C# 或任何您喜欢的编程语言来编写微服务系统，以上这些都是我认为在决定使用微服务架构就必须考虑的事情。

在本博客系列中，我将会从 Go 语言的角度来介绍以上所有主题。

而从另一个角度来看，实际的微服务实现应该都或多或少使用了提供以下功能的库：

* HTTP/RPC/REST/SOAP/其它 API 方式
* 持久化 API（数据库客户端、JDBC、对象关系映射）
* 消息队列 API（MQTT、AMOP、JMS）
* 可测试性（单元、集成、系统、验收）
* 构建工具/CI/CD
* 等等

在本博客系列中，只会涉及以上部分主题而不是所有。

## 在 Docker Swarm 上运行

本博客系列使用 Docker Swarm 作为运行时环境，这意味着无论是配置服务、边缘计算服务，还是实际的微服务实现都将被部署为 [Docker Swarm](https://docs.docker.com/engine/swarm/how-swarm-mode-works/services/ "Docker Swarm") 服务。

在整个微服务系统编写完后，运行以下 Docker 命令：

```shell
docker service ls
```

将会看到下面的所有服务：

![Swarm Services](/images/write-a-microservice-blog-in-golang-part1/swarm-services.webp "Swarm Services")

## 性能

如果说基于 Go 语言的微服务有着少量的内存占用，那么可以量化吗？对不同的编程语言进行有意义的基准测试可能非常困难。

有时候，人们使用一些类似 [Benchmarkgame](https://benchmarksgame.alioth.debian.org/u64q/go.html "Benchmarkgame") 的网站，在上面提交各种语言的常用算法的实现，然后用它们来比较，这种情况下 Go 语言一般比 Java 8 要快一点，但有少许例外。

并且 Go 语言一般和 C++ 不相上下，在一些测试中又慢得多。

结论是，Go 语言一般情况下对于典型的微服务场景性能良好，如：提供 HTTP 或 RPC 服务、序列化/反序列化数据结构和处理网络 IO 等。

Go 语言的另一个相当重要的特点是：它是一门垃圾收集式语言。自从 Go 1.5 对垃圾收集器进行重写后，GC 暂停通常最多为几毫秒。

如果您以前用的是 JVM，那么您可能会觉得 Go 语言的垃圾收集器还不够成熟，但在 Go 1.2 上下的某个地方更改后，它看起来可靠了许多。

而且在 Go 语言中，您可以通过一个选项（[GOGC](https://dave.cheney.net/2015/11/29/a-whirlwind-tour-of-gos-runtime-environment-variables "GOGC")）来调整堆的总大小（相对于可达对象的大小）来控制 GC 的行为。

在构建第一个微服务并随后相其添加断路器、链路跟踪和日志等组件的过程中，一步步进行性能分析可能会非常有趣，所以我们会使用 [Gatling](http://gatling.io/ "Gatling") 时刻查看性能。

## 启动时间

典型的 Go 语言程序另一个不错的特点是：启动速度非常快。一个提供路由和 JSON 序列化功能的简单 HTTP 服务器通常最多在几百毫秒内启动。

当我们在 Docker 容器中启动 Go 微服务时，它们最多在几秒钟内就可以启动完毕，而基于 Spring Boot 的微服务通常需要至少 10 秒钟才能准备就绪。

虽然这不是最重要的特性，但是当您的环境需要通过快速扩展来应对意外的流量激增时，这个特性是非常有用的。

## 静态链接的二进制文件

另外一个好处是，基于 Go 语言的微服务在 Docker 容器中可以使用[静态链接](https://en.wikipedia.org/wiki/Static_library "静态链接")的二进制文件。

尽管该文件不是非常小（实际的微服务通常有 10-20 MB），但最大的好处是我们的 Dockerfile 文件非常简单，而且我们可以用一些非常基础的 Docker 镜像。

比如说我常用的 [iron/base](https://hub.docker.com/r/iron/base/ "iron/base")，只有 6 MB 左右。

```Dockerfile
FROM iron/base

EXPOSE 6868
ADD eventservice-linux-amd64 /
ENTRYPOINT ["./eventservice-linux-amd64", "-profile=test"]
```

也就是说，除了基本镜像中包含的标准 C 库（libc）外，不需要 JVM 等其它运行时环境。

我们将在以后的博客文章中详细介绍如何构建静态链接的二进制文件和 `-profile=test` 参数。

## 总结

在此博客文章中，我们介绍了使用 Go 语言构建微服务的一些关键原因，如：较小的内存占用、良好的性能和静态链接的二进制文件的方便使用。

在接下来的部分，我们将构建我们的第一个基于 Go 语言的微服务。
