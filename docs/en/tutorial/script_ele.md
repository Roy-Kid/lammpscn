# Getting started with script

::: tip
This section of tutorial navigate to the official [manual](https://lammps.sandia.gov/doc/Manual.html): 5.1-5.3 
:::

* LAMMPS input script is Unix-like format;
* LAMMPS read the script and set command line-by-line until some commands start simulation;
* Thus many setting commands are not sequential, however:
* Some commands are only valid when they follow others;
* Some commands will use values that be set by precede command.


## grammar of script

1. Each non-blank line in the input script is treated as a command. 
2. LAMMPS commands are case sensitive. 
3. Command names are lower-case, so upper case letters may be used in file names or user-chosen ID strings.
2. All characters from the first “#” character onward are treated as a comment and discarded;
3. Like Unix, both `$` and `${}` represent variables. The difference is that a single dollar can only be followed by one **character**, `${}` which allows spaces and expression;

```
variable X equal (xlo+xhi)2+sqrt(v_area)
region 1 block $X 2 INF INF EDGE EDGE # $ usage
```
It will immediately evaluate the mathematical expressions in `$()`, or for C style format control.

The above formula is equivalent to：
```
region 1 block $((xlo+xhi)2+sqrt(v_area)) 2 INF INF EDGE EDGE # $()usage 
print "Final energy per atom: $(pe/atoms:%10.3f) eV/atom" # formate control
```

Nesting is not allowed in any form of '$', the following will not be allowed:

```
print    "B2 = ${$x-1.0}"
```

But you can use the `v_` variable instead of:

```
print    "B2 = $(v_x-1.0)"
```

4. Similar to other programming languages, tokens are separated by spaces;
5. The first word in a line is the command name, and all subsequent words are parameters;
6. If a command is too long to line break, add a `$`at the end of this line; A string of words wrapped in single quotation and double quotation is regraded as a parameter, and triple quotation can wrap multiple lines as a single parameter.

## structure of script

A LAMMPS input script typically has 4 parts：

    1. Initialization；
    2. Data reading；
    3. Settings；
    4. Running；

The initialization and definition part usually only needs to be explained once, while the setting and running can be repeated many times; for example, after defining the system, set, run, reset, and run again. Common commands are given below. For other functions, please refer to the manual.

### Initialization 

Set parameters about system 

* units 
* dimension 
* boundary
* atom_style
* bond_style & bond_coeff
* pair_style & pair_coeff
* dihedral_style & dihedralcoeff

### Data input 

read model information or restart file

* read_data
* read_restart

### Settings 

Set the global temperature and pressure of the system, set the local stress and limit of the system, and output the parameters with the calculation command

* neighbor
* fix
* compute

### Running 

start the simulation

* minimize
* run

## input data

::: tip

This section of tutorial navigate to the official [manual](https://lammps.sandia.gov/doc/Manual.html): read_data-Format of a data file
:::

Data file refers to a file contains particle coordinates, topology and other information, which usually established by other software. It is composed of *head* and *body* section. 

*head* of data file: the first line must start with `#` comment, the content is not necessary. Next it will interpret system properties line-by-line.

*body* of data file: record the model information, such as coordinates, bonds, angles, dihedrals and so on.

## a crude example

This is a simple [polymer deformation simulation](https://icme.hpc.msstate.edu/mediawiki/index.php/Deformation_of_Amorphous_Polyethylene)，We take the relaxation part as an example to explain the lamps script structure

```
# Initialization
units		real   # Specify the unit taken by the system
boundary	p p p   # Specify boundary conditions
atom_style	molecular   # Atom types

# Data reading
read_data	polymer.data   # Read in model 

# Setting 
bond_style      harmonic   
bond_coeff	1 350 1.53   

angle_style     harmonic  
angle_coeff	1 60 109.5

dihedral_style	multi/harmonic
dihedral_coeff	1 1.73 -4.49 0.776 6.99 0.0

pair_style	lj/cut 10.5
pair_coeff	1 1 0.112 4.01 10.5

#####################################################
# Setting 
velocity 	all create 500.0 1231   # Given initialization speed
fix		1 all npt temp 500.0 500.0 50 iso 0 0 1000 drag 2   # Set NPT ensemble and temperature
thermo_style	custom step temp press
thermo          100   # Output thermodynamic parameters
timestep	0.5   # time step
run		50000   # Total simulation steps
unfix 1   # Cancel fix command 
unfix 2
write_restart 	restart.dreiding2   # Output a file for restart
```

From this, we can see that since the script is interpreted line by line, we only need to give the corresponding parameters according to the normal thinking. As for the commands to be passed and how to use them, the manual should be regarded as a dictionary.

Let's look at the data (section). In order to distinguish between atoms and types, LAMMPS maps all types into the ID of integers. Then we get atom ID, molecular ID, type ID, etc. expressed in integers

```
# Model for PE   # NECESSARY comment
                            # the number of 
     10000     atoms        # atoms
      9990     bonds        # bonds
      9980     angles       # anngles
      9970     dihedrals    # dihedral

         1     atom types   # type id
         1     bond types
         1     angle types
         1     dihedral types

    0.0000   80.0586 xlo xhi   # The beginning and ending 
    0.0000   80.0586 ylo yhi   # position of the box, 
    0.0000   80.0586 zlo zhi   # indicating the size

Masses   # atom mass：

         1          14.02

Atoms  
# atom info：atom-id molecule-id type-id x y z

         1         1         1    8.6550   61.6668    5.4094
         2         1         1    8.6550   60.5849    6.4912
         3         1         1    7.5731   59.5030    6.4912
         4         1         1    6.4912   60.5849    6.4912

Bonds    
# bond info：bond-id，bond-type，atom with id 1 link to 2

         1         1         1         2
         2         1         2         3
         3         1         3         4

Angles   

         1         1         1         2         3
         2         1         2         3         4

ihedrals    

         1         1         1         2         3         4
```

From this, we have introduced the format of input and data. By drawing inferences from one instance, we can understand the operation of the software on a macro level. As for how to configure the input file, it depends on the experiments you designed and the parameters to be calculated. As for how to generate data files with hundreds of atoms, this is the limitation of lammps. We need other software to do this.