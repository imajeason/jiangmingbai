'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, ChevronRight, ChevronLeft, Layers, ShieldCheck } from 'lucide-react';

export default function SierpinskiTriangleLab() {
  const [depth, setDepth] = useState<number>(3); // 深度 0..5
  const [viewMode, setViewMode] = useState<'geometric' | 'pascal'>('geometric');

  // 计算理论剩余面积比例 (3/4)^n 与 周长膨胀比 (3/2)^n
  const areaRatio = Math.pow(3 / 4, depth).toFixed(4);
  const perimeterRatio = Math.pow(3 / 2, depth).toFixed(2);
  const triangleCount = Math.pow(3, depth);

  // 递归生成第 depth 级的所有等边三角形坐标 (归一化在 320 x 280 画布)
  interface Tri {
    p1: { x: number; y: number };
    p2: { x: number; y: number };
    p3: { x: number; y: number };
  }

  const getSubTriangles = (t: Tri, d: number): Tri[] => {
    if (d === 0) return [t];

    const mid12 = { x: (t.p1.x + t.p2.x) / 2, y: (t.p1.y + t.p2.y) / 2 };
    const mid23 = { x: (t.p2.x + t.p3.x) / 2, y: (t.p2.y + t.p3.y) / 2 };
    const mid31 = { x: (t.p3.x + t.p1.x) / 2, y: (t.p3.y + t.p1.y) / 2 };

    const topTri: Tri = { p1: t.p1, p2: mid12, p3: mid31 };
    const leftTri: Tri = { p1: mid12, p2: t.p2, p3: mid23 };
    const rightTri: Tri = { p1: mid31, p2: mid23, p3: t.p3 };

    return [
      ...getSubTriangles(topTri, d - 1),
      ...getSubTriangles(leftTri, d - 1),
      ...getSubTriangles(rightTri, d - 1),
    ];
  };

  const initialTriangle: Tri = {
    p1: { x: 160, y: 20 },
    p2: { x: 20, y: 260 },
    p3: { x: 300, y: 260 },
  };

  const currentTriangles = getSubTriangles(initialTriangle, depth);

  // 杨辉三角奇偶染色数据 (前 16 行)
  const pascalRows: number[][] = [];
  for (let r = 0; r < 16; r++) {
    const row: number[] = [1];
    for (let c = 1; c < r; c++) {
      row.push((pascalRows[r - 1][c - 1] + pascalRows[r - 1][c]) % 2);
    }
    if (r > 0) row.push(1);
    pascalRows.push(row);
  }

  return (
    <div className={styles.container}>
      {/* 头部标题与视图切换 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            谢尔宾斯基三角形与分形自相似实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            中心挖空无穷迭代：面积归零、周长直奔无穷，与杨辉三角模 2 奇偶染色完全重合
          </p>
        </div>

        {/* 模式切换 */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('geometric')}
            className={`px-3 py-1.5 text-xs font-semibold rounded ${
              viewMode === 'geometric' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            几何镂空分形
          </button>
          <button
            onClick={() => setViewMode('pascal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded ${
              viewMode === 'pascal' ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            杨辉奇偶模2染色
          </button>
        </div>
      </div>

      {/* 主画布展示区 */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-6 flex flex-col items-center">
        {viewMode === 'geometric' ? (
          <div className="w-full max-w-sm aspect-[320/280] relative">
            <svg viewBox="0 0 320 280" className="w-full h-full select-none">
              {currentTriangles.map((tri, idx) => (
                <polygon
                  key={`tri-${idx}`}
                  points={`${tri.p1.x},${tri.p1.y} ${tri.p2.x},${tri.p2.y} ${tri.p3.x},${tri.p3.y}`}
                  fill="#6366f1"
                  stroke="#818cf8"
                  strokeWidth="0.5"
                  className="transition-all duration-300"
                />
              ))}
            </svg>
          </div>
        ) : (
          /* 杨辉三角奇偶染色视图 */
          <div className="w-full max-w-md aspect-[320/260] relative flex flex-col items-center justify-center p-2">
            <div className="space-y-1 w-full text-center">
              {pascalRows.slice(0, 16).map((row, rIdx) => (
                <div key={`p-row-${rIdx}`} className="flex justify-center gap-1">
                  {row.map((val, cIdx) => (
                    <span
                      key={`cell-${rIdx}-${cIdx}`}
                      className={`w-2.5 h-2.5 rounded-sm inline-block transition-all ${
                        val === 1
                          ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                          : 'bg-slate-800'
                      }`}
                      title={`行${rIdx} 列${cIdx}: ${val === 1 ? '奇数' : '偶数'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-amber-400 font-semibold">
              ✨ 金色方块为奇数、深色为偶数：杨辉三角模2运算自动显现谢尔宾斯基分形！
            </div>
          </div>
        )}

        {/* 深度迭代步进条 */}
        {viewMode === 'geometric' && (
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setDepth(Math.max(0, depth - 1))}
              disabled={depth <= 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-200 px-2 font-mono">
              {`递归深度 Level: ${depth}`}
            </span>
            <button
              onClick={() => setDepth(Math.min(5, depth + 1))}
              disabled={depth >= 5}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDepth(0)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 ml-2"
              title="重置"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 极限指标看板 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">剩余面积比例 (3/4)^n ➔ 0</span>
          <div className="text-2xl font-black text-rose-500 mt-1 font-mono">
            {`S_${depth} = ${areaRatio} S₀`}
          </div>
          <span className="text-xs text-slate-400 mt-0.5">每次裁去 1/4，极限无限趋向于 0</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">边界总周长 (3/2)^n ➔ ∞</span>
          <div className="text-2xl font-black text-emerald-500 mt-1 font-mono">
            {`C_${depth} = ${perimeterRatio} C₀`}
          </div>
          <span className="text-xs text-slate-400 mt-0.5">每次周长扩大 1.5 倍，直奔无穷大</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-indigo-500 font-bold">分形豪斯多夫维数</span>
          <div className="text-2xl font-black text-indigo-500 mt-1 font-mono">
            D ≈ 1.585
          </div>
          <span className="text-xs text-slate-400 mt-0.5">log 3 / log 2 介于 1 维与 2 维之间</span>
        </div>
      </div>
    </div>
  );
}
