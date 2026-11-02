'use client';

import React, { useState } from 'react';

type OperationType = 'linear' | 'prod_diff' | 'average_weighted';

export default function DefiningNewOperationsLab() {
  const [opType, setOpType] = useState<OperationType>('linear');
  const [valA, setValA] = useState<number>(5);
  const [valB, setValB] = useState<number>(3);
  const [mode, setMode] = useState<'forward' | 'inverse'>('forward');
  const [targetResult, setTargetResult] = useState<number>(22);
  const [showFormula, setShowFormula] = useState<boolean>(false);

  // Formulas
  // Linear: a ⊕ b = 2a + 3b
  // ProdDiff: a ⊗ b = a * b - (a + b)
  // Weighted: a ⊙ b = 3a - b

  const getForwardResult = (a: number, b: number) => {
    switch (opType) {
      case 'linear':
        return 2 * a + 3 * b;
      case 'prod_diff':
        return a * b - (a + b);
      case 'average_weighted':
        return 3 * a - b;
    }
  };

  const getOpSymbol = () => {
    switch (opType) {
      case 'linear': return '⊕';
      case 'prod_diff': return '⊗';
      case 'average_weighted': return '⊙';
    }
  };

  const getRuleDescription = () => {
    switch (opType) {
      case 'linear': return 'a ⊕ b = 2a + 3b';
      case 'prod_diff': return 'a ⊗ b = a × b - (a + b)';
      case 'average_weighted': return 'a ⊙ b = 3a - b';
    }
  };

  // Inverse solution for x (x ⊕ valB = targetResult)
  // For linear: 2x + 3*b = target => 2x = target - 3b => x = (target - 3b)/2
  const solveInverseX = () => {
    if (opType === 'linear') {
      const numerator = targetResult - 3 * valB;
      const x = numerator / 2;
      return {
        step1: `根据规则展开：2x + 3 × ${valB} = ${targetResult}`,
        step2: `移项整理：2x + ${3 * valB} = ${targetResult} ➔ 2x = ${targetResult} - ${3 * valB} = ${numerator}`,
        step3: `除以系数：x = ${numerator} ÷ 2 = ${x}`,
        val: x
      };
    } else if (opType === 'average_weighted') {
      const numerator = targetResult + valB;
      const x = numerator / 3;
      return {
        step1: `根据规则展开：3x - ${valB} = ${targetResult}`,
        step2: `移项整理：3x = ${targetResult} + ${valB} = ${numerator}`,
        step3: `除以系数：x = ${numerator} ÷ 3 = ${x.toFixed(2)}`,
        val: Number(x.toFixed(2))
      };
    } else {
      // x * b - x - b = target => x(b - 1) = target + b => x = (target + b) / (b - 1)
      if (valB === 1) return { step1: 'b=1 时除数为0，无法唯一确定', step2: '', step3: '', val: 0 };
      const numerator = targetResult + valB;
      const denom = valB - 1;
      const x = numerator / denom;
      return {
        step1: `根据规则展开：x × ${valB} - (x + ${valB}) = ${targetResult}`,
        step2: `提取公因式：x(${valB} - 1) = ${targetResult} + ${valB} ➔ ${denom}x = ${numerator}`,
        step3: `除以系数：x = ${numerator} ÷ ${denom} = ${Number(x.toFixed(2))}`,
        val: Number(x.toFixed(2))
      };
    }
  };

  const inverseData = solveInverseX();

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
          定义新运算：揭开神秘符号的“加工厂流水线”
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          看到 ⊕、⊗ 不要慌！它们不是外星符号，只是“对号入座套公式”的游戏规则。
        </p>
      </div>

      {/* 视觉主区：加工厂机器模型 */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '24px 16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '320px'
      }}>
        {/* 规则横幅 */}
        <div style={{
          padding: '8px 20px',
          background: '#ede9fe',
          borderRadius: '20px',
          border: '1px solid #c4b5fd',
          fontSize: '1rem',
          fontWeight: 800,
          color: '#6d28d9',
          marginBottom: '20px'
        }}>
          当前运算工厂规则：{getRuleDescription()}
        </div>

        {mode === 'forward' ? (
          /* 正向加工模式 */
          <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* 输入两端 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ padding: '10px 18px', background: '#dbeafe', borderRadius: '10px', border: '2px solid #3b82f6', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 700 }}>左零件 a</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e40af' }}>{valA}</div>
              </div>

              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8b5cf6' }}>{getOpSymbol()}</div>

              <div style={{ padding: '10px 18px', background: '#dcfce7', borderRadius: '10px', border: '2px solid #10b981', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>右零件 b</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#065f46' }}>{valB}</div>
              </div>
            </div>

            {/* 机器加工流水线动画条 */}
            <div style={{
              width: '100%',
              padding: '16px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '2px dashed #94a3b8',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>
                ⚙️ 流水线对号入座替换：把 a 换成 {valA}，把 b 换成 {valB}
              </div>
              <div style={{ fontSize: '1.1rem', color: '#334155', fontWeight: 700, margin: '8px 0' }}>
                {opType === 'linear' && `2 × (${valA}) + 3 × (${valB}) = ${2 * valA} + ${3 * valB}`}
                {opType === 'prod_diff' && `(${valA}) × (${valB}) - [(${valA}) + (${valB})] = ${valA * valB} - ${valA + valB}`}
                {opType === 'average_weighted' && `3 × (${valA}) - (${valB}) = ${3 * valA} - ${valB}`}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16a34a', marginTop: '10px' }}>
                ✨ 最终产出结果 = {getForwardResult(valA, valB)}
              </div>
            </div>
          </div>
        ) : (
          /* 逆向解方程模式 */
          <div style={{ width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '14px' }}>
              已知方程：<span style={{ color: '#dc2626' }}>x</span> {getOpSymbol()} {valB} = {targetResult}，求未知数 <span style={{ color: '#dc2626' }}>x</span>
            </div>

            <div style={{
              width: '100%',
              padding: '16px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>① {inverseData.step1}</div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>② {inverseData.step2}</div>
              <div style={{ fontSize: '0.875rem', color: '#475569', fontWeight: 700 }}>③ {inverseData.step3}</div>
              <div style={{
                marginTop: '8px',
                padding: '8px',
                background: '#fef2f2',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#dc2626',
                textAlign: 'center'
              }}>
                🎯 解得 x = {inverseData.val}
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
        {/* 模式选择 */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setMode('forward')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: mode === 'forward' ? '#8b5cf6' : '#f1f5f9',
              color: mode === 'forward' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            ▶️ 正向流水线代入
          </button>
          <button
            onClick={() => setMode('inverse')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: mode === 'inverse' ? '#dc2626' : '#f1f5f9',
              color: mode === 'inverse' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            🔄 逆向解未知数 x
          </button>
        </div>

        {/* 规则切换 */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setOpType('linear')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: opType === 'linear' ? '#2563eb' : '#f8fafc',
              color: opType === 'linear' ? '#fff' : '#475569',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            2a+3b (加权线性)
          </button>
          <button
            onClick={() => setOpType('prod_diff')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: opType === 'prod_diff' ? '#2563eb' : '#f8fafc',
              color: opType === 'prod_diff' ? '#fff' : '#475569',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            ab-(a+b) (乘积减和)
          </button>
          <button
            onClick={() => setOpType('average_weighted')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: opType === 'average_weighted' ? '#2563eb' : '#f8fafc',
              color: opType === 'average_weighted' ? '#fff' : '#475569',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            3a-b (倍差)
          </button>
        </div>

        {/* 滑块参数 */}
        {mode === 'forward' ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 8px', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.75rem' }}>a:</span>
              <input type="range" min="1" max="10" value={valA} onChange={(e) => setValA(Number(e.target.value))} style={{ width: '60px' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{valA}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 8px', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.75rem' }}>b:</span>
              <input type="range" min="1" max="10" value={valB} onChange={(e) => setValB(Number(e.target.value))} style={{ width: '60px' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{valB}</span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 10px', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: '#475569' }}>目标结果:</span>
            <input
              type="range"
              min="10"
              max="40"
              step="2"
              value={targetResult}
              onChange={(e) => setTargetResult(Number(e.target.value))}
              style={{ width: '80px' }}
            />
            <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>{targetResult}</span>
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
          {showFormula ? '收起秘籍' : '💡 解题三大黄金准则'}
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
          <p style={{ margin: '0 0 6px 0', fontWeight: 800 }}>📌 定义新运算三步通关法：</p>
          <ol style={{ margin: 0, paddingLeft: '18px' }}>
            <li><strong>准确认位位置</strong>：左边的数替换规则中的 $a$，右边的数替换规则中的 $b$，切勿左右颠倒（新运算一般不满足交换律！）。</li>
            <li><strong>括号优先算局部</strong>：遇到复合嵌套运算如 $(3 \oplus 4) \oplus 5$，必须先算出小括号内的值，再把产出结果与外面的 5 重新入座运算。</li>
            <li><strong>逆运算还原方程</strong>：当运算中出现未知数 $x$（如 $x \oplus 3 = 18$），把 $x$ 视作普通代数未知数照常展开，转化为一元一次方程移项求解！</li>
          </ol>
        </div>
      )}
    </div>
  );
}

