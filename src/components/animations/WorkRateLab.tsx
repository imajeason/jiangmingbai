'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/animations.module.css';

type Mode = 'collab' | 'fallacy' | 'quiz';

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
    question: '修一条路，甲队独修 12 天完成，乙队独修 6 天完成。两队合修几天可以完成？',
    options: ['9 天', '4 天', '8 天', '3 天'],
    correctIndex: 1,
    explanation: '甲队效率 1/12，乙队效率 1/6。合作效率 = 1/12 + 1/6 = 3/12 = 1/4。合做天数 = 1 ÷ (1/4) = 4 天！千万不能 (12+6)÷2 = 9 天！'
  },
  {
    id: 2,
    question: '一个水池装有甲、乙两个进水管。单开甲管 8 小时注满，单开乙管 12 小时注满。两管齐开几小时注满？',
    options: ['10 小时', '4.8 小时', '5 小时', '6 小时'],
    correctIndex: 1,
    explanation: '两管齐开效率 = 1/8 + 1/12 = 5/24。注满时间 = 1 ÷ (5/24) = 24/5 = 4.8 小时。'
  },
  {
    id: 3,
    question: '加工一批零件，师傅独做 10 天完成，徒弟独做 15 天完成。师徒合做 4 天后，还剩下这批零件的几分之几没做？',
    options: ['1/3', '2/3', '1/6', '1/2'],
    correctIndex: 0,
    explanation: '师徒合作每天完成 1/10 + 1/15 = 1/6。合做 4 天完成了 4 × (1/6) = 2/3。剩下的部分 = 1 - 2/3 = 1/3。'
  }
];

export default function WorkRateLab() {
  const [mode, setMode] = useState<Mode>('collab');

  // 参数 (天数)
  const [daysA, setDaysA] = useState(10); // 甲独做天数
  const [daysB, setDaysB] = useState(15); // 乙独做天数
  const [currentDay, setCurrentDay] = useState(0); // 当前推演天数
  const [isPlaying, setIsPlaying] = useState(false);

  // 测验
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const animRef = useRef<number | null>(null);

  // 理论计算
  const rateA = 1 / daysA;
  const rateB = 1 / daysB;
  const combinedRate = rateA + rateB;
  const targetDays = Number((1 / combinedRate).toFixed(2));

  // 当前总进度 (0 ~ 1)
  const currentProgress = Math.min(1, currentDay * combinedRate);
  const progressA = Math.min(1, currentDay * rateA);
  const progressB = Math.min(1, currentDay * rateB);

  // 动画循环
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setCurrentDay((prev) => {
        const next = prev + dt * 1.5; // 流速
        if (next >= targetDays) {
          setIsPlaying(false);
          return targetDays;
        }
        return next;
      });

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, targetDays]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentDay(0);
  };

  const currentQ = QUIZ_QUESTIONS[quizIndex];

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.titleBadge}>
          <span className={styles.badgeIcon}>🏗️🚰</span>
          <span className={styles.badgeText}>六年级分数应用题 · 核心工程模型</span>
        </div>
        <h2 className={styles.labTitle}>工程问题：把工作总量看作单位“1”</h2>
        <p className={styles.labSubtitle}>
          为什么甲 10 天、乙 15 天，合做不是 12.5 天而是 6 天？看两队合力筑路，破解效率与时间的倒数密码。
        </p>
      </div>

      {/* 模式选择 */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          className={mode === 'collab' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('collab'); handleReset(); }}
        >
          🤝 模式一：双人合力动态筑路推演
        </button>
        <button
          className={mode === 'fallacy' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('fallacy'); }}
        >
          🚨 模式二：为什么 (10+15)÷2 = 12.5 荒谬至极？
        </button>
        <button
          className={mode === 'quiz' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => setMode('quiz')}
        >
          🎯 模式三：真题实战大闯关
        </button>
      </div>

      {/* 模式一：合力筑路 */}
      {mode === 'collab' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          {/* 控制面板 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#2563eb' }}>👷 甲独做天数</span>
                <span style={{ fontWeight: 800 }}>{daysA} 天 (每天 1/{daysA})</span>
              </div>
              <input
                type="range"
                min="6"
                max="24"
                step="2"
                value={daysA}
                disabled={isPlaying}
                onChange={(e) => { setDaysA(Number(e.target.value)); handleReset(); }}
                style={{ width: '100%', accentColor: '#2563eb' }}
              />
            </div>

            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#d97706' }}>👷 乙独做天数</span>
                <span style={{ fontWeight: 800 }}>{daysB} 天 (每天 1/{daysB})</span>
              </div>
              <input
                type="range"
                min="6"
                max="30"
                step="2"
                value={daysB}
                disabled={isPlaying}
                onChange={(e) => { setDaysB(Number(e.target.value)); handleReset(); }}
                style={{ width: '100%', accentColor: '#d97706' }}
              />
            </div>

            {/* 播放控制 */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                className={styles.primaryBtn}
                onClick={() => {
                  if (currentDay >= targetDays) setCurrentDay(0);
                  setIsPlaying(!isPlaying);
                }}
                style={{ flex: 1, padding: '0.85rem' }}
              >
                {isPlaying ? '⏸ 暂停推演' : currentDay >= targetDays ? '🔁 重新施工' : '▶ 合力开工'}
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={handleReset}
                style={{ padding: '0.85rem' }}
              >
                🔄 复位
              </button>
            </div>
          </div>

          {/* SVG 进度大舞台 */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.25rem', overflowX: 'auto', marginBottom: '1.25rem' }}>
            <svg viewBox="0 0 760 230" style={{ width: '100%', minWidth: '600px', display: 'block' }}>
              {/* 标尺 0 ~ 1 */}
              <text x="50" y="25" fontSize="12" fontWeight="bold" fill="#64748b">起点 0</text>
              <text x="690" y="25" fontSize="12" fontWeight="bold" fill="#64748b" textAnchor="end">竣工 单位“1” (100%)</text>

              {/* ───────────────── 槽位 1：甲单人的贡献 ───────────────── */}
              <g transform="translate(50, 40)">
                <text x="0" y="18" fontSize="12" fontWeight="bold" fill="#2563eb">甲队贡献 (1/{daysA}/天):</text>
                <rect x="140" y="4" width="500" height="20" rx="4" fill="#eff6ff" stroke="#bfdbfe" />
                <rect x="140" y="4" width={500 * progressA} height="20" rx="4" fill="#3b82f6" />
                <text x={140 + 500 * progressA + 10} y="19" fontSize="11" fontWeight="bold" fill="#2563eb">
                  {(progressA * 100).toFixed(1)}%
                </text>
              </g>

              {/* ───────────────── 槽位 2：乙单人的贡献 ───────────────── */}
              <g transform="translate(50, 80)">
                <text x="0" y="18" fontSize="12" fontWeight="bold" fill="#d97706">乙队贡献 (1/{daysB}/天):</text>
                <rect x="140" y="4" width="500" height="20" rx="4" fill="#fffbeb" stroke="#fde68a" />
                <rect x="140" y="4" width={500 * progressB} height="20" rx="4" fill="#f59e0b" />
                <text x={140 + 500 * progressB + 10} y="19" fontSize="11" fontWeight="bold" fill="#d97706">
                  {(progressB * 100).toFixed(1)}%
                </text>
              </g>

              {/* ───────────────── 槽位 3：两队合力总工程进度 ───────────────── */}
              <g transform="translate(50, 130)">
                <text x="0" y="24" fontSize="13" fontWeight="900" fill="#0f172a">🏆 合力总进度条:</text>
                {/* 槽底 */}
                <rect x="140" y="4" width="500" height="34" rx="6" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
                {/* 甲贡献的部分 (蓝色) */}
                <rect x="140" y="4" width={500 * progressA} height="34" rx="6" fill="#3b82f6" />
                {/* 乙贡献的部分 (橙色，拼在甲后面) */}
                <rect x={140 + 500 * progressA} y="4" width={Math.max(0, 500 * (currentProgress - progressA))} height="34" rx="6" fill="#f59e0b" />

                {/* 竣工特效 */}
                {currentProgress >= 1 && (
                  <g transform="translate(390, 22)">
                    <rect x="-60" y="-14" width="120" height="26" rx="6" fill="#15803d" />
                    <text x="0" y="4" fontSize="12" fontWeight="bold" fill="#fff" textAnchor="middle">
                      🎉 100% 完美竣工！
                    </text>
                  </g>
                )}

                <text x="650" y="26" fontSize="14" fontWeight="900" fill="#15803d">
                  {(currentProgress * 100).toFixed(1)}%
                </text>
              </g>

              {/* 底部施工天数指针 */}
              <g transform="translate(50, 195)">
                <text x="0" y="15" fontSize="13" fontWeight="bold" fill="#475569">
                  ⏱ 已施工：<strong style={{ color: '#2563eb', fontSize: '1.2rem' }}>{currentDay.toFixed(2)}</strong> 天 / 预计 {targetDays} 天竣工
                </text>
              </g>
            </svg>
          </div>

          {/* 时间拖动滑块 */}
          <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '0.4rem' }}>
              <span>第 0 天 (开工)</span>
              <span>拖动时间滑块手动推演</span>
              <span>第 {targetDays} 天 (竣工)</span>
            </div>
            <input
              type="range"
              min="0"
              max={targetDays}
              step="0.05"
              value={currentDay}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentDay(Number(e.target.value));
              }}
              style={{ width: '100%', accentColor: '#2563eb' }}
            />
          </div>

          {/* 核心算理解析 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #bfdbfe' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1d4ed8', fontSize: '1.05rem' }}>
                💡 为什么除以“效率和”？
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e40af', lineHeight: 1.6 }}>
                把整条路的总工程量看作 <strong>1</strong>。
                <br />
                甲每天修 <code>1/{daysA}</code>，乙每天修 <code>1/{daysB}</code>。
                <br />
                两队合作，每天合力推进的工作量就是：
                <br />
                <strong>1/{daysA} + 1/{daysB} = {combinedRate.toFixed(3)} (约 1/{targetDays})</strong>
                <br />
                工作总量 1 里面有几个“合作效率”，就需要干几天：
              </p>
              <div style={{ marginTop: '0.6rem', padding: '0.6rem', background: '#fff', borderRadius: '8px', fontWeight: 900, color: '#1e3a8a', textAlign: 'center', fontSize: '1.05rem' }}>
                合做天数 = 1 ÷ (甲效率 + 乙效率)
                <br />
                <span style={{ color: '#2563eb', fontSize: '0.95rem' }}>
                  = 1 ÷ (1/{daysA} + 1/{daysB}) = {targetDays} 天
                </span>
              </div>
            </div>

            <div style={{ background: '#fefce8', borderRadius: '12px', padding: '1.25rem', border: '1px solid #fef08a' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#854d0e', fontSize: '1.05rem' }}>
                🌟 一句话口诀记住工程问题
              </h4>
              <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '8px', border: '1px solid #fde047', fontWeight: 800, fontSize: '0.95rem', color: '#713f12', lineHeight: 1.7, marginBottom: '0.5rem' }}>
                “工程总量看作 1，
                <br />
                天数倒数是效率；
                <br />
                合作干活效率加，
                <br />
                总量除以效率和！”
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#a16207', lineHeight: 1.5 }}>
                永远记住：合作干活肯定比单个人干更快！算出的合做天数如果比其中任何一个人的天数还大，说明算错了！
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 模式二：荒谬错误对比 */}
      {mode === 'fallacy' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', maxWidth: '640px', margin: '0 auto' }}>
          <h3 style={{ margin: '0 0 0.75rem 0', color: '#b91c1c', fontSize: '1.2rem', textAlign: 'center' }}>
            🚨 考场经典翻车：为什么 (10 + 15) ÷ 2 = 12.5 荒唐可笑？
          </h3>

          <div style={{ background: '#fee2e2', borderRadius: '12px', padding: '1.25rem', border: '1px solid #fca5a5', marginBottom: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.4rem 0', color: '#991b1b', fontSize: '1rem' }}>
              ❌ 孩子的错误逻辑（天数平均）：
            </h4>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#7f1d1d', lineHeight: 1.6 }}>
              “甲用 10 天，乙用 15 天，两个人合做不就是求平均数吗？(10 + 15) ÷ 2 = 12.5 天！”
            </p>
          </div>

          <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '1.25rem', border: '1px solid #86efac', marginBottom: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.4rem 0', color: '#15803d', fontSize: '1rem' }}>
              💡 家长反问破局（物理常识直觉）：
            </h4>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.92rem', color: '#166534', lineHeight: 1.6 }}>
              “甲一个人埋头苦干，<strong>10 天就能全部干完</strong>！
              <br />
              现在请了乙来帮忙，两个人一起干，<strong>怎么可能反而变成了 12.5 天？！难道乙是来捣乱帮倒忙的吗？！</strong>”
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#14532d' }}>
              👉 只要两个人一起干，完工时间必须【远远少于 10 天】！正确答案是 6 天！
            </p>
          </div>
        </div>
      )}

      {/* 模式三：真题闯关 */}
      {mode === 'quiz' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
              第 {quizIndex + 1} / {QUIZ_QUESTIONS.length} 题 · 工程与水管问题
            </span>
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #cbd5e1', marginBottom: '1.25rem' }}>
            <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.6 }}>
              {currentQ.question}
            </p>
          </div>

          {/* 选项组 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              let btnStyle: React.CSSProperties = {
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                background: '#fff',
                fontSize: '0.95rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s'
              };
              if (isSelected) {
                btnStyle.borderColor = '#2563eb';
                btnStyle.background = '#eff6ff';
                btnStyle.color = '#1d4ed8';
              }
              if (quizSubmitted) {
                if (idx === currentQ.correctIndex) {
                  btnStyle.borderColor = '#16a34a';
                  btnStyle.background = '#f0fdf4';
                  btnStyle.color = '#15803d';
                } else if (isSelected && idx !== currentQ.correctIndex) {
                  btnStyle.borderColor = '#dc2626';
                  btnStyle.background = '#fef2f2';
                  btnStyle.color = '#b91c1c';
                }
              }

              return (
                <button
                  key={idx}
                  style={btnStyle}
                  disabled={quizSubmitted}
                  onClick={() => setSelectedOpt(idx)}
                >
                  {String.fromCharCode(65 + idx)}. {opt}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            {!quizSubmitted ? (
              <button
                className={styles.primaryBtn}
                onClick={() => setQuizSubmitted(true)}
                disabled={selectedOpt === null}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                确认提交
              </button>
            ) : (
              <button
                className={styles.primaryBtn}
                onClick={() => {
                  setSelectedOpt(null);
                  setQuizSubmitted(false);
                  setQuizIndex((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
                }}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                下一题 ➔
              </button>
            )}
          </div>

          {/* 解析 */}
          {quizSubmitted && (
            <div style={{
              background: selectedOpt === currentQ.correctIndex ? '#f0fdf4' : '#fef2f2',
              borderRadius: '12px',
              padding: '1.25rem',
              border: `1px solid ${selectedOpt === currentQ.correctIndex ? '#86efac' : '#fca5a5'}`,
              marginTop: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>{selectedOpt === currentQ.correctIndex ? '🎉' : '❌'}</span>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: selectedOpt === currentQ.correctIndex ? '#15803d' : '#b91c1c' }}>
                  {selectedOpt === currentQ.correctIndex ? '回答正确！' : '回答错误，请看深度解析：'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: selectedOpt === currentQ.correctIndex ? '#166534' : '#991b1b', lineHeight: 1.6 }}>
                {currentQ.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
