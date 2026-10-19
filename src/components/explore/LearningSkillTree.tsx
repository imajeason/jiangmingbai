'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TopicItem } from '@/types';
import { STAGES, SUBJECTS } from '@/data/constants';
import { Sparkles, ArrowRight, GitFork, CheckCircle2, AlertCircle, Eye, Network, LayoutGrid } from 'lucide-react';

interface NodePosition {
  slug: string;
  x: number;
  y: number;
  tier: number; // 1: 低年级启蒙, 2: 中年级模型, 3: 高年级极限几何, 4: 初中数理
}

// 预设节点在知识图谱画布中的拓扑坐标 (画布: 960 x 560)
const NODE_POSITIONS: Record<string, { x: number; y: number; tier: number }> = {
  // Tier 1: 低幼认知与数感启蒙 (y ~ 90)
  'front-back-left-right': { x: 120, y: 80, tier: 1 },
  'compass-directions': { x: 280, y: 80, tier: 1 },
  'clock-reading': { x: 440, y: 80, tier: 1 },
  'ten-frame-addition-subtraction': { x: 620, y: 80, tier: 1 },
  'line-up-ordering': { x: 800, y: 80, tier: 1 },

  // Tier 2: 二三四年级：模型建立与转化 (y ~ 220)
  'transfer-and-balance': { x: 180, y: 220, tier: 2 },
  'multiplication-array': { x: 380, y: 220, tier: 2 },
  'perimeter-vs-area': { x: 580, y: 220, tier: 2 },
  'hidden-cubes-counting': { x: 780, y: 220, tier: 2 },

  // Tier 3: 四五六年级：几何割补与复杂应用 (y ~ 360)
  'chicken-rabbit-cage': { x: 300, y: 360, tier: 3 },
  'triangle-area-parallelogram': { x: 600, y: 360, tier: 3 },

  // Tier 4: 六年级与初中：极限与公理证明 (y ~ 490)
  'circle-area': { x: 440, y: 490, tier: 4 },
  'pythagorean-theorem': { x: 700, y: 490, tier: 4 },
  'buoyancy-archimedes': { x: 180, y: 490, tier: 4 },
};

// 知识点前置依赖边连接 (source -> target: 学了 source 是 target 的前置)
const EDGES: { from: string; to: string; label: string }[] = [
  { from: 'front-back-left-right', to: 'compass-directions', label: '空间方位基础' },
  { from: 'ten-frame-addition-subtraction', to: 'transfer-and-balance', label: '加减法与基准数' },
  { from: 'ten-frame-addition-subtraction', to: 'multiplication-array', label: '相同加数累加' },
  { from: 'line-up-ordering', to: 'multiplication-array', label: '行列队列感知' },
  { from: 'transfer-and-balance', to: 'chicken-rabbit-cage', label: '差量补偿思想' },
  { from: 'multiplication-array', to: 'chicken-rabbit-cage', label: '乘除倍数与假设法' },
  { from: 'multiplication-array', to: 'perimeter-vs-area', label: '长宽乘积即面积' },
  { from: 'perimeter-vs-area', to: 'triangle-area-parallelogram', label: '长方形面积基础' },
  { from: 'hidden-cubes-counting', to: 'triangle-area-parallelogram', label: '几何空间透视' },
  { from: 'triangle-area-parallelogram', to: 'circle-area', label: '割补转化思想' },
  { from: 'triangle-area-parallelogram', to: 'pythagorean-theorem', label: '直角三角形面积' },
];

interface LearningSkillTreeProps {
  topics: TopicItem[];
}

export default function LearningSkillTree({ topics }: LearningSkillTreeProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>('triangle-area-parallelogram');
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const activeSlug = hoveredSlug || selectedSlug;
  const activeTopic = topics.find((t) => t.slug === activeSlug);

  // 计算当前高亮的前置节点与后继节点
  const activePrereqSlugs = EDGES.filter((e) => e.to === activeSlug).map((e) => e.from);
  const activeNextSlugs = EDGES.filter((e) => e.from === activeSlug).map((e) => e.to);

  return (
    <div style={{ marginTop: '20px', marginBottom: '40px' }}>
      {/* 技能树主交互容器 */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* 顶部指示条 */}
        <div
          style={{
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Network size={18} color="#2563eb" />
            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>
              数理思维认知拓扑图谱 (DAG Skill Tree)
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '12px',
                background: '#e0f2fe',
                color: '#0369a1',
                fontWeight: 600,
              }}
            >
              启发自 Marble Skill Taxonomy
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              前置短板
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb' }} />
              当前选中
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              进阶后继
            </span>
          </div>
        </div>

        {/* 双栏布局：左侧 SVG 拓扑图，右侧知识点探针卡 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '520px' }}>
          {/* 左侧拓扑网络图 */}
          <div
            style={{
              flex: '1 1 580px',
              position: 'relative',
              background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #f8fafc 100%)',
              padding: '16px',
              overflowX: 'auto',
            }}
          >
            <svg
              viewBox="0 0 960 560"
              width="100%"
              height="100%"
              style={{ minWidth: '700px', maxHeight: '560px' }}
            >
              <defs>
                <marker
                  id="edgeArrow"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 2 L 8 5 L 0 8 z" fill="#94a3b8" />
                </marker>
                <marker
                  id="edgeArrowActive"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <path d="M 0 2 L 8 5 L 0 8 z" fill="#2563eb" />
                </marker>

                {/* 阶梯分层背景虚线 */}
                <pattern id="dotPattern" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="#e2e8f0" />
                </pattern>
              </defs>

              <rect x="0" y="0" width="960" height="560" fill="url(#dotPattern)" />

              {/* 阶段认知虚线分割线 */}
              <g stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1">
                <line x1="40" y1="150" x2="920" y2="150" />
                <line x1="40" y1="290" x2="920" y2="290" />
                <line x1="40" y1="430" x2="920" y2="430" />
              </g>

              {/* 阶段层级标签 */}
              <text x="50" y="40" fontSize="11" fill="#94a3b8" fontWeight="700">第一阶：直观生活与数感启蒙（一二年级）</text>
              <text x="50" y="175" fontSize="11" fill="#94a3b8" fontWeight="700">第二阶：二维模型与转化思想（二三年级）</text>
              <text x="50" y="315" fontSize="11" fill="#94a3b8" fontWeight="700">第三阶：多步假设与几何割补（四五年级）</text>
              <text x="50" y="455" fontSize="11" fill="#94a3b8" fontWeight="700">第四阶：极限思想与严密公理（六年级与初中）</text>

              {/* 渲染边线 (Edges) */}
              {EDGES.map((edge, idx) => {
                const source = NODE_POSITIONS[edge.from];
                const target = NODE_POSITIONS[edge.to];
                if (!source || !target) return null;

                const isConnectedToActive =
                  (edge.from === activeSlug && edge.to === activeSlug) ||
                  edge.to === activeSlug ||
                  edge.from === activeSlug;

                const isPrereqEdge = edge.to === activeSlug;
                const isNextEdge = edge.from === activeSlug;

                let strokeColor = '#cbd5e1';
                let strokeWidth = 1.5;
                let strokeDash = 'none';

                if (isPrereqEdge) {
                  strokeColor = '#f59e0b';
                  strokeWidth = 2.8;
                } else if (isNextEdge) {
                  strokeColor = '#10b981';
                  strokeWidth = 2.8;
                }

                // 优雅的贝塞尔曲线
                const midY = (source.y + target.y) / 2;
                const pathD = `M ${source.x} ${source.y} C ${source.x} ${midY}, ${target.x} ${midY}, ${target.x} ${target.y}`;

                return (
                  <path
                    key={idx}
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                    markerEnd={isConnectedToActive ? 'url(#edgeArrowActive)' : 'url(#edgeArrow)'}
                    style={{ transition: 'all 0.25s ease' }}
                  />
                );
              })}

              {/* 渲染节点 (Nodes) */}
              {topics.map((t) => {
                const pos = NODE_POSITIONS[t.slug];
                if (!pos) return null;

                const isSelected = t.slug === selectedSlug;
                const isHovered = t.slug === hoveredSlug;
                const isPrereq = activePrereqSlugs.includes(t.slug);
                const isNext = activeNextSlugs.includes(t.slug);

                let nodeColor = '#3b82f6';
                let strokeColor = '#ffffff';
                let radius = 18;

                if (isSelected || isHovered) {
                  nodeColor = '#2563eb';
                  strokeColor = '#93c5fd';
                  radius = 22;
                } else if (isPrereq) {
                  nodeColor = '#f59e0b';
                  strokeColor = '#fde68a';
                  radius = 20;
                } else if (isNext) {
                  nodeColor = '#10b981';
                  strokeColor = '#a7f3d0';
                  radius = 20;
                }

                return (
                  <g
                    key={t.slug}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedSlug(t.slug)}
                    onMouseEnter={() => setHoveredSlug(t.slug)}
                    onMouseLeave={() => setHoveredSlug(null)}
                  >
                    {/* 发光外圈 */}
                    {(isSelected || isHovered) && (
                      <circle cx="0" cy="0" r="28" fill="#3b82f6" fillOpacity="0.2" />
                    )}

                    {/* 主节点圆 */}
                    <circle
                      cx="0"
                      cy="0"
                      r={radius}
                      fill={nodeColor}
                      stroke={strokeColor}
                      strokeWidth="3"
                      style={{ transition: 'all 0.2s ease', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                    />

                    {/* 节点序号或图标 */}
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#ffffff"
                      fontWeight="800"
                    >
                      {pos.tier}
                    </text>

                    {/* 节点标题标签 */}
                    <rect
                      x="-65"
                      y={radius + 6}
                      width="130"
                      height="20"
                      rx="4"
                      fill="#ffffff"
                      fillOpacity="0.95"
                      stroke={isSelected ? '#2563eb' : '#e2e8f0'}
                      strokeWidth={isSelected ? '1.5' : '1'}
                    />
                    <text
                      x="0"
                      y={radius + 20}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight={isSelected ? '800' : '600'}
                      fill={isSelected ? '#1e40af' : '#334155'}
                    >
                      {t.title.length > 8 ? `${t.title.substring(0, 8)}...` : t.title}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 右侧：选中知识点诊断与探针卡片 */}
          <div
            style={{
              flex: '1 1 320px',
              borderLeft: '1px solid var(--color-border)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              background: '#ffffff',
            }}
          >
            {activeTopic ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge badge-blue">
                    {STAGES[activeTopic.stage]?.name}
                  </span>
                  <span
                    className="badge"
                    style={{
                      background: `${SUBJECTS[activeTopic.subject]?.color}15`,
                      color: SUBJECTS[activeTopic.subject]?.color,
                    }}
                  >
                    {SUBJECTS[activeTopic.subject]?.name}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{activeTopic.grade}</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: '4px 0 8px' }}>
                  {activeTopic.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, marginBottom: '16px' }}>
                  {activeTopic.subtitle}
                </p>

                {/* 认知短板前置排查 */}
                {activeTopic.prerequisites && activeTopic.prerequisites.length > 0 && (
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: '#fffbeb',
                      border: '1px solid #fef3c7',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#b45309', marginBottom: '6px' }}>
                      <AlertCircle size={14} />
                      <span>前置核心短板 (Prerequisites)</span>
                    </div>
                    {activeTopic.prerequisites.map((p, idx) => (
                      <div key={idx} style={{ fontSize: '0.775rem', color: '#78350f', lineHeight: 1.4, marginBottom: '4px' }}>
                        • <strong>{p.title}</strong>：{p.reason}
                      </div>
                    ))}
                  </div>
                )}

                {/* 掌握证据 */}
                {activeTopic.evidence && activeTopic.evidence.length > 0 && (
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#15803d', marginBottom: '6px' }}>
                      <CheckCircle2 size={14} />
                      <span>掌握判定标尺 (Mastery Evidence)</span>
                    </div>
                    {activeTopic.evidence.slice(0, 2).map((ev, idx) => (
                      <div key={idx} style={{ fontSize: '0.775rem', color: '#166534', lineHeight: 1.4, marginBottom: '3px' }}>
                        ✓ {ev}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <Link
                    href={`/${activeTopic.stage}/${activeTopic.subject}/${activeTopic.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      background: 'var(--color-primary)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <span>开启动画交互实验室</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '0.875rem' }}>
                点击左侧拓扑图中的任意知识点进行诊断
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
