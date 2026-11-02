'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Share2, ArrowRight, CheckCircle2, RefreshCw, Sparkles, Scale } from 'lucide-react';

export default function ProportionalSharingLab() {
  const [activeTab, setActiveTab] = useState<'bridge' | 'allocation'>('bridge');

  // 比率参数
  // A:B = rA : rB1, B:C = rB2 : rC
  const [rA, setRA] = useState<number>(2);
  const [rB1, setRB1] = useState<number>(3);
  const [rB2, setRB2] = useState<number>(4);
  const [rC, setRC] = useState<number>(5);

  const [isUnified, setIsUnified] = useState<boolean>(true);

  // 分配总金额
  const [totalAmount, setTotalAmount] = useState<number>(700);

  // 求最大公约数与最小公倍数
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const lcm = (a: number, b: number): number => Math.abs(a * b) / gcd(a, b);

  const commonLCM = lcm(rB1, rB2);
  const scale1 = commonLCM / rB1;
  const scale2 = commonLCM / rB2;

  const unifiedA = rA * scale1;
  const unifiedB = commonLCM;
  const unifiedC = rC * scale2;
  const totalParts = unifiedA + unifiedB + unifiedC;

  const unitValue = totalAmount / totalParts;
  const amountA = unifiedA * unitValue;
  const amountB = unifiedB * unitValue;
  const amountC = unifiedC * unitValue;

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Share2 size={18} style={{ color: '#059669' }} />
          <span>比和比例：按比例分配与连比统一桥梁</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${activeTab === 'bridge' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('bridge')}
          >
            <Scale size={14} />
            <span>中介量化连比 (统一一份量)</span>
          </button>
          <button
            className={`${styles.controlBtn} ${activeTab === 'allocation' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('allocation')}
          >
            <Sparkles size={14} />
            <span>三家分奖金实战 (求一份量)</span>
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* TAB 1: 化连比与公共中介桥梁 */}
        {activeTab === 'bridge' && (
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
                background: '#ecfdf5',
                padding: '10px 14px',
                borderRadius: '8px',
                borderLeft: '4px solid #10b981',
                fontSize: '0.875rem',
                color: '#065f46',
                lineHeight: 1.6
              }}>
                <strong>【核心认知卡点】：</strong>
                已知 甲:乙 = <strong>{rA}:{rB1}</strong>，乙:丙 = <strong>{rB2}:{rC}</strong>。
                很多孩子会直接把两组比揉在一起猜成 {rA}:{rB1}:{rC}，却没发现：
                <strong>乙在第一个比里占 {rB1} 份，在第二个比里占 {rB2} 份，两把“尺子”刻度根本不一样！</strong>
              </div>

              {/* 视觉对比刻度条 */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* 原始两组比标尺 */}
                <div style={{
                  padding: '12px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    1. 原始比例：乙的两种不同刻度
                  </div>

                  {/* 第一组：甲与乙 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '70px', fontSize: '0.8rem', fontWeight: 600, color: '#1e40af' }}>
                      甲:乙 = {rA}:{rB1}
                    </div>
                    <div style={{ flex: 1, display: 'flex', height: '24px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                      <div style={{ flex: rA, background: '#93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#1e3a8a', fontWeight: 700 }}>
                        甲 ({rA}大格)
                      </div>
                      <div style={{ flex: rB1, background: '#fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#9a3412', fontWeight: 700 }}>
                        乙 ({rB1}大格)
                      </div>
                    </div>
                  </div>

                  {/* 第二组：乙与丙 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '70px', fontSize: '0.8rem', fontWeight: 600, color: '#047857' }}>
                      乙:丙 = {rB2}:{rC}
                    </div>
                    <div style={{ flex: 1, display: 'flex', height: '24px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                      <div style={{ flex: rB2, background: '#fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#854d0e', fontWeight: 700 }}>
                        乙 ({rB2}大格)
                      </div>
                      <div style={{ flex: rC, background: '#a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#065f46', fontWeight: 700 }}>
                        丙 ({rC}大格)
                      </div>
                    </div>
                  </div>
                </div>

                {/* 桥梁对齐动效 */}
                {isUnified && (
                  <div style={{
                    padding: '14px',
                    background: '#f0fdf4',
                    borderRadius: '8px',
                    border: '1px solid #86efac'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803d' }}>
                        2. 找最小公倍数：把乙统一成【{commonLCM}】微细格！
                      </span>
                      <span style={{ fontSize: '0.72rem', background: '#22c55e', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                        中介桥梁通了
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#166534', marginTop: '6px', lineHeight: 1.6 }}>
                      • 甲:乙 同时扩大 <strong>{scale1}</strong> 倍：({rA}×{scale1}) : ({rB1}×{scale1}) = <strong>{unifiedA} : {unifiedB}</strong>
                      <br />
                      • 乙:丙 同时扩大 <strong>{scale2}</strong> 倍：({rB2}×{scale2}) : ({rC}×{scale2}) = <strong>{unifiedB} : {unifiedC}</strong>
                    </div>

                    {/* 统一连比条带 */}
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', height: '28px', borderRadius: '6px', overflow: 'hidden', border: '1.5px solid #16a34a' }}>
                        <div style={{ flex: unifiedA, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>
                          甲 {unifiedA}份
                        </div>
                        <div style={{ flex: unifiedB, background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>
                          乙 {unifiedB}份 (桥梁)
                        </div>
                        <div style={{ flex: unifiedC, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>
                          丙 {unifiedC}份
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                        最终连比：甲 : 乙 : 丙 = <span style={{ color: '#2563eb' }}>{unifiedA}</span> : <span style={{ color: '#d97706' }}>{unifiedB}</span> : <span style={{ color: '#059669' }}>{unifiedC}</span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '8px' }}>
                          (共 {totalParts} 份)
                        </span>
                      </div>
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
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '130px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>甲:乙 比值</label>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <input
                      type="number"
                      min="1"
                      max="9"
                      value={rA}
                      onChange={(e) => setRA(Math.max(1, Number(e.target.value)))}
                      style={{ width: '45px', padding: '4px', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                    <span style={{ lineHeight: '30px' }}>:</span>
                    <input
                      type="number"
                      min="1"
                      max="9"
                      value={rB1}
                      onChange={(e) => setRB1(Math.max(1, Number(e.target.value)))}
                      style={{ width: '45px', padding: '4px', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: '130px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>乙:丙 比值</label>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <input
                      type="number"
                      min="1"
                      max="9"
                      value={rB2}
                      onChange={(e) => setRB2(Math.max(1, Number(e.target.value)))}
                      style={{ width: '45px', padding: '4px', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                    <span style={{ lineHeight: '30px' }}>:</span>
                    <input
                      type="number"
                      min="1"
                      max="9"
                      value={rC}
                      onChange={(e) => setRC(Math.max(1, Number(e.target.value)))}
                      style={{ width: '45px', padding: '4px', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className={styles.controlBtn} onClick={() => { setRA(2); setRB1(3); setRB2(4); setRC(5); }}>
                  经典真题 (2:3 与 4:5 ➔ 8:12:15)
                </button>
                <button className={styles.controlBtn} onClick={() => { setRA(1); setRB1(2); setRB2(3); setRC(4); }}>
                  初阶配比 (1:2 与 3:4 ➔ 3:6:8)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 分奖金实战 */}
        {activeTab === 'allocation' && (
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
                background: '#f8fafc',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.875rem',
                color: '#1e293b'
              }}>
                <strong>【分奖金任务】：</strong>
                总奖金共 <strong style={{ color: '#dc2626', fontSize: '1.1rem' }}>{totalAmount}</strong> 元，
                按照连比 <strong>甲:乙:丙 = {unifiedA}:{unifiedB}:{unifiedC}</strong> 进行分配。三个人各分得多少元？
              </div>

              {/* 三步计算卡 */}
              <div style={{
                marginTop: '16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '10px'
              }}>
                <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>第 1 步：求总份数</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    {unifiedA} + {unifiedB} + {unifiedC} = {totalParts} 份
                  </div>
                </div>

                <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>第 2 步：求【一份量】</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#b45309', marginTop: '2px' }}>
                    {totalAmount} ÷ {totalParts} = {unitValue.toFixed(1)} 元
                  </div>
                </div>

                <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 600 }}>第 3 步：各自得份数乘一份量</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#047857', marginTop: '2px' }}>
                    验算和: {(amountA + amountB + amountC).toFixed(0)} 元 ✔️
                  </div>
                </div>
              </div>

              {/* 三人分得结果展示卡 */}
              <div style={{
                marginTop: '16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px'
              }}>
                <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', border: '1.5px solid #bfdbfe', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e40af' }}>甲 ({unifiedA}份)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1d4ed8', marginTop: '4px' }}>
                    {amountA.toFixed(0)} <span style={{ fontSize: '0.8rem' }}>元</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{unifiedA} × {unitValue.toFixed(1)}</div>
                </div>

                <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '8px', border: '1.5px solid #fde68a', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e' }}>乙 ({unifiedB}份)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>
                    {amountB.toFixed(0)} <span style={{ fontSize: '0.8rem' }}>元</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{unifiedB} × {unitValue.toFixed(1)}</div>
                </div>

                <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1.5px solid #bbf7d0', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534' }}>丙 ({unifiedC}份)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>
                    {amountC.toFixed(0)} <span style={{ fontSize: '0.8rem' }}>元</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{unifiedC} × {unitValue.toFixed(1)}</div>
                </div>
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
                  <span>滑动调整总奖金：</span>
                  <span style={{ color: '#2563eb' }}>{totalAmount} 元</span>
                </div>
                <input
                  type="range"
                  min="350"
                  max="1400"
                  step="70"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className={styles.controlBtn} onClick={() => setTotalAmount(700)}>
                  700 元 (整好除尽)
                </button>
                <button className={styles.controlBtn} onClick={() => setTotalAmount(1050)}>
                  1050 元
                </button>
                <button className={styles.controlBtn} onClick={() => setTotalAmount(1400)}>
                  1400 元
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

