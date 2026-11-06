'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Layers, Sparkles, CheckCircle2, Sliders, Eye } from 'lucide-react';

export default function CavalieriZuGengLab() {
  const [modelType, setModelType] = useState<'cards' | 'triangle'>('cards');
  const [shearOffset, setShearOffset] = useState<number>(50); // 倾斜偏移量 (0 ~ 90px)
  const [triApexX, setTriApexX] = useState<number>(140); // 三角形顶点 x 坐标 (40 ~ 240)

  const cardCount = 18;
  const cardWidth = 100;
  const cardHeight = 6;
  const totalH = cardCount * cardHeight; // 108px

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Layers size={18} style={{ color: '#7c3aed' }} />
          <span>祖暅原理与等积变形：高同截面等则积必同</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${modelType === 'cards' ? styles.controlBtnActive : ''}`}
            onClick={() => setModelType('cards')}
          >
            🎴 扑克牌推斜切片模型 (三维柱体)
          </button>
          <button
            className={`${styles.controlBtn} ${modelType === 'triangle' ? styles.controlBtnActive : ''}`}
            onClick={() => setModelType('triangle')}
          >
            📐 平行线顶点滑动模型 (二维面积)
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
          {/* 千古名言导读卡 */}
          <div style={{
            width: '100%',
            background: '#faf5ff',
            padding: '12px 14px',
            borderRadius: '8px',
            borderLeft: '4px solid #7c3aed',
            fontSize: '0.85rem',
            color: '#581c87',
            lineHeight: 1.6
          }}>
            <strong>【祖暅原理八字神谕】：</strong>
            <br />
            <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#6b21a8' }}>
              “缘幂势既同，则积不容异。”
            </span>
            <br />
            “幂”为横截面积，“势”为高度。
            只要高相同、在任一相同高度处水平切开的截面积相等，<strong>总体积必定 100% 严格恒等！</strong>
          </div>

          {/* 交互动态 SVG 画布 */}
          <div style={{ marginTop: '16px', width: '100%', maxWidth: '420px' }}>
            <svg viewBox="0 0 400 200" style={{ width: '100%', height: 'auto', overflow: 'visible', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              {modelType === 'cards' ? (
                /* 扑克牌切片推斜渲染 */
                <g>
                  {/* 上下平行支撑线 */}
                  <line x1="20" y1="40" x2="380" y2="40" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
                  <line x1="20" y1="148" x2="380" y2="148" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />

                  <text x="385" y="44" fontSize="9" fill="#64748b">顶高平面</text>
                  <text x="385" y="152" fontSize="9" fill="#64748b">底高平面</text>

                  {/* 18 层扑克牌切片 (从下往上堆叠) */}
                  {Array.from({ length: cardCount }).map((_, i) => {
                    const ratio = (cardCount - 1 - i) / (cardCount - 1); // 0 (底) ~ 1 (顶)
                    const curX = 120 + ratio * shearOffset;
                    const curY = 40 + i * cardHeight;

                    return (
                      <g key={i}>
                        <rect
                          x={curX}
                          y={curY}
                          width={cardWidth}
                          height={cardHeight - 0.8}
                          rx="1"
                          fill="#3b82f6"
                          fillOpacity={0.75 + (i / cardCount) * 0.25}
                          stroke="#1d4ed8"
                          strokeWidth="0.8"
                        />
                      </g>
                    );
                  })}

                  {/* 中间某一层的水平截面扫描探测线 */}
                  <line x1="60" y1="94" x2="340" y2="94" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx={120 + 0.5 * shearOffset} cy="94" r="3" fill="#ef4444" />
                  <circle cx={120 + 0.5 * shearOffset + cardWidth} cy="94" r="3" fill="#ef4444" />
                  <text x="170 + 0.5 * shearOffset" y="88" textAnchor="middle" fontSize="9" fontWeight="800" fill="#dc2626">
                    任意截面宽恒为 {cardWidth}px (截面等)
                  </text>

                  {/* 高度标尺 */}
                  <line x1="70" y1="40" x2="70" y2="148" stroke="#7c3aed" strokeWidth="2" />
                  <text x="60" y="98" textAnchor="middle" fontSize="10" fontWeight="800" fill="#7c3aed">
                    高 h={totalH}px
                  </text>
                </g>
              ) : (
                /* 平行线三角形顶点滑动渲染 */
                <g>
                  {/* 两条水平平行线 */}
                  <line x1="30" y1="45" x2="370" y2="45" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="5 3" />
                  <line x1="30" y1="155" x2="370" y2="155" stroke="#2563eb" strokeWidth="2" />

                  <text x="375" y="49" fontSize="9" fill="#2563eb">L₁ 平行线</text>
                  <text x="375" y="159" fontSize="9" fill="#2563eb">L₂ 底边线</text>

                  {/* 三角形渲染 */}
                  <polygon
                    points={`${triApexX},45 100,155 240,155`}
                    fill="#10b981"
                    fillOpacity="0.35"
                    stroke="#059669"
                    strokeWidth="2.5"
                  />

                  {/* 底边底线高亮 */}
                  <line x1="100" y1="155" x2="240" y2="155" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
                  <text x="170" y="172" textAnchor="middle" fontSize="10" fontWeight="800" fill="#047857">
                    固定底边 a = 140px
                  </text>

                  {/* 动点顶点 Apex */}
                  <circle cx={triApexX} cy="45" r="6" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                  <text x={triApexX} y="34" textAnchor="middle" fontSize="10" fontWeight="900" fill="#ea580c">
                    顶点 A (随意滑动)
                  </text>

                  {/* 垂高辅助线 */}
                  <line x1={triApexX} y1="45" x2={triApexX} y2="155" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 2" />
                  <text x={triApexX + 12} y="100" fontSize="9" fontWeight="700" fill="#64748b">
                    h=110
                  </text>

                  {/* 面积不变徽章 */}
                  <g transform="translate(170, 115)">
                    <rect x="-45" y="-12" width="90" height="24" rx="4" fill="#059669" />
                    <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ffffff">
                      面积 S = 7700 恒等
                    </text>
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* 实时参数仪表盘 */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}>
            <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '8px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>横截面积 (幂)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d4ed8', marginTop: '2px' }}>
                完全等长
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>每层切片长宽一致</div>
            </div>

            <div style={{ background: '#faf5ff', padding: '10px', borderRadius: '8px', border: '1px solid #e9d5ff', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b21a8' }}>立体高度 (势)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#7c3aed', marginTop: '2px' }}>
                严密等高
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>垂直距离丝毫未变</div>
            </div>

            <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '8px', border: '1.5px solid #86efac', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46' }}>总体积 (积)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#16a34a', marginTop: '2px' }}>
                绝对守恒！
              </div>
              <div style={{ fontSize: '0.65rem', color: '#15803d', fontWeight: 700 }}>积不容异</div>
            </div>
          </div>

          {/* 交互滑块控制区 */}
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
            {modelType === 'cards' ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  <span>手动推斜扑克牌倾斜度：</span>
                  <span style={{ color: '#2563eb' }}>
                    {shearOffset === 0 ? '直长方体 (0px)' : `推斜偏移 ${shearOffset}px`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="2"
                  value={shearOffset}
                  onChange={(e) => setShearOffset(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
                />
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  <span>左右拖动顶点 A (平行线内滑动)：</span>
                  <span style={{ color: '#059669' }}>坐标 x = {triApexX}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="290"
                  step="5"
                  value={triApexX}
                  onChange={(e) => setTriApexX(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

