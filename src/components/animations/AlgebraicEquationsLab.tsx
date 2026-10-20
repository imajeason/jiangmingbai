'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type Mode = 'balance' | 'compare' | 'quiz';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '解方程 x + 8 = 23 时，最标准的依据是等式的什么性质？',
    options: [
      '等式两边同时减去 8，左右依然相等',
      '直接把加号改成减号算 23 - 8',
      '等式两边同时加上 8',
      '两边同时除以 8'
    ],
    correctIndex: 0,
    explanation: '方程的本质是天平！左盘有神秘盒 x 和 8g 砝码，要想单挑出 x，必须左右两边同时减去 8g，天平才能继续保持水平平衡：x + 8 - 8 = 23 - 8，得 x = 15。'
  },
  {
    id: 2,
    question: '在方程 4x = 36 中，要想求出单个未知数 x 的值，两边应该怎么操作？',
    options: [
      '两边同时减去 4',
      '两边同时乘 4',
      '两边同时除以 4 (非零数)',
      '两边同时加上 36'
    ],
    correctIndex: 2,
    explanation: '左盘有 4 个一模一样的神秘盒 4x，右盘有 36g 砝码。把两边的物品都平均分成 4 等份，各取 1 份，天平依然平衡：4x ÷ 4 = 36 ÷ 4，得 x = 9。'
  },
  {
    id: 3,
    question: '列方程解应用题时，相比于低年级的“算术倒推法”，方程最大的优势是什么？',
    options: [
      '计算步骤比算术法更少',
      '可以把未知数当成已知数，顺着题目的逻辑直接列出等量关系',
      '方程不需要写单位名称',
      '方程只适用于乘法问题'
    ],
    correctIndex: 1,
    explanation: '算术法需要反向倒推（见加用减、见倍用除），题目复杂时脑子极易打结；而方程让我们把未知数设为 x，把它当成已经知道的朋友，顺着题目的情节正向把故事讲完，这就是伟大的代数思维！'
  }
];

export default function AlgebraicEquationsLab() {
  const [mode, setMode] = useState<Mode>('balance');

  // 方程预设场景 (类型: 加减平衡 x + a = b 或 乘除平衡 ax = b 或 复合 2x + a = b)
  const [presetType, setPresetType] = useState<'add' | 'multiply' | 'composite'>('add');

  // 当前天平演化步数: 0=初始方程状态, 1=执行第一步消元/化简, 2=完全解出
  const [step, setStep] = useState<number>(0);

  // 测验
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // 切换预设
  const handleSelectPreset = (p: 'add' | 'multiply' | 'composite') => {
    setPresetType(p);
    setStep(0);
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
      {/* 顶部模式切换选项卡 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          className={mode === 'balance' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('balance'); setStep(0); }}
        >
          ⚖️ 模式一：真实天平与等式性质实验室
        </button>
        <button
          className={mode === 'compare' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('compare'); }}
        >
          💡 模式二：算术思维 vs 代数思维破局对比
        </button>
        <button
          className={mode === 'quiz' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('quiz'); }}
        >
          🎯 模式三：解方程易错考点闯关
        </button>
      </div>

      {/* 模式一：真实天平与等式性质实验室 */}
      {mode === 'balance' && (
        <div>
          {/* 场景选择与操作控制 */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                  🎯 当前探究方程：
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb', marginLeft: '8px' }}>
                  {presetType === 'add' && 'x + 6 = 18'}
                  {presetType === 'multiply' && '3x = 24'}
                  {presetType === 'composite' && '2x + 4 = 16'}
                </span>
              </div>

              {/* 方程类型选择 */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', alignSelf: 'center', marginRight: '4px' }}>切换模型：</span>
                <button
                  onClick={() => handleSelectPreset('add')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: presetType === 'add' ? '#2563eb' : '#cbd5e1',
                    background: presetType === 'add' ? '#eff6ff' : '#ffffff',
                    color: presetType === 'add' ? '#1d4ed8' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  加法平衡 (x + 6 = 18)
                </button>
                <button
                  onClick={() => handleSelectPreset('multiply')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: presetType === 'multiply' ? '#2563eb' : '#cbd5e1',
                    background: presetType === 'multiply' ? '#eff6ff' : '#ffffff',
                    color: presetType === 'multiply' ? '#1d4ed8' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  乘法平衡 (3x = 24)
                </button>
                <button
                  onClick={() => handleSelectPreset('composite')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: presetType === 'composite' ? '#2563eb' : '#cbd5e1',
                    background: presetType === 'composite' ? '#eff6ff' : '#ffffff',
                    color: presetType === 'composite' ? '#1d4ed8' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  复合两步方程 (2x + 4 = 16)
                </button>
              </div>
            </div>

            {/* 天平操作按钮步进条 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {presetType === 'add' && (
                <>
                  <button
                    className={step === 0 ? styles.primaryBtn : styles.secondaryBtn}
                    onClick={() => setStep(0)}
                    style={{ padding: '6px 14px', fontSize: '0.875rem' }}
                  >
                    1. 初始状态 (天平平衡)
                  </button>
                  <button
                    className={step === 1 ? styles.primaryBtn : styles.secondaryBtn}
                    onClick={() => setStep(1)}
                    style={{ padding: '6px 14px', fontSize: '0.875rem' }}
                  >
                    2. 左右两边同时减去 6g (拿走砝码)
                  </button>
                </>
              )}

              {presetType === 'multiply' && (
                <>
                  <button
                    className={step === 0 ? styles.primaryBtn : styles.secondaryBtn}
                    onClick={() => setStep(0)}
                    style={{ padding: '6px 14px', fontSize: '0.875rem' }}
                  >
                    1. 初始状态 (3个神秘盒)
                  </button>
                  <button
                    className={step === 1 ? styles.primaryBtn : styles.secondaryBtn}
                    onClick={() => setStep(1)}
                    style={{ padding: '6px 14px', fontSize: '0.875rem' }}
                  >
                    2. 左右两边同时除以 3 (平均分3组留1组)
                  </button>
                </>
              )}

              {presetType === 'composite' && (
                <>
                  <button
                    className={step === 0 ? styles.primaryBtn : styles.secondaryBtn}
                    onClick={() => setStep(0)}
                    style={{ padding: '6px 14px', fontSize: '0.875rem' }}
                  >
                    1. 初始状态 (2x + 4 = 16)
                  </button>
                  <button
                    className={step === 1 ? styles.primaryBtn : styles.secondaryBtn}
                    onClick={() => setStep(1)}
                    style={{ padding: '6px 14px', fontSize: '0.875rem' }}
                  >
                    2. 第一步：两边同减 4g (化为 2x = 12)
                  </button>
                  <button
                    className={step === 2 ? styles.primaryBtn : styles.secondaryBtn}
                    onClick={() => setStep(2)}
                    style={{ padding: '6px 14px', fontSize: '0.875rem' }}
                  >
                    3. 第二步：两边同除以 2 (解出 x = 6)
                  </button>
                </>
              )}

              <button
                className={styles.secondaryBtn}
                onClick={() => setStep(0)}
                style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
              >
                🔄 重置天平
              </button>
            </div>
          </div>

          {/* 交互天平 SVG 主舞台 */}
          <div style={{ background: '#f1f5f9', borderRadius: '16px', border: '2px solid #cbd5e1', padding: '20px', position: 'relative', marginBottom: '20px' }}>
            {/* 顶部天平平衡指示灯 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <div style={{ background: '#dcfce7', border: '1px solid #86efac', padding: '4px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>
                天平完美水平平衡 (等号成立：左边 = 右边)
              </div>
            </div>

            <svg viewBox="0 0 800 320" style={{ width: '100%', height: 'auto', display: 'block' }}>
              <defs>
                <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
                <linearGradient id="panGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
                <linearGradient id="boxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>

              {/* 底座与立柱 */}
              <path d="M 360 300 L 440 300 L 420 270 L 380 270 Z" fill="#334155" />
              <rect x="395" y="100" width="10" height="170" fill="#475569" />
              {/* 中心支点圆环 */}
              <circle cx="400" cy="100" r="12" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
              {/* 指针 */}
              <line x1="400" y1="100" x2="400" y2="150" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
              <circle cx="400" cy="150" r="4" fill="#dc2626" />
              {/* 刻度盘 */}
              <path d="M 380 150 Q 400 156 420 150" stroke="#64748b" strokeWidth="2" fill="none" />
              <line x1="400" y1="146" x2="400" y2="154" stroke="#16a34a" strokeWidth="2" />

              {/* 横梁 (水平) */}
              <rect x="150" y="96" width="500" height="8" rx="4" fill="url(#beamGrad)" />

              {/* 左吊绳与托盘 (中心在 x = 220) */}
              <line x1="220" y1="100" x2="170" y2="190" stroke="#64748b" strokeWidth="2" />
              <line x1="220" y1="100" x2="270" y2="190" stroke="#64748b" strokeWidth="2" />
              <ellipse cx="220" cy="190" rx="60" ry="10" fill="url(#panGrad)" stroke="#64748b" strokeWidth="2" />

              {/* 右吊绳与托盘 (中心在 x = 580) */}
              <line x1="580" y1="100" x2="530" y2="190" stroke="#64748b" strokeWidth="2" />
              <line x1="580" y1="100" x2="630" y2="190" stroke="#64748b" strokeWidth="2" />
              <ellipse cx="580" cy="190" rx="60" ry="10" fill="url(#panGrad)" stroke="#64748b" strokeWidth="2" />

              {/* ========== 左盘物品渲染 ========== */}
              {presetType === 'add' && (
                <g>
                  {/* 神秘盒 x (12g) */}
                  <g transform="translate(180, 140)">
                    <rect x="0" y="0" width="36" height="42" rx="6" fill="url(#boxGrad)" stroke="#1d4ed8" strokeWidth="2" />
                    <text x="18" y="27" fontSize="20" fontWeight="bold" fill="#ffffff" textAnchor="middle">x</text>
                    <text x="18" y="55" fontSize="11" fontWeight="bold" fill="#1e40af" textAnchor="middle">神秘盒</text>
                  </g>

                  {/* 6g 砝码 (若 step 0 则在盘上，若 step 1 则被移除虚线淡出) */}
                  {step === 0 ? (
                    <g transform="translate(228, 154)">
                      <rect x="0" y="0" width="28" height="28" rx="4" fill="url(#goldGrad)" stroke="#ca8a04" strokeWidth="1.5" />
                      <text x="14" y="19" fontSize="12" fontWeight="bold" fill="#713f12" textAnchor="middle">6g</text>
                    </g>
                  ) : (
                    <g transform="translate(228, 110)" opacity="0.35">
                      <rect x="0" y="0" width="28" height="28" rx="4" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 3" />
                      <text x="14" y="19" fontSize="12" fontWeight="bold" fill="#dc2626" textAnchor="middle">-6g</text>
                    </g>
                  )}
                </g>
              )}

              {presetType === 'multiply' && (
                <g>
                  {step === 0 ? (
                    // 3 个神秘盒 x 并排
                    <g>
                      {[0, 1, 2].map((i) => (
                        <g key={i} transform={`translate(${180 + i * 28}, 142)`}>
                          <rect x="0" y="0" width="26" height="38" rx="5" fill="url(#boxGrad)" stroke="#1d4ed8" strokeWidth="1.5" />
                          <text x="13" y="24" fontSize="16" fontWeight="bold" fill="#ffffff" textAnchor="middle">x</text>
                        </g>
                      ))}
                      <text x="220" y="198" fontSize="12" fontWeight="bold" fill="#1e40af" textAnchor="middle">3 个 x (3x)</text>
                    </g>
                  ) : (
                    // 两边同除以 3: 只留下 1 个神秘盒 x
                    <g transform="translate(205, 140)">
                      <rect x="0" y="0" width="36" height="42" rx="6" fill="url(#boxGrad)" stroke="#1d4ed8" strokeWidth="2" />
                      <text x="18" y="27" fontSize="20" fontWeight="bold" fill="#ffffff" textAnchor="middle">x</text>
                      <text x="18" y="55" fontSize="11" fontWeight="bold" fill="#16a34a" textAnchor="middle">留 1 份</text>
                    </g>
                  )}
                </g>
              )}

              {presetType === 'composite' && (
                <g>
                  {step === 0 && (
                    <g>
                      <g transform="translate(182, 142)">
                        <rect x="0" y="0" width="24" height="38" rx="4" fill="url(#boxGrad)" stroke="#1d4ed8" strokeWidth="1.5" />
                        <text x="12" y="24" fontSize="14" fontWeight="bold" fill="#fff" textAnchor="middle">x</text>
                      </g>
                      <g transform="translate(210, 142)">
                        <rect x="0" y="0" width="24" height="38" rx="4" fill="url(#boxGrad)" stroke="#1d4ed8" strokeWidth="1.5" />
                        <text x="12" y="24" fontSize="14" fontWeight="bold" fill="#fff" textAnchor="middle">x</text>
                      </g>
                      <g transform="translate(238, 156)">
                        <rect x="0" y="0" width="24" height="24" rx="4" fill="url(#goldGrad)" stroke="#ca8a04" strokeWidth="1.5" />
                        <text x="12" y="17" fontSize="11" fontWeight="bold" fill="#713f12" textAnchor="middle">4g</text>
                      </g>
                    </g>
                  )}
                  {step === 1 && (
                    <g>
                      <g transform="translate(195, 142)">
                        <rect x="0" y="0" width="24" height="38" rx="4" fill="url(#boxGrad)" stroke="#1d4ed8" strokeWidth="1.5" />
                        <text x="12" y="24" fontSize="14" fontWeight="bold" fill="#fff" textAnchor="middle">x</text>
                      </g>
                      <g transform="translate(225, 142)">
                        <rect x="0" y="0" width="24" height="38" rx="4" fill="url(#boxGrad)" stroke="#1d4ed8" strokeWidth="1.5" />
                        <text x="12" y="24" fontSize="14" fontWeight="bold" fill="#fff" textAnchor="middle">x</text>
                      </g>
                      <text x="220" y="196" fontSize="11" fontWeight="bold" fill="#1e40af" textAnchor="middle">剩下 2x</text>
                    </g>
                  )}
                  {step === 2 && (
                    <g transform="translate(205, 140)">
                      <rect x="0" y="0" width="34" height="42" rx="6" fill="url(#boxGrad)" stroke="#1d4ed8" strokeWidth="2" />
                      <text x="17" y="27" fontSize="20" fontWeight="bold" fill="#ffffff" textAnchor="middle">x</text>
                      <text x="17" y="55" fontSize="11" fontWeight="bold" fill="#16a34a" textAnchor="middle">除以2得1个x</text>
                    </g>
                  )}
                </g>
              )}

              {/* ========== 右盘物品渲染 ========== */}
              {presetType === 'add' && (
                <g>
                  {step === 0 ? (
                    // 18g: 一个 12g 砝码和一个 6g 砝码
                    <g transform="translate(548, 148)">
                      <rect x="0" y="0" width="36" height="34" rx="4" fill="url(#goldGrad)" stroke="#ca8a04" strokeWidth="1.5" />
                      <text x="18" y="22" fontSize="14" fontWeight="bold" fill="#713f12" textAnchor="middle">12g</text>
                      <g transform="translate(40, 6)">
                        <rect x="0" y="0" width="28" height="28" rx="4" fill="url(#goldGrad)" stroke="#ca8a04" strokeWidth="1.5" />
                        <text x="14" y="19" fontSize="12" fontWeight="bold" fill="#713f12" textAnchor="middle">6g</text>
                      </g>
                      <text x="34" y="48" fontSize="11" fontWeight="bold" fill="#854d0e" textAnchor="middle">共 18g</text>
                    </g>
                  ) : (
                    // 左右同时拿走 6g: 右盘只剩下 12g 砝码
                    <g transform="translate(562, 145)">
                      <rect x="0" y="0" width="40" height="38" rx="6" fill="url(#goldGrad)" stroke="#ca8a04" strokeWidth="2" />
                      <text x="20" y="25" fontSize="18" fontWeight="bold" fill="#713f12" textAnchor="middle">12g</text>
                      <text x="20" y="50" fontSize="11" fontWeight="bold" fill="#15803d" textAnchor="middle">解得 x = 12</text>
                    </g>
                  )}
                </g>
              )}

              {presetType === 'multiply' && (
                <g>
                  {step === 0 ? (
                    <g transform="translate(555, 142)">
                      <rect x="0" y="0" width="50" height="40" rx="6" fill="url(#goldGrad)" stroke="#ca8a04" strokeWidth="1.5" />
                      <text x="25" y="26" fontSize="18" fontWeight="bold" fill="#713f12" textAnchor="middle">24g</text>
                      <text x="25" y="50" fontSize="11" fontWeight="bold" fill="#854d0e" textAnchor="middle">3 份总重 24g</text>
                    </g>
                  ) : (
                    <g transform="translate(562, 145)">
                      <rect x="0" y="0" width="40" height="38" rx="6" fill="url(#goldGrad)" stroke="#ca8a04" strokeWidth="2" />
                      <text x="20" y="25" fontSize="18" fontWeight="bold" fill="#713f12" textAnchor="middle">8g</text>
                      <text x="20" y="50" fontSize="11" fontWeight="bold" fill="#15803d" textAnchor="middle">24 ÷ 3 = 8g</text>
                    </g>
                  )}
                </g>
              )}

              {presetType === 'composite' && (
                <g>
                  {step === 0 && (
                    <g transform="translate(548, 148)">
                      <rect x="0" y="0" width="36" height="34" rx="4" fill="url(#goldGrad)" stroke="#ca8a04" strokeWidth="1.5" />
                      <text x="18" y="22" fontSize="14" fontWeight="bold" fill="#713f12" textAnchor="middle">12g</text>
                      <g transform="translate(40, 10)">
                        <rect x="0" y="0" width="24" height="24" rx="4" fill="url(#goldGrad)" stroke="#ca8a04" strokeWidth="1.5" />
                        <text x="12" y="17" fontSize="11" fontWeight="bold" fill="#713f12" textAnchor="middle">4g</text>
                      </g>
                      <text x="32" y="46" fontSize="11" fontWeight="bold" fill="#854d0e" textAnchor="middle">共 16g</text>
                    </g>
                  )}
                  {step === 1 && (
                    <g transform="translate(555, 145)">
                      <rect x="0" y="0" width="46" height="38" rx="5" fill="url(#goldGrad)" stroke="#ca8a04" strokeWidth="1.5" />
                      <text x="23" y="25" fontSize="17" fontWeight="bold" fill="#713f12" textAnchor="middle">12g</text>
                      <text x="23" y="48" fontSize="11" fontWeight="bold" fill="#1e40af" textAnchor="middle">两边已减 4g</text>
                    </g>
                  )}
                  {step === 2 && (
                    <g transform="translate(562, 145)">
                      <rect x="0" y="0" width="38" height="38" rx="5" fill="url(#goldGrad)" stroke="#ca8a04" strokeWidth="2" />
                      <text x="19" y="25" fontSize="18" fontWeight="bold" fill="#713f12" textAnchor="middle">6g</text>
                      <text x="19" y="50" fontSize="11" fontWeight="bold" fill="#15803d" textAnchor="middle">12 ÷ 2 = 6g</text>
                    </g>
                  )}
                </g>
              )}
            </svg>

            {/* 动态代数变形板 */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #cbd5e1', marginTop: '16px' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>
                📝 规范书写与天平动作同步对照表：
              </div>

              {presetType === 'add' && (
                <div style={{ fontSize: '1.05rem', lineHeight: 1.8, fontFamily: 'monospace', color: '#0f172a' }}>
                  {step === 0 && (
                    <div>
                      <strong>原方程：</strong> x + 6 = 18 <span style={{ color: '#64748b', fontSize: '0.9rem' }}>(左盘有 x 和 6g，右盘 18g)</span>
                    </div>
                  )}
                  {step === 1 && (
                    <div>
                      <div><strong>第一步：</strong> x + 6 <strong style={{ color: '#dc2626' }}>- 6</strong> = 18 <strong style={{ color: '#dc2626' }}>- 6</strong> <span style={{ color: '#16a34a', fontSize: '0.9rem' }}>(依据：等式两边同时减去同一个数)</span></div>
                      <div style={{ color: '#2563eb', fontWeight: 800 }}><strong>计算结果：</strong> x = 12</div>
                      <div style={{ color: '#64748b', fontSize: '0.85rem' }}>检验：将 x = 12 代入原方程，左边 = 12 + 6 = 18，左边 = 右边，解答正确！</div>
                    </div>
                  )}
                </div>
              )}

              {presetType === 'multiply' && (
                <div style={{ fontSize: '1.05rem', lineHeight: 1.8, fontFamily: 'monospace', color: '#0f172a' }}>
                  {step === 0 && (
                    <div>
                      <strong>原方程：</strong> 3x = 24 <span style={{ color: '#64748b', fontSize: '0.9rem' }}>(左盘有 3 个 x，右盘 24g)</span>
                    </div>
                  )}
                  {step === 1 && (
                    <div>
                      <div><strong>第一步：</strong> 3x <strong style={{ color: '#dc2626' }}>÷ 3</strong> = 24 <strong style={{ color: '#dc2626' }}>÷ 3</strong> <span style={{ color: '#16a34a', fontSize: '0.9rem' }}>(依据：等式两边同时除以同一个非零数)</span></div>
                      <div style={{ color: '#2563eb', fontWeight: 800 }}><strong>计算结果：</strong> x = 8</div>
                      <div style={{ color: '#64748b', fontSize: '0.85rem' }}>检验：将 x = 8 代入原方程，左边 = 3 × 8 = 24，左边 = 右边，解答正确！</div>
                    </div>
                  )}
                </div>
              )}

              {presetType === 'composite' && (
                <div style={{ fontSize: '1.05rem', lineHeight: 1.8, fontFamily: 'monospace', color: '#0f172a' }}>
                  {step === 0 && (
                    <div>
                      <strong>原方程：</strong> 2x + 4 = 16 <span style={{ color: '#64748b', fontSize: '0.9rem' }}>(先清空零碎砝码，再处理未知数前面的倍数)</span>
                    </div>
                  )}
                  {step === 1 && (
                    <div>
                      <div><strong>第一步：</strong> 2x + 4 <strong style={{ color: '#dc2626' }}>- 4</strong> = 16 <strong style={{ color: '#dc2626' }}>- 4</strong></div>
                      <div style={{ color: '#0f172a' }}><strong>化简后：</strong> 2x = 12</div>
                    </div>
                  )}
                  {step === 2 && (
                    <div>
                      <div><strong>第二步：</strong> 2x <strong style={{ color: '#dc2626' }}>÷ 2</strong> = 12 <strong style={{ color: '#dc2626' }}>÷ 2</strong></div>
                      <div style={{ color: '#2563eb', fontWeight: 800 }}><strong>计算结果：</strong> x = 6</div>
                      <div style={{ color: '#64748b', fontSize: '0.85rem' }}>检验：左边 = 2 × 6 + 4 = 16，左边 = 右边，解答正确！</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 模式二：算术思维 vs 代数思维破局对比 */}
      {mode === 'compare' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            🚀 为什么小学一定要从“算术法”跨进“方程法”？
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
            低年级学算术，就像侦探“从案发现场往回倒推”；而高年级学方程，就像导演“顺着剧本把未知数当成已知数演出来”！
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {/* 算术思维卡片 */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1.5px solid #f87171', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: 800, marginBottom: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>🔙</span>
                <span>低年级算术思维：反向逆推法</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, marginBottom: '10px' }}>
                <strong>题目：</strong> 某数乘 3，再加上 8，结果等于 32。求这个数？
              </div>
              <div style={{ background: '#fee2e2', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', color: '#991b1b', fontFamily: 'monospace' }}>
                反向逆推：(32 - 8) ÷ 3 = 24 ÷ 3 = 8
              </div>
              <div style={{ fontSize: '0.8rem', color: '#7f1d1d', marginTop: '10px', lineHeight: 1.5 }}>
                ⚠️ <strong>局限性：</strong> 一旦遇到“鸡兔同笼”、“甲给乙 5 块两人一样多”等复杂问题，逆向倒推需要极强的抽象脑力，极其容易算晕！
              </div>
            </div>

            {/* 代数思维卡片 */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '2px solid #3b82f6', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d4ed8', fontWeight: 800, marginBottom: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>⏩</span>
                <span>高年级代数思维：正向顺叙列式</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, marginBottom: '10px' }}>
                <strong>题目：</strong> 设这个数为 x，顺着题目的每一句话写出来：
              </div>
              <div style={{ background: '#eff6ff', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', color: '#1e40af', fontFamily: 'monospace' }}>
                设这个数为 x<br />
                3x + 8 = 32<br />
                3x = 24<br />
                x = 8
              </div>
              <div style={{ fontSize: '0.8rem', color: '#1e3a8a', marginTop: '10px', lineHeight: 1.5 }}>
                ✨ <strong>革命性优势：</strong> 题意怎么说，算式就怎么写！未知数 x 就像已知数一样大摇大摆地参与运算，思维完全不需要倒着走！
              </div>
            </div>
          </div>

          <div style={{ background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', padding: '14px 18px' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', color: '#1e40af' }}>
              📌 解方程家长口诀三部曲：
            </h4>
            <div style={{ fontSize: '0.875rem', color: '#1e3a8a', lineHeight: 1.6 }}>
              1. <strong>设未知数：</strong> “设要求的量为 x”；<br />
              2. <strong>找等量关系：</strong> “天平左边等于天平右边，顺着题意列出等式”；<br />
              3. <strong>天平消元：</strong> “两边同加减、两边同乘除，等号上下要对齐，最后代入验一验！”
            </div>
          </div>
        </div>
      )}

      {/* 模式三：解方程易错考点闯关 */}
      {mode === 'quiz' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.05rem' }}>
              第 {quizIndex + 1} 题 / 共 {QUIZ_QUESTIONS.length} 题
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>简易方程与天平性质速测</span>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #cbd5e1', marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#0f172a', lineHeight: 1.5 }}>
              {QUIZ_QUESTIONS[quizIndex].question}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUIZ_QUESTIONS[quizIndex].options.map((opt, idx) => {
                let borderCol = '#cbd5e1';
                let bgCol = '#ffffff';
                if (selectedOpt === idx) {
                  borderCol = '#2563eb';
                  bgCol = '#eff6ff';
                }
                if (quizSubmitted) {
                  if (idx === QUIZ_QUESTIONS[quizIndex].correctIndex) {
                    borderCol = '#16a34a';
                    bgCol = '#dcfce7';
                  } else if (selectedOpt === idx) {
                    borderCol = '#dc2626';
                    bgCol = '#fee2e2';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!quizSubmitted) setSelectedOpt(idx);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: `1.5px solid ${borderCol}`,
                      background: bgCol,
                      fontSize: '0.9rem',
                      color: '#1e293b',
                      cursor: quizSubmitted ? 'default' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontWeight: 700, marginRight: '8px' }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                className={styles.primaryBtn}
                onClick={() => {
                  if (selectedOpt !== null) setQuizSubmitted(true);
                }}
                disabled={selectedOpt === null}
                style={{ marginTop: '16px', width: '100%', padding: '10px' }}
              >
                提交验证答案
              </button>
            ) : (
              <div style={{ marginTop: '16px', padding: '14px', borderRadius: '8px', background: selectedOpt === QUIZ_QUESTIONS[quizIndex].correctIndex ? '#f0fdf4' : '#fef2f2', border: '1px solid', borderColor: selectedOpt === QUIZ_QUESTIONS[quizIndex].correctIndex ? '#86efac' : '#fca5a5' }}>
                <div style={{ fontWeight: 800, color: selectedOpt === QUIZ_QUESTIONS[quizIndex].correctIndex ? '#15803d' : '#b91c1c', marginBottom: '6px' }}>
                  {selectedOpt === QUIZ_QUESTIONS[quizIndex].correctIndex ? '🎉 回答完全正确！' : '❌ 没答对，别灰心，看看解析：'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                  {QUIZ_QUESTIONS[quizIndex].explanation}
                </div>
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className={styles.secondaryBtn}
                    onClick={() => {
                      if (quizIndex < QUIZ_QUESTIONS.length - 1) {
                        setQuizIndex(quizIndex + 1);
                        setSelectedOpt(null);
                        setQuizSubmitted(false);
                      } else {
                        setQuizIndex(0);
                        setSelectedOpt(null);
                        setQuizSubmitted(false);
                      }
                    }}
                  >
                    {quizIndex < QUIZ_QUESTIONS.length - 1 ? '下一题 ➔' : '重新挑战全部题目'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
