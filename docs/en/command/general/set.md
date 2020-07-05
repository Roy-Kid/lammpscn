# set

:::tip
参见[set](https://lammps.sandia.gov/doc/set.html)
:::


## 使用语法
set style ID keyword values ...
•	style = atom or type or mol or group or region
•	ID = atom ID range or type range or mol ID range or group ID or region ID
•	one or more keyword/value pairs may be appended
•	keyword = type or type/fraction or mol or x or y or z or charge or dipole or dipole/random or quat or quat/random or diameter orshape or length or tri or theta or theta/random or angmom or omega or mass or density or volume or image or bond or angle ordihedral or improper or meso/e or meso/cv or meso/rho or smd/contact/radius or smd/mass/density or dpd/theta or i_name ord_name

## 介绍
set命令用于设置一个或多个原子的—个或多个属性。从原子属性被read_data、read_restart或create_atoms命令所分配，这个命令改变他们的参数。这个对于通过create_atoms命令来重置默认值是很有用处的。当力场参数依据类型被定义后，这条命令对于变更成对的或是分子的相互作用力是有用的。该命令可以被用来改变原子的标识，通过在他们在dump文件中输出的时候改变原子类型或是分子id来完成。这条命令也对调试目标是有用的。定位—个特定的原子的位價，计算后来的力或能量。
group格式选择所有的原子在指定的群里。region格式选择在制定几何区域内的所有原子。
关键词type/fraction设定一部分指定原子的原子类型。真实的原子改变的数量不能被保证恰好是需要的部分，但是应该是统计接近的。不管多少处理器被使用，随机数在一个特定原子是改变或是不变的时候被使用。
