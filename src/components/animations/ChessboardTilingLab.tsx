'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, Play, RotateCcw, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ChessboardTilingLab() {
  // 4x4 棋盘 (r: 0..3, c: 0..3)
  const [missingHole, setMissingHole] = useState<{ r: number; c: number }>({ r: 0, c: 1 });
  const [step, setStep] = useState<number>(0); // 0: 仅破洞, 1: 放置中心L骨牌, 2: 全部4个象限铺满

  // 象限划分：
  // Q0 (左上): r in 0..1, c in 0..1
  // Q1 (右上): r in 0..1, c in 2..3
  // Q2 (左下): r in 2..3, c in 0..1
  // Q3 (右下): r in 2..3, c in 2..3
  const getQuadrant = (r: number, c: number): number => {
    if (r <= 1 && c <= 1) return 0;
    if (r <= 1 && c >= 2) return 1;
    if (r >= 2 && c <= 1) return 2;
    return 3;
  };

  const holeQuad = getQuadrant(missingHole.r, missingHole.c);

  // 4个象限与中心交界的内角坐标：
  // Q0 内角: (1, 1)
  // Q1 内角: (1, 2)
  // Q2 内角: (2, 1)
  // Q3 内角: (2, 2)
  const centerCorners = [
    { r: 1, c: 1, q: 0 },
    { r: 1, c: 2, q: 1 },
    { r: 2, c: 1, q: 2 },
    { r: 2, c: 2, q: 3 },
  ];

  // 中心 L 骨牌覆盖除了 holeQuad 之外的其余 3 个象限的内角
  const centerTromino = centerCorners.filter((cc) => cc.q !== holeQuad);

  // 计算每个象限被填充的颜色：
  // 中心骨牌颜色: #f59e0b (金黄)
  // 4个外围骨牌颜色:
  // Q0: #6366f1, Q1: #10b981, Q2: #ec4899, Q3: #06b6d4
  const quadColors = ['#6366f1', '#10b981', '#ec4899', '#06b6d4'];

  const getCellColor = (r: number, c: number) => {
    // 如果是原始破洞
    if (r === missingHole.r && c === missingHole.c) {
      return { fill: '#1e293b', isHole: true };
    }

    // 检查是否属于中心 L 骨牌
    const isCenter = centerTromino.some((cc) => cc.r === r && cc.c === c);
    if (step >= 1 && isCenter) {
      return { fill: '#f59e0b', label: '中心L' };
    }

    // 检查象限内部骨牌
    if (step >= 2) {
      const q = getQuadrant(r, c);
      return { fill: quadColors[q], label: `Q${q + 1}` };
    }

    return { fill: '#334155', isHole: false };
  };

  return (
    <div className={styles.container}>
      {/* 头部标题与控制栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            残缺棋盘与 L 型骨牌分治覆盖实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            4×4 棋盘任挖一空：中心放置一块核心 L 骨牌，瞬间将大问题拆解为 4 个独立小拼图
          </p>
        </div>

        {/* 步骤控制 */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setStep(0)}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              step === 0 ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            1. 选定破洞
          </button>
          <button
            onClick={() => setStep(1)}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              step === 1 ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            2. 中心L骨牌
          </button>
          <button
            onClick={() => setStep(2)}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              step === 2 ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            3. 四象限全拼满
          </button>
        </div>
      </div>

      {/* 棋盘主交互区 */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-6 flex flex-col items-center">
        <div className="w-full max-w-xs aspect-square p-2 bg-slate-900 rounded-xl border border-slate-800 relative">
          {/* 4x4 网格 */}
          <div className="grid grid-cols-4 grid-rows-4 gap-1.5 w-full h-full">
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 4 }).map((_, c) => {
                const cell = getCellColor(r, c);
                const isSelectedHole = r === missingHole.r && c === missingHole.c;

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => {
                      setMissingHole({ r, c });
                      setStep(0);
                    }}
                    style={{ backgroundColor: cell.fill }}
                    className={`rounded-lg flex flex-col items-center justify-center font-bold text-xs transition-all relative select-none border ${
                      isSelectedHole
                        ? 'border-rose-500 shadow-md shadow-rose-500/30'
                        : 'border-slate-700/60'
                    }`}
                  >
                    {isSelectedHole ? (
                      <span className="text-base">🕳️</span>
                    ) : (
                      <span className="text-[10px] text-white opacity-80">{cell.label || ''}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* 十字中轴分割线 */}
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-1 bg-white/20 pointer-events-none" />
          <div className="absolute inset-y-2 left-1/2 -translate-x-1/2 w-1 bg-white/20 pointer-events-none" />
        </div>

        {/* 提示文案 */}
        <div className="mt-3 text-xs text-slate-400">
          💡 点击棋盘任意方格可将其设为“破洞 🕳️”，然后点击“中心L骨牌”与“四象限全拼满”观察分治推导
        </div>
      </div>

      {/* 分治推导核心原理解读 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">待铺格子总数与整除性</span>
          <div className="text-2xl font-black text-indigo-500 mt-1">
            16 - 1 = 15 格
          </div>
          <span className="text-xs text-slate-400 mt-0.5">15 ÷ 3 = 恰好需要 5 块 L 骨牌</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-amber-500 font-bold">第一步：中心 L 骨牌妙招</span>
          <div className="text-lg font-black text-amber-500 mt-1">
            覆盖其余 3 象限内角
          </div>
          <span className="text-xs text-slate-400 mt-0.5">为完好象限各制造 1 个“人工破洞”</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-emerald-500 font-bold">第二步：四象限独立铺满</span>
          <div className="text-lg font-black text-emerald-500 mt-1">
            4 块骨牌分别就位
          </div>
          <span className="text-xs text-slate-400 mt-0.5">每个 2×2 子棋盘各自完美拼满！</span>
        </div>
      </div>
    </div>
  );
}
