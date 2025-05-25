---
title: "Golang 并发监控值变化"
pubDate: 2025-05-07T19:19:40+08:00
lastmod: 2025-05-07T19:19:40+08:00
keywords: []
description: ""
categories: [Golang]

---

在上一个项目 listdb 中，需要对自定义的表结构在多台机器请求间保持同步，所以需要并发监控值变化，以下是常见的三种方法。

## 轮询

使用 sync/atomic 包对值进行存储和读取，当轮询发现值变化时返回。

简单、无锁，但是非实时，有轮询的延迟。

```go
package polling

import (
	"log"
	"sync/atomic"
	"time"
)

var val int64

func get(oldAddr *int64) int64 {
	log.Println("start get")

	// 保存值用来比较
	oldVal := *oldAddr

	for {
		log.Println("start for")

		newVal := atomic.LoadInt64(oldAddr)

		log.Println("newVal =", newVal)
		log.Println("oldVal =", oldVal)

		if newVal == oldVal {
			log.Println("start polling")

			time.Sleep(100 * time.Millisecond)
		} else {
			log.Println("end polling")
			log.Println("end for")
			log.Println("end get")

			return newVal
		}
	}
}

func set(newVal int64) {
	log.Println("start set")
	log.Println("start change val")

	atomic.StoreInt64(&val, newVal)

	log.Println("end change val")
	log.Println("end set")
}
```

```go
package polling

import (
	"log"
	"testing"
	"time"
)

func TestPolling(t *testing.T) {
	go func() {
		time.Sleep(2 * time.Second)
		set(1)
	}()

	go func() {
		newVal := get(&val)
		log.Println(newVal)
	}()

	time.Sleep(3 * time.Second)
}
```

日志如下，已删除部分重复数据：

```text
2025/05/07 18:58:42 start get
2025/05/07 18:58:42 start for
2025/05/07 18:58:42 newVal = 0
2025/05/07 18:58:42 oldVal = 0
2025/05/07 18:58:42 start polling
2025/05/07 18:58:42 start for
2025/05/07 18:58:42 newVal = 0
2025/05/07 18:58:42 oldVal = 0
2025/05/07 18:58:44 start polling
2025/05/07 18:58:44 start set
2025/05/07 18:58:44 start change val
2025/05/07 18:58:44 end change val
2025/05/07 18:58:44 end set
2025/05/07 18:58:44 start for
2025/05/07 18:58:44 newVal = 1
2025/05/07 18:58:44 oldVal = 0
2025/05/07 18:58:44 end polling
2025/05/07 18:58:44 end for
2025/05/07 18:58:44 end get
2025/05/07 18:58:44 1
```

## 条件变量

先新建一个互斥锁，把锁放进 sync.Cond，通过 `Wait()` 阻塞，值修改后通过 `Broadcast()` 广播。

sync.Cond 容易出错，不建议使用，而且需要用户自己完成部分同步工作，详见：[Go advanced concurrency patterns: part 3 (channels)](https://blogtitle.github.io/go-advanced-concurrency-patterns-part-3-channels/ "Go advanced concurrency patterns: part 3 (channels)")

```go
package cond

import (
	"log"
	"sync"
)

var val int

var mu = new(sync.Mutex)

// 赋值 mu 给 cond 内部的锁
var cond = sync.NewCond(mu)

func get(old int) int {
	log.Println("start get")

	mu.Lock()
	defer mu.Unlock()

	// val 和 old 相同时，即未改变时，直接进入 for 等待改变
	// val 和 old 不相同时，直接返回 val
	for val == old {
		log.Println("start for")

		// 阻塞，接收到广播才会停止阻塞
		// cond.Wait() 之前必须获取到 mu 锁
		log.Println("start wait")
		cond.Wait()
		log.Println("end wait")
	}

	log.Println("end for")

	log.Println("end get")

	return val
}

func set(newVal int) {
	log.Println("start set")

	// 这里不会死锁吗？
	// 不会，cond.Wait() 里面每隔一段系统内置的时间，就会解除 mu 的锁
	mu.Lock()
	defer mu.Unlock()

	log.Println("start change val")
	val = newVal
	log.Println("end change val")

	// 发生消息到全部，即 cond.Wait()
	log.Println("start broadcast")
	cond.Broadcast()
	log.Println("end broadcast")

	log.Println("end set")
}
```

```go
package cond

import (
	"log"
	"testing"
	"time"
)

func TestCond(t *testing.T) {
	go func() {
		time.Sleep(2 * time.Second)
		set(1)
	}()

	go func() {
		newVal := get(val)
		log.Println(newVal)
	}()

	time.Sleep(3 * time.Second)
}
```

日志如下：

```text
2025/05/07 15:44:15 start get
2025/05/07 15:44:15 start for
2025/05/07 15:44:15 start wait
2025/05/07 15:44:17 start set
2025/05/07 15:44:17 start change val
2025/05/07 15:44:17 end change val
2025/05/07 15:44:17 start broadcast
2025/05/07 15:44:17 end broadcast
2025/05/07 15:44:17 end set
2025/05/07 15:44:17 end wait
2025/05/07 15:44:17 end for
2025/05/07 15:44:17 end get
2025/05/07 15:44:17 1
```

## channel

类似 sync.Cond，但通过 `select` 阻塞，值修改后通过 `close channel` 广播。

```go
package channel

import (
	"context"
	"log"
	"sync"
)

var val int

var mu sync.Mutex

var done = make(chan struct{})

func get(ctx context.Context, old int) (int, bool) {
	log.Println("start get")

	mu.Lock()
	// 获取值的复制
	v, ch := val, done
	mu.Unlock()

	// val 和 old 相同时，即未改变时，直接进入 for
	// val 和 old 不相同时，直接返回 val
	for v == old {
		log.Println("start for")

		log.Println("start wait")
		select {
		case <-ctx.Done():
			return 0, false // false = timeout
		case <-ch:
			mu.Lock()
			log.Println("start get val")
			v, ch = val, done
			log.Println("end get val")
			mu.Unlock()
		}

		log.Println("end wait")
	}

	log.Println("end for")

	log.Println("end get")

	return v, true
}

func set(newVal int) {
	log.Println("start set")

	mu.Lock()
	defer mu.Unlock()

	log.Println("start change val")
	val = newVal
	log.Println("end change val")

	log.Println("start close chan")
	close(done)
	log.Println("end close chan")

	// 因为 close 了的通道无法再次使用，这里重新 make 一个
	done = make(chan struct{})
}
```

```go
package channel

import (
	"context"
	"log"
	"testing"
	"time"
)

func TestChannel(t *testing.T) {
	go func() {
		time.Sleep(2 * time.Second)
		set(1)
	}()

	go func() {
		ctx := context.Background()
		newVal, ok := get(ctx, val)
		log.Println(newVal)
		log.Println(ok)
	}()

	time.Sleep(3 * time.Second)
}
```

日志如下：

```text
2025/05/07 15:54:08 start get
2025/05/07 15:54:08 start for
2025/05/07 15:54:08 start wait
2025/05/07 15:54:10 start set
2025/05/07 15:54:10 start change val
2025/05/07 15:54:10 end change val
2025/05/07 15:54:10 start close chan
2025/05/07 15:54:10 end close chan
2025/05/07 15:54:10 start get val
2025/05/07 15:54:10 end get val
2025/05/07 15:54:10 end wait
2025/05/07 15:54:10 end for
2025/05/07 15:54:10 end get
2025/05/07 15:54:10 1
2025/05/07 15:54:10 true
```