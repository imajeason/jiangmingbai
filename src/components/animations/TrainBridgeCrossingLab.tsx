'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/animations.module.css';

type Mode = 'single' | 'double' | 'quiz';

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
    question: '一列长 150 米的火车以 20 米/秒的速度通过一座长 450 米的大桥。从车头上桥到车尾完全离桥，总共需要多少秒？',
    options: ['30 秒', '22.5 秒', '15 秒', '25 秒'],
    correctIndex: 0,
    explanation: '从车头上桥到车尾完全离桥，车头走过的总路程等于“桥长 + 车长”！总路程 = 450 + 150 = 600 米。所需时间 = 600 ÷ 20 = 30 秒！如果只拿 450 ÷ 20 = 22.5 秒，车尾还在桥上，没有完全过桥！'
  },
  {
    id: 2,
    question: '一列长 200 米的列车匀速行驶，经过铁路旁一位站立不动的路人，从车头经过路人到车尾离开路人总共用了 10 秒。这列火车的速度是多少？',
    options: ['20 米/秒', '15 米/秒', '25 米/秒', '10 米/秒'],
    correctIndex: 0,
    explanation: '路人没有长度（相当于一个点），从车头到车尾完全经过这个人，车头走过的路程正好等于“车身自身长度 200 米”！因此车速 = 200 ÷ 10 = 20 米/秒！'
  },
  {
    id: 3,
    question: '两列列车相向而行，甲车长 120 米，车速 18 米/秒；乙车长 180 米，车速 12 米/秒。从两车车头相遇，到两车车尾完全离开，需要多少秒？',
    options: ['10 秒', '15 秒', '12 秒', '8 秒'],
    correctIndex: 0,
    explanation: '相向错车是速度和相遇模型：两车相对速度 = 18 + 12 = 30 米/秒；错车完成时，两车共同走过的相对路程正好等于“两车车长之和” = 120 + 180 = 300 米。错车时间 = 300 ÷ 30 = 10 秒！'
  }
];

export default function TrainBridgeCrossingLab() {
  const [mode, setMode] = useState<Mode>('single');

  // 单车过桥参数
  const [bridgeLen, setBridgeLen] = useState<number>(300); // 桥长 (米)
  const [trainLen, setTrainLen] = useState<number>(100); // 车长 (米)
  const [trainSpeed, setTrainSpeed] = useState<number>(20); // 车速 (米/秒)

  // 场景选择: 'cross'(完全过桥: 桥长+车长) | 'inside'(整列在桥内: 桥长-车长)
  const [sceneType, setSceneType] = useState<'cross' | 'inside'>('cross');

  // 动画状态: progress 从 0% 到 100%
  const [animProgress, setAnimProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const animRef = useRef<number | null>(null);

  // 双车错车参数
  const [doubleType, setDoubleType] = useState<'meet' | 'chase'>('meet'); // 相向错车 | 同向超车
  const [doubleProgress, setDoubleProgress] = useState<number>(0);
  const [isDoublePlaying, setIsDoublePlaying] = useState<boolean>(false);

  // 测验
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // 理论计算 (单车)
  const totalDistance = sceneType === 'cross' ? bridgeLen + trainLen : bridgeLen - trainLen;
  const totalTime = totalDistance > 0 ? totalDistance / trainSpeed : 0;
  const currentDistance = Math.min(totalDistance, totalDistance * animProgress);
  const currentTime = (totalTime * animProgress).toFixed(1);

  // 单车动画循环
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying && totalTime > 0) {
        setAnimProgress((prev) => {
          const next = prev + dt / totalTime;
          if (next >= 1) {
            setIsPlaying(false);
            return 1;
          }
          return next;
        });
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, totalTime]);

  // 双车动画循环
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isDoublePlaying) {
        setDoubleProgress((prev) => {
          const next = prev + dt * 0.2; // 5秒演完
          if (next >= 1) {
            setIsDoublePlaying(false);
            return 1;
          }
          return next;
        });
      }

      requestAnimationFrame(loop);
    };

    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [isDoublePlaying]);

  return (
    <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
      {/* 顶部模式切换选项卡 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          className={mode === 'single' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('single'); setAnimProgress(0); setIsPlaying(false); }}
        >
          🚂 模式一：单车过桥与车长位移推演
        </button>
        <button
          className={mode === 'double' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('double'); setDoubleProgress(0); setIsDoublePlaying(false); }}
        >
          🚄 模式二：双车相向错车与同向超车
        </button>
        <button
          className={mode === 'quiz' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('quiz'); }}
        >
          🎯 模式三：名校考题与易错点闯关
        </button>
      </div>

      {/* 模式一：单车过桥与车长位移推演 */}
      {mode === 'single' && (
        <div>
          {/* 控制条 */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            {/* 场景与目标选择 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>考察目标：</span>
                <button
                  className={sceneType === 'cross' ? styles.primaryBtn : styles.secondaryBtn}
                  onClick={() => { setSceneType('cross'); setAnimProgress(0); setIsPlaying(false); }}
                  style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                >
                  🚩 完全过桥 (从车头上桥到车尾离桥: S = 桥长 + 车长)
                </button>
                <button
                  className={sceneType === 'inside' ? styles.primaryBtn : styles.secondaryBtn}
                  onClick={() => { setSceneType('inside'); setAnimProgress(0); setIsPlaying(false); }}
                  style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                >
                  🚇 整列在桥上/隧道内 (隐蔽阶段: S = 桥长 - 车长)
                </button>
              </div>

              {/* 播放与重置 */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className={styles.primaryBtn}
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                >
                  {isPlaying ? '⏸ 暂停观察' : animProgress >= 1 ? '🔄 重新播放' : '▶ 动态过桥'}
                </button>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => { setAnimProgress(0); setIsPlaying(false); }}
                  style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                  🔄 复位
                </button>
              </div>
            </div>

            {/* 关键节点快捷步进跳转按钮 */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px', padding: '8px 12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>关键位置定格：</span>
              <button
                onClick={() => { setAnimProgress(0); setIsPlaying(false); }}
                style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
              >
                ① 车头刚碰到桥头 (S=0)
              </button>
              <button
                onClick={() => {
                  if (sceneType === 'cross') {
                    setAnimProgress(bridgeLen / (bridgeLen + trainLen));
                  } else {
                    setAnimProgress(0);
                  }
                  setIsPlaying(false);
                }}
                style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
              >
                ② 车头刚碰到桥尾 (车身还在桥上!)
              </button>
              <button
                onClick={() => { setAnimProgress(1); setIsPlaying(false); }}
                style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
              >
                ③ 车尾完全离开桥头 (过桥完成!)
              </button>
            </div>

            {/* 参数滑块 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#1e40af', marginBottom: '4px' }}>
                  <span>🌉 桥梁/隧道长度 (L_桥)：</span>
                  <span style={{ fontWeight: 800 }}>{bridgeLen} 米</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="500"
                  step="50"
                  value={bridgeLen}
                  onChange={(e) => { setBridgeLen(Number(e.target.value)); setAnimProgress(0); }}
                  style={{ width: '100%', accentColor: '#2563eb' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#15803d', marginBottom: '4px' }}>
                  <span>🚂 列车车身长度 (L_车)：</span>
                  <span style={{ fontWeight: 800 }}>{trainLen} 米</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="25"
                  value={trainLen}
                  onChange={(e) => { setTrainLen(Number(e.target.value)); setAnimProgress(0); }}
                  style={{ width: '100%', accentColor: '#16a34a' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#b45309', marginBottom: '4px' }}>
                  <span>⚡ 列车行驶速度 (v)：</span>
                  <span style={{ fontWeight: 800 }}>{trainSpeed} 米/秒</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="30"
                  step="5"
                  value={trainSpeed}
                  onChange={(e) => { setTrainSpeed(Number(e.target.value)); setAnimProgress(0); }}
                  style={{ width: '100%', accentColor: '#d97706' }}
                />
              </div>
            </div>
          </div>

          {/* 交互铁桥与列车 SVG 画布 */}
          <div style={{ background: '#f0fdf4', borderRadius: '16px', border: '2px solid #bbf7d0', padding: '16px', position: 'relative', overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534' }}>
                🌉 物理铁路大桥全景剖面 (车头带 🚩 红旗，车尾带 🔷 蓝标)
              </div>
              <div style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 700 }}>
                时间已过：<span style={{ fontSize: '1.2rem', color: '#0f172a' }}>{currentTime}</span> 秒 / 总需 {totalTime.toFixed(1)} 秒
              </div>
            </div>

            <svg viewBox="0 0 800 260" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px', background: '#dcfce7' }}>
              <defs>
                <linearGradient id="bridgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
                <linearGradient id="trainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
              </defs>

              {/* 蓝天远景 */}
              <rect x="0" y="0" width="800" height="150" fill="#f0fdf4" />
              {/* 河流/峡谷底层 */}
              <rect x="200" y="150" width="400" height="110" fill="#bae6fd" />
              {/* 河面波浪 */}
              <path d="M 200 170 Q 250 165 300 170 T 400 170 T 500 170 T 600 170" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.6" />
              <path d="M 200 200 Q 250 195 300 200 T 400 200 T 500 200 T 600 200" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.6" />

              {/* 左路基与右路基 */}
              <rect x="0" y="150" width="200" height="110" fill="#cbd5e1" />
              <rect x="600" y="150" width="200" height="110" fill="#cbd5e1" />

              {/* 大桥桥墩 */}
              <rect x="290" y="150" width="20" height="90" fill="#64748b" />
              <rect x="490" y="150" width="20" height="90" fill="#64748b" />

              {/* 大桥桥面 (固定范围: x=200 到 x=600，跨度代表 bridgeLen) */}
              {/* 钢铁桁架 */}
              <path d="M 200 150 L 250 110 L 300 150 L 350 110 L 400 150 L 450 110 L 500 150 L 550 110 L 600 150" stroke="#475569" strokeWidth="3" fill="none" />
              <line x1="200" y1="110" x2="600" y2="110" stroke="#475569" strokeWidth="3" />
              <line x1="250" y1="110" x2="250" y2="150" stroke="#64748b" strokeWidth="2" />
              <line x1="350" y1="110" x2="350" y2="150" stroke="#64748b" strokeWidth="2" />
              <line x1="450" y1="110" x2="450" y2="150" stroke="#64748b" strokeWidth="2" />
              <line x1="550" y1="110" x2="550" y2="150" stroke="#64748b" strokeWidth="2" />

              {/* 铁轨横梁 */}
              <rect x="0" y="146" width="800" height="6" fill="#334155" />

              {/* 桥长标尺与文字 */}
              <g transform="translate(0, 80)">
                <line x1="200" y1="0" x2="600" y2="0" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arrow)" />
                <line x1="200" y1="-6" x2="200" y2="6" stroke="#2563eb" strokeWidth="2" />
                <line x1="600" y1="-6" x2="600" y2="6" stroke="#2563eb" strokeWidth="2" />
                <text x="400" y="-8" fontSize="13" fontWeight="bold" fill="#1d4ed8" textAnchor="middle">
                  大桥长度 L_桥 = {bridgeLen} 米
                </text>
              </g>

              {/* 动态计算列车位置 */}
              {(() => {
                // 像素缩放：大桥固定宽度 400px 代表 bridgeLen
                const pxPerMeter = 400 / bridgeLen;
                const trainW = trainLen * pxPerMeter;

                // 运动起点与终点 (按车头 frontX 计算):
                // 起点：车头刚碰到桥头 (x = 200)
                // 终点 (完全过桥)：车尾离开桥尾 (x = 600 + trainW)
                const startHeadX = sceneType === 'cross' ? 200 : 200 + trainW;
                const endHeadX = sceneType === 'cross' ? 600 + trainW : 600;

                const currentHeadX = startHeadX + (endHeadX - startHeadX) * animProgress;
                const trainRearX = currentHeadX - trainW;

                return (
                  <g>
                    {/* 车头走过的轨迹黄色光带 (显示车头真实位移路程) */}
                    <line x1={startHeadX} y1="140" x2={currentHeadX} y2="140" stroke="#eab308" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
                    <text x={(startHeadX + currentHeadX) / 2} y="132" fontSize="11" fontWeight="bold" fill="#854d0e" textAnchor="middle">
                      车头实际位移 = {currentDistance.toFixed(0)} 米
                    </text>

                    {/* 绿皮列车车体 (从 trainRearX 到 currentHeadX) */}
                    <g transform={`translate(${trainRearX}, 114)`}>
                      {/* 车厢 */}
                      <rect x="0" y="0" width={trainW} height="32" rx="4" fill="url(#trainGrad)" stroke="#14532d" strokeWidth="1.5" />
                      {/* 车窗 */}
                      {Array.from({ length: Math.max(2, Math.floor(trainW / 24)) }).map((_, i) => (
                        <rect key={i} x={6 + i * 22} y="6" width="14" height="12" rx="2" fill="#bae6fd" opacity="0.9" />
                      ))}
                      {/* 车轮 */}
                      <circle cx="12" cy="33" r="4" fill="#0f172a" />
                      <circle cx="24" cy="33" r="4" fill="#0f172a" />
                      <circle cx={trainW - 24} cy="33" r="4" fill="#0f172a" />
                      <circle cx={trainW - 12} cy="33" r="4" fill="#0f172a" />

                      {/* 车尾蓝标 */}
                      <rect x="-8" y="2" width="6" height="12" rx="1" fill="#3b82f6" />
                      <text x="-5" y="-4" fontSize="9" fontWeight="bold" fill="#1d4ed8" textAnchor="middle">车尾</text>

                      {/* 车头红旗 */}
                      <g transform={`translate(${trainW}, 0)`}>
                        <polygon points="0,0 12,5 0,10" fill="#ef4444" />
                        <line x1="0" y1="0" x2="0" y2="30" stroke="#dc2626" strokeWidth="2" />
                        <text x="6" y="-6" fontSize="10" fontWeight="bold" fill="#b91c1c" textAnchor="middle">车头 🚩</text>
                      </g>
                    </g>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* 核心公式解剖与数据看板 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '16px', border: '1.5px solid #bfdbfe', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 600 }}>🚩 车头走过的总路程 (S)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1d4ed8', margin: '4px 0' }}>
                {totalDistance} <span style={{ fontSize: '0.85rem' }}>米</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#2563eb', fontFamily: 'monospace' }}>
                {sceneType === 'cross'
                  ? `S = 桥长(${bridgeLen}) + 车长(${trainLen})`
                  : `S = 桥长(${bridgeLen}) - 车长(${trainLen})`}
              </div>
            </div>

            <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '16px', border: '1.5px solid #bbf7d0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 600 }}>⏱ 完全通过所需时间 (t)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16a34a', margin: '4px 0' }}>
                {totalTime.toFixed(1)} <span style={{ fontSize: '0.85rem' }}>秒</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#15803d', fontFamily: 'monospace' }}>
                t = 总路程({totalDistance}) ÷ 车速({trainSpeed})
              </div>
            </div>

            <div style={{ background: '#fef3c7', borderRadius: '10px', padding: '16px', border: '1.5px solid #fde68a', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 600 }}>💡 为什么必须加上车长？</div>
              <div style={{ fontSize: '0.85rem', color: '#78350f', lineHeight: 1.5, textAlign: 'left', marginTop: '6px' }}>
                当车头刚到桥尾时，车头只走了桥长，但<strong>整个车身还在桥上</strong>！必须让车头再往前开出一整个车长的距离，车尾才能完全离开大桥！
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 模式二：双车相向错车与同向超车 */}
      {mode === 'double' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={doubleType === 'meet' ? styles.primaryBtn : styles.secondaryBtn}
                onClick={() => { setDoubleType('meet'); setDoubleProgress(0); setIsDoublePlaying(false); }}
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              >
                🤝 相向错车 (迎面交会: 速度和 v1 + v2)
              </button>
              <button
                className={doubleType === 'chase' ? styles.primaryBtn : styles.secondaryBtn}
                onClick={() => { setDoubleType('chase'); setDoubleProgress(0); setIsDoublePlaying(false); }}
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              >
                🏃‍♂️ 同向超车 (快车超越慢车: 速度差 v1 - v2)
              </button>
            </div>

            <button
              className={styles.primaryBtn}
              onClick={() => setIsDoublePlaying(!isDoublePlaying)}
              style={{ padding: '6px 16px', fontSize: '0.85rem' }}
            >
              {isDoublePlaying ? '⏸ 暂停' : doubleProgress >= 1 ? '🔄 重播' : '▶ 开始演化'}
            </button>
          </div>

          {/* 双车错车 SVG */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '16px', marginBottom: '16px' }}>
            <svg viewBox="0 0 800 200" style={{ width: '100%', height: 'auto', display: 'block' }}>
              {/* 上轨道与下轨道 */}
              <line x1="50" y1="70" x2="750" y2="70" stroke="#94a3b8" strokeWidth="4" />
              <line x1="50" y1="130" x2="750" y2="130" stroke="#94a3b8" strokeWidth="4" />

              {doubleType === 'meet' ? (
                // 相向错车: 甲车(绿车, 长120px) 向右开, 乙车(蓝车, 长180px) 向左开
                // 错车过程: 从两车头相遇 到 两车尾离开
                // 总相对位移 = 120 + 180 = 300px
                (() => {
                  const meetX = 400; // 相遇汇合中心线
                  // 甲车头位置从 meetX - 120 到 meetX + 180
                  const train1X = 280 + doubleProgress * 300;
                  // 乙车头位置从 meetX + 180 向左到 meetX - 120
                  const train2X = 520 - doubleProgress * 300;

                  return (
                    <g>
                      {/* 中心相遇标线 */}
                      <line x1={meetX} y1="30" x2={meetX} y2="170" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
                      <text x={meetX} y="24" fontSize="10" fill="#dc2626" textAnchor="middle" fontWeight="bold">相遇交会线</text>

                      {/* 甲车 (向右 ➔) */}
                      <g transform={`translate(${train1X - 120}, 44)`}>
                        <rect x="0" y="0" width="120" height="24" rx="3" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
                        <text x="60" y="16" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">甲车 (L1=120m, 18m/s ➔)</text>
                        <polygon points="120,4 128,12 120,20" fill="#ef4444" />
                      </g>

                      {/* 乙车 (向左 ⬅) */}
                      <g transform={`translate(${train2X}, 104)`}>
                        <rect x="0" y="0" width="180" height="24" rx="3" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
                        <text x="90" y="16" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">乙车 (L2=180m, 12m/s ⬅)</text>
                        <polygon points="0,4 -8,12 0,20" fill="#ef4444" />
                      </g>
                    </g>
                  );
                })()
              ) : (
                // 同向超车: 快车(蓝车, 25m/s) 追赶超越 慢车(绿车, 15m/s)
                (() => {
                  const slowX = 350 + doubleProgress * 60; // 慢车微动
                  const fastX = slowX - 180 + doubleProgress * 300; // 快车从追尾到完全超越

                  return (
                    <g>
                      {/* 慢车 (前行) */}
                      <g transform={`translate(${slowX}, 44)`}>
                        <rect x="0" y="0" width="120" height="24" rx="3" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
                        <text x="60" y="16" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">慢车 (120m, 15m/s ➔)</text>
                      </g>

                      {/* 快车 (超车) */}
                      <g transform={`translate(${fastX}, 104)`}>
                        <rect x="0" y="0" width="180" height="24" rx="3" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
                        <text x="90" y="16" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">快车 (180m, 25m/s ➔)</text>
                      </g>
                    </g>
                  );
                })()
              )}
            </svg>
          </div>

          <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '14px 18px', border: '1px solid #bfdbfe' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', color: '#1e40af' }}>
              📌 双车错车/超车黄金铁律：
            </h4>
            <div style={{ fontSize: '0.875rem', color: '#1e3a8a', lineHeight: 1.6 }}>
              无论是<strong>“迎面相向错车”</strong>还是<strong>“同向追及超车”</strong>，两车完全错开时，车体相对走过的总路程<strong>永远等于两车车身长度之和（L1 + L2）</strong>！<br />
              - 相向错车用<strong>速度和</strong>：错车时间 = (L1 + L2) ÷ (v1 + v2)；<br />
              - 同向超车用<strong>速度差</strong>：超车时间 = (L1 + L2) ÷ (v1 - v2)！
            </div>
          </div>
        </div>
      )}

      {/* 模式三：名校考题与易错点闯关 */}
      {mode === 'quiz' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.05rem' }}>
              第 {quizIndex + 1} 题 / 共 {QUIZ_QUESTIONS.length} 题
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>火车过桥与错车速测</span>
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
