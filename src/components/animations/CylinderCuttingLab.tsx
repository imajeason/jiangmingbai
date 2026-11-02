'use client';

import React, { useState } from 'react';

export default function CylinderCuttingLab() {
  const [cutType, setCutType] = useState<'horizontal' | 'vertical'>('horizontal');
  const [pieces, setPieces] = useState<number>(3); // 横切段数
  const [radius, setRadius] = useState<number>(5);
  const [height, setHeight] = useState<number>(10);
  const [showFormula, setShowFormula] = useState<boolean>(false);

  const PI = 3.14;
  const baseArea = PI * radius * radius;
  const lateralArea = 2 * PI * radius * height;
  const origSurface = 2 * baseArea + lateralArea;

  // Added areas
  const horizAddedArea = 2 * (pieces - 1) * baseArea;
  const vertAddedArea = 2 * (2 * radius * height); // 2 rectangles: (2r * h) each

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
          圆柱切拼变形记：横切与纵切的“表面积剧增密码”
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          切成几段增加多少面积？看透“横切一刀多两底（圆），纵切一刀多两长方（直径×高）”！
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
        {/* SVG 圆柱剖面与立体示意 */}
        <svg viewBox="0 0 340 260" style={{ width: '100%', maxWidth: '340px', overflow: 'visible' }}>
          {cutType === 'horizontal' ? (
            /* 横切剖视图 */
            <g>
              {/* 圆柱上底面椭圆 */}
              <ellipse cx="170" cy="50" rx="70" ry="24" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" />

              {/* 圆柱侧面 */}
              <path
                d="M 100 50 L 100 200 A 70 24 0 0 0 240 200 L 240 50"
                fill="#f0f9ff"
                stroke="#0284c7"
                strokeWidth="2.5"
              />

              {/* 切痕与新增底面示意 */}
              {Array.from({ length: pieces - 1 }).map((_, idx) => {
                const y = 50 + ((idx + 1) * 150) / pieces;
                return (
                  <g key={idx}>
                    {/* 红色发光切痕虚线 */}
                    <line x1="100" y1={y} x2="240" y2={y} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 3" />
                    {/* 新增高亮椭圆底面 */}
                    <ellipse cx="170" cy={y} rx="68" ry="20" fill="#fef08a" stroke="#eab308" strokeWidth="2" opacity="0.8" />
                    <text x="255" y={y + 4} fill="#dc2626" fontSize="10" fontWeight="800">
                      第 {idx + 1} 刀 (+2底)
                    </text>
                  </g>
                );
              })}

              {/* 圆柱下底面外弧 */}
              <path d="M 100 200 A 70 24 0 0 0 240 200" fill="none" stroke="#0284c7" strokeWidth="2.5" />

              <text x="170" y="55" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="700">
                底面半径 r = {radius} cm
              </text>
              <text x="80" y="130" textAnchor="end" fill="#64748b" fontSize="11" fontWeight="700">
                高 h = {height} cm
              </text>
            </g>
          ) : (
            /* 纵切剖视图 */
            <g>
              {/* 沿直径切开的一个半圆柱立体图 */}
              <ellipse cx="120" cy="60" rx="45" ry="20" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
              <rect x="75" y="60" width="90" height="130" fill="#fef08a" stroke="#ca8a04" strokeWidth="2.5" />
              <text x="120" y="130" textAnchor="middle" fill="#854d0e" fontSize="12" fontWeight="800">
                新增切面 1 (长方形 2r × h)
              </text>

              {/* 另一个拉开的半圆柱 */}
              <ellipse cx="230" cy="60" rx="45" ry="20" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
              <rect x="185" y="60" width="90" height="130" fill="#fef08a" stroke="#ca8a04" strokeWidth="2.5" />
              <text x="230" y="130" textAnchor="middle" fill="#854d0e" fontSize="12" fontWeight="800">
                新增切面 2 (长方形 2r × h)
              </text>

              <text x="120" y="210" textAnchor="middle" fill="#b45309" fontSize="11" fontWeight="700">
                宽 = 直径 2r = {2 * radius} cm
              </text>
              <text x="230" y="210" textAnchor="middle" fill="#b45309" fontSize="11" fontWeight="700">
                高 = 圆柱高 h = {height} cm
              </text>
            </g>
          )}
        </svg>

        {/* 动态计算结果 */}
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
          {cutType === 'horizontal' ? (
            <div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '4px' }}>
                切成 {pieces} 段需要切 {pieces - 1} 刀，每一刀都新露出 2 个圆形底面！
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#dc2626' }}>
                新增表面积 = 2 × ({pieces} - 1) × πr² = {2 * (pieces - 1)} × {baseArea.toFixed(1)} ={' '}
                <span style={{ fontSize: '1.35rem', color: '#b91c1c' }}>{horizAddedArea.toFixed(1)}</span> cm²
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '4px' }}>
                沿底面直径纵切成两半，截面是两个全等的长方形（长为高 h，宽为直径 2r）！
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ca8a04' }}>
                新增表面积 = 2 × (2r × h) = 2 × ({2 * radius} × {height}) ={' '}
                <span style={{ fontSize: '1.35rem', color: '#a16207' }}>{vertAddedArea}</span> cm²
              </div>
            </div>
          )}
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
        {/* 切法模式切换 */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setCutType('horizontal')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: cutType === 'horizontal' ? '#0284c7' : '#f1f5f9',
              color: cutType === 'horizontal' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            🔪 横切成 N 段 (多出圆形底面)
          </button>
          <button
            onClick={() => setCutType('vertical')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: cutType === 'vertical' ? '#ca8a04' : '#f1f5f9',
              color: cutType === 'vertical' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            📐 纵切成两半 (多出长方形截面)
          </button>
        </div>

        {/* 横切段数调节 */}
        {cutType === 'horizontal' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>切成几段:</span>
            {[2, 3, 4, 5].map((p) => (
              <button
                key={p}
                onClick={() => setPieces(p)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: pieces === p ? '#0284c7' : '#ffffff',
                  color: pieces === p ? '#fff' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {p}段
              </button>
            ))}
          </div>
        )}

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
          {showFormula ? '收起口诀' : '💡 圆柱切拼常考题型口诀'}
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
          <p style={{ margin: '0 0 6px 0', fontWeight: 800 }}>📌 六年级圆柱表面积变式大坑：</p>
          <ul style={{ margin: 0, paddingLeft: '18px' }}>
            <li>
              <strong>横切一刀多两底</strong>：一根木头锯成 n 段，一共锯了 (n - 1) 次；每次锯开，都会在断口处新增 2 个完全一样的底面圆！新增表面积 = 2(n - 1) × πr²。
            </li>
            <li>
              <strong>纵切一刀多两长方</strong>：沿着底面直径竖着切开，新增的面是 2 个长方形，长等于圆柱的高 h，宽等于圆柱的底面直径 2r！新增表面积 = 2 × (2r × h) = 4rh。
            </li>
            <li>
              <strong>圆柱拼成长方体</strong>：把底面切成若干等份拼成近似长方体，表面积不仅包含原本的表面积，还凭空多出了<strong>左边和右边两个侧截面（每个面积为 r × h，共多 2rh）</strong>！
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
