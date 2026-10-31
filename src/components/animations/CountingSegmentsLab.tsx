'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type LabMode = 'segments' | 'handshake' | 'matrix';

export default function CountingSegmentsLab() {
  const [mode, setMode] = useState<LabMode>('segments');

  // -------------------- 模式1：数线段状态 --------------------
  const [pointCount, setPointCount] = useState<number>(5); // 点数 2~8
  const [activeStartPoint, setActiveStartPoint] = useState<number | null>(null); // 高亮某个起点发出的线段

  // -------------------- 模式2：握手与单循环赛状态 --------------------
  const [peopleCount, setPeopleCount] = useState<number>(5); // 人数/队数 3~8
  const [isDirected, setIsDirected] = useState<boolean>(false); // false: 握手(无向/除以2), true: 互送贺卡/往返车票(有向/不除以2)

  // 计算数值
  // 线段数 / 握手次数: n * (n - 1) / 2
  const totalPairsSeg = (pointCount * (pointCount - 1)) / 2;
  const totalPairsHandshake = (peopleCount * (peopleCount - 1)) / 2;
  const directedTotal = peopleCount * (peopleCount - 1);

  // 模式1：点坐标生成
  const segWidth = 460;
  const paddingX = 40;
  const lineY = 130;
  const stepX = (segWidth - 2 * paddingX) / (pointCount - 1);
  const points = Array.from({ length: pointCount }).map((_, i) => ({
    index: i,
    label: String.fromCharCode(65 + i), // A, B, C, D...
    x: paddingX + i * stepX,
    y: lineY,
  }));

  // 生成所有线段对
  const allSegments: { start: number; end: number; key: string }[] = [];
  for (let i = 0; i < pointCount; i++) {
    for (let j = i + 1; j < pointCount; j++) {
      allSegments.push({ start: i, end: j, key: `${i}-${j}` });
    }
  }

  // 模式2：环形节点生成
  const circleCenterX = 240;
  const circleCenterY = 130;
  const circleRadius = 95;
  const peopleNodes = Array.from({ length: peopleCount }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / peopleCount - Math.PI / 2;
    return {
      index: i,
      label: `人${i + 1}`,
      x: circleCenterX + circleRadius * Math.cos(angle),
      y: circleCenterY + circleRadius * Math.sin(angle),
    };
  });

  return (
    <div className={styles.container} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 头部标题区 */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', color: '#1e293b' }}>
          🤝 数线段与握手模型：为什么公式一定要“除以 2”？
        </h3>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>
          从直线上的点到圆桌朋友握手、足球单循环赛，看透“去重复”与排列组合的核心奥秘
        </p>
      </div>

      {/* 模式选择导航 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={() => setMode('segments')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'segments' ? '#2563eb' : '#f1f5f9',
            color: mode === 'segments' ? '#ffffff' : '#475569',
            boxShadow: mode === 'segments' ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          📏 场景一：数线段（端点发射与拱形彩虹）
        </button>
        <button
          onClick={() => setMode('handshake')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'handshake' ? '#059669' : '#f1f5f9',
            color: mode === 'handshake' ? '#ffffff' : '#475569',
            boxShadow: mode === 'handshake' ? '0 2px 8px rgba(5,150,105,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          👥 场景二：朋友握手 vs 互送礼物（除以2的真相）
        </button>
        <button
          onClick={() => setMode('matrix')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'matrix' ? '#d97706' : '#f1f5f9',
            color: mode === 'matrix' ? '#ffffff' : '#475569',
            boxShadow: mode === 'matrix' ? '0 2px 8px rgba(217,119,6,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          🗂️ 场景三：网格棋盘对角线透视（高斯对折原理）
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 场景一：数线段 */}
      {/* ========================================================================= */}
      {mode === 'segments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 画布核心区 */}
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '8px' }}>
              一条直线上有 {pointCount} 个点，总共能连出{' '}
              <span style={{ color: '#dc2626', fontSize: '1.25rem' }}>{totalPairsSeg}</span> 条不同的线段！
            </div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '14px' }}>
              点击下方字母端点，即可单色高亮从该点出发的所有线段
            </div>

            {/* 线段彩虹拱桥 SVG */}
            <div style={{ width: '100%', maxWidth: '500px', height: '240px' }}>
              <svg viewBox={`0 0 ${segWidth} 240`} width="100%" height="240">
                {/* 基底主水平直线 */}
                <line x1={paddingX - 15} y1={lineY} x2={segWidth - paddingX + 15} y2={lineY} stroke="#94a3b8" strokeWidth="2.5" />

                {/* 所有线段的彩色抛物线拱形弧 */}
                {allSegments.map((seg, idx) => {
                  const p1 = points[seg.start];
                  const p2 = points[seg.end];
                  const span = seg.end - seg.start;
                  const arcHeight = span * 22; // 跨度越大弧越高
                  const midX = (p1.x + p2.x) / 2;
                  const isHighlighted =
                    activeStartPoint === null ||
                    activeStartPoint === seg.start ||
                    activeStartPoint === seg.end;

                  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#e11d48'];
                  const strokeColor = colors[seg.start % colors.length];

                  return (
                    <path
                      key={seg.key}
                      d={`M ${p1.x} ${lineY} Q ${midX} ${lineY - arcHeight} ${p2.x} ${lineY}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isHighlighted ? 2.5 : 1}
                      opacity={isHighlighted ? 0.85 : 0.15}
                      strokeLinecap="round"
                    />
                  );
                })}

                {/* 各个点标记 */}
                {points.map((p) => {
                  const isSelected = activeStartPoint === p.index;
                  return (
                    <g
                      key={p.index}
                      onClick={() => setActiveStartPoint(isSelected ? null : p.index)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isSelected ? 9 : 7}
                        fill={isSelected ? '#dc2626' : '#2563eb'}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                      />
                      <text
                        x={p.x}
                        y={p.y + 24}
                        fontSize="14"
                        fontWeight="800"
                        fill={isSelected ? '#dc2626' : '#1e293b'}
                        textAnchor="middle"
                      >
                        {p.label}
                      </text>
                      <text
                        x={p.x}
                        y={p.y + 38}
                        fontSize="9"
                        fill="#64748b"
                        textAnchor="middle"
                      >
                        第{p.index + 1}点
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* 两种计算方法的对比卡片 */}
            <div
              style={{
                width: '100%',
                maxWidth: '560px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '10px',
              }}
            >
              {/* 方法一：倒数阶梯加法 */}
              <div
                style={{
                  background: '#eff6ff',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '10px 14px',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e40af' }}>
                  📐 思路一：端点分类法（从左向右发射，阶梯累加）
                </div>
                <div style={{ fontSize: '0.86rem', color: '#1e3a8a', marginTop: '4px' }}>
                  以 A 为左端点有 <strong>{pointCount - 1}</strong> 条，
                  以 B 为左端点有 <strong>{pointCount - 2}</strong> 条，依次递减...
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>
                  总条数 = {Array.from({ length: pointCount - 1 })
                    .map((_, i) => pointCount - 1 - i)
                    .join(' + ')}{' '}
                  = <span style={{ fontSize: '1.15rem', color: '#dc2626' }}>{totalPairsSeg}</span> 条
                </div>
              </div>

              {/* 方法二：组合公式除以2 */}
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1.5px solid #bbf7d0',
                  borderRadius: '8px',
                  padding: '10px 14px',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534' }}>
                  ⚡ 思路二：配对公式法（为什么除以 2？）
                </div>
                <div style={{ fontSize: '0.85rem', color: '#15803d', marginTop: '4px', lineHeight: '1.6' }}>
                  每个点都可以和其余 <strong>({pointCount} - 1)</strong> 个点连线，共有{' '}
                  <code>{pointCount} × {pointCount - 1} = {pointCount * (pointCount - 1)}</code> 条线段。
                  但线段 <strong>AB</strong> 和线段 <strong>BA</strong> 是同一条，<strong>整整多算了一倍！</strong>
                  因此必须除以 2：
                  <span style={{ fontWeight: 800, color: '#15803d', marginLeft: '6px' }}>
                    {pointCount} × ({pointCount} - 1) ÷ 2 = {totalPairsSeg} 条
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 控制条区 */}
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e3a8a' }}>
              调整直线上点的数量：
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setPointCount(n);
                    setActiveStartPoint(null);
                  }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: pointCount === n ? '#2563eb' : '#ffffff',
                    color: pointCount === n ? '#ffffff' : '#334155',
                    fontSize: '0.85rem',
                    fontWeight: pointCount === n ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {n} 个点
                </button>
              ))}
            </div>
            {activeStartPoint !== null && (
              <button
                onClick={() => setActiveStartPoint(null)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.8rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  marginLeft: 'auto',
                }}
              >
                重置高亮显示全彩
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景二：握手模型 vs 互送礼物 */}
      {/* ========================================================================= */}
      {mode === 'handshake' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 画布核心区 */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#166534', marginBottom: '8px' }}>
              {isDirected ? '💌 互送贺卡 / 单程车票情境（单向，需送2张）' : '🤝 朋友握手 / 足球单循环赛情境（双向，只需1次）'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#15803d', marginBottom: '14px' }}>
              现场共有 {peopleCount} 个人/队伍，
              {isDirected ? (
                <span>
                  每人都要给其他人各送一张贺卡，总共需要：
                  <strong style={{ fontSize: '1.25rem', color: '#ea580c', margin: '0 4px' }}>
                    {directedTotal}
                  </strong>
                  张贺卡（不除以 2）
                </span>
              ) : (
                <span>
                  每两人之间只握手一次，总共握手：
                  <strong style={{ fontSize: '1.25rem', color: '#dc2626', margin: '0 4px' }}>
                    {totalPairsHandshake}
                  </strong>
                  次（除以 2）
                </span>
              )}
            </div>

            {/* 圆形连线 SVG */}
            <div style={{ width: '100%', maxWidth: '480px', height: '260px' }}>
              <svg viewBox="0 0 480 260" width="100%" height="260">
                {/* 连线网络 */}
                {peopleNodes.map((p1, i) =>
                  peopleNodes.slice(i + 1).map((p2) => (
                    <line
                      key={`${p1.index}-${p2.index}`}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={isDirected ? '#f97316' : '#10b981'}
                      strokeWidth={isDirected ? 1.8 : 2}
                      strokeDasharray={isDirected ? '4 3' : 'none'}
                    />
                  ))
                )}

                {/* 环形人物节点 */}
                {peopleNodes.map((node) => (
                  <g key={node.index}>
                    <circle cx={node.x} cy={node.y} r="18" fill="#ffffff" stroke="#059669" strokeWidth="2.5" />
                    <text
                      x={node.x}
                      y={node.y + 5}
                      fontSize="11"
                      fontWeight="800"
                      fill="#065f46"
                      textAnchor="middle"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* 核心区别辨析卡片 */}
            <div
              style={{
                width: '100%',
                maxWidth: '560px',
                background: '#ffffff',
                border: '1.5px solid #86efac',
                borderRadius: '8px',
                padding: '12px 16px',
                marginTop: '10px',
              }}
            >
              <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.95rem' }}>
                💡 考场常考的两大易混马甲辨析：
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', fontSize: '0.85rem' }}>
                <div style={{ background: '#f0fdf4', padding: '8px 10px', borderRadius: '6px' }}>
                  <strong>🤝 必须除以 2 的情境（双向无序）：</strong>
                  握手、碰杯庆祝、足球单循环赛、连线段、两点确定一条直线。
                  <div style={{ color: '#047857', fontWeight: 700, marginTop: '2px' }}>
                    算式：n × (n - 1) ÷ 2（因为你和我握手 = 我和你握手，是一回事）
                  </div>
                </div>

                <div style={{ background: '#fff7ed', padding: '8px 10px', borderRadius: '6px' }}>
                  <strong>💌 绝对不能除以 2 的情境（单向有序）：</strong>
                  互赠贺卡、互送照片、互通单向电话、火车站单程车票种类。
                  <div style={{ color: '#c2410c', fontWeight: 700, marginTop: '2px' }}>
                    算式：n × (n - 1)（因为我送你一张卡片，你也要回赠我一张卡片，是两回事！）
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 控制条区 */}
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* 情境切换开关 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                切换考题情境：
              </span>
              <button
                onClick={() => setIsDirected(false)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: !isDirected ? '#059669' : '#ffffff',
                  color: !isDirected ? '#ffffff' : '#334155',
                  fontSize: '0.85rem',
                  fontWeight: !isDirected ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                🤝 握手 / 比赛（除以2）
              </button>
              <button
                onClick={() => setIsDirected(true)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: isDirected ? '#ea580c' : '#ffffff',
                  color: isDirected ? '#ffffff' : '#334155',
                  fontSize: '0.85rem',
                  fontWeight: isDirected ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                💌 互送贺卡 / 车票（不除以2）
              </button>
            </div>

            {/* 人数调整按钮 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                参与人数 n：
              </span>
              {[3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => setPeopleCount(n)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: peopleCount === n ? '#059669' : '#ffffff',
                    color: peopleCount === n ? '#ffffff' : '#334155',
                    fontSize: '0.82rem',
                    fontWeight: peopleCount === n ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {n} 人
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景三：网格棋盘对角线透视 */}
      {/* ========================================================================= */}
      {mode === 'matrix' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 画布核心区 */}
          <div
            style={{
              background: '#fffbeb',
              border: '1.5px solid #fef3c7',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#92400e', marginBottom: '8px' }}>
              棋盘矩阵透视：对角线对折，上半区正好是下半区的镜像！
            </div>
            <div style={{ fontSize: '0.85rem', color: '#b45309', marginBottom: '16px' }}>
              总格子数 n² = {pointCount * pointCount}，扣去对角线自己的 {pointCount} 个，剩余对半平分！
            </div>

            {/* 矩阵表格图解 */}
            <div style={{ overflowX: 'auto', padding: '4px' }}>
              <table style={{ borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '6px 10px', color: '#64748b' }}>配对</th>
                    {Array.from({ length: pointCount }).map((_, col) => (
                      <th key={col} style={{ padding: '6px 10px', color: '#2563eb', fontWeight: 800 }}>
                        {String.fromCharCode(65 + col)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: pointCount }).map((_, row) => (
                    <tr key={row}>
                      <td style={{ padding: '6px 10px', fontWeight: 800, color: '#2563eb' }}>
                        {String.fromCharCode(65 + row)}
                      </td>
                      {Array.from({ length: pointCount }).map((_, col) => {
                        const isSelf = row === col;
                        const isUpper = row < col;
                        return (
                          <td
                            key={col}
                            style={{
                              width: '42px',
                              height: '36px',
                              border: '1px solid #cbd5e1',
                              background: isSelf ? '#f1f5f9' : isUpper ? '#dbeafe' : '#fef3c7',
                              color: isSelf ? '#94a3b8' : isUpper ? '#1d4ed8' : '#b45309',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                            }}
                          >
                            {isSelf
                              ? '✖'
                              : isUpper
                              ? `${String.fromCharCode(65 + row)}${String.fromCharCode(65 + col)}`
                              : `${String.fromCharCode(65 + row)}${String.fromCharCode(65 + col)}`}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 图例说明 */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                marginTop: '14px',
                fontSize: '0.82rem',
                justifyContent: 'center',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '12px', height: '12px', background: '#f1f5f9', border: '1px solid #cbd5e1', display: 'inline-block' }} />
                对角线 (自己与自己，无效)：{pointCount} 格
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '12px', height: '12px', background: '#dbeafe', border: '1px solid #bfdbfe', display: 'inline-block' }} />
                上半区有效线段 (蓝色)：{totalPairsSeg} 条
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '12px', height: '12px', background: '#fef3c7', border: '1px solid #fde68a', display: 'inline-block' }} />
                下半区完全重复 (黄色镜像)：{totalPairsSeg} 条
              </span>
            </div>

            {/* 代数守恒 */}
            <div
              style={{
                marginTop: '12px',
                background: '#ffffff',
                border: '1px solid #fde047',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: 800,
                color: '#854d0e',
              }}
            >
              (总格子 {pointCount}² - 对角线 {pointCount}) ÷ 2 = ({pointCount * pointCount} - {pointCount}) ÷ 2 = {totalPairsSeg}！
            </div>
          </div>

          {/* 控制条区 */}
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#92400e' }}>
              调整矩阵阶数 n：
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setPointCount(n)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: pointCount === n ? '#d97706' : '#ffffff',
                    color: pointCount === n ? '#ffffff' : '#334155',
                    fontSize: '0.85rem',
                    fontWeight: pointCount === n ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {n} 阶棋盘
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 底部辅导口诀总结 */}
      <div
        style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '8px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'space-around',
          fontSize: '0.84rem',
          color: '#475569',
        }}
      >
        <span>📏 <strong>数线段：</strong>端点发射阶梯加，1 一直加到 n-1</span>
        <span>🤝 <strong>握手对决：</strong>每两人只一次，n(n-1) 必须除以 2</span>
        <span>💌 <strong>互赠礼物：</strong>来回两份各一张，n(n-1) 绝对不除 2</span>
      </div>
    </div>
  );
}

