# Fix style

> i just copy this content from LAMMPS manual as a introduction to Fix style.

In LAMMPS, a `fix` is any operation that is computed during timestepping that alters some property of the system. Essentially everything that happens during a simulation besides force computation, neighbor list construction, and output, is a “fix”. This includes time integration (update of coordinates and velocities), force constraints or boundary conditions (SHAKE or walls), and diagnostics (compute a diffusion coefficient). New styles can be created to add new options to LAMMPS.

Here is a brief description of methods you can define in your new derived class. See `fix.h` for details.

|       method       |                                      description                                      |
| :----------------: | :-----------------------------------------------------------------------------------: |
|      setmask       |           determines when the fix is called during the timestep (mandatory)           |
|        init        |                        initialization before a run (optional)                         |
| setup_pre_exchange |                    called before atom exchange in setup (optional)                    |
|  setup_pre_force   |                  called before force computation in setup (optional)                  |
|       setup        | called immediately before the first timestep and after forces are computed (optional) |

> whether here we should give a full list of methods?

Typically, only a small fraction of these methods are defined for a particular fix. Setmask is mandatory, as it determines when the fix will be invoked during the timestep. Fixes that perform time integration (nve, nvt, npt) implement initial_integrate() and final_integrate() to perform velocity Verlet updates. Fixes that constrain forces implement post_force().

Fixes that perform diagnostics typically implement end_of_step(). For an end_of_step fix, one of your fix arguments must be the variable “nevery” which is used to determine when to call the fix and you must set this variable in the constructor of your fix. By convention, this is the first argument the fix defines (after the ID, group-ID, style).

If the fix needs to store information for each atom that persists from timestep to timestep, it can manage that memory and migrate the info with the atoms as they move from processors to processor by implementing the grow_arrays, copy_arrays, pack_exchange, and unpack_exchange methods. Similarly, the pack_restart and unpack_restart methods can be implemented to store information about the fix in restart files. If you wish an integrator or force constraint fix to work with rRESPA (see the run_style command), the initial_integrate, post_force_integrate, and final_integrate_respa methods can be implemented. The thermo method enables a fix to contribute values to thermodynamic output, as printed quantities and/or to be summed to the potential energy of the system.

## an example

“Find the highest particle in the Z direction and apply a force to it and press it down”

First, let's find a fix command with similar functions:`fix_addforce.cpp`and`fix_addforce.h`, copy and rename them as`fix_addforceMaxZ.cpp`and`fix_addforceMaxZ.h`;

Second, consider what parameters we originally needed:

```
# fix add_force
fix ID group-ID addforce fx fy fz keyword value ...
```

`fix add_force`command allow user provide a vector of force in order to add it to a specific group of atoms。Thus we need`fx`,`fy`,`fz`to point out the direction of force; `every`indicates the frequency of force application;`region`where the force is added to;`energy`calculates the potential energy of each atom in the added force field。

Well then，we want to put a force on an atom above a certain height (Z-axis) and push it down. Therefore, we need an additional parameter`threshold`to indicate what height the atoms above will be pressed down, and the others will remain unchanged.

Let's start with `fix_AddforceMaxZ.h`. Every fix must be registered in LAMMPS by writing the following lines of code in the header before include guards:`FixStyle(your/fix/name,FixMine)`, Where “your/fix/name” is a name of your fix in the script and FixMine is the name of the class.

Then take a look at where is the declaration of the class. Line 1 declear the`FixAddForceMaxZ`class is derived from`Fix`base class.

Line 3 is the contructor`FixAddForceMaxZ`, must(as`Fix`base class requires)accept a pointer`LAMMPS *` of LAMMPS class, an int and a pointer of argurment list. These three parameters will be used to initialize the 'fix' base class.

Line 4 is the destructor, which is used to delete the class after it is not used to release the occupied resources.

Next are the private members of the methods and declarations that need to be implemented.

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
};

```

We can think of the`.h`file as telling the system what resources we need to store the new parameters and methods we have defined. Then these specific implementations are implemented from `.cpp`

```cpp
// fix_addforceMaxZ.cpp
// --- means delete old code; + + + means new 

// line 43： 
---  if (narg < 6) error->all(FLERR,"Illegal fix addforce command");
+++  if (narg < 7) error->all(FLERR,"Illegal fix addforce command");
```

First, we change the number of parameters check from 6 to 7, because we add a threshold parameter.

```cpp
  // line 58-81，required
  if (strstr(arg[3],"v_") == arg[3]) {
    int n = strlen(&arg[3][2]) + 1;
    xstr = new char[n];
    strcpy(xstr,&arg[3][2]);
  } else {
    xvalue = force->numeric(FLERR,arg[3]);
    xstyle = CONSTANT;
  }

  //why start with arg[3]：because arg[0] is fix-id，arg[1] is group-ID，arg[2] is style name addforceMaxZ
```

This block of code consists of multiple judgments. The purpose is to extract `v_`variable from arguments. `Strstr() ` check whether there is a B string. If there is a B string, a sub-string will be returned from the first find of B string. If not, null will be output. For example, `strstr("v_force", "v_")` will return`v_force`. So this line of command means that if the parameter is set to `v_`at the beginning, the 'if' code block is executed. We don't want`v_`Variable here, after 'else', convert the sixth string parameter to float with `atof`:

```cpp
// line 82：
     else {
     zvalue = force->numeric(FLERR,arg[5]);
     zstyle = CONSTANT;
     }

+++  threshold = atof(arg[6]);
     
     // You can check that the threshold is set correctly by uncommenting the line command
     // fprintf(screen,"Threshold = %f \n", threshold); 
```

Next, we need to pick out the particles that exceed the threshold height.
The coordinates of all particles are stored in the array. For example, `x[i][0]` is the x-axis coordinate of the "i" particle (1 is y coordinate, 2 is z coordinate). The following loop iterates through the particles in the specified group and finds the particle with the highest z-axis height below the threshold.

```cpp
// line 274-302:
// ---------------
      foriginal[0] = foriginal[1] = foriginal[2] = foriginal[3] = 0.0;
      force_flag = 0;
      
+++   int maxZ = 0;
+++   for (int i = 0; i < nlocal; i++){
+++      if (mask[i] & groupbit) {	
+++         // Debug code
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
How to apply the force? Let's go through the cycle again and find a particular particle and apply a force to it. At the same time, freeze the particles that exceed the threshold. This code should be moved to the loop of the original code:

```cpp
        if (estyle == ATOM) foriginal[0] += sforce[i][3];
        foriginal[1] += f[i][0];
        foriginal[2] += f[i][1];
        foriginal[3] += f[i][2];

		//  add force
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
    // line 343-356, particles above the threshold are frozen (i.e. V and F are set to zero), while particles less than 9.0 angstroms above the threshold will move further up 10.0 angstroms

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
The exact locations of these changes are determined from the various methods (e.g. INITIAL_INTEGRATE, FINAL_INTEGRATE, POST_FORCE, END_OF_STEP) that perform different stages of the dynamics of the system. These methods and their applicability are explained in the documentation above (e.g. see LAMMPS Developer Guide pgs.7-8 and 10).

## re-compiling LAMMPS and test（to be continued）

改动完成之后，我们需要重新编译LAMMPS以生成新的可执行文件：

1. 将`.cpp`和`.h`放入`/src`文件夹；
2. 将两个文件名添加到`/src`下的`Makefile.list`中；
3. 