'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, ArrowRight, Check, X, ShieldAlert, Layers } from 'lucide-react';

export default function CatalanNumberLab() {
  const [n, setN] = useState<number>(3); // 步数 n (2..4)
  const [selectedPathType, setSelectedPathType] = useState<'valid1' | 'valid2' | 'invalid'>('valid1');

  // 计算组合数 C(n, k)
  const comb = (total: number, pick: number): number => {
    if (pick < 0 || pick > total) return 0;
    if (pick === 0 || pick === total) return 1;
    let res = 1;
    for (let i = 1; i <= pick; i++) {
      res = (res * (total - i + 1)) / i;
    }
    return Math.round(res);
  };

  const totalPaths = comb(2 * n, n);
  const illegalPaths = comb(2 * n, n - 1);
  const catalanNum = totalPaths - illegalPaths;

  // 路径预设 (向右 'R' = 5元/入栈/(, 向上 'U' = 10元/出栈/))
  // n=3 时：
  // valid1: R R R U U U  -> ((( )))
  // valid2: R U R U R U  -> () () ()
  // invalid: R U U R R U -> ( ) ) ( ( ) 在第3步出现非法出栈！
  const pathData = {
    valid1: {
      moves: ['R', 'R', 'R', 'U', 'U', 'U'],
      label: '合法全嵌套 ((( )))',
      isValid: true,
      firstViolateStep: -1,
    },
    valid2: {
      moves: ['R', 'U', 'R', 'U', 'R', 'U'],
      label: '合法并列 ()()()',
      isValid: true,
      firstViolateStep: -1,
    },
    invalid: {
      moves: ['R', 'U', 'U', 'R', 'R', 'U'],
      label: '非法越界 ( ) ) ( ( )',
      isValid: false,
      firstViolateStep: 3, // 第3步在 (1, 2) 触碰 y = x + 1
    },
  };

  const currentPath = pathData[selectedPathType];

  // 生成从 (0,0) 开始的点序列
  const points = [{ x: 0, y: 0 }];
  let cx = 0;
  let cy = 0;
  currentPath.moves.forEach((m) => {
    if (m === 'R') cx += 1;
    else cy += 1;
    points.push({ x: cx, y: cy });
  });

  // SVG 坐标映射
  // 网格 0..n，映射到 svg 60..300
  const gridSize = 240;
  const padding = 50;
  const scale = gridSize / n;

  const toSvgX = (x: number) => padding + x * scale;
  const toSvgY = (y: number) => padding + (n - y) * scale; // 笛卡尔坐标 Y 向上

  // 生成折线路径
  const svgPathD = points.reduce((acc, p, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${toSvgX(p.x)} ${toSvgY(p.y)}`;
  }, '');

  // 若为非法路径，生成反射后的路径
  // 越界点 P 在 (1, 2)，之后步数做 y = x+1 对称翻转
  const reflectedPoints = [{ x: 1, y: 2 }];
  let rx = 1;
  let ry = 2;
  if (!currentPath.isValid) {
    currentPath.moves.slice(3).forEach((m) => {
      // 原向右(R)变成向上(U)，原向上(U)变成向右(R)
      if (m === 'R') ry += 1;
      else rx += 1;
      reflectedPoints.push({ x: rx, y: ry });
    });
  }

  const reflectedSvgD = reflectedPoints.reduce((acc, p, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${toSvgX(p.x)} ${toSvgY(p.y)}`;
  }, '');

  return (
    <div className={styles.container}>
      {/* 标题 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            卡特兰数与折线反折法几何实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            不穿过对角线 $y=x$ 的网格路径、合法出栈序列与安德烈反折对称原理
          </p>
        </div>

        {/* 路径类型选择 */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setSelectedPathType('valid1')}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition ${
              selectedPathType === 'valid1' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            合法路径 A
          </button>
          <button
            onClick={() => setSelectedPathType('valid2')}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition ${
              selectedPathType === 'valid2' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            合法路径 B
          </button>
          <button
            onClick={() => setSelectedPathType('invalid')}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition ${
              selectedPathType === 'invalid' ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            非法越界反折
          </button>
        </div>
      </div>

      {/* SVG 网格视图 */}
      <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-6 flex flex-col items-center">
        <div className="w-full max-w-md aspect-square relative">
          <svg viewBox="0 0 350 350" className="w-full h-full select-none">
            {/* 绘制背景方格网格 */}
            {Array.from({ length: n + 1 }).map((_, i) => (
              <g key={`grid-${i}`}>
                {/* 横线 */}
                <line
                  x1={toSvgX(0)}
                  y1={toSvgY(i)}
                  x2={toSvgX(n)}
                  y2={toSvgY(i)}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                />
                {/* 竖线 */}
                <line
                  x1={toSvgX(i)}
                  y1={toSvgY(0)}
                  x2={toSvgX(i)}
                  y2={toSvgY(n)}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                />
                {/* 坐标数字 */}
                <text x={toSvgX(i)} y={toSvgY(0) + 16} textAnchor="middle" fill="#64748b" fontSize="11">{i}</text>
                <text x={toSvgX(0) - 14} y={toSvgY(i) + 4} textAnchor="middle" fill="#64748b" fontSize="11">{i}</text>
              </g>
            ))}

            {/* 对角线 y = x (合法边界) */}
            <line
              x1={toSvgX(0)}
              y1={toSvgY(0)}
              x2={toSvgX(n)}
              y2={toSvgY(n)}
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="6 3"
            />
            <text x={toSvgX(n) + 10} y={toSvgY(n) + 4} fill="#10b981" fontSize="10" fontWeight="bold">y = x</text>

            {/* 红线 y = x + 1 (越界触发线) */}
            <line
              x1={toSvgX(0)}
              y1={toSvgY(1)}
              x2={toSvgX(n - 1)}
              y2={toSvgY(n)}
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <text x={toSvgX(0) - 10} y={toSvgY(1) - 6} fill="#f43f5e" fontSize="10" fontWeight="bold">y = x + 1 (碰线即非法)</text>

            {/* 反折路径 (如果是非法路径) */}
            {!currentPath.isValid && (
              <path
                d={reflectedSvgD}
                fill="none"
                stroke="#a855f7"
                strokeWidth="3.5"
                strokeDasharray="5 3"
              />
            )}

            {/* 主路径 */}
            <path
              d={svgPathD}
              fill="none"
              stroke={currentPath.isValid ? '#3b82f6' : '#f97316'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 起点 (0,0) 与 终点 */}
            <circle cx={toSvgX(0)} cy={toSvgY(0)} r="5" fill="#3b82f6" />
            <text x={toSvgX(0) - 10} y={toSvgY(0) + 16} fill="#3b82f6" fontSize="11" fontWeight="bold">(0,0)</text>

            <circle cx={toSvgX(n)} cy={toSvgY(n)} r="5" fill="#10b981" />
            <text x={toSvgX(n) + 4} y={toSvgY(n) - 8} fill="#10b981" fontSize="11" fontWeight="bold">{`(${n},${n})`}</text>

            {!currentPath.isValid && (
              <>
                {/* 第一次碰线点 P(1, 2) */}
                <circle cx={toSvgX(1)} cy={toSvgY(2)} r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                <text x={toSvgX(1) + 10} y={toSvgY(2) - 8} fill="#f43f5e" fontSize="11" fontWeight="bold">首次碰线 P(1,2)</text>

                {/* 反折终点 (n-1, n+1) */}
                <circle cx={toSvgX(n - 1)} cy={toSvgY(n)} r="6" fill="#a855f7" />
                <text x={toSvgX(n - 1) - 10} y={toSvgY(n) - 10} fill="#a855f7" fontSize="11" fontWeight="bold">
                  {`反折终点(${n - 1},${n + 1})`}
                </text>
              </>
            )}
          </svg>
        </div>

        {/* 状态判定条 */}
        <div className="mt-3 flex items-center gap-2">
          {currentPath.isValid ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <Check className="w-4 h-4" /> 当前为合法路径：全程未穿过对角线！
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30">
              <X className="w-4 h-4" /> {`触碰 y=x+1 越界！经反折唯一对应到达 (${n - 1}, ${n + 1}) 的路径`}
            </span>
          )}
        </div>
      </div>

      {/* 括号序列与出栈操作实时对应 */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
        <div className="text-xs font-semibold text-slate-500 mb-2">对应栈操作 / 括号嵌套序列：</div>
        <div className="flex flex-wrap items-center gap-2">
          {currentPath.moves.map((m, idx) => {
            const isRight = m === 'R';
            return (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg font-mono text-sm font-bold border flex items-center gap-1.5 ${
                  isRight
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                }`}
              >
                <span>{isRight ? '右移(入栈)' : '上移(出栈)'}</span>
                <span className="text-base">{isRight ? '(' : ')'}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 卡特兰数代数计算公式 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">{'全部无限制路径数 C(2n, n)'}</span>
          <div className="text-2xl font-black text-indigo-500 mt-1">{totalPaths} 条</div>
          <span className="text-xs text-slate-400 mt-0.5">{`从 (0,0) 到 (${n},${n})`}</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">{'越界非法路径数 C(2n, n-1)'}</span>
          <div className="text-2xl font-black text-rose-500 mt-1">{illegalPaths} 条</div>
          <span className="text-xs text-slate-400 mt-0.5">{`反折后到达 (${n - 1},${n + 1})`}</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">{`卡特兰数 C_${n}（合法方案）`}</span>
          <div className="text-2xl font-black text-emerald-500 mt-1">{catalanNum} 种</div>
          <span className="text-xs text-slate-400 mt-0.5">{'1/(n+1) · C(2n, n)'}</span>
        </div>
      </div>
    </div>
  );
}

