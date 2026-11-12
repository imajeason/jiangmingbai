---
id: triangle-centroid-six-areas
slug: triangle-centroid-six-areas
title: 三角形重心与六等分面积：三条中线交于一点且面积均分（2比1线段比与平衡力学）
subtitle: 为什么任意三角形的三条中线必交于一点？且把三角形面积均分为6块完全相等的1/6？
stage: xiaoxue
grade: 小学五/六年级
subject: math
difficulty: 2
durationMinutes: 4
summary: 三角形三条中线必交于同一点（重心），重心将每条中线分割为2:1，并将整个三角形等分为面积完全相等的六个小三角形。掌握重心六等分模型，秒杀各类多边形中线与面积比例难题。
coreFormula: "重心分中线比例: AG:GD = BG:GE = CG:GF = 2:1；六等分面积: S1 = S2 = S3 = S4 = S5 = S6 = (1/6) S_ABC"
tags:
  - 几何模型
  - 中线定理
  - 重心
  - 面积六等分
  - 比例法
animationType: triangle-centroid-six-areas
parentGuide:
  painPoint: 孩子看到三条中线相交时，直觉上觉得6个小三角形形状完全不同（有的尖长、有的扁平），根本不敢相信它们的面积竟然完全相等。
  steps:
    - stepNumber: 1
      question: "“宝贝，一条中线把三角形分成的左右两个三角形，面积一样大吗？”"
      guide: "带孩子观察：中线将对边分成相等的两段（等底），且两个三角形共用同一个顶点（等高）！所以‘等底等高面积必相等’，中线把大三角形对半分！"
    - stepNumber: 2
      question: "“那如果在重心下方看底边上的两个紧挨着的小三角形呢？”"
      guide: "同样道理！在重心 G 与底边构成的三角形中，底边依然被中点平分，高相同，所以左下和右下两个小三角形面积完全相同！"
    - stepNumber: 3
      question: "“把三条中线的平分关系合在一起，6个小三角形面积会怎样？”"
      guide: "对称消除方程：每一对相邻小块都相等，且两两组合后等于大三角形的一半，最终得出6块面积全部都是总面积的 1/6！"
  realLifeExample: 硬纸板三角形用一根圆珠笔笔尖顶在三条中线交点上，三角形可以完美水平平衡不掉落。
  keyTakeaway: "“中线交点名重心，长短二比一分明；六瓣雪花形状异，面积全是一比六！”"
prerequisites:
  - triangle-area-parallelogram
  - butterfly-model-geometry
nextSteps:
  - half-model-geometry
  - cavalieri-zu-geng-principle
---

# 三角形重心与六等分面积：三条中线交于一点且面积均分

## 一、生活与生活中的“平衡魔术”

拿一把三角板或任意剪下一块硬纸板三角形，找出一根笔尖顶在某个特殊点上，三角形竟然可以稳稳当当水平平衡在笔尖上，不会倾斜掉落！

这个神奇的“平衡点”，在物理学上被称为**质心（重心）**；在几何学中，它就是三角形**三条中线的唯一公共交点**！

更令人叹为观止的是：这三条中线不仅把三角形分割成了 6 个形状各异的小三角形，而且这 **6 个小三角形的面积完全相等**，每一个恰好是原三角形面积的 $\frac{1}{6}$！

---

## 二、核心概念与三大几何定理

### 1. 什么是中线与重心？
- **中线**：连接三角形任意一个顶点与对边中点的线段。三角形共有 3 条中线。
- **重心（Centroid，通常记作 $G$）**：三角形三条中线必定交于同一个点。

### 2. 重心的黄金比例性质：$2:1$
重心将每条中线分割成两部分，从**顶点到重心的距离**是**重心到对边中点距离**的 $2$ 倍：
$$AG : GD = 2 : 1$$
$$BG : GE = 2 : 1$$
$$CG : GF = 2 : 1$$

### 3. 六等分面积定理
设三条中线分别为 $AD, BE, CF$，交于重心 $G$：
重心与各中点划分出 6 个小三角形：
$$S_{\triangle AFG} = S_{\triangle BFG} = S_{\triangle BDG} = S_{\triangle CDG} = S_{\triangle CEG} = S_{\triangle AEG} = \frac{1}{6} S_{\triangle ABC}$$

---

## 三、数学证明：为什么 6 个面积完全相等？

只需利用最基础的**“等底等高”同积原理**与**比例模型**：

```
           A
          /|\
         / | \
       F/  |  \E
       /  *G*  \
      /  / | \  \
     B--/--D--\--C
```

1. **同底等高对半分**：
   - 因为 $D$ 是 $BC$ 的中点，在 $\triangle BGC$ 中，底边 $BD = DC$，高相同，所以：
     $$S_{\triangle BDG} = S_{\triangle CDG} = x$$
   - 同理在 $\triangle CGA$ 中，底边 $CE = EA$，所以：
     $$S_{\triangle CEG} = S_{\triangle AEG} = y$$
   - 在 $\triangle AGB$ 中，底边 $AF = FB$，所以：
     $$S_{\triangle AFG} = S_{\triangle BFG} = z$$

2. **利用整条中线对半割原三角形**：
   - 中线 $AD$ 把原三角形 $\triangle ABC$ 平分为两半：
     $$S_{\triangle ABD} = S_{\triangle ACD}$$
   - 即：$(z + z + x) = (y + y + x)$
   - 两边消去 $x$：$2z = 2y \implies z = y$！

3. **同理对称轮换**：
   - 考虑中线 $BE$：$(x + x + y) = (z + z + y) \implies 2x = 2z \implies x = z$！
   - 由此可得：
     $$x = y = z$$
   - 6 个小三角形的面积全部为 $x$，且总和为 $6x = S_{\triangle ABC}$，每个小三角形面积均为 $\frac{1}{6} S_{\triangle ABC}$！

4. **顺便推导 $2:1$ 比例**：
   - $\triangle ABG$ 的面积为 $z + z = 2x$；
   - $\triangle BDG$ 的面积为 $x$；
   - 两个三角形共享顶点 $B$，底边在同一直线 $AD$ 上，因此底边比等于面积比：
     $$\frac{AG}{GD} = \frac{S_{\triangle ABG}}{S_{\triangle BDG}} = \frac{2x}{x} = \frac{2}{1}$$
   - 完美的几何对称，无需三角函数，纯初等几何一气呵成！

---

## 四、经典例题解析

### 例题一：直接求小三角形面积
> **题目**：$\triangle ABC$ 的面积为 $72\text{ cm}^2$，$D, E, F$ 分别为 $BC, AC, AB$ 的中点，三条中线相交于 $G$。求四边形 $AFGE$ 的面积。
>
> **解析**：
> 1. 由六等分定理，每个小三角形的面积为：
>    $$S_0 = 72 \div 6 = 12\text{ cm}^2$$
> 2. 四边形 $AFGE$ 由 $\triangle AFG$ 和 $\triangle AEG$ 拼成：
>    $$S_{AFGE} = S_{\triangle AFG} + S_{\triangle AEG} = 12 + 12 = 24\text{ cm}^2$$
> 3. 亦可直接看作占全三角形的 $\frac{2}{6} = \frac{1}{3}$：$72 \times \frac{1}{3} = 24\text{ cm}^2$。

---

### 例题二：重心中线与中位线复合
> **题目**：在 $\triangle ABC$ 中，$AD$ 为中线，$G$ 为重心。连接 $DE$ 交 $CG$ 于点 $M$（$E$ 为 $AC$ 中点）。已知 $\triangle ABC$ 面积为 $120$，求 $\triangle GDM$ 的面积。
>
> **解析**：
> 1. 注意 $D, E$ 分别为 $BC, AC$ 中点，故 $DE$ 是中位线，$DE \parallel AB$ 且 $DE = \frac{1}{2} AB$。
> 2. 在“沙漏（蝴蝶）模型”中：因为 $DE \parallel AB$，所以 $\triangle ABG \sim \triangle MDE$ 相似？
>    注意线段 $CG$ 穿过 $DE$ 的交点正是 $M$！
>    因为 $C-M-G$ 是一条直线（中线 $CF$ 的延长），中位线 $DE$ 平分中线 $CF$！
>    重心 $G$ 满足 $CG = \frac{2}{3} CF$，$M$ 是 $CF$ 中点（即 $CM = \frac{1}{2} CF$）。
>    因此 $MG = CG - CM = (\frac{2}{3} - \frac{1}{2}) CF = \frac{1}{6} CF$。
> 3. 比较 $\triangle GDM$ 与 $\triangle GDC$：高相同，底边在 $CF$ 上：
>    $$S_{\triangle GDM} = \frac{1}{4} S_{\triangle GDC} = \frac{1}{4} \times (120 \div 6) = 5$$。

---

## 五、速记口诀与解题指南

> **重心交点三中线，二比一分长短边；**
> **六片雪花面积等，一六均分神仙算；**
> **四边中点连重心，三分之一稳拿下！**

