'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, ChevronRight, ChevronLeft, CheckCircle2, Layers } from 'lucide-react';

interface Fraction {
  num: number;
  den: number;
  val: number;
}

// 求最大公约数
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// 生成 n 阶法里数列 (0/1 到 1/1)
function generateFarey(n: number): Fraction[] {
  const list: Fraction[] = [];
  for (let d = 1; d <= n; d++) {
    for (let num = 0; num <= d; num++) {
      if (gcd(num, d) === 1) {
        list.push({ num, den: d, val: num / d });
      }
    }
  }
  return list.sort((a, b) => a.val - b.val);
}

export default function FareySequenceLab() {
  const [n, setN] = useState<number>(5); // 阶数 1..7
  const [selectedPairIdx, setSelectedPairIdx] = useState<number>(3); // 默认选中的相邻对索引

  const fareyList = generateFarey(n);
  const safePairIdx = Math.min(selectedPairIdx, fareyList.length - 2);
  const leftFrac = fareyList[safePairIdx] || fareyList[0];
  const rightFrac = fareyList[safePairIdx + 1] || fareyList[1];

  // 交叉乘积：bc - ad
  const crossProduct = rightFrac.num * leftFrac.den - leftFrac.num * rightFrac.den;
  // 中位数
  const mediantNum = leftFrac.num + rightFrac.num;
  const mediantDen = leftFrac.den + rightFrac.den;
  const mediantVal = (mediantNum / mediantDen).toFixed(4);

  return (
    <div className={styles.container}>
      {/* 头部标题与控制栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            法里数列与中位加法交叉验证实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            分母不超过 $n$ 的最简真分数有序链：相邻项交叉相乘差恒为 1，中位数插入严丝合缝
          </p>
        </div>

        {/* 阶数 n 调节 */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setN(Math.max(1, n - 1))}
            disabled={n <= 1}
            className="p-1.5 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold px-2 text-indigo-600 dark:text-indigo-400">
            {`阶数 F_${n} (分母 ≤ ${n})`}
          </span>
          <button
            onClick={() => setN(Math.min(7, n + 1))}
            disabled={n >= 7}
            className="p-1.5 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 0 到 1 数轴动态分布图 */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-6 flex flex-col items-center">
        <div className="w-full max-w-2xl relative py-8 px-4 select-none">
          {/* 主数轴基准线 */}
          <div className="h-1 bg-slate-700 rounded-full w-full relative">
            <div className="absolute left-0 -top-1.5 w-4 h-4 rounded-full bg-slate-400" />
            <div className="absolute right-0 -top-1.5 w-4 h-4 rounded-full bg-slate-400" />
          </div>

          {/* 各分数刻度标记 */}
          {fareyList.map((frac, idx) => {
            const percent = frac.val * 100;
            const isLeft = idx === safePairIdx;
            const isRight = idx === safePairIdx + 1;
            const isHighlighted = isLeft || isRight;

            return (
              <div
                key={`${frac.num}/${frac.den}`}
                onClick={() => idx < fareyList.length - 1 && setSelectedPairIdx(idx)}
                style={{ left: `${percent}%` }}
                className="absolute top-4 -translate-x-1/2 flex flex-col items-center cursor-pointer group transition-all"
              >
                {/* 刻度柱 */}
                <div
                  className={`w-0.5 transition-all ${
                    isHighlighted
                      ? 'h-9 bg-emerald-400 shadow-sm shadow-emerald-400'
                      : 'h-6 bg-slate-500 group-hover:bg-indigo-400'
                  }`}
                />
                {/* 分数显示 */}
                <div
                  className={`text-xs font-mono font-bold mt-1.5 px-1 py-0.5 rounded transition-all ${
                    isHighlighted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 scale-110'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {frac.num}/{frac.den}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-xs text-slate-400">
          💡 点击数轴上任意位置，高亮检测该处的相邻两项分数与十字相乘
        </div>
      </div>

      {/* 当前选中相邻项的行列式定理验算看板 */}
      <div className="bg-white dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
        <div className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>选中相邻项：</span>
          <span className="font-mono text-sm text-indigo-600 dark:text-indigo-400 font-bold">
            {leftFrac.num}/{leftFrac.den}
          </span>
          <span>与</span>
          <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400 font-bold">
            {rightFrac.num}/{rightFrac.den}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 十字相乘差 */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">十字交叉相乘差 (bc - ad)</span>
            <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
              {`${rightFrac.num} × ${leftFrac.den} - ${leftFrac.num} × ${rightFrac.den} =`}
              <span className="text-2xl text-emerald-500 font-black ml-1.5">{crossProduct}</span>
            </div>
            <span className="text-[11px] text-emerald-500 font-semibold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 邻项定理严格恒等于 1！
            </span>
          </div>

          {/* 两数间距 */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">两分数绝对距离 (1 / bd)</span>
            <div className="text-lg font-black text-slate-700 dark:text-slate-200 mt-1 font-mono">
              {`1 / (${leftFrac.den} × ${rightFrac.den}) = 1/${leftFrac.den * rightFrac.den}`}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {`≈ ${(1 / (leftFrac.den * rightFrac.den)).toFixed(4)}`}
            </span>
          </div>

          {/* 中位假加法生成 */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">中位加法插值 (a+c)/(b+d)</span>
            <div className="text-lg font-black text-amber-500 mt-1 font-mono">
              {`(${leftFrac.num}+${rightFrac.num})/(${leftFrac.den}+${rightFrac.den}) = ${mediantNum}/${mediantDen}`}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {`数值 ${mediantVal} 严密卡在两数之间`}
            </span>
          </div>
        </div>
      </div>

      {/* 当前阶所有项列表条 */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
          {`F_${n} 完整数列（共 ${fareyList.length} 项）：`}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {fareyList.map((frac, idx) => (
            <span
              key={`item-${idx}`}
              className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300"
            >
              {frac.num}/{frac.den}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
