'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/animations.module.css';

type Mode = 'simulation' | 'division' | 'quiz';

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
    question: '一块牧场每天草都在匀速生长。10 头牛 20 天吃完，15 头牛 10 天吃完。草每天生长多少份？（设每头牛每天吃 1 份草）',
    options: ['5 份/天', '10 份/天', '2.5 份/天', '8 份/天'],
    correctIndex: 0,
    explanation: '10 头牛 20 天总共吃 10×20 = 200 份；15 头牛 10 天总共吃 15×10 = 150 份。20 天比 10 天多吃了 200 - 150 = 50 份，这 50 份就是草在多出来的 10 天里长出来的！每天生长速度 = 50 ÷ (20 - 10) = 5 份/天！'
  },
  {
    id: 2,
    question: '接上一题：这片牧场原先积存了多少份老草？如果要放 25 头牛，几天可以吃完？',
    options: [
      '原有 100 份，25 头牛 5 天吃完',
      '原有 150 份，25 头牛 6 天吃完',
      '原有 100 份，25 头牛 4 天吃完',
      '原有 200 份，25 头牛 8 天吃完'
    ],
    correctIndex: 0,
    explanation: '原有草量 = 20天吃总量 - 20天新长草量 = 200 - 5×20 = 100 份。25 头牛来吃，先派 5 头去专吃每天新长的 5 份草，剩下 20 头专啃原有老草：100 ÷ (25 - 5) = 5 天！'
  },
  {
    id: 3,
    question: '【高频拓展·水库抽水】水库原有一定蓄水，且山上有泉水匀速涌入。开 6 台抽水机 10 小时抽干，开 8 台抽水机 6 小时抽干。若要永远抽不干（达到平衡），最多开几台抽水机？',
    options: ['3 台', '4 台', '2 台', '5 台'],
    correctIndex: 0,
    explanation: '6×10 = 60 份，8×6 = 48 份。每小时泉水涌入量 = (60 - 48) ÷ (10 - 6) = 12 ÷ 4 = 3 份/小时。只要抽水速度 ≤ 涌入速度（即开 3 台或更少），抽出的水全部由新涌入的泉水补充，水库永远抽不干！'
  }
];

export default function NewtonCowPastureLab() {
  const [mode, setMode] = useState<Mode>('simulation');

  // 牧场基本模型参数（标准设定：原存草 Y=100，每天新长 x=5，每牛吃 1）
  const initialGrass = 100; // 原有老草储备
  const growthRate = 5; // 每天新生草量
  const [cowCount, setCowCount] = useState<number>(10); // 当前放养牛头数

  // 模拟演化状态
  const [day, setDay] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const animRef = useRef<NodeJS.Timeout | null>(null);

  // 测验状态
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // 理论计算指标
  // 净消耗率 = cowCount - growthRate
  const netRate = cowCount - growthRate;
  // 吃完所需天数（若 netRate <= 0 则吃不完）
  const finishDays = netRate > 0 ? initialGrass / netRate : Infinity;

  // 当前天数的实时数据
  const currentTotalGrown = day * growthRate;
  const currentTotalEaten = day * cowCount;
  const currentRemaining = Math.max(0, initialGrass + currentTotalGrown - currentTotalEaten);
  const isFinished = netRate > 0 && currentRemaining <= 0;

  // 动画计时器
  useEffect(() => {
    if (isPlaying && !isFinished) {
      animRef.current = setInterval(() => {
        setDay((prev) => {
          const next = prev + 1;
          const nextRemaining = initialGrass + next * growthRate - next * cowCount;
          if (cowCount > growthRate && nextRemaining <= 0) {
            setIsPlaying(false);
            return Number(finishDays.toFixed(1));
          }
          if (next >= 40) {
            // 达到上限保护
            setIsPlaying(false);
            return 40;
          }
          return next;
        });
      }, 700);
    } else {
      if (animRef.current) clearInterval(animRef.current);
    }

    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [isPlaying, isFinished, cowCount, finishDays, growthRate, initialGrass]);

  const handleReset = () => {
    setIsPlaying(false);
    setDay(0);
  };

  const handleCowChange = (c: number) => {
    setCowCount(c);
    setDay(0);
    setIsPlaying(false);
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
      {/* 顶部模式切换选项卡 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          className={mode === 'simulation' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('simulation'); handleReset(); }}
        >
          🐄 模式一：动态牧场实时演化沙盘
        </button>
        <button
          className={mode === 'division' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('division'); handleReset(); }}
        >
          🔍 模式二：牛顿“专职分工”解剖台
        </button>
        <button
          className={mode === 'quiz' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('quiz'); handleReset(); }}
        >
          🎯 模式三：名校真题与易错变式
        </button>
      </div>

      {/* 模式一：动态牧场实时演化沙盘 */}
      {mode === 'simulation' && (
        <div>
          {/* 控制条 */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                  🐄 放养牛的头数：<span style={{ color: '#2563eb', fontSize: '1.2rem' }}>{cowCount}</span> 头
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '10px' }}>
                  (每天吃 <strong style={{ color: '#ef4444' }}>{cowCount}</strong> 份草)
                </span>
              </div>

              {/* 快捷经典场景预设 */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', alignSelf: 'center', marginRight: '4px' }}>经典预设：</span>
                {[
                  { n: 5, label: '5头 (永动机平衡)' },
                  { n: 10, label: '10头 (20天吃完)' },
                  { n: 15, label: '15头 (10天吃完)' },
                  { n: 25, label: '25头 (5天吃完)' },
                ].map((item) => (
                  <button
                    key={item.n}
                    onClick={() => handleCowChange(item.n)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: cowCount === item.n ? '#2563eb' : '#cbd5e1',
                      background: cowCount === item.n ? '#eff6ff' : '#ffffff',
                      color: cowCount === item.n ? '#1d4ed8' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 牛头数滑块 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={cowCount}
                onChange={(e) => handleCowChange(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#2563eb' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, width: '45px', color: '#334155' }}>
                {cowCount} 头
              </span>
            </div>

            {/* 播放 / 暂停 / 单步 / 重置 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }}>
              <button
                className={styles.primaryBtn}
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={isFinished}
                style={{ padding: '6px 16px', fontSize: '0.9rem' }}
              >
                {isPlaying ? '⏸ 暂停观察' : isFinished ? '🏁 牧场已被吃光' : '▶ 开始演化'}
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={() => {
                  if (!isFinished) {
                    setDay((prev) => prev + 1);
                  }
                }}
                disabled={isPlaying || isFinished}
                style={{ padding: '6px 14px', fontSize: '0.9rem' }}
              >
                ⏭ 过 1 天
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={handleReset}
                style={{ padding: '6px 14px', fontSize: '0.9rem' }}
              >
                🔄 重置回到第 0 天
              </button>

              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>演化进度：</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  第 {day} 天
                </span>
                {cowCount <= growthRate ? (
                  <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    ♾️ 永远吃不完
                  </span>
                ) : (
                  <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    预计 {finishDays} 天吃完
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 牧场实时 SVG 画布与动态草地 */}
          <div style={{ background: '#ecfdf5', borderRadius: '16px', border: '2px solid #a7f3d0', padding: '16px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>🏡</span>
                <strong style={{ color: '#065f46', fontSize: '0.95rem' }}>牛顿大牧场实时全景</strong>
              </div>
              <div style={{ fontSize: '0.825rem', color: '#047857' }}>
                每天自然长草：<strong style={{ color: '#059669' }}>+{growthRate} 份</strong> ｜ 每天牛群吃草：<strong style={{ color: '#dc2626' }}>-{cowCount} 份</strong> ｜ 净消长：
                <strong style={{ color: netRate > 0 ? '#dc2626' : '#059669' }}>
                  {netRate > 0 ? `-${netRate}` : `+${Math.abs(netRate)}`} 份/天
                </strong>
              </div>
            </div>

            <svg viewBox="0 0 800 280" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px', background: '#d1fae5' }}>
              <defs>
                <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#bae6fd" />
                  <stop offset="100%" stopColor="#f0fdf4" />
                </linearGradient>
                <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#86efac" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
                <linearGradient id="oldGrassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#166534" />
                  <stop offset="100%" stopColor="#14532d" />
                </linearGradient>
              </defs>

              {/* 蓝天远山背景 */}
              <rect x="0" y="0" width="800" height="120" fill="url(#skyGrad)" />
              {/* 远山 */}
              <path d="M 0 120 Q 180 60 360 120 T 720 120 Q 760 100 800 120 L 800 120 L 0 120 Z" fill="#99f6e4" opacity="0.6" />
              <path d="M 120 120 Q 300 75 480 120 T 800 120 L 800 120 L 120 120 Z" fill="#a7f3d0" opacity="0.7" />

              {/* 太阳 */}
              <circle cx="720" cy="45" r="24" fill="#fde047" stroke="#f59e0b" strokeWidth="2" />

              {/* 草坪地基 */}
              <rect x="0" y="120" width="800" height="160" fill="#fef3c7" />

              {/* 动态草坪高度指示 (以 100份老草为基准 50px，按当前剩余比例伸缩) */}
              {(() => {
                const grassH = Math.min(140, Math.max(8, (currentRemaining / initialGrass) * 55));
                const grassY = 270 - grassH;
                return (
                  <g>
                    {/* 老草层 (底部基质) */}
                    <rect x="0" y={grassY} width="800" height={grassH} fill="url(#grassGrad)" />
                    {/* 草坪顶部锯齿嫩草 */}
                    <path
                      d={Array.from({ length: 40 }).map((_, i) => {
                        const x = i * 20;
                        const bladeH = 8 + (i % 3) * 3;
                        return `M ${x} ${grassY} L ${x + 10} ${grassY - bladeH} L ${x + 20} ${grassY}`;
                      }).join(' ')}
                      fill="#4ade80"
                    />
                    {/* 小野花点缀 */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <circle key={i} cx={50 + i * 95} cy={grassY + 12} r="3" fill={i % 2 === 0 ? '#f43f5e' : '#facc15'} />
                    ))}
                  </g>
                );
              })()}

              {/* 牧场护栏 */}
              <line x1="0" y1="135" x2="800" y2="135" stroke="#b45309" strokeWidth="4" strokeDasharray="8 6" />
              <line x1="0" y1="155" x2="800" y2="155" stroke="#b45309" strokeWidth="3" strokeDasharray="8 6" />

              {/* 绘制放养的牛群 (最多渲染前 15 头以保证画面整洁) */}
              {Array.from({ length: Math.min(15, cowCount) }).map((_, idx) => {
                // 网格化分布在草坪上
                const row = idx % 2;
                const col = Math.floor(idx / 2);
                const x = 50 + col * 95 + (row * 35);
                const y = 175 + row * 45;

                return (
                  <g key={idx} transform={`translate(${x}, ${y})`} style={{ transition: 'all 0.3s ease' }}>
                    {/* 牛身体 */}
                    <ellipse cx="25" cy="18" rx="20" ry="13" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
                    {/* 奶牛黑白斑点或深色斑纹 */}
                    <circle cx="20" cy="15" r="5" fill="#d97706" />
                    <circle cx="32" cy="20" r="4" fill="#d97706" />
                    {/* 四条小短腿 */}
                    <line x1="12" y1="28" x2="12" y2="38" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
                    <line x1="18" y1="28" x2="18" y2="38" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
                    <line x1="32" y1="28" x2="32" y2="38" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
                    <line x1="38" y1="28" x2="38" y2="38" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
                    {/* 牛头 (朝下啃草姿态) */}
                    <g transform="translate(40, 20)">
                      <ellipse cx="6" cy="5" rx="7" ry="6" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
                      {/* 两个小牛角 */}
                      <path d="M 5 0 Q 3 -5 1 -4" stroke="#78350f" strokeWidth="2" fill="none" />
                      <path d="M 8 0 Q 10 -5 12 -4" stroke="#78350f" strokeWidth="2" fill="none" />
                      {/* 眼睛 */}
                      <circle cx="7" cy="4" r="1.5" fill="#000" />
                      {/* 嘴边叼着的一根草 */}
                      <path d="M 9 9 Q 15 12 18 8" stroke="#16a34a" strokeWidth="2" fill="none" />
                    </g>
                    {/* 小尾巴 */}
                    <path d="M 5 15 Q 0 12 -3 18" stroke="#b45309" strokeWidth="2" fill="none" />
                  </g>
                );
              })}

              {cowCount > 15 && (
                <text x="710" y="260" fontSize="13" fontWeight="bold" fill="#78350f">
                  +{cowCount - 15} 头在后山吃草...
                </text>
              )}

              {/* 吃光警告横幅 */}
              {isFinished && (
                <g>
                  <rect x="220" y="80" width="360" height="60" rx="10" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" opacity="0.95" />
                  <text x="400" y="115" fontSize="18" fontWeight="bold" fill="#b91c1c" textAnchor="middle">
                    ⚠️ 牧场草量已全部吃光！耗时 {finishDays} 天
                  </text>
                </g>
              )}
            </svg>

            {/* 底部四维数据量筒看板 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginTop: '16px' }}>
              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>原存老草储备 (Y)</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{initialGrass} <span style={{ fontSize: '0.8rem' }}>份</span></div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>牧场最初积存量</div>
              </div>

              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #86efac', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#059669' }}>累计新长草量 (+5×t)</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669' }}>+{currentTotalGrown} <span style={{ fontSize: '0.8rem' }}>份</span></div>
                <div style={{ fontSize: '0.75rem', color: '#10b981' }}>每天稳定新生 5 份</div>
              </div>

              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #fca5a5', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#dc2626' }}>累计被吃总量 (-N×t)</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#dc2626' }}>-{currentTotalEaten} <span style={{ fontSize: '0.8rem' }}>份</span></div>
                <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>{cowCount} 头牛吃了 {day} 天</div>
              </div>

              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '2px solid #2563eb', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#1d4ed8', fontWeight: 700 }}>当前牧场剩余草量</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2563eb' }}>{currentRemaining.toFixed(0)} <span style={{ fontSize: '0.8rem' }}>份</span></div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>原草 + 新草 - 吃草</div>
              </div>
            </div>
          </div>

          {/* 直觉顿悟提示卡 */}
          <div style={{ background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe', padding: '14px 18px' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px' }}>
              💡 观察思考与本质发现：
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', color: '#1e3a8a', lineHeight: 1.6 }}>
              <li>
                <strong>为什么放 5 头牛永远吃不完？</strong> 因为每天正好新长 5 份草，5 头牛恰好把每天新长的草全吃光，原来的 100 份老草一点都不会少！
              </li>
              <li>
                <strong>为什么放 10 头牛吃 20 天，放 15 头牛吃 10 天？</strong> 10 头牛里有 5 头在对冲新草，剩下 5 头吃老草（100÷5=20天）；15 头牛里有 5 头对冲新草，剩下 10 头吃老草（100÷10=10天）！
              </li>
              <li>
                <strong>牛吃草的物理本质：</strong> 牛吃草其实就是<strong>“追及问题”</strong>！牛群以速度 $N$ 在追赶，草以速度 $x$ 在向前逃跑，原存草量 $Y$ 就是起初的差距！
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* 模式二：牛顿“专职分工”解剖台 */}
      {mode === 'division' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            🥩 牛顿的绝妙解法：“给牛群戴上不同颜色的工号牌”
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
            孩子为什么觉得牛吃草题像“乱麻”？因为草每天都在长，吃草的天数和生长的天数混在一起！
            牛顿的破局法宝极其简单：<strong>不管来多少头牛，先抓出刚好等于生长速度的牛，派它们专门去吃新草；剩下的牛只负责吃老草！</strong>
          </p>

          {/* 步骤一：怎么从两组条件算出每天长草速度？ */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '16px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ background: '#2563eb', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>1</span>
              <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>第一步：对比两组条件，抓出草每天生长速度 $x$</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
                <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '0.875rem' }}>方案 A：10 头牛吃 20 天</div>
                <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '4px' }}>
                  20 天总共被吃掉草量 = 10 头 × 20 天 = <strong>200 份</strong>
                </div>
              </div>

              <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ fontWeight: 700, color: '#b45309', fontSize: '0.875rem' }}>方案 B：15 头牛吃 10 天</div>
                <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '4px' }}>
                  10 天总共被吃掉草量 = 15 头 × 10 天 = <strong>150 份</strong>
                </div>
              </div>
            </div>

            <div style={{ background: '#f0fdf4', padding: '12px 16px', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.9rem', color: '#166534' }}>
              🔍 <strong>关键提问：</strong> 为什么 20 天比 10 天<strong>多吃了 50 份草</strong>（200 - 150 = 50）？<br />
              👉 <strong>答案：</strong> 因为时间多过了 10 天（20 - 10 = 10天），这 50 份正是<strong>草在 10 天里新长出来的</strong>！<br />
              <div style={{ marginTop: '6px', fontWeight: 800, fontSize: '1rem', color: '#15803d' }}>
                草每天生长速度 x = (200 - 150) ÷ (20 - 10) = 50 ÷ 10 = 5 份/天
              </div>
            </div>
          </div>

          {/* 步骤二：算原有老草 Y */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '16px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ background: '#2563eb', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>2</span>
              <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>第二步：倒推牧场原有的老草储备 Y</strong>
            </div>

            <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
              代入方案 A：20 天总共吃了 200 份草，而这 20 天里新长出的草是 5 × 20 = 100 份。<br />
              那么原有的老草 = 总吃量 - 新长量：
              <div style={{ margin: '8px 0', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', fontWeight: 800, fontSize: '1rem', color: '#2563eb', border: '1px dashed #cbd5e1' }}>
                Y = 200 - 5 × 20 = 100 份（用方案 B 算：150 - 5 × 10 = 100 份，完全一致！）
              </div>
            </div>
          </div>

          {/* 步骤三：牛群工号牌大拆分（解决 25 头牛几天吃完） */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '2px solid #3b82f6', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ background: '#2563eb', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>3</span>
              <strong style={{ fontSize: '1.05rem', color: '#1d4ed8' }}>终极实战：如果来了 25 头牛，几天吃完？</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '14px' }}>
              {/* 绿色对冲组 */}
              <div style={{ background: '#dcfce7', borderRadius: '10px', padding: '14px', border: '1.5px solid #86efac' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#166534', marginBottom: '8px' }}>
                  <span>🟢</span>
                  <span>新草对冲小分队：5 头牛</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#14532d', lineHeight: 1.5 }}>
                  每天草新长 5 份，刚好派出 <strong>5 头牛</strong> 紧紧盯着。草长多少就啃多少，<strong>让牧场的新草增长彻底归零！</strong>
                </p>
              </div>

              {/* 蓝色攻坚组 */}
              <div style={{ background: '#dbeafe', borderRadius: '10px', padding: '14px', border: '1.5px solid #93c5fd' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#1e40af', marginBottom: '8px' }}>
                  <span>🔵</span>
                  <span>老草攻坚特战队：20 头牛</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e3a8a', lineHeight: 1.5 }}>
                  剩下的 <strong>25 - 5 = 20 头牛</strong>，毫无后顾之忧地专心啃食原有的 100 份老草储备！
                </p>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>老草 100 份 ÷ 攻坚牛 20 头 = </span>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2563eb', marginLeft: '6px' }}>5 天吃完！</span>
            </div>
          </div>
        </div>
      )}

      {/* 模式三：名校真题与易错变式 */}
      {mode === 'quiz' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.05rem' }}>
              第 {quizIndex + 1} 题 / 共 {QUIZ_QUESTIONS.length} 题
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>牛吃草与抽水机模型速测</span>
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
