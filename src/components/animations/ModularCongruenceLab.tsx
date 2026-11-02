'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Hash, Sparkles, CheckCircle2, ArrowRight, Lightbulb, RefreshCw } from 'lucide-react';

export default function ModularCongruenceLab() {
  const [activeTab, setActiveTab] = useState<'stepwise' | 'threeRules'>('stepwise');

  // 韩信点兵逐步满足法：除以3余2，除以7余2，除以5余3
  // 1. 3和7同余2 => 满足 21k + 2
  // 2. 依次测试: 2, 23, 44, 65, 86
  const candidateList = [2, 23, 44, 65, 86];
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentNum = candidateList[currentIndex];
  const mod5 = currentNum % 5;
  const isMatch = mod5 === 3;

  // 三大同余口诀选卡
  const [selectedRule, setSelectedRule] = useState<'remSame' | 'diffSame' | 'sumSame'>('remSame');

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Hash size={18} style={{ color: '#7c3aed' }} />
          <span>数论进阶：同余特性与韩信点兵（逐步满足法）</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${activeTab === 'stepwise' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('stepwise')}
          >
            <Sparkles size={14} />
            <span>韩信点兵 (步长跳跃法)</span>
          </button>
          <button
            className={`${styles.controlBtn} ${activeTab === 'threeRules' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('threeRules')}
          >
            <Lightbulb size={14} />
            <span>同余三大口诀 (余同/差同/和同)</span>
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* TAB 1: 逐步满足法 */}
        {activeTab === 'stepwise' && (
          <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              width: '100%'
            }}>
              <div style={{
                background: '#faf5ff',
                padding: '10px 14px',
                borderRadius: '8px',
                borderLeft: '4px solid #a855f7',
                fontSize: '0.875rem',
                color: '#6b21a8',
                lineHeight: 1.6
              }}>
                <strong>【韩信点兵经典古题】：</strong>
                一个数<strong>除以 3 余 2</strong>，<strong>除以 7 余 2</strong>，<strong>除以 5 余 3</strong>。
                这个数最小是多少？
                <br />
                孩子面对 3 个条件往往手足无措。看数学家如何先抓两个“余同”，再按公倍数大步跳跃！
              </div>

              {/* 解题两步走流水线 */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* 第 1 步：余同合并 */}
                <div style={{
                  padding: '12px 14px',
                  background: '#f1f5f9',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                    第 1 步：抓【余同】——除以 3 余 2，除以 7 也余 2！
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b', marginTop: '2px' }}>
                    3 和 7 的最小公倍数是 21 ➔ 该数形式必为：21k + 2
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                    符合前两个条件的候选数序列：2, 23, 44, 65, 86, ...
                  </div>
                </div>

                {/* 第 2 步：候选数跳跃测试 */}
                <div style={{
                  padding: '16px',
                  background: isMatch ? '#ecfdf5' : '#f8fafc',
                  border: `1.5px solid ${isMatch ? '#86efac' : '#cbd5e1'}`,
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                    第 2 步：按 21 的步长跳跃，逐个代入测试【除以 5 余 3】
                  </div>

                  <div style={{ fontSize: '2rem', fontWeight: 900, color: isMatch ? '#16a34a' : '#0f172a', margin: '8px 0' }}>
                    候选数：{currentNum}
                  </div>

                  <div style={{ fontSize: '1rem', fontWeight: 700, color: isMatch ? '#15803d' : '#b45309' }}>
                    {currentNum} ÷ 5 = {Math.floor(currentNum / 5)} ... 余 {mod5}
                    {isMatch ? ' 🎉 正好余 3！完美命中！' : ' ❌ 不符合(要余3)'}
                  </div>
                </div>
              </div>
            </div>

            {/* 控制器 */}
            <div style={{
              marginTop: '16px',
              width: '100%',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {candidateList.map((num, idx) => (
                <button
                  key={idx}
                  className={`${styles.controlBtn} ${currentIndex === idx ? styles.controlBtnActive : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                >
                  测试候选数 {num} {num === 23 ? '(正解)' : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: 三大同余口诀 */}
        {activeTab === 'threeRules' && (
          <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              width: '100%'
            }}>
              <div style={{
                background: '#f0fdf4',
                padding: '10px 14px',
                borderRadius: '8px',
                borderLeft: '4px solid #16a34a',
                fontSize: '0.875rem',
                color: '#166534',
                lineHeight: 1.6
              }}>
                <strong>【同余问题终身三口诀】：</strong>
                <br />
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#15803d' }}>
                  “余同取余，差同减差，和同加和，公倍数做周期！”
                </span>
              </div>

              {/* 三大卡片切换 */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  className={`${styles.controlBtn} ${selectedRule === 'remSame' ? styles.controlBtnActive : ''}`}
                  onClick={() => setSelectedRule('remSame')}
                >
                  1. 余同取余 (余数相同)
                </button>
                <button
                  className={`${styles.controlBtn} ${selectedRule === 'diffSame' ? styles.controlBtnActive : ''}`}
                  onClick={() => setSelectedRule('diffSame')}
                >
                  2. 差同减差 (除数减余数相同)
                </button>
                <button
                  className={`${styles.controlBtn} ${selectedRule === 'sumSame' ? styles.controlBtnActive : ''}`}
                  onClick={() => setSelectedRule('sumSame')}
                >
                  3. 和同加和 (除数加余数相同)
                </button>
              </div>

              {/* 口诀详解面板 */}
              <div style={{
                marginTop: '14px',
                padding: '14px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.85rem',
                lineHeight: 1.6
              }}>
                {selectedRule === 'remSame' && (
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>📌 余同取余：几个除法的余数完全一样</div>
                    <div style={{ color: '#475569', marginTop: '4px' }}>
                      例：除以 4 余 1，除以 5 余 1，除以 6 余 1。
                      <br />
                      解法：公倍数 加上 相同余数 ➔ [4, 5, 6]k + 1 = <strong>60k + 1</strong>（最小是 61）！
                    </div>
                  </div>
                )}

                {selectedRule === 'diffSame' && (
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>📌 差同减差：除数与余数的差额完全一样 (都缺相同的数)</div>
                    <div style={{ color: '#475569', marginTop: '4px' }}>
                      例：除以 4 余 3 (差1)，除以 5 余 4 (差1)，除以 6 余 5 (差1)。
                      <br />
                      解法：每个人都差 1 就能整除！公倍数 减去 相同差额 ➔ [4, 5, 6]k - 1 = <strong>60k - 1</strong>（最小是 59）！
                    </div>
                  </div>
                )}

                {selectedRule === 'sumSame' && (
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>📌 和同加和：除数加余数的总和完全一样</div>
                    <div style={{ color: '#475569', marginTop: '4px' }}>
                      例：除以 5 余 3 (和是8)，除以 6 余 2 (和是8)。
                      <br />
                      解法：公倍数 加上 相同和 ➔ [5, 6]k + 8 = <strong>30k + 8</strong>（最小是 38）！
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

