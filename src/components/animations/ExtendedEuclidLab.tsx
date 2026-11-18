'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, ArrowDown, ArrowUp, CheckCircle2 } from 'lucide-react';

interface EuclidStep {
  a: number;
  b: number;
  q: number;
  r: number;
}

// 扩展欧几里得计算
function runExtendedEuclid(a: number, b: number) {
  const steps: EuclidStep[] = [];
  let curA = a;
  let curB = b;

  while (curB !== 0) {
    const q = Math.floor(curA / curB);
    const r = curA % curB;
    steps.push({ a: curA, b: curB, q, r });
    curA = curB;
    curB = r;
  }

  const gcdVal = curA;

  // 扩展欧几里得回代求系数 x, y
  let x0 = 1, y0 = 0;
  let x1 = 0, y1 = 1;
  for (let i = 0; i < steps.length - 1; i++) {
    const q = steps[i].q;
    const nextX = x0 - q * x1;
    const nextY = y0 - q * y1;
    x0 = x1;
    y0 = y1;
    x1 = nextX;
    y1 = nextY;
  }

  // 特解
  return {
    gcd: gcdVal,
    steps,
    x: x1,
    y: y1,
  };
}

export default function ExtendedEuclidLab() {
  const [numA, setNumA] = useState<number>(47);
  const [numB, setNumB] = useState<number>(17);
  const [kOffset, setKOffset] = useState<number>(0);

  const result = runExtendedEuclid(numA, numB);

  // 通解：x = x0 + k * (b/gcd), y = y0 - k * (a/gcd)
  const currentX = result.x + kOffset * (numB / result.gcd);
  const currentY = result.y - kOffset * (numA / result.gcd);
  const checkValue = numA * currentX + numB * currentY;

  return (
    <div className={styles.container}>
      {/* 头部标题与控制栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            裴蜀定理与扩展欧几里得回代实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            正向除法求最大公约数、逆向回代消元求特解：$a x + b y = \gcd(a, b)$
          </p>
        </div>

        {/* 预设数字组合 */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => { setNumA(7); setNumB(5); setKOffset(0); }}
            className={`px-2 py-1 text-xs font-semibold rounded ${
              numA === 7 && numB === 5 ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            7 与 5
          </button>
          <button
            onClick={() => { setNumA(47); setNumB(17); setKOffset(0); }}
            className={`px-2 py-1 text-xs font-semibold rounded ${
              numA === 47 && numB === 17 ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            47 与 17
          </button>
          <button
            onClick={() => { setNumA(43); setNumB(19); setKOffset(0); }}
            className={`px-2 py-1 text-xs font-semibold rounded ${
              numA === 43 && numB === 19 ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            43 与 19
          </button>
        </div>
      </div>

      {/* 正向除法与逆向回代对照双栏 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* 正向辗转相除过程 */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <div className="text-xs font-bold text-sky-400 mb-3 flex items-center gap-1.5">
            <ArrowDown className="w-4 h-4" /> 步骤一：正向辗转相除法 (记录余数式)
          </div>
          <div className="space-y-2 text-xs font-mono">
            {result.steps.map((st, i) => (
              <div
                key={i}
                className="p-2 rounded bg-slate-800/80 border border-slate-700 text-slate-200 flex justify-between"
              >
                <span>{`${st.a} = ${st.q} × ${st.b} + ${st.r}`}</span>
                {st.r > 0 ? (
                  <span className="text-sky-400 font-bold">{`⟹ ${st.r} = ${st.a} - ${st.q} × ${st.b}`}</span>
                ) : (
                  <span className="text-emerald-400 font-bold">余0 (除尽)</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-slate-400">
            {`最大公约数 gcd(${numA}, ${numB}) = `}
            <span className="text-emerald-400 font-bold text-sm">{result.gcd}</span>
          </div>
        </div>

        {/* 逆向回代求特解 */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <div className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-1.5">
            <ArrowUp className="w-4 h-4" /> 步骤二：逆向回代消去中间余数
          </div>
          <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono space-y-2 text-slate-300">
            <div>从最后一个非零余数出发逐步向上代换消元：</div>
            <div className="text-amber-300 font-bold">
              {`${result.gcd} = (${result.x}) × ${numA} + (${result.y}) × ${numB}`}
            </div>
            <div className="pt-2 border-t border-slate-700/60 text-slate-400">
              得基础特解：<span className="text-white font-bold">{`x₀ = ${result.x}, y₀ = ${result.y}`}</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> 验算：
            {`${numA} × (${result.x}) + ${numB} × (${result.y}) = ${numA * result.x + numB * result.y}`}
          </div>
        </div>
      </div>

      {/* 裴蜀定理通解滑动调试器 */}
      <div className="bg-white dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <span className="text-xs font-bold text-slate-500">任意整数解 (通解调节 k)：</span>
            <div className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {`${numA} × (${currentX}) + ${numB} × (${currentY}) = `}
              <span className="text-emerald-500 font-black">{checkValue}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setKOffset((k) => k - 1)}
              className="px-2.5 py-1 text-xs rounded bg-slate-100 dark:bg-slate-700 font-bold"
            >
              k - 1
            </button>
            <span className="text-xs font-mono font-bold px-2">{`k = ${kOffset}`}</span>
            <button
              onClick={() => setKOffset((k) => k + 1)}
              className="px-2.5 py-1 text-xs rounded bg-slate-100 dark:bg-slate-700 font-bold"
            >
              k + 1
            </button>
            <button
              onClick={() => setKOffset(0)}
              className="p-1 text-slate-400 hover:text-slate-200"
              title="重置k"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            {`x = ${result.x} + ${numB / result.gcd}k = `}
            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{currentX}</span>
          </div>
          <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            {`y = ${result.y} - ${numA / result.gcd}k = `}
            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{currentY}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
