'use client';

import React, { useState } from 'react';

export default function Divisibility71113Lab() {
  const [testNumber, setTestNumber] = useState<number>(358925);
  const [showFormula, setShowFormula] = useState<boolean>(false);

  // Group into 3-digit chunks from right
  const numStr = testNumber.toString();
  const last3 = Number(numStr.slice(-3));
  const remaining = Number(numStr.slice(0, -3)) || 0;
  const diff = Math.abs(last3 - remaining);

  const isDiv7 = diff % 7 === 0;
  const isDiv11 = diff % 11 === 0;
  const isDiv13 = diff % 13 === 0;

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
          7、11、13 的整除密码：末三位截断与 1001 的神奇魔力
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          多位数能不能被 7、11 或 13 整除？利用 7×11×13=1001，末三位与前面相减，瞬间降维！
        </p>
      </div>

      {/* 画布区域 */}
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
        {/* 神奇数论地基：1001 横幅 */}
        <div style={{
          padding: '8px 20px',
          background: '#ede9fe',
          borderRadius: '20px',
          border: '1px solid #c4b5fd',
          fontSize: '0.9375rem',
          fontWeight: 800,
          color: '#6d28d9',
          marginBottom: '20px'
        }}>
          ✨ 核心基石：7 × 11 × 13 = 1001 = 1000 + 1 (模 1001 相当于 1000 ≡ -1)
        </div>

        {/* 动态数字拆分视窗 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          {/* 前面部分 */}
          <div style={{
            padding: '12px 20px',
            background: '#dbeafe',
            borderRadius: '10px',
            border: '2px solid #3b82f6',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700 }}>前面截断数</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1d4ed8' }}>{remaining}</div>
          </div>

          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#64748b' }}>与</span>

          {/* 末三位 */}
          <div style={{
            padding: '12px 20px',
            background: '#fef3c7',
            borderRadius: '10px',
            border: '2px solid #f59e0b',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700 }}>末尾三位数</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706' }}>{last3}</div>
          </div>

          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#64748b' }}>➔ 差值</span>

          {/* 差额 */}
          <div style={{
            padding: '12px 20px',
            background: '#f1f5f9',
            borderRadius: '10px',
            border: '2px solid #475569',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700 }}>|大减小| 差</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{diff}</div>
          </div>
        </div>

        {/* 7、11、13 诊断结果卡 */}
        <div style={{
          width: '100%',
          maxWidth: '520px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px'
        }}>
          {/* 7 诊断 */}
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            background: isDiv7 ? '#ecfdf5' : '#ffffff',
            border: isDiv7 ? '2px solid #10b981' : '1px solid #cbd5e1',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 700 }}>被 7 整除？</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isDiv7 ? '#15803d' : '#94a3b8', margin: '4px 0' }}>
              {isDiv7 ? '✔️ 能整除' : '❌ 不能'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {diff} ÷ 7 = {(diff / 7).toFixed(1)}
            </div>
          </div>

          {/* 11 诊断 */}
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            background: isDiv11 ? '#ecfdf5' : '#ffffff',
            border: isDiv11 ? '2px solid #10b981' : '1px solid #cbd5e1',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 700 }}>被 11 整除？</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isDiv11 ? '#15803d' : '#94a3b8', margin: '4px 0' }}>
              {isDiv11 ? '✔️ 能整除' : '❌ 不能'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {diff} ÷ 11 = {(diff / 11).toFixed(1)}
            </div>
          </div>

          {/* 13 诊断 */}
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            background: isDiv13 ? '#ecfdf5' : '#ffffff',
            border: isDiv13 ? '2px solid #10b981' : '1px solid #cbd5e1',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 700 }}>被 13 整除？</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isDiv13 ? '#15803d' : '#94a3b8', margin: '4px 0' }}>
              {isDiv13 ? '✔️ 能整除' : '❌ 不能'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {diff} ÷ 13 = {(diff / 13).toFixed(1)}
            </div>
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
        {/* 预设名题 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>经典大数:</span>
          {[358925, 123123, 75642, 1001001, 28314].map((val) => (
            <button
              key={val}
              onClick={() => setTestNumber(val)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: testNumber === val ? '#2563eb' : '#f1f5f9',
                color: testNumber === val ? '#fff' : '#334155',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              {val}
            </button>
          ))}
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
          {showFormula ? '收起口诀' : '💡 1001 数论原理拆解'}
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
          <p style={{ margin: '0 0 6px 0', fontWeight: 800 }}>📌 为什么末三位截断法对 7、11、13 全部有效？</p>
          <ol style={{ margin: 0, paddingLeft: '18px' }}>
            <li>
              <strong>神奇合体数 1001</strong>：7 × 11 × 13 恰好等于 1001！因为 1000 = 1001 - 1，所以 1000 除以 7、11、13 的余数全都是 -1！
            </li>
            <li>
              <strong>多位数位值展开</strong>：
              任意一个多位数可以写成：高位部分 × 1000 + 末三位部分。
              在模 1001（或者模 7、11、13）时，1000 替换为 -1，算式直接变成：<strong>末三位 - 高位部分</strong>！
            </li>
            <li>
              <strong>一箭三雕</strong>：只要算出的这个差值能被 7 整除，原数就能被 7 整除；能被 11 整除，原数就能被 11 整除；能被 13 整除，原数就能被 13 整除！
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
