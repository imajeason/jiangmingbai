---
id: boomerang-arrowhead-angle
slug: boomerang-arrowhead-angle
title: 飞镖模型与折角技巧：凹四边形“三角和等于凹角”（折角几何第一定律）
subtitle: 像回旋镖一样的凹四边形，凹进去的大角正好等于三个尖角的和！一招秒解五角星与折线角和
stage: xiaoxue
grade: 小学四/五/六年级
subject: math
difficulty: 3
durationMinutes: 4
summary: 攻克小学中高年级与小升初几何角和常考必刷题型“飞镖模型”（又称凹四边形模型、箭头模型）。直观揭示凹四边形中“内部三个锐角之和等于外部凹角”∠D = ∠A + ∠B + ∠C 的几何本质。通过连接对角线延长线与平行线辅助线两种无字证明，并顺畅拓展至“经典五角星五个顶角和等于 180°”的秒杀运用。
coreFormula: "飞镖模型公式: ∠BDC = ∠A + ∠B + ∠C；经典五角星顶角和: ∠A + ∠B + ∠C + ∠D + ∠E = 180°"
tags:
  - 飞镖模型
  - 凹四边形
  - 折角问题
  - 三角形外角定理
  - 五角星角和
  - 几何模型
animationType: boomerang-arrowhead-angle
parentGuide:
  painPoint: 孩子遇到凹进去的四边形或者折线角、五角星求角度时，不知道如何添辅助线，经常把图形当成规则多边形乱套内角和公式导致扣分。
  steps:
    - stepNumber: 1
      question: "“宝贝，看这个像回旋镖一样的凹四边形，它的三个尖角像不像三个‘小箭头’？”"
      guide: "指着顶部的 ∠A 和两侧的 ∠B、∠C，带孩子观察中间那个深深凹进去的大钝角 ∠BDC。"
    - stepNumber: 2
      question: "“如果把顶点的边向下延长一条虚线，把它切成两个三角形，你发现了什么？”"
      guide: "利用三角形‘外角等于不相邻两内角和’：左边外角是 ∠A1 + ∠B，右边外角是 ∠A2 + ∠C，合起来就是 ∠A + ∠B + ∠C！"
    - stepNumber: 3
      question: "“五角星其实就是 5 个交错的三角形，能不能用飞镖模型把分散在各处的角‘集中’到一个三角形里？”"
      guide: "带孩子顺着折线把两个角的和转移到同一个外角上，原本散落在天涯海角的 5 个角瞬间汇聚成一个三角形的内角和——正好是 180°！"
  realLifeExample: 航空飞机机翼后掠角气动布局设计；折纸艺术中折叠角角度计算；雷达隐身多面体反射折角几何。
  keyTakeaway: "“凹角张口向外开，三尖相加送过来；辅助延长切两半，外角相加秒答案！”"
prerequisites:
  - triangle-area-parallelogram
nextSteps:
  - pythagorean-theorem
  - zhao-shuang-string-figure
---

### 像回旋镖一样的神奇凹四边形

在小学四年级学习完“三角形内角和等于 180°”之后，数学考卷中经常会出现一种奇特的图形：
它有 4 条边、4 个顶点，但其中有一个顶点深深地“凹”陷了进去，形状酷似澳洲土著用来打猎的**回旋镖（Boomerang）**，或者是射箭用的**箭头（Arrowhead）**。

这就是中小学几何中家喻户晓的**“飞镖模型”**（凹四边形模型）：
> **如图，在凹四边形 $ABDC$ 中，三个向外突出的尖角分别是 $\angle A$、$\angle B$、$\angle C$。**
> **中间凹进去的大钝角是 $\angle BDC$。**
> **这四个角之间有着怎样惊人优美的数量关系？**

**黄金结论：**
$$\angle BDC = \angle A + \angle B + \angle C$$
**大凹角的度数，恰好等于三个尖角的外角度数之和！**

---

### 两招神级辅助线：看懂背后的数学本质

为什么中间的大钝角会等于三个锐角的和？我们来看看古代几何大师最钟爱的两种证明：

#### 方法一：延长对角线法（三角形外角定理）
1. 连接顶点 $A$ 和凹点 $D$，并顺着方向一直向外**延长**一条虚线，交底边于点 $E$；
2. 此时整个回旋镖被一分为二，变成了左右两个三角形：$\triangle ABD$ 与 $\triangle ACD$；
3. 根据小学几何极重要的基本公理——**“三角形的一个外角等于与它不相邻的两个内角之和”**：
   - 观察左边 $\triangle ABD$，外角 $\angle 1 = \angle B + \angle BAD$；
   - 观察右边 $\triangle ACD$，外角 $\angle 2 = \angle C + \angle CAD$；
4. 把左右两部分相加：
   $$\angle BDC = \angle 1 + \angle 2 = (\angle BAD + \angle CAD) + \angle B + \angle C = \angle A + \angle B + \angle C$$
5. 简单纯粹，一气呵成！

#### 方法二：连接两底角法（大三角形内角和）
1. 连接底部的两个端点 $B$ 和 $C$，构成一个大的 $\triangle ABC$；
2. 在大 $\triangle ABC$ 中，三内角和为 $180^\circ$：
   $$\angle A + (\angle B_1 + \angle B_2) + (\angle C_1 + \angle C_2) = 180^\circ$$
3. 在底部的小 $\triangle BDC$ 中，三内角和同样为 $180^\circ$：
   $$\angle BDC + \angle B_2 + \angle C_2 = 180^\circ \implies \angle B_2 + \angle C_2 = 180^\circ - \angle BDC$$
4. 两式一减，立刻再次得出 $\angle BDC = \angle A + \angle B_1 + \angle C_1$！

---

### 神奇推论：五角星顶角和为什么永远是 180°？

飞镖模型最令人拍案叫绝的应用，就是求解**五角星的五个顶角之和**：
> 一个任意形状的五角星，五个角尖分别是 $\angle A, \angle B, \angle C, \angle D, \angle E$。
> 它们的度数总和是多少？

利用飞镖模型（或两次外角转移）：
1. 观察由边相交构成的局部小三角形：
   - 尖角 $\angle A$ 与 $\angle C$ 的射线相交，其外角恰好是 $\angle 1 = \angle A + \angle C$；
   - 尖角 $\angle B$ 与 $\angle D$ 的射线相交，其外角恰好是 $\angle 2 = \angle B + \angle D$；
2. 惊奇地发现：$\angle 1$、$\angle 2$ 以及原本孤零零的第五个角 $\angle E$，**正好全都聚拢到了同一个三角形的三个内角上！**
3. 因为同一个三角形的内角和必定为 $180^\circ$：
   $$\angle A + \angle B + \angle C + \angle D + \angle E = \angle 1 + \angle 2 + \angle E = 180^\circ$$

无论五角星画得多歪、多不对称，只要五个角全部相连，它们的和**永远精准地等于 180 度**！
这就是几何折角模型的无穷魅力！
