'use client';

import React, { useState } from 'react';
import { RotateCcw, Users, Sparkles, HelpCircle, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import styles from '@/styles/animations.module.css';

type Mode = 'bothRank' | 'frontBack' | 'between';

export default function LineUpOrderingLab() {
  const [mode, setMode] = useState<Mode>('bothRank');
  
  // 场景 1 状态：从左数与从右数
  const [leftRank, setLeftRank] = useState<number>(4); // 小明从左数第几
  const [rightRank, setRightRank] = useState<number>(5); // 小明从右数第几
  
  // 场景 2 状态：前面有几人，后面有几人
  const [frontCount, setFrontCount] = useState<number>(3);
  const [backCount, setBackCount] = useState<number>(4);

  // 场景 3 状态：小红与小亮排第几，中间有几人
  const [posA, setPosA] = useState<number>(3); // 小红
  const [posB, setPosB] = useState<number>(8); // 小亮

  // 动画状态步骤：0 默认全部, 1 强调左侧/前面, 2 强调右侧/后面, 3 高亮重复/核心
  const [highlightStep, setHighlightStep] = useState<number>(3);

  // 计算总人数
  const totalBothRank = leftRank + rightRank - 1;
  const totalFrontBack = frontCount + backCount + 1;
  const totalBetweenQueue = Math.max(posA, posB) + 2;
  const betweenCount = Math.abs(posB - posA) - 1;

  // 头像配色
  const avatarColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899',
    '#06b6d4', '#f97316', '#6366f1', '#14b8a6', '#84cc16',
    '#a855f7', '#0ea5e9'
  ];

  return (
    <div className={styles.labContainer}>
      {/* 顶部标题与模式切换 */}
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Users size={18} color="#2563eb" />
          <span>排队问题实验室：到底什么时候加 1、减 1？</span>
          <span className="badge badge-blue">基数与序数辨析</span>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          看清“小明”身上的双重帽子
        </span>
      </div>

      {/* 模式切换 Tabs */}
      <div style={{ display: 'flex', gap: '8px', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <button
          onClick={() => { setMode('bothRank'); setHighlightStep(3); }}
          className={`btn ${mode === 'bothRank' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '6px 14px' }}
        >
          题型一：双向报数（左数第 4，右数第 5）
        </button>
        <button
          onClick={() => { setMode('frontBack'); setHighlightStep(3); }}
          className={`btn ${mode === 'frontBack' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '6px 14px' }}
        >
          题型二：前后人数（前有 3 人，后有 4 人）
        </button>
        <button
          onClick={() => { setMode('between'); setHighlightStep(3); }}
          className={`btn ${mode === 'between' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '6px 14px' }}
        >
          题型三：两人之间有几人？
        </button>
      </div>

      <div className={styles.canvasWrapper} style={{ padding: '28px 20px', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
        {/* 1. 题型一：双向报数可视化 (leftRank + rightRank - 1) */}
        {mode === 'bothRank' && (
          <div>
            {/* 顶栏排队方向指示 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '640px', margin: '0 auto 16px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb' }}>
                <ArrowLeft size={16} /> 从左往右数（排头）
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#db2777' }}>
                从右往左数（排尾） <ArrowRight size={16} />
              </div>
            </div>

            {/* 排队小朋友队列展示 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: '12px',
              minHeight: '160px',
              padding: '20px 10px',
              overflowX: 'auto',
              background: '#f1f5f9',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              maxWidth: '680px',
              margin: '0 auto',
            }}>
              {Array.from({ length: totalBothRank }).map((_, index) => {
                const isTarget = index === leftRank - 1; // 小明
                const leftNum = index + 1; // 从左数第几
                const rightNum = totalBothRank - index; // 从右数第几
                const isLeftPart = index < leftRank;
                const isRightPart = index >= leftRank - 1;

                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {/* 小明头顶上的双重计数光环 */}
                    {isTarget ? (
                      <div style={{
                        position: 'absolute',
                        top: '-38px',
                        background: '#fef08a',
                        border: '2px solid #ca8a04',
                        color: '#854d0e',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 8px rgba(202,138,4,0.3)',
                        animation: 'bounce 1s infinite alternate',
                      }}>
                        ⭐ 小明 (被数了2次!)
                      </div>
                    ) : null}

                    {/* 从左数的序号标签 */}
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isLeftPart ? '#2563eb' : '#94a3b8',
                      marginBottom: '4px',
                      background: isLeftPart ? '#dbeafe' : 'transparent',
                      padding: '1px 6px',
                      borderRadius: '4px',
                    }}>
                      左{leftNum}
                    </div>

                    {/* 卡通小人形象 */}
                    <div style={{
                      width: isTarget ? '48px' : '40px',
                      height: isTarget ? '48px' : '40px',
                      borderRadius: '50%',
                      background: isTarget ? '#fbbf24' : avatarColors[index % avatarColors.length],
                      border: isTarget ? '3px solid #d97706' : '2px solid #ffffff',
                      boxShadow: isTarget ? '0 0 0 4px #fef08a, 0 4px 10px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: isTarget ? '1rem' : '0.85rem',
                      zIndex: isTarget ? 2 : 1,
                      transform: isTarget ? 'scale(1.1)' : 'scale(1)',
                    }}>
                      {isTarget ? '明' : `${index + 1}`}
                    </div>

                    {/* 从右数的序号标签 */}
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isRightPart ? '#db2777' : '#94a3b8',
                      marginTop: '6px',
                      background: isRightPart ? '#fce7f3' : 'transparent',
                      padding: '1px 6px',
                      borderRadius: '4px',
                    }}>
                      右{rightNum}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 核心算式与几何透视 */}
            <div style={{
              maxWidth: '620px',
              margin: '24px auto 0',
              background: '#ffffff',
              border: '2px solid #e0e7ff',
              borderRadius: '14px',
              padding: '18px 24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '8px' }}>
                算式拆解：为什么必须 <span style={{ color: '#dc2626', fontWeight: 800 }}>- 1</span>？
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#1e293b' }}>
                <span style={{ color: '#2563eb' }}>{leftRank}</span> (包含小明) +{' '}
                <span style={{ color: '#db2777' }}>{rightRank}</span> (包含小明) -{' '}
                <span style={{ color: '#dc2626', background: '#fee2e2', padding: '0 6px', borderRadius: '4px' }}>1</span> (扣去小明重数) ={' '}
                <span style={{ color: '#16a34a' }}>{totalBothRank}</span> 人
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>
                从左数小明被数了 1 遍，从右数小明又被数了 1 遍。小明只有 1 个人，多算了一次必须减去！
              </div>
            </div>
          </div>
        )}

        {/* 2. 题型二：前后人数可视化 (frontCount + backCount + 1) */}
        {mode === 'frontBack' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '0.9rem', color: '#475569' }}>
              排队场景：小明前面有 <strong style={{ color: '#2563eb' }}>{frontCount}</strong> 人，后面有 <strong style={{ color: '#059669' }}>{backCount}</strong> 人，一共有几人？
            </div>

            {/* 队列小人展示 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              minHeight: '140px',
              padding: '20px 10px',
              overflowX: 'auto',
              background: '#f8fafc',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              maxWidth: '680px',
              margin: '0 auto',
            }}>
              {/* 前面的人群 */}
              <div style={{ display: 'flex', gap: '8px', padding: '10px 12px', background: '#eff6ff', borderRadius: '12px', border: '1px dashed #93c5fd' }}>
                {Array.from({ length: frontCount }).map((_, i) => (
                  <div key={`front-${i}`} style={{ textAlign: 'center' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#2563eb', marginTop: '2px' }}>前{i+1}</div>
                  </div>
                ))}
              </div>

              {/* 中间的加号 */}
              <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#94a3b8' }}>+</span>

              {/* 小明本人 */}
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '-32px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#fef08a',
                  border: '1px solid #ca8a04',
                  color: '#854d0e',
                  padding: '1px 6px',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                }}>
                  别忘加自己!
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fbbf24', border: '3px solid #d97706', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', boxShadow: '0 0 0 4px #fef08a' }}>
                  明
                </div>
                <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 800, marginTop: '4px' }}>
                  小明 (1人)
                </div>
              </div>

              {/* 中间的加号 */}
              <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#94a3b8' }}>+</span>

              {/* 后面的人群 */}
              <div style={{ display: 'flex', gap: '8px', padding: '10px 12px', background: '#ecfdf5', borderRadius: '12px', border: '1px dashed #6ee7b7' }}>
                {Array.from({ length: backCount }).map((_, i) => (
                  <div key={`back-${i}`} style={{ textAlign: 'center' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#059669', marginTop: '2px' }}>后{i+1}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 核心算式拆解 */}
            <div style={{
              maxWidth: '620px',
              margin: '24px auto 0',
              background: '#ffffff',
              border: '2px solid #dcfce7',
              borderRadius: '14px',
              padding: '18px 24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '8px' }}>
                算式拆解：为什么必须 <span style={{ color: '#16a34a', fontWeight: 800 }}>+ 1</span>？
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#1e293b' }}>
                <span style={{ color: '#2563eb' }}>{frontCount}</span> (前面的人) +{' '}
                <span style={{ color: '#059669' }}>{backCount}</span> (后面的人) +{' '}
                <span style={{ color: '#d97706', background: '#fef3c7', padding: '0 6px', borderRadius: '4px' }}>1</span> (加上小明自己) ={' '}
                <span style={{ color: '#16a34a' }}>{totalFrontBack}</span> 人
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>
                “前面”和“后面”都不包含小明自己！算队伍总人数时，绝对不能把自己漏掉。
              </div>
            </div>
          </div>
        )}

        {/* 3. 题型三：两人之间有几人 (Math.abs(A - B) - 1) */}
        {mode === 'between' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '0.9rem', color: '#475569' }}>
              排队场景：从前往后数，小红排第 <strong style={{ color: '#2563eb' }}>{posA}</strong>，小亮排第 <strong style={{ color: '#db2777' }}>{posB}</strong>，他们中间有几人？
            </div>

            {/* 队列展示 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              minHeight: '130px',
              padding: '16px 10px',
              overflowX: 'auto',
              background: '#f8fafc',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              maxWidth: '680px',
              margin: '0 auto',
            }}>
              {Array.from({ length: totalBetweenQueue }).map((_, i) => {
                const rank = i + 1;
                const isA = rank === posA;
                const isB = rank === posB;
                const isBetween = rank > Math.min(posA, posB) && rank < Math.max(posA, posB);

                return (
                  <div key={rank} style={{ textAlign: 'center', position: 'relative' }}>
                    {isA && (
                      <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', fontWeight: 800, color: '#1d4ed8', whiteSpace: 'nowrap' }}>
                        小红
                      </div>
                    )}
                    {isB && (
                      <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', fontWeight: 800, color: '#be185d', whiteSpace: 'nowrap' }}>
                        小亮
                      </div>
                    )}
                    {isBetween && (
                      <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', fontWeight: 800, color: '#15803d', whiteSpace: 'nowrap' }}>
                        中间
                      </div>
                    )}

                    <div style={{
                      width: isA || isB ? '42px' : '36px',
                      height: isA || isB ? '42px' : '36px',
                      borderRadius: '50%',
                      background: isA ? '#3b82f6' : isB ? '#ec4899' : isBetween ? '#86efac' : '#cbd5e1',
                      border: isA ? '2px solid #1d4ed8' : isB ? '2px solid #be185d' : isBetween ? '2px solid #16a34a' : '2px solid #94a3b8',
                      color: isA || isB ? '#ffffff' : isBetween ? '#14532d' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      boxShadow: isBetween ? '0 0 8px rgba(34,197,94,0.4)' : 'none',
                    }}>
                      {isA ? '红' : isB ? '亮' : rank}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                      第{rank}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 核心算式拆解 */}
            <div style={{
              maxWidth: '620px',
              margin: '24px auto 0',
              background: '#ffffff',
              border: '2px solid #fed7aa',
              borderRadius: '14px',
              padding: '18px 24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '8px' }}>
                算式拆解：为什么求“中间”要 <span style={{ color: '#ea580c', fontWeight: 800 }}>- 1</span>？
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#1e293b' }}>
                <span style={{ color: '#db2777' }}>{posB}</span> (小亮的位置) -{' '}
                <span style={{ color: '#2563eb' }}>{posA}</span> (小红及前面所有人) -{' '}
                <span style={{ color: '#ea580c', background: '#ffedd5', padding: '0 6px', borderRadius: '4px' }}>1</span> (扣除小亮本人) ={' '}
                <span style={{ color: '#16a34a' }}>{betweenCount}</span> 人
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>
                用 $8 - 3$ 减去的是小红及前面 3 人，但此时还包含了小亮！既然问的是“两人中间”，小亮也不能算进去，因此必须再减 1！
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部控制台：参数调节 */}
      <div className={styles.controlsGrid} style={{ marginTop: '20px' }}>
        {mode === 'bothRank' && (
          <>
            <div className={styles.controlItem}>
              <div className={styles.controlLabel}>
                <span>从左数排第几（小明）：</span>
                <span className={styles.controlValue}>{leftRank}</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={leftRank}
                onChange={(e) => setLeftRank(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlItem}>
              <div className={styles.controlLabel}>
                <span>从右数排第几（小明）：</span>
                <span className={styles.controlValue}>{rightRank}</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={rightRank}
                onChange={(e) => setRightRank(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </>
        )}

        {mode === 'frontBack' && (
          <>
            <div className={styles.controlItem}>
              <div className={styles.controlLabel}>
                <span>前面有几人：</span>
                <span className={styles.controlValue}>{frontCount}</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                value={frontCount}
                onChange={(e) => setFrontCount(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlItem}>
              <div className={styles.controlLabel}>
                <span>后面有几人：</span>
                <span className={styles.controlValue}>{backCount}</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                value={backCount}
                onChange={(e) => setBackCount(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </>
        )}

        {mode === 'between' && (
          <>
            <div className={styles.controlItem}>
              <div className={styles.controlLabel}>
                <span>小红排第几：</span>
                <span className={styles.controlValue}>{posA}</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                value={posA}
                onChange={(e) => setPosA(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlItem}>
              <div className={styles.controlLabel}>
                <span>小亮排第几：</span>
                <span className={styles.controlValue}>{posB}</span>
              </div>
              <input
                type="range"
                min="5"
                max="9"
                value={posB}
                onChange={(e) => setPosB(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </>
        )}

        {/* 快捷还原 */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
          <button
            onClick={() => {
              setLeftRank(4);
              setRightRank(5);
              setFrontCount(3);
              setBackCount(4);
              setPosA(3);
              setPosB(8);
            }}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={16} />
            还原默认参数
          </button>
        </div>
      </div>
    </div>
  );
}
