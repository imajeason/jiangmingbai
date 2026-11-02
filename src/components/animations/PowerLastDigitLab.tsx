'use client';

import React, { useState } from 'react';

const PERIODS: Record<number, number[]> = {
  2: [2, 4, 8, 6],
  3: [3, 9, 7, 1],
  4: [4, 6],
  7: [7, 9, 3, 1],
  8: [8, 4, 2, 6],
  9: [9, 1],
};

export default function PowerLastDigitLab() {
  const [base, setBase] = useState<number>(2);
  const [exponent, setExponent] = useState<number>(2026);
  const [showFormula, setShowFormula] = useState<boolean>(false);

  const cycle = PERIODS[base] || [base];
  const T = cycle.length;
  const remainder = exponent % T;
  const targetIndex = remainder === 0 ? T - 1 : remainder - 1;
  const lastDigit = cycle[targetIndex];
  const quotient = Math.floor(exponent / T);

  return (
    <div style={{
      width: '100%',
      maxWidth: '780px',
      margin: '0 auto',
      padding: '20px',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* 标题 */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: '0 0 6px 0' }}>
          数论尾数规律：幂的末位数字“周期密码盘”
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          解决类似 {base}^{exponent} 个位是几？乘法末位只由末位决定，顺着周期转盘轻松定位！
        </p>
      </div>

      {/* 交互视窗：周期转盘与流水线 */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '24px 16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '320px'
      }}>
        {/* 循环圆环/流程卡片 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {cycle.map((num, idx) => {
            const isSelected = idx === targetIndex;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: isSelected ? '#3b82f6' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#1e293b',
                  border: isSelected ? '2px solid #1d4ed8' : '1px solid #cbd5e1',
                  transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                  transition: 'all 0.25s ease',
                  boxShadow: isSelected ? '0 8px 16px rgba(59, 130, 246, 0.25)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: isSelected ? '#dbeafe' : '#64748b', fontWeight: 600 }}>
                  {idx + 1 === T ? '整除 (余0)' : `余 ${idx + 1}`}
                </span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, margin: '4px 0' }}>{num}</span>
                <span style={{ fontSize: '0.7rem', color: isSelected ? '#bfdbfe' : '#94a3b8' }}>
                  {base}^{idx + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* 箭头闭环示意 */}
        <div style={{ marginTop: '12px', fontSize: '0.8125rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🔄 底数 {base} 的个位数每隔 <strong>{T}</strong> 个循环一次：[{cycle.join(' ➔ ')} ➔ 循环]</span>
        </div>

        {/* 算式推演展示 */}
        <div style={{
          marginTop: '20px',
          padding: '14px 20px',
          background: '#eff6ff',
          borderRadius: '10px',
          border: '1px solid #bfdbfe',
          textAlign: 'center',
          width: '100%',
          maxWidth: '520px'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#1e40af', marginBottom: '6px' }}>
            步骤 ① 指数除以周期长度：<strong>{exponent} ÷ {T} = {quotient} 组 ··· 余 {remainder}</strong>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#1e40af', marginBottom: '8px' }}>
            步骤 ② 余数定位：{remainder === 0 ? `整除余 0，踩在第 ${T} 个末尾！` : `余数为 ${remainder}，对应周期第 ${remainder} 个数！`}
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1d4ed8' }}>
            🎉 结论：{base}^{exponent} 的个位数字是 <span style={{ fontSize: '1.6rem', color: '#dc2626' }}>{lastDigit}</span>
          </div>
        </div>
      </div>

      {/* 控制栏 */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* 底数选择 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>底数:</span>
          {[2, 3, 4, 7, 8, 9].map((b) => (
            <button
              key={b}
              onClick={() => setBase(b)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: base === b ? '#2563eb' : '#f1f5f9',
                color: base === b ? '#fff' : '#334155',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              {b}
            </button>
          ))}
        </div>

        {/* 预设热门年份指数 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>指数快捷:</span>
          {[2024, 2025, 2026, 100, 50].map((exp) => (
            <button
              key={exp}
              onClick={() => setExponent(exp)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: exponent === exp ? '#10b981' : '#f8fafc',
                color: exponent === exp ? '#fff' : '#475569',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              ^{exp}
            </button>
          ))}
        </div>

        {/* 原理折叠 */}
        <button
          onClick={() => setShowFormula(!showFormula)}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: showFormula ? '#fef3c7' : '#f8fafc',
            color: showFormula ? '#92400e' : '#64748b',
            fontWeight: 700,
            fontSize: '0.8125rem',
            cursor: 'pointer'
          }}
        >
          {showFormula ? '收起口诀' : '💡 常用底数周期汇总口诀'}
        </button>
      </div>

      {/* 原理公式表 */}
      {showFormula && (
        <div style={{
          marginTop: '16px',
          padding: '14px',
          background: '#fffbeb',
          borderRadius: '10px',
          border: '1px solid #fde68a',
          fontSize: '0.8125rem',
          color: '#78350f',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: '0 0 6px 0', fontWeight: 800 }}>📌 小学数论末位周期全景表：</p>
          <ul style={{ margin: 0, paddingLeft: '18px' }}>
            <li><strong>周期为 1</strong>（永远不变）：0、1、5、6（无论多少次方，个位恒为自身）。</li>
            <li><strong>周期为 2</strong>（看奇偶）：
              4 的方阵 [4, 6]（奇次为 4，偶次为 6）；
              9 的方阵 [9, 1]（奇次为 9，偶次为 1）。
            </li>
            <li><strong>周期为 4</strong>（除以4看余数）：
              2 的方阵 [2, 4, 8, 6]；
              3 的方阵 [3, 9, 7, 1]；
              7 的方阵 [7, 9, 3, 1]；
              8 的方阵 [8, 4, 2, 6]。
            </li>
          </ul>
          <p style={{ margin: '8px 0 0 0', color: '#b45309' }}>
            ⚡ <strong>为什么末位只看末位？</strong>在乘法竖式中，两个多位数相乘，乘积的个位数完全由两个乘数的个位数相乘得到，高位的十位百位对个位没有任何进位影响！因此求末位，直接把高位剥离即可。
          </p>
        </div>
      )}
    </div>
  );
}
