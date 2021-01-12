# GCMC 巨正则蒙特卡洛

## 语法

```bash
fix ID group-ID gcmc N X M type seed T mu displace keyword values ...

N：每N步来一个这个fix

X：每N步进行约X次GCMC交换（应该是交换原子的意思吧，未确认）

M：每N步进行约M个MC试移动

type：插入原子的类型（gcmc应该会在随机位置插入溶质原子）

seed：随机种子数（正整数）

T：大热浴系统的温度（温度单位）

mu：大系统的化学势（能量单位），看文献应该是0.*eV这么大，自己试

displace：MC移动原子距离的最大值（长度单位）

keyword：

a) mcmoves：Patomtrans=MC moves中原子平移的比例

b) rigid：fix-ID=fix rigid/small命令的ID

c) shake：fix-ID=fix shake命令的ID

d) region：region-ID，进行GCMC交换原子和MC移动原子的区域

e) pressure：大系统的压强（压强单位）

f) fugacity_coeff：大系统的逸度系数（无单位）

g) full_energy：进行GCMC交换和MC移动原子时，计算系统的总能量（能量单位）

h) charge：插入原子的电荷量（电荷单位）

i) group：group-ID=要把原子插入到哪组原子中（字符串）

j) grouptype：type（插入原子的类型（正整数）） group_ID（要把原子插入哪个组中）

k) tfac_insert：按该比例提高/降低插入原子的温度（无单位）

l) overlap_cutoff：删除重叠原子的最大cufoff 距离

```

## 例子

```bash
fix 2 gas gcmc 10 1000 1000 2 29494 298.0 -0.5 0.01

fix 3 water gcmc 10 100 100 0 3456 3.0 -2.5 0.1 mol my_one_water maxangle 180 full_energy

fix 4 my_gas gcmc 1 10 10 1 12345 300.0 -12.5 1.0 region disk
```

## 介绍

GCMC，全称grand canonical Monte Carlo，中文为巨正则系统蒙特卡罗模拟。假设系统与一个假想的大系统接触，该系统具有温度`T`以及化学势`mu`。所研究的系统与大系统可发生能量交换与粒子交换。同时，系统内部（或者内部某区域）也可以进行常规MC的试移动（trial move）。如果GCMC和NVT一起用的话，那么系综变为muVT（系统的化学势，体积，温度保持不变）。具体用途包括计算微孔材料的等温线，气液共存曲线等。

每N步，系统进行一次GCMC交换（向系统插入或删除粒子），并进行试移动。在这N步当中，GCMC交换的次数约为X次，MC试移动的次数约为M次。GCMC插入和删除粒子的概率是相等的。

对于原子系统，MC的试移动就是平移原子。平移原子的比例由关键词`mcmove`定义。如果使用`mol`关键词的话，那么就是旋转或平移分子；如果不使用`mol`关键词的话，那么就是平移原子。M怎么取值？所研究的区域有多少原子，M就大概取那么多，这样子保证每次MC试移动时，每个原子都试了一次。

GCMC中插入的原子会添加到两类组中：默认的组为`all`，另一种是fix开头定义的group。此外，原子也会添加到由关键词`group`和`typegroup`定义的组中。如果是原子的话（不是分子），那么插入的原子会被赋予原子类型`type`。

::: warning
GCMC指令最好只运用到指定的组中，这个组包含你想用MC进行操作的原子。虽然fix可以运用到默认的all中，但是不推荐。
:::


GCMC只能插入那些指定类型的原子（only atoms with exchanged type），但是GCMC删除原子，MC平移原子这些可以对group内的任意原子操作。模拟盒子中的所有原子都可以采用常规的时间积分平移来移动，比如`fix nvt`，这样就可以进行hybird GCMC+MD。进行这种复合模拟需要采用的timestep比常规的要小一些，特别是如果分子还没弛豫好的时候。

该fix命令也可以选择用`region`来定义一个exchange和move的空间（这里的volume可能代表这个意思吧）。`region`得预先定义，并且是region的`in`侧（定义region的时候可能的指定side=in）。插入原子就只能在该region内发生。
 
(a)插入原子：如果region非矩形，那么GCMC会尝试在矩形边界框（就是模拟盒子吧）内随机插入原子，直到某点落在该region中。如果试了1000次都没有一个点在region中，就不插入原子了，但是这也算一次insertion操作。
(b)移动（`move`）和删除（`delete`）原子：就从该region中选择原子进行操作。如果没有实现预想的移动/删除原子，那也算一次MC操作。如果尝试move的原子到了region外边，不算数，再来一次。 重复上述过程，直到原子或分子的质心在region内部。

如果使用了NVT系综，那么大系统的温度就是NVT指定的温度T，否则会与小系统产生热学不平衡。需要注意，fix nvt所使用的的温度是`dynamic/dof`的，可以通过如下方式定义：

```bash
compute mdtemp mdatoms temp
compute_modify mdtemp dynamic/dof yes
fix mdnvt mdatoms nvt temp 300.0 300.0 10.0
fix_modify mdnvt temp mdtemp 
```

由于fix gcmc会导致每一个step，原子的近邻表都会发生变化，因此体系不能太小（N不能太小）。定期重建近邻表是十分必要的，能够避免出现丢失原子的错误（原子move的距离超过了skin）。更重要的是，能够避免一步内出现进行太多的MC。

GCMC插入原子的位置在所选的simulation cell或者region中随机选定，速度根据体系的温度`T`随机给定。插入原子的速度可用关键词`tfac_insert`提高或降低。

插入分子才用关键词`mol`，插入原子不用这个。如果不用`mol`的话，（然后体系里还有分子），那就得注意GCMC别删除了分子上的原子了。删了就会报错。

注意：插入分子还有一些别的问题，这里自己去看吧。比如`mol`得配合`shake`关键词使用。

使用`mcmove`关键词可以指定不同MC move的相对比例，参数为`Patomtrans`, `Pmoltrans`, `Pmolrotate`，分别用于描述原子平移，分子平移，分子旋转的比例。如（10,30,0）表示25%的MC move为原子平移，75%的为分子平移，0%为分子旋转。

GCMC插入的原子类型是被指定好的，但是删除的原子类型就随机了，总之就是从fix指定的`group`中删除。和前面提到的一样，这里的group可以是`all`或者在fix指定好（开头的group，或者用group和typegroup指定的）。

化学势是一个用户指定的参数：

$$\mu=\mu^{i d}+\mu^{e x}$$

$\mu^{e x} $是由于能量相互作用产生的化学势，对于假想的大系统$\mu^{e x}$，对于所研究的小系统其不为零。因此，虽然虽然大小系统的化学势相等，但是$\mu^{e x}$并不相等。这就使得大小系统的密度不一样。第一项$\mu^{id}$是理想气体（好像指的是大系统）对化学势的贡献。$\mu^{id}$与大系统的密度或压强相关联：

$$\begin{aligned}
\mu^{i d} &=k T \ln \rho \Lambda^{3} \\
&=k T \ln \frac{\phi P \Lambda^{3}}{k T}
\end{aligned}$$

k是玻尔兹曼常数，T是用户指定的温度，ρ是数量密度，P是压强，φ是逸度系数。常数A是用来保证维度一致性的。除了ij单位以外，所有的单位类型，都将A定义为热德布罗意波长

$$\Lambda=\sqrt{\frac{h^{2}}{2 \pi m k T}}$$

h是普朗克常数，m是交换的原子/分子的质量。如果是lj单位，A简单设定为单位值（is simply set to unity）。2017年三月之前版本的LAMMPS中，A也是用上式计算的，当时将h=0.18292026。这样子的话，当时的化学势会收敛到一个平衡值，这个值的大小等于当前版本的新值减去...

除了直接指定化学势$\mu$之外，还可以使用`pressure`指定大系统压强P来间接完成对mu的指定。此时用户指定的mu会失效。指定P的话，逸度系数φ也得用`fugacity_coeff`关键词指定，默认为单位值（which defaults to unity）。

`full_energy`关键词是让fix计算整个模拟体系的能量，而不仅仅是发生改变的那一部分（意思是那些指定的region或者group吧）。计算GCMC交换原子和MC移动的前后的能量，然后用Metropolis准则判断是否接受新构型。默认情况下，`full_enengy=off`是关闭的，此时采用的是发生改变的那部分区域的能量值。

`full_energy`在化学势计算十分复杂的系统中必须使用：

* long-range electrostatics (kspace)

* many-body pair styles

* hybrid pair styles

* eam pair styles

* tail corrections

* need to include potential energy contributions from other fixes

用了上面这些势函数方法，LAMMPS会自动启用`full_energy`，然后给一个warning。

插入的原子或分子会根据系统目标温度T来赋予随机速度。由于分子是rigid的，分子上的原子相对静止，导致插入的分子比较“冷”。此外，插入的分子的相互作用势能可能会导致分子动能迅速上升或者下降。此时需要使用`tfac_insert`关键词改变这些插入的粒子的“温度”，抵消上述影响。这个“温度”用一个常数因子来调整粒子速度。最好能够使用一些实验来确定`tfac_insert`的值，使插入的粒子尽快平衡。

一些fix有相关联的势能，比如`fix efield`, `gravity`, `addforce`, `langevin`, `restrain`, `temp/berendsen`, `temp/rescale`, 和 `wall fixes`。如果要将这些势能考虑进来（GCMC和MC需要计算能量来判断是否接受构型），必须在使用那些fix的时候，开启`fix_modify energy`选项。详细信息参见各个fix的命令页。

使用`charge`关键词可以插入用户指定的点电荷。这样做会导致系统变得非中性。当你使用在非点中性系统中使用long-range electrostatics (kspace)作用势的时候，LAMMPS会发出警告。详情查看`compute group/group`命令页，看看如何在kspace开启的时候模拟非电中性系统。

GCMC会导致系统数量发生变化，因此你需要使用`compute_modify dynamic/dof`命令，确保在计算温度的时候，使用当前原子的数量做归一化因子。比如:

```bash
compute_modify thermo_temp dynamic yes
```

使用NVT的时候情况更复杂，上面已经给过一个例子。

注意：如果体系初始密度很小或接近零，平衡（equilibration）一段时间后变得很大，那么模拟初始时计算的量（kspace参数）可能不太准确。解决办法是，达到平衡密度之后重启计算。

对于某些势函数类型，比如Buckingham, Born-Mayer-Huggins and ReaxFF，原子距离太近可能会导致计算出来的势能为负值。虽然这些非物理构型在常规的动力学轨迹中是看不到的，但是MC确有可能产生。此时就需要采用`overlap_cutoff`关键词了，强行给这些有过近原子的构型加一个无限大的能量，让他们不被接受。

关键词`max`和`min`限制系统的原子数量。fix会自动限制那些可能会造成超出原子数限制的GCMC交换和MC移动。如果系统已经超出边界，那只能接受那些倾向于正常的操作。

`group`关键词规定所有插入原子都到这个group组中。`grouptype`关键词规定所有插入的type类原子进入到group组中。

## Restart, fix_modify, output, run start/stop, minimize info:

`fix gcmc `命令会自动将fix的状态写入一个二进制restart文件中（binary restart files）。包含一些信息，包括随机数发生器种子（random number generator seed），GCMC交换的下个时间步，MC尝试的次数和成功次数等。详情见read_restart命令页，关于如何在读取restart的in文件中重新定义fix，以便接续中断的过程。

注意：reset_timestep前后的timestep不能变化，否则会报错。

该fix并不能和`fix_modify`结合用

该fix命令会得到八个量，可以通过各种输出命令访问（output commands，就是可计算、可输出的意思），

* 1 = translation attempts

* 2 = translation successes

* 3 = insertion attempts

* 4 = insertion successes

* 5 = deletion attempts

* 6 = deletion successes

* 7 = rotation attempts

* 8 = rotation successes

该fix的任何参数都不能和run命令的`start/stop`关键词使用。能量最小化过程中不会调用该fix。

## 限制条件

LAMMPS必须得预先配置MC包。

不能设置`neigh_modify once yes`，否则该fix无效，毕竟GCMC需要时刻更新neighbor list

可以并行，但不保证GCMC的各个方面都能并行（可能存在“一核有难，七核围观”的场景）。

只适用于三维模型

如果和`fix shake`或者`fix rigid`一同使用，那只能进行GCMC交换了，因此参数M得设为0。

体系太大，上亿原子，可能会报错。