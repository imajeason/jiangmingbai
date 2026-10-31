'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type LabMode = 'proof' | 'ratios' | 'presets';

export default function BirdHeadModelLab() {
  const [mode, setMode] = useState<LabMode>('proof');

  // -------------------- 几何参数 --------------------
  // D 在 AB 上的比例 (0.2 ~ 0.8)
  const [ratioD, setRatioD] = useState<number>(0.5); // 默认 1/2
  // E 在 AC 上的比例 (0.2 ~ 0.8)
  const [ratioE, setRatioE] = useState<number>(0.5); // 默认 1/2

  // 模式1：证明步骤 (0: 初始鸟头图形, 1: 辅助线BE与第一层比例, 2: 第二层比例, 3: 两比相乘合体)
  const [proofStep, setProofStep] = useState<number>(3);

  // 三角形 ABC 基础坐标
  const canvasWidth = 520;
  const canvasHeight = 260;

  // A 顶点（鸟嘴）
  const ax = 130;
  const ay = 40;

  // B 左底角
  const bx = 50;
  const by = 220;

  // C 右底角
  const cx = 450;
  const cy = 220;

  // D 点在 AB 上
  const dx = ax + (bx - ax) * ratioD;
  const dy = ay + (by - ay) * ratioD;

  // E 点在 AC 上
  const ex = ax + (cx - ax) * ratioE;
  const ey = ay + (cy - ay) * ratioE;

  // 面积占比
  const birdHeadRatio = ratioD * ratioE;
  const quadRatio = 1 - birdHeadRatio;

  // 假设总面积为 60 cm² 时的实际面积数值
  const baseArea = 60;
  const birdHeadArea = baseArea * birdHeadRatio;
  const quadArea = baseArea * quadRatio;

  return (
    <div className={styles.container} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 头部标题区 */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', color: '#1e293b' }}>
          🦜 几何五大模型之“鸟头模型（共角定理）”
        </h3>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>
          两个三角形共享同一个角？面积比直接等于“两夹边长度之比的乘积”！一条辅助线看透代数本质
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
          ✨ 场景一：辅助线连线推导（为什么两边比相乘？）
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
            background: mode === 'ratios' ? '#059669' : '#f1f5f9',
            color: mode === 'ratios' ? '#ffffff' : '#475569',
            boxShadow: mode === 'ratios' ? '0 2px 8px rgba(5,150,105,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          📐 场景二：鸟头面积与下四边形动态比例
        </button>
        <button
          onClick={() => setMode('presets')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'presets' ? '#d97706' : '#f1f5f9',
            color: mode === 'presets' ? '#ffffff' : '#475569',
            boxShadow: mode === 'presets' ? '0 2px 8px rgba(217,119,6,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          🎯 场景三：小升初三大经典常考名题速配
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 场景一：辅助线连线推导 */}
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
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '8px' }}>
              证明核心：连接一条辅助线 BE，化繁为简，两次利用“等高三角形面积比等于底边比”！
            </div>

            {/* 几何图形 SVG */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '520px' }}>
              <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} width="100%" height="240">
                {/* 大三角形 ABC 底色 */}
                <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />

                {/* 模式1各步骤高亮区域 */}
                {/* 步骤1：第一座过渡桥 △ABE (粉色) 与 △ADE (红色鸟头) */}
                {proofStep === 1 && (
                  <>
                    <polygon points={`${ax},${ay} ${bx},${by} ${ex},${ey}`} fill="rgba(236, 72, 153, 0.2)" stroke="#db2777" strokeWidth="1.5" />
                    <polygon points={`${ax},${ay} ${dx},${dy} ${ex},${ey}`} fill="rgba(220, 38, 38, 0.4)" stroke="#dc2626" strokeWidth="2" />
                    <line x1={bx} y1={by} x2={ex} y2={ey} stroke="#db2777" strokeWidth="2" strokeDasharray="4 3" />
                  </>
                )}

                {/* 步骤2：第二座过渡桥 △ABE (粉色) 与大三角 △ABC (蓝色底) */}
                {proofStep === 2 && (
                  <>
                    <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="rgba(59, 130, 246, 0.15)" stroke="#2563eb" strokeWidth="2" />
                    <polygon points={`${ax},${ay} ${bx},${by} ${ex},${ey}`} fill="rgba(236, 72, 153, 0.35)" stroke="#db2777" strokeWidth="2" />
                    <line x1={bx} y1={by} x2={ex} y2={ey} stroke="#db2777" strokeWidth="2" strokeDasharray="4 3" />
                  </>
                )}

                {/* 步骤3：最终鸟头合体高亮 */}
                {proofStep === 3 && (
                  <>
                    {/* 鸟头 △ADE (橙红色) */}
                    <polygon points={`${ax},${ay} ${dx},${dy} ${ex},${ey}`} fill="rgba(234, 88, 12, 0.4)" stroke="#ea580c" strokeWidth="2.5" />
                    {/* 下部四边形 DBCE (青蓝色) */}
                    <polygon points={`${dx},${dy} ${bx},${by} ${cx},${cy} ${ex},${ey}`} fill="rgba(6, 182, 212, 0.15)" stroke="#0891b2" strokeWidth="1.5" />
                    {/* 辅助虚线 BE */}
                    <line x1={bx} y1={by} x2={ex} y2={ey} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 3" />
                  </>
                )}

                {/* 基础边线 */}
                <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#1e293b" strokeWidth="2.5" />
                <line x1={ax} y1={ay} x2={cx} y2={cy} stroke="#1e293b" strokeWidth="2.5" />
                <line x1={bx} y1={by} x2={cx} y2={cy} stroke="#1e293b" strokeWidth="2.5" />
                <line x1={dx} y1={dy} x2={ex} y2={ey} stroke="#dc2626" strokeWidth="2" />

                {/* 顶点圆点与文字 */}
                {[
                  { x: ax, y: ay - 8, label: 'A (共角鸟嘴)', color: '#dc2626' },
                  { x: bx - 14, y: by + 14, label: 'B', color: '#1e293b' },
                  { x: cx + 10, y: cy + 14, label: 'C', color: '#1e293b' },
                  { x: dx - 16, y: dy, label: 'D', color: '#dc2626' },
                  { x: ex + 12, y: ey, label: 'E', color: '#dc2626' },
                ].map((pt, i) => (
                  <text key={i} x={pt.x} y={pt.y} fontSize="13" fontWeight="800" fill={pt.color}>
                    {pt.label}
                  </text>
                ))}

                {/* 鸟头内标注 */}
                <text x={(ax + dx + ex) / 3} y={(ay + dy + ey) / 3 + 8} fontSize="11" fontWeight="800" fill="#c2410c" textAnchor="middle">
                  S(△ADE)
                </text>
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
                  <div style={{ fontWeight: 800, color: '#db2777', fontSize: '0.95rem' }}>
                    第 1 步：连辅助线 BE，对比 △ADE 与 △ABE
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                    它们共享同一个顶点 <strong>E</strong>，底边都在线段 <strong>AB</strong> 上。
                    因为顶点相同，垂直到 AB 上的高完全相等！
                  </div>
                  <div style={{ fontWeight: 800, color: '#db2777', marginTop: '4px', fontSize: '0.92rem' }}>
                    S(△ADE) ÷ S(△ABE) = AD ÷ AB
                  </div>
                </div>
              )}

              {proofStep === 2 && (
                <div>
                  <div style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.95rem' }}>
                    第 2 步：再对比过渡三角形 △ABE 与大三角形 △ABC
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                    它们共享同一个顶点 <strong>B</strong>，底边都在线段 <strong>AC</strong> 上。
                    同样等高，面积比就等于底边之比！
                  </div>
                  <div style={{ fontWeight: 800, color: '#2563eb', marginTop: '4px', fontSize: '0.92rem' }}>
                    S(△ABE) ÷ S(△ABC) = AE ÷ AC
                  </div>
                </div>
              )}

              {proofStep === 3 && (
                <div>
                  <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.95rem' }}>
                    第 3 步：两式相乘，中间项 S(△ABE) 完美约分抵消！
                  </div>
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      marginTop: '6px',
                      fontSize: '0.92rem',
                      color: '#166534',
                      fontWeight: 800,
                    }}
                  >
                    [S(△ADE) / S(△ABE)] × [S(△ABE) / S(△ABC)] = (AD / AB) × (AE / AC)
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#dc2626', marginTop: '6px' }}>
                    ➔ S(△ADE) ÷ S(△ABC) = (AD ÷ AB) × (AE ÷ AC)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                    中间借用的辅助三角形面积自动抵消消失，留下的正好是<strong>两条共角夹边的比值相乘</strong>！
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
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              推导演示步骤：
            </span>
            {[
              { step: 1, label: '1. 连 BE 看第一层比 (AD:AB)' },
              { step: 2, label: '2. 看第二层比 (AE:AC)' },
              { step: 3, label: '3. 相乘约分 ➔ 鸟头公式' },
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景二：鸟头面积与下四边形动态比例 */}
      {/* ========================================================================= */}
      {mode === 'ratios' && (
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
              鸟头面积比 = (AD / AB) × (AE / AC) ={' '}
              <span style={{ color: '#dc2626', fontSize: '1.25rem' }}>
                {(birdHeadRatio * 100).toFixed(1)}%
              </span>
            </div>

            {/* 面积分割图 */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '520px' }}>
              <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} width="100%" height="240">
                {/* 鸟头 △ADE */}
                <polygon points={`${ax},${ay} ${dx},${dy} ${ex},${ey}`} fill="#fed7aa" stroke="#ea580c" strokeWidth="2.5" />
                {/* 下四边形 DBCE */}
                <polygon points={`${dx},${dy} ${bx},${by} ${cx},${cy} ${ex},${ey}`} fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />

                {/* 顶点标签 */}
                <text x={ax} y={ay - 8} fontSize="13" fontWeight="800" fill="#dc2626" textAnchor="middle">A</text>
                <text x={bx - 12} y={by + 14} fontSize="13" fontWeight="800" fill="#1e293b">B</text>
                <text x={cx + 8} y={cy + 14} fontSize="13" fontWeight="800" fill="#1e293b">C</text>
                <text x={dx - 16} y={dy} fontSize="13" fontWeight="800" fill="#ea580c">D</text>
                <text x={ex + 10} y={ey} fontSize="13" fontWeight="800" fill="#ea580c">E</text>

                {/* 区域面积标注 */}
                <text x={(ax + dx + ex) / 3} y={(ay + dy + ey) / 3 + 6} fontSize="12" fontWeight="800" fill="#c2410c" textAnchor="middle">
                  鸟头: {(birdHeadRatio * 100).toFixed(1)}% ({birdHeadArea.toFixed(1)}cm²)
                </text>
                <text x={(dx + bx + cx + ex) / 4} y={(dy + by + cy + ey) / 4 + 6} fontSize="12" fontWeight="800" fill="#0369a1" textAnchor="middle">
                  下四边形: {(quadRatio * 100).toFixed(1)}% ({quadArea.toFixed(1)}cm²)
                </text>
              </svg>
            </div>

            {/* 实时公式卡片 */}
            <div
              style={{
                width: '100%',
                maxWidth: '560px',
                background: '#ffffff',
                border: '1.5px solid #86efac',
                borderRadius: '8px',
                padding: '12px 16px',
                marginTop: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: '#475569' }}>左侧边截取比 (AD / AB)：</span>
                <span style={{ fontWeight: 800, color: '#ea580c' }}>
                  {ratioD.toFixed(2)} (约 {Math.round(ratioD * 10)}/10)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: '#475569' }}>右侧边截取比 (AE / AC)：</span>
                <span style={{ fontWeight: 800, color: '#ea580c' }}>
                  {ratioE.toFixed(2)} (约 {Math.round(ratioE * 10)}/10)
                </span>
              </div>
              <div
                style={{
                  borderTop: '1px dashed #cbd5e1',
                  paddingTop: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#166534',
                }}
              >
                <span>S(△ADE) 占大三角形比率：</span>
                <span style={{ color: '#dc2626', fontSize: '1.15rem' }}>
                  {ratioD.toFixed(2)} × {ratioE.toFixed(2)} = {(birdHeadRatio).toFixed(3)}
                </span>
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
            {/* 滑块调节 D 比例 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', minWidth: '130px' }}>
                左边 AD / AB：{(ratioD * 100).toFixed(0)}%
              </span>
              <input
                type="range"
                min="0.2"
                max="0.8"
                step="0.05"
                value={ratioD}
                onChange={(e) => setRatioD(Number(e.target.value))}
                style={{ flex: 1, minWidth: '180px', accentColor: '#059669', cursor: 'pointer' }}
              />
            </div>

            {/* 滑块调节 E 比例 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', minWidth: '130px' }}>
                右边 AE / AC：{(ratioE * 100).toFixed(0)}%
              </span>
              <input
                type="range"
                min="0.2"
                max="0.8"
                step="0.05"
                value={ratioE}
                onChange={(e) => setRatioE(Number(e.target.value))}
                style={{ flex: 1, minWidth: '180px', accentColor: '#059669', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景三：小升初三大经典常考名题速配 */}
      {/* ========================================================================= */}
      {mode === 'presets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 画布核心区 */}
          <div
            style={{
              background: '#fffbeb',
              border: '1.5px solid #fef3c7',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ textAlign: 'center', fontSize: '1.05rem', fontWeight: 800, color: '#92400e' }}>
              🎯 小升初必考三大题型速通
            </div>

            {/* 3 张典型题卡 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
              }}
            >
              {/* 题型 1 */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #fde68a',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <div style={{ fontWeight: 800, color: '#b45309', fontSize: '0.9rem' }}>
                  1. 中点连线（中位线）
                </div>
                <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>
                  D、E 分别是两腰中点，AD/AB = 1/2，AE/AC = 1/2。
                </div>
                <div style={{ marginTop: '8px', fontWeight: 800, color: '#dc2626', fontSize: '0.92rem' }}>
                  鸟头面积 = 1/2 × 1/2 = 1/4
                </div>
                <div style={{ fontSize: '0.8rem', color: '#15803d', marginTop: '2px' }}>
                  下四边形占 1 - 1/4 = 3/4！
                </div>
              </div>

              {/* 题型 2 */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #fde68a',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <div style={{ fontWeight: 800, color: '#b45309', fontSize: '0.9rem' }}>
                  2. 三等分点题型
                </div>
                <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>
                  AD 占 AB 的 1/3，AE 占 AC 的 2/3。
                </div>
                <div style={{ marginTop: '8px', fontWeight: 800, color: '#dc2626', fontSize: '0.92rem' }}>
                  鸟头面积 = 1/3 × 2/3 = 2/9
                </div>
                <div style={{ fontSize: '0.8rem', color: '#15803d', marginTop: '2px' }}>
                  若大三角为 45cm²，鸟头就是 10cm²！
                </div>
              </div>

              {/* 题型 3 */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #fde68a',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <div style={{ fontWeight: 800, color: '#b45309', fontSize: '0.9rem' }}>
                  3. 互补角共角（平行四边形外角）
                </div>
                <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>
                  两角相加等于 180°（互补角）时，正弦值相等，鸟头公式依然成立！
                </div>
                <div style={{ marginTop: '8px', fontWeight: 800, color: '#166534', fontSize: '0.85rem' }}>
                  面积比同样等于两夹边比的乘积！
                </div>
              </div>
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
        <span>🦜 <strong>共角鸟头：</strong>一个角共用，两组夹边相乘通</span>
        <span>📐 <strong>面积乘积：</strong>S小 / S大 = (AD/AB) × (AE/AC)</span>
        <span>✨ <strong>辅助线秘诀：</strong>连接对角 BE，两次等高约分立现</span>
      </div>
    </div>
  );
}
