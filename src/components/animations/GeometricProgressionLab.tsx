'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { TrendingUp, Sparkles, Layers, CheckCircle2, RotateCcw } from 'lucide-react';

export default function GeometricProgressionLab() {
  const [activeTab, setActiveTab] = useState<'double' | 'half'>('double');
  const [termsCount, setTermsCount] = useState<number>(6); // 1 到 10 项

  // 整数翻倍数列项数
  const doubleTerms = Array.from({ length: termsCount }, (_, i) => Math.pow(2, i));
  const doubleSum = Math.pow(2, termsCount) - 1;
  const nextPower = Math.pow(2, termsCount);

  // 分数折半数列
  const halfDenom = Math.pow(2, termsCount);
  const halfSumNumerator = halfDenom - 1;

  // 正方形递归折半切分数据 (用于 SVG 渲染)
  const getSubdivisions = (n: number) => {
    // 初始区域 x:0..180, y:0..180
    let x = 10, y = 10, w = 180, h = 180;
    const rects: { x: number; y: number; w: number; h: number; label: string; color: string }[] = [];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

    for (let i = 1; i <= n; i++) {
      const col = colors[(i - 1) % colors.length];
      if (i % 2 === 1) {
        // 竖切一半 (左半边涂色，右半边留存)
        rects.push({ x, y, w: w / 2, h, label: `1/${Math.pow(2, i)}`, color: col });
        x += w / 2;
        w /= 2;
      } else {
        // 横切一半 (上半边涂色，下半边留存)
        rects.push({ x, y, w, h: h / 2, label: `1/${Math.pow(2, i)}`, color: col });
        y += h / 2;
        h /= 2;
      }
    }

    return { rects, remaining: { x, y, w, h, label: `1/${Math.pow(2, n)}` } };
  };

  const { rects, remaining } = getSubdivisions(Math.min(termsCount, 7));

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <TrendingUp size={18} style={{ color: '#0284c7' }} />
          <span>等比数列求和与错位相减法</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${activeTab === 'double' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('double')}
          >
            🌾 翻倍数列与错位相减 (整数)
          </button>
          <button
            className={`${styles.controlBtn} ${activeTab === 'half' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('half')}
          >
            🟩 正方形折半拼图 (分数收敛)
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '640px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* 原理提示卡 */}
          <div style={{
            width: '100%',
            background: activeTab === 'double' ? '#eff6ff' : '#ecfdf5',
            padding: '12px 14px',
            borderRadius: '8px',
            borderLeft: `4px solid ${activeTab === 'double' ? '#2563eb' : '#10b981'}`,
            fontSize: '0.85rem',
            color: activeTab === 'double' ? '#1e40af' : '#065f46',
            lineHeight: 1.6
          }}>
            {activeTab === 'double' ? (
              <>
                <strong>【错位相减法神技】：</strong>
                <br />
                两边同乘公比 2，所有中间项往后错开一位。
                <br />
                <strong>2S - S = S = 最后一项的2倍 ({nextPower}) - 第一项 (1) = {doubleSum}！</strong>
              </>
            ) : (
              <>
                <strong>【正方形几何折半留白模型】：</strong>
                <br />
                一张整体为 1 的正方形，每次切走剩余的一半。
                <br />
                <strong>总切走面积 = 1 - 剩余空白 (1/{halfDenom}) = {halfSumNumerator}/{halfDenom}！</strong>
              </>
            )}
          </div>

          {activeTab === 'double' ? (
            /* 整数翻倍错位相减展台 */
            <div style={{
              marginTop: '16px',
              width: '100%',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '14px 16px',
              fontFamily: 'monospace'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '8px', fontFamily: 'sans-serif' }}>
                📜 错位相减上下相抵消：
              </div>

              <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                <span style={{ fontWeight: 800, color: '#2563eb' }}>2S</span> = {doubleTerms.slice(1).join(' + ')} + <strong style={{ color: '#dc2626' }}>{nextPower}</strong>
              </div>

              <div style={{ textAlign: 'center', color: '#ef4444', fontWeight: 900, fontSize: '0.85rem', margin: '4px 0' }}>
                － (上下相减)
              </div>

              <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                <span style={{ fontWeight: 800, color: '#0369a1' }}> 1S</span> = <strong style={{ color: '#dc2626' }}>1</strong> + {doubleTerms.slice(1).join(' + ')}
              </div>

              <div style={{ height: '2px', background: '#3b82f6', margin: '10px 0' }} />

              <div style={{
                padding: '10px 14px',
                background: '#ecfdf5',
                borderRadius: '8px',
                border: '1.5px solid #86efac',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#065f46', fontFamily: 'sans-serif', fontWeight: 700 }}>
                    中间项灰飞烟灭，只剩首尾：
                  </span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#15803d' }}>
                    S = {nextPower} - 1 = {doubleSum}
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontFamily: 'sans-serif' }}>
                  <span style={{ fontSize: '0.75rem', color: '#065f46' }}>项数 n</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#166534' }}>
                    {termsCount} 项
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 正方形折半几何面积展示 */
            <div style={{
              marginTop: '16px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <svg width="200" height="200" viewBox="0 0 200 200" style={{ border: '2px solid #334155', borderRadius: '8px', background: '#f8fafc' }}>
                {rects.map((r, i) => (
                  <g key={i}>
                    <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.color} fillOpacity="0.75" stroke="#ffffff" strokeWidth="1.5" />
                    {r.w > 20 && r.h > 14 && (
                      <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 3} textAnchor="middle" fontSize="9" fontWeight="800" fill="#ffffff">
                        {r.label}
                      </text>
                    )}
                  </g>
                ))}
                {/* 剩余留白 */}
                <rect x={remaining.x} y={remaining.y} width={remaining.w} height={remaining.h} fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
              </svg>

              <div style={{
                marginTop: '12px',
                width: '100%',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                padding: '10px 14px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700 }}>总和公式计算：</span>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#047857' }}>
                    1 - 1/{halfDenom} = {halfSumNumerator}/{halfDenom}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>剩余空白</span>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ef4444' }}>
                    1 / {halfDenom}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 控制项数滑块 */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            background: '#ffffff',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, color: '#334155' }}>
              <span>调整数列项数 (前 n 项)：</span>
              <span style={{ color: '#2563eb' }}>n = {termsCount} 项</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              value={termsCount}
              onChange={(e) => setTermsCount(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

