---
title: "[译]用 Go 语言编写一个微服务博客 — 第三部分 — 嵌入数据库并提供 JSON 服务"
pubDate: 2017-03-14T11:20:15+08:00
lastmod: 2017-03-14T11:20:15+08:00
keywords: [微服务, 微服务博客, Go 语言微服务博客, 嵌入数据库, 提供 JSON 服务]
description: "介绍了如何嵌入数据库并提供 JSON 服务。"
categories: [Golang]

---

原文链接：[Go Microservices, part 3 - embedded database and JSON](https://callistaenterprise.se/blogg/teknik/2017/02/27/go-blog-series-part3/ "Go Microservices, part 3 - embedded database and JSON")

在第 3 部分中，我们将使我们的 Accountservice 做一些有用的事情。

* 声明一个 Account 结构体。
* 嵌入一​​个简单的键值存储，这样我们就可以在其中存储 Account 结构体。
* 将结构体序列化为 JSON，并通过我们的 /accounts/{accountId} HTTP 服务提供服务。

<!--more-->

![Building Microservices Logo](/images/write-a-microservice-blog-in-golang-part3/building-microservices-logo.webp "Building Microservices Logo")

## 代码

和本博客系列的所有后续部分一样，您可以通过克隆源代码（请参阅[第 2 部分](https://www.sulinehk.com/post/write-a-microservice-blog-in-golang-part2 "第 2 部分")）并切换到 P3 分支来获得该部分的完整代码，如：

```shell
git checkout P3
```

### 声明一个账户结构体

有关 Go 结构体的更详细介绍，请查看[这个指南](https://www.golang-book.com/books/intro/9 "这个指南")。

在我们的项目中，在 /accountservice 下创建一个名为 *model* 的文件夹。

```shell
mkdir model
```

然后在 *model* 文件夹中创建一个名为 *account.go* 的文件，其内容如下：

```go
package model

type Account struct {
        Id string `json:"id"`
        Name string  `json:"name"`
}
```

这段代码声明了我们的 *Account* 抽象，它基本上就是一个 id 和一个 name。变量名第一个字母的大小写表示作用域（大写表示包外可见，小写表示包外不可见）。我们还使用标准库的 json.Marshal 函数和标签来表示 Go 应如何序列化每个字段。

#### 嵌入键值存储

为此，我们将使用 [BoltDB](https://github.com/boltdb/bolt "BoltDB") 键值存储数据库。它简单，快速且易于使用。我们需要在声明使用依赖项之前使用 *go get* 来下载依赖项：

```shell
go get github.com/boltdb/bolt
```

接下来，在 */goblog/accountservice* 文件夹中，创建一个名为 dbclient 的文件夹和一个名为 *boltclient.go* 的文件。为了使以后的模拟测试更加容易，我们先声明一个接口，该接口定义了我们需要实现的函数：

```go
package dbclient

import (
        "github.com/callistaenterprise/goblog/accountservice/model"
)

type IBoltClient interface {
        OpenBoltDb()
        QueryAccount(accountId string) (model.Account, error)
        Seed()
}
```

在同一文件中，我们将提供此接口的实现。首先声明一个结构体，该结构体封装了一个指向 bolt.DB 实例的指针。

```go
// Real implementation
type BoltClient struct {
        boltDB *bolt.DB
}
```

然后是 *OpenBoltDb()* 的实现。

```go
func (bc *BoltClient) OpenBoltDb() {
        var err error
        bc.boltDB, err = bolt.Open("accounts.db", 0600, nil)
        if err != nil {
                log.Fatal(err)
        }
}
```

我们将函数绑定到结构体上的 Go 语法可能会有些奇怪。现在，我们的结构体隐式实现了三种方法之一。

我们将在某个地方需要这个 bolt client 的实例。让我们在 */goblog/accountservice/service/handlers.go* 中将其放在要被使用的地方。创建该文件并添加结构体实例：

```go
package service

import (
        "github.com/callistaenterprise/goblog/accountservice/dbclient"
)

var DBClient dbclient.IBoltClient
```

更新 *main.go*，以便它在启动时打开数据库：

```go
func main() {
        fmt.Printf("Starting %v\n", appName)
        initializeBoltClient()                 // NEW
        service.StartWebServer("6767")
}

// Creates instance and calls the OpenBoltDb and Seed funcs
func initializeBoltClient() {
        service.DBClient = &dbclient.BoltClient{}
        service.DBClient.OpenBoltDb()
        service.DBClient.Seed()
}
```

现在，我们的微服务应该可以在启动时创建一个数据库。但是，在运行之前，我们将添加一段代码，这些代码将在启动时为我们添加一些假帐户数据。

### 启动时添加一些假账户数据

再次打开 *boltclient.go* 并添加以下函数：

```go
// Start seeding accounts
func (bc *BoltClient) Seed() {
        initializeBucket()
        seedAccounts()
}

// Creates an "AccountBucket" in our BoltDB. It will overwrite any existing bucket of the same name.
func (bc *BoltClient) initializeBucket() {
        bc.boltDB.Update(func(tx *bolt.Tx) error {
                _, err := tx.CreateBucket([]byte("AccountBucket"))
                if err != nil {
                        return fmt.Errorf("create bucket failed: %s", err)
                }
                return nil
        })
}


// Seed (n) make-believe account objects into the AcountBucket bucket.
func (bc *BoltClient) seedAccounts() {

        total := 100
        for i := 0; i < total; i++ {

                // Generate a key 10000 or larger
                key := strconv.Itoa(10000 + i)

                // Create an instance of our Account struct
                acc := model.Account{
                        Id: key,
                        Name: "Person_" + strconv.Itoa(i),
                }

                // Serialize the struct to JSON
                jsonBytes, _ := json.Marshal(acc)

                // Write the data to the AccountBucket
                bc.boltDB.Update(func(tx *bolt.Tx) error {
                        b := tx.Bucket([]byte("AccountBucket"))
                        err := b.Put([]byte(key), jsonBytes)
                        return err
                })
        }
        fmt.Printf("Seeded %v fake accounts...\n", total)
}
```

有关 Bolt API 的更多信息以及 Update 方法如何接收我们的函数的详细信息，请参阅 [BoltDB 文档](https://github.com/boltdb/bolt#using-buckets "BoltDB 文档")。

目前为止，我们已经完成了跟 BoltDB 有关的部分。让我们再次编译并运行：

```shell
> go run *.go
Starting accountservice
Seeded 100 fake accounts...
2017/01/31 16:30:59 Starting HTTP service at 6767
```

很好！可以使用 Ctrl+C 停止运行。

### 添加一个查询方法

现在，我们通过向 *boltclient.go* 添加 Query 方法来完成我们的数据库 API：

```go
func (bc *BoltClient) QueryAccount(accountId string) (model.Account, error) {
        // Allocate an empty Account instance we'll let json.Unmarhal populate for us in a bit.
        account := model.Account{}

        // Read an object from the bucket using boltDB.View
        err := bc.boltDB.View(func(tx *bolt.Tx) error {
                // Read the bucket from the DB
                b := tx.Bucket([]byte("AccountBucket"))

                // Read the value identified by our accountId supplied as []byte
                accountBytes := b.Get([]byte(accountId))
                if accountBytes == nil {
                        return fmt.Errorf("No account found for " + accountId)
                }
                // Unmarshal the returned bytes into the account struct we created at
                // the top of the function
                json.Unmarshal(accountBytes, &account)

                // Return nil to indicate nothing went wrong, e.g no error
                return nil
        })
        // If there were an error, return the error
        if err != nil {
                return model.Account{}, err
        }
        // Return the Account struct and nil as error.
        return account, nil
}
```

如果代码不够清晰，可以理解一些注释。该函数将使用提供的 *accountId* 参数查询 BoltDB，并将返回 Account 结构体或一个 error。

### 通过 HTTP 提供账户服务

让我们修复在 */service/routes.go* 中声明的 */accounts/{accountId}* 路由，以便它正确返回刚才我们建立的假数据 Account 结构体。打开 routes.go 并用我们稍后将创建的函数 *GetAccount* 替换原来的 *func（w http.ResponseWriter，r * http.Request）{*：

```go
Route{
        "GetAccount",             // Name
        "GET",                    // HTTP method
        "/accounts/{accountId}",  // Route pattern
        GetAccount,
},
```

接下来使用符合 HTTP handler 函数签名的 *GetAccount* 函数来更新 */service/handlers.go*：

```go
var DBClient dbclient.IBoltClient

func GetAccount(w http.ResponseWriter, r *http.Request) {

	// Read the 'accountId' path parameter from the mux map
	var accountId = mux.Vars(r)["accountId"]

        // Read the account struct BoltDB
	account, err := DBClient.QueryAccount(accountId)

        // If err, return a 404
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

        // If found, marshal into JSON, write headers and content
	data, _ := json.Marshal(account)
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", strconv.Itoa(len(data)))
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
```

GetAccount 函数符合 handler 函数签名，所以当 Gorilla 检测到对 */accounts/{accountId}* 的调用时，它会把请求路由到 GetAccount 函数中。让我们来运行它看看！

```shell
> go run *.go
Starting accountservice
Seeded 100 fake accounts...
2017/01/31 16:30:59 Starting HTTP service at 6767
```

使用 curl 调用该 API。注意，我们前面创建了 100 个 ID 从 10000 开始的假帐户。

```shell
> curl http://localhost:6767/accounts/10000
{"id":"10000","name":"Person_0"}
```

很好！现在，我们的微服务真正地通过 HTTP 从数据库中提供 JSON 数据。

## 运行时和性能表现

让我们检查与[第 2 部分](https://www.sulinehk.com/post/write-a-microservice-blog-in-golang-part2/ "第 2 部分")中相同的内存和 CPU 使用率指标：场景分别是负载测试前、负载测试中和负载测试后。

### 启动后的内存使用情况

![memory-usage-after-startup](/images/write-a-microservice-blog-in-golang-part3/memory-usage-after-startup.webp "memory-usage-after-startup")

2.1 mb，还是很不错！添加嵌入式 BoltDB 和一些其他代码来处理路由，使得我们的初始内存占用增加了 300kb。让我们以 1K req/s 的速度来运行 Gatling 测试。现在，我们返回的是从 BoltDB 获取的真实的 Account 对象，而且该对象已序列化为 JSON：

### 负载测试后的内存使用情况

![memory-usage-after-load-test](/images/write-a-microservice-blog-in-golang-part3/memory-usage-after-load-test.webp "memory-usage-after-load-test")

31.2 mb 的内存占用。与第 2 部分中的简单服务相比，使用嵌入式数据库并达到 1K req/s 的额外开销确实很小。

### 性能和 CPU 占用率

![performance-and-cpu-usage](/images/write-a-microservice-blog-in-golang-part3/performance-and-cpu-usage.webp "performance-and-cpu-usage")

1K req/s 约占单个核心的 10%。BoltDB 和 JSON 序列化的开销不是很大，很好！顺便说一下：最上面的 Java 进程是我们的 Gatling 测试，实际上它使用的 CPU 资源约为我们服务的 3 倍。

![performance-and-cpu-usage-gatling](/images/write-a-microservice-blog-in-golang-part3/performance-and-cpu-usage-gatling.webp "performance-and-cpu-usage-gatling")

平均响应时间仍小于一毫秒。

也许我们应该在更重的负载下进行测试，比如说 4K req/s？（注意，可能需要在操作系统级别上增加可用文件句柄的数量）：

### 内存使用率为 4K req/s

![memory-usage-at-4k](/images/write-a-microservice-blog-in-golang-part3/memory-usage-at-4k.webp "memory-usage-at-4k")

约 120 mb。几乎正好增加了 4 倍。几乎可以肯定，使用 n/o 并发请求导致的内存增加是由于 Go 运行时，或者是 Gorilla 随着负载提高而增加的用于为请求提供服务的 goroutine。

### 4K req/s 的性能

![performance-at-4k](/images/write-a-microservice-blog-in-golang-part3/performance-at-4k.webp "performance-at-4k")

在 4K req/s 下，CPU 使用率保持在 30% 以下。此时，即便在配备 16 GB RAM/Core i7 的笔记本电脑上运行，瓶颈也可能会出现在 IO 或文件句柄，而不是 CPU。

![performance-at-4k-gatling](/images/write-a-microservice-blog-in-golang-part3/performance-at-4k-gatling.webp "performance-at-4k-gatling")

现在，平均等待时间终于提升为 1 ms，其中 95% 的请求保持在 3 ms 以下。虽然我们确实看到延迟在 4K req/s 时受到冲击，但是我个人认为带有嵌入式 BoltDB 的小型服务 Accountservice 的性能确实很好。

## 与其他平台的比较

其他人可能会写一些有趣的博客文章，关于将该 accountservice 在 JVM、NodeJS 或 CLR 等上实现，并对其进行基准测试。

我在 2015 年底对此进行了一些简单的不够准确的基准测试（使用 Gatling 测试套件），比较了分别在 Go 1.5、Java 8 Spring Boot 和 NodeJS 中实现的 HTTP/JSON 服务 + MongoDB 读取。在该特殊情况下，基于 JVM 和 Go 的解决方案都可以很好地扩展，但 Go 与JVM 的延迟相比略有优势。NodeJS 的性能与上述方案相似，直到单个内核上的 CPU 利用率达到 100%，这时延迟就开始出现下降了。

请不要将上述基准测试当作某种依据，因为这只是我自己做的一个快速而不专业的测试。

因此，尽管我已经展示了使用 Go 1.7 编写的 accountservice 在 4K req/s 下可观的性能数据，但其他平台也有可能达到这个性能，不过我也怀疑它们的内存使用是否比 Go 少。也许您的体验和我不同。

## 后记

在本博客系列的下一部分中，我们将看看如何使用 GoConvey 并模拟 BoltDB 客户端来对服务进行单元测试。
