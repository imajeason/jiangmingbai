'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, Bot, User, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function WythoffGameLab() {
  // 两堆石子数量 (pileA, pileB)
  const [pileA, setPileA] = useState<number>(6);
  const [pileB, setPileB] = useState<number>(10);
  const [turn, setTurn] = useState<'player' | 'ai'>('player');
  const [winner, setWinner] = useState<string | null>(null);
  const [log, setLog] = useState<string>('游戏开始！轮到你走棋。从一堆取任意颗，或两堆同时取相同颗。');

  // 取子交互状态
  const [moveType, setMoveType] = useState<'singleA' | 'singleB' | 'both'>('singleA');
  const [takeCount, setTakeCount] = useState<number>(1);

  const phi = (1 + Math.sqrt(5)) / 2; // 黄金分割比 1.6180339887...

  // 判定局势是否为奇异局势 (a <= b)
  const isSingular = (a: number, b: number): boolean => {
    const minVal = Math.min(a, b);
    const maxVal = Math.max(a, b);
    const k = maxVal - minVal;
    const ak = Math.floor(k * phi);
    return minVal === ak;
  };

  const currentIsSingular = isSingular(pileA, pileB);
  const diffK = Math.abs(pileB - pileA);
  const expectedMin = Math.floor(diffK * phi);

  // 寻找必胜走法：将局面转为奇异局势 (ak, bk)
  const findWinningMove = (
    a: number,
    b: number
  ): { type: 'singleA' | 'singleB' | 'both'; count: number; desc: string } | null => {
    if (isSingular(a, b)) return null;

    const minVal = Math.min(a, b);
    const maxVal = Math.max(a, b);
    const isASmaller = a <= b;
    const k = maxVal - minVal;
    const ak = Math.floor(k * phi);

    // 1. 若 minVal > ak，则两堆同时取 minVal - ak
    if (minVal > ak) {
      const takeBoth = minVal - ak;
      return {
        type: 'both',
        count: takeBoth,
        desc: `两堆同时拿走 ${takeBoth} 颗，制造奇异局势 (${ak}, ${ak + k})`,
      };
    }

    // 2. 检查单堆取法：保持较小数 minVal 不变，将较大数减至 minVal 的伴侣
    // 寻找哪一个奇异局势的 a_i = minVal
    for (let i = 0; i <= maxVal; i++) {
      const testA = Math.floor(i * phi);
      const testB = testA + i;
      if (testA === minVal && testB < maxVal) {
        const takeLarge = maxVal - testB;
        return {
          type: isASmaller ? 'singleB' : 'singleA',
          count: takeLarge,
          desc: `从较大堆拿走 ${takeLarge} 颗，使其变为奇异局势 (${testA}, ${testB})`,
        };
      }
      if (testB === minVal && testA < maxVal) {
        const takeLarge = maxVal - testA;
        return {
          type: isASmaller ? 'singleB' : 'singleA',
          count: takeLarge,
          desc: `从较大堆拿走 ${takeLarge} 颗，使其变为奇异局势 (${testA}, ${testB})`,
        };
      }
    }

    // 3. 将某一堆减少
    for (let testK = 0; testK < k; testK++) {
      const targetA = Math.floor(testK * phi);
      const targetB = targetA + testK;
      if (targetA === minVal && targetB < maxVal) {
        return {
          type: isASmaller ? 'singleB' : 'singleA',
          count: maxVal - targetB,
          desc: `调整至奇异局势 (${targetA}, ${targetB})`,
        };
      }
    }

    return null;
  };

  const winningAdvice = findWinningMove(pileA, pileB);

  // 玩家拿子
  const handlePlayerMove = () => {
    if (winner) return;

    let newA = pileA;
    let newB = pileB;

    if (moveType === 'singleA') {
      if (takeCount > pileA || takeCount <= 0) return;
      newA -= takeCount;
    } else if (moveType === 'singleB') {
      if (takeCount > pileB || takeCount <= 0) return;
      newB -= takeCount;
    } else {
      if (takeCount > pileA || takeCount > pileB || takeCount <= 0) return;
      newA -= takeCount;
      newB -= takeCount;
    }

    setPileA(newA);
    setPileB(newB);

    if (newA === 0 && newB === 0) {
      setWinner('player');
      setLog('恭喜你取走最后一颗石子，取得最终胜利！🎉');
      return;
    }

    setTurn('ai');
    setLog(`你拿走了石子。当前剩余 (${newA}, ${newB})。轮到 AI 思考...`);

    // AI 自动走棋 (延时 600ms)
    setTimeout(() => {
      executeAiMove(newA, newB);
    }, 600);
  };

  // AI 走棋逻辑
  const executeAiMove = (curA: number, curB: number) => {
    const move = findWinningMove(curA, curB);
    let nextA = curA;
    let nextB = curB;
    let aiMsg = '';

    if (move) {
      if (move.type === 'singleA') nextA -= move.count;
      else if (move.type === 'singleB') nextB -= move.count;
      else {
        nextA -= move.count;
        nextB -= move.count;
      }
      aiMsg = `AI 敏锐捕捉到黄金奇异局势！${move.desc}。`;
    } else {
      // 处于必败态，随机取 1 颗
      if (curA > 0) nextA -= 1;
      else nextB -= 1;
      aiMsg = `AI 处于奇异必败态，无奈只取了 1 颗。`;
    }

    setPileA(nextA);
    setPileB(nextB);

    if (nextA === 0 && nextB === 0) {
      setWinner('ai');
      setLog(`AI 取走了最后一颗石子，AI 获胜！🤖`);
    } else {
      setTurn('player');
      setLog(`${aiMsg} 剩余 (${nextA}, ${nextB})，轮到你走棋！`);
    }
  };

  // 重置游戏
  const resetGame = (customA = 6, customB = 10) => {
    setPileA(customA);
    setPileB(customB);
    setTurn('player');
    setWinner(null);
    setTakeCount(1);
    setLog(`游戏已重置为 (${customA}, ${customB})。祝你好运！`);
  };

  return (
    <div className={styles.container}>
      {/* 头部标题 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            威佐夫博弈与黄金分割常数对战实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            双堆取石子博弈：谁取走最后一颗谁胜！利用奇异局势 $a_k = \lfloor k \phi \rfloor$ 实现必胜锁局
          </p>
        </div>

        {/* 预设局势 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => resetGame(6, 10)}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50"
          >
            奇异局势(6, 10)
          </button>
          <button
            onClick={() => resetGame(8, 17)}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50"
          >
            必胜局势(8, 17)
          </button>
          <button
            onClick={() => resetGame(5, 8)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg border border-slate-200 dark:border-slate-700"
            title="重置"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 两堆石子展示台 */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 石子堆 A */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3">
              <span className="font-bold text-slate-300">石子堆 A</span>
              <span className="text-2xl font-black text-indigo-400">{pileA} 颗</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center min-h-[90px] items-center">
              {Array.from({ length: pileA }).map((_, i) => (
                <span
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 shadow-md shadow-indigo-500/30 flex items-center justify-center text-[10px] text-white font-bold"
                >
                  {i + 1}
                </span>
              ))}
              {pileA === 0 && <span className="text-xs text-slate-500">已取空</span>}
            </div>
          </div>

          {/* 石子堆 B */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3">
              <span className="font-bold text-slate-300">石子堆 B</span>
              <span className="text-2xl font-black text-amber-400">{pileB} 颗</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center min-h-[90px] items-center">
              {Array.from({ length: pileB }).map((_, i) => (
                <span
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 shadow-md shadow-amber-500/30 flex items-center justify-center text-[10px] text-white font-bold"
                >
                  {i + 1}
                </span>
              ))}
              {pileB === 0 && <span className="text-xs text-slate-500">已取空</span>}
            </div>
          </div>
        </div>

        {/* 局势分析状态条 */}
        <div className="mt-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">两堆差值 $k = |{pileB} - {pileA}| = {diffK}$</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              {`第 ${diffK} 阶奇异理论值 a_${diffK} = ⌊${diffK} × 1.618⌋ = ${expectedMin}`}
            </span>
          </div>
          <div>
            {currentIsSingular ? (
              <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30">
                ⚠️ 当前为必败奇异局势 (对手不犯错则先手必败)
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                ✨ 当前为必胜态！可一招转为奇异局势制胜
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 玩家操作面板 */}
      <div className="bg-white dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            {turn === 'player' ? (
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <User className="w-4 h-4" /> 轮到你出手：
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <Bot className="w-4 h-4 animate-spin" /> AI 思考中...
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500">{log}</span>
        </div>

        {turn === 'player' && !winner && (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-300">取法：</span>
              <select
                value={moveType}
                onChange={(e) => setMoveType(e.target.value as any)}
                className="text-xs bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-2 font-medium"
              >
                <option value="singleA" disabled={pileA === 0}>只从堆 A 取</option>
                <option value="singleB" disabled={pileB === 0}>只从堆 B 取</option>
                <option value="both" disabled={pileA === 0 || pileB === 0}>从两堆同时取相同数量</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-300">拿取数量：</span>
              <input
                type="number"
                min={1}
                max={moveType === 'singleA' ? pileA : moveType === 'singleB' ? pileB : Math.min(pileA, pileB)}
                value={takeCount}
                onChange={(e) => setTakeCount(Math.max(1, Number(e.target.value)))}
                className="w-16 text-xs bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-2 font-mono font-bold text-center"
              />
            </div>

            <button
              onClick={handlePlayerMove}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
            >
              确认拿取
            </button>
          </div>
        )}

        {/* 锦囊妙计提示 */}
        {winningAdvice && !winner && (
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            <span>制胜锦囊：{winningAdvice.desc}</span>
          </div>
        )}
      </div>

      {/* 奇异局势速查表 */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
          附：威佐夫奇异局势速查表（自然数被不重不漏分割）
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
          {[
            { k: 0, a: 0, b: 0 },
            { k: 1, a: 1, b: 2 },
            { k: 2, a: 3, b: 5 },
            { k: 3, a: 4, b: 7 },
            { k: 4, a: 6, b: 10 },
            { k: 5, a: 8, b: 13 },
          ].map((item) => (
            <div
              key={item.k}
              className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center"
            >
              <div className="text-[10px] text-slate-400">k = {item.k}</div>
              <div className="font-mono font-bold text-indigo-500">
                ({item.a}, {item.b})
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

