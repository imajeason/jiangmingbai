'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Compass, Sparkles, CheckCircle2, ArrowRight, Lightbulb, RefreshCw } from 'lucide-react';

export default function KiteGeometryLab() {
  // 凸四边形四个顶点坐标 (可调或预设)
  // A(顶部), B(右侧), C(底部), D(左侧)
  // 对角线交点 O
  const [shapePreset, setShapePreset] = useState<'standard' | 'kite' | 'skew'>('standard');

  // 预设坐标
  const presets = {
    standard: {
      A: { x: 180, y: 30 },
      B: { x: 320, y: 130 },
      C: { x: 220, y: 250 },
      D: { x: 60, y: 150 },
      s1: 15, s2: 25, s3: 35, s4: 21, // 比例满足 15*35 = 525, 25*21 = 525
      ao: 3, co: 5 // 线段比 3:5
    },
    kite: {
      A: { x: 190, y: 25 },
      B: { x: 310, y: 120 },
      C: { x: 190, y: 260 },
      D: { x: 70, y: 120 },
      s1: 18, s2: 30, s3: 30, s4: 18, // 对称风筝: 18*30 = 540, 30*18 = 540
      ao: 3, co: 5
    },
    skew: {
      A: { x: 130, y: 35 },
      B: { x: 330, y: 90 },
      C: { x: 260, y: 255 },
      D: { x: 50, y: 180 },
      s1: 12, s2: 20, s3: 40, s4: 24, // 12*40 = 480, 20*24 = 480
      ao: 2, co: 4
    }
  };

  const cur = presets[shapePreset];
  const prod1 = cur.s1 * cur.s3;
  const prod2 = cur.s2 * cur.s4;

  // 交点 O 计算
  const Ox = 190;
  const Oy = 140;

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Compass size={18} style={{ color: '#0891b2' }} />
          <span>几何核心模型：共边定理与风筝模型（对角线面积比）</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${shapePreset === 'standard' ? styles.controlBtnActive : ''}`}
            onClick={() => setShapePreset('standard')}
          >
            一般凸四边形
          </button>
          <button
            className={`${styles.controlBtn} ${shapePreset === 'kite' ? styles.controlBtnActive : ''}`}
            onClick={() => setShapePreset('kite')}
          >
            对称风筝形
          </button>
          <button
            className={`${styles.controlBtn} ${shapePreset === 'skew' ? styles.controlBtnActive : ''}`}
            onClick={() => setShapePreset('skew')}
          >
            倾斜不规则形
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
          {/* 公式卡 */}
          <div style={{
            width: '100%',
            background: '#ecfeff',
            padding: '10px 14px',
            borderRadius: '8px',
            borderLeft: '4px solid #06b6d4',
            fontSize: '0.875rem',
            color: '#0e7490',
            lineHeight: 1.6
          }}>
            <strong>【四边形两大绝杀定理】：</strong>
            <br />
            • <strong>定理 1（对顶乘积定理）</strong>：S₁ × S₃ = S₂ × S₄（对顶两对三角形乘积绝对相等！）
            <br />
            • <strong>定理 2（风筝共边定理）</strong>：S_△ABD : S_△CBD = AO : CO（对角线分段比等于左右面积比！）
          </div>

          {/* SVG 四边形 */}
          <div style={{ marginTop: '16px', width: '100%', maxWidth: '420px' }}>
            <svg viewBox="0 0 380 290" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              {/* 四个小三角形面 */}
              {/* S1: △AOB (蓝) */}
              <polygon points={`${cur.A.x},${cur.A.y} ${cur.B.x},${cur.B.y} ${Ox},${Oy}`} fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5" />
              {/* S2: △BOC (黄) */}
              <polygon points={`${cur.B.x},${cur.B.y} ${cur.C.x},${cur.C.y} ${Ox},${Oy}`} fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
              {/* S3: △COD (绿) */}
              <polygon points={`${cur.C.x},${cur.C.y} ${cur.D.x},${cur.D.y} ${Ox},${Oy}`} fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5" />
              {/* S4: △DOA (粉) */}
              <polygon points={`${cur.D.x},${cur.D.y} ${cur.A.x},${cur.A.y} ${Ox},${Oy}`} fill="#fbcfe8" stroke="#db2777" strokeWidth="1.5" />

              {/* 对角线虚线 */}
              <line x1={cur.A.x} y1={cur.A.y} x2={cur.C.x} y2={cur.C.y} stroke="#0f172a" strokeWidth="2" strokeDasharray="4,3" />
              <line x1={cur.B.x} y1={cur.B.y} x2={cur.D.x} y2={cur.D.y} stroke="#0f172a" strokeWidth="2" strokeDasharray="4,3" />

              {/* 顶点标签 */}
              <text x={cur.A.x} y={cur.A.y - 8} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0f172a">A</text>
              <text x={cur.B.x + 10} y={cur.B.y + 4} fontSize="13" fontWeight="bold" fill="#0f172a">B</text>
              <text x={cur.C.x} y={cur.C.y + 16} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0f172a">C</text>
              <text x={cur.D.x - 14} y={cur.D.y + 4} fontSize="13" fontWeight="bold" fill="#0f172a">D</text>
              <text x={Ox + 6} y={Oy - 6} fontSize="12" fontWeight="bold" fill="#dc2626">O</text>

              {/* 面积数字 */}
              <text x={(cur.A.x + cur.B.x + Ox) / 3} y={(cur.A.y + cur.B.y + Oy) / 3 + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e40af">
                S₁ = {cur.s1}
              </text>
              <text x={(cur.B.x + cur.C.x + Ox) / 3 + 4} y={(cur.B.y + cur.C.y + Oy) / 3 + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#854d0e">
                S₂ = {cur.s2}
              </text>
              <text x={(cur.C.x + cur.D.x + Ox) / 3} y={(cur.C.y + cur.D.y + Oy) / 3 + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#166534">
                S₃ = {cur.s3}
              </text>
              <text x={(cur.D.x + cur.A.x + Ox) / 3 - 4} y={(cur.D.y + cur.A.y + Oy) / 3 + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#9d174d">
                S₄ = {cur.s4}
              </text>
            </svg>
          </div>

          {/* 实时定理验证面板 */}
          <div style={{
            marginTop: '12px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '10px'
          }}>
            <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '8px', border: '1px solid #86efac' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#15803d' }}>对顶乘积验证 (S₁ × S₃)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#166534', marginTop: '2px' }}>
                {cur.s1} × {cur.s3} = {prod1}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>对角三角形 1 与 3 之积</div>
            </div>

            <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '8px', border: '1px solid #86efac' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#15803d' }}>另一组对顶验证 (S₂ × S₄)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#166534', marginTop: '2px' }}>
                {cur.s2} × {cur.s4} = {prod2}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
                {prod1 === prod2 ? '🎉 严格相等 (分毫不差)！' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

