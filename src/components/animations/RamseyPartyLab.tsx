'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Users, Sparkles, Wand2, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function RamseyPartyLab() {
  const [numPeople, setNumPeople] = useState<6 | 5>(6); // 6人(必有) vs 5人(可构造避开)
  const [proofStep, setProofStep] = useState<number>(0);

  // 6 个顶点的配对边 (共 15 条边)
  // 边状态：'red' (认识) 或 'blue' (陌生)
  // 初始预设一套包含单色三角形的方案
  const [edges6, setEdges6] = useState<{ [key: string]: 'red' | 'blue' }>({
    '0-1': 'red',
    '0-2': 'red',
    '0-3': 'red',
    '0-4': 'blue',
    '0-5': 'blue',
    '1-2': 'blue',
    '1-3': 'blue',
    '1-4': 'red',
    '1-5': 'blue',
    '2-3': 'red', // 2-3为红，0-2为红，0-3为红 => 三角形 (0, 2, 3) 为全红！
    '2-4': 'blue',
    '2-5': 'red',
    '3-4': 'blue',
    '3-5': 'red',
    '4-5': 'red',
  });

  // 5 个人经典反例（外围正五边形全红，内部五角星全蓝，绝对无单色三角形）
  const edges5: { [key: string]: 'red' | 'blue' } = {
    '0-1': 'red',
    '1-2': 'red',
    '2-3': 'red',
    '3-4': 'red',
    '0-4': 'red',
    '0-2': 'blue',
    '0-3': 'blue',
    '1-3': 'blue',
    '1-4': 'blue',
    '2-4': 'blue',
  };

  const currentEdges = numPeople === 6 ? edges6 : edges5;

  // 顶点名字与坐标 (SVG 视口 340 x 300)
  const cx = 170;
  const cy = 150;
  const r = 110;
  const names = ['A', 'B', 'C', 'D', 'E', 'F'];

  const getPos = (idx: number, total: number) => {
    const angle = (idx * 2 * Math.PI) / total - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // 切换边颜色
  const toggleEdge = (u: number, v: number) => {
    if (numPeople === 5) return; // 5人模式固定展示反例
    const key = u < v ? `${u}-${v}` : `${v}-${u}`;
    const nextColor = edges6[key] === 'red' ? 'blue' : 'red';
    setEdges6({ ...edges6, [key]: nextColor });
  };

  // 随机重新染色
  const randomize6 = () => {
    const newEdges: { [key: string]: 'red' | 'blue' } = {};
    for (let i = 0; i < 6; i++) {
      for (let j = i + 1; j < 6; j++) {
        newEdges[`${i}-${j}`] = Math.random() > 0.5 ? 'red' : 'blue';
      }
    }
    setEdges6(newEdges);
  };

  // 检测所有三角形（寻找单色全红或全蓝三角形）
  const findMonochromaticTriangles = () => {
    const total = numPeople;
    const res: { nodes: [number, number, number]; color: 'red' | 'blue' }[] = [];

    for (let i = 0; i < total; i++) {
      for (let j = i + 1; j < total; j++) {
        for (let k = j + 1; k < total; k++) {
          const e1 = currentEdges[`${i}-${j}`];
          const e2 = currentEdges[`${j}-${k}`];
          const e3 = currentEdges[`${i}-${k}`];
          if (e1 && e1 === e2 && e2 === e3) {
            res.push({ nodes: [i, j, k], color: e1 });
          }
        }
      }
    }
    return res;
  };

  const monoTriangles = findMonochromaticTriangles();

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users className={styles.icon} />
          <h2 className={styles.title}>拉姆齐定理与六人聚会图论实验室</h2>
        </div>
        <p className={styles.description}>
          世界上任何 6 个人聚会，必然要么有 3 人互相认识（红三角形），要么有 3 人互相陌生（蓝三角形）！
        </p>
      </div>

      {/* 模式选择 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            setNumPeople(6);
            setProofStep(0);
          }}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: numPeople === 6 ? '#4f46e5' : '#f1f5f9',
            color: numPeople === 6 ? '#ffffff' : '#475569',
          }}
        >
          👥 6 人聚会（拉姆齐定律 R(3,3)=6，必有同色三人组）
        </button>
        <button
          onClick={() => setNumPeople(5)}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: numPeople === 5 ? '#ea580c' : '#f1f5f9',
            color: numPeople === 5 ? '#ffffff' : '#475569',
          }}
        >
          🖐️ 5 人反例（为何 5 个人可以完美避开？）
        </button>
      </div>

      {/* 主图论画板 */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <svg width="340" height="300" viewBox="0 0 340 300">
          {/* 单色三角形高亮填充区域 */}
          {monoTriangles.map((tri, tIdx) => {
            const p0 = getPos(tri.nodes[0], numPeople);
            const p1 = getPos(tri.nodes[1], numPeople);
            const p2 = getPos(tri.nodes[2], numPeople);
            const fillColor = tri.color === 'red' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(59, 130, 246, 0.25)';
            const strokeColor = tri.color === 'red' ? '#dc2626' : '#2563eb';

            return (
              <polygon
                key={tIdx}
                points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth="3"
                strokeLinejoin="round"
              />
            );
          })}

          {/* 绘制所有连线 */}
          {Array.from({ length: numPeople }).map((_, i) =>
            Array.from({ length: numPeople }).map((_, j) => {
              if (j <= i) return null;
              const p1 = getPos(i, numPeople);
              const p2 = getPos(j, numPeople);
              const key = `${i}-${j}`;
              const color = currentEdges[key] || 'red';

              return (
                <line
                  key={key}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={color === 'red' ? '#ef4444' : '#3b82f6'}
                  strokeWidth="2.5"
                  strokeOpacity="0.85"
                  onClick={() => toggleEdge(i, j)}
                  style={{ cursor: numPeople === 6 ? 'pointer' : 'default' }}
                />
              );
            })
          )}

          {/* 绘制顶点小人 */}
          {Array.from({ length: numPeople }).map((_, i) => {
            const pos = getPos(i, numPeople);
            const isHighlighted = proofStep === 1 && i === 0;

            return (
              <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
                <circle
                  cx="0"
                  cy="0"
                  r={isHighlighted ? '17' : '14'}
                  fill={isHighlighted ? '#4f46e5' : '#ffffff'}
                  stroke="#334155"
                  strokeWidth="2"
                />
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill={isHighlighted ? '#ffffff' : '#1e293b'}
                >
                  {names[i]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 交互提示与操作 */}
        {numPeople === 6 ? (
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={randomize6}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🎲 随机重新染红蓝线（挑战破坏单色）
            </button>
            <span style={{ fontSize: '12px', color: '#64748b' }}>（点击任意连线可切换红/蓝）</span>
          </div>
        ) : (
          <div style={{ marginTop: '10px', fontSize: '13px', color: '#ea580c', fontWeight: 600 }}>
            🔺 5人完美反例：外圈正五边形全红，内部对角五角星全蓝，没有任何单色三角形！
          </div>
        )}
      </div>

      {/* 实时检测报告条 */}
      <div
        style={{
          marginTop: '16px',
          padding: '12px 16px',
          borderRadius: '10px',
          backgroundColor: monoTriangles.length > 0 ? '#dcfce7' : '#fee2e2',
          border: `1px solid ${monoTriangles.length > 0 ? '#86efac' : '#fecdd3'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {monoTriangles.length > 0 ? (
          <>
            <CheckCircle2 color="#16a34a" size={20} />
            <div style={{ fontSize: '13px', color: '#15803d', fontWeight: 700 }}>
              🎉 成功检测到 {monoTriangles.length} 个单色三人组！
              {monoTriangles.map(
                (t, idx) =>
                  ` [${names[t.nodes[0]]},${names[t.nodes[1]]},${names[t.nodes[2]]}: 全${
                    t.color === 'red' ? '认识🔴' : '陌生🔵'
                  }]${idx < monoTriangles.length - 1 ? '、' : ''}`
              )}
            </div>
          </>
        ) : (
          <>
            <AlertTriangle color="#dc2626" size={20} />
            <span style={{ fontSize: '13px', color: '#b91c1c', fontWeight: 600 }}>
              当前图上没有单色三角形（仅在 5 人反例中可能存在，6 人完全图中数学上绝对不可能出现此情况！）
            </span>
          </>
        )}
      </div>

      {/* 抽屉原理 3 步严密证明导览 */}
      <div
        style={{
          marginTop: '16px',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles color="#4f46e5" size={18} />
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>
            为什么 6 个人必定无法避免？抽屉原理极简证明
          </span>
        </div>
        <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
          <div>
            <b>第一步（抽屉分配）：</b>任意抓出一个人 A，他向其余 5 个人引出 <b>5 条连线</b>。只有红、蓝两色，由抽屉原理
            ⌈5/2⌉ = <b>3 条同色线</b>！不妨设 A 连向 B、C、D 的是 3 条红线。
          </div>
          <div style={{ marginTop: '4px' }}>
            <b>第二步（互斥闭合）：</b>观察 B、C、D 之间：
            若有一条红线（如 BC 红），则 <b>A-B-C 构成全红三角形</b>！
            若一条红线都没有（全蓝），则 <b>B-C-D 自己构成全蓝三角形</b>！
          </div>
          <div style={{ marginTop: '4px', fontWeight: 700, color: '#4f46e5' }}>
            结论：无论怎么染，至少一个单色三角形必将不可阻挡地涌现！
          </div>
        </div>
      </div>
    </div>
  );
}

