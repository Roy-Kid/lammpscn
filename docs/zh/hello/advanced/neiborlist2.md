# 临近表实践

上一次我们介绍了临近表的思想以及方法, 这一次我们来实践一下. 本文分三个部分, 首先将正交(orthogonal box)盒子拓展到三斜(triclinic)体系, 介绍定义, 周期性边界条件(PBC, periodic boundary condition)和最小镜像约定(mic, minimum image convention); 然后给出在general的盒子下的cell list和verlet list实现

## general simulation box

用来描述一个盒子的参数矩阵可以写作

$$

    \mathbf{h} = (\vec{a_1}, \vec{a_2}, \vec{a_3})

$$
其中$\vec{a_i}$是每条边的方向向量(列向量), 或者说叫晶格矢量(我会尽量避开晶体的概念, 在立体几何上解释). 为了方便起见, 盒子会与坐标系的轴平行, 即$\vec{a_i}\mathop{//}\vec{e_i}$. 对于边长为$L_x, L_y,L_z$的正交盒子, 这个参数矩阵可以写作:

$$
\mathbf{h}=\left(\begin{array}{ccc}
L_{x} & 0& 0 \\
0 & L_{y} & 0 \\
0 & 0 & L_{z}
\end{array}\right)
$$

为了描述三斜体系, 将立方体推广到平行六面体, 需要丰富上面的概念. 使用HOOMD-blue和LAMMPS的定义方法, 引入倾斜因子(tile factor)这个概念: 

$$
\mathbf{h}=\left(\begin{array}{ccc}
L_{x} & x y L_{y} & x z L_{z} \\
0 & L_{y} & y z L_{z} \\
0 & 0 & L_{z}
\end{array}\right)
$$

此时边的方向向量是

$$ 
\begin{cases}
a_1 =(xhi-xlo, 0, 0) \\

a_2 =(xy,yhi-ylo) \\

a_3 =(xz, yz, zhi-zlo) \\
\end{cases}
$$

这里需要放一张图

![](/hello/advanced/nbl/triclinic.png)

这里展示了在xy平面上倾斜因子xy如何影响y方向矢量的倾斜. 同理, z轴有两个因子, 决定了如何在xz和yz平面上的倾斜.

立体视图和周期性的关系

![](\column\nemd\flip.jpg)

盒子的倾角和倾斜因子的关系很容易得出

$$
\begin{aligned}
&\cos \gamma \equiv \cos \left(\angle \vec{a}_{1}, \vec{a}_{2}\right)=\frac{x y}{\sqrt{1+x y^{2}}} \\
&\cos \beta \equiv \cos \left(\angle \vec{a}_{1}, \vec{a}_{3}\right)=\frac{x z}{\sqrt{1+x z^{2}+y z^{2}}} \\
&\cos \alpha \equiv \cos \left(\angle \vec{a}_{2}, \vec{a}_{3}\right)=\frac{x y \cdot x z+y z}{\sqrt{1+x y^{2}} \sqrt{1+x z^{2}+y z^{2}}}
\end{aligned}
$$

假如以晶格矢量的形式定义这个盒子的话, 也可以通过下面的方法转换. 首先先把一个格矢摆放在x轴上, 然后计算其他矢量和参数间的关系. 

$$
\begin{aligned}
L_{x} &=v_{1} \\
a_{2 x} &=\frac{\vec{v}_{1} \cdot \vec{v}_{2}}{v_{1}} \\
L_{y} &=\sqrt{v_{2}^{2}-a_{2 x}^{2}} \\
x y &=\frac{a_{2 x}}{L_{y}} \\
L_{z} &=\vec{v}_{3} \cdot \frac{\vec{v}_{1} \times \vec{v}_{2}}{\left|\vec{v}_{1} \times \vec{v}_{2}\right|} \\
a_{3 x} &=\frac{\vec{v}_{1} \cdot \vec{v}_{3}}{v_{1}} \\
x z &=\frac{a_{3 x}}{L_{z}} \\
y z &=\frac{\vec{v}_{2} \cdot \vec{v}_{3}-a_{2 x} a_{3 x}}{L_{y} L_{z}}
\end{aligned}
$$

盒子的体积

$$
    \mathbf{V} = \vec{a_1}\cdot(\vec{a_2} \times \vec{a_3}) = L_xL_yL_z
$$

在我的molpy中, 我是这么写得

```python
class Box:
    def __init__(self, boundary_condition: Literal["ppp"], **kwargs) -> None:

        # ref:
        # https://docs.lammps.org/Howto_triclinic.html
        # https://hoomd-blue.readthedocs.io/en/stable/box.html

        """Describes the properties of the box"""

        self.boundary_condition = boundary_condition
        self._boundary_condition = self.boundary_condition
        self._x_bc, self._y_bc, self._z_bc = self.boundary_condition

        self._pbc = np.asarray([i == "p" for i in boundary_condition])

        if "xhi" in kwargs:
            self.defByEdge(**kwargs)

        elif "a1" in kwargs:
            self.defByLatticeVectors(**kwargs)

        elif "lx" in kwargs:
            self.defByBoxLength(**kwargs)

    def defByEdge(
        self, xhi, yhi, zhi, xlo=0.0, ylo=0.0, zlo=0.0, xy=0.0, xz=0.0, yz=0.0
    ):
        """define Box via start and end which in LAMMPS and hoomd-blue style"""

        self.xlo = xlo
        self.ylo = ylo
        self.zlo = zlo
        self.xhi = xhi
        self.yhi = yhi
        self.zhi = zhi

        self.lx = self.xhi - self.xlo
        self.ly = self.yhi - self.ylo
        self.lz = self.zhi - self.zlo

        self.xy = xy
        self.xz = xz
        self.yz = yz
        radian2degree = 180 / np.pi

        b = np.sqrt(self.ly ** 2 + xy ** 2)
        c = np.sqrt(self.lz ** 2 + xz ** 2 + yz ** 2)
        self.gamma = np.arccos(xy / b) * radian2degree
        self.beta = np.arccos(xz / c) * radian2degree
        self.alpha = np.arccos((xy * xz + self.ly * yz) / (c * b)) * radian2degree
        self._post_def_()

    def defByLatticeVectors(self, a1, a2, a3):
        """define Box via lattice vector

        Args:
            a1 (np.ndarray): Must lie on the x-axis
            a2 (np.ndarray): Must lie on the xy-plane
            a3 (np.ndarray)
        """

        """
        self.lx = np.linalg.norm(a1)
        a2x = a1@a2/np.linalg.norm(a1)
        self.ly = np.sqrt(a2@a2-a2x**2)
        self.xy = a2x/self.ly
        crossa1a2 = np.cross(a1, a2)
        self.lz = np.linalg.norm(a3) * (crossa1a2/np.linalg.norm(crossa1a2))
        a3x = a1@a3/np.linalg.norm(a1)
        self.xz = a3x/self.lz
        self.yz = (a2@a3-a2x*a3x)/self.ly/self.lz
        """
        if a1[0] <= 0 or a1[1] != 0 or a1[2] != 0:
            raise ValueError("a1 vector must lie on the positive x-axis")
        else:
            self.xhi = self.lx = a1[0]

        if a2[1] <= 0 or a2[2] != 0:
            raise ValueError(
                "a2 vector must lie on the xy plane, with strictly positive y component"
            )
        else:
            self.yhi = self.ly = a2[1]
            self.xy = a2[0]

        if a3[2] <= 0:
            raise ValueError("a2 vector must own a strictly positive z component")
        else:
            self.zhi = self.lz = a3[2]
            self.xz = a3[0]
            self.yz = a3[1]

        self.xlo = 0
        self.ylo = 0
        self.zlo = 0

        self._post_def_()

    def defByBoxLength(self, lx, ly, lz, alpha=90, beta=90, gamma=90):
        """define the Box via edge lengthes and angles between the edges"""
        self.gamma = gamma
        self.beta = beta
        self.alpha = alpha

        degree2rad = np.radians(1.0)

        self.xlo = 0
        self.ylo = 0
        self.zlo = 0
        self.xhi = lx
        xy = ly * np.cos(gamma * degree2rad)
        xz = lz * np.cos(beta * degree2rad)
        self.yhi = np.sqrt(ly * ly - xy ** 2)
        yz = (ly * lz * np.cos(alpha * degree2rad) - xy * xz) / self.yhi
        self.zhi = np.sqrt(lz * lz - xz ** 2 - yz ** 2)

        self.lx = self.xhi - self.xlo
        self.ly = self.yhi - self.ylo
        self.lz = self.zhi - self.zlo

        self.xy = xy
        self.xz = xy
        self.yz = yz

        self._post_def_()

    def _post_def_(self):
        # box basis
        self._basis = np.array(
            [[self.lx, 0, 0], [self.xy, self.ly, 0], [self.xz, self.yz, self.lz]]
        )
        self._orthorhombic = not (np.flatnonzero(self._basis) % 4).any()
        box_inv = np.linalg.inv(self._basis)
        len_abc_star = np.sqrt(np.sum(box_inv * box_inv, axis=0))
        self.h_box = 1 / len_abc_star

    @property
    def basis(self):
        return self._basis

    @property
    def x_vec(self):
        return self._basis[0]

    @property
    def y_vec(self):
        return self._basis[1]

    @property
    def z_vec(self):
        return self._basis[2]

    @property
    def origin(self):
        return np.array([self.xlo, self.ylo, self.zlo])

    @property
    def volume(self):
        return np.abs(np.linalg.det(self._basis))

    def angles(self):
        return np.asarray([self.alpha, self.beta, self.gamma])

    def lengths(self):
        return np.linalg.norm(self._basis, axis=1)

    @property
    def orthorhombic(self):
        return self._orthorhombic

    @property
    def pbc(self):
        return self._pbc

    def wrap(self, position):
        """wrap position(s) array back into box

        Args:
            position (np.ndarray)

        Returns:
            np.ndarray: wrapped position(s)
        """
        offset = np.floor_divide(position, self.h_box)
        return position - offset * self.h_box + self.origin

    def displace(self, pos1, pos2):
        """find the distance between two positions in minimum image convention(mic)

        Args:
            pos1 (np.ndarray)
            pos2 (np.ndarray)

        Returns:
            np.ndarray
        """
        return self.wrap(pos1) - self.wrap(pos2)
```


## cell list

cell list的中心思想是将box平分为形状相等的小块, 使得查询仅在当前小块和周围的小块中进行. 

对于平行六面体盒子的体积, 我们有

$$
    V = \vec{a_1}\cdot(\vec{a_2} \times \vec{a_3}) = |\vec{a_2} \times \vec{a_3}|h
$$

即体积也等于一个面的面积乘以垂直于这个面上的高

$$
    \frac{1}{h} = \frac{|\vec{a_2} \times \vec{a_3}|}{\vec{a_1}\cdot(\vec{a_2} \times \vec{a_3})}
$$

两边平方开根号, 得

$$
    \frac{1}{h} = |\frac{1}{\vec{a_1}}| = \sqrt{(\frac{1}{a_x})^2+(\frac{1}{a_y})^2+(\frac{1}{a_z})^2}
$$

> 是这么算吧

然后计算一下在这个高度上, 能划分多少个cell. 最后遍历所有原子, 用原子坐标整除格子得尺寸就得到了所在格子的坐标. 我们看一下具体实现

```python

def factory_ndarray_dtype_list(shape):
    return np.frompyfunc(list, 0, 1)(np.empty(shape, dtype=list))


def getPos(atom):
    return getattr(atom, "position")

class CellList:
    def __init__(self, box, rcutoff) -> None:

        assert isinstance(box, Box), TypeError(
            f"box must be an instance of Box class, but {type(box)}"
        )

        self.box = box
        self.rcutoff = rcutoff

    def build(self):

        box = self.box.basis
        rc = self.rcutoff

        box_inv = np.linalg.inv(box)
        len_abc_star = np.sqrt(np.sum(box_inv * box_inv, axis=0))
        h_box = 1 / len_abc_star  # the "heights" of the box

        # cell_vec := n_cell_x, n_cell_y, n_cell_z
        self.cell_vec = np.floor_divide(h_box, rc).astype(np.int32)

        # cell_list is a numpy.ndarray with dtype=list
        self.cell_list = factory_ndarray_dtype_list(self.cell_vec)
        self.ncell = np.prod(self.cell_vec, dtype=int)
        self.cell_size = np.diag(1.0 / self.cell_vec).dot(box)
        self.cell_inv = np.linalg.inv(self.cell_size)

    def reset(self):

        self.build()

    def update(self, atoms, rebuild=True):

        if rebuild:
            self.build

        positions = np.vstack(map_getPos(atoms))

        wrapped_pos = self.box.wrap(positions)

        # batch process of coordinate of atoms
        # find belong to which cell
        indices = np.floor(np.dot(wrapped_pos, self.cell_inv)).astype(int)

        for cell, atom in zip(
            self.cell_list[indices[:, 0], indices[:, 1], indices[:, 2]], atoms
        ):
            cell.append(atom)

    def getAdjCell(self, center_index, radius=1):

        cell_list = self.cell_list

        # edge length
        length = radius * 2 + 1

        # length^3 exclude (0, 0, 0)
        adj_cell_list = factory_ndarray_dtype_list((length ** 3 - 1))  # 1-d ndarray

        index = 0
        for adj_increment_index in np.ndindex((length, length, length)):

            adj_index = center_index + np.array(adj_increment_index) - radius
            if np.array_equal(adj_increment_index, np.array([0, 0, 0])):
                continue

            # wrap
            offset = np.floor_divide(adj_index, self.cell_vec)
            adj_index -= offset * self.cell_vec

            adj_cell_list[index] = cell_list[tuple(adj_index)]
            index += 1

        return adj_cell_list

```

## neighbor list

既然已经有了cell list, 那构建neighborlist就不用关心空间问题了. 我取一个cell, 获取周围26个cell, 检查哪些atom在中心atom的cutoff之内, 同时记录位移矢量和距离, 避免后面的重复计算.

```python
class NeighborList:
    def __init__(self, cellList) -> None:

        self.rcutoff = cellList.rcutoff
        self.cellList = cellList
        self.box = cellList.box
        self.build()

    def build(self):

        self.neighbor_list = {}  # DefaultDict(list)

    def reset(self):

        self.build()

    def update(self, atoms=None):

        if atoms is not None:
            self.cellList.update(atoms)

        cellList = self.cellList.cell_list
        for index, cell in np.ndenumerate(cellList):
            adj_cells = self.cellList.getAdjCell(index)  # (nadj, ) dtype=list
            for atom in cell:

                # TODO: get positions from adj cells cost half of time
                cen_pos = atom.position  # center atom's position
                adj_atoms = []
                for cell in adj_cells:
                    adj_atoms.extend(cell)
                # map_extend = np.vectorize(adj_atoms.extend)
                # map_extend(adj_cells)
                adj_atoms = np.asarray(adj_atoms)

                pair_pos = np.vstack(map_getPos(adj_atoms))
                # pair_pos = np.array(map(lambda atom: getattr(atom, 'position'), adj_atoms))

                dr = pair_pos - cen_pos
                distance = np.linalg.norm(dr)
                nei_atoms = adj_atoms[distance < self.rcutoff]
                # sparse
                self.neighbor_list[atom] = {
                    "neighbors": nei_atoms,
                    "drs": dr,
                    "distances": distance,
                }

```

不得不说, 这种动态的构建方式速度非常慢, 不过能用. 注意此时的neighbor_list是一个"链表", 适合于稀疏矩阵. 如果体系是homogeneous或者dense的, 这里应该改成二维数组, 列的长度是原子的个数, 行的长度通过体系密度估计. 这个临近表还有个问题是没有考虑skin