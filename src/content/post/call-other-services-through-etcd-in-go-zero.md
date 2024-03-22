---
title: "在 go-zero 中通过 etcd 调用其他服务"
pubDate: 2024-03-22T12:11:00+08:00
lastmod: 2024-03-22T12:11:00+08:00
keywords: []
description: ""
categories: [Golang]

---

在 go-zero 中通过 etcd 调用其他服务时，需要遵循以下步骤。

假设调用方为 user 服务，被调用方为 blog 服务。

## 1. 在配置文件中添加字段

路径为：service/user/rpc/etc/user.yaml

新增的字段为 BlogConf：

```yaml
Name: user.rpc
ListenOn: 0.0.0.0:10000
Etcd:
  Hosts:
  - etcd-single:2379
  Key: user.rpc
DB:
  DataSource: postgresql://dev:dev@postgresql:5432/go_blogger?sslmode=disable
Cache:
  - Host: redis:6379
BlogConf:
  Endpoints:
    - etcd-single:10001
  NonBlock: true
```

其中 etcd-single 表示 etcd 的地址，10001 为 blog 服务的端口号。

## 2. 在配置结构体中添加字段

路径为：service/user/rpc/internal/config/config.go

新增的字段为 BlogConf：

```go
type Config struct {
	zrpc.RpcServerConf
	DB struct {
		DataSource string
	}
	Cache    cache.CacheConf
	BlogConf zrpc.RpcClientConf
}
```

## 3. 在服务注册时添加字段

路径为：service/user/rpc/internal/svc/service_context.go

分别在 ServiceContext 结构体和 NewServiceContext 函数中新增字段 BlogService：

```go
package svc

import (
	"github.com/linehk/go-microservices-blogger/service/blog/rpc/blogservice"
	"github.com/linehk/go-microservices-blogger/service/user/rpc/internal/config"
	"github.com/linehk/go-microservices-blogger/service/user/rpc/model"
	"github.com/zeromicro/go-zero/core/stores/postgres"
	"github.com/zeromicro/go-zero/core/stores/redis"
	"github.com/zeromicro/go-zero/zrpc"
)

type ServiceContext struct {
	Config       config.Config
	RedisClient  *redis.Redis
	AppUserModel model.AppUserModel
	LocaleModel  model.LocaleModel
	BlogService  blogservice.BlogService
}

func NewServiceContext(c config.Config) *ServiceContext {
	conn := postgres.New(c.DB.DataSource)
	redisConf := redis.RedisConf{
		Host: c.Cache[0].Host,
		Type: redis.NodeType,
	}
	
	return &ServiceContext{
		Config:       c,
		RedisClient:  redis.MustNewRedis(redisConf),
		AppUserModel: model.NewAppUserModel(conn, c.Cache),
		LocaleModel:  model.NewLocaleModel(conn, c.Cache),
		BlogService:  blogservice.NewBlogService(zrpc.MustNewClient(c.BlogConf)),
	}
}

```

全部代码可以查看 [go-microservices-blogger](https://github.com/linehk/go-microservices-blogger "go-microservices-blogger")。