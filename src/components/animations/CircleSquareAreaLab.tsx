'use client';

import React, { useState } from 'react';

type ModelType = 'leaf' | 'flower' | 'bow';

export default function CircleSquareAreaLab() {
  const [modelType, setModelType] = useState<ModelType>('leaf');
  const [radius, setRadius] = useState<number>(10);
  const [splitLayers, setSplitLayers] = useState<boolean>(false);
  const [showFormula, setShowFormula] = useState<boolean>(false);

  const PI = 3.14;
  const r = radius;

  // Calculations
  const squareArea = r * r;
  const sectorArea = 0.25 * PI * r * r; // 1/4 圆面积
  const leafArea = 2 * sectorArea - squareArea; // 0.57 * r^2
  const flowerArea = 2 * leafArea; // 1.14 * r^2 (for square with 4 semicircles)
  const bowArea = sectorArea - 0.5 * squareArea; // 0.285 * r^2 (1/4圆减去直角三角形)

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
          巧求阴影面积：圆与正方形的“重叠叶形与弓形密码”
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          六年级几何压轴：利用“容斥图层重叠（两扇相加减正方）”与“弓形割补”，攻克 0.57 与 0.285 关键系数！
        </p>
      </div>

      {/* 画布展示区 */}
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
        {splitLayers && modelType === 'leaf' ? (
          /* 图层分离分解图 */
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'center' }}>
            {/* 扇形 A */}
            <div style={{ textAlign: 'center' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100px', height: '100px' }}>
                <path d="M 10 110 L 10 10 A 100 100 0 0 1 110 110 Z" fill="#93c5fd" stroke="#2563eb" strokeWidth="2" />
                <text x="45" y="75" fill="#1e40af" fontSize="12" fontWeight="700">扇形 1</text>
              </svg>
              <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700 }}>¼πr²</div>
            </div>

            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#64748b' }}>+</span>

            {/* 扇形 B */}
            <div style={{ textAlign: 'center' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100px', height: '100px' }}>
                <path d="M 110 10 L 110 110 A 100 100 0 0 1 10 10 Z" fill="#a7f3d0" stroke="#059669" strokeWidth="2" />
                <text x="45" y="75" fill="#065f46" fontSize="12" fontWeight="700">扇形 2</text>
              </svg>
              <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>¼πr²</div>
            </div>

            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#64748b' }}>-</span>

            {/* 正方形 */}
            <div style={{ textAlign: 'center' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100px', height: '100px' }}>
                <rect x="10" y="10" width="100" height="100" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                <text x="40" y="65" fill="#9a3412" fontSize="12" fontWeight="700">大正方形</text>
              </svg>
              <div style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 700 }}>r²</div>
            </div>

            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#64748b' }}>=</span>

            {/* 重叠叶子 */}
            <div style={{ textAlign: 'center' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100px', height: '100px' }}>
                <rect x="10" y="10" width="100" height="100" fill="none" stroke="#cbd5e1" strokeDasharray="3 3" />
                <path d="M 10 10 A 100 100 0 0 1 110 110 A 100 100 0 0 1 10 10 Z" fill="#6366f1" stroke="#4338ca" strokeWidth="2" />
                <text x="45" y="65" fill="#ffffff" fontSize="12" fontWeight="700">叶片</text>
              </svg>
              <div style={{ fontSize: '0.75rem', color: '#4338ca', fontWeight: 700 }}>0.57r²</div>
            </div>
          </div>
        ) : (
          /* 综合 SVG 视口 */
          <svg viewBox="0 0 280 280" style={{ width: '100%', maxWidth: '280px', overflow: 'visible' }}>
            {/* 正方形外框 */}
            <rect x="40" y="40" width="200" height="200" fill="#f1f5f9" stroke="#334155" strokeWidth="3" rx="2" />

            {/* 边长标注 */}
            <line x1="40" y1="250" x2="240" y2="250" stroke="#64748b" strokeWidth="1.5" />
            <line x1="40" y1="245" x2="40" y2="255" stroke="#64748b" strokeWidth="1.5" />
            <line x1="240" y1="245" x2="240" y2="255" stroke="#64748b" strokeWidth="1.5" />
            <text x="140" y="265" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="700">边长 r = {r} cm</text>

            {modelType === 'leaf' && (
              <>
                {/* 叶形阴影 */}
                <path
                  d="M 40 40 A 200 200 0 0 1 240 240 A 200 200 0 0 1 40 40 Z"
                  fill="#38bdf8"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                />
                <circle cx="40" cy="240" r="4" fill="#0284c7" />
                <circle cx="240" cy="40" r="4" fill="#0284c7" />
                <text x="140" y="145" textAnchor="middle" fill="#0369a1" fontSize="13" fontWeight="800">
                  叶形阴影 (0.57r²)
                </text>
              </>
            )}

            {modelType === 'flower' && (
              <>
                {/* 四瓣花：由四条边为直径的半圆交叠 */}
                <g fill="#ec4899" fillOpacity="0.75" stroke="#be185d" strokeWidth="2">
                  {/* 中心四瓣花轮廓 */}
                  <path d="M 140 40 A 100 100 0 0 1 240 140 A 100 100 0 0 1 140 240 A 100 100 0 0 1 40 140 A 100 100 0 0 1 140 40 Z" />
                  <path d="M 40 140 A 100 100 0 0 1 140 40 A 100 100 0 0 1 240 140 A 100 100 0 0 1 140 240 A 100 100 0 0 1 40 140 Z" />
                </g>
                <text x="140" y="145" textAnchor="middle" fill="#831843" fontSize="13" fontWeight="800">
                  四瓣花 (1.14r²)
                </text>
              </>
            )}

            {modelType === 'bow' && (
              <>
                {/* 弓形：扇形减直角三角形 */}
                <path
                  d="M 40 40 A 200 200 0 0 1 240 240 L 40 40 Z"
                  fill="#f59e0b"
                  stroke="#d97706"
                  strokeWidth="2.5"
                />
                <line x1="40" y1="40" x2="240" y2="240" stroke="#b45309" strokeWidth="2" strokeDasharray="4 4" />
                <text x="165" y="115" textAnchor="middle" fill="#78350f" fontSize="13" fontWeight="800">
                  弓形阴影 (0.285r²)
                </text>
                <text x="105" y="170" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">
                  空白直角三角形
                </text>
              </>
            )}
          </svg>
        )}

        {/* 动态计算结果与公式卡片 */}
        <div style={{
          marginTop: '16px',
          padding: '12px 18px',
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          width: '100%',
          maxWidth: '460px',
          textAlign: 'center'
        }}>
          {modelType === 'leaf' && (
            <div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '4px' }}>
                正方形面积 $r^2$ = {squareArea} cm² | 单个¼圆 = {sectorArea.toFixed(2)} cm²
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0369a1' }}>
                叶形面积 = 2个¼圆 - 正方形 = 0.57 × {r}² = <span style={{ color: '#0284c7', fontSize: '1.25rem' }}>{leafArea.toFixed(2)}</span> cm²
              </div>
            </div>
          )}

          {modelType === 'flower' && (
            <div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '4px' }}>
                由 4 个半圆两两交叠组成，相当于 2 组叶形模型之和！
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#be185d' }}>
                四瓣花面积 = 4个半圆 - 正方形 = 1.14 × {r}² = <span style={{ color: '#db2777', fontSize: '1.25rem' }}>{flowerArea.toFixed(2)}</span> cm²
              </div>
            </div>
          )}

          {modelType === 'bow' && (
            <div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '4px' }}>
                ¼圆面积 ({sectorArea.toFixed(2)}) 减去 等腰直角三角形 ({(0.5 * squareArea).toFixed(2)})
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#b45309' }}>
                弓形面积 = 叶形面积的一半 = 0.285 × {r}² = <span style={{ color: '#d97706', fontSize: '1.25rem' }}>{bowArea.toFixed(2)}</span> cm²
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 交互控制栏 */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* 模型切换 */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => { setModelType('leaf'); setSplitLayers(false); }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: modelType === 'leaf' ? '#0284c7' : '#f1f5f9',
              color: modelType === 'leaf' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            🍃 基础叶形 (0.57)
          </button>
          <button
            onClick={() => { setModelType('flower'); setSplitLayers(false); }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: modelType === 'flower' ? '#db2777' : '#f1f5f9',
              color: modelType === 'flower' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            🌸 四瓣花 (1.14)
          </button>
          <button
            onClick={() => { setModelType('bow'); setSplitLayers(false); }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: modelType === 'bow' ? '#d97706' : '#f1f5f9',
              color: modelType === 'bow' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            🌙 单侧弓形 (0.285)
          </button>
        </div>

        {/* 图层分离分解开关 */}
        {modelType === 'leaf' && (
          <button
            onClick={() => setSplitLayers(!splitLayers)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: splitLayers ? '#6366f1' : '#f8fafc',
              color: splitLayers ? '#fff' : '#4f46e5',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            {splitLayers ? '合并正方形' : '🧩 容斥图层分离拆解'}
          </button>
        )}

        {/* 边长调节滑块 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '4px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 600 }}>边长 r:</span>
          <input
            type="range"
            min="4"
            max="20"
            step="1"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            style={{ width: '90px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.8125rem', color: '#0f172a', fontWeight: 800, minWidth: '32px' }}>{radius}cm</span>
        </div>

        {/* 原理公式折叠 */}
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
          {showFormula ? '收起口诀' : '💡 0.57 与 0.285 怎么来的？'}
        </button>
      </div>

      {/* 原理推导解析 */}
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
          <p style={{ margin: '0 0 6px 0', fontWeight: 800 }}>📌 小学几何三大神奇黄金系数：</p>
          <ul style={{ margin: 0, paddingLeft: '18px' }}>
            <li>
              <strong>叶形（一片树叶）= 0.57 r²</strong>：<br />
              推导：2 × ¼ π r² - r² = (½π - 1)r² = (1.57 - 1)r² = <strong>0.57 r²</strong>。
            </li>
            <li>
              <strong>弓形（半片树叶）= 0.285 r²</strong>：<br />
              推导：沿叶片对角线切开，弓形面积恰好是整片树叶的二分之一：0.57 ÷ 2 = <strong>0.285 r²</strong>。
            </li>
            <li>
              <strong>四瓣花 = 1.14 r²</strong>：<br />
              推导：四瓣花正好是由两个完整的叶形模型正交重叠而成：2 × 0.57 r² = <strong>1.14 r²</strong>。
            </li>
          </ul>
          <p style={{ margin: '8px 0 0 0', color: '#b45309' }}>
            ⚡ <strong>考场秒杀技巧</strong>：小升初大题中，只要看到正方形边长为 10 cm，叶形面积直接心算 0.57 × 10² = 57 cm²；两边留白的角面积直接用正方形减叶形：100 - 57 = 43 cm²（单角为 21.5 cm²）！
          </p>
        </div>
      )}
    </div>
  );
}
