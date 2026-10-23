'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Play, Pause, RotateCcw, CheckCircle2, Layers, ChevronRight } from 'lucide-react';
import styles from '@/styles/animations.module.css';

interface MakeTenPreset {
  a: number;
  b: number;
  label: string;
}

interface BreakTenPreset {
  total: number;
  minus: number;
  label: string;
}

const MAKE_TEN_PRESETS: MakeTenPreset[] = [
  { a: 9, b: 4, label: '9 + 4 = 13 (借 1 凑十)' },
  { a: 8, b: 5, label: '8 + 5 = 13 (借 2 凑十)' },
  { a: 7, b: 6, label: '7 + 6 = 13 (借 3 凑十)' },
  { a: 9, b: 7, label: '9 + 7 = 16 (借 1 凑十)' },
];

const BREAK_TEN_PRESETS: BreakTenPreset[] = [
  { total: 15, minus: 9, label: '15 - 9 = 6 (整盒剩 1 + 5)' },
  { total: 14, minus: 8, label: '14 - 8 = 6 (整盒剩 2 + 4)' },
  { total: 13, minus: 7, label: '13 - 7 = 6 (整盒剩 3 + 3)' },
  { total: 16, minus: 9, label: '16 - 9 = 7 (整盒剩 1 + 6)' },
];

export default function TenFrameLab() {
  const [mode, setMode] = useState<'makeTen' | 'breakTen'>('makeTen');
  const [step, setStep] = useState<number>(0); // 0: 观察原题, 1: 拆分, 2: 移位/划掉, 3: 归纳得出结论
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // 凑十法参数
  const [makeTenIndex, setMakeTenIndex] = useState<number>(0);
  const currentMakeTen = MAKE_TEN_PRESETS[makeTenIndex];
  const makeTenA = currentMakeTen.a;
  const makeTenB = currentMakeTen.b;
  const neededForTen = 10 - makeTenA;
  const remainingB = makeTenB - neededForTen;
  const makeTenResult = 10 + remainingB;

  // 破十法参数
  const [breakTenIndex, setBreakTenIndex] = useState<number>(0);
  const currentBreakTen = BREAK_TEN_PRESETS[breakTenIndex];
  const breakTotal = currentBreakTen.total;
  const breakMinus = currentBreakTen.minus;
  const breakUnits = breakTotal - 10; // 散装个位
  const breakTenRemaining = 10 - breakMinus; // 整盒 10 减去减数剩下的
  const breakResult = breakTenRemaining + breakUnits;

  // 自动播放推导演示
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (step < 3) {
        timer = setTimeout(() => {
          setStep((prev) => prev + 1);
        }, 1600);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  const handleNextStep = () => {
    setIsPlaying(false);
    setStep((prev) => (prev < 3 ? prev + 1 : 0));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStep(0);
  };

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Sparkles size={18} color="#2563eb" />
          <span>十格阵实验室：凑十法与破十法的整盒思维</span>
          <span className="badge badge-blue">一年级数学20以内进退位</span>
        </div>
        <div className={styles.labControls}>
          <button
            className={`${styles.controlBtn} ${mode === 'makeTen' ? styles.controlBtnActive : ''}`}
            onClick={() => {
              setMode('makeTen');
              setStep(0);
              setIsPlaying(false);
            }}
          >
            <Layers size={14} />
            <span>进位加：凑十法</span>
          </button>
          <button
            className={`${styles.controlBtn} ${mode === 'breakTen' ? styles.controlBtnActive : ''}`}
            onClick={() => {
              setMode('breakTen');
              setStep(0);
              setIsPlaying(false);
            }}
          >
            <Layers size={14} />
            <span>退位减：破十法</span>
          </button>
        </div>
      </div>

      {/* 核心 SVG 十格阵实验工作台 */}
      <div className={styles.canvasWrapper} style={{ minHeight: '430px', padding: '16px' }}>
        <svg viewBox="0 0 720 370" width="100%" height="370" style={{ maxWidth: '720px' }}>
          <defs>
            {/* 蓝色球质感 (大数) */}
            <radialGradient id="blueBall" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </radialGradient>
            {/* 黄色球质感 (借出/拆分数) */}
            <radialGradient id="orangeBall" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
            {/* 绿色球质感 (凑满后的成功球) */}
            <radialGradient id="greenBall" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>
            {/* 划掉灰色球 */}
            <radialGradient id="grayBall" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </radialGradient>
          </defs>

          {mode === 'makeTen' ? (
            /* =================== 模式一：凑十法 =================== */
            <g transform="translate(40, 25)">
              {/* 标题与题目大字 */}
              <text x="320" y="24" textAnchor="middle" fontSize="26" fontWeight="900" fill="#0f172a" fontFamily="var(--font-mono)">
                <tspan fill="#2563eb">{makeTenA}</tspan> + <tspan fill="#ea580c">{makeTenB}</tspan> = ?
                {step === 3 && (
                  <tspan fill="#16a34a" dx="12">
                    = {makeTenResult}
                  </tspan>
                )}
              </text>

              {/* 步骤提示横幅 */}
              <rect x="170" y="38" width="300" height="26" rx="13" fill="#eff6ff" stroke="#bfdbfe" />
              <text x="320" y="55" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1e40af">
                {step === 0 && `① 观察：${makeTenA} 差 ${neededForTen} 颗就能放满整盒 10！`}
                {step === 1 && `② 拆分：把 ${makeTenB} 拆成 ${neededForTen} 和 ${remainingB}！`}
                {step === 2 && `③ 飞入：借来的 ${neededForTen} 颗封盒，盒内正好凑满 10！`}
                {step === 3 && `④ 得数：10 加上剩下的 ${remainingB} = ${makeTenResult}！`}
              </text>

              {/* 左侧：十格阵大盒子 (2行5列) */}
              <g transform="translate(60, 80)">
                <text x="125" y="-12" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2563eb">
                  十格阵盒子（放满整整齐齐正好是 10）
                </text>
                {/* 盒子背景底座 */}
                <rect 
                  x="0" 
                  y="0" 
                  width="250" 
                  height="104" 
                  rx="10" 
                  fill={step >= 2 ? '#f0fdf4' : '#f8fafc'} 
                  stroke={step >= 2 ? '#10b981' : '#3b82f6'} 
                  strokeWidth="2.5" 
                />
                
                {/* 10 个格子 */}
                {Array.from({ length: 10 }).map((_, i) => {
                  const col = i % 5;
                  const row = Math.floor(i / 5);
                  const isBorrowedSlot = i >= makeTenA; // 需要借进来的格子

                  return (
                    <g key={i}>
                      <rect
                        x={col * 50}
                        y={row * 52}
                        width="50"
                        height="52"
                        fill={isBorrowedSlot && step >= 2 ? '#fef3c7' : 'none'}
                        stroke="#bfdbfe"
                        strokeWidth="1.5"
                      />
                      {/* 前 makeTenA 个格子放原始的蓝色球 */}
                      {i < makeTenA && (
                        <circle cx={col * 50 + 25} cy={row * 52 + 26} r="18" fill="url(#blueBall)" />
                      )}
                      {/* 借过来的格子：在 step >= 2 时飞入橙色球 */}
                      {isBorrowedSlot && step >= 2 && (
                        <g>
                          <circle cx={col * 50 + 25} cy={row * 52 + 26} r="18" fill="url(#orangeBall)" />
                          <circle cx={col * 50 + 25} cy={row * 52 + 26} r="21" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* 满十徽章 */}
                {step >= 2 && (
                  <g transform="translate(65, 115)">
                    <rect x="0" y="0" width="120" height="26" rx="13" fill="#16a34a" />
                    <text x="60" y="18" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">
                      ★ 整盒封箱：满 10！
                    </text>
                  </g>
                )}
              </g>

              {/* 中间的借位箭头动画 */}
              {step >= 1 && (
                <g transform="translate(325, 130)">
                  <path d="M 85 -20 Q 30 -45 -10 -5" fill="none" stroke="#ea580c" strokeWidth="3" strokeDasharray="4 4" />
                  <polygon points="-12,-5 -5,-11 -4,3" fill="#ea580c" />
                  <rect x="10" y="-55" width="70" height="22" rx="6" fill="#fff7ed" stroke="#fed7aa" />
                  <text x="45" y="-40" textAnchor="middle" fill="#c2410c" fontSize="11" fontWeight="800">
                    借 {neededForTen} 凑十
                  </text>
                </g>
              )}

              {/* 右侧：散装的 makeTenB 颗球 */}
              <g transform="translate(425, 80)">
                <text x="85" y="-12" textAnchor="middle" fontSize="13" fontWeight="700" fill="#b45309">
                  {step >= 1 ? `散装 ${makeTenB} 拆成 ${neededForTen} 和 ${remainingB}` : `散装的 ${makeTenB} 颗球`}
                </text>
                <rect x="0" y="0" width="170" height="104" rx="10" fill="#fffbeb" stroke="#fde68a" strokeWidth="2" />

                {/* step === 0：完整展示 makeTenB 颗球 */}
                {step === 0 && (
                  <g>
                    {Array.from({ length: makeTenB }).map((_, idx) => {
                      const col = idx % 3;
                      const row = Math.floor(idx / 3);
                      return (
                        <circle key={idx} cx={28 + col * 45} cy={28 + row * 45} r="16" fill="url(#orangeBall)" />
                      );
                    })}
                  </g>
                )}

                {/* step === 1：拆成 neededForTen 颗(准备借出) 和 remainingB 颗(留下) */}
                {step === 1 && (
                  <g>
                    {/* 借出的球(红圈高亮) */}
                    {Array.from({ length: neededForTen }).map((_, idx) => (
                      <g key={`borrow-${idx}`}>
                        <circle cx={30} cy={30 + idx * 45} r="16" fill="url(#orangeBall)" stroke="#ef4444" strokeWidth="2.5" />
                        <text x={30} y={34 + idx * 45} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">凑</text>
                      </g>
                    ))}

                    {/* 剩下的球 */}
                    {Array.from({ length: remainingB }).map((_, idx) => {
                      const col = idx % 2;
                      const row = Math.floor(idx / 2);
                      return (
                        <circle key={`remain-${idx}`} cx={85 + col * 40} cy={30 + row * 45} r="15" fill="url(#orangeBall)" />
                      );
                    })}
                    <text x="120" y="94" textAnchor="middle" fill="#b45309" fontSize="11" fontWeight="700">
                      还剩 {remainingB} 颗
                    </text>
                  </g>
                )}

                {/* step >= 2：借走后只剩下 remainingB 颗 */}
                {step >= 2 && (
                  <g>
                    {Array.from({ length: remainingB }).map((_, idx) => {
                      const col = idx % 3;
                      const row = Math.floor(idx / 3);
                      return (
                        <circle key={`remain2-${idx}`} cx={32 + col * 45} cy={32 + row * 45} r="16" fill="url(#orangeBall)" />
                      );
                    })}
                    <text x="85" y="92" textAnchor="middle" fill="#b45309" fontSize="13" fontWeight="800">
                      剩下 {remainingB} 颗
                    </text>
                  </g>
                )}
              </g>

              {/* 下方：树状思维推导图 */}
              <g transform="translate(180, 230)">
                <rect x="0" y="0" width="300" height="85" rx="10" fill="#ffffff" stroke="#e2e8f0" />
                <text x="20" y="24" fontSize="12" fill="#64748b" fontWeight="600">三步计算法思维路径：</text>
                <text x="20" y="46" fontSize="14" fill="#0f172a" fontWeight="700">
                  ① 把 <tspan fill="#ea580c">{makeTenB}</tspan> 拆成 <tspan fill="#dc2626">{neededForTen}</tspan> 和 <tspan fill="#b45309">{remainingB}</tspan> （因为 {makeTenA} + {neededForTen} = 10）
                </text>
                <text x="20" y="70" fontSize="15" fill={step === 3 ? '#16a34a' : '#475569'} fontWeight="800">
                  ② 10 加上剩下的 {remainingB} = {makeTenResult}！
                </text>
              </g>
            </g>
          ) : (
            /* =================== 模式二：破十法 =================== */
            <g transform="translate(40, 25)">
              {/* 标题与题目大字 */}
              <text x="320" y="24" textAnchor="middle" fontSize="26" fontWeight="900" fill="#0f172a" fontFamily="var(--font-mono)">
                <tspan fill="#2563eb">{breakTotal}</tspan> - <tspan fill="#dc2626">{breakMinus}</tspan> = ?
                {step === 3 && (
                  <tspan fill="#16a34a" dx="12">
                    = {breakResult}
                  </tspan>
                )}
              </text>

              {/* 步骤提示横幅 */}
              <rect x="170" y="38" width="300" height="26" rx="13" fill="#fdf2f8" stroke="#fbcfe8" />
              <text x="320" y="55" textAnchor="middle" fontSize="12" fontWeight="700" fill="#be185d">
                {step === 0 && `① 观察：散装只有 ${breakUnits} 瓶，不够减 ${breakMinus}！`}
                {step === 1 && `② 拆开：把 ${breakTotal} 拆成整盒 10 和散装 ${breakUnits}！`}
                {step === 2 && `③ 破十：从整盒 10 里面直接拿走 ${breakMinus} 瓶，剩下 ${breakTenRemaining} 瓶！`}
                {step === 3 && `④ 合并：盒里剩下的 ${breakTenRemaining} + 外面散装 ${breakUnits} = ${breakResult} 瓶！`}
              </text>

              {/* 左侧：整盒 10 颗 */}
              <g transform="translate(60, 80)">
                <text x="125" y="-12" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2563eb">
                  整盒 10 瓶（先破整盒，散装先别动）
                </text>
                <rect x="0" y="0" width="250" height="104" rx="10" fill="#f8fafc" stroke="#3b82f6" strokeWidth="2.5" />
                
                {Array.from({ length: 10 }).map((_, i) => {
                  const col = i % 5;
                  const row = Math.floor(i / 5);
                  const isCrossed = step >= 2 && i < breakMinus; // 划掉的
                  const isRemaining = i >= breakMinus; // 剩下的

                  return (
                    <g key={i}>
                      <rect x={col * 50} y={row * 52} width="50" height="52" fill="none" stroke="#bfdbfe" strokeWidth="1.5" />
                      <circle
                        cx={col * 50 + 25}
                        cy={row * 52 + 26}
                        r="18"
                        fill={isCrossed ? 'url(#grayBall)' : isRemaining && step >= 2 ? 'url(#greenBall)' : 'url(#blueBall)'}
                        opacity={isCrossed ? 0.35 : 1}
                      />
                      {/* 划掉的大红叉 */}
                      {isCrossed && (
                        <g stroke="#ef4444" strokeWidth="3" strokeLinecap="round">
                          <line x1={col * 50 + 15} y1={row * 52 + 16} x2={col * 50 + 35} y2={row * 52 + 36} />
                          <line x1={col * 50 + 35} y1={row * 52 + 16} x2={col * 50 + 15} y2={row * 52 + 36} />
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* 盒内剩余标注 */}
                {step >= 2 && (
                  <g transform="translate(55, 115)">
                    <rect x="0" y="0" width="140" height="26" rx="13" fill="#16a34a" />
                    <text x="70" y="18" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">
                      10 减 {breakMinus} 盒内剩 {breakTenRemaining} 瓶！
                    </text>
                  </g>
                )}
              </g>

              {/* 中间的合并加号 */}
              {step >= 2 && (
                <g transform="translate(340, 130)">
                  <circle cx="15" cy="0" r="16" fill="#10b981" />
                  <text x="15" y="7" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="900">
                    +
                  </text>
                  <text x="15" y="28" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="800">
                    散装合拢
                  </text>
                </g>
              )}

              {/* 右侧：散装的 breakUnits 瓶 */}
              <g transform="translate(425, 80)">
                <text x="85" y="-12" textAnchor="middle" fontSize="13" fontWeight="700" fill="#b45309">
                  散装的 {breakUnits} 瓶（原封不动）
                </text>
                <rect x="0" y="0" width="170" height="104" rx="10" fill="#fffbeb" stroke="#fde68a" strokeWidth="2" />
                
                {Array.from({ length: breakUnits }).map((_, idx) => {
                  const col = idx % 3;
                  const row = Math.floor(idx / 3);
                  return (
                    <circle key={idx} cx={32 + col * 45} cy={32 + row * 45} r="16" fill="url(#orangeBall)" />
                  );
                })}
              </g>

              {/* 下方：树状思维推导图 */}
              <g transform="translate(180, 230)">
                <rect x="0" y="0" width="300" height="85" rx="10" fill="#ffffff" stroke="#e2e8f0" />
                <text x="20" y="24" fontSize="12" fill="#64748b" fontWeight="600">三步计算法思维路径：</text>
                <text x="20" y="46" fontSize="14" fill="#0f172a" fontWeight="700">
                  ① 10 减 <tspan fill="#dc2626">{breakMinus}</tspan> = <tspan fill="#16a34a">{breakTenRemaining}</tspan>（整盒扣除）
                </text>
                <text x="20" y="70" fontSize="15" fill={step === 3 ? '#16a34a' : '#475569'} fontWeight="800">
                  ② {breakTenRemaining} 加上散装的 {breakUnits} = {breakResult} 瓶！
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* 底部控制台与快捷题型预设 */}
      <div className={styles.sliderPanel}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
          {/* 经典预设题切换 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b' }}>切换经典题型：</span>
            {mode === 'makeTen'
              ? MAKE_TEN_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    className={`${styles.controlBtn} ${makeTenIndex === idx ? styles.controlBtnActive : ''}`}
                    onClick={() => {
                      setMakeTenIndex(idx);
                      setStep(0);
                      setIsPlaying(false);
                    }}
                    style={{ fontSize: '0.78rem' }}
                  >
                    {p.label}
                  </button>
                ))
              : BREAK_TEN_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    className={`${styles.controlBtn} ${breakTenIndex === idx ? styles.controlBtnActive : ''}`}
                    onClick={() => {
                      setBreakTenIndex(idx);
                      setStep(0);
                      setIsPlaying(false);
                    }}
                    style={{ fontSize: '0.78rem' }}
                  >
                    {p.label}
                  </button>
                ))}
          </div>

          {/* 步骤控制器 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (step >= 3) setStep(0);
                  setIsPlaying(!isPlaying);
                }}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                <span>{isPlaying ? '暂停' : step === 0 ? '一键自动演示' : '继续自动演示'}</span>
              </button>

              <button
                className="btn btn-secondary"
                onClick={handleNextStep}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <span>下一步 (步骤 {step + 1} / 4)</span>
                <ChevronRight size={14} />
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

            {/* 步骤进度胶囊 */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['观察题目', '拆分好朋友', '凑十/破十', '得出结论'].map((title, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: step === idx ? 'var(--color-primary)' : '#f1f5f9',
                    color: step === idx ? '#ffffff' : '#64748b',
                    fontWeight: 600,
                  }}
                >
                  {idx + 1}. {title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
