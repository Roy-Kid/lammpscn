# 布朗动力学

分散液和悬浊液在分子动力学方法中是一个很特别的存在, 因为溶质分子和颗粒的特征时间有很大的差距. 简单来说, 如果我们按照溶剂分子的特征时间来观察体系, 我们会发现溶质粒子几乎是静止不动, 而溶剂分子在其周围运动. 很显然要想模拟这种"跨时间尺度"的模拟是很困难的. 一种近似方法是**不关心**具体每一个溶剂分子的运动, 而是把周围看成是连续的介质, 然后只关注溶质粒子在介质中的运动. 

布朗动力学(Brownian Dynamics, BD)是简化版本的朗之万动力学(Langevin Dynamics), 对应于没有加速度的极限情况. 这个近似也可以说是"过阻尼的"朗之万动力学, 或者说是没有惯性的朗之万动力学. 这种方法模拟了液体中的"布朗粒子"的随机作用. 

上一给出了朗之万动力学的方程:
$$m\ddot X = -\nabla U(X)-\gamma \dot X + \sqrt{2\gamma k_b T}R(t)$$

布朗动力学中, $m\ddot X$项背忽略掉了, 右侧的各项之和为$0$: 

$$0 = -\nabla U(X)-\gamma \dot X + \sqrt{2\gamma k_b T}R(t)$$

> 我们分析一下这两个公式. 等式左侧$m\ddot X$这一项是$F=ma$的力,在布朗动力学中是$0$. 可以看成质量为$0$的粒子, 或者是摩擦力趋近于无穷; 右侧第一项$-\nabla U(X)$是对势能求导也是一个力, 第二项是与速度成正比, 第三项是个与温度有关的随机数; 

带入爱因斯坦关系$D=k_bT/\gamma$, 改写为: 

$$\dot X(t) = -\frac{D}{k_bT}\nabla U(X)-\gamma \dot X + \sqrt{2D}R(t)$$


Keep in mind that if you are using "s" ("shrink wrapped") boundary
conditions and the distance between particles grows to be large,
LAMMPS may run out of memory when it attempts to build neighbor-lists,
due to the large box necessary to enclose your system..  If you are
simulating a single molecule (polymer) and you don't have any freely
diffusing objects in your simulation, then this should not be an
issue.  If it is an issue, you can use the "neighbor" command to
increase the bin size and reduce memory usage.
   http://lammps.sandia.gov/doc/neighbor.html
(My chromosome folding simulations I use:
   neighbor 30.0 bin
30.0 is much larger than the pairwise force cutoff distance I normally use)

> 1. Is this method in Lammps doing a BD as illustrated in Wikipedia ?
> url: https://en.wikipedia.org/wiki/Brownian_dynamics

No.
"fix langevin" + "fix nve" together implement Langevin dynamics, not
Brownian dynamics.

Brownian dynamics is Langevin dynamics in the limit that the mass -> 0
(or, equivalently when the friction->infinity).  As far as I am aware,
Brownian dynamics is not implemented in LAMMPS.  (And for good reason,
in my opinion.  See rant below.)  Brownian dynamics is considered
reasonably accurate if you are interested in looking at the high
frequency (small timescale dynamics), because the frictional
coefficient of damping for water is so large that it can be
approximated as infinite (compared to the time it takes for anything
interesting to happen in the simulation).

However if you don't care about the high frequency dynamics of the
system...  If you are only interested in events that occur on longer
timescales (for example, the time it takes for a protein to fold),
then it is much much more efficient to use Langevin dynamics (compared
to Brownian dynamics).  The use of Brownian dynamics

If you are curious, there is a nice paper describing the effect of the
frictional damping rate on the dynamics of protein folding here:

https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.79.317

If I remember correctly, they find that you can reduce the frictional
coefficient by a factor of 50 before it even starts to effect the
dynamics of protein folding.  If you use run the simulation with 50x
less friction, this effectively increases the efficiency of your
simulation by a factor of 50 (because the rate of movement due to
diffusion is inversely proportional to the the friction).  (Again,
increasing mass is equivalent to reducing friction in Langevin
dynamics.  To make matters more confusing, this is equivalent to
-increasing- the "damp" parameter used with the fix langevin command
in LAMMPS, which corresponds to damping -time-, not rate.)  As an
extreme example, I simulate chromosome folding, which takes vastly
longer more time than most proteins take to fold.  To make this
process tractable, I reduce the friction so that the damping time is
on the order of (approximately) 1/10th of the time it takes for the
chromosome to fold (which is vastly, vastly smaller than the friction
of real water, but yet high enough that the DNA polymer still moves
diffusively at the long time scales I care about).  Without doing
this, my simulations would never finish.

I remember wrote a simulation program which used true Brownian
dynamics.  It was extremely slow and numerically unstable.  Particles
moving in the zero-mass limit contain much more high frequency noise
in their movement than particles moving according to Langevin
dynamics, and the sudden jumps that occurred caused particles to bump
too far into each other and the simulation would explode (often).
Unless you really care about this noise, it is better to remove it by
running your simulations using Langevin dynamics with a large mass
value (small friction coefficient).

Hope this helps

Andrew

P.S.  Don't be offended by this, but if it helps, here's a few
textbooks which describe Langevin dynamics in more detail:
Van Kampen "Stochastic Processes in Physics and Chemistry"
David Chandler "Introduction to Modern Statistical Mechanics"
Donald McQuarrie "Statistical Mechanics"
Among these books, the most concise explanation is either in Chandler
or Van Kampen.  (Perhaps there are more modern books available by
now.)