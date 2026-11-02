'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Search, PlusCircle, XCircle, Divide, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

export default function MistakeCorrectionLab() {
  const [activeTab, setActiveTab] = useState<'addition' | 'multiplication' | 'division'>('addition');

  // TAB 1 加法状态
  const [correctNum1] = useState<number>(36); // 不变的加数
  const [correctNum2, setCorrectNum2] = useState<number>(25); // 原加数
  const [wrongNum2, setWrongNum2] = useState<number>(52); // 看错后的加数
  const [showAddFix, setShowAddFix] = useState<boolean>(false);

  // TAB 2 乘法状态
  const [factorA, setFactorA] = useState<number>(30); // 不变的因数 A
  const [correctB, setCorrectB] = useState<number>(24); // 正确因数 B
  const [wrongB, setWrongB] = useState<number>(42); // 看错因数 B
  const [showMultStep, setShowMultStep] = useState<number>(0);

  // TAB 3 除法状态
  const [correctDivisor, setCorrectDivisor] = useState<number>(6); // 正确除数
  const [wrongDivisor, setWrongDivisor] = useState<number>(9); // 看错的除数
  const [wrongQuotient, setWrongQuotient] = useState<number>(14); // 错误的商
  const [wrongRemainder, setWrongRemainder] = useState<number>(3); // 错误的余数
  const [divStep, setDivStep] = useState<number>(0);

  // 计算衍生值
  // 加法
  const correctSum = correctNum1 + correctNum2;
  const wrongSum = correctNum1 + wrongNum2;
  const addDelta = wrongNum2 - correctNum2; // 正数为多看，负数为少看

  // 乘法
  const correctProd = factorA * correctB;
  const wrongProd = factorA * wrongB;
  const multDeltaB = wrongB - correctB;
  const multDeltaProd = wrongProd - correctProd;

  // 除法
  const totalDividend = wrongDivisor * wrongQuotient + wrongRemainder;
  const correctQuotient = Math.floor(totalDividend / correctDivisor);
  const correctRemainder = totalDividend % correctDivisor;

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Search size={18} style={{ color: '#0ea5e9' }} />
          <span>错中求解：粗心小马虎的算式还原术</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${activeTab === 'addition' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('addition')}
          >
            <PlusCircle size={14} />
            <span>加法/减法（多看就减，少看就加）</span>
          </button>
          <button
            className={`${styles.controlBtn} ${activeTab === 'multiplication' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('multiplication')}
          >
            <XCircle size={14} />
            <span>乘法（差值放大法）</span>
          </button>
          <button
            className={`${styles.controlBtn} ${activeTab === 'division' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('division')}
          >
            <Divide size={14} />
            <span>除法（抓不变的被除数）</span>
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* TAB 1: 加法与减法看错 */}
        {activeTab === 'addition' && (
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
                background: '#f0f9ff',
                padding: '10px 14px',
                borderRadius: '8px',
                borderLeft: '4px solid #0284c7',
                fontSize: '0.875rem',
                color: '#0369a1',
                lineHeight: 1.6
              }}>
                <strong>【典型错题情景】：</strong>
                小马虎做加法题，不小心把加数 <strong>{correctNum2}</strong> 看成了 <strong>{wrongNum2}</strong>，
                算出的错误和是 <strong>{wrongSum}</strong>。正确的和应该是多少？
              </div>

              {/* 算式对比天平展台 */}
              <div style={{
                marginTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  width: '100%',
                  padding: '16px 12px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  {/* 错误算式 */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>小马虎的错误算式</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                      {correctNum1} + <span style={{ textDecoration: 'underline wavy #ef4444' }}>{wrongNum2}</span> = {wrongSum}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '2px' }}>
                      (加数看{addDelta > 0 ? `大了 +${addDelta}` : `小了 ${addDelta}`})
                    </div>
                  </div>

                  {/* 差额补丁动画 */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: addDelta > 0 ? '#fee2e2' : '#fef3c7',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${addDelta > 0 ? '#fca5a5' : '#fde68a'}`
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: addDelta > 0 ? '#991b1b' : '#92400e' }}>
                      差额补偿值 (补丁)
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: addDelta > 0 ? '#b91c1c' : '#b45309' }}>
                      {addDelta > 0 ? `多加了 ${addDelta}` : `少加了 ${Math.abs(addDelta)}`}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {addDelta > 0 ? '【多看就减】' : '【少看就加】'}
                    </div>
                  </div>

                  {/* 正确算式 */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: showAddFix ? '#16a34a' : '#94a3b8', fontWeight: 700 }}>
                      还原后的正确算式
                    </div>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: showAddFix ? '#15803d' : '#cbd5e1',
                      marginTop: '4px'
                    }}>
                      {showAddFix ? `${correctNum1} + ${correctNum2} = ${correctSum}` : '? + ? = ?'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: showAddFix ? '#16a34a' : '#94a3b8', marginTop: '2px' }}>
                      {showAddFix ? `正确结果：${correctSum}` : '点击下方按钮一键还原'}
                    </div>
                  </div>
                </div>

                {/* 算理解析卡 */}
                {showAddFix && (
                  <div style={{
                    width: '100%',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '0.85rem',
                    color: '#166534',
                    lineHeight: 1.6
                  }}>
                    <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} />
                      <span>侦探还原密码：根本不用求出另一个加数！</span>
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      因为把 {correctNum2} 错看成 {wrongNum2}，相当于总和被无辜<strong>多加了 {addDelta}</strong>。
                      <br />
                      所以正确和 = 错误和 {wrongSum} - 多加的 {addDelta} = <strong>{correctSum}</strong>！
                      <br />
                      口诀：<strong>“多看了就减回去，少看了就加回来”</strong>，一步秒杀！
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 控制器 */}
            <div style={{
              marginTop: '16px',
              width: '100%',
              background: '#ffffff',
              padding: '14px 18px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  <span>调整看错后的数字：</span>
                  <span style={{ color: '#dc2626' }}>把 {correctNum2} 错看成 {wrongNum2}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="1"
                  value={wrongNum2}
                  onChange={(e) => {
                    setWrongNum2(Number(e.target.value));
                    setShowAddFix(true);
                  }}
                  style={{ width: '100%', accentColor: '#dc2626', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button className={styles.controlBtn} onClick={() => { setWrongNum2(52); setShowAddFix(true); }}>
                    经典个十颠倒：25 看成 52
                  </button>
                  <button className={styles.controlBtn} onClick={() => { setWrongNum2(15); setShowAddFix(true); }}>
                    看小了：25 看成 15
                  </button>
                  <button className={styles.controlBtn} onClick={() => { setWrongNum2(85); setShowAddFix(true); }}>
                    十位看大：25 看成 85
                  </button>
                </div>
                <button
                  className={`${styles.controlBtn} ${showAddFix ? styles.controlBtnActive : ''}`}
                  onClick={() => setShowAddFix(!showAddFix)}
                >
                  {showAddFix ? '隐藏答案' : '点击还原正确和'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 乘法看错因数 */}
        {activeTab === 'multiplication' && (
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
                background: '#fff7ed',
                padding: '10px 14px',
                borderRadius: '8px',
                borderLeft: '4px solid #ea580c',
                fontSize: '0.875rem',
                color: '#9a3412',
                lineHeight: 1.6
              }}>
                <strong>【经典乘法易错题】：</strong>
                小明做乘法时，把其中一个因数 <strong>{correctB}</strong> 错看成了 <strong>{wrongB}</strong>，
                结果算出来的积比原本<strong>多了 {multDeltaProd}</strong>。求另一个不变的因数是多少？原来正确的积是多少？
              </div>

              {/* 矩形条带模型 */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg viewBox="0 0 460 140" style={{ width: '100%', maxWidth: '500px', height: 'auto' }}>
                  {(() => {
                    const ox = 20;
                    const oy = 25;
                    const h = 70;
                    const scaleW = 400 / wrongB;
                    const wCorrect = correctB * scaleW;
                    const wExtra = multDeltaB * scaleW;

                    return (
                      <g>
                        {/* 原本正确的乘积区域 */}
                        <rect x={ox} y={oy} width={wCorrect} height={h} fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" rx="4" />
                        <text x={ox + wCorrect / 2} y={oy + h / 2 - 4} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e40af">
                          原正确积 = A × {correctB}
                        </text>
                        {showMultStep >= 2 && (
                          <text x={ox + wCorrect / 2} y={oy + h / 2 + 16} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1d4ed8">
                            = {correctProd}
                          </text>
                        )}

                        {/* 多出来的额外差额条带 */}
                        <rect
                          x={ox + wCorrect}
                          y={oy}
                          width={wExtra}
                          height={h}
                          fill="#fed7aa"
                          stroke="#ea580c"
                          strokeWidth="2"
                          strokeDasharray="4,3"
                          rx="4"
                        />
                        <text x={ox + wCorrect + wExtra / 2} y={oy + h / 2 - 4} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#9a3412">
                          多出来的积
                        </text>
                        <text x={ox + wCorrect + wExtra / 2} y={oy + h / 2 + 14} textAnchor="middle" fontSize="12" fontWeight="800" fill="#c2410c">
                          +{multDeltaProd}
                        </text>

                        {/* 左侧公共高：不变因数 A */}
                        <line x1={ox - 6} y1={oy} x2={ox - 6} y2={oy + h} stroke="#0f172a" strokeWidth="2" />
                        <text x={ox - 12} y={oy + h / 2 + 4} textAnchor="end" fontSize="13" fontWeight="bold" fill="#0f172a">
                          因数 A {showMultStep >= 1 ? `(${factorA})` : '=?'}
                        </text>

                        {/* 顶部宽度标尺 */}
                        <text x={ox + wCorrect / 2} y={oy - 8} textAnchor="middle" fontSize="11" fill="#2563eb">
                          原本因数 {correctB}
                        </text>
                        <text x={ox + wCorrect + wExtra / 2} y={oy - 8} textAnchor="middle" fontSize="11" fill="#ea580c">
                          多看了 {multDeltaB}
                        </text>
                      </g>
                    );
                  })()}
                </svg>

                {/* 推导步骤卡 */}
                <div style={{
                  marginTop: '14px',
                  width: '100%',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}>
                  {showMultStep === 0 && (
                    <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                      <span style={{ fontWeight: 700, color: '#334155' }}>思考突破口：</span>
                      为什么积会无缘无故多出 {multDeltaProd}？因为另一个不变的因数 A，被凭空多乘了 ({wrongB} - {correctB}) = <strong>{multDeltaB} 次</strong>！
                      点击下方【第 1 步】求出不变因数 A。
                    </div>
                  )}

                  {showMultStep === 1 && (
                    <div style={{ fontSize: '0.85rem', color: '#0369a1' }}>
                      <span style={{ fontWeight: 700 }}>第 1 步：求出唯一的不变因数 A</span>
                      <br />
                      因数 A 额外乘了 {multDeltaB} 次导致积多了 {multDeltaProd}：
                      <br />
                      <strong>A = {multDeltaProd} ÷ {multDeltaB} = {factorA}</strong>！
                    </div>
                  )}

                  {showMultStep === 2 && (
                    <div style={{ fontSize: '0.85rem', color: '#15803d' }}>
                      <span style={{ fontWeight: 700 }}>第 2 步：还原真正的乘积</span>
                      <br />
                      现在两个因数都知道了（A = {factorA}，原本因数 B = {correctB}）：
                      <br />
                      <strong>正确积 = {factorA} × {correctB} = {correctProd}</strong>！
                    </div>
                  )}
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
              <button
                className={`${styles.controlBtn} ${showMultStep === 0 ? styles.controlBtnActive : ''}`}
                onClick={() => setShowMultStep(0)}
              >
                1. 观察题意与图形
              </button>
              <button
                className={`${styles.controlBtn} ${showMultStep === 1 ? styles.controlBtnActive : ''}`}
                onClick={() => setShowMultStep(1)}
              >
                2. 求不变因数 A
              </button>
              <button
                className={`${styles.controlBtn} ${showMultStep === 2 ? styles.controlBtnActive : ''}`}
                onClick={() => setShowMultStep(2)}
              >
                3. 还原真实积
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: 除法看错除数 */}
        {activeTab === 'division' && (
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
                <strong>【除法压轴看错题】：</strong>
                小明做除法时，把除数 <strong>{correctDivisor}</strong> 错看成了 <strong>{wrongDivisor}</strong>，
                算出来的商是 <strong>{wrongQuotient}</strong>，余数是 <strong>{wrongRemainder}</strong>。
                请问：正确的商和余数分别是多少？
              </div>

              {/* 两步还原流水线 */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px'
                }}>
                  {/* 第 1 步：逆推被除数 */}
                  <div style={{
                    background: divStep >= 1 ? '#f0fdf4' : '#f8fafc',
                    border: `1px solid ${divStep >= 1 ? '#86efac' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    padding: '12px 14px'
                  }}>
                    <div style={{ fontSize: '0.78rem', color: divStep >= 1 ? '#15803d' : '#64748b', fontWeight: 700 }}>
                      第 1 步：抓黄金不变量（被除数绝没变）
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: divStep >= 1 ? '#166534' : '#94a3b8', marginTop: '4px' }}>
                      {divStep >= 1 ? `被除数 = ${wrongDivisor} × ${wrongQuotient} + ${wrongRemainder} = ${totalDividend}` : '被除数 = ?'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                      被除数 = 错除数 × 错商 + 错余数
                    </div>
                  </div>

                  {/* 第 2 步：正向重新除 */}
                  <div style={{
                    background: divStep >= 2 ? '#eff6ff' : '#f8fafc',
                    border: `1px solid ${divStep >= 2 ? '#93c5fd' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    padding: '12px 14px'
                  }}>
                    <div style={{ fontSize: '0.78rem', color: divStep >= 2 ? '#1d4ed8' : '#64748b', fontWeight: 700 }}>
                      第 2 步：用正确除数重新分箱
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: divStep >= 2 ? '#1e40af' : '#94a3b8', marginTop: '4px' }}>
                      {divStep >= 2 ? `${totalDividend} ÷ ${correctDivisor} = ${correctQuotient} ... ${correctRemainder}` : '正确算式 = ?'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                      商为 {correctQuotient}，余数为 {correctRemainder}
                    </div>
                  </div>
                </div>

                {/* 动画解剖图：分箱模型 */}
                <div style={{
                  padding: '12px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginBottom: '6px' }}>
                    📦 金币装箱实景还原
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#0f172a' }}>
                    总共有 <strong style={{ color: '#d97706', fontSize: '1.1rem' }}>{totalDividend}</strong> 粒金币。
                    {divStep >= 2 ? (
                      <span>
                        按正确的每箱 <strong>{correctDivisor}</strong> 粒装，正好能装满 <strong style={{ color: '#2563eb' }}>{correctQuotient} 箱</strong>，
                        剩下零散 <strong style={{ color: '#dc2626' }}>{correctRemainder} 粒</strong>！
                      </span>
                    ) : (
                      <span>先利用错误的装箱法（每箱 {wrongDivisor} 粒装了 {wrongQuotient} 箱余 {wrongRemainder} 粒），算出总金币数！</span>
                    )}
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
              <button
                className={`${styles.controlBtn} ${divStep === 0 ? styles.controlBtnActive : ''}`}
                onClick={() => setDivStep(0)}
              >
                1. 重置算式
              </button>
              <button
                className={`${styles.controlBtn} ${divStep === 1 ? styles.controlBtnActive : ''}`}
                onClick={() => setDivStep(1)}
              >
                2. 还原被除数 ({totalDividend})
              </button>
              <button
                className={`${styles.controlBtn} ${divStep === 2 ? styles.controlBtnActive : ''}`}
                onClick={() => setDivStep(2)}
              >
                3. 重新除出正解 ({correctQuotient} 余 {correctRemainder})
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

