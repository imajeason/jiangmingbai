'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { ChefHat, Flame, Sparkles, Clock, ArrowRight, RotateCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PancakeOptimizationLab() {
  const [activeTab, setActiveTab] = useState<'threePancakes' | 'calculator'>('threePancakes');

  // TAB 1 步骤：0 (准备), 1 (0-3分), 2 (3-6分), 3 (6-9分)
  const [step, setStep] = useState<number>(0);

  // TAB 2 计算器
  const [pancakeCount, setPancakeCount] = useState<number>(3);
  const sideMinutes = 3;

  // 最优时间计算
  const getOptimalTime = (n: number) => {
    if (n <= 1) return sideMinutes * 2; // 1张也要6分钟
    return n * sideMinutes; // n >= 2 时，每面无缝对接
  };

  // 笨办法时间 (两张两张烙，余1张单独烙)
  const getNaiveTime = (n: number) => {
    return Math.ceil(n / 2) * (sideMinutes * 2);
  };

  const optimalTime = getOptimalTime(pancakeCount);
  const naiveTime = getNaiveTime(pancakeCount);
  const savedTime = naiveTime - optimalTime;

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <ChefHat size={18} style={{ color: '#ea580c' }} />
          <span>统筹与最优化：烙饼问题与锅底利用率</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${activeTab === 'threePancakes' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('threePancakes')}
          >
            <Flame size={14} />
            <span>3张饼最优轮换法 (9分钟拆解)</span>
          </button>
          <button
            className={`${styles.controlBtn} ${activeTab === 'calculator' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            <Sparkles size={14} />
            <span>任意张数总公式 (锅底永不闲)</span>
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* TAB 1: 3 张饼轮换法演示 */}
        {activeTab === 'threePancakes' && (
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
                <strong>【经典烙饼谜题】：</strong>
                一口平底锅一次<strong>最多只能烙 2 张饼</strong>，每张饼两面都要烙，<strong>每面需要 3 分钟</strong>。
                <br />
                请问：烙熟 3 张饼，<strong>最少需要几分钟？</strong>
                （很多孩子脱口而出 12 分钟，看大厨如何 9 分钟神级操作！）
              </div>

              {/* 核心烙饼炉灶视效 */}
              <div style={{
                marginTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px'
              }}>
                {/* 炉灶大平底锅 */}
                <div style={{
                  width: '100%',
                  maxWidth: '480px',
                  background: '#1e293b',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.5)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px' }}>
                    <Flame size={16} />
                    <span>平底锅（容量：2 张饼） · 当前阶段：{step === 0 ? '未开火' : step === 1 ? '第 1 次 (0~3分钟)' : step === 2 ? '第 2 次 (3~6分钟)' : '第 3 次 (6~9分钟)'}</span>
                  </div>

                  {/* 锅内 2 个卡位 */}
                  <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    {/* 左锅位 */}
                    <div style={{
                      width: '130px',
                      height: '130px',
                      borderRadius: '50%',
                      border: '3px dashed #475569',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: step === 0 ? 'transparent' : '#f59e0b',
                      boxShadow: step > 0 ? '0 0 16px rgba(245, 158, 11, 0.4)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      {step === 0 && <span style={{ color: '#64748b', fontSize: '0.8rem' }}>空位 1</span>}
                      {step === 1 && (
                        <div style={{ textAlign: 'center', color: '#ffffff' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>1 号饼</div>
                          <div style={{ fontSize: '0.75rem', background: '#d97706', padding: '2px 8px', borderRadius: '10px', marginTop: '2px' }}>
                            正在烙 正面 A
                          </div>
                        </div>
                      )}
                      {step === 2 && (
                        <div style={{ textAlign: 'center', color: '#ffffff' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>2 号饼</div>
                          <div style={{ fontSize: '0.75rem', background: '#b45309', padding: '2px 8px', borderRadius: '10px', marginTop: '2px' }}>
                            翻面烙 反面 B
                          </div>
                        </div>
                      )}
                      {step === 3 && (
                        <div style={{ textAlign: 'center', color: '#ffffff' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>3 号饼</div>
                          <div style={{ fontSize: '0.75rem', background: '#b45309', padding: '2px 8px', borderRadius: '10px', marginTop: '2px' }}>
                            翻面烙 反面 B
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 右锅位 */}
                    <div style={{
                      width: '130px',
                      height: '130px',
                      borderRadius: '50%',
                      border: '3px dashed #475569',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: step === 0 ? 'transparent' : '#f59e0b',
                      boxShadow: step > 0 ? '0 0 16px rgba(245, 158, 11, 0.4)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      {step === 0 && <span style={{ color: '#64748b', fontSize: '0.8rem' }}>空位 2</span>}
                      {step === 1 && (
                        <div style={{ textAlign: 'center', color: '#ffffff' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>2 号饼</div>
                          <div style={{ fontSize: '0.75rem', background: '#d97706', padding: '2px 8px', borderRadius: '10px', marginTop: '2px' }}>
                            正在烙 正面 A
                          </div>
                        </div>
                      )}
                      {step === 2 && (
                        <div style={{ textAlign: 'center', color: '#ffffff' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>3 号饼</div>
                          <div style={{ fontSize: '0.75rem', background: '#d97706', padding: '2px 8px', borderRadius: '10px', marginTop: '2px' }}>
                            进锅烙 正面 A
                          </div>
                        </div>
                      )}
                      {step === 3 && (
                        <div style={{ textAlign: 'center', color: '#ffffff' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>1 号饼</div>
                          <div style={{ fontSize: '0.75rem', background: '#b45309', padding: '2px 8px', borderRadius: '10px', marginTop: '2px' }}>
                            回锅烙 反面 B
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '0.75rem' }}>
                    锅底利用率：<strong style={{ color: step > 0 ? '#22c55e' : '#94a3b8' }}>{step > 0 ? '100% 满负荷运转（绝无浪费）' : '0%'}</strong>
                  </div>
                </div>

                {/* 锅外备用盘 */}
                <div style={{
                  width: '100%',
                  background: '#f1f5f9',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>盘子里暂存的饼：</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                    {step === 0 && '1号饼(生), 2号饼(生), 3号饼(生)'}
                    {step === 1 && '3 号饼在旁等待 (生)'}
                    {step === 2 && '1 号饼暂出锅待命 (正面A已熟，反面B待烙)'}
                    {step === 3 && '2 号饼大功告成出锅！🎉 (双面全熟)'}
                  </span>
                </div>

                {/* 步骤详细解析 */}
                <div style={{
                  width: '100%',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '0.85rem',
                  lineHeight: 1.6
                }}>
                  {step === 0 && (
                    <div style={{ color: '#475569' }}>
                      <span style={{ fontWeight: 700, color: '#334155' }}>点击下方步骤按钮</span>，观察大厨如何通过“巧妙交替”，让锅里永远保持 2 张饼同时在烙，消除一切闲置等待！
                    </div>
                  )}
                  {step === 1 && (
                    <div style={{ color: '#1e40af' }}>
                      <strong>【第 1 阶段 · 0~3 分钟】：</strong>
                      锅里放 1号正面 和 2号正面。3 分钟后，两张饼的正面全部烤熟！
                    </div>
                  )}
                  {step === 2 && (
                    <div style={{ color: '#b45309' }}>
                      <strong>【第 2 阶段 · 3~6 分钟 (破局关键！)】：</strong>
                      千万不要等 1 号烙完！把 1 号<strong>先盛出放盘子</strong>；把 2 号<strong>翻面烙反面</strong>；同时把 3 号<strong>放进锅烙正面</strong>！
                      锅里依然整整齐齐塞满 2 张饼！
                    </div>
                  )}
                  {step === 3 && (
                    <div style={{ color: '#15803d' }}>
                      <strong>【第 3 阶段 · 6~9 分钟 (完美收官！)】：</strong>
                      此时 2 号两面全熟，出锅！3 号翻面烙反面，把盘子里的 1 号反面重新放回锅里！
                      3 分钟后，1 号和 3 号同时两面金黄出锅！<strong>全部熟透仅用 3 × 3 = 9 分钟！</strong>
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
                className={`${styles.controlBtn} ${step === 0 ? styles.controlBtnActive : ''}`}
                onClick={() => setStep(0)}
              >
                准备开工
              </button>
              <button
                className={`${styles.controlBtn} ${step === 1 ? styles.controlBtnActive : ''}`}
                onClick={() => setStep(1)}
              >
                1. 烙 1正 + 2正 (0-3分)
              </button>
              <button
                className={`${styles.controlBtn} ${step === 2 ? styles.controlBtnActive : ''}`}
                onClick={() => setStep(2)}
              >
                2. 换 2反 + 3正 (3-6分)
              </button>
              <button
                className={`${styles.controlBtn} ${step === 3 ? styles.controlBtnActive : ''}`}
                onClick={() => setStep(3)}
              >
                3. 收 3反 + 1反 (6-9分完成)
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: 任意张数公式计算器 */}
        {activeTab === 'calculator' && (
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
                <strong>【烙饼核心总公式】：</strong>
                只要饼数 $N \ge 2$，无论有几张饼，最少时间永远是：
                <br />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803d' }}>
                  最优时间 = 饼数 N × 单面时间 (3分钟)
                </span>
                <br />
                （偶数张两两配对；奇数张先两两配对，最后 3 张用轮换法，锅底利用率永远 100%！）
              </div>

              {/* 实时效益对比面板 */}
              <div style={{
                marginTop: '16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px'
              }}>
                <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '8px', border: '1.5px solid #86efac' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>最优统筹方案耗时</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#166534', marginTop: '2px' }}>
                    {optimalTime} <span style={{ fontSize: '0.8rem' }}>分钟</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {pancakeCount === 1 ? '1张单独烙需 6 分钟' : `${pancakeCount} 张 × 3 分钟/面`}
                  </div>
                </div>

                <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991b1b' }}>普通笨办法耗时 (余1张单烙)</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
                    {naiveTime} <span style={{ fontSize: '0.8rem' }}>分钟</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    两张两张傻等，最后锅空一半
                  </div>
                </div>

                <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e' }}>科学统筹节省时间</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#b45309', marginTop: '2px' }}>
                    省下 {savedTime} <span style={{ fontSize: '0.8rem' }}>分钟</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {savedTime > 0 ? '利用轮换消除了空锅浪费！' : '偶数张本身已满负荷'}
                  </div>
                </div>
              </div>

              {/* 调度建议卡 */}
              <div style={{
                marginTop: '14px',
                padding: '12px 14px',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.825rem',
                color: '#334155',
                lineHeight: 1.6
              }}>
                <strong>📌 {pancakeCount} 张饼的黄金调度策略：</strong>
                <br />
                {pancakeCount === 1 && '只有 1 张饼，锅里无法避免空出一半，最少需要 3 × 2 = 6 分钟。'}
                {pancakeCount === 2 && '正好 2 张饼放满锅，同时烙正面再同时翻反面，3 + 3 = 6 分钟！'}
                {pancakeCount === 3 && '奇数 3 张饼，使用【最优轮换法】（1正2正 ➔ 2反3正 ➔ 3反1反），9 分钟出锅！'}
                {pancakeCount > 3 && pancakeCount % 2 === 0 && `偶数 ${pancakeCount} 张饼：分成 ${pancakeCount / 2} 组，每组 2 张饼正常烙 6 分钟，总计 ${optimalTime} 分钟！`}
                {pancakeCount > 3 && pancakeCount % 2 !== 0 && `奇数 ${pancakeCount} 张饼：前 ${(pancakeCount - 3)} 张两两配对烙完（用时 ${(pancakeCount - 3) * 3} 分钟），最后 3 张用【轮换法】（用时 9 分钟），总计 ${optimalTime} 分钟！`}
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
                  <span>调整需要烙的饼数：</span>
                  <span style={{ color: '#ea580c' }}>{pancakeCount} 张饼</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={pancakeCount}
                  onChange={(e) => setPancakeCount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#ea580c', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className={styles.controlBtn} onClick={() => setPancakeCount(3)}>
                  3 张饼 (经典中考题)
                </button>
                <button className={styles.controlBtn} onClick={() => setPancakeCount(4)}>
                  4 张饼 (偶数双双对对)
                </button>
                <button className={styles.controlBtn} onClick={() => setPancakeCount(5)}>
                  5 张饼 (2+3 组合)
                </button>
                <button className={styles.controlBtn} onClick={() => setPancakeCount(7)}>
                  7 张饼 (2+2+3 组合)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

