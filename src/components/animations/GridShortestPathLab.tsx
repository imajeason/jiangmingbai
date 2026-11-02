'use client';

import React, { useState } from 'react';

export default function GridShortestPathLab() {
  const [gridSize, setGridSize] = useState<'3x3' | '4x4'>('3x3');
  const [hasObstacle, setHasObstacle] = useState(false);
  const [step, setStep] = useState(0); // 0 = initial, 1 = border points, 2 = all points
  const [showFormula, setShowFormula] = useState(false);

  const rows = gridSize === '3x3' ? 3 : 4;
  const cols = gridSize === '3x3' ? 3 : 4;

  // Obstacle coordinate (1-indexed intersection)
  const obstacleRow = gridSize === '3x3' ? 1 : 2;
  const obstacleCol = gridSize === '3x3' ? 1 : 2;

  // Calculate grid counts dynamically using dynamic programming (标数法)
  const dp: number[][] = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(0));
  dp[0][0] = 1;

  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      if (r === 0 && c === 0) continue;
      if (hasObstacle && r === obstacleRow && c === obstacleCol) {
        dp[r][c] = 0;
        continue;
      }
      const fromBottom = r > 0 ? dp[r - 1][c] : 0;
      const fromLeft = c > 0 ? dp[r][c - 1] : 0;
      dp[r][c] = fromBottom + fromLeft;
    }
  }

  const maxSteps = (rows + 1) * (cols + 1);

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
      {/* 头部标题与导引 */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: '0 0 6px 0' }}>
          街道网格最短路线：加法原理与“标数法”
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          从起点 A 到终点 B 只能向右或向上走：到达任意交叉点的走法数 = 左边来路数 + 下方来路数！
        </p>
      </div>

      {/* 画布区域 */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '24px 16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '320px',
        position: 'relative'
      }}>
        {/* SVG 网格与标数 */}
        <svg viewBox="0 0 420 340" style={{ width: '100%', maxWidth: '420px', overflow: 'visible' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#3b82f6" />
            </marker>
          </defs>

          {/* 网格线 */}
          {Array.from({ length: rows + 1 }).map((_, r) => {
            const y = 280 - r * 65;
            return (
              <line
                key={`h-${r}`}
                x1={60}
                y1={y}
                x2={60 + cols * 65}
                y2={y}
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeDasharray={hasObstacle && r === obstacleRow ? "4 4" : "none"}
              />
            );
          })}
          {Array.from({ length: cols + 1 }).map((_, c) => {
            const x = 60 + c * 65;
            return (
              <line
                key={`v-${c}`}
                x1={x}
                y1={280}
                x2={x}
                y2={280 - rows * 65}
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeDasharray={hasObstacle && c === obstacleCol ? "4 4" : "none"}
              />
            );
          })}

          {/* 障碍物标记 */}
          {hasObstacle && (
            <g transform={`translate(${60 + obstacleCol * 65 - 20}, ${280 - obstacleRow * 65 - 20})`}>
              <rect width="40" height="40" rx="8" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
              <text x="20" y="25" textAnchor="middle" fill="#dc2626" fontSize="18">🚧</text>
            </g>
          )}

          {/* 交叉点与标数圆圈 */}
          {Array.from({ length: rows + 1 }).map((_, r) =>
            Array.from({ length: cols + 1 }).map((_, c) => {
              const x = 60 + c * 65;
              const y = 280 - r * 65;
              const isStart = r === 0 && c === 0;
              const isEnd = r === rows && c === cols;
              const isObs = hasObstacle && r === obstacleRow && c === obstacleCol;
              const currentPointIndex = r * (cols + 1) + c;
              const isVisible = step >= 2 || (step === 1 && (r === 0 || c === 0)) || isStart;

              if (isObs) return null;

              return (
                <g key={`pt-${r}-${c}`}>
                  {/* 点的底圈 */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isStart || isEnd ? "14" : "11"}
                    fill={isStart ? '#10b981' : isEnd ? '#ef4444' : isVisible ? '#dbeafe' : '#e2e8f0'}
                    stroke={isStart ? '#059669' : isEnd ? '#dc2626' : isVisible ? '#3b82f6' : '#94a3b8'}
                    strokeWidth="2"
                  />

                  {/* 标数数值 */}
                  {isVisible && (
                    <text
                      x={x}
                      y={y + 4.5}
                      textAnchor="middle"
                      fill={isStart || isEnd ? '#ffffff' : '#1e40af'}
                      fontSize={isStart || isEnd ? "11" : "10"}
                      fontWeight="800"
                    >
                      {dp[r][c]}
                    </text>
                  )}

                  {/* 传递箭头（当全展开时展示流向） */}
                  {step >= 2 && r > 0 && !isObs && dp[r - 1][c] > 0 && (
                    <line
                      x1={x}
                      y1={y + 12}
                      x2={x}
                      y2={y + 35}
                      stroke="#93c5fd"
                      strokeWidth="1.5"
                    />
                  )}
                  {step >= 2 && c > 0 && !isObs && dp[r][c - 1] > 0 && (
                    <line
                      x1={x - 35}
                      y1={y}
                      x2={x - 12}
                      y2={y}
                      stroke="#93c5fd"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );
            })
          )}

          {/* 起点 A 终点 B 标记 */}
          <text x="35" y="285" fill="#059669" fontSize="13" fontWeight="800">起点 A</text>
          <text x={60 + cols * 65 + 12} y={280 - rows * 65 + 5} fill="#dc2626" fontSize="13" fontWeight="800">终点 B</text>
        </svg>

        {/* 结果提示条 */}
        <div style={{
          marginTop: '12px',
          padding: '8px 16px',
          background: '#eff6ff',
          borderRadius: '8px',
          border: '1px solid #bfdbfe',
          fontSize: '0.875rem',
          color: '#1e40af',
          fontWeight: 700,
          textAlign: 'center'
        }}>
          {hasObstacle ? (
            <span>避开施工障碍物后，从 A 到 B 的最短路线共有 <strong style={{ fontSize: '1.1rem', color: '#dc2626' }}>{dp[rows][cols]}</strong> 种</span>
          ) : (
            <span>{gridSize} 规则街道网格，从 A 到 B 的最短路线共有 <strong style={{ fontSize: '1.1rem', color: '#2563eb' }}>{dp[rows][cols]}</strong> 种</span>
          )}
        </div>
      </div>

      {/* 控制栏（严格遵循黄金近邻与弹性布局） */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* 网格切换 */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => { setGridSize('3x3'); setStep(2); }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: gridSize === '3x3' ? '#2563eb' : '#f1f5f9',
              color: gridSize === '3x3' ? '#fff' : '#475569',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            3×3 街道 (小)
          </button>
          <button
            onClick={() => { setGridSize('4x4'); setStep(2); }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: gridSize === '4x4' ? '#2563eb' : '#f1f5f9',
              color: gridSize === '4x4' ? '#fff' : '#475569',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            4×4 街道 (大)
          </button>
        </div>

        {/* 施工障碍物开关 */}
        <button
          onClick={() => setHasObstacle(!hasObstacle)}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: hasObstacle ? '#fee2e2' : '#f1f5f9',
            color: hasObstacle ? '#dc2626' : '#475569',
            fontWeight: 700,
            fontSize: '0.8125rem',
            cursor: 'pointer'
          }}
        >
          {hasObstacle ? '🚧 移除施工障碍' : '🚧 增加施工障碍'}
        </button>

        {/* 标数推演步骤 */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setStep(0)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: step === 0 ? '#3b82f6' : '#ffffff',
              color: step === 0 ? '#fff' : '#334155',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            ① 仅起点 (1)
          </button>
          <button
            onClick={() => setStep(1)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: step === 1 ? '#3b82f6' : '#ffffff',
              color: step === 1 ? '#fff' : '#334155',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            ② 外边界一条路 (全标1)
          </button>
          <button
            onClick={() => setStep(2)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: step === 2 ? '#3b82f6' : '#ffffff',
              color: step === 2 ? '#fff' : '#334155',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            ③ 内部汇流 (加法原理)
          </button>
        </div>

        {/* 规律解析折叠 */}
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
          {showFormula ? '收起原理' : '💡 标数口诀与杨辉三角'}
        </button>
      </div>

      {/* 原理提示卡片 */}
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
          <p style={{ margin: '0 0 6px 0', fontWeight: 800 }}>📌 标数法的三大铁律：</p>
          <ol style={{ margin: 0, paddingLeft: '18px' }}>
            <li><strong>外边一条道，直行全标 1</strong>：沿着最下边一直向右走只有 1 种走法；沿着最左边一直向上走也只有 1 种走法。</li>
            <li><strong>内部汇合点，左下加起来</strong>：到达任意交叉点 $(r, c)$，要么来自它的左边 $(r, c-1)$，要么来自它的下方 $(r-1, c)$。根据<strong>加法原理</strong>，两路相加即可！</li>
            <li><strong>遇到障碍物，标 0 绕着走</strong>：如果某路口施工封闭，此处的走法直接记为 0，上边和右边的点就不会借用到这条路线。</li>
          </ol>
          <p style={{ margin: '8px 0 0 0', color: '#92400e' }}>
            ✨ <strong>数学彩蛋</strong>：把网格顺时针旋转 45°，你会惊奇地发现每一个点上的数字正好是著名的<strong>杨辉三角（帕斯卡三角）</strong>！无障碍 3×3 网格终点值对应组合数 $C_6^3 = 20$，4×4 网格对应 $C_8^4 = 70$。
          </p>
        </div>
      )}
    </div>
  );
}

