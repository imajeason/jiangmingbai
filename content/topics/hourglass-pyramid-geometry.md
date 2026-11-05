---
id: hourglass-pyramid-geometry
slug: hourglass-pyramid-geometry
title: 几何五大模型：沙漏模型与金字塔模型（相似三角形比例的魔术）
subtitle: 上下对顶如沙漏，同角嵌套成金字塔！抓住平行线，边长比与面积平方比一步看破
stage: xiaoxue
grade: 小学五/六年级
subject: math
difficulty: 3
durationMinutes: 4
summary: 补全小学奥数“几何五大模型”拼图的压轴支柱！讲透沙漏模型（对顶相似）与金字塔模型（同角相似）的平行线判定、边长相似比与面积平方比公式，彻底告别盲目作辅助线。
coreFormula: "边长比 a:b ➔ 高之比 a:b ➔ 面积比 a²:b²；沙漏侧翼面积 S_左 = S_右 = a × b"
tags:
  - 几何五大模型
  - 沙漏模型
  - 金字塔模型
  - 相似三角形
  - 面积比与边长比
  - 小升初必考
animationType: hourglass-pyramid-geometry
parentGuide:
  painPoint: 看到梯形里交叉的对角线或者三角形里的平行截线，孩子不知道怎么求其中某一小块三角形的面积，抓瞎乱猜。
  steps:
    - stepNumber: 1
      question: "“宝贝，你看梯形里面上下两条底边是平行的，中间两条对角线交叉，像不像一个倒立计时的沙漏？”"
      guide: "帮孩子认出经典形状：上下平行、中间交叉对顶，这就是大名鼎鼎的‘沙漏模型’；如果是大三角形套小三角形，就像埃及的‘金字塔模型’。"
    - stepNumber: 2
      question: "“如果上面的顶边长是 2 厘米，底边长是 6 厘米，底边是顶边的几倍？”"
      guide: "孩子立刻说 3 倍（底边比是 1:3）。告诉孩子：因为上下平行，三角形的胖瘦完全一样（相似），不仅底边是 3 倍，它们的高也是 3 倍！"
    - stepNumber: 3
      question: "“底边是 3 倍，高也是 3 倍，那下面大三角形的面积是上面小三角形的几倍呢？”"
      guide: "引导孩子动手算：底乘高除以 2，底扩大 3 倍，高扩大 3 倍，面积扩大 3 × 3 = 9 倍！面积比等于边长比的‘平方’！"
  realLifeExample: 照相机镜头缩放取景（小底片对大风景，相似放大）；手电筒投射出的阴影面积放大规律。
  keyTakeaway: "“平行截出相似形，上下对顶是沙漏；边长之比等于高，面积之比见平方！”"
prerequisites:
  - triangle-area-parallelogram
  - butterfly-model-geometry
nextSteps:
  - swallowtail-model-geometry
  - bird-head-model-geometry
---

### 为什么说沙漏与金字塔是几何五大模型里的“几何透镜”？

在小学四、五、六年级的杯赛与小升初压轴题中，**“几何五大模型”**（等积变形、鸟头模型、蝴蝶模型、燕尾模型、沙漏/金字塔模型）是衡量几何素养的分水岭。

许多孩子在做题时经常陷入困境：
> “题目只给了几根线段的长度或者比值，没有任何具体的底和高，到底怎么算出各个阴影部分的面积？”

其实，只要图形中出现了**“一组平行线”**，整个题目的面积关系就被一个看不见的“光学透镜”牢牢锁定了！
这个透镜就是初中“相似三角形”在小学奥数里的直观化身——**沙漏模型（Hourglass Model）** 与 **金字塔模型（Pyramid Model）**。

---

### 第一形态：沙漏模型（上下对顶相似）

#### 1. 图形特征：
在梯形 $ABCD$（上底 $AB \parallel$ 下底 $CD$）中，连结两条对角线 $AC$ 与 $BD$ 相交于点 $O$。
- 上方小三角形 $\triangle OAB$ 与 下方大三角形 $\triangle OCD$ 对顶相望，形态就像一个**上下通透的计时沙漏**。

#### 2. 核心数学性质：
因为 $AB \parallel CD$，内错角相等（$\angle OAB = \angle OCD, \angle OBA = \angle ODC$）：
- **边长比例完全传递**：
  $$\frac{OA}{OC} = \frac{OB}{OD} = \frac{AB}{CD} = \frac{a}{b}$$
- **高之比等于底边比**：
  $$\frac{h_1}{h_2} = \frac{a}{b}$$
- **面积比等于底边比的平方**：
  $$\frac{S_{\text{上}}}{S_{\text{下}}} = \frac{\frac{1}{2} a \cdot h_1}{\frac{1}{2} b \cdot h_2} = \left(\frac{a}{b}\right)^2 = \frac{a^2}{b^2}$$
- **左右两翼蝴蝶翅膀面积**：
  $$S_{\text{左}} = S_{\text{右}} = a \times b$$
  （梯形蝴蝶定理：两翼面积相等，且等于上下底面积的几何平均数 $\sqrt{S_{\text{上}} \times S_{\text{下}}}$）。

> **【口诀记法】**：上是 $a^2$，下是 $b^2$，左右两翼各 $ab$！

---

### 第二形态：金字塔模型（同角嵌套相似）

#### 1. 图形特征：
在 $\triangle ABC$ 中，任意作一条平行于底边 $BC$ 的截线 $DE$（$DE \parallel BC$）。
- 顶部的小三角形 $\triangle ADE$ 嵌套在大三角形 $\triangle ABC$ 顶端，酷似一座**金字塔的塔尖与塔身**。

#### 2. 核心数学性质：
因为 $DE \parallel BC$，同位角相等（$\angle ADE = \angle ABC, \angle AED = \angle ACB$）：
- **边长同比例放大**：
  $$\frac{AD}{AB} = \frac{AE}{AC} = \frac{DE}{BC} = \frac{a}{b}$$
- **面积比等于边长平方比**：
  $$\frac{S_{\triangle ADE}}{S_{\triangle ABC}} = \left(\frac{a}{b}\right)^2 = \frac{a^2}{b^2}$$
- **下层梯形截面面积**：
  $$S_{BCED} = S_{\triangle ABC} - S_{\triangle ADE} = b^2 - a^2$$

---

### 实战演示：小升初梯形切分经典真题

> **【例题】** 如图，在梯形 $ABCD$ 中，$AB \parallel CD$。
> 已知上底 $AB = 4\text{ cm}$，下底 $CD = 6\text{ cm}$。
> 对角线交于点 $O$，若上面小三角形 $\triangle OAB$ 的面积是 $8\text{ cm}^2$。
> **求整个梯形 $ABCD$ 的总面积是多少？**

#### 秒杀四步走：
1. **求出上下底边长之比**：
   $$\frac{AB}{CD} = \frac{4}{6} = \frac{2}{3} \implies a = 2, b = 3$$
2. **求出各部分面积份数**：
   - 上三角形 $S_{\text{上}} = a^2 = 2^2 = 4\text{ 份}$；
   - 下三角形 $S_{\text{下}} = b^2 = 3^2 = 9\text{ 份}$；
   - 左翼三角形 $S_{\text{左}} = a \times b = 2 \times 3 = 6\text{ 份}$；
   - 右翼三角形 $S_{\text{右}} = a \times b = 2 \times 3 = 6\text{ 份}$；
   - 梯形总份数 $= 4 + 9 + 6 + 6 = 25\text{ 份}$！
3. **求一份的真实面积**：
   已知上三角形 $4\text{ 份} = 8\text{ cm}^2$，因此：
   $$1\text{ 份} = 8 \div 4 = 2\text{ cm}^2$$
4. **一秒出总面积**：
   $$S_{\text{梯形}} = 25 \times 2 = \mathbf{50\text{ cm}^2}！$$
无需做任何高线辅助线，只要利用沙漏的 $a^2 : ab : b^2$ 模型份数，心算直接秒杀！

