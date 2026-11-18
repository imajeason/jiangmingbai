'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, ChevronRight, Eye, CheckCircle2 } from 'lucide-react';

export default function GoldenRectangleCutLab() {
  const [cuts, setCuts] = useState<number>(3); // 裁剪层数 0..6
  const [showDiagonals, setShowDiagonals] = useState<boolean>(true);

  // 黄金比例 1.618034
  // 大矩形尺寸设定：长 320, 宽 320 / 1.618034 = 197.77 (归一化在 360 x 240 画布)
  // 6 级裁剪的坐标与尺寸 (x, y, w, h, isCutSquare, arcD)
  // Level 1: 切除左侧正方形 198x198，剩下右侧 122x198
  // Level 2: 在剩余中切除上方正方形 122x122，剩下右下方 122x76
  // Level 3: 在剩余中切除右侧正方形 76x76，剩下左下方 46x76
  // Level 4: 在剩余中切除下方正方形 46x46，剩下左上方 46x30
  // Level 5: 在剩余中切除左侧正方形 30x30，剩下右上方 16x30
  // Level 6: 在剩余中切除上方正方形 16x16...
  const squares = [
    { n: 1, x: 20, y: 20, size: 198, color: '#6366f1', arc: 'M 20 218 A 198 198 0 0 1 218 20' },
    { n: 2, x: 218, y: 20, size: 122, color: '#8b5cf6', arc: 'M 218 20 A 122 122 0 0 1 340 142' },
    { n: 3, x: 264, y: 142, size: 76, color: '#ec4899', arc: 'M 340 142 A 76 76 0 0 1 264 218' },
    { n: 4, x: 218, y: 172, size: 46, color: '#f59e0b', arc: 'M 264 218 A 46 46 0 0 1 218 172' },
    { n: 5, x: 218, y: 142, size: 30, color: '#10b981', arc: 'M 218 172 A 30 30 0 0 1 248 142' },
    { n: 6, x: 248, y: 142, size: 16, color: '#06b6d4', arc: 'M 248 142 A 16 16 0 0 1 264 158' },
  ];

  // “上帝之眼” 对角线交点坐标 (两垂直对角线交点)
  const eyeOfGod = { x: 254, y: 164 };

  return (
    <div className={styles.container}>
      {/* 头部标题与控制栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            黄金矩形连环切与极限中心实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            减去正方形、形态自相似：对角线相互垂直且永久交汇于“上帝之眼”
          </p>
        </div>

        {/* 视向功能开关 */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setShowDiagonals(!showDiagonals)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded ${
              showDiagonals ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> 上帝之眼对角线
          </button>
        </div>
      </div>

      {/* SVG 矩形主画布 */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-6 flex flex-col items-center">
        <div className="w-full max-w-lg aspect-[360/240] relative">
          <svg viewBox="0 0 360 240" className="w-full h-full select-none">
            {/* 大黄金外框 (320 x 198) */}
            <rect
              x="20"
              y="20"
              width="320"
              height="198"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
              rx="2"
            />

            {/* 绘制已裁出的正方形与四分之一圆弧 */}
            {squares.slice(0, cuts).map((sq) => (
              <g key={`sq-${sq.n}`}>
                {/* 正方形填充 */}
                <rect
                  x={sq.x}
                  y={sq.y}
                  width={sq.size}
                  height={sq.size}
                  fill={sq.color}
                  fillOpacity="0.22"
                  stroke={sq.color}
                  strokeWidth="1.5"
                  className="transition-all duration-300"
                />
                {/* 标注文案 */}
                {sq.size >= 40 && (
                  <text
                    x={sq.x + sq.size / 2}
                    y={sq.y + sq.size / 2 + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={sq.size > 100 ? '13' : '10'}
                    fontWeight="bold"
                    opacity="0.8"
                  >
                    正方形 #{sq.n}
                  </text>
                )}
                {/* 圆弧 */}
                <path
                  d={sq.arc}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
            ))}

            {/* 垂直对角线与上帝之眼 */}
            {showDiagonals && (
              <>
                {/* 大矩形主对角线 */}
                <line x1="20" y1="218" x2="340" y2="20" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
                {/* 第2小矩形对角线 (互相垂直 90°) */}
                <line x1="218" y1="20" x2="340" y2="218" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* 极限交点：上帝之眼 */}
                <circle cx={eyeOfGod.x} cy={eyeOfGod.y} r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                <text x={eyeOfGod.x + 10} y={eyeOfGod.y - 8} fill="#f43f5e" fontSize="11" fontWeight="black">
                  上帝之眼 (极点)
                </text>
              </>
            )}
          </svg>
        </div>

        {/* 裁剪控制条 */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setCuts(Math.max(0, cuts - 1))}
            disabled={cuts <= 0}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 disabled:opacity-40"
          >
            撤销一步
          </button>
          <span className="text-xs font-bold text-slate-300 px-2">
            {`已裁剪 ${cuts} / 6 级正方形`}
          </span>
          <button
            onClick={() => setCuts(Math.min(6, cuts + 1))}
            disabled={cuts >= 6}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" /> 裁剪下一个正方形
          </button>
          <button
            onClick={() => setCuts(1)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
            title="重置"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 几何代数本质看板 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">自相似裁剪代数式 φ - 1 = 1 / φ</span>
          <div className="text-2xl font-black text-indigo-500 mt-1 font-mono">
            1.618 - 1 = 0.618
          </div>
          <span className="text-xs text-slate-400 mt-0.5">截去正方形后，剩余长宽比严丝合缝恒等</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-rose-500 font-bold">对角线垂直与极点收敛</span>
          <div className="text-xl font-black text-rose-500 mt-1">
            对角线夹角 90°
          </div>
          <span className="text-xs text-slate-400 mt-0.5">所有子矩形对角线无一例外穿过此点</span>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-amber-500 font-bold">黄金对数螺旋生成</span>
          <div className="text-xl font-black text-amber-500 mt-1">
            每转 90° 扩张 1.618倍
          </div>
          <span className="text-xs text-slate-400 mt-0.5">与大自然鹦鹉螺与星系旋臂完全吻合</span>
        </div>
      </div>
    </div>
  );
}
