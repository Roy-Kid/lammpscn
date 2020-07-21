# Before you start

Suddenly one day, when you supplement the data of a paper to be submitted to Nature, you find that LAMMPS can no longer satisfy you. Whether it is to compute a new parameter, add a new limit or introduce a new defined atom, you need to add some functions by yourself. At this time, the advantages of lammps as an open source software are reflected. You can roam in the ocean of source code, create a few new files, and type in the magic C++, so as to shorten the distance between you and Nobel Prize step by step.

But before you start to dry, please calm down and think about these questions. Do you have to have an operation?

* Whether these parameters can be computed in the post-processing stage, many parameters through the dump file will be more simple;
* simple is better than complex. Your model is much than complex；
* Can your computing be parallel, or will it slow down the overall speed；

You think about it, well, no, you have to fight.

The best way to add new features to lammps is to find a similar feature and make changes based on it. Although lammps is a complex project, it only needs some simple C++ knowledge to operate C-style data structures (vectors and arrays) to implement a function.

In the next tutorial, I'll teach you step by step how to inherit a class of lamps to implement new functions. Depending on the degree of the new function and the existing function, it can be derived from the base class itself or from the existing derived class. It's very simple for lammps to call a new class. To create a derived class, two files, `.cpp` and `.h`, are required, which are put into the `/src` directory and recompile LAMMPS. C++ is an object-oriented language. All the code and variables for defining new functions are in the two files you create, like plugins and modules. Therefore, LAMMPS will not be more complicated and the whole system will not crash.

Because it inherits from the base class of lammps, the derived class must have some methods to be done. In the following tutorial, we choose some common styles to explain their header files and code parts. Public variables are used by derived and base classes, and sometimes by other parts of LAMMPS. Pure functions, which are virtual functions declared as virtual functions in the header file, are functions that must be implemented in derived classes and are set to 0. Functions that are not set to 0 can be overridden or not. They are usually defined as empty function bodies.

In addition, new output options can be added directly to the `thermo.cpp`，`dump_custom.cpp`and`variable.cpp`.

Then come on!