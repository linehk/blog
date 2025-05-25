---
title: "Golang 实现优雅停机、热重启、systemd 集成和持续部署"
pubDate: 2025-05-25T15:10:51+08:00
lastmod: 2025-05-25T15:10:51+08:00
keywords: []
description: ""
categories: [Golang]

---

在上一个项目 [listdb](https://www.upwork.com/jobs/~018db314725bf3f8f2 "listdb") 中，客户希望实现零停机，即程序更新时，保持正在执行的请求不中断，且拒绝新的请求，保持服务可用性，让第三方用户零感知。

这种需求在云原生环境下一般被称为[滚动部署（Rolling deployments）](https://docs.aws.amazon.com/whitepapers/latest/overview-deployment-options/rolling-deployments.html "滚动部署（Rolling deployments）")，需要 k8s 等组件参与。

客户希望保持项目的简单和减少依赖，所以不能使用云原生组件和第三方包，所以需要手动实现优雅停机（Graceful Shutdown）、热重启（Hot Restart）、systemd 集成和持续部署（如：GitHub Actions）集成。

## 优雅停机（Graceful Shutdown）

Go 1.8 后能简单的使用 `http.Server` 的 `Shutdown` 来实现，示例如下：

```go
func Start(timeout time.Duration) {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Println("start request")
		// 模拟长时间的请求
		time.Sleep(5 * time.Second)
		// 用来表示请求完成
		_, err := w.Write([]byte("request done"))
		if err != nil {
			log.Panicln(err)
		}
		log.Println("end request")
	})

	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	go func() {
		log.Println("start server")
		err := server.ListenAndServe()
		// 程序阻塞在这里，其它 goroutine 调用了 Shutdown，会立即返回 http.ErrServerClosed
		// 所以需要捕捉这个错误来防止程序退出
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Panicln("ListenAndServe err:", err)
		}
		log.Println("end server")
	}()

	// 对用于通知一个信号值的通道，1 的缓冲区就足够了
	signalChan := make(chan os.Signal, 1)

	// 接管默认的信号的处理
	// 声明需要捕获的信号
	signal.Notify(signalChan, syscall.SIGTERM, syscall.SIGINT)

	// 在没有接收到信号前，阻塞在这里
	log.Println("start block signal")
	<-signalChan
	log.Println("end block signal")

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	// 接收到信号后，开始关闭
	log.Println("start shutdown")
	// 不需要手动调用 server.Close，Shutdown 会做
	err := server.Shutdown(ctx)
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			log.Fatalln("Shutdown timeout")
			// 超时后，可以使用重试、降级和熔断等手段
		} else {
			log.Panicln("Shutdown err:", err)
		}
	}
	log.Println("end shutdown")
}
```

常见信号和其作用为：

* SIGKILL：立即终止信号，无法被捕获
* SIGTERM：标准的终止进程信号，也是 kill 命令默认发送的信号
* SIGINT：终端中断信号，即 Ctrl+C
* SIGUSR1、SIGUSR2：用户自定义信号，后面会用于热重启
* SIGHUP：重载配置信号

目前只捕获了 SIGTERM 和 SIGINT。

对优雅停机的测试如下：

```go
func TestGracefulShutdown(t *testing.T) {
	go Start(10 * time.Second)
	// 这里的 sleep 是为了让程序进入 <-signalChan 的阻塞
	time.Sleep(1 * time.Second)

	go func() {
		// 如果直接调用路由对应的处理函数，会导致无法进入 Shutdown 的等待队列
		// 所以只能直接调用 http.Get
		resp, err := http.Get("http://localhost:8080/")
		if err != nil {
			log.Panicln("Get err:", err)
		}
		defer resp.Body.Close()

		respBodyBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Panicln("ReadAll err:", err)
		}

		log.Println("sign message:", string(respBodyBytes))
	}()
	// 这里的 sleep 是为了让上一个请求发出后，再开始发送信号
	time.Sleep(1 * time.Second)

	process, err := os.FindProcess(os.Getpid())
	if err != nil {
		t.Fatal("FindProcess err:", err)
	}

	err = process.Signal(syscall.SIGTERM)
	if err != nil {
		t.Fatal("Signal err:", err)
	}

	// 这里的 sleep 是为了防止程序过快退出，导致无法看到请求完成的日志
	time.Sleep(8 * time.Second)
}
```

日志显示了，在请求进行中时，即使收到信号，也会等待请求完成：

```text
2025/05/20 13:33:28 start server
2025/05/20 13:33:28 start block signal
2025/05/20 13:33:29 start request
2025/05/20 13:33:30 end block signal
2025/05/20 13:33:30 start shutdown
2025/05/20 13:33:30 end server
2025/05/20 13:33:34 end request
2025/05/20 13:33:34 sign message: request done
2025/05/20 13:33:34 end shutdown
```

对超时的测试如下：

```go
func TestGracefulShutdownTimeout(t *testing.T) {
	// timeout 小于请求的 time.Sleep(5 * time.Second)，用来模拟超时场景
	go Start(3 * time.Second)
	// 这里的 sleep 是为了让程序进入 <-signalChan 的阻塞
	time.Sleep(1 * time.Second)

	go func() {
		// 如果直接调用路由对应的处理函数，会导致无法进入 Shutdown 的等待队列
		// 所以只能直接调用 http.Get
		resp, err := http.Get("http://localhost:8080/")
		if err != nil {
			log.Panicln("Get err:", err)
		}
		defer resp.Body.Close()

		respBodyBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Panicln("ReadAll err:", err)
		}

		log.Println("sign message:", string(respBodyBytes))
	}()
	// 这里的 sleep 是为了让上一个请求发出后，再开始发送信号
	time.Sleep(1 * time.Second)

	process, err := os.FindProcess(os.Getpid())
	if err != nil {
		t.Fatal("FindProcess err:", err)
	}

	err = process.Signal(syscall.SIGTERM)
	if err != nil {
		t.Fatal("Signal err:", err)
	}

	// 这里的 sleep 是为了防止程序过快退出，导致无法看到请求完成的日志
	time.Sleep(8 * time.Second)
}
```

日志显示了，在请求进行中时，可以捕获超时错误：

```text
2025/05/20 13:37:01 start server
2025/05/20 13:37:01 start block signal
2025/05/20 13:37:02 start request
2025/05/20 13:37:03 end block signal
2025/05/20 13:37:03 start shutdown
2025/05/20 13:37:03 end server
2025/05/20 13:37:06 Shutdown timeout
```

## 热重启（Hot Restart）

该实现结合了优雅停机和热重启。

但因为需求紧急，且热重启逻辑过于复杂，以下代码可能有错误，谨慎在生产环境中使用。

最好还是使用第三方包，或者干脆使用定时任务在流量少的时候停机更新。

### 步骤

1. 正常启动，阻塞在 `server.Serve` 和 `switch <-signalChan`，等待信号
2. 接收到 SIGUSR1 信号，开始热重启
3. 从正常启动的 listener 获取文件描述符，通过命令行参数 `-fd n` 传递给新进程
4. 启动新进程，旧进程结束
5. 新进程从传递的 -fd 参数获取 listener，回到第一步，阻塞在 `server.Serve` 和 `switch <-signalChan`，等待信号

### 代码

```go
func main() {
	// 0 表示未传入
	// flag 参数始终不为 nil
	fd := flag.Uint("fd", 0, "旧进程传给新进程的文件描述符")
	flag.Parse()

	// 如果未传入 fd，正常 listen
	// 如果传入了 fd，通过 fd 来 listen
	// 未传入，正常启动
	var listener net.Listener
	if *fd == 0 {
		listener = normalModeListener()
	} else {
		listener = hotRestartModeListener(*fd)
	}

	// 这里不再设置地址，net.Listen 已经设置了
	server := &http.Server{
		Handler: handler(),
	}
	// 不管是 normal mode 还是 hot restart mode 都会进入这里，只不过 listener 不同
	go func() {
		log.Println("start serve")

		err := server.Serve(listener)

		log.Println("stop Serve err:", err)

		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Panicln("Serve err:", err)
		}

		log.Println("end serve")
	}()

	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, syscall.SIGTERM, syscall.SIGINT, syscall.SIGUSR1)

	log.Println("start block signal")

	switch <-signalChan {
	case syscall.SIGUSR1:
		log.Println("start hot restart")

		// hot restart mode，第一步：旧进程接收到信号
		// listener 和 server 都是正常打开的
		err := HotRestart(listener)
		if err != nil {
			log.Panicln(err)
		}

		log.Println("start hot restart mode graceful shutdown")

		// server.Shutdown(ctx) 会关闭文件描述符
		GracefulShutdown(server)

		log.Println("end hot restart mode graceful shutdown")

		log.Println("end hot restart")
		// 旧进程主动退出
		// 跟 os.Exit(0) 没有区别？

	case syscall.SIGTERM, syscall.SIGINT:
		log.Println("start normal mode graceful shutdown")

		GracefulShutdown(server)
		// 自然退出
		log.Println("end normal mode graceful shutdown")
	}

	log.Println("end block signal")
}

func handler() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Println("start request")

		time.Sleep(5 * time.Second)
		_, err := w.Write([]byte("request done"))
		if err != nil {
			log.Panicln(err)
		}

		log.Println("request pid =", os.Getpid())

		log.Println("end request")
	})
	return mux
}

func normalModeListener() net.Listener {
	log.Println("start listen on normal mode")

	log.Println("normal mode listen on pid =", os.Getpid())

	// fd1，一般是 3 号
	listener, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Panicln("Listen err:", err)
	}

	log.Println("end listen on normal mode")

	return listener
}

func hotRestartModeListener(fd uint) net.Listener {
	// hot restart mode，第二步：来自 StartProcess
	log.Println("start listen on hot restart mode")

	log.Println("hot restart mode listen on pid =", os.Getpid())

	log.Println("hot restart mode receive fd =", fd)

	// NewFile 的第二个参数不重要
	file := os.NewFile(uintptr(fd), "random string")
	if file == nil {
		log.Panicln("invalid fd:", fd)
	}

	// // 关闭 3 号的代码，但是会导致请求过程中，发送升级信号，返回错误
	// oldFile := os.NewFile(uintptr(*fd-1), "random string2")
	// if oldFile == nil {
	// 	log.Panicln("invalid fd:", *fd)
	// }
	// err := oldFile.Close()
	// if err != nil {
	// 	log.Panicln("Close err:", err)
	// }

	// 会创建 file 的文件描述符副本
	// 原本是 5 号，但顺延到 6 号
	listener, err := net.FileListener(file)
	if err != nil {
		err = file.Close()
		if err != nil {
			log.Panicln("Close err:", err)
		}

		log.Panicln("FileListener err:", err)
	}

	// 创建了副本就马上关闭原来的
	// 关闭 4 号
	err = file.Close()
	if err != nil {
		log.Panicln("Close err:", err)
	}

	// 这里如果用 defer，会导致 main 函数返回时才执行
	// 但由于使用了 os.Exit，会导致 main 不会正常返回，所以不会执行 defer
	// 就算不使用 os.Exit 也会不关闭，能看到日志，但是链接数还是增加，不知道为什么
	// defer func() {
	// 	log.Println("start close file")
	// 	err := file.Close()
	// 	if err != nil {
	// 		log.Panicln("Close err:", err)
	// 	}
	// 	log.Println("end close file")
	// }()

	log.Println("end listen on hot restart mode")

	return listener
}

func GracefulShutdown(server *http.Server) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := server.Shutdown(ctx)
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			log.Fatalln("Shutdown timeout")
		} else {
			log.Panicln("Shutdown err:", err)
		}
	}
}

func HotRestart(listener net.Listener) error {
	// 不需要关闭 tcpListener，server 里面有一个 tcpListener，GracefulShutdown 会关闭
	tcpListener, ok := listener.(*net.TCPListener)
	if !ok {
		return errors.New("listener not *net.TCPListener")
	}

	// 会创建 tcpListener 文件描述符的副本，新的 fd 数字 = fd + 1，上面的是 3 号，所以这里是 4 号
	// 需要传递给新进程，所以不能关闭
	file, err := tcpListener.File()
	if err != nil {
		return err
	}

	fd := file.Fd()

	log.Println("tcpListener fd copy =", fd)

	// Go 默认设置 FD_CLOEXEC 给套接字，
	// 但是该标志会导致在调用 exec（os.StartProcess 或 cmd.Start） 时，被操作系统自动关闭
	// 所以需要清除该标记
	err = clearCLOEXEC(fd)
	if err != nil {
		return err
	}

	log.Println("old args =", os.Args)

	pureArgs := os.Args[1:]

	// 需要传递原来的参数
	// 并且把 fd 放在命令行参数，给新进程使用
	// 如果有 -fd，就替换 -fd 对应的数字，不然添加 -fd n
	fdStr := strconv.Itoa(int(fd))
	found := false
	for i := range pureArgs {
		if pureArgs[i] == "-fd" {
			pureArgs[i+1] = fdStr
			found = true
		}
	}
	if !found {
		pureArgs = append(pureArgs, "-fd", fdStr)
	}

	log.Println("new args =", pureArgs)

	// 仅使用 os.Args[0] 可能会导致在环境变量的干扰下失效
	name, err := exec.LookPath(os.Args[0])
	if err != nil {
		return err
	}

	wd, err := os.Getwd()
	if err != nil {
		return err
	}

	cmd := exec.Command(name, pureArgs...)
	log.Println(cmd.Args)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	// 根据需要传递旧进程的环境变量和工作目录
	cmd.Env = os.Environ()
	cmd.Dir = wd
	// 同时传递 fd 和 file 的原因是
	// file 只是让新进程和操作系统绑定对应文件描述符
	// 还需要通过 os.NewFile(fd) 来获得一个 Go 结构体数据结构，才能操作对应的套接字
	cmd.ExtraFiles = []*os.File{file}

	err = cmd.Start()
	if err != nil {
		return err
	}

	// 更底层的启动方式
	// newProcess, err := os.StartProcess(name, newArgs, &os.ProcAttr{
	// 	Files: []*os.File{os.Stdin, os.Stdout, os.Stderr, file},
	// 	Env: os.Environ(),
	// 	Dir: wd,
	// })
	// if err != nil {
	// 	return err
	// }

	return nil
}

func clearCLOEXEC(fd uintptr) error {
	// 直接清除全部
	// _, _, errno := syscall.Syscall(syscall.SYS_FCNTL, fd, syscall.F_SETFD, 0)
	// if errno != 0 {
	// 	return errors.New("cannot clear all flag on fd")
	// }

	// 先获取，然后清除
	flags, _, errno := syscall.Syscall(syscall.SYS_FCNTL, fd, uintptr(syscall.F_GETFD), 0)
	if errno != 0 {
		return errors.New("cannot get flags on fd")
	}

	newFlags := flags &^ syscall.FD_CLOEXEC
	_, _, errno = syscall.Syscall(syscall.SYS_FCNTL, fd, uintptr(syscall.F_SETFD), newFlags)
	if errno != 0 {
		return errors.New("cannot set flags on fd")
	}

	return nil
}
```

### 测试

因为涉及启动进程，所以难以使用 Go 内置测试环境，改为手动测试，步骤如下：

1. 启动服务：`go build -o restart && ./restart`
2. 使用代码每隔 1s 访问一次路由
3. 发送热重启信号：`kill -SIGUSR1 $(pidof restart)`

步骤 2 使用以下代码：

```go
	for {
		resp, err := http.Get("http://localhost:8080/")
		if err != nil {
			log.Println(err)
		}
		body, _ := io.ReadAll(resp.Body)
		log.Println(string(body))
		time.Sleep(1 * time.Second)
	}
```

可以看到日志显示了新进程的启动，服务也并没有中断。

### 改进

* 端口复用，添加 SO_REUSEPORT 支持
* 在热重启后，通过命令 `lsof -p $(pidof restart)` 可以看出，占用的文件描述符多了一个，不知道能否关闭

### 第三方包评估

最新的还在维护的包：

* https://github.com/cloudflare/tableflip
* https://github.com/sevlyar/go-daemon
* https://github.com/rs/seamless

以下包可能过旧，但可以参考：

* https://github.com/facebookarchive/grace
* https://github.com/fvbock/endless
* https://github.com/rcrowley/goagain
* https://github.com/crawshaw/littleboss

## systemd 集成

参考 [tableflip](https://github.com/cloudflare/tableflip?tab=readme-ov-file#integration-with-systemd "tableflip")：

```text
[Unit]
Description=Service using tableflip

[Service]
ExecStart=/path/to/binary -some-flag /path/to/pid-file
ExecReload=/bin/kill -HUP $MAINPID
PIDFile=/path/to/pid-file
```

因为 systemd 需要 pid-file 实现自动重启等功能，所以还需要实现写入 pid-file 的逻辑。

## 持续部署（如：GitHub Actions）

```text
on: [ push ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@main
      - uses: actions/setup-go@main
        with:
          go-version-file: 'go.mod'
      - run: go build -o example .
      - uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.host }}
          username: ${{ secrets.user }}
          key: ${{ secrets.serverKey }}
          port: ${{ secrets.port }}
          source: "example"
          target: "/"

      - uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.host }}
          username: ${{ secrets.user }}
          key: ${{ secrets.serverKey }}
          port: ${{ secrets.port }}
          script:
            ps -C example >/dev/null && pkill -SIGUSR2 example || ./example
```

可能还需要实现通过命令行参数，传递新的二进制文件路径的功能。

## 参考链接

[Graceful Shutdown in Go: Practical Patterns](https://victoriametrics.com/blog/go-graceful-shutdown/index.html "Graceful Shutdown in Go: Practical Patterns")

[Integration of a Go service with systemd: readiness & liveness](https://vincent.bernat.ch/en/blog/2017-systemd-golang "Integration of a Go service with systemd: readiness & liveness")

[Graceful Restart in Golang](https://grisha.org/blog/2014/06/03/graceful-restart-in-golang/ "Graceful Restart in Golang")