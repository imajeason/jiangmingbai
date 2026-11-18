'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert, Plus, Trash2 } from 'lucide-react';

interface Bridge {
  id: string;
  name: string;
  u: 'A' | 'B' | 'C' | 'D';
  v: 'A' | 'B' | 'C' | 'D';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  curve?: string; // SVG 曲线控制
}

export default function KonigsbergBridgesLab() {
  const [visitedBridges, setVisitedBridges] = useState<string[]>([]);
  const [currentLand, setCurrentLand] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [addBridge8, setAddBridge8] = useState<boolean>(false);
  const [log, setLog] = useState<string>('请点击任一陆地作为散步起点，然后点击桥梁走过！');

  // 4 块陆地的中心坐标 (SVG 400 x 300)
  const lands = {
    A: { name: '北岸 A', x: 200, y: 55, color: '#38bdf8' },
    B: { name: '南岸 B', x: 200, y: 245, color: '#38bdf8' },
    C: { name: '中岛 C', x: 125, y: 150, color: '#a855f7' },
    D: { name: '东岛 D', x: 275, y: 150, color: '#f59e0b' },
  };

  // 基础 7 座桥梁
  const baseBridges: Bridge[] = [
    { id: 'b1', name: '北-中桥1', u: 'A', v: 'C', x1: 180, y1: 75, x2: 125, y2: 130 },
    { id: 'b2', name: '北-中桥2', u: 'A', v: 'C', x1: 200, y1: 75, x2: 145, y2: 130 },
    { id: 'b3', name: '南-中桥1', u: 'B', v: 'C', x1: 180, y1: 225, x2: 125, y2: 170 },
    { id: 'b4', name: '南-中桥2', u: 'B', v: 'C', x1: 200, y1: 225, x2: 145, y2: 170 },
    { id: 'b5', name: '北-东桥', u: 'A', v: 'D', x1: 225, y1: 75, x2: 275, y2: 130 },
    { id: 'b6', name: '南-东桥', u: 'B', v: 'D', x1: 225, y1: 225, x2: 275, y2: 170 },
    { id: 'b7', name: '中-东直联桥', u: 'C', v: 'D', x1: 155, y1: 150, x2: 245, y2: 150 },
  ];

  // 第 8 座桥（北岸 A 与南岸 B 直通）
  const bridge8: Bridge = {
    id: 'b8',
    name: '第8座新桥 (A-B)',
    u: 'A',
    v: 'B',
    x1: 200,
    y1: 75,
    x2: 200,
    y2: 225,
  };

  const currentBridges = addBridge8 ? [...baseBridges, bridge8] : baseBridges;

  // 统计每个顶点的度数 (连接的桥梁总数)
  const degrees = {
    A: currentBridges.filter((b) => b.u === 'A' || b.v === 'A').length,
    B: currentBridges.filter((b) => b.u === 'B' || b.v === 'B').length,
    C: currentBridges.filter((b) => b.u === 'C' || b.v === 'C').length,
    D: currentBridges.filter((b) => b.u === 'D' || b.v === 'D').length,
  };

  const oddCount = Object.values(degrees).filter((d) => d % 2 !== 0).length;

  // 尝试走过一座桥
  const handleCrossBridge = (bridge: Bridge) => {
    if (visitedBridges.includes(bridge.id)) return;

    if (!currentLand) {
      setLog('请先点击一块陆地作为你的出发起点！');
      return;
    }

    // 检查该桥是否连接当前所在陆地
    if (bridge.u !== currentLand && bridge.v !== currentLand) {
      setLog(`你现在位于【${lands[currentLand].name}】，无法直接瞬移到不相连的【${bridge.name}】！`);
      return;
    }

    const nextLand = bridge.u === currentLand ? bridge.v : bridge.u;
    const newVisited = [...visitedBridges, bridge.id];
    setVisitedBridges(newVisited);
    setCurrentLand(nextLand);

    if (newVisited.length === currentBridges.length) {
      setLog(`🎉 太不可思议了！你成功走过了全部 ${currentBridges.length} 座桥且无一重复！`);
    } else {
      // 检查当前陆地是否还有未走过的桥
      const remainingForCurrent = currentBridges.filter(
        (b) => !newVisited.includes(b.id) && (b.u === nextLand || b.v === nextLand)
      );
      if (remainingForCurrent.length === 0) {
        setLog(`⚠️ 无路可走！你到达了【${lands[nextLand].name}】，但连接该陆地的所有桥都已走过！散步受困！`);
      } else {
        setLog(`你穿过【${bridge.name}】到达了【${lands[nextLand].name}】！已走 ${newVisited.length}/${currentBridges.length} 座桥。`);
      }
    }
  };

  // 重置散步
  const resetWalk = () => {
    setVisitedBridges([]);
    setCurrentLand(null);
    setLog('已重置散步路线。请点击一块陆地作为起点开始散步！');
  };

  return (
    <div className={styles.container}>
      {/* 头部标题与控制栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            哥尼斯堡七桥与一笔画定理探究实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            图论开山之作：一笔画的命门是“奇顶点”！奇点为 0 或 2 则必通，其余皆为拓扑死锁
          </p>
        </div>

        {/* 修桥改造按钮 */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              setAddBridge8(!addBridge8);
              resetWalk();
            }}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded transition ${
              addBridge8 ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {addBridge8 ? <Trash2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {addBridge8 ? '拆除第 8 座桥 (还原 7 桥原版)' : '在 A 和 B 间增建第 8 座桥'}
          </button>
        </div>
      </div>

      {/* 交互地图画布 */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-6 flex flex-col items-center">
        <div className="w-full max-w-lg aspect-[400/300] relative">
          <svg viewBox="0 0 400 300" className="w-full h-full select-none">
            {/* 河流水面背景 */}
            <rect x="10" y="10" width="380" height="280" rx="16" fill="#0c4a6e" fillOpacity="0.4" />

            {/* 绘制所有桥梁 */}
            {currentBridges.map((b) => {
              const isVisited = visitedBridges.includes(b.id);
              const isEighth = b.id === 'b8';
              return (
                <g key={b.id} onClick={() => handleCrossBridge(b)} className="cursor-pointer group">
                  <line
                    x1={b.x1}
                    y1={b.y1}
                    x2={b.x2}
                    y2={b.y2}
                    stroke={
                      isVisited
                        ? '#10b981'
                        : isEighth
                        ? '#ec4899'
                        : '#cbd5e1'
                    }
                    strokeWidth={isVisited ? 6 : 4}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  {/* 桥梁名称标签 */}
                  <text
                    x={(b.x1 + b.x2) / 2 + (b.id === 'b1' ? -18 : b.id === 'b2' ? 14 : 0)}
                    y={(b.y1 + b.y2) / 2 + (b.id === 'b7' ? -8 : 0)}
                    textAnchor="middle"
                    fill={isVisited ? '#34d399' : '#94a3b8'}
                    fontSize="9"
                    fontWeight="bold"
                    className="pointer-events-none drop-shadow"
                  >
                    {isVisited ? '已走过' : b.name}
                  </text>
                </g>
              );
            })}

            {/* 绘制 4 块陆地 */}
            {(['A', 'B', 'C', 'D'] as const).map((key) => {
              const land = lands[key];
              const isCurrent = currentLand === key;
              const deg = degrees[key];
              const isOdd = deg % 2 !== 0;

              return (
                <g
                  key={key}
                  onClick={() => !currentLand && setCurrentLand(key)}
                  className="cursor-pointer group"
                >
                  {/* 陆地圆环 */}
                  <circle
                    cx={land.x}
                    cy={land.y}
                    r={key === 'C' ? 34 : 28}
                    fill={isCurrent ? '#fbbf24' : land.color}
                    fillOpacity={isCurrent ? 0.9 : 0.8}
                    stroke={isCurrent ? '#ffffff' : '#e2e8f0'}
                    strokeWidth={isCurrent ? 3 : 1.5}
                    className="transition-all duration-200"
                  />
                  {/* 陆地名称 */}
                  <text
                    x={land.x}
                    y={land.y - 4}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="11"
                    fontWeight="black"
                  >
                    {land.name}
                  </text>
                  {/* 度数 (分叉数) */}
                  <text
                    x={land.x}
                    y={land.y + 12}
                    textAnchor="middle"
                    fill={isOdd ? '#b91c1c' : '#047857'}
                    fontSize="10"
                    fontWeight="black"
                  >
                    {`${deg}度 (${isOdd ? '奇' : '偶'})`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 散步提示与状态栏 */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 w-full max-w-lg text-xs">
          <div className="text-slate-300 font-semibold">
            {log}
          </div>
          <button
            onClick={resetWalk}
            className="flex items-center gap-1 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> 重新散步
          </button>
        </div>
      </div>

      {/* 欧拉定理科学裁决看板 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">当前地图桥梁总数</span>
          <div className="text-2xl font-black text-indigo-500 mt-1">
            {currentBridges.length} 座桥
          </div>
          <span className="text-xs text-slate-400 mt-0.5">
            {addBridge8 ? '8座桥（新修了 A-B 桥）' : '7座桥（哥尼斯堡历史原貌）'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-rose-500 font-bold">奇顶点（连线奇数）个数</span>
          <div className="text-2xl font-black text-rose-500 mt-1">
            {oddCount} 个奇点
          </div>
          <span className="text-xs text-slate-400 mt-0.5">
            {oddCount <= 2 ? '符合一笔画条件 (≤2)' : '严重超标！欧拉宣判不可能！'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">欧拉一笔画可行性裁判</span>
          <div className="text-lg font-black mt-1">
            {oddCount <= 2 ? (
              <span className="text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5" /> 可以完美一笔画！
              </span>
            ) : (
              <span className="text-rose-500 flex items-center gap-1">
                <ShieldAlert className="w-5 h-5" /> 绝对无法不重复走完！
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 mt-0.5">
            {oddCount <= 2
              ? '必须以 C 或 D 为起点和终点'
              : '4个陆地全为奇数，天然死锁'}
          </span>
        </div>
      </div>
    </div>
  );
}
