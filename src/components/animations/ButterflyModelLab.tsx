'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type LabMode = 'proof' | 'ratios' | 'hourglass';

export default function ButterflyModelLab() {
  const [mode, setMode] = useState<LabMode>('proof');

  // -------------------- 梯形几何参数 --------------------
  const [topBase, setTopBase] = useState<number>(3);     // 上底 a (格数 1~6)
  const [bottomBase, setBottomBase] = useState<number>(6); // 下底 b (格数 2~8)
  const [heightVal, setHeightVal] = useState<number>(180); // 高度 (px)

  // 模式1：证明动画步骤 (0: 初始梯形, 1: 高亮左大三角形, 2: 高亮右大三角形, 3: 扣除公共底角露出双翅)
  const [proofStep, setProofStep] = useState<number>(3);

  // 画布坐标计算
  const canvasWidth = 520;
  const canvasHeight = 260;
  const unitScale = 30; // 每格代表的像素

  const centerX = canvasWidth / 2;
  const topY = 40;
  const bottomY = topY + heightVal;

  // 上底端点 A, D (水平居中对齐)
  const ax = centerX - (topBase * unitScale) / 2;
  const ay = topY;
  const dx = centerX + (topBase * unitScale) / 2;
  const dy = topY;

  // 下底端点 B, C
  const bx = centerX - (bottomBase * unitScale) / 2;
  const by = bottomY;
  const cx = centerX + (bottomBase * unitScale) / 2;
  const cy = bottomY;

  // 对角线交点 O (沙漏交点比例 a : b)
  // 由相似三角形可知，O 距离上底高度为 h * a / (a + b)，距离下底为 h * b / (a + b)
  const ratio = topBase / (topBase + bottomBase);
  const ox = centerX;
  const oy = topY + heightVal * ratio;

  // 面积份数计算 (若以比例份数表示)
  // S1 = a^2 份, S2 = b^2 份, S3 = S4 = a * b 份, 总面积 = (a + b)^2 份
  const partS1 = topBase * topBase;
  const partS2 = bottomBase * bottomBase;
  const partS3 = topBase * bottomBase;
  const partS4 = topBase * bottomBase;
  const partTotal = (topBase + bottomBase) * (topBase + bottomBase);

  // 绝对面积计算 (以 cm^2 模拟展示)
  const actualTotalArea = ((topBase + bottomBase) * 6) / 2; // 设定实际高为 6cm
  const s1Area = (actualTotalArea * partS1) / partTotal;
  const s2Area = (actualTotalArea * partS2) / partTotal;
  const s3Area = (actualTotalArea * partS3) / partTotal;
  const s4Area = (actualTotalArea * partS4) / partTotal;

  return (
    <div className={styles.container} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 头部标题区 */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', color: '#1e293b' }}>
          🦋 梯形蝴蝶模型与沙漏模型：为什么两只“蝴蝶翅膀”面积一定相等？
        </h3>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>
          小学高年级与奥数几何压轴王牌！从“同底等高去公共角”直观透视蝴蝶双翅守恒与面积乘积定理
        </p>
      </div>

      {/* 模式选择导航 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={() => setMode('proof')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'proof' ? '#2563eb' : '#f1f5f9',
            color: mode === 'proof' ? '#ffffff' : '#475569',
            boxShadow: mode === 'proof' ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          ✨ 场景一：双翅相等推导（同底等高去公共角）
        </button>
        <button
          onClick={() => setMode('ratios')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'ratios' ? '#d97706' : '#f1f5f9',
            color: mode === 'ratios' ? '#ffffff' : '#475569',
            boxShadow: mode === 'ratios' ? '0 2px 8px rgba(217,119,6,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          📐 场景二：四块面积比例与乘积定理（S₁ · S₂ = S₃ · S₄）
        </button>
        <button
          onClick={() => setMode('hourglass')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'hourglass' ? '#059669' : '#f1f5f9',
            color: mode === 'hourglass' ? '#ffffff' : '#475569',
            boxShadow: mode === 'hourglass' ? '0 2px 8px rgba(5,150,105,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          ⌛ 场景三：沙漏模型（上下对顶相似三角形）
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 场景一：双翅相等推导 */}
      {/* ========================================================================= */}
      {mode === 'proof' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 画布核心区 */}
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '10px' }}>
              证明核心：在平行线之间，同底等高的两个大三角形面积完全相同！
            </div>

            {/* 梯形几何画布 */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '540px' }}>
              <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} width="100%" height="240">
                {/* 辅助平行线 */}
                <line x1="20" y1={ay} x2={canvasWidth - 20} y2={ay} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="20" y1={by} x2={canvasWidth - 20} y2={by} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
                <text x="30" y={ay - 6} fontSize="10" fill="#64748b">平行线 L₁ (上底所在直线)</text>
                <text x="30" y={by + 16} fontSize="10" fill="#64748b">平行线 L₂ (下底所在直线)</text>

                {/* 模式1各步骤高亮填充 */}
                {/* 步骤1：左大三角形 ABC (底BC，高h) */}
                {proofStep === 1 && (
                  <polygon
                    points={`${ax},${ay} ${bx},${by} ${cx},${cy}`}
                    fill="rgba(59, 130, 246, 0.35)"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                  />
                )}

                {/* 步骤2：右大三角形 DBC (底BC，高h) */}
                {proofStep === 2 && (
                  <polygon
                    points={`${dx},${dy} ${bx},${by} ${cx},${cy}`}
                    fill="rgba(234, 88, 12, 0.35)"
                    stroke="#ea580c"
                    strokeWidth="2.5"
                  />
                )}

                {/* 步骤3：扣除公共底角 OBC，高亮双翅 */}
                {proofStep === 3 && (
                  <>
                    {/* 左翅膀 AOB */}
                    <polygon
                      points={`${ax},${ay} ${bx},${by} ${ox},${oy}`}
                      fill="rgba(239, 68, 68, 0.4)"
                      stroke="#dc2626"
                      strokeWidth="2"
                    />
                    {/* 右翅膀 DOC */}
                    <polygon
                      points={`${dx},${dy} ${cx},${cy} ${ox},${oy}`}
                      fill="rgba(239, 68, 68, 0.4)"
                      stroke="#dc2626"
                      strokeWidth="2"
                    />
                    {/* 公共底角 OBC (虚线半透明灰色) */}
                    <polygon
                      points={`${bx},${by} ${cx},${cy} ${ox},${oy}`}
                      fill="rgba(148, 163, 184, 0.2)"
                      stroke="#64748b"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    {/* 上部小三角 AOD */}
                    <polygon
                      points={`${ax},${ay} ${dx},${dy} ${ox},${oy}`}
                      fill="rgba(59, 130, 246, 0.15)"
                      stroke="#3b82f6"
                      strokeWidth="1"
                    />
                  </>
                )}

                {/* 梯形外边框四条边 */}
                <line x1={ax} y1={ay} x2={dx} y2={dy} stroke="#1e293b" strokeWidth="2.5" />
                <line x1={bx} y1={by} x2={cx} y2={cy} stroke="#1e293b" strokeWidth="2.5" />
                <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#1e293b" strokeWidth="2" />
                <line x1={dx} y1={dy} x2={cx} y2={cy} stroke="#1e293b" strokeWidth="2" />

                {/* 两条对角线 AC, BD */}
                <line x1={ax} y1={ay} x2={cx} y2={cy} stroke="#475569" strokeWidth="1.8" />
                <line x1={dx} y1={dy} x2={bx} y2={by} stroke="#475569" strokeWidth="1.8" />

                {/* 顶点标签 */}
                <text x={ax - 14} y={ay - 6} fontSize="13" fontWeight="800" fill="#1e293b">A</text>
                <text x={dx + 8} y={dy - 6} fontSize="13" fontWeight="800" fill="#1e293b">D</text>
                <text x={bx - 14} y={by + 16} fontSize="13" fontWeight="800" fill="#1e293b">B</text>
                <text x={cx + 8} y={by + 16} fontSize="13" fontWeight="800" fill="#1e293b">C</text>
                <text x={ox + 6} y={oy - 8} fontSize="13" fontWeight="800" fill="#dc2626">O</text>

                {/* 区域文字标注 */}
                {proofStep === 3 && (
                  <>
                    <text x={(ax + bx + ox) / 3 - 6} y={(ay + by + oy) / 3 + 4} fontSize="12" fontWeight="800" fill="#dc2626">
                      S₃ 左翅
                    </text>
                    <text x={(dx + cx + ox) / 3 - 6} y={(dy + cy + oy) / 3 + 4} fontSize="12" fontWeight="800" fill="#dc2626">
                      S₄ 右翅
                    </text>
                    <text x={ox} y={(ay + dy + oy) / 3} fontSize="11" fontWeight="700" fill="#2563eb" textAnchor="middle">
                      S₁
                    </text>
                    <text x={ox} y={(by + cy + oy) / 3 + 8} fontSize="11" fontWeight="700" fill="#64748b" textAnchor="middle">
                      公共底角 S₂
                    </text>
                  </>
                )}
              </svg>
            </div>

            {/* 证明步骤解说卡片 */}
            <div
              style={{
                width: '100%',
                maxWidth: '560px',
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                padding: '12px 16px',
                marginTop: '10px',
              }}
            >
              {proofStep === 1 && (
                <div>
                  <div style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.95rem' }}>
                    第 1 步：看左侧大三角形 △ABC（蓝色区域）
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                    以梯形的下底 <strong>BC</strong> 为底，顶点为 <strong>A</strong>。高是平行线之间的垂直距离 <strong>h</strong>。
                    所以面积为：<code>S(△ABC) = BC × h ÷ 2</code>。
                  </div>
                </div>
              )}

              {proofStep === 2 && (
                <div>
                  <div style={{ fontWeight: 800, color: '#ea580c', fontSize: '0.95rem' }}>
                    第 2 步：看右侧大三角形 △DBC（橙色区域）
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                    同样以梯形的下底 <strong>BC</strong> 为底，顶点为 <strong>D</strong>。高也是平行线之间的垂直距离 <strong>h</strong>！
                    所以面积为：<code>S(△DBC) = BC × h ÷ 2</code>。两座大三角形面积<strong>完全相等</strong>！
                  </div>
                </div>
              )}

              {proofStep === 3 && (
                <div>
                  <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '0.95rem' }}>
                    第 3 步：两边同时减去公共下三角 △OBC（灰色虚线区域）
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#1e293b', marginTop: '4px', fontWeight: 600 }}>
                    等式两边减去同一个量，差依然相等：
                  </div>
                  <div
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      marginTop: '6px',
                      fontSize: '0.92rem',
                      color: '#991b1b',
                      fontWeight: 800,
                    }}
                  >
                    S(△ABC) - S(△OBC) = S(△DBC) - S(△OBC) ➔ 左翅膀 S₃ = 右翅膀 S₄！
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                    无论梯形上底多窄、下底多宽、歪成什么形状，<strong>左右两只翅膀面积永远绝对相等</strong>！
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 控制条区 */}
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* 步骤切换按钮 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                分步推导演示：
              </span>
              {[
                { step: 1, label: '1. 左大三角形 △ABC' },
                { step: 2, label: '2. 右大三角形 △DBC' },
                { step: 3, label: '3. 去公共角 ➔ 露双翅 (S₃ = S₄)' },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setProofStep(s.step)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: proofStep === s.step ? '#2563eb' : '#ffffff',
                    color: proofStep === s.step ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: proofStep === s.step ? 700 : 500,
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* 上下底拖拽滑块 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>上底 a: {topBase} 格</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={topBase}
                  onChange={(e) => setTopBase(Number(e.target.value))}
                  style={{ accentColor: '#2563eb', cursor: 'pointer', width: '100px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>下底 b: {bottomBase} 格</span>
                <input
                  type="range"
                  min="3"
                  max="8"
                  step="1"
                  value={bottomBase}
                  onChange={(e) => setBottomBase(Number(e.target.value))}
                  style={{ accentColor: '#2563eb', cursor: 'pointer', width: '100px' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景二：四块面积比例与乘积定理 */}
      {/* ========================================================================= */}
      {mode === 'ratios' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 画布核心区 */}
          <div
            style={{
              background: '#fefce8',
              border: '1.5px solid #fef08a',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#854d0e', marginBottom: '8px' }}>
              蝴蝶模型面积定理：S₁ : S₂ : S₃ : S₄ = a² : b² : ab : ab
            </div>

            {/* 梯形彩色色块可视化 */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '540px' }}>
              <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} width="100%" height="240">
                {/* 四个彩色三角区域 */}
                {/* S1: 上部小三角 AOD (黄色) */}
                <polygon
                  points={`${ax},${ay} ${dx},${dy} ${ox},${oy}`}
                  fill="#fef08a"
                  stroke="#ca8a04"
                  strokeWidth="2"
                />

                {/* S2: 下部大三角 BOC (绿色) */}
                <polygon
                  points={`${bx},${by} ${cx},${cy} ${ox},${oy}`}
                  fill="#bbf7d0"
                  stroke="#16a34a"
                  strokeWidth="2"
                />

                {/* S3: 左翅膀 AOB (粉橙色) */}
                <polygon
                  points={`${ax},${ay} ${bx},${by} ${ox},${oy}`}
                  fill="#fed7aa"
                  stroke="#ea580c"
                  strokeWidth="2"
                />

                {/* S4: 右翅膀 DOC (粉橙色) */}
                <polygon
                  points={`${dx},${dy} ${cx},${cy} ${ox},${oy}`}
                  fill="#fed7aa"
                  stroke="#ea580c"
                  strokeWidth="2"
                />

                {/* 顶点标签 */}
                <text x={ax - 14} y={ay - 6} fontSize="13" fontWeight="800" fill="#1e293b">A</text>
                <text x={dx + 8} y={dy - 6} fontSize="13" fontWeight="800" fill="#1e293b">D</text>
                <text x={bx - 14} y={by + 16} fontSize="13" fontWeight="800" fill="#1e293b">B</text>
                <text x={cx + 8} y={by + 16} fontSize="13" fontWeight="800" fill="#1e293b">C</text>
                <text x={ox + 6} y={oy - 8} fontSize="13" fontWeight="800" fill="#dc2626">O</text>

                {/* 面积份数文字 */}
                <text x={ox} y={(ay + dy + oy) / 3 + 4} fontSize="12" fontWeight="800" fill="#a16207" textAnchor="middle">
                  S₁ = {partS1} 份 ({s1Area.toFixed(1)}cm²)
                </text>
                <text x={ox} y={(by + cy + oy) / 3 + 8} fontSize="12" fontWeight="800" fill="#15803d" textAnchor="middle">
                  S₂ = {partS2} 份 ({s2Area.toFixed(1)}cm²)
                </text>
                <text x={(ax + bx + ox) / 3 - 6} y={(ay + by + oy) / 3 + 4} fontSize="11" fontWeight="800" fill="#c2410c">
                  S₃ = {partS3} 份
                </text>
                <text x={(dx + cx + ox) / 3 - 6} y={(dy + cy + oy) / 3 + 4} fontSize="11" fontWeight="800" fill="#c2410c">
                  S₄ = {partS4} 份
                </text>

                {/* 底边长度标注 */}
                <text x={centerX} y={ay - 10} fontSize="11" fontWeight="800" fill="#2563eb" textAnchor="middle">
                  上底 a = {topBase}
                </text>
                <text x={centerX} y={by + 20} fontSize="11" fontWeight="800" fill="#2563eb" textAnchor="middle">
                  下底 b = {bottomBase}
                </text>
              </svg>
            </div>

            {/* 乘积恒等式验证与算理卡片 */}
            <div
              style={{
                width: '100%',
                maxWidth: '560px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '10px',
              }}
            >
              {/* 乘积守恒 */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #fde047',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.85rem', color: '#854d0e', fontWeight: 700 }}>
                  🌟 蝴蝶模型对顶乘积定理：上下相乘 = 左右相乘
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>
                  S₁ × S₂ = {partS1} × {partS2} = {partS1 * partS2} 份²
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ea580c' }}>
                  S₃ × S₄ = {partS3} × {partS4} = {partS3 * partS4} 份²（完全恒等！）
                </div>
              </div>

              {/* 单只翅膀开根号秒杀口诀 */}
              <div
                style={{
                  background: '#ecfdf5',
                  border: '1.5px solid #a7f3d0',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  color: '#065f46',
                }}
              >
                <strong>💡 考场秒杀口诀：</strong>
                知二求一！若题目已知上部面积 <strong>S₁</strong> 和下部面积 <strong>S₂</strong>，单只翅膀面积直接等于：
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#047857', marginLeft: '6px' }}>
                  S₃ = √(S₁ × S₂)
                </span>
                （例：已知 S₁=4，S₂=9，两只翅膀各为 √(4×9) = 6，梯形总面积 = 4 + 9 + 6 + 6 = 25！）
              </div>
            </div>
          </div>

          {/* 控制条区 */}
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* 典型考题比例预设 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                经典考题底边比速配：
              </span>
              {[
                { label: 'a:b = 1:2 (S₁:S₂ = 1:4)', a: 2, b: 4 },
                { label: 'a:b = 2:3 (S₁:S₂ = 4:9)', a: 2, b: 3 },
                { label: 'a:b = 1:3 (S₁:S₂ = 1:9)', a: 1, b: 3 },
                { label: 'a:b = 3:4 (S₁:S₂ = 9:16)', a: 3, b: 4 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTopBase(p.a);
                    setBottomBase(p.b);
                  }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: topBase === p.a && bottomBase === p.b ? '#d97706' : '#ffffff',
                    color: topBase === p.a && bottomBase === p.b ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: topBase === p.a && bottomBase === p.b ? 700 : 500,
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* 自定义微调滑块 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>上底 a: {topBase}</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={topBase}
                  onChange={(e) => setTopBase(Number(e.target.value))}
                  style={{ accentColor: '#d97706', cursor: 'pointer', width: '110px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>下底 b: {bottomBase}</span>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="1"
                  value={bottomBase}
                  onChange={(e) => setBottomBase(Number(e.target.value))}
                  style={{ accentColor: '#d97706', cursor: 'pointer', width: '110px' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景三：沙漏模型与线段比 */}
      {/* ========================================================================= */}
      {mode === 'hourglass' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 画布核心区 */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#166534', marginBottom: '8px' }}>
              沙漏模型：△AOD 与 △COB 是相似三角形（对顶角相等 + 错角相等）
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '540px' }}>
              <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} width="100%" height="240">
                {/* 重点突出沙漏本体 (上下两只三角) */}
                <polygon
                  points={`${ax},${ay} ${dx},${dy} ${ox},${oy}`}
                  fill="rgba(5, 150, 105, 0.25)"
                  stroke="#059669"
                  strokeWidth="2.5"
                />
                <polygon
                  points={`${bx},${by} ${cx},${cy} ${ox},${oy}`}
                  fill="rgba(5, 150, 105, 0.25)"
                  stroke="#059669"
                  strokeWidth="2.5"
                />

                {/* 梯形腰用浅灰虚线 */}
                <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1={dx} y1={dy} x2={cx} y2={cy} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* 对角线交叉轴线 */}
                <line x1={ax} y1={ay} x2={cx} y2={cy} stroke="#047857" strokeWidth="2" />
                <line x1={dx} y1={dy} x2={bx} y2={by} stroke="#047857" strokeWidth="2" />

                {/* 高线垂直线示意 */}
                <line x1={ox} y1={topY} x2={ox} y2={bottomY} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 4" />
                <circle cx={ox} cy={oy} r="4" fill="#dc2626" />

                {/* 顶点标签 */}
                <text x={ax - 14} y={ay - 6} fontSize="13" fontWeight="800" fill="#1e293b">A</text>
                <text x={dx + 8} y={dy - 6} fontSize="13" fontWeight="800" fill="#1e293b">D</text>
                <text x={bx - 14} y={by + 16} fontSize="13" fontWeight="800" fill="#1e293b">B</text>
                <text x={cx + 8} y={by + 16} fontSize="13" fontWeight="800" fill="#1e293b">C</text>
                <text x={ox + 8} y={oy + 4} fontSize="13" fontWeight="800" fill="#dc2626">O (沙漏颈)</text>

                {/* 线段比标注 */}
                <text x={(ax + ox) / 2 - 12} y={(ay + oy) / 2 - 4} fontSize="10" fontWeight="700" fill="#047857">
                  AO ({topBase}份)
                </text>
                <text x={(cx + ox) / 2 + 8} y={(cy + oy) / 2 + 4} fontSize="10" fontWeight="700" fill="#047857">
                  OC ({bottomBase}份)
                </text>
                <text x={ox + 8} y={(topY + oy) / 2} fontSize="10" fontWeight="700" fill="#dc2626">
                  h₁ ({topBase}份)
                </text>
                <text x={ox + 8} y={(bottomY + oy) / 2} fontSize="10" fontWeight="700" fill="#dc2626">
                  h₂ ({bottomBase}份)
                </text>
              </svg>
            </div>

            {/* 沙漏相似比卡片 */}
            <div
              style={{
                width: '100%',
                maxWidth: '560px',
                background: '#ffffff',
                border: '1.5px solid #86efac',
                borderRadius: '8px',
                padding: '12px 16px',
                marginTop: '10px',
              }}
            >
              <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.95rem' }}>
                ⌛ 沙漏模型“一通百通”的三大核心比例：
              </div>
              <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '6px', lineHeight: '1.7' }}>
                <div>
                  1. <strong>底边比 = 交叉线段比：</strong> AD : BC = AO : OC = DO : OB ={' '}
                  <span style={{ fontWeight: 800, color: '#059669' }}>{topBase} : {bottomBase}</span>
                </div>
                <div>
                  2. <strong>高之比：</strong> 上小三角形的高 h₁ 与下大三角形的高 h₂ 之比也是{' '}
                  <span style={{ fontWeight: 800, color: '#059669' }}>{topBase} : {bottomBase}</span>
                </div>
                <div>
                  3. <strong>面积之比（相似比的平方）：</strong> S₁ : S₂ = (底边比)² ={' '}
                  <span style={{ fontWeight: 800, color: '#dc2626' }}>{topBase}² : {bottomBase}² = {partS1} : {partS2}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 控制条区 */}
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#166534' }}>
              动态调整沙漏两端底边：
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: '#475569' }}>上口 a: {topBase}</span>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={topBase}
                onChange={(e) => setTopBase(Number(e.target.value))}
                style={{ accentColor: '#059669', cursor: 'pointer', width: '100px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: '#475569' }}>下口 b: {bottomBase}</span>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={bottomBase}
                onChange={(e) => setBottomBase(Number(e.target.value))}
                style={{ accentColor: '#059669', cursor: 'pointer', width: '100px' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 底部辅导口诀总结 */}
      <div
        style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '8px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'space-around',
          fontSize: '0.84rem',
          color: '#475569',
        }}
      >
        <span>🦋 <strong>翅膀相等：</strong>同底等高去公共角，左右双翅绝对均等 (S₃ = S₄)</span>
        <span>✖️ <strong>乘积定理：</strong>对角乘积恒守恒 (S₁ · S₂ = S₃ · S₄)</span>
        <span>⌛ <strong>沙漏比例：</strong>上底对下底，相似平方定面积 (S₁:S₂ = a²:b²)</span>
      </div>
    </div>
  );
}

