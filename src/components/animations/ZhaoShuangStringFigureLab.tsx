'use client';

import React, { useState } from 'react';

export default function ZhaoShuangStringFigureLab() {
  const [legA, setLegA] = useState<number>(3);
  const [legB, setLegB] = useState<number>(4);
  const [exploded, setExploded] = useState<boolean>(false);
  const [showFormula, setShowFormula] = useState<boolean>(false);

  // Hypotenuse c
  const a = legA;
  const b = legB;
  const cSquared = a * a + b * b;
  const c = Math.sqrt(cSquared);
  const smallSquareSide = b - a;
  const smallSquareArea = smallSquareSide * smallSquareSide;
  const singleTriArea = 0.5 * a * b;
  const fourTriArea = 4 * singleTriArea;

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
          赵爽弦图与勾股拼图：东方智慧的“无字证明”
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          4 个全等直角三角形拼成大正方形：大正方形面积 c² 为什么恒等于 4个三角形 + 中间小正方形？
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
        {/* SVG 弦图 */}
        <svg viewBox="0 0 320 280" style={{ width: '100%', maxWidth: '320px', overflow: 'visible' }}>
          {/* 大正方形外轮廓 c × c */}
          <rect
            x="50"
            y="30"
            width="220"
            height="220"
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* 4 个直角三角形 (红、蓝、绿、黄) */}
          {/* 三角形 1 (上方) */}
          <polygon
            points="50,30 270,30 200,90"
            fill="#ef4444"
            opacity="0.8"
            stroke="#b91c1c"
            strokeWidth="1.5"
            transform={exploded ? 'translate(0, -15)' : 'none'}
          />
          {/* 三角形 2 (右方) */}
          <polygon
            points="270,30 270,250 210,180"
            fill="#3b82f6"
            opacity="0.8"
            stroke="#1d4ed8"
            strokeWidth="1.5"
            transform={exploded ? 'translate(15, 0)' : 'none'}
          />
          {/* 三角形 3 (下方) */}
          <polygon
            points="270,250 50,250 120,190"
            fill="#10b981"
            opacity="0.8"
            stroke="#047857"
            strokeWidth="1.5"
            transform={exploded ? 'translate(0, 15)' : 'none'}
          />
          {/* 三角形 4 (左方) */}
          <polygon
            points="50,250 50,30 110,100"
            fill="#f59e0b"
            opacity="0.8"
            stroke="#b45309"
            strokeWidth="1.5"
            transform={exploded ? 'translate(-15, 0)' : 'none'}
          />

          {/* 中心小正方形 (b - a) */}
          <rect
            x="120"
            y="100"
            width="80"
            height="80"
            fill="#fef08a"
            stroke="#ca8a04"
            strokeWidth="2"
          />
          <text x="160" y="145" textAnchor="middle" fill="#854d0e" fontSize="12" fontWeight="800">
            (b - a)²
          </text>
          <text x="160" y="160" textAnchor="middle" fill="#a16207" fontSize="10" fontWeight="700">
            边长 = {b - a}
          </text>

          {/* 斜边 c 标记 */}
          <text x="160" y="24" textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="800">
            斜边 c = {c.toFixed(2)}
          </text>
        </svg>

        {/* 算式推导卡片 */}
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
            4 个三角形面积 = 4 × (½ × {a} × {b}) = {fourTriArea} | 中心小正方形 = ({b}-{a})² = {smallSquareArea}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
            大正方形 c² = 4个三角形 + 小正方形 = {fourTriArea} + {smallSquareArea} ={' '}
            <span style={{ fontSize: '1.35rem', color: '#2563eb' }}>{cSquared}</span> (即 a² + b² = {a * a}+{b * b}={cSquared})
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
        {/* 预设勾股数 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>常用边长:</span>
          {[
            { a: 3, b: 4 },
            { a: 6, b: 8 },
            { a: 5, b: 12 },
            { a: 2, b: 5 }
          ].map((pair, idx) => (
            <button
              key={idx}
              onClick={() => { setLegA(pair.a); setLegB(pair.b); }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: legA === pair.a && legB === pair.b ? '#2563eb' : '#f1f5f9',
                color: legA === pair.a && legB === pair.b ? '#fff' : '#334155',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              a={pair.a}, b={pair.b}
            </button>
          ))}
        </div>

        {/* 拆分动画开关 */}
        <button
          onClick={() => setExploded(!exploded)}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: exploded ? '#8b5cf6' : '#f8fafc',
            color: exploded ? '#fff' : '#6d28d9',
            fontWeight: 700,
            fontSize: '0.8125rem',
            cursor: 'pointer'
          }}
        >
          {exploded ? '合体拼合' : '🧩 爆炸展开视图'}
        </button>

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
          {showFormula ? '收起口诀' : '💡 赵爽弦图代数证明'}
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
          <p style={{ margin: '0 0 6px 0', fontWeight: 800 }}>📌 赵爽弦图为什么被称为“无字天书”？</p>
          <ol style={{ margin: 0, paddingLeft: '18px' }}>
            <li>
              <strong>完美面积守恒</strong>：外围大正方形面积为 c²，它由 4 个全等直角三角形和一个中间小正方形无缝拼接而成。
            </li>
            <li>
              <strong>代数完全平方公式展开</strong>：
              c² = 4 × (½ ab) + (b - a)² = 2ab + (b² - 2ab + a²) = <strong>a² + b²</strong>！
              正负 2ab 奇迹般完全抵消，留下了永恒的勾股定理！
            </li>
            <li>
              <strong>小升初考法</strong>：已知直角三角形两直角边差为 1，面积为 6，求斜边正方形面积？直接心算：4 × 6 + 1² = 25！
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
