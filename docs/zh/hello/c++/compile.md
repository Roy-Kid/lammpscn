# GCC 编译基础

<DIV class="author">作者: <i>三级狗</i></DIV>

## 编译器

### Linux部分

在Linux中 主流编译器为Clang以及GNU（GCC，G++） GCC中支持的语言常用的有 C、C++、Java、Object-C 结构类似于一个标准Unix编译器

而Clang是支持C++，CObject-C，Object-C++语言的编译器前端 其底层采用了LLVM底层虚拟机，在编译Object-C时对比GCC快三倍

总体上：

* GCC特性：
除支持C/C++/ Objective-C/Objective-C++语言外，还是支持Java/Ada/Fortran/Go等；当前的Clang的C++支持落后于GCC；支持更多平台；更流行，广泛使用，支持完备。

* Clang特性：
编译速度快；内存占用小；兼容GCC；设计清晰简单、容易理解，易于扩展增强；基于库的模块化设计，易于IDE集成；出错提示更友好


## 材料准备

> 为了方便演示和讲解，在这里提前准备好几个简单的文件：`test.cpp` `test.h` `main.cpp` 文件内容如下：

**main.cpp**
``` cpp
#include "test.h"

int main (int argc, char **argv){
    Test t;
    t.hello();
    return 0;
}
```

**test.h**
``` cpp
#ifndef _TEST_H_ 
#define _TEST_H_ 

class Test{
public:
    Test();
    void hello();
    ~Test();
};
#endif
```

**test.cpp**
``` cpp
#include "test.h"
#include <iostream>
using namespace std;

Test::Test(){

}

void Test::hello(){

    cout << "hello" << endl;
}

Test::~Test(){

}
```

## C++的编译过程
一个完整的C++编译过程（例如`g++ a.cpp`生成可执行文件），总共包含以下四个过程：
* 编译预处理，也称预编译，可以使用命令`g++ -E`执行
* 编译，可以使用`g++ -S`执行
* 汇编，可以使用`as` 或者`g++ -c`执行
* 链接，可以使用`g++ xxx.o xxx.so xxx.a`执行

> 可以通过添加g++ --save-temps参数，保存编译过程中生成的所有中间文件 下面对这四个步骤进行逐一讲解

### 编译预处理阶段：主要对包含的头文件（＃include ）和宏定义（＃define,#ifdef … ）还有注释等进行处理

可以使用g++ -E 让g++ 在预处理之后停止编译过程，生成 *.ii(.c文件生成的是*.i) 文件。 因为上面写的`main.cpp`中没有任何预编译指令，所以预编译生成与源文件几乎没有差别。这里预编译一下test.cpp文件

```
g++ -E test.cpp -o test.ii
```

可以打开`test.ii`查看，刚刚的`main.cpp`文件预编译完成后的内容：

![test.ii](/column/basic_cs/compile/testii.jpg)

预编译完成后，`#include`引入的内容 被全部复制进预编译文件中，除此之外，如果文件中有使用宏定义也会被替换处理。

> 预编译过程最主要的工作，就是宏命令的替换

* `#include`命令的工作就是单纯的导入，这里其实并不限制导入的类型，甚至可以导入`.cpp`、`.txt`等等。
* 感兴趣的同学可以预编译一个包含Qt中信号的文件，会看到预编译之后:
  * `emit`直接成了空。发射信号实质就是一次函数调用;
  * 头文件中的`signals:`也被替换成了`protected:`（Qt5被替换为`public:`）
  * 以及Qt中其他的宏定义都在预编译时被处理如：`Q_OBJECTQ_INVOKEABLE`等


### g++ 编译阶段：C++ 语法错误的检查，就是在这个阶段进行。在检查无误后，g++ 把代码翻译成汇编语言

可以使用`-S` 选项进行查看，该选项只进行编译而不进行汇编，生成汇编代码。

```
g++ -S main.ii -o main.s
```

汇编代码中生成的是和CPU架构相关的汇编指令，不同CPU架构采用的汇编指令集不同，生成的汇编代码也不一样：

![mains](/column/basic_cs/compile/mains.jpg)

### g++ 汇编阶段：生成目标代码 *.o

有两种方式：

* 使用 g++ 直接从源代码生成目标代码 `g++ -c *.s -o *.o`
* 使用汇编器从汇编代码生成目标代码 `as *.s -o *.o`

到编译阶段，代码还都是人类可以读懂的。汇编这一阶段，正式将汇编代码生成机器可以执行的目标代码，也就是二进制码。

```
# 编译
g++ -c main.s -o main.o
# 汇编器编译
as main.s -o main.o
```
也可以直接使用`as *.s`, 将执行汇编、链接过程生成可执行文件`a.out`, 可以像上面使用-o 选项指定输出文件的格式。

### g++ 链接阶段：生成可执行文件；Windows下生成.exe

修改`main.cpp`的内容，引用`Test`类

```cpp
#include "test.h"

int main (int argc, char **argv){

    Test t;
    t.hello();
    return 0;
}

```

生成目标文件：

* ```g++ test.cpp -c -o test.o```
* ```g++ main.cpp -c -o main.o```

链接生成可执行文件：

```
g++ main.o test.o -o a.out
```

链接的过程，其核心工作是解决模块间各种符号(变量，函数)相互引用的问题，更多的时候我们除了使用`.o`以外，还将静态库和动态库链接一同链接生成可执行文件。

对符号的引用本质是对其在内存中具体地址的引用，因此确定符号地址是编译，链接，加载过程中一项不可缺少的工作，这就是所谓的符号重定位。本质上来说，符号重定位要解决的是当前编译单元如何访问「外部」符号这个问题。

接下来我们先讲解如何将源文件编译成动态库和静态库，然后再讲述如何在链接时链接我们编译好的库。

## 编译动态库和静态库

大型项目中不可能使用一个单独的可执行程序提供服务，必须将程序的某些模块编译成动态或静态库:

### 编译生成静态库

使用`ar`命令进行“归档”（.a的实质是将文件进行打包）
```
ar crsv libtest.a test.o 
```

* r 替换归档文件中已有的文件或加入新文件 (必要)
* c 不在必须创建库的时候给出警告
* s 创建归档索引
* v 输出详细信息

### 编译生成动态库

使用`g++ -shared` 命令指定编译生成的是一个动态库

```
g++ test.cpp -fPIC -shared -Wl,-soname,libtest.so -o libtest.so.0.1
```

* `shared`:告诉编译器生成一个动态链接库
* `-Wl`,`-soname`:指示生成的动态链接库的别名（这里是`libtest.so`）
* `-o`:指示实际生成的动态链接库（这里是`libtest.so.0.1`）
* `-fPIC`
  * `fPIC`的全称是 `Position Independent Code`， 用于生成位置无关代码（看不懂没关系，总* 之加上这个参数，别的代码在引用这个库的时候才更方便，反之，稍不注意就会有各种乱七八* 糟的报错）。
  * 使用`-fPIC`选项生成的动态库，是位置无关的。这样的代码本身就能被放到线性地址空间的任* 意位置，无需修改就能正确执行。通常的方法是获取指令指针的值，加上一个偏移得到全局变* 量/函数的地址。
  * 关于`PIC`参数的[详细解读](https://link.zhihu.com/?target=http%3A//blog.sina.com.cn/s/blog_54f82cc201011op1.html)

> 在gcc中，如果指定`-shared`不指定`-fPIC`会报错，无法生成非PIC的动态库，不过clang可以。

库中函数和变量的地址是相对地址，不是绝对地址，真实地址在调用动态库的程序加载时形成。 动态库的名称有别名(soname),真名(realname)和链接名(linker name)。

* 真名是动态库的真实名称，一般总是在别名的基础上加上一个小的版本号，发布版本构成 别名由一个前缀`lib`，然后是库的名字加上`.so`构成，例如：`libQt5Core.5.7.1`
* 链接名，即程序链接时使用的库的名字，例如：`-lQt5Core`
* 在动态链接库安装的时候总是复制库文件到某个目录，然后用软连接生成别名，在库文件进行更新的时候仅仅更新软连接即可。

> 「注意:」
生成的库文件总是以`libXXX`开头，这是一个约定，因为在编译器通过-l参数寻找库时，比如`-lpthread`会自动去寻找`libpthread.so`和`libpthread.a`。
如果生成的库并没有以`lib`开头，编译的时候仍然可以连接到，不过只能以显示加在编译命令参数里的方式链接。例如`g++ main.o test.so`

## 静态编译和动态编译

编译C++的程序可以分为动态编译和静态编译两种

### 静态编译
链接阶段，会将汇编生成的目标文件.o与引用到的库一起链接打包到可执行文件中。这种称为静态编译，静态编译中使用的库就是静态库（`*.a` 或`*.lib`）生成的可执行文件在运行时不需要依赖于链接库。

优点：
* 代码的装载速度快，执行速度也比较快
* 不依赖其他库执行，移植方便

缺点：
* 程序体积大
* 更新不方便，如果静态库需要更新，程序需要重新编译
* 如果多个应用程序使用的话，会被装载多次，浪费内存。

```
g++ main.o libtest.a
```

编译完成后可以运行a.out查看效果，通过`ldd`命令查看运行`a.out`所需依赖，可以看到静态编译的程序并不依赖libtest库。

![static_compile](/column/basic_cs/compile/static_compile.jpg)

### 动态编译

> Linux/UnixLike平台的动态链接库一般为.so为结尾（shared object）
> Windows平台的动态链接库一般为.dll为结尾（Dynamic Link Library ）

动态库在程序编译时并不会被连接到目标代码中，而是在程序运行是才被载入。不同的应用程序如果调用相同的库，那么在内存里只需要有一份该共享库的实例，规避了空间浪费问题。

动态编译中使用的库就是动态库（`*.so` 或`*.dll`）

动态库在程序运行是才被载入，也解决了静态库对程序的更新、部署和发布页会带来麻烦。用户只需要更新动态库即可，增量更新。

动态库在链接过程中涉及到加载时符号重定位的问题，感兴趣的同学参看链接：[动态编译原理分析](https://link.zhihu.com/?target=https%3A//blog.csdn.net/shenhuxi_yu/article/details/71437167)

**优点:**
* 多个应用程序可以使用同一个动态库，而不需要在磁盘上存储多个拷贝
* 动态灵活，增量更新
**缺点：**
* 由于是运行时加载，多多少少会影响程序的前期执行性能
* 动态库缺失会导致文件无法运行

编译完成后可以运行`a.out`查看效果，通过ldd命令查看运行`a.out`所需依赖

![dynamic_compile](/column/basic_cs/compile/dynamic_compile.jpg)

## gcc链接参数 -L、-l、-rpath、-rpath-link

从上面的截图中，我们已经看到了刚才的程序运行报错，原因是找不到动态链接库`libtest.so`
这个报错的解决方案有很多例如：

```
LD_LIBRARY_PATH=. ./a.out
```

那么明明编译成功，运行时为什么会找不到库？为了弄清这个问题，我们需要对链接动态库的过程有一个更深入的理解。

我们在`main.cpp`中明确引用到了Test类，所以在编译进行到最后阶段，链接的时候。如果在所有参与编译的文件中没能检索到`Test`这个符号，则会报错未定义的引用。
所以在编译过程中必须能够找到包含`Test`符号的文件，可以是`.o`、`.a`、或者`.so`。
如果是`.o`或者`.a`，也就是静态链接，那么它会将`.o`或者`.a`中的内容一起打包到生成的可执行文件中，生成的可执行文件可以独立运行不受任何限制。
而如果是`.so`这种动态链接库，就比较麻烦了。链接器将不会把这个库打包到生成的可执行文件里，而仅仅只会在这里记录一个地址，告诉程序，如果遇到`Test`符号，你就去文件`libtest.so`的第三行第五列（打个比方，实际是一个相对的内存地址）找它的定义。

综上所述

* 编译链接`main.cpp`的时候，必须能够找到`libtest.so`的动态库，记录下`Test`符号的偏移地址。
* 运行的时候，程序必须找到`libtest.so`，然后寻址找到`Test`

## 编译时链接库

`-L` 与 `-l` 链接器参数，就是指定链接时去（哪里）找（什么）库

`g++ main.o libtest.so`，或`g++ main.o ./libtest.so`
`g++ main.o /home/threedog/test/libtest.so`
`g++ main.o -ltest -L.`，或`g++ main.o -ltest -L/home/threedog/test/`
`LIBRARY_PATH=. g++ main.o -ltest`，或`LIBRARY_PATH=/home/threedog/test/ g++ main.o -ltest`
或者把`libtest.so`拷贝到`/usr/lib`目录下去。

## 运行时链接库

通过上面的方法编译出的`a.out`，运行会报错，通过`ldd`命令查看，发现编译时链接的`libtest.so`成了`not found`
这就引出了第二个问题：如何让程序运行的时候能够找到对应的库。

`-Wl`, `-rpath`就是做这个事情的：`-Wl`代表后面的这个参数是一个链接器参数，`-rpath` + 库所在的目录，会给程序明确指定去哪里找对应的库。
手动将一个目录指定成了ld的搜索目录。

![Wlrpath](/column/basic_cs/compile/Wlrpath.jpg)

另外，也可以通过在环境变量LD_LIBRARY_PATH里添加路径的方式成功运行

![PATH](/column/basic_cs/compile/PATH.jpg)

运行时库的查找顺序：

1. 编译目标代码时指定的动态库搜索路径`-rpath`；
2. 环境变量`LD_LIBRARY_PATH`指定的动态库搜索路径；
3. 配置文件`/etc/ld.so.conf`中指定的动态库搜索路径；
4. 默认的动态库搜索路径`/lib`；
5. 默认的动态库搜索路径`/usr/lib`.

## rpath与rpath-link

> 其实`rpath`和`rpath-link`都是链接器`ld`的参数，不是gcc的

`rpath-link`和`rpath`只是看起来很像，可实际上关系并不大，`rpath-link`和`-L`一样也是在链接时指定目录的。 `rpath-link`的作用，在我们的这个实例中体现不出来。 例如你上述的例子指定的需要`libtest.so`，但是如果 `libtest.so` 本身是需要 `xxx.so` 的话，这个 `xxx.so` 我们你并没有指定，而是 `libtest.so` 引用到它，这个时候，会先从 `-rpath-link`给的路径里找。 `rpath-link`指定的目录与并运行时无关。

## C++头文件的搜索原则

上面提到了编译时链接库的查找顺序和运行时动态库的检索顺序，顺便再提一下C++编译时头文件的检索顺序：

* #include<file.h>只在默认的系统包含路径搜索头文件
* #include"file.h"首先在当前目录以及-I指定的目录搜索头文件, 若头文件不位于当前目录, 则到系统默认的包含路径搜索

顺序：
1. 先搜索当前目录
2. 然后搜索-I指定的目录
3. 再搜索gcc的环境变量`CPLUS_INCLUDE_PATH`（C程序使用的是`C_INCLUDE_PATH`）
4. 最后搜索gcc的内定目录

* /usr/include
* /usr/local/include
* /usr/lib/gcc/x86_64-redhat-linux/4.1.1/include

以上，就是对gcc参数的一些详细总结，下面根据上面的讲解解决几个常遇到的疑问：

**问题1：-l链接的到底是动态库还是静态库？**

* 如果链接路径下同时有 `.so` 和 `.a` 那优先链接 `.so`

**问题2：如果路径下同时有静态库和动态库如何链接静态库？**

* 最好的办法，是参数里直接写上静态库的全路径。
* 另一个办法，可以使用`-static`参数，会强制链接静态库。这种方式生成的文件可以执行，但是文件的`elf`头会有问题，使用`ldd`,`readelf -d`查看会显示不是动态可执行文件。

**问题3：如果文件中没有使用对应的库，编译器是否仍然会进行链接？**

* 这个取决于编译器的类型和版本，我本地gcc5.4，如果没有用到的库，即使写了`-l`也不会链接。而我本地的clang9，则会明确链接对应的库即使我没有用到它。

![Q3](/column/basic_cs/compile/Q3.jpg)