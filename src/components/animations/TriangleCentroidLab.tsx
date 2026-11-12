'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, Info, Layers } from 'lucide-react';

export default function TriangleCentroidLab() {
  // 顶点坐标状态 (SVG 画布 400 x 320)
  // 默认任意斜三角形
  const [topX, setTopX] = useState<number>(180);
  const [topY, setTopY] = useState<number>(40);
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);

  // 固定底边 B 和 C
  const B = { x: 50, y: 270 };
  const C = { x: 350, y: 270 };
  const A = { x: topX, y: topY };

  // 计算三边中点
  const D = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 }; // BC 中点
  const E = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 }; // AC 中点
  const F = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }; // AB 中点

  // 重心 G (三顶点坐标的代数平均值)
  const G = {
    x: (A.x + B.x + C.x) / 3,
    y: (A.y + B.y + C.y) / 3,
  };

  // 鞋带公式计算三角形面积
  const triangleArea = (p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }) => {
    return Math.abs((p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2);
  };

  const totalArea = triangleArea(A, B, C);
  const subAreaIdeal = totalArea / 6;

  // 6 个子三角形定义 (逆时针排列)
  const subTriangles = [
    { name: '△AFG', points: [A, F, G], color: '#6366f1', label: '① AFG' },
    { name: '△BFG', points: [B, F, G], color: '#3b82f6', label: '② BFG' },
    { name: '△BDG', points: [B, D, G], color: '#10b981', label: '③ BDG' },
    { name: '△CDG', points: [C, D, G], color: '#14b8a6', label: '④ CDG' },
    { name: '△CEG', points: [C, E, G], color: '#f59e0b', label: '⑤ CEG' },
    { name: '△AEG', points: [A, E, G], color: '#ec4899', label: '⑥ AEG' },
  ];

  // 计算重心到顶点与到对边中点的线段长度 (验证 2:1)
  const dist = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  };

  const distAG = dist(A, G);
  const distGD = dist(G, D);
  const ratioAD = (distAG / distGD).toFixed(2);

  // 预设三角形类型
  const applyPreset = (type: 'acute' | 'right' | 'obtuse') => {
    if (type === 'acute') {
      setTopX(180);
      setTopY(40);
    } else if (type === 'right') {
      setTopX(50);
      setTopY(60);
    } else if (type === 'obtuse') {
      setTopX(320);
      setTopY(80);
    }
  };

  return (
    <div className={styles.container}>
      {/* 头部标题 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            三角形重心与六等分面积动态探究实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            任意三角形三中线交于重心 $G$：将中线分为 $2:1$，且 6 块面积永恒相等！
          </p>
        </div>

        {/* 预设按钮 */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => applyPreset('acute')}
            className="px-2.5 py-1 text-xs font-semibold rounded text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition"
          >
            锐角三角形
          </button>
          <button
            onClick={() => applyPreset('right')}
            className="px-2.5 py-1 text-xs font-semibold rounded text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition"
          >
            直角三角形
          </button>
          <button
            onClick={() => applyPreset('obtuse')}
            className="px-2.5 py-1 text-xs font-semibold rounded text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition"
          >
            钝角三角形
          </button>
        </div>
      </div>

      {/* SVG 画布主区域 */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 mb-6 flex flex-col items-center">
        <div className="w-full max-w-lg aspect-[400/320] relative">
          <svg viewBox="0 0 400 320" className="w-full h-full select-none">
            {/* 绘制 6 个小三角形 */}
            {subTriangles.map((tri, idx) => {
              const pts = `${tri.points[0].x},${tri.points[0].y} ${tri.points[1].x},${tri.points[1].y} ${tri.points[2].x},${tri.points[2].y}`;
              const isHighlighted = highlightIdx === null || highlightIdx === idx;
              // 重心中心点作为文字位置
              const cx = (tri.points[0].x + tri.points[1].x + tri.points[2].x) / 3;
              const cy = (tri.points[0].y + tri.points[1].y + tri.points[2].y) / 3;

              return (
                <g key={tri.name} onMouseEnter={() => setHighlightIdx(idx)} onMouseLeave={() => setHighlightIdx(null)}>
                  <polygon
                    points={pts}
                    fill={tri.color}
                    fillOpacity={isHighlighted ? 0.35 : 0.1}
                    stroke={tri.color}
                    strokeWidth={isHighlighted && highlightIdx === idx ? '2.5' : '1.5'}
                    className="cursor-pointer transition-all duration-200"
                  />
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    className="pointer-events-none drop-shadow"
                  >
                    1/6 S
                  </text>
                </g>
              );
            })}

            {/* 绘制三条中线 AD, BE, CF */}
            <line x1={A.x} y1={A.y} x2={D.x} y2={D.y} stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 3" />
            <line x1={B.x} y1={B.y} x2={E.x} y2={E.y} stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 3" />
            <line x1={C.x} y1={C.y} x2={F.x} y2={F.y} stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 3" />

            {/* 绘制三角形大外框 */}
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#e2e8f0" strokeWidth="2.5" />
            <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke="#e2e8f0" strokeWidth="2.5" />
            <line x1={C.x} y1={C.y} x2={A.x} y2={A.y} stroke="#e2e8f0" strokeWidth="2.5" />

            {/* 顶点标签 */}
            <text x={A.x} y={A.y - 12} textAnchor="middle" fill="#f8fafc" fontSize="14" fontWeight="bold">A</text>
            <text x={B.x - 14} y={B.y + 6} textAnchor="middle" fill="#f8fafc" fontSize="14" fontWeight="bold">B</text>
            <text x={C.x + 14} y={C.y + 6} textAnchor="middle" fill="#f8fafc" fontSize="14" fontWeight="bold">C</text>

            {/* 中点标记 D, E, F */}
            <circle cx={D.x} cy={D.y} r="4" fill="#38bdf8" />
            <text x={D.x} y={D.y + 18} textAnchor="middle" fill="#38bdf8" fontSize="11">D(中点)</text>

            <circle cx={E.x} cy={E.y} r="4" fill="#38bdf8" />
            <text x={E.x + 18} y={E.y - 6} textAnchor="middle" fill="#38bdf8" fontSize="11">E(中点)</text>

            <circle cx={F.x} cy={F.y} r="4" fill="#38bdf8" />
            <text x={F.x - 18} y={F.y - 6} textAnchor="middle" fill="#38bdf8" fontSize="11">F(中点)</text>

            {/* 重心 G 突出标出 */}
            <circle cx={G.x} cy={G.y} r="6" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
            <text x={G.x + 14} y={G.y + 4} fill="#fbbf24" fontSize="14" fontWeight="black">G (重心)</text>
          </svg>
        </div>
        <div className="text-xs text-slate-400 mt-2">
          💡 鼠标悬停在上方任意小三角形上查看高亮与对应面积
        </div>
      </div>

      {/* 实时数据与定理验证 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">大三角形面积 S(△ABC)</span>
          <div className="text-2xl font-black text-indigo-500 mt-1">{totalArea.toFixed(1)}</div>
          <span className="text-xs text-slate-400 mt-0.5">底 $\times$ 高 $\div 2$</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">各小三角形面积（六等分）</span>
          <div className="text-2xl font-black text-emerald-500 mt-1">{subAreaIdeal.toFixed(1)}</div>
          <span className="text-xs text-slate-400 mt-0.5">严格等于总面积的 $1/6$</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">重心分中线比例 $AG : GD$</span>
          <div className="text-2xl font-black text-amber-500 mt-1 font-mono">{ratioAD} : 1 ≈ 2 : 1</div>
          <span className="text-xs text-slate-400 mt-0.5">重心到顶点 = 2倍到中点</span>
        </div>
      </div>

      {/* 顶点 A 自由调控滑块 */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          动态改变顶点 A 位置（任意改变三角形形状，六等分恒成立）：
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-16">水平 X 坐标</span>
            <input
              type="range"
              min={60}
              max={340}
              value={topX}
              onChange={(e) => setTopX(Number(e.target.value))}
              className="flex-1 accent-indigo-600"
            />
            <span className="text-xs font-mono w-8">{topX}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-16">高度 Y 坐标</span>
            <input
              type="range"
              min={30}
              max={200}
              value={topY}
              onChange={(e) => setTopY(Number(e.target.value))}
              className="flex-1 accent-indigo-600"
            />
            <span className="text-xs font-mono w-8">{topY}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

