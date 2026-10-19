'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type Mode = 'sum-diff' | 'multiple' | 'quiz';

interface QuizQuestion {
  id: number;
  type: '和差' | '和倍' | '差倍';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: '和差',
    question: '小明和小红一共有 40 支铅笔，小明比小红多 6 支。小明和小红各有多少支？',
    options: ['小明 23 支，小红 17 支', '小明 26 支，小红 14 支', '小明 20 支，小红 14 支', '小明 22 支，小红 18 支'],
    correctIndex: 0,
    explanation: '用“去差法”：从总数 40 支里剪掉小明多出的 6 支，剩下 34 支正好是小红的 2 倍。小红 = 34 ÷ 2 = 17 支；小明 = 17 + 6 = 23 支。'
  },
  {
    id: 2,
    type: '和倍',
    question: '学校科技组和书法组共有 60 人，科技组的人数是书法组的 3 倍。两个组各有多少人？',
    options: ['科技组 40 人，书法组 20 人', '科技组 45 人，书法组 15 人', '科技组 48 人，书法组 12 人', '科技组 50 人，书法组 10 人'],
    correctIndex: 1,
    explanation: '把书法组看作 1 份，科技组就是 3 份，合起来一共有 1 + 3 = 4 份。每份（书法组）= 60 ÷ 4 = 15 人；科技组 = 15 × 3 = 45 人。'
  },
  {
    id: 3,
    type: '差倍',
    question: '爸爸今年的年龄是小明的 4 倍，爸爸比小明大 27 岁。小明今年多少岁？',
    options: ['7 岁', '8 岁', '9 岁', '10 岁'],
    correctIndex: 2,
    explanation: '小明是 1 份，爸爸是 4 份，爸爸比小明多出 4 - 1 = 3 份。这 3 份对应的就是差值 27 岁！每份（小明）= 27 ÷ 3 = 9 岁。'
  }
];

export default function SumDifferenceMultipleLab() {
  const [mode, setMode] = useState<Mode>('sum-diff');

  // 和差参数
  const [totalSum, setTotalSum] = useState(50); // 和
  const [diff, setDiff] = useState(14); // 差
  const [sumDiffCutAnim, setSumDiffCutAnim] = useState<'none' | 'cut' | 'add'>('none');

  // 和倍/差倍参数
  const [subType, setSubType] = useState<'sum-mult' | 'diff-mult'>('sum-mult');
  const [baseUnit, setBaseUnit] = useState(12); // 小量（1份）
  const [multiplier, setMultiplier] = useState(3); // 倍数 k

  // 测验
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // 和差数学计算
  // 大数 = (和 + 差) / 2, 小数 = (和 - 差) / 2
  const smallNum = Math.round((totalSum - diff) / 2);
  const bigNum = totalSum - smallNum;

  // 和倍/差倍数学计算
  const bigVal = baseUnit * multiplier;
  const multSum = baseUnit + bigVal;
  const multDiff = bigVal - baseUnit;

  const currentQ = QUIZ_QUESTIONS[quizIndex];

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.titleBadge}>
          <span className={styles.badgeIcon}>📊📐</span>
          <span className={styles.badgeText}>三年级思维建模 · 新加坡线段图精髓</span>
        </div>
        <h2 className={styles.labTitle}>和差倍问题：线段图与“一份量”核心模型</h2>
        <p className={styles.labSubtitle}>
          为什么公式总要除以 2 或倍数差？通过动态割补线段与小方块，彻底建立“移多补少找基准”的代数直觉。
        </p>
      </div>

      {/* 模式选择 */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          className={mode === 'sum-diff' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('sum-diff'); setSumDiffCutAnim('none'); }}
        >
          ✂️ 模式一：和差问题 (割补法看懂为什么除以 2)
        </button>
        <button
          className={mode === 'multiple' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('multiple'); }}
        >
          🧱 模式二：和倍与差倍 (找准核心“一份量”)
        </button>
        <button
          className={mode === 'quiz' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => { setMode('quiz'); }}
        >
          🎯 模式三：真题实战大闯关
        </button>
      </div>

      {/* 模式一：和差问题 */}
      {mode === 'sum-diff' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          {/* 控制面板 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>➕ 两人总和 (和)</span>
                <span style={{ fontWeight: 800, color: '#2563eb' }}>{totalSum}</span>
              </div>
              <input
                type="range"
                min="30"
                max="80"
                step="2"
                value={totalSum}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTotalSum(val);
                  if (diff >= val - 10) setDiff(val - 14);
                  setSumDiffCutAnim('none');
                }}
                style={{ width: '100%', accentColor: '#2563eb' }}
              />
            </div>

            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>➖ 相差数量 (差)</span>
                <span style={{ fontWeight: 800, color: '#ef4444' }}>{diff}</span>
              </div>
              <input
                type="range"
                min="4"
                max={Math.min(30, totalSum - 10)}
                step="2"
                value={diff}
                onChange={(e) => {
                  setDiff(Number(e.target.value));
                  setSumDiffCutAnim('none');
                }}
                style={{ width: '100%', accentColor: '#ef4444' }}
              />
            </div>

            {/* 割补动画交互按钮 */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                className={sumDiffCutAnim === 'cut' ? styles.primaryBtn : styles.secondaryBtn}
                onClick={() => setSumDiffCutAnim(sumDiffCutAnim === 'cut' ? 'none' : 'cut')}
                style={{ flex: 1, padding: '0.8rem', fontSize: '0.85rem' }}
              >
                ✂️ 去差法 (求小数)
              </button>
              <button
                className={sumDiffCutAnim === 'add' ? styles.primaryBtn : styles.secondaryBtn}
                onClick={() => setSumDiffCutAnim(sumDiffCutAnim === 'add' ? 'none' : 'add')}
                style={{ flex: 1, padding: '0.8rem', fontSize: '0.85rem' }}
              >
                🩹 补差法 (求大数)
              </button>
            </div>
          </div>

          {/* SVG 线段图可视化展示区 */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.25rem', overflowX: 'auto', marginBottom: '1.25rem' }}>
            <svg viewBox="0 0 720 220" style={{ width: '100%', minWidth: '580px', display: 'block' }}>
              {/* 转换比例：最大长度 60 对应 420px */}
              {(() => {
                const pxPerUnit = 400 / 60;
                const smallW = smallNum * pxPerUnit;
                const bigW = bigNum * pxPerUnit;
                const diffW = diff * pxPerUnit;

                return (
                  <>
                    {/* 甲 (大数) */}
                    <g transform="translate(60, 45)">
                      <text x="0" y="24" fontSize="14" fontWeight="bold" fill="#1e293b">甲 (大数):</text>
                      {/* 基准相同部分 (蓝色) */}
                      <rect x="85" y="6" width={smallW} height="28" rx="5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
                      <text x={85 + smallW / 2} y="25" fontSize="12" fontWeight="bold" fill="#fff" textAnchor="middle">
                        {smallNum}
                      </text>

                      {/* 多出来的“差值”部分 (红色) */}
                      <g style={{ transition: 'all 0.4s ease', opacity: sumDiffCutAnim === 'cut' ? 0.2 : 1 }}>
                        <rect x={85 + smallW} y="6" width={diffW} height="28" rx="5" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
                        <text x={85 + smallW + diffW / 2} y="25" fontSize="12" fontWeight="bold" fill="#fff" textAnchor="middle">
                          差 {diff}
                        </text>
                      </g>

                      {/* 剪刀飞出特效 */}
                      {sumDiffCutAnim === 'cut' && (
                        <g transform={`translate(${85 + smallW + diffW / 2}, -5)`}>
                          <text x="0" y="0" fontSize="18" textAnchor="middle">✂️ 剪掉差值！</text>
                        </g>
                      )}

                      {/* 右侧数值总计 */}
                      <text x={85 + bigW + 15} y="25" fontSize="13" fontWeight="bold" fill="#1e40af">
                        甲 = {bigNum}
                      </text>
                    </g>

                    {/* 乙 (小数) */}
                    <g transform="translate(60, 115)">
                      <text x="0" y="24" fontSize="14" fontWeight="bold" fill="#1e293b">乙 (小数):</text>
                      {/* 乙的原有基准条 */}
                      <rect x="85" y="6" width={smallW} height="28" rx="5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
                      <text x={85 + smallW / 2} y="25" fontSize="12" fontWeight="bold" fill="#fff" textAnchor="middle">
                        {smallNum}
                      </text>

                      {/* 补差法虚线填补 */}
                      {sumDiffCutAnim === 'add' && (
                        <g style={{ transition: 'all 0.4s ease' }}>
                          <rect x={85 + smallW} y="6" width={diffW} height="28" rx="5" fill="#86efac" stroke="#15803d" strokeWidth="1.5" strokeDasharray="3 3" />
                          <text x={85 + smallW + diffW / 2} y="25" fontSize="11" fontWeight="bold" fill="#15803d" textAnchor="middle">
                            + 补上 {diff}
                          </text>
                          <text x={85 + smallW + diffW / 2} y="-8" fontSize="14" textAnchor="middle">🩹 补齐！</text>
                        </g>
                      )}

                      {/* 差值对齐虚线 */}
                      <line x1={85 + smallW} y1="-35" x2={85 + smallW} y2="40" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />

                      {/* 右侧数值总计 */}
                      <text x={85 + (sumDiffCutAnim === 'add' ? bigW : smallW) + 15} y="25" fontSize="13" fontWeight="bold" fill="#166534">
                        乙 = {smallNum}
                      </text>
                    </g>

                    {/* 右侧大括号标注总和 */}
                    <g transform="translate(560, 50)">
                      <path d="M 0 0 C 15 0 15 45 30 45 C 15 45 15 90 0 90" fill="none" stroke="#64748b" strokeWidth="2" />
                      <text x="40" y="42" fontSize="13" fontWeight="bold" fill="#0f172a">
                        总和 = {totalSum}
                      </text>
                      {sumDiffCutAnim === 'cut' && (
                        <text x="40" y="62" fontSize="11" fontWeight="bold" fill="#ef4444">
                          (去差后变成 {totalSum - diff})
                        </text>
                      )}
                      {sumDiffCutAnim === 'add' && (
                        <text x="40" y="62" fontSize="11" fontWeight="bold" fill="#15803d">
                          (补差后变成 {totalSum + diff})
                        </text>
                      )}
                    </g>
                  </>
                );
              })()}
            </svg>
          </div>

          {/* 割补法核心算理解剖 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '1rem', border: '1px solid #bfdbfe' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1d4ed8', fontSize: '1rem' }}>
                ✂️ 去差法求小数：为什么是 (和 - 差) ÷ 2？
              </h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#1e40af', lineHeight: 1.6 }}>
                甲比乙多 {diff}。我们一剪刀把甲多出的 {diff} <strong>剪掉扔掉</strong>！
                <br />
                两人的总数变成了 <code>{totalSum} - {diff} = {totalSum - diff}</code>。
                <br />
                此时甲和乙正好<strong>完全一样长</strong>，正好是 2 个乙！
              </p>
              <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#fff', borderRadius: '8px', fontWeight: 800, color: '#1e3a8a', textAlign: 'center', fontSize: '0.95rem' }}>
                小数 (乙) = ({totalSum} - {diff}) ÷ 2 = {smallNum}
                <br />
                大数 (甲) = {smallNum} + {diff} = {bigNum}
              </div>
            </div>

            <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '1rem', border: '1px solid #bbf7d0' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#15803d', fontSize: '1rem' }}>
                🩹 补差法求大数：为什么是 (和 + 差) ÷ 2？
              </h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#166534', lineHeight: 1.6 }}>
                乙比甲少 {diff}。我们给乙<strong>补贴上 {diff}</strong>，让乙追平甲！
                <br />
                两人的总数变成了 <code>{totalSum} + {diff} = {totalSum + diff}</code>。
                <br />
                此时两人都变成了大数，合起来正好是 2 个甲！
              </p>
              <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#fff', borderRadius: '8px', fontWeight: 800, color: '#14532d', textAlign: 'center', fontSize: '0.95rem' }}>
                大数 (甲) = ({totalSum} + {diff}) ÷ 2 = {bigNum}
                <br />
                小数 (乙) = {bigNum} - {diff} = {smallNum}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 模式二：和倍与差倍 */}
      {mode === 'multiple' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          {/* 子类型切换 */}
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <button
              className={subType === 'sum-mult' ? styles.primaryBtn : styles.secondaryBtn}
              onClick={() => setSubType('sum-mult')}
              style={{ padding: '0.5rem 1.25rem' }}
            >
              ➕ 和倍问题 (已知总和与倍数)
            </button>
            <button
              className={subType === 'diff-mult' ? styles.primaryBtn : styles.secondaryBtn}
              onClick={() => setSubType('diff-mult')}
              style={{ padding: '0.5rem 1.25rem' }}
            >
              ➖ 差倍问题 (已知相差与倍数)
            </button>
          </div>

          {/* 控制面板 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>📦 基准量 (1份)</span>
                <span style={{ fontWeight: 800, color: '#2563eb' }}>{baseUnit}</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={baseUnit}
                onChange={(e) => setBaseUnit(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2563eb' }}
              />
            </div>

            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>✖️ 倍数关系 (k 倍)</span>
                <span style={{ fontWeight: 800, color: '#16a34a' }}>{multiplier} 倍</span>
              </div>
              <input
                type="range"
                min="2"
                max="5"
                step="1"
                value={multiplier}
                onChange={(e) => setMultiplier(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#16a34a' }}
              />
            </div>
          </div>

          {/* SVG 方块格子图 */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.25rem', overflowX: 'auto', marginBottom: '1.25rem' }}>
            <svg viewBox="0 0 700 200" style={{ width: '100%', minWidth: '560px', display: 'block' }}>
              {/* 乙 (1 份) */}
              <g transform="translate(60, 40)">
                <text x="0" y="24" fontSize="14" fontWeight="bold" fill="#1e293b">乙 (1 份):</text>
                <rect x="85" y="4" width="60" height="30" rx="5" fill="#60a5fa" stroke="#2563eb" strokeWidth="2" />
                <text x="115" y="24" fontSize="12" fontWeight="bold" fill="#fff" textAnchor="middle">1 份</text>
                <text x="160" y="24" fontSize="13" fontWeight="bold" fill="#2563eb">= {baseUnit}</text>
              </g>

              {/* 甲 (k 份) */}
              <g transform="translate(60, 105)">
                <text x="0" y="24" fontSize="14" fontWeight="bold" fill="#1e293b">甲 ({multiplier} 份):</text>
                {Array.from({ length: multiplier }).map((_, idx) => (
                  <g key={idx} transform={`translate(${85 + idx * 65}, 4)`}>
                    <rect
                      x="0"
                      y="0"
                      width="60"
                      height="30"
                      rx="5"
                      fill={idx === 0 ? '#60a5fa' : subType === 'diff-mult' ? '#fca5a5' : '#86efac'}
                      stroke={idx === 0 ? '#2563eb' : subType === 'diff-mult' ? '#dc2626' : '#16a34a'}
                      strokeWidth="2"
                    />
                    <text x="30" y="20" fontSize="12" fontWeight="bold" fill="#fff" textAnchor="middle">
                      {idx + 1} 份
                    </text>
                  </g>
                ))}

                {/* 差值高亮方框标注 */}
                {subType === 'diff-mult' && (
                  <g transform={`translate(${85 + 65}, -5)`}>
                    <rect x="0" y="0" width={(multiplier - 1) * 65 - 5} height="48" rx="6" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 3" />
                    <text x={((multiplier - 1) * 65 - 5) / 2} y="-10" fontSize="12" fontWeight="bold" fill="#dc2626" textAnchor="middle">
                      多出 {multiplier - 1} 份 (相差 {multDiff})
                    </text>
                  </g>
                )}

                <text x={85 + multiplier * 65 + 15} y="24" fontSize="13" fontWeight="bold" fill="#15803d">
                  = {bigVal}
                </text>
              </g>

              {/* 标注总和 */}
              {subType === 'sum-mult' && (
                <g transform={`translate(${85 + multiplier * 65 + 90}, 75)`}>
                  <text x="0" y="0" fontSize="13" fontWeight="bold" fill="#0f172a">
                    共 {1 + multiplier} 份
                  </text>
                  <text x="0" y="20" fontSize="14" fontWeight="900" fill="#2563eb">
                    总和 = {multSum}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* 公式提炼卡 */}
          <div style={{ background: subType === 'sum-mult' ? '#eff6ff' : '#fef2f2', borderRadius: '12px', padding: '1.25rem', border: `1px solid ${subType === 'sum-mult' ? '#bfdbfe' : '#fca5a5'}` }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: subType === 'sum-mult' ? '#1d4ed8' : '#b91c1c', fontSize: '1.05rem' }}>
              💡 {subType === 'sum-mult' ? '和倍问题黄金公式' : '差倍问题黄金公式'}
            </h4>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.92rem', color: '#334155', lineHeight: 1.6 }}>
              {subType === 'sum-mult' ? (
                <>
                  把较小数看作 <strong>1 份</strong>，较大数就是 <strong>{multiplier} 份</strong>，合起来一共是 <strong>1 + {multiplier} = {1 + multiplier} 份</strong>！
                </>
              ) : (
                <>
                  较大数是 {multiplier} 份，较小数是 1 份，较大数比较小数足足多出了 <strong>{multiplier} - 1 = {multiplier - 1} 份</strong>！
                </>
              )}
            </p>
            <div style={{ background: '#fff', padding: '0.75rem', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', color: subType === 'sum-mult' ? '#1e3a8a' : '#991b1b', textAlign: 'center' }}>
              {subType === 'sum-mult' ? (
                <>
                  一倍量 (小数) = 和 ÷ (倍数 + 1) = {multSum} ÷ ({multiplier} + 1) = {baseUnit}
                </>
              ) : (
                <>
                  一倍量 (小数) = 差 ÷ (倍数 - 1) = {multDiff} ÷ ({multiplier} - 1) = {baseUnit}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 模式三：真题闯关 */}
      {mode === 'quiz' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
              第 {quizIndex + 1} / {QUIZ_QUESTIONS.length} 题 · {currentQ.type}应用题
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
                  {selectedOpt === currentQ.correctIndex ? '回答正确！' : '回答有误，请看线段图解题思路：'}
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
