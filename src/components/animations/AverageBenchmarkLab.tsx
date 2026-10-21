'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type Mode = 'leveling' | 'benchmark' | 'quiz';

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
    question: '一条小河的“平均水深是 1.1 米”，小明身高 1.4 米，他不会游泳，贸然下河游泳会有危险吗？',
    options: [
      '没有危险，因为小明比平均水深高出 0.3 米',
      '依然非常危险！因为平均水深不代表处处都只有 1.1 米，可能有深达 2 米以上的深水坑！',
      '水深刚好到小明的脖子，只要站着就安全',
      '无法确定，取决于河里有没有鱼'
    ],
    correctIndex: 1,
    explanation: '平均数是一个“虚拟代表值”，是由浅滩（如 0.2米）和深潭（如 2.5米）平摊出来的！平均水深 1.1 米的河道，水底地形往往极其复杂，掉入深水坑极易溺水，绝不能下水！'
  },
  {
    id: 2,
    question: '计算一组考分：97, 102, 98, 105, 98 的平均分。选择哪种方法最快最不易出错？',
    options: [
      '用竖式先把 5 个数全部加起来算出 500，再除以 5 得 100',
      '以 100 为基准数：差量分别为 -3, +2, -2, +5, -2，差量和为 0，平均分直接得出 100',
      '随便猜一个 99',
      '去掉最高分 105 和最低分 97'
    ],
    correctIndex: 1,
    explanation: '基准数法（移多补少代数化）！当一组数字很接近某一个整十整百数时，以 100 为基准，只计算每个数多出或欠缺的零头差量：-3 + 2 - 2 + 5 - 2 = 0。基准数 100 + 0 ÷ 5 = 100，心算秒出！'
  },
  {
    id: 3,
    question: '四(1)班 40 名同学平均分是 90 分。后来转来一位新同学小红，数学考了 95 分。全班的平均分会发生什么变化？',
    options: [
      '保持 90 分不变',
      '升高，因为新加入的分数高于原平均分',
      '降低，因为人数变多了',
      '变成 95 分'
    ],
    correctIndex: 1,
    explanation: '高于平均数的新成员加入，必然会把多出来的分数（95 - 90 = 5分）均摊给全班所有人，从而拉高整体平均分！反之，如果新来同学考了 80 分，就会拉低全班平均分。'
  }
];

export default function AverageBenchmarkLab() {
  const [mode, setMode] = useState<Mode>('leveling');

  // 模式一：水柱积木平摊数据 (5 根柱子的高度值)
  const [columns, setColumns] = useState<number[]>([6, 11, 4, 12, 7]);
  // 是否执行了“平摊/削峰填谷”
  const [isLeveled, setIsLeveled] = useState<boolean>(false);

  // 模式二：基准数法数据
  const [benchmarkScores, setBenchmarkScores] = useState<number[]>([96, 104, 98, 105, 97]);
  const baseNum = 100;

  // 测验
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // 模式一理论计算
  const sumCols = columns.reduce((a, b) => a + b, 0);
  const avgCols = Number((sumCols / columns.length).toFixed(1));

  // 改变单根水柱高度
  const handleColChange = (idx: number, val: number) => {
    const next = [...columns];
    next[idx] = val;
    setColumns(next);
    setIsLeveled(false);
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
      {/* 顶部模式切换选项卡 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          className={mode === 'leveling' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('leveling'); setIsLeveled(false); }}
        >
          🧱 模式一：水柱平摊与“削峰填谷”
        </button>
        <button
          className={mode === 'benchmark' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('benchmark'); }}
        >
          ⚡ 模式二：基准数法秒算大数平均
        </button>
        <button
          className={mode === 'quiz' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('quiz'); }}
        >
          ⚠️ 模式三：“平均水深”致命陷阱与易错速测
        </button>
      </div>

      {/* 模式一：水柱平摊与“削峰填谷” */}
      {mode === 'leveling' && (
        <div>
          {/* 控制条 */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                  📊 柱状水柱高度：
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  (总和: <strong>{sumCols}</strong> ｜ 项数: <strong>{columns.length}</strong> ｜ 平均数: <strong style={{ color: '#2563eb' }}>{avgCols}</strong>)
                </span>
              </div>

              {/* 核心动作按钮 */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className={styles.primaryBtn}
                  onClick={() => setIsLeveled(!isLeveled)}
                  style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                >
                  {isLeveled ? '🔄 恢复原始高低' : '✨ 移多补少·水面齐平'}
                </button>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => { setColumns([6, 11, 4, 12, 7]); setIsLeveled(false); }}
                  style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                  重置预设
                </button>
              </div>
            </div>

            {/* 5 根柱子的高度调节滑块 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              {columns.map((val, idx) => (
                <div key={idx} style={{ background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                    <span>柱 {idx + 1}</span>
                    <strong style={{ color: '#2563eb' }}>{val}</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={val}
                    onChange={(e) => handleColChange(idx, Number(e.target.value))}
                    disabled={isLeveled}
                    style={{ width: '100%', accentColor: '#2563eb', marginTop: '4px' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 交互水柱 SVG 主画板 */}
          <div style={{ background: '#f8fafc', borderRadius: '16px', border: '2px solid #cbd5e1', padding: '16px', position: 'relative', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                🌊 积木柱移多补少实时呈现 (基准红虚线 = 平均线 {avgCols})
              </div>
              <div style={{ fontSize: '0.85rem', color: isLeveled ? '#16a34a' : '#d97706', fontWeight: 700 }}>
                {isLeveled ? '✅ 削峰填谷完成：所有水柱水面完全齐平！' : '👉 点击上方“移多补少”，观察多出来的积木怎么填补凹坑！'}
              </div>
            </div>

            <svg viewBox="0 0 800 280" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px', background: '#ffffff' }}>
              {/* 网格背景线 (每格 10px 代表 1 个单位) */}
              {Array.from({ length: 16 }).map((_, i) => {
                const y = 240 - i * 14;
                return (
                  <g key={i}>
                    <line x1="60" y1={y} x2="740" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    {i % 2 === 0 && (
                      <text x="45" y={y + 4} fontSize="9" fill="#94a3b8" textAnchor="middle">{i}</text>
                    )}
                  </g>
                );
              })}

              {/* 地面基底 */}
              <rect x="50" y="240" width="700" height="15" fill="#334155" rx="2" />

              {/* 红色平均水平基准虚线 */}
              {(() => {
                const avgY = 240 - avgCols * 14;
                return (
                  <g>
                    <line x1="50" y1={avgY} x2="740" y2={avgY} stroke="#dc2626" strokeWidth="2.5" strokeDasharray="6 4" />
                    <rect x="650" y={avgY - 20} width="90" height="18" rx="4" fill="#fee2e2" stroke="#dc2626" strokeWidth="1" />
                    <text x="695" y={avgY - 7} fontSize="11" fontWeight="bold" fill="#b91c1c" textAnchor="middle">
                      平均线 = {avgCols}
                    </text>
                  </g>
                );
              })()}

              {/* 5 根柱子渲染 (柱间距与动画过度) */}
              {columns.map((val, idx) => {
                const colW = 70;
                const colX = 110 + idx * 125;
                // 若平摊模式，高度统一变为 avgCols；否则为原高度 val
                const displayH = isLeveled ? avgCols : val;
                const hPx = displayH * 14;
                const colY = 240 - hPx;

                // 原始高度下的多出部分 (红色) 或欠缺部分 (虚线)
                const isHigher = val > avgCols;
                const origHPx = val * 14;
                const origY = 240 - origHPx;

                return (
                  <g key={idx} style={{ transition: 'all 0.4s ease' }}>
                    {/* 柱身背景 */}
                    <rect
                      x={colX}
                      y={colY}
                      width={colW}
                      height={hPx}
                      rx="4"
                      fill={isLeveled ? '#60a5fa' : '#38bdf8'}
                      stroke="#0284c7"
                      strokeWidth="1.5"
                    />

                    {/* 如果未平摊，高出平均线的部分用橙红色凸显（表示要被切掉移走的峰） */}
                    {!isLeveled && isHigher && (
                      <g>
                        <rect
                          x={colX}
                          y={origY}
                          width={colW}
                          height={(val - avgCols) * 14}
                          rx="4"
                          fill="#f87171"
                          stroke="#dc2626"
                          strokeWidth="1.5"
                          opacity="0.85"
                        />
                        <text x={colX + colW / 2} y={origY + 12} fontSize="9" fontWeight="bold" fill="#fff" textAnchor="middle">
                          多+{(val - avgCols).toFixed(1)}
                        </text>
                      </g>
                    )}

                    {/* 如果未平摊，低于平均线的部分用虚线框标出（表示待填补的坑） */}
                    {!isLeveled && !isHigher && (
                      <g>
                        <rect
                          x={colX}
                          y={240 - avgCols * 14}
                          width={colW}
                          height={(avgCols - val) * 14}
                          rx="4"
                          fill="none"
                          stroke="#16a34a"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                        />
                        <text x={colX + colW / 2} y={240 - avgCols * 14 + 12} fontSize="9" fontWeight="bold" fill="#15803d" textAnchor="middle">
                          缺-{(avgCols - val).toFixed(1)}
                        </text>
                      </g>
                    )}

                    {/* 柱顶数字 */}
                    <text x={colX + colW / 2} y={colY - 6} fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle">
                      {displayH}
                    </text>
                    {/* 底部标签 */}
                    <text x={colX + colW / 2} y="260" fontSize="11" fontWeight="bold" fill="#64748b" textAnchor="middle">
                      第 {idx + 1} 组
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 算式与思想对照卡 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '16px', border: '1.5px solid #bfdbfe' }}>
              <div style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 700, marginBottom: '6px' }}>
                🧮 传统求和除法算式：
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1d4ed8', fontFamily: 'monospace' }}>
                平均数 = 总数量 ÷ 总份数
              </div>
              <div style={{ fontSize: '0.9rem', color: '#334155', marginTop: '6px' }}>
                ({columns.join(' + ')}) ÷ {columns.length} = {sumCols} ÷ {columns.length} = <strong>{avgCols}</strong>
              </div>
            </div>

            <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '16px', border: '1.5px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 700, marginBottom: '6px' }}>
                ✂️ 移多补少核心哲学：
              </div>
              <div style={{ fontSize: '0.85rem', color: '#14532d', lineHeight: 1.6 }}>
                <strong>“削掉多出的山峰，填平凹陷的深谷”</strong>！<br />
                所有柱子多出来的总量，正好等于所有柱子欠缺的总量！平摊后每个积木的高度，就是这组数据的平均水平！
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 模式二：基准数法秒算大数平均 */}
      {mode === 'benchmark' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            ⚡ 告别几位数硬算：“基准数法”心算秒杀大数平均
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '18px' }}>
            试卷上经常出现类似 96, 104, 98, 105, 97 这种接近 100 的大数。如果按传统算法把它们加起来再除以 5，计算极其繁琐且容易抄错数字！
            学会基准数法，小学生也能像闪电一样心算！
          </p>

          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '18px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ background: '#2563eb', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>1</span>
              <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>第一步：选定公共基准数 B = 100</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '14px' }}>
              {benchmarkScores.map((score, i) => {
                const diff = score - baseNum;
                return (
                  <div key={i} style={{ background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>数据 {i + 1}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>{score}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: diff >= 0 ? '#16a34a' : '#dc2626', marginTop: '2px' }}>
                      {diff >= 0 ? `+${diff}` : diff}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: '#eff6ff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.9rem', color: '#1e40af' }}>
              <strong>第二步：心算零头差量之和：</strong><br />
              (-4) + (+4) + (-2) + (+5) + (-3) = <strong style={{ color: '#2563eb', fontSize: '1.1rem' }}>0</strong><br />
              <strong>第三步：平均数 = 基准数 + 差量和 ÷ 项数：</strong><br />
              平均分 = 100 + 0 ÷ 5 = <strong style={{ color: '#15803d', fontSize: '1.2rem' }}>100 分</strong>！连草稿纸都不用动！
            </div>
          </div>
        </div>
      )}

      {/* 模式三：“平均水深”致命陷阱与易错速测 */}
      {mode === 'quiz' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
          {/* 河底断面警示图 */}
          <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: 800, marginBottom: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🚨</span>
              <span>考场经典名题·河道剖面图揭秘：“为什么平均水深 1.1 米会淹死人？”</span>
            </div>

            <svg viewBox="0 0 700 130" style={{ width: '100%', height: 'auto', display: 'block', background: '#ffffff', borderRadius: '8px' }}>
              {/* 水面 (y = 20) */}
              <line x1="50" y1="20" x2="650" y2="20" stroke="#0284c7" strokeWidth="3" />
              <text x="70" y="16" fontSize="10" fill="#0284c7" fontWeight="bold">水面</text>

              {/* 平均水深红虚线 (水深1.1米, y = 50) */}
              <line x1="50" y1="50" x2="650" y2="50" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 3" />
              <text x="610" y="46" fontSize="9" fill="#dc2626" fontWeight="bold">平均水深 1.1m</text>

              {/* 真实的崎岖河床断面 (浅水滩 0.2m -> 中部巨型断崖深坑 2.5m) */}
              <path
                d="M 50 30 Q 150 35 250 38 L 320 40 L 360 115 L 440 115 L 480 40 L 580 35 L 650 30"
                stroke="#78350f"
                strokeWidth="3"
                fill="#fef3c7"
              />

              {/* 深坑标注 */}
              <line x1="400" y1="20" x2="400" y2="115" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrow)" />
              <text x="405" y="80" fontSize="11" fontWeight="bold" fill="#b91c1c">深坑实际深达 2.5 米！</text>

              {/* 浅滩标注 */}
              <text x="180" y="30" fontSize="9" fill="#15803d" fontWeight="bold">浅滩 0.3m</text>
            </svg>
            <div style={{ fontSize: '0.85rem', color: '#7f1d1d', marginTop: '8px', lineHeight: 1.5 }}>
              💡 <strong>核心道理：</strong> 平均数只是对一组数据集中趋势的描述，<strong>它抹平了极值差</strong>！现实中一个 2.5 米的深水坑足以没顶！绝不能用平均数推断每一个具体个体的实际情况！
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.05rem' }}>
              第 {quizIndex + 1} 题 / 共 {QUIZ_QUESTIONS.length} 题
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>平均数易错陷阱挑战</span>
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
