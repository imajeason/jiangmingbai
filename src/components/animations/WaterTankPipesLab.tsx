'use client';

import React, { useState } from 'react';

export default function WaterTankPipesLab() {
  const [inletHours, setInletHours] = useState<number>(4); // 单开进水管充满小时
  const [outletHours, setOutletHours] = useState<number>(6); // 单开出水管排空小时
  const [mode, setMode] = useState<'simultaneous' | 'alternating'>('simultaneous');
  const [showFormula, setShowFormula] = useState<boolean>(false);

  // Rate of inlet and outlet (fraction of full tank per hour)
  const vIn = 1 / inletHours;
  const vOut = 1 / outletHours;
  const vNet = vIn - vOut;

  // Simultaneous time
  const simultaneousTime = vNet > 0 ? (1 / vNet).toFixed(1) : '无法注满(放水更快)';

  // Alternating cycle (A 1hr, B 1hr = 2hr cycle)
  // Net gain per 2hr cycle = vIn - vOut
  // Before last hour of A, need to reach (1 - vIn)
  const targetBeforeLastA = 1 - vIn;
  const cycleGain = vIn - vOut;
  let cycleCount = 0;
  let remainingNeed = 1;
  let alternatingDetails = '';

  if (cycleGain > 0) {
    cycleCount = Math.floor(targetBeforeLastA / cycleGain);
    if (cycleCount * cycleGain < targetBeforeLastA) {
      cycleCount += 1;
    }
    const waterAfterCycles = cycleCount * cycleGain;
    const waterRemaining = 1 - waterAfterCycles;
    const lastTimeA = waterRemaining / vIn;
    const totalAlternatingHours = (cycleCount * 2 + lastTimeA).toFixed(2);

    alternatingDetails = `循环 ${cycleCount} 轮后水位达 ${(waterAfterCycles * 100).toFixed(0)}%，最后进水管仅需 ${(lastTimeA * 60).toFixed(0)} 分钟提前充满！总耗时 ${totalAlternatingHours} 小时。`;
  }

  // Water level percentage for simulation preview
  const previewPercentage = mode === 'simultaneous' ? 70 : 85;

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
      {/* 标题 */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: '0 0 6px 0' }}>
          水管注水与排水：蓄水池进出水的“动态博弈”
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          进水管注水、出水管放水：揭秘“净工效相抵”与轮流开管“最后一次提前注满”大坑！
        </p>
      </div>

      {/* 视觉水箱展示区 */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '24px 16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '340px'
      }}>
        {/* SVG 水箱剖面 */}
        <svg viewBox="0 0 360 260" style={{ width: '100%', maxWidth: '360px', overflow: 'visible' }}>
          {/* 顶部进水管 */}
          <g>
            <rect x="70" y="10" width="30" height="40" fill="#93c5fd" stroke="#2563eb" strokeWidth="2" />
            <path d="M 75 50 L 75 90 Q 85 110 95 90 L 95 50" fill="#60a5fa" opacity="0.8" />
            <text x="85" y="8" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="700">
              进水管 A (1/{inletHours})
            </text>
          </g>

          {/* 蓄水池玻璃缸 */}
          <rect x="50" y="50" width="220" height="170" rx="8" fill="#f1f5f9" stroke="#334155" strokeWidth="3" />

          {/* 水位填充 */}
          <rect
            x="54"
            y={220 - (previewPercentage / 100) * 166}
            width="212"
            height={(previewPercentage / 100) * 166}
            rx="4"
            fill="#38bdf8"
            opacity="0.85"
          />

          {/* 水面波纹示意 */}
          <line
            x1="54"
            y1={220 - (previewPercentage / 100) * 166}
            x2="266"
            y2={220 - (previewPercentage / 100) * 166}
            stroke="#0284c7"
            strokeWidth="3"
            strokeDasharray="6 4"
          />

          {/* 水池刻度线 */}
          {[0.25, 0.5, 0.75, 1].map((ratio) => (
            <g key={ratio}>
              <line x1="50" y1={220 - ratio * 166} x2="62" y2={220 - ratio * 166} stroke="#64748b" strokeWidth="1.5" />
              <text x="44" y={224 - ratio * 166} textAnchor="end" fill="#64748b" fontSize="9" fontWeight="600">
                {ratio === 1 ? '总量1' : `${ratio * 100}%`}
              </text>
            </g>
          ))}

          {/* 底部出水管 */}
          <g>
            <rect x="220" y="190" width="60" height="24" fill="#fca5a5" stroke="#ef4444" strokeWidth="2" />
            <path d="M 280 196 L 310 196 Q 320 202 310 208 L 280 208" fill="#f87171" opacity="0.85" />
            <text x="280" y="184" textAnchor="middle" fill="#b91c1c" fontSize="11" fontWeight="700">
              出水管 B (1/{outletHours})
            </text>
          </g>

          <text x="160" y="140" textAnchor="middle" fill="#0369a1" fontSize="13" fontWeight="800">
            蓄水池 (单位 1)
          </text>
        </svg>

        {/* 动态计算结果条 */}
        <div style={{
          marginTop: '16px',
          padding: '14px 20px',
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          width: '100%',
          maxWidth: '520px',
          textAlign: 'center'
        }}>
          {mode === 'simultaneous' ? (
            <div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '6px' }}>
                进水效率 = 1/{inletHours} 水池/时 | 出水效率 = 1/{outletHours} 水池/时
              </div>
              <div style={{ fontSize: '0.9375rem', color: '#1e40af', fontWeight: 700, marginBottom: '6px' }}>
                净注水工效 = 1/{inletHours} - 1/{outletHours} = {(vNet).toFixed(3)} 水池/时
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16a34a' }}>
                🎉 两管齐开充满耗时：1 ÷ (1/{inletHours} - 1/{outletHours}) = <span style={{ fontSize: '1.4rem', color: '#2563eb' }}>{simultaneousTime}</span> 小时
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '6px' }}>
                交替开管模式：第1小时开A注水，第2小时开B排水（2小时为一轮循环）
              </div>
              <div style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: 700, marginBottom: '6px' }}>
                ⚠️ 警惕大坑：最后一轮注满即止，无需再开管排水！
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#047857' }}>
                {alternatingDetails}
              </div>
            </div>
          )}
        </div>
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
        {/* 模式选择 */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setMode('simultaneous')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: mode === 'simultaneous' ? '#2563eb' : '#f1f5f9',
              color: mode === 'simultaneous' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            🚰 双管齐开 (净流速)
          </button>
          <button
            onClick={() => setMode('alternating')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: mode === 'alternating' ? '#ea580c' : '#f1f5f9',
              color: mode === 'alternating' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            ⏱️ 轮流交替开管 (易错题)
          </button>
        </div>

        {/* 进水管单开时间调节 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700 }}>进水A单开:</span>
          <input
            type="range"
            min="2"
            max="6"
            value={inletHours}
            onChange={(e) => setInletHours(Number(e.target.value))}
            style={{ width: '60px' }}
          />
          <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>{inletHours}小时</span>
        </div>

        {/* 出水管单开时间调节 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>出水B单开:</span>
          <input
            type="range"
            min="4"
            max="10"
            value={outletHours}
            onChange={(e) => setOutletHours(Number(e.target.value))}
            style={{ width: '60px' }}
          />
          <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>{outletHours}小时</span>
        </div>

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
          {showFormula ? '收起秘籍' : '💡 水管问题两大经典坑点'}
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
          <p style={{ margin: '0 0 6px 0', fontWeight: 800 }}>📌 蓄水池工程问题两大核心要点：</p>
          <ol style={{ margin: 0, paddingLeft: '18px' }}>
            <li>
              <strong>双管同开看净工效</strong>：
              进水是正贡献（+1/A），排水是负贡献（-1/B）。两管齐开的净工效为 1/A - 1/B。如果出水管比进水管还快，水池永远注不满！
            </li>
            <li>
              <strong>轮流开管千万别漏扣“最后一小时进水”</strong>：
              这是小学最高频的“青蛙跳井模型”变式！在最后一轮，进水管只要把池子灌满任务就结束了，<strong>绝不可能在注满后再打开排水管</strong>。解题必须先预留出进水管 1 小时的注水量（1 - 1/A），算出前面的完整循环轮数，最后加上单独进水的小数时间。
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
