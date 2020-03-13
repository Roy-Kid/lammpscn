# compute系命令概览

## compute

:::tip
参见[compute](https://lammps.sandia.gov/doc/compute.html)
:::

compute命令为一组原子（group-ID）设定某个物理量的计算。它是用来定义计算方式的，如怎么算温度，压力等。

### 语法
```
compute ID group-ID style args
ID = 用户设置的compute命令的名称（ID）
group-ID = 该compute命令所作用的原子组的ID，即执行计算的原子组ID
style = compute命令的类型名（下面有相应的类型列表）
args = compute命令中某些特定类型所需要的参数
```


### 实例
```
compute 1 all temp
compute newtemp flow temp/partial 1 1 0
compute 3 all ke/atom 
```
注意：计算的数值是瞬时值。计算机计算三种样式的数量：全部原子、单一原子和局部原子。请参考[数据类型](/tutorial/data_formate.md)。可以通过compute_modify命令修改默认或用户定义的计算的属性。可以使用uncompute命令删除计算。计算结果可以用thermo_style输出。


### 介绍
compute命令为一组原子（group-ID）设定某个物理量的计算。它是用来定义计算方式的，比如怎么算温度，压力等。计算设定后并不会立刻执行，在相关的fix命令确定后才会执行。compute命令计算出的值为瞬时值，也就是说该值只是由原子在当前时间步或迭代步的信息所得到的。当然，compute命令也可以在内部保存体系在之前一个状态的某些信息。定义compute命令的时候并不会执行计算。真正的计算过程还需要配合其他的LAMMPS命令，比如在计算温度的时候，需要某些fix命令，或需要产生热力学信息的时候，或者需要dump输出到文件中的时候。How to output文档列出了许多需要包含compute命令的不同LAMMPS输出选项，具体可参见文档。
变量引用规则：compute命令的ID只能包含字母、数字和下划线。

compute命令可以计算出三种类型的数值，分别为：

* 全局量（global），是系统维度的量，比如体系的温度；
* 单原子量（per-atom），是每个原子都具有的量，比如每个原子的动能。不在compute命令所指定的原子组内的原子，其单原子量被设为0；
* 局域量（local），是每个处理器基于它们所拥有的原子而计算出的量，比如键之间的距离。产生单原子量的compute命令，在其类型名称（type）中含有单词“atom”，比如ke/atom。产生局域量的compute命令，在其类型名称（type）中含有单词“local”，比如bond/local。类型名称（type）中不包含“atom”或“local” 词的compute命令则产生的是全局量。

另外需要注意的是，一个单独的compute命令只可能产生这三种类型量的某一种，而不会同时产生全局量和单原子量值。但可产生带全局量或单原子量的局域量。具体可参见计算文档。

全局量、单原子量和局域量都有三种存在形式：单独的标量值、一维矢量值或二维数组值。在每种具体类型的compute命令的页面会介绍其会可产生的相应的数值类型和值，比如单原子一维矢量。有些类型的compute命令会产生多种形式的某种类型的量，比如全局标量和全局矢量。

如果要使用（读取）compute命令计算出的相应量的结果，比如下面介绍的几种输出命令，它们需要输出compute命令的计算结果，则可以使用下面的方括号记号来引用它们，其中的ID为compute命令的ID。

| | |
| --- | --- |
|c_ID|	整个标量、整个一维矢量、整个二维数组|
|c_ID[I]|	一维矢量中的某一个元素、二维数组中的某一列|
|c_ID[I][J]|	二维数组中的一个元素|

也就是说，使用一个方括号可以将量的维度降低一个维度（即矢量->标量，数组->矢量）。使用两个方括号会将维度降低两次（即数组->标量）。因此，对于需要采用标量计算值作为输入值的命令，则可通过这种方法来处理矢量和数组的的相应元素。

> 注意：对于某些不需要全部类型的计算结果，而只需要矢量类型（不是标量）的计算值的命令和variables命令，这也就意味着在引用compute计算的量时，不能含糊地使用像c_ID这样的格式，而需要指定其具体形式，即使c_ID格式即可产生标量也可产生矢量结果。这些注意事项会在具体介绍这些命令时作相应的详细解释。

在LAMMPS中，compute命令产生的值可通过以下列出的使用方法进行使用：

（1）由全局温度或全局压强的compute命令产生的结果，可以被恒温或恒压的fix命令使用，或者被variable equal或variable atom命令使用。
（2）全局量的值可以使用thermo_style custom或fix ave/time 命令输出，也可以被variable equal或variable atom命令使用。
（3）单原子量的值可以使用dump custom命令进行输出，也可以使用 fix ave/atom命令对其进行时间平均，或使用compute reduce 命令进行降维，或使用atom-style variable命令的变量对单原子量的值进行引用。
（4）局域量可以使用compute reduce命令进行降维，或者使用fix ave/histo命令进行直方图化，或者使用dump local命令进行输出。

compute命令计算的全局量既可以是“集中”的，也可以是“宽泛”的。“集中”是说其值独立于模拟中的原子数，比如温度。“宽泛”是说其值的大小与模拟中的原子数有关系，比如总的转动能。Thermodynamic output 命令会将宽泛量的值对体系中的原子数进行规范化，主要取决于thermo_modify norm的设置。但对于集中量，它不会进行规范化处理。如果使用其他方法对fix量进行引用，比如变量variable，你需要了解它是集中量还是宽泛量。若想了解更多这方面的解释可参见单独的计算文档。

LAMMPS可以创建其内部的热力学输出计算，而且总会创建三种计算，分别命名为：thermo_temp、thermo_press和thermo_pe。
这种默认的定义与在输入脚本中使用了下面的命令效果相同：
```
compute thermo_temp all temp  计算总温度
compute thermo_press all pressure thermo_temp计算总压力
compute thermo_pe all pe   计算总势能
```
如果热力学输出需要其他类型的量，也可以在compute命令中再添加其他相应的style。具体可以参考thermo_style命令的说明。

可以计算温度或压强的fix命令，比如用于恒温或恒压的fix命令，在其内部也可以创建compute计算。这些在fix命令的页面有相关介绍。

上面列举的所有默认定义的compute计算，都可以通过在输入脚本中使用compute命令定义相应的计算而实现。这些在thermo_modify命令和fix modify命令的页面有介绍。

不论是LAMMPS内部定义的还是用户自定义的compute命令，其设置都可以使用compute_modify命令进行修改。

compute定义的计算可以使用uncompute命令删除。

用户也可以自己通过编写代码创建新的compute命令，其结果的应用与上面提到的引用方法相同，具体可详细参见Modify的页面。

每一种类型的compute命令都有其单独的文档页面来介绍其参数和它具体是做什么的。下面是LAMMPS中可用的compute命令列表。（译注：compute命令会经常增加，所以这里列出的很可能并非全部。）

此处还增加了LAMMPS发行版中可加速计算的compute命令，其可基于CPUs、GPUs、和KNLs加速计算性能。单独的style类型可参见Commands compute页面，其相应参数（g、i、k、o、t）可单独使用也可一起使用以提高计算性能。

另外还有一些用户贡献的compute命令也发布在LAMMPS程序包中。这些类型的fix命令被列在this page。也有一些用于加速CPU和GPU计算速度的compute命令发布在LAMMPS程序包中。这些类型的compute命令被列在this page。


### 相关命令
uncompute、compute_modify、fix ave/atom、fix ave/spatial、fix ave/time、fix ave/histo


## compute_modify
compute_modify命令用来修改过之前定义过的compute命令的一个或多个参数。

### 语法

```
compute_modify compute-ID keyword value ...
compute-ID = 需要修改的compute命令的ID
keyword = extra/dof、extra、dynamic/dof、dynamic可以添加1个或多个关键字
extra value = N 要减掉的自由度的数量
dynamics value = yes or no 计算温度的时候是否重新计算原子数
thermo value = yes or no 是否考虑fix命令计算的势能对总势能的贡献

extra/dof value = N
  N = # of extra degrees of freedom to subtract
extra syntax is identical to extra/dof, will be disabled at some point
dynamic/dof value = yes or no
  yes/no = do or do not re-compute the number of degrees of freedom (DOF) contributing to the temperature
dynamic syntax is identical to dynamic/dof, will be disabled at some point
```

### 实例
```
compute_modify myTemp extra 0
compute_modify newtemp dynamic yes extra 600
```

### 介绍
该命令用来修改过之前定义过的compute命令的一个或多个参数。只有某些特定类型的compute命令支持修改参数。
关键字extra用来指定在计算温度时，减掉几个自由度作为规范化因子。[原文：The extra keyword refers to how many degrees-of-freedom are subtracted (typically from 3N) as a normalizing factor in a temperature computation] 只有那些可以计算温度的compute命令可以使用该选项。The default is 2 or 3 for 2d or 3d systems which is a correction factor for an ensemble of velocities with zero total linear momentum.
如果你需要增加自由度，那么你可以将extra设置为负值。命令compute temp/asphere就是这样的一个例子。
关键字dynamic决定在使用compute命令计算温度的时候，是否重新计算组内的原子数N。只有那些可以计算温度的compute命令可以使用该选项。默认情况下，N是一个常量。如果你将一些原子添加到了系统中（比如使用命令 fixpour or fix deposit），或者可能存在原子的丢失（比如由于蒸发），那么这个选项可以确保在计算的温度是规范化的。
关键字thermo决定是否将一些fix命令计算的势能加入到该compute命令计算出的总势能中。目前只有类型名为pe的compute命令可以使用该选项。


##  uncompute
uncompute命令删除之前使用compute命令定义的约束。
### 语法

```
uncompute compute-ID
compute-ID = 要删除的compute命令的ID
```

### 实例
```
uncompute 2
uncompute lower-boundary
```
### 介绍
删除之前使用compute命令定义的计算。它也会删除使用compute_modify命令对该计算所进行的修改。

