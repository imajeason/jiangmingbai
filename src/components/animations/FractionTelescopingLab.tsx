'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type LabMode = 'domino' | 'gapK' | 'barFill';

export default function FractionTelescopingLab() {
  const [mode, setMode] = useState<LabMode>('domino');

  // -------------------- 模式1：多米诺骨牌展开与对消 --------------------
  const [dominoTerms, setDominoTerms] = useState<number>(5); // 展现前 n 项 (3 ~ 8)
  const [cancelStep, setCancelStep] = useState<number>(2); // 0: 原式, 1: 裂项展开, 2: 中间对消高亮, 3: 仅存首尾

  // -------------------- 模式2：差额变式 (分母差 k) --------------------
  const [gapK, setGapK] = useState<number>(2); // 差值 k = 2 (1*3, 3*5...), k = 3 (1*4, 4*7...)
  const [gapTerms, setGapTerms] = useState<number>(4);

  // 模式1 数值计算
  // 首项 1/1, 末项 1/(n+1), 结果 n/(n+1)
  const finalResultNum = dominoTerms;
  const finalResultDen = dominoTerms + 1;

  // 模式2 数值计算
  // 1/(1*(1+k)) + 1/((1+k)*(1+2k)) + ... + 1/((1+(n-1)k)*(1+nk))
  // = 1/k * [1 - 1/(1+nk)]
  const lastDenK = 1 + gapTerms * gapK;
  const insideNumK = lastDenK - 1; // 1 - 1/lastDenK = (lastDenK - 1) / lastDenK
  const finalNumK = insideNumK / gapK;
  const finalDenK = lastDenK;

  return (
    <div className={styles.container} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 头部标题区 */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', color: '#1e293b' }}>
          🪜 分数巧算之“裂项相消法”：中间项为什么像多米诺骨牌一样全部抵消？
        </h3>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>
          告别繁重通分！看懂“一拆二、对对消、留首尾”的数学几何之美与公差 k 的提系数绝招
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
          onClick={() => setMode('domino')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'domino' ? '#2563eb' : '#f1f5f9',
            color: mode === 'domino' ? '#ffffff' : '#475569',
            boxShadow: mode === 'domino' ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          🎴 场景一：多米诺骨牌对消（步步对消演示）
        </button>
        <button
          onClick={() => setMode('gapK')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'gapK' ? '#d97706' : '#f1f5f9',
            color: mode === 'gapK' ? '#ffffff' : '#475569',
            boxShadow: mode === 'gapK' ? '0 2px 8px rgba(217,119,6,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          ⚡ 场景二：公差 k 变式（为什么必须提 1/k ？）
        </button>
        <button
          onClick={() => setMode('barFill')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'barFill' ? '#059669' : '#f1f5f9',
            color: mode === 'barFill' ? '#ffffff' : '#475569',
            boxShadow: mode === 'barFill' ? '0 2px 8px rgba(5,150,105,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          📏 场景三：几何面积切片填充（直观数感）
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 场景一：多米诺骨牌对消 */}
      {/* ========================================================================= */}
      {mode === 'domino' && (
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
              前 {dominoTerms} 项裂项求和演示
            </div>

            {/* 动态算式流程展示 */}
            <div
              style={{
                width: '100%',
                maxWidth: '680px',
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {/* 第 0 步：原始连加形式 */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', fontSize: '0.92rem' }}>
                <span style={{ fontWeight: 800, color: '#64748b', minWidth: '70px' }}>原题算式：</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1e293b' }}>
                  {Array.from({ length: dominoTerms })
                    .map((_, i) => `1/(${i + 1}×${i + 2})`)
                    .join(' + ')}
                </span>
              </div>

              {/* 第 1 步：裂项拆分为减法对 */}
              {(cancelStep >= 1) && (
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', fontSize: '0.92rem' }}>
                  <span style={{ fontWeight: 800, color: '#2563eb', minWidth: '70px' }}>裂项展开：</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                    {Array.from({ length: dominoTerms }).map((_, i) => (
                      <span
                        key={i}
                        style={{
                          background: '#eff6ff',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid #bfdbfe',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: '#1d4ed8',
                        }}
                      >
                        (1/{i + 1} - 1/{i + 2})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 第 2 步：中间项多米诺相消 */}
              {(cancelStep >= 2) && (
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', fontSize: '0.95rem' }}>
                  <span style={{ fontWeight: 800, color: '#dc2626', minWidth: '70px' }}>对消现场：</span>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                      alignItems: 'center',
                      background: '#fff1f2',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1.5px dashed #fecaca',
                    }}
                  >
                    {/* 首项 (保留) */}
                    <span
                      style={{
                        fontWeight: 800,
                        color: '#15803d',
                        background: '#dcfce7',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid #86efac',
                      }}
                    >
                      1/1 (首项)
                    </span>

                    {/* 中间抵消对 */}
                    {Array.from({ length: dominoTerms - 1 }).map((_, i) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#94a3b8' }}>
                        <span style={{ textDecoration: 'line-through', opacity: cancelStep === 3 ? 0.3 : 0.8, color: '#dc2626' }}>
                          - 1/{i + 2}
                        </span>
                        <span style={{ textDecoration: 'line-through', opacity: cancelStep === 3 ? 0.3 : 0.8, color: '#16a34a' }}>
                          + 1/{i + 2}
                        </span>
                      </span>
                    ))}

                    {/* 末项 (保留) */}
                    <span
                      style={{
                        fontWeight: 800,
                        color: '#b91c1c',
                        background: '#fee2e2',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid #fca5a5',
                      }}
                    >
                      - 1/{dominoTerms + 1} (末项)
                    </span>
                  </div>
                </div>
              )}

              {/* 第 3 步：最终秒杀化简 */}
              {(cancelStep >= 2) && (
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1.5px solid #86efac',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
                    🎯 最终收拢结果（首项减末项）：
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d', margin: '4px 0' }}>
                    1 - 1/{dominoTerms + 1} ={' '}
                    <span style={{ color: '#dc2626', fontSize: '1.4rem' }}>
                      {finalResultNum}/{finalResultDen}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    即使算到 1/(99×100)，答案同样是 1 - 1/100 = 99/100，三秒口算秒杀！
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
                演示步骤演进：
              </span>
              {[
                { step: 0, label: '1. 观察原式' },
                { step: 1, label: '2. 拆解成减法' },
                { step: 2, label: '3. 骨牌对消高亮' },
                { step: 3, label: '4. 仅留首尾秒杀' },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setCancelStep(s.step)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: cancelStep === s.step ? '#2563eb' : '#ffffff',
                    color: cancelStep === s.step ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: cancelStep === s.step ? 700 : 500,
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* 项数调整 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                选择求和项数：
              </span>
              {[3, 4, 5, 6, 8, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setDominoTerms(n)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: dominoTerms === n ? '#1e3a8a' : '#ffffff',
                    color: dominoTerms === n ? '#ffffff' : '#334155',
                    fontSize: '0.82rem',
                    fontWeight: dominoTerms === n ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  前 {n} 项
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景二：公差 k 变式 */}
      {/* ========================================================================= */}
      {mode === 'gapK' && (
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
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#92400e', marginBottom: '8px' }}>
              分母两个因子差为 k = {gapK} 时：为什么必须在最外层提取 1/{gapK} ？
            </div>

            {/* 为什么需要提 1/k 的算理解剖 */}
            <div
              style={{
                width: '100%',
                maxWidth: '650px',
                background: '#ffffff',
                border: '1.5px solid #fde68a',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* 单项检验 */}
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  padding: '10px 14px',
                  borderRadius: '6px',
                }}
              >
                <div style={{ fontWeight: 800, color: '#b91c1c', fontSize: '0.88rem' }}>
                  🚨 致命陷阱警示：直接拆开会平白多出分子 {gapK}！
                </div>
                <div style={{ fontSize: '0.86rem', color: '#991b1b', marginTop: '4px' }}>
                  试算：1/1 - 1/{1 + gapK} = ({1 + gapK} - 1) / (1 × {1 + gapK}) ={' '}
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: '#dc2626' }}>
                    {gapK} / (1 × {1 + gapK})
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#7f1d1d', marginTop: '2px' }}>
                  原来的分子只有 1，拆开后分子却变成了 {gapK}，整整放大了 {gapK} 倍！所以必须在外层乘以{' '}
                  <strong>1/{gapK}</strong> 来对冲抵消！
                </div>
              </div>

              {/* 正确的母公式 */}
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1.5px solid #86efac',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  fontFamily: 'monospace',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#166534',
                  textAlign: 'center',
                }}
              >
                1 / [n × (n + {gapK})] = (1/{gapK}) × [1/n - 1/(n + {gapK})]
              </div>

              {/* 实时动态算式计算 */}
              <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.7' }}>
                <div>
                  <strong>当前题目：</strong>
                  {Array.from({ length: gapTerms })
                    .map((_, i) => `1/(${1 + i * gapK}×${1 + (i + 1) * gapK})`)
                    .join(' + ')}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <strong>提系数 1/{gapK} 后：</strong>
                  (1/{gapK}) × [1/1 - 1/{lastDenK}]
                </div>
                <div style={{ marginTop: '4px', fontSize: '1.05rem', fontWeight: 800, color: '#d97706' }}>
                  结果 = (1/{gapK}) × ({insideNumK}/{lastDenK}) ={' '}
                  <span style={{ color: '#15803d', fontSize: '1.25rem' }}>
                    {finalNumK}/{finalDenK}
                  </span>
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
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              切换公差 k（分母两数差距）：
            </span>
            {[
              { k: 2, label: 'k = 2 (差2：1×3, 3×5... 提 1/2)' },
              { k: 3, label: 'k = 3 (差3：1×4, 4×7... 提 1/3)' },
              { k: 4, label: 'k = 4 (差4：1×5, 5×9... 提 1/4)' },
            ].map((item) => (
              <button
                key={item.k}
                onClick={() => setGapK(item.k)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: gapK === item.k ? '#d97706' : '#ffffff',
                  color: gapK === item.k ? '#ffffff' : '#334155',
                  fontSize: '0.85rem',
                  fontWeight: gapK === item.k ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景三：几何面积切片填充 */}
      {/* ========================================================================= */}
      {mode === 'barFill' && (
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
              几何直观：长为 1 的线段被逐步蚕食填满
            </div>
            <div style={{ fontSize: '0.85rem', color: '#15803d', marginBottom: '16px' }}>
              每加一项，空缺部分就缩小到 1/(n+1)，填满总进度直逼 1！
            </div>

            {/* 填充进度条可视化 */}
            <div
              style={{
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {/* 总长 1 的分段色块 */}
              <div
                style={{
                  width: '100%',
                  height: '42px',
                  background: '#f1f5f9',
                  border: '2px solid #334155',
                  borderRadius: '8px',
                  display: 'flex',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {Array.from({ length: dominoTerms }).map((_, i) => {
                  const segWidthPct = (1 / ((i + 1) * (i + 2))) * 100;
                  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
                  return (
                    <div
                      key={i}
                      style={{
                        width: `${segWidthPct}%`,
                        height: '100%',
                        background: colors[i % colors.length],
                        borderRight: '1px solid rgba(255,255,255,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}
                      title={`第${i + 1}项: 1/(${i + 1}×${i + 2}) = 1/${(i + 1) * (i + 2)}`}
                    >
                      1/{(i + 1) * (i + 2)}
                    </div>
                  );
                })}

                {/* 剩余空缺部分 */}
                <div
                  style={{
                    flex: 1,
                    background: '#fecaca',
                    borderLeft: '2px dashed #dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#991b1b',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}
                >
                  还差 1/{dominoTerms + 1}
                </div>
              </div>

              {/* 累计数值展示 */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #86efac',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '0.92rem',
                }}
              >
                已填充总和 = 1 - 1/{dominoTerms + 1} ={' '}
                <span style={{ fontWeight: 800, color: '#15803d', fontSize: '1.15rem' }}>
                  {dominoTerms}/{dominoTerms + 1}
                </span>{' '}
                （占比 {( (dominoTerms / (dominoTerms + 1)) * 100 ).toFixed(1)}%）
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
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#166534' }}>
              动态增加拼接项数：
            </span>
            {[2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => setDominoTerms(n)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: dominoTerms === n ? '#059669' : '#ffffff',
                  color: dominoTerms === n ? '#ffffff' : '#334155',
                  fontSize: '0.85rem',
                  fontWeight: dominoTerms === n ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                拼接 {n} 块
              </button>
            ))}
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
        <span>🪜 <strong>标准裂项：</strong>一拆为二变相减，中间对消留首尾</span>
        <span>⚡ <strong>差额提数：</strong>分母相差 k，外层乘上 1/k 对冲平分</span>
        <span>🎯 <strong>小升初绝招：</strong>看到连乘分母相加，切忌盲目通分找公倍</span>
      </div>
    </div>
  );
}
