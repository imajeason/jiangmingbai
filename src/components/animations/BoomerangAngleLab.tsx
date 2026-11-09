'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Compass, Sparkles, Wand2, Eye } from 'lucide-react';

export default function BoomerangAngleLab() {
  const [mode, setMode] = useState<'boomerang' | 'star'>('boomerang');
  // 飞镖顶点微调角度控制
  const [angleA, setAngleA] = useState<number>(36); // 顶角 A
  const [angleB, setAngleB] = useState<number>(44); // 左底角 B
  const [angleC, setAngleC] = useState<number>(40); // 右底角 C
  const [showAuxLine, setShowAuxLine] = useState<'none' | 'extension' | 'bottom'>('extension');

  // 计算大凹角 BDC = A + B + C
  const concaveAngleD = angleA + angleB + angleC;

  // 五角星演示步骤
  const [starStep, setStarStep] = useState<number>(1);

  // SVG 坐标计算 (以 400 x 300 画布为基准)
  // A 顶点在顶部 (200, 40)
  // B 在左下 (80, 240)
  // C 在右下 (320, 240)
  // 凹点 D 坐标根据角度微调 (大约在 200, 160 上下轻微变动)
  const ax = 200;
  const ay = 45;
  const bx = 80;
  const by = 245;
  const cx = 320;
  const cy = 245;

  // 凹点 D 坐标根据角度轻微偏移，保证视觉逼真
  const dx = 200;
  const dy = 165 - (concaveAngleD - 120) * 0.4;
  // 延长线交点 E 在底边 BC 延长处 (200, 245)
  const ex = 200;
  const ey = 245;

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass className={styles.icon} />
          <h2 className={styles.title}>飞镖模型与折角几何实验室</h2>
        </div>
        <p className={styles.description}>
          凹四边形大凹角 ∠BDC 永远等于三个尖角之和！一键开启辅助线透视外角定理，秒杀五角星 180° 角和。
        </p>
      </div>

      {/* 模式选择 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setMode('boomerang')}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: mode === 'boomerang' ? '#4f46e5' : '#f1f5f9',
            color: mode === 'boomerang' ? '#ffffff' : '#475569',
          }}
        >
          🎯 飞镖回旋镖模型（∠D = ∠A + ∠B + ∠C）
        </button>
        <button
          onClick={() => setMode('star')}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: mode === 'star' ? '#ea580c' : '#f1f5f9',
            color: mode === 'star' ? '#ffffff' : '#475569',
          }}
        >
          ⭐ 经典五角星 5 顶角和 = 180°
        </button>
      </div>

      {/* 主画布 */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {mode === 'boomerang' ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* SVG 飞镖画布 */}
            <svg width="400" height="280" viewBox="0 0 400 280" style={{ maxWidth: '100%' }}>
              <defs>
                <linearGradient id="boomerangGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* 飞镖主体凹四边形 A -> B -> D -> C -> A */}
              <polygon
                points={`${ax},${ay} ${bx},${by} ${dx},${dy} ${cx},${cy}`}
                fill="url(#boomerangGrad)"
                stroke="#4338ca"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* 辅助线 1：延长对角线 AD 穿过底边 */}
              {showAuxLine === 'extension' && (
                <>
                  <line x1={ax} y1={ay} x2={ex} y2={ey + 20} stroke="#dc2626" strokeWidth="2" strokeDasharray="5,4" />
                  <circle cx={ex} cy={ey} r="3" fill="#dc2626" />
                  <text x={ex + 8} y={ey + 15} fontSize="11" fill="#dc2626" fontWeight="bold">
                    E (延长交点)
                  </text>
                  <text x={dx - 45} y={dy + 30} fontSize="11" fill="#dc2626" fontWeight="bold">
                    ∠1 = ∠A₁ + ∠B
                  </text>
                  <text x={dx + 15} y={dy + 30} fontSize="11" fill="#dc2626" fontWeight="bold">
                    ∠2 = ∠A₂ + ∠C
                  </text>
                </>
              )}

              {/* 辅助线 2：连接底边 BC */}
              {showAuxLine === 'bottom' && (
                <line x1={bx} y1={by} x2={cx} y2={cy} stroke="#059669" strokeWidth="2" strokeDasharray="5,4" />
              )}

              {/* 顶点标记与角度文字 */}
              {/* 顶点 A */}
              <circle cx={ax} cy={ay} r="5" fill="#4f46e5" />
              <text x={ax} y={ay - 10} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#312e81">
                A ({angleA}°)
              </text>

              {/* 顶点 B */}
              <circle cx={bx} cy={by} r="5" fill="#4f46e5" />
              <text x={bx - 12} y={by + 16} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#312e81">
                B ({angleB}°)
              </text>

              {/* 顶点 C */}
              <circle cx={cx} cy={cy} r="5" fill="#4f46e5" />
              <text x={cx + 12} y={cy + 16} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#312e81">
                C ({angleC}°)
              </text>

              {/* 凹点 D */}
              <circle cx={dx} cy={dy} r="6" fill="#ea580c" />
              <text x={dx} y={dy - 12} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#c2410c">
                凹角 ∠BDC = {concaveAngleD}°
              </text>

              {/* 凹角内侧弧线 */}
              <path
                d={`M ${dx - 22} ${dy + 12} A 24 24 0 0 0 ${dx + 22} ${dy + 12}`}
                fill="none"
                stroke="#ea580c"
                strokeWidth="2.5"
              />
            </svg>

            {/* 辅助线切换器 */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>透视辅助线：</span>
              <button
                onClick={() => setShowAuxLine('extension')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: showAuxLine === 'extension' ? '#fee2e2' : '#ffffff',
                  color: showAuxLine === 'extension' ? '#dc2626' : '#475569',
                  border: '1px solid #cbd5e1',
                }}
              >
                延长对角线 AD（外角定理）
              </button>
              <button
                onClick={() => setShowAuxLine('bottom')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: showAuxLine === 'bottom' ? '#dcfce7' : '#ffffff',
                  color: showAuxLine === 'bottom' ? '#15803d' : '#475569',
                  border: '1px solid #cbd5e1',
                }}
              >
                连接底边 BC（大三角形法）
              </button>
              <button
                onClick={() => setShowAuxLine('none')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: showAuxLine === 'none' ? '#f1f5f9' : '#ffffff',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                }}
              >
                无辅助线
              </button>
            </div>
          </div>
        ) : (
          /* 五角星角和 180° 演示 */
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="340" height="280" viewBox="0 0 340 280">
              {/* 五角星连线 (A, B, C, D, E) */}
              {/* A(170, 30), C(290, 115), E(240, 240), B(100, 240), D(50, 115) */}
              <polygon
                points="170,30 240,240 50,115 290,115 100,240"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* 聚焦的底层小三角形（将所有角汇聚在此） */}
              {starStep === 2 && (
                <polygon points="170,165 125,200 215,200" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
              )}

              {/* 五个顶角标签 */}
              <circle cx="170" cy="30" r="5" fill="#ef4444" />
              <text x="170" y="20" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#dc2626">
                ∠A
              </text>

              <circle cx="100" cy="240" r="5" fill="#10b981" />
              <text x="90" y="258" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#059669">
                ∠B
              </text>

              <circle cx="290" cy="115" r="5" fill="#ef4444" />
              <text x="310" y="120" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#dc2626">
                ∠C
              </text>

              <circle cx="50" cy="115" r="5" fill="#10b981" />
              <text x="30" y="120" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#059669">
                ∠D
              </text>

              <circle cx="240" cy="240" r="5" fill="#8b5cf6" />
              <text x="250" y="258" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#6d28d9">
                ∠E
              </text>

              {/* 外角转移弧线标注 */}
              <text x="170" y="135" textAnchor="middle" fontSize="11" fill="#ea580c" fontWeight="bold">
                ∠1 = ∠A + ∠C
              </text>
              <text x="170" y="225" textAnchor="middle" fontSize="11" fill="#ea580c" fontWeight="bold">
                ∠2 = ∠B + ∠D
              </text>
            </svg>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={() => setStarStep(1)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: starStep === 1 ? '#4f46e5' : '#ffffff',
                  color: starStep === 1 ? '#ffffff' : '#475569',
                  border: '1px solid #cbd5e1',
                }}
              >
                ① 观察分散在各处的 5 个尖角
              </button>
              <button
                onClick={() => setStarStep(2)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: starStep === 2 ? '#ea580c' : '#ffffff',
                  color: starStep === 2 ? '#ffffff' : '#475569',
                  border: '1px solid #cbd5e1',
                }}
              >
                ② 利用外角定理汇聚到同一个三角形
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 动态算式面板 */}
      <div
        style={{
          marginTop: '16px',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #e2e8f0',
        }}
      >
        {mode === 'boomerang' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles color="#4f46e5" size={18} />
              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>飞镖公式实时验证：</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                background: '#f8fafc',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#4338ca' }}>
                ∠A ({angleA}°) + ∠B ({angleB}°) + ∠C ({angleC}°)
              </span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#ea580c' }}>
                = 凹角 ∠BDC ({concaveAngleD}°)
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles color="#ea580c" size={18} />
              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>五角星 5 顶角汇聚推导：</span>
            </div>
            <p style={{ margin: 0, color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
              由三角形外角定理：∠1 = ∠A + ∠C，∠2 = ∠B + ∠D。因此五个角之和正好等于小三角形三内角之和：
              <b> ∠A + ∠B + ∠C + ∠D + ∠E = ∠1 + ∠2 + ∠E = 180°！</b>
            </p>
          </div>
        )}
      </div>

      {/* 滑块微调 (飞镖模式下) */}
      {mode === 'boomerang' && (
        <div
          style={{
            marginTop: '16px',
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '12px 16px',
            border: '1px solid #e2e8f0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
          }}
        >
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>调整顶角 ∠A: {angleA}°</span>
            <input
              type="range"
              min="20"
              max="50"
              value={angleA}
              onChange={(e) => setAngleA(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>调整底角 ∠B: {angleB}°</span>
            <input
              type="range"
              min="25"
              max="55"
              value={angleB}
              onChange={(e) => setAngleB(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>调整底角 ∠C: {angleC}°</span>
            <input
              type="range"
              min="25"
              max="55"
              value={angleC}
              onChange={(e) => setAngleC(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

