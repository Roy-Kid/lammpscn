# velocity

:::tip
参见[velocity](https://lammps.sandia.gov/doc/velocity.html)
:::

velocity命令用于设置或改变一种或多种原子类型的原子的速度。

## 语法
```
velocity group-ID style args keyword value ...
```

## 介绍
velocity命令用于设置或改变一种或多种原子类型的原子的速度。对于每种类型的原子，都需要有参量和可选的关键词或参量。不是所有的可选项都在每一个类型中使用到，每一个可选项有一个默认值。以某一种类型（style）设置或改变指定的一组原子（group-ID）的速度。对于不同的style，所需要的args和可选的keyword value也不尽相同。
* group-ID = 被更改速度的原子组的名称ID
* style = create or set or scale or ramp or zero

* create args = temp seed，以某一随机数种子产生随机数，提供指定temp下原子的速度，使得指定原子的速度整体满足设定的温度
    temp = 温度值 (temperature units)
    seed =随机种子 # seed (正整数)

* set args = vx vy vz，将组内所有原子的速度分量vx, vy , vz设置为指定值（即赋予一个相同的速度），如果是NULL，则没有指定；vx,vy,vz = 速度值或 NULL (velocity units)，vx,vy,vz是变量
any of vx,vy,vz can be a variable (see below)
* scale arg = temp，先计算组内原子的当前温度，然后再将原子速度标定到指定温度（temp）；

* ramp args = vdim vlo vhi dim clo chi，以一定的梯度沿着某一方向给组内原子设置速度；在vx、vy或vz方向上施加从vlo到vhi的速度梯度。
    vdim = vx or vy or vz
    vlo, vhi = 较低或较高速度值 (velocity units)
    dim = x or y or z
    clo,chi = 上下坐标界限 (distance units)
* zero arg = linear or angular，调整组内原子的速度使得线动量或角动量为0。
    linear = 线动量为零
    angular = 角动量为零
    zero or more keyword/value pairs may be appended

* keyword = dist or sum or mom or rot or temp or bias or loop or units
dist value = 均匀或高斯分布，create使用，以uniform或gaussian分布将速度设置在最小和最大值之间；
sum value = no or yes，除zero之外所有使用；sum=yes将新速度加到原来的速度上，no将直接替换；
mom value = no or yes，create使用；mom=yes，新速度的线性动量为0，rot=yes，角动量为0；
rot value = no or yes，create使用；mom=yes，新速度的线性动量为0，rot=yes，角动量为0；
temp value = 温度计算的ID，create & scale使用；指定一个以一定方式计算温度的compute；
bias value = no or yes
loop value = all or local or geom，create使用；决定对哪些原子设置速度；
* rigid value = fix-ID
fix-ID = ID of rigid body fix
units value = 盒子或晶格，set & ramp使用；指定单位为lattice或box。

注意：如果组被指定为NULL，那么将不被设置。任何vx，vy，vz速度分量都可以指定为equal-style 或 atom-style的变量。如果值是一个变量，它应该被指定为v_name，其中name是变量名。在这种情况下，将对该变量进行计算，其值用于确定速度分量。如果使用变量，其计算的速度必须以盒子为单位，而不是晶格单位;请参阅以下单位关键字的讨论。Equal-style变量可以指定为具有各种数学函数的公式，其中包括用于模拟框参数或其他参数的thermo_style命令关键字。Atom-style变量可以指定与等样式变量相同的公式，但也可以包括原子值，如原子坐标。 Scale style计算原子组的当前温度，然后将速度调节到指定温度的速度。Rampstyle从vlo到vhi （较低到较高速度值）匀加速的速度被应用到vx或vy或vz。分配给特定原子的值取决于其从clo到chi（上下坐标界限）的相对坐标值。例：y坐标为10（从5到25的1/4）的原子将被分配为1.25的x速度（从0.0到5.0的1/4）。坐标边界之外的原子（在这种情况下小于5或大于25），分配的速度等于vlo或vhi（在这种情况下为0.0或5.0）。

## 实例
```
velocity all create 300.0 4928459 rot yes dist gaussian 
```
赋予每个原子随机速度（高斯分布），定义初始温度300k。

```
velocity all create 300.0 49284 dist Gaussian
```
其中all表示赋予所有原子；300.0 为300 K；create类型：通过一个随机数发生器，利用特定的初始温度创建一个整体速度；49284为随机数种子；dist gaussian为原子速度分布满足高斯分布。

loop = geom，对于每个原子都有基于xyz坐标的独一无二的随机数产生。这是一个快速回路并且分配给特别原子的速度将是一样的，独立于有多少处理器被使用。geom选项将不必要对不同机器上运行的两个模拟分配完全相同的速度。这是因为基于xyz坐标的运算指令对储存在一个特定机器的双精度坐标值的微小变化是敏感的。
如果units = box，被velocity命令指定的速度和坐标是被units描述的标准单元。
