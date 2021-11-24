# 使用gdb调试LAMMPS

[教程洗稿自 C语言中文网](http://c.biancheng.net/gdb/)，希望大家多多支持（利益无关）

## gdb简介

要知道，哪怕是开发经验再丰富的程序员，编写的程序也避免不了出错。程序中的错误主要分为 2 类，分别为语法错误和逻辑错误：
* 程序中的语法错误几乎都可以由编译器诊断出来，很容易就能发现并解决；
* 逻辑错误指的是代码思路或者设计上的缺陷，程序出现逻辑错误的症状是：代码能够编译通过，没有语法错误，但是运行结果不对。对于这类错误，只能靠我们自己去发现和纠正。
实际场景中解决逻辑错误最高效的方法，就是借助调试工具对程序进行调试。

所谓调试（Debug），就是让代码一步一步慢慢执行，跟踪程序的运行过程。比如，可以让程序停在某个地方，查看当前所有变量的值，或者内存中的数据；也可以让程序一次只执行一条或者几条语句，看看程序到底执行了哪些代码。

也就是说，通过调试程序，我们可以监控程序执行的每一个细节，包括变量的值、函数的调用过程、内存中数据、线程的调度等，从而发现隐藏的错误或者低效的代码。

> 对于初学者来说，学习调试可以增加编程的功力，能让我们更加了解自己的程序，比如变量是什么时候赋值的、内存是什么时候分配的，从而弥补学习的纰漏。调试是每个程序员必须掌握的基本技能，没有选择的余地！

就好像编译程序需要借助专业的编译器，调试程序也需要借助专业的辅助工具，即调试器（Debugger）。表 1 罗列了当下最流行的几款调试器：

GDB 全称“GNU symbolic debugger”，从名称上不难看出，它诞生于 GNU 计划（同时诞生的还有 GCC、Emacs 等），是 Linux 下常用的程序调试器。发展至今，GDB 已经迭代了诸多个版本，当下的 GDB 支持调试多种编程语言编写的程序，包括 C、C++、Go、Objective-C、OpenCL、Ada 等。实际场景中，GDB 更常用来调试 C 和 C++ 程序。

总的来说，借助 GDB 调试器可以实现以下几个功能：
* 程序启动时，可以按照我们自定义的要求运行程序，例如设置参数和环境变量；
* 可使被调试程序在指定代码处暂停运行，并查看当前程序的运行状态（例如当前变量的值，函数的执行结果等），即支持断点调试；
* 程序执行过程中，可以改变某个变量的值，还可以改变代码的执行顺序，从而尝试修改程序中出现的逻辑错误。

另外，虽然 Linux 系统下读者编写 C/C++ 代码的 IDE 可以自由选择，但调试生成的 C/C++ 程序一定是直接或者间接使用 GDB。可以毫不夸张地说，我所做那些 C/C++ 项目的开发和调试包括故障排查都是利用 GDB 完成的，调试是开发流程中一个非常重要的环节，因此对于从事 Linux C/C++ 的开发人员熟练使用 GDB 调试是一项基本要求。

“工欲善其事、必先利其器”，作为一名合格的软件开发者，至少得熟悉一种软件开发工具和调试器， 而对于 Linux C/C++ 后台开发，舍 GDB 其谁。

## 安装

基于 Linux 系统的免费、开源，衍生出了多个不同的 Linux 版本，比如 Redhat、CentOS、Ubuntu、Debian 等。这些 Linux 发行版中，有些默认安装有 GDB 调试器，但有些默认不安装。

对于尚未安装 GDB 的 Linux 发行版，安装方法通常有以下 2 种：
* 直接调用该操作系统内拥有的 GDB 安装包，使用包管理器进行安装。此安装方式的好处是速度快，但通常情况下安装的并非 GDB 的最新版本；
* 前往 GDB 官网下载源码包，在本机编译安装。此安装方式的好处是可以任意选择 GDB 的版本，但由于安装过程需要编译源码，因此安装速度较慢。

## 启动调试

对于自己写的C、C++程序，通常需要用gcc和g++编译，这时候需要手动加上`-g`(使用`-Og`以在编译速度和调试体验间达到平衡)参数以生成具有gdb规范的可执行文件。LAMMPS[默认](https://lammps.sandia.gov/doc/Build_basics.html#debug)是开启调试的，带来的问题是文件体积增加3-5倍。如果不需要调试或者需要缩减体积，CMake中可以使用`-D CMAKE_BUILD_TYPE=Release`来取消调试选项。

我们的LAMMPS通常已经加入到环境路径中了，即可以直接调用lmp可执行文件开始计算。通常为了方便起见，我们需要在input和data文件所在的地方执行gdb。
对于还未执行过的程序，第一种是直接用`gdb`命令拉起控制台(`--silent`/`-q`取消版本信息输出)，然后使用`file`选择需要调试的文件：

有三种方式可以为gdb指定目标程序的参数：
1. 启动gdb指定目标调试程序的同时，使用`--args`指定需要的参数：
```
roy@Carbon:~/lammps/examples/airebo$ gdb --silent --args lmp -in in.airebo
```
2. gdb启动后，借助`set args`设置参数：
```
roy@Carbon:~/lammps/examples/airebo$ gdb --silent
(gdb)file lmp
Reading symbols from lmp...done.
(gdb)set args -in in.airebo
```
3. 执行`run`或`start`时附加参数：
```bash
roy@Carbon:~/lammps/examples/airebo$ gdb --silent
(gdb)file lmp
Reading symbols from lmp...done.
(gdb)start -in in.airebo 
```
若想将程序输出结果重定向（保存），
```
(gdb)run -in in.airebo > gdb.log
```

完整的例子：
```bash
roy@Carbon:~/lammps/examples/airebo$ gdb -q --args lmp -in in.airebo
Reading symbols from lmp...done.
(gdb) start
Temporary breakpoint 1 at 0xad0: file /home/roy/lammps/src/main.cpp, line 37.
Starting program: /home/roy/bin/lmp -in in.airebo
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/lib/x86_64-linux-gnu/libthread_db.so.1".

Temporary breakpoint 1, main (argc=3, argv=0x7fffffffe208)
    at /home/roy/lammps/src/main.cpp:37
warning: Source file is more recent than executable.
37      // this uses GNU extensions and is only tested on Linux
(gdb)
```
我们可以使用`l`或`list`来查看源代码。

## 开始调试

使用 GDB 调试器调试程序的过程，其实就是借助 GDB 调试器来监控程序的执行流程，进而发现程序中导致异常或者 Bug 的代码。
> 命令行中大部分单词都可以首字母来代替

### 启动

根据不同场景的需要，GDB 调试器提供了多种方式来启动目标程序，其中最常用的就是`run`指令，其次为`start`指令。也就是说`run`和`start`指令都可以用来在 GDB 调试器中启动程序，它们之间的区别是：
* 默认情况下，`run`指令会一直执行程序，直到执行结束。如果程序中手动设置有断点，则`run`指令会执行程序至第一个断点处；
* `start` 指令会执行程序至`main()`主函数的起始位置，即在`main()`函数的第一行语句处停止执行（该行代码尚未执行）。
> 可以这样理解，使用`start`指令启动程序，完全等价于先在`main()`主函数起始位置设置一个断点，然后再使用`run`指令启动程序。另外，程序执行过程中使用`run`或者`start`指令，表示的是重新启动程序。

### 设置断点
默认情况下，程序不会进入调试模式，代码会瞬间从开头执行到末尾。要想观察程序运行的内部细节（例如某变量值的变化情况），可以借助 GDB 调试器在程序中的某个地方设置断点，这样当程序执行到这个地方时就会停下来。

`break`命令
```
(gdb)b location
```
| | |
|---|---|
|linenum|	linenum 是一个整数，表示要打断点处代码的行号。要知道，程序中各行代码都有对应的行号，可通过执行 l（小写的 L）命令看到。|
|filename:linenum	|filename 表示源程序文件名；linenum 为整数，表示具体行数。整体的意思是在指令文件 filename 中的第 linenum 行打断点。|
|+/- offset|	offset 为整数（假设值为 2），+offset 表示以当前程序暂停位置（例如第 4 行）为准，向后数 offset 行处（第 6 行）打断点；-offset 表示以当前程序暂停位置为准，向前数 offset 行处（第 2 行）打断点。|
|function|	function 表示程序中包含的函数的函数名，即 break 命令会在该函数内部的开头位置打断点，程序会执行到该函数第一行代码处暂停。|
|filename:function|	filename 表示远程文件名；function 表示程序中函数的函数名。整体的意思是在指定文件 filename 中 function 函数的开头位置打断点。|

```
(gdb)b ... if expr
```
第二种格式中，`...`可以是表中所有参数的值，用于指定打断点的具体位置；`expr`为某个表达式。整体的含义为：每次程序执行到`...`位置时都计算`expr`的值，如果为`True`，则程序在该位置暂停；反之，程序继续执行。

**`tbreak`命令**
`tbreak` 和 `break` 命令的用法和功能几乎完全相同，唯一的不同在于，使用 `tbreak` 命令打的断点仅会作用 1 次，即使程序暂停之后，该断点就会自动消失。

**`rbreak`命令**
`rbreak` 命令的作用对象是 C、C++ 程序中的函数，它会在指定函数的开头位置打断点。
```
(gdb) tbreak regex
```
其中`regex`为一个正则表达式，程序中函数的函数名只要满足`regex`条件，`tbreak`命令就会其内部的开头位置打断点。值得一提的是，`tbreak` 命令打的断点和`break`命令打断点的效果是一样的，会一直存在，不会自动消失。

### 变量监控
有一些场景，我们需要监控某个变量或者表达式的值，通过值的变化情况判断程序的执行过程是否存在异常或者 Bug。这种情况下，`break`命令显然不再适用，推荐大家使用`watch`命令。

GDB 调试器支持在程序中打 3 种断点，分别为普通断点、观察断点和捕捉断点。其中`break`命令打的就是普通断点，而`watch`命令打的为观察断点。使用 GDB 调试程序的过程中，借助观察断点可以监控程序中某个变量或者表达式的值，只要发生改变，程序就会停止执行。相比普通断点，观察断点不需要我们预测变量（表达式）值发生改变的具体位置：

```
(gdb) watch cond
```
和`watch`命令功能相似的，还有`rwatch`和`awatch`命令。其中：
* `rwatch`命令：只要程序中出现读取目标变量（表达式）的值的操作，程序就会停止运行；
* `awatch`命令：只要程序中出现读取目标变量（表达式）的值或者改变值的操作，程序就会停止运行。

如果我们想查看当前观察点的数量，借助以下指令：
```
(gdb) info watchpoints
```
值得一提的是，对于使用`watch`（`rwatch`、`awatch`）命令监控 C、C++ 程序中变量或者表达式的值，有以下几点需要注意：
* 当监控的变量（表达式）为局部变量（表达式）时，一旦局部变量（表达式）失效，则监控操作也随即失效；
* 如果监控的是一个指针变量（例如 *p），则 `watch *p` 和 `watch p` 是有区别的，前者监控的是 p 所指数据的变化情况，而后者监控的是 p 指针本身有没有改变指向；
* 这 3 个监控命令还可以用于监控数组中元素值的变化情况，例如对于 `a[10]` 这个数组，`watch a` 表示只要 a 数组中存储的数据发生改变，程序就会停止执行。

### 捕捉断点

捕捉断点的作用是，监控程序中某一事件的发生，例如程序发生某种异常时、某一动态库被加载时等等，一旦目标时间发生，则程序停止执行。

> 用捕捉断点监控某一事件的发生，等同于在程序中该事件发生的位置打普通断点。
```
(gdb) catch event
```
| | |
| --- | --- |
|throw [exception]|	当程序中抛出 exception 指定类型异常时，程序停止执行。如果不指定异常类型（即省略 exception），则表示只要程序发生异常，程序就停止执行。|
|catch [exception]|	当程序中捕获到 exception 异常时，程序停止执行。exception 参数也可以省略，表示无论程序中捕获到哪种异常，程序都暂停执行。|
|load [regexp] unload [regexp]|	其中，regexp 表示目标动态库的名称，load 命令表示当 regexp 动态库加载时程序停止执行；unload 命令表示当 regexp 动态库被卸载时，程序暂停执行。regexp 参数也可以省略，此时只要程序中某一动态库被加载或卸载，程序就会暂停执行。|

注意，当前 GDB 调试器对监控 C++ 程序中异常的支持还有待完善，使用 catch 命令时，有以下几点需要说明：
* 对于使用`catch`监控指定的 event 事件，其匹配过程需要借助 libstdc++ 库中的一些 SDT 探针，而这些探针最早出现在 GCC 4.8 版本中。也就是说，想使用 catch 监控指定类型的 event 事件，系统中 GCC 编译器的版本最低为 4.8，但即便如此，catch 命令是否能正常发挥作用，还可能受到系统中其它因素的影响。
* 当 catch 命令捕获到指定的 event 事件时，程序暂停执行的位置往往位于某个系统库（例如 libstdc++）中。这种情况下，通过执行 up 命令，即可返回发生 event 事件的源代码处。
* catch 无法捕获以交互方式引发的异常。

如同`break`命令和`tbreak`命令的关系一样（前者的断点是永久的，后者是一次性的），`catch`命令也有另一个版本，即`tcatch`命令。`tcatch` 命令和`catch`命令的用法完全相同，唯一不同之处在于，对于目标事件，`catch`命令的监控是永久的，而`tcatch`命令只监控一次，也就是说，只有目标时间第一次触发时，tcath 命令才会捕获并使程序暂停，之后将失效。

### 查看与删除断点

任何类型的断点在建立时，GDB 调试器都会为其分配一个独一无二的断点编号。
借助如下指令，可以查看当前调试环境中存在的所有断点，包括普通断点、观察断点以及捕捉断点：
```
(gdb) info breakpoint [n]
(gdb) info break [n]
```
参数 n 作为可选参数，为某个断点的编号，表示查看指定断点而非全部断点。

清除全部断点，可以使用`clear`

清除特定断电则用`delete [num]`

暂时禁用断点:`disable [num]`, 激活断点：`enable [num]`

激活断点有多个选项

```
enable [num]
enable once num
enable count num
enable delete num
```


### 单步调试

GDB 调试器共提供了 3 种可实现单步调试程序的方法，即使用`next`、`step`和`until`命令。换句话说，这 3 个命令都可以控制 GDB 调试器每次仅执行 1 行代码，但除此之外，它们各自还有不同的功能。

`next`是最常用来进行单步调试的命令，其最大的特点是当遇到包含调用函数的语句时，无论函数内部包含多少行代码，`next`指令都会一步执行完。也就是说，对于调用的函数来说，`next`命令只会将其视作一行代码。

`next`命令可以缩写为 n 命令，使用方法也很简单，语法格式如下：
```
(gdb) next count
```
参数`count`表示单步执行多少行代码，默认为 1 行。

`step`命令和`next`命令的功能相同，都是单步执行程序。不同之处在于，当`step`命令所执行的代码行中包含函数时，会进入该函数内部，并在函数第一行代码处停止执行。

`step`命令可以缩写为 s 命令，用法和`next`命令相同，语法格式如下：
```
(gdb) step count
```
参数`count`表示一次执行的行数，默认为 1 行。

`until`命令可以简写为 u 命令，有 2 种语法格式，如下所示：
```
(gdb) until
(gdb) until location
```

其中，参数`location`为某一行代码的行号。

不带参数的`until`命令，可以使 GDB 调试器快速运行完当前的循环体，并运行至循环体外停止。注意，`until`命令并非任何情况下都会发挥这个作用，只有当执行至循环体尾部（最后一行代码）时，`until`命令才会发生此作用；反之，`until`命令和`next`命令的功能一样，只是单步执行程序。

### finish return 和 jump

实际调试时，在某个函数中调试一段时间后，可能不需要再一步步执行到函数返回处，希望直接执行完当前函数，这时可以使用 finish 命令。与 finish 命令类似的还有 return 命令，它们都可以结束当前执行的函数。

finish 命令和 return 命令的区别是，finish 命令会执行函数到正常退出；而 return 命令是立即结束执行当前函数并返回，也就是说，如果当前函数还有剩余的代码未执行完毕，也不会执行了。除此之外，return 命令还有一个功能，即可以指定该函数的返回值`return count`。

jump 命令的功能是直接跳到指定行继续执行程序，其语法格式为：
```
(gdb) jump location
```
其中，location 通常为某一行代码的行号。

也就是说，jump 命令可以略过某些代码，直接跳到 location 处的代码继续执行程序。这意味着，如果你跳过了某个变量（对象）的初始化代码，直接执行操作该变量（对象）的代码，很可能会导致程序崩溃或出现其它 Bug。另外，如果 jump 跳转到的位置后续没有断点，那么 GDB 会直接执行自跳转处开始的后续代码。

### 常用命令

|命令（缩写）	|功 能|
|run（r）	|启动或者重启一个程序。|
|list（l）|	显示带有行号的源码。|
|continue（c）|	让暂停的程序继续运行。|
|next（n）|	单步调试程序，即手动控制代码一行一行地执行。|
|step（s）|	如果有调用函数，进入调用的函数内部；否则，和 next 命令的功能一样。|
|until（u）until location（u location）|	当你厌倦了在一个循环体内单步跟踪时，单纯使用 until 命令，可以运行程序直到退出循环体。|
|until| n 命令中，n 为某一行代码的行号，该命令会使程序运行至第 n 行代码处停止。|
|finish（fi）|	结束当前正在执行的函数，并在跳出函数后暂停程序的执行。|
|return（return）|	结束当前调用函数并返回指定值，到上一层函数调用处停止程序执行。|
|jump（j）|	使程序从当前要执行的代码处，直接跳转到指定位置处继续执行后续的代码。|
|print（p）|	打印指定变量的值。|
|quit（q）|	退出 GDB 调试器。|


### 输出变量

`print`命令，它的功能就是在 GDB 调试程序的过程中，输出指定变量或者表达式的值。
和`print`命令一样，`display`命令也用于调试阶段查看某个变量或表达式的值，它们的区别是，使用`display`命令查看变量或表达式的值，每当程序暂停执行（例如单步执行）时，GDB 调试器都会自动帮我们打印出来
```
(gdb) print num
(gdb) p num
(gdb) display expr
(gdb) display/fmt expr
```
其中fmt是用来控制格式输出的标识符，

|  |  |
|---|---|
|/x|	以十六进制的形式打印出整数。|
|/d|	以有符号、十进制的形式打印出整数。|
|/u|	以无符号、十进制的形式打印出整数。|
|/o|	以八进制的形式打印出整数。|
|/t|	以二进制的形式打印出整数。|
|/f|	以浮点数的形式打印变量或表达式的值。|
|/c|	以字符形式打印变量或表达式的值。|

事实上，对于使用`display`命令查看的目标变量或表达式，都会被记录在一张列表（称为自动显示列表）中。通过执行`info dispaly`命令，可以打印出这张表：
```
(gdb) info display
Auto-display expressions now in effect:
Num Enb Expression
2:      y      /t result
1:      y      num
```
其中，各列的含义为：
`Num`列为各变量或表达式的编号，GDB 调试器为每个变量或表达式都分配有唯一的编号；
`Enb`列表示当前各个变量（表达式）是处于激活状态还是禁用状态，如果处于激活状态（用 y 表示），则每次程序停止执行，该变量的值都会被打印出来；反之，如果处于禁用状态（用 n 表示），则该变量（表达式）的值不会被打印。
`Expression`列：表示查看的变量或表达式。

对于不需要再打印值的变量或表达式，可以将其删除或者禁用。

1) 通过执行如下命令，即可删除自动显示列表中的变量或表达式：
```
(gdb) undisplay num...
(gdb) delete display num...
```
参数`num...`表示目标变量或表达式的编号，编号的个数可以是多个。

## 调试运行过程中崩溃的程序

除了以上 3 种情况外，C 或者 C++ 程序运行过程中常常会因为各种异常或者 Bug 而崩溃，比如内存访问越界（例如数组下标越界、输出字符串时该字符串没有 \0 结束符等）、非法使用空指针等，此时就需要调试程序。

值得一提的是，在 Linux 操作系统中，当程序执行发生异常崩溃时，系统可以将发生崩溃时的内存数据、调用堆栈情况等信息自动记录下载，并存储到一个文件中，该文件通常称为 core 文件，Linux 系统所具备的这种功能又称为核心转储（core dump）。幸运的是，GDB 对 core 文件的分析和调试提供有非常强大的功能支持，当程序发生异常崩溃时，通过 GDB 调试产生的 core 文件，往往可以更快速的解决问题。

默认情况下，Linux 系统是不开启 core dump 这一功能的，读者可以借助执行ulimit -c指令来查看当前系统是否开启此功能：
```
[root@bogon demo]# ulimit -a
core file size          (blocks, -c) 0
data seg size           (kbytes, -d) unlimited
scheduling priority             (-e) 0
file size               (blocks, -f) unlimited
```
其中，如果 core file size（core 文件大小）对应的值为 0，表示当前系统未开启 core dump 功能。这种情况下，可以通过执行如下指令改变 core 文件的大小：

```
[root@bogon demo]# ulimit -c unlimited
[root@bogon demo]# ulimit -a
core file size          (blocks, -c) unlimited  
data seg size           (kbytes, -d) unlimited
scheduling priority             (-e) 0
file size               (blocks, -f) unlimited
```
> 其中，unlimited 表示不限制 core 文件的大小。

由此，当程序执行发生异常崩溃时，系统就可以自动生成相应的 core 文件。
重新运行LAMMPS：
```
[root@bogon demo]# ./main.exe
Segmentation fault (core dumped)   <--发生段错误，并生成了 core 文件
[root@bogon demo]# ls
core  main.c  main.exe
```

> 段错误又称为访问权限冲突，指的是当前程序访问了不可访问的存储空间，比如访问的不存在的空间，又或者是受系统保护的内存空间。
对于 core 文件的调试，其调用 GDB 调试器的指令为：
```
[root@bogon demo]# gdb main.exe core
GNU gdb (GDB) 8.0.1
Copyright (C) 2017 Free Software Foundation, Inc.
......
Reading symbols from main.exe...
[New LWP 4296]

warning: Unexpected size of section `.reg-xstate/4296' in core file.
Core was generated by `./main.exe'.
Program terminated with signal SIGSEGV, Segmentation fault.

warning: Unexpected size of section `.reg-xstate/4296' in core file.
#0  0x00005583b933013d in main () at main.c:5
5     *p = 123;
```
可以看到，程序发生崩溃的位置是在 main.c 中的第 5 行。甚至于，对于 core 文件中记录的崩溃信息，可以使用 where、print、bt 等指令查看，有关这些指令的功能和用法，由于并非本节重点，这里不再具体赘述，后续章节会做详细讲解。

