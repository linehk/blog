---
title: "【习题解答】计算机科学导论"
pubDate: 2022-05-02T15:23:08+08:00
lastmod: 2022-05-02T15:23:08+08:00
keywords: []
description: ""
categories: [Solution]

---

<!--more-->

## 第 1 章 绪论

复习题：

1. 一种通用计算设备，所有的计算都可以执行。由数据处理器和程序组成。
2. 和图灵模型类似，区别在于，要求程序跟数据一样存储在存储器中。
3. 用来告诉计算机对数据进行处理的指令集合。
4. 用来告诉计算机对数据进行处理的指令集合。
5. 存储器、算术逻辑单元、控制单元、输入/输出。
6. 用来存储的区域，在计算机的处理过程中存储器用来存储数据和程序。
7. 用来进行计算和逻辑运算的地方。
8. 对存储器、算数逻辑单元、输入/输出等子系统进行控制操作的单元。
9. 输入子系统负责从计算机外部接收输入数据和程序；输出子系统负责将计算机的处理结果输出到计算机外部。
10. 
    * 第一代计算机：以商用计算机的出现为主要特征；
    * 第二代计算机：使用晶体管代替真空管；
    * 第三代计算机：集成电路（晶体管、导线以及其它部件做在一块单芯片上）的发明更加减少了计算机的成本和大小；
    * 第四代计算机：出现了微型计算机；
    * 第五代计算机：见证了掌上计算机和台式计算机和诞生、第二代存储媒体（CD-ROM、DVD 等）的改进、多媒体的应用以及虚拟现实。

练习题：

1. 计算机需要人为地定义输入数据和程序，才能产生输出数据。
2. 需要更多的输入数据和更复杂的程序。
3. 不符合。没有程序的概念。
4. 不符合。没有程序的概念。
5. 符合。有程序的概念。
6. 不符合。程序没有存储到存储器里面。
7. 不符合。程序没有存储到存储器里面。
8. 第一代计算机。

## 第 2 章 数字系统

复习题：

1. 四进制系统，它是位置化数字系统。底 b = 4 并且用 4 个符号来表示一个数。符号集是 S = {0, 1, 2, 3}。数字写为：$\pm (S_{k - 1} \cdots S_2 S_1 S_0 . S_{-1} S_{-2} \cdots S_{-l})_{4}$。
2. 在位置化数字系统中，数字中符号所占据的位置决定了其表示的值。在非位置化数字系统中，位置与值无关。
3. 底或基数，即一个符号集中符号的数量。相同。
4. 逢十进一。decimal 来源于词根 decem。底 b = 10。
5. 逢二进一。binary 来源于词根 bini。底 b = 2。
6. 逢八进一。octal 来源于词根 octo。底 b = 8。
7. 逢十六进一。hexadecimal 来源于词根 hex 和 decem。底 b = 16。
8. 在这两个底之间存在一种关系：二进制中的 4 位恰好是十六进制中的 1 位。
9. 4 位。
10. 3 位。

练习题：

1. 13；88；30.25；63.875。
2. 2738；291；2747；862.879。
3. 159；1497；399.875；17.14。
4. 100 1101 0010；101 1000；111 1100.0000 01；1110.1000 1。
5. 2204；143；13.315；110.631。
6. 237；583；C.215；10.8。
7. 14C；109；B.E；2AE。
8. 2432；2341；273.14；5274.15。
9. 15；130；36.2；77.7。
10. D；58；1E.4；3F.E。
11. 111 1001；100 1110；1111 1111；1101 0110。
12. 11.101；1100.0000 111；100.0011 01；1100.101。
13. $2^6 - 1$；$10^6 - 1$；$16^6 - 1$；$8^6 - 1$。
14. 17；5；6。
15. 2；3；4。
16. 1/8+1/16；1/2+1/8+1/64；1/4+1/8+1/32；1/4+1/8。
17. 111.0011；1100.1010 01；1011.0110 1；0.011。
18. $10^{10} - 1$；$2^{12} - 1$；$8^8 - 1$；$16^7 - 1$。
19. 3；5；2；3。
20. 14；8；13；4。
21. 300,556,814；238,611,000；1,846,425,678；406,326,539。
22. 00010001 11101010 00100010 00001110；00001110 00111000 11101010 00111000；01101110 00001110 00111000 01001110；00011000 00111000 00001101 00001011。
23. 15；27；48；1157。
24. XVII；XXXVIII；LXXXII；CMXCIX。
25. abc 都是错的。
26. (12)；(6)(13)；(1)(2)(12)；(3)(2)(16)。括号表示单独一个数字。
27. a. (38)(11)；(6)(46)；(59)(42)；b. 无法表示整数。用空格或占位符表示一个没有价值的地方，但仅在数字中间位置。

## 第 3 章 数据存储

复习题：

1. 数字、文本、音频、图像、视频。
2. 位模式的长度表示了可表示符号数量的多少，即可能性。
3. 整个图像可以分为多个像素，而每个像素表示一种颜色，而一种颜色可以有多个不同的位来表示。
4. 矢量图重新调整图像大小不会失去信息；如果存储太精妙的、小的信息的话，会需要过多空间。
5. 采样、量化、编码。
6. 无符号：全部编码都用来表示 0 和正整数；符号加绝对值：保留一位来标识符号；二进制补码格式：保留一位来标识符号，但构造成适合处理加负数的形式。
7. 无符号：不能表示负整数；符号加绝对值：保留一位来标识符号；二进制补码格式：保留一位来标识符号，但构造成适合加负数的形式。
8. 无符号：全 0；符号加绝对值：有正 0 和负 0；二进制补码格式：全 0。
9. 标识符号。
10. a. 提高信息密度来使用和存储；b. 小数点右边的位；c. 符号、指数和尾数。

练习题：

1. $2^5 = 32$。
2. $10^2 = 100$ 种；$9^2 = 81$ 种。
3. $10^2 * 26^3 = 17,676$；$9^2 * 26^3 = 17,657$。
4. $\log_2 8 = 3$。
5. $\log_2 7 \approx 3$。
6. 10 位；$2^10 = 1024$；需要，因为 900+300=1200，大于 1024。
7. $2^4 - 10 = 6$。
8. $8000 * 256 = 2,048,000$，$\log_2 2,048,000 \approx 21$。
9. 0001 0111；0111 1001；0010 0010；0101 0110。不足填充 0，溢出丢掉左边。
10. 0000 0000 0010 1001；0000 0001 1001 1011；0000 0100 1101 0010；0000 0001 0101 0110。
11. 1111 0100；0110 1111；0111 0000；1000 1110。
12. 0000 0000 0110 0110；0111 1111 0100 1101；1111 1100 0001 0110；1111 0010 0110 1000。
13. 107；148；6；80。
14. 119；-4；116；-50。
15. 做一次补码运算。
16. 1000 1001；0000 0100；1000 1100；0011 0010。没问题，确实会得到原数。
17. $2^0 * 1.1000 1$；$2^5 * 1.1111 11$；$2^0 * 1.0111 0011$；$2^0 * 1.0110 1000 0011 0011 000$。
18. 1111 1111 1000 1000；0100 0001 0111 1110；0111 1011 0111 0011；1111 1010 0110 1000。
19. 后面补 0 直到 64 位。1111 1111 1111 0001；0100 0000 0010 1111 11；0111 1111 0110 1110 011；1111 1111 0100 1101。
20. 0100 0000 1110 011；1100 0001 0100 1010 01；0100 0001 0011 0110 1；1111 1101。
21. 119；-124；116；-78。
22. 0011 0101；1110 1011；1000 0101；0100 1101 0（最左边位溢出）。
23. 0011 0101；1001 0100；1111 1010；1001 1010（溢出）。先补充够 8 位，再反码。0 的表示：10, 11, 00, 01 -> -1, -0, +0, +1。
24. 119；-3；116；49。最左边位为 1 时，表示负数，先取反。
25. 1000 1000；0000 0011；1000 1011；0011 0001。没问题，确实会得到原数。
26. 1000 1001；0000 0100；1000 1100；0011 0010。
27. +499 到 +499；最左边位为 5-9 时，表示负数，0-4 时，表示正数；有；+0 用最小数表示，即全 0，-0 用最大数表示，即全 9。即：-499, -0, +0, +499 -> 500, 999, 000, 499。
28. 234；560；874；888。用 999 减去得到。
29. -500 到 +499；最左边位为 5-9 时，表示负数，0-4 时，表示正数；不会；-500, -1, 0, +499 -> 500, 999, 000, 499。
30. 234；560；875；889。
31. $-(16^n / 2 - 1)$ 到 $+(16^n / 2 - 1)$，即 -4095 到 +4095；正数不变，负数每位用 15 减去；会；+0 = 全 0，-0 = 全 15。
32. B14；FE1；FE5；E1D。
33. $-(16^n / 2)$ 到 $+(16^n / 2 - 1)$，即 -4096 到 +4095；反码后加 1；不会。
34. B14；FE1；FE6；E1E。

## 第 4 章 数据运算

复习题：

1. 算术运算涉及加减乘除；逻辑运算涉及与、或、非、异或。
2. 超出的丢弃。
3. 没理解题意，但搜出来的答案为：不可以，因为在 N 位分配单位中，最左边的数用来表示正负，当 N 等于 1 时不能表示任何数。其他答案：可以，这种情况下数据类型通常表示逻辑值。
4. 超出位的数量。
5. 增加较小的尾数，移位相应的尾数，直到两个数具有相同的指数。
6. 一元运算只有一个操作数，二元运算有两个。
7. 与、或、异或。
8. 真值表定义了每一种输入的输出值。
9. 取反。
10. 都 1 为 1，其它为 0。
11. 都 0 为 0，其它为 1。
12. 相同为 0，不同为 1。
13. 如果一个输入为 0，则不用检查对应位，就知道结果也是 0。
14. 如果一个输入为 1，则不用检查对应位，就知道结果也是 1。
15. 如果一个输入为 1，则不用检查对应位，就知道结果与另一个输入相反。
16. 置位（设置为 1）：OR；掩码设置为 1。
17. 复位（设置为 0）：AND；掩码设置为 0。
18. 反转：XOR；掩码设置为 1。
19. 逻辑移位不操作符号，算术移位根据原来的符号，来设置移位后的数的符号。

练习题：

1. 十六进制表示：66；00；FF；FE。用 16 进制的最大位减去。
2. 十六进制表示：99；00；99；FF。
3. 十六进制表示：99；99；FF；FF。
4. 十六进制表示：66；FF；33；99。
5. AND；0000 1111。
6. OR；0000 1111。
7. XOR；1100 0111。
8. AND；0001 1100。
9. 右移 $\log_2 4 = 2$ 位。
10. 左移 $\log_2 8 = 3$ 位。
11. 从高位算起，假设为 0001 1000。1. 右移 3 位后，和 0000 0001 做 AND 运算；2. 再右移 1 位后，和 0000 0001 做 AND 运算。
12. 42；-4；4；-42。记得填充 0。
13. 1184；-862；862；-1184。
14. a、c、d 都会溢出。
15. 能。超出 $-2^7$ 到 $+2^7 - 1$ 的，即 -128, 127 的为溢出。
16. 十六进制表示：F0AE；E0D6；7FEE；20AE。结果相同。
17. 42；-4；4；-42。转换成补码时，不涉及符号。
18. 57.875；438.375；32.75；-467.8748。在二进制中对齐尾数。
19. b，如果能够存储正整数，那这个数肯定没溢出，再减小它的值就更不会溢出了，因为负整数本身也没溢出。
20. 取决于用反码还是补码存储，可能可以取到相反数。
21. 取决于用反码还是补码存储，可能可以取到相反数。

## 第 5 章 计算机组成

复习题：

1. CPU、主存和 IO。
2. 算术逻辑单元、控制单元和寄存器。
3. 算术、移位和逻辑运算。
4. 控制 CPU 其它部分的操作。
5. 存储数据。
6. RAM：易失性；SRAM：速度快，昂贵；DRAM：速度慢，便宜；ROM：非易失性；PROM：可编程、只读；EPROM：可擦除、可编程、只读；EEPROM：电、可擦除、可编程、只读。
7. 提高运算的速度。
8. 控制器、读写头、磁盘。
9. 磁盘：由一张张磁片堆叠而成，每张磁片都被划分成磁道，每个磁道又分成扇区；磁带：在宽的一边分为 9 个磁道，又在长的一边把每个磁道划分为能存储 1 位信息。垂直来看，9 个点用来存储 8 位信息，另一位用来错误检测。
10. CD-R：写一次，读多次；CD-RW：可重写；DVD：提高容量。
11. SCSI：并行、需要终结器；火线：串行、无需终结器；USB：串行、交换、扩展性强。
12. 独立寻址：到 IO 设备读写的指令，不同于到内存读写的指令；存储器映射寻址：把 IO 设备控制器中的每个寄存器看做是内存中的一个字，所以指令相同。
13. 程序控制：CPU 等待 IO 设备；中断控制：CPU 告知 IO 设备要传输，IO 设备准备好后，中断 CPU；DMA：用于在高速 IO 设备之间传输数据，而无需 CPU。
14. CISC：使用复杂指令集；RISC：使用简单指令集来模拟复杂指令。
15. 控制单元同时执行两个或三个阶段。
16. 拥有多个控制单元、多个算术逻辑单元和多个内存单元同时处理。

练习题：

1. $64 MB = 2^{26}$，$\log_2 4 = 2$，$2^{26} - 2^2 = 2^{24}$，24 位。因为是对每个字寻址，所以字长越小，地址越多，需要的表示位数就越多。
2. $24 * 80 * 1 = 1,920$。
3. 设每个字有 16 位。分别为指令、内存单元地址、寄存器，指令有 16 种，即 $\log_2 16 = 4$ 位，内存占 8 位，寄存器占 4 位，共 16 位。
4. 4 位。
5. 16 位。
6. $\log_2 1024 = 10$ 位。
7. 16 位。
8. 10 位。
9. $\log_2 16 = 4$。
10. 视指令有多少而定。
11. $10 * 1000 / 4 = 2500$ 个。
12. 

```asm
LOAD R0, M_FE
LOAD R1, M_FE
LOAD R2, M_FE
ADDI R3, R0, R1
ADDI R4, R2, R3
STORE M_FF, R4
HALT
```

13. 

```asm
LOAD R0, M_FE
INC R0
INC R0
INC R0
STORE M_FF, R0
HALT
```

14. 

```asm
LOAD R0, M_FE
DEC R0
DEC R0
STORE M_FF, R0
HALT
```

15.

```asm
M_40: LOAD R0, M_FE
M_41: LOAD R1, M_FE
// R1 为全 0
ADDI R3, R1, R1
DEC R0
JUMP R1, M_41
STORE M_FF, R3
HALT
```

16. 

```asm
M_40: LOAD R0, M_FE
M_41: LOAD R1, M_FE
M_42: JUMP R2, M_45
M_43: INC R1
M_44: INC R1
M_45: DEC R1
STORE M_FF, R1
HALT
```

## 第 6 章 计算机网络和因特网

复习题：

1. 保证每一个协议都可以进行两个对立且方向相反的工作。
2. 分段。
3. 消息；数据报；帧。
4. b。
5. c。
6. b。
7. 名称（HTTP）；逻辑地址（IP）；链路层地址（MAC）。
8. FTP 分为客户端和服务器，可能是服务器没启动。
9. 因为没有提供服务。
10. UDP。
11. 分层原则；有利于替换。
12. 网络层：主机到主机；数据链路层：节点到节点。
13. 数字和模拟信号之间的互相转换；没看到。
14. 蓝牙是一个临时网络，规模较小。
15. 周期 = 1/频率。
16. 频率。
17. 是当我们没有专用通道时的唯一选择。
18. 物理层。
19. 导向介质；非导向介质。
20. 双绞线、同轴电缆、光纤电缆。

练习题：

1. 发送、接收。
2. 加密、解密。
3. $5 * (1 + 20\%)^{10} = 30.96$ 亿台。
4. 5 * 10 + 100 = 150，100 / 150 = 0.67，该系统的效率只有原来的百分之 67。
5. abc。
6. abc。
7. 行李检查/认领；登机/出机；起飞/降落。
8. 物理层、数据链路层。
9. 位数越多，能表示的对象也越多。
10. 0110 1110 0000 1011 0000 0101 0101 1000；0000 1100 0100 1010 0001 0000 0001 0010；1100 1001 0001 1000 0010 1100 0010 0000。
11. 94.88.117.21；137.142.208.49；87.132.55.15。
12. 5A115518AA0F。
13. 10 / 1000 = 0.01s；8 / 1000 = 0.008s；100000 * 8 / 1000 = 800s。

## 第 7 章 操作系统

复习题：

1. 应用程序使用操作系统提供的接口来操作计算机硬件。
2. 命令解释程序、存储管理、进程管理、设备管理、文件管理。
3. 单道程序：整个内存只装进一个程序；多道程序：内存装进多个程序，CPU 轮流服务。
4. 分区调度下，程序在内存中不必是连续地，也可以提前载入。
5. 不需要全部载入内存，也可以运行，更加灵活。
6. 每个作业都是程序，而程序未必是作业；每个进程都是作业，而作业未必是进程。进程是运行中的程序。
7. 磁盘；磁盘或内存；内存。
8. 作业调度器：从作业中创建进程和终止进程；进程调度器：将进程从一个状态转入另一个状态。
9. 使得进程管理器可以用多种策略从队列中选择下一个作业或进程。
10. 死锁：没有对资源进行限制；饿死：对资源有太多限制。

练习题：

1. 64 - 4 = 60 MB。
2. 64 - 4 - 10 = 50 MB。
3. 70 / (10 + 70) = 87.5%。
4. 共 55 MB，60 - 55 = 5 MB，5 / 60 = 8%。
5. 共 40 MB，60 - 40 = 20 MB，20 / 60 = 33%。
6. 4；3；7；1；4 MB；4 / 60 = 6%。
7. 100 MB + 1 GB = 1100 MB，1100 / 10 = 110；100 / 10 = 10；100。
8. 运行；就绪；等待；等待；等待。
9. 是。
10. 不是，A 释放 File1 给 B，B 释放 File2 给 C。

## 第 8 章 算法

复习题：

1. 一组明确步骤的有序集合，它产生结果并在有限的时间内终止。
2. 顺序、判断、循环。
3. UML 是算法的图形化表示。
4. 伪代码是算法类似英语的表示。
5. 根据数据值的大小进行排序。
6. 选择、冒泡、插入。
7. 在一组对象中找到目标位置的过程。
8. 顺序查找、二分查找。
9. 迭代：算法的定义不涉及算法本身。
10. 递归：算法的定义涉及算法本身。

练习题：

1. 20, 22, 102, 183, 228, 229, 232, 313.
2. 2, 24, 192, 2112, 21120, 105600, 2112000.
3. 18, 18, 18, 20, 20, 32, 32.
4. 18, 3, 3, 3, 3, 1, 1.
5. 

```txt
2, 7, 23, 31, 40, 56, 78, 9, 14.
2, 7, 23, 31, 40, 56, 78, 9, 14.
2, 7, 9, 31, 40, 56, 78, 23, 14.
...
```

6. 

```txt
14, 7, 23, 31, 40, 56, 78, 2, 9.
...
```

7. 

```txt
...
2, 7, 9, 23, 31, 40, 56, 78.
```

8. 7, 8, 13, 23, 26, 44, 98, 57.
9. 7, 8, 14, 23, 26, 44, 57, 98.
10. 3, 7, 13, 26, 44, 23, 98, 57.
11. 

```txt
first、mid 和 last 的值分别是：
1, 4, 8.
5, 6, 8.
7, 7, 8.
```

12. 

```txt
first、mid 和 last 的值分别是：
1, 3, 6.
1, 1, 2.
2, 2, 2.
```

13. 4 != 11、21 != 11、36 != 11、14 != 11 等
14. 

```txt
first、mid 和 last 的值分别是：
1, 6, 12.
1, 3, 5.
4, 4, 5.
5, 5, 5.
```

15. 1, 2, 6, 24, 120, 720.
16. 1, 2, 6, 24, 120, 720.
17. 

```go
func gcd(x, y int) int {
	if y == 0 {
		return x
	}
	return gcd(y, x%y)
}

func Test_gcd(t *testing.T) {
	tests := []struct {
		x    int
		y    int
		want int
	}{
		{7, 41, 1},
		{12, 100, 4},
		{80, 4, 4},
		{17, 29, 1},
	}

	for i, tt := range tests {
		if got := gcd(tt.x, tt.y); got != tt.want {
			t.Errorf("%v. got %v, want %v", i, got, tt.want)
		}
	}
}
```

18. 1；4；4；1。
19. 

```go
func C(n, k int) int {
	if k == 0 || n == k {
		return 1
	}
	if n > k && k > 0 {
		return C(n-1, k) + C(n-1, k-1)
	}
	// 其它场景，如：n < 0 || k < 0 || n < k
	// 不符合组合的定义，直接返回 -1
	return -1
}

func Test_C(t *testing.T) {
	tests := []struct {
		n    int
		k    int
		want int
	}{
		{10, 3, 120},
		{5, 5, 1},
		{2, 7, -1},
		{4, 3, 4},
	}

	for i, tt := range tests {
		if got := C(tt.n, tt.k); got != tt.want {
			t.Errorf("%v. got %v, want %v", i, got, tt.want)
		}
	}
}
```

20. 120；1；错误，返回 -1；4
21. 

```go
func Fib(n int) int {
	if n == 0 {
		return 0
	}
	if n == 1 {
		return 1
	}
	return Fib(n-1) + Fib(n-2)
}

func Test_Fib(t *testing.T) {
	tests := []struct {
		n    int
		want int
	}{
		{2, 1},
		{3, 2},
		{4, 3},
		{5, 5},
	}

	for i, tt := range tests {
		if got := Fib(tt.n); got != tt.want {
			t.Errorf("%v. got %v, want %v", i, got, tt.want)
		}
	}
}
```

22. 1；2；3；5。
23. 因为该算法的 UML 图比较简单，所以略过。
24. 因为该算法的 UML 图比较简单，所以略过。
25. 因为该算法的 UML 图比较简单，所以略过。
26. 因为该算法的 UML 图比较简单，所以略过。
27. 因为该算法的 UML 图比较简单，所以略过。
28. 

```go
func sum(nums []int) int {
	result := 0
	for _, v := range nums {
		result += v
	}
	return result
}
```

29. 

```go
func product(nums []int) int {
	result := 1
	for _, v := range nums {
		result *= v
	}
	return result
}
```

30. 

```go
func SelectionSort(nums []int) {
	for i := 0; i < len(nums)-1; i++ {
		minIndex := i
		for j := i + 1; j < len(nums); j++ {
			if nums[j] < nums[minIndex] {
				minIndex = j
			}
		}
		nums[i], nums[minIndex] = nums[minIndex], nums[i]
	}
}
```

31. 

```go
func SelectionSortWithMin(nums []int) {
	for i := 0; i < len(nums)-1; i++ {
		minIndex := min(nums, i)
		nums[i], nums[minIndex] = nums[minIndex], nums[i]
	}
}

func min(nums []int, startIndex int) int {
	minIndex := startIndex
	for j := startIndex + 1; j < len(nums); j++ {
		if nums[j] < nums[minIndex] {
			minIndex = j
		}
	}
	return minIndex
}
```

32. 

```go
func BubbleSort(nums []int) {
	for i := 0; i < len(nums)-1; i++ {
		changed := false
		for j := 0; j < len(nums)-i-1; j++ {
			if nums[j] > nums[j+1] {
				nums[j], nums[j+1] = nums[j+1], nums[j]
				changed = true
			}
		}
		if !changed {
			break
		}
	}
}
```

33. 抽出上面的内循环即可。
34. 

```go
func InsertionSort(nums []int) {
	for i := 1; i < len(nums); i++ {
		for j := i; j > 0; j-- {
			if nums[j-1] > nums[j] {
				nums[j-1], nums[j] = nums[j], nums[j-1]
			}
		}
	}
}
```

35. 抽出上面的内循环即可。
36. 

```go
func SequenceSearch(elements []int, key int) int {
	for i, v := range elements {
		if key == v {
			return i
		}
	}
	return -1
}
```

37. 

```go
func BinarySearch(elements []int, key int) int {
	lo := 0
	hi := len(elements) - 1
	for lo <= hi {
		mid := lo + (hi-lo)>>1
		if key > elements[mid] {
			lo = mid + 1
		} else if key < elements[mid] {
			hi = mid - 1
		} else if key == elements[mid] {
			return mid
		}
	}
	return lo
}
```

38. 因为该算法的 UML 图比较简单，所以略过。
39. 

```go
func Pow(x float64, n int) float64 {
	if n < 0 {
		return 1.0 / pow(x, -n)
	}

	return pow(x, n)
}

func pow(x float64, n int) float64 {
	if x == 0 {
		return 0
	}

	if n == 0 {
		return 1
	}

	res := pow(x, n>>1)
	if n&1 == 0 {
		return res * res
	}

	return res * res * x
}
```

## 第 9 章 程序设计语言

复习题：

1. 汇编语言是机器语言的一种可读表示。
2. 高级语言和汇编语言一样，都需要转化为机器语言。
3. 机器语言。
4. 编译：编译器将整个源程序翻译成目标程序；解释：一行一行地解释源程序，并执行。
5. 词法分析、语法分析、语义分析、代码生成。
6. 过程式、面向对象、函数式、声明式。
7. 过程式：把程序看成是操纵被动对象的主动主体；面向对象：处理活动对象，而不是被动对象。
8. 方法是类的动作，对象是类的实体。
9. 程序被看成是一个数学函数。
10. 依据逻辑推理的原则响应查询。

练习题：

1. 

```c
int a, b, c;
```

2. 

```c
double a = 1.0, b = 1.0, c = 1.0;
```

3. 

```c
char a;
int b;
double c;
```

4. 因为常量不可改变，所以如果不在声明时赋值，之后就不能赋值了。
5. 2 次。
6. 无数次。
7. 8 次。
8. 5 次。
9. 

```c
int A = 3;
do {
  statement;
  A = A + 2;
} while(A < 8);
```

10. 

```c
int i = 4;
do {
  statement;
  i++;
} while(i < 20);
```

11. 

```c
int i = 5;
while (i < 20) {
  statement;
  i++;
}
```

12. 

```c
for (int A = 6; A < 10; A++) {
  statement;
}
```

13. 

```c
for (int A = 5; A < 8; A = A + 2) {
  statement;
}
```

14. 

```c
int i = 2;
while (i < 1) {
  statement;
  i++;
}
```

15. 

```c
int i = 4;
do {
  statement;
  i++;
} while(i > 100);
```

16. 

```c
for (int A = 5; A < 1; A = A + 2) {
  statement;
}
```

17. 

```c
int i = 2;
while (i < 1) {
  statement;
  i++;
}
```

18. 

```c
int i = 4;
do {
  statement;
  i++;
} while(i > 100);
```

19. 

```c
for (int A = 5; A < 1; A = A + 2) {
  statement;
}
```

20. 12；4；5。
21. Hello；"Hello"。
22. 

```c
switch (A) {
  case 4:
    statement1;
    break;
  case 6:
    statement2;
    break;
  case 8:
    statement3;
    break;
}
```

23. A、B 传值；S、P 传引用。
24. A、B 传值；S 传引用。
25. 传引用。
26. 传引用。
27. 传值。

## 第 10 章 软件工程

复习题：

1. 软件生命周期是软件工程中的基本概念，是一个重复阶段的周期。
2. 瀑布模型一次性设计和编写程序，增量模型一次分一些模块来设计和编写程序。
3. 分析、设计、实现和测试。
4. 输入规格说明文档，说明了要做什么。面向过程分析和面向对象分析。
5. 定义了系统如何完成在分析阶段所定义的。面向过程中，分解成过程；面向对象中，分解成类和方法。
6. 模块化是将大程序分解成能理解和容易处理的小程序。耦合和内聚。
7. 耦合描述模块间，内聚描述模块里面。
8. 编写代码；可操作性、可维护性和可迁移性。
9. 发现错误；白盒测试和黑盒测试。
10. 白盒测试基于知道软件的内部结构，黑盒测试反之。

练习题：

1. 方便修改。
2. 传值。
3. 传引用。
4. 画图，略过。
5. 画图，略过。
6. 画图，略过。
7. 画图，略过。
8. 画图，略过。
9. 画图，略过。
10. 画图，略过。
11. 画图，略过。
12. 画图，略过。
13. 画图，略过。
14. 画图，略过。
15. 画图，略过。
16. 画图，略过。
17. 画图，略过。
18. 相当于从 1000 里面取 3 项组合，为 166,167,000。
19. 三个数的最小、最大值。
20. 乘上一个系数 1000，再加上 1000。

## 第 11 章 数据结构

复习题：

1. 数组、记录和链表。
2. 数组可以被看成是记录数组的一种特例，其中每个元素是只带一个域的记录。
3. 数组在内存中是紧密相邻的，链表不是。
4. 数组元素可以通过索引来计算出地址。
5. 紧密相邻的。
6. 域是具有含义的最小命名记录。
7. 一个包含数据，另一个包含指针。
8. 指向另外节点的地址。
9. 头节点的后的第一个节点。
10. 指向空。

练习题：

1. 

```go
func equal(a, b []int) bool {
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}
```

2. 

```go
func reverse(nums []int) {
	for i, j := 0, len(nums)-1; i < j; i, j = i+1, j-1 {
		nums[i], nums[j] = nums[j], nums[i]
	}
}
```

3. 

```go
const R = 2
const C = 2

func printTwoDimensionalArray(array [R][C]int) {
	for i := 0; i < R; i++ {
		for j := 0; j < C; j++ {
			fmt.Println(array[i][j])
		}
	}
}
```

4. 

```go
func SequenceSearch(elements []int, key int) int {
	for i, v := range elements {
		if key == v {
			return i
		}
	}
	return -1
}
```

5. 

```go
func BinarySearch(elements []int, key int) int {
	lo := 0
	hi := len(elements) - 1
	for lo <= hi {
		mid := lo + (hi-lo)>>1
		if key > elements[mid] {
			lo = mid + 1
		} else if key < elements[mid] {
			hi = mid - 1
		} else if key == elements[mid] {
			return mid
		}
	}
	return lo
}
```

6. 

```go
func insert(elements []int, key int) {
	index := BinarySearch(elements, key)
	elements = append(elements[:index], append([]int{key}, elements[index:]...)...)
}
```

7. 

```go
func deleteKey(elements []int, key int) {
	index := BinarySearch(elements, key)
	elements = append(elements[:index], elements[index+1:]...)
}
```

8. 

```go
func productConst(arr []int, c int) {
	for i := range arr {
		arr[i] = c * arr[i]
	}
}
```

9. 

```go
type Fractional struct {
	Nume int
	Deno int
}

func (f Fractional) String() string {
	return fmt.Sprintf("%v/%v", f.Nume, f.Deno)
}

func NewFractional(Nume, Deno int) Fractional {
	return Fractional{Nume, Deno}
}

func (f *Fractional) broad(lcm int) {
	f.Nume = f.Nume * (lcm / f.Deno)
	f.Deno = lcm
}

func (f *Fractional) offset() {
	lcm := gcd(f.Nume, f.Deno)
	f.Nume /= lcm
	f.Deno /= lcm
}

func gcd(x, y int) int {
	if y == 0 {
		return x
	}
	return gcd(y, x%y)
}

func lcm(x, y int) int {
	return x * y / gcd(x, y)
}

func (f1 *Fractional) Add(f2 Fractional) {
	lcm := lcm(f1.Deno, f2.Deno)
	f1.broad(lcm)
	f2.broad(lcm)
	f1.Nume += f2.Nume
	f1.offset()
}
```

10. 

```go
func (f1 *Fractional) Sub(f2 Fractional) {
	lcm := lcm(f1.Deno, f2.Deno)
	f1.broad(lcm)
	f2.broad(lcm)
	f1.Nume -= f2.Nume
	f1.offset()
}
```

11. 

```go
func (f1 *Fractional) Mul(f2 Fractional) {
	f1.Deno *= f2.Deno
	f1.Nume *= f2.Nume
	f1.offset()
}
```

12. 

```go
func (f1 *Fractional) Div(f2 Fractional) {
	f1.Mul(NewFractional(f2.Deno, f2.Nume))
	f1.offset()
}
```

13. 画图省略，数据结构是这样的：

```go
type Data struct {
	flag  string
	name  string
	score int64
}

type Node struct {
	data *Data
	next *Node
}
```

14. 直接把头节点指向空。
15. 直接构造一个节点，然后让头节点指向新构造的节点。
16. 不断构造节点，然后不断把最后一个节点指向新构造的节点。
17. 遍历链表，然后计算。
18. 当前指针往后移一步。
19. 当前指针和前一位指针都往后移一步。

## 第 12 章 抽象数据类型

复习题：

1. 抽象数据类型就是对该数据类型有意义的操作封装在一起的数据类型。操作是已知的，数据结构是未知的。
2. 添加和删除只能在栈顶进行。键栈、入栈、出栈、空。
3. 只能在头部删除，尾部插入。建队列、入列、出列、空。
4. 插入和删除操作可以在任何地方进行的列表。建表、插入、删除、检索、遍历、空。
5. 树有一个父节点，多个子节点；二叉树只有两个子节点；二叉搜索树的节点是有序的。
6. 深度优先遍历还细分了前序、中序、后序三种遍历，广度优先没有。
7. 图是由一组顶点和一组边构成的一种抽象数据类型；有向图有方向。
8. 栈：函数栈；队列：消息队列。
9. 元素被随机存取或顺序存取的情况。
10. 赫夫曼编码；搜索。

练习题：

1. 

```go
func Test1(t *testing.T) {
	S2 := New()
	for !S2.Empty() {
		_, _ = S2.Pop()
	}
}
```

2. 

```go
func Test2(t *testing.T) {
	S1 := New()
	S2 := New()
	for !S1.Empty() {
		v, _ := S1.Pop()
		S2.Push(v)
	}
}
```

3. 

```go
func Test3(t *testing.T) {
	S1 := New()
	S2 := New()
	var elements []interface{}
	for !S1.Empty() {
		v, _ := S1.Pop()
		elements = append(elements, v)
	}

	for i := len(elements) - 1; i >= 0; i-- {
		S1.Push(elements[i])
		S2.Push(elements[i])
	}
}
```

4. 

```go
func Test4(t *testing.T) {
	S1 := New()
	S2 := New()
	var elements []interface{}
	for !S2.Empty() {
		v, _ := S2.Pop()
		elements = append(elements, v)
	}

	for i := len(elements) - 1; i >= 0; i-- {
		S1.Push(elements[i])
	}
}
```

5. 栈的内容为：5、6，x 为 2，y 为 3。
6. 

```go
func IsPalindrome(s []byte) bool {
	stack := New()
	for _, c := range s {
		stack.Push(c)
	}

	for i := len(s) - 1; i >= 0; i-- {
		v, _ := stack.Pop()
		c := v.(byte)
		if c != s[i] {
			return false
		}
	}
	return true
}
```

7. 

```go
func EqualStack(s1, s2 stack) bool {
	for !s1.Empty() && !s2.Empty() {
		v1, _ := s1.Pop()
		v2, _ := s2.Pop()
		if v1 != v2 {
			return false
		}
	}
	return true
}
```

8. 

```go
func Test8(t *testing.T) {
	Q := New()
	for !Q.Empty() {
		_, _ = Q.Dequeue()
	}
}
```

9. 

```go
func Test9(t *testing.T) {
	Q1 := New()
	Q2 := New()
	for !Q1.Empty() {
		v, _ := Q1.Dequeue()
		Q2.Enqueue(v)
	}
}
```

10. 

```go
func Test10(t *testing.T) {
	Q1 := New()
	Q2 := New()
	var elements []interface{}
	for !Q1.Empty() {
		v, _ := Q1.Dequeue()
		elements = append(elements, v)
	}

	for _, v := range elements {
		Q1.Enqueue(v)
		Q2.Enqueue(v)
	}
}
```

11. 

```go
func Test11(t *testing.T) {
	Q1 := New()
	Q2 := New()
	for !Q2.Empty() {
		v, _ := Q2.Dequeue()
		Q1.Enqueue(v)
	}
}
```

12. 

```go
func EqualQueue(q1, q2 *queue) bool {
	for !q1.Empty() && !q2.Empty() {
		v1, _ := q1.Dequeue()
		v2, _ := q2.Dequeue()
		if v1 != v2 {
			return false
		}
	}
	return true
}
```

13. G；I；D。
14. J(C(B(A), D(E, F)), I(E(G, H)))。
15. A(C(E(F)), B(D(H, G)))。
16. 不能，后序遍历中的 F 没有在中序遍历 D 的左边。不符合定义。
17. 

```go
type stack struct {
	cap      int
	top      int
	elements []interface{}
}

func (s stack) Cap() int {
	return s.cap
}

// New creates a stack by cap.
func New(cap int) *stack {
	s := new(stack)
	s.cap = cap
	s.top = -1
	s.elements = make([]interface{}, s.cap)
	return s
}

// Push inserts v in the stack.
func (s *stack) Push(v interface{}) error {
	if s.top+1 >= s.cap {
		return errors.New("stack is full")
	}

	s.top++
	s.elements[s.top] = v
	return nil
}

// Pop deletes the element from the stack and return it.
func (s *stack) Pop() (interface{}, error) {
	if s.top < 0 {
		return nil, errors.New("stack is empty")
	}

	v := s.elements[s.top]
	s.elements[s.top] = nil
	s.top--
	return v, nil
}

func (s *stack) Empty() bool {
	return len(s.elements) == 0
}
```

18. 

```go
type stack struct {
	top *node
}

type node struct {
	value interface{}
	next  *node
}

// New creates a stack.
func New() *stack {
	s := new(stack)
	return s
}

// Push inserts v in the stack.
func (s *stack) Push(v interface{}) {
	n := new(node)
	n.value = v
	n.next = nil

	// empty stack wouldn't execute this
	if s.top != nil {
		n.next = s.top
	}
	s.top = n
}

// Pop deletes the element from the stack and return it.
func (s *stack) Pop() (interface{}, error) {
	if s.top == nil {
		return nil, errors.New("stack is empty")
	}

	v := s.top.value
	s.top = s.top.next
	return v, nil
}

func (s *stack) Empty() bool {
	return s.top == nil
}
```

19. 

```go
type queue struct {
	cap      int
	len      int
	front    int
	rear     int
	elements []interface{}
}

func (q queue) Cap() int {
	return q.cap
}

func (q queue) Len() int {
	return q.len
}

// New creates a queue by cap.
func New(cap int) *queue {
	q := new(queue)
	q.cap = cap
	q.len = 0
	q.front = 0
	q.rear = 0
	q.elements = make([]interface{}, q.cap)
	return q
}

// Enqueue inserts v in the queue.
func (q *queue) Enqueue(v interface{}) error {
	if q.rear == q.cap && q.front == 0 {
		return errors.New("queue is full")
	}

	// rearrange array
	if q.rear == q.cap && q.front != 0 {
		n := q.rear - q.front
		for i := 0; i < n; i++ {
			q.elements[i] = q.elements[q.cap-n+i]
			q.elements[q.cap-n+i] = nil
		}
		q.front = 0
		q.rear = n
	}
	q.elements[q.rear] = v
	q.rear++
	q.len++
	return nil
}

// Dequeue deletes v in the queue and return it.
func (q *queue) Dequeue() (interface{}, error) {
	if q.front == q.rear {
		return nil, errors.New("queue is empty")
	}

	v := q.elements[q.front]
	q.elements[q.front] = nil
	q.front++
	q.len--
	return v, nil
}

func (q *queue) Empty() bool {
	return q.Len() == 0
}
```

20. 

```go
type node struct {
	value interface{}
	next  *node
}

type queue struct {
	len   int
	front *node
	rear  *node
}

func (q queue) Len() int {
	return q.len
}

// New creates a queue.
func New() *queue {
	q := new(queue)
	q.len = 0
	q.front = new(node)
	q.front.next = nil
	q.front.value = nil
	q.rear = q.front
	return q
}

// Enqueue inserts v in the queue.
func (q *queue) Enqueue(v interface{}) {
	q.rear.value = v

	n := new(node)
	n.value = nil
	n.next = nil

	q.rear.next = n
	q.rear = n
	q.len++
}

// Dequeue deletes v in the queue and return it.
func (q *queue) Dequeue() (interface{}, error) {
	if q.front == q.rear {
		return nil, errors.New("queue is empty")
	}

	v := q.front.value
	q.front.value = nil

	next := q.front.next
	q.front.next = nil
	q.front = next

	q.len--
	return v, nil
}

func (q *queue) Empty() bool {
	return q.Len() == 0
}
```

21. 

```go
func insert(elements []int, key int) {
	index := BinarySearch(elements, key)
	elements = append(elements[:index], append([]int{key}, elements[index:]...)...)
}

func deleteKey(elements []int, key int) {
	index := BinarySearch(elements, key)
	elements = append(elements[:index], elements[index+1:]...)
}
```

22. 

```go
type node struct {
	value interface{}
	next  *node
	list  *list
}

type list struct {
	head *node
}

// New creates a list.
func New() *list {
	l := new(list)
	l.head = new(node)
	l.head.value = nil
	l.head.next = nil
	l.head.list = l
	return l
}

// NewNode creates a node by v.
func NewNode(v interface{}) *node {
	n := new(node)
	n.value = v
	n.next = nil
	n.list = nil
	return n
}

// Value returns the node value.
func (n node) Value() interface{} {
	return n.value
}

// Next returns node the next node.
func (n node) Next() *node {
	return n.next
}

// List returns the list belong to node.
func (n node) List() *list {
	return n.list
}

// Head returns the head node belong to the list.
func (l list) Head() *node {
	return l.head
}

// Insert insert n after mark.
func (l *list) Insert(n *node) error {
	cur := l.head
	for cur.next != nil {
		prev := cur
		cur = cur.next
		if cur.value.(int) >= n.value.(int) {
			prev.next = n
			n.next = cur
		}

	}
	return nil
}

// Delete deletes n from list.
func (l *list) Delete(n *node) error {
	if n.list != l {
		return errors.New("node not in the list")
	}

	if n == l.head {
		return errors.New("can't delete head node")
	}

	pre := l.head
	for pre.next != n {
		pre = pre.next
	}

	pre.next = n.next

	n.value = nil
	n.next = nil
	n.list = nil
	n = nil

	return nil
}

// Show returns list friendly express.
func (l list) Show() string {
	format := ""
	cur := l.head
	for cur.next != nil {
		cur = cur.next
		format += fmt.Sprintf("%v", cur.value)
		if cur.next != nil {
			format += fmt.Sprint("->")
		}
	}
	return format
}
```

## 第 13 章 文件结构

复习题：

1. 顺序、随机。
2. 当文件被更新时，主文件将从脱机存储器中检索返回，成为旧主文件。
3. 包含将要对主文件作的改变。
4. 索引和散列。
5. 索引直接对应文件。
6. 键就是地址。
7. 键被文件的大小除，得到的余数加上 1 就是地址。
8. 选择的数字是从键中被析取出来的，用作地址。
9. 开放寻址、链表、桶散列。
10. 文本文件是字符的文件，二进制文件是使用计算机内部格式存储的数据集合。

练习题：

1. 未理解题意。
2. 先对数据文件创建地址，由上到下，由左到右。然后排序键值，写入对应的地址。

```txt
077654, 004
093245, 003
114237, 001
123453, 000
156732, 002
256743, 005
423458, 006
```

3. 05；14；02；07。
4. 16；62；95；40。
5. 36；69；62；47。
6. 41+22+43=106；21+57+11=89；31+49+41=121；51+32+31=114。
7. 3；2；3+1=4；405。
8. 冲突键用链表记录。
9. 画图，省略。
10. 未理解哨兵在这个算法中的作用。
11. 画图，省略。
12. 未理解基于事务文件更新顺序文件的过程。
13. 画图，省略。
14. 

```go
func merge(a, b []int) []int {
	var result []int
	i, j := 0, 0
	for i < len(a) && j < len(b) {
		if a[i] < b[j] {
			result = append(result, a[i])
			i++
		} else {
			result = append(result, b[j])
			j++
		}
	}
	result = append(result, a[i:]...)
	result = append(result, b[j:]...)
	return result
}
```

15. 画图，省略。
16. 未理解基于事务文件更新顺序文件的过程。

## 第 14 章 数据库

复习题：

1. 硬件、软件、数据、用户、规程。
2. 层次模型、网状模型和关系模型。关系模型。
3. 关系就是一张二维表，用来组织数据。
4. 属性即关系中的列，元祖即关系中的行。
5. 插入、删除、更新、选择、投影。
6. 连接、并、交、差。
7. SQL 即结构化查询语言，XML 即可扩展标记语言。SQL、XML。

练习题：

1. 2, 16, 102。
2. 2, 16。
3. 

```txt
100
102
103
104
```

4. 24。
5. C1 = 37。
6. SELECT No, Unit FROM Courses;
7. SELECT ID, Name FROM Students;
8. SELECT Name FROM Professors;
9. SELECT Name FROM Depts;
10. SELECT Courses FROM Students WHERE ID = 2010;
11. SELECT Courses FROM Professors WHERE Name = "Blake";
12. SELECT * FROM Courses WHERE Unit = 3;
13. SELECT Name FROM Students WHERE Courses = "CIS015";
14. SELECT No FROM Depts WHERE Name = "CS";
15. 不符合，把多个值的铺平即可。
16. 画图，省略。
17. 画图，省略。
18. 画图，省略。
19. 传递依赖。
20. 在 3 NF基础上，消除主属性对候选码的部分函数依赖和传递函数依赖。

## 第 15 章 数据压缩

复习题：

1. 无损压缩和有损压缩。
2. 无损压缩：所有信息都可恢复；有损压缩：部分信息丢失。
3. 重复出现的符号，被重复数字和符号替换。
4. 构造字典，传输时字典索引。
5. 对于出现更为频繁的字符分配较短的编码，而对于出现较少的字符分配较长的编码。
6. 实际数据通过字典来取出真正的值。
7. LZ 编码更简单、解压速度更快。
8. JPEG、MPEG、MP3。
9. JPEG 对应图像，MPEG 对应视频。
10. MPEG 即有多个帧的 JPEG。
11. 将图像划分成块的目的是考虑到减少计算量。
12. 离散余弦变换改变了 64 个值以使相邻像素之间的关系得以保持，但同时又能够揭示冗余。
13. 量化过程用一个常量来除位数，然后舍弃小数部分。用于减少需要编码的位数。
14. 每个帧都是一副图像。
15. 空间压缩即使用 JPEG，时间压缩即舍去多余的帧。
16. I-帧：即内部编码帧，是一个独立帧；P-帧：即预帧，与前面的 I-帧或 P-帧有关联；B-帧：即双向帧，与前面和后面的 I-帧或 P-帧有关系。

练习题：

1. 10010, 00000, 00001, 11000, 01111, 00000。
2. 00000, 00000, 01000, 00001, 01101, 00000。
3. A：000；B：1000；C：001；D：01；E：11；F：101；G：1001。
4. A：000；B：001；C：010；D：011；E：1000；F：1001；G：1010；H：1011；I：110；J：111。
5. 是。没有某个编码是另一个编码的前缀。
6. 不是。A 是 C 的前缀。
7. 1000, 1010, 1010, 0011, 00。
8. ABBAAACCA。
9. 字典：B，A，AB，BB，BA，AC，AA。编码为 1-7，即：B，A，2B，1B，1A，2C，2A。
10. 未理解题意，直接编码。字典：A，AA，AB，B，C，CC，BB。编码为 1-7，即：A，1A，1B，B，C，5C，4B。
11. 23.25；19.8；18.6375；17.475。

## 第 16 章 安全

复习题：

1. a。
2. a。
3. b。
4. 密码术即秘密书写；隐写术即掩饰书写。
5. 是。
6. 是。
7. 是。隐写术。
8. 是。对称密钥。
9. 是。对称密钥。
10. 置换密码即移位密码。替换密码即用一个符号替代另一个符号，移位密码就是符号重新排序。
11. 是。单字母。
12. 单字母。
13. 每个字母 26 次。
14. 26；26；26。
15. c。
16. 因为需要通过某种方法在随机密钥上达成共识。
17. 性能。
18. 公钥用于加密；私钥用于解密。
19. e 表示指数，使用 1 就表示没有变化。
20. MAC 通过散列函数和密钥的组合来保证消息的完整性和消息验证。
21. 消息验证可能不会发生在实时系统中，而实体验证会；消息验证简单地验证一则消息，这个过程需对每则新的消息重复，实体验证可在整个会话期间内验证要求者。
22. b。
23. b。
24. b。

练习题：

1. a：威胁机密性的攻击；b：威胁完整性的攻击；c：威胁可用性的攻击。
2. lyyu。
3. nbcm cm uh yrylwcmy。
4. zm vcvixrnv。
5. 5533 1531152235443215。
6. 不对，暴力破解的次数没有变少。
7. 没问题。
8. a. 加密数组中的元素分别为：3, 1, 4, 5, 2；b：解密数组中的元素分别为：2, 5, 1, 3, 4；c：通过索引的对应的值，反向生成即可。
9. $10 * 12 = 120$，$e * d \bmod 120 = 1，e = 103$。
10. 密文为：10358 6651 1144 5632 1890 1144 等。
11. MAC 可能会被窃听，所以不能使用私钥。

## 第 17 章 计算理论

复习题：

1. incr：加 1；decr：减 1；while：循环。
2. 循环一个变量值的次数，然后调用 incr。
3. 图灵机能模拟简单语言中的三个基本语句。
4. 磁带：存储数据；读写头：读写数据；控制器：转换、显示状态。
5. 通过空白字符隔开。
6. 向左或右移动。
7. 状态转移图指导图灵机控制器如何控制状态。
8. 转移表是转移图的另一种表示。有相同信息。
9. 一个分配给任何程序的无符号数称为哥德尔数。反证法。
10. 多项式问题：$O(n^k)$ 范围内；非多项式问题：$O(10^n) 或 O(n!)$。

练习题：

1. 

```
Y := 0
while (X) {
	incr(Y)
}
```

2. 

```
SaveX := 0
SaveY := Y
while (X) {
	decr(X)
	incr(Y)
	incr(SaveX)
}
X = SaveX
```

3. 

```
TEMP := Y
Y := 0
SaveX := 0
while (X) {
	decr(X)
	Y := Y + TEMP
	incr(SaveX)
}
X = SaveX
```

4. 

```
TEMP := Y
Y := 1
SaveX := 0
while (X) {
	decr(X)
	Y := Y * TEMP
	incr(SaveX)
}
X = SaveX
```

5. 

```
while (X) {
	decr(Y)
}
```

6. 

```
Y := 1
while (X) {
	decr(X)
	decr(Y)
	A1
}

while (Y) {
	A2
}
```

7. 最终配置为：`b b 1 1 b`。
8. 读写头向右移动一位。
9. 读写头向右移动一位。
10. 画图，省略。
11. 未理解题意。
12. 未理解题意。
13. 未理解题意。
14. 画图，省略。
15. 画图，省略。
16. n + 1。
17. 用 while 循环来模拟。
18. 用 while 循环来模拟。
19. 用 while 循环来模拟。

## 第 18 章 人工智能

复习题：

1. 简单地比较人类的智能行为和计算机的智能行为。不能。
2. 智能体是一个能智能地感知环境、从环境中学习并与环境进行交互的系统。分为软件智能体和物理智能体。
3. LISP：操纵表的语言；PROLOG：一种能建立事实数据库和规则知识库的编程语言。
4. 如果打算用人工智能体来解决现实世界中的一些问题，那么它必须能表示知识。语义网、框架、谓语逻辑和基于规则的系统。
5. 谓词逻辑使用了命题逻辑。命题逻辑是由对世界进行逻辑推理的一组句子组成的一种语言。
6. 在语义网中，图用来表示知识；在框架中，数据结构用来表示相同的知识。
7. 基于规则的系统使用一组规则来表示知识，这些规则能用来从已知的事实中推导出新的事实。规则表示当指定条件满足时什么为真。
8. 专家系统使用知识表示语言来执行通常需要人类专家才能完成的任务。平凡系统则表示非专家。
9. 边缘探测、分段、查找深度、查找方向、对象识别、应用。
10. 语音识别、语法分析、语义分析和语用分析。
11. 使用神经元网络来模仿人脑的学习过程。
12. 感知器是一个类似于单个生物神经元的人工神经元。

练习题：

1. 画图，省略。
2. 画图，省略。
3. a. $\neg R$；b. $\neg S$；c. $\neg (R \wedge S)$；d. $R \wedge S$；e. $S \rightarrow \neg R$；f. $R \rightarrow \neg S$；g. $\neg (R \rightarrow S)$；h. $\neg (\neg R \rightarrow S)$；
4. 重复，省略。
5. 重复，省略。
6. 重复，省略。
7. 重复，省略。
8. 重复，省略。
9. 合法。
10. 不合法。
11. 合法。
12. 不合法。
13. 画图，省略。
14. 画图，省略。
15. 画图，省略。
16. 画图，省略。
17. 画图，省略。
18. 画图，省略。
19. 画图，省略。
20. 画图，省略。