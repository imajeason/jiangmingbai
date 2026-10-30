'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type LabMode = 'dilution' | 'concentration' | 'mixing';

export default function RatioConcentrationLab() {
  const [mode, setMode] = useState<LabMode>('dilution');

  // -------------------- 模式1：加水稀释状态 --------------------
  const [dilutionPreset, setDilutionPreset] = useState<number>(0);
  const dilutionPresets = [
    { name: '100g 含糖 20% 糖水', total: 100, conc: 20 },
    { name: '200g 含盐 15% 盐水', total: 200, conc: 15 },
    { name: '150g 含酒精 30% 药酒', total: 150, conc: 30 },
  ];
  const [addedWater, setAddedWater] = useState<number>(100);

  // 模式1 计算
  const curDilPreset = dilutionPresets[dilutionPreset];
  const initialSolute1 = (curDilPreset.total * curDilPreset.conc) / 100;
  const initialWater1 = curDilPreset.total - initialSolute1;
  const currentTotalWater1 = initialWater1 + addedWater;
  const currentTotalSolution1 = curDilPreset.total + addedWater;
  const currentConc1 = (initialSolute1 / currentTotalSolution1) * 100;

  // -------------------- 模式2：加糖增浓状态 --------------------
  const [concPreset, setConcPreset] = useState<number>(0);
  const concPresets = [
    { name: '100g 10% 初始糖水', total: 100, conc: 10 },
    { name: '200g 12% 初始糖水', total: 200, conc: 12 },
    { name: '80g 15% 初始糖水', total: 80, conc: 15 },
  ];
  const [addedSugar, setAddedSugar] = useState<number>(20);

  // 模式2 计算
  const curConcPreset = concPresets[concPreset];
  const initialSolute2 = (curConcPreset.total * curConcPreset.conc) / 100;
  const initialWater2 = curConcPreset.total - initialSolute2; // 关键：水完全不变！
  const currentTotalSolute2 = initialSolute2 + addedSugar;
  const currentTotalSolution2 = curConcPreset.total + addedSugar;
  const currentConc2 = (currentTotalSolute2 / currentTotalSolution2) * 100;
  // 常见错误算出的虚假浓度（分母漏加糖）
  const wrongConc2 = (currentTotalSolute2 / curConcPreset.total) * 100;

  // -------------------- 模式3：两液混合与十字交叉法 --------------------
  const [mass1, setMass1] = useState<number>(100); // A液质量 (g)
  const [concA, setConcA] = useState<number>(10);  // A液浓度 (%)
  const [mass2, setMass2] = useState<number>(200); // B液质量 (g)
  const [concB, setConcB] = useState<number>(40);  // B液浓度 (%)

  // 模式3 计算
  const totalMassMix = mass1 + mass2;
  const totalSoluteMix = (mass1 * concA) / 100 + (mass2 * concB) / 100;
  const mixedConc = totalMassMix > 0 ? (totalSoluteMix / totalMassMix) * 100 : 0;

  // 十字交叉差值
  const diffA = Math.abs(mixedConc - concA);
  const diffB = Math.abs(concB - mixedConc);

  return (
    <div className={styles.container} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 头部标题区 */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', color: '#1e293b' }}>
          🧪 溶液浓度问题：加水稀释、加糖增浓与十字交叉法
        </h3>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>
          抓牢“溶质不变”与“水不变”两条铁律，用杠杆平衡看透秒杀混合题的十字交叉法！
        </p>
      </div>

      {/* 模式选择导航 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={() => setMode('dilution')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'dilution' ? '#2563eb' : '#f1f5f9',
            color: mode === 'dilution' ? '#ffffff' : '#475569',
            boxShadow: mode === 'dilution' ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          💧 场景一：加水稀释（溶质质量恒定）
        </button>
        <button
          onClick={() => setMode('concentration')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'concentration' ? '#d97706' : '#f1f5f9',
            color: mode === 'concentration' ? '#ffffff' : '#475569',
            boxShadow: mode === 'concentration' ? '0 2px 8px rgba(217,119,6,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          🍬 场景二：加糖增浓（溶剂水恒定）
        </button>
        <button
          onClick={() => setMode('mixing')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'mixing' ? '#059669' : '#f1f5f9',
            color: mode === 'mixing' ? '#ffffff' : '#475569',
            boxShadow: mode === 'mixing' ? '0 2px 8px rgba(5,150,105,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          ⚖️ 场景三：两液混合与十字交叉杠杆
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 场景一：加水稀释 */}
      {/* ========================================================================= */}
      {mode === 'dilution' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 画布核心区 */}
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '12px' }}>
              加水稀释动态实验：向烧杯不断注入清水
            </div>

            {/* 左右分栏：左烧杯动效，右天平与配比图 */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* 烧杯动效 */}
              <div
                style={{
                  width: '200px',
                  height: '240px',
                  borderLeft: '4px solid #64748b',
                  borderRight: '4px solid #64748b',
                  borderBottom: '5px solid #475569',
                  borderRadius: '0 0 16px 16px',
                  position: 'relative',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'flex-end',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
                }}
              >
                {/* 刻度线 */}
                {[100, 200, 300, 400].map((tick) => (
                  <div
                    key={tick}
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: `${(tick / 450) * 100}%`,
                      width: '24px',
                      borderBottom: '1.5px dashed #94a3b8',
                      fontSize: '9px',
                      color: '#64748b',
                      paddingLeft: '28px',
                      pointerEvents: 'none',
                    }}
                  >
                    {tick}g
                  </div>
                ))}

                {/* 液体 */}
                <div
                  style={{
                    width: '100%',
                    height: `${Math.min(100, (currentTotalSolution1 / 450) * 100)}%`,
                    background: `linear-gradient(to top, rgba(245, 158, 11, ${Math.max(0.15, currentConc1 / 30)}), rgba(59, 130, 246, 0.25))`,
                    transition: 'all 0.3s ease-out',
                    position: 'relative',
                    borderTop: '2px solid #3b82f6',
                  }}
                >
                  {/* 糖/溶质颗粒（数量恒定固定为16粒） */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      padding: '8px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        title="溶质颗粒（质量守恒不变）"
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: '#d97706',
                          border: '1.5px solid #b45309',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          margin: '4px',
                          transform: `translate(${(i % 4) * 2 - 4}px, ${(i % 3) * 3 - 3}px)`,
                        }}
                      />
                    ))}
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      width: '100%',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: '#1e3a8a',
                      textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                    }}
                  >
                    总液重 {currentTotalSolution1}g
                  </div>
                </div>
              </div>

              {/* 右侧：质量守恒拆解与算式卡片 */}
              <div
                style={{
                  flex: '1',
                  minWidth: '260px',
                  maxWidth: '440px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {/* 溶质守恒卡片 */}
                <div
                  style={{
                    background: '#fef3c7',
                    border: '1.5px solid #fde68a',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: 600 }}>
                      🔒 核心抓手：溶质（纯糖/盐）质量
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#b45309' }}>
                      {initialSolute1} g（始终绝对不变！）
                    </div>
                  </div>
                  <div style={{ fontSize: '2rem' }}>🔒</div>
                </div>

                {/* 溶液三量比例条 */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    溶液内部质量组成：
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      height: '24px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      lineHeight: '24px',
                    }}
                  >
                    <div
                      style={{
                        width: `${(initialSolute1 / currentTotalSolution1) * 100}%`,
                        background: '#f59e0b',
                        color: '#ffffff',
                        minWidth: '35px',
                        transition: 'width 0.3s',
                      }}
                    >
                      溶质 {initialSolute1}g
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: '#38bdf8',
                        color: '#0369a1',
                        transition: 'width 0.3s',
                      }}
                    >
                      水 {currentTotalWater1}g (原{initialWater1}g + 加{addedWater}g)
                    </div>
                  </div>
                </div>

                {/* 实时公式卡片 */}
                <div
                  style={{
                    background: '#eff6ff',
                    border: '1.5px solid #bfdbfe',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 600 }}>
                    浓度计算公式：浓度 = 溶质质量 ÷ 溶液总质量
                  </div>
                  <div
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#1d4ed8',
                      margin: '6px 0',
                    }}
                  >
                    新浓度 = {initialSolute1} ÷ ({curDilPreset.total} + {addedWater}) ={' '}
                    <span style={{ fontSize: '1.35rem', color: '#dc2626' }}>
                      {currentConc1.toFixed(2)}%
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    原浓度 {curDilPreset.conc}% ➔ 加水 {addedWater}g ➔ 稀释至 {currentConc1.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 控制条区（紧贴画布，支持弹性换行） */}
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* 预设切换按钮组 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
                选择初始溶液预设：
              </span>
              {dilutionPresets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setDilutionPreset(idx)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: dilutionPreset === idx ? '#2563eb' : '#ffffff',
                    color: dilutionPreset === idx ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: dilutionPreset === idx ? 700 : 500,
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* 注入清水滑块 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e3a8a', minWidth: '130px' }}>
                🚰 注入清水量：{addedWater} g
              </span>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={addedWater}
                onChange={(e) => setAddedWater(Number(e.target.value))}
                style={{ flex: '1', minWidth: '180px', accentColor: '#2563eb', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 50, 100, 200, 300].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAddedWater(val)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1',
                      background: addedWater === val ? '#bfdbfe' : '#ffffff',
                      color: '#1e3a8a',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    +{val}g
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景二：加糖增浓 */}
      {/* ========================================================================= */}
      {mode === 'concentration' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 画布核心区 */}
          <div
            style={{
              background: '#fcfbf7',
              border: '1.5px solid #fef3c7',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#92400e', marginBottom: '12px' }}>
              加糖增浓实验：小心“分母忘记加糖”的头号丢分陷阱！
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* 烧杯动效 */}
              <div
                style={{
                  width: '200px',
                  height: '240px',
                  borderLeft: '4px solid #64748b',
                  borderRight: '4px solid #64748b',
                  borderBottom: '5px solid #475569',
                  borderRadius: '0 0 16px 16px',
                  position: 'relative',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'flex-end',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
                }}
              >
                {/* 液体层 */}
                <div
                  style={{
                    width: '100%',
                    height: `${Math.min(100, (currentTotalSolution2 / 200) * 100)}%`,
                    background: `linear-gradient(to top, rgba(217, 119, 6, ${Math.min(0.9, currentConc2 / 40)}), rgba(251, 191, 36, 0.45))`,
                    transition: 'all 0.3s ease-out',
                    position: 'relative',
                    borderTop: '2px solid #d97706',
                  }}
                >
                  {/* 糖颗粒（随加糖数量增加） */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      padding: '6px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {Array.from({ length: Math.min(32, 8 + Math.floor(addedSugar / 2)) }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '9px',
                          height: '9px',
                          borderRadius: '2px',
                          background: i >= 8 ? '#ea580c' : '#b45309',
                          border: '1px solid #78350f',
                          margin: '3px',
                          transform: `rotate(${i * 15}deg)`,
                        }}
                      />
                    ))}
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      width: '100%',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: '#78350f',
                      textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                    }}
                  >
                    总液重 {currentTotalSolution2}g
                  </div>
                </div>
              </div>

              {/* 右侧：两套算理深度对比 */}
              <div
                style={{
                  flex: '1',
                  minWidth: '270px',
                  maxWidth: '450px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {/* 水恒定不变抓手 */}
                <div
                  style={{
                    background: '#e0f2fe',
                    border: '1.5px solid #bae6fd',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#0369a1', fontWeight: 600 }}>
                      💧 加糖增浓的隐形不变量：水的质量
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284c7' }}>
                      水 = {initialWater2} g（一滴没变！）
                    </div>
                  </div>
                  <div style={{ fontSize: '2rem' }}>🌊</div>
                </div>

                {/* 致命错误警示卡 */}
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1.5px solid #fecaca',
                    borderRadius: '8px',
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#dc2626' }}>
                    🚨 孩子常犯的致命错误（分母漏加糖）：
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#991b1b', marginTop: '4px' }}>
                    错算式：({initialSolute2} + {addedSugar}) ÷ {curConcPreset.total} ={' '}
                    <span style={{ textDecoration: 'line-through', fontWeight: 700 }}>
                      {wrongConc2.toFixed(1)}%
                    </span>{' '}
                    ❌（把加的糖凭空隐形了！）
                  </div>
                </div>

                {/* 正确算式卡 */}
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1.5px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803d' }}>
                    ✅ 正确公式（分子分母同步加糖）：
                  </div>
                  <div style={{ fontSize: '0.92rem', color: '#166534', marginTop: '4px' }}>
                    新浓度 = ({initialSolute2} + {addedSugar}) ÷ ({curConcPreset.total} + {addedSugar}) ={' '}
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>
                      {currentConc2.toFixed(2)}%
                    </span>{' '}
                    ✅
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px' }}>
                    💡 秒杀思路（抓水不变）：此时水的占比为 (100% - {currentConc2.toFixed(1)}%) ={' '}
                    {(100 - currentConc2).toFixed(1)}%，直接用 {initialWater2} ÷ {(100 - currentConc2).toFixed(1)}% 秒求新总重！
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 控制条区 */}
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* 预设切换按钮组 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
                初始溶液预设：
              </span>
              {concPresets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setConcPreset(idx)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: concPreset === idx ? '#d97706' : '#ffffff',
                    color: concPreset === idx ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: concPreset === idx ? 700 : 500,
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* 加入白糖滑块 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#92400e', minWidth: '130px' }}>
                🍬 倒入白糖质量：{addedSugar} g
              </span>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={addedSugar}
                onChange={(e) => setAddedSugar(Number(e.target.value))}
                style={{ flex: '1', minWidth: '180px', accentColor: '#d97706', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 10, 20, 30, 50].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAddedSugar(val)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1',
                      background: addedSugar === val ? '#fde68a' : '#ffffff',
                      color: '#92400e',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    +{val}g
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景三：两液混合与十字交叉法杠杆 */}
      {/* ========================================================================= */}
      {mode === 'mixing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 画布核心区 */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#166534', marginBottom: '8px' }}>
              十字交叉法：本质就是浓度差与质量比的反比“杠杆平衡”！
            </div>
            <div style={{ fontSize: '0.85rem', color: '#15803d', marginBottom: '16px' }}>
              混合后的浓度必定居于两者之间，越靠近哪一边，说明那一边的溶液质量越大！
            </div>

            {/* 十字交叉与杠杆平衡可视化 */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                alignItems: 'center',
              }}
            >
              {/* 1. 物理杠杆天平 */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '620px',
                  background: '#ffffff',
                  border: '1.5px solid #86efac',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    marginBottom: '10px',
                  }}
                >
                  <span style={{ color: '#2563eb' }}>
                    A液：{mass1}g (浓度 {concA}%)
                  </span>
                  <span style={{ color: '#059669', fontSize: '1rem', fontWeight: 800 }}>
                    平衡支点（混合浓度）：{mixedConc.toFixed(1)}%
                  </span>
                  <span style={{ color: '#d97706' }}>
                    B液：{mass2}g (浓度 {concB}%)
                  </span>
                </div>

                {/* 杠杆杆身示意图 */}
                <div style={{ position: 'relative', height: '60px', marginTop: '10px' }}>
                  {/* 水平平衡杠杆条 */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      left: '5%',
                      width: '90%',
                      height: '8px',
                      background: '#475569',
                      borderRadius: '4px',
                    }}
                  />

                  {/* 支点（三角形） */}
                  {(() => {
                    const pctRange = Math.max(1, concB - concA);
                    const fulcrumPos = ((mixedConc - concA) / pctRange) * 80 + 10;
                    return (
                      <div
                        style={{
                          position: 'absolute',
                          left: `${fulcrumPos}%`,
                          top: '28px',
                          transform: 'translateX(-50%)',
                          width: 0,
                          height: 0,
                          borderLeft: '12px solid transparent',
                          borderRight: '12px solid transparent',
                          borderBottom: '20px solid #059669',
                          transition: 'left 0.3s ease-out',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '22px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            whiteSpace: 'nowrap',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            color: '#059669',
                          }}
                        >
                          支点 {mixedConc.toFixed(1)}%
                        </div>
                      </div>
                    );
                  })()}

                  {/* 左托盘砝码 (A液质量) */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '8%',
                      top: '-15px',
                      transform: 'translateX(-50%)',
                      background: '#dbeafe',
                      border: '1.5px solid #2563eb',
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#1e40af',
                    }}
                  >
                    重 {mass1}g
                  </div>

                  {/* 右托盘砝码 (B液质量) */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '92%',
                      top: '-15px',
                      transform: 'translateX(-50%)',
                      background: '#fef3c7',
                      border: '1.5px solid #d97706',
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#92400e',
                    }}
                  >
                    重 {mass2}g
                  </div>
                </div>

                {/* 杠杆力矩等式 */}
                <div
                  style={{
                    marginTop: '28px',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: '#334155',
                    background: '#f8fafc',
                    padding: '8px',
                    borderRadius: '6px',
                  }}
                >
                  杠杆平衡：质量 × 浓度差 恒等 ➔{' '}
                  <span style={{ color: '#2563eb', fontWeight: 700 }}>
                    {mass1}g × {diffA.toFixed(1)}%
                  </span>{' '}
                  ={' '}
                  <span style={{ color: '#d97706', fontWeight: 700 }}>
                    {mass2}g × {diffB.toFixed(1)}%
                  </span>{' '}
                  ={' '}
                  <span style={{ color: '#059669', fontWeight: 800 }}>
                    {((mass1 * diffA) / 100).toFixed(1)} (力矩守恒平衡！)
                  </span>
                </div>
              </div>

              {/* 2. 经典十字交叉图解卡片 */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '620px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '16px',
                }}
              >
                <div style={{ textAlign: 'center', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>
                  🎯 试卷标准十字交叉书写格式
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                  }}
                >
                  {/* 左列：原浓度 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#2563eb', fontSize: '1.1rem' }}>
                      A液：{concA}%
                    </div>
                    <div style={{ fontWeight: 800, color: '#d97706', fontSize: '1.1rem' }}>
                      B液：{concB}%
                    </div>
                  </div>

                  {/* 中列：交叉箭头与中心目标浓度 */}
                  <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                    <svg viewBox="0 0 90 90" width="90" height="90">
                      <line x1="10" y1="20" x2="80" y2="70" stroke="#94a3b8" strokeWidth="2.5" />
                      <line x1="10" y1="70" x2="80" y2="20" stroke="#94a3b8" strokeWidth="2.5" />
                      <circle cx="45" cy="45" r="16" fill="#059669" />
                      <text x="45" y="49" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">
                        {mixedConc.toFixed(0)}%
                      </text>
                    </svg>
                  </div>

                  {/* 右列：相减差值即质量比 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
                    <div style={{ color: '#2563eb', fontSize: '0.95rem' }}>
                      |{concB}% - {mixedConc.toFixed(1)}%| ={' '}
                      <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>{diffB.toFixed(1)}%</span>{' '}
                      ➔ A质量份数 ({mass1}g)
                    </div>
                    <div style={{ color: '#d97706', fontSize: '0.95rem' }}>
                      |{mixedConc.toFixed(1)}% - {concA}%| ={' '}
                      <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>{diffA.toFixed(1)}%</span>{' '}
                      ➔ B质量份数 ({mass2}g)
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '14px',
                    textAlign: 'center',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: '#065f46',
                    background: '#ecfdf5',
                    padding: '8px',
                    borderRadius: '6px',
                  }}
                >
                  质量之比：A液 : B液 = {diffB.toFixed(1)} : {diffA.toFixed(1)} ={' '}
                  <span style={{ fontSize: '1.15rem', color: '#047857' }}>
                    {mass1} : {mass2}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 控制条区 */}
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* A液参数控制 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2563eb', minWidth: '130px' }}>
                🔹 A液：质量 {mass1}g / 浓度 {concA}%
              </span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#475569' }}>质量:</span>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="25"
                  value={mass1}
                  onChange={(e) => setMass1(Number(e.target.value))}
                  style={{ accentColor: '#2563eb', cursor: 'pointer', width: '110px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#475569' }}>浓度:</span>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="5"
                  value={concA}
                  onChange={(e) => setConcA(Number(e.target.value))}
                  style={{ accentColor: '#2563eb', cursor: 'pointer', width: '90px' }}
                />
              </div>
            </div>

            {/* B液参数控制 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#d97706', minWidth: '130px' }}>
                🔸 B液：质量 {mass2}g / 浓度 {concB}%
              </span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#475569' }}>质量:</span>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="25"
                  value={mass2}
                  onChange={(e) => setMass2(Number(e.target.value))}
                  style={{ accentColor: '#d97706', cursor: 'pointer', width: '110px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#475569' }}>浓度:</span>
                <input
                  type="range"
                  min="30"
                  max="60"
                  step="5"
                  value={concB}
                  onChange={(e) => setConcB(Number(e.target.value))}
                  style={{ accentColor: '#d97706', cursor: 'pointer', width: '90px' }}
                />
              </div>
            </div>

            {/* 快速预设按钮组 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
                典型考题速配：
              </span>
              <button
                onClick={() => {
                  setMass1(100);
                  setConcA(10);
                  setMass2(200);
                  setConcB(40);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                1:2 混合 (10% + 40% ➔ 30%)
              </button>
              <button
                onClick={() => {
                  setMass1(150);
                  setConcA(10);
                  setMass2(150);
                  setConcB(30);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                等量 1:1 对半混合 (中点 20%)
              </button>
              <button
                onClick={() => {
                  setMass1(300);
                  setConcA(5);
                  setMass2(100);
                  setConcB(45);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                3:1 偏置混合 (5% + 45% ➔ 15%)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 底部辅导口诀总结 */}
      <div
        style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '8px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'space-around',
          fontSize: '0.84rem',
          color: '#475569',
        }}
      >
        <span>💧 <strong>加水稀释：</strong>抓【溶质】不变，分母增大浓度降</span>
        <span>🍬 <strong>加糖增浓：</strong>抓【溶剂水】不变，分母千万记得加糖</span>
        <span>⚖️ <strong>两液混合：</strong>十字交叉看杠杆，差与质量成反比</span>
      </div>
    </div>
  );
}

