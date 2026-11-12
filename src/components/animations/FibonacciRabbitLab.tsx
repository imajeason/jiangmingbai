'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, ChevronRight, ChevronLeft, Info, Eye } from 'lucide-react';

export default function FibonacciRabbitLab() {
  const [step, setStep] = useState<number>(6); // 默认第 6 项
  const [viewMode, setViewMode] = useState<'spiral' | 'rabbits' | 'table'>('spiral');

  // 斐波那契数列计算前 11 项 (1..11)
  const fibs = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  const currentFib = fibs[step - 1];
  const prevFib = step > 1 ? fibs[step - 2] : 1;
  const currentRatio = step > 1 ? (currentFib / prevFib).toFixed(6) : '1.000000';
  const goldenRatio = 1.618034;
  const ratioDiff = Math.abs(parseFloat(currentRatio) - goldenRatio).toFixed(6);

  // 黄金螺旋方块参数 (从第 1 到第 7 个方块的相对坐标与尺寸)
  // 方块序列：1, 1, 2, 3, 5, 8, 13
  const spiralSquares = [
    { n: 1, size: 16, x: 200, y: 150, arc: 'M 200 166 A 16 16 0 0 1 216 150', color: '#6366f1' },
    { n: 2, size: 16, x: 200, y: 134, arc: 'M 216 150 A 16 16 0 0 1 200 134', color: '#8b5cf6' },
    { n: 3, size: 32, x: 168, y: 134, arc: 'M 200 134 A 32 32 0 0 1 168 166', color: '#ec4899' },
    { n: 4, size: 48, x: 168, y: 166, arc: 'M 168 166 A 48 48 0 0 1 216 214', color: '#f59e0b' },
    { n: 5, size: 80, x: 216, y: 134, arc: 'M 216 214 A 80 80 0 0 1 296 134', color: '#10b981' },
    { n: 6, size: 128, x: 168, y: 6, arc: 'M 296 134 A 128 128 0 0 1 168 6', color: '#06b6d4' },
    { n: 7, size: 208, x: -40, y: 6, arc: 'M 168 6 A 208 208 0 0 1 -40 214', color: '#3b82f6' },
  ];

  return (
    <div className={styles.container}>
      {/* 头部标题与控制栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            斐波那契数列与黄金螺旋探究实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            自然界的生长密码：从兔子繁衍递推到黄金螺旋线的极限收敛
          </p>
        </div>

        {/* 视图切换 */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('spiral')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              viewMode === 'spiral'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            黄金螺旋视图
          </button>
          <button
            onClick={() => setViewMode('rabbits')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              viewMode === 'rabbits'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            兔子繁殖模型
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              viewMode === 'table'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            比值收敛表
          </button>
        </div>
      </div>

      {/* 主展示区 */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-6">
        {viewMode === 'spiral' && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-lg aspect-square bg-slate-950 rounded-xl relative overflow-hidden border border-slate-800 flex items-center justify-center p-4">
              <svg viewBox="-50 -10 370 240" className="w-full h-full">
                {/* 背景网格线 */}
                <defs>
                  <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect x="-50" y="-10" width="370" height="240" fill="url(#smallGrid)" />

                {/* 绘制方块与螺旋 */}
                {spiralSquares.slice(0, Math.min(step, 7)).map((sq) => (
                  <g key={sq.n}>
                    {/* 方块 */}
                    <rect
                      x={sq.x}
                      y={sq.y}
                      width={sq.size}
                      height={sq.size}
                      fill={sq.color}
                      fillOpacity="0.22"
                      stroke={sq.color}
                      strokeWidth="1.5"
                      className="transition-all duration-300"
                    />
                    {/* 标注文案 */}
                    {sq.size >= 24 && (
                      <text
                        x={sq.x + sq.size / 2}
                        y={sq.y + sq.size / 2 + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={sq.size >= 60 ? "13" : "10"}
                        fontWeight="bold"
                        opacity="0.9"
                      >
                        {fibs[sq.n - 1]}
                      </text>
                    )}
                    {/* 圆弧 (黄金螺旋的一部分) */}
                    <path
                      d={sq.arc}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </g>
                ))}
              </svg>
            </div>
            <div className="mt-4 text-center">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                当前螺旋展示至第 {Math.min(step, 7)} 级方块（边长 {fibs[Math.min(step, 7) - 1]}）
              </span>
            </div>
          </div>
        )}

        {viewMode === 'rabbits' && (
          <div className="space-y-4">
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">
              第 <span className="font-bold text-indigo-500">{step}</span> 个月：兔子对数为{' '}
              <span className="font-bold text-indigo-500 text-lg">{currentFib}</span> 对
              （其中成兔 {prevFib} 对，初生小兔 {currentFib - prevFib} 对）
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-72 overflow-y-auto p-2">
              {Array.from({ length: currentFib }).map((_, idx) => {
                const isAdult = idx < prevFib;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      isAdult
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    <span className="text-2xl">{isAdult ? '🐰' : '🐇'}</span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {isAdult ? '成年兔对' : '新生幼兔'}
                    </span>
                    <span className="text-[10px] text-slate-400">#{idx + 1}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="flex items-center gap-1">🐰 成年兔对：拥有生育能力，下月生出一对新生幼兔</span>
              <span className="flex items-center gap-1">🐇 新生幼兔：需成长一个月后成为成年兔</span>
            </div>
          </div>
        )}

        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <th className="p-2.5 rounded-l-lg">序号 $n$</th>
                  <th className="p-2.5">斐波那契项 $F(n)$</th>
                  <th className="p-2.5">相邻比值 $F(n)/F(n-1)$</th>
                  <th className="p-2.5 rounded-r-lg">与黄金比 $\phi$ 偏差</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {fibs.slice(0, 10).map((val, idx) => {
                  const n = idx + 1;
                  const ratio = n > 1 ? (val / fibs[idx - 1]).toFixed(6) : '-';
                  const diff = n > 1 ? Math.abs(parseFloat(ratio) - goldenRatio).toFixed(6) : '-';
                  const isCurrent = n === step;
                  return (
                    <tr
                      key={n}
                      className={isCurrent ? 'bg-indigo-500/10 font-bold text-indigo-500' : 'text-slate-600 dark:text-slate-400'}
                    >
                      <td className="p-2.5">{n}</td>
                      <td className="p-2.5">{val}</td>
                      <td className="p-2.5">{ratio}</td>
                      <td className="p-2.5 font-mono text-xs">{diff}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 控制器与当前数值看板 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
          <span className="text-xs text-slate-500">当前项序号 $n$</span>
          <div className="text-2xl font-black text-indigo-500 mt-1">第 {step} 个月 / 项</div>
          <span className="text-xs text-slate-400 mt-0.5">递推公式：$F(n) = F(n-1) + F(n-2)$</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
          <span className="text-xs text-slate-500">兔子总数 / 斐波那契值</span>
          <div className="text-2xl font-black text-emerald-500 mt-1">{currentFib} 对</div>
          <span className="text-xs text-slate-400 mt-0.5">前两项之和：{prevFib} + {currentFib - prevFib}</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
          <span className="text-xs text-slate-500">相邻两项比值（收敛于 1.618）</span>
          <div className="text-2xl font-black text-amber-500 mt-1 font-mono">{currentRatio}</div>
          <span className="text-xs text-slate-400 mt-0.5">与黄金分割比偏差：{ratioDiff}</span>
        </div>
      </div>

      {/* 步进滑动与按钮操作 */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step <= 1}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          </button>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            $n = {step}$
          </span>
          <button
            onClick={() => setStep(Math.min(10, step + 1))}
            disabled={step >= 10}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          </button>
          <input
            type="range"
            min={1}
            max={10}
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            className="w-36 accent-indigo-600"
          />
        </div>

        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-400 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重置到第 1 项
        </button>
      </div>
    </div>
  );
}

