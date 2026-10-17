'use client';

import React, { useState } from 'react';
import { RotateCcw, ArrowRight, Scale, Sparkles } from 'lucide-react';
import styles from '@/styles/animations.module.css';



interface Preset {
  name: string;
  left: number;
  right: number;
  label: string;
}

const PRESETS: Preset[] = [
  { name: '经典题型 1', left: 8, right: 4, label: '哥哥 8 块，弟弟 4 块' },
  { name: '经典题型 2', left: 10, right: 2, label: '哥哥 10 块，弟弟 2 块' },
  { name: '经典题型 3', left: 9, right: 3, label: '哥哥 9 块，弟弟 3 块' },
  { name: '进阶题型', left: 11, right: 5, label: '哥哥 11 块，弟弟 5 块' },
];

export default function TransferBalanceLab() {
  const [initLeft, setInitLeft] = useState<number>(8);
  const [initRight, setInitRight] = useState<number>(4);
  const [transferred, setTransferred] = useState<number>(0);

  // 当前两边的数量
  const currentLeft = initLeft - transferred;
  const currentRight = initRight + transferred;
  const currentDiff = currentLeft - currentRight;
  const initialDiff = initLeft - initRight;
  const needTransfer = Math.floor(initialDiff / 2);
  const isBalanced = currentLeft === currentRight;

  // 天平倾斜角度（限制在 -14度到 14度之间）
  const tiltAngle = Math.max(-14, Math.min(14, (currentLeft - currentRight) * 2.5));

  // 移一块
  const handleTransferOne = () => {
    if (currentLeft > currentRight) {
      setTransferred((prev) => prev + 1);
    }
  };

  // 一键平衡
  const handleAutoBalance = () => {
    setTransferred(needTransfer);
  };

  // 重置
  const handleReset = () => {
    setTransferred(0);
  };

  // 切换预设
  const handleApplyPreset = (preset: Preset) => {
    setInitLeft(preset.left);
    setInitRight(preset.right);
    setTransferred(0);
  };

  return (
    <div className={styles.labContainer}>
      {/* 顶部标题与说明 */}
      <div className={styles.labHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scale size={20} color="#2563eb" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            移多补少天平实验室：为什么差 4 块只要给 2 块？
          </h2>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          观察天平倾斜与“相差数折半”的神奇平衡
        </span>
      </div>

      <div className={styles.canvasWrapper} style={{ padding: '24px 20px', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
        {/* 1. 核心状态对比条 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center', maxWidth: '640px', margin: '0 auto 24px' }}>
          {/* 左边：哥哥 */}
          <div style={{ background: '#eff6ff', border: '2px solid #bfdbfe', borderRadius: '14px', padding: '14px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e40af', marginBottom: '4px' }}>
              左边（哥哥）
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1d4ed8' }}>
              {currentLeft} <span style={{ fontSize: '1rem', fontWeight: 500 }}>块</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginTop: '2px' }}>
              初始 {initLeft} 块 {transferred > 0 && `(送出 -${transferred})`}
            </div>
          </div>

          {/* 中间对比 */}
          <div style={{ textAlign: 'center', padding: '0 8px' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
              当前相差
            </div>
            <div style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: '20px',
              background: isBalanced ? '#dcfce7' : '#fee2e2',
              color: isBalanced ? '#15803d' : '#b91c1c',
              fontSize: '1.1rem',
              fontWeight: 800,
            }}>
              {isBalanced ? '已平衡 (差 0)' : `多 ${currentDiff} 块`}
            </div>
          </div>

          {/* 右边：弟弟 */}
          <div style={{ background: '#fef2f2', border: '2px solid #fecaca', borderRadius: '14px', padding: '14px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#991b1b', marginBottom: '4px' }}>
              右边（弟弟）
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#dc2626' }}>
              {currentRight} <span style={{ fontSize: '1rem', fontWeight: 500 }}>块</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '2px' }}>
              初始 {initRight} 块 {transferred > 0 && `(得到 +${transferred})`}
            </div>
          </div>
        </div>

        {/* 2. SVG 天平动态图示 */}
        <div style={{ width: '100%', maxWidth: '580px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
          <svg viewBox="0 0 500 240" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
            <defs>
              <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* 底座支架 */}
            <polygon points="250,110 230,210 270,210" fill="#94a3b8" />
            <rect x="200" y="210" width="100" height="14" rx="4" fill="#64748b" />
            {/* 支点圆轴 */}
            <circle cx="250" cy="110" r="10" fill="#334155" filter="url(#shadow)" />
            <circle cx="250" cy="110" r="4" fill="#ffffff" />

            {/* 可旋转横梁组 (以 (250, 110) 为旋转中心) */}
            <g transform={`rotate(${tiltAngle}, 250, 110)`} style={{ transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              {/* 横梁 */}
              <rect x="60" y="106" width="380" height="8" rx="4" fill="url(#beamGradient)" filter="url(#shadow)" />
              {/* 左右悬挂挂钩点 */}
              <circle cx="90" cy="110" r="5" fill="#1e3a8a" />
              <circle cx="410" cy="110" r="5" fill="#991b1b" />

              {/* 左侧悬绳与托盘 */}
              <line x1="90" y1="110" x2="60" y2="175" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3,2" />
              <line x1="90" y1="110" x2="120" y2="175" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3,2" />
              <path d="M 50 175 Q 90 190 130 175 Z" fill="#3b82f6" opacity="0.9" />

              {/* 右侧悬绳与托盘 */}
              <line x1="410" y1="110" x2="380" y2="175" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3,2" />
              <line x1="410" y1="110" x2="440" y2="175" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3,2" />
              <path d="M 370 175 Q 410 190 450 175 Z" fill="#ef4444" opacity="0.9" />

              {/* 左盘糖果/金币展示 */}
              {Array.from({ length: currentLeft }).map((_, i) => {
                const col = i % 4;
                const row = Math.floor(i / 4);
                return (
                  <circle
                    key={`l-${i}`}
                    cx={68 + col * 14}
                    cy={165 - row * 12}
                    r="6"
                    fill="#60a5fa"
                    stroke="#1d4ed8"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* 右盘糖果/金币展示 */}
              {Array.from({ length: currentRight }).map((_, i) => {
                const col = i % 4;
                const row = Math.floor(i / 4);
                return (
                  <circle
                    key={`r-${i}`}
                    cx={388 + col * 14}
                    cy={165 - row * 12}
                    r="6"
                    fill="#f87171"
                    stroke="#b91c1c"
                    strokeWidth="1.5"
                  />
                );
              })}
            </g>

            {/* 平衡时的光环提示 */}
            {isBalanced && (
              <g transform="translate(250, 45)" textAnchor="middle">
                <rect x="-70" y="-18" width="140" height="32" rx="16" fill="#22c55e" filter="url(#shadow)" />
                <text x="0" y="4" fill="#ffffff" fontSize="13" fontWeight="bold">
                  ✨ 天平平衡！两边一样多
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* 3. 核心机制揭秘：为什么“给 1 块 = 缩小 2 块差距” */}
        <div style={{
          marginTop: '20px',
          padding: '16px 20px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '12px',
          maxWidth: '620px',
          margin: '20px auto 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={16} color="#d97706" />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#92400e' }}>
              视觉关键观察：给 1 块会发生什么？
            </span>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#78350f', lineHeight: 1.6 }}>
            <div>• 哥哥少 1 块：<code style={{ background: '#fef3c7', padding: '1px 4px', borderRadius: '4px' }}>-{1}</code></div>
            <div>• 弟弟多 1 块：<code style={{ background: '#fef3c7', padding: '1px 4px', borderRadius: '4px' }}>+{1}</code></div>
            <div style={{ fontWeight: 700, color: '#b45309', marginTop: '4px' }}>
              ➔ 两人之间的差距瞬间缩小了 <span style={{ fontSize: '1.05rem', color: '#dc2626' }}>2 块</span>！
              这也是为什么“差 {initialDiff} 块，只需要给 {needTransfer} 块”的原因（{initialDiff} ÷ 2 = {needTransfer}）。
            </div>
          </div>
        </div>
      </div>

      {/* 底部控制台 */}
      <div className={styles.controlsGrid} style={{ marginTop: '20px' }}>
        {/* 经典题型快捷预设 */}
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
            选择题型或题库案例：
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {PRESETS.map((p) => {
              const isActive = initLeft === p.left && initRight === p.right;
              return (
                <button
                  key={p.name}
                  onClick={() => handleApplyPreset(p)}
                  className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.825rem', padding: '6px 14px' }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 逐步操作按钮 */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
          <button
            onClick={handleTransferOne}
            disabled={isBalanced}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowRight size={16} />
            移 1 块给弟弟（观察天平升起）
          </button>

          <button
            onClick={handleAutoBalance}
            disabled={isBalanced}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', borderColor: '#86efac' }}
          >
            <Scale size={16} />
            一键平分 (直接给 {needTransfer} 块)
          </button>

          <button
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}
          >
            <RotateCcw size={16} />
            还原初始状态
          </button>
        </div>
      </div>
    </div>
  );
}
