---
title: "使用 Siege 和 Shell 脚本进行 HTTP 接口性能测试"
pubDate: 2021-07-16T23:52:45+08:00
lastmod: 2021-07-16T23:52:45+08:00
keywords: []
description: ""
categories: [Misc]

---

因为公司业务对性能的需求，所以需要对某些接口进行性能测试，来决定是否需要增加机器配置或重构。

因为运维人员担心安全方面的影响，所以不能直接运行可执行文件，只能使用以前的 Siege 和 Shell 脚本。

![Siege Logo](/images/http-interface-performance-test-with-siege-and-the-shell-script/siege-logo.webp "Siege Logo")

## 安装 Siege

```shell
wget http://download.joedog.org/siege/siege-4.0.4.tar.gz \
&& tar zxvf siege-4.0.4.tar.gz \
&& cd siege-4.0.4 \
&& ./configure \
&& make  \
&& make install \
&& siege -h
```

## 设定指标

* 并发量：系统同时处理的请求数量；
* 总访问次数：并发量*重复次数；
* 响应时间区间：`0 ~ 1.0、1.0 ~ 1.5、1.5 ~ 2.0、2.0 ~ 3.0、3.0 ~ 以上`；
* 响应码：20X、30X、40X、50X。

以上是脚本中需要的基本指标，其它的可以通过日志来计算。

或者用 Siege 的 -f 参数来导出测试报告。

## 修改 Siege 配置

查看配置文件地址：`siege -C | grep resource`。

Siege 4.0.4 的配置文件在 `~/.siege/siege.conf`。

但是 limit 默认是 255，不符合需求，需要手动改到 1000。通过 `siege -C | grep "thread limit"` 查看是否修改成功。

## 修改 Nginx 配置

Nginx 机器出现错误：`nginx:accept() failed (24: Too many open files)`。

文件描述符不够，需要修改 `/usr/local/nginx/conf/nginx.conf` 中的 `worker_rlimit_nofile` 为 `65535`。

## 具体的 Shell 脚本

```shell
#!/bin/bash

# 帮助函数
help() {
	echo "Usage: $0 -c num -r num URL "
	echo "       $0 -c 300 -r 3 \"http://www.baidu.com\""
	echo "Options:"
	echo '  -c      数量'
	echo '  -r      重复次数'
	exit 0
}

# 构造命令行
execute() {
	$cmd -b -c $cur -r $rep $url 1>$output
}

# 计算结果
do_result() {
	total=$(($cur * $rep))

	sum=$(cat $output | grep HTTP | awk '
        ($3>0 && $3<=1) {s[1]++};
        ($3>1 && $3<=1.5) {s[2]++};
        ($3>1.5 && $3<=2) {s[3]++};
        ($3>2 && $3<=3) {s[4]++};
        ($3>3) {s[9]++};
        ($2 ~ /^20./) {s[5]++};
        ($2 ~ /^30./) {s[6]++};
        ($2 ~ /^40./) {s[7]++};
        ($2 ~ /^50./) {s[8]++};
        END {printf "%d,%d,%d,%d,%d,%d,%d,%d,%d",s[1],s[2],s[3],s[4],s[5],s[6],s[7],s[8],s[9]}
        ')

	sum1=$(echo $sum | awk -F',' '{print $1}')
	sum2=$(echo $sum | awk -F',' '{print $2}')
	sum3=$(echo $sum | awk -F',' '{print $3}')
	sum4=$(echo $sum | awk -F',' '{print $4}')
	sum5=$(echo $sum | awk -F',' '{print $5}')
	sum6=$(echo $sum | awk -F',' '{print $6}')
	sum7=$(echo $sum | awk -F',' '{print $7}')
	sum8=$(echo $sum | awk -F',' '{print $8}')
	sum9=$(echo $sum | awk -F',' '{print $9}')

	rto1=$(awk 'BEGIN {printf "%2.2f%%","'$sum1'"/"'$total'"*100}')
	rto2=$(awk 'BEGIN {printf "%2.2f%%","'$sum2'"/"'$total'"*100}')
	rto3=$(awk 'BEGIN {printf "%2.2f%%","'$sum3'"/"'$total'"*100}')
	rto4=$(awk 'BEGIN {printf "%2.2f%%","'$sum4'"/"'$total'"*100}')
	rto9=$(awk 'BEGIN {printf "%2.2f%%","'$sum9'"/"'$total'"*100}')
	rto5=$(awk 'BEGIN {printf "%2.2f%%","'$sum5'"/"'$total'"*100}')
	rto6=$(awk 'BEGIN {printf "%2.2f%%","'$sum6'"/"'$total'"*100}')
	rto7=$(awk 'BEGIN {printf "%2.2f%%","'$sum7'"/"'$total'"*100}')
	rto8=$(awk 'BEGIN {printf "%2.2f%%","'$sum8'"/"'$total'"*100}')
}

# 打印结果
main() {
	printf "\n"
	printf "%-30s%-100s\n" "URL:" $url
	printf "%-33s%-20s\n" "并发量:" $cur
	printf "%-34s%-20s\n" "总访问次数:" $(($cur * $rep))

	printf "\n"
	printf "%-30s\n" "Response Time(s):"
	printf "%-30s%-20s\n" "0 ~ 1.0:" $rto1
	printf "%-30s%-20s\n" "1.0 ~ 1.5:" $rto2
	printf "%-30s%-20s\n" "1.5 ~ 2.0:" $rto3
	printf "%-30s%-20s\n" "2.0 ~ 3.0:" $rto4
	printf "%-32s%-20s\n" "3.0 ~ 以上:" $rto9

	printf "\n"
	printf "Response Code:\n" "Response Code"
	printf "%-30s%-20s\n" "20X" $rto5
	printf "%-30s%-20s\n" "30X" $rto6
	printf "%-30s%-20s\n" "40X" $rto7
	printf "%-30s%-20s\n" "50X" $rto8
}

# $# 表示传入的参数个数
args=$#
if [ $args -lt 5 ]; then
	help
else
	url=${!args}
fi

# 解析 -c 和 -r 参数
while getopts "c:r:" opt; do
	case $opt in
	c)
		cur=$OPTARG;;
	r)
		rep=$OPTARG;;
	esac
done

output="/tmp/bench.tmp"

# 寻找 Siege 安装地址，没找到就安装
cmd=$(which siege)
if [ $? -ne 0 ]; then
	echo ' Not found 'siege' command,it will be installed.'
	echo ' Waiting...'

	yum -y install siege >/dev/null 2>&1
	echo 'Running...'
else
	echo 'Running...'
fi

# 主流程
if execute; then
	do_result && echo 'Completed!'
	main
else
	echo 'Siege run-time error.'
fi

exit 0
```

使用方法和说明请看注释。