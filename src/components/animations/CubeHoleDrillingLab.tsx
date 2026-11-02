'use client';

import React, { useState } from 'react';

type CutType = 'through_hole' | 'corner' | 'edge';

export default function CubeHoleDrillingLab() {
  const [cutType, setCutType] = useState<CutType>('through_hole');
  const [cubeSide, setCubeSide] = useState<number>(3); // 大正方体边长
  const [holeSide, setHoleSide] = useState<number>(1); // 小孔边长
  const [showFormula, setShowFormula] = useState<boolean>(false);

  const origArea = 6 * cubeSide * cubeSide;

  // Calculation of Delta S
  let deltaS = 0;
  let explanation = '';

  if (cutType === 'through_hole') {
    // Front and back lose holeSide^2 each (-2 * holeSide^2)
    // 4 inner tunnel walls added (+4 * holeSide * cubeSide)
    const lostArea = 2 * holeSide * holeSide;
    const gainedArea = 4 * holeSide * cubeSide;
    deltaS = gainedArea - lostArea;
    explanation = `前后两个开口各减少 ${holeSide}×${holeSide}=${holeSide * holeSide}cm² (共-${lostArea})；内部打通长隧道新露出 4 个长方形内壁 (+4×${holeSide}×${cubeSide}=+${gainedArea})。净增加 ${deltaS} cm²！`;
  } else if (cutType === 'corner') {
    // Corner cut: 3 faces removed, 3 identical inner faces revealed
    deltaS = 0;
    explanation = `顶点挖掉一个小角：虽然削掉了前、右、上 3 个小正方形面，但在凹陷内部正好露出了完全等大的 3 个新面！移多补少互相抵消，表面积完全不变（ΔS = 0）！`;
  } else {
    // Edge cut: 2 faces removed, 4 inner faces revealed
    deltaS = 2 * holeSide * holeSide;
    explanation = `棱中间挖去一块：削去了外侧 2 个小面，但内部露出了整整 4 个新面！净增加 4 - 2 = 2 个小面 (+${deltaS} cm²)。`;
  }

  const finalArea = origArea + deltaS;

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
          正方体打孔与挖洞：表面积“不减反增”的几何直觉
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          挖掉一部分体积变小了，表面积为什么反而可能暴增？看透露出的“内部隧道表面”！
        </p>
      </div>

      {/* 画布区域 */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '340px'
      }}>
        {/* SVG 立体透视图 */}
        <svg viewBox="0 0 320 260" style={{ width: '100%', maxWidth: '320px', overflow: 'visible' }}>
          {/* 大正方体正面 */}
          <rect x="70" y="80" width="130" height="130" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" />

          {/* 顶面 */}
          <polygon points="70,80 120,30 250,30 200,80" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />

          {/* 右侧面 */}
          <polygon points="200,80 250,30 250,160 200,210" fill="#7dd3fc" stroke="#0284c7" strokeWidth="2.5" />

          {cutType === 'through_hole' && (
            <g>
              {/* 正面方孔 */}
              <rect x="115" y="125" width="40" height="40" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
              {/* 隧道内壁透视阴影（发光黄色） */}
              <polygon points="115,125 150,90 190,90 155,125" fill="#fde047" opacity="0.85" />
              <polygon points="155,125 190,90 190,130 155,165" fill="#facc15" opacity="0.85" />
              <polygon points="115,165 150,130 190,130 155,165" fill="#eab308" opacity="0.85" />
              <text x="135" y="150" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="800">打通隧道</text>
              <text x="220" y="110" fill="#ca8a04" fontSize="11" fontWeight="800">+4个隧道内壁</text>
            </g>
          )}

          {cutType === 'corner' && (
            <g>
              {/* 顶点挖掉一个小角 */}
              <rect x="70" y="80" width="35" height="35" fill="#f8fafc" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 3" />
              <polygon points="105,80 120,65 120,100 105,115" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
              <polygon points="70,115 105,115 120,100 85,100" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
              <text x="145" y="70" fill="#059669" fontSize="11" fontWeight="800">凹陷补全 = 面积不变!</text>
            </g>
          )}

          {cutType === 'edge' && (
            <g>
              {/* 棱上挖槽 */}
              <rect x="115" y="80" width="40" height="30" fill="#f8fafc" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 3" />
              <polygon points="115,80 135,60 175,60 155,80" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
              <text x="210" y="70" fill="#ea580c" fontSize="11" fontWeight="800">棱中挖洞：净多 2 面</text>
            </g>
          )}

          <text x="135" y="225" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="700">
            原正方体边长 A = {cubeSide} cm
          </text>
        </svg>

        {/* 动态计算卡片 */}
        <div style={{
          marginTop: '16px',
          padding: '12px 20px',
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          width: '100%',
          maxWidth: '520px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '4px' }}>
            原表面积 6×{cubeSide}² = {origArea} cm² | {explanation}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: deltaS > 0 ? '#dc2626' : deltaS === 0 ? '#059669' : '#1e40af' }}>
            现表面积 = {origArea} {deltaS >= 0 ? `+ ${deltaS}` : deltaS} ={' '}
            <span style={{ fontSize: '1.4rem' }}>{finalArea}</span> cm²
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
        {/* 模式选择 */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setCutType('through_hole')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: cutType === 'through_hole' ? '#dc2626' : '#f1f5f9',
              color: cutType === 'through_hole' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            🕳️ 中心打通方孔 (面积剧增)
          </button>
          <button
            onClick={() => setCutType('corner')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: cutType === 'corner' ? '#059669' : '#f1f5f9',
              color: cutType === 'corner' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            ✂️ 挖掉顶点小角 (面积守恒)
          </button>
          <button
            onClick={() => setCutType('edge')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: cutType === 'edge' ? '#ea580c' : '#f1f5f9',
              color: cutType === 'edge' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            📦 棱中挖块 (增加2面)
          </button>
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
          {showFormula ? '收起口诀' : '💡 挖洞表面积变化三大铁律'}
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
          <p style={{ margin: '0 0 6px 0', fontWeight: 800 }}>📌 空间几何挖洞三大金科玉律：</p>
          <ul style={{ margin: 0, paddingLeft: '18px' }}>
            <li>
              <strong>挖顶点，表面积绝对不变（ΔS = 0）</strong>：
              削掉 1 个顶点方块，外表皮损失前、后、上 3 个面，但内部凹陷正好露出了底、左、后 3 个等大的新面，完美平移抵消！
            </li>
            <li>
              <strong>棱中挖，表面积净增 2 个面（ΔS = +2a²）</strong>：
              损失外侧 2 个面，内部露出 4 个面，4 - 2 = 2。
            </li>
            <li>
              <strong>打通长隧道，表面积净增长方形内壁</strong>：
              前后削去 2 个小方孔（-2a²），但贯穿整个大正方体的深邃长廊多出了 4 个长方形内壁（+4 × a × A）！因此表面积不仅没减少，反而大大暴增！
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
