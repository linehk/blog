---
title: "在 Ubuntu 上设置 Redshift 减少蓝光"
pubDate: 2018-02-02T05:39:56+08:00
lastmod: 2018-02-02T05:39:56+08:00
keywords: [Ubuntu 减少蓝光, Ubuntu 保护眼睛, 设置 Redshift]
description: "介绍了如何在 Ubuntu 16.04 LTS 系统上安装并设置 Redshift 来达到减少蓝光、保护眼睛的目的。"
categories: [Ubuntu]

---

Redshift 这个软件可以根据经纬度信息自动判断当前所在位置，然后在白天和夜晚使用不同的色温来减少蓝光保护眼睛。

在 Ubuntu 上，Ubuntu 17.10 版本已经有了类似的功能，但 Ubuntu 16.04 LTS 版及旧版本还未集成。

![Redshift Logo](/images/set-redshift-to-reduce-blue-light-on-ubuntu/redshift-logo.webp "Redshift Logo")

## 安装

这个软件在官方源就有，直接下载安装。

```shell
sudo apt-get install gtk-redshift redshift python-appindicator
```

安装完成之后，输入 `redshift-gtk` 或在 Unity 里面搜索 `redshift` 打开。

打开后会在右上角出现图标，右键选择 `Autostart`，也就是自动启动。

## 设置

### 获取经纬度信息

打开 [百度地图拾取坐标系统](https://api.map.baidu.com/lbsapi/getpoint/)，选择自己所在的地区得到经纬度信息。

![百度地图拾取坐标系统示例](/images/set-redshift-to-reduce-blue-light-on-ubuntu/baidu-map.webp "百度地图拾取坐标系统示例")

### 修改配置文件

在主目录下新建一个文件并编辑 `.config/redshift.conf`。

粘贴下面内容。

```plaintext
; Global settings for redshift
[redshift]
; Set the day and night screen temperatures
temp-day=5500
temp-night=4500

; Enable/Disable a smooth transition between day and night
; 0 will cause a direct change from day to night screen temperature.
; 1 will gradually increase or decrease the screen temperature.
transition=1

; Set the screen brightness. Default is 1.0.
;brightness=0.9
; It is also possible to use different settings for day and night
; since version 1.8.
;brightness-day=0.7
;brightness-night=0.4
; Set the screen gamma (for all colors, or each color channel
; individually)
gamma=0.8
;gamma=0.8:0.7:0.8
; This can also be set individually for day and night since
; version 1.10.
;gamma-day=0.8:0.7:0.8
;gamma-night=0.6

; Set the location-provider: 'geoclue', 'geoclue2', 'manual'
; type 'redshift -l list' to see possible values.
; The location provider settings are in a different section.
location-provider=manual

; Set the adjustment-method: 'randr', 'vidmode'
; type 'redshift -m list' to see all possible values.
; 'randr' is the preferred method, 'vidmode' is an older API.
; but works in some cases when 'randr' does not.
; The adjustment method settings are in a different section.
adjustment-method=randr

; Configuration of the location-provider:
; type 'redshift -l PROVIDER:help' to see the settings.
; ex: 'redshift -l manual:help'
; Keep in mind that longitudes west of Greenwich (e.g. the Americas)
; are negative numbers.
[manual]
lat=22.65
lon=110.17

; Configuration of the adjustment-method
; type 'redshift -m METHOD:help' to see the settings.
; ex: 'redshift -m randr:help'
; In this example, randr is configured to adjust screen 1.
; Note that the numbering starts from 0, so this is actually the
; second screen. If this option is not specified, Redshift will try
; to adjust _all_ screens.
; [randr]
; screen=1
```

其中比较重要的参数有：

1. `temp-day` `temp-night` 这两个参数分别是白天色温和晚上色温。可以自己慢慢找到适合自己的大小。
2. `lat` `lon` 这两个参数就是经纬度信息，把刚才提取到的填下去。

## 修改参数后没有变化的解决办法

分别执行 `redshift-gtk -c .config/redshift.conf` 和 `redshift -c .config/redshift.conf` 这两个命令来指定配置文件。
在右上角的图标右键后，可以点击 `Info` 查看当前色温及经纬度信息。