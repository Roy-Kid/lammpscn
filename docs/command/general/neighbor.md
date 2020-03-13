# neighbor

:::tip
参见[neighbor](https://lammps.sandia.gov/doc/neighbor.html)
:::

设定与临近表有关的参数

## 语法
```
neighbor skin style
    skin : 超出阶段半径的额外壳层
    style = bin or nsq or multi
```

## 实例
```
neighbor 0.3 bin    0.3倍的截止半径Rc距离
neighbor 2.0 nsq

```

## 介绍

在做高分子体系中添加大直径填料的时候遇到了一个问题：相同的体系，加入填料后的模拟速度是不加入的五分之一。查看output的时候发现，neigh一项占去了总时间的一半以上。这就很诡异，因为正常情况应该是Pair占到七成左右比较合理。

想要解决问题，就需要从lammps计算原子对之间的势的算法说起。

首先，要计算一个原子受到那些原子的作用，首先得去寻找周围的原子。这样，为了避免每个timestep都要去搜索，lammps先拉一张叫neighbor list 的表，这个表里储存了所有周遭原子的信息。这个表的范围是多大呢，(cutoff + skin distance)。

![](/command/general/neighbor/1.png)
![](/command/general/neighbor/2.png)

随着模拟的进行，原子在不断地移动，很有可能很多原子跑出这个表。因此skin distance作为一个缓冲区，允许部分原子最远跑到这个区域里来。在neigh_modify的选项里，设置参数，这个参数就是控制每多长时间这个表更新一次。不言自明，这个更新就是重新去搜索周围的原子再形成这么一张表。外层厚度越大，重建的频率就小，但是需要计算的原子也会增多。

然后要开始计算pair_coeff了。那么lammps就拿着这张表，逐个去计算作用势。很明显，在这个逻辑链上，neighbor list的大小直接决定了计算量，优先级要高于cutoff。因此，在我这个体系中，我neighbor command 的style是bin选项，就会以最大的原子cutoff去生成这个表，所以增加了巨大的无效计算。

这个命令设置了影响neighbor list 构建的参数。在这张表容纳了所有在cutoff+skin范围内的原子对。通常来说，这个skin distance越大，重新构建表的次数越少，要计算的也越多（废话）。

skin distance 同样决定着原子迁入到另一个核去计算的频率，如果neigh_modify中check被yes的话。这样在list被重建的时候原子就会被划分到新处理器中去。

style 的选取决定了建立表的算法。

bin 计算量随着 原子总数/处理器核数 线性变化;

nsq 计算量随着 （原子总数/处理器核数）^2 线性变化，但是在**特定**情况下会比bin要快。

> 还是老话，不懂就默认...

multi 则是一个为了适应具有变化很大的cutoff的体系，会对每种原子建立不同的list。这样子的话就不会出现无谓的计算，能**大幅**改善截断半径大小相差巨大的体系的计算速度。

neighbor list 的更新情况及其他的参数，需要在neigh_modify里设置。