# 使用OPLSAA构建模型

moltemplate不仅可以通过键接信息构建其余几何信息，还可以通过预置的力场文件自动分配电荷、键角种类和势函数参数。


## 简介
OPLS是optimized potentials for liquid simulations，从其全称可知其适用范围，要是液体体系。该力场由牛人 Jorgensen团队开发，主要适用于多肽、蛋白、核酸、有机溶剂等液体体系，一般和Tip3P或TIP4P的水模型搭配适用。

为了便于移植，这个力场的势函数适用了常见的势函数，如下：

$$ E(r^N) = E_{bonds} + E_{angles} + E_{dihedrals} + E_{nonbonded} $$

$$ E_{bonds} = \Sigma_{bonds} K_r(r - r_0)^2 $$

$$ E_{angles} = \Sigma_{angles} K_{\theta}(\theta - \theta_0)^2 $$

$$ dihedrals =\Sigma_{dihedrals} (\frac{V_1}{2}[1 + cos(\phi - \phi_1)] + \frac{V_2}{2}[1 + cos(2\phi - \phi_2)] + \frac{V_3}{2}[1 + cos(3\phi - \phi_3)] + \frac{V_4}{2}[1 + cos(4\phi - \phi_4)]) $$

$$ E_{\text {nonbonded }}=\sum_{i>j} f_{i j}\left(\frac{A_{i j}}{r_{i j}^{12}}-\frac{C_{i j}}{r_{i j}^{6}}+\frac{q_{i} q_{j} e^{2}}{4 \pi \epsilon_{0} r_{i j}}\right) $$

with the combining rules: $ A_{i j}=\sqrt{A_{i i} A_{j j}}$ and $ C_{i j}=\sqrt{C_{i i} C_{j j}} $


该力场在计算非间相互作用作用时，完全排除了1-2, 1-3对作用，而对于1-4对作用，采用了保留50%的策略。其他对相互作用，完全考虑；且对于LJ势参数，采用了Lorentz-Berthelot混合法则（几何平均，lammps的geometric）进行计算。

OPLS包含两套力场，OPLS-AA(全原子力场)和OPLS-UA（联合原子力场，不考虑氢原子）。LAMMPS选择如下命令来处理上面的相互作用：

```

```

## 怎样做

我们以一个简单的乙烷分子为例，来考虑如何使用moltemplate构建LAMMPS输入数据。

```
0.1     H            H
          \        /
0       H — C —— C — H
          /        \
-0.1    H            H
        
        0  0.1|0.2  0.3
             0.15  
```
使用moltemplate的思路通常是从下到上考虑，即将大分子拆分成可复用的最小单元，然后再进行组合。因此，我们可以选择两个CH3-作为基本单元，再旋转、平移、链接乙烷。

首先构建CH3-

```
# CH3.lt
import "oplsaa.lt"

CH3 inherits OPLSAA {

    write("Data Atoms"){

        # AtomID        MolID       AtomType        charge      X    Y    Z
        # $atom:        $mol:.      @atom:P4          0         0    0    0

    
        # AtomID 按顺序赋予编号即可，不能重复
        # MolID  .令moltemplate自动按分子赋值
        # @atom  从oplsaa.lt中charge部分查找种类编号,可以和Mass部分交叉验证
        # charge 全部置零，生成时会按照力场自动替换
        # 即便建模时非常生硬，在lammps 的minimize之后也可以迅速达到正常构型
        
        $atom:1    $mol:.   @atom:85     0.0     0    0     0  # "Alkane H-C"
        $atom:2    $mol:.   @atom:85     0.0     0    0.1   0 
        $atom:3    $mol:.   @atom:85     0.0     0    -0.1  0
        $atom:4    $mol:.   @atom:80     0.0     0.1  0     0  # "Alkane CH3-"

    }

    write("Data Bond List"){

        # 不需要手动输入bond type，会根据力场中的原子配对自动补全
        # 同理，生成angle、dihedral、improper时也会自动补全他们的类型
        # 这是这个软件最强大的地方

        $bond:1    $atom:1    $atom:4
        $bond:2    $atom:2    $atom:4
        $bond:3    $atom:3    $atom:4

    }

}

```

Ok，我们拿到了一个CH3-，现在只需要把他旋转，然后两个连起来：

```
# CH3CH3.lt
import "CH3.lt"
import "oplsaa.lt"

CH3CH3 inherits OPLSAA {

    CH3L = new CH3

    # 以Z轴为轴(0, 0, 1)，以(0.15, 0, 0)为原点旋转180°

    CH3R = new CH3.rot(180, 0, 0, 1, 0.15, 0, 0)

    write("Data Bond List"){

        $bond:1    $atom:CH3L/4    $atom:CH3R/4

        # 选择CH3L和CH3R中id为4的原子连接起来，
        # moltemplate会自动推断这两个原子的类型以选择bond type

    }

}

```

最后在`system.lt`中new一个新分子：

```

import "CH3CH3.lt"


CH3CH3 = new CH3CH3

# How big is the simulation box?

write_once("Data Boundary") {
  0 50.0 xlo xhi
  0 50.0 ylo yhi
  0 50.0 zlo zhi
}

```

敲上命令然后回车：

```
moltemplate.sh system.lt
```


叮咚，我们就得到了乙烷的数据文件：

![乙烷](/tools/moltemplate/alkene.jpg)

