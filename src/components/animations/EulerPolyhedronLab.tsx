'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, Layers, CheckCircle2, Eye, ShieldCheck } from 'lucide-react';

interface PolyhedronData {
  id: string;
  name: string;
  v: number;
  e: number;
  f: number;
  desc: string;
  facesDesc: string;
  // 简化投影顶点 (x, y) 归一化在 200x200 画布
  vertices: { x: number; y: number }[];
  edges: [number, number][];
}

const POLYHEDRA: PolyhedronData[] = [
  {
    id: 'tetrahedron',
    name: '正四面体 (4面)',
    v: 4,
    e: 6,
    f: 4,
    desc: '最坚固的几何骨架，由 4 个正三角形围成',
    facesDesc: '4个等边三角形',
    vertices: [
      { x: 100, y: 30 },
      { x: 35, y: 155 },
      { x: 165, y: 155 },
      { x: 100, y: 110 },
    ],
    edges: [
      [0, 1], [0, 2], [0, 3],
      [1, 2], [1, 3], [2, 3],
    ],
  },
  {
    id: 'cube',
    name: '正六面体 (立方体)',
    v: 8,
    e: 12,
    f: 6,
    desc: '最熟悉的立体积木，由 6 个正方形围成',
    facesDesc: '6个正方形',
    vertices: [
      { x: 55, y: 65 }, { x: 125, y: 65 }, { x: 125, y: 135 }, { x: 55, y: 135 },
      { x: 85, y: 35 }, { x: 155, y: 35 }, { x: 155, y: 105 }, { x: 85, y: 105 },
    ],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 0], // 前面
      [4, 5], [5, 6], [6, 7], [7, 4], // 后面
      [0, 4], [1, 5], [2, 6], [3, 7], // 连接棱
    ],
  },
  {
    id: 'octahedron',
    name: '正八面体 (8面)',
    v: 6,
    e: 12,
    f: 8,
    desc: '天然钻石水晶双金字塔，由 8 个正三角形围成',
    facesDesc: '8个等边三角形',
    vertices: [
      { x: 100, y: 25 },
      { x: 45, y: 100 },
      { x: 100, y: 120 },
      { x: 155, y: 100 },
      { x: 100, y: 80 },
      { x: 100, y: 175 },
    ],
    edges: [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [5, 1], [5, 2], [5, 3], [5, 4],
      [1, 2], [2, 3], [3, 4], [4, 1],
    ],
  },
  {
    id: 'pyramid',
    name: '四棱锥 (金字塔)',
    v: 5,
    e: 8,
    f: 5,
    desc: '古埃及胡夫金字塔模型：1个正方形底面 + 4个三角形侧面',
    facesDesc: '1个四边形 + 4个三角形',
    vertices: [
      { x: 100, y: 35 },
      { x: 40, y: 145 },
      { x: 115, y: 165 },
      { x: 160, y: 140 },
      { x: 85, y: 120 },
    ],
    edges: [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [1, 2], [2, 3], [3, 4], [4, 1],
    ],
  },
  {
    id: 'soccer',
    name: '足球多面体 (截角二十面体)',
    v: 60,
    e: 90,
    f: 32,
    desc: '经典黑白皮足球：12个黑色五边形 + 20个白色六边形',
    facesDesc: '12个五边形 + 20个六边形',
    vertices: [
      { x: 100, y: 45 }, { x: 75, y: 65 }, { x: 85, y: 95 }, { x: 115, y: 95 }, { x: 125, y: 65 },
      { x: 50, y: 80 }, { x: 60, y: 120 }, { x: 100, y: 140 }, { x: 140, y: 120 }, { x: 150, y: 80 },
    ],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
      [1, 5], [2, 6], [3, 7], [4, 8], [0, 9],
      [5, 6], [6, 7], [7, 8], [8, 9], [9, 5],
    ],
  },
];

export default function EulerPolyhedronLab() {
  const [selectedIdx, setSelectedIdx] = useState<number>(1); // 默认正方体
  const [highlightMode, setHighlightMode] = useState<'all' | 'vertices' | 'edges' | 'faces'>('all');

  const current = POLYHEDRA[selectedIdx];
  const eulerValue = current.v - current.e + current.f;

  return (
    <div className={styles.container}>
      {/* 头部标题与多面体切换 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            欧拉示性数与多面体守恒实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            顶点数 $V$ - 棱数 $E$ + 面数 $F$ 恒等于 2：空间拓扑学第一不变量
          </p>
        </div>

        {/* 高亮元素选择 */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setHighlightMode('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              highlightMode === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            全部显示
          </button>
          <button
            onClick={() => setHighlightMode('vertices')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              highlightMode === 'vertices' ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            看顶点 V
          </button>
          <button
            onClick={() => setHighlightMode('edges')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              highlightMode === 'edges' ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            看棱数 E
          </button>
          <button
            onClick={() => setHighlightMode('faces')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              highlightMode === 'faces' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            看面数 F
          </button>
        </div>
      </div>

      {/* 预设多面体按钮卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {POLYHEDRA.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setSelectedIdx(idx)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedIdx === idx
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 shadow-sm'
                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{p.name}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">V={p.v}, E={p.e}, F={p.f}</div>
          </button>
        ))}
      </div>

      {/* 立体透视图画布与动态计数展示 */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-6 flex flex-col items-center">
        <div className="w-full max-w-sm aspect-square relative flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full select-none">
            <defs>
              <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* 绘制半透明面 */}
            {highlightMode !== 'edges' && highlightMode !== 'vertices' && (
              <polygon
                points={current.vertices.map((v) => `${v.x},${v.y}`).join(' ')}
                fill="url(#faceGrad)"
                stroke="none"
              />
            )}

            {/* 绘制所有棱线 */}
            {current.edges.map(([i1, i2], idx) => {
              const p1 = current.vertices[i1];
              const p2 = current.vertices[i2];
              if (!p1 || !p2) return null;
              const isHighlight = highlightMode === 'all' || highlightMode === 'edges';
              return (
                <line
                  key={`edge-${idx}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={isHighlight ? '#38bdf8' : 'rgba(255,255,255,0.15)'}
                  strokeWidth={isHighlight ? '2.5' : '1'}
                  strokeLinecap="round"
                />
              );
            })}

            {/* 绘制所有顶点 */}
            {current.vertices.map((v, idx) => {
              const isHighlight = highlightMode === 'all' || highlightMode === 'vertices';
              return (
                <g key={`vertex-${idx}`}>
                  <circle
                    cx={v.x}
                    cy={v.y}
                    r={isHighlight ? 5 : 3}
                    fill={isHighlight ? '#f43f5e' : '#64748b'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  {current.v <= 8 && isHighlight && (
                    <text
                      x={v.x + 8}
                      y={v.y - 6}
                      fill="#f43f5e"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {idx + 1}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* 说明 */}
        <div className="mt-2 text-center text-xs text-slate-400">
          <span>{current.desc} ({current.facesDesc})</span>
        </div>
      </div>

      {/* 欧拉公式计算器看板 */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-rose-500 font-bold">顶点数 (Vertices) V</span>
          <div className="text-2xl font-black text-rose-500 mt-1">{current.v} 个</div>
          <span className="text-xs text-slate-400 mt-0.5">立体的尖角节点</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-sky-500 font-bold">棱数 (Edges) E</span>
          <div className="text-2xl font-black text-sky-500 mt-1">{current.e} 条</div>
          <span className="text-xs text-slate-400 mt-0.5">面与面交汇的骨架边</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-emerald-500 font-bold">面数 (Faces) F</span>
          <div className="text-2xl font-black text-emerald-500 mt-1">{current.f} 面</div>
          <span className="text-xs text-slate-400 mt-0.5">{current.facesDesc}</span>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 rounded-xl shadow-md flex flex-col justify-center">
          <span className="text-xs text-indigo-100 font-semibold">欧拉示性数 V - E + F</span>
          <div className="text-2xl font-black mt-1 flex items-center gap-1.5">
            <span>{current.v} - {current.e} + {current.f} =</span>
            <span className="text-amber-300 text-3xl font-black">{eulerValue}</span>
          </div>
          <span className="text-xs text-indigo-100 mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 完美守恒恒等于 2！
          </span>
        </div>
      </div>

      {/* 柯西展开法与拓扑哲学卡片 */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
        <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> 为什么任何凸多面体算出来都是 2？
        </div>
        <p>
          <strong>橡皮泥压平原理</strong>：把多面体看作橡皮膜气球，戳穿底下一个面（面数减1）拉平成平面网格（示性数等于 1）。每次在网格里画一条新棱就多出一个新面，增减相消；逐步剥离外部三角形，示性数恒定不变，最后剩下一个单三角形（3点3边1面，3 - 3 + 1 = 1）。加上原先抠除的底面，总和锁死为 1 + 1 = 2！
        </p>
      </div>
    </div>
  );
}

