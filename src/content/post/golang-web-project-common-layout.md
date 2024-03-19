---
title: "Golang Web 项目常见布局"
pubDate: 2024-01-31T20:46:17+08:00
lastmod: 2024-01-31T20:46:17+08:00
keywords: []
description: ""
categories: [Golang]

---

<!--more-->

## 官方布局

来源：[Golang 官方文档](https://go.dev/doc/modules/layout "Golang 官方文档")

```plaintext
project-root-directory/
  go.mod
  internal/
    auth/
      ...
    metrics/
      ...
    model/
      ...
  cmd/
    api-server/
      main.go
    metrics-analyzer/
      main.go
    ...
  ... the project's other directories with non-Go code
```

总结：只是一个简单的布局，cmd/ 作为入口，不同的应用使用不同的目录；internal/ 作为放置实际代码的地方，按功能模块来分隔。

## golang-standards/project-layout

来源：[golang-standards/project-layout](https://github.com/golang-standards/project-layout/blob/master/README_zh.md "golang-standards/project-layout")

* /cmd：主应用，如：cmd/api-server/main.go，只调用 internal 和 pkg 中的代码。
* /internal：私有代码。
* /pkg：外部应用程序可以使用的库代码。
* /api：API 协议文件，如：OpenAPI、protocol 协议。
* /web：前端。
* /configs：配置文件。
* /init：系统管理工具配置，如：systemd。
* /scripts：各种脚本，主要作用是使得 Makefile 简短。
* /build：打包和持续集成。其中 /build/package 放置 Docker、deb 等配置和脚本；/build/ci 放置 CI 配置和脚本。但是 GitHub Actions 无法自定义路径，只能使用 .github/workflows/build.yml。
* /deployments：IaaS、PaaS、系统和容器编排部署配置和模板（docker-compose、kubernetes/helm、terraform）。使用 k8s 部署的应用程序中，此目录称为 /deploy。
* /test：其他外部测试应用程序和测试数据。如：/test/data。
* /docs：设计和用户文档，不包括 godoc。
* /tools：该项目的支持工具。这些工具可以从 /internal 和 /pkg 导入代码。
* /examples：代码示例。
* /third_party：外部帮助工具、fork 的代码和其他第 3 方实用程序，如：Swagger UI。
* /githooks：Git 钩子。
* /assets：与您的存储库一起使用的资产，如：图像、徽标等。
* /website：项目的网站数据，如：GitHub 页面。

总结：只说明了各个目录隐含的意思。

## go-zero 框架

来源：[go-zero 框架布局](https://go-zero.dev/docs/concepts/layout "go-zero 框架布局")

```plaintext
example
├── etc
│   └── example.yaml
├── main.go
└── internal
    ├── config
    │   └── config.go
    ├── handler
    │   ├── xxxhandler.go
    │   └── xxxhandler.go
    ├── logic
    │   └── xxxlogic.go
    ├── svc
    │   └── servicecontext.go
    └── types
        └── types.go
```

总结：请求从 logic/xxxlogic.go 开始，途经 handler，可以自定义模板来实现 DDD 架构。

## wild-workouts-go-ddd-example

来源：[wild-workouts-go-ddd-example](https://github.com/ThreeDotsLabs/wild-workouts-go-ddd-example "wild-workouts-go-ddd-example")

internel/ 目录：

```plaintext
.
├── common
│   ├── auth
│   │   ├── http.go
│   │   └── http_mock.go
│   ├── client
│   │   ├── auth.go
│   │   ├── grpc.go
│   │   ├── net.go
│   │   ├── trainer
│   │   │   ├── openapi_client_gen.go
│   │   │   └── openapi_types.gen.go
│   │   ├── trainings
│   │   │   ├── openapi_client_gen.go
│   │   │   └── openapi_types.gen.go
│   │   └── users
│   │       ├── openapi_client_gen.go
│   │       └── openapi_types.gen.go
│   ├── decorator
│   │   ├── command.go
│   │   ├── logging.go
│   │   ├── metrics.go
│   │   └── query.go
│   ├── errors
│   │   └── errors.go
│   ├── genproto
│   │   ├── trainer
│   │   │   ├── trainer.pb.go
│   │   │   └── trainer_grpc.pb.go
│   │   └── users
│   │       ├── users.pb.go
│   │       └── users_grpc.pb.go
│   ├── go.mod
│   ├── go.sum
│   ├── logs
│   │   ├── cqrs.go
│   │   ├── http.go
│   │   └── logrus.go
│   ├── metrics
│   │   └── dummy.go
│   ├── server
│   │   ├── grpc.go
│   │   ├── http.go
│   │   └── httperr
│   │       └── http_error.go
│   └── tests
│       ├── clients.go
│       ├── e2e_test.go
│       ├── hours.go
│       ├── jwt.go
│       └── wait.go
├── trainer
│   ├── adapters
│   │   ├── dates_firestore_repository.go
│   │   ├── hour_firestore_repository.go
│   │   ├── hour_memory_repository.go
│   │   ├── hour_mysql_repository.go
│   │   └── hour_repository_test.go
│   ├── app
│   │   ├── app.go
│   │   ├── command
│   │   │   ├── cancel_training.go
│   │   │   ├── make_hours_available.go
│   │   │   ├── make_hours_unavailable.go
│   │   │   └── schedule_training.go
│   │   └── query
│   │       ├── available_hours.go
│   │       ├── hour_availability.go
│   │       └── types.go
│   ├── domain
│   │   └── hour
│   │       ├── availability.go
│   │       ├── availability_test.go
│   │       ├── hour.go
│   │       ├── hour_test.go
│   │       └── repository.go
│   ├── fixtures.go
│   ├── go.mod
│   ├── go.sum
│   ├── main.go
│   ├── ports
│   │   ├── grpc.go
│   │   ├── http.go
│   │   ├── openapi_api.gen.go
│   │   └── openapi_types.gen.go
│   └── service
│       ├── application.go
│       └── component_test.go
├── trainings
│   ├── adapters
│   │   ├── trainer_grpc.go
│   │   ├── trainings_firestore_repository.go
│   │   ├── trainings_firestore_repository_test.go
│   │   └── users_grpc.go
│   ├── app
│   │   ├── app.go
│   │   ├── command
│   │   │   ├── approve_training_reschedule.go
│   │   │   ├── cancel_training.go
│   │   │   ├── cancel_training_test.go
│   │   │   ├── reject_training_reschedule.go
│   │   │   ├── request_training_reschedule.go
│   │   │   ├── reschedule_training.go
│   │   │   ├── schedule_training.go
│   │   │   └── services.go
│   │   └── query
│   │       ├── all_trainings.go
│   │       ├── trainings_for_user.go
│   │       └── types.go
│   ├── domain
│   │   └── training
│   │       ├── cancel.go
│   │       ├── cancel_balance.go
│   │       ├── cancel_test.go
│   │       ├── repository.go
│   │       ├── reschedule.go
│   │       ├── reschedule_test.go
│   │       ├── training.go
│   │       ├── training_test.go
│   │       ├── user.go
│   │       └── user_test.go
│   ├── go.mod
│   ├── go.sum
│   ├── main.go
│   ├── ports
│   │   ├── http.go
│   │   ├── openapi_api.gen.go
│   │   └── openapi_types.gen.go
│   └── service
│       ├── component_test.go
│       ├── mocks.go
│       └── service.go
└── users
    ├── firestore.go
    ├── fixtures.go
    ├── go.mod
    ├── go.sum
    ├── grpc.go
    ├── http.go
    ├── main.go
    ├── openapi_api.gen.go
    └── openapi_types.gen.go
```

总结：

internal/ 目录下分成不同的微服务，common/ 目录放置共用的代码。

每个微服务按 DDD 的原则划分。

每个请求一般从 ports\http.go 开始，途经 app 层、domain 层、repository 层（adapters 目录）。

## go-backend-clean-architecture

来源：[go-backend-clean-architecture](https://github.com/amitshekhariitbhu/go-backend-clean-architecture "go-backend-clean-architecture")

```plaintext
.
├── Dockerfile
├── LICENSE
├── README.md
├── api
│   ├── controller
│   │   ├── login_controller.go
│   │   ├── profile_controller.go
│   │   ├── profile_controller_test.go
│   │   ├── refresh_token_controller.go
│   │   ├── signup_controller.go
│   │   └── task_controller.go
│   ├── middleware
│   │   └── jwt_auth_middleware.go
│   └── route
│       ├── login_route.go
│       ├── profile_route.go
│       ├── refresh_token_route.go
│       ├── route.go
│       ├── signup_route.go
│       └── task_route.go
├── assets
│   ├── button-view-api-docs.png
│   ├── go-arch-private-api-request-flow.png
│   ├── go-arch-public-api-request-flow.png
│   ├── go-backend-arch-diagram.png
│   └── go-backend-clean-architecture.png
├── bootstrap
│   ├── app.go
│   ├── database.go
│   └── env.go
├── cmd
│   └── main.go
├── docker-compose.yaml
├── domain
│   ├── error_response.go
│   ├── jwt_custom.go
│   ├── login.go
│   ├── mocks
│   │   ├── LoginUsecase.go
│   │   ├── ProfileUsecase.go
│   │   ├── RefreshTokenUsecase.go
│   │   ├── SignupUsecase.go
│   │   ├── TaskRepository.go
│   │   ├── TaskUsecase.go
│   │   └── UserRepository.go
│   ├── profile.go
│   ├── refresh_token.go
│   ├── signup.go
│   ├── success_response.go
│   ├── task.go
│   └── user.go
├── go.mod
├── go.sum
├── internal
│   ├── fakeutil
│   │   └── fakeutil.go
│   └── tokenutil
│       └── tokenutil.go
├── mongo
│   ├── mocks
│   │   ├── Client.go
│   │   ├── Collection.go
│   │   ├── Cursor.go
│   │   ├── Database.go
│   │   └── SingleResult.go
│   └── mongo.go
├── repository
│   ├── task_repository.go
│   ├── user_repository.go
│   └── user_repository_test.go
└── usecase
    ├── login_usecase.go
    ├── profile_usecase.go
    ├── refresh_token_usecase.go
    ├── signup_usecase.go
    ├── task_usecase.go
    └── task_usecase_test.go
```

总结：另一种 DDD 布局，请求从 api/controller/login_controller.go 开始，途经 app 层（usecase 目录）、domain 层、repository 层。

## create-go-app/cli

来源：[create-go-app/cli](https://github.com/create-go-app/cli "create-go-app/cli")

```plaintext
.
├── Dockerfile
├── LICENSE
├── Makefile
├── README.md
├── app
│   ├── BUSINESS_LOGIC.md
│   ├── controllers
│   │   └── user_controller.go
│   ├── models
│   │   └── user_model.go
│   ├── queries
│   │   └── user_query.go
│   └── validators
│       └── user_validator.go
├── docs
│   ├── docs.go
│   ├── swagger.json
│   └── swagger.yaml
├── go.mod
├── go.sum
├── main.go
├── pkg
│   ├── PROJECT_SPECIFIC.md
│   ├── configs
│   │   ├── jwt_config.go
│   │   └── server_config.go
│   ├── routes
│   │   ├── private_routes.go
│   │   ├── public_routes.go
│   │   └── swagger_routes.go
│   └── utils
│       ├── connection_url_builder.go
│       ├── jwt_generator.go
│       ├── start_server.go
│       └── validator_errors.go
└── platform
    ├── PLATFORM_LEVEL.md
    ├── database
    │   ├── open_db_connection.go
    │   └── postgres.go
    └── migrations
        ├── 000001_create_init_tables.down.sql
        └── 000001_create_init_tables.up.sql
```

经典的三层模型，请求从 app/controllers/user_controller.go 开始，途经 queries 目录、models 目录。