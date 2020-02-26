

# 安装LAMMPS

::: tip
本节教程定位到[手册](https://lammps.sandia.gov/doc/Manual.html)的install & Build LAMMPS两节。
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

cmake -C ../cmake./presets/minimal.cmake -D PKG_GPU=on ../cmake 
```
可以通过修改presets下的预置文件来决定哪些包需要安装。更多的参数选择请[查看](https://github.com/lammps/lammps/blob/master/cmake/README.md)。待配置完成后会出现配置结果详情，确认后：
```sh
make 
make install
```
请注意，此时cmake 文件夹下会有一个名为lmp的可执行文件，此文件就是最终编译结果。如果您看这个名字不爽可以自行重命名，以后开始计算是所调用命令就以新名称命名。教程以下均使用lmp代指此文件。


