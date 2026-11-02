'use client';

import React, { useState } from 'react';

export default function TieredPricingTaxiLab() {
  const [modelType, setModelType] = useState<'taxi' | 'electricity'>('taxi');
  const [distance, setDistance] = useState<number>(7.2); // 公里
  const [kwh, setKwh] = useState<number>(260); // 度电
  const [showFormula, setShowFormula] = useState<boolean>(false);

  // Taxi calculation:
  // Base 10 yuan (<= 3km)
  // Beyond 3km: ceil(distance) - 3 km at 2.4 yuan/km
  const actualKm = Math.ceil(distance);
  const excessKm = Math.max(0, actualKm - 3);
  const taxiBaseFare = 10;
  const taxiExcessFare = excessKm * 2.4;
  const taxiTotalFare = (taxiBaseFare + taxiExcessFare).toFixed(1);

  // Electricity calculation:
  // Tier 1: 0~200 kWh @ 0.50 yuan
  // Tier 2: 201~400 kWh @ 0.60 yuan
  // Tier 3: >400 kWh @ 0.80 yuan
  const t1 = Math.min(kwh, 200);
  const t2 = Math.max(0, Math.min(kwh - 200, 200));
  const t3 = Math.max(0, kwh - 400);
  const costT1 = t1 * 0.5;
  const costT2 = t2 * 0.6;
  const costT3 = t3 * 0.8;
  const totalElecCost = (costT1 + costT2 + costT3).toFixed(2);

  return (
    <div style={{
      width: '100%',
      maxWidth: '780px',
      margin: '0 auto',
      padding: '20px',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* 头部标题 */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: '0 0 6px 0' }}>
          生活数学与分段计费：出租车与阶梯水电的“拐点算理”
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          不能一概而论乘单价！看清“起步基准价 + 超额进一法”的阶段拆分模型。
        </p>
      </div>

      {/* 画布区域 */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '340px'
      }}>
        {modelType === 'taxi' ? (
          /* 出租车计价展示 */
          <div style={{ width: '100%', maxWidth: '520px' }}>
            {/* 计价里程台阶图 */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px', paddingBottom: '20px', borderBottom: '2px solid #cbd5e1' }}>
              {/* 起步段 */}
              <div style={{
                flex: 3,
                height: '70px',
                background: '#93c5fd',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #3b82f6'
              }}>
                <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700 }}>起步里程 (0 ~ 3 km)</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d4ed8' }}>固定 10 元</span>
              </div>

              {/* 超额段 */}
              <div style={{
                flex: 5,
                height: `${Math.min(130, 70 + excessKm * 10)}px`,
                background: excessKm > 0 ? '#fef08a' : '#f1f5f9',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: excessKm > 0 ? '1px solid #eab308' : '1px dashed #cbd5e1',
                transition: 'all 0.3s'
              }}>
                <span style={{ fontSize: '0.75rem', color: '#854d0e', fontWeight: 700 }}>
                  超额段 (超出 {excessKm} km)
                </span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#a16207' }}>
                  {excessKm > 0 ? `+${taxiExcessFare.toFixed(1)} 元 (每公里2.4元)` : '未超出'}
                </span>
              </div>
            </div>

            {/* 当前里程与进一法提示 */}
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
              <span>行驶距离：<strong>{distance} km</strong></span>
              <span style={{ color: '#ea580c', fontWeight: 700 }}>
                ⚠️ 进一法计价：不足1km按1km算 ➔ <strong>按 {actualKm} km 计费</strong>
              </span>
            </div>

            {/* 账单明细卡 */}
            <div style={{
              marginTop: '14px',
              padding: '12px 18px',
              background: '#eff6ff',
              borderRadius: '10px',
              border: '1px solid #bfdbfe',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#1e40af', marginBottom: '4px' }}>
                总车费 = 起步费 10元 + 超额费 ({actualKm} - 3) × 2.4 = 10 + {taxiExcessFare.toFixed(1)}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1d4ed8' }}>
                应付车费 = <span style={{ fontSize: '1.6rem', color: '#dc2626' }}>{taxiTotalFare}</span> 元
              </div>
            </div>
          </div>
        ) : (
          /* 阶梯电价展示 */
          <div style={{ width: '100%', maxWidth: '520px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
              {/* 一档 */}
              <div style={{ padding: '10px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 700 }}>第一档 (0~200度)</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#047857', margin: '4px 0' }}>{t1} 度</div>
                <div style={{ fontSize: '0.75rem', color: '#059669' }}>{costT1.toFixed(1)} 元 (0.5元/度)</div>
              </div>

              {/* 二档 */}
              <div style={{ padding: '10px', background: t2 > 0 ? '#fef3c7' : '#f8fafc', borderRadius: '8px', border: t2 > 0 ? '1px solid #fde68a' : '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 700 }}>第二档 (201~400度)</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>{t2} 度</div>
                <div style={{ fontSize: '0.75rem', color: '#d97706' }}>{costT2.toFixed(1)} 元 (0.6元/度)</div>
              </div>

              {/* 三档 */}
              <div style={{ padding: '10px', background: t3 > 0 ? '#fee2e2' : '#f8fafc', borderRadius: '8px', border: t3 > 0 ? '1px solid #fecaca' : '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 700 }}>第三档 (400度以上)</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>{t3} 度</div>
                <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>{costT3.toFixed(1)} 元 (0.8元/度)</div>
              </div>
            </div>

            <div style={{
              padding: '12px 18px',
              background: '#f0fdf4',
              borderRadius: '10px',
              border: '1px solid #bbf7d0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#166534', marginBottom: '4px' }}>
                用电总量 {kwh} 度 = 一档 {t1}度 + 二档 {t2}度 + 三档 {t3}度
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>
                总电费 = {costT1.toFixed(1)} + {costT2.toFixed(1)} + {costT3.toFixed(1)} = <span style={{ fontSize: '1.55rem', color: '#047857' }}>{totalElecCost}</span> 元
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 控制栏 */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* 模式切换 */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setModelType('taxi')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: modelType === 'taxi' ? '#2563eb' : '#f1f5f9',
              color: modelType === 'taxi' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            🚕 出租车计价 (起步+超额)
          </button>
          <button
            onClick={() => setModelType('electricity')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: modelType === 'electricity' ? '#059669' : '#f1f5f9',
              color: modelType === 'electricity' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            ⚡ 居民阶梯电价 (多档累加)
          </button>
        </div>

        {/* 滑块参数 */}
        {modelType === 'taxi' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>行驶里程:</span>
            <input
              type="range"
              min="1"
              max="15"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              style={{ width: '90px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>{distance} km</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>用电量:</span>
            <input
              type="range"
              min="50"
              max="550"
              step="10"
              value={kwh}
              onChange={(e) => setKwh(Number(e.target.value))}
              style={{ width: '90px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>{kwh} 度</span>
          </div>
        )}

        {/* 原理提示 */}
        <button
          onClick={() => setShowFormula(!showFormula)}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: showFormula ? '#fef3c7' : '#f8fafc',
            color: showFormula ? '#92400e' : '#64748b',
            fontWeight: 700,
            fontSize: '0.8125rem',
            cursor: 'pointer'
          }}
        >
          {showFormula ? '收起口诀' : '💡 分段计费三大常考陷阱'}
        </button>
      </div>

      {/* 原理卡片 */}
      {showFormula && (
        <div style={{
          marginTop: '16px',
          padding: '14px',
          background: '#fffbeb',
          borderRadius: '10px',
          border: '1px solid #fde68a',
          fontSize: '0.8125rem',
          color: '#78350f',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: '0 0 6px 0', fontWeight: 800 }}>📌 分段计费解题三大纪律：</p>
          <ol style={{ margin: 0, paddingLeft: '18px' }}>
            <li>
              <strong>千万不能全局乘单价</strong>：出租车费不是路程乘 2.4，电费不是总度数乘最高档单价！必须切成“区间小段”，每一段各算各的钱。
            </li>
            <li>
              <strong>进一法取整别忘记</strong>：出租车计价规则中“不足 1 公里按 1 公里计算”，例如 7.1 公里和 7.9 公里都要按 8 公里算！
            </li>
            <li>
              <strong>逆向求里程问题</strong>：已知车费 22 元求里程？先减去起步费 10 元剩 12 元；超额里程 = 12 ÷ 2.4 = 5 公里；总里程范围为大于 7 公里且不超过 8 公里！
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
