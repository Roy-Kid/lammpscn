---
title: 金属建模
date: 2021-06-22
categories: article
author: 郑腾飞
---

LAMMPS应用领域非常广泛，比如金属、非金属等复杂材料的性能模拟计算。其中开始计算之前模型文件的准备也是必要的，构建出合适准确的模型对计算结果有很重要的影响，基于之前建模的方法和习惯，对金属建模部分进行总结并作为随手笔记，有不正确的地方还请批评指正！

简单金属的模型可以通过多种方法获得：（1）从各种数据库中下载，比如最常用的materials project [Materials Project](https://materialsproject.org/)，里边的模型似乎经过计算验证，可以根据自己的需要进行选择，合金模型同样也能找到；（2）可视化软件`Materials Studio`或`VESTA`凭借其强大的功能也可充当建模工具，定义自己的空间群、晶格常数等参数进行建模；（3）强大的LAMMPS当然也可以完成；现在主要对LAMMPS自带命令建模进行总结：

从LAMMPS命令分类中我们找到初始化及模拟盒子、原子设置的相关命令，集齐这些命令后就可以构建想要的模型了！以下所有命令详细内容见官网，以官网为准。先简单了解下这些命令的语法和含义：

![material_modeling](/column/modeling/mm.png)

```bash
units           style                        # 定义模拟过程中所有参数的单位
※	style = lj or real or metal or si or cgs or electron or micro or nano

atomic_style     style args                    # 定义原子类型
※	style = atomic or molecular or charge or hybrid等

lattice          style scale keyword values …     # 定义体系晶格类型
※	style = bcc or fcc or hcp or diamond or custom等
※	scale = lattice constant in distance units     (定义晶格常数，单位为units距离单位)

region         ID style args keyword arg …       # 定义空间区域大小
※	ID = region的名字
※	style = block or cylinder or plane or prism or sphere or union or intersect等   
    (给定划分区域的形状，比如block为立方体盒子，不同形状需给出对应的参数，详细参数见manual)
※	keyword = side or units or move or rotate or open  
    (可设置的关键字参数，比如默认side=in, units=lattice, no move or rotation。
    units=lattice/box的差别：units lattice表示实际尺寸大小=设置值×单胞晶格常数；
    units box表示实际尺寸大小=设置值（单位为Å）)

create_box     N region-ID keyword value …      # 基于划分区域创建模拟盒子
※	N = 原子类型总数
※	region-ID = 已定义的region名

create_atoms   type style args keyword values …   # 填充原子
※	type = 第#号原子类型
※	style = box or region or single or random

mass           I value                       # 设置质量
※	I = 原子类型
※	value = 相对原子质量

```

## 圆柱形模型

```bash
#########################################################################
#                      Building model in LAMMPS                           #                                                                       
#########################################################################

##### Initiation ########################################################
units                 metal              # metal单位
atom_style            atomic
##### Building ##########################################################
lattice                bcc 3.30            # BCC lattice and lattice constant equal 3.3
region                cylinder cylinder z 10 10 5 0 20      # Shape of cylinder and corresonding parameters

create_box            1 cylinder                 # One type atoms in cylinder box
create_atoms          1 region cylinder           # Creating atoms in cylinder region
mass                 1 1                      # Relative atomic mass of type 1
write_data            cylinder.lmp               # Output the position file

```

![mm1](/column/modeling/mm1.png)

## 球形模型

```bash
#########################################################################
#                      Building model in LAMMPS                         #
#########################################################################

##### Initiation ########################################################
units                 metal                              # metal单位
atom_style            atomic
##### Building ##########################################################
lattice                bcc 3.30         # BCC lattice and lattice constant equal 3.3
region                sphere sphere 0 0 0 8    # Shape of sphere and corresonding parameters

create_box            1 sphere                # One type atoms in sphere box
create_atoms          1 region sphere          # Creating atoms in sphere region
mass                 1 1                     # Relative atomic mass of type 1
write_data            sphere.lmp              # Output the position file

```

![mm2](/column/modeling/mm2.png)

## 球+圆柱组合模型

```bash
#########################################################################
#                      Building model in LAMMPS                          #
#########################################################################

##### Initiation ########################################################
units                 metal                              # metal单位
atom_style            atomic
##### Building ##########################################################
lattice                bcc 3.30          # BCC lattice and lattice constant equal 3.3
region                cylinder cylinder z 10 10 5 0 20        # Shape of cylinder and corresonding parameters
region                sphere sphere 10 10 29 8            # Shape of sphere and corresonding parameters
region                box union 2 cylinder sphere # Region box equal cylinder + sphere
create_box            2 box                            # Two type atoms in box
create_atoms          1 region box              # Creating atoms in all box region
mass                 1 1                      # Relative atomic mass of type 1
mass                 2 10                     # Relative atomic mass of type 2
write_data            cylinder_sphere.lmp        # Output the position file

```

![mm3](/column/modeling/mm3.png)

## 模型的合并

```bash
#########################################################################
#                      Building model in LAMMPS                          #
#########################################################################

##### Initiation ########################################################
units             metal
atom_style        atomic

###### Reading model1 ###################################################
read_data         cylinder.lmp extra/atom/types 1   # Reading model1 cylinder and add one type atoms

###### Reading model2 ###################################################
read_data         sphere.lmp add append offset 1 0 0 0 0 shift 33 33 95.7  # Reading model2 sphere and shift positions

write_data        combine.lmp

```

![mm4](/column/modeling/mm4.png)
