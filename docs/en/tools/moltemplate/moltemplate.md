# moltemplate

## overview

LAMMPS data file building has been a big problem for a long time. On the one hand, the format of LAMMPS is particular; many software can not directly export; On the other hand, the combination and the transformation and the arrangement molecules in the system are complicated, and the topological structure building of macromolecules cost lots of time and energy. After a lengthy trial, I finally found a reasonable and straightforward technology stack, which can directly generate the in file and data file required by LAMMPS.


![flowchart](/moltemplate_flowchart.jpg)

1. Basic drawing: drawing basic units, such as polymer structure unit, single water molecule or methane molecule, etc;
2. Data file: data file exported to common format, such as PDB, XYZ;
3. Space layout: packmol can automatically fill cells into the system according to the set limits. For example, if you want to fill the C60 cage with atoms, you only need a line of command to limit the allowable range to the sphere;
4. Generation tool: moltemplate can operate the existing data files, copy, transform and randomly in the system. At the same time, according to the existing topology structure, the information such as bond angle dihedral angle is supplemented, and finally the in file and data file required by lammps are generated.

## input script structure

Moltemplate itself has the functions of import and inheritance, so we can distinguish files according to their functions as much as possible. Of course, file names can be customized. Here is just an idea to tell you how to start.

First section is `forcefield.lt`, the parameters of system and force field are stored in it.

```
# -- ForceField -- #

ForceField{

    write_once("In Init"){
        
        units           lj
        boundary        p p p 
        
        atom_style      full
        pair_style      lj/cut 10.5
        bond_style      hybrid      fene    harmonic
        angle_style     harmonic
    }


    write_once("Data Boundary") {
        0 100.0 xlo xhi
        0 100.0 ylo yhi
        0 100.0 zlo zhi
    }
    
    write_once("Data Masses"){
        @atom:M     1
        @atom:G     1
        @atom:R     1
    }

    write_once("In Settings"){
        pair_coeff      @atom:M     @atom:M     1   1   2.5
        pair_coeff      @atom:M     @atom:G     1   1   2.5 
        pair_coeff      @atom:M     @atom:R     1   1   2.5         
        pair_coeff      @atom:G     @atom:G     1   1   2.5
        pair_coeff      @atom:G     @atom:R     1   1   2.5
        pair_coeff      @atom:R     @atom:R     1   1   2.5

    }

    write_once("In Settings"){
        bond_coeff      @bond:MM    fene    30      1.5     
        bond_coeff      @bond:GR    fene    30      1.5
        bond_coeff      @bond:RR    harmonic    1000    0.66

    }

    write_once("In Settings"){
        angle_coeff     @angle:RRR      200     180
    }

    # write_once("Data Dihedrals By Type"){
    #     @dihedral:      @atom:
    # }
    

    # write_once("Data Angles By Type"){
    #     @angle:     @atom:
    # }

}
```

The second part is the basic unit data, which stores the information of this segment

```
# -- file matrix.lt --

import "forcefield.lt"

Matrix inherits ForceField{

    write("Data Atoms"){
        $atom:1     $mol:.   @atom:M    0     1   1   1
        $atom:2     $mol:.   @atom:M    0     2   1   1
        $atom:3     $mol:.   @atom:M    0     3   1   1
        $atom:4     $mol:.   @atom:M    0     4   1   1
        $atom:5     $mol:.   @atom:M    0     5   1   1

}

    write("Data Bonds"){
        $bond:1     @bond:MM  $atom:1   $atom:2   
        $bond:2     @bond:MM  $atom:2   $atom:3   
        $bond:3     @bond:MM  $atom:3   $atom:4   
        $bond:4     @bond:MM  $atom:4   $atom:5   

}
}
```

The third part is the operation part. In this file, we can operate on the basic unit, and it is also the entrance of program execution

```
# -- file system.lt -- #

import "forcefield.lt"
import "matrix.lt"

m1 = new Matrix [3].move(0,0,3)
```

In the simplest case, we only need these three files to describe the initialization state of a system, and then execute the command line to generate the actual file using moltemplate

```
moltemplate.sh system.lt
```

then we can get：

```
system.data
system.in
system.in.init
system.in.settings
```

## Grammar Course



### 1.1 write_once() and write()

```
write_once("file_name"){
    text_content
}
```

Every time `write_once()` occurs，a new file is generated，and this command only be executed once。Note，words startwith `In` and `Data` is the system reserved keywords, would be merged into `.in` and `.data` file. For example，`In Init`is a reserved keyword，if you type `In init` then would be asked to capitalize it. Some key words also will be merged，such as `Data Mass`、`Data boundary`. `write()` is a unit that can appear multiple times in a block and can be executed repeatedly.

### import and inherits

`import` requires the system to find the location of the file to be referenced

inherits Represents the variable name in this structural unit (for example, the bond type name mm comes from the inherited unit)

### forcefield and By Type

```
 write_once("Data Angles By Type"){
     @angle: type    @atom:atom1  @atom:atom2  @atom:atom3  @bond：b1 @bond：b2
}
```

Here we talk about the most important function of moltemplate. We all know that not only 2-body bond is contain in topology, but also angle of 3-body and dihedral of 4-body，even improper。Thus this function can do it that if connection information is given, generating angle, dihedral and improper automatically.syntax is simple, point out the three atoms of an angle and the type of angle, then moltemplate can go through all the atoms and mark all the angles. Note that the command name is `Data Angles By Type`.

### unit.lt

```
# -- example of a unit.lt inscript -- #

import "forcefield.lt"

Matrix inherits ForceField{

    write("Data Atoms"){
        # atom id   mol id    type    charge    coordinate
        $atom:1     $mol:.   @atom:M    0     1   1   1
        $atom:2     $mol:.   @atom:M    0     2   1   1
        $atom:3     $mol:.   @atom:M    0     3   1   1
        $atom:4     $mol:.   @atom:M    0     4   1   1
        $atom:5     $mol:.   @atom:M    0     5   1   1

}

    write("Data Bonds"){
        $bond:1     @bond:MM  $atom:1   $atom:2   
        $bond:2     @bond:MM  $atom:2   $atom:3   
        $bond:3     @bond:MM  $atom:3   $atom:4   
        $bond:4     @bond:MM  $atom:4   $atom:5   

}
}

What's the difference between `Data Bonds` and `Data Bond list`? If you use a ready-made forcefield.lt, please use `Data Bond list` because it can automatically assign bond type accroding to atom type; If the forcefield is written manually, use `Data Bonds` and explicitly give bond type.

```

### counter $ and @

A variable likes $atom:1 and @atom:1 consists of two parts; one is counter, the other after it is category.

There are two types of the counter. `$` is dynamic counter, every time the context is executed, an unique id will be generated; `@` is static counter, no matter how many time it is executed, the type not change. In short, the static counter is related to the complexity of the system, and the dynamic counter is related to the scale of the system.

### Variable scope

The variable has two forms, one is full name and another is short name. Within a molecule-object, using short name will not be ambiguity. But once there are many objects, system will not know who the H atom belongs to. Thus we should use full name:

```
@cpath/catname：lpath

cpath：category's scoop，It is usually omitted to represent the global situation. Except for very special requirements, there is no need to control
catname：category name 
lpath：point out which molecule this atom belongs to
```

In this way, atoms or structure fragments in other structure objects can be referenced from within one structure object. But for clarity, follow the basic principles of programming, do not cross reference.

### $mol:. and $mol:...

The dots and slashes you see are the same as the UNIX operating system file path representation. They can be used to represent both relative and absolute paths. The so-called path refers to the relationship between different structural objects. Similarly, a dot means "this", which refers to the structure if all atoms in a structural unit are `$mol:.` The mol ID of the same structure segment is the same, and the mol ID of different structural segments increases with each new time

What about `$mol:...`? I dont know. I just know one you want to build a macromolecule bottom up, to let the all units in macromolecue shall one mol id, then you can use `$mol:...`. And the most important is, you should add a `create_var {$mol}`

### system.lt

This part is the manipulation of all the previously built cell fragments, whether it is rotation, translation or random, is done in one line. These commands are at the beginning of the manual.

## 关于Debug

At the end of each file generation, an output is given_ There are various files in the folder of ttree. The most important one is ttree_ Assignments, which stores the number the counter is replaced and the location where the counter first appears.