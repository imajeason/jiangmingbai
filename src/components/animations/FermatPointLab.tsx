'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, HelpCircle, Check, Info } from 'lucide-react';

export default function FermatPointLab() {
  // 顶点 A 可调节坐标 (画布 400x320)
  const [ax, setAx] = useState<number>(180);
  const [ay, setAy] = useState<number>(60);

  // 固定的底边顶点 B 和 C
  const B = { x: 80, y: 250 };
  const C = { x: 320, y: 250 };
  const A = { x: ax, y: ay };

  // 计算任意点间距离
  const dist = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  };

  // 计算角 BAC (度数)
  const angleAt = (center: { x: number; y: number }, p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const v1 = { x: p1.x - center.x, y: p1.y - center.y };
    const v2 = { x: p2.x - center.x, y: p2.y - center.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y);
    if (mag === 0) return 0;
    const cosVal = Math.max(-1, Math.min(1, dot / mag));
    return (Math.acos(cosVal) * 180) / Math.PI;
  };

  const angleA = angleAt(A, B, C);
  const angleB = angleAt(B, A, C);
  const angleC = angleAt(C, A, B);

  // 检查是否为钝角 >= 120°
  const isObtuseA = angleA >= 119.5;

  // 向外作等边正三角形的第三个顶点
  // 给定线段 P1 -> P2，顺时针/逆时针旋转 60 度
  const getEquilateralVertex = (p1: { x: number; y: number }, p2: { x: number; y: number }, clockwise: boolean) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const angle = (clockwise ? 60 : -60) * (Math.PI / 180);
    const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
    const ry = dx * Math.sin(angle) + dy * Math.cos(angle);
    return { x: p1.x + rx, y: p1.y + ry };
  };

  // 外侧等边正三角形顶点：
  // 边 BC 向下 (顺时针)
  const A_prime = getEquilateralVertex(B, C, true);
  // 边 AB 向左上
  const C_prime = getEquilateralVertex(A, B, true);
  // 边 CA 向右上
  const B_prime = getEquilateralVertex(C, A, true);

  // 两直线交点 (AA' 与 BB')
  const lineIntersection = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
    p4: { x: number; y: number }
  ) => {
    const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (Math.abs(denom) < 0.0001) return { x: 200, y: 180 };
    const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: p1.y + t * (p2.y - p1.y),
    };
  };

  // 费马点 P
  let fermatP = lineIntersection(A, A_prime, B, B_prime);
  if (isObtuseA) {
    fermatP = { ...A }; // 钝角时退化至顶点 A
  }

  // 计算费马点到三顶点的总距离
  const distPA = dist(fermatP, A);
  const distPB = dist(fermatP, B);
  const distPC = dist(fermatP, C);
  const totalMinDist = distPA + distPB + distPC;

  // 重心 G (作为对比参照)
  const centroidG = {
    x: (A.x + B.x + C.x) / 3,
    y: (A.y + B.y + C.y) / 3,
  };
  const totalCentroidDist = dist(centroidG, A) + dist(centroidG, B) + dist(centroidG, C);

  // 费马点张角
  const angleAPB = isObtuseA ? angleA : angleAt(fermatP, A, B);
  const angleBPC = isObtuseA ? 0 : angleAt(fermatP, B, C);
  const angleCPA = isObtuseA ? 0 : angleAt(fermatP, C, A);

  return (
    <div className={styles.container}>
      {/* 标题 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            费马点与 120° 最短网络极值实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            最短管线连通问题：向外作等边三角形交于费马点，三顶点张角严格恒等于 120°
          </p>
        </div>

        {/* 预设角度按钮 */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => { setAx(200); setAy(50); }}
            className="px-2.5 py-1 text-xs font-semibold rounded text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition"
          >
            等腰锐角 (正常费马点)
          </button>
          <button
            onClick={() => { setAx(200); setAy(145); }}
            className="px-2.5 py-1 text-xs font-semibold rounded text-rose-600 dark:text-rose-400 hover:bg-white dark:hover:bg-slate-700 transition"
          >
            钝角≥120° (顶点退化态)
          </button>
        </div>
      </div>

      {/* SVG 画布 */}
      <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-6 flex flex-col items-center">
        <div className="w-full max-w-lg aspect-[400/340] relative">
          <svg viewBox="0 0 400 340" className="w-full h-full select-none">
            {/* 外侧 3 个等边三角形 (半透明) */}
            {!isObtuseA && (
              <>
                <polygon
                  points={`${B.x},${B.y} ${C.x},${C.y} ${A_prime.x},${A_prime.y}`}
                  fill="#38bdf8"
                  fillOpacity="0.1"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <polygon
                  points={`${A.x},${A.y} ${B.x},${B.y} ${C_prime.x},${C_prime.y}`}
                  fill="#818cf8"
                  fillOpacity="0.1"
                  stroke="#818cf8"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <polygon
                  points={`${C.x},${C.y} ${A.x},${A.y} ${B_prime.x},${B_prime.y}`}
                  fill="#f472b6"
                  fillOpacity="0.1"
                  stroke="#f472b6"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />

                {/* 三条对顶点连线 AA', BB', CC' */}
                <line x1={A.x} y1={A.y} x2={A_prime.x} y2={A_prime.y} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                <line x1={B.x} y1={B.y} x2={B_prime.x} y2={B_prime.y} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                <line x1={C.x} y1={C.y} x2={C_prime.x} y2={C_prime.y} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
              </>
            )}

            {/* 原三角形 ABC */}
            <polygon
              points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
              fill="#1e293b"
              fillOpacity="0.6"
              stroke="#e2e8f0"
              strokeWidth="2.5"
            />

            {/* 费马管道 PA, PB, PC */}
            <line x1={fermatP.x} y1={fermatP.y} x2={A.x} y2={A.y} stroke="#10b981" strokeWidth="3" />
            <line x1={fermatP.x} y1={fermatP.y} x2={B.x} y2={B.y} stroke="#10b981" strokeWidth="3" />
            <line x1={fermatP.x} y1={fermatP.y} x2={C.x} y2={C.y} stroke="#10b981" strokeWidth="3" />

            {/* 顶点标签 */}
            <circle cx={A.x} cy={A.y} r="5" fill="#f8fafc" />
            <text x={A.x} y={A.y - 12} textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold">A</text>

            <circle cx={B.x} cy={B.y} r="5" fill="#f8fafc" />
            <text x={B.x - 14} y={B.y + 6} textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold">B</text>

            <circle cx={C.x} cy={C.y} r="5" fill="#f8fafc" />
            <text x={C.x + 14} y={C.y + 6} textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold">C</text>

            {/* 费马点 P 标记 */}
            <circle cx={fermatP.x} cy={fermatP.y} r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
            <text x={fermatP.x + 14} y={fermatP.y + 5} fill="#fbbf24" fontSize="13" fontWeight="black">
              {isObtuseA ? 'P (退化到A)' : 'P (费马点)'}
            </text>

            {/* 对比：重心 G 标记 */}
            {!isObtuseA && (
              <>
                <circle cx={centroidG.x} cy={centroidG.y} r="4" fill="#94a3b8" />
                <text x={centroidG.x - 14} y={centroidG.y - 6} fill="#94a3b8" fontSize="10">重心G</text>
              </>
            )}
          </svg>
        </div>

        {/* 底部张角说明 */}
        <div className="mt-2 text-xs text-slate-300 flex items-center gap-4">
          {isObtuseA ? (
            <span className="text-rose-400 font-bold">
              ⚠️ 当前顶角 ∠A = {angleA.toFixed(1)}° ≥ 120°，费马点直接退化至钝角顶点 A 自身！
            </span>
          ) : (
            <>
              <span className="text-emerald-400 font-semibold">∠APB = {angleAPB.toFixed(1)}°</span>
              <span className="text-emerald-400 font-semibold">∠BPC = {angleBPC.toFixed(1)}°</span>
              <span className="text-emerald-400 font-semibold">∠CPA = {angleCPA.toFixed(1)}°</span>
              <span className="text-slate-400 font-mono">(三张角全为 120°)</span>
            </>
          )}
        </div>
      </div>

      {/* 距离对比看板 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">顶角 ∠A 角度</span>
          <div className="text-2xl font-black text-indigo-500 mt-1">{angleA.toFixed(1)}°</div>
          <span className="text-xs text-slate-400 mt-0.5">
            {isObtuseA ? '已达钝角临界 (≥120°)' : '正常锐角/小钝角 (<120°)'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-emerald-500 font-bold">费马点总管线长 (PA+PB+PC)</span>
          <div className="text-2xl font-black text-emerald-500 mt-1">{totalMinDist.toFixed(1)}</div>
          <span className="text-xs text-slate-400 mt-0.5">绝对理论最小值（最短铺设成本）</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">对比：重心 G 点总管线长</span>
          <div className="text-2xl font-black text-slate-500 mt-1">{totalCentroidDist.toFixed(1)}</div>
          <span className="text-xs text-rose-500 mt-0.5 font-semibold">
            {`比费马点多长 +${(totalCentroidDist - totalMinDist).toFixed(1)}`}
          </span>
        </div>
      </div>

      {/* 顶点 A 自由调控 */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          拖动滑块改变村庄 A 位置（拖动观察 120° 张角与钝角退化）：
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-16">水平 X 坐标</span>
            <input
              type="range"
              min={100}
              max={300}
              value={ax}
              onChange={(e) => setAx(Number(e.target.value))}
              className="flex-1 accent-indigo-600"
            />
            <span className="text-xs font-mono w-8">{ax}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-16">高度 Y 坐标</span>
            <input
              type="range"
              min={30}
              max={160}
              value={ay}
              onChange={(e) => setAy(Number(e.target.value))}
              className="flex-1 accent-indigo-600"
            />
            <span className="text-xs font-mono w-8">{ay}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

