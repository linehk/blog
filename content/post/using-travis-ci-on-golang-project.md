---
title: "在 Go 语言项目中使用 Travis CI"
date: 2019-07-15T21:46:18+08:00
lastmod: 2019-07-15T21:46:18+08:00
keywords: [Go 持续集成, Go Travis CI, Travis CI 徽章]
description: "介绍了如何在 Go 语言项目中使用 Travis CI，从而提高软件质量。"
categories: [Golang]

---

Travis CI 是一种免费的持续集成服务，而 **持续集成（CI, Continuous integration）** 是一种软件工程流程，概括来讲就是多提交小的 Commit 来更快的发现软件的 Bug，从而提高软件质量。

本文会详细介绍如何在 Go 语言项目中使用 Travis CI。

<!--more-->

![Travis CI logo](/images/using-travis-ci-on-golang-project/travis-ci-logo.webp "Travis CI logo")

## 准备工作

* [GitHub](https://github.com/ "GitHub") 账号：用于保存项目。
* [Travis CI](https://travis-ci.org/ "Travis CI") 账号：点击右上角的 **Sign in with GitHub** 即可通过 GitHub 创建关联账号。
* 示例项目 hello，它包含三个文件：

hello.go：

```go
package hello

func Hello() string { return "Hello, World!" }
```

hello_test.go：

```go
package hello

import (
	"testing"
)

func TestHello(t *testing.T) {
	if got, want := Hello(), "Hello, World!"; got != want {
		t.Errorf("got %v, want %v", got, want)
	}
}
```

go.mod：

```text
module github.com/linehk/hello

go 1.14
```

该文件通过命令：`go mod init github.com/linehk/hello` 生成。

## 建立 GitHub 仓库

建立一个 GitHub 仓库，并将上面三个文件组成的 hello 项目推送到仓库。

## 同步仓库到 Travis CI

在 [Travis CI 仓库页面](https://travis-ci.org/account/repositories "Travis CI 仓库页面")左上角点击 **Sync account** 来将 GitHub 新创建的仓库同步到 Travis CI。

并在左边的 **Legacy Services Integration** 下找到 hello 项目，将其勾选上。如下图所示：

![勾选 hello 项目](/images/using-travis-ci-on-golang-project/check-hello-project.webp "勾选 hello 项目")

## 编写 .travis.yml 文件

受益于在 Go 1.13 版本后，Go Modules 是默认开启的情况下，以下就是最简单的 *.travis.yml* 文件，*.yml* 后缀表示使用的是 [YAML 格式](https://zh.wikipedia.org/wiki/YAML "YAML 格式")：

```yaml
# 使用 Go 语言（# 号开头的为注释）
language: go

script:
  - go test -v ./...
```

## 开始集成测试

将上一步编写的 *.travis.yml* 文件加入仓库并推送至 GitHub。Travis CI 检测到该文件就会根据里面的内容开始测试。之后每次推送都会触发测试。

在 [dashboard](https://travis-ci.org/dashboard "dashboard") 中可以找到 hello 项目，点击进入就可以看到详细的测试信息。如下图所示：

![详细测试信息](/images/using-travis-ci-on-golang-project/detailed-test-information.webp "详细测试信息")

## Travis CI 徽章

点击绿色的 **build passing** 就能得到徽章的地址，如：`https://travis-ci.org/linehk/hello.svg?branch=master`。

可以将它贴在你的 README 文件里，如果项目在某次推送中测试失败，徽章就会变成红色。

## 参考链接

[Building a Go Project](https://docs.travis-ci.com/user/languages/go/ "Building a Go Project")