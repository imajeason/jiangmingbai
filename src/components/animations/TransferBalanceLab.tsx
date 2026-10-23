'use client';

import React, { useState } from 'react';
import { RotateCcw, ArrowRight, Scale, Sparkles, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import styles from '@/styles/animations.module.css';

interface Preset {
  name: string;
  left: number;
  right: number;
  label: string;
}

const PRESETS: Preset[] = [
  { name: '经典题型 1', left: 8, right: 4, label: '哥哥 8 块，弟弟 4 块 (差 4 给 2)' },
  { name: '经典题型 2', left: 10, right: 2, label: '哥哥 10 块，弟弟 2 块 (差 8 给 4)' },
  { name: '经典题型 3', left: 9, right: 3, label: '哥哥 9 块，弟弟 3 块 (差 6 给 3)' },
  { name: '进阶拓展', left: 12, right: 6, label: '哥哥 12 块，弟弟 6 块 (差 6 给 3)' },
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

  // 天平物理倾斜角度：
  // 在真实物理世界中，左边重，左边下沉（在 SVG 顺时针坐标系中，逆时针角度为负角度，使得 x<250 的左臂 y 变大向下沉）
  // 当 currentLeft > currentRight 时，tiltAngle 为负值，左侧向下倾斜！
  const rawDiff = currentLeft - currentRight;
  const tiltAngle = Math.max(-12, Math.min(12, -rawDiff * 2.8));

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
      {/* 顶部工具栏 */}
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Scale size={18} color="#2563eb" />
          <span>移多补少天平实验室：为什么差 4 块只要给 2 块？</span>
          <span className="badge badge-blue">二年级数学相差数折半</span>
        </div>
        <div className={styles.labControls}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            天平状态：{isBalanced ? '✨ 完全平衡' : `倾斜中 (相差 ${Math.abs(currentDiff)} 块)`}
          </span>
        </div>
      </div>

      {/* 画布核心工作区 */}
      <div className={styles.canvasWrapper} style={{ padding: '24px 20px', minHeight: '430px' }}>
        {/* 1. 核心状态对比条 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center', width: '100%', maxWidth: '640px', marginBottom: '20px' }}>
          {/* 左边：哥哥 */}
          <div style={{ background: '#eff6ff', border: '2px solid #bfdbfe', borderRadius: '14px', padding: '12px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e40af', marginBottom: '2px' }}>
              左盘（哥哥的糖果）
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1d4ed8', fontFamily: 'var(--font-mono)' }}>
              {currentLeft} <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>块</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginTop: '2px' }}>
              初始 {initLeft} 块 {transferred > 0 && `(已送出 -${transferred})`}
            </div>
          </div>

          {/* 中间对比指示 */}
          <div style={{ textAlign: 'center', padding: '0 8px' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
              当前差距
            </div>
            <div style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: '20px',
              background: isBalanced ? '#ecfdf5' : '#fff1f2',
              border: isBalanced ? '1px solid #10b981' : '1px solid #fecdd3',
              color: isBalanced ? '#047857' : '#e11d48',
              fontWeight: 800,
              fontSize: '1rem',
            }}>
              {isBalanced ? '0 块 (扯平)' : `差 ${Math.abs(currentDiff)} 块`}
            </div>
          </div>

          {/* 右边：弟弟 */}
          <div style={{ background: '#fef2f2', border: '2px solid #fecaca', borderRadius: '14px', padding: '12px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991b1b', marginBottom: '2px' }}>
              右盘（弟弟的糖果）
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#b91c1c', fontFamily: 'var(--font-mono)' }}>
              {currentRight} <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>块</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '2px' }}>
              初始 {initRight} 块 {transferred > 0 && `(已收到 +${transferred})`}
            </div>
          </div>
        </div>

        {/* 2. 天平核心 SVG 物理模拟 */}
        <div style={{ width: '100%', maxWidth: '580px', height: '240px' }}>
          <svg viewBox="0 0 500 230" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="standGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
              <linearGradient id="beamGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="50%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* 底座 */}
            <path d="M 170 215 L 330 215 L 310 200 L 190 200 Z" fill="url(#standGradient)" />
            {/* 立柱 */}
            <rect x="242" y="100" width="16" height="105" rx="3" fill="url(#standGradient)" />
            {/* 支点圆轴心 */}
            <circle cx="250" cy="100" r="9" fill="#1e293b" />
            <circle cx="250" cy="100" r="4" fill="#fbbf24" />

            {/* 可旋转横梁 (围绕支点 (250, 100) 旋转) */}
            <g
              transform={`rotate(${tiltAngle}, 250, 100)`}
              style={{ transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              {/* 横梁主体 */}
              <rect x="70" y="96" width="360" height="8" rx="4" fill="url(#beamGradient)" filter="url(#shadow)" />
              {/* 左右挂钩点 */}
              <circle cx="90" cy="100" r="5" fill="#1e3a8a" />
              <circle cx="410" cy="100" r="5" fill="#991b1b" />

              {/* 左侧托盘组：挂在 (90, 100)。由于重力，托盘需逆向旋转 -tiltAngle 保持水平！ */}
              <g transform={`translate(90, 100) rotate(${-tiltAngle}) translate(-90, -100)`}>
                {/* 悬挂虚线缆绳 */}
                <line x1="90" y1="100" x2="60" y2="155" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,2" />
                <line x1="90" y1="100" x2="120" y2="155" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,2" />
                {/* 浅弧托盘底 */}
                <path d="M 50 155 Q 90 170 130 155 Z" fill="#3b82f6" opacity="0.95" />

                {/* 左盘糖果展示 */}
                {Array.from({ length: currentLeft }).map((_, i) => {
                  const col = i % 4;
                  const row = Math.floor(i / 4);
                  return (
                    <circle
                      key={`l-${i}`}
                      cx={68 + col * 14}
                      cy={146 - row * 11}
                      r="6"
                      fill="#60a5fa"
                      stroke="#1d4ed8"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </g>

              {/* 右侧托盘组：挂在 (410, 100)。由于重力，托盘需逆向旋转 -tiltAngle 保持水平！ */}
              <g transform={`translate(410, 100) rotate(${-tiltAngle}) translate(-410, -100)`}>
                {/* 悬挂虚线缆绳 */}
                <line x1="410" y1="100" x2="380" y2="155" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,2" />
                <line x1="410" y1="100" x2="440" y2="155" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,2" />
                {/* 浅弧托盘底 */}
                <path d="M 370 155 Q 410 170 450 155 Z" fill="#ef4444" opacity="0.95" />

                {/* 右盘糖果展示 */}
                {Array.from({ length: currentRight }).map((_, i) => {
                  const col = i % 4;
                  const row = Math.floor(i / 4);
                  return (
                    <circle
                      key={`r-${i}`}
                      cx={388 + col * 14}
                      cy={146 - row * 11}
                      r="6"
                      fill="#f87171"
                      stroke="#b91c1c"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </g>
            </g>

            {/* 平衡时的发光横幅 */}
            {isBalanced && (
              <g transform="translate(250, 40)" textAnchor="middle">
                <rect x="-80" y="-16" width="160" height="30" rx="15" fill="#16a34a" filter="url(#shadow)" />
                <text x="0" y="4" fill="#ffffff" fontSize="12" fontWeight="800">
                  ✨ 天平完全平衡！
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* 3. 核心机制揭秘卡片 */}
        <div style={{
          width: '100%',
          maxWidth: '640px',
          marginTop: '16px',
          padding: '14px 18px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Sparkles size={16} color="#d97706" />
            <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#92400e' }}>
              物理本质洞察：为什么“每给 1 块，差距就缩小 2 块”？
            </span>
          </div>
          <div style={{ fontSize: '0.825rem', color: '#78350f', lineHeight: 1.6 }}>
            <div>• 哥哥少 1 块：<code style={{ background: '#fef3c7', padding: '1px 4px', borderRadius: '4px' }}>-1</code>（往中间降 1 步）</div>
            <div>• 弟弟多 1 块：<code style={{ background: '#fef3c7', padding: '1px 4px', borderRadius: '4px' }}>+1</code>（往中间升 1 步）</div>
            <div style={{ fontWeight: 700, color: '#b45309', marginTop: '4px' }}>
              ➔ 两人差距瞬间缩小了 <span style={{ color: '#dc2626', fontWeight: 900 }}>2 块</span>！
              这就是为什么要想抹平原先的 {initialDiff} 块差距，只需要给相差数的一半：{initialDiff} ÷ 2 = {needTransfer} 块！
            </div>
          </div>
        </div>
      </div>

      {/* 底部控制台 */}
      <div className={styles.sliderPanel}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
          {/* 经典预设题 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b' }}>经典题型切换：</span>
            {PRESETS.map((p, idx) => {
              const isActive = initLeft === p.left && initRight === p.right;
              return (
                <button
                  key={idx}
                  className={`${styles.controlBtn} ${isActive ? styles.controlBtnActive : ''}`}
                  onClick={() => handleApplyPreset(p)}
                  style={{ fontSize: '0.78rem' }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* 交互操作按钮栏 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                className="btn btn-primary"
                onClick={handleTransferOne}
                disabled={currentLeft <= currentRight}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <span>给弟弟 1 块糖</span>
                <ArrowRight size={14} />
              </button>

              <button
                className="btn btn-secondary"
                onClick={handleAutoBalance}
                disabled={isBalanced}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <span>一键平衡 (直接给 {needTransfer} 块)</span>
              </button>

              <button
                className="btn btn-secondary"
                onClick={handleReset}
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                title="重新开始"
              >
                <RotateCcw size={14} />
                <span>重置</span>
              </button>
            </div>

            <div style={{ fontSize: '0.825rem', color: '#64748b' }}>
              总糖果数始终守恒：<strong style={{ color: '#0f172a' }}>{initLeft + initRight} 块</strong>（平均每人 {(initLeft + initRight) / 2} 块）
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
