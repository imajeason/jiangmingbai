'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowDown, ArrowUp } from 'lucide-react';
import styles from '@/styles/animations.module.css';

export default function BuoyancyArchimedesLab() {
  const [submergeDepth, setSubmergeDepth] = useState<number>(60); // 浸入百分比 0 ~ 100

  // 物理常数模型
  const objectWeight = 5.0; // 物块原重 G = 5.0 N
  const maxBuoyancy = 2.5; // 完全浸没时的最大浮力 2.5 N

  // 随着浸入深度计算当前浮力与示数
  const currentBuoyancy = (submergeDepth / 100) * maxBuoyancy;
  const springReading = objectWeight - currentBuoyancy; // 测力计拉力 F'
  const displacedLiquidWeight = currentBuoyancy; // 排开水重 G_排

  return (
    <div className={styles.labContainer}>
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Sparkles size={18} color="#0891b2" />
          <span>阿基米德浮力实验室：浸入深度与排水量同步测量</span>
        </div>
        <div className={styles.labControls}>
          <div className={styles.metricBadge}>
            <span style={{ color: '#0891b2' }}>浮力 F_浮 =</span>
            <span>{currentBuoyancy.toFixed(1)} N</span>
          </div>
          <div className={styles.metricBadge}>
            <span style={{ color: '#059669' }}>排开水重 G_排 =</span>
            <span>{displacedLiquidWeight.toFixed(1)} N</span>
          </div>
        </div>
      </div>

      <div className={styles.canvasWrapper} style={{ minHeight: '430px' }}>
        <svg viewBox="0 0 740 400" width="100%" height="400" style={{ maxWidth: '740px' }}>
          <defs>
            {/* 水的渐变 */}
            <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
            </linearGradient>
            {/* 铁块金属质感 */}
            <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* 1. 支架横梁 */}
          <rect x="100" y="30" width="300" height="12" fill="#475569" rx="3" />
          <rect x="90" y="30" width="16" height="340" fill="#475569" rx="3" />
          <rect x="50" y="360" width="120" height="16" fill="#334155" rx="4" />

          {/* 2. 弹簧测力计 */}
          <g transform="translate(250, 42)">
            {/* 吊环 */}
            <circle cx="0" cy="10" r="6" fill="none" stroke="#64748b" strokeWidth="2.5" />
            {/* 测力计外壳 */}
            <rect x="-18" y="16" width="36" height="90" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
            {/* 刻度盘 */}
            <line x1="-10" y1="30" x2="10" y2="30" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="-10" y1="45" x2="10" y2="45" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="-10" y1="60" x2="10" y2="60" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="-10" y1="75" x2="10" y2="75" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="-10" y1="90" x2="10" y2="90" stroke="#cbd5e1" strokeWidth="1" />
            {/* 指针随着示数移动 */}
            <polygon
              points={`-12,${30 + (springReading / 5) * 60} 0,${26 + (springReading / 5) * 60} 0,${34 + (springReading / 5) * 60}`}
              fill="#ef4444"
            />
            {/* 读数文本 */}
            <rect x="24" y="45" width="70" height="28" rx="4" fill="#fee2e2" stroke="#fca5a5" />
            <text x="59" y="64" textAnchor="middle" fill="#dc2626" fontSize="13" fontWeight="800">
              {springReading.toFixed(1)} N
            </text>

            {/* 下挂钩与悬挂细绳 */}
            <line x1="0" y1="106" x2="0" y2="130" stroke="#64748b" strokeWidth="2" />
          </g>

          {/* 3. 溢水杯与水 */}
          {/* 杯身 */}
          <g transform="translate(250, 240)">
            {/* 溢水杯水面与溢流口 */}
            <path
              d="M -70 -60 L -70 120 L 70 120 L 70 -30 L 115 -10 L 115 0 L 70 -15 L 70 -60"
              fill="none"
              stroke="#64748b"
              strokeWidth="3"
            />
            {/* 杯中水 */}
            <path
              d="M -67 -30 L -67 117 L 67 117 L 67 -25 L 115 -10 L 115 0 L 67 -15 L 67 -30 Z"
              fill="url(#waterGrad)"
            />

            {/* 溢流落入量筒的流动水柱 */}
            {submergeDepth > 5 && (
              <path
                d="M 115 -5 Q 130 30 135 90"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeDasharray="4 2"
              />
            )}

            {/* 浸入的金属块（根据下放深度动态变化位置） */}
            {/* 深度计算：submergeDepth 0% 时在水面之上 -80，100% 时在杯中深度 40 */}
            <g transform={`translate(0, ${-70 + (submergeDepth / 100) * 80})`}>
              {/* 细线 */}
              <line x1="0" y1="-68" x2="0" y2="0" stroke="#475569" strokeWidth="1.5" />
              {/* 金属块 */}
              <rect x="-30" y="0" width="60" height="50" rx="3" fill="url(#metalGrad)" stroke="#1e293b" />
              <text x="0" y="30" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">
                铁块
              </text>

              {/* 受力分析箭头（如果浸入有浮力） */}
              {submergeDepth > 10 && (
                <g>
                  {/* 向上浮力箭头 */}
                  <line x1="38" y1="40" x2="38" y2={40 - currentBuoyancy * 14} stroke="#0284c7" strokeWidth="3" />
                  <polygon
                    points={`34,${40 - currentBuoyancy * 14 + 5} 38,${40 - currentBuoyancy * 14} 42,${40 - currentBuoyancy * 14 + 5}`}
                    fill="#0284c7"
                  />
                  <text x="44" y={35 - currentBuoyancy * 7} fill="#0284c7" fontSize="11" fontWeight="700">
                    F_浮
                  </text>
                </g>
              )}
            </g>
          </g>

          {/* 4. 右侧接水小量筒 */}
          <g transform="translate(390, 290)">
            <rect x="-25" y="-10" width="50" height="80" rx="3" fill="none" stroke="#64748b" strokeWidth="2" />
            {/* 量筒里的水（水量随排水重力升高） */}
            <rect
              x="-23"
              y={68 - (displacedLiquidWeight / 2.5) * 60}
              width="46"
              height={(displacedLiquidWeight / 2.5) * 60}
              fill="url(#waterGrad)"
            />
            {/* 量筒示数 */}
            <rect x="35" y="15" width="85" height="28" rx="4" fill="#ecfdf5" stroke="#a7f3d0" />
            <text x="77" y="34" textAnchor="middle" fill="#059669" fontSize="13" fontWeight="800">
              G_排 = {displacedLiquidWeight.toFixed(1)} N
            </text>
          </g>

          {/* 5. 核心实验原理总结卡片 */}
          <g transform="translate(490, 80)">
            <rect x="0" y="0" width="220" height="150" rx="10" fill="#ffffff" stroke="#e2e8f0" />
            <text x="16" y="26" fontSize="13" fill="#64748b" fontWeight="600">受力分析与阿基米德定理</text>

            <text x="16" y="52" fontSize="13" fill="#0f172a">
              物体空气中自重：<tspan fontWeight="700">G = {objectWeight.toFixed(1)} N</tspan>
            </text>
            <text x="16" y="74" fontSize="13" fill="#dc2626">
              弹簧秤拉力示数：<tspan fontWeight="700">F&apos; = {springReading.toFixed(1)} N</tspan>
            </text>
            <text x="16" y="96" fontSize="13" fill="#0284c7">
              减小的拉力(浮力)：<tspan fontWeight="700">F_浮 = {currentBuoyancy.toFixed(1)} N</tspan>
            </text>

            <line x1="16" y1="110" x2="204" y2="110" stroke="#e2e8f0" />

            <text x="16" y="132" fontSize="14" fill="#059669" fontWeight="800">
              结论：F_浮 = G_排 = {currentBuoyancy.toFixed(1)} N
            </text>
          </g>
        </svg>
      </div>

      <div className={styles.sliderPanel}>
        <div className={styles.sliderGroup}>
          <span className={styles.sliderLabel}>调节物块浸入深度 (观察示数与溢水同步):</span>
          <input
            type="range"
            min="0"
            max="100"
            value={submergeDepth}
            onChange={(e) => setSubmergeDepth(Number(e.target.value))}
            className={styles.sliderInput}
          />
          <span className={styles.sliderValue}>{submergeDepth}%</span>
        </div>

        <div style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
          💡 提示：当下放浸没达 100% 后，排开液体体积不再增加，浮力保持恒定。
        </div>
      </div>
    </div>
  );
}
