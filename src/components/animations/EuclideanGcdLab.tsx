'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Divide, Sparkles, CheckCircle2, RotateCcw, Layers } from 'lucide-react';

interface Step {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
}

export default function EuclideanGcdLab() {
  const presets = [
    { label: '377 与 319 (压轴质数29)', a: 377, b: 319 },
    { label: '494 与 133 (公因数19)', a: 494, b: 133 },
    { label: '1071 与 462 (千位数速解)', a: 1071, b: 462 },
    { label: '84 与 36 (入门基础题)', a: 84, b: 36 },
  ];

  const [presetIdx, setPresetIdx] = useState<number>(0);
  const [numA, setNumA] = useState<number>(377);
  const [numB, setNumB] = useState<number>(319);

  // 计算辗转相除法的所有步骤
  const computeSteps = (a: number, b: number): { steps: Step[]; gcd: number } => {
    let big = Math.max(a, b);
    let small = Math.min(a, b);
    const steps: Step[] = [];

    if (small === 0) return { steps: [], gcd: big };

    while (small > 0) {
      const quotient = Math.floor(big / small);
      const remainder = big % small;
      steps.push({ dividend: big, divisor: small, quotient, remainder });
      if (remainder === 0) break;
      big = small;
      small = remainder;
    }

    return { steps, gcd: small === 0 ? big : steps[steps.length - 1].divisor };
  };

  const { steps, gcd } = computeSteps(numA, numB);

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Divide size={18} style={{ color: '#0284c7' }} />
          <span>辗转相除法与欧几里得算法：最大公约数的几何裁剪</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {presets.map((p, idx) => (
            <button
              key={idx}
              className={`${styles.controlBtn} ${presetIdx === idx ? styles.controlBtnActive : ''}`}
              onClick={() => {
                setPresetIdx(idx);
                setNumA(p.a);
                setNumB(p.b);
              }}
            >
              {p.label}
            </button>
          ))}
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
          {/* 原理阐释卡 */}
          <div style={{
            width: '100%',
            background: '#f0f9ff',
            padding: '12px 14px',
            borderRadius: '8px',
            borderLeft: '4px solid #0284c7',
            fontSize: '0.85rem',
            color: '#075985',
            lineHeight: 1.6
          }}>
            <strong>【欧几里得辗转相除核心公理】：</strong>
            <br />
            <strong>gcd(a, b) = gcd(b, a mod b)</strong>
            <br />
            每次用“除数”除以“余数”，不断向内挤压。
            <strong>当余数恰好为 0 时，当前的除数就是最终的最大公约数！</strong>
          </div>

          {/* 实时计算结果横幅 */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#ecfdf5',
            padding: '12px 18px',
            borderRadius: '10px',
            border: '1.5px solid #86efac'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: 700 }}>求最大公约数目标：</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#166534' }}>
                gcd({numA}, {numB})
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 700 }}>最大公约数 (GCD)</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d' }}>
                {gcd}
              </div>
            </div>
          </div>

          {/* 连环相除过程展台 */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            background: '#fafaf9',
            border: '1px solid #e7e5e4',
            borderRadius: '8px',
            padding: '14px 16px'
          }}>
            <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#292524', marginBottom: '8px' }}>
              📜 连环相除步骤追踪：
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace' }}>
              {steps.map((st, i) => {
                const isFinal = st.remainder === 0;
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: isFinal ? '#dcfce7' : '#ffffff',
                      border: isFinal ? '1.5px solid #22c55e' : '1px solid #e2e8f0',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <span style={{ color: '#64748b', marginRight: '6px' }}>步骤 {i + 1}:</span>
                      <strong style={{ color: '#0f172a' }}>{st.dividend}</strong>
                      <span style={{ color: '#64748b' }}> ÷ </span>
                      <strong style={{ color: isFinal ? '#15803d' : '#2563eb' }}>{st.divisor}</strong>
                      <span style={{ color: '#64748b' }}> = </span>
                      <span style={{ color: '#b45309', fontWeight: 700 }}>{st.quotient}</span>
                      <span style={{ color: '#64748b' }}> ... 余 </span>
                      <strong style={{ color: isFinal ? '#16a34a' : '#dc2626' }}>{st.remainder}</strong>
                    </div>

                    {isFinal && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d', fontFamily: 'sans-serif' }}>
                        🎉 余数为0，锁定 GCD = {st.divisor}！
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 分数约分实战成果 */}
          <div style={{
            marginTop: '14px',
            width: '100%',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.825rem',
            color: '#334155',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>🎯 分数极速化简实战：</strong>
              <div style={{ marginTop: '2px', color: '#64748b' }}>
                分子分母同除以 {gcd}：
              </div>
            </div>

            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0369a1' }}>
              {numB} / {numA} = {(numB / gcd)} / {(numA / gcd)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

