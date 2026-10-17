'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Play, RotateCcw, CheckCircle2, Layers } from 'lucide-react';
import styles from '@/styles/animations.module.css';

export default function TenFrameLab() {
  const [mode, setMode] = useState<'makeTen' | 'breakTen'>('makeTen'); // makeTen: 凑十法 (9+4), breakTen: 破十法 (15-9)
  const [step, setStep] = useState<number>(0); // 0: 初始题目, 1: 拆分, 2: 移位/划掉, 3: 得出最终答案

  // 凑十法参数（以 9 + 4 为例，也可切换为 8 + 5）
  const [makeTenA, setMakeTenA] = useState<number>(9);
  const [makeTenB, setMakeTenB] = useState<number>(4);
  const neededForTen = 10 - makeTenA;
  const remainingB = makeTenB - neededForTen;

  // 破十法参数（以 15 - 9 为例）
  const [breakTotal, setBreakTotal] = useState<number>(15);
  const [breakMinus, setBreakMinus] = useState<number>(9);
  const breakUnits = breakTotal - 10; // 散装的 5 个
  const breakTenRemaining = 10 - breakMinus; // 10 减去 9 剩下的 1
  const breakResult = breakTenRemaining + breakUnits; // 1 + 5 = 6

  const handleNextStep = () => {
    setStep((prev) => (prev < 3 ? prev + 1 : 0));
  };

  const handleReset = () => {
    setStep(0);
  };

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Sparkles size={18} color="#2563eb" />
          <span>十格阵实验室：凑十与破十的“整盒思维”</span>
        </div>
        <div className={styles.labControls}>
          <button
            className={`${styles.controlBtn} ${mode === 'makeTen' ? styles.controlBtnActive : ''}`}
            onClick={() => {
              setMode('makeTen');
              setStep(0);
            }}
          >
            <Layers size={14} />
            <span>凑十法 (加法 9+4)</span>
          </button>
          <button
            className={`${styles.controlBtn} ${mode === 'breakTen' ? styles.controlBtnActive : ''}`}
            onClick={() => {
              setMode('breakTen');
              setStep(0);
            }}
          >
            <Layers size={14} />
            <span>破十法 (减法 15-9)</span>
          </button>
        </div>
      </div>

      {/* 核心 SVG 十格阵实验工作台 */}
      <div className={styles.canvasWrapper} style={{ minHeight: '430px', padding: '10px' }}>
        <svg viewBox="0 0 720 380" width="100%" height="380" style={{ maxWidth: '720px' }}>
          <defs>
            {/* 蓝色球质感 */}
            <radialGradient id="blueBall" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </radialGradient>
            {/* 黄色球质感 */}
            <radialGradient id="orangeBall" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
            {/* 划掉灰色球 */}
            <radialGradient id="grayBall" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </radialGradient>
          </defs>

          {mode === 'makeTen' ? (
            /* =================== 模式一：凑十法 (9 + 4 = 13) =================== */
            <g transform="translate(40, 40)">
              {/* 标题与题目大字 */}
              <text x="320" y="24" textAnchor="middle" fontSize="24" fontWeight="800" fill="#0f172a">
                {makeTenA} + {makeTenB} = ?
                {step === 3 && (
                  <tspan fill="#2563eb" dx="10">
                    = 13
                  </tspan>
                )}
              </text>

              {/* 左侧：十格阵大盒子 (2行5列) */}
              <g transform="translate(60, 60)">
                <text x="125" y="-12" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2563eb">
                  十格阵盒子（放满正好是 10）
                </text>
                {/* 盒子背景底座 */}
                <rect x="0" y="0" width="250" height="104" rx="8" fill="#f8fafc" stroke="#3b82f6" strokeWidth="2.5" />
                {/* 10 个格子 */}
                {Array.from({ length: 10 }).map((_, i) => {
                  const col = i % 5;
                  const row = Math.floor(i / 5);
                  const isBorrowedSlot = i === 9; // 第 10 个格子，用来等待右边借过来的球
                  return (
                    <g key={i}>
                      <rect
                        x={col * 50}
                        y={row * 52}
                        width="50"
                        height="52"
                        fill={isBorrowedSlot && step >= 2 ? '#dbeafe' : 'none'}
                        stroke="#bfdbfe"
                        strokeWidth="1.5"
                      />
                      {/* 前 9 个格子放原始的蓝色球 */}
                      {i < makeTenA && (
                        <circle cx={col * 50 + 25} cy={row * 52 + 26} r="18" fill="url(#blueBall)" />
                      )}
                      {/* 第 10 个格子：如果到了第 2 步，右边的黄色球飞过来！ */}
                      {isBorrowedSlot && step >= 2 && (
                        <g>
                          <circle cx={col * 50 + 25} cy={row * 52 + 26} r="18" fill="url(#orangeBall)" />
                          <circle cx={col * 50 + 25} cy={row * 52 + 26} r="22" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* 满十徽章 */}
                {step >= 2 && (
                  <g transform="translate(65, 115)">
                    <rect x="0" y="0" width="120" height="26" rx="13" fill="#2563eb" />
                    <text x="60" y="18" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">
                      ★ 刚好凑满 10！
                    </text>
                  </g>
                )}
              </g>

              {/* 中间的借位箭头动画 */}
              {step >= 1 && (
                <g transform="translate(325, 110)">
                  <path d="M 90 -20 Q 30 -40 -10 -2" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 4" />
                  <polygon points="-12,-2 -5,-8 -4,5" fill="#f59e0b" />
                  <text x="40" y="-35" textAnchor="middle" fill="#b45309" fontSize="12" fontWeight="800">
                    借 1 颗凑十
                  </text>
                </g>
              )}

              {/* 右侧：散装的 4 颗黄色球 */}
              <g transform="translate(430, 60)">
                <text x="80" y="-12" textAnchor="middle" fontSize="13" fontWeight="700" fill="#b45309">
                  {step >= 1 ? `散装 4 拆成 1 和 3` : `散装的 4 颗`}
                </text>
                <rect x="0" y="0" width="160" height="104" rx="8" fill="#fffbeb" stroke="#fde68a" strokeWidth="2" />

                {/* 如果 step === 0：完整 4 颗 */}
                {step === 0 && (
                  <g>
                    {[0, 1, 2, 3].map((idx) => (
                      <circle key={idx} cx={25 + (idx % 2) * 50} cy={26 + Math.floor(idx / 2) * 52} r="18" fill="url(#orangeBall)" />
                    ))}
                  </g>
                )}

                {/* 如果 step === 1：被拆成 1 颗 和 剩下的 3 颗 */}
                {step === 1 && (
                  <g>
                    {/* 借出的 1 颗高亮 */}
                    <circle cx="35" cy="52" r="18" fill="url(#orangeBall)" stroke="#ef4444" strokeWidth="3" />
                    <text x="35" y="86" textAnchor="middle" fill="#dc2626" fontSize="11" fontWeight="800">去凑十</text>

                    {/* 剩下的 3 颗 */}
                    <circle cx="85" cy="30" r="16" fill="url(#orangeBall)" />
                    <circle cx="125" cy="30" r="16" fill="url(#orangeBall)" />
                    <circle cx="105" cy="74" r="16" fill="url(#orangeBall)" />
                    <text x="105" y="98" textAnchor="middle" fill="#b45309" fontSize="11" fontWeight="700">还剩 3 颗</text>
                  </g>
                )}

                {/* 如果 step >= 2：借走后只剩下 3 颗 */}
                {step >= 2 && (
                  <g>
                    <circle cx="45" cy="52" r="18" fill="url(#orangeBall)" />
                    <circle cx="90" cy="52" r="18" fill="url(#orangeBall)" />
                    <circle cx="135" cy="52" r="18" fill="url(#orangeBall)" />
                    <text x="80" y="90" textAnchor="middle" fill="#b45309" fontSize="13" fontWeight="800">
                      剩下 3 颗
                    </text>
                  </g>
                )}
              </g>

              {/* 下方：树状思维推导图 */}
              <g transform="translate(180, 210)">
                <rect x="0" y="0" width="300" height="85" rx="10" fill="#ffffff" stroke="#e2e8f0" />
                <text x="20" y="26" fontSize="12" fill="#64748b" fontWeight="600">三步计算法口诀：</text>
                <text x="20" y="48" fontSize="14" fill="#0f172a" fontWeight="700">
                  ① 4 拆成 1 和 3 （因为 9 + 1 = 10）
                </text>
                <text x="20" y="70" fontSize="15" fill={step === 3 ? '#2563eb' : '#475569'} fontWeight="800">
                  ② 10 加上剩下的 3 = 13！
                </text>
              </g>
            </g>
          ) : (
            /* =================== 模式二：破十法 (15 - 9 = 6) =================== */
            <g transform="translate(40, 40)">
              {/* 标题与题目大字 */}
              <text x="320" y="24" textAnchor="middle" fontSize="24" fontWeight="800" fill="#0f172a">
                {breakTotal} - {breakMinus} = ?
                {step === 3 && (
                  <tspan fill="#2563eb" dx="10">
                    = 6
                  </tspan>
                )}
              </text>

              {/* 左侧：整盒 10 颗 */}
              <g transform="translate(60, 60)">
                <text x="125" y="-12" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2563eb">
                  整盒 10 颗（先动整盒，不要拆散装）
                </text>
                <rect x="0" y="0" width="250" height="104" rx="8" fill="#f8fafc" stroke="#3b82f6" strokeWidth="2.5" />
                
                {Array.from({ length: 10 }).map((_, i) => {
                  const col = i % 5;
                  const row = Math.floor(i / 5);
                  const isCrossed = step >= 2 && i < breakMinus; // 划掉 9 颗
                  const isRemaining = i === 9; // 剩下的那 1 颗

                  return (
                    <g key={i}>
                      <rect x={col * 50} y={row * 52} width="50" height="52" fill="none" stroke="#bfdbfe" strokeWidth="1.5" />
                      <circle
                        cx={col * 50 + 25}
                        cy={row * 52 + 26}
                        r="18"
                        fill={isCrossed ? 'url(#grayBall)' : isRemaining && step >= 2 ? '#fbbf24' : 'url(#blueBall)'}
                        opacity={isCrossed ? 0.35 : 1}
                      />
                      {/* 如果划掉，画一个红色大红叉 */}
                      {isCrossed && (
                        <g stroke="#ef4444" strokeWidth="3" strokeLinecap="round">
                          <line x1={col * 50 + 15} y1={row * 52 + 16} x2={col * 50 + 35} y2={row * 52 + 36} />
                          <line x1={col * 50 + 35} y1={row * 52 + 16} x2={col * 50 + 15} y2={row * 52 + 36} />
                        </g>
                      )}
                    </g>
                  );
                })}

                {step >= 2 && (
                  <g transform="translate(60, 115)">
                    <rect x="0" y="0" width="130" height="26" rx="13" fill="#fee2e2" />
                    <text x="65" y="18" textAnchor="middle" fill="#991b1b" fontSize="12" fontWeight="700">
                      10 - 9 = 剩下 1 颗！
                    </text>
                  </g>
                )}
              </g>

              {/* 右侧：散装的 5 颗 */}
              <g transform="translate(420, 60)">
                <text x="75" y="-12" textAnchor="middle" fontSize="13" fontWeight="700" fill="#059669">
                  散装 5 颗（别动它）
                </text>
                <rect x="0" y="0" width="150" height="104" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
                {[0, 1, 2, 3, 4].map((idx) => (
                  <circle
                    key={idx}
                    cx={30 + (idx % 3) * 45}
                    cy={28 + Math.floor(idx / 3) * 48}
                    r="16"
                    fill="url(#blueBall)"
                  />
                ))}
              </g>

              {/* 下方：合并汇合推导 */}
              <g transform="translate(180, 215)">
                <rect x="0" y="0" width="310" height="85" rx="10" fill="#ffffff" stroke="#e2e8f0" />
                <text x="20" y="26" fontSize="12" fill="#64748b" fontWeight="600">破十法两步走：</text>
                <text x="20" y="48" fontSize="14" fill="#0f172a" fontWeight="700">
                  ① 10 先减去 9 = 剩下 1 颗
                </text>
                <text x="20" y="70" fontSize="15" fill={step === 3 ? '#16a34a' : '#475569'} fontWeight="800">
                  ② 剩下的 1 颗 + 散装 5 颗 = 6 颗！
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* 底部步骤步进控制栏 */}
      <div className={styles.sliderPanel}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-primary" onClick={handleNextStep}>
            <Play size={15} />
            <span>
              {step === 0 && '开始第 1 步：拆解数字'}
              {step === 1 && (mode === 'makeTen' ? '第 2 步：吸附借位凑整十' : '第 2 步：整盒划掉扣除')}
              {step === 2 && '第 3 步：合并得出答案'}
              {step === 3 && '重新演示'}
            </span>
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            <RotateCcw size={14} />
            <span>复位</span>
          </button>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
          💡 阶段：第 {step + 1} 步 / 共 4 步 ·{' '}
          {mode === 'makeTen'
            ? '“看大数，分小数，凑成十，加剩数”'
            : '“整盒先动，散装不动；十减九剩一，一再加个位”'}
        </div>
      </div>
    </div>
  );
}
