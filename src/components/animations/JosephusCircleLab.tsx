'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, Play, Pause, RotateCcw, ChevronRight, CheckCircle2, User, Award } from 'lucide-react';

export default function JosephusCircleLab() {
  const [n, setN] = useState<number>(10); // 人数 5..16
  const [eliminated, setEliminated] = useState<number[]>([]); // 已淘汰的座号 (1-based)
  const [currentIdx, setCurrentIdx] = useState<number>(0); // 当前指针 (0-based)
  const [count, setCount] = useState<number>(1); // 当前报数 1 或 2
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [winner, setWinner] = useState<number | null>(null);

  // 计算理论幸存者
  // N = 2^m + L => J(N) = 2L + 1
  const m = Math.floor(Math.log2(n));
  const pow2 = Math.pow(2, m);
  const L = n - pow2;
  const theoreticalWinner = 2 * L + 1;

  // 二进制左移变换表示
  const binN = n.toString(2);
  const binShifted = binN.slice(1) + binN[0];
  const decShifted = parseInt(binShifted, 2);

  // 单步执行一次淘汰
  const stepForward = () => {
    if (winner !== null) return;

    // 获取当前仍然存活的人的列表
    const alive: number[] = [];
    for (let i = 1; i <= n; i++) {
      if (!eliminated.includes(i)) alive.push(i);
    }

    if (alive.length <= 1) {
      setWinner(alive[0]);
      setIsPlaying(false);
      return;
    }

    // 当前人报数
    if (count === 1) {
      // 报 1 安全，下一个人报 2
      setCount(2);
      // 移动到下一个活着的人
      const curAliveIdx = alive.indexOf(alive[currentIdx % alive.length]);
      const nextAliveIdx = (curAliveIdx + 1) % alive.length;
      setCurrentIdx(nextAliveIdx);
    } else {
      // 报 2 淘汰！
      const victim = alive[currentIdx % alive.length];
      const newEliminated = [...eliminated, victim];
      setEliminated(newEliminated);

      const remainingAlive = alive.filter((x) => x !== victim);
      if (remainingAlive.length === 1) {
        setWinner(remainingAlive[0]);
        setIsPlaying(false);
        return;
      }

      // 下一个人从 1 重新报数
      setCount(1);
      const nextIdx = currentIdx % remainingAlive.length;
      setCurrentIdx(nextIdx);
    }
  };

  // 自动播放效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && winner === null) {
      timer = setTimeout(() => {
        stepForward();
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, eliminated, count, currentIdx, winner]);

  // 重置游戏
  const handleReset = (newN = n) => {
    setN(newN);
    setEliminated([]);
    setCurrentIdx(0);
    setCount(1);
    setIsPlaying(false);
    setWinner(null);
  };

  return (
    <div className={styles.container}>
      {/* 头部标题与控制栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            约瑟夫环报数淘汰与二进制位移实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            围成一圈报 1 留、报 2 出局：满 2 的幂次首位胜，二进制首位循环移位秒算
          </p>
        </div>

        {/* 人数选择 */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 px-1">总人数:</span>
          {[6, 8, 10, 13, 16].map((num) => (
            <button
              key={num}
              onClick={() => handleReset(num)}
              className={`px-2 py-1 text-xs font-semibold rounded ${
                n === num ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {num}人
            </button>
          ))}
        </div>
      </div>

      {/* 圆环动态展示台 */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-6 flex flex-col items-center">
        <div className="w-full max-w-sm aspect-square relative flex items-center justify-center">
          <svg viewBox="0 0 300 300" className="w-full h-full select-none">
            {/* 圆环虚线背景 */}
            <circle cx="150" cy="150" r="105" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="5 5" />

            {/* 放置 n 个人 */}
            {Array.from({ length: n }).map((_, idx) => {
              const seatNum = idx + 1;
              const angle = ((idx * (360 / n) - 90) * Math.PI) / 180;
              const cx = 150 + 105 * Math.cos(angle);
              const cy = 150 + 105 * Math.sin(angle);

              const isDead = eliminated.includes(seatNum);
              const isWon = winner === seatNum;
              const isCurrent = !isDead && !winner;

              return (
                <g key={`seat-${seatNum}`}>
                  {/* 座位圆形 */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isWon ? 20 : 16}
                    fill={
                      isWon
                        ? '#fbbf24'
                        : isDead
                        ? '#334155'
                        : '#6366f1'
                    }
                    stroke={isWon ? '#ffffff' : isDead ? '#475569' : '#818cf8'}
                    strokeWidth={isWon ? 3 : 2}
                    className="transition-all duration-300"
                  />
                  {/* 座号文字 */}
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fill={isDead ? '#64748b' : '#ffffff'}
                    fontSize={isWon ? '13' : '11'}
                    fontWeight="bold"
                  >
                    {isDead ? '✕' : seatNum}
                  </text>

                  {/* 幸存者皇冠 */}
                  {isWon && (
                    <text x={cx} y={cy - 22} textAnchor="middle" fontSize="16">
                      👑
                    </text>
                  )}
                </g>
              );
            })}

            {/* 中心状态盘 */}
            <circle cx="150" cy="150" r="48" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <text x="150" y="142" textAnchor="middle" fill="#94a3b8" fontSize="10">
              {winner ? '最终幸存者' : count === 1 ? '报数：1 (安全)' : '报数：2 (淘汰!)'}
            </text>
            <text
              x="150"
              y="166"
              textAnchor="middle"
              fill={winner ? '#fbbf24' : count === 1 ? '#10b981' : '#f43f5e'}
              fontSize="18"
              fontWeight="black"
            >
              {winner ? `${winner} 号` : count === 1 ? '安全通过' : '出局淘汰'}
            </text>
          </svg>
        </div>

        {/* 控制按钮条 */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={winner !== null}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? '暂停' : '自动播放'}
          </button>

          <button
            onClick={stepForward}
            disabled={isPlaying || winner !== null}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" /> 单步报数
          </button>

          <button
            onClick={() => handleReset()}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" /> 重置
          </button>
        </div>
      </div>

      {/* 理论计算与二进制循环移位公式 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">2的整次幂分解 N = 2^m + L</span>
          <div className="text-2xl font-black text-indigo-500 mt-1">
            {n} = {pow2} + {L}
          </div>
          <span className="text-xs text-slate-400 mt-0.5">
            {`基准幂 2^${m}=${pow2}，多出人数 L=${L}`}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">理论幸存者公式 J(N) = 2L + 1</span>
          <div className="text-2xl font-black text-emerald-500 mt-1">
            {`2 × ${L} + 1 =`} <span className="text-3xl font-black">{theoreticalWinner} 号</span>
          </div>
          <span className="text-xs text-slate-400 mt-0.5">无需模拟，代数直接出结果</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">二进制循环左移法（位运算）</span>
          <div className="text-xl font-black text-amber-500 mt-1 font-mono">
            {binN} ➜ {binShifted} = {decShifted}
          </div>
          <span className="text-xs text-slate-400 mt-0.5">首位 1 挪到末尾，立得幸存座号！</span>
        </div>
      </div>
    </div>
  );
}

