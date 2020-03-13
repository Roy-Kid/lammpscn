# 使用指北

## 安装

代码目前托管在GitHub上，建议下载dump.py然后和所要计算的dump文件放在同一目录下。

## 使用

本工具设计时采取的管道模式，即按照正常思路一步步来，总是能得到结果。

::: tip
首先建议使用vscode，自带交互环境，既可以编程进行，也可以交互使用。
:::

### 读取文件

先实例化一个Dump类
```python
d = dump('test.dump')
```
这时候就定位到了dump文件的位置，然后再可以通过“索引”的方式获取每一帧
```
snap = d[80000][0]
```
注意，d后面的第一方括号内是指明哪一帧，有三种情况。1.正数，必须是每一帧前的TIMESTEP数而不是索引；2.负数，含义和索引一样，-1仍然是倒数第一帧；3. 切片，目前只支持正着切，也就是从某一TIMESTEP到某一TIMTSTEP。

其后第二个方括号是返回的列表的索引。dump文件读取后，每一帧被写成字典，所有的帧字典储存在一个列表里，因此可以使用第一个方括号索引。为了保证出口类型的一致性，不管是仅返回一个帧还是一系列帧，都是列表类型，因此如果返回一个帧也需要用[0]获取。

由此我们拿到了dump中的一个帧，接下来就是对这一个帧操作。帧是一个类，类属性（实例属性）由

| | |
|:---:|:---:|
| timestep | nofAtoms |
| boundary_condition_x(y/z) |
| xlo | xhi |
| header | length |

意味着如果想获取这个帧的信息，我们仅需：
```python
timestep = d[80000][0].timestep
# 或
xlo = snap.xlo
```

ok，我们现在掌握了对某一帧的完全控制权，然后我们可能要计算某一分子的性质，比如均方回转半径。首先需要将这个分子提取出来：
```python
mols = Molecules(snap)
```
这里将整个帧传进去，就可以自动按照mol-id分类。类在实例化的过程中将相同分子的粒子信息，也就是mol-id相同的，分别储存到一个Molecule实例中，然后储存在Molecules维护的一个列表中。如果我们想获取某一分子的信息，还是通过索引进行:
```python
m102 = mols[102] # 获取mol-id为102的分子
```
然后就可以进行计算了。
下面需要谈一下计算的逻辑。如果是按照type，或者molecule这样分类，那么，我们计算函数应该这样编写：

```
def com_gyration(mol, xi=3, yi=4, zi=5):
    """计算均方末端距
    
    Args:
        mol (Molecule instance): 传入单链，一个Molecule实例
        xi (int, optional): 未折叠的x在dump文件中的位置. Defaults to 3.
        yi (int, optional): 未折叠的y在dump文件中的位置. Defaults to 4.
        zi (int, optional): 未折叠的z在dump文件中的位置. Defaults to 5.
    
    Returns:
        [float]: 均方末端距。$\overline{S^2}$
    """        
    do_calculation

```
应该向函数传入一个Molecule实例，也就是直接通过Molecules索引得到的一个实例。然后再使用repeat函数对整个帧批量处理：

```python
m102 = mols[102]
com_gyration(m102) # 得到一个分子的均方回转半径
result = repeat(com_gypration, mols)
```
然后会返回一个由每一个分子均方回转半径组成的列表。注意由于每个人的dump格式会略有不同，这里需要指定xu，yu，zu三个参数的位置。默认的HEADER 是 id mol-id type xu yu zu，所以如果有所不同，请在函数或者repeat中手动指定：

```python

com_gyration(m102, 3, 4, 5) # 得到一个分子的均方回转半径
result = repeat(com_gypration, mols, xi=3, yi=4, zi=5)
```

如果一个分子由很多个“分子”（mol-id）相同的组成怎么办，如何再将其组合起来。这里提供了一个Parts容器，这个容器的特殊之处在于，它可以储存它自身，并可以自定分类方式。

比如说我有一个体系，基质是160条分子，掺杂了接枝了8条链的纳米棒50根，那么，应该这样做：

```python
def ref(molecules):

    matrix = 160 定义参数。下面考虑最简单的情况，假如都是有序的
    rod = 1
    graft = 8
    
    container = list()

    # 前160链都是基质，放到Parts里成为一个整体
    container.append(Parts('matrix', molecules[1:matrix+1]))

    for i in range(50):
        # 1+8为一个循环，把纳米棒分开放
        container.append(Parts(f'graft{i+1}', molecules[matrix + i* (rod+graft) : matrix + (i+1)* (rod+graft)+1]))

    # 这里返回地是一个装着parts的容器，
    return container

# 顶层parts同样有id，传入molecules以供分类，依据是ref
p = Parts('top', molecules, ref)
```
