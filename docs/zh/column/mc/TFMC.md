# TFMC

TFMC，是一个偏置型MC算法，经典案例是加速化学沉积后的表面弛豫过程。看了这个介绍，我觉得是不是可以用这个TFMC来取代之前学过的PLUMED。不过还得确定这个可以用于模拟变形。如果只是模拟弛豫的话，对我来说用处就没那么大了。好像可以模拟结晶、再结晶、晶粒长大？那也不错啊。也许也可以模拟蠕变？

## 语法

```bash
fix ID group-ID tfmc Delta Temp seed keyword value

ID, group-ID, tfmc, seed：不介绍了

Delta：最大位移长度（距离单位）

Temp：系统温度

keyword：com 或 rot

 com args = xflag yflag zflag

xflag,yflag,zflag = 0/1 to exclude/include each dimension

 rot args = none
```

## 例子

```bash
fix 1 all tfmc 0.1 1000.0 18780

fix 1 all tfmc 0.05 600.0 574838 com 1 1 0

fix 1 all tfmc 0.1 750.0 39586 com 1 1 1 rot
```

## 介绍

采用time-stamped force-bias Monte Carlo (tfMC) algorithm来进行uniform-acceptance force-bias Monte Carlo (fbMC) simulations。Tfmc算法出处(Mees) and (Bal).

fbmc通常被用于延长原子模拟的时间尺度，特别是需要考虑长时间的弛豫对结果影响的时候。一些有趣的例子可见(Neyts)。一个典型例子是模拟化学气相沉积过程，其中气相类型的影响可以通过MD实现，但是随后的长时间表面弛豫过程是传统MD难以实现的。使用tfmc算法可以加速表面弛豫，因此可以使用更高的通量，有效延长了分子模拟的时间尺度。（这种交替模拟可以通过loop实现）

tfmc算法加速模拟的能力随体系和研究的过程特点决定，最高能提升几个数量级，但是有些过程并无加速效果。一般来说，固态过程（结晶、再结晶、晶粒长大）最高能加速到几个数量级，液相中的扩散并无加速效果。tfmc模拟得到的动力学过程和MD模拟的动力学过程并不一样，略显粗糙。但是相对重要的过程还是能够匹配上的，只要Delta选的好。总的来说，tfmc就是能更快得到结果，但是过程粗糙。

每一步，所有原子都基于随机tfmc算法发生位移，这用于对温度Temp下的NVT系综采样。虽然tfmc是一种MC算法，严格来说并不进行时间积分；但是他又像那些MD系综一样，原子的位置变换是基于施加于原子上的力决定的。因此，tfmc也可视为时间积分类fix，不能同时和其他时间积分类fix混用（比如NVE）。同时，tfmc并不考虑原子速度，因此“温度”并无实际意义。唯一相关的“温度”是取样温度Temp。

tfmc的关键参数是`Dleta`：系统中最轻（lightest）元素的最大许可位移。Delta越大，模拟的时间尺度越大（近似二次相关）；Delta越小，结果越准确。总的来说，Delta取为最近邻距离的5%~10%之间最为合适。(Bal)对这个问题有更详细的解释，可以根据元素类型取合适的Delta，大概与原子质量的四次方根相关。

由于tfmc中原子的移动互不相关，因此体系的质心会变。`com`关键词可以使每次tfmc进行完之后调整原子的位置，以保持质心不动。com的三个参数代表分别固定三个方向的质心不动。rot就是固定旋转分量。

注意：如果该fix的group内的原子受到外部作用力（通过fix wall产生真实的作用力，或者组外系统的原子对组内原子的作用力），不能使用com和rot。因为一旦移动了，系统内部平衡会被破坏。

## Restart, fix_modify, output, run start/stop, minimize info:

* 该fix的信息不会写入restart中

* 不能使用fix_modify

* Minimize过程中，该fix不起作用

## Restrictions

LAMMPS得预编译好MC包

该fix和fix shake不兼容（P.S. fix shake可以保持分子各键时刻保持平衡距离等，是通过施加一个约束势实现的，而fix tfmc不允许给原子施加外部作用力）