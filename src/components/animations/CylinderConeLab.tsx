'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type Mode = 'pour' | 'carve' | 'quiz';

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
    question: '把一个底面积是 18 平方厘米、高是 5 厘米的圆柱形木料，削成一个最大的圆锥，这个圆锥的体积是多少立方厘米？',
    options: ['90 cm³', '30 cm³', '60 cm³', '45 cm³'],
    correctIndex: 1,
    explanation: '圆柱体积 = 18 × 5 = 90 cm³。削成最大的等底等高圆锥，圆锥体积占圆柱的 1/3，所以是 90 ÷ 3 = 30 cm³。'
  },
  {
    id: 2,
    question: '削去部分的体积（木屑）占原来圆柱体积的几分之几？削去部分的体积是圆锥体积的几倍？',
    options: ['占 1/3，是圆锥的 1 倍', '占 2/3，是圆锥的 2 倍', '占 1/2，是圆锥的 3 倍', '占 3/4，是圆锥的 1/3 倍'],
    correctIndex: 1,
    explanation: '圆柱是 3 份，圆锥占 1 份，削去的木屑是 3 - 1 = 2 份。所以削去部分占原圆柱的 2/3，是圆锥的 2 倍！'
  },
  {
    id: 3,
    question: '一个圆柱和一个圆锥的“体积相等”，它们的高也相等。如果圆柱的底面积是 12 cm²，那么圆锥的底面积是多少？',
    options: ['4 cm²', '12 cm²', '36 cm²', '24 cm²'],
    correctIndex: 2,
    explanation: '体积相等且高相等时，圆锥必须在底面积上“膨胀 3 倍”来弥补 1/3 的亏空！所以圆锥底面积 = 12 × 3 = 36 cm²。'
  }
];

export default function CylinderConeLab() {
  const [mode, setMode] = useState<Mode>('pour');

  // 参数 (cm)
  const [radius, setRadius] = useState(4); // 半径 r
  const [height, setHeight] = useState(10); // 高 h

  // 倒水次数 (0, 1, 2, 3)
  const [pourCount, setPourCount] = useState(0);
  const [isPouringAnim, setIsPouringAnim] = useState(false);

  // 削铅笔削去比例 (0 ~ 100%)
  const [carveProgress, setCarveProgress] = useState(0);

  // 测验状态
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // 数学计算
  const pi = Math.PI;
  const baseArea = pi * radius * radius;
  const cylinderVol = baseArea * height;
  const coneVol = cylinderVol / 3;
  const wasteVol = cylinderVol * (2 / 3);

  // 处理倒水单步
  const handlePourStep = () => {
    if (pourCount >= 3) {
      setPourCount(0);
      return;
    }
    setIsPouringAnim(true);
    setTimeout(() => {
      setPourCount(prev => prev + 1);
      setIsPouringAnim(false);
    }, 600);
  };

  const handleResetPour = () => {
    setPourCount(0);
    setIsPouringAnim(false);
  };

  const currentQ = QUIZ_QUESTIONS[quizIndex];

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.titleBadge}>
          <span className={styles.badgeIcon}>💧🧪</span>
          <span className={styles.badgeText}>六年级下册重点 · 空间几何实验室</span>
        </div>
        <h2 className={styles.labTitle}>圆柱与圆锥：等底等高倒水实验（为什么是 1/3？）</h2>
        <p className={styles.labSubtitle}>
          为什么圆锥体积公式必须乘以 1/3？通过 3 次精准注水与削铅笔雕刻，彻底掌握圆柱与圆锥的体积倍数密码。
        </p>
      </div>

      {/* 模式选择 */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          className={mode === 'pour' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('pour'); handleResetPour(); }}
        >
          🧪 模式一：等底等高 3 次倒水实验
        </button>
        <button
          className={mode === 'carve' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('carve'); }}
        >
          ✏️ 模式二：圆柱削铅笔 (切除 2/3 木料)
        </button>
        <button
          className={mode === 'quiz' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('quiz'); }}
        >
          🎯 模式三：小升初考点大冲关
        </button>
      </div>

      {/* 模式一：3次倒水实验 */}
      {mode === 'pour' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          {/* 尺寸滑块 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>🔘 底面半径 r</span>
                <span style={{ fontWeight: 800, color: '#2563eb' }}>{radius} cm (直径 {radius * 2} cm)</span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                step="1"
                value={radius}
                onChange={(e) => { setRadius(Number(e.target.value)); handleResetPour(); }}
                style={{ width: '100%', accentColor: '#2563eb' }}
              />
            </div>

            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>📏 容器高度 h</span>
                <span style={{ fontWeight: 800, color: '#059669' }}>{height} cm</span>
              </div>
              <input
                type="range"
                min="6"
                max="15"
                step="1"
                value={height}
                onChange={(e) => { setHeight(Number(e.target.value)); handleResetPour(); }}
                style={{ width: '100%', accentColor: '#059669' }}
              />
            </div>

            {/* 倒水控制按钮 */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                className={styles.primaryBtn}
                onClick={handlePourStep}
                disabled={isPouringAnim}
                style={{ flex: 1, padding: '0.85rem' }}
              >
                {isPouringAnim ? '🌊 正在倾倒中...' : pourCount === 3 ? '🔁 清空水杯' : `💧 倒入第 ${pourCount + 1} 锥水`}
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={handleResetPour}
                style={{ padding: '0.85rem' }}
              >
                🔄 复位
              </button>
            </div>
          </div>

          {/* SVG 容器展示舞台 */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1rem', overflowX: 'auto', marginBottom: '1.25rem' }}>
            <svg viewBox="0 0 760 280" style={{ width: '100%', minWidth: '600px', display: 'block' }}>
              <defs>
                {/* 水面渐变 */}
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.5" />
                </linearGradient>
              </defs>

              {/* 顶部标语 */}
              <text x="380" y="24" fontSize="13" fontWeight="bold" fill="#475569" textAnchor="middle">
                严格保证：【等底】(底直径均为 {radius * 2} cm) 且 【等高】(高均为 {height} cm)
              </text>

              {/* ───────────────── 左侧：圆锥透明量杯 ───────────────── */}
              <g transform="translate(160, 40)">
                <text x="80" y="0" fontSize="12" fontWeight="bold" fill="#0369a1" textAnchor="middle">
                  🔺 圆锥透明量杯 (V锥 = ⅓Sh)
                </text>

                {/* 圆锥水体 (如果正在倒水或者未倒完) */}
                <polygon
                  points="10,25 150,25 80,185"
                  fill="url(#waterGrad)"
                  opacity={isPouringAnim ? 0.3 : 0.85}
                  style={{ transition: 'opacity 0.4s' }}
                />
                {/* 圆锥水面椭圆 */}
                <ellipse cx="80" cy="25" rx="70" ry="12" fill="#7dd3fc" opacity="0.9" />

                {/* 圆锥外轮廓玻璃罩 */}
                <line x1="10" y1="25" x2="80" y2="185" stroke="#0284c7" strokeWidth="2.5" />
                <line x1="150" y1="25" x2="80" y2="185" stroke="#0284c7" strokeWidth="2.5" />
                <ellipse cx="80" cy="25" rx="70" ry="12" fill="url(#glassGrad)" stroke="#0284c7" strokeWidth="2" />

                {/* 圆锥高度虚线标注 */}
                <line x1="80" y1="25" x2="80" y2="185" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
                <text x="88" y="110" fontSize="11" fill="#dc2626" fontWeight="bold">h = {height}cm</text>
                <text x="80" y="205" fontSize="11" fill="#0369a1" fontWeight="bold" textAnchor="middle">
                  单锥容积：{coneVol.toFixed(1)} cm³
                </text>
              </g>

              {/* ───────────────── 中间：倒水动态水流 ───────────────── */}
              {isPouringAnim && (
                <g>
                  <path
                    d="M 240 100 Q 320 60 400 130"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="6"
                    strokeDasharray="10 5"
                    strokeLinecap="round"
                  />
                  <text x="320" y="70" fontSize="12" fontWeight="bold" fill="#0284c7" textAnchor="middle">
                    倾倒中 ➔
                  </text>
                </g>
              )}

              {/* ───────────────── 右侧：圆柱透明收集桶 ───────────────── */}
              <g transform="translate(440, 40)">
                <text x="90" y="0" fontSize="12" fontWeight="bold" fill="#15803d" textAnchor="middle">
                  🏛 圆柱透明容器 (V柱 = Sh)
                </text>

                {/* 筒身背景 */}
                <rect x="20" y="25" width="140" height="160" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />

                {/* 1/3, 2/3, 3/3 刻度线 */}
                <line x1="20" y1="131.6" x2="160" y2="131.6" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="168" y="135" fontSize="11" fill="#64748b">⅓ 处 (第 1 锥)</text>

                <line x1="20" y1="78.3" x2="160" y2="78.3" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="168" y="82" fontSize="11" fill="#64748b">⅔ 处 (第 2 锥)</text>

                <line x1="20" y1="25" x2="160" y2="25" stroke="#15803d" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="168" y="29" fontSize="11" fill="#15803d" fontWeight="bold">满杯 1 (第 3 锥)</text>

                {/* 实际倒入的水深柱 */}
                {(() => {
                  const waterHeight = (pourCount / 3) * 160;
                  const waterY = 185 - waterHeight;
                  if (pourCount === 0) return null;
                  return (
                    <g style={{ transition: 'all 0.5s ease' }}>
                      <rect x="20" y={waterY} width="140" height={waterHeight} fill="url(#waterGrad)" />
                      {/* 水面椭圆 */}
                      <ellipse cx="90" cy={waterY} rx="70" ry="10" fill="#7dd3fc" opacity="0.9" />
                      {/* 水量标签 */}
                      <text x="90" y={waterY + waterHeight / 2 + 5} fontSize="12" fontWeight="bold" fill="#fff" textAnchor="middle">
                        {(coneVol * pourCount).toFixed(1)} cm³ ({pourCount}/3)
                      </text>
                    </g>
                  );
                })()}

                {/* 圆柱顶底椭圆与玻璃轮廓 */}
                <ellipse cx="90" cy="25" rx="70" ry="12" fill="url(#glassGrad)" stroke="#64748b" strokeWidth="2" />
                <ellipse cx="90" cy="185" rx="70" ry="12" fill="none" stroke="#64748b" strokeWidth="2" />

                <text x="90" y="215" fontSize="11" fill="#15803d" fontWeight="bold" textAnchor="middle">
                  圆柱总容积：{cylinderVol.toFixed(1)} cm³
                </text>
              </g>
            </svg>
          </div>

          {/* 状态通告横条 */}
          <div style={{
            background: pourCount === 3 ? '#ecfdf5' : '#eff6ff',
            border: `1px solid ${pourCount === 3 ? '#6ee7b7' : '#bfdbfe'}`,
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {pourCount === 0 && (
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#1e40af', fontWeight: 600 }}>
                👉 请点击上方 <strong>“倒入第 1 锥水”</strong>，观察圆柱桶内的水位上升情况！
              </p>
            )}
            {pourCount === 1 && (
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#1e40af', fontWeight: 600 }}>
                💧 倒入第 1 锥水：圆柱刚好装了 <strong>1/3 高度</strong>！圆柱体积是圆锥的 3 倍雏形初现。
              </p>
            )}
            {pourCount === 2 && (
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#1e40af', fontWeight: 600 }}>
                💧 倒入第 2 锥水：圆柱水位来到 <strong>2/3 高度</strong>！此时还差正好 1 锥水就满。
              </p>
            )}
            {pourCount === 3 && (
              <p style={{ margin: 0, fontSize: '1rem', color: '#065f46', fontWeight: 800 }}>
                🎉 倒入第 3 锥水：严丝合缝，彻底装满！不多不少，正好 3 锥！这就是公式中的 <strong>⅓</strong> 的来源！
              </p>
            )}
          </div>

          {/* 核心公式提炼 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem', border: '1px solid #cbd5e1' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, marginBottom: '0.3rem' }}>
                🏛 圆柱体积计算公式
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                V柱 = S × h = πr²h
              </div>
              <div style={{ fontSize: '0.85rem', color: '#2563eb', marginTop: '0.4rem' }}>
                = 3.14 × {radius}² × {height} = <strong>{cylinderVol.toFixed(1)} cm³</strong>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem', border: '1px solid #cbd5e1' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, marginBottom: '0.3rem' }}>
                🔺 圆锥体积计算公式
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                V锥 = ⅓ × S × h = ⅓πr²h
              </div>
              <div style={{ fontSize: '0.85rem', color: '#059669', marginTop: '0.4rem' }}>
                = ⅓ × {cylinderVol.toFixed(1)} = <strong>{coneVol.toFixed(1)} cm³</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 模式二：削铅笔雕刻动画 */}
      {mode === 'carve' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ background: '#fff', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #cbd5e1', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                🪵 刨木机切削进度：{carveProgress}%
              </span>
              <span style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 700 }}>
                {carveProgress === 100 ? '削制完成！留下最大圆锥' : '拖动滑块削铅笔'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={carveProgress}
              onChange={(e) => setCarveProgress(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#d97706' }}
            />
          </div>

          {/* 削木料 SVG */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', textAlign: 'center', marginBottom: '1.25rem' }}>
            <svg viewBox="0 0 500 240" style={{ maxWidth: '420px', width: '100%', display: 'inline-block' }}>
              {/* 木料基础圆柱 (黄色木头) */}
              <g transform="translate(150, 30)">
                {/* 削掉的废弃木料（左侧与右侧三角） */}
                {/* 左木屑 */}
                <polygon
                  points="10,20 100,20 10,170"
                  fill="#fcd34d"
                  opacity={1 - (carveProgress / 100) * 0.8}
                  stroke="#d97706"
                  strokeWidth="1"
                />
                {/* 右木屑 */}
                <polygon
                  points="100,20 190,20 190,170"
                  fill="#fcd34d"
                  opacity={1 - (carveProgress / 100) * 0.8}
                  stroke="#d97706"
                  strokeWidth="1"
                />

                {/* 留下的圆锥体核心 */}
                <polygon
                  points="10,170 190,170 100,20"
                  fill="#ea580c"
                  stroke="#c2410c"
                  strokeWidth="2"
                />

                {/* 顶面与底面椭圆 */}
                <ellipse cx="100" cy="20" rx="90" ry="12" fill={carveProgress === 100 ? '#fed7aa' : '#fef08a'} stroke="#d97706" strokeWidth="1.5" />
                <ellipse cx="100" cy="170" rx="90" ry="12" fill="#ea580c" opacity="0.4" stroke="#c2410c" strokeWidth="1.5" />

                {/* 刀具削切位置指示 */}
                {carveProgress > 0 && carveProgress < 100 && (
                  <text x="210" y="80" fontSize="18">🔪 削木屑中...</text>
                )}
              </g>
            </svg>
          </div>

          {/* 削铅笔核心考点卡片 */}
          <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '1.25rem', border: '1px solid #fde68a' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#92400e', fontSize: '1rem' }}>
              ✏️ 削铅笔问题“三份法则”
            </h4>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.92rem', color: '#78350f', lineHeight: 1.6 }}>
              把圆柱看作 <strong>3 份</strong>：
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#78350f', lineHeight: 1.6 }}>
              <li><strong>保留的圆锥：</strong>占总共的 <strong>1 份 (1/3)</strong>。</li>
              <li><strong>削去的木屑：</strong>占总共的 <strong>2 份 (2/3)</strong>。</li>
              <li><strong>木屑 vs 圆锥：</strong>削去的木屑体积是留下圆锥体积的 <strong>2 倍</strong>！</li>
            </ul>
          </div>
        </div>
      )}

      {/* 模式三：真题闯关 */}
      {mode === 'quiz' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
              第 {quizIndex + 1} / {QUIZ_QUESTIONS.length} 题 · 经典易错考点
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
