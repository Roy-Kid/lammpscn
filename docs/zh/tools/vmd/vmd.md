# 使用VMD可视化


VMD对Lammps有着非常完美的支持，不仅能读input data，而且完美适配dump。但是，这些文件唯一的缺点是没有显式的拓扑结构信息，仅仅有原子的坐标，因此可视化之后只有点云图像，没有键的信息。下面我们就来讲一下如何生成和导入拓扑信息。

手册中明确讲到，仅有两种拓扑文件可以被VMD读取——.psf 和PARM。我们需要用到VMD中的插件topotools，这可以将input data提取出相关的键，角，二面角信息。由于不论分子如何运动，拓扑结构总是不会变的，因此我们可以将这些信息应用到dump文件中，轻松地制作出任意时刻的snapshot和movie。

1. 打开VMD，在tk console中输入

```bash
topo readlammpsdata file.data
```

注意，其中file.data是脚本所读取的初始构象。鉴于个人写的程序生成的文件可能格式不是很标准，因此可以在LAMMPS 脚本中的任意时刻通过

```bash
write_data file.data
```
输出数据文件以用。由于topo插件仅仅提取其中的拓扑信息，因此哪一时刻的输出的data均可用。如果不出意外的话，tk console中会显示成功并返回0值，Display窗口会出现write_data时刻的snapshot。紧接着再输入:

```bash
animate write psf read.psf
```

在linux系统下，read.psf会和file.data在同一目录下；

在Windows下，本机在:

```bash
C:\Users\your name\AppData\Local\VirtualStore\Program Files (x86)\University of Illinois\VMD
```

考虑到不同机器可能藏在不同的地方，因此安利大家一个神器：Everything。这个不到2MB大小的软件可以一瞬间让你电脑上的任何文件无所遁形，比系统自带的那个废物好用多了。

好了，我相信机智的各位已经拿到了拓扑文件.psf和需要可视化的dump。注意dump建议用custom style输出unwrap坐标(xu yu zu)，否则分子链在越过周期性边界的时候，VMD这个沙雕会按照拓扑的信息生成一个横跨盒子的键，还得用pdctools除去，巨麻烦。

再次打开VMD，NEW MOLECULE，先load你的psf文件，然后仅仅是控制台显示一大堆东西但Display什么都没有。再load你的dump文件，文件格式选择LAMMPS trajectory。BINGO！终于可以得到相应的带有键的分子链了！

剩下的工作就简单了，自己耍去吧！



