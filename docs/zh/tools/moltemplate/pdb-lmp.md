# 将pdb转化为LAMMPS输入文件

上一章我们已经拿到了乙烷溶解在水中的pdb格式的数据文件。那么在进行LAMMPS读取之前，需要将其转化成所需格式的输入文件。
我们观察pdb格式的文件，可以发现其中包含有坐标文件，还有键接信息。坐标信息储存了所有的分子位置，以供moltemplate摆放分子使用。和LAMMPS的输入文件做对比，问题在于，键接信息没有指出键的种类，因此无法向其分配bond type。同时，是否成angle和dihedral也是通过键的种类来判断。所以我们需要向moltemplate提供这一重要的信息。

新建一个`system.lt`文件：
```

import "ethane.lt"
import "water.lt"


ethane = new Ethane[100] # 个数和packmol相同
water = new Water[1000]  # 顺序和packmol一致

# 盒子比packmol略大
write_once("Data Boundary") {
  0 100.0 xlo xhi
  0 100.0 ylo yhi
  0 100.0 zlo zhi
}

```

`system.lt`中指出了生成分子的个数，同时分子的拓扑信息也由各个lt文件给出，然后依托pdb中坐标来摆放：

```
moltemplate.sh -pdb ethane_solvent.pdb system.lt
```

至此，我们就得到了基于pdb坐标的LAMMPS输入文件。