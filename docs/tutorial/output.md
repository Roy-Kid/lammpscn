# 系统输出

当LAMMPS读取完input文件之后，将会把重要信息输出到命令行和log文件中，然后开始初始化。初始化结束后，会将系统信息，包括系统版本，占用内存和初始的热力学状态输出出来。在计算过程中，会周期地输出当前的热力学信息。每一次运算阶段结束后，将会输出最终的热力学信息和系统统计。

## 热力学信息

::: tip

更多定制方案请参考[thermo](https://lammps.sandia.gov/doc/thermo.html)[thermo_style](https://lammps.sandia.gov/doc/thermo_style.html)[thermo_modify](https://lammps.sandia.gov/doc/thermo_modify.html)

:::

```
thermo N
    N #每N步输出一次热力学状态

thermo_style style args
    style = one or multi or custom
    args = #one 和 multi 没有参数可选
        custom args =
           step #输出当前总步数
           elapsed #输出本次run到现在的步数
           dt #间隔时间
           time #模拟时长
           temp #体系温度
           press #体系压力
           pe #势能
           ke #动能
           etotal #总能量（pe+ke）
           enthalpy #焓 （etotal + press×vol）
           evdwl #范德华力的能量
           ecoul #库仑力的能量
           epair #分子对间的能量（evdwl + ecoul）
           ###e开头的都是能量就是了###
           vol #体积
           density #密度
           lx，ly，lz #盒子的长宽高
           xlo，xhi，ylo，yhi，zlo，zhi#盒子边界的位置
           fmax#受到的最大的力
           ndanger#危险原子列表的数量
           c_ID[]#输出compute的数据           

thermo_modify keyword value...
```

热力学数据输出的频率和格式主要由thermo、thermo_style和thermo_modify命令来设置。

其中thermo_style命令用于具体指定所需要输出的参量。如LAMMPS预定义的一些关键字（如press、etotal等）所代表的参量，以及另外由compute、fix或variable三个命令所得到的参量值，具体可通过c_ID、f_ID或v_name关键字引用。在这三种情况下，compute、fix或variable三个命令得到的量作为thermo_style custom命令的传入值时必须是一个全局量global，如体系中某一区域（group）的势能、温度等。如果给thermo_style custom命令传入的是非全局量值，则会报错，如：

```
compute    1 all pe/atom
thermo_style   custom step temp pe etotal c_1
```
值得注意的是，热力学输出量既可以是“广度量”也可以是“强度量”。前者与系统中的原子数成比例，如体系总能，而后者则与系统中的原子数无关，如体系温。thermo_modify命令的norm参数用以决定是否对广度量进行归一化操作。compute和fix命令既可以产生广度量也可以产生强度量。具体可参见相关的说明文档。variable命令的类型为equal时仅能产生强度量值，若需要将此时的强度量值转变为广度量值，可通过在公式中除原子数（natoms）的方式得到。


thermo设定了输出的间隔。

thermo_style指明了输出的格式。

当style = custom时，就可以自己手动指定需要输出什么了。

还一种情况，如果通过fix ave/time来做时间平均的话，可以用f_ID来输出相应的平均数据。

## 系统统计
```
Loop time of 2.81192 on 4 procs for 300 steps with 2004 atoms

Performance: 18.436 ns/day  1.302 hours/ns  106.689 timesteps/s
97.0% CPU use with 4 MPI tasks x no OpenMP threads

```

以上的信息都是不言自明的。Loop部分指出了运行的实际时间；Performence基于当前的运算速度给出了平均时长预测；CPU占比给出了MPI的CPU占用，通常来说越接近100%效率越高，如果相差太多，大概率是卡在I/O上。

值得注意的是下方的时间表格：

```
MPI task timings breakdown:
Section |  min time  |  avg time  |  max time  |%varavg| %total
---------------------------------------------------------------
Pair    | 1.9808     | 2.0134     | 2.0318     |   1.4 | 71.60
Bond    | 0.0021894  | 0.0060319  | 0.010058   |   4.7 |  0.21
Kspace  | 0.3207     | 0.3366     | 0.36616    |   3.1 | 11.97
Neigh   | 0.28411    | 0.28464    | 0.28516    |   0.1 | 10.12
Comm    | 0.075732   | 0.077018   | 0.07883    |   0.4 |  2.74
Output  | 0.00030518 | 0.00042665 | 0.00078821 |   1.0 |  0.02
Modify  | 0.086606   | 0.086631   | 0.086668   |   0.0 |  3.08
Other   |            | 0.007178   |            |       |  0.26
```

纵轴：
* Pair = 非键部分消耗的时间
* Bond = 键接部分消耗的时间
* Kspace = 长程作用力消耗的时间
* Neigh = 构建临近表需要的时间
* Comm = 核内通信消耗的时间
* Output = 输出信息需要的时间
* Modify = 相关内置计算命令需要的时间
* Other = 其他

横轴中的"%varavg"代表波动的程度，越接近0代表负载越均衡。

```
Nlocal:    501 ave 508 max 490 min
Histogram: 1 0 0 0 0 0 1 1 0 1
Nghost:    6586.25 ave 6628 max 6548 min
Histogram: 1 0 1 0 0 0 1 0 0 1
Neighs:    177007 ave 180562 max 170212 min
Histogram: 1 0 0 0 0 0 0 1 1 1

```

第三部分列出了每个核心分配到的本地原子数（local atom，Nlocal），幽灵原子数（ghost atom，Nghost）和临近表数（neighbor，Neights）。最大值和最小值给出了这些值在处理器之间的分布，10位直方图显示了分布。直方图计数的总数等于处理器的数目。
```
Total # of neighbors = 708028
Ave neighs/atom = 353.307
Ave special neighs/atom = 2.34032
Neighbor list builds = 26
Dangerous builds = 0
```
最后一部分给出了整个计算中，临近表的统计信息。当各位了解临近表的原理后，根据这里的数据能判断出临近表的设定，进一步地提高计算的精度和速度。