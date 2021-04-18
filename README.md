# lammpscn
![](lammps.org.cn) 旨在减低初学者入门LAMMPS时难度，让各位将学习软件的时间节省下来，用在实际的科研工作中. 一个良性发展的社区离不开每个人的贡献, 如果人人都可以把自己学习到的或者解决的困难整理下来供别人参考, 将会极大地促进软件用户群的发展和解决所有人的时间. 

贡献教程的原则是:

* 尽可能地不要照抄手册, 但是要给出参考资料和手册相关内容的链接;
* 尽可能地将与科研方向有关的知识抽离, 专注于软件本身的使用;
* 尽可能地详细一些, 手把手地教学, 因为很多人并不熟悉系统和软件;
* 尽可能地生动活泼, 增加图示, 苦中作乐;

下面是如何贡献自己的教程:

## 初级贡献

将你写好的文稿发送给`lijichen365@ciac.ac.cn`, 无所谓是写在word, txt, A4纸, 只要能辨认即可 (￣^￣)ゞ

## 中级贡献

首先, 先学会使用markdown语言书写文稿. markdown是一种标记语言, 非常直观与简介. 教程可以参考![](https://github.com/appinncom/Markdown-Syntax-CN).

当你完成文档的书写后, 下一步是将文档集成到网页中. 登陆GitHub, 找到`lammpscn`, fork一份源码到, 之后可以在自己的repositories中找到`lammpscn`的repo

使用`git clone`命令将代码克隆到本地, 使用`git checkout draft`切换到草稿分支

进入`docs/zh`中, 选择合适的主题, 将写好的markdown文稿复制进去

进入`docs/.vuepress/sidebar`, 找到`主题_zh.js`, 按照格式添加项目

例如, 我想向贡献名为“震惊! 新手这么用LAMMPS就错了”到网站中“开始/”, 你需要将自己写的`shock.md`放到`docs/zh/tutorial/novice`中. 然后打开`tutorial_zh.js`, 在`入门篇`的`children`中加一行`['/zh/tutorial/novice/shock', '震惊']`. 注意, 每个条目之间需要用逗号隔开. 如果你的机器上装有nodejs, 你可以在`lammpscn`的根目录下输入`yarn docs:dev`查看实际的效果(如果没有的话也不影响, 直接pull request就行, 我会给你收尾的)

接下来, 使用`git push`将代码推到你的GitHub账户上. 这时候你再去看你的`lammpscn`的repo的`draft`分支, 就可以看到更改后的内容了. 

下一步是提交一个pull request, 通知我将你的修改合并到我的repo中. 点击你的repo的上方的`pull request`按钮, 就在`issue`旁边, 点击绿色的`new pull request`, 在转到的界面中选择你需要提交的分支和要提交到的分支, 点击`create pull request`, 填写一些说明, 就完成了提交. 同时, 我这边会收到通知. 在我检查通过之后, 会接受你的`pull request`, 再将网站更新并部署. 恭喜你, 成为了一位contributor!

## 高级贡献

网站使用了`vuepress`框架, 主题采用的是`teadoc`, 并托管在GitHub page上. 如果你对前端感兴趣, 可以研究下怎样二次开发. 我太菜了我学不会, 靠你了!