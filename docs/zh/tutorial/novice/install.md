

# 安装LAMMPS

::: tip
本节教程定位到[手册](https://lammps.sandia.gov/doc/Build_cmake.html)的install & Build LAMMPS两节。
:::

::: warning
由于软件的复杂性和配置的多样性，不建议使用除linux以外的操作系统，不建议使用预编译包。本教程为了简明起见，以Ubuntu18.04 LTS 为例，若使用CentOS，请照葫芦画瓢，手动升级编译器和相关依赖。
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

我们强烈建议使用CMake编译。原因在于CMake1.可以自动检测当前环境和所依赖的库路径，2.可以使用预配置文件。

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

准备GPU加速库的依赖：
首先安装[Nvidia显卡驱动](https://www.nvidia.cn/Download/index.aspx?lang=cn)和[Nvidia CUDA Toolkit](https://developer.nvidia.com/cuda-downloads)两个驱动。事实上如果是Ubuntu系统，可以直接在software&updater中选择显卡所使用的驱动。检查是否成功：
```sh
nvidia-setting
nvidia-smi
watch -n 5 nvidia-smi #每5秒输出一次显卡状态
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


# 如果这里还要编译GPU模块，那么请加上：
```
-D PKG_GPU=on      #include GPU package
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

ARCH的参数选择：
![GPU_ARCH](/tutorial/install/gpu_arch.jpg)

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
请注意，此时cmake 文件夹下会有一个名为lmp的可执行文件，此文件就是最终编译结果。如果您看这个名字不爽可以自行重命名，以后开始计算所调用命令就以新名称替换。教程以下均使用lmp/lmp_mpi/lmp_serial均/lmp_gpu均代指此文件。


