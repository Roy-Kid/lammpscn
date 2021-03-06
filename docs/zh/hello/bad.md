# 咳咳, 你好啊~

弹指一挥间,本科的四年就结束了. 随着本科论文的完成, 课题组的工作也逐渐奏响了尾声,而下一个新篇章可能和分子模拟分道扬镳. 我的导师建议我把这些年来积累的知识, 代码和摸过的坑做一个总结, 一方面可以帮助后面的人迅速上手,另一方面也是对自己知识的盘点. 既然这样, 那我假设大家都是和我当年一样, 刚刚进入实验室的大二的小孩, 讲一讲这个东西应该怎么入手, 也算是整个专栏的结尾. 

## 为什么要学一点计算

现在看来,计算可以说无可争议地和理论和实验成为了研究科学问题的途径. 传统上,理论提出模型、找出规律, 实验实施观测、验证猜想. 随着计算的异军突起, 可以应用理论建立模型进行模拟, 再和实验结论相比较, 在两者之间建立起了一个桥梁. 随着模型的日趋复杂和严格, 基于这些物理模型的数值计算可以模拟实验上很难实现或者很难观察的体系, 降低了各种成本. 又由于模拟是从严格的数学物理模型出发, 结果在一定程度上更加客观, 因此挂在你论文后面不但可以凑字数, 做出来的图还漂亮. 所以学一点基本的思想和原理, 或者能自己动手做做还是挺有意思的. 

## 从哪开始？

一个科学家、一个研究人员或者正在混学历的我, 一定是面向问题来思考和学习的. 比如我想知道这个有机物的结构, 那应该去打个红外, 而不是用电子天平称一称；比如我想讨论氢分子的结构, 那我应该掏出量子力学, 而不是用经典力学算算算. 同样,计算这个大的领域中也有很多的工具, 有些是面向电子尺度的, 有些是面向分子尺度的, 还有那些介观或者有限元分析. 俗话说, 有金刚钻才能揽瓷器活, 而不是学一种方法, 拿着一个锤子看什么都是钉子. 

和做实验别无二致, 你应该像了解各种仪器各种操作一样, 去学习计算机, 操作系统和编程. 你花在学习上的时间越多, 工作的时间越少, 能实现的想法越多. 实验科学家可能受制于仪器的功能, 受制于实验室的条件, 可你不一样, 你的上线是当今世界上计算机科学的上线. 你应该认识到, 一台计算机, 你就能做出一篇Nature. 

在学习操作系统和编程的过程中是十分枯燥的, 所以你应该是基于组会/装逼驱动地去学习. 你可以想, 我学好了计算机, 就有学姐/学妹/学弟/来你这嘤嘤嘤求帮助, 我学好了计算机, 就可以在组会上中气十足地告诉导师, 这个参数我写一段代码就能算出来. 这样, 你每一分钟的学习都充满了成就感. 

再重复一遍, 磨刀不误砍柴工, 不要觉得操作系统和编程与科研无关而掉以轻心. 

## 先打基础

所以开始学习计算之前, 需要明确什么工具能干什么活, 提纲挈领地了解这个领域. 这里我推荐华中科技大学、高等教育出版社的《计算材料学--设计实践方法》, 不看里面的公式, 这属实可以让你在几天的时间内走马观花. 这样, 不管是和别人瞎侃,还是需要闷头解决问题, 都可以迅速知道自己需要什么工具, 他们的原理是怎样的. 

![](/hello/jisuancailiaoxue.png)

如果你选择了分子模拟, 包括分子动力学模拟和蒙特卡洛模拟, 那我们就有得聊了. 有一句话叫"rubbish in, rubbish out", 即不是说程序能正确地运行就能是正确的, 它必须得符合物理原理. 在开始学习软件这样的应用之前, 需要学一学热力学. 我很喜欢南京大学傅献彩的《物理化学》, 也是我考研规定教材, 推导很接地气, 学习曲线平缓, 每看一页都感到知识的充盈. 

![](/hello/fuxiancai.png)

然后就是Daniel V. Schroeder的*An Introduction to Thermal Physics-Addison - Wesley (2000)*, 典型的欧美故事书, 从热力学到统计力学到量子力学娓娓道来, 遣词造句十分平和, 但是内容一点不少. 这本书我大二看了一遍,考研期间翻了一遍,实在是爱不释手. 

![](/hello/thermal_physics.png)

如果你喜欢托马斯微积分这样的画册, 我推荐你看Atkins的*physical chemistry*. 只需要1500港币, 就能拿到这本全铜版纸的, 16开的大砖头. 阅读本书, 不存在任何知识障碍, 真的是从零开始. Atkins还有一本书是将量子力学的, 买了就是看了. 

这些书里已经入门了统计力学和量子力学,一段时间之内足够用了. 

## 上手吧！
当你读完了这些书以后,就算是扎完马步了. 对于分子模拟, 我一次给两本书用来入门. 因为当你看到一个语焉不详或者不能理解的地方, 可以用其他的书来参考或者换位理解.

**Daan Frenkel, Berend Smit** 的*Understanding Molecular Simulation, Second Edition_ From Algorithms to Applications*

![](/hello/molsimu.png)


**Michael P.  Allen, Dominic J.  Tildesley**的*Computer Simulation of Liquids-Oxford University Press (2017)*.

![](/hello/liquids.png)

需要指出, 这里面的东西完全不需要一次全搞明白, 全都记住. 就像是做红外, 你也不知道里面是怎么打出来的红外束, 也不知道怎么用傅里叶变换计算出的曲线一样. 你只需要知道有这么个东西, 当你研究软件, 看到一个不懂的、猜不出来的名词的时候,回来搞懂它就好了. 

做分子动力学计算, 发展到现在这个节点上, 材料计算科学选择LAMMPS是无可争议的. LAMMPS对其他软件的优势是全方面碾压的（除了做全原子会选择gromacs）. 首先, LAMMPS性能最好, 接口齐全, 有GPU等各种加速包, 力场最全, 还是开源的, 极易扩展；其次, 手册完整, 邮件组活跃(24小时有18个小时,发出的问题可以在15分钟内得到核心维护人员的回复); 再者,处于高频的更新, bug fix半个月一次, feature更新三个月一次, 向下兼容. 这里可以用伟大一个词来形容, 从各种方面都值得我们"学习学习再学习".

学习LAMMPS最好的教材就是官方的手册,事无巨细都写在其上. 带来的问题是在你看完一遍这两千多页的manual之前会对整体比较迷茫. 比如,脚本的书写在前三章,但是输入数据文件的格式这么重要的东西,竟然隐藏在命令列表的读取命令里,作为一个附录存在. 

我一向认为,探索未知,从事自然科学的基础研究是为人类智慧添砖加瓦, 你的举手之劳可能能为其他人节省大量的时间,间接推动的是整个人类认知的进展. 不是所有人都能对各个领域了如指掌, 如果想让这个知识库丰富起来, 需要每一个人的努力. 你只需要在痛苦摸索之后的εὕρηκα后, 花一点点时间将这个问题整理下来, 就可以让其他人节约下再次摸索的时间. 我觉得, 一个课题组的核心科研实力应该在于对科学问题的思考上, 而不是通过这样的技术门槛占领先机.

希望你能在科研中获得乐趣.

以上.

Roy Kid 

2021年4月18日.