# 数据转储


## dump输出
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

dump文件的输出主要通过由dump和dump_modify命令来实现。LAMMPS中提供了多种预定义的输出格式，如dump atom、dump xtc等。也可通过用户自定义（dump custom）的方式输出每个原子属性的相应值。LAMMPS中预定义了一些可直接用于输出的原子属性，如id、x、fx等。此外，由compute、fix或variable三个命令所得到的参量值，也可通过c_ID、f_ID或v_name关键字引用。在这三种情况下，compute、fix或variable三个命令得到的量作为dump custom命令的传入值时必须是一个per-atom量值，如上述例子中，thermo_style会报错，但可通过dump custom输出c_1值。
```
compute    1 all pe/atom
thermo_style   custom step temp pe etotal c_1
dump   1 all custom 100 xxx.xyz id type x y z c_1
```
还有一种dump local命令格式，用于指定要输出的某处理器中处理的原子的值。具体可通过指定一个预定义的索引关键字来输出该局域值。此外，该命令也可通过c_ID、f_ID或v_name关键字引用由compute、fix或variable三个命令所得到的参量值。在这三种情况下，compute、fix或variable三个命令得到的量作为dump local命令的传入值时必须是一个局域量值。


dump通常输出的结果是无序的，可以通过dump_modify sort修正。

由于是并行计算，系统中的粒子被分配给各个核心，因此取回时会发现有些原子略微超出了盒子边界。这通常来说不要紧，如果非常在意，有dump_modify strict命令可以修正。

由于是每多少步进行一次，默认第一步是不进行输出的，只会输出minimize的最后一步和后面的周期。这可以通过dump_modify first来修正。

dump是设定命令，有一些具体的行为需要用dump_modify来修正

```
dump_modify dump-ID keyword values ...
```
* dump-ID 需要修正的dump ID

常用关键字：append、at、element、sort


