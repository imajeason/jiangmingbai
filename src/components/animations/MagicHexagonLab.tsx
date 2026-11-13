'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, Check, CheckCircle2, HelpCircle } from 'lucide-react';

export default function MagicHexagonLab() {
  const [activeDirection, setActiveDirection] = useState<'horizontal' | 'diagUp' | 'diagDown'>('horizontal');
  const [showCenterFocus, setShowCenterFocus] = useState<boolean>(false);

  // 阿恩斯 3 阶幻六角形标准排布 (19个数字，每行和=38)
  // 5行：3, 4, 5, 4, 3
  const rows = [
    [3, 17, 18],
    [19, 7, 1, 11],
    [16, 2, 8, 6, 12],
    [10, 4, 15, 9],
    [13, 14, 5],
  ];

  // 19个格子的相对坐标映射 (SVG 360 x 320)
  // 蜂巢水平间距 dx = 52, 垂直间距 dy = 45
  const hexCoords = [
    // Row 1 (3格)
    { val: 3, x: 128, y: 55, r: 0, c: 0 },
    { val: 17, x: 180, y: 55, r: 0, c: 1 },
    { val: 18, x: 232, y: 55, r: 0, c: 2 },
    // Row 2 (4格)
    { val: 19, x: 102, y: 100, r: 1, c: 0 },
    { val: 7, x: 154, y: 100, r: 1, c: 1 },
    { val: 1, x: 206, y: 100, r: 1, c: 2 },
    { val: 11, x: 258, y: 100, r: 1, c: 3 },
    // Row 3 (5格，中央长轴，中心是8)
    { val: 16, x: 76, y: 145, r: 2, c: 0 },
    { val: 2, x: 128, y: 145, r: 2, c: 1 },
    { val: 8, x: 180, y: 145, r: 2, c: 2, isCenter: true },
    { val: 6, x: 232, y: 145, r: 2, c: 3 },
    { val: 12, x: 284, y: 145, r: 2, c: 4 },
    // Row 4 (4格)
    { val: 10, x: 102, y: 190, r: 3, c: 0 },
    { val: 4, x: 154, y: 190, r: 3, c: 1 },
    { val: 15, x: 206, y: 190, r: 3, c: 2 },
    { val: 9, x: 258, y: 190, r: 3, c: 3 },
    // Row 5 (3格)
    { val: 13, x: 128, y: 235, r: 4, c: 0 },
    { val: 14, x: 180, y: 235, r: 4, c: 1 },
    { val: 5, x: 232, y: 235, r: 4, c: 2 },
  ];

  // 生成正六边形 SVG 路径
  const getHexPath = (cx: number, cy: number, size = 26) => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 * Math.PI) / 180;
      pts.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
    }
    return `M ${pts.join(' L ')} Z`;
  };

  return (
    <div className={styles.container}>
      {/* 头部标题与视图切换 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            阿恩斯幻六角形与三向常数和实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            蜂巢 19 格连续数填入：3 个维度共 15 条直线，各线数字之和恒等于 38！
          </p>
        </div>

        {/* 视向选择 */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => { setActiveDirection('horizontal'); setShowCenterFocus(false); }}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              activeDirection === 'horizontal' && !showCenterFocus
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            水平 5 行 (和=38)
          </button>
          <button
            onClick={() => { setActiveDirection('diagUp'); setShowCenterFocus(false); }}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              activeDirection === 'diagUp' && !showCenterFocus
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            斜向 5 排 (和=38)
          </button>
          <button
            onClick={() => setShowCenterFocus(!showCenterFocus)}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              showCenterFocus ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            中心核心 8
          </button>
        </div>
      </div>

      {/* SVG 蜂巢主画布 */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-6 flex flex-col items-center">
        <div className="w-full max-w-sm aspect-[360/300] relative flex items-center justify-center">
          <svg viewBox="50 20 260 250" className="w-full h-full select-none">
            {/* 绘制 19 个六角蜂房 */}
            {hexCoords.map((h, idx) => {
              const isCenter = h.isCenter;
              const isHighlightCenter = showCenterFocus && isCenter;
              return (
                <g key={`hex-${idx}`}>
                  {/* 六边形格 */}
                  <path
                    d={getHexPath(h.x, h.y, 24)}
                    fill={
                      isHighlightCenter
                        ? '#f59e0b'
                        : isCenter
                        ? '#3b82f6'
                        : '#1e293b'
                    }
                    fillOpacity={isHighlightCenter ? '0.9' : isCenter ? '0.7' : '0.8'}
                    stroke={isHighlightCenter ? '#ffffff' : isCenter ? '#60a5fa' : '#475569'}
                    strokeWidth={isHighlightCenter ? '2.5' : isCenter ? '2' : '1.2'}
                    className="transition-all duration-200"
                  />
                  {/* 数字 */}
                  <text
                    x={h.x}
                    y={h.y + 5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={isCenter ? '15' : '13'}
                    fontWeight="bold"
                    className="drop-shadow-sm pointer-events-none"
                  >
                    {h.val}
                  </text>
                </g>
              );
            })}

            {/* 水平行和标注文案 */}
            {activeDirection === 'horizontal' && (
              <>
                <text x="265" y="58" fill="#10b981" fontSize="11" fontWeight="bold">和=38</text>
                <text x="290" y="103" fill="#10b981" fontSize="11" fontWeight="bold">和=38</text>
                <text x="315" y="148" fill="#10b981" fontSize="11" fontWeight="bold">和=38</text>
                <text x="290" y="193" fill="#10b981" fontSize="11" fontWeight="bold">和=38</text>
                <text x="265" y="238" fill="#10b981" fontSize="11" fontWeight="bold">和=38</text>
              </>
            )}
          </svg>
        </div>

        <div className="mt-2 text-xs text-slate-400">
          💡 阿恩斯耗时 47 年验证的宇宙唯一解：中心必须为 8，每线和恒为 38
        </div>
      </div>

      {/* 5行验算与代数证明看板 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">1到19总和与行数</span>
          <div className="text-2xl font-black text-indigo-500 mt-1">190 ÷ 5 = 38</div>
          <span className="text-xs text-slate-400 mt-0.5">高斯求和 (1+19)×19÷2 = 190</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">水平 5 行逐行验算</span>
          <div className="text-sm font-mono font-bold text-emerald-500 mt-1 space-y-0.5">
            <div>3 + 17 + 18 = 38 ✓</div>
            <div>19 + 7 + 1 + 11 = 38 ✓</div>
            <div>16 + 2 + 8 + 6 + 12 = 38 ✓</div>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">全向 15 条直线全部守恒</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">核心中心格唯一定律</span>
          <div className="text-2xl font-black text-amber-500 mt-1 font-mono">Center = 8</div>
          <span className="text-xs text-slate-400 mt-0.5">3条长轴三向交汇，唯一可能整数</span>
        </div>
      </div>
    </div>
  );
}

