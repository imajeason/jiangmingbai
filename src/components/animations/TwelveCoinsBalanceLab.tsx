'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, Scale, CheckCircle2, ShieldAlert, HelpCircle } from 'lucide-react';

export default function TwelveCoinsBalanceLab() {
  // 12 枚金币 (1..12)
  // 秘密设定的假币位置与轻重
  const [fakeCoinId, setFakeCoinId] = useState<number>(7);
  const [fakeType, setFakeType] = useState<'heavy' | 'light'>('light');

  // 当前天平托盘状态
  const [leftPan, setLeftPan] = useState<number[]>([1, 2, 3, 4]);
  const [rightPan, setRightPan] = useState<number[]>([5, 6, 7, 8]);
  const [weighCount, setWeighCount] = useState<number>(0);
  const [weighHistory, setWeighHistory] = useState<string[]>([]);
  const [balanceTilt, setBalanceTilt] = useState<'level' | 'left' | 'right' | null>(null);

  // 执行称量
  const handleWeigh = () => {
    if (weighCount >= 3) return;

    let leftWeight = leftPan.length * 10;
    if (leftPan.includes(fakeCoinId)) {
      leftWeight += fakeType === 'heavy' ? 2 : -2;
    }

    let rightWeight = rightPan.length * 10;
    if (rightPan.includes(fakeCoinId)) {
      rightWeight += fakeType === 'heavy' ? 2 : -2;
    }

    let result: 'level' | 'left' | 'right' = 'level';
    let resultText = '';
    if (leftWeight === rightWeight) {
      result = 'level';
      resultText = `第 ${weighCount + 1} 次: 左盘 [${leftPan.join(',')}] 与 右盘 [${rightPan.join(',')}] 平衡 (=)`;
    } else if (leftWeight > rightWeight) {
      result = 'left';
      resultText = `第 ${weighCount + 1} 次: 左盘 [${leftPan.join(',')}] 沉 ⬇，右盘 [${rightPan.join(',')}] 翘 ⬆`;
    } else {
      result = 'right';
      resultText = `第 ${weighCount + 1} 次: 右盘 [${rightPan.join(',')}] 沉 ⬇，左盘 [${leftPan.join(',')}] 翘 ⬆`;
    }

    setBalanceTilt(result);
    setWeighCount((c) => c + 1);
    setWeighHistory((prev) => [...prev, resultText]);
  };

  // 重置试验
  const handleReset = (newFake = fakeCoinId, newType = fakeType) => {
    setFakeCoinId(newFake);
    setFakeType(newType);
    setLeftPan([1, 2, 3, 4]);
    setRightPan([5, 6, 7, 8]);
    setWeighCount(0);
    setWeighHistory([]);
    setBalanceTilt(null);
  };

  // 一键设定为经典推荐策略第 2 步
  const setStep2Demo = () => {
    setLeftPan([1, 2, 5]);
    setRightPan([3, 6, 9]);
    setBalanceTilt(null);
  };

  return (
    <div className={styles.container}>
      {/* 头部标题与控制栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            十二金币称重与三进制信息论实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            假币位置与轻重未知（24 种可能）：无砝码天平三次称量，信息容量 $3^3 = 27 \ge 24$ 必胜锁定
          </p>
        </div>

        {/* 假币设定 */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
          <span className="text-slate-500">秘密假币:</span>
          <select
            value={fakeCoinId}
            onChange={(e) => handleReset(Number(e.target.value), fakeType)}
            className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-1.5 py-0.5 font-bold"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}号金币
              </option>
            ))}
          </select>
          <select
            value={fakeType}
            onChange={(e) => handleReset(fakeCoinId, e.target.value as any)}
            className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-1.5 py-0.5 font-bold"
          >
            <option value="light">偏轻 (轻假币)</option>
            <option value="heavy">偏重 (重假币)</option>
          </select>
        </div>
      </div>

      {/* 双盘天平模拟台 */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-6 flex flex-col items-center">
        <div className="w-full max-w-lg aspect-[400/220] relative flex flex-col items-center justify-center">
          <svg viewBox="0 0 400 220" className="w-full h-full select-none">
            {/* 天平支架柱 */}
            <rect x="195" y="60" width="10" height="130" fill="#64748b" rx="2" />
            <polygon points="175,190 225,190 200,160" fill="#475569" />

            {/* 横梁横杆 (倾斜动画) */}
            <g
              transform={
                balanceTilt === 'left'
                  ? 'rotate(-8 200 65)'
                  : balanceTilt === 'right'
                  ? 'rotate(8 200 65)'
                  : 'rotate(0 200 65)'
              }
              className="transition-transform duration-500 origin-center"
            >
              <line x1="80" y1="65" x2="320" y2="65" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
              <circle cx="200" cy="65" r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />

              {/* 左盘悬索与托盘 */}
              <line x1="90" y1="65" x2="60" y2="120" stroke="#94a3b8" strokeWidth="2" />
              <line x1="90" y1="65" x2="120" y2="120" stroke="#94a3b8" strokeWidth="2" />
              <rect x="40" y="120" width="100" height="8" rx="4" fill="#38bdf8" />

              {/* 右盘悬索与托盘 */}
              <line x1="310" y1="65" x2="280" y2="120" stroke="#94a3b8" strokeWidth="2" />
              <line x1="310" y1="65" x2="340" y2="120" stroke="#94a3b8" strokeWidth="2" />
              <rect x="260" y="120" width="100" height="8" rx="4" fill="#f59e0b" />
            </g>

            {/* 左盘硬币显示 */}
            <text x="90" y="155" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">
              左盘: [{leftPan.join(', ') || '空'}]
            </text>

            {/* 右盘硬币显示 */}
            <text x="310" y="155" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold">
              右盘: [{rightPan.join(', ') || '空'}]
            </text>
          </svg>
        </div>

        {/* 称量操作与经典策略向导 */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 w-full max-w-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={handleWeigh}
              disabled={weighCount >= 3}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition disabled:opacity-40"
            >
              <Scale className="w-4 h-4" />
              {`执行称量 (${weighCount}/3 次)`}
            </button>
            <button
              onClick={setStep2Demo}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
            >
              载入神级第2步 (1,2,5 vs 3,6,9)
            </button>
          </div>

          <button
            onClick={() => handleReset()}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" /> 重置
          </button>
        </div>

        {/* 称量记录列表 */}
        {weighHistory.length > 0 && (
          <div className="mt-4 w-full max-w-lg p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
            {weighHistory.map((h, i) => (
              <div key={i} className="text-emerald-400 font-bold">{h}</div>
            ))}
          </div>
        )}
      </div>

      {/* 信息论与三进制法则看板 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">全部未知状态数</span>
          <div className="text-2xl font-black text-indigo-500 mt-1 font-mono">
            12 × 2 = 24 种
          </div>
          <span className="text-xs text-slate-400 mt-0.5">每枚金币都有偏轻或偏重 2 种案情</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-emerald-500 font-bold">三进制天平信息容量</span>
          <div className="text-2xl font-black text-emerald-500 mt-1 font-mono">
            3³ = 27 ≥ 24
          </div>
          <span className="text-xs text-slate-400 mt-0.5">3次称量信息量完全足以精准锁定</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-amber-500 font-bold">第一步必选 4 vs 4</span>
          <div className="text-xl font-black text-amber-500 mt-1">
            留 4 枚在盘外
          </div>
          <span className="text-xs text-slate-400 mt-0.5">若 6 vs 6 必然倾斜，浪费信息导致失败</span>
        </div>
      </div>
    </div>
  );
}
