# 临近表

# chap4. neighbor list

考虑一个具有N个粒子的均质体系. 如果我们要计算粒子对之间的相互作用, 不考虑截断的情况下我们需要计算N(N-1)/2次; 即便考虑截断, 我们也需要计算同样次数的距离来描述相互作用的粒子对. 这就意味着如果不引入一些技巧, 计算量是O(N^2), 根本无法接受. 前文中我们介绍了计算长程相互作用力的技巧, 本文中引入计算短程相互作用力的临近表. 对于均质体系, 主流的技术有

1.  Verlet list
2.  Cell/linked list

## Verlet list

![cutoff](/advanced/nbl/cutoff.png)

对于体系中任意一个粒子, 它处在其他粒子构成的环境中. 如果要计算它与其他粒子相互作用需要计算N(N-1)/2次. 然而, 短程相互作用随距离衰减非常快, 意味着超出cutoff之外的相互作用我们通常可以忽略不急. 因此, 只需要计算在中心粒子(central atom)周围的对粒子(pair atom)即可. 但是对于储存在计算机中的粒子信息, 是无法直接得知某个粒子周围到底有哪些其他的粒子, 因此还是得对整个体系进行遍历, 判断粒子间距离和截断距离之间的关系.

但我们考虑到, 由于timestep通常选取地很小, 每一步中粒子动力学积分后移动的距离不会太远, 所以没有必要每一步都要遍历系统计算所有距离. 所以能不能计算一次, 然后使用好几次呢. 这就是Verlet的基本思路, 从而将**使用临近表**时的时间降到了O(N).

例如在LAMMPS中, 利用C++的指针特性, verlet list构建完成是这样的

![lmp_nbl](/advanced/nbl/lmp_nbl.png)

`ilist`是体系中每一个粒子, 因此`inum`等于体系中所有原子的数量N. `ilist`中的每一个元素都是firstneigh的指针, 其储存着周围粒子的信息, 数量是`numneigh`. 当Verlet构建好之后, 只需要使用双循环对临近表进行遍历, 就可以在O(N)中计算出所有的对相互作用.

![](/advanced/nbl/lmp_nbl_code.png)

有一个隐含的问题是, 如果在重建临近表的间隔内, 有些粒子跑出/跑入相互作用范围怎么办(抛出意味着不应该计算的被计算了, 对结果没有太大影响; 跑入意味着应该被计算的却没被计算, 对结果有影响). 这就需要一些规则. 例如, 在cutoff之外会有一个rs的缓冲区, 重点监视其中的粒子. 如果其中的数量变化过大, 那就认为这是dangerous, 需要立刻重建临近表.

如何建立Verlet表呢. Bekker et al提出了在周期性边界条件下建立临近表的一种算法. 对于每一个粒子i, 它的合力可以写成
$$
F_{i}=\sum_{j=1}^{N} \sum_{k=-13}^{13} F_{i(j . k)}
$$
也就是说, 粒子i会和周围的N个粒子相互作用(j 从1到N), 但是考虑到周期性, 还需要计算中心盒子周围的26个盒子中的粒子(3^3-1=26). (jk)不是百褶裙, 代表第k个盒子中的第j个粒子. 盒子k可以由三个整数写成
$$
k=9n_x+3n_y+n_z
$$
平移向量
$$
\mathbf{t}_k=n_x\mathbf{L}_x+n_y\mathbf{L}_y+n_z\mathbf{L}_z
$$
在这种表示方式下, i j之间相互作用可以写成
$$
\mathbf{F}_{i(j . k)}=\mathbf{F}_{(i .-k) j}=-\mathbf{F}_{(j . k) i}=-\mathbf{F}_{j(i . k)}
$$
给出一个python形式的伪代码

```python
def new_vlist():
    for i in range(nparticle):
        nlist[i] = 0          # nlist:=临近粒子数
        xv[i] = x[i]          

    for i in range(nparticle-1): # 双循环遍历所有粒子
        for j in range(i+1, nparticle):
            xr = x[i] - x[j]     # xr:=间隔矢量
            if (xr > hbox):      # 找到最近的镜像
                xr = xr - box    # 对每个维度都wrap
            elif (xr < hbox):
                xr = xr + box
            if (norm(xr) < rv):  # 如果小于截断距离
                nlist[i] += 1    
                nlist[j] += 1
                list[i, nlist[i]] = j # list[i,j]:=临近表信息
                list[j, nlist[j]] = i # i j 是第几个原子,和位置列表x保持一致
```

NOTE: 这里我刚意识到一个问题, 就是上面的verlet list的形式和LAMMPS的不太一样. 这里的list肯定是一张(N*capacity)的二维数组, 其中capacity是所有原子中临近原子最大的数量. 如果对于一个均质体系, 也就是说各处密度几乎相同, 那么这张表几乎可以完全填满. 但是对于非均质体系, 显然是一个稀疏矩阵. 对于稀疏体系, 有其他的技术可以来解决, 这里先不展开.

[HOOMD-blue: neighbor list](https://hoomd-blue.readthedocs.io/en/stable/nlist.html)

注意这里的临近表构建, 也就是` if (norm(xr) < rv)`: 开始. 每搜索到一个符合要求的对原子, 中心原子`i`周围的对原子数量(`nlist[i]`)就会增加1, 对称地, 对原子j周围的原子数`nlist[j]`同样加1. 这个递加可以保证填充临近表的时候是顺序的. list是真实的储存临近信息的表. `list[i, nlist[i]]`意味着对于第`i`个粒子周围会顺序写入对原子的信息. (反正自己理解一下,`i/j`这些都是位置表x中的索引).

构建之后, 我们计算相互作用可以写成

```python
energy = 0
for jj in range(nlist[i]):
    j = list[i, jj]
    energy += enij(i, x[i], j, x[j]) # enij := 计算ij之间的能量的函数
```

![](/advanced/nbl/verlet.png)

通过这种周期性的处理, 我们把"拿着粒子i去计算所有周期盒子中的j"变成了"拿着周期性盒子中的i去计算中心盒子中的j". 上图就能看出区别, 下式是数学表示.
$$
F_{i}=\sum_{j=1}^{N} \sum_{k=-13}^{13} F_{(i . k) j}
$$

## cell list

构建完成的verlet list很容易访问, 但是有个问题是构建的时候还是需要对整个体系进行遍历, 这个时间复杂度是O(N^2). 能不能把这个时间复杂度再降下来呢, 能不能应用相同的思路, 只去搜索粒子周围的粒子而不是对全局搜索?

![](/advanced/nbl/cell.png)

cell list的思路是把整个体系分割成边长为截断距离的小格子, 构建verlet list的时候只在周围的格子中遍历. 你可以理解成我们用了两次这种分而治之的思想. 

对于cell list, 需要计算距离的粒子数为
$$
n_c=27\rho r_c^3
$$
对于verlet list, 需要计算
$$
n_v=\frac{4}{3}\pi \rho_v^3
$$
$r_c$是纯纯的cutoff, $r_v=r_c+r_s$就是之前说的缓冲距离, 通常是$r_s = 0.2r_c$对于Lennard-Jones势, $r_c=0.2\sigma, r_v=r_c+r_s=0.7\sigma$ . 带入可以算出$n_c$比$n_v$大的五倍.  因此, verlet计算量比cell list小16倍. 

Auerbach将两种技术结合起来, 使用cell list去构建verlet list, 解决了构建verlet时的O(N^2).

构建cell list 的伪代码如下

```python
def new_clist():
rn = box/int(box/rc) # 计算cell的尺寸, rn>=rc

for icell in range(ncell): # 初始化每一个cell
    hoc(icell) = 0

for i in range(len(ll)):   # 初始化ll
    ll[i] = -1

for i in range(naprticle): # 遍历体系
    icell = int(x[i])/rn   # 检查粒子i在哪个cell中
    ll[i] = hoc[icell]     # linked-list的第i个元素是hoc第icell个元素
    hoc[icell] = i         # 将第i个粒子储存在hoc中
```

NOTE: 这里反而是采用的链表的数据结构, 有些抽象, 需要仔细想一下, 我没能画出一个很直观的图帮助大家理解. 

hoc是head_of_chain的简写, 遍历体系的时候会不断地向内压入在`icell`的粒子. `ll`是linked_list的简写, 它储存的是上一个`hoc[icell]`的值. 由此, 这个构建历程是

1.  判断粒子i在哪个cell中
2.  `ll[i]`记录上一个在这个cell中的粒子
3.  更新`hoc[icell]`

循环完成之后, `hoc`中记录着这个`cell`中最后被循环到的粒子. 例如我们想知道`icell==5`中的所有粒子, 我们去hoc中查找最后一个被记录的粒子`i=hoc[icell]`. 然后用这个粒子去ll中查到倒数第二个被记录的粒子`j = ll[i]`; 再上一个粒子`k = ll[j]`, 以此类推直到`ll[x]`的值是0. 如果我们要计算`i`粒子和它所在的cell中所有粒子的相互作用, 我们可以这么写

```python
energy = 0
icell = int(xi/rn)
for ncell in range(nneigh):
    jcell = getNeigh(icell, ncell) # 依次获取icell周围的cell
    j = hoc[jcell]    # 最后一个原子
    while j != -1:   # 链表结束之前
        if i != j:   # 拒绝和自己相互作用
            energy += enij(i, xi, j, x[j])
        j = ll[j]
```

如果不用任何技巧, 计算时间是
$$
\tau = cN(N-1)/2
$$
如果使用verlet, 计算时间是
$$
\tau_v = cn_vN + \frac{c_v}{n_u}N^2
$$
第一项是使用verlet, 第二项是更新verlet.   $n_u$是更新的频率. 下同.

cell list的时间是

$$\tau_c = cn_cN+\frac{c_l}{n_u}N$$

第一项是使用cell list, 第二项是构建cell list. 

如果我们把两者结合起来, 即用cell的`O(N)`代替从全局构建verlet list的`O(N^2)`, 有
$$
\tau = cn_vN + \frac{c_l}{n_u}N
$$
一下就将时间减少到了`O(N)`.

两者连用, 用伪代码写作

```python
if abs(x[i] - xv[i]) > (rv - rc) or \ # 重建规则
                        n % nu == 0: 
    update_nblist()

def update_nblist():
    hoc, ll = new_clist()
    for i in range(nparticle):
        icell = int(x[i]/rn)
        for ncell in range(nneigh):
            jcell = getNeigh(icell, ncell)
            j = hoc[jcell]
            while j != -1:
                if i != j:
                    xr = x[i] - x[j]
                    if xr > hbox:
                        xr -= box
                    elif xr < hbox:
                        xr += box
                    if norm(xr) < rv:
                         nlist[i] += 1
                         nlist[j] += 1
                         list[i, nlist[i]] = j
                         list[j, nlist[j]] = i       
```

完. 