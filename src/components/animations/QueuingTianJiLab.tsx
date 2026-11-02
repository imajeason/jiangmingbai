'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Truck, Trophy, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export default function QueuingTianJiLab() {
  const [activeTab, setActiveTab] = useState<'queuing' | 'tianji'>('queuing');

  // TAB 1 排队卸货：甲(8分), 乙(4分), 丙(1分)
  // 排列组合：'CBA' (最优: 丙乙甲), 'ABC' (最差: 甲乙丙), 'BAC' (中等: 乙甲丙)
  const [queueOrder, setQueueOrder] = useState<'CBA' | 'ABC' | 'BAC'>('CBA');

  // TAB 2 田忌赛马
  const [horseStrategy, setHorseStrategy] = useState<'optimal' | 'naive'>('optimal');

  // 排队计算
  const truckTimes = { A: 8, B: 4, C: 1 };
  const currentTrucks = queueOrder.split('') as ('A' | 'B' | 'C')[];
  
  // 计算每个人的等待时间
  const waitTime1 = 0;
  const waitTime2 = truckTimes[currentTrucks[0]];
  const waitTime3 = truckTimes[currentTrucks[0]] + truckTimes[currentTrucks[1]];
  const totalWaitTime = waitTime1 + waitTime2 + waitTime3;

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Truck size={18} style={{ color: '#0284c7' }} />
          <span>统筹与博弈：排队等待与田忌赛马策略</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${activeTab === 'queuing' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('queuing')}
          >
            <Truck size={14} />
            <span>排队卸货 (短耗时优先)</span>
          </button>
          <button
            className={`${styles.controlBtn} ${activeTab === 'tianji' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('tianji')}
          >
            <Trophy size={14} />
            <span>田忌赛马 (劣势以弱胜强)</span>
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* TAB 1: 排队卸货 */}
        {activeTab === 'queuing' && (
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
                <strong>【排队卸货/打水核心法则】：</strong>
                码头只有一个卸货位，卡车 A 需 8 分钟，卡车 B 需 4 分钟，卡车 C 需 1 分钟。
                <br />
                如何安排顺序，能让三辆车的<strong>【等待时间总和】最少？</strong>
              </div>

              {/* 卡车队列可视化 */}
              <div style={{
                marginTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155' }}>
                  🚚 当前进站卸货流水线：
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {currentTrucks.map((truck, idx) => {
                    const time = truckTimes[truck];
                    const wait = idx === 0 ? waitTime1 : idx === 1 ? waitTime2 : waitTime3;
                    return (
                      <div
                        key={idx}
                        style={{
                          flex: 1,
                          background: idx === 0 ? '#eff6ff' : '#f8fafc',
                          border: `1.5px solid ${idx === 0 ? '#3b82f6' : '#cbd5e1'}`,
                          borderRadius: '8px',
                          padding: '12px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>第 {idx + 1} 位进站</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                          卡车 {truck} ({time}分钟)
                        </div>
                        <div style={{ fontSize: '0.75rem', color: wait === 0 ? '#16a34a' : '#ea580c', fontWeight: 700, marginTop: '4px' }}>
                          等待耗时: {wait} 分钟
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 汇总仪表盘 */}
                <div style={{
                  padding: '14px',
                  background: queueOrder === 'CBA' ? '#ecfdf5' : '#fef2f2',
                  border: `1.5px solid ${queueOrder === 'CBA' ? '#86efac' : '#fecaca'}`,
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: queueOrder === 'CBA' ? '#15803d' : '#991b1b' }}>
                      全队等待时间总和
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: queueOrder === 'CBA' ? '#166534' : '#dc2626', marginTop: '2px' }}>
                      {totalWaitTime} 分钟 ({waitTime1} + {waitTime2} + {waitTime3})
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#64748b' }}>
                    {queueOrder === 'CBA' ? (
                      <span style={{ color: '#15803d', fontWeight: 800 }}>🎉 最优方案！短耗时优先！</span>
                    ) : (
                      <span style={{ color: '#dc2626', fontWeight: 700 }}>⚠️ 浪费了 {totalWaitTime - 6} 分钟！</span>
                    )}
                  </div>
                </div>

                {/* 算理破局 */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  fontSize: '0.825rem',
                  color: '#334155',
                  lineHeight: 1.6
                }}>
                  <strong>💡 为什么必须“耗时短的排在最前面”？</strong>
                  <br />
                  第 1 个人的卸货时间，后面的 2 个人都要老老实实陪着等；
                  <br />
                  第 2 个人的时间，只有最后 1 个人陪他等；
                  <br />
                  第 3 个人的时间，没有任何人需要陪他等！
                  <br />
                  👉 <strong>总等待时间 = 第1个人时间×2 + 第2个人时间×1 + 第3个人时间×0</strong>。
                  为了让总和最小，<strong>系数最大的乘数必须配最小的耗时</strong>！所以：丙(1分) ➔ 乙(4分) ➔ 甲(8分) 最优！
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
                className={`${styles.controlBtn} ${queueOrder === 'CBA' ? styles.controlBtnActive : ''}`}
                onClick={() => setQueueOrder('CBA')}
              >
                最优方案：丙(1) ➔ 乙(4) ➔ 甲(8) (总等6分)
              </button>
              <button
                className={`${styles.controlBtn} ${queueOrder === 'ABC' ? styles.controlBtnActive : ''}`}
                onClick={() => setQueueOrder('ABC')}
              >
                最差方案：甲(8) ➔ 乙(4) ➔ 丙(1) (总等20分)
              </button>
              <button
                className={`${styles.controlBtn} ${queueOrder === 'BAC' ? styles.controlBtnActive : ''}`}
                onClick={() => setQueueOrder('BAC')}
              >
                普通顺序：乙(4) ➔ 甲(8) ➔ 丙(1) (总等16分)
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: 田忌赛马 */}
        {activeTab === 'tianji' && (
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
                background: '#fefce8',
                padding: '10px 14px',
                borderRadius: '8px',
                borderLeft: '4px solid #eab308',
                fontSize: '0.875rem',
                color: '#854d0e',
                lineHeight: 1.6
              }}>
                <strong>【田忌赛马博弈策略】：</strong>
                齐王马：上(10), 中(8), 下(6)。田忌马：上(9), 中(7), 下(5)。
                <br />
                田忌每一等马都比齐王弱一档。如果硬碰硬必 0:3 惨败，看孙膑如何<strong>“弃保兑子，以弱胜强”</strong>！
              </div>

              {/* 三局对战图 */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {horseStrategy === 'optimal' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#fee2e2', borderRadius: '8px', border: '1px solid #fecaca', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#991b1b' }}>第 1 场：田忌下等马(5) vs 齐王上等马(10)</span>
                      <span style={{ background: '#dc2626', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>齐王胜 (田忌弃卒保帅)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#065f46' }}>第 2 场：田忌上等马(9) vs 齐王中等马(8)</span>
                      <span style={{ background: '#16a34a', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>田忌胜! (9 &gt; 8)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#065f46' }}>第 3 场：田忌中等马(7) vs 齐王下等马(6)</span>
                      <span style={{ background: '#16a34a', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>田忌胜! (7 &gt; 6)</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#fee2e2', borderRadius: '8px', border: '1px solid #fecaca', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#991b1b' }}>第 1 场：田忌上等马(9) vs 齐王上等马(10)</span>
                      <span style={{ background: '#dc2626', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>齐王胜 (10 &gt; 9)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#fee2e2', borderRadius: '8px', border: '1px solid #fecaca', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#991b1b' }}>第 2 场：田忌中等马(7) vs 齐王中等马(8)</span>
                      <span style={{ background: '#dc2626', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>齐王胜 (8 &gt; 7)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#fee2e2', borderRadius: '8px', border: '1px solid #fecaca', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#991b1b' }}>第 3 场：田忌下等马(5) vs 齐王下等马(6)</span>
                      <span style={{ background: '#dc2626', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>齐王胜 (6 &gt; 5)</span>
                    </div>
                  </>
                )}

                <div style={{
                  marginTop: '10px',
                  padding: '12px 14px',
                  background: horseStrategy === 'optimal' ? '#f0fdf4' : '#fef2f2',
                  borderRadius: '8px',
                  border: `1.5px solid ${horseStrategy === 'optimal' ? '#86efac' : '#fecaca'}`,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: horseStrategy === 'optimal' ? '#166534' : '#dc2626' }}>
                    {horseStrategy === 'optimal' ? '🎉 最终总比分：田忌 2 : 1 齐王 (奇迹翻盘！)' : '❌ 最终总比分：田忌 0 : 3 齐王 (满盘皆输)'}
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
                className={`${styles.controlBtn} ${horseStrategy === 'optimal' ? styles.controlBtnActive : ''}`}
                onClick={() => setHorseStrategy('optimal')}
              >
                孙膑锦囊：下对上、上对中、中对下 (2:1 胜)
              </button>
              <button
                className={`${styles.controlBtn} ${horseStrategy === 'naive' ? styles.controlBtnActive : ''}`}
                onClick={() => setHorseStrategy('naive')}
              >
                常规对决：上对上、中对中、下对下 (0:3 败)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
