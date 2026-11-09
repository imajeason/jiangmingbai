'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Mail, CheckCircle2, AlertTriangle, Sparkles, RotateCcw, Shuffle, ArrowRight } from 'lucide-react';

export default function DerangementLetterLab() {
  const [n, setN] = useState<3 | 4>(4); // 信封数量 3 或 4
  // 当前放置状态: slots[i] 表示第 (i+1) 个信封里装的是哪个信件索引 (0=A, 1=B, 2=C, 3=D)
  // 初始为全错配的一种预设 (例如 B, A, D, C)
  const [slots, setSlots] = useState<(number | null)[]>([1, 0, 3, 2]);
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);

  const letterNames = ['A', 'B', 'C', 'D', 'E'];
  const envelopeNames = ['1号信封', '2号信封', '3号信封', '4号信封', '5号信封'];

  // 重置为指定 n
  const switchN = (newN: 3 | 4) => {
    setN(newN);
    if (newN === 3) {
      setSlots([1, 2, 0]); // B, C, A 全错配
    } else {
      setSlots([1, 0, 3, 2]); // B, A, D, C 全错配
    }
    setSelectedLetter(null);
  };

  // 检查每个信封是否装错 (信件索引 === 信封索引 表示装对了，即不是错配)
  // 装对表示错误（题目要求全错）
  const matchStatuses = slots.slice(0, n).map((letterIdx, envIdx) => {
    if (letterIdx === null) return 'empty';
    return letterIdx === envIdx ? 'correct' : 'deranged';
  });

  const allAssigned = slots.slice(0, n).every((s) => s !== null);
  const correctCount = matchStatuses.filter((s) => s === 'correct').length;
  const isAllDeranged = allAssigned && correctCount === 0;

  // 预先算出的所有全错排方案
  const allDerangements3 = [
    [1, 2, 0], // B, C, A
    [2, 0, 1], // C, A, B
  ];

  const allDerangements4 = [
    [1, 0, 3, 2], // B, A, D, C (互换对: 1-2, 3-4)
    [1, 2, 3, 0], // B, C, D, A
    [1, 3, 0, 2], // B, D, A, C
    [2, 0, 3, 1], // C, A, D, B
    [2, 3, 0, 1], // C, D, A, B
    [2, 3, 1, 0], // C, D, B, A
    [3, 0, 1, 2], // D, A, B, C
    [3, 2, 0, 1], // D, C, A, B
    [3, 2, 1, 0], // D, C, B, A
  ];

  const derangementList = n === 3 ? allDerangements3 : allDerangements4;

  // 放置信件到信封
  const placeInEnvelope = (envIdx: number) => {
    if (selectedLetter === null) return;
    const newSlots = [...slots];
    // 如果该信件已在其他信封，先移除
    for (let i = 0; i < n; i++) {
      if (newSlots[i] === selectedLetter) {
        newSlots[i] = null;
      }
    }
    newSlots[envIdx] = selectedLetter;
    setSlots(newSlots);
    setSelectedLetter(null);
  };

  // 快速套用某个方案
  const applySolution = (sol: number[]) => {
    setSlots([...sol]);
    setSelectedLetter(null);
  };

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mail className={styles.icon} />
          <h2 className={styles.title}>错位重排与错装信封实验室</h2>
        </div>
        <p className={styles.description}>
          体验大数学家伯努利提出的装错信封谜题！当每封信都不在自己的信封中时，如何用严密递推公式 D(n) = (n-1)[D(n-1) + D(n-2)] 瞬间秒杀！
        </p>
      </div>

      {/* 信封数量选择 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>选择信封数量：</span>
        <button
          onClick={() => switchN(3)}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            backgroundColor: n === 3 ? '#4f46e5' : '#f1f5f9',
            color: n === 3 ? '#ffffff' : '#475569',
          }}
        >
          3 封信（D₃ = 2 种）
        </button>
        <button
          onClick={() => switchN(4)}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            backgroundColor: n === 4 ? '#4f46e5' : '#f1f5f9',
            color: n === 4 ? '#ffffff' : '#475569',
          }}
        >
          4 封信（D₄ = 9 种）
        </button>
      </div>

      {/* 互动投递操作台 */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          padding: '24px 16px',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* 信件托盘 (待选信件) */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
            ① 点击选择一封信（信件原主人为对应数字）：
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {Array.from({ length: n }).map((_, idx) => {
              const isSelected = selectedLetter === idx;
              // 检查该信件是否已被装入某个信封
              const assignedEnv = slots.findIndex((s) => s === idx);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedLetter(isSelected ? null : idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    backgroundColor: isSelected ? '#4f46e5' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#1e293b',
                    border: isSelected ? '2px solid #3730a3' : '2px solid #cbd5e1',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>✉️</span>
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>
                    信件 {letterNames[idx]} (属 {idx + 1}号)
                  </span>
                  {assignedEnv !== -1 && (
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: isSelected ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#64748b',
                      }}
                    >
                      在{assignedEnv + 1}号
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 信封卡槽 (目标位置) */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
            ② 点击信封放入所选信件（目标：让每个信封里的信件都装错！）：
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 1fr)`, gap: '12px' }}>
            {Array.from({ length: n }).map((_, envIdx) => {
              const letterIdx = slots[envIdx];
              const status = matchStatuses[envIdx];

              let borderColor = '#cbd5e1';
              let bgColor = '#ffffff';

              if (status === 'correct') {
                borderColor = '#ef4444'; // 错配失败（装对了原主）
                bgColor = '#fef2f2';
              } else if (status === 'deranged') {
                borderColor = '#10b981'; // 错配成功（装错别人家）
                bgColor = '#ecfdf5';
              }

              return (
                <div
                  key={envIdx}
                  onClick={() => placeInEnvelope(envIdx)}
                  style={{
                    border: `2px dashed ${borderColor}`,
                    backgroundColor: bgColor,
                    borderRadius: '12px',
                    padding: '16px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: selectedLetter !== null ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                    📮 {envelopeNames[envIdx]}
                  </div>

                  <div
                    style={{
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 800,
                    }}
                  >
                    {letterIdx !== null ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px' }}>📄</span>
                        <span style={{ color: letterIdx === envIdx ? '#dc2626' : '#047857' }}>
                          信件 {letterNames[letterIdx]}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>[空] 点击放入</span>
                    )}
                  </div>

                  {letterIdx !== null && (
                    <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 600 }}>
                      {status === 'correct' ? (
                        <span style={{ color: '#dc2626' }}>❌ 装对了(非错位)</span>
                      ) : (
                        <span style={{ color: '#059669' }}>✅ 错位装入</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 实时状态检测条 */}
        <div
          style={{
            marginTop: '16px',
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: isAllDeranged ? '#dcfce7' : '#fff1f2',
            border: `1px solid ${isAllDeranged ? '#86efac' : '#fecdd3'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isAllDeranged ? (
              <>
                <CheckCircle2 color="#16a34a" size={20} />
                <span style={{ fontWeight: 700, color: '#15803d', fontSize: '14px' }}>
                  🎉 达成完美全错位！所有信件都没有装进自己的原信封！
                </span>
              </>
            ) : (
              <>
                <AlertTriangle color="#e11d48" size={20} />
                <span style={{ fontWeight: 600, color: '#be123c', fontSize: '14px' }}>
                  {!allAssigned
                    ? '尚有信封为空，请将全部信件放入信封。'
                    : `当前有 ${correctCount} 封信装对了原信封，不是全错位！`}
                </span>
              </>
            )}
          </div>

          <button
            onClick={() => {
              // 随机打乱产生一个全错排
              const randIdx = Math.floor(Math.random() * derangementList.length);
              applySolution(derangementList[randIdx]);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <Shuffle size={14} /> 随机换一种全错排
          </button>
        </div>
      </div>

      {/* 全错排方案一览与递推公式卡片 */}
      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* 全部合法方案列表 */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px', marginBottom: '10px' }}>
            📋 {n} 封信全部 {derangementList.length} 种全错排方案（点击快速应用）：
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {derangementList.map((sol, sIdx) => {
              const solStr = sol.map((idx) => letterNames[idx]).join(' - ');
              const isCurrent = sol.every((v, i) => v === slots[i]);

              return (
                <button
                  key={sIdx}
                  onClick={() => applySolution(sol)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: isCurrent ? '#4f46e5' : '#f8fafc',
                    color: isCurrent ? '#ffffff' : '#334155',
                    border: isCurrent ? '1px solid #3730a3' : '1px solid #e2e8f0',
                  }}
                >
                  方案{sIdx + 1}: [{solStr}]
                </button>
              );
            })}
          </div>
        </div>

        {/* 递推公式精讲 */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px', marginBottom: '8px' }}>
            💡 递推万能钥匙：D(n) = (n-1)[D(n-1) + D(n-2)]
          </div>
          <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 6px 0' }}>
              信件 A 挑信封有 <b>(n - 1)</b> 种选法。选定后拆分为两大互斥情况：
            </p>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              <li>
                <b>两人互换锁死</b>：对方恰好进了 A 的信封，剩下 n-2 封全错排，方案数为 <b>D(n-2)</b>。
              </li>
              <li>
                <b>非互换连锁</b>：对方不进 A 的信封，等价于剩下 n-1 封全错排，方案数为 <b>D(n-1)</b>。
              </li>
            </ul>
            <div style={{ marginTop: '8px', fontWeight: 700, color: '#4f46e5' }}>
              D(4) = (4 - 1) × [D(3) + D(2)] = 3 × (2 + 1) = 9 种！
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

