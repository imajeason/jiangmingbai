'use client';

import React, { useState } from 'react';

export default function TrailingZerosLab() {
  const [n, setN] = useState<number>(100);
  const [showFormula, setShowFormula] = useState<boolean>(false);

  // Calculate multiples of 5, 25, 125
  const count5 = Math.floor(n / 5);
  const count25 = Math.floor(n / 25);
  const count125 = Math.floor(n / 125);
  const totalZeros = count5 + count25 + count125;

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
      {/* 头部标题 */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: '0 0 6px 0' }}>
          连续乘积末尾零的个数：质因数 2 与 5 的“配对魔法”
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          1×2×3×···×{n} 乘积末尾究竟有几个 0？为什么只要找因数 5 的个数？
        </p>
      </div>

      {/* 画布展示区 */}
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
        {/* 核心算理：2 与 5 配对 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 20px',
          background: '#ede9fe',
          borderRadius: '12px',
          border: '1px solid #c4b5fd',
          marginBottom: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#6d28d9', fontWeight: 700 }}>质因数 2</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4c1d95' }}>极度充裕 (约半数是偶数)</div>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7c3aed' }}>×</span>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#6d28d9', fontWeight: 700 }}>质因数 5</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>稀缺瓶颈 (决定末位零)</div>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7c3aed' }}>=</span>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#6d28d9', fontWeight: 700 }}>产生末位 0</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>10 = 2 × 5</div>
          </div>
        </div>

        {/* 阶梯分解可视化：5 的倍数与 25 的倍数 */}
        <div style={{
          width: '100%',
          maxWidth: '520px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* 第一层：单倍数 5 */}
          <div style={{
            padding: '12px 16px',
            background: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>
                ① 包含至少 1 个因数 5 的数 (5, 10, 15, 20···)
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                算式：{n} ÷ 5 = <strong>{count5}</strong> 个
              </div>
            </div>
            <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '6px', fontWeight: 800 }}>
              +{count5} 个 0
            </span>
          </div>

          {/* 第二层：双倍数 25 */}
          <div style={{
            padding: '12px 16px',
            background: count25 > 0 ? '#fef3c7' : '#f8fafc',
            borderRadius: '10px',
            border: count25 > 0 ? '1px solid #fde68a' : '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 700, color: count25 > 0 ? '#92400e' : '#94a3b8', fontSize: '0.9rem' }}>
                ② 包含第 2 个因数 5 的数 (25, 50, 75, 100··· 每个多送1个5！)
              </div>
              <div style={{ fontSize: '0.75rem', color: count25 > 0 ? '#b45309' : '#94a3b8' }}>
                算式：{n} ÷ 25 = <strong>{count25}</strong> 个额外因数 5
              </div>
            </div>
            <span style={{
              background: count25 > 0 ? '#f59e0b' : '#cbd5e1',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '6px',
              fontWeight: 800
            }}>
              +{count25} 个 0
            </span>
          </div>

          {/* 第三层：三倍数 125 */}
          {n >= 125 && (
            <div style={{
              padding: '12px 16px',
              background: '#fee2e2',
              borderRadius: '10px',
              border: '1px solid #fecaca',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.9rem' }}>
                  ③ 包含第 3 个因数 5 的数 (125··· 再多送1个5！)
                </div>
                <div style={{ fontSize: '0.75rem', color: '#b91c1c' }}>
                  算式：{n} ÷ 125 = <strong>{count125}</strong> 个
                </div>
              </div>
              <span style={{ background: '#ef4444', color: '#ffffff', padding: '4px 10px', borderRadius: '6px', fontWeight: 800 }}>
                +{count125} 个 0
              </span>
            </div>
          )}
        </div>

        {/* 结果汇总 */}
        <div style={{
          marginTop: '18px',
          padding: '12px 24px',
          background: '#f0fdf4',
          borderRadius: '10px',
          border: '1px solid #bbf7d0',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '1.05rem', color: '#166534', fontWeight: 700 }}>
            🎉 {n}! 末尾连续零的总个数 = {count5} + {count25} {n >= 125 ? `+ ${count125}` : ''} ={' '}
            <strong style={{ fontSize: '1.6rem', color: '#15803d' }}>{totalZeros}</strong> 个 0
          </span>
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
        {/* 预设经典阶乘 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>经典题型:</span>
          {[10, 25, 50, 100, 125].map((val) => (
            <button
              key={val}
              onClick={() => setN(val)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: n === val ? '#2563eb' : '#f1f5f9',
                color: n === val ? '#fff' : '#334155',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              {val}!
            </button>
          ))}
        </div>

        {/* 滑块微调 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.75rem', color: '#475569' }}>自定义 N:</span>
          <input
            type="range"
            min="5"
            max="130"
            step="5"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            style={{ width: '80px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>{n}</span>
        </div>

        {/* 原理提示 */}
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
          {showFormula ? '收起口诀' : '💡 勒让德定理与避坑指南'}
        </button>
      </div>

      {/* 原理卡片 */}
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
          <p style={{ margin: '0 0 6px 0', fontWeight: 800 }}>📌 连续乘积末尾零的算理三要点：</p>
          <ol style={{ margin: 0, paddingLeft: '18px' }}>
            <li>
              <strong>末尾 0 只能由 2 × 5 产生</strong>：在连续自然数相乘中，偶数（带因数 2）每隔 2 个就有一个，质因数 2 的数量极其庞大，远远超过 5；因此质因数 5 是绝对的“短板瓶颈”，有几个因数 5 就必然能配出几个 0！
            </li>
            <li>
              <strong>警惕 25、50、75、100 的“额外隐藏 5”</strong>：
              比如 25 = 5 × 5，它贡献了整整 2 个因数 5！在做 N ÷ 5 时只统计了它的第 1 个 5，必须再用 N ÷ 25 补上它的第 2 个 5！
            </li>
            <li>
              <strong>勒让德定理（Legendre's Formula）</strong>：
              N! 质因数 5 的个数等于 [N/5] + [N/25] + [N/125] + ···，其中方括号表示向下取整。
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}

