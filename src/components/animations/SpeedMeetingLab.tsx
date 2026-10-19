'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/animations.module.css';

type Mode = 'meeting' | 'chasing' | 'quiz';

interface QuizQuestion {
  id: number;
  type: 'meeting' | 'chasing';
  question: string;
  v1: number;
  v2: number;
  distance: number;
  correctAnswer: number;
  unit: string;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: 'meeting',
    question: '甲、乙两城相距 240 千米，客车每小时行 50 千米，货车每小时行 30 千米。两车同时从两城相对开出，几小时后相遇？',
    v1: 50,
    v2: 30,
    distance: 240,
    correctAnswer: 3,
    unit: '小时',
    explanation: '两车面对面开，每小时缩短 50 + 30 = 80 千米（速度和）。相遇时间 = 240 ÷ 80 = 3 小时。'
  },
  {
    id: 2,
    type: 'chasing',
    question: '小偷在前面 120 米处以 3 米/秒逃跑，警察以 7 米/秒在后全力追捕。警察多少秒后能抓到小偷？',
    v1: 7,
    v2: 3,
    distance: 120,
    correctAnswer: 30,
    unit: '秒',
    explanation: '警察每秒比小偷多跑 7 - 3 = 4 米（速度差），这 4 米用来吃掉 120 米的路程差。追及时间 = 120 ÷ 4 = 30 秒。'
  },
  {
    id: 3,
    type: 'meeting',
    question: 'A、B 两村相距 1800 米，小明步行 60 米/分，小红骑车 140 米/分。两人同时相向而行，多少分钟后相遇？',
    v1: 60,
    v2: 140,
    distance: 1800,
    correctAnswer: 9,
    unit: '分钟',
    explanation: '两人速度和 = 60 + 140 = 200 米/分。相遇时间 = 1800 ÷ 200 = 9 分钟。'
  }
];

export default function SpeedMeetingLab() {
  const [mode, setMode] = useState<Mode>('meeting');

  // 相遇模式参数 (km, km/h, h)
  const [meetTotalDist, setMeetTotalDist] = useState(300); // 总路程 300 km
  const [meetV1, setMeetV1] = useState(60);               // 车A速度 60 km/h
  const [meetV2, setMeetV2] = useState(40);               // 车B速度 40 km/h
  const [meetTime, setMeetTime] = useState(0);             // 当前时间 t (h)
  const [isMeetPlaying, setIsMeetPlaying] = useState(false);

  // 追及模式参数 (km, km/h, h)
  const [chaseGap, setChaseGap] = useState(120);           // 初始路程差 120 km
  const [chaseV1, setChaseV1] = useState(70);             // 快车速度 70 km/h
  const [chaseV2, setChaseV2] = useState(30);             // 慢车速度 30 km/h
  const [chaseTime, setChaseTime] = useState(0);           // 当前时间 t (h)
  const [isChasePlaying, setIsChasePlaying] = useState(false);

  // 测验状态
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isQuizCorrect, setIsQuizCorrect] = useState(false);

  const animFrameRef = useRef<number | null>(null);

  // 计算理论关键点
  // 相遇
  const meetSpeedSum = meetV1 + meetV2;
  const meetTargetTime = Number((meetTotalDist / meetSpeedSum).toFixed(2));
  const carA_meet_pos = Math.min(meetTotalDist, meetV1 * meetTime);
  const carB_meet_pos = Math.max(0, meetTotalDist - meetV2 * meetTime);
  const currentRemainGap = Math.max(0, meetTotalDist - (meetV1 + meetV2) * meetTime);

  // 追及
  const chaseSpeedDiff = Math.max(1, chaseV1 - chaseV2);
  const chaseTargetTime = Number((chaseGap / chaseSpeedDiff).toFixed(2));
  // 追赶中，快车从 0 走到 chaseV1 * chaseTime
  // 慢车从 chaseGap 走到 chaseGap + chaseV2 * chaseTime
  const carA_chase_pos = chaseV1 * chaseTime;
  const carB_chase_pos = chaseGap + chaseV2 * chaseTime;
  const currentChaseGap = Math.max(0, carB_chase_pos - carA_chase_pos);
  // 最大显示标尺长度：相遇点后加一点余量
  const maxTrackLength = chaseGap + chaseV2 * chaseTargetTime + 40;

  // 相遇动画定时循环
  useEffect(() => {
    if (!isMeetPlaying) return;

    let lastTimestamp = performance.now();
    const step = (now: number) => {
      const dt = (now - lastTimestamp) / 1000; // 秒
      lastTimestamp = now;

      // 缩放时间流速：1 秒真实时间 = 0.5 小时推演
      setMeetTime(prev => {
        const next = prev + dt * 0.6;
        if (next >= meetTargetTime) {
          setIsMeetPlaying(false);
          return meetTargetTime;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isMeetPlaying, meetTargetTime]);

  // 追及动画定时循环
  useEffect(() => {
    if (!isChasePlaying) return;

    let lastTimestamp = performance.now();
    const step = (now: number) => {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      // 缩放时间流速：1 秒真实时间 = 0.5 小时推演
      setChaseTime(prev => {
        const next = prev + dt * 0.6;
        if (next >= chaseTargetTime) {
          setIsChasePlaying(false);
          return chaseTargetTime;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isChasePlaying, chaseTargetTime]);

  // 重置时间
  const handleReset = () => {
    setIsMeetPlaying(false);
    setIsChasePlaying(false);
    setMeetTime(0);
    setChaseTime(0);
  };

  const currentQ = QUIZ_QUESTIONS[currentQuizIndex];

  const handleCheckQuiz = () => {
    const val = parseFloat(userAnswer.trim());
    if (isNaN(val)) return;
    const isCorrect = Math.abs(val - currentQ.correctAnswer) < 0.01;
    setIsQuizCorrect(isCorrect);
    setQuizSubmitted(true);
  };

  const handleNextQuiz = () => {
    setUserAnswer('');
    setQuizSubmitted(false);
    setCurrentQuizIndex((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
  };

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.titleBadge}>
          <span className={styles.badgeIcon}>🚗💨</span>
          <span className={styles.badgeText}>五年级重难点 · 动态行程实验室</span>
        </div>
        <h2 className={styles.labTitle}>行程问题：为什么相遇用速度和，追及用速度差？</h2>
        <p className={styles.labSubtitle}>
          告别死记硬背！拖动时间轴观察两车前进，直观感受“距离差距”如何被速度和/速度差一点点吞噬。
        </p>
      </div>

      {/* 模式选择按钮组 */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          className={mode === 'meeting' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('meeting'); handleReset(); }}
        >
          🤝 模式一：相遇问题 (面对面·速度和)
        </button>
        <button
          className={mode === 'chasing' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('chasing'); handleReset(); }}
        >
          🏃‍♂️ 模式二：追及问题 (同向跑·速度差)
        </button>
        <button
          className={mode === 'quiz' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('quiz'); handleReset(); }}
        >
          🎯 模式三：真题闯关演练
        </button>
      </div>

      {/* 模式一：相遇问题 */}
      {mode === 'meeting' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          {/* 控制面板 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>🚗 红车 A 速度 (v₁)</span>
                <span style={{ fontWeight: 800 }}>{meetV1} km/h</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={meetV1}
                disabled={isMeetPlaying}
                onChange={(e) => { setMeetV1(Number(e.target.value)); handleReset(); }}
                style={{ width: '100%', accentColor: '#ef4444' }}
              />
            </div>

            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#3b82f6', fontWeight: 700 }}>🚙 蓝车 B 速度 (v₂)</span>
                <span style={{ fontWeight: 800 }}>{meetV2} km/h</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={meetV2}
                disabled={isMeetPlaying}
                onChange={(e) => { setMeetV2(Number(e.target.value)); handleReset(); }}
                style={{ width: '100%', accentColor: '#3b82f6' }}
              />
            </div>

            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>📏 初始总距离 (S)</span>
                <span style={{ fontWeight: 800 }}>{meetTotalDist} km</span>
              </div>
              <input
                type="range"
                min="100"
                max="500"
                step="20"
                value={meetTotalDist}
                disabled={isMeetPlaying}
                onChange={(e) => { setMeetTotalDist(Number(e.target.value)); handleReset(); }}
                style={{ width: '100%', accentColor: '#0f172a' }}
              />
            </div>
          </div>

          {/* 实时动态舞台 (SVG 赛道) */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1rem', overflowX: 'auto', marginBottom: '1.25rem' }}>
            <svg viewBox="0 0 760 220" style={{ width: '100%', minWidth: '600px', display: 'block' }}>
              {/* 地面公路背景 */}
              <rect x="40" y="70" width="680" height="50" rx="6" fill="#334155" />
              {/* 中间公路虚线 */}
              <line x1="40" y1="95" x2="720" y2="95" stroke="#facc15" strokeWidth="2" strokeDasharray="16, 12" />

              {/* 起点与终点标牌 */}
              <text x="40" y="55" fontSize="13" fontWeight="bold" fill="#64748b" textAnchor="start">🏁 甲地 (0 km)</text>
              <text x="720" y="55" fontSize="13" fontWeight="bold" fill="#64748b" textAnchor="end">🏁 乙地 ({meetTotalDist} km)</text>

              {/* 转换比例尺：0 km -> 40, meetTotalDist -> 720 */}
              {(() => {
                const scale = 680 / meetTotalDist;
                const svgCarAPos = 40 + carA_meet_pos * scale;
                const svgCarBPos = 40 + carB_meet_pos * scale;
                const hasMet = meetTime >= meetTargetTime;

                return (
                  <>
                    {/* 红车行驶过的轨迹区间 */}
                    <rect x="40" y="125" width={Math.max(0, svgCarAPos - 40)} height="8" rx="4" fill="#f87171" opacity="0.8" />
                    {/* 蓝车行驶过的轨迹区间 */}
                    <rect x={svgCarBPos} y="125" width={Math.max(0, 720 - svgCarBPos)} height="8" rx="4" fill="#60a5fa" opacity="0.8" />

                    {/* 中间剩余尚未相遇的距离波浪/指示 */}
                    {!hasMet && (
                      <g>
                        <line x1={svgCarAPos} y1="40" x2={svgCarBPos} y2="40" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
                        <rect x={(svgCarAPos + svgCarBPos) / 2 - 50} y="28" width="100" height="24" rx="6" fill="#fef3c7" stroke="#f59e0b" />
                        <text x={(svgCarAPos + svgCarBPos) / 2} y="44" fontSize="11" fontWeight="bold" fill="#b45309" textAnchor="middle">
                          相距 {currentRemainGap.toFixed(1)} km
                        </text>
                      </g>
                    )}

                    {/* 红车 A 图标 */}
                    <g transform={`translate(${svgCarAPos - 20}, 75)`}>
                      <rect x="0" y="2" width="36" height="18" rx="5" fill="#ef4444" />
                      <circle cx="8" cy="22" r="5" fill="#1e293b" />
                      <circle cx="28" cy="22" r="5" fill="#1e293b" />
                      <text x="18" y="15" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">A →</text>
                    </g>

                    {/* 蓝车 B 图标 */}
                    <g transform={`translate(${svgCarBPos - 16}, 75)`}>
                      <rect x="0" y="2" width="36" height="18" rx="5" fill="#3b82f6" />
                      <circle cx="8" cy="22" r="5" fill="#1e293b" />
                      <circle cx="28" cy="22" r="5" fill="#1e293b" />
                      <text x="18" y="15" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">← B</text>
                    </g>

                    {/* 相遇点高亮特效 */}
                    {hasMet && (
                      <g transform={`translate(${svgCarAPos}, 55)`}>
                        <circle cx="0" cy="0" r="26" fill="#fef08a" opacity="0.6" />
                        <text x="0" y="5" fontSize="18" textAnchor="middle">💥</text>
                        <rect x="-55" y="-36" width="110" height="22" rx="6" fill="#10b981" />
                        <text x="0" y="-21" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">
                          🎉 准时相遇！
                        </text>
                      </g>
                    )}

                    {/* 下方路程分解标注 */}
                    <text x="40" y="155" fontSize="12" fill="#ef4444" fontWeight="bold">
                      A 车已走：{carA_meet_pos.toFixed(1)} km
                    </text>
                    <text x="720" y="155" fontSize="12" fill="#3b82f6" fontWeight="bold" textAnchor="end">
                      B 车已走：{(meetTotalDist - carB_meet_pos).toFixed(1)} km
                    </text>

                    {/* 刻度标尺 */}
                    <line x1="40" y1="180" x2="720" y2="180" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="40" y1="175" x2="40" y2="185" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="720" y1="175" x2="720" y2="185" stroke="#94a3b8" strokeWidth="2" />
                    <text x="40" y="198" fontSize="11" fill="#64748b" textAnchor="middle">0</text>
                    <text x="720" y="198" fontSize="11" fill="#64748b" textAnchor="middle">{meetTotalDist}</text>
                    <text x="380" y="200" fontSize="12" fontWeight="bold" fill="#475569" textAnchor="middle">
                      全程总长 S = {meetTotalDist} km
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>

          {/* 时间轴播放与拖动控件 */}
          <div style={{ background: '#fff', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  className={styles.primaryBtn}
                  onClick={() => setIsMeetPlaying(!isMeetPlaying)}
                  style={{ minWidth: '100px', padding: '0.5rem 1rem' }}
                >
                  {isMeetPlaying ? '⏸ 暂停推演' : meetTime >= meetTargetTime ? '🔁 重新播放' : '▶ 动态推演'}
                </button>
                <button
                  className={styles.secondaryBtn}
                  onClick={handleReset}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  🔄 复位 0 时
                </button>
              </div>

              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                ⏱ 当前时间：<span style={{ color: '#2563eb' }}>{meetTime.toFixed(2)}</span> / {meetTargetTime} 小时
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>0h</span>
              <input
                type="range"
                min="0"
                max={meetTargetTime}
                step="0.05"
                value={meetTime}
                onChange={(e) => {
                  setIsMeetPlaying(false);
                  setMeetTime(Number(e.target.value));
                }}
                style={{ flex: 1, accentColor: '#2563eb' }}
              />
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{meetTargetTime}h</span>
            </div>
          </div>

          {/* 公式原理解剖卡片 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '1rem', border: '1px solid #bfdbfe' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1d4ed8', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                💡 为什么除以“速度和”？
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e40af', lineHeight: 1.6 }}>
                A车每小时走 <strong>{meetV1} km</strong>，B车每小时走 <strong>{meetV2} km</strong>。
                <br />
                两车面对面开，<strong>每过 1 小时，他们之间的总距离就缩短了 ({meetV1} + {meetV2}) = {meetSpeedSum} km</strong>！
                <br />
                这就叫两车“共同分担”全程：
              </p>
              <div style={{ margin: '0.6rem 0 0', padding: '0.5rem', background: '#fff', borderRadius: '8px', fontWeight: 800, color: '#1e3a8a', textAlign: 'center', fontSize: '1.05rem' }}>
                相遇时间 = 总路程 ÷ (速度A + 速度B)
                <br />
                <span style={{ color: '#2563eb', fontSize: '0.95rem' }}>
                  {meetTotalDist} ÷ ({meetV1} + {meetV2}) = {meetTargetTime} 小时
                </span>
              </div>
            </div>

            <div style={{ background: '#fdf2f8', borderRadius: '12px', padding: '1rem', border: '1px solid #fbcfe8' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#be185d', fontSize: '1rem' }}>
                🔍 家长考点避坑小贴士
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#9d174d', lineHeight: 1.6 }}>
                <li><strong>坑点 1：</strong>孩子分不清两人各自走了多远。请指着红蓝双色彩条告诉他：<code>A的路程 = 速度A × 相遇时间</code>，两人路程加起来刚好等于全程！</li>
                <li><strong>坑点 2：</strong>如果不是同时出发？先算先走的人走了多远，<strong>剩下的距离再用速度和来除</strong>！</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 模式二：追及问题 */}
      {mode === 'chasing' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          {/* 控制面板 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>🏎 快车 A 速度 (v₁)</span>
                <span style={{ fontWeight: 800 }}>{chaseV1} km/h</span>
              </div>
              <input
                type="range"
                min={chaseV2 + 5}
                max="120"
                step="5"
                value={chaseV1}
                disabled={isChasePlaying}
                onChange={(e) => { setChaseV1(Number(e.target.value)); handleReset(); }}
                style={{ width: '100%', accentColor: '#16a34a' }}
              />
            </div>

            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#d97706', fontWeight: 700 }}>🚜 慢车 B 速度 (v₂)</span>
                <span style={{ fontWeight: 800 }}>{chaseV2} km/h</span>
              </div>
              <input
                type="range"
                min="10"
                max={Math.max(15, chaseV1 - 5)}
                step="5"
                value={chaseV2}
                disabled={isChasePlaying}
                onChange={(e) => { setChaseV2(Number(e.target.value)); handleReset(); }}
                style={{ width: '100%', accentColor: '#d97706' }}
              />
            </div>

            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#9333ea', fontWeight: 700 }}>⚡ 初始路程差 (S差)</span>
                <span style={{ fontWeight: 800 }}>{chaseGap} km</span>
              </div>
              <input
                type="range"
                min="30"
                max="200"
                step="10"
                value={chaseGap}
                disabled={isChasePlaying}
                onChange={(e) => { setChaseGap(Number(e.target.value)); handleReset(); }}
                style={{ width: '100%', accentColor: '#9333ea' }}
              />
            </div>
          </div>

          {/* 实时动态追击舞台 (SVG) */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1rem', overflowX: 'auto', marginBottom: '1.25rem' }}>
            <svg viewBox="0 0 760 230" style={{ width: '100%', minWidth: '600px', display: 'block' }}>
              {/* 地面双车道背景 */}
              <rect x="30" y="55" width="700" height="40" rx="5" fill="#334155" />
              <rect x="30" y="105" width="700" height="40" rx="5" fill="#1e293b" />

              {/* 车道文字 */}
              <text x="35" y="45" fontSize="11" fontWeight="bold" fill="#64748b">快车 A 车道 (后方 0 km 处发起追击)</text>
              <text x="35" y="160" fontSize="11" fontWeight="bold" fill="#64748b">慢车 B 车道 (前方 {chaseGap} km 处先行)</text>

              {(() => {
                const scale = 660 / maxTrackLength;
                const svgCarAPos = 40 + carA_chase_pos * scale;
                const svgCarBPos = 40 + carB_chase_pos * scale;
                const hasCaught = chaseTime >= chaseTargetTime;

                return (
                  <>
                    {/* 初始路程差虚线框 */}
                    <rect x="40" y="102" width={chaseGap * scale} height="46" rx="4" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,4" />
                    <text x={40 + (chaseGap * scale) / 2} y="128" fontSize="11" fontWeight="bold" fill="#c084fc" textAnchor="middle">
                      初始差距 {chaseGap} km
                    </text>

                    {/* 快车 A 图标 (绿跑车) */}
                    <g transform={`translate(${svgCarAPos - 20}, 62)`}>
                      <rect x="0" y="2" width="38" height="18" rx="5" fill="#16a34a" />
                      <circle cx="8" cy="22" r="5" fill="#0f172a" />
                      <circle cx="30" cy="22" r="5" fill="#0f172a" />
                      <text x="19" y="15" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">快车A→</text>
                    </g>

                    {/* 慢车 B 图标 (黄拖拉机) */}
                    <g transform={`translate(${svgCarBPos - 20}, 112)`}>
                      <rect x="0" y="2" width="38" height="18" rx="5" fill="#d97706" />
                      <circle cx="8" cy="22" r="5" fill="#0f172a" />
                      <circle cx="30" cy="22" r="5" fill="#0f172a" />
                      <text x="19" y="15" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">慢车B→</text>
                    </g>

                    {/* 当前两车剩余差距连线 */}
                    {!hasCaught && (
                      <g>
                        <line x1={svgCarAPos} y1="75" x2={svgCarBPos} y2="125" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
                        <rect x={(svgCarAPos + svgCarBPos) / 2 - 55} y="88" width="110" height="22" rx="5" fill="#fee2e2" stroke="#ef4444" />
                        <text x={(svgCarAPos + svgCarBPos) / 2} y="103" fontSize="11" fontWeight="bold" fill="#b91c1c" textAnchor="middle">
                          还差 {currentChaseGap.toFixed(1)} km
                        </text>
                      </g>
                    )}

                    {/* 追上庆祝特效 */}
                    {hasCaught && (
                      <g transform={`translate(${svgCarAPos}, 85)`}>
                        <circle cx="0" cy="15" r="30" fill="#86efac" opacity="0.6" />
                        <text x="0" y="22" fontSize="22" textAnchor="middle">🚨</text>
                        <rect x="-65" y="-30" width="130" height="24" rx="6" fill="#15803d" />
                        <text x="0" y="-14" fontSize="12" fontWeight="bold" fill="#fff" textAnchor="middle">
                          🎯 齐头并进！成功追上！
                        </text>
                      </g>
                    )}

                    {/* 刻度底尺 */}
                    <line x1="40" y1="185" x2="700" y2="185" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="40" y1="180" x2="40" y2="190" stroke="#94a3b8" strokeWidth="2" />
                    <text x="40" y="205" fontSize="11" fill="#64748b" textAnchor="middle">0 km</text>
                    <text x="370" y="210" fontSize="12" fontWeight="bold" fill="#334155" textAnchor="middle">
                      追及点总行程：{carA_chase_pos.toFixed(1)} km (用时 {chaseTime.toFixed(2)} 小时)
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>

          {/* 时间轴播放与拖动控件 */}
          <div style={{ background: '#fff', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  className={styles.primaryBtn}
                  onClick={() => setIsChasePlaying(!isChasePlaying)}
                  style={{ minWidth: '100px', padding: '0.5rem 1rem' }}
                >
                  {isChasePlaying ? '⏸ 暂停追击' : chaseTime >= chaseTargetTime ? '🔁 重新追击' : '▶ 动态追赶'}
                </button>
                <button
                  className={styles.secondaryBtn}
                  onClick={handleReset}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  🔄 复位 0 时
                </button>
              </div>

              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                ⏱ 当前时间：<span style={{ color: '#16a34a' }}>{chaseTime.toFixed(2)}</span> / {chaseTargetTime} 小时
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>0h</span>
              <input
                type="range"
                min="0"
                max={chaseTargetTime}
                step="0.05"
                value={chaseTime}
                onChange={(e) => {
                  setIsChasePlaying(false);
                  setChaseTime(Number(e.target.value));
                }}
                style={{ flex: 1, accentColor: '#16a34a' }}
              />
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{chaseTargetTime}h</span>
            </div>
          </div>

          {/* 公式原理解剖卡片 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '1rem', border: '1px solid #bbf7d0' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#15803d', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                💡 为什么除以“速度差”？
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#166534', lineHeight: 1.6 }}>
                慢车在前逃，快车在后追。
                <br />
                快车每小时跑 <strong>{chaseV1} km</strong>，慢车跑 <strong>{chaseV2} km</strong>。
                <br />
                <strong>快车每小时仅仅比慢车多跑了 ({chaseV1} - {chaseV2}) = {chaseSpeedDiff} km</strong>！
                <br />
                这多跑出来的 {chaseSpeedDiff} km，就是专门用来一点点<strong>“蚕食”那 {chaseGap} km 初始落后差距</strong>的！
              </p>
              <div style={{ margin: '0.6rem 0 0', padding: '0.5rem', background: '#fff', borderRadius: '8px', fontWeight: 800, color: '#14532d', textAlign: 'center', fontSize: '1.05rem' }}>
                追及时间 = 路程差 ÷ (快车速度 - 慢车速度)
                <br />
                <span style={{ color: '#16a34a', fontSize: '0.95rem' }}>
                  {chaseGap} ÷ ({chaseV1} - {chaseV2}) = {chaseTargetTime} 小时
                </span>
              </div>
            </div>

            <div style={{ background: '#fefce8', borderRadius: '12px', padding: '1rem', border: '1px solid #fef08a' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#854d0e', fontSize: '1rem' }}>
                🌟 一句话秒记口诀
              </h4>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 700, color: '#713f12', lineHeight: 1.6 }}>
                “相向而行共分担，加在一起速度和；
                <br />
                同向追赶吃差距，多跑一点速度差！”
              </p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#a16207', lineHeight: 1.5 }}>
                在草稿纸上画一条线段图：两个箭头头对头就是“相遇（和）”，两个箭头朝同一个方向就是“追及（差）”！
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 模式三：真题闯关测验 */}
      {mode === 'quiz' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
              第 {currentQuizIndex + 1} / {QUIZ_QUESTIONS.length} 题 · {currentQ.type === 'meeting' ? '相遇问题' : '追及问题'}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>考查：公式理解与逆向推演</span>
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #cbd5e1', marginBottom: '1.25rem' }}>
            <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.6 }}>
              {currentQ.question}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <input
              type="number"
              placeholder="输入你的答案（数字）"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={quizSubmitted && isQuizCorrect}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '2px solid #94a3b8',
                fontSize: '1rem',
                outline: 'none'
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCheckQuiz(); }}
            />
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#475569' }}>{currentQ.unit}</span>
            <button
              className={styles.primaryBtn}
              onClick={handleCheckQuiz}
              disabled={!userAnswer.trim()}
              style={{ padding: '0.75rem 1.25rem' }}
            >
              提交核对
            </button>
          </div>

          {/* 反馈与解析 */}
          {quizSubmitted && (
            <div style={{
              background: isQuizCorrect ? '#f0fdf4' : '#fef2f2',
              borderRadius: '12px',
              padding: '1.25rem',
              border: `1px solid ${isQuizCorrect ? '#86efac' : '#fca5a5'}`,
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{isQuizCorrect ? '🎉' : '🤔'}</span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: isQuizCorrect ? '#15803d' : '#b91c1c' }}>
                  {isQuizCorrect ? '太棒了，完全正确！' : '再想想，答案不太对哦'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: isQuizCorrect ? '#166534' : '#991b1b', lineHeight: 1.6 }}>
                <strong>思路解析：</strong> {currentQ.explanation}
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className={styles.primaryBtn}
                  onClick={handleNextQuiz}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  下一题 ➔
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
