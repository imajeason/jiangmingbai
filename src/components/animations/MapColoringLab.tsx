'use client';

import React, { useState } from 'react';

export default function MapColoringLab() {
  const [numColors, setNumColors] = useState<3 | 4>(4);
  const [activeStep, setActiveStep] = useState<number>(4);
  const [showFormula, setShowFormula] = useState<boolean>(false);

  // Wheel map: Center O, and 3 surrounding sectors A, B, C (A touches B, B touches C, C touches A)
  // For 3 outer sectors:
  // Center O has C choices.
  // Remaining colors for outer ring = C - 1.
  // Ring of 3 sectors with (C - 1) colors:
  // If numColors = 4, outer ring has 3 colors. Ring of 3 with 3 colors = 3 * 2 * 1 = 6 ways.
  // Total = 4 * 6 = 24 ways.
  // If numColors = 3, outer ring has 2 colors. Ring of 3 with 2 colors: impossible for 3 sectors all pairwise adjacent, need 3 colors!
  // So for 3 colors, center takes 1, outer needs 3 colors => 0 ways if all outer pairwise adjacent;
  // If outer is a line (A - B - C, A does NOT touch C):
  // Center takes C.
  // A has C-1 choices.
  // B has C-2 choices (touches center and A).
  // C has C-2 choices (touches center and B).
  // Total = C * (C-1) * (C-2) * (C-2).
  // If C=4: 4 * 3 * 2 * 2 = 48 ways.
  // If C=3: 3 * 2 * 1 * 1 = 6 ways.

  const totalWays = numColors === 4 ? 48 : 6;
  const step1Choices = numColors;
  const step2Choices = numColors - 1;
  const step3Choices = numColors - 2;
  const step4Choices = numColors - 2;

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
          地图染色与涂色计数：相邻不同色的“分步决策树”
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          四块相邻区域涂色：为什么“限制最多、接触面最大”的区域必须最优先涂？
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
        {/* SVG 地图区域 */}
        <svg viewBox="0 0 320 260" style={{ width: '100%', maxWidth: '320px', overflow: 'visible' }}>
          {/* 区域 A（左上方） */}
          <path
            d="M 60 40 L 160 40 L 160 120 L 60 120 Z"
            fill={activeStep >= 2 ? '#3b82f6' : '#e2e8f0'}
            stroke="#1e293b"
            strokeWidth="2.5"
          />
          <text x="110" y="85" textAnchor="middle" fill={activeStep >= 2 ? '#fff' : '#475569'} fontSize="14" fontWeight="800">
            区域 A
          </text>
          <text x="110" y="105" textAnchor="middle" fill={activeStep >= 2 ? '#dbeafe' : '#94a3b8'} fontSize="11" fontWeight="700">
            {step2Choices} 种选择
          </text>

          {/* 区域 B（右上方） */}
          <path
            d="M 160 40 L 260 40 L 260 120 L 160 120 Z"
            fill={activeStep >= 3 ? '#10b981' : '#e2e8f0'}
            stroke="#1e293b"
            strokeWidth="2.5"
          />
          <text x="210" y="85" textAnchor="middle" fill={activeStep >= 3 ? '#fff' : '#475569'} fontSize="14" fontWeight="800">
            区域 B
          </text>
          <text x="210" y="105" textAnchor="middle" fill={activeStep >= 3 ? '#dcfce7' : '#94a3b8'} fontSize="11" fontWeight="700">
            {step3Choices} 种选择
          </text>

          {/* 区域 C（右下方） */}
          <path
            d="M 160 120 L 260 120 L 260 200 L 160 200 Z"
            fill={activeStep >= 4 ? '#f59e0b' : '#e2e8f0'}
            stroke="#1e293b"
            strokeWidth="2.5"
          />
          <text x="210" y="165" textAnchor="middle" fill={activeStep >= 4 ? '#fff' : '#475569'} fontSize="14" fontWeight="800">
            区域 C
          </text>
          <text x="210" y="185" textAnchor="middle" fill={activeStep >= 4 ? '#fef3c7' : '#94a3b8'} fontSize="11" fontWeight="700">
            {step4Choices} 种选择
          </text>

          {/* 区域 O（左下方，接触最多：同时碰 A、B、C） */}
          <path
            d="M 60 120 L 160 120 L 160 200 L 60 200 Z"
            fill={activeStep >= 1 ? '#8b5cf6' : '#e2e8f0'}
            stroke="#7c3aed"
            strokeWidth="3.5"
          />
          <text x="110" y="155" textAnchor="middle" fill={activeStep >= 1 ? '#fff' : '#475569'} fontSize="15" fontWeight="800">
            核心中心 O
          </text>
          <text x="110" y="175" textAnchor="middle" fill={activeStep >= 1 ? '#ede9fe' : '#94a3b8'} fontSize="11" fontWeight="700">
            首选：{step1Choices} 种选择
          </text>
        </svg>

        {/* 动态乘法流水线 */}
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
          <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '6px' }}>
            根据<strong>乘法原理</strong>，分步涂色依次相乘：
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b' }}>
            中心 O ({step1Choices}) × A ({step2Choices}) × B ({step3Choices}) × C ({step4Choices}) ={' '}
            <span style={{ fontSize: '1.45rem', color: '#2563eb' }}>{totalWays}</span> 种不同涂法！
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
        {/* 颜色数量切换 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>可用颜色数:</span>
          <button
            onClick={() => setNumColors(4)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: numColors === 4 ? '#2563eb' : '#f1f5f9',
              color: numColors === 4 ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            🎨 4 种颜色 (红蓝绿黄)
          </button>
          <button
            onClick={() => setNumColors(3)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: numColors === 3 ? '#2563eb' : '#f1f5f9',
              color: numColors === 3 ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            🎨 3 种颜色 (最少颜色)
          </button>
        </div>

        {/* 分步涂色演练 */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => setActiveStep(s)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: activeStep === s ? '#8b5cf6' : '#ffffff',
                color: activeStep === s ? '#fff' : '#475569',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              步骤 {s}
            </button>
          ))}
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
          {showFormula ? '收起口诀' : '💡 涂色问题四大解题天条'}
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
          <p style={{ margin: '0 0 6px 0', fontWeight: 800 }}>📌 地图染色问题的四大铁律：</p>
          <ol style={{ margin: 0, paddingLeft: '18px' }}>
            <li>
              <strong>谁接触最多，谁最先涂</strong>：邻居越多的区域，受到的色彩约束最严格！先涂它，后面的区域选择数才清晰明了。
            </li>
            <li>
              <strong>分步连环用乘法</strong>：每一步涂一个区域，所有区域都涂好才算“独立成事”，各步可能数顺次相乘。
            </li>
            <li>
              <strong>警惕环状闭合“分类讨论”</strong>：如果首尾两个区域互不接触，必须讨论它们“同色”还是“不同色”两种分支，再用加法原理汇总！
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
