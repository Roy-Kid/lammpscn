# DSMC

## 语法

```bash
pair_style dsmc max_cell_size seed weighting Tref Nrecompute Nsample
max_cell_size：DSMC相互作用的最大单胞（cell）尺寸（distance units）
seed：随机数种子（正整数）
weighting：宏观例子权重
Tref：参考温度（翻译为基准温度？）（温度单位）
Nrecompute：每Nrecompute个时间步重新计算一次v*sigma_max
Nsample：计算v*sigma_max时共采样Nsample次
```

## 例子

```bash
pair_style dsmc 2.5 3457 10 1.0 100 20
pair_coeff * * 1.0
pair_coeff 1 1 1.0
```

## 介绍

Style dsmc采用直接MC模型来计算多对粒子的碰撞行为（collisions），例子见(Bird)。碰撞的两个粒子都会被重设速度。每一对粒子 或 每一对粒子类型的成对碰撞数，以及他们发生的长度尺度，都由`pair_style`和`pair_coeff`参数控制。

随机碰撞行为由硬球模型描述，其中用户指定的`max_cell_size`值作为最大的DSMC单胞（cell）尺寸，碰撞的参考截面由`pair_coeff`命令给定。

碰撞的能量和virial贡献与pair_style无关

下面这个参数必须由`pair_coeff`参数给定，或者data文件或restart文件给定：

`sigma`：面积单位

全局DSMC的`max_cell_size`确定了DSMC计算使用的最大单胞长度。在模拟盒子上进行结构网格划分，这样子，每隔处理器的子域的每个方向上存在若干个单胞。单胞尺寸会自动微调，以适应用户定义的最大单胞尺寸。

要成功运行DSMC，in文件中还得有其他设置，不搞的话LAMMPS也不会提醒。

由于该pair style不计算粒子相互作用力，因此：

```bash
fix 1 all nve/noforce
```

该pair style假定所有粒子会自动与邻近处理器通信，这样可以保证所有可能的粒子发生碰撞，免得有的粒子因为不在同一处理器而发生漏判。因此我们还得做出如下设置：

```bash
neighbor 0.0 bin
neigh_modify every 1 delay 0 check no
atom_modify sort 0 0.0
communicate single cutoff 0.0
```

上述设置可以保证LAMMPS每一步都让粒子跨处理器通信，不产生幽灵粒子。

为了保证DSMC的准确性，初始速度分布应为高斯分布，而不是默认的均匀分布

```
velocity all create 594.6 87878 loop geom dist guassian
```

## Mixing, shift, table, tail correction, restart, rRESPA info:

### 不支持mix。因此，I-J粒子对的参数必须明确给出

mix是为了获得I != J时作用势的参数。In脚本中已经有I-I原子对和J-J原子对的交互作用势，但是没有I-J的。因此采用混合法则，去拟合一个。当然不怎么准确，但是能用。有时候影响也不大。如果支持mix的话，那么I-J原子对的作用势参数就不用在in文件里面明确给出了。Mix法则有三种:

$$\begin{array}{l}
\epsilon_{i j}=\sqrt{\epsilon_{i} \epsilon_{j}} \\
\sigma_{i j}=\sqrt{\sigma_{i} \sigma_{j}} \\
\epsilon_{i j}=\sqrt{\epsilon_{i} \epsilon_{j}} \\
\sigma_{i j}=\frac{1}{2}\left(\sigma_{i}+\sigma_{j}\right) \\
\epsilon_{i j}=\frac{2 \sqrt{\epsilon_{i} \epsilon_j} \sigma_{i}^{3} \sigma_{j}^{3}}{\sigma_{i}^{6}+\sigma_{j}^{6}} \\
\sigma_{i j}=\left(\frac{1}{2}\left(\sigma_{i}^{6}+\sigma_{j}^{6}\right)\right)^{\frac{1}{6}}
\end{array}$$

### 不支持pair_modify shift选项。

pair_modify shift用于LJ势函数，如果两原子距离正好是在cutoff上时，令LJ势为零。这么做的话，系统会给原子对相互作用添加上一个额外的能量项。该添加的能量项会影响输出的热力学数据，但是不会影响原子对的力（pair force）或者原子轨迹。

### 不支持pair_modify tail选项

tail选项会在原有的势函数的基础上，加一个长城的范德华力作用势，目的是“修正”能量和压强。只要系统没有采用恒压系综（NPT和NPH），那就不会影响系统动力学过程，但是还是会影响热力学数据的输出结果。

该pair类型会将信息写入二进制restart文件中。因此，如果in脚本读取了restart文件，那么pair_style和pair_coeff命令就不用再写了。用户给定的seed也会跟着restart文件走，因此重启计算的时候，各个处理器会和之前一样初始化。这意味着DSMC的随机原子间作用力（force）仍然是随机的，不会接着原来的模拟最终态。

不支持run_style respa命令（指定时积分器用的），也不支持inner, middle, outer关键词。