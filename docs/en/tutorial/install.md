

# Install LAMMPS

::: tip
This section of tutorial navigate to the official [manual](https://lammps.sandia.gov/doc/Manual.html) Install & Build sections.
:::

::: warning
Owing to the complexity of this software and multiplicity of configuration, only the Linux operation system is recommended and do not use the pre-compile package. This section of the tutorial base on Ubuntu18.04 LST, if yours is CentOs, please upgrade the compiler and related dependencies manually according to the drawings.
:::

These are the files and sub-directories in the LAMMPS distribution:
| README | text file | 
|:----:|:----:| 
| LICENSE | GNU General Public License (GPL) | 
| bench | benchmark problems | 
| cmake | CMake build files | 
| doc | documentation | 
| examples | simple test problems | 
| lib | additional provided or external libraries | 
| potentials | interatomic potential files | 
| python | Python wrapper on LAMMPS | 
| src | source files | 
| tools | pre- and post-processing tools |

## Download the LAMMPS source with git

使用git命令直接从Github上拉取代码

```
git clone https://github.com/lammps/lammps.git 
```

## Download the LAMMPS source from website

[Official website](https://lammps.sandia.gov/download.html)

## Build LAMMPS with CMake

We highly recommend you to build LAMMPS with CMake. The reason is that CMake not only can automatically detect the current environment and the dependent library path avoiding you manually set but you can use preset file.

Meanwhile, we will show the compilation of GPU acceleration package. This package does not affect normal use. You can skip it.

### Install dependency

```sh
apt install build-essential
apt install cmake
apt install gfortran    
apt update
apt upgrade
```

FFTW, the package required for FFT, if no other version is installed, LAMMPS' will be used; if there are other versions, cmake will be automatically detected.

Install the parallel framework MPICH required by parallel lammps. If you use openmpi, please draw a few examples. First go to the MPICH3 to download the source code of [mpich3](http://www.mpich.org/), then:


```sh
tar -zxvf mpich3.tar.gz #decompress
./configure --enable-shared=yes #--enable-shared=yes is an essential parameter; if you install to a different path, pay attention to the environment variables.
make
make install
```

Preparation of GPU acceleration library depends on: first install [NVIDIA driver](https://www.nvidia.cn/Download/index.aspx?lang=cn) and [CUDA toolkit](https://developer.nvidia.com/cuda-downloads). In fact, if it is an Ubuntu system, you can directly select the driver used by the graphics card in Software & Updater. Check if success:

```sh
nvidia-setting
nvidia-smi
watch -n 5 nvidia-smi # output every 5 sec 
```

### complie LAMMPS
```sh
cd lammps # enter the root diractory
mkdir build
cd build

cmake -C ../cmake./presets/minimal.cmake ../cmake 

# if GPU package is required：
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

Here is how to choose ARCH flag：
![GPU_ARCH](/gpu_arch.jpg)

```
# if your simulation command support GPU accelerate, just add two flage:

mpirun -np 8 lmp_gpu -sf gpu -pk gpu 1 -in in.file

# -sf means to add a prefix before input command

# -pk indicates how many nodes of GPU you use
```


You can change the preset file under presets to determine which packages need to be installed. Please check for more [flags](https://github.com/lammps/lammps/blob/master/cmake/README.md) selections. After the configuration is completed, the configuration result details will appear. After confirmation:

```sh
make 
make install
```

Note that there will be an executable named LMP under the cmake folder, which is the final compilation result. If you don't like the name, you can rename it by yourself, and the command you call will be replaced with a new name later. Use LMP / LMP below the tutorial_ mpi/lmp_ Serial average / LMP_ GPU refers to this file.

