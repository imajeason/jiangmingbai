'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type SwallowtailMode = 'proof' | 'triple' | 'challenge';

interface PresetCase {
  label: string;
  ratioBD: number;
  ratioDC: number;
  areaLeft: number;
}

const PRESETS: PresetCase[] = [
  { label: '底边比 2 : 3 (经典燕尾)', ratioBD: 2, ratioDC: 3, areaLeft: 12 },
  { label: '底边中点 1 : 1 (对称燕尾)', ratioBD: 1, ratioDC: 1, areaLeft: 15 },
  { label: '底边比 1 : 2 (黄金三等分)', ratioBD: 1, ratioDC: 2, areaLeft: 10 },
  { label: '底边比 3 : 4 (培优拓展)', ratioBD: 3, ratioDC: 4, areaLeft: 18 },
];

export default function SwallowtailModelLab() {
  const [mode, setMode] = useState<SwallowtailMode>('proof');
  const [proofStep, setProofStep] = useState<number>(3); // 0: 原图, 1: 大三角形等高, 2: 下方小三角形等高, 3: 大减小得出两翼

  // 交互控制参数
  const [ratioBD, setRatioBD] = useState<number>(2);
  const [ratioDC, setRatioDC] = useState<number>(3);
  const [heightOPercent, setHeightOPercent] = useState<number>(45); // O点在AD线段上的高度百分比 (从D往A)

  // 经典挑战题状态
  const [chalAns, setChalAns] = useState<number | null>(null);
  const [chalSubmitted, setChalSubmitted] = useState<boolean>(false);

  // 三角形固定顶点坐标 (宽 520, 高 320)
  const A = { x: 260, y: 35 };
  const B = { x: 50, y: 285 };
  const C = { x: 470, y: 285 };

  // D 点根据 BD : DC 在 BC 边上线分
  const tD = ratioBD / (ratioBD + ratioDC);
  const D = {
    x: B.x + (C.x - B.x) * tD,
    y: B.y + (C.y - B.y) * tD,
  };

  // O 点在 AD 线段上，比例为 heightOPercent / 100
  const tO = heightOPercent / 100;
  const O = {
    x: D.x + (A.x - D.x) * tO,
    y: D.y + (A.y - D.y) * tO,
  };

  // 计算面积 (Shoelace 算法)
  const calcArea = (p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }) => {
    return Math.abs((p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2);
  };

  const scale = 1 / 400; // 虚拟面积缩放比，让读数亲切
  const totalArea = Math.round(calcArea(A, B, C) * scale);
  const sABD = Math.round(calcArea(A, B, D) * scale);
  const sACD = Math.round(calcArea(A, C, D) * scale);
  const sOBD = Math.round(calcArea(O, B, D) * scale);
  const sOCD = Math.round(calcArea(O, C, D) * scale);
  const sABO = Math.round(calcArea(A, B, O) * scale);
  const sACO = Math.round(calcArea(A, C, O) * scale);
  const sBCO = Math.round(calcArea(B, C, O) * scale);

  return (
    <div className={styles.labContainer}>
      {/* 顶部模式切换 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <button
          className={`${styles.stepButton} ${mode === 'proof' ? styles.active : ''}`}
          onClick={() => setMode('proof')}
        >
          🦅 燕尾定理解剖（分步证明）
        </button>
        <button
          className={`${styles.stepButton} ${mode === 'triple' ? styles.active : ''}`}
          onClick={() => setMode('triple')}
        >
          🔄 三翼联动（奔驰线段比）
        </button>
        <button
          className={`${styles.stepButton} ${mode === 'challenge' ? styles.active : ''}`}
          onClick={() => {
            setMode('challenge');
            setChalSubmitted(false);
            setChalAns(null);
          }}
        >
          🎯 小升初燕尾靶场
        </button>
      </div>

      {/* 启发说明条 */}
      <div style={{ background: '#f0f9ff', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #0284c7', marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, color: '#0369a1', fontSize: '0.95rem' }}>
          💡 燕尾模型核心口诀：“大等高，小等高；大减小，燕尾现；左翼比右翼，恒等底边比！”
        </div>
        <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
          从顶点 A 向底边引线穿过内心点 O，左右两只展开的“燕尾翅膀”（△ABO 与 △ACO）的面积之比，必定精确等于底边分出的线段比 BD : CD！
        </div>
      </div>

      {/* 动画舞台画布 */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
        <svg viewBox="0 0 520 320" style={{ width: '100%', maxWidth: '520px', height: 'auto', overflow: 'visible' }}>
          {/* 背景大三角形轮廓 */}
          <polygon
            points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
            fill="#f8fafc"
            stroke="#334155"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* 模式 1：证明模式色块高亮 */}
          {mode === 'proof' && (
            <>
              {/* 步骤 0：整幅燕尾全景 */}
              {proofStep === 0 && (
                <>
                  {/* 左翼 △ABO */}
                  <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${O.x},${O.y}`} fill="#38bdf8" fillOpacity="0.4" stroke="#0284c7" strokeWidth="2" />
                  {/* 右翼 △ACO */}
                  <polygon points={`${A.x},${A.y} ${C.x},${C.y} ${O.x},${O.y}`} fill="#f472b6" fillOpacity="0.4" stroke="#db2777" strokeWidth="2" />
                  {/* 底盘 △BCO */}
                  <polygon points={`${B.x},${B.y} ${C.x},${C.y} ${O.x},${O.y}`} fill="#fde047" fillOpacity="0.3" stroke="#ca8a04" strokeWidth="1.5" />
                </>
              )}

              {/* 步骤 1：大三角形以 A 为顶点等高 */}
              {proofStep === 1 && (
                <>
                  <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${D.x},${D.y}`} fill="#bae6fd" fillOpacity="0.6" stroke="#0284c7" strokeWidth="2" />
                  <polygon points={`${A.x},${A.y} ${C.x},${C.y} ${D.x},${D.y}`} fill="#fbcfe8" fillOpacity="0.6" stroke="#db2777" strokeWidth="2" />
                </>
              )}

              {/* 步骤 2：小三角形以 O 为顶点等高 */}
              {proofStep === 2 && (
                <>
                  <polygon points={`${O.x},${O.y} ${B.x},${B.y} ${D.x},${D.y}`} fill="#93c5fd" fillOpacity="0.7" stroke="#2563eb" strokeWidth="2" />
                  <polygon points={`${O.x},${O.y} ${C.x},${C.y} ${D.x},${D.y}`} fill="#f9a8d4" fillOpacity="0.7" stroke="#e11d48" strokeWidth="2" />
                </>
              )}

              {/* 步骤 3：大减小，完美呈现两只燕尾 */}
              {proofStep === 3 && (
                <>
                  {/* 左翼 △ABO */}
                  <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${O.x},${O.y}`} fill="#0284c7" fillOpacity="0.4" stroke="#0284c7" strokeWidth="2.5" />
                  {/* 右翼 △ACO */}
                  <polygon points={`${A.x},${A.y} ${C.x},${C.y} ${O.x},${O.y}`} fill="#ec4899" fillOpacity="0.4" stroke="#ec4899" strokeWidth="2.5" />
                  {/* 虚线连接底盘小三角形 */}
                  <polygon points={`${B.x},${B.y} ${C.x},${C.y} ${O.x},${O.y}`} fill="#f1f5f9" fillOpacity="0.6" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1.5" />
                </>
              )}
            </>
          )}

          {/* 模式 2：三翼模式 */}
          {mode === 'triple' && (
            <>
              <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${O.x},${O.y}`} fill="#38bdf8" fillOpacity="0.45" stroke="#0284c7" strokeWidth="2" />
              <polygon points={`${A.x},${A.y} ${C.x},${C.y} ${O.x},${O.y}`} fill="#f472b6" fillOpacity="0.45" stroke="#db2777" strokeWidth="2" />
              <polygon points={`${B.x},${B.y} ${C.x},${C.y} ${O.x},${O.y}`} fill="#34d399" fillOpacity="0.45" stroke="#059669" strokeWidth="2" />
            </>
          )}

          {/* 模式 3：挑战模式 */}
          {mode === 'challenge' && (
            <>
              <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${O.x},${O.y}`} fill="#38bdf8" fillOpacity="0.45" stroke="#0284c7" strokeWidth="2.5" />
              <polygon points={`${A.x},${A.y} ${C.x},${C.y} ${O.x},${O.y}`} fill="#f472b6" fillOpacity="0.45" stroke="#db2777" strokeWidth="2.5" />
              <polygon points={`${B.x},${B.y} ${C.x},${C.y} ${O.x},${O.y}`} fill="#f1f5f9" fillOpacity="0.5" stroke="#94a3b8" strokeDasharray="3 3" />
            </>
          )}

          {/* 辅助线：AD 贯穿线 */}
          <line x1={A.x} y1={A.y} x2={D.x} y2={D.y} stroke="#0f172a" strokeWidth="2" strokeDasharray={mode === 'proof' && proofStep === 3 ? '4 3' : 'none'} />

          {/* 顶点和分点射线 */}
          <line x1={B.x} y1={B.y} x2={O.x} y2={O.y} stroke="#0284c7" strokeWidth="2" />
          <line x1={C.x} y1={C.y} x2={O.x} y2={O.y} stroke="#db2777" strokeWidth="2" />

          {/* 顶点圆点与文字标注 */}
          <circle cx={A.x} cy={A.y} r="5" fill="#0f172a" />
          <text x={A.x} y={A.y - 10} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a">A</text>

          <circle cx={B.x} cy={B.y} r="5" fill="#0f172a" />
          <text x={B.x - 14} y={B.y + 6} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a">B</text>

          <circle cx={C.x} cy={C.y} r="5" fill="#0f172a" />
          <text x={C.x + 14} y={C.y + 6} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a">C</text>

          <circle cx={D.x} cy={D.y} r="5" fill="#ea580c" />
          <text x={D.x} y={D.y + 18} textAnchor="middle" fontSize="14" fontWeight="800" fill="#ea580c">D</text>

          <circle cx={O.x} cy={O.y} r="6" fill="#e11d48" />
          <text x={O.x + 14} y={O.y - 6} textAnchor="start" fontSize="14" fontWeight="900" fill="#e11d48">O</text>

          {/* 底边线段标注 */}
          <path d={`M ${B.x} ${B.y + 8} L ${D.x} ${D.y + 8}`} stroke="#2563eb" strokeWidth="3" />
          <text x={(B.x + D.x) / 2} y={B.y + 26} textAnchor="middle" fontSize="13" fontWeight="800" fill="#2563eb">
            BD ({ratioBD}份)
          </text>

          <path d={`M ${D.x} ${D.y + 8} L ${C.x} ${C.y + 8}`} stroke="#ec4899" strokeWidth="3" />
          <text x={(D.x + C.x) / 2} y={D.y + 26} textAnchor="middle" fontSize="13" fontWeight="800" fill="#ec4899">
            CD ({ratioDC}份)
          </text>

          {/* 燕尾两翼面积文字浮层 */}
          {(mode === 'proof' && proofStep === 3) || mode === 'triple' ? (
            <>
              {/* 左翼 S1 */}
              <rect x={(A.x + B.x + O.x) / 3 - 35} y={(A.y + B.y + O.y) / 3 - 14} width="70" height="26" rx="6" fill="#ffffff" fillOpacity="0.9" stroke="#0284c7" strokeWidth="1.5" />
              <text x={(A.x + B.x + O.x) / 3} y={(A.y + B.y + O.y) / 3 + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill="#0284c7">
                S₁ = {sABO}
              </text>

              {/* 右翼 S2 */}
              <rect x={(A.x + C.x + O.x) / 3 - 35} y={(A.y + C.y + O.y) / 3 - 14} width="70" height="26" rx="6" fill="#ffffff" fillOpacity="0.9" stroke="#db2777" strokeWidth="1.5" />
              <text x={(A.x + C.x + O.x) / 3} y={(A.y + C.y + O.y) / 3 + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill="#db2777">
                S₂ = {sACO}
              </text>
            </>
          ) : null}

          {/* 挑战题专属标注 */}
          {mode === 'challenge' && (
            <>
              <rect x={(A.x + B.x + O.x) / 3 - 40} y={(A.y + B.y + O.y) / 3 - 14} width="80" height="26" rx="6" fill="#ffffff" fillOpacity="0.95" stroke="#0284c7" strokeWidth="2" />
              <text x={(A.x + B.x + O.x) / 3} y={(A.y + B.y + O.y) / 3 + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill="#0284c7">
                左翼 = 14
              </text>

              <rect x={(A.x + C.x + O.x) / 3 - 40} y={(A.y + C.y + O.y) / 3 - 14} width="80" height="26" rx="6" fill="#ffffff" fillOpacity="0.95" stroke="#db2777" strokeWidth="2" />
              <text x={(A.x + C.x + O.x) / 3} y={(A.y + C.y + O.y) / 3 + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill="#db2777">
                右翼 = ?
              </text>
            </>
          )}
        </svg>

        {/* 算理与推导实时沉淀卡片 */}
        {mode === 'proof' && (
          <div style={{ marginTop: '14px', padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
            {proofStep === 0 && (
              <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                <strong>初始全景：</strong> 点 O 是三角形内部任意一点，连接 AO 并延长交底边于 D。
                左右两只对称展开的三角形 △ABO（左翼）与 △ACO（右翼）就像燕子的尾巴！
              </div>
            )}
            {proofStep === 1 && (
              <div style={{ fontSize: '0.9rem', color: '#0369a1' }}>
                <strong>第 1 步：大三角形共顶等高</strong><br />
                △ABD 与 △ACD 拥有共同的高（从 A 到底边 BC 的垂直距离），因此：<br />
                <span style={{ fontWeight: 800 }}>S(△ABD) : S(△ACD) = BD : CD = {ratioBD} : {ratioDC}</span>
              </div>
            )}
            {proofStep === 2 && (
              <div style={{ fontSize: '0.9rem', color: '#1e40af' }}>
                <strong>第 2 步：下方底座小三角形共顶等高</strong><br />
                △OBD 与 △OCD 拥有共同的高（从 O 到底边 BC 的垂直距离），因此：<br />
                <span style={{ fontWeight: 800 }}>S(△OBD) : S(△OCD) = BD : CD = {ratioBD} : {ratioDC}</span>
              </div>
            )}
            {proofStep === 3 && (
              <div>
                <div style={{ fontSize: '0.9rem', color: '#15803d', fontWeight: 800 }}>
                  🎉 第 3 步：大减小，燕尾模型完美诞生！
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px', lineHeight: 1.6 }}>
                  左翼：S(△ABO) = S(△ABD) - S(△OBD)<br />
                  右翼：S(△ACO) = S(△ACD) - S(△OCD)<br />
                  根据分数的等比差性质（(a - c) / (b - d) = a / b），立即得出燕尾黄金定理：<br />
                  <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#dc2626' }}>
                    S(△ABO) : S(△ACO) = BD : CD = {ratioBD} : {ratioDC}！
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'triple' && (
          <div style={{ marginTop: '14px', padding: '14px', background: '#fdf4ff', borderRadius: '10px', border: '1px solid #f0abfc', textAlign: 'left' }}>
            <div style={{ fontWeight: 800, color: '#a21caf', fontSize: '0.95rem' }}>
              🔄 三向燕尾联动定理：
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px', lineHeight: 1.6 }}>
              对三角形的任意一条边，燕尾定理都完全适用！<br />
              • 底边分段比：<strong style={{ color: '#0369a1' }}>BD : CD = S(△ABO) : S(△ACO)</strong><br />
              • 右边分段比：<strong style={{ color: '#be185d' }}>CE : AE = S(△BCO) : S(△ABO)</strong><br />
              • 左边分段比：<strong style={{ color: '#059669' }}>AF : BF = S(△ACO) : S(△BCO)</strong><br />
              掌握了燕尾模型，任何复杂的五边形割补与线段比，都能转化为三块面积之间的简单连比！
            </div>
          </div>
        )}

        {mode === 'challenge' && (
          <div style={{ marginTop: '14px', padding: '16px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
            <div style={{ fontWeight: 800, color: '#b45309', fontSize: '1rem', marginBottom: '8px' }}>
              📝 实战小升初：求右翼 △ACO 的面积
            </div>
            <div style={{ fontSize: '0.9rem', color: '#78350f', marginBottom: '14px' }}>
              已知：底边 BD : CD = 2 : 3，左翼 △ABO 面积为 14。根据燕尾定理，右翼 △ACO 面积是多少？
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {[18, 20, 21, 28].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setChalAns(opt);
                    setChalSubmitted(true);
                  }}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: chalAns === opt ? '2px solid #ea580c' : '1px solid #cbd5e1',
                    background: chalAns === opt ? '#ffedd5' : '#ffffff',
                    color: chalAns === opt ? '#c2410c' : '#1e293b',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {chalSubmitted && (
              <div style={{ marginTop: '12px', padding: '10px', borderRadius: '8px', background: chalAns === 21 ? '#dcfce7' : '#fee2e2', color: chalAns === 21 ? '#166534' : '#991b1b', fontWeight: 700 }}>
                {chalAns === 21
                  ? '🎉 太棒了！回答完全正确！左翼 : 右翼 = 2 : 3，右翼 = 14 ÷ 2 × 3 = 21！'
                  : '🤔 答案不正确哦。提示：S(左翼) / S(右翼) = BD / CD = 2 / 3，所以 14 / S(右翼) = 2 / 3！再试一次！'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 黄金近邻控制区 */}
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* 模式 1 的步骤流 */}
        {mode === 'proof' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>推导步骤：</span>
            <button
              className={`${styles.stepButton} ${proofStep === 0 ? styles.active : ''}`}
              onClick={() => setProofStep(0)}
            >
              ① 初始全景
            </button>
            <button
              className={`${styles.stepButton} ${proofStep === 1 ? styles.active : ''}`}
              onClick={() => setProofStep(1)}
            >
              ② 大三角形等高 (A点)
            </button>
            <button
              className={`${styles.stepButton} ${proofStep === 2 ? styles.active : ''}`}
              onClick={() => setProofStep(2)}
            >
              ③ 小三角形等高 (O点)
            </button>
            <button
              className={`${styles.stepButton} ${proofStep === 3 ? styles.active : ''}`}
              onClick={() => setProofStep(3)}
            >
              ④ 大减小呈现燕尾 ✨
            </button>
          </div>
        )}

        {/* 动态调控底边比例 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>调节底边线段比 (BD : CD)：</span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setRatioBD(p.ratioBD);
                setRatioDC(p.ratioDC);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: ratioBD === p.ratioBD && ratioDC === p.ratioDC ? '2px solid #0284c7' : '1px solid #cbd5e1',
                background: ratioBD === p.ratioBD && ratioDC === p.ratioDC ? '#e0f2fe' : '#ffffff',
                fontWeight: ratioBD === p.ratioBD && ratioDC === p.ratioDC ? 700 : 500,
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* O 点高度滑块 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>
            上下滑动内心点 O（改变翅膀厚度）：
          </span>
          <input
            type="range"
            min="20"
            max="80"
            value={heightOPercent}
            onChange={(e) => setHeightOPercent(Number(e.target.value))}
            style={{ width: '180px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
            {heightOPercent}% 高度
          </span>
        </div>
      </div>
    </div>
  );
}

