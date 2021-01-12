---
sidebarDepth: 4
---

# 启动计算

::: tip
本节教程定位到[手册](https://lammps.sandia.gov/doc/Run_basics.html)的4.1与4.2小节

:::
LAMMPS从命令行启动，读取input文件中的指令，读入data文件中的数据，开始其计算流程。

通常你应该从input文件和data文件的位置开始计算，相应的输出文件也会存在这个目录下，除非你指定了其路径。


## 基本操作

```sh
# 单核运行，不使用MPI
lmp_serial -in in.file

# 并行计算，使用MPICH框架
mpirun -np 4 lmp_mpi -in in.file
```
LAMMPS的核心是编译结束后得到的那个百兆左右的可执行文件（原始名称为lmp，可自行修改）。单核的时候直接启用就好。并行运算时首先使用并行命令mpirun，然后用-np x指定使用多少核进行计算。这个核首先尽量是2的倍数，其次这个核数指的不是物理核心数而是线程，即如果有8核16线程的超线程CPU，最多可以进行-np 16。接下来使用-in指定input文件即可。注意这里不建议使用重定向符"<"导入脚本，因为有时会引发某些错误。
回车后可以看到计算直接开始运行，并输出系统的热力学信息。但是，计算现在是执行在前台，如果远程登陆集群或者服务器，当你断开连接的时候会杀死进程。因此如果需要将任务提交到后台，我们可以：
```sh
nohup mpirun -np 4 lmp_mpi -in in.file &
```
这样任务便在后台进行，相关的信息和错误会输出到目录下nohup文件中。

## 命令行参数

在执行基本操作之外，可以在命令行中增加一些参数来更改一些功能。

* -e or -echo

* -h or -help

* -i or -in

* -l or -log

* -nc or -nocite

* -pk or -package

* -p or -partition

* -pl or -plog

* -ps or -pscreen

* -ro or -reorder

* -r2data or -restart2data

* -r2dump or -restart2dump

* -sc or -screen

* -sf or -suffix

* -v or -var

### -e style

如果我们将运行开始后输出到命令行的系统信息和热力学信息称为运行记录的话，这个参数指定的是应该将其输出到什么地方。可选*screen*，*log* 和 *both*。默认输出到log。

### -help
输出帮助相关信息。

### -in file
指定使用的input文件。

### -log file
指定LAMMPS将运行记录输出到的文件名，默认是log.lammps。如果需要每一个部分独立输出日志文件，请参考手册中-plog参数核log command

### -nocite
禁止输出引用信息。默认是输出引用文件。这些引用信息应当被您的文献所引用。

### -pk
调用第三方包，如gpu等。

### -sf
自动在适用的命令前增加前缀，以开始特殊版本的命令，如gpu/lj/cut等。

### -restart2data 

直接将restart文件转换为data文件，
```
lmp -restart2data datafile keyword value 
```

等价于
```
read_restart restartfile [remap]
write_data datafile keyword value ...
```
具体请参考手册[read_restart](https://lammps.sandia.gov/doc/read_restart.html) [write_data](https://lammps.sandia.gov/doc/write_data.html)

-restart2dump 同理，等价于
```
read_restart restartfile
write_dump group-ID dumpstyle dumpfile arg1 arg2 ...
```

### -screen file

指定计算时屏幕内容输出的文件。有时候来说log只会将系统信息输出到文件，而screen会将所有在终端中打印的信息输出到文件。

### -suffix style args

将适用的命令加上相应的前缀:
```
-sf gpu

pair_style lj/cut =>
pair_style gpu/lj/cut
```

### -var value1 value2

给脚本中的变量值重新赋值