'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type ProfitMode = 'pipeline' | 'trap20' | 'promo';

export default function ProfitLossDiscountLab() {
  const [mode, setMode] = useState<ProfitMode>('pipeline');

  // Mode 1: 流水线参数
  const [cost, setCost] = useState<number>(100); // 成本/进价
  const [markupPercent, setMarkupPercent] = useState<number>(50); // 加价率 (%)
  const [discountPercent, setDiscountPercent] = useState<number>(80); // 折扣率 (80% = 8折)

  // 计算派生值
  const markedPrice = Math.round(cost * (1 + markupPercent / 100)); // 标价
  const sellingPrice = Math.round(markedPrice * (discountPercent / 100)); // 实际售价
  const profit = sellingPrice - cost; // 利润
  const profitRate = cost > 0 ? ((profit / cost) * 100).toFixed(1) : '0'; // 利润率

  // Mode 2: 涨跌 20% 陷阱参数
  const [trapRate, setTrapRate] = useState<number>(20); // 涨跌百分比
  const trapOriginal = 100;
  const trapRaised = Math.round(trapOriginal * (1 + trapRate / 100));
  const trapFinal = Math.round(trapRaised * (1 - trapRate / 100) * 10) / 10;
  const trapLoss = (trapOriginal - trapFinal).toFixed(1);
  const trapLossPercent = ((trapRate * trapRate) / 100).toFixed(1);

  // Mode 3: 促销比拼参数
  const [spendAmount, setSpendAmount] = useState<number>(240); // 消费总额

  // 策略 A: 全场 75 折
  const payA = Math.round(spendAmount * 0.75);
  // 策略 B: 满 200 减 50
  const payB = spendAmount >= 200 ? spendAmount - Math.floor(spendAmount / 200) * 50 : spendAmount;
  // 策略 C: 买四赠一 (相当于 8 折，每 5 件只需付 4 件)
  const payC = Math.round(spendAmount * 0.8);

  return (
    <div className={styles.labContainer}>
      {/* 顶部模式切换 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <button
          className={`${styles.stepButton} ${mode === 'pipeline' ? styles.active : ''}`}
          onClick={() => setMode('pipeline')}
        >
          🏭 进价与利润全流程
        </button>
        <button
          className={`${styles.stepButton} ${mode === 'trap20' ? styles.active : ''}`}
          onClick={() => setMode('trap20')}
        >
          ⚠️ 破解“先涨后跌”致命陷阱
        </button>
        <button
          className={`${styles.stepButton} ${mode === 'promo' ? styles.active : ''}`}
          onClick={() => setMode('promo')}
        >
          🛒 促销策略精明大 PK
        </button>
      </div>

      {/* 启发说明条 */}
      <div style={{ background: '#f0fdf4', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #16a34a', marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.95rem' }}>
          💡 商业利润核心铁律：利润率的基准单位“1”永远是【进价成本】，绝不是售价！
        </div>
        <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
          公式清单：标价 = 进价 × (1 + 加价率)；售价 = 标价 × 折扣；利润 = 售价 - 进价；利润率 = 利润 ÷ 进价 × 100%！
        </div>
      </div>

      {/* MODE 1: 进价、标价、打折全流程 */}
      {mode === 'pipeline' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          {/* 四大关键节点进度条展示 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {/* 1. 进价 */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: 700 }}>① 成本进价</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1d4ed8', margin: '4px 0' }}>¥{cost}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>单位“1”基准</div>
            </div>

            {/* 2. 标价 */}
            <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#7e22ce', fontWeight: 700 }}>② 标签原价</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#6b21a8', margin: '4px 0' }}>¥{markedPrice}</div>
              <div style={{ fontSize: '0.75rem', color: '#a855f7' }}>加价 +{markupPercent}%</div>
            </div>

            {/* 3. 实际售价 */}
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#c2410c', fontWeight: 700 }}>③ 实际售价</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ea580c', margin: '4px 0' }}>¥{sellingPrice}</div>
              <div style={{ fontSize: '0.75rem', color: '#f97316' }}>{discountPercent / 10} 折促销</div>
            </div>

            {/* 4. 净利润与利润率 */}
            <div style={{ background: profit >= 0 ? '#f0fdf4' : '#fef2f2', border: `1px solid ${profit >= 0 ? '#bbf7d0' : '#fecaca'}`, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: profit >= 0 ? '#15803d' : '#991b1b', fontWeight: 700 }}>
                ④ {profit >= 0 ? '净赚利润' : '亏损金额'}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: profit >= 0 ? '#16a34a' : '#dc2626', margin: '4px 0' }}>
                {profit >= 0 ? `+¥${profit}` : `-¥${Math.abs(profit)}`}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: profit >= 0 ? '#15803d' : '#b91c1c' }}>
                利润率: {profitRate}%
              </div>
            </div>
          </div>

          {/* 柱状长度对比图 */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '12px' }}>
              📊 金额与构成可视化柱状图：
            </div>

            {/* 标价总柱 */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                <span>标价构成 (¥{markedPrice})</span>
                <span>进价 ¥{cost} + 预期毛利 ¥{markedPrice - cost}</span>
              </div>
              <div style={{ display: 'flex', height: '24px', borderRadius: '6px', overflow: 'hidden', background: '#e2e8f0' }}>
                <div style={{ width: `${(cost / markedPrice) * 100}%`, background: '#3b82f6', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  成本 ¥{cost}
                </div>
                <div style={{ width: `${((markedPrice - cost) / markedPrice) * 100}%`, background: '#a855f7', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  加价部分
                </div>
              </div>
            </div>

            {/* 售价总柱 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                <span>打 {discountPercent / 10} 折后的实际所得 (¥{sellingPrice})</span>
                <span style={{ color: profit >= 0 ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                  {profit >= 0 ? `赚了 ¥${profit} (利润率 ${profitRate}%)` : `亏本甩卖 亏损 ¥${Math.abs(profit)}`}
                </span>
              </div>
              <div style={{ display: 'flex', height: '24px', borderRadius: '6px', overflow: 'hidden', background: '#e2e8f0' }}>
                <div style={{ width: `${Math.min(100, (cost / markedPrice) * 100)}%`, background: '#3b82f6', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  收回成本 ¥{cost}
                </div>
                {profit > 0 && (
                  <div style={{ width: `${(profit / markedPrice) * 100}%`, background: '#22c55e', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    纯利 ¥{profit}
                  </div>
                )}
                {profit < 0 && (
                  <div style={{ width: `${(Math.abs(profit) / markedPrice) * 100}%`, background: '#ef4444', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    亏损 ¥{Math.abs(profit)}
                  </div>
                )}
                <div style={{ flex: 1, background: '#cbd5e1', color: '#64748b', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  打折让利 ¥{markedPrice - sellingPrice}
                </div>
              </div>
            </div>
          </div>

          {/* 黄金近邻控制滑块 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', minWidth: '120px' }}>
                进价成本：¥{cost}
              </span>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                style={{ width: '180px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>拖动设置采购成本</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', minWidth: '120px' }}>
                加价率：+{markupPercent}%
              </span>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={markupPercent}
                onChange={(e) => setMarkupPercent(Number(e.target.value))}
                style={{ width: '180px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>标价 = 进价 × (1 + {markupPercent}%)</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', minWidth: '120px' }}>
                销售折扣：{discountPercent / 10} 折 ({discountPercent}%)
              </span>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                style={{ width: '180px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>售价 = 标价 × {discountPercent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: 破解“先涨后跌”致命陷阱 */}
      {mode === 'trap20' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
            <div style={{ fontWeight: 800, color: '#991b1b', fontSize: '1rem' }}>
              🚨 经典丢分大坑：“一件衣服原价 100 元，先涨价 {trapRate}%，再降价 {trapRate}%，现价还是 100 元吗？”
            </div>
            <div style={{ fontSize: '0.85rem', color: '#7f1d1d', marginTop: '6px' }}>
              将近 70% 的孩子想当然认为“加 {trapRate} 又减 {trapRate} 互相抵消，肯定还是 100 元”！实际上大错特错！
            </div>
          </div>

          {/* 两步演变全景对比 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* 阶段 1 */}
            <div style={{ background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>初始原价</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '6px 0' }}>¥{trapOriginal}</div>
              <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700 }}>基准单位“1” = 100 元</div>
            </div>

            {/* 阶段 2 */}
            <div style={{ background: '#eff6ff', border: '2px solid #3b82f6', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 700 }}>先涨价 +{trapRate}% 之后</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1d4ed8', margin: '6px 0' }}>¥{trapRaised}</div>
              <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>多了 100 × {trapRate}% = +{trapRaised - trapOriginal} 元</div>
            </div>

            {/* 阶段 3 */}
            <div style={{ background: '#fff1f2', border: '2px solid #f43f5e', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#9f1239', fontWeight: 700 }}>再降价 -{trapRate}% 之后</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#e11d48', margin: '6px 0' }}>¥{trapFinal}</div>
              <div style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 800 }}>
                少了 {trapRaised} × {trapRate}% = -{(trapRaised * trapRate) / 100} 元！
              </div>
            </div>
          </div>

          {/* 破局算理 */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
              💡 为什么不仅没保本，反而亏了 {trapLoss} 元 ({trapLossPercent}%)？
            </div>
            <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '6px', lineHeight: 1.6 }}>
              • <strong>第一次涨价</strong>：基准是 100 元，只涨了 <strong>+{trapRaised - trapOriginal} 元</strong>；<br />
              • <strong>第二次降价</strong>：基准已经变成了更大的 <strong>¥{trapRaised} 元</strong>！降的是大数的 {trapRate}%，整整扣除了 <strong>-{(trapRaised * trapRate) / 100} 元</strong>！<br />
              • 扣的多、加的少，最终价格必定变低：<br />
              <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#dc2626' }}>
                100 × (1 + {trapRate}%) × (1 - {trapRate}%) = 100 × (1 - {trapLossPercent}%) = {trapFinal} 元！
              </span>
            </div>
          </div>

          {/* 控制条 */}
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>调节涨跌比例：</span>
            {[10, 20, 30, 50].map((rate) => (
              <button
                key={rate}
                onClick={() => setTrapRate(rate)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: trapRate === rate ? '2px solid #ef4444' : '1px solid #cbd5e1',
                  background: trapRate === rate ? '#fee2e2' : '#ffffff',
                  color: trapRate === rate ? '#b91c1c' : '#334155',
                  fontWeight: trapRate === rate ? 800 : 500,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                涨跌 {rate}% (最终亏损 {((rate * rate) / 100).toFixed(0)}%)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MODE 3: 促销策略大 PK */}
      {mode === 'promo' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>当前选购总金额：</span>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', marginLeft: '6px' }}>
              ¥{spendAmount}
            </span>
          </div>

          {/* 三大促销卡片横向对比 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            {/* 策略 A */}
            <div style={{ background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.95rem' }}>方案 A：全场 75 折</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16a34a', margin: '8px 0' }}>¥{payA}</div>
              <div style={{ fontSize: '0.8rem', color: '#166534' }}>立省 ¥{spendAmount - payA} (相当于 7.5 折)</div>
            </div>

            {/* 策略 B */}
            <div style={{ background: '#eff6ff', border: '2px solid #3b82f6', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, color: '#1e40af', fontSize: '0.95rem' }}>方案 B：每满 200 减 50</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1d4ed8', margin: '8px 0' }}>¥{payB}</div>
              <div style={{ fontSize: '0.8rem', color: '#1e3a8a' }}>
                立省 ¥{spendAmount - payB} (相当于 {((payB / spendAmount) * 10).toFixed(1)} 折)
              </div>
            </div>

            {/* 策略 C */}
            <div style={{ background: '#faf5ff', border: '2px solid #a855f7', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, color: '#7e22ce', fontSize: '0.95rem' }}>方案 C：买四赠一</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#7c3aed', margin: '8px 0' }}>¥{payC}</div>
              <div style={{ fontSize: '0.8rem', color: '#581c87' }}>立省 ¥{spendAmount - payC} (恒定相当于 8.0 折)</div>
            </div>
          </div>

          {/* 控制条 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>换个购物车金额试算：</span>
            {[180, 200, 240, 390, 400].map((amt) => (
              <button
                key={amt}
                onClick={() => setSpendAmount(amt)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: spendAmount === amt ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  background: spendAmount === amt ? '#e0f2fe' : '#ffffff',
                  fontWeight: spendAmount === amt ? 800 : 500,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                ¥{amt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

