'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type LabMode = 'ladder' | 'venn' | 'divisors';

interface NumberPair {
  a: number;
  b: number;
  steps: { divisor: number; remA: number; remB: number }[];
  gcd: number;
  lcm: number;
  primesA: number[];
  primesB: number[];
}

const PRESETS: { label: string; a: number; b: number; data: NumberPair }[] = [
  {
    label: '24 与 36 (经典双合数)',
    a: 24,
    b: 36,
    data: {
      a: 24,
      b: 36,
      steps: [
        { divisor: 2, remA: 12, remB: 18 },
        { divisor: 2, remA: 6, remB: 9 },
        { divisor: 3, remA: 2, remB: 3 },
      ],
      gcd: 12, // 2 * 2 * 3
      lcm: 72, // 12 * 2 * 3
      primesA: [2, 2, 2, 3],
      primesB: [2, 2, 3, 3],
    },
  },
  {
    label: '18 与 30 (一步步整除)',
    a: 18,
    b: 30,
    data: {
      a: 18,
      b: 30,
      steps: [
        { divisor: 2, remA: 9, remB: 15 },
        { divisor: 3, remA: 3, remB: 5 },
      ],
      gcd: 6,
      lcm: 90,
      primesA: [2, 3, 3],
      primesB: [2, 3, 5],
    },
  },
  {
    label: '45 与 60 (含质因数 5)',
    a: 45,
    b: 60,
    data: {
      a: 45,
      b: 60,
      steps: [
        { divisor: 3, remA: 15, remB: 20 },
        { divisor: 5, remA: 3, remB: 4 },
      ],
      gcd: 15,
      lcm: 180,
      primesA: [3, 3, 5],
      primesB: [2, 2, 3, 5],
    },
  },
  {
    label: '12 与 16 (快速互质)',
    a: 12,
    b: 16,
    data: {
      a: 12,
      b: 16,
      steps: [
        { divisor: 2, remA: 6, remB: 8 },
        { divisor: 2, remA: 3, remB: 4 },
      ],
      gcd: 4,
      lcm: 48,
      primesA: [2, 2, 3],
      primesB: [2, 2, 2, 2],
    },
  },
];

export default function PrimeFactorizationLab() {
  const [mode, setMode] = useState<LabMode>('ladder');
  const [presetIndex, setPresetIndex] = useState<number>(0);

  // 模式1：短除法当前高亮模式 ('gcd' 只看左侧, 'lcm' 看大L型)
  const [highlightTarget, setHighlightTarget] = useState<'both' | 'gcd' | 'lcm'>('both');

  // 模式3：单数因数个数探究
  const [singleNum, setSingleNum] = useState<number>(72); // 72 = 2^3 * 3^2, (3+1)*(2+1) = 12

  const curPreset = PRESETS[presetIndex];
  const pair = curPreset.data;

  // 韦恩图公有与独有质因数计算
  const commonPrimes: number[] = [];
  const onlyA: number[] = [...pair.primesA];
  const onlyB: number[] = [...pair.primesB];

  // 找出交集
  for (let i = onlyA.length - 1; i >= 0; i--) {
    const val = onlyA[i];
    const bIdx = onlyB.indexOf(val);
    if (bIdx !== -1) {
      commonPrimes.push(val);
      onlyA.splice(i, 1);
      onlyB.splice(bIdx, 1);
    }
  }

  return (
    <div className={styles.container} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 头部标题区 */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', color: '#1e293b' }}>
          🧱 质数与分解质因数：短除法与“数论乐高积木”
        </h3>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>
          为什么最大公因数只乘左边，最小公倍数要乘整个“L 型”？看透因数与倍数的积木拼装
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
          onClick={() => setMode('ladder')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'ladder' ? '#2563eb' : '#f1f5f9',
            color: mode === 'ladder' ? '#ffffff' : '#475569',
            boxShadow: mode === 'ladder' ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          🪜 场景一：短除法阶梯（左列乘 vs L型乘）
        </button>
        <button
          onClick={() => setMode('venn')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'venn' ? '#059669' : '#f1f5f9',
            color: mode === 'venn' ? '#ffffff' : '#475569',
            boxShadow: mode === 'venn' ? '0 2px 8px rgba(5,150,105,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          🧩 场景二：质因数韦恩图（A × B = 最大公因 × 最小公倍）
        </button>
        <button
          onClick={() => setMode('divisors')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'divisors' ? '#d97706' : '#f1f5f9',
            color: mode === 'divisors' ? '#ffffff' : '#475569',
            boxShadow: mode === 'divisors' ? '0 2px 8px rgba(217,119,6,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          🔢 场景三：因数个数公式（指数加一再相乘）
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 场景一：短除法阶梯 */}
      {/* ========================================================================= */}
      {mode === 'ladder' && (
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
              【{pair.a}】与【{pair.b}】短除法实况阶梯
            </div>

            {/* 短除法排版渲染 */}
            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '10px',
                padding: '20px 30px',
                display: 'inline-block',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                fontFamily: 'monospace',
                fontSize: '1.15rem',
                minWidth: '280px',
              }}
            >
              {/* 逐层短除架 */}
              {pair.steps.map((step, idx) => {
                // 上一层的数
                const prevA = idx === 0 ? pair.a : pair.steps[idx - 1].remA;
                const prevB = idx === 0 ? pair.b : pair.steps[idx - 1].remB;

                const isGcdActive = highlightTarget === 'both' || highlightTarget === 'gcd' || highlightTarget === 'lcm';

                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2px' }}>
                    {/* 左侧除数 (公有质因数) */}
                    <div
                      style={{
                        width: '36px',
                        textAlign: 'right',
                        paddingRight: '8px',
                        color: isGcdActive ? '#2563eb' : '#334155',
                        fontWeight: 800,
                        background: isGcdActive ? '#dbeafe' : 'transparent',
                        borderRadius: '4px',
                      }}
                    >
                      {step.divisor}
                    </div>

                    {/* 短除折线架 (类似半包围的勾线) */}
                    <div
                      style={{
                        borderLeft: '2.5px solid #1e293b',
                        borderBottom: '2.5px solid #1e293b',
                        padding: '2px 12px',
                        display: 'flex',
                        gap: '24px',
                      }}
                    >
                      <span>{prevA}</span>
                      <span>{prevB}</span>
                    </div>
                  </div>
                );
              })}

              {/* 最后一层商（互质商，已无法再同时整除） */}
              {(() => {
                const lastStep = pair.steps[pair.steps.length - 1];
                const isLcmActive = highlightTarget === 'both' || highlightTarget === 'lcm';
                return (
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                    <div style={{ width: '36px', paddingRight: '8px' }} />
                    <div
                      style={{
                        paddingLeft: '14px',
                        display: 'flex',
                        gap: '24px',
                        fontWeight: 800,
                        color: isLcmActive ? '#d97706' : '#1e293b',
                        background: isLcmActive ? '#fef3c7' : 'transparent',
                        borderRadius: '4px',
                      }}
                    >
                      <span>{lastStep.remA}</span>
                      <span>{lastStep.remB}</span>
                      <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600, alignSelf: 'center' }}>
                        (已互质，停止！)
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 结果对比卡片 */}
            <div
              style={{
                width: '100%',
                maxWidth: '620px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                marginTop: '16px',
                justifyContent: 'center',
              }}
            >
              {/* 最大公因数 */}
              <div
                style={{
                  flex: '1',
                  minWidth: '260px',
                  background: '#eff6ff',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e40af' }}>
                  🔹 最大公因数 (GCD)：只乘左侧公有数
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1d4ed8', margin: '4px 0' }}>
                  ({pair.a}, {pair.b}) = {pair.steps.map((s) => s.divisor).join(' × ')} ={' '}
                  <span style={{ fontSize: '1.35rem', color: '#2563eb' }}>{pair.gcd}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  因为左侧的质因数是两人“共同拥有”的，多一点都没有！
                </div>
              </div>

              {/* 最小公倍数 */}
              <div
                style={{
                  flex: '1',
                  minWidth: '260px',
                  background: '#fefce8',
                  border: '1.5px solid #fef08a',
                  borderRadius: '8px',
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#854d0e' }}>
                  🔸 最小公倍数 (LCM)：大“L”型全部连乘
                </div>
                {(() => {
                  const last = pair.steps[pair.steps.length - 1];
                  const left = pair.steps.map((s) => s.divisor).join(' × ');
                  return (
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>
                      [{pair.a}, {pair.b}] = {left} × {last.remA} × {last.remB} ={' '}
                      <span style={{ fontSize: '1.35rem', color: '#d97706' }}>{pair.lcm}</span>
                    </div>
                  );
                })()}
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  把左侧公有质因数和底端各自独有的商全部打包，一个都不落下！
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
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* 预设数字切换 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                选择探究数对：
              </span>
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setPresetIndex(idx)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: presetIndex === idx ? '#2563eb' : '#ffffff',
                    color: presetIndex === idx ? '#ffffff' : '#334155',
                    fontSize: '0.82rem',
                    fontWeight: presetIndex === idx ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* 高亮切换 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                高亮路径对比：
              </span>
              {[
                { type: 'both' as const, label: '全部看懂' },
                { type: 'gcd' as const, label: '只看左列 (最大公因数)' },
                { type: 'lcm' as const, label: '看大 L 型 (最小公倍数)' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setHighlightTarget(item.type)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: highlightTarget === item.type ? '#1e3a8a' : '#ffffff',
                    color: highlightTarget === item.type ? '#ffffff' : '#475569',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景二：质因数韦恩图与乘积定理 */}
      {/* ========================================================================= */}
      {mode === 'venn' && (
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
              数论乐高积木：所有自然数都是由质数“原子”拼装而成的！
            </div>
            <div style={{ fontSize: '0.85rem', color: '#15803d', marginBottom: '14px' }}>
              看懂交集（最大公因）与并集（最小公倍），彻底明白为什么 A × B = GCD × LCM！
            </div>

            {/* 韦恩图 SVG */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '220px' }}>
              <svg viewBox="0 0 500 220" width="100%" height="220">
                {/* 左圈 A */}
                <circle cx="190" cy="110" r="95" fill="rgba(37, 99, 235, 0.15)" stroke="#2563eb" strokeWidth="2.5" />
                {/* 右圈 B */}
                <circle cx="310" cy="110" r="95" fill="rgba(217, 119, 6, 0.15)" stroke="#d97706" strokeWidth="2.5" />

                {/* 圈标题 */}
                <text x="140" y="36" fontSize="13" fontWeight="800" fill="#1e40af">
                  {pair.a} 的质因数
                </text>
                <text x="360" y="36" fontSize="13" fontWeight="800" fill="#92400e">
                  {pair.b} 的质因数
                </text>

                {/* 左独有质因数积木 */}
                <g>
                  {onlyA.map((p, i) => (
                    <g key={i} transform={`translate(${140 + i * 26}, 100)`}>
                      <rect x="0" y="0" width="22" height="22" rx="4" fill="#2563eb" />
                      <text x="11" y="15" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                        {p}
                      </text>
                    </g>
                  ))}
                  <text x="145" y="145" fontSize="9" fill="#64748b">
                    独有部分
                  </text>
                </g>

                {/* 中间公有质因数 (GCD 交集) */}
                <g>
                  <rect x="220" y="70" width="60" height="75" rx="6" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeDasharray="3 2" />
                  <text x="250" y="62" fontSize="11" fontWeight="800" fill="#065f46" textAnchor="middle">
                    交集 GCD
                  </text>
                  {commonPrimes.map((p, i) => (
                    <g key={i} transform={`translate(238, ${78 + i * 22})`}>
                      <rect x="0" y="0" width="24" height="18" rx="3" fill="#059669" />
                      <text x="12" y="13" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
                        {p}
                      </text>
                    </g>
                  ))}
                </g>

                {/* 右独有质因数积木 */}
                <g>
                  {onlyB.map((p, i) => (
                    <g key={i} transform={`translate(${330 + i * 26}, 100)`}>
                      <rect x="0" y="0" width="22" height="22" rx="4" fill="#d97706" />
                      <text x="11" y="15" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                        {p}
                      </text>
                    </g>
                  ))}
                  <text x="345" y="145" fontSize="9" fill="#64748b">
                    独有部分
                  </text>
                </g>
              </svg>
            </div>

            {/* 乘积恒等式解剖卡片 */}
            <div
              style={{
                width: '100%',
                maxWidth: '600px',
                background: '#ffffff',
                border: '1.5px solid #86efac',
                borderRadius: '8px',
                padding: '12px 16px',
                marginTop: '10px',
              }}
            >
              <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.92rem' }}>
                🌟 惊人发现：两数乘积 = 最大公因数 × 最小公倍数！
              </div>
              <div style={{ fontSize: '0.95rem', color: '#1e293b', marginTop: '6px', lineHeight: '1.6' }}>
                <div>
                  A × B = {pair.a} × {pair.b} ={' '}
                  <span style={{ fontWeight: 800, color: '#2563eb' }}>{pair.a * pair.b}</span>
                </div>
                <div>
                  GCD × LCM = {pair.gcd} × {pair.lcm} ={' '}
                  <span style={{ fontWeight: 800, color: '#d97706' }}>{pair.gcd * pair.lcm}</span>
                  <span style={{ color: '#15803d', fontWeight: 800, marginLeft: '6px' }}>（完全恒等！）</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  原理：因为在算 A × B 时，中间的交集质因数被乘了两次；而算 GCD × LCM 时，正好是 1 次交集 × 1 次并集，积木总块数完全相同！
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景三：因数个数公式 */}
      {/* ========================================================================= */}
      {mode === 'divisors' && (
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
              因数个数定理：质因数分解后的指数“各加 1 再相乘”
            </div>

            {/* 72 分解展示 */}
            <div
              style={{
                width: '100%',
                maxWidth: '580px',
                background: '#ffffff',
                border: '1.5px solid #fde68a',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', textAlign: 'center' }}>
                {singleNum} = {singleNum === 72 ? '2³ × 3²' : singleNum === 36 ? '2² × 3²' : '2³ × 5¹'}
              </div>

              {/* 乘法原理搭配表格 */}
              <div
                style={{
                  background: '#fef3c7',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '0.88rem',
                  color: '#92400e',
                  lineHeight: '1.7',
                }}
              >
                <div>
                  1. 质数 2 的挑选方案：可选 2⁰(不选), 2¹, 2², 2³，共有 <strong>(3 + 1) = 4 种</strong> 选法；
                </div>
                <div>
                  2. 质数 3 的挑选方案：可选 3⁰(不选), 3¹, 3²，共有 <strong>(2 + 1) = 3 种</strong> 选法；
                </div>
                <div style={{ borderTop: '1px dashed #f59e0b', paddingTop: '6px', marginTop: '6px' }}>
                  根据乘法搭配原理，因数总个数 = (3 + 1) × (2 + 1) = 4 × 3 ={' '}
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626' }}>
                    12 个！
                  </span>
                </div>
              </div>

              {/* 展开所有12个因数 */}
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                <strong>所有因数列表：</strong>
                1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72（一个不漏！）
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
              切换验证数字：
            </span>
            {[
              { num: 72, label: '72 (2³ × 3² ➔ 12个因数)' },
              { num: 36, label: '36 (2² × 3² ➔ 9个因数)' },
              { num: 40, label: '40 (2³ × 5¹ ➔ 8个因数)' },
            ].map((item) => (
              <button
                key={item.num}
                onClick={() => setSingleNum(item.num)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: singleNum === item.num ? '#d97706' : '#ffffff',
                  color: singleNum === item.num ? '#ffffff' : '#334155',
                  fontSize: '0.82rem',
                  fontWeight: singleNum === item.num ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {item.label}
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
        <span>🪜 <strong>短除法则：</strong>公因数只乘左边列，公倍数连乘大 L 型</span>
        <span>🧩 <strong>数论积木：</strong>两数相乘等于最大公因数乘最小公倍数</span>
        <span>🔢 <strong>因数个数：</strong>分解质因数后，每个指数加 1 再连乘</span>
      </div>
    </div>
  );
}

