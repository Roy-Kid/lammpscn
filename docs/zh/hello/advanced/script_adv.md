# 脚本进阶

## 循环
```
next variable
    variable ：一个或多个变量
```
如果一个变量是个多值变量的话，其后调用next就可以按次序调用其下一个值。即便读取不同的脚本，变量的值仍被保留。例如index，loop等。如果这个变量的值用尽，则会传递给jump命令一个标记以跳过下一个jump，同时这个变量会被删除 。利用这个特性，我们可以去构建脚本中的循环结构。

```
jump file [label]
    file : 要跳转到的文件。SELF指代本文件
    label : 将要跳转到的位置
```
通过这个命令，可以跳到目标文件所标记的位置，以实现循环的效果。
```
label ID
    ID : 字符串，以充当标志
```
在脚本中指定一个点，使jump可以直接跳至这个位置，同时前面的命令都将被忽略。

有了这些工具之后我们就可以写循环了。

单循环：
```
variable i loop 3   #声明变量
    print "$i"      #命令块
    next i          #i自增
jump SELF           #重新读取本脚本
```
嵌套循环：

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
通过这些命令的组合，就能构建出不同类型的循环。

## 分支

```
if boolean then t1 t2 ... elif boolean f1 f2 ... elif boolean f1 f2 ... else e1 e2
    boolean : 布尔表达式
    then : 关键词
    t1 t2 : 被执行的命令块
    elif : 关键词
    else : 关键词
    f1 f2 : 被执行的命令块
```

和各种编程语言一样，提供了if-elif-else风格的判断语句。结合循环我们有：
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