'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Layers, Plus, Minus, CheckCircle, Sparkles, RefreshCw, HelpCircle } from 'lucide-react';

export default function ThreeSetVennLab() {
  // 步骤：0 (原始全景), 1 (A+B+C 全部加), 2 (减去两两重叠), 3 (补回中心核心区 ABC)
  const [step, setStep] = useState<number>(0);

  // 经典题型预设数据（全班选兴趣班）
  // 语文 A = 28, 数学 B = 25, 英语 C = 20
  // 语数 AB = 12, 数英 BC = 9, 语英 CA = 8
  // 三门全选 ABC = 4
  // 仅语文 = 28 - 12 - 8 + 4 = 12
  // 仅数学 = 25 - 12 - 9 + 4 = 8
  // 仅英语 = 20 - 9 - 8 + 4 = 7
  // 仅语数 = 12 - 4 = 8
  // 仅数英 = 9 - 4 = 5
  // 仅语英 = 8 - 4 = 4
  // 中心三科 = 4
  // 总人数 = 12 + 8 + 7 + 8 + 5 + 4 + 4 = 48 人

  // 各区域在各步骤下被计算的次数计数器
  // 单科区域 (仅A, 仅B, 仅C): 步骤1加1次, 步骤2不扣(1), 步骤3不加(1)
  // 双科区域 (仅AB, 仅BC, 仅CA): 步骤1加2次, 步骤2扣1次(1), 步骤3不加(1)
  // 中心区域 (三科ABC): 步骤1加3次, 步骤2扣3次(0 漏算!), 步骤3补1次(1 完美!)

  const getRegionCount = (type: 'single' | 'double' | 'triple') => {
    if (step === 0) return 0;
    if (step === 1) {
      return type === 'single' ? 1 : type === 'double' ? 2 : 3;
    }
    if (step === 2) {
      return type === 'single' ? 1 : type === 'double' ? 1 : 0;
    }
    return 1; // step === 3
  };

  const countSingle = getRegionCount('single');
  const countDouble = getRegionCount('double');
  const countTriple = getRegionCount('triple');

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Layers size={18} style={{ color: '#ec4899' }} />
          <span>三集合容斥原理：三圈韦恩图的加减交响乐</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${step === 1 ? styles.controlBtnActive : ''}`}
            onClick={() => setStep(1)}
          >
            <Plus size={14} />
            <span>第1步：加 A+B+C (中心算3次)</span>
          </button>
          <button
            className={`${styles.controlBtn} ${step === 2 ? styles.controlBtnActive : ''}`}
            onClick={() => setStep(2)}
          >
            <Minus size={14} />
            <span>第2步：减两两交集 (中心被扣成0)</span>
          </button>
          <button
            className={`${styles.controlBtn} ${step === 3 ? styles.controlBtnActive : ''}`}
            onClick={() => setStep(3)}
          >
            <Sparkles size={14} />
            <span>第3步：补回中心 +ABC (完美守恒)</span>
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* 韦恩图展台 */}
        <div style={{
          width: '100%',
          maxWidth: '640px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* 公式标语卡 */}
          <div style={{
            width: '100%',
            background: '#fdf2f8',
            padding: '10px 14px',
            borderRadius: '8px',
            borderLeft: '4px solid #ec4899',
            fontSize: '0.875rem',
            color: '#9d174d',
            lineHeight: 1.6
          }}>
            <strong>【三集合容斥终极公式】：</strong>
            <br />
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#be185d' }}>
              总人数 = (A + B + C) - (AB + BC + CA) + ABC
            </span>
            <br />
            很多孩子死记公式却总在“最后到底是加 ABC 还是减 ABC”上瞎猜。通过下方“计数账本”，看透为什么中心必须补加 1 次！
          </div>

          {/* SVG 三圈韦恩图 */}
          <div style={{ marginTop: '16px', width: '100%', maxWidth: '440px' }}>
            <svg viewBox="0 0 400 340" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              <defs>
                {/* 圈 A 渐变：红色 */}
                <radialGradient id="gradA" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0.15" />
                </radialGradient>
                {/* 圈 B 渐变：蓝色 */}
                <radialGradient id="gradB" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.15" />
                </radialGradient>
                {/* 圈 C 渐变：绿色 */}
                <radialGradient id="gradC" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.15" />
                </radialGradient>
              </defs>

              {/* 三个大圈 (半径 90) */}
              {/* 圈 A (顶) */}
              <circle cx="200" cy="130" r="90" fill="url(#gradA)" stroke="#ef4444" strokeWidth="2.5" />
              {/* 圈 B (左下) */}
              <circle cx="145" cy="215" r="90" fill="url(#gradB)" stroke="#3b82f6" strokeWidth="2.5" />
              {/* 圈 C (右下) */}
              <circle cx="255" cy="215" r="90" fill="url(#gradC)" stroke="#10b981" strokeWidth="2.5" />

              {/* 集合名称大标签 */}
              <text x="200" y="32" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#dc2626">集合 A (语文 28人)</text>
              <text x="60" y="275" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2563eb">集合 B (数学 25人)</text>
              <text x="340" y="275" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#059669">集合 C (英语 20人)</text>

              {/* 7 个区域计数标签气泡 */}
              {/* 1. 仅 A */}
              <g transform="translate(200, 85)">
                <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#dc2626">
                  {step === 0 ? '仅A' : `${countSingle}次`}
                </text>
              </g>

              {/* 2. 仅 B */}
              <g transform="translate(110, 235)">
                <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2563eb">
                  {step === 0 ? '仅B' : `${countSingle}次`}
                </text>
              </g>

              {/* 3. 仅 C */}
              <g transform="translate(290, 235)">
                <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#059669">
                  {step === 0 ? '仅C' : `${countSingle}次`}
                </text>
              </g>

              {/* 4. 仅 AB (左上双交) */}
              <g transform="translate(150, 145)">
                <circle cx="0" cy="0" r="13" fill="#ffffff" stroke="#8b5cf6" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#7c3aed">
                  {step === 0 ? 'AB' : `${countDouble}次`}
                </text>
              </g>

              {/* 5. 仅 AC (右上双交) */}
              <g transform="translate(250, 145)">
                <circle cx="0" cy="0" r="13" fill="#ffffff" stroke="#d97706" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#b45309">
                  {step === 0 ? 'AC' : `${countDouble}次`}
                </text>
              </g>

              {/* 6. 仅 BC (下方双交) */}
              <g transform="translate(200, 255)">
                <circle cx="0" cy="0" r="13" fill="#ffffff" stroke="#06b6d4" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0891b2">
                  {step === 0 ? 'BC' : `${countDouble}次`}
                </text>
              </g>

              {/* 7. 中心 ABC 三重叠核心区 (灵魂暴击点！) */}
              <g transform="translate(200, 192)">
                <circle
                  cx="0"
                  cy="0"
                  r="18"
                  fill={countTriple === 0 ? '#fee2e2' : countTriple === 1 ? '#dcfce7' : '#fef08a'}
                  stroke={countTriple === 0 ? '#ef4444' : countTriple === 1 ? '#16a34a' : '#ca8a04'}
                  strokeWidth="2.5"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="900"
                  fill={countTriple === 0 ? '#b91c1c' : countTriple === 1 ? '#15803d' : '#854d0e'}
                >
                  {step === 0 ? 'ABC' : `${countTriple}次`}
                </text>
              </g>
            </svg>
          </div>

          {/* 实时状态账本 */}
          <div style={{
            marginTop: '12px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px'
          }}>
            <div style={{
              background: '#f8fafc',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>单科区域计数</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {countSingle} 次 {countSingle === 1 && <span style={{ color: '#16a34a', fontSize: '0.8rem' }}>✔️ 恰好1次</span>}
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>两两重叠区域计数</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {countDouble} 次 {countDouble === 1 && <span style={{ color: '#16a34a', fontSize: '0.8rem' }}>✔️ 恰好1次</span>}
                {countDouble === 2 && <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>多算1次</span>}
              </div>
            </div>

            <div style={{
              background: countTriple === 1 ? '#f0fdf4' : countTriple === 0 ? '#fef2f2' : '#fefce8',
              padding: '10px 14px',
              borderRadius: '8px',
              border: `1.5px solid ${countTriple === 1 ? '#86efac' : countTriple === 0 ? '#fca5a5' : '#fde047'}`
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: countTriple === 1 ? '#15803d' : countTriple === 0 ? '#991b1b' : '#854d0e' }}>
                中心三科核心区 (ABC)
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: countTriple === 1 ? '#166534' : countTriple === 0 ? '#dc2626' : '#a16207', marginTop: '2px' }}>
                {countTriple} 次 {countTriple === 0 ? '🚨 被扣光了(漏算!)' : countTriple === 3 ? '🚨 暴增3次' : '🎉 完美平衡!'}
              </div>
            </div>
          </div>

          {/* 账本推导演绎卡 */}
          <div style={{
            marginTop: '14px',
            width: '100%',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '0.85rem',
            lineHeight: 1.6
          }}>
            {step === 0 && (
              <div style={{ color: '#475569' }}>
                <span style={{ fontWeight: 700, color: '#334155' }}>点击下方第 1、2、3 步</span>，看三集合容斥如何像打太极一样，一步步把多算的削平、漏算的补齐！
              </div>
            )}
            {step === 1 && (
              <div style={{ color: '#1e40af' }}>
                <strong>【第 1 步：A + B + C 全部加起来】：</strong>
                单科生算了 1 次；双科生在两个圈里各算 1 次（共 2 次）；
                而<strong>三科全能生在 A、B、C 里面全都有他，足足被重复算了 3 次</strong>！必须消肿！
              </div>
            )}
            {step === 2 && (
              <div style={{ color: '#dc2626' }}>
                <strong>【第 2 步：减去三块两两重叠 -(AB + BC + CA)】：</strong>
                双科生扣了 1 次变成 1 次（正好！）。
                但请注意中心 ABC：在 AB 扣了 1 次，在 BC 扣了 1 次，在 CA 又扣了 1 次！
                <strong>整整被扣了 3 次！3 - 3 = 0 次！中心三科全能生被彻底打入冷宫、完全漏算了！</strong>
              </div>
            )}
            {step === 3 && (
              <div style={{ color: '#15803d' }}>
                <strong>【第 3 步：补救大招！必须加回中心 + ABC】：</strong>
                因为刚才中心变成了 0 次，必须<strong>再加回 1 次 ABC（0 + 1 = 1）</strong>！
                至此，全场 7 个区域每一个区域都不多不少<strong>正好被且仅被计算了 1 次</strong>！
                这正是公式末尾为什么必须是 <strong>+ ABC</strong> 的终极奥秘！
              </div>
            )}
          </div>
        </div>

        {/* 控制器 */}
        <div style={{
          marginTop: '16px',
          width: '100%',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            className={`${styles.controlBtn} ${step === 0 ? styles.controlBtnActive : ''}`}
            onClick={() => setStep(0)}
          >
            0. 初始三圈
          </button>
          <button
            className={`${styles.controlBtn} ${step === 1 ? styles.controlBtnActive : ''}`}
            onClick={() => setStep(1)}
          >
            1. 全部相加 (+A+B+C)
          </button>
          <button
            className={`${styles.controlBtn} ${step === 2 ? styles.controlBtnActive : ''}`}
            onClick={() => setStep(2)}
          >
            2. 扣两两交集 (-AB-BC-CA)
          </button>
          <button
            className={`${styles.controlBtn} ${step === 3 ? styles.controlBtnActive : ''}`}
            onClick={() => setStep(3)}
          >
            3. 补回中心 (+ABC 守恒)
          </button>
        </div>

      </div>
    </div>
  );
}

