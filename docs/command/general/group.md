# group

:::tip
参见[group](https://lammps.sandia.gov/doc/group.html)
:::

将一系列的原子编组

## 语法
```
group ID style args

style = delet or type or molecule or id or variable 
    delete = no args
    type/molecule/id = start end increment
```

## 实例

```
给分子1-10编为组A--> group A molecule 1 10
```

## 使用
将一系列的原子编组用于fix，compute，dump的计算。

如果之前的group-ID业已存在，则添之其后。

默认设置中，编组是不变的，即一旦分配了无论怎么变化group-ID都不会变化。假如说使用了region参数按照区域编组，那么即使原子抛出了区域，它的组别仍然与初始时相同。如果需要动态的编号即实时按照原子所在的区域编组，则需要dynamic参数。

所有原子都被初始化为all的分组且不能删除。

delete可以删除已经存在的标号。意义是，一，需要重新分组且使用同一个组名，二，同一时刻不能有超过32个编组。注意，如果这个编号正在被其他命令所使用，将不能删除。

type/id/molecule三种参数使用的方法相同。第一种是“开始 停止 步长”的标记法。第二种则是逻辑判断，如<=150之类的。

## 限制

另外注意一点，group永远是在命令中最大的，无论是要计算什么，哪怕是chunk的范围超过了group，命令也仅仅在group的范围能执行计算。