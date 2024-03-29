---
title: "【读书笔记】数据结构与算法分析 - C 语言描述 - 第四部分 - 搜索"
pubDate: 2022-05-02T15:24:04+08:00
lastmod: 2022-05-02T15:24:04+08:00
keywords: [ ]
description: ""
categories: [ Note ]

---

## 第十二章 符号表和二叉搜索树

* 符号表：
    * 操作：
        * 插入：插入一个数据项
        * 搜索：搜索一个具有给定关键字的数据项（或若干数据项）
        * 删除：删除一个特定数据项
        * 选择：选出第 k 个最小数据项
        * 排序：按关键字顺序访问所有数据项
        * 连接：连接两个符号表
    * 有相同关键字时：
        * 不同关键字的数据项 + 对于每个关键字有一条链表用于指向相同关键字
        * 相同关键字不隐藏，在一次搜索中返回所有
        * 唯一标识每个数据项
    * 手指搜索（Finger search）：搜索可从以前结束的地方开始
    * 范围搜索：统计或访问落入某个区间的节点
    * 近邻搜索：查找距离某点最近的关键字（数据项）
    * 计数（Count）操作：
        * 懒方法：Count() 函数
        * 积极方法：局部变量
* 关键字索引搜索：
    * 适用于关键字的值是不同的小整数
    * 原理：对数组中的数据项排序，然后按关键字进行索引
    * 无任何数据项（只有关键字）时：可使用位表：把第 k 位看作表示 k 是否存在于表的关键字集中的标志
* 顺序搜索：
    * 实现：把数据项按照顺序连续地存放在数组中
    * 插入：等同于插入排序（移动位置）
    * 构造表：连续插入（平方）
    * 搜索：顺序查找，当遇到的关键字大于（小于）搜索关键字时，报告失败
        * 不存在关键字时使用数组尾部作为观察哨：
            * 避免对数组尾部终止条件的测试
            * 然后搜索只会成功返回，需要判断返回的元素是数据项还是观察哨
                * 真成功：返回数据项
                * 假成功：返回观察哨
    * 不要求有序：
        * 插入：插入末尾
        * 搜索：顺序查看
        * 删除：先搜索，然后移动最后一项到这个位置，数组大小减 1
    * 实现：有序数组、无序数组、有序表、无序表
* 二分搜索：把数据项分成两部分，确定搜索关键字在某部分，然后集中处理这个部分，而舍弃另一部分
    * 标准分治法
    * 数组是有序的
    * 尾递归：递归函数是在递归调用时结束的。尾递归在非递归实现时不需要栈
    * 实现：递归执行，搜索关键字与中间元素比较，确定是在前半还是在后半
    * 对表更新时有高额开销
    * 保持有序：
        * 插入过程中动态保持：与插入数的平方成正比
        * 标准排序方法作为构造函数
    * 最大比较次数：floor(lgN)+1，也就是 N 的二进制表示中 1 的位数
    * 重复关键字：表现为重复的连续一块
        * 对给定关键字计数
        * 作为一组数返回
        * 在终止点分别向两个方向扫描，返回相等关键字的下标边界
    * 改进：更精确地猜测：插值搜索：
        * 基于关键字的值是数值型的，且为均匀分布
        * 依赖假设
        * 额外计算
        * 适用于访问开销大的外部方法
        * 把 `m = (l+r)/2` 改为 `m = l+1/2*(r-l)`，再把 1/2 改为 (v-k_l)/(k_r-k_l)，k_l、k_r 分别对应 a[l]、a[r]
        * 得：`m = l+[(v-key(a[l])) / (key(a[r]) - key(a[l]))] * (r-l)`
* 二叉搜索树：
    * 性质：任何节点都大于等于左子树所有节点，小于等于右子树所有节点
    * 插入：在搜索失败后，用指向树底的链接代替终止搜索的链接
    * 排序：中序遍历
    * 重复关键字：
        * 新节点会不连续地落在已存在节点的右边
        * 可以在找到第一个匹配点后继续搜索
        * 出现在根到外部节点的搜索关键字的路径上
    * 树的根节点对应快排中的划分元素
    * 高度：等于最坏情况下，一次搜索的开销
    * 内部路径长度：所有节点距离相加：与搜索命中的开销有关
    * 外部路径长度：与搜索失败的开销有关，外部 - 内部 = 2N
    * 距离一个节点的平均距离 = 节点个数的对数函数
    * 索引实现：
        * 索引：一种处于数据项之外的搜索结构，可以快速访问具有给定关键字的数据项
        * 无需改变树的代码，即可添加额外数组（额外信息）
        * 避免了把数据复制到内部的额外开销
        * 提前分配内存
        * 字符串搜索
    * 根节点插入：
        * 新插入的数据项在根节点：最近插入的节点都在树的上部
        * 右旋转：

          ```c
          x = h->l;
          h->l = x->r;
          x->r = h;
          ```

        * 左旋转：

          ```c
          x = h->r;
          h->r = x->l;
          x->l = h;
          ```

        * 自组织的搜索方法：搜索命中时把找到的节点带到根部，把经常访问到的节点保持在树的顶部
    * 其它操作：
        * 选择：第 k 个最小关键字问题
        * 删除：
            * 在子树中，（递归）删除该节点的结构代替原来子树
            * 在根部，合并两个子树代替原树：右子树中的最小节点变成根节点，左链接指向左子树
            * 懒删除：
                * 只标记为已删除，并忽略它
                * 可重用于未来的插入操作
                * 周期性重建：每隔一段时间就删除掉带标记的节点
        * 连接：把 1 号的根插入到 2 号去（根节点插入法），再将 1 号的左右子树分别和 2 号的左右子树两两组合
* 符号表的时间复杂度：* 表示几乎不可能出现的情况

|         | 插入  | 搜索  |  选择  | 插入  | 搜索命中 | 搜索失败 |
|:-------:|:---:|:---:|:----:|:---:|:----:|:----:|
|         |     | 最坏  |      |     |  平均  |      |
| 关键字索引数组 |  1  |  1  |  M   |  1  |  1   |  1   |
|  有序数组   |  N  |  N  |  1   | N/2 | N/2  | N/2  |
|  有序链表   |  N  |  N  |  N   | N/2 | N/2  | N/2  |
|  无序数组   |  1  |  N  | NlgN |  1  | N/2  |  N   |
|  无序链表   |  1  |  N  | NlgN |  1  | N/2  |  N   |
|  二分搜索   |  N  | lgN |  1   | N/2 | lgN  | lgN  |
|  二叉搜索树  |  N  |  N  |  N   | lgN | lgN  | lgN  |
|   红黑树   | lgN | lgN | lgN  | lgN | lgN  | lgN  |
|   随机树   | N*  | N*  |  N*  | lgN | lgN  | lgN  |
|   散列    |  1  | N*  | NlgN |  1  |  1   |  1   

## 第十三章 平衡树

* 最坏情况：
    * 已有序文件
    * 大量重复关键字
    * 逆序
    * 大小关键字交替
    * 其中任意片段具有简单结构的文件
* 平衡方法：
    * 显式地进行周期性再平衡：缺点：
        * 重新插入关键字对时间可能随插入序列长度呈平方递增
        * 每次平衡至少花费基于树大小的线性时间
    * 随机化：降低最坏情况出现的机会（无论输入）：随机化的 BST 和跳跃表
    * 平摊：每次做额外工作，从而避免以后做更多工作：伸展 BST
    * 优化：为每个操作提供性能保障：自顶向下 2-3-4 树和红黑树
* 随机化 BST：按概率进行根插入
    * 新纪录的最终位置在搜索路径上的任何地方（随机判定）
    * 与输入无关
    * 等价于用该树的关键字的随机排列来建立标准 BST
    * 缺点：
        * 生成随机数的开销
        * 每个节点需要记录子树节点个数
* 伸展 BST：伸展操作消除了最坏情况的平方时间
    * 插入：
        * 不同定向：标准根插入法
        * 相同定向：在根处进行两次旋转
    * 平摊性能保障：虽然不能保证每个操作都是高效的，但可以保证所有操作的平均开销是高效的
    * 重复关键字：会排列到节点的两边
    * 优点：
        * 自组织
        * 频繁访问一个小型关键字集合
* 2-3-4 树：
    * 2-节点：1 个关键字 k，2 个指针 p1, p2。p1 指向比 k 小的子树，p2 指向比 k 大的子树
    * 3-节点：2 个关键字 k1, k2，3 个指针 p1, p2, p3。p1 指向比 k1, k2 都小的子树，p2 指向在 k1, k2 之间的子树，p3 指向比 k1,
      k2 都大的子树
    * 4-节点：3 个关键字 k1, k2, k3，4 个指针 p1, p2, p3, p4。p1 指向最小，p2 指向 k1, k2 之间，p3 指向 k2, k3 之间，p4 指向最大
    * 分裂：把 4-节点分裂成两个 2-节点，把中间关键字传给父节点
    * 自底向上：
    * 自顶向下：搜索过程每遇到 4-节点就分裂
        * 优点：一次遍历过程就可达到所需的平衡
        * 树根变成 4-节点：分裂成一个由 3 个 2-节点组成的三角形
* 红黑树：
    * 思想：把 2-3-4 树表示为标准 BST（只有2-节点），每个节点增加一个信息位来存放指向那个节点的链接的颜色
    * 红链接：2-3-4 树中节点中的内部链接，是由 3-节点和 4-节点组成的小二叉树
    * 黑链接：2-3-4 树中的普通链接
    * 两种结构的优点：
        * 标准 BST 的简单搜索过程
        * 2-3-4 树的简单插入-平衡过程
    * 只有看到 4-节点时才平衡
    * 重复关键字：必须允许相等落入两边
    * 最坏情况有保障
    * 随机数据时有最快的插入和搜索
* 高度平衡树（AVL树）：每个节点的子树高度最多相差 1
* 2-3 树：只有 2-节点和 3-节点
* 跳跃表：
    * 完全忽略 2-3-4 树的抽象：形式化一个插入算法，使它通过旋转操作保持平衡红黑 BST 性质
    * 定义：有序链表，每个节点有不定量的链接，第 i 个链接跳过有小于 i 个链接的节点（i个跳过少于i个）
    * 随机化
    * 稳固结构：插入时很难维护
    * 少于其它方法的空间需求，又能提供对数性能

## 第十四章 散列

* 处理不规则的关键字
* 通过算术运算把关键字转换成表中地址来直接引用表中元素
* 解决冲突：
    * 链表：关键字数目无法预知
    * 数组：固定数目
    * 方法：
        * 链地址法
        * 开放地址法：用空的存储空间来解决冲突
            * 线性探测法
            * 双重散列表
        * 动态散列表
* 空间换时间：标准散列（关键字索引）
* 时间换空间：顺序搜索
* 缺点：
    * 运行时间依赖于关键字长度
    * 选择、排序的功能无法高效实现
* 散列函数：
    * 不同关键字映射到不同地址
    * 冲突：多个关键字对应同一地址
    * 希望避免显示类型转换，将关键字的二进制表示用作算术运算
    * 对于 w-位整数：
        * 模散列函数：k % M
        * 关键字乘 0-1 之间的常数，再做模 M 运算
    * 关键点：应该考虑到关键字的所有位
    * 应该取素数（质数）作为表长
    * 默森尼素数：当 t = 2, 3, 5, 7, 13, 19, 31 时，2^t-1 为素数
    * 对于较长字母序列：
        * 霍纳算法：从左到右计算编码字符串：每个字符的十进制求和后乘基数（应取素数），再加上下一个字符的编码值
        * 计算长整数时，每步去掉 M 的倍数
    * 通用散列算法：在计算中使用随机系数，并对关键字每位数采用不同随机值
        * 冲突几率为表大小 M 的倒数：1/M
        * 对长关键字比较耗时，可通过分段处理来解决
* 链地址法：每个地址对应一个链表
    * 易于实现，特别是删除操作，在实际中经常使用
    * 无序链表：
        * 插入：常量，很快
        * 搜索：与 N/M 成正比（M为地址，N为关键字）
        * 每个链表就像栈一样，可以删除最近插入的元素
    * 有序链表：搜索加快 1 倍，插入减慢
* 线性探测法：冲突发生时使用下一个空位置
    * 聚集：多个元素聚合在一段连续空间
    * 最好情况：偶数地址为空，奇数地址为满
    * 最坏情况：表的后半段满，前半段空
    * 删除：
        * 将被删除元素到右边下一个空位置之间的元素重新散列
        * 将被删除元素用观察哨替换
    * 相对于其它方法来说最快，但前提是要有足够内存且表稀疏
* 双重散列表：冲突发生时，使用第 2 个散列函数来找到空位置
    * 搜索增量：
        * 必定非 0
        * 应该与表的大小互素
    * 装填因子越接近 1，线性探测开销就越比双重散列开销大
    * 可以使用比线性探测更小的表来得到相同的平均搜索时间
    * 使用内存最高效，但需计算第 2 个散列函数
* 动态散列表：当表中元素数量到达某个阈值（1/2）时使表长加倍，而到达另一个阈值（1/8）时使表长减半
    * 当插入操作使表为 1/2 时加倍
    * 当删除操作使表为 1/8 时减半
    * 永远介于 1/8 和 1/2 之间
    * 加倍和减半的阈值应该不同
    * 适合使用模式无法预知的情况
* 特殊散列：
    * 在双重散列插入时把元素来回移动（第1个散列函数得到的地址与第2个交换），使搜索命中率更高
    * 有序散列：在线性探测中引入排序，使搜索失败的开销接近于搜索成功，等同于对链地址法中的链排序
    * 异常字典：几乎所有的搜索都应该是失败的，失败搜索快，成功搜索慢

## 第十五章 基数搜索

* 优点：
    * 最坏情况下较好的搜索性能，而无需平衡树的复杂算法
    * 对变长关键字易于实现
    * 有些算法在搜索数据结构中提前排序
    * 与二叉树、散列相比，可快速访问数据
* 缺点：
    * 空间使用效率低
    * 不能高效访问位时，搜索性能也会受到影响
* 数字搜索树（DST）：左链接代表 0 的选择，右链接代表 1 的选择
    * 根据某位的测试来决定向左子树还是右子树前进
    * 子节点根据关键字某位的比较结果
    * 适合关键字数目很大，但字长相对较小的情况
    * 最长路径由最长关键字的位数来决定
    * 如果关键字是定长的，那么搜索时间也由关键字位数决定
* Trie（线索，二叉搜索线索，前缀树，字典树）：
    * 关键字有序，且关键字只存储在树的底端（叶节点）
    * 结构：
        * 外部节点：空孩子
        * 叶节点：左右链表为空的内部结点
    * 比较位为 0 时，进入左子树
    * 比较位为 1 时，进入右子树
    * 搜索：先用位比较来遍历，最后在叶节点进行一次关键字比较
    * 与输入顺序无关：任一无重复关键字序列，存在唯一线索
    * 比 BST 更平衡：从中间将关键字分类的概率更大
    * 缺点：当关键字位多数都为相同时
    * 节点数目加倍：搜索开销仅增加一次比较操作
    * 对于长关键字降低开销的方法：
        * 把单树枝压缩成单链接来缩短路径长度
        * 使每个节点包含多于 2 个链接
    * 与二叉快速排序（二进制快排）对应，空链接对应空桶
* 帕氏线索：
    * 解决标准线索的缺点：
        * 单路分支导致多余节点
        * 两种类型节点使得代码变得复杂
    * 避免单路分支：存储要测试的位的序号，跳过位相同的关键字
    * 避开外部节点：使用指向相应线索中内部节点的链接
    * 只比较节点中数指示的关键字的位，忽略节点中关键位，当第一次到达向上指向的链接时比较关键字
    * 适合关键字较长
    * 中序遍历访问节点
* 多路线索：
    * 每次比较 r 位，可使搜索加快 r 倍
    * R 叉线索：节点为 R 个链接，每个链接代表一种可能的取值
    * 无节点标号，因为可以从父节点链接数组中指向其本身的链接推导出来
    * 与多路基数排序对应
    * 三叉搜索线索（TST）：节点中有 1 个关键字和 3 个链接。链接分别对应小于、等于、大于节点
        * 与三路基数排序对应
        * 改进：在树根直接使用大型多路节点
        * 优点：
            * 使用关键字不规则（关键字并不随机）
            * 搜索失败时也很高效，即使关键字很长
            * 支持比符号表更广泛的操作：如部分匹配搜索
            * 与帕氏线索相比，访问字节而不是位
* 后缀树（字符串索引）：由指向字符串的指针组成
    * 线索方法
    * 文本固定，无需动态插入排序
    * 带有字符串指针的二叉搜索（可保证的对数搜索时间）

## 第十六章 外部搜索

* 维护对数据的索引：
    * 不复制副本：
        * 需要相当多的额外空间
        * 避免多个副本造成数据不统一
    * 记录是对实际数据的引用
    * 主要参数：
        * 块大小
        * 相对访问时间
* 索引（目录）顺序访问（索引顺序存取）：把关键字和记录的引用按关键字有序放在数组，使用二分搜索
    * 改进：
        * 二叉树（索引太大）：
            * 内部节点：关键字 + 页面引用
            * 外部节点：关键字 + 记录指针
        * M 叉树：访问 M 表的开销和访问 2 表相同
    * 缺点：修改目录的开销很大
* B 树：
    * 定义：
        * M 阶 B 树由 k-节点组成，每个节点有 k-1 个关键字和 k 个指向树的链接，链接表示关键字的 k 个间隔
        * 对于根节点，k 在 2 和 M 之间；对于其它节点，k 在 M/2 和 M 之间
        * 所有指向空树的链接到根节点的距离都相等
    * 带有记录引用的关键字保存在树底部的外部页面
    * 带有页面引用的关键字的副本保存在内部页面
    * 速度和灵活性来源于节点内的未用空间
    * 每次搜索和插入都会访问根节点，根节点一定会在缓存中
    * 删除：
        * 自然方法：用兄弟节点中的数据项来填充删除的空间
        * 简单方法：使节点保持非满
    * 改进：
        * 把尽可能多的页面引用保存在一个节点中：节约时间开销、分支因子增大、树更扁平
        * 在分裂前把节点与其它兄弟节点组合：提高存储效率
* 可扩展散列：
    * 如同散列：随机算法，第一步是定义一个散列函数（由关键字得到整数）
    * 如同多路线索：使用关键字前几位索引到一个大小为 2 的幂的表
    * 如同 B 树：把数据项存储在页面中，填满时分裂，有序的
    * 如同索引顺序访问：维持一个目录，由目录搜索关键字可对应到页面
    * 定义：阶数为 d 则是一个含有 2^d 个页面引用的目录，目录中有 2^{d-k} 个指向页面的指针，起始于前 k 位决定的位置，页面中数据项不超过
      M，关键字前 k 位相同
    * 可由线索转换而来
    * 与插入顺序无关
    * 删除：
        * 简单方法：允许页面不满
    * 整个目录都在缓存的可能性不大
    * 改进：
        * 把目录组织成单一指针数组（把目录放在内存中）
        * 把树根保存在内存中
        * 增加一层数据，对第一层前 10 位索引，第二层对其余位索引