'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Grid, Sparkles, CheckCircle2 } from 'lucide-react';

interface ShapeDef {
  name: string;
  points: { x: number; y: number }[];
  boundaryPoints: { x: number; y: number }[];
  interiorPoints: { x: number; y: number }[];
  i: number; // 内部点数
  b: number; // 边上点数
  desc: string;
}

export default function PickTheoremLab() {
  const shapes: ShapeDef[] = [
    {
      name: '经典倾斜三角形',
      points: [{ x: 1, y: 4 }, { x: 5, y: 3 }, { x: 3, y: 0 }],
      boundaryPoints: [
        { x: 1, y: 4 }, { x: 5, y: 3 }, { x: 3, y: 0 }, { x: 2, y: 2 }
      ],
      interiorPoints: [
        { x: 2, y: 3 },
        { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 3, y: 1 },
        { x: 4, y: 3 }, { x: 4, y: 2 }
      ],
      i: 6,
      b: 4,
      desc: '经典倾斜三角形：内部 6 个钉子，边上 4 个钉子，面积 6 + 4/2 - 1 = 7！'
    },
    {
      name: '尖顶小房子 (凸五边形)',
      points: [{ x: 1, y: 4 }, { x: 5, y: 4 }, { x: 5, y: 2 }, { x: 3, y: 0 }, { x: 1, y: 2 }],
      boundaryPoints: [
        { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 },
        { x: 5, y: 3 }, { x: 5, y: 2 },
        { x: 4, y: 1 }, { x: 3, y: 0 },
        { x: 2, y: 1 }, { x: 1, y: 2 },
        { x: 1, y: 3 }
      ],
      interiorPoints: [
        { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
        { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
        { x: 3, y: 1 }
      ],
      i: 7,
      b: 12,
      desc: '凸多边形房子：边上 12 个钉子，肚子藏 7 个钉子，面积恰好 12！'
    },
    {
      name: '凹多边形 (回旋镖)',
      points: [{ x: 1, y: 4 }, { x: 5, y: 4 }, { x: 3, y: 3 }, { x: 1, y: 1 }],
      boundaryPoints: [
        { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 },
        { x: 3, y: 3 },
        { x: 2, y: 2 },
        { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }
      ],
      interiorPoints: [
        { x: 2, y: 3 }
      ],
      i: 1,
      b: 10,
      desc: '凹多边形：无论图形多么凹陷扭曲，皮克定理依然 100% 成立！'
    }
  ];

  const [activeShapeIdx, setActiveShapeIdx] = useState<number>(0);
  const activeShape = shapes[activeShapeIdx];

  const gridStep = 45;
  const offsetX = 50;
  const offsetY = 40;

  // 皮克定理面积: S = i + b/2 - 1
  const pickArea = activeShape.i + activeShape.b / 2 - 1;

  // 判定点属性
  const isBoundary = (x: number, y: number) =>
    activeShape.boundaryPoints.some(p => p.x === x && p.y === y);

  const isInterior = (x: number, y: number) =>
    activeShape.interiorPoints.some(p => p.x === x && p.y === y);

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Grid size={18} style={{ color: '#059669' }} />
          <span>格点与面积：皮克定理（钉子板上的面积密码）</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {shapes.map((s, idx) => (
            <button
              key={idx}
              className={`${styles.controlBtn} ${activeShapeIdx === idx ? styles.controlBtnActive : ''}`}
              onClick={() => setActiveShapeIdx(idx)}
            >
              {s.name}
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
          {/* 公式卡 */}
          <div style={{
            width: '100%',
            background: '#ecfdf5',
            padding: '12px 14px',
            borderRadius: '8px',
            borderLeft: '4px solid #10b981',
            fontSize: '0.875rem',
            color: '#065f46',
            lineHeight: 1.6
          }}>
            <strong>【皮克定理核心公式 (Pick&apos;s Theorem)】：</strong>
            <br />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#047857' }}>
              面积 S = i (内部点) + b / 2 (边上点一半) - 1
            </span>
            <div style={{ marginTop: '4px', fontSize: '0.825rem', color: '#047857' }}>
              {activeShape.desc}
            </div>
          </div>

          {/* 钉子板 SVG */}
          <div style={{ marginTop: '16px', width: '100%', maxWidth: '380px' }}>
            <svg viewBox="0 0 325 300" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              {/* 背景格线 6x6 */}
              {Array.from({ length: 6 }).map((_, r) => (
                <line
                  key={`h-${r}`}
                  x1={offsetX}
                  y1={offsetY + r * gridStep}
                  x2={offsetX + 5 * gridStep}
                  y2={offsetY + r * gridStep}
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                />
              ))}
              {Array.from({ length: 6 }).map((_, c) => (
                <line
                  key={`v-${c}`}
                  x1={offsetX + c * gridStep}
                  y1={offsetY}
                  x2={offsetX + c * gridStep}
                  y2={offsetY + 5 * gridStep}
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                />
              ))}

              {/* 多边形皮筋填充与边缘 */}
              <polygon
                points={activeShape.points.map(p => `${offsetX + p.x * gridStep},${offsetY + p.y * gridStep}`).join(' ')}
                fill="#3b82f6"
                fillOpacity="0.18"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* 网格上的钉子阵列 (精确按内部/边界/外部区分颜色) */}
              {Array.from({ length: 6 }).map((_, r) => (
                Array.from({ length: 6 }).map((_, c) => {
                  const px = offsetX + c * gridStep;
                  const py = offsetY + r * gridStep;
                  const onB = isBoundary(c, r);
                  const inI = isInterior(c, r);

                  if (inI) {
                    return (
                      <g key={`${r}-${c}`}>
                        <circle cx={px} cy={py} r="7" fill="#3b82f6" fillOpacity="0.25" />
                        <circle cx={px} cy={py} r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                      </g>
                    );
                  }
                  if (onB) {
                    return (
                      <g key={`${r}-${c}`}>
                        <circle cx={px} cy={py} r="7" fill="#f59e0b" fillOpacity="0.25" />
                        <circle cx={px} cy={py} r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                      </g>
                    );
                  }
                  return (
                    <circle key={`${r}-${c}`} cx={px} cy={py} r="2.5" fill="#cbd5e1" />
                  );
                })
              ))}
            </svg>
          </div>

          {/* 图例 */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.8rem', color: '#64748b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
              <span>内部点 (i = {activeShape.i})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
              <span>边界点 (b = {activeShape.b})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1', display: 'inline-block' }} />
              <span>外部点</span>
            </div>
          </div>

          {/* 实时计数账本仪表盘 */}
          <div style={{
            marginTop: '14px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px'
          }}>
            <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '8px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>内部格点数 i</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d4ed8', marginTop: '2px' }}>
                {activeShape.i} <span style={{ fontSize: '0.75rem' }}>个</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>肚子里完全包裹</div>
            </div>

            <div style={{ background: '#fffbeb', padding: '10px', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e' }}>边界格点数 b</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#b45309', marginTop: '2px' }}>
                {activeShape.b} <span style={{ fontSize: '0.75rem' }}>个</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>皮筋穿过的钉子</div>
            </div>

            <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '8px', border: '1.5px solid #86efac', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>计算得出面积 S</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#166534', marginTop: '2px' }}>
                {pickArea} <span style={{ fontSize: '0.75rem' }}>cm²</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 700 }}>
                {activeShape.i} + {activeShape.b}/2 - 1 = {pickArea}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
