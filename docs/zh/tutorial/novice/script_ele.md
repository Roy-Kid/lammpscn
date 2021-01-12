# 脚本入门

::: tip
本节教程定位到[手册](https://lammps.sandia.gov/doc/Commands_input.html)的5.1-5.3节
:::

* LAMMPS的脚本语法风格是类UniX风格；
* LAMMPS逐行读取并执行脚本，直到某些命令启动计算；
* 因此很多设定命令都是无所谓先后的，但:
* 有些命令只有在特定的命令后才会生效；
* 有些命令依赖于上一个命令中的设定值。

## 语法规则

LAMMPS命令大小写敏感；脚本的每一行将会是一条指令; 所有的命令都为小写，因此可以使用大写作为ID。

1. LAMMPS命令大小写敏感；
2. 脚本的每一行将会是一条指令;
3. 所有的命令都为小写，因此可以使用大写作为ID。
2. 若一行开头字符为`#`， 本行将会被认为是注释而被忽略；
3. 与Unix相似，`$`和`${}`都表示变量。区别在于，单$后只能跟一个**字母**，`${}`其中允许单词和表达式；

```
variable X equal (xlo+xhi)2+sqrt(v_area)
region 1 block $X 2 INF INF EDGE EDGE # 单$用法
```
`$()`将立刻解释括号中的数学表达式，或者是用于C语言风格的格式控制。

上式等价于：
```
region 1 block $((xlo+xhi)2+sqrt(v_area)) 2 INF INF EDGE EDGE # $()用法
print "Final energy per atom: $(pe/atoms:%10.3f) eV/atom" # 格式控制
```

任何形式的`$`都不允许嵌套, 以下将不被允许：

```
print    "B2 = ${$x-1.0}"
```

但是可以用`v_` v变量代替：

```
print    "B2 = $(v_x-1.0)"
```

4. 与其他编程语言相似，标识符间使用空格隔开；
5. 一行第一个单词为命令名，其后的所有单词均为参数；
6. 若一条命令过长需要换行，于行末添加`&`，LAMMPS会将本行于下一行视为同一行；单引号`'`与双引号`"`包裹的一串单词被视为一个参数。三引号`"""`包裹的多行被视为一个参数，此时不需要&作为换行符。

## 脚本结构

一个LAMMPS input script通常分为四部分：

1. Initialization；
2. System definition；
3. Settings；
4. Running；

系统的定义和初始化部分通常仅需说明一次，而过程设置可以重复多次；如在定义好体系后，设置，计算，修改设置，再运算。以下会给出常用的参数，其他大量的功能请到手册中查询。

#### Initialization 初始化

定义与系统全局相关的参数，如：

* units 
* dimension 
* boundary
* atom_style
* bond_style
* pair_style 
* dihedral_style 

#### System definition 系统设定

读取构建的模型数据，或读取restart文件，或使用内置明令构建简单模型：

* read_data
* read_restart
* lattice, region, create_box, create_atoms

#### Settings 设置

设定系统全局的温度，压力等，设定系统局部的受力，限制等；使用计算命令输出参数等。

* pair/angle/dihedral/improper_coeff
* special_bonds
* neighbor
* fix
* compute

#### Running 开始计算

* minimize
* run

## 数据文件格式

::: tip
本小节教程定位到[手册](https://lammps.sandia.gov/doc/read_data.html)的Commands-read_data-Format of a data file一节。
:::

data文件指由别的软件建立好，供LAMMPS读取的关于粒子坐标，拓扑等信息的文件，由*开头（header）*和*主体（body）*组成，并不固定。即，有一些参数，如势函数的值，既可以在data文件中提供，也可以在input文件中提供。

data文件的*开头*部分。data文件第一行**必须**是由`#`开头的注释，注释内容不定。接下来会逐行解读系统信息。如“lo/hi”指定盒子尺寸，“dimension”指定维度，“boundary”说明边界条件等。

data文件的*主体*部分，展示了导入软件的模型信息，包括粒子坐标，键接信息，键角信息等。

## 举个栗子

这是一个简单的[高分子拉伸模拟](https://icme.hpc.msstate.edu/mediawiki/index.php/Deformation_of_Amorphous_Polyethylene.html)，我们以其中的弛豫部分为例，讲解LAMMPS脚本结构

```
# Initialization
units		real   # 指定系统采取的单位
boundary	p p p   # 指定边界条件
atom_style	molecular   # 指定粒子类型

# Data reading
read_data	polymer.data   # 读入模型信息

# Setting->Atom definition
bond_style      harmonic   # 类型
bond_coeff	1 350 1.53   # 势函数参数
angle_style     harmonic  
angle_coeff	1 60 109.5
dihedral_style	multi/harmonic
dihedral_coeff	1 1.73 -4.49 0.776 6.99 0.0
pair_style	lj/cut 10.5
pair_coeff	1 1 0.112 4.01 10.5

#####################################################
# Setting->system definition
velocity 	all create 500.0 1231   # 给定初始化速度
fix		1 all npt temp 500.0 500.0 50 iso 0 0 1000 drag 2   # 设置NPT系综，设定温度
thermo_style	custom step temp press
thermo          100   # 输出热力学参数
timestep	0.5   # 时间步长
run		50000   # 运行总步数
unfix 1   # 取消设定
unfix 2
write_restart 	restart.dreiding2   # 输出重启文件
```

由此我们可以看出，既然脚本是逐行解释，那么我们只需要按照正常的思路给出相应的参数即可。至于通过什么命令，命令怎么使用，把手册当成字典就好了。

那么我们再来看Data（部分）。LAMMPS为了使原子和类型等之间区分，将所有的类型都映射成整数的id，那么我们就得到atom id，molecule id，type id等用整数表示的

```
# Model for PE   # 描述，不可少

     10000     atoms   # 原子总数
      9990     bonds   # 键总数
      9980     angles   # 键角总数
      9970     dihedrals    # 二面角总数

         1     atom types   # 原子类型数
         1     bond types
         1     angle types
         1     dihedral types

    0.0000   80.0586 xlo xhi   # 盒子的起止位置，指明大小
    0.0000   80.0586 ylo yhi
    0.0000   80.0586 zlo zhi

Masses   # 原子质量：

         1          14.02

Atoms   # 原子信息：atom-id molecule-id type-id x y z

         1         1         1    8.6550   61.6668    5.4094
         2         1         1    8.6550   60.5849    6.4912
         3         1         1    7.5731   59.5030    6.4912
         4         1         1    6.4912   60.5849    6.4912

Bonds    # 键接信息：bond-id，bond-type，id为1的原子和2相连

         1         1         1         2
         2         1         2         3
         3         1         3         4

Angles   # 键角信息

         1         1         1         2         3
         2         1         2         3         4

ihedrals    # 二面角信息

         1         1         1         2         3         4
```

由此，我们介绍完了input和data的格式，通过举一反三，可以宏观上对软件的操作有所了解。至于如何配置input文件，取决于各位设计的实验和需要计算的参数；至于如何生成有着成百上千原子的data文件，这个就是LAMMPS的局限了，我们需要其他的软件来做这件事。