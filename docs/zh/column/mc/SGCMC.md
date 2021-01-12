# SGCMC

## 语法

```bash
fix ID group-ID atom/swap N X seed T keyword values

N：每N步启动一次该fix（invoke this fix every N steps）

X：每N步试行swaps的原子数量

T：该MC模拟的特征温度（scaling temperature of the MC swaps）

keyword：types, mu, ke, semi-grand, region

Ø types values = two or more atoms types

Ø mu values = chemical potential of swap types

Ø ke value = no or yes

no = no conservation of kinetic energy after atom swaps （原子交换后动能不必守恒）

yes = kinetic energy is conserved after atom swaps （原子交换后动能守恒）

Ø semi-grand value = no or yes

no = particle type counts and fraction conserved （各类原子的数量保持不变）

yes = semi-grand canonical ensemble, particle fraction not conserved （各类原子数量会变化，和GCMC一样）

Ø region value = region-ID

region-ID = ID of region to use as an exchange/move volume （该region内的原子进行交换和移动）
```

## 例子

```bash
fix 2 all atom/swap 1 1 29494 300.0 ke no types 1 2

fix muFix all atom/swap 100 1 12345 298.0 region my_swap_region types 5 6

fix SGMC all atom/swap 1 100 345 1.0 semi-grand yes types 1 2 3 mu 0.0 4.3 -5.0
```

## 介绍

该fix对一类原子与另一类原子进行MC交换。（这真真是我需要的功能了，可惜没找到variance-constraint semi-grand canonical Monte Carlo algorithm）。指定的温度T是用在马氏准则（Metropolis criterion）中的，用来计算概率。

根据MC概率进行X次原子的交换。参与交换的原子必须在指定的group中，在指定的region中（如果指定了的话），在指定的types中。原子随机选定，并且不会选择同类原子，因为没有意义。

所有的原子均可被常规的时间积分方法移动，如NVT，以此完成hybrid MC+MD模拟。选择的timestep必须必常用的MD时间步要小，特别是当原子并未平衡时。

需要指定至少两个原子types。

`ke`默认是no，关闭的。如果开启yes，那么原子交换位置前后动能不变，这意味着它们的速度受质量影响。

`semi-grand`默认no，关闭的。yes的话，打开半巨正则系综(Sadigh)。yes的话，各类原子的数量在MC过程中不守恒，即系统的成分会发生变化；no的话，只有不同类原子之间发生互换，即系统成分不变。当使用semi-grand时，未被types指定的原子不参与互换。

`mu`关键词用于指定化学势，只有semi-grand打开时需要用mu。所有化学势的值都是绝对的，每一类原子一个化学势。在semi-grand中化学成分由这些mu的值控制，因此，如果所有的mu都是同样的值，那么这些mu对MC模拟不会产生影响。

`region`关键词指定参与swap的原子所在的区域。只有两原子都在该region内，才可发生swap。

务必保证分子上的原子不发生swap，要不然就等着报错吧！

不使用semi-grand时，该fix会检查是否所有原子具有相同电荷。因为swap并不交换原子电荷。因此，如果原子的type改变了，但是电荷却没变，那就麻烦了。如果使用了semi-grand，那么它会默认所有原子的电荷量一致，反正不会给你检查的，也不会给你交换电荷量。

看到这里，我才明白，原来交换的并不是原子位置，而是原子的类型。这也解释了，为什么质量是可交换的，速度要选择是否交换。因为Lammps的原子类型和质量是绑定的，但是电荷量和速度都不是。如果a原子类型变成了b，但是电荷量和速度都还是a的，那就麻烦了。因此前面可以选择是否开启ke守恒，还要检查电荷是否一样。

该fix需要计算swap前后的化学势，下列原子作用势类型下的系统可以计算

* long-range electrostatics (kspace) 长程静电势

* many body pair styles 多体势

* hybrid pair styles 复合势

* eam pair styles 嵌入原子势

* triclinic systems 三斜晶体系统

* need to include potential energy contributions from other fixes 包含其他fix赋予的势

一些fix会附加额外的势能，包括efield, gravity, addforce, langevin, restrain, temp/berendsen, temp/rescale, and wall fixes。如果要将这些fix附加的原子势考虑进来，务必为这些势开启fix_modify energy选项。

## Restart, fix_modify, output, run start/stop, minimize info:

该fix会将自身状态写入一个二进制restart文件中，包含随机种子数，MC交换的下一个时间步，尝试交换的次数和成功次数等。

不允许使用fix_modify。

fix产生一个二维矢量，可以被output commands访问，用于计算或输出。

* 1 = swap attempts

* 2 = swap successes

该fix中的参数不能与run中的start/stop关键词联用。

不参与能量minimization。