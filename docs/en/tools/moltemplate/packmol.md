# 使用Packmol填充小分子

我们已经熟悉了如何建立简单的隐式溶液(implicit solvent)体系，如果想让一个体系实实在在充满水分子应该怎么办呢，不会手动一个个添加水吧，不会吧不会吧？

## Packmol安装

1. [下载](http://m3g.iqm.unicamp.br/packmol/download.shtml)
2. 安装：
```
tar -zxvf packmol.tar.gz
cd packmol
make
```

## Packmol脚本语言入门

新建一个脚本文件`ethane_solvent.inp`, 先写三行：

```
tolerance 2.0    # 能接受的能差
filetype pdb    # 输出格式(pdb, xyz ...)
output ethane_solvent.pdb    # 输出文件名 

structure ethane.xyz  # 待填充分子1
    number 100       # 数量
    inside cube 0. 0. 0. 98 # 范围，98防止pbc时重叠
end structure

structure water.pdb  # 待填充分子2
    number 1000
    inside cube 0. 0. 0. 98
end structure

```

pdb文件可以用多种方式得到，如MS、avogadro等。这里最推荐使用chemdraw，一个分子式直接出图。
[pdb文件格式](http://blog.sciencenet.cn/home.php?mod=space&uid=3196388&do=blog&quickforward=1&id=1110691)

`water.pdb`，注意这个虚原子M是手动添加的，因为不符合化学结构因此chemdraw不能导出。另外OPLSAA联合TIP4P力场下，M与O的距离是0.15埃。
```
REMARK   This PDB file was created by CS Chem3D.
HETATM    1  O           1       0.000   0.000   0.000                      O 
HETATM    2  H           1       0.816   0.577   0.000                      H 
HETATM    3  H           1      -0.816   0.577   0.000                      H 
HETATM    4  M           1       0.000   0.150   0.000                      M
CONECT    1    2    3    4
CONECT    1    2
CONECT    1    3
CONECT    1    4  
END
```

`ethane.xyz`: 同样我们也可以使用xyz文件
```
6
  Ethylene
C1    -0.6695    0.000000  0.000000
C2     0.6695    0.000000  0.000000
H11   -1.234217 -0.854458  0.000000
H12   -1.234217  0.854458  0.000000
H21    1.234217 -0.854458  0.000000
H22    1.234217  0.854458  0.000000
```


## （中性）溶剂化

Packmol利用`solvate.tcl`脚本来完成溶剂化的工作，比如将像蛋白质放在缓冲溶液中。显然，这时也需要向溶液中填充钠离子和氯离子。

假定你现在已经有了你要放进去的大分子的PDB文件，那么下一步运行：

```
solvate.tcl PROTEIN.pdb
```

运行结束时候，Packmol会生成一个叫`packmol_input.inp`的文件，注意这个拓展名，就跟你平时用Packmol填充各种分子的那个指令文件一样.
那么下一步，运行：

```
packmol < packmol_input.inp
```

运行结束，大分子就被淹没在中性溶液环境中啦。NaCl的浓度默认是0.16M，也就是生理盐水的浓度。 
如果你不想要这个浓度，或者你想自定义这个溶剂化过程中的其他参数，你可以这样做：
```
solvate.tcl structure.pdb -shell 15. -charge +5 -density 1.0 -i pack.inp -o solvated.pdb
```
这里面加入的flag分别代表如下意思：
* “15”是溶剂盒子的尺寸，你可以改成其他的，15是默认值；
* “+5”是溶剂化前整个体系的净电荷。如果你不指明这个值，那么系统会默认组氨酸电中性，Arg（蛋白质简写）和Lys带+1电荷，Glu和Asp带-1电荷。在平衡这些净电荷使溶剂化后整个体系达到电中性的基础上，Packmol会填充特定数目的钠离子和氯离子使NaCl浓度尽可能接近0.16M。如果你不想在这个过程中加入任何离子，只有水，那么在命令中加入-noions。
* “1.0”是默认溶剂的密度，你可以改。
* “solvate.pdb”是输出文件的默认名字，当然也可以改。
* “pack.inp”是生成的Packmol输入文件的默认名字，也可以改。

