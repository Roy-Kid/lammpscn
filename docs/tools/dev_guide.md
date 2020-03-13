# 开发指南

> 有一千个LAMMPS使用者，就有一千个dump文件和一万个需要计算的参数。 -- 罗士比亚

## 文件组织

现在有baseClass, containerClass, groupClass, com_func和aux_func四个文件夹。

* baseClass: 所有数据结构的基类和Dump文件读取。
* containerClass: 直接处理snap的类。
* groupClass: 储存