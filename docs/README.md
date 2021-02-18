---
home: true

title: LAMMPS 中文站

heroImage: /logo.gif
actionText: 快速开始 →
actionLink: /zh/tutorial/
action2Text: 命令速查 →
action2Link: /zh/command/
features:
- title: 为什么选择LAMMPS？
  details: 开源；高效；通用; 力场全面；易于扩展
- title: LAMMPS 可以做什么？
  details: 粗粒化模型；全原子；有限尺寸的球或椭球粒子; 偶极子; 刚体
footer: 署名-非商业性使用-相同方式共享 3.0 中国大陆 (CC BY-NC-SA 3.0 CN) | Copyright © 2021-present Roy Kid
---

# 插播一条广告♪(´ε｀ )

我们的新书**Extending and Modifying LAMMPS Writing Your Own Source Code: A pragmatic guide to extending LAMMPS as per custom simulation requirements** 正式出版了. 这本书由Valdosta State University的Shafat Mubin和本人共同完成, 由PACKT出版社出版. 本书提供了对LAMMPS源码主要部分的逐行讲解, 手把手的修改源码的范例. 阅读这本书, 你可以从MD的最重要的方法论和数值计算方法出发, 逐步过渡到对源码结构和执行阶段的理解. 随着认识的深入, 你将可以了解LAMMPS代码的组织框架和哲学理念, 并且能够理解源码. 放心, 只要你有一丢丢的C++技巧, 就可以完全看得懂我们的讲解. 我们这种掰开了揉烂了的手把手的范例讲解足以使没有编程经验实验人员照葫芦画瓢地编写自己的源代码扩展. 其中本书提供的范例都经过了充分的测试并且上传到了GitHub上. 当你读完这本书, 你就能学会如何添加自己的LAMMPS拓展, 根据自己的需求增加特性. 

![封面](/cover.png)

本书现已在[美区亚马逊](https://www.amazon.com/dp/1800562268/ref=cm_sw_em_r_mt_dp_S6F3FTWDJ0HQHDWXXNAR)发售, 希望各位多多支持~ 一共394页呢, 35刀, 买不了吃亏, 买不了上当! 有了它, 你就可以省下大量抓耳挠腮去研究莫名其妙的源码的时间, 把精力放在发表CNS上! 冲, 买它!

# LAMMPS 概览

## LAMMPS是什么？

Large-scale Atomic/Molecular Massively Parallel Simulator（aka. LAMMPS)是由美国能源部下属的Sandia国家实验室联合Temple大学开发的经典分子动力学软件包。程序基于C++开发，支持主流的并行框架，并在GPL协议下开源。[官方网站](https://lammps.sandia.gov/)

## LAMMPS能做什么？

* 单核或多核高性能计算
* GPU加速
* 插入新力场和命令非常简单
* 和其他计算软件耦合
* 涵盖几乎所有的粒子模型和力场

## LAMMPS不能做什么？

* 没有可视化界面
* 不能构建模型
* 自动分配力场参数

## 本站任务

减低初学者入门LAMMPS时难度，让各位将学习软件的时间节省下来，用在干正事上。接下来本站会尽最大可能更新和翻译相关资料，如果您有更好的意见和改进建议，抑或是想参与进来，为国内社区贡献自己的力量，请转到GitHub上提交issue，我会在第一时间和您联系。谢谢您的参与和使用本网站。