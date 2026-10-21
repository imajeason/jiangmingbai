'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/animations.module.css';

type Mode = 'vector' | 'difference' | 'quiz';

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
    question: '一艘轮船在静水中的速度是 18 km/h，水流速度是 3 km/h。这艘轮船顺水航行与逆水航行的速度分别是多少？',
    options: [
      '顺水 21 km/h，逆水 15 km/h',
      '顺水 18 km/h，逆水 15 km/h',
      '顺水 21 km/h，逆水 18 km/h',
      '顺水 24 km/h，逆水 12 km/h'
    ],
    correctIndex: 0,
    explanation: '顺水时，水流在背后推着船加速：顺水速度 = 船速 + 水速 = 18 + 3 = 21 km/h；逆水时，水流在船头阻挡减速：逆水速度 = 船速 - 水速 = 18 - 3 = 15 km/h。'
  },
  {
    id: 2,
    question: '已知某快艇顺水速度为 26 km/h，逆水速度为 18 km/h。求该快艇在静水中的速度以及水流速度。',
    options: [
      '静水船速 22 km/h，水速 4 km/h',
      '静水船速 20 km/h，水速 6 km/h',
      '静水船速 24 km/h，水速 2 km/h',
      '静水船速 21 km/h，水速 5 km/h'
    ],
    correctIndex: 0,
    explanation: '顺水与逆水之差是 2 倍水速：水速 = (26 - 18) ÷ 2 = 8 ÷ 2 = 4 km/h；静水船速是顺逆速度的平均值：船速 = (26 + 18) ÷ 2 = 44 ÷ 2 = 22 km/h！'
  },
  {
    id: 3,
    question: '【小升初压轴·漂流瓶之谜】小明乘汽艇逆水航行，在 A 处不慎将一顶草帽掉入水中。汽艇继续前行 15 分钟后小明才发现，立即掉头顺水追赶。问多少分钟后能追上草帽？（掉头时间忽略不计）',
    options: ['15 分钟', '30 分钟', '20 分钟', '45 分钟'],
    correctIndex: 0,
    explanation: '神级破局思维（以水流为参照物）：草帽掉在水里随波逐流，人和水流都在以相同速度顺水移动！在水流这个运动的大地毯上看，人和草帽的相对远离速度就是船在静水中的速度，掉头追赶的相对接近速度依然是静水船速！去程远离了 15 分钟，追赶正好需要 15 分钟！根本无需计算复杂路程！'
  }
];

export default function RiverBoatMotionLab() {
  const [mode, setMode] = useState<Mode>('vector');

  // 参数：船自身动力速度 (静水速度 v_boat) 与 水流速度 (v_water)
  const [vBoat, setVBoat] = useState<number>(15); // km/h
  const [vWater, setVWater] = useState<number>(3); // km/h

  // 航行方向: 'downstream'(顺水向右) | 'upstream'(逆水向左) | 'drift'(熄火漂流)
  const [direction, setDirection] = useState<'downstream' | 'upstream' | 'drift'>('downstream');

  // 动画状态
  const [boatX, setBoatX] = useState<number>(200); // 船只屏幕坐标
  const [leafX, setLeafX] = useState<number>(100); // 水中落叶坐标 (永远随水向右漂)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const animRef = useRef<number | null>(null);

  // 测验
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // 计算实际对地速度 (对地速度 groundSpeed)
  let actualSpeed = 0;
  if (direction === 'downstream') {
    actualSpeed = vBoat + vWater;
  } else if (direction === 'upstream') {
    actualSpeed = -(vBoat - vWater); // 负号代表向左开
  } else {
    // 熄火随波漂流
    actualSpeed = vWater;
  }

  // 动画循环
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying) {
        // 落叶只受水流速度驱动 (向右漂)
        setLeafX((prev) => {
          let next = prev + vWater * dt * 8;
          if (next > 760) next = 40;
          return next;
        });

        // 船受 actualSpeed 驱动
        setBoatX((prev) => {
          let next = prev + actualSpeed * dt * 8;
          // 边界循环处理
          if (actualSpeed > 0 && next > 760) next = 40;
          if (actualSpeed < 0 && next < 40) next = 760;
          return next;
        });
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, actualSpeed, vWater]);

  return (
    <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
      {/* 顶部模式切换选项卡 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          className={mode === 'vector' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('vector'); }}
        >
          🚤 模式一：动态河道与水流推力实验室
        </button>
        <button
          className={mode === 'difference' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('difference'); }}
        >
          📊 模式二：“两倍水速”和差解剖台
        </button>
        <button
          className={mode === 'quiz' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('quiz'); }}
        >
          🎯 模式三：小升初名题与易错闯关
        </button>
      </div>

      {/* 模式一：动态河道与水流推力实验室 */}
      {mode === 'vector' && (
        <div>
          {/* 控制条 */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            {/* 航向状态选择 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>航向选择：</span>
                <button
                  className={direction === 'downstream' ? styles.primaryBtn : styles.secondaryBtn}
                  onClick={() => setDirection('downstream')}
                  style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                  🌊 顺水航行 (水流助推 ➔)
                </button>
                <button
                  className={direction === 'upstream' ? styles.primaryBtn : styles.secondaryBtn}
                  onClick={() => setDirection('upstream')}
                  style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                  ⛰️ 逆水航行 (水流阻挡 ⬅)
                </button>
                <button
                  className={direction === 'drift' ? styles.primaryBtn : styles.secondaryBtn}
                  onClick={() => setDirection('drift')}
                  style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                  🍂 熄火漂流 (完全随水)
                </button>
              </div>

              {/* 播放暂停 */}
              <button
                className={styles.secondaryBtn}
                onClick={() => setIsPlaying(!isPlaying)}
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              >
                {isPlaying ? '⏸ 暂停动画' : '▶ 继续航行'}
              </button>
            </div>

            {/* 双滑块调节：静水船速 与 水流速度 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, color: '#1e40af', marginBottom: '6px' }}>
                  <span>🚤 静水船速 (自身动力 v_船)：</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>{vBoat} km/h</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="24"
                  step="1"
                  value={vBoat}
                  onChange={(e) => setVBoat(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#2563eb' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, color: '#0891b2', marginBottom: '6px' }}>
                  <span>🌊 水流速度 (向右流速 v_水)：</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>{vWater} km/h</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={vWater}
                  onChange={(e) => setVWater(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#06b6d4' }}
                />
              </div>
            </div>
          </div>

          {/* 动态河流 SVG 视口 */}
          <div style={{ background: '#ecfeff', borderRadius: '16px', border: '2px solid #a5f3fc', padding: '16px', position: 'relative', overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0e7490' }}>
                🌊 实时物理河道模拟 (水流向右 ➔ 速度：{vWater} km/h)
              </div>
              <div style={{ fontSize: '0.85rem', color: '#155e75', fontWeight: 600 }}>
                岸边绿色树木为地面静止参照物 🌲
              </div>
            </div>

            <svg viewBox="0 0 800 280" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px', background: '#cffafe' }}>
              <defs>
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#bae6fd" />
                  <stop offset="50%" stopColor="#7dd3fc" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="bankGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#86efac" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>

              {/* 上河岸 */}
              <rect x="0" y="0" width="800" height="50" fill="url(#bankGrad)" />
              {/* 河岸树木 */}
              {[40, 160, 280, 420, 540, 680, 770].map((tx, idx) => (
                <g key={idx} transform={`translate(${tx}, 15)`}>
                  <rect x="6" y="16" width="4" height="12" fill="#78350f" />
                  <circle cx="8" cy="12" r="10" fill="#15803d" />
                  <circle cx="8" cy="8" r="7" fill="#16a34a" />
                </g>
              ))}

              {/* 下河岸 */}
              <rect x="0" y="230" width="800" height="50" fill="url(#bankGrad)" />
              {[80, 200, 340, 480, 620, 740].map((tx, idx) => (
                <g key={idx} transform={`translate(${tx}, 240)`}>
                  <rect x="6" y="16" width="4" height="12" fill="#78350f" />
                  <circle cx="8" cy="12" r="10" fill="#15803d" />
                </g>
              ))}

              {/* 主河水区域 */}
              <rect x="0" y="50" width="800" height="180" fill="url(#riverGrad)" />

              {/* 水流动态波纹波浪线 (多组波浪向右平移) */}
              {[70, 110, 150, 190].map((wy, idx) => (
                <g key={idx} opacity="0.45">
                  <path
                    d={`M 0 ${wy} Q 100 ${wy - 6} 200 ${wy} T 400 ${wy} T 600 ${wy} T 800 ${wy}`}
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    fill="none"
                    strokeDasharray="16 12"
                  />
                  {/* 水流向右小箭头 */}
                  <polygon points={`750,${wy - 3} 760,${wy} 750,${wy + 3}`} fill="#0284c7" />
                </g>
              ))}

              {/* 水中随波逐流的漂流落叶 (用来做水流相对参照物) */}
              <g transform={`translate(${leafX}, 80)`}>
                <ellipse cx="10" cy="5" rx="10" ry="4" fill="#f59e0b" transform="rotate(-15, 10, 5)" />
                <line x1="2" y1="5" x2="18" y2="5" stroke="#b45309" strokeWidth="1" />
                <text x="10" y="22" fontSize="10" fontWeight="bold" fill="#78350f" textAnchor="middle">
                  漂流瓶/落叶 (速度={vWater})
                </text>
              </g>

              {/* 运动的汽艇/轮船 */}
              <g transform={`translate(${boatX}, 130)`}>
                {/* 如果逆水向左，则整体水平翻转 scaleX(-1) */}
                <g transform={direction === 'upstream' ? 'scale(-1, 1)' : ''}>
                  {/* 船底波浪与尾流水花 */}
                  <ellipse cx="-15" cy="22" rx="12" ry="5" fill="#ffffff" opacity="0.6" />
                  {/* 船体 */}
                  <path d="M -30 20 L 40 20 Q 55 18 60 5 L -20 5 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
                  {/* 船身蓝色腰线 */}
                  <path d="M -24 12 L 48 12" stroke="#2563eb" strokeWidth="3" />
                  {/* 驾驶室舱体 */}
                  <rect x="-10" y="-8" width="30" height="14" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                  <rect x="-4" y="-5" width="10" height="7" rx="1" fill="#ffffff" opacity="0.9" />
                  <rect x="10" y="-5" width="8" height="7" rx="1" fill="#ffffff" opacity="0.9" />
                  {/* 桅杆旗帜 */}
                  <line x1="-12" y1="-8" x2="-12" y2="-20" stroke="#64748b" strokeWidth="2" />
                  <polygon points="-12,-20 0,-16 -12,-12" fill="#ef4444" />
                </g>

                {/* 船顶速度状态指示卡 */}
                <g transform="translate(0, -32)">
                  <rect x="-65" y="-12" width="130" height="24" rx="12" fill="#0f172a" opacity="0.9" />
                  <text x="0" y="4" fontSize="11" fontWeight="bold" fill="#38bdf8" textAnchor="middle">
                    对地实际航速：{Math.abs(actualSpeed)} km/h
                  </text>
                </g>
              </g>

              {/* 底部物理速度矢量箭头图解 */}
              <g transform="translate(40, 205)">
                <rect x="0" y="0" width="720" height="24" rx="4" fill="#0f172a" opacity="0.8" />
                {direction === 'downstream' && (
                  <text x="360" y="16" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                    【顺水同向叠加】实际速度 = 船速({vBoat}) + 水速({vWater}) = {vBoat + vWater} km/h (顺水推舟，速度飞快)
                  </text>
                )}
                {direction === 'upstream' && (
                  <text x="360" y="16" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                    【逆水反向抵消】实际速度 = 船速({vBoat}) - 水速({vWater}) = {vBoat - vWater} km/h (顶水前行，被水流冲慢)
                  </text>
                )}
                {direction === 'drift' && (
                  <text x="360" y="16" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                    【熄火漂流】船身无动力(0)，完全随波逐流，速度恰好等于水流速度 = {vWater} km/h
                  </text>
                )}
              </g>
            </svg>
          </div>

          {/* 三维核心指标卡 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '10px', border: '1.5px solid #bfdbfe', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 600 }}>🌊 顺水航行速度</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1d4ed8', margin: '4px 0' }}>
                {vBoat + vWater} <span style={{ fontSize: '0.85rem' }}>km/h</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>v_顺 = v_船 + v_水</div>
            </div>

            <div style={{ background: '#fef3c7', padding: '14px', borderRadius: '10px', border: '1.5px solid #fde68a', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 600 }}>⛰️ 逆水航行速度</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#d97706', margin: '4px 0' }}>
                {vBoat - vWater} <span style={{ fontSize: '0.85rem' }}>km/h</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#b45309' }}>v_逆 = v_船 - v_水</div>
            </div>

            <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '10px', border: '1.5px solid #bbf7d0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 600 }}>⚡ 顺逆速度之差 (关键差量)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16a34a', margin: '4px 0' }}>
                {(vBoat + vWater) - (vBoat - vWater)} <span style={{ fontSize: '0.85rem' }}>km/h</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#15803d' }}>恰好等于 2 倍水速 (2 × {vWater})！</div>
            </div>
          </div>
        </div>
      )}

      {/* 模式二：“两倍水速”和差解剖台 */}
      {mode === 'difference' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            💡 核心密码揭秘：为什么“顺水速 - 逆水速 = 2 个水速”？
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
            很多孩子在考试中容易误写成“顺水速 - 逆水速 = 水速”。为什么多出了一个 2 倍呢？
            看懂下面的线段图，孩子这辈子都再也不会记错！
          </p>

          {/* 线段图对比演示 */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '20px', marginBottom: '20px' }}>
            {/* 顺水线段 */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#1e40af', marginBottom: '6px' }}>
                <span>顺水速度 (v_顺 = 21)</span>
                <span>由【静水船速】和【水流速度】合体组成</span>
              </div>
              <div style={{ display: 'flex', height: '36px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #93c5fd' }}>
                <div style={{ flex: 15, background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                  静水船速 (15)
                </div>
                <div style={{ flex: 3, background: '#06b6d4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                  +水速(3)
                </div>
              </div>
            </div>

            {/* 逆水线段 */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#d97706', marginBottom: '6px' }}>
                <span>逆水速度 (v_逆 = 12)</span>
                <span>从【静水船速】中被水流生生扣除了一段</span>
              </div>
              <div style={{ display: 'flex', height: '36px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #fed7aa' }}>
                <div style={{ flex: 12, background: '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                  逆水实际航速 (12)
                </div>
                <div style={{ flex: 3, background: '#fca5a5', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, borderLeft: '2px dashed #dc2626' }}>
                  扣去水速(3)
                </div>
              </div>
            </div>

            {/* 差值暴击分析 */}
            <div style={{ background: '#f0fdf4', padding: '14px 18px', borderRadius: '8px', border: '1px solid #86efac' }}>
              <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.95rem', marginBottom: '6px' }}>
                🎯 为什么相差 2 个水速？
              </div>
              <div style={{ fontSize: '0.875rem', color: '#14532d', lineHeight: 1.6 }}>
                顺水是在船速的基础上<strong>多获得了 1 个水速</strong>（+v_水）；<br />
                逆水是在船速的基础上<strong>倒扣掉了 1 个水速</strong>（-v_水）；<br />
                一多一少，一进一出，两者之间的总差距自然就是：<strong>(+1) - (-1) = 2 个水速</strong>！
              </div>
            </div>
          </div>

          {/* 黄金解题互逆公式卡 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '16px', border: '1.5px solid #bfdbfe' }}>
              <div style={{ fontWeight: 800, color: '#1e40af', fontSize: '0.95rem', marginBottom: '8px' }}>
                求【静水船速】：
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb', fontFamily: 'monospace' }}>
                船速 = (顺水速度 + 逆水速度) ÷ 2
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>
                (船速是顺逆两者的中间对称点，即平均值！)
              </div>
            </div>

            <div style={{ background: '#ecfeff', borderRadius: '10px', padding: '16px', border: '1.5px solid #a5f3fc' }}>
              <div style={{ fontWeight: 800, color: '#0e7490', fontSize: '0.95rem', marginBottom: '8px' }}>
                求【水流速度】：
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0891b2', fontFamily: 'monospace' }}>
                水速 = (顺水速度 - 逆水速度) ÷ 2
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>
                (差值是 2 个水速，除以 2 就揪出单个水速！)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 模式三：小升初名题与易错闯关 */}
      {mode === 'quiz' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.05rem' }}>
              第 {quizIndex + 1} 题 / 共 {QUIZ_QUESTIONS.length} 题
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>流水行船经典题型速测</span>
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
