---
id: bird-head-model-geometry
slug: bird-head-model-geometry
title: 几何五大模型之“鸟头模型（共角定理）”
subtitle: 两个三角形共享同一个角？面积比直接等于两夹边比的乘积！一条辅助线看透代数本质
stage: xiaoxue
grade: 小学五年级下册
subject: math
difficulty: 3
durationMinutes: 5
summary: 鸟头模型（共角定理）是小学高年级与竞赛几何中与蝴蝶模型齐名的核心利器。当两个三角形共用一个顶点角（或互补角）时，它们看似形状各异，但面积比竟然直接等于两条相邻夹边长度之比的乘积！通过连接一条对角辅助线 BE，两次运用“等高模型”面积比等于底边比，中间过渡项如行云流水般自动约分抵消，彻底打通几何截角与四边形面积割补思维！
coreFormula: "共角面积比：S(△ADE) ÷ S(△ABC) = (AD ÷ AB) × (AE ÷ AC)；四边形占比：S(DBCE) ÷ S(△ABC) = 1 - (AD/AB) × (AE/AC)"
tags:
  - 五年级数学
  - 六年级数学
  - 几何模型
  - 鸟头模型
  - 共角定理
  - 小升初压轴
animationType: bird-head-model-geometry
parentGuide:
  painPoint: 孩子遇到三角形切角或复杂多边形四边形求面积时，习惯盲目找高或死算具体长度，不会利用共角比例进行“整份缩放”；或者死记公式分不清哪条边比哪条边。
  steps:
    - stepNumber: 1
      question: “宝贝，如果把一条线段截成 1/2，以它为底的三角形高不变，面积是不是也缩成了 1/2？”
      guide: 带孩子回顾等高模型：高一样时，底边缩水到几分之几，面积就缩水到几分之几。
    - stepNumber: 2
      question: “现在我们在左边腰上截取 AD/AB，在右边腰上截取 AE/AC。如果连一条辅助线 BE，△ADE 先对 △ABE 缩了一次，△ABE 又对整个大三角形缩了一次，一共缩了多少？”
      guide: 启发乘法连续缩放：第一次缩小了 (AD/AB) 倍，第二次又缩小了 (AE/AC) 倍，合起来就是两次比例直接相乘！
    - stepNumber: 3
      question: “如果 AD 是 AB 的一半（1/2），AE 是 AC 的一半（1/2），上面的小鸟头占整个大三角形的几分之几？下面的四边形占几分之几？”
      guide: 口算秒杀：鸟头占 1/2 × 1/2 = 1/4！下面的四边形自然就是 1 - 1/4 = 3/4！
  realLifeExample: 摄影镜头光圈开合缩放面积；折纸折角时留下的小三角与梯形底座。
  keyTakeaway: “共用一个鸟嘴角，两边比例乘到老；辅助连线两次比，中间抵消乐陶陶！”
evidence:
  - 义务教育数学课程标准（2022年版）第三学段“图形与几何”之图形的相似与比例关系。
  - 人教版小学数学五年级上册“多边形的面积”、六年级“比例”培优之几何五大模型。
assessmentPrompt: 在 △ABC 中，点 D 在边 AB 上，且 AD = 2 DB；点 E 在边 AC 上，且 AE = 3 EC。已知 △ADE 的面积是 18 平方厘米。求：(1) 大三角形 △ABC 的面积是多少平方厘米？ (2) 四边形 DBCE 的面积是多少平方厘米？
---

### 什么是“鸟头模型”？为什么它叫这个生动的名字？

在小学高年级五大几何模型（等积变形、鸟头模型、蝴蝶模型、相似沙漏模型、燕尾模型）中，“鸟头模型”是最形象、最实用的一件常考武器。

看下面的图形：在 $\triangle ABC$ 中，点 $D$ 在边 $AB$ 上，点 $E$ 在边 $AC$ 上，连接 $DE$。

```text
              A (鸟嘴)
             / \
            /   \
           D ─── E   <── 鸟头 (△ADE)
          /       \
         /         \
        B ───────── C
```

- 顶点 $A$ 尖尖的，就像一只小鸟的**鸟嘴**；
- 上面切下来的小三角形 $\triangle ADE$，就像**小鸟的脑袋**；
- 下面的四边形 $DBCE$，就像小鸟的身子。

因为小三角形 $\triangle ADE$ 和大三角形 $\triangle ABC$**共同拥有同一个顶角 $\angle A$**，所以在数学学术上它被称为**“共角定理”**。

---

### 第一步：鸟头模型的黄金结论公式

两个共享同一个顶角的三角形，它们的面积之比，**直接等于两组夹边长度比值的乘积**！

$$\mathbf{\frac{S(\triangle ADE)}{S(\triangle ABC)} = \frac{AD}{AB} \times \frac{AE}{AC}}$$

用通俗易懂的大白话来说就是：
$$\text{小鸟头的面积} = \text{大三角形面积} \times (\text{左边缩放比}) \times (\text{右边缩放比})$$

由此，底下四边形 $DBCE$ 的面积占比也迎刃而解：
$$\frac{S(DBCE)}{S(\triangle ABC)} = 1 - \frac{S(\triangle ADE)}{S(\triangle ABC)} = 1 - \left(\frac{AD}{AB} \times \frac{AE}{AC}\right)$$

---

### 第二步：为什么是“两边相乘”？一条辅助线揭秘背后的秘密

很多孩子死记公式，一到考场就犯嘀咕：“为什么不是两边相加？为什么是乘法？”

只要在图上**轻轻连一条辅助线 $BE$**，整个几何证明过程 10 秒钟就能彻底看透！

```text
              A
             / \
            /   \
           D ─── E
          / .     \
         /   .     \
        B ───────── C
        (连接虚线 BE)
```

现在，图形里出现了一个桥梁三角形——$\triangle ABE$！我们分两步跨越这座桥梁：

#### 第 1 步：看左侧（利用等高模型）
观察 $\triangle ADE$ 和 $\triangle ABE$：
- 它们共同以点 $E$ 为顶点；
- 它们的底边 $AD$ 和 $AB$ 都在同一条直线边上；
- **因为顶点相同，垂直到底边的高完全相同！**  
- 根据小学三年级就学过的等高模型：
  $$\frac{S(\triangle ADE)}{S(\triangle ABE)} = \frac{AD}{AB}$$

#### 第 2 步：看右侧（再次利用等高模型）
观察桥梁 $\triangle ABE$ 和大三角形 $\triangle ABC$：
- 它们共同以点 $B$ 为顶点；
- 它们的底边 $AE$ 和 $AC$ 都在同一条直线边上；
- **同样等高，底边比就是面积比！**
  $$\frac{S(\triangle ABE)}{S(\triangle ABC)} = \frac{AE}{AC}$$

#### 第 3 步：两式相乘，见证奇迹！
将两个比例直接相乘：
$$\frac{S(\triangle ADE)}{S(\triangle ABE)} \times \frac{S(\triangle ABE)}{S(\triangle ABC)} = \frac{AD}{AB} \times \frac{AE}{AC}$$

分子分母上的中间过渡量 $S(\triangle ABE)$**严丝合缝地相互约分对消！**
$$\mathbf{\frac{S(\triangle ADE)}{S(\triangle ABC)} = \frac{AD}{AB} \times \frac{AE}{AC}}$$

> 💡 **顿悟时刻：**  
> 所谓的“鸟头公式”，本质上就是**两次“等高三角形底边比等于面积比”的连乘约分**！没有一丝多余的技巧，纯粹是数学比例乘法的自然流露！

---

### 第三步：小升初三大经典常考名题模型

#### 题型一：中点连线（中位线切角）
如果点 $D$ 是 $AB$ 的中点，点 $E$ 是 $AC$ 的中点：
- $\frac{AD}{AB} = \frac{1}{2}$，$\frac{AE}{AC} = \frac{1}{2}$；
- 鸟头面积：$\frac{S(\triangle ADE)}{S(\triangle ABC)} = \frac{1}{2} \times \frac{1}{2} = \mathbf{\frac{1}{4}}$；
- 下面的四边形占：$1 - \frac{1}{4} = \mathbf{\frac{3}{4}}$。

#### 题型二：三等分点与比例截取
如果 $AD = \frac{1}{3} AB$，$AE = \frac{2}{3} AC$，且已知大三角形面积为 $45 \text{ cm}^2$：
- 鸟头面积占比：$\frac{1}{3} \times \frac{2}{3} = \frac{2}{9}$；
- 鸟头实际面积：$45 \times \frac{2}{9} = \mathbf{10 \text{ cm}^2}$；
- 剩余四边形面积：$45 - 10 = \mathbf{35 \text{ cm}^2}$。两步口算，无需作高！

#### 题型三：互补角鸟头模型（平行四边形外角延伸）
如果两个角不相等，但**两个角的度数相加刚好等于 $180^\circ$（互补角）**：
例如在平行四边形中，相邻两个角 $\angle A + \angle B = 180^\circ$。
因为互补角的正弦高线比例对称，**共角公式依然 100% 成立！**
$$\frac{S_1}{S_2} = \frac{a_1 \times b_1}{a_2 \times b_2}$$

---

### 辅导锦囊：一张解题清单，搞定所有鸟头割补题

| 题目给出的条件 | 解题破局关键 | 秒杀公式 |
| :--- | :--- | :--- |
| **已知 $AD:DB$ 与 $AE:EC$** | **必须先化为整体比！**<br>$AD/AB$ 与 $AE/AC$ | $S_{\text{鸟头}} = S_{\text{大}} \times \frac{AD}{AB} \times \frac{AE}{AC}$ |
| **已知大三角面积与两边比例** | 求下部四边形面积 | $S_{\text{四边形}} = S_{\text{大}} \times \left(1 - \frac{AD}{AB} \times \frac{AE}{AC}\right)$ |
| **已知鸟头面积与两边比例** | 逆求大三角形面积 | $S_{\text{大}} = S_{\text{鸟头}} \div \left(\frac{AD}{AB} \times \frac{AE}{AC}\right)$ |

---

### 课后小测验与实战解析

> **经典挑战题：**  
> 在 $\triangle ABC$ 中，点 $D$ 在边 $AB$ 上，且 $AD = 2 DB$；点 $E$ 在边 $AC$ 上，且 $AE = 3 EC$。  
> 已知小鸟头 $\triangle ADE$ 的面积是 $18 \text{ cm}^2$。  
> 求：  
> 1. 大三角形 $\triangle ABC$ 的面积是多少平方厘米？  
> 2. 四边形 $DBCE$ 的面积是多少平方厘米？

**详细解题剖析：**

1. **第一步：先找全长比例（切忌直接用部分比相乘！）**  
   - $AD = 2 DB \implies AB = AD + DB = 3$ 份，所以：  
     $$\frac{AD}{AB} = \frac{2}{3}$$  
   - $AE = 3 EC \implies AC = AE + EC = 4$ 份，所以：  
     $$\frac{AE}{AC} = \frac{3}{4}$$

2. **第二步：计算鸟头面积占大三角形的比例**  
   $$\frac{S(\triangle ADE)}{S(\triangle ABC)} = \frac{AD}{AB} \times \frac{AE}{AC} = \frac{2}{3} \times \frac{3}{4} = \mathbf{\frac{1}{2}}$$  
   小鸟头 $\triangle ADE$ 竟然刚好占了整座大三角形的一半（$50\%$）！

3. **第三步：求大三角形与四边形面积**  
   - 大三角形面积：  
     $$S(\triangle ABC) = 18 \div \frac{1}{2} = \mathbf{36 \text{ cm}^2}$$  
   - 四边形 $DBCE$ 面积：  
     $$S(DBCE) = 36 - 18 = \mathbf{18 \text{ cm}^2}$$
