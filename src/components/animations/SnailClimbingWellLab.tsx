'use client';

import React, { useState } from 'react';

export default function SnailClimbingWellLab() {
  const [wellDepth, setWellDepth] = useState<number>(10); // 井深
  const [climbDay, setClimbDay] = useState<number>(3); // 白天爬
  const [slideNight, setSlideNight] = useState<number>(2); // 晚上滑
  const [currentStep, setCurrentStep] = useState<number>(0); // 步骤索引
  const [showFormula, setShowFormula] = useState<boolean>(false);

  // Daily net climb
  const netClimb = climbDay - slideNight;
  // Critical height before the last day
  const criticalHeight = Math.max(0, wellDepth - climbDay);
  // Full days needed to reach critical height
  const baseDays = netClimb > 0 ? Math.ceil(criticalHeight / netClimb) : 0;
  // Total days to escape
  const totalDays = baseDays + 1;

  // Build the step-by-step history
  // Each step: { timeLabel, height, isOut }
  const steps: { label: string; height: number; isOut: boolean }[] = [];
  let h = 0;
  steps.push({ label: '第 1 天早晨：井底出发', height: 0, isOut: false });

  for (let d = 1; d <= 15; d++) {
    // Day climb
    h += climbDay;
    if (h >= wellDepth) {
      steps.push({ label: `第 ${d} 天白天：爬升到 ${h} 米，成功爬出井口！🎉`, height: wellDepth, isOut: true });
      break;
    } else {
      steps.push({ label: `第 ${d} 天白天：爬升到 ${h} 米`, height: h, isOut: false });
    }

    // Night slide
    h -= slideNight;
    steps.push({ label: `第 ${d} 天晚上：滑落到 ${h} 米`, height: h, isOut: false });
  }

  const curState = steps[Math.min(currentStep, steps.length - 1)];

  return (
    <div style={{
      width: '100%',
      maxWidth: '780px',
      margin: '0 auto',
      padding: '20px',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* 头部标题 */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: '0 0 6px 0' }}>
          蜗牛爬井与青蛙跳井：临界到达的“预留思维”
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          井深 {wellDepth} 米，白天爬 {climbDay} 米，晚上滑 {slideNight} 米：为什么不是 {wellDepth}÷({climbDay}-{slideNight})={wellDepth} 天，而是 {totalDays} 天？
        </p>
      </div>

      {/* 画布区域 */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '340px'
      }}>
        {/* SVG 水井剖面 */}
        <svg viewBox="0 0 340 280" style={{ width: '100%', maxWidth: '340px', overflow: 'visible' }}>
          {/* 地面 */}
          <line x1="20" y1="40" x2="110" y2="40" stroke="#10b981" strokeWidth="4" />
          <line x1="230" y1="40" x2="320" y2="40" stroke="#10b981" strokeWidth="4" />
          <text x="50" y="32" fill="#059669" fontSize="11" fontWeight="700">地面 (井口 10m)</text>

          {/* 水井砖墙 */}
          <rect x="110" y="40" width="120" height="200" fill="#f1f5f9" stroke="#475569" strokeWidth="3" />

          {/* 刻度尺 */}
          {[0, 2, 4, 6, 8, 10].map((m) => {
            const y = 240 - (m / 10) * 200;
            return (
              <g key={m}>
                <line x1="110" y1={y} x2="120" y2={y} stroke="#94a3b8" strokeWidth="1.5" />
                <text x="104" y={y + 4} textAnchor="end" fill="#64748b" fontSize="10" fontWeight="600">
                  {m}m
                </text>
              </g>
            );
          })}

          {/* 临界警戒线 (H - climbDay) */}
          <line
            x1="110"
            y1={240 - (criticalHeight / 10) * 200}
            x2="230"
            y2={240 - (criticalHeight / 10) * 200}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <text
            x="235"
            y={240 - (criticalHeight / 10) * 200 + 4}
            fill="#dc2626"
            fontSize="10"
            fontWeight="800"
          >
            临界线 {criticalHeight}m (爬到这就稳了!)
          </text>

          {/* 蜗牛位置 */}
          {(() => {
            const snailY = 240 - (curState.height / 10) * 200;
            return (
              <g transform={`translate(160, ${snailY})`}>
                <circle cx="0" cy="0" r="16" fill={curState.isOut ? '#10b981' : '#f59e0b'} stroke="#b45309" strokeWidth="2" />
                <text x="0" y="6" textAnchor="middle" fontSize="16">🐌</text>
                <text x="24" y="4" fill="#1e293b" fontSize="11" fontWeight="800">
                  {curState.height} 米
                </text>
              </g>
            );
          })()}

          {/* 井底 */}
          <text x="170" y="260" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="700">
            井底 (0m)
          </text>
        </svg>

        {/* 动态步骤卡片 */}
        <div style={{
          marginTop: '16px',
          padding: '12px 20px',
          background: curState.isOut ? '#ecfdf5' : '#ffffff',
          borderRadius: '10px',
          border: curState.isOut ? '2px solid #10b981' : '1px solid #cbd5e1',
          width: '100%',
          maxWidth: '520px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: curState.isOut ? '#047857' : '#1e293b', marginBottom: '4px' }}>
            {curState.label}
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            白天爬 {climbDay} 米，晚上滑 {slideNight} 米，每天净爬升 {climbDay - slideNight} 米
          </div>
        </div>
      </div>

      {/* 控制栏 */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* 步进按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 600
            }}
          >
            ⏪ 上半天
          </button>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, minWidth: '60px', textAlign: 'center' }}>
            步骤 {currentStep} / {steps.length - 1}
          </span>
          <button
            disabled={currentStep === steps.length - 1}
            onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#2563eb',
              color: '#ffffff',
              cursor: currentStep === steps.length - 1 ? 'not-allowed' : 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 700
            }}
          >
            下半天 ⏩
          </button>
        </div>

        {/* 一键爬出 */}
        <button
          onClick={() => setCurrentStep(steps.length - 1)}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: '#10b981',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.8125rem',
            cursor: 'pointer'
          }}
        >
          🚀 直接看爬出终局
        </button>

        {/* 原理提示 */}
        <button
          onClick={() => setShowFormula(!showFormula)}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: showFormula ? '#fef3c7' : '#f8fafc',
            color: showFormula ? '#92400e' : '#64748b',
            fontWeight: 700,
            fontSize: '0.8125rem',
            cursor: 'pointer'
          }}
        >
          {showFormula ? '收起秘籍' : '💡 预留思维秒杀公式'}
        </button>
      </div>

      {/* 原理卡片 */}
      {showFormula && (
        <div style={{
          marginTop: '16px',
          padding: '14px',
          background: '#fffbeb',
          borderRadius: '10px',
          border: '1px solid #fde68a',
          fontSize: '0.8125rem',
          color: '#78350f',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: '0 0 6px 0', fontWeight: 800 }}>📌 蜗牛爬井解题核心：预留最后一天白天的净高度！</p>
          <ol style={{ margin: 0, paddingLeft: '18px' }}>
            <li>
              <strong>常人大坑</strong>：直接用总高度除以每天净爬升（10 ÷ 1 = 10 天）。错在：当第 8 天白天爬出井口时，蜗牛已经在地面上了，<strong>绝不可能在晚上再掉回井里</strong>！
            </li>
            <li>
              <strong>临界高度公式</strong>：
              必须先从总高度中扣除最后一天白天的一冲之力（10 - 3 = 7 米）！
            </li>
            <li>
              <strong>两步计算法</strong>：
              - 第一步：爬到临界高度 7 米需要的天数 = 7 ÷ (3 - 2) = 7 天；
              - 第二步：第 8 天白天再爬 3 米直接出井，总耗时 = 7 + 1 = <strong>8 天</strong>！
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
