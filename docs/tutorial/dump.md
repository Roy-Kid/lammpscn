# 数据输出

虽然LAMMPS支持很多的参数计算，但是种类毕竟有限。很多情况我们需要拿到粒子坐标这样的一级物理信息，用来计算自己所需的参数或者可视化。

::: tip
定位到[dump](https://lammps.sandia.gov/doc/dump.html)和[dump_modify](https://lammps.sandia.gov/doc/dump_modify.html)
:::

```
dump ID group-ID style N file args
```
* ID dump命令的id，可以是数字也可以是字符串
* group-ID 需要转存的原子群，如果没有限制，可以写作all。具体参照[group](https://lammps.sandia.gov/doc/group.html)
* style 是预设类型。建议使用custom来自定义输出
* N 输出的周期
* file 输出的文件名
* args 可选项，具体查询手册。常用的有id, mol, type, element, xu yu zu, ix iy iz, q

dump通常输出的结果是无序的，可以通过dump_modify sort修正。

由于是并行计算，系统中的粒子被分配给各个核心，因此取回时会发现有些原子略微超出了盒子边界。这通常来说不要紧，如果非常在意，有dump_modify strict命令可以修正。

由于是每多少步进行一次，默认第一步是不进行输出的，只会输出minimize的最后一步和后面的周期。这可以通过dump_modify first来修正。

dump是设定命令，有一些具体的行为需要用dump_modify来修正

```
dump_modify dump-ID keyword values ...
```
* dump-ID 需要修正的dump ID

常用关键字：append、at、element、sort