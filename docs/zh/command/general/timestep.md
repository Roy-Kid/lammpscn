#  timestep

:::tip
参见[timestep](https://lammps.sandia.gov/doc/timestep.html)
:::

timestep为该命令之后的分子动力学模拟设置时间步长。

## 语法
```
timestep dt
dt：时间步长（以时间为单位），默认为1ps。具体是ps还是fs应根据units所设置的单位制的不同而不同。
```
## 实例
```
timestep 2.0 
timestep 0.003
```
## 介绍
该命令为之后的分子动力学模拟设置时间步长。参考命令units，了解时间步长的单位。默认的时间步长依赖于模拟中所采用的单位类型，参考下面的默认设置。
如果命令run_style设置为respa，那么参数dt设置的是最外层循环的时间步长。
## 相关命令
fix dt/reset、run、run_style respa、units
##  默认设置
timestep = 0.005 tau for units = lj
timestep = 1.0 fmsec for units = real
timestep = 0.001 psec for units = metal
timestep = 1.0e-8 sec (10 nsec) for units = si or cgs
