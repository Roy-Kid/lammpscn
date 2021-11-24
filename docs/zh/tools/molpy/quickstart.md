# Quick start

像numpy一样导入
```python
import numpy as np
import molpy as mp
```
像搭建乐高®一样搭建分子
```python
# 定义一个原子
H1 = Atom('H1')
H2 = Atom('H2')
O = Atom('O')
# 定义一个容器
H2O = Group('H2O')
H2O.addAtoms([H1, H2, O])
# 定义键接关系
H2O.addBondByName('H1', 'O')
H2O.addBondByName('H2', 'O')
```
自动搜索拓扑结构
```python
H2O.searchAngles()
H2O.searchDihedrals()
```
一次定义参数, 直接应用全局
```python
ff = ForceField('SPCE')
H = ff.defAtomType('H', mass=1.001, charge=0.3, element='H')
O = ff.defAtomType('O', mass=15.9994, charge=-0.6, element='O)
OHbond = ff.defBondType('OH', style='harmonic', r0=0.99, k=1.12)
HOHangle = ff.defAngleType('HOH', style='harmonic', theta0=108, k=0.8)

ff.render(H2O)
```
完全基于面向对象编程, 信息立等可取
```python
>>> H2O.getAtomByName('H1')
<Atom H1>
>>> H2O.getAtomByName('H1').position
array([1, 2, 3])
>>> H2O.bonds
[<Bond H1-O>, <Bond H2-O>]
>>> H2O.bonds[0].length
1.08
```
可对任意分子/基团进行空间调整
```python
H1.move((1,2,3))       # 平移一个矢量
H2O.rot(132, 1, 0, 0)  # 欧拉角旋转
```
使用Python构建您的分子就是如此简单!