

# 安装LAMMPS

::: tip
本节教程定位到[手册](https://lammps.sandia.gov/doc/Build_cmake.html)的install & Build LAMMPS两节。
:::

::: warning
由于软件的复杂性和配置的多样性，不建议使用除linux以外的操作系统，不建议使用预编译包。本教程为了简明起见，以Ubuntu18.04 LTS 为例，若使用CentOS，请照葫芦画瓢，手动升级编译器和相关依赖。**我们强烈建议选择使用cmake安装LAMMPS, 而不是去使用Makefile**
:::

源代码内容：
|文件夹名|描述|
|:---:|:---:|
|README|介绍|
|LICENSE|GPL协议|
|bench|基准测试相关|
|cmake|CMake编译相关|
|doc|文档相关|
|examples|示例相关|
|lib|外部库相关|
|potential|势函数相关|
|python|python接口相关|
|src|源码相关|
|tools|数据前后处理相关|

## 从GitHub下载源代码

使用git命令直接从Github上拉取代码

```
git clone https://github.com/lammps/lammps.git 
```

## 从官方网站下载源代码

在[官方网站](https://lammps.sandia.gov/download.html)上下载压缩包

## 使用CMake编译LAMMPS

**我们强烈建议使用CMake编译。原因在于CMake可以自动检测当前环境和所依赖的库路径，还可以使用预配置文件。**

同时我们将展示GPU加速包的编译，这个包并不影响正常使用，可以跳过。

### 安装依赖

```sh
apt install build-essential
apt install cmake
apt install gfortran    
apt update
apt upgrade
```

FFTW，快速傅里叶变换所需的软件包，如果没有安装其他版本，将会使用LAMMPS自带；如果有其他版本，CMake将会自动检测。

安装并行LAMMPS所需的并行框架mpich，若使用OpenMpi请举一反三。首先去[官方网站](http://www.mpich.org/)下载mpich3的源码，然后

```sh
tar -zxvf mpich3.tar.gz #解压缩
./configure --enable-shared=yes #--enable-shared=yes是必不可少的参数；如果安装到其他路径，注意环境变量的问题。
make
make install
```

### 编译LAMMPS
```sh
cd lammps #进入源码根目录
mkdir build
cd build
```

这里我们需要讨论一下**如何选择需要编译的包**。众所周知，巴比塔不是一伙人建成的，同样，LAMMPS开发组也不会事必躬亲，所以肯定要借助别人的代码来完善功能。由于这些代码的贡献者不同，因此很多功能不能合并到主线当中；又或者是有些包是只有少部分人会用到或者还要依赖其他的工具，因此给出了一个选项，允许各位选择什么包需要编译，什么包不需要。这个文件就叫*.cmake*。

> 什么是编译？

我们打开这个cmake文件，它位于根目录下的cmake文件夹的presets中：

```
# lammps/cmake/presets/minimal.cmake
# 预设文件只打开了少量常用的包，使得编译速度最快且大部分脚本可以使用

set(ALL_PACKAGES KSPACE MANYBODY MOLECULE RIGID)

foreach(PKG ${ALL_PACKAGES})
  set(PKG_${PKG} ON CACHE BOOL "" FORCE)
endforeach()

```

这几行代码是 *不言自明* 的。很显然，`set()`声明了一个名为`ALL_PACKAGE` 的集合，集合中包括了一些包的名称。然后在一个`foreach`循环中，将`ALL_PACKAGE`的包全部`ON`。因此如果你需要加减什么包，可以自行从这个集合中添加或者移除。presets里同时还提供了其他的预设文件可供参考。

```
cmake -C ../cmake/presets/minimal.cmake ../cmake 
```


## 使用Cuda加速

Author：黄诚斌

安装NVIDIA驱动
查询电脑显卡型号, 根据维基百科(https://en.wikipedia.org/wiki/CUDA#GPUs_supported) 上的信息查找自己显卡对应的架构, 以及对应的CUDA版本
![GPU_ARCH](/tutorial/install/gpu_arch.jpg)


首先安装[Nvidia显卡驱动](https://www.nvidia.cn/Download/index.aspx?lang=cn)和[Nvidia CUDA Toolkit](https://developer.nvidia.com/cuda-downloads)两个驱动, 事实上如果是Ubuntu系统, 可以直接在software&updater中选择显卡所使用的驱动. 检查是否成功:
```sh
nvidia-setting
nvidia-smi
watch -n 5 nvidia-smi #每5秒输出一次显卡状态
```

安装完成后将编译器位置添加到环境变量中. 打开`.bashrc` 添加`export PATH=$PATH:/usr/local/cuda-10.2/bin `保存文件后执行`nvcc -V`，如果输出正常，即代表安装成功. 

::: warning
如果出现"binary2txt"相关的错误一定与环境变量有关系
:::

请在`cmake`的时候加上以下参数: 
```
-D PKG_GPU=on      # include GPU package
-D GPU_API=cuda    # value = opencl (default) or cuda
-D GPU_PREC=mixed  # precision setting
                   # value = double or mixed (default) or single
-D GPU_ARCH=value  # hardware choice for GPU_API=cuda
                   # value = sm_XX, see below
                   # default is Cuda-compiler dependent, but typically sm_20
-D CUDPP_OPT=value # optimization setting for GPU_API=cuda
                   # enables CUDA Performance Primitives Optimizations
                   # yes (default) or no
```
例如: 
```
cmake -C ../cmake/presets/minimal.cmake -DPKG_GPU=on -DGPU_API=cuda -DGPU_ARCH=sm_61 ../cmake
```
注意这里精度最好使用混合精度
```
# 调用GPU来做加速，仅需要加入-sf -pk两个flag

mpirun -np 8 lmp_gpu -sf gpu -pk gpu 1 -in in.file

# -sf指在所有支持gpu加速的脚本命令前加上gpu前缀

# 注意这里-pk gpu后跟的是节点数，几块gpu就填几
```

可以通过修改presets下的预置文件来决定哪些包需要安装。更多的参数选择请[查看](https://github.com/lammps/lammps/blob/master/cmake/README.md)。待配置完成后会出现配置结果详情，确认后：
```sh
make 
make install
```
请注意，此时cmake 文件夹下会有一个名为lmp的可执行文件，此文件就是最终编译结果。如果您看这个名字不爽可以自行重命名，以后开始计算所调用命令就以新名称替换。教程以下均使用`lmp`/`lmp_mpi`/`lmp_serial`/`lmp_gpu`代指此文件。


## 使用kokkos加速

::: tip
本节教程定位到[手册](https://lammps.sandia.gov/doc/Packages_details.html#pkg-kokkos)和[安装详情](https://lammps.sandia.gov/doc/Build_extras.html#kokkos)两节。
:::

LAMMPS中很多的style, 都没有专门的cuda加速代码. 这时我们可以使用kokkos库, 将C++代码转化为`OpenMP`或者`CUDA`代码, 在多核系统运行. 在手册中, 所有带有`/kk`前缀的命令都可以通过这个库跑在并行系统上, 只需要在运行时像`CUDA`加上`-sf kk` 这样的参数即可. 

因为kokkos使用了大量的新特性, 因此前提是必须有`C++11`的编译器. 安装kokkos的方法很多, 我们从自动到手动来介绍. 在编译的过程中, 需要选择主机上是否并行和需要选择用来负责计算的设备(offload of calculations to a device). 默认这两个选项都是关闭的. 此外, 指定的硬件的架构必须要和本机匹配. 由于硬件都是向前兼容的, 所以老版本的编译出的文件可以跑在新架构上. 

首先是尽量保证kokkos的GPU架构和LAMMPS的GPU包一致; 如果不一致的话, 在计算开始时的初始化阶段会有一个延迟, 为新硬件编译GPU核心. 如果GPU的大版本不对, 例如5.2和6.0这样, 就会出问题. 简而言之, 好好设置重新编译一遍不费事, 别找麻烦.

为了简化安装, 在`cmake/presets`下有三个预配置文件:`kokkos-serial.cmake`, `kokkos-openmp.cmake`, `kokkos-cuda.cmake`. 可以连用cmake中的`-C`flage来叠加使用配置 
```
cmake -C ../cmake/presets/minimal.cmake -C ../cmake/presets/kokkos-cuda.cmake ../cmake
```

编译配置完成后接着编译
```
make -j8
make install
```

This wraps an nvcc, allowing it to be treated as a real C++ compiler with all the usual flags.

## 使用传统的Make安装

使用`makefiles`编译需要和系统搭配的`Makefile.<machine>`文件, 比如说`src/MAKE`里的各种, 其中包含着编译时的选项和特性. `Make`方法是最传统的方法, 但是似乎相对于`CMake`没有优势. 

### 要求
以下的操作都是在GNU make下进行的, 如果不是GNU make的话最好是先安装或者转到`CMake`方法.
* 支持`C++11`的编译器. Linux下通常是GNU的编译器, 一些老的编译器可能需要`-std=c++11`切换到`C++11`模式; 

### 安装

在编译之前, 你需要手动指定需要编译的包, 使用`make yes-<package>`来添加. 其中`<package>`是需要的包名. 你可以用`make package`查看有哪些包需要编译. 

使用以下命令可以执行默认的LAMMPS编译, 在`lammps/src`下生成`lmp_serial`和`lmp_mpi`:

```
cd lammps/src
make <machine> -jN    # 命令格式, -jN指用N个核编译 
make serial           # 编译串行的LAMMPS执行文件
make mpi              # 编译并行的LAMMPS执行文件
make                  # 查看make帮助
```

编译需要很长时间, 因此可以使用`make <machine> -j N`来并行编译. 同时, 安装[ccache](https://ccache.dev/)可以在,例如代码开发重复编译时节省时间.

在第一遍编译完之后, 任何时候重新编辑了LAMMPS代码, 增添或删除文件, 都需要重新编译和重新链接LAMMPS可执行文件到同样的`make <machine>`命令上. `makefile`的追踪只保证那些需要重新编译的文件呗重新编译, 因此如果你改动了`makefile`, 你需要重新编译整个包. 清空环境需要用`make clean-<machine>`. 

::: tip

编译之前, LAMMPS会手机配置信息, 然后编入到应用程序中. 当你第一次编译LAMMPS时, 会编译一个收集各种依赖的工具. 这可以有效地检测到有哪些模块或者源代码需要重新编译.

:::

### 客制化编译和可选的makefiles

`src/MAKE`中有一些形如`Makefile.<machine>`的文件. 使用`make example`以使用`Makefile.example`. 因此, 以上的`make serial`和`make mpi`分别使用了`src/MAKE/Makefile.serial`和`src/MAKE/Makefile.mpi`. 其他的makefile在这些文件夹中: 

```
OPTIONS    # 关于可以用的特殊设置
MACHINES   # 针对特殊的机器
MINE       # 你自己的特殊设定
```
在makefile文件中, 包含了LAMMPS编译需要的参数和信息, 因此如果手动指定某些参数, 需要修改makefile. 

::: tip

本节教程定位到[手册](https://lammps.sandia.gov/doc/Build_settings.html)的 Optional build settings 一节.

:::

例如我需要指定int数据的字节数, 而不是默认的4比特(21字节). 打开需要用的makefile, 例如我将用`make mpi`命令编译, 就打开`Makefile.mpi`, 在31行找到`LMP_INC`关键字, 在其后加上`-DLAMMPS_BIGBIG`, 保存, 回到`src`下使用`make mpi`编译.

