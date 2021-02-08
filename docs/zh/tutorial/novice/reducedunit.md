# 关于约化单位

## 为什么采用约化单位

LAMMPS的单位制中有一种很独特, 很重要也很难理解的单位叫LJ unit, 有些文献里也叫reduced unit. 独特之处是它没有单位, 全都是无量纲的; 重要的是不管什么单位输入到LAMMPS中, 都要转化为LJ单位.
所以它很难理解. 纵使你翻遍百度, 都一个说得明明白白的解答. 这时候你就需要谷歌, 去美妙的英文互联网世界中寻找答案.

第一个讲得非常清楚的文章来自[PumMa](http://cbio.bmt.tue.nl/pumma/index.php/Manual/ReducedUnits)这个软件的说明. 2007年以前, 这个软件只用reduced unit,
直到2007年, 前端才开始支持SI单位制的输入, 不过实际计算还是使用reduced unit.

有这么几个原因. 从历史上看, 主要的原因是来自于物理化学中的对应原理. 翻翻你的课本, 找到临界状态那一章. 我们稍微回顾一下. 如果你有公式恐惧症, 这一段不看并不太影响后面的说明:

![pV isother](/tutorial/unit/pVisotherm.png)

我们可以根据范德瓦尔斯方程求van der Waals气体的临界常数. 由于临界点是曲线的极大点、极小点和转折点三点重合, 所以有一阶二阶偏导均为0:

$$
\left(\frac{\partial p}{\partial V}\right)_{T_{\mathrm{c}}}=0
$$

$$
\left(\frac{\partial^2 p}{\partial V^2}\right)_{T_{\mathrm{c}}}=0
$$

然后我们就能解出来临界压力, 临界体积和临界温度与两个常数a、b间的关系. 把这个关系带入范德瓦尔斯方程, 用临界量消掉a和b, 就得到:


两边同时除以$p_cV_{m,c}$, 有:

$$
\left(\frac{p}{p_{\mathrm{c}}}+\frac{3 V_{\mathrm{m},
\mathrm{c}}^{2}}{V_{\mathrm{m}}^{2}}\right)\left(\frac{V_{\mathrm{m}}}{V_{\mathrm{m},
\mathrm{c}}}-\frac{1}{3}\right)=\frac{8}{3} \frac{T}{T_{\mathrm{c}}}
$$

定义:

$$ p^*=\frac{p}{p_c} $$

$$V^*=\frac{V_m}{V_{m,c}}$$

$$T^*=\frac{T}{T_c}$$

称带星号的为对比压力(reduced pressure), 对比体积(reduced volumn)和对比温度(reduced temperature). 代入上式, 得:

$$\left( p^* + \frac{3}{V^{* 2}} \right) \left( 3V^*-1 \right) = 8$$

上式成为范德瓦尔斯对比状态方程式. 此式不含有因物质而异的常数, 且与物质的量无关. 它是一个普遍性的方程式. 任何范德华气体都可以满足上式, 且在相同的对比温度和对比压力下, 就有相同的比容积. 此时,
各物质状态成为对比状态(corresponding state), 这个定律也称之为对比状态定律(law of corresponding state). 试验数据证明, 凡是组成、结构、分子大小相近的物质能比较严格地遵守对比状态定律.
当这类物质处于对比状态时, 他们的许多特性, 如压缩性、膨胀系数、逸度系数、黏度、折射率之间都有简单的关系. 这个定律能比较好地确定结构相近的物质和某种性质, 反映了不同物质间的内部联系, 把个性和共性统一起来.

对比状态原理在工程上有广泛的应用. Guggenheim曾经说过:"对比状态原理确实可以看作范德华方程最有用的副产品, 它不仅在研究流体热力学性质方面取得了巨大的成功, 而且在传递方面的研究中, 也同样有一席之地."(J.Chem.
Phy. 1945,13,253)

通过上面照抄的傅献彩老师的物理化学的内容, 相信你可能已经对所谓"约化"有了个模模糊糊印象. 这个缘起大概给出了一个粗略的概念, 就是即便不同物质纷杂繁复, 但是一旦除以临界点的值, 就神清气爽.

虽然这个定律在多组分系统中失效, 但是暗示了一种解决问题的方式. 第二个使用约化单位的原因是, 我们可以把数据的数量级调到一个很舒服的位置. 比如相对原子质量就是一种约化的思想. 一个氢原子的质量是$1.674\cdot 10^{-27}$千克,
经过C-12原子质量的六分之一的约化, 就成了清清爽爽的$1$了. 在程序数值计算中,还能大大减少计算带来的误差.

## 约化单位的选取

核心问题就是, 约化单位怎么约. 一个约化单位体系需要选定4个基本参数:
* 长度单位 $\sigma^*$
* 质量单位 $m^*$
* 能量单位 $\epsilon^*$
* 电荷单位 $q^*$

这四个基本参数的选择决定了后面所有的其他单位. 比如说, 时间单位可以写成$\tau^* = \sigma^* \sqrt{m^*/\epsilon^*}$. 在Markvoort等人的脂质模型中, 采用了以下的这些约化因子:

| Quantity | Reduced unit | SI unit |
|:---:|:---:|:---:|
| Length | $\sigma^*$ | $1.9665 kJ/mol = 0.47 kcal/mol$|
| Mass | $m^*$ | $0.45nm$ |
| Energy | $\epsilon^*$ | $56.11 amu = 93.173\cdot 10^{-27} kg$ |
| Charge | $q^*$ | $1 e = 1.602\cdot10^{-29} C$ |
| Time | $\tau^* = \sigma^* \sqrt{m^*/\epsilon^*}$ | $2.4037 ps$ |
| Temperature | $T^*=\epsilon^*/k_b$ | $236.51 K$ |
| Pressure | $ $\mathrm{P}^{*}=\varepsilon^{*} / \sigma^{* 3}$ | $358.35 bar = 3.58358*10^7 Pa$ |
| Mass density | $\rho^* = m^*/{\sigma^*}^3$ | $1022.5 kg/m^3$ |
| Number density | $n^* = 1/{\sigma^*}^3$ | $10.974 nm^{-3}$ |
| Permittivity | $\varepsilon_{0}^{*}=\mathrm{N}_{\mathrm{A}} \cdot q^{* 2} /\left(\sigma^{*} \varepsilon^{*}\right)$ | $1.7469\cdot 10^{-8} C^2/Nm^2$ |

在这个模型中, 使用了$1.3T^*$的约化温度, 相当于实际的307K. 在这个系统中的大气压使用了$0.00283 P^*$的约化温度. 用于积分的时间步长是$0.005 \tau^*$, 相当于实际中的12fs.
在原文中, 同样给出了一个转换工具, 即确定了四个基本参数, 就可以计算出其他的约化因子.

<p class="vspace">
    <script src="http://cbio.bmt.tue.nl/pumma/exec/deriveReducedUnits.js"></script>
</p>

<form name="derivedunits">
    <table border="0">
        <tbody>
            <tr>
                <td align="left">ε*</td>
                <td align="left"><input type="text" name="epsilon" value="1.9665" class="inputbox" size="8"> kJ/mol</td>
                <td>&nbsp;</td>
                <td align="left">τ*</td>
                <td align="left"><input type="text" name="tau" class="inputbox" size="8"> ps</td>
            </tr>
            <tr>
                <td align="left">σ*</td>
                <td align="left"><input type="text" name="sigma" value="0.45" class="inputbox" size="8"> nm</td>
                <td>&nbsp;</td>
                <td align="left">T*</td>
                <td align="left"><input type="text" name="temperature" class="inputbox" size="8"> K</td>
            </tr>
            <tr>
                <td align="left">m*</td>
                <td align="left"><input type="text" name="mass" value="56.11" class="inputbox" size="8"> amu</td>
                <td>&nbsp;</td>
                <td align="left">ρ*</td>
                <td align="left"><input type="text" name="massrho" class="inputbox" size="8"> kg/m<sup><span
                            style="font-size:83%">3</span></sup></td>
            </tr>
            <tr>
                <td align="left">q*</td>
                <td align="left"><input type="text" name="charge" value="1.00" class="inputbox" size="8"> e</td>
                <td>&nbsp;</td>
                <td align="left">n*</td>
                <td align="left"><input type="text" name="partrho" class="inputbox" size="8"> nm<sup><span
                            style="font-size:83%">-3</span></sup></td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td align="left">P*</td>
                <td align="left"><input type="text" name="pressure" class="inputbox" size="8"> bar</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td align="left"><input type="button" value="Derive" onclick="derive(this.form)"></td>
                <td>&nbsp;</td>
                <td align="left">ε<sub>0</sub>*</td>
                <td align="left"><input type="text" name="epsicharge" class="inputbox" size="8"> C<sup><span
                            style="font-size:83%">2</span></sup>/(Nm<sup><span style="font-size:83%">2</span></sup>)
                </td>
            </tr>
        </tbody>
    </table>
</form>

例如, 如果想要一个1fs的时间步长, 在约化单位下相对应的对应步长应该是1fs除以换算器右上角计算出来的数值(PumMa默认是2.404ps), 即$\tau^* = 1/2404$. 需要再次强调的是, 建模时基本单位的选取是**自己决定的**. 比如我认为我的室温就是305K, 那我温度的约化因子就选择305K, 那这个模型下任意一个温度, 例如405K就应当选为$T^*=405K/305K$. 比如说我在粗粒化过程中, 认为一个全原子下的亚甲基的质量是我的约化单位, $m^* = 14 g/mol$, 相对应我的甲基的约化质量应该是$m^* = 15/14$. 至于如何**自己决定**, 这就是自己的物理直觉或者完全是方便起见. 