# Fix style

`fix`是在一个动力学迭代中改变系统某些属性的操作。实际上，除了力的计算，临近表的建立和输出之外，都是`fix`。这包括了对时间积分（坐标和速度的更新）、约束或边界条件（SHAKE或walls）和参数计算（例如计算扩散系数）

## 举个栗子

“找到一个在Z方向上最高的粒子，然后给它施加一个力摁下去”

首先，我们先找一个功能近似的fix命令：`fix_addforce.cpp` 和 `fix_addforce.h`, 复制一份改个名字；

其次，考虑一下我们需要什么参数：原本的`fix add_force`命令允许用户提供力的矢量，然后给一群粒子施加力

```cpp

class FixAddForce : public Fix {
 public:
  FixAddForce(class LAMMPS *, int, char **);
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

```