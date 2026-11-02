'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Grid, Sparkles, CheckCircle2, RefreshCw, HelpCircle, Layers } from 'lucide-react';

interface ShapeDef {
  name: string;
  points: { x: number; y: number }[];
  i: number; // 内部点数
  b: number; // 边上点数
  desc: string;
}

export default function PickTheoremLab() {
  const shapes: ShapeDef[] = [
    {
      name: '经典斜角三角形',
      points: [{ x: 1, y: 1 }, { x: 5, y: 2 }, { x: 2, y: 4 }],
      i: 5,
      b: 4,
      desc: '看似倾斜无从下手，数数钉子立刻秒杀！'
    },
    {
      name: '凹五边形 (回旋镖)',
      points: [{ x: 1, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 4 }, { x: 3, y: 2 }, { x: 1, y: 4 }],
      i: 4,
      b: 7,
      desc: '连凹多边形也 100% 完美适用！'
    },
    {
      name: '不规则大六边形',
      points: [{ x: 2, y: 1 }, { x: 5, y: 1 }, { x: 5, y: 3 }, { x: 4, y: 5 }, { x: 1, y: 4 }, { x: 1, y: 2 }],
      i: 8,
      b: 8,
      desc: '数清楚内部点与边界点，告别割补切碎！'
    }
  ];

  const [activeShapeIdx, setActiveShapeIdx] = useState<number>(0);
  const activeShape = shapes[activeShapeIdx];

  const gridStep = 45;
  const offsetX = 50;
  const offsetY = 40;

  // 皮克定理面积
  const pickArea = activeShape.i + activeShape.b / 2 - 1;

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
            padding: '10px 14px',
            borderRadius: '8px',
            borderLeft: '4px solid #10b981',
            fontSize: '0.875rem',
            color: '#065f46',
            lineHeight: 1.6
          }}>
            <strong>【皮克定理核心公式 (Pick&apos;s Theorem)】：</strong>
            <br />
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#047857' }}>
              面积 S = i (内部点) + b/2 (边上点一半) - 1
            </span>
            <br />
            钉子板上无论图形多么歪斜、凹凸多边形，<strong>只需数数钉子，一步心算出面积！</strong>
          </div>

          {/* 钉子板 SVG */}
          <div style={{ marginTop: '16px', width: '100%', maxWidth: '380px' }}>
            <svg viewBox="0 0 340 300" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              <defs>
                <pattern id="dotGrid" width={gridStep} height={gridStep} patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="2" fill="#cbd5e1" />
                </pattern>
              </defs>

              {/* 背景格线 */}
              {Array.from({ length: 7 }).map((_, r) => (
                <line
                  key={`h-${r}`}
                  x1={offsetX}
                  y1={offsetY + r * gridStep}
                  x2={offsetX + 5 * gridStep}
                  y2={offsetY + r * gridStep}
                  stroke="#f1f5f9"
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
                  stroke="#f1f5f9"
                  strokeWidth="1.5"
                />
              ))}

              {/* 多边形皮筋 */}
              <polygon
                points={activeShape.points.map(p => `${offsetX + p.x * gridStep},${offsetY + p.y * gridStep}`).join(' ')}
                fill="#3b82f6"
                fillOpacity="0.25"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* 网格上的钉子阵列 */}
              {Array.from({ length: 6 }).map((_, r) => (
                Array.from({ length: 6 }).map((_, c) => {
                  const px = offsetX + c * gridStep;
                  const py = offsetY + r * gridStep;
                  return (
                    <circle key={`${r}-${c}`} cx={px} cy={py} r="3" fill="#94a3b8" />
                  );
                })
              ))}

              {/* 顶点大白点 */}
              {activeShape.points.map((p, idx) => (
                <circle
                  key={idx}
                  cx={offsetX + p.x * gridStep}
                  cy={offsetY + p.y * gridStep}
                  r="5"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>

          {/* 实时计数账本仪表盘 */}
          <div style={{
            marginTop: '12px',
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
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>皮筋正好穿过的钉子</div>
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

