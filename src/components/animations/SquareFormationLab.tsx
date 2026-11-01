'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type LabMode = 'outerLayer' | 'onionPeel' | 'hollow';

export default function SquareFormationLab() {
  const [mode, setMode] = useState<LabMode>('outerLayer');

  // -------------------- 几何参数 --------------------
  // 实心方阵每边人数 n (3 ~ 8)
  const [sideN, setSideN] = useState<number>(5);

  // 模式1：最外层数法模式
  // 'overlap': 4n - 4 (角被多算了一次)
  // 'windmill': 4 * (n - 1) (风车站队法)
  // 'parallel': 2n + 2(n-2) (上下两整行 + 左右夹心)
  const [cornerCountMethod, setCornerCountMethod] = useState<'overlap' | 'windmill' | 'parallel'>('windmill');

  // 模式2：剥洋葱层数控制 (剥掉几层)
  const [peeledLayers, setPeeledLayers] = useState<number>(0);

  // 模式3：空心方阵层数 k (1 ~ 3)
  const [hollowLayers, setHollowLayers] = useState<number>(1);

  // 数值计算
  const totalSolid = sideN * sideN;
  const outerTotal = 4 * (sideN - 1);

  // 空心方阵内层边长
  const innerSide = Math.max(0, sideN - 2 * hollowLayers);
  const hollowTotal = totalSolid - innerSide * innerSide;

  // 圈层颜色
  const layerColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

  return (
    <div className={styles.container} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 头部标题区 */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', color: '#1e293b' }}>
          💂 方阵问题：实心方阵与空心方阵的“圈层密码”
        </h3>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>
          为什么最外层不是 4 × 每边人数？看懂 4 个角上的重复计算、相邻圈层恒差 8 与剥洋葱模型
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
          onClick={() => setMode('outerLayer')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'outerLayer' ? '#2563eb' : '#f1f5f9',
            color: mode === 'outerLayer' ? '#ffffff' : '#475569',
            boxShadow: mode === 'outerLayer' ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          🚩 场景一：最外层计数陷阱（4个角重复了吗？）
        </button>
        <button
          onClick={() => setMode('onionPeel')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'onionPeel' ? '#d97706' : '#f1f5f9',
            color: mode === 'onionPeel' ? '#ffffff' : '#475569',
            boxShadow: mode === 'onionPeel' ? '0 2px 8px rgba(217,119,6,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          🧅 场景二：剥洋葱模型（相邻圈层为什么恒差 8 ？）
        </button>
        <button
          onClick={() => setMode('hollow')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'hollow' ? '#059669' : '#f1f5f9',
            color: mode === 'hollow' ? '#ffffff' : '#475569',
            boxShadow: mode === 'hollow' ? '0 2px 8px rgba(5,150,105,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          🔲 场景三：空心方阵（大正方形减小正方形）
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 场景一：最外层计数陷阱 */}
      {/* ========================================================================= */}
      {mode === 'outerLayer' && (
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
              每边 {sideN} 人的实心方阵 · 总人数：{totalSolid} 人 · 最外层周界：
              <span style={{ color: '#dc2626', fontSize: '1.25rem', marginLeft: '4px' }}>
                {outerTotal} 人
              </span>
            </div>

            {/* 动态点阵网格 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${sideN}, 1fr)`,
                gap: '8px',
                padding: '16px',
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                margin: '10px 0',
              }}
            >
              {Array.from({ length: sideN }).map((_, r) =>
                Array.from({ length: sideN }).map((_, c) => {
                  const isCorner =
                    (r === 0 && c === 0) ||
                    (r === 0 && c === sideN - 1) ||
                    (r === sideN - 1 && c === 0) ||
                    (r === sideN - 1 && c === sideN - 1);
                  const isOuter = r === 0 || r === sideN - 1 || c === 0 || c === sideN - 1;

                  // 依据选择的方法高亮不同颜色
                  let dotColor = '#94a3b8'; // 内部点灰色
                  let dotText = '';

                  if (isOuter) {
                    if (cornerCountMethod === 'overlap') {
                      dotColor = isCorner ? '#dc2626' : '#2563eb';
                      dotText = isCorner ? '角' : '';
                    } else if (cornerCountMethod === 'windmill') {
                      // 风车顺时针4条边划分 (每边包含起点角，不含终点角)
                      if (r === 0 && c < sideN - 1) dotColor = '#2563eb'; // 上边
                      else if (c === sideN - 1 && r < sideN - 1) dotColor = '#16a34a'; // 右边
                      else if (r === sideN - 1 && c > 0) dotColor = '#d97706'; // 下边
                      else dotColor = '#9333ea'; // 左边
                    } else {
                      // 上下两整行 + 左右夹心
                      if (r === 0 || r === sideN - 1) dotColor = '#2563eb';
                      else dotColor = '#ea580c';
                    }
                  }

                  return (
                    <div
                      key={`${r}-${c}`}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: dotColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        boxShadow: isOuter ? '0 2px 4px rgba(0,0,0,0.15)' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      {dotText || (isOuter ? '•' : '')}
                    </div>
                  );
                })
              )}
            </div>

            {/* 3种数法对比卡片 */}
            <div
              style={{
                width: '100%',
                maxWidth: '620px',
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                padding: '12px 16px',
                marginTop: '8px',
              }}
            >
              {cornerCountMethod === 'overlap' && (
                <div>
                  <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '0.95rem' }}>
                    🚨 常见陷阱剖析：4 × {sideN} 为什么错了？（角上的人被多算了一次！）
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px', lineHeight: '1.6' }}>
                    如果直接用 4 条边乘每边 {sideN} 人，红色的 <strong>4 个转角士兵</strong>，在横着数时被数了一次，竖着数时又被数了一次！
                    整整多算了 4 人！因此必须扣除 4：
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                    最外层人数 = 4 × {sideN} - 4 = {outerTotal} 人
                  </div>
                </div>
              )}

              {cornerCountMethod === 'windmill' && (
                <div>
                  <div style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.95rem' }}>
                    🌀 推荐巧解：风车旋转法（每边只管 1 个角）
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px', lineHeight: '1.6' }}>
                    把最外层按顺时针切成 4 个完全一样的小梯队。
                    蓝、绿、黄、紫 4 条边各分到 1 个角，每组正好是 <strong>({sideN} - 1) = {sideN - 1}</strong> 人！
                    不重不漏，乘法一步出结果：
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>
                    最外层人数 = 4 × ({sideN} - 1) = 4 × {sideN - 1} = {outerTotal} 人
                  </div>
                </div>
              )}

              {cornerCountMethod === 'parallel' && (
                <div>
                  <div style={{ fontWeight: 800, color: '#ea580c', fontSize: '0.95rem' }}>
                    📏 拆解思路：上下整行 + 左右夹心法
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px', lineHeight: '1.6' }}>
                    上下一共 2 条完整长边（蓝色各 {sideN} 人），
                    左右两侧被上下截断后，各只剩下中间夹心的 <strong>({sideN} - 2) = {sideN - 2}</strong> 人（橙色）。
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ea580c', marginTop: '4px' }}>
                    最外层人数 = 2 × {sideN} + 2 × ({sideN} - 2) = {2 * sideN} + {2 * (sideN - 2)} = {outerTotal} 人
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
            {/* 数法切换 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                切换解法视角：
              </span>
              {[
                { method: 'windmill' as const, label: '🌀 风车顺时针法 4(n-1)' },
                { method: 'overlap' as const, label: '🚨 扣角法 4n - 4' },
                { method: 'parallel' as const, label: '📏 上下+左右夹心法 2n+2(n-2)' },
              ].map((item) => (
                <button
                  key={item.method}
                  onClick={() => setCornerCountMethod(item.method)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: cornerCountMethod === item.method ? '#2563eb' : '#ffffff',
                    color: cornerCountMethod === item.method ? '#ffffff' : '#334155',
                    fontSize: '0.85rem',
                    fontWeight: cornerCountMethod === item.method ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* 每边人数调整 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                每边人数 n：
              </span>
              {[4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => setSideN(n)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: sideN === n ? '#1e3a8a' : '#ffffff',
                    color: sideN === n ? '#ffffff' : '#334155',
                    fontSize: '0.82rem',
                    fontWeight: sideN === n ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  每边 {n} 人 (共 {n * n} 人)
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景二：剥洋葱模型（层差为 8 的秘密） */}
      {/* ========================================================================= */}
      {mode === 'onionPeel' && (
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
              剥洋葱动效：实心方阵由内到外由同心圆圈层套合而成！
            </div>
            <div style={{ fontSize: '0.85rem', color: '#b45309', marginBottom: '14px' }}>
              为什么每一圈比里面紧挨的一圈<strong>恒多 8 人</strong>？因为 4 条边每边向外扩展 2 人，4 × 2 = 8！
            </div>

            {/* 彩色同心圈点阵 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${sideN}, 1fr)`,
                gap: '8px',
                padding: '16px',
                background: '#ffffff',
                border: '1.5px solid #fde68a',
                borderRadius: '10px',
              }}
            >
              {Array.from({ length: sideN }).map((_, r) =>
                Array.from({ length: sideN }).map((_, c) => {
                  // 计算该点属于第几层 (从最外层 0 开始计算)
                  const layerIdx = Math.min(r, c, sideN - 1 - r, sideN - 1 - c);
                  const isPeeled = layerIdx < peeledLayers;
                  const color = layerColors[layerIdx % layerColors.length];

                  return (
                    <div
                      key={`${r}-${c}`}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isPeeled ? '#f1f5f9' : color,
                        border: isPeeled ? '1.5px dashed #cbd5e1' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isPeeled ? '#cbd5e1' : '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        transition: 'all 0.3s ease-out',
                      }}
                    >
                      {isPeeled ? '' : `第${layerIdx + 1}层`}
                    </div>
                  );
                })
              )}
            </div>

            {/* 各圈层人数清单表 */}
            <div
              style={{
                width: '100%',
                maxWidth: '580px',
                background: '#ffffff',
                border: '1.5px solid #fde047',
                borderRadius: '8px',
                padding: '12px 16px',
                marginTop: '12px',
              }}
            >
              <div style={{ fontWeight: 800, color: '#854d0e', fontSize: '0.92rem', marginBottom: '6px' }}>
                🧅 从外向内各圈层人数演化：
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.85rem' }}>
                {Array.from({ length: Math.ceil(sideN / 2) }).map((_, l) => {
                  const currentSide = sideN - 2 * l;
                  const currentCount = currentSide === 1 ? 1 : 4 * (currentSide - 1);
                  return (
                    <span
                      key={l}
                      style={{
                        background: '#fef3c7',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid #fde68a',
                        color: '#92400e',
                        fontWeight: 700,
                      }}
                    >
                      第 {l + 1} 层 (边长 {currentSide})：<strong>{currentCount} 人</strong>
                      {l > 0 && <span style={{ color: '#dc2626', marginLeft: '4px' }}>(-8)</span>}
                    </span>
                  );
                })}
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
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e' }}>
              剥掉最外层（看内部减少）：
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {Array.from({ length: Math.ceil(sideN / 2) }).map((_, l) => (
                <button
                  key={l}
                  onClick={() => setPeeledLayers(l)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: peeledLayers === l ? '#d97706' : '#ffffff',
                    color: peeledLayers === l ? '#ffffff' : '#334155',
                    fontSize: '0.85rem',
                    fontWeight: peeledLayers === l ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {l === 0 ? '完整未剥' : `剥掉 ${l} 层`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景三：空心方阵 */}
      {/* ========================================================================= */}
      {mode === 'hollow' && (
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
              空心方阵核心公式：大正方形总数 - 内部挖空正方形总数
            </div>

            {/* 点阵渲染 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${sideN}, 1fr)`,
                gap: '8px',
                padding: '16px',
                background: '#ffffff',
                border: '1.5px solid #86efac',
                borderRadius: '10px',
                margin: '10px 0',
              }}
            >
              {Array.from({ length: sideN }).map((_, r) =>
                Array.from({ length: sideN }).map((_, c) => {
                  const isHollowEmpty =
                    r >= hollowLayers &&
                    r < sideN - hollowLayers &&
                    c >= hollowLayers &&
                    c < sideN - hollowLayers;

                  return (
                    <div
                      key={`${r}-${c}`}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isHollowEmpty ? '#f8fafc' : '#059669',
                        border: isHollowEmpty ? '1.5px dashed #cbd5e1' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isHollowEmpty ? '#94a3b8' : '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                      }}
                    >
                      {isHollowEmpty ? '空' : '兵'}
                    </div>
                  );
                })
              )}
            </div>

            {/* 算式卡片 */}
            <div
              style={{
                width: '100%',
                maxWidth: '580px',
                background: '#ffffff',
                border: '1.5px solid #86efac',
                borderRadius: '8px',
                padding: '12px 16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.88rem', color: '#166534', fontWeight: 700 }}>
                空心方阵（外边 {sideN} 人，实有 {hollowLayers} 层）：
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d', margin: '6px 0' }}>
                总人数 = 外实心 {sideN}² - 内空心 {innerSide}² = {sideN * sideN} - {innerSide * innerSide} ={' '}
                <span style={{ fontSize: '1.35rem', color: '#dc2626' }}>{hollowTotal} 人</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                内部挖空的小正方形边长为：{sideN} - 2 × {hollowLayers} = {innerSide} 人
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
              gap: '14px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>
                空心层数 k：
              </span>
              {[1, 2].map((k) => (
                <button
                  key={k}
                  onClick={() => setHollowLayers(k)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: hollowLayers === k ? '#059669' : '#ffffff',
                    color: hollowLayers === k ? '#ffffff' : '#334155',
                    fontSize: '0.82rem',
                    fontWeight: hollowLayers === k ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {k} 层空心
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>
                外边长 n：
              </span>
              {[5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => setSideN(n)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: sideN === n ? '#1e3a8a' : '#ffffff',
                    color: sideN === n ? '#ffffff' : '#334155',
                    fontSize: '0.82rem',
                    fontWeight: sideN === n ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  外边 {n}
                </button>
              ))}
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
        <span>🚩 <strong>最外层人数：</strong>4(n - 1) 或 4n - 4（切忌直接乘以 4）</span>
        <span>🧅 <strong>层差恒为 8：</strong>相邻圈层恒差 8 人（四边各增 2 人）</span>
        <span>🔲 <strong>空心大减小：</strong>总人数 = 外边² - (外边 - 2×层数)²</span>
      </div>
    </div>
  );
}

