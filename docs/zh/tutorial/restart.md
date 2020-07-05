# 暂停与重启

通常来讲，我们的计算都要持续几十到几天的时间。在这段时间里，谁都不能保证系统不崩溃/机房不跳闸/保洁员不把插头拔下来给手机充电。或者说，进行到某一步时出现了错误，我们需要知道出错前发生了什么。所以，我们需要一种机制来随时储存进度，可以快速地重新开始。

## binary储存

LAMMPS可以把系统当前状态输出到一个二进制文件中，以供重新开始。二进制储存的好处是，输出快速，能储存部分的系统信息，重启时不需要再次输入。缺点是，二进制文件和系统属性相关，即这个机器上输出的二进制文件不一定可以在别的机器上运行，8核运行的程序再用4核跑不一定正确。

二进制文件中可以储存这些信息：

* Units
* system size/shape/boundary
* newton bond
* force field（atom/pair_style/coeff etc.）
* timestep
* comm style/modify
* group
* topology attributes(bonds angles etc.)
* special_bonds and pair_modify

不能储存这些信息：

* newton pair
* **fix**
* **compute**
* variable
* region
* neighbor list and neigh_modify
* kspace
* thermodynamic, dump or restart output

这就意味着，如果需要使用restart重启的话，不需要在input中补写系统信息，只需要把一些*修正和计算*参数补上就好。机制是这样的，很多fix和compute命令会将当前状态储存在restart中，如果重启时input文件中的fix-id和compute-id和之前一致，那么就是用之前的状态进行fix和compute。如果不一致则抛弃之前的状态重新开始新的。

有一些力场参数也不会被储存的，例如从单独文件中读取的many-body或者tabulated potential，还有**pair_hybrid**，这些也是需要重新指定。手册相关部分都会明确指出这些能不能储存在restart中，请明确。

尽管restart看似有种种限制，但是一般情况不需要考虑这么多，而这也是标准的储存状态的方式。借用游戏中的说法，每隔一段时间存档或者经过检查点是一个极好的习惯。

与dump类似，该命令的参数file中可以包括两个通配符。如果使用了“*”符号，该符号会被当前时间步的值代替；如果使用了“%”符号，那么每个处理器都会写一个文件，并且%符号会被处理器的ID代替（从0到P-1）。另外，还会有一个文件，文件名是用“base”代替“%”，其中包含了全局的信息。举例来说，如果使用通配符%，那么会写出的文件有restart.base，restart.0，restart.1，……，resta.P-1。使用这种通配符，会创建更小的文件，对于在并行机器中输出和后续的输入都是一种更快的方式。

写出的重启动文件可以使用命令read_restart读入，从而可以从一个特别的状态重新开始一个模拟。因为重启动文件是二进制的，因此在其他的机器上可能就不可读（二进制文件是依赖于机器的）。在这种情况下，可以使用tools目录下提供的restart2data程序将重启动文件转换为文本式的data file格式。命令read_restart和工具restart2data都可以读入由通配符%指定而输出的文件。

> 再次强调：尽管重启动文件的目的是要从写入重启动文件的位置开始一个模拟，但对一个模拟而言，并不是所有的信息都会存储在重启动文件中。

### restart

::: tip
此命令定位到[restart](https://lammps.sandia.gov/doc/restart.html)
:::

restart命令可以周期性地输出二进制储存文件，相当于每个多少步设置一个checkpoint：

```
restart N file keyword value ...

```

* N 指每隔多少步输出一次
* file 输出文件的文件名
* kw 和 v 可选，请自行查询手册

### write_restart

::: tip
此命令定位到[write_restart](https://lammps.sandia.gov/doc/write_restart.html)
:::

write_restart 和 restart的唯一区别是，restart是周期性输出，而write_restart只写一次。因此两个命令几乎有着相同的格式。

## data储存

二进制储存其实最大的问题在于它不通用。如果想在别的机器上运行，必须先在本机上先通过命令行参数-restart2data转换成data文件才可以。因此我们可以认为这种储存方式只能短期地知根知底地使用。

但是data文件不一样，它是显式地以文本储存，拿到哪都可以使用。但是它输出会更慢一些，所以没有周期性输出这样的功能。

### write_data

::: tip
此命令定位到[write_data](https://lammps.sandia.gov/doc/write_data.html)
:::

```
write_data file keyword value ...
```

当file名中出现"*"通配符时，在输出的时候会被替换成当前的步数，再次重启时如有需要，可以用[reset_timestep](https://lammps.sandia.gov/doc/reset_timestep.html)重新设定。

虽然write_data可以输出一些力场参数，但是强烈建议在keyword 中使用nocoeff 和 nofix取消。原因在于，由于机制限制，很多的力场参数不会被储存，因此每一次仍需要重新设置。所以建议不要输出这些冗杂信息，每次都当作一次新的模拟，清清爽爽地开始。

## 重启 

::: tip
针对这两个命令，没有什么太多变化可言。同样可以参照手册来确定那些不常用的细节和限制。
:::

如果要重启二进制文件，请使用read_restart，如果要重启data文件，请使用read_data. 