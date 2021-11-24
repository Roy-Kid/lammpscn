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

skin distance 决定着原子迁入到另一个核去计算的频率，如果neigh_modify中check被yes的话。这样在list被重建的时候原子就会被划分到新处理器中去。

style 的选取决定了建立表的算法。

bin 计算量随着 原子总数/处理器核数 线性变化;

nsq 计算量随着 （原子总数/处理器核数）^2 线性变化，但是在**特定**情况下会比bin要快。

> 不懂选默认...

multi 则是一个为了适应具有变化很大的cutoff的体系，会对每种原子建立不同的list。这样子的话就不会出现无谓的计算，能**大幅**改善截断半径大小相差巨大的体系的计算速度。

neighbor list 的更新情况及其他的参数，需要在neigh_modify里设置。