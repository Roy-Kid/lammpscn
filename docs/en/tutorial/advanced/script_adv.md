# Advanced script 

## loop
```
next variable
    variable ：One or many variable
```
If a variable is a multi valued variable, subsequent calls `next` can invoke its next value in sequence. Even if different scripts are read, the value of the variable is retained. For example, index, loop, etc. If the value of this variable is exhausted, a flag is passed to the jump command to skip the next jump, and the variable is deleted. With this feature, we can build loop structures in scripts.

```
jump file [label]
    file : The file to jump to. SELF refers to this script
    label : Position to jump to
```
With this command, you can jump to the location marked by the target file to achieve the effect of loop (goto-like control).
```
label ID
    ID : String, to act as a flag
```
Specify a point in the script so that jump can jump directly to this location, and the previous commands will be ignored.

With these tools, we can write loops.

Single cycle：
```
variable i loop 3   # Declare variables
    print "$i"      # Command block
    next i          # i self increasing 
jump SELF           # Reread the script
```

Nested loop：
```
label lp
variable i loop 3
    variable j loop 5
    print "($i,$j)"
    next j
    jump SELF lp
next i
jump SELF lp
```
By combining these commands, you can build different types of loops.

## selection

```
if boolean then t1 t2 ... elif boolean f1 f2 ... elif boolean f1 f2 ... else e1 e2
    boolean : Boolean expression

    t1 t2 : Command block to be executed

    f1 f2 : Command block to be executed
```

Like all kinds of programming languages, if elif else style judgment statements are provided. Combined with circulation, we have:
```
label loopa
    variable a loop 5
        label loopb
            variable b loop 5
            print "A,B = $a,$b"
            run 10000
            if "$b > 2" then "jump SELF break"
        next b
    jump in.script loopb
    label break
    variable b delete
    next a
jump SELF loopa
```