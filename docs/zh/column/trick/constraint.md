# LAMMPS中的限制方法
在分子动力学模拟中，无论是出于节省计算资源的目的，还是出于人为地对某些结构进行控制的目的，都会涉及到对系统的运动自由度加以限制。这种额外的影响系统中粒子运动自由度的限制条件，称为约束。

## 刚性约束

在一些模拟中，往往需要让某些结构保持特定的构型，例如SPC、TIP3P、TIP4P等水分子模型要求键长和键角保持固定值，溶液中一个硅石纳米颗粒的所有原子需要保持整体刚性运动等，这时就要引入刚性约束。根据约束对象和约束条件的不同，也会有不同的约束方法。

第一种刚性约束为限制约束，可用于将两个原子（无论成键与否）进行键限制 $U_{\alpha \beta}=k_l(l_{\alpha \beta}-l_0)^2$ ，将三个原子进行键角限制 $U_{\alpha \beta}=k_{\theta}(\theta_{\alpha \beta \gamma}-\theta_0)^2$ ，将四个原子进行二面角限制 $U_{\alpha \beta \gamma \delta}=k_{Phi}[1+\cos(n\Phi_{\alpha \beta \gamma \delta}-d)]$ 。在LAMMPS中，可以通过`fix restrain`命令实现这一功能，这相当于人为让若干原子成键、成键角或成二面角，从而限制它们的运动。但和直接在.data文件中指定拓扑结构是有区别的：`fix restrain`命令建立的限制是“临时”的，可以随时`unfix`掉；另外，`fix restrain`命令所成的键、键角、二面角目前只支持前述的几种力场形式，但其中的力场参数是可以随时间线性变化的。这种约束的最终效果是让被约束的若干原子以一定的拓扑形态出现，其分子结构仍有一定的运动灵活性。

第二种刚性约束为反力约束，通过对原子施加反力，使其固定在某个特定的构型上。根据约束条件的不同，分为SHAKE算法和RATTLE算法两种。对于两个受约束的原子 $\alpha$ 、 $\beta$ ，记做：

$$\vec{r}_{a, \beta}^{(n+1)}=\vec{r}_{\beta}^{(n)}-\vec{r}_{a}^{(n)}$$

则SHAKE算法要求，

$$\vec{r}_{a, \beta}^{(n+1)} \cdot \vec{r}_{a, \beta}^{(n+1)}=l^{2}$$

即$\alpha$ 和$\beta$的距离严格等于给定值 $l$ ；RATTLE算法除了满足这个约束条件外，还需满足:

$$\vec{v}_{a, \beta}^{(n+1)} \cdot \vec{r}_{a, \beta}^{(n+1)}=0$$

即沿原子对方向不存在速度分量。这两种约束方法通常用于使某个键、键角保持刚性，例如SPC、TIP3P、TIP4P水分子模型中对O—H键长和H—O—H键角的刚性要求。虽然这种约束的最终效果是保持键长和键角的值不变，但仍需对要约束的键、键角分配力场，因为约束算法要根据原子当前的受力来计算附加的约束反力，从而使原子的位置（和速度）在下一个时间步满足SHAKE或RATTLE约束条件。因此，在一定意义上而言，分配的力场是为施加约束反力服务的，可以不必拘泥于力场的形式，最终约束效果都是相同的。但不同的力场形式和参数对约束算法的效率有很大影响，力场和约束条件相匹配（例如`bond_style harmonic`中的平衡键长参数与SHAKE约束中的 $l$ 值相等）会有利于提高反力约束的收敛速度。反力约束的命令代码示例如下。

```
fix 1 all shake 1e-4 50 0 b 1 a 1
# or
fix 1 all rattle 1e-4 50 0 m 15.9994 a 1 2
```

需要注意的是，为了保证算法的正确性，若原子还参与其它力约束条件，`fix shake`命令应放在其它力约束之后；`fix rattle`命令应放在其它力约束和动力学积分命令之后。

第三种刚性约束为刚体约束，可以在更大范围内实现粒子间的刚性限制。例如一个纳米颗粒在溶液中的运动，有时为了节省计算资源，可以将纳米颗粒当作一个整体来对待。刚体约束就是将若干原子构成的结构视为一个整体，在每个时间步会根据各个原子的受力情况计算得出整体受到的总力和总扭矩，进而对刚体中的所有原子同步更新位置和速度，以保证刚体在运动中不发生形变。刚体约束的命令代码示例如下。

```
fix 1 all rigid molecule

fix 1 all rigid molecule force * off off on

fix 1 np rigid/npt molecule temp 300 300 100 iso 50 50 1000
```

对于刚体内部的各个原子，由于彼此之间并不发生相对运动，因此可以通过`neigh_modify exclude`、`delete_bonds`等命令将相互作用消除，以节省计算资源。另外，需要强调的是，`fix rigid`系列命令在进行刚体约束时，本身也负责动力学方程的积分，因此不能与动力学积分相关的命令联用。当体系中同时包含刚体部分和非刚体部分时，需要分别为它们进行系综设置。下面一些设置代码都是合法的。

```
fix 1 rigidpart rigid/nve molecule
fix 2 otherpart nve

fix 1 rigidpart rigid/nve molecule langevin 300 300 100 428984
fix 2a otherpart nve
fix 2b otherpart temp/berendsen 300 300 100

fix 1 rigidpart rigid/nvt molecule temp 300 300 100
fix 2 otherpart nvt temp 300 300 100 tchain 4

fix 1 rigidpart rigid/npt molecule temp 300 300 100 iso 50 50 1000 dilate all
fix 2 otherpart nvt temp 300 300 100

fix 1 rigidpart rigid/nvt molecule temp 300 300 100
fix 2 otherpart npt temp 300 300 100 iso 50 50 1000 dilate all

fix 1 rigidpart rigid/nvt molecule temp 300 300 100
fix 2 otherpart nvt temp 300 300 100
fix 3 all press/berendsen iso 50 50 1000
```

上面的第1个算例执行的是NVE系综的模拟，第2~3个算例执行的是NVT系综的模拟，而第4~6个算例执行的均是NpT系综的模拟。由于控压是通过改变整个体系的体积（而不是某个编组的“分体积”）实现的，故压强计算的是整个体系的压强（无论相关命令对应的编组是否为`all`），所以只允许在一个动力学积分命令中指定压强的控制。第4个算例是在`rigidpart`编组设置控压，并通过`dilate all`关键字对整个体系的原子进行坐标重标；第5个算例是在`otherpart`编组设置控压，并通过`dilate all`关键字对整个体系的原子进行坐标重标；第6个算例是对`all`（`rigidpart`+`otherpart`）编组进行NVT模拟，然后再对all编组施加标度控压方法（此时不能施加系综控压方法，否则会造成积分命令的联用），最终实现NpT系综的模拟。

更复杂的刚体约束可以通过专门的多体动力学软件POEMS来实现，LAMMPS通过`fix poems`命令提供了接口，用于调用POEMS软件包进行刚体链的动力学模拟。

## 运动约束

运动约束指的是对某些粒子运动状态加以控制，以达到特定目的的约束方式，例如通过受控层的整体法向或切向运动给固体或流体施加应力，通过“刀具”的整体移动实现对“工件”的切削，通过施加偏倚力使目标分子沿特定的路径（在计算平均力势时通常称为反应路径）移动到指定位置等等。根据约束施加方式的不同，一般可分为力约束和位置/速度约束两类。

第一类运动约束称为力约束，主要是通过改变粒子的受力来调整其运动状态。在LAMMPS中常用的力约束命令包括大小调节（`fix addforce`、`fix aveforce`、`fix setforce`等）和方向调节（`fix lineforce`、`fix planeforce`等），此外还包括一些零散的命令，用于实现特殊的约束目的。涉及力的大小调节的三个命令用法比较相似，都是对指定编组的原子受力进行调整，但三者的处理细节有所不同。`fix addforce`命令是在编组中原子当前受力的基础上给每个原子额外添加一个力:

$$\vec{F}_{i, \mathrm{add}}=\vec{F}_{i}+\vec{F}_{\mathrm{ex}}$$

类似的还有一个`fix addtorque`命令，可以额外添加一个扭矩。`fix aveforce`命令则是首先对编组中每个原子的受力进行平均处理，然后再给每个原子额外添加一个力:

$$\vec{F}_{i, \mathrm{ave}}=\frac{1}{n} \sum_{i=1}^{n} \vec{F}_{i}+\vec{F}_{\mathrm{ex}}$$

这个命令的作用结果会使编组内的每个原子受力情况均相同；当添加的力为零时，该命令相当于把编组内原子的受力平均化。`fix setforce`命令则完全忽略编组内原子的当前受力，直接将每个原子的力设定为给定值:

$$\vec{F}_{i \text { set }}=\vec{F}_{\mathrm{ex}}$$

涉及力的方向调节的命令中，`fix lineforce`命令将只保留沿给定方向的力分量:

$$\vec{F}_{\operatorname{line}}=\vec{F} \cdot \vec{l} \frac{\vec{l}}{\|\vec{t}\|^{2}}$$

`fix planeforce`命令则只保留法向为给定方向的平面内的力分量:

$$\vec{F}_{\text {plane }}=\vec{F}-\vec{F} \cdot \vec{n} \frac{\vec{n}}{\|\vec{n}\|^{2}}$$

第二类运动约束是位置/速度约束，这类约束通过重标粒子的位置或速度来改变其运动状态。根据控制的需要，可能同时对粒子的位置和速度进行更新，也可能只更新位置，或者对位置和速度都不更新。

这类约束方法中较常用的是`fix move`命令，它可以按特定的要求更新原子的位置和速度，使用该命令中的`variable`关键字，原则上可以实现对编组中每个原子的位置和速度进行独立的控制。需要注意，由于该命令直接参与粒子位置和速度的更新，所以不能与`fix nve`、`fix nvt`、`fix npt`等动力学积分相关的命令联用，否则设定的运动状态会被动力学积分破坏掉。`fix nve/noforce`命令则只更新原子的位置，不更新速度（即速度不发生变化，相当于没有力的作用），这个命令适用于模拟恒速运动的墙，速度可由`velocity`命令进行指定，或由`fix nve/noforce`命令被执行时刻的状态决定。该命令同样不能与动力学积分命令联用。如果既不想更新原子的位置，也不想更新其速度，最简单的做法是不对相应的编组进行动力学积分，其结果是该组原子在整个模拟中相对于盒子保持零温绝对静止，但由于力场是存在的，所以这组原子仍会对其它原子产生力的作用。事实上，LAMMPS有很多种方法可以实现零温静止，以下几种方法都是正确的:

```
velocity motionless set 0 0 0
fix 1 motionless setforce 0 0 0
fix 2 all nve

velocity motionless set 0 0 0
fix 1 motionless rigid single force * off off off torque * off off off
fix 2 other nve

fix 1 motionless move linear 0 0 0
fix 2 other nve

velocity motionless set 0 0 0
fix 1 motionless nve/noforce
fix 2 other nve

#不积分motionless编组
fix 2 other nve
```

对于位置/速度约束，另一个可能会用到的命令是`fix recenter`，这个命令通过调整原子的坐标，可以使编组的质心固定到指定点，该命令需要放到动力学积分命令之后使用。`fix oneway`命令可以控制粒子只能沿一个坐标方向移动，可用于模拟半透膜的特性。`fix smd`命令可以将一个组的原子恒速或恒力拉向指定点或拉向另一个组，可用于进行伞形偏倚采样以计算平均力势。总体而言，LAMMPS中的运动约束比较灵活，往往有多种方式可以实现相同或相似的约束效果。读者可以任选其一，也可对多种方法进行评估后选择效果较好、计算资源开销较低的方法。

## 墙

在分子动力学模拟中，墙是一种特殊的边界处理方法。和周期边界条件不同，当粒子遇到墙时，通过二者的相互作用会对粒子的运动产生影响，墙是一种“真实”的物理存在。在LAMMPS中，包括两种概念的墙：粒子墙和虚拟墙。

粒子墙就是由实际粒子构成的墙，它是初始构型的一部分。根据模拟需求的不同，对粒子墙的设置又分为硬墙和软墙两类。硬墙是在整个模拟过程中不发生形变的墙，应用第2节的各种运动约束即可实现硬墙的模拟。由于墙原子之间没有相对运动，因此建议使用`neigh_modify exclude`命令排除墙原子之间的相互作用。软墙则是允许发生一定形变的墙，根据允许的形变方式和程度不同，软墙并没有固定的实现范式。一个简单的方法是使用`fix spring/self`命令使墙原子可以在自身初始位置附近做小幅振动。另一个较为通用的方法是先构建一个零温绝对静止且不和主体部分相互作用（不设置力场或力场参数设置为0）的墙，然后在墙的表面层通过键作用连接一层原子，这层原子与主体部分有相互作用，且参与动力学积分。这样，这层原子就扮演了软墙的角色，是一种半限制性的软墙。如果想让软墙更加“柔软”，还可以在表面层原子上再键连一层或多层原子。

LAMMPS里的另一类墙是虚拟墙，这种墙并不包含实际粒子，而是通过划定一个区域，使区域表面对粒子产生“作用力”而达到墙的效果。虚拟墙包括反射墙、光滑墙和粗糙墙三种类型。反射墙由`fix wall/reflect`命令来实现，当粒子的运动跨越墙表面时，粒子位置更新到镜面反射位置，垂直于墙面的速度分量变为其相反数，最终效果相当于粒子对墙面的完全弹性碰撞。光滑墙由一系列`fix wall/**`命令构成，墙对指定编组的粒子只产生法向作用力，作用力的大小由粒子到墙面的距离和墙的力场类型决定。粗糙墙则由`fix wall/gran`命令来实现，墙对粒子可同时产生法向和切向作用力，其中切向力相当于墙对粒子的摩擦作用，因而称这种墙为“粗糙”墙。上述各命令产生的墙只能是沿坐标轴方向的平面墙（目前版本的`fix wall/gran`还可以生成母线方向为z方向的圆柱墙）。如果想得到形状更加复杂的几何墙面，可以使用`fix wall/region`和`fix wall/gran/region`命令，它们可以将一个事先定义好的区域的表面当作墙面。