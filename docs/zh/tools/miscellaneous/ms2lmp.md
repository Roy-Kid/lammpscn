# Material Studio建模文件转LAMMPS data

<DIV class="author">作者: <i>朗星yi</i></DIV>


> 利用 `msi2lmp` 将 Material Studio 建模文件转换成 LAMMPS 识别的 .data 坐标文件，并通过修改`frc`文件的环境变量解决程序运行时`cvff_frc`文件不存在等问题。

## 导出坐标文件
首先在Material Studio中导出建模文件时就要选择 Insightll Molecule Files(*.car，*.cor），此时会生成相应的 **.car 和 **.mdf 坐标文件。对于常见的cvff，compass力场，最好在 Forcite Tools 工具中选择 Calculation，在Energy选项中就确定好相应的力场文件之后run。方便lammps转换时生成准确的势函数参数。

## 生成 msi2lmp.exe
在/lammps/tools/msi2lmp/src文件下，输入指令：

```
sudo make （此时会生成msi2lmp.exe的可执行文件）
```

最关键一步，添加力场文件的环境变量，要不然在转换的时候会提示 /frc_files/cvff.frc cannot open等等之类的问题。

可以选择将/lammps/tools/msi2lmp/frc_files中的所有文件或者是frc_files整个文件夹复制到 /usr/local/frc_files文件夹下，或者是不用复制，直接选择lammps的安装位置也行。这里以 /usr/local/frc_files为例(默认你应经复制了相应文件)，在桌面输入指令：

```
cd ~
sudo vim .bashrc
```

在文档的最后面添加以下内容：

```
export MSI2LMP_LIBRARY=/usr/local/frc_files$MSI2LMP_LIBRARY
```

（当然你也可以将frc文件的绝对路径带入，也就是lammps的安装位置/your/path/lammps/tools/msi2lmp/frc_files）

保存退出，输入指令：

```
source .bashrc
```

## 转换 .data 文件

在桌面新建一个文件夹，将/lammps/tools/msi2lmp/src中生成的msi2lmp.exe复制到此文件夹下，同时复制Material Studio导出的 **.car 和 **.mdf 文件到此文件夹下，输入指令：

```
./msi2lmp.exe ** -i -class 1 -frc cvff > data.** 
```

指令中 **代表 .car 文件的命名，-i 代表忽略错误，1 代表势函数类型， -frc cvff 代表采用cvff.frc文件进行坐标编译。如果采用 compass.frc文件进行坐标编译，则需改成： `./msi2lmp.exe ** -i class 2 -frc compass > data.**` （具体选项可以参考/lammps/tools/msi2lmp/ 下的 README文件）

此时会生成 **.data 和 data.** 文件，其中 **.data 文件就是lammps能识别的坐标导入文件。一般来说，还需要自行修改相应的势函数参数，这个需要自行处理。