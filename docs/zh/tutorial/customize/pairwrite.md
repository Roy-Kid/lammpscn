# pair_write 检查势函数曲线

好了, 在读完手册之后, 你开始一头雾水地往脚本里写参数, 然后忐忑不安地开始运行,然后不出意外地发现unstable或者其他的莫名其妙问题. 这时候需要检查一下势函数是不是真的是如你所想填对了值, 或者是真的是有一些bug. 这时候就需要pair_write command, 将势做出图来.

```bash
pair_write itype jtype N style inner outer file keyword Qi Qj
    itype/jtype := 哪两个原子间的势
    N := 势函数按照什么大小的bin输出(分辨率)
    style : r or rsq or bitmap
        r := 以半径为横坐标 
        rsq := 以r平方为横坐标
    inner/outer := 势函数输出的范围 (从 inner 到 cutoff)
    file := 文件名
    keyword : 每一列的名称
    Qi Qj := 可选
```

这样, 就能把势的曲线输出到文件中, 其中第一行是序号, 第二行半径, 第三行能量, 第四行force

然后做一下图, 看看是不是和自己想的一样.

注意style里有一个bitmap, 这个功能是生成特定格式的势能表. 这个功能和pair_style table是相联系的. 鉴于不是所有人都有能力去修改源代码, 因此lammps自带了一个极为强大的功能, 那就是可以读入一张包括这半径,能量,力的表, 由这张表拟合出一个函数然后做接下来的计算. 这样, 可以轻松用python生成足够多的点, 然后让lammps使用这些点拟合出的函数曲线做接下来的计算.