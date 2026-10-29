'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type ModeType = 'expand' | 'factor' | 'subtraction';

export default function DistributiveLawLab() {
  const [mode, setMode] = useState<ModeType>('expand');

  // 参数配置
  const [a, setA] = useState<number>(6);
  const [b, setB] = useState<number>(4);
  const [c, setC] = useState<number>(5);

  // 展开拆开动画进度 (0% 为完全合体，100% 为完全拆开)
  const [splitProgress, setSplitProgress] = useState<number>(40);

  // 模式2：逆向提取公因数选择 (经典 99*c + c)
  const [factorPreset, setFactorPreset] = useState<'standard' | 'hiddenOne'>('hiddenOne');

  // 计算面积
  const scale = 18; // 像素缩放比例
  const gap = (splitProgress / 100) * 36; // 拆开间隙

  // 模式1/2 的宽高
  const currentA = mode === 'subtraction' ? 10 : a;
  const currentB = mode === 'subtraction' ? 2 : b;
  const currentC = c;

  const areaA = currentA * currentC;
  const areaB = currentB * currentC;
  const totalCombinedArea = (currentA + currentB) * currentC;
  const diffArea = (currentA - currentB) * currentC;

  return (
    <div className={styles.container} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 头部标题 */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', color: '#1e293b' }}>
          🧩 乘法分配律：面积拼图与公因数提取
        </h3>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>
          为什么括号外的数必须乘两次？为什么提取公因数时会冒出一个“+1”？看懂长方形面积切分！
        </p>
      </div>

      {/* 可视化动画主舞台 */}
      <div
        style={{
          width: '100%',
          minHeight: '380px',
          background: 'radial-gradient(circle at 50% 50%, #f8fafc 0%, #edf2f7 100%)',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        <svg viewBox="0 0 540 260" width="100%" height="260" style={{ overflow: 'visible' }}>
          <defs>
            <pattern id="gridPattern" width="18" height="18" patternUnits="userSpaceOnUse">
              <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* 网格底纸 */}
          <rect x="20" y="15" width="500" height="230" fill="url(#gridPattern)" rx="8" />

          {/* ================= 模式 1：正向加法分配拼图 ================= */}
          {mode === 'expand' && (
            <g transform="translate(70, 45)">
              {/* 公共高 c 标尺 (左侧) */}
              <g transform="translate(-16, 0)">
                <line x1="0" y1="0" x2="0" y2={currentC * scale} stroke="#2563eb" strokeWidth="2" />
                <line x1="-4" y1="0" x2="4" y2="0" stroke="#2563eb" strokeWidth="2" />
                <line x1="-4" y1={currentC * scale} x2="4" y2={currentC * scale} stroke="#2563eb" strokeWidth="2" />
                <text
                  x="-8"
                  y={(currentC * scale) / 2}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="800"
                  fill="#1d4ed8"
                  transform={`rotate(-90, -8, ${(currentC * scale) / 2})`}
                >
                  公共宽 c = {currentC}
                </text>
              </g>

              {/* 左长方形 A (蓝色) */}
              <rect
                x="0"
                y="0"
                width={currentA * scale}
                height={currentC * scale}
                fill="#93c5fd"
                stroke="#2563eb"
                strokeWidth="2"
                rx="4"
              />
              {/* 长方形 A 内部标注 */}
              <text
                x={(currentA * scale) / 2}
                y={(currentC * scale) / 2 - 6}
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill="#1e3a8a"
              >
                a × c
              </text>
              <text
                x={(currentA * scale) / 2}
                y={(currentC * scale) / 2 + 16}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="#1d4ed8"
              >
                {currentA} × {currentC} = {areaA}
              </text>
              {/* 顶部长 a 标尺 */}
              <text x={(currentA * scale) / 2} y="-8" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2563eb">
                长 a = {currentA}
              </text>

              {/* 右长方形 B (黄色/橙色，随滑动产生间隙) */}
              <g transform={`translate(${currentA * scale + gap}, 0)`}>
                <rect
                  x="0"
                  y="0"
                  width={currentB * scale}
                  height={currentC * scale}
                  fill="#fde047"
                  stroke="#ca8a04"
                  strokeWidth="2"
                  rx="4"
                />
                {/* 长方形 B 内部标注 */}
                <text
                  x={(currentB * scale) / 2}
                  y={(currentC * scale) / 2 - 6}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="800"
                  fill="#713f12"
                >
                  b × c
                </text>
                <text
                  x={(currentB * scale) / 2}
                  y={(currentC * scale) / 2 + 16}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#854d0e"
                >
                  {currentB} × {currentC} = {areaB}
                </text>
                {/* 顶部长 b 标尺 */}
                <text x={(currentB * scale) / 2} y="-8" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ca8a04">
                  长 b = {currentB}
                </text>
              </g>

              {/* 底部合体总长标尺 */}
              <g transform={`translate(0, ${currentC * scale + 18})`}>
                <line x1="0" y1="0" x2={currentA * scale + currentB * scale + gap} y2="0" stroke="#475569" strokeWidth="1.5" />
                <line x1="0" y1="-4" x2="0" y2="4" stroke="#475569" strokeWidth="1.5" />
                <line x1={currentA * scale + currentB * scale + gap} y1="-4" x2={currentA * scale + currentB * scale + gap} y2="4" stroke="#475569" strokeWidth="1.5" />
                <text
                  x={(currentA * scale + currentB * scale + gap) / 2}
                  y="18"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#334155"
                >
                  合体总长 = a + b = ({currentA} + {currentB} = {currentA + currentB})
                </text>
              </g>
            </g>
          )}

          {/* ================= 模式 2：逆向提取公因数与隐藏的1 ================= */}
          {mode === 'factor' && (
            <g transform="translate(60, 45)">
              {/* 公共高 c = 36 */}
              <g transform="translate(-16, 0)">
                <line x1="0" y1="0" x2="0" y2={90} stroke="#2563eb" strokeWidth="2" />
                <text x="-8" y="48" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1d4ed8" transform="rotate(-90, -8, 48)">
                  相同因数 36
                </text>
              </g>

              {/* 99 × 36 的大块 */}
              <rect x="0" y="0" width={280} height={90} fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" rx="4" />
              <text x="140" y="40" textAnchor="middle" fontSize="15" fontWeight="800" fill="#1e3a8a">
                99 份 36
              </text>
              <text x="140" y="62" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8">
                99 × 36
              </text>
              <text x="140" y="-8" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2563eb">
                长 = 99
              </text>

              {/* 单独的 36 块 (即 1 × 36) */}
              <g transform={`translate(${280 + gap}, 0)`}>
                <rect x="0" y="0" width={40} height={90} fill="#fef08a" stroke="#ca8a04" strokeWidth="2" rx="4" />
                <text x="20" y="38" textAnchor="middle" fontSize="14" fontWeight="800" fill="#713f12">
                  +1份
                </text>
                <text x="20" y="60" textAnchor="middle" fontSize="10" fontWeight="700" fill="#854d0e">
                  1×36
                </text>
                <text x="20" y="-8" textAnchor="middle" fontSize="11" fontWeight="800" fill="#dc2626">
                  长 = 1 (隐藏)
                </text>
              </g>

              {/* 合并提示 */}
              <g transform="translate(160, 120)">
                <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="800" fill="#15803d">
                  99 份 36 加上 1 份 36 ＝ 整整 100 份 36！
                </text>
                <text x="0" y="20" textAnchor="middle" fontSize="12" fontWeight="700" fill="#166534">
                  算式：36 × (99 + 1) = 36 × 100 = 3600 (口算秒杀)
                </text>
              </g>
            </g>
          )}

          {/* ================= 模式 3：乘法分配律减法模型 ================= */}
          {mode === 'subtraction' && (
            <g transform="translate(80, 45)">
              {/* 大长方形 10 × 5 */}
              <rect x="0" y="0" width={10 * scale} height={5 * scale} fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" rx="4" />
              <text x="60" y="45" textAnchor="middle" fontSize="14" fontWeight="800" fill="#1e3a8a">
                剩余部分: (10 - 2) × 5 = 40
              </text>

              {/* 右侧扣除的虚线/红色块 2 × 5 */}
              <g transform={`translate(${8 * scale}, 0)`}>
                <rect
                  x="0"
                  y="0"
                  width={2 * scale}
                  height={5 * scale}
                  fill="#fee2e2"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  rx="2"
                />
                <text x={(2 * scale) / 2} y="45" textAnchor="middle" fontSize="11" fontWeight="800" fill="#dc2626">
                  减去 2×5
                </text>
                <text x={(2 * scale) / 2} y="-8" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ef4444">
                  挖去 b=2
                </text>
              </g>

              {/* 左侧宽 */}
              <text x="-12" y={45} textAnchor="middle" fontSize="12" fontWeight="700" fill="#2563eb">
                高 5
              </text>
              {/* 底部全长 */}
              <text x={5 * scale} y={5 * scale + 20} textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">
                完整大长方形长 a = 10，扣掉 b = 2，剩下 (10 - 2) = 8
              </text>
            </g>
          )}
        </svg>

        {/* 动态公式推导结论栏 */}
        <div
          style={{
            width: '100%',
            maxWidth: '720px',
            marginTop: '8px',
            padding: '12px 18px',
            borderRadius: '12px',
            background: '#ffffff',
            border: '1px solid #bfdbfe',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            textAlign: 'center',
          }}
        >
          {mode === 'expand' && (
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>
                ({currentA} + {currentB}) × {currentC} = {currentA} × {currentC} + {currentB} × {currentC} ={' '}
                <strong style={{ color: '#2563eb' }}>{totalCombinedArea}</strong>
              </div>
              <div style={{ fontSize: '0.86rem', color: '#64748b' }}>
                合体算：大长方形总长 ({currentA} + {currentB}) 乘高 {currentC}；分开算：蓝面积 ({areaA}) 加上黄面积 ({areaB})，完全相等！
              </div>
            </div>
          )}

          {mode === 'factor' && (
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16a34a', marginBottom: '4px' }}>
                99 × 36 + 36 = 36 × (99 + 1) = 36 × 100 = <strong>3600</strong>
              </div>
              <div style={{ fontSize: '0.86rem', color: '#64748b' }}>
                考场秒杀绝招：单独的 36 背后藏着“× 1”！提取公因数 36 后，括号里必须补上“+ 1”凑成整百！
              </div>
            </div>
          )}

          {mode === 'subtraction' && (
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#b91c1c', marginBottom: '4px' }}>
                (10 - 2) × 5 = 10 × 5 - 2 × 5 = 50 - 10 = <strong>40</strong>
              </div>
              <div style={{ fontSize: '0.86rem', color: '#64748b' }}>
                简便计算神技：遇到 98 × 25，化为 (100 - 2) × 25 = 2500 - 50 = 2450，口算即得！
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 紧贴画布的控制区 (严格遵循黄金近邻与弹性换行原则) */}
      <div
        style={{
          marginTop: '16px',
          background: '#ffffff',
          borderRadius: '14px',
          padding: '16px 18px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        {/* 第一行：模式切换 */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingBottom: '14px',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#334155' }}>
              🕹️ 探索模型：
            </span>
            <button
              onClick={() => setMode('expand')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: mode === 'expand' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: mode === 'expand' ? '#eff6ff' : '#ffffff',
                color: mode === 'expand' ? '#1d4ed8' : '#475569',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              🧩 正向面积切分与拼合 ((a+b)×c)
            </button>
            <button
              onClick={() => setMode('factor')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: mode === 'factor' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                background: mode === 'factor' ? '#f0fdf4' : '#ffffff',
                color: mode === 'factor' ? '#15803d' : '#475569',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              🎯 逆向提取公因数与隐藏的1
            </button>
            <button
              onClick={() => setMode('subtraction')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: mode === 'subtraction' ? '2px solid #dc2626' : '1px solid #cbd5e1',
                background: mode === 'subtraction' ? '#fef2f2' : '#ffffff',
                color: mode === 'subtraction' ? '#b91c1c' : '#475569',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              ✂️ 减法分配律与凑整技巧 ((a-b)×c)
            </button>
          </div>
        </div>

        {/* 第二行：滑块与参数调节 */}
        {mode === 'expand' && (
          <div
            style={{
              marginTop: '14px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            {/* 拼合与拆开滑块 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 240px', maxWidth: '340px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>
                ↔️ 拆开/合并:
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={splitProgress}
                onChange={(e) => setSplitProgress(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#2563eb', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb', minWidth: '40px' }}>
                {splitProgress === 0 ? '合并' : `${splitProgress}%`}
              </span>
            </div>

            {/* 参数 a, b, c 调节 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: '#475569' }}>长 a:</span>
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={a}
                  onChange={(e) => setA(Number(e.target.value))}
                  style={{ width: '65px', accentColor: '#2563eb' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{a}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: '#475569' }}>长 b:</span>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  style={{ width: '65px', accentColor: '#ca8a04' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{b}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: '#475569' }}>宽 c:</span>
                <input
                  type="range"
                  min="3"
                  max="6"
                  value={c}
                  onChange={(e) => setC(Number(e.target.value))}
                  style={{ width: '65px', accentColor: '#16a34a' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{c}</span>
              </div>
            </div>

            {/* 一键状态按钮 */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSplitProgress(splitProgress === 0 ? 100 : 0)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #2563eb',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {splitProgress === 0 ? '✂️ 一键切开' : '🔒 一键合并'}
              </button>
            </div>
          </div>
        )}

        {mode === 'factor' && (
          <div
            style={{
              marginTop: '14px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>典型考题速算演示：</span>
            <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700, background: '#f0fdf4', padding: '4px 10px', borderRadius: '6px' }}>
              99 × 36 + 36 ➔ 36 × (99 + 1) = 3600
            </span>
            <span style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 700, background: '#eff6ff', padding: '4px 10px', borderRadius: '6px' }}>
              87 × 45 + 13 × 45 ➔ 45 × (87 + 13) = 4500
            </span>
          </div>
        )}

        {mode === 'subtraction' && (
          <div
            style={{
              marginTop: '14px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>凑整巧算演示：</span>
            <span style={{ fontSize: '0.85rem', color: '#b91c1c', fontWeight: 700, background: '#fef2f2', padding: '4px 10px', borderRadius: '6px' }}>
              98 × 25 ➔ (100 - 2) × 25 = 2500 - 50 = 2450
            </span>
            <span style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 700, background: '#eff6ff', padding: '4px 10px', borderRadius: '6px' }}>
              102 × 43 ➔ (100 + 2) × 43 = 4300 + 86 = 4386
            </span>
          </div>
        )}
      </div>

      {/* 算理与考场避坑对照卡片 */}
      <div
        style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.98rem', marginBottom: '6px' }}>
            📐 为什么必须乘两次？
          </div>
          <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6 }}>
            大长方形的总长是由 a 和 b 拼成的，但它们<strong>共享同一个宽 c</strong>！切开之后，蓝色面积是 a × c，黄色面积是 b × c。两块地都要乘以宽 c，因此括号里的每一项都必须<strong>分别与 c 相乘</strong>！
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '14px',
            border: '2px solid #fef08a',
            backgroundClip: 'padding-box',
            boxShadow: '0 2px 6px rgba(234, 179, 8, 0.08)',
          }}
        >
          <div style={{ fontWeight: 700, color: '#ca8a04', fontSize: '0.98rem', marginBottom: '6px' }}>
            ⚠️ 考场头号大坑：“隐藏的乘 1”
          </div>
          <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6 }}>
            遇到 <strong>99 × 38 + 38</strong> 时，很多孩子会漏写。请看动画：后面的 38 实际上是 <strong>1 块宽度为 38 的方块（即 1 × 38）</strong>！提取公因数 38 之后，括号里剩下 99 + 1 = 100，瞬间秒杀！
          </div>
        </div>
      </div>
    </div>
  );
}

