# 系统输出

当LAMMPS读取完input文件之后，将会把重要信息输出到命令行和log文件中，然后开始初始化。初始化结束后，会将系统信息，包括系统版本，占用内存和初始的热力学状态输出出来。在计算过程中，会周期地输出当前的热力学信息。每一次运算阶段结束后，将会输出最终的热力学信息和时间消耗。

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