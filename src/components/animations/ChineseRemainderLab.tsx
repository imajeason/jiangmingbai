'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Scroll, Sparkles, CheckCircle2, RotateCcw, Award } from 'lucide-react';

export default function ChineseRemainderLab() {
  const [r3, setR3] = useState<number>(2); // 除以 3 的余数 (0, 1, 2)
  const [r5, setR5] = useState<number>(3); // 除以 5 的余数 (0, 1, 2, 3, 4)
  const [r7, setR7] = useState<number>(2); // 除以 7 的余数 (0, 1, 2, 3, 4, 5, 6)

  // 经典题例预设
  const presets = [
    { label: '《孙子算经》原题 (余2, 3, 2)', r3: 2, r5: 3, r7: 2, desc: '最经典古题：三三数之剩二，五五数之剩三，七七数之剩二' },
    { label: '韩信点兵案例一 (余1, 2, 3)', r3: 1, r5: 2, r7: 3, desc: '兵营排阵：除3余1、除5余2、除7余3' },
    { label: '鬼谷算题案例 (余2, 1, 6)', r3: 2, r5: 1, r7: 6, desc: '高余数挑战：除3余2、除5余1、除7余6' },
  ];

  // 权重基数计算
  const term3 = 70 * r3;
  const term5 = 21 * r5;
  const term7 = 15 * r7;
  const rawSum = term3 + term5 + term7;

  // 模 105 得到最小正整数解
  let minAns = rawSum % 105;
  if (minAns === 0 && (r3 !== 0 || r5 !== 0 || r7 !== 0)) {
    minAns = 105;
  }

  // 验算结果
  const check3 = minAns % 3;
  const check5 = minAns % 5;
  const check7 = minAns % 7;

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Scroll size={18} style={{ color: '#0284c7' }} />
          <span>中国剩余定理：韩信点兵与孙子定理</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {presets.map((p, idx) => (
            <button
              key={idx}
              className={`${styles.controlBtn} ${r3 === p.r3 && r5 === p.r5 && r7 === p.r7 ? styles.controlBtnActive : ''}`}
              onClick={() => {
                setR3(p.r3);
                setR5(p.r5);
                setR7(p.r7);
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
          {/* 千古名篇歌诀卡 */}
          <div style={{
            width: '100%',
            background: '#f0f9ff',
            padding: '12px 14px',
            borderRadius: '8px',
            borderLeft: '4px solid #0284c7',
            fontSize: '0.85rem',
            color: '#075985',
            lineHeight: 1.7
          }}>
            <strong>【明代《算法统宗》神算歌诀】：</strong>
            <br />
            <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.95rem' }}>
              “三人同行七十稀，五树梅花廿一枝，七子团圆正半月，除百零五便得知。”
            </span>
            <br />
            每个基数都是针对单一除数特别构造的“独立钥匙”，互不干扰，直接相加！
          </div>

          {/* 三大独立余数控制器 */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px'
          }}>
            {/* 除以 3 控制 */}
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                除以 3 的余数 r₁
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2].map(v => (
                  <button
                    key={v}
                    style={{
                      flex: 1,
                      padding: '4px 0',
                      borderRadius: '4px',
                      border: r3 === v ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                      background: r3 === v ? '#e0f2fe' : '#ffffff',
                      color: r3 === v ? '#0369a1' : '#475569',
                      fontWeight: r3 === v ? 800 : 500,
                      cursor: 'pointer'
                    }}
                    onClick={() => setR3(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#0284c7', marginTop: '6px', fontWeight: 700 }}>
                配对：70 × {r3} = {term3}
              </div>
            </div>

            {/* 除以 5 控制 */}
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                除以 5 的余数 r₂
              </div>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[0, 1, 2, 3, 4].map(v => (
                  <button
                    key={v}
                    style={{
                      flex: 1,
                      padding: '4px 0',
                      borderRadius: '4px',
                      border: r5 === v ? '1.5px solid #059669' : '1px solid #cbd5e1',
                      background: r5 === v ? '#dcfce7' : '#ffffff',
                      color: r5 === v ? '#15803d' : '#475569',
                      fontWeight: r5 === v ? 800 : 500,
                      cursor: 'pointer'
                    }}
                    onClick={() => setR5(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#059669', marginTop: '6px', fontWeight: 700 }}>
                配对：21 × {r5} = {term5}
              </div>
            </div>

            {/* 除以 7 控制 */}
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                除以 7 的余数 r₃
              </div>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[0, 1, 2, 3, 4, 5, 6].map(v => (
                  <button
                    key={v}
                    style={{
                      flex: 1,
                      padding: '4px 0',
                      borderRadius: '4px',
                      border: r7 === v ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                      background: r7 === v ? '#f3e8ff' : '#ffffff',
                      color: r7 === v ? '#6b21a8' : '#475569',
                      fontWeight: r7 === v ? 800 : 500,
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                    onClick={() => setR7(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#7c3aed', marginTop: '6px', fontWeight: 700 }}>
                配对：15 × {r7} = {term7}
              </div>
            </div>
          </div>

          {/* 实时推导卡片 */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            background: '#faf5ff',
            border: '1px solid #e9d5ff',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#581c87' }}>
              🔢 代入孙子定理加权和式：
            </div>
            <div style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#334155',
              background: '#ffffff',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              总和 S = <span style={{ color: '#0284c7' }}>70 × {r3}</span> + <span style={{ color: '#059669' }}>21 × {r5}</span> + <span style={{ color: '#7c3aed' }}>15 × {r7}</span>
              <br />
              = {term3} + {term5} + {term7} = <span style={{ color: '#b45309' }}>{rawSum}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '4px',
              background: '#ecfdf5',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1.5px solid #86efac'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 700 }}>
                  减去 105 的整倍数（除百零五）
                </div>
                <div style={{ fontSize: '0.8rem', color: '#047857' }}>
                  {rawSum} ÷ 105 = {Math.floor(rawSum / 105)} ... <strong>{minAns}</strong>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 700 }}>最小正整数解 N</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#15803d' }}>
                  {minAns}
                </div>
              </div>
            </div>
          </div>

          {/* 验算确认栏 */}
          <div style={{
            marginTop: '14px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}>
            <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.75rem' }}>
              <div style={{ color: '#64748b' }}>除以 3 验算</div>
              <div style={{ fontWeight: 800, color: check3 === r3 ? '#16a34a' : '#dc2626', marginTop: '2px' }}>
                {minAns} = 3 × {Math.floor(minAns / 3)} + {check3} {check3 === r3 ? '✅' : '❌'}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.75rem' }}>
              <div style={{ color: '#64748b' }}>除以 5 验算</div>
              <div style={{ fontWeight: 800, color: check5 === r5 ? '#16a34a' : '#dc2626', marginTop: '2px' }}>
                {minAns} = 5 × {Math.floor(minAns / 5)} + {check5} {check5 === r5 ? '✅' : '❌'}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.75rem' }}>
              <div style={{ color: '#64748b' }}>除以 7 验算</div>
              <div style={{ fontWeight: 800, color: check7 === r7 ? '#16a34a' : '#dc2626', marginTop: '2px' }}>
                {minAns} = 7 × {Math.floor(minAns / 7)} + {check7} {check7 === r7 ? '✅' : '❌'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

