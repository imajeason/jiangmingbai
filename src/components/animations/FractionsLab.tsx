'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type Mode = 'slice' | 'fairness' | 'compare' | 'quiz';

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
    question: '妈妈把一个大西瓜切成了 4 块，小明吃了其中 1 块，小明一定吃了这个西瓜的 1/4 吗？',
    options: [
      '一定吃了 1/4，因为 1 块除以 4 块就是 1/4',
      '不一定，因为题目没说是不是“平均切”的',
      '一定不是 1/4',
      '无法确定西瓜重多少千克'
    ],
    correctIndex: 1,
    explanation: '分数的灵魂是“平均分”！如果切的时候一大一小，小明吃的那块就不能用 1/4 表示。只有“平均分成 4 份”，每份才是 1/4。'
  },
  {
    id: 2,
    question: '同样大小的两张披萨，小红吃了其中一张的 1/2，小刚吃了另一张的 1/8，谁吃得多？',
    options: ['小刚吃得多，因为 8 比 2 大', '小红吃得多，因为分的份数越少，每一块越大', '一样多', '无法比较'],
    correctIndex: 1,
    explanation: '同样大的披萨，分给 2 个人吃，每人能吃半个大披萨；分给 8 个人吃，每人只能分到一小尖尖！所以 1/2 > 1/8。分子相同时，分母越小分数越大！'
  },
  {
    id: 3,
    question: '在分数 3/5 中，“分母 5”和“分子 3”分别代表什么？',
    options: [
      '分母 5 表示吃了 5 块，分子 3 表示切了 3 块',
      '分母 5 表示把单位“1”平均分成 5 份，分子 3 表示取了其中的 3 份',
      '分子 3 表示总数，分母 5 表示剩余',
      '表示 5 比 3 大'
    ],
    correctIndex: 1,
    explanation: '分母在下，像妈妈托举着家，表示总共“平均分成了 5 份”；分子在上，像孩子坐在肩膀上，表示“取了其中的 3 份”。'
  }
];

export default function FractionsLab() {
  const [mode, setMode] = useState<Mode>('slice');

  // 切分模式参数
  const [shape, setShape] = useState<'pizza' | 'chocolate'>('pizza');
  const [denominator, setDenominator] = useState(4); // 分母 (2, 3, 4, 6, 8)
  const [selectedSlices, setSelectedSlices] = useState<number[]>([0]); // 选中的分子

  // 公平与非公平平均分辨析
  const [isFair, setIsFair] = useState(true);

  // 比大小模式参数
  const [compareD1, setCompareD1] = useState(2);
  const [compareD2, setCompareD2] = useState(8);

  // 测验
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // 切换分母时重置选中块
  const handleDenominatorChange = (newD: number) => {
    setDenominator(newD);
    setSelectedSlices([0]); // 默认选中第 1 块
  };

  // 点击披萨块切片
  const handleToggleSlice = (idx: number) => {
    if (selectedSlices.includes(idx)) {
      if (selectedSlices.length > 1) {
        setSelectedSlices(selectedSlices.filter(i => i !== idx));
      } else {
        setSelectedSlices([]); // 允许清空
      }
    } else {
      setSelectedSlices([...selectedSlices, idx].sort((a, b) => a - b));
    }
  };

  const numerator = selectedSlices.length;

  const currentQ = QUIZ_QUESTIONS[quizIndex];

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.titleBadge}>
          <span className={styles.badgeIcon}>🍕🍫</span>
          <span className={styles.badgeText}>三年级数与代数 · 核心概念实验室</span>
        </div>
        <h2 className={styles.labTitle}>分数的初步认识：披萨与巧克力的平均分</h2>
        <p className={styles.labSubtitle}>
          告别死记硬背！动手指切分美味披萨，一眼看懂分母、分子与“平均分”的绝对生命线。
        </p>
      </div>

      {/* 模式选择 */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          className={mode === 'slice' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => setMode('slice')}
        >
          🍕 模式一：分披萨与巧克力 (动手切分)
        </button>
        <button
          className={mode === 'fairness' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => setMode('fairness')}
        >
          ⚖️ 模式二：真假分数辨析 (必须平均分！)
        </button>
        <button
          className={mode === 'compare' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => setMode('compare')}
        >
          🔍 模式三：分数谁更大？(1/2 还是 1/8)
        </button>
        <button
          className={mode === 'quiz' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => setMode('quiz')}
        >
          🎯 模式四：易错考点闯关
        </button>
      </div>

      {/* 模式一：切分披萨与巧克力 */}
      {mode === 'slice' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          {/* 控制面板 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>食物类型：</span>
              <button
                className={shape === 'pizza' ? styles.primaryBtn : styles.secondaryBtn}
                onClick={() => setShape('pizza')}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                🍕 圆形披萨
              </button>
              <button
                className={shape === 'chocolate' ? styles.primaryBtn : styles.secondaryBtn}
                onClick={() => setShape('chocolate')}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                🍫 长方形巧克力
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>平均切成几份 (分母)：</span>
              {[2, 3, 4, 6, 8].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDenominatorChange(d)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    border: '1.5px solid',
                    borderColor: denominator === d ? '#2563eb' : '#cbd5e1',
                    background: denominator === d ? '#eff6ff' : '#fff',
                    color: denominator === d ? '#1d4ed8' : '#475569',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {d} 份
                </button>
              ))}
            </div>
          </div>

          {/* 披萨 / 巧克力可视化展示区 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            {/* 左侧可交互图形 */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                👉 点击下面的每一块食物，尝试吃掉/选中它：
              </div>

              {shape === 'pizza' ? (
                /* 圆形披萨 SVG */
                <svg viewBox="-120 -120 240 240" style={{ maxWidth: '240px', width: '100%', display: 'inline-block' }}>
                  {/* 底盘阴影 */}
                  <circle cx="0" cy="5" r="105" fill="#e2e8f0" />
                  {/* 披萨脆饼外皮底色 */}
                  <circle cx="0" cy="0" r="100" fill="#d97706" stroke="#b45309" strokeWidth="3" />

                  {/* 扇形分割 */}
                  {Array.from({ length: denominator }).map((_, idx) => {
                    const isSelected = selectedSlices.includes(idx);
                    const anglePerSlice = (2 * Math.PI) / denominator;
                    const startAngle = idx * anglePerSlice - Math.PI / 2;
                    const endAngle = (idx + 1) * anglePerSlice - Math.PI / 2;

                    const r = 94;
                    const x1 = r * Math.cos(startAngle);
                    const y1 = r * Math.sin(startAngle);
                    const x2 = r * Math.cos(endAngle);
                    const y2 = r * Math.sin(endAngle);

                    // 突出偏移效果
                    const midAngle = (startAngle + endAngle) / 2;
                    const offset = isSelected ? 8 : 0;
                    const ox = offset * Math.cos(midAngle);
                    const oy = offset * Math.sin(midAngle);

                    const largeArcFlag = denominator === 2 ? 0 : 0;

                    return (
                      <g
                        key={idx}
                        transform={`translate(${ox}, ${oy})`}
                        onClick={() => handleToggleSlice(idx)}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <path
                          d={`M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={isSelected ? '#fbbf24' : '#fef08a'}
                          stroke="#b45309"
                          strokeWidth="2"
                        />
                        {/* 芝士与番茄碎点缀 */}
                        <circle cx={x1 * 0.5} cy={y1 * 0.5} r="3" fill="#ef4444" />
                        <circle cx={x2 * 0.6} cy={y2 * 0.6} r="2.5" fill="#15803d" />
                        {/* 编号文字 */}
                        <text
                          x={r * 0.65 * Math.cos(midAngle)}
                          y={r * 0.65 * Math.sin(midAngle) + 4}
                          fontSize="13"
                          fontWeight="900"
                          fill={isSelected ? '#78350f' : '#a16207'}
                          textAnchor="middle"
                        >
                          {isSelected ? '✓' : idx + 1}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              ) : (
                /* 长方形巧克力 SVG */
                <svg viewBox="0 0 280 160" style={{ maxWidth: '280px', width: '100%', display: 'inline-block' }}>
                  <rect x="10" y="10" width="260" height="140" rx="8" fill="#451a03" stroke="#290d02" strokeWidth="3" />
                  {/* 分割小块 */}
                  {Array.from({ length: denominator }).map((_, idx) => {
                    const isSelected = selectedSlices.includes(idx);
                    const blockW = 240 / denominator;
                    const bx = 20 + idx * blockW;
                    const by = 20;
                    return (
                      <g
                        key={idx}
                        onClick={() => handleToggleSlice(idx)}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <rect
                          x={bx + 2}
                          y={by + 2}
                          width={blockW - 4}
                          height="116"
                          rx="4"
                          fill={isSelected ? '#92400e' : '#78350f'}
                          stroke={isSelected ? '#fbbf24' : '#451a03'}
                          strokeWidth={isSelected ? 2 : 1}
                        />
                        <text
                          x={bx + blockW / 2}
                          y={by + 64}
                          fontSize="14"
                          fontWeight="900"
                          fill={isSelected ? '#fef08a' : '#d97706'}
                          textAnchor="middle"
                        >
                          {isSelected ? '✓' : idx + 1}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>

            {/* 右侧分数数学解剖卡 */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #cbd5e1', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, marginBottom: '0.5rem' }}>
                当前选中的食物部分用分数表示为：
              </div>

              {/* 巨型分数板 */}
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '0.75rem 0' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ef4444', lineHeight: 1 }}>
                  {numerator}
                </span>
                <span style={{ width: '80px', height: '4px', background: '#0f172a', borderRadius: '2px', margin: '6px 0' }} />
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>
                  {denominator}
                </span>
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                读作：<span style={{ color: '#2563eb' }}>{denominator} 分之 {numerator}</span>
              </div>

              {/* 分母与分子详细说明 */}
              <div style={{ textAlign: 'left', background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.88rem', lineHeight: 1.6 }}>
                <p style={{ margin: '0 0 0.4rem 0' }}>
                  <strong style={{ color: '#2563eb' }}>分母 {denominator}（在下方）：</strong>
                  表示把整个大披萨<strong>“平均分成了 {denominator} 份”</strong>（像妈妈托举着全家）。
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#ef4444' }}>分子 {numerator}（在上方）：</strong>
                  表示小明<strong>“吃了/取了其中的 {numerator} 份”</strong>（像孩子坐在妈妈肩上）。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 模式二：平均分辨析 */}
      {mode === 'fairness' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <button
              className={isFair ? styles.primaryBtn : styles.secondaryBtn}
              onClick={() => setIsFair(true)}
              style={{ padding: '0.6rem 1.25rem' }}
            >
              ✅ 严格“平均分” (每块大小一致)
            </button>
            <button
              className={!isFair ? styles.primaryBtn : styles.secondaryBtn}
              onClick={() => setIsFair(false)}
              style={{ padding: '0.6rem 1.25rem' }}
            >
              ❌ 随意乱切 (一块极大、一块极小)
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', textAlign: 'center', marginBottom: '1.25rem' }}>
            <svg viewBox="-110 -110 220 220" style={{ maxWidth: '220px', width: '100%', display: 'inline-block' }}>
              <circle cx="0" cy="0" r="95" fill="#fef08a" stroke="#b45309" strokeWidth="3" />
              {isFair ? (
                /* 平均分成 4 份 */
                <g>
                  <line x1="-95" y1="0" x2="95" y2="0" stroke="#b45309" strokeWidth="2.5" strokeDasharray="3 3" />
                  <line x1="0" y1="-95" x2="0" y2="95" stroke="#b45309" strokeWidth="2.5" strokeDasharray="3 3" />
                  <path d="M 0 0 L 95 0 A 95 95 0 0 1 0 95 Z" fill="#fbbf24" opacity="0.85" />
                  <text x="35" y="45" fontSize="14" fontWeight="bold" fill="#78350f">¼ 块</text>
                </g>
              ) : (
                /* 偏心乱切：左边巨大，右边极小 */
                <g>
                  <line x1="-95" y1="30" x2="95" y2="30" stroke="#ef4444" strokeWidth="3" />
                  <line x1="50" y1="-95" x2="50" y2="95" stroke="#ef4444" strokeWidth="3" />
                  <path d="M 50 30 L 95 30 A 95 95 0 0 1 50 80 Z" fill="#fca5a5" opacity="0.85" />
                  <text x="65" y="55" fontSize="11" fontWeight="bold" fill="#991b1b">这一小角</text>
                  <text x="-35" y="-15" fontSize="18" fontWeight="bold" fill="#b45309">超大块！</text>
                </g>
              )}
            </svg>
          </div>

          {/* 裁判判决卡片 */}
          <div style={{
            background: isFair ? '#f0fdf4' : '#fef2f2',
            border: `1.5px solid ${isFair ? '#86efac' : '#fca5a5'}`,
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: isFair ? '#15803d' : '#b91c1c', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{isFair ? '🎉 判定通过：合法的分数！' : '🚨 严重违规：这绝对不能叫 1/4！'}</span>
            </h4>
            <p style={{ margin: 0, fontSize: '0.92rem', color: isFair ? '#166534' : '#991b1b', lineHeight: 1.6 }}>
              {isFair ? (
                <>
                  四个切块完全一样大，这叫<strong>“平均分”</strong>！其中的每一块才能骄傲地称为整个披萨的 <strong>¼</strong>。
                </>
              ) : (
                <>
                  虽然也切成了 4 块，但每一块大小完全不同！有人分到大半个，有人只分到一口！
                  <br />
                  <strong>分数的绝对前提是“平均分”！没有“平均”，就根本不存在分数！这是考卷上最狠的填空题陷阱！</strong>
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* 模式三：分数比大小 */}
      {mode === 'compare' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: '0 0 0.4rem 0', color: '#0f172a', fontSize: '1.1rem' }}>
              分子都是 1 时：为什么分母越大，分数反而越小？
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
              同样大小的披萨，分给 2 个人吃还是分给 8 个人吃，谁分到的更多？
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.25rem' }}>
            {/* 左侧披萨 1 */}
            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2563eb', marginBottom: '0.5rem' }}>
                1 / {compareD1}
              </div>
              <svg viewBox="-80 -80 160 160" style={{ maxWidth: '160px', width: '100%' }}>
                <circle cx="0" cy="0" r="70" fill="#fef08a" stroke="#b45309" strokeWidth="2" />
                {/* 高亮 1/compareD1 */}
                <path
                  d={`M 0 0 L 0 -70 A 70 70 0 0 1 ${70 * Math.sin((2 * Math.PI) / compareD1)} ${-70 * Math.cos((2 * Math.PI) / compareD1)} Z`}
                  fill="#fbbf24"
                  stroke="#b45309"
                  strokeWidth="2"
                />
              </svg>
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>调节分母：</label>
                <select
                  value={compareD1}
                  onChange={(e) => setCompareD1(Number(e.target.value))}
                  style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', marginLeft: '0.4rem' }}
                >
                  {[2, 3, 4, 6, 8, 12].map(v => <option key={v} value={v}>1/{v}</option>)}
                </select>
              </div>
            </div>

            {/* 中间对比符号 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: compareD1 < compareD2 ? '#16a34a' : compareD1 > compareD2 ? '#dc2626' : '#64748b' }}>
                {compareD1 < compareD2 ? '>' : compareD1 > compareD2 ? '<' : '='}
              </span>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569', marginTop: '0.4rem' }}>
                {compareD1 < compareD2 ? '左边吃得多！' : compareD1 > compareD2 ? '右边吃得多！' : '两边一样大！'}
              </span>
            </div>

            {/* 右侧披萨 2 */}
            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#059669', marginBottom: '0.5rem' }}>
                1 / {compareD2}
              </div>
              <svg viewBox="-80 -80 160 160" style={{ maxWidth: '160px', width: '100%' }}>
                <circle cx="0" cy="0" r="70" fill="#fef08a" stroke="#b45309" strokeWidth="2" />
                {/* 高亮 1/compareD2 */}
                <path
                  d={`M 0 0 L 0 -70 A 70 70 0 0 1 ${70 * Math.sin((2 * Math.PI) / compareD2)} ${-70 * Math.cos((2 * Math.PI) / compareD2)} Z`}
                  fill="#86efac"
                  stroke="#15803d"
                  strokeWidth="2"
                />
              </svg>
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>调节分母：</label>
                <select
                  value={compareD2}
                  onChange={(e) => setCompareD2(Number(e.target.value))}
                  style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', marginLeft: '0.4rem' }}
                >
                  {[2, 3, 4, 6, 8, 12].map(v => <option key={v} value={v}>1/{v}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ background: '#fefce8', borderRadius: '12px', padding: '1rem', border: '1px solid #fef08a' }}>
            <h4 style={{ margin: '0 0 0.4rem 0', color: '#854d0e', fontSize: '0.95rem' }}>
              💡 家长口诀：分母比大小
            </h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#713f12', lineHeight: 1.6 }}>
              “分子都是 1，分母越小分得少，每人吃得饱（数值大）；分母越大分得多，每人剩口渣（数值小）！”
            </p>
          </div>
        </div>
      )}

      {/* 模式四：易错考点闯关 */}
      {mode === 'quiz' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
              第 {quizIndex + 1} / {QUIZ_QUESTIONS.length} 题 · 概念防坑
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
