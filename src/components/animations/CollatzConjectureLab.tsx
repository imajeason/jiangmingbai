'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, Play, RotateCcw, TrendingUp, Compass, CheckCircle2 } from 'lucide-react';

// 计算考拉兹序列
function computeCollatz(start: number, maxSteps = 500): number[] {
  const seq: number[] = [start];
  let cur = start;
  while (cur !== 1 && seq.length < maxSteps) {
    if (cur % 2 === 0) {
      cur = cur / 2;
    } else {
      cur = 3 * cur + 1;
    }
    seq.push(cur);
  }
  return seq;
}

export default function CollatzConjectureLab() {
  const [inputVal, setInputVal] = useState<number>(7);
  const [currentNum, setCurrentNum] = useState<number>(7);

  const seq = computeCollatz(currentNum);
  const peakVal = Math.max(...seq);
  const totalSteps = seq.length - 1;

  // 预设经典数字
  const presets = [
    { n: 7, label: '7 (16步/峰值52)' },
    { n: 9, label: '9 (19步/峰值52)' },
    { n: 16, label: '16 (4步直线降落)' },
    { n: 27, label: '27 (111步惊天海啸/峰值9232)' },
  ];

  // SVG 折线图缩放参数 (400 x 180)
  const chartW = 380;
  const chartH = 150;
  const padX = 20;
  const padY = 15;

  const getChartX = (idx: number) => {
    if (seq.length <= 1) return padX;
    return padX + (idx / (seq.length - 1)) * (chartW - 2 * padX);
  };

  const getChartY = (val: number) => {
    if (peakVal === 1) return chartH / 2;
    // 对数或线性缩放：为了看清大峰值，若峰值很大使用对数比例，否则线性
    const useLog = peakVal > 200;
    if (useLog) {
      const logMax = Math.log10(peakVal);
      const logVal = Math.log10(val);
      return chartH - padY - (logVal / logMax) * (chartH - 2 * padY);
    } else {
      return chartH - padY - (val / peakVal) * (chartH - 2 * padY);
    }
  };

  const pointsD = seq.reduce((acc, val, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${getChartX(idx)} ${getChartY(val)}`;
  }, '');

  return (
    <div className={styles.container}>
      {/* 头部标题与控制栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            冰雹猜想与 3n+1 飞行轨迹动态实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            偶数折半、奇数乘3加1：无论多狂暴的数字冰雹，最终皆被吸入 4-2-1 归一黑洞
          </p>
        </div>

        {/* 预设按钮 */}
        <div className="flex flex-wrap items-center gap-1.5">
          {presets.map((p) => (
            <button
              key={p.n}
              onClick={() => {
                setInputVal(p.n);
                setCurrentNum(p.n);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded border transition ${
                currentNum === p.n
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-indigo-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 自定义输入框 */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">起始正整数 N：</span>
          <input
            type="number"
            min={1}
            max={5000}
            value={inputVal}
            onChange={(e) => setInputVal(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-24 px-3 py-1.5 text-sm font-bold font-mono bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100"
          />
          <button
            onClick={() => setCurrentNum(inputVal)}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
          >
            开始追踪
          </button>
        </div>

        <div className="text-xs text-slate-500">
          {`当前起始数：${currentNum}`}
        </div>
      </div>

      {/* SVG 折线图看板 */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-6 flex flex-col items-center">
        <div className="w-full max-w-xl aspect-[380/160] relative">
          <svg viewBox="0 0 380 160" className="w-full h-full select-none">
            {/* 网格水平线 */}
            <line x1={padX} y1={padY} x2={chartW - padX} y2={padY} stroke="rgba(255,255,255,0.06)" />
            <line x1={padX} y1={chartH / 2} x2={chartW - padX} y2={chartH / 2} stroke="rgba(255,255,255,0.06)" />
            <line x1={padX} y1={chartH - padY} x2={chartW - padX} y2={chartH - padY} stroke="rgba(255,255,255,0.15)" />

            {/* 折线阴影与轨迹 */}
            <path
              d={pointsD}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow"
            />

            {/* 起点与终点 */}
            <circle cx={getChartX(0)} cy={getChartY(seq[0])} r="4" fill="#818cf8" />
            <circle cx={getChartX(seq.length - 1)} cy={getChartY(1)} r="5" fill="#10b981" />

            {/* 终点文字 */}
            <text
              x={getChartX(seq.length - 1)}
              y={getChartY(1) - 10}
              textAnchor="middle"
              fill="#10b981"
              fontSize="11"
              fontWeight="bold"
            >
              终点 1
            </text>

            {/* 峰值标记 */}
            {seq.indexOf(peakVal) > 0 && (
              <>
                <circle cx={getChartX(seq.indexOf(peakVal))} cy={getChartY(peakVal)} r="4" fill="#f43f5e" />
                <text
                  x={getChartX(seq.indexOf(peakVal))}
                  y={getChartY(peakVal) - 8}
                  textAnchor="middle"
                  fill="#f43f5e"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {`最高峰 ${peakVal}`}
                </text>
              </>
            )}
          </svg>
        </div>

        <div className="mt-3 text-xs text-slate-400">
          📈 冰雹飞行剖面图：横轴为飞行步数，纵轴为当前高度（数值）
        </div>
      </div>

      {/* 核心指标统计 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">着陆总步数 (到达 1)</span>
          <div className="text-2xl font-black text-indigo-500 mt-1">{totalSteps} 步</div>
          <span className="text-xs text-slate-400 mt-0.5">迭代操作总次数</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-rose-500 font-bold">冰雹冲刺最高峰值</span>
          <div className="text-2xl font-black text-rose-500 mt-1">{peakVal}</div>
          <span className="text-xs text-slate-400 mt-0.5">
            {`是起始数的 ${(peakVal / currentNum).toFixed(1)} 倍`}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-emerald-500 font-bold">终态循环圈验证</span>
          <div className="text-xl font-black text-emerald-500 mt-1 font-mono">
            4 ➔ 2 ➔ 1 ➔ 4
          </div>
          <span className="text-xs text-slate-400 mt-0.5">死锁周期 3 的不可逆归一黑洞</span>
        </div>
      </div>

      {/* 轨迹数值明细流 (前 40 步) */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
          {`飞行足迹数值流（展示前 ${Math.min(seq.length, 36)} 项）：`}
        </span>
        <div className="flex flex-wrap gap-1.5 text-xs font-mono">
          {seq.slice(0, 36).map((val, idx) => (
            <span
              key={idx}
              className={`px-2 py-1 rounded border font-bold ${
                val === 1
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : val === peakVal
                  ? 'bg-rose-500 text-white border-rose-600'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {val}
            </span>
          ))}
          {seq.length > 36 && <span className="text-slate-400 py-1">... ({seq.length - 36}步省略)</span>}
        </div>
      </div>
    </div>
  );
}
