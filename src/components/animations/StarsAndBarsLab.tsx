'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Layers, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

export default function StarsAndBarsLab() {
  const [mode, setMode] = useState<'atLeastOne' | 'allowZero'>('atLeastOne');
  const [appleCount, setAppleCount] = useState<number>(10); // 苹果数 n (5 ~ 12)
  const [peopleCount, setPeopleCount] = useState<number>(3); // 人数 k (2 ~ 4)

  // 组合数计算 C(n, k)
  const comb = (n: number, k: number): number => {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    let res = 1;
    for (let i = 1; i <= k; i++) {
      res = (res * (n - i + 1)) / i;
    }
    return Math.round(res);
  };

  // 模式一：每人至少1个，在 (n-1) 个空隙中插 (k-1) 块板
  const slotsCountAtLeastOne = appleCount - 1;
  const barsCount = peopleCount - 1;
  const totalWaysAtLeastOne = comb(slotsCountAtLeastOne, barsCount);

  // 模式二：允许分0个，先借后还，等价于 (n+k) 个苹果每人至少1个
  const equivApples = appleCount + peopleCount;
  const slotsCountAllowZero = equivApples - 1;
  const totalWaysAllowZero = comb(slotsCountAllowZero, barsCount);

  // 交互插板位置 (默认插在 2 和 6 处)
  const [selectedSlots, setSelectedSlots] = useState<number[]>([2, 6]);

  const toggleSlot = (idx: number) => {
    if (selectedSlots.includes(idx)) {
      setSelectedSlots(selectedSlots.filter(s => s !== idx));
    } else {
      if (selectedSlots.length < barsCount) {
        setSelectedSlots([...selectedSlots, idx].sort((a, b) => a - b));
      } else {
        // 替换最早选的一个
        setSelectedSlots([...selectedSlots.slice(1), idx].sort((a, b) => a - b));
      }
    }
  };

  // 计算当前插板方案下的每人分配苹果数
  const getAllocation = () => {
    if (selectedSlots.length < barsCount) return null;
    const sorted = [...selectedSlots].sort((a, b) => a - b);
    const cuts = [0, ...sorted.map(s => s + 1), appleCount];
    const shares: number[] = [];
    for (let i = 0; i < cuts.length - 1; i++) {
      shares.push(cuts[i + 1] - cuts[i]);
    }
    return shares;
  };

  const currentAllocation = getAllocation();

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Layers size={18} style={{ color: '#ea580c' }} />
          <span>排列组合隔板法：相同元素分配与插板思维</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${mode === 'atLeastOne' ? styles.controlBtnActive : ''}`}
            onClick={() => setMode('atLeastOne')}
          >
            🍎 经典插板 (每人至少分1个)
          </button>
          <button
            className={`${styles.controlBtn} ${mode === 'allowZero' ? styles.controlBtnActive : ''}`}
            onClick={() => setMode('allowZero')}
          >
            🎁 先借后还 (允许有人分0个)
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '640px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* 原理提示卡 */}
          <div style={{
            width: '100%',
            background: mode === 'atLeastOne' ? '#fff7ed' : '#f0f9ff',
            padding: '12px 14px',
            borderRadius: '8px',
            borderLeft: `4px solid ${mode === 'atLeastOne' ? '#ea580c' : '#0284c7'}`,
            fontSize: '0.85rem',
            color: mode === 'atLeastOne' ? '#9a3412' : '#075985',
            lineHeight: 1.6
          }}>
            {mode === 'atLeastOne' ? (
              <>
                <strong>【每人至少1个：经典隔板法】：</strong>
                <br />
                {appleCount} 个苹果排成一排，中间有 <strong>{slotsCountAtLeastOne} 个空隙</strong>。
                <br />
                分给 {peopleCount} 个人只需插 <strong>{barsCount} 块隔板</strong>！
                <br />
                总分配方案数 = <strong>C({slotsCountAtLeastOne}, {barsCount}) = {totalWaysAtLeastOne} 种</strong>！
              </>
            ) : (
              <>
                <strong>【允许分0个：先借后还绝技】：</strong>
                <br />
                先向每人借1个苹果（共增 {peopleCount} 个），变成 {equivApples} 个苹果每人至少1个！
                <br />
                有 <strong>{slotsCountAllowZero} 个空隙</strong>，插 <strong>{barsCount} 块板</strong>！
                <br />
                总分配方案数 = <strong>C({slotsCountAllowZero}, {barsCount}) = {totalWaysAllowZero} 种</strong>！
              </>
            )}
          </div>

          {/* 交互插板排练区 */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            background: '#fafaf9',
            border: '1.5px solid #e7e5e4',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#78716c', marginBottom: '8px' }}>
              点击下方黄色空隙 插入或切换 {barsCount} 块木板：
            </span>

            {/* 苹果与空隙水平排列 */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', gap: '4px' }}>
              {Array.from({ length: appleCount }).map((_, i) => (
                <React.Fragment key={i}>
                  {/* 苹果 */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    boxShadow: '0 2px 4px rgba(239,68,68,0.2)'
                  }}>
                    🍎
                  </div>

                  {/* 空隙插板槽 (最后一个苹果后没有空隙) */}
                  {i < appleCount - 1 && (
                    <button
                      onClick={() => toggleSlot(i)}
                      style={{
                        width: '18px',
                        height: '40px',
                        borderRadius: '4px',
                        border: selectedSlots.includes(i) ? '2px solid #b45309' : '1px dashed #cbd5e1',
                        background: selectedSlots.includes(i) ? '#f59e0b' : '#ffffff',
                        color: selectedSlots.includes(i) ? '#ffffff' : '#94a3b8',
                        fontSize: '9px',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease'
                      }}
                      title={`空隙 ${i + 1}`}
                    >
                      {selectedSlots.includes(i) ? '🪵' : `${i + 1}`}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* 当前切分结果显示 */}
            {currentAllocation ? (
              <div style={{
                marginTop: '14px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#ecfdf5',
                border: '1px solid #86efac',
                fontSize: '0.85rem',
                color: '#065f46',
                fontWeight: 800,
                display: 'flex',
                gap: '12px'
              }}>
                {currentAllocation.map((cnt, pIdx) => (
                  <span key={pIdx}>
                    第 {pIdx + 1} 堆: <strong>{cnt} 个</strong>
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.75rem', color: '#ea580c', marginTop: '10px' }}>
                请点击选择恰好 {barsCount} 块隔板进行切分
              </div>
            )}
          </div>

          {/* 实时公式看板 */}
          <div style={{
            marginTop: '14px',
            width: '100%',
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '8px',
            padding: '12px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 700 }}>组合算式计算：</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#c2410c' }}>
                {mode === 'atLeastOne'
                  ? `C(${slotsCountAtLeastOne}, ${barsCount})`
                  : `C(${slotsCountAllowZero}, ${barsCount})`}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#9a3412' }}>总可能分配方案</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ea580c' }}>
                {mode === 'atLeastOne' ? totalWaysAtLeastOne : totalWaysAllowZero} 种
              </div>
            </div>
          </div>

          {/* 滑块调节苹果数与人数 */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            background: '#ffffff',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
                <span>待分苹果总数 n：</span>
                <span style={{ color: '#ea580c' }}>{appleCount} 个 (空隙 {appleCount - 1} 个)</span>
              </div>
              <input
                type="range"
                min="5"
                max="12"
                value={appleCount}
                onChange={(e) => {
                  setAppleCount(Number(e.target.value));
                  setSelectedSlots([1, 3]);
                }}
                style={{ width: '100%', accentColor: '#ea580c', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
                <span>分给小朋友人数 k：</span>
                <span style={{ color: '#0284c7' }}>{peopleCount} 人 (插板 {peopleCount - 1} 块)</span>
              </div>
              <input
                type="range"
                min="2"
                max="4"
                value={peopleCount}
                onChange={(e) => {
                  setPeopleCount(Number(e.target.value));
                  setSelectedSlots([1]);
                }}
                style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
