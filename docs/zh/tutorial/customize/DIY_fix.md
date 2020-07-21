# Fix style

`fix`是在一个动力学迭代中改变系统某些属性的操作。实际上，除了力的计算，临近表的建立和输出之外，都是`fix`。这包括了对时间积分（坐标和速度的更新）、约束或边界条件（SHAKE或walls）和参数计算（例如计算扩散系数）

## 举个栗子

“找到一个在Z方向上最高的粒子，然后给它施加一个力摁下去”

首先，我们先找一个功能近似的fix命令：`fix_addforce.cpp` 和 `fix_addforce.h`, 复制一份把名字改为`fix_addforceMaxZ.cpp`和`fix_addforceMaxZ.h`；

其次，考虑一下原本我们需要什么参数：

```
fix ID group-ID addforce fx fy fz keyword value ...
```

`fix add_force`命令允许用户提供力的矢量，然后给特定的粒子施加力。因此需要`fx`,`fy`,`fz`三个参数来指明力的方向；有`every`每多少步施加一次力;`region`给哪个区域施加力;`energy`计算被施加力的原子的势能。那么现在，我们是想给超过一定高度（z轴）的原子一个力，把它压下去。因此我们还需要一个额外的参数阈值`threshold`，来指明超过什么高度的原子会被摁下去，其他的都保持不变。

我们先来看`fix_addforceMaxZ.h`，

预处理部分，首先先将新的类注册到LAMMPS中：`FixStyle(your_command_name, class_name)`

类的声明, 第一行声明了从`Fix`中派生出的`FixAddForceMaxZ`类

第三行是类的构造函数`FixAddForceMaxZ`，必须(由`Fix`基类要求的)接受一个LAMMPS类的指针`LAMMPS *`，一个int和参数列表的指针。这三个参数将用来初始化`Fix`基类。

第四行是析构函数，用来在这个类不用以后删除掉以释放所占用的资源。

接下来都是需要实现的方法和声明的私有成员。

```cpp
     // fix_addforceMaxZ.h

     #ifdef FIX_CLASS
---  FixStyle(addforce, FixAddForce)     
+++  FixStyle(addforceMaxZ,FixAddForceMaxZ)
     
     #else
     
     #ifndef LMP_FIX_ADDFORCE_H
     #define LMP_FIX_ADDFORCE_H
     
     #include "fix.h"
     
     namespace LAMMPS_NS {
---  class FixAddForce : public Fix {
+++  class FixAddForceMaxZ : public Fix {
      public:
       FixAddForce(class LAMMPS *, int nagr, char **);
       ~FixAddForce();
       int setmask();
       void init();
       void setup(int);
       void min_setup(int);
       void post_force(int);
       void post_force_respa(int, int, int);
       void min_post_force(int);
       double compute_scalar();
       double compute_vector(int);
       double memory_usage();
     
      private:
       double xvalue,yvalue,zvalue;
       int varflag,iregion;
       char *xstr,*ystr,*zstr,*estr;
       char *idregion;
       int xvar,yvar,zvar,evar,xstyle,ystyle,zstyle,estyle;
       double foriginal[4],foriginal_all[4];
       int force_flag;
       int ilevel_respa;
     
       int maxatom;
       double **sforce;
     };
     }
     
     #endif
     #endif
```

我们可以把`.h`文件理解为我们告诉系统，我们需要哪些资源以储存我们定义的新参数新方法。然后这些具体的实现是从`.cpp`中完成。

```cpp
// fix_addforceMaxZ.cpp
/// ---表示删除旧的代码；+++表示新代码

// 43行： 
---  if (narg < 6) error->all(FLERR,"Illegal fix addforce command");
+++  if (narg < 7) error->all(FLERR,"Illegal fix addforce command");
```

首先将参数个数检查由6改成7，因为我们增加了一个阈值参数。

```cpp
  // 58-81行，必选参数
  if (strstr(arg[3],"v_") == arg[3]) {
    int n = strlen(&arg[3][2]) + 1;
    xstr = new char[n];
    strcpy(xstr,&arg[3][2]);
  } else {
    xvalue = force->numeric(FLERR,arg[3]);
    xstyle = CONSTANT;
  }

  //为什么从arg[3]开始：因为arg[0]是ID，arg[1]是group-ID，arg[2]是addforceMaxZ
```

这一块代码由多个判断组成，目的是将参数中的`v_`变量提取出来。`strstr()`查看是否有b字符串，有则从首次发现b字符串处返回a字符串，没有则输出null。例如`strstr("v_force","v_")`将返回`v_force`。因此这行命令意为如果这个参数以`v_`开头则执行`if`代码块。我们这里不要`v_`变量，在`else`中将第六个字符串参数用`atof`转换成浮点型：

```cpp
// 82行：
     else {
     zvalue = force->numeric(FLERR,arg[5]);
     zstyle = CONSTANT;
     }

+++  threshold = atof(arg[6]);
     
     // 可以通过取消注释这一行命令来检查阈值是否设定正确
     // fprintf(screen,"Threshold = %f \n", threshold); 
```

下一步我们需要挑出超过阈值高度的粒子
所有粒子的坐标都储存在数组中，例如`x[i][0]`是第`i`个粒子的x坐标（1自然是y坐标，2是z坐标）。下面的循环遍历了指定group中的粒子，并找到在阈值之下z轴高度最高的粒子。

```cpp
// 274-302行:
// ---------------
      foriginal[0] = foriginal[1] = foriginal[2] = foriginal[3] = 0.0;
      force_flag = 0;
      
+++   int maxZ = 0;
+++   for (int i = 0; i < nlocal; i++){
+++      if (mask[i] & groupbit) {	
+++         // 调试代码
+++	        // fprintf(screen,"z[%d] = %f \n", i, x[i][2]);
+++	        if (x[i][2] <= threshold) {
+++		          if (x[i][2] > x[maxZ][2]) maxZ = i;
+++	        }
+++      }
+++   }
    
      // constant force
      // potential energy = - x dot f in unwrapped coords
    
      if (varflag == CONSTANT) {
        double unwrap[3];
        for (int i = 0; i < nlocal; i++)
```
如何施加力呢？我们再做一遍循环，找到特定的粒子向其施加力.同时，对于超过阈值的粒子，冻住它。这一段代码应该迁到原始代码的循环中：

```cpp
        if (estyle == ATOM) foriginal[0] += sforce[i][3];
        foriginal[1] += f[i][0];
        foriginal[2] += f[i][1];
        foriginal[3] += f[i][2];

		// 施加力
+++   	if (i == maxZ) {
+++         	if (xstyle == ATOM) f[i][0] += sforce[i][0];
+++         	else if (xstyle) f[i][0] += xvalue;
+++           if (ystyle == ATOM) f[i][1] += sforce[i][1];
+++         	else if (ystyle) f[i][1] += yvalue;
+++         	if (zstyle == ATOM) f[i][2] += sforce[i][2];
+++         	else if (zstyle) f[i][2] += zvalue;
		    }
      }
  }
    // 在第343-356行中，位于阈值以上的粒子被冻结（即v和F设置为零），而位于阈值以上小于9.0埃的粒子将进一步上移10.0埃：

+++     for (int i = 0; i < nlocal; i++) {  
+++   	    if (mask[i] & groupbit) {	
+++   			if (x[i][2] > threshold) {
+++   				// fprintf(screen,"Threshold crossed\n");
+++   				f[i][0] = 0.0;
+++     		    f[i][1] = 0.0;
+++   		    	f[i][2] = 0.0;
+++   				v[i][0] = 0.0;
+++   				v[i][1] = 0.0;
+++   				v[i][2] = 0.0;
+++   				if (x[i][2] < (threshold + 9.0)) x[i][2] += 10.0;	
+++     		}
+++     	}
+++     }

/* ---------------------------------------------------------------------- */

void FixAddForceMaxZ::post_force_respa(int vflag, int ilevel, int iloop)
  
```
具体这些力如何使粒子位置发生变化是由LAMMPS其他阶段执行的代码决定的，例如`INITIAL_INTEGRATE`, `FINAL_INTEGRATE`, `POST_FORCE`, `END_OF_STEP`。具体内部的顺序和实现请参考[开发者文档](https://lammps.sandia.gov/doc/Developer.pdf)

## 重新编译并测试（未完）

改动完成之后，我们需要重新编译LAMMPS以生成新的可执行文件：

1. 将`.cpp`和`.h`放入`/src`文件夹；
2. 将两个文件名添加到`/src`下的`Makefile.list`中；
3. 