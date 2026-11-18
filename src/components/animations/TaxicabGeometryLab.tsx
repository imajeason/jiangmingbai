'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, Compass, MapPin, Layers } from 'lucide-react';

export default function TaxicabGeometryLab() {
  const [pointA, setPointA] = useState<{ x: number; y: number }>({ x: 1, y: 1 });
  const [pointB, setPointB] = useState<{ x: number; y: number }>({ x: 5, y: 4 });
  const [showCircle, setShowCircle] = useState<boolean>(false);
  const [radiusR, setRadiusR] = useState<number>(3);

  // 计算距离
  const dx = Math.abs(pointB.x - pointA.x);
  const dy = Math.abs(pointB.y - pointA.y);
  const euclidDist = Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y).toFixed(2);
  const manhattanDist = dx + dy;

  // 组合数 C(dx+dy, dx)
  const comb = (n: number, k: number): number => {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    let res = 1;
    for (let i = 1; i <= k; i++) res = (res * (n - i + 1)) / i;
    return Math.round(res);
  };

  const pathCount = comb(dx + dy, dx);

  // SVG 坐标映射 (网格 0..7，映射到 40..280)
  const scale = 32;
  const pad = 40;
  const toSvgX = (x: number) => pad + x * scale;
  const toSvgY = (y: number) => pad + (7 - y) * scale;

  return (
    <div className={styles.container}>
      {/* 头部标题与控制栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            曼哈顿出租车几何与菱形圆周实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            横平竖直的街区距离 $|\Delta x| + |\Delta y|$：等距圆化作菱形方钻，圆周率神奇等于 4
          </p>
        </div>

        {/* 视向功能切换 */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setShowCircle(!showCircle)}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition ${
              showCircle ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {showCircle ? '隐藏曼哈顿圆' : '显示曼哈顿圆 (|x|+|y|=R)'}
          </button>
        </div>
      </div>

      {/* SVG 城市街道网格主画布 */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-6 flex flex-col items-center">
        <div className="w-full max-w-sm aspect-square relative flex items-center justify-center">
          <svg viewBox="0 0 320 320" className="w-full h-full select-none">
            {/* 网格线 (街区马路) */}
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={`grid-${i}`}>
                <line
                  x1={toSvgX(0)}
                  y1={toSvgY(i)}
                  x2={toSvgX(7)}
                  y2={toSvgY(i)}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                />
                <line
                  x1={toSvgX(i)}
                  y1={toSvgY(0)}
                  x2={toSvgX(i)}
                  y2={toSvgY(7)}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                />
                {/* 坐标标号 */}
                <text x={toSvgX(i)} y={toSvgY(0) + 16} textAnchor="middle" fill="#64748b" fontSize="10">{i}</text>
                <text x={toSvgX(0) - 14} y={toSvgY(i) + 4} textAnchor="middle" fill="#64748b" fontSize="10">{i}</text>
              </g>
            ))}

            {/* 曼哈顿圆（菱形） */}
            {showCircle && (
              <polygon
                points={`
                  ${toSvgX(pointA.x)},${toSvgY(pointA.y + radiusR)}
                  ${toSvgX(pointA.x + radiusR)},${toSvgY(pointA.y)}
                  ${toSvgX(pointA.x)},${toSvgY(pointA.y - radiusR)}
                  ${toSvgX(pointA.x - radiusR)},${toSvgY(pointA.y)}
                `}
                fill="#f59e0b"
                fillOpacity="0.15"
                stroke="#fbbf24"
                strokeWidth="2.5"
                strokeDasharray="4 3"
              />
            )}

            {/* 欧氏直线距离 (虚线) */}
            <line
              x1={toSvgX(pointA.x)}
              y1={toSvgY(pointA.y)}
              x2={toSvgX(pointB.x)}
              y2={toSvgY(pointB.y)}
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* 出租车走法 (折线) */}
            <polyline
              points={`
                ${toSvgX(pointA.x)},${toSvgY(pointA.y)}
                ${toSvgX(pointB.x)},${toSvgY(pointA.y)}
                ${toSvgX(pointB.x)},${toSvgY(pointB.y)}
              `}
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 起点 A */}
            <circle cx={toSvgX(pointA.x)} cy={toSvgY(pointA.y)} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
            <text x={toSvgX(pointA.x) - 12} y={toSvgY(pointA.y) - 10} fill="#38bdf8" fontSize="12" fontWeight="bold">
              {`A(${pointA.x},${pointA.y})`}
            </text>

            {/* 终点 B */}
            <circle cx={toSvgX(pointB.x)} cy={toSvgY(pointB.y)} r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
            <text x={toSvgX(pointB.x) + 12} y={toSvgY(pointB.y) - 10} fill="#f43f5e" fontSize="12" fontWeight="bold">
              {`B(${pointB.x},${pointB.y})`}
            </text>
          </svg>
        </div>

        {/* 交互说明 */}
        <div className="mt-3 text-xs text-slate-400">
          {showCircle
            ? `🟡 曼哈顿圆心 A(${pointA.x},${pointA.y})，半径 R=${radiusR}，周长 8R=${8 * radiusR}，π = 8R / 2R = 4`
            : `🟢 绿线为出租车街区路线（横 ${dx} + 竖 ${dy} = ${manhattanDist}），虚线为鸟飞欧氏直线（${euclidDist}）`}
        </div>
      </div>

      {/* 距离与非欧对比看板 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-emerald-500 font-bold">曼哈顿出租车距离 |Δx| + |Δy|</span>
          <div className="text-2xl font-black text-emerald-500 mt-1 font-mono">
            {`${dx} + ${dy} = ${manhattanDist}`} 格
          </div>
          <span className="text-xs text-slate-400 mt-0.5">
            {`共 ${pathCount} 条不同最短等长台阶路线！`}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">对比：欧几里得直线距离</span>
          <div className="text-2xl font-black text-slate-500 mt-1 font-mono">
            √({dx}² + {dy}²) ≈ {euclidDist}
          </div>
          <span className="text-xs text-slate-400 mt-0.5">穿透建筑物的小鸟空中直线</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-amber-500 font-bold">曼哈顿圆周率 π_taxicab</span>
          <div className="text-2xl font-black text-amber-500 mt-1 font-mono">
            π = 4
          </div>
          <span className="text-xs text-slate-400 mt-0.5">周长 8R 除以直径 2R 恒等于整数 4！</span>
        </div>
      </div>
    </div>
  );
}
