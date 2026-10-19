'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type AllocationType = 'surplus-deficit' | 'double-surplus' | 'double-deficit' | 'quiz';

interface QuizQuestion {
  id: number;
  type: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: '一盈一亏',
    question: '老师给小朋友分糖果，如果每人分 4 颗，还多出 9 颗；如果每人分 6 颗，还少 5 颗。一共有多少个小朋友？多少颗糖果？',
    options: ['7 个小朋友，37 颗糖果', '6 个小朋友，33 颗糖果', '8 个小朋友，41 颗糖果', '7 个小朋友，35 颗糖果'],
    correctIndex: 0,
    explanation: '一盈一亏总差量 = 9 + 5 = 14 颗。每人两次分得之差 = 6 - 4 = 2 颗。人数 = 14 ÷ 2 = 7 人。糖果总数 = 7 × 4 + 9 = 37 颗。'
  },
  {
    id: 2,
    type: '双盈问题',
    question: '同学们去划船，如果每条船坐 4 人，还剩 8 人没船坐；如果每条船坐 6 人，还剩 2 人没船坐。一共有几条船？几个同学？',
    options: ['3 条船，20 人', '4 条船，26 人', '3 条船，18 人', '5 条船，28 人'],
    correctIndex: 0,
    explanation: '两次都是“剩人”（双盈）！总差量 = 8 - 2 = 6 人。每条船多坐 = 6 - 4 = 2 人。船数 = 6 ÷ 2 = 3 条。总人数 = 3 × 4 + 8 = 20 人。'
  },
  {
    id: 3,
    type: '生活变式',
    question: '小明买日记本，买 3 本还剩 6 元，买 5 本还少 4 元。每本日记本多少钱？小明带了多少钱？',
    options: ['每本 5 元，带了 21 元', '每本 4 元，带了 18 元', '每本 5 元，带了 20 元', '每本 6 元，带了 24 元'],
    correctIndex: 0,
    explanation: '一盈（剩 6 元）一亏（少 4 元）总差额 = 6 + 4 = 10 元。两次本数差 = 5 - 3 = 2 本。日记本单价 = 10 ÷ 2 = 5 元。带的钱 = 3 × 5 + 6 = 21 元。'
  }
];

export default function SurplusDeficiencyLab() {
  const [allocType, setAllocType] = useState<AllocationType>('surplus-deficit');

  // 参数设置
  const [peopleCount, setPeopleCount] = useState(6); // 人数 6 人
  const [plan1Each, setPlan1Each] = useState(3);     // 方案1每人 3
  const [plan2Each, setPlan2Each] = useState(5);     // 方案2每人 5
  const [activePlan, setActivePlan] = useState<1 | 2>(1); // 当前观察方案1还是方案2

  // 测验
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // 计算物品总数与盈亏量
  // 假设根据所选类型动态算出总糖果数：
  // 一盈一亏：方案1每人3剩8，方案2每人5少4（基准人数6人，总糖果数 = 6*3 + 8 = 26，方案2需 6*5=30，缺4）
  let totalCandies = 26;
  let s1 = 8;  // 方案1盈 8
  let s2 = -4; // 方案2亏 4 (少4)

  if (allocType === 'surplus-deficit') {
    totalCandies = peopleCount * plan1Each + 8;
    s1 = 8;
    s2 = totalCandies - peopleCount * plan2Each; // 例如 26 - 30 = -4
  } else if (allocType === 'double-surplus') {
    totalCandies = peopleCount * plan2Each + 4; // 保证方案2依然有盈
    s1 = totalCandies - peopleCount * plan1Each; // 大盈
    s2 = 4; // 小盈
  } else if (allocType === 'double-deficit') {
    totalCandies = peopleCount * plan1Each - 2; // 方案1就亏2
    s1 = -2;
    s2 = totalCandies - peopleCount * plan2Each; // 大亏
  }

  const currentQ = QUIZ_QUESTIONS[quizIndex];

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.titleBadge}>
          <span className={styles.badgeIcon}>🍎🧺</span>
          <span className={styles.badgeText}>四年级数学思维 · 经典分配模型</span>
        </div>
        <h2 className={styles.labTitle}>盈亏问题：为什么“一盈一亏要相加”？两次分配对比记</h2>
        <p className={styles.labSubtitle}>
          告别死记公式！通过分糖果模拟，亲眼看见“从多出来到倒欠”的总差距如何被每个人多拿的份额一点点吃掉。
        </p>
      </div>

      {/* 模式选择按钮组 */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          className={allocType === 'surplus-deficit' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setAllocType('surplus-deficit'); setActivePlan(1); }}
        >
          ⚖️ 模式一：一盈一亏 (最经典·总差相加)
        </button>
        <button
          className={allocType === 'double-surplus' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setAllocType('double-surplus'); setActivePlan(1); }}
        >
          🎁 模式二：双盈问题 (两次都有多·总差相减)
        </button>
        <button
          className={allocType === 'double-deficit' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setAllocType('double-deficit'); setActivePlan(1); }}
        >
          💸 模式三：双亏问题 (两次都不够·总差相减)
        </button>
        <button
          className={allocType === 'quiz' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => setAllocType('quiz')}
        >
          🎯 模式四：经典考点大冲关
        </button>
      </div>

      {/* 演示工作区 */}
      {allocType !== 'quiz' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          {/* 方案切换胶囊 */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>切换观察分配过程：</span>
            <button
              className={activePlan === 1 ? styles.primaryBtn : styles.secondaryBtn}
              onClick={() => setActivePlan(1)}
              style={{ padding: '0.5rem 1rem' }}
            >
              📋 方案一：每人分 {plan1Each} 颗糖
            </button>
            <button
              className={activePlan === 2 ? styles.primaryBtn : styles.secondaryBtn}
              onClick={() => setActivePlan(2)}
              style={{ padding: '0.5rem 1rem' }}
            >
              🚀 方案二：每人分 {plan2Each} 颗糖 (每人多拿 {plan2Each - plan1Each} 颗)
            </button>
          </div>

          {/* SVG 分糖果实景舞台 */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.25rem', overflowX: 'auto', marginBottom: '1.25rem' }}>
            <svg viewBox="0 0 760 250" style={{ width: '100%', minWidth: '600px', display: 'block' }}>
              {/* 桌子桌面 */}
              <rect x="30" y="110" width="700" height="15" rx="3" fill="#78350f" />
              <rect x="50" y="125" width="20" height="100" fill="#451a03" />
              <rect x="690" y="125" width="20" height="100" fill="#451a03" />

              {/* 小朋友与盘子 (一字排开) */}
              {Array.from({ length: peopleCount }).map((_, idx) => {
                const px = 70 + idx * 75;
                const eachCount = activePlan === 1 ? plan1Each : plan2Each;

                return (
                  <g key={idx} transform={`translate(${px}, 45)`}>
                    {/* 小朋友头像 */}
                    <circle cx="20" cy="15" r="14" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
                    <text x="20" y="20" fontSize="14" textAnchor="middle">👦</text>
                    <text x="20" y="38" fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="middle">
                      {idx + 1}号
                    </text>

                    {/* 盘子 */}
                    <ellipse cx="20" cy="65" rx="25" ry="8" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />

                    {/* 盘子里的糖果 */}
                    {Array.from({ length: eachCount }).map((_, cIdx) => (
                      <circle
                        key={cIdx}
                        cx={8 + cIdx * 7}
                        cy={62}
                        r="4"
                        fill="#ef4444"
                        stroke="#b91c1c"
                        strokeWidth="1"
                      />
                    ))}
                    <text x="20" y="80" fontSize="11" fontWeight="900" fill="#1e293b" textAnchor="middle">
                      {eachCount} 颗
                    </text>
                  </g>
                );
              })}

              {/* 右侧仓库/托盘余量展示 */}
              <g transform="translate(540, 30)">
                <rect x="0" y="0" width="180" height="75" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="90" y="22" fontSize="12" fontWeight="bold" fill="#475569" textAnchor="middle">
                  🧺 糖果篮 (总数 {totalCandies} 颗)
                </text>

                {activePlan === 1 ? (
                  s1 > 0 ? (
                    <g>
                      <text x="90" y="44" fontSize="14" fontWeight="900" fill="#15803d" textAnchor="middle">
                        ✨ 剩余 (盈) {s1} 颗
                      </text>
                      <text x="90" y="62" fontSize="11" fill="#16a34a" textAnchor="middle">
                        太棒了！糖果有多！
                      </text>
                    </g>
                  ) : (
                    <g>
                      <text x="90" y="44" fontSize="14" fontWeight="900" fill="#dc2626" textAnchor="middle">
                        ⚠️ 缺少 (亏) {Math.abs(s1)} 颗
                      </text>
                    </g>
                  )
                ) : (
                  s2 < 0 ? (
                    <g>
                      <text x="90" y="44" fontSize="14" fontWeight="900" fill="#dc2626" textAnchor="middle">
                        🚨 倒欠 (亏) {Math.abs(s2)} 颗！
                      </text>
                      <text x="90" y="62" fontSize="11" fill="#b91c1c" textAnchor="middle">
                        糖果不够分了！
                      </text>
                    </g>
                  ) : (
                    <g>
                      <text x="90" y="44" fontSize="14" fontWeight="900" fill="#15803d" textAnchor="middle">
                        ✨ 仍剩 (盈) {s2} 颗
                      </text>
                    </g>
                  )
                )}
              </g>

              {/* 底部两次分配差量对照直观条 */}
              <g transform="translate(60, 160)">
                <text x="0" y="18" fontSize="13" fontWeight="bold" fill="#0f172a">
                  两次分配总差量条：
                </text>

                {allocType === 'surplus-deficit' && (
                  <g transform="translate(130, 0)">
                    {/* 方案1多出的8颗 (绿色) */}
                    <rect x="0" y="2" width="140" height="24" rx="4" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" />
                    <text x="70" y="18" fontSize="12" fontWeight="bold" fill="#14532d" textAnchor="middle">
                      方案1多出 {s1} 颗 (盈)
                    </text>

                    {/* 方案2不够的4颗 (红色) */}
                    <rect x="145" y="2" width="80" height="24" rx="4" fill="#fca5a5" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="185" y="18" fontSize="12" fontWeight="bold" fill="#7f1d1d" textAnchor="middle">
                      还差 {Math.abs(s2)} 颗 (亏)
                    </text>

                    {/* 总跨度标注 */}
                    <line x1="0" y1="36" x2="225" y2="36" stroke="#2563eb" strokeWidth="2" />
                    <text x="112" y="52" fontSize="12" fontWeight="900" fill="#1d4ed8" textAnchor="middle">
                      从“剩 8 颗”到“缺 4 颗”，总共差了 8 + 4 = 12 颗！
                    </text>
                  </g>
                )}

                {allocType === 'double-surplus' && (
                  <g transform="translate(130, 0)">
                    <rect x="0" y="2" width="200" height="24" rx="4" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" />
                    <text x="100" y="18" fontSize="12" fontWeight="bold" fill="#14532d" textAnchor="middle">
                      方案1多出 {s1} 颗 (大盈)
                    </text>
                    <rect x="0" y="32" width="60" height="20" rx="3" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1" />
                    <text x="30" y="46" fontSize="10" fontWeight="bold" fill="#14532d" textAnchor="middle">
                      方案2多 {s2}
                    </text>
                    <text x="130" y="46" fontSize="12" fontWeight="900" fill="#1d4ed8">
                      两次差量 = {s1} - {s2} = {s1 - s2} 颗！
                    </text>
                  </g>
                )}

                {allocType === 'double-deficit' && (
                  <g transform="translate(130, 0)">
                    <rect x="0" y="2" width="200" height="24" rx="4" fill="#fca5a5" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="100" y="18" fontSize="12" fontWeight="bold" fill="#7f1d1d" textAnchor="middle">
                      方案2大亏 {Math.abs(s2)} 颗
                    </text>
                    <text x="220" y="18" fontSize="12" fontWeight="900" fill="#dc2626">
                      两次差量 = {Math.abs(s2)} - {Math.abs(s1)} = {Math.abs(s2) - Math.abs(s1)} 颗！
                    </text>
                  </g>
                )}
              </g>
            </svg>
          </div>

          {/* 公式算理解析卡片 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #bfdbfe' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1d4ed8', fontSize: '1.05rem' }}>
                💡 为什么“一盈一亏要相加”？
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e40af', lineHeight: 1.6 }}>
                从方案1切换到方案2，相当于让每个人手里<strong>“补发 2 颗”</strong>（5 - 3 = 2）。
                <br />
                先把原本多出来的 <strong>8 颗</strong> 全部发光，居然还倒欠 <strong>4 颗</strong>！
                <br />
                这说明要完成这次升级，老师必须从口袋里再多掏出 <strong>8 + 4 = 12 颗糖</strong>！
                <br />
                这 12 颗糖分给小朋友，每人分 2 颗，正好分给：
              </p>
              <div style={{ marginTop: '0.6rem', padding: '0.6rem', background: '#fff', borderRadius: '8px', fontWeight: 900, color: '#1e3a8a', textAlign: 'center', fontSize: '1rem' }}>
                人数 = (盈 + 亏) ÷ (两次每人分得之差)
                <br />
                <span style={{ color: '#2563eb' }}>(8 + 4) ÷ (5 - 3) = 6 人</span>
              </div>
            </div>

            <div style={{ background: '#fefce8', borderRadius: '12px', padding: '1.25rem', border: '1px solid #fef08a' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#854d0e', fontSize: '1.05rem' }}>
                🌟 盈亏问题终极口诀
              </h4>
              <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '8px', border: '1px solid #fde047', fontWeight: 800, fontSize: '0.95rem', color: '#713f12', lineHeight: 1.7, marginBottom: '0.5rem' }}>
                “同向相减异向加，
                <br />
                两次总差除以单人差！”
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#854d0e', lineHeight: 1.6 }}>
                <li><strong>一盈一亏（异向）：</strong> 总差 = 盈 + 亏</li>
                <li><strong>双盈（同向）：</strong> 总差 = 大盈 - 小盈</li>
                <li><strong>双亏（同向）：</strong> 总差 = 大亏 - 小亏</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 测验 */}
      {allocType === 'quiz' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
              第 {quizIndex + 1} / {QUIZ_QUESTIONS.length} 题 · {currentQ.type}
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
                  {selectedOpt === currentQ.correctIndex ? '回答正确！' : '回答有误，请看思路解析：'}
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
