'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, Play, RotateCcw, FastForward, CheckCircle2, Award } from 'lucide-react';

export default function FrogJumpingLab() {
  const [n, setN] = useState<number>(5); // 荷叶数 3..7
  const [startPos, setStartPos] = useState<number>(3); // 起始荷叶 (1..n)
  const [currentPos, setCurrentPos] = useState<number>(3); // 当前青蛙位置
  const [stepsTaken, setStepsTaken] = useState<number>(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // 蒙特卡洛统计
  const [trialCount, setTrialCount] = useState<number>(0);
  const [totalSimSteps, setTotalSimSteps] = useState<number>(0);

  // 理论期望公式：E(x) = x * (N + 1 - x)
  const theoreticalExpected = startPos * (n + 1 - startPos);
  const experimentalAvg = trialCount > 0 ? (totalSimSteps / trialCount).toFixed(2) : '-';

  // 青蛙单步跳跃 (左右各 50%)
  const jumpOneStep = () => {
    if (isGameOver) return;
    const direction = Math.random() < 0.5 ? -1 : 1;
    const nextPos = currentPos + direction;
    setCurrentPos(nextPos);
    setStepsTaken((prev) => prev + 1);

    if (nextPos === 0 || nextPos === n + 1) {
      // 成功跳上岸
      setIsGameOver(true);
      setIsJumping(false);
      setTrialCount((c) => c + 1);
      setTotalSimSteps((s) => s + (stepsTaken + 1));
    }
  };

  // 自动跳跃定时器
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isJumping && !isGameOver) {
      timer = setTimeout(() => {
        jumpOneStep();
      }, 250);
    }
    return () => clearTimeout(timer);
  }, [isJumping, currentPos, isGameOver, stepsTaken]);

  // 重置单局
  const resetSingle = (newStart = startPos, newN = n) => {
    setN(newN);
    setStartPos(newStart);
    setCurrentPos(newStart);
    setStepsTaken(0);
    setIsJumping(false);
    setIsGameOver(false);
  };

  // 蒙特卡洛极速模拟 100 次
  const runBatchSim = (count = 100) => {
    let addedSteps = 0;
    for (let i = 0; i < count; i++) {
      let p = startPos;
      let s = 0;
      while (p > 0 && p < n + 1) {
        p += Math.random() < 0.5 ? -1 : 1;
        s += 1;
      }
      addedSteps += s;
    }
    setTrialCount((c) => c + count);
    setTotalSimSteps((s) => s + addedSteps);
  };

  return (
    <div className={styles.container}>
      {/* 头部标题与控制栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            青蛙跳荷叶一维随机游走实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            对称马尔可夫吸收链：期望跳跃步数 $E(x) = x \times (N + 1 - x)$ 惊现二次抛物线
          </p>
        </div>

        {/* 荷叶数量与起点选择 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => resetSingle(3, 5)}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50"
          >
            5张荷叶 (中点x=3)
          </button>
          <button
            onClick={() => resetSingle(2, 4)}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50"
          >
            4张荷叶 (x=2)
          </button>
        </div>
      </div>

      {/* 池塘荷叶主视觉 */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-6 flex flex-col items-center">
        {/* 池塘水面 */}
        <div className="w-full max-w-2xl bg-gradient-to-b from-sky-950 to-cyan-950 rounded-xl p-6 border border-cyan-900/60 flex items-center justify-between gap-1 sm:gap-2 relative min-h-[170px]">
          {/* 左岸 (0) */}
          <div
            className={`w-14 sm:w-16 h-28 rounded-lg flex flex-col items-center justify-center border transition-all ${
              currentPos === 0
                ? 'bg-amber-600/30 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20'
                : 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
            }`}
          >
            <span className="text-xl">🏝️</span>
            <span className="text-xs font-bold mt-1">左岸 0</span>
            <span className="text-[10px] text-slate-400">终点</span>
          </div>

          {/* 荷叶 1..n */}
          {Array.from({ length: n }).map((_, idx) => {
            const padNum = idx + 1;
            const hasFrog = currentPos === padNum;
            const isStart = startPos === padNum;

            return (
              <div
                key={`pad-${padNum}`}
                onClick={() => !isJumping && resetSingle(padNum, n)}
                className={`flex-1 h-28 rounded-xl flex flex-col items-center justify-between p-2 cursor-pointer transition-all border ${
                  hasFrog
                    ? 'bg-emerald-600/20 border-emerald-400 shadow-md shadow-emerald-500/30'
                    : isStart
                    ? 'bg-indigo-950/30 border-indigo-500/50'
                    : 'bg-cyan-950/20 border-cyan-800/40 hover:bg-cyan-900/30'
                }`}
              >
                <div className="text-[10px] text-slate-400 font-mono">#{padNum}</div>
                {/* 荷叶与青蛙 */}
                <div className="relative flex items-center justify-center my-auto">
                  <span className="text-2xl sm:text-3xl filter drop-shadow">🍃</span>
                  {hasFrog && (
                    <span className="absolute -top-3 text-2xl sm:text-3xl animate-bounce">
                      🐸
                    </span>
                  )}
                </div>
                <div className="text-[10px] font-semibold text-slate-300">
                  {isStart ? '起点' : ''}
                </div>
              </div>
            );
          })}

          {/* 右岸 (n+1) */}
          <div
            className={`w-14 sm:w-16 h-28 rounded-lg flex flex-col items-center justify-center border transition-all ${
              currentPos === n + 1
                ? 'bg-amber-600/30 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20'
                : 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
            }`}
          >
            <span className="text-xl">🏝️</span>
            <span className="text-xs font-bold mt-1">右岸 {n + 1}</span>
            <span className="text-[10px] text-slate-400">终点</span>
          </div>
        </div>

        {/* 状态与单次操作栏 */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 w-full max-w-2xl">
          <div className="text-xs text-slate-300">
            当前单次试验步数：<span className="text-base font-bold text-amber-400">{stepsTaken}</span> 步
            {isGameOver && (
              <span className="ml-2 text-emerald-400 font-bold">🎉 青蛙成功爬上岸！</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsJumping(!isJumping)}
              disabled={isGameOver}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition ${
                isJumping ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isJumping ? '暂停跳跃' : '开始单次跳跃'}
            </button>
            <button
              onClick={() => resetSingle(startPos, n)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="重置位置"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => runBatchSim(100)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
            >
              <FastForward className="w-3.5 h-3.5" /> 快速蒙特卡洛+100次
            </button>
          </div>
        </div>
      </div>

      {/* 理论 vs 实验统计对比 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">理论期望步数公式 E(x) = x · (N + 1 - x)</span>
          <div className="text-2xl font-black text-indigo-500 mt-1">
            {`${startPos} × (${n + 1} - ${startPos}) = ${theoreticalExpected} 步`}
          </div>
          <span className="text-xs text-slate-400 mt-0.5">左距 × 右距 = 抛物线理论极值</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">蒙特卡洛真实实验平均值</span>
          <div className="text-2xl font-black text-emerald-500 mt-1">
            {experimentalAvg} 步
          </div>
          <span className="text-xs text-slate-400 mt-0.5">
            {`已累计模拟 ${trialCount} 次，逼近理论值 ${theoreticalExpected}`}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">边界与对称性法则</span>
          <div className="text-lg font-bold text-slate-700 dark:text-slate-200 mt-1">
            E(0) = E({n + 1}) = 0
          </div>
          <span className="text-xs text-slate-400 mt-0.5">两岸作为吸收态，中央期望最高</span>
        </div>
      </div>
    </div>
  );
}

