'use client';

import React, { useState } from 'react';

export default function RiverCrossingLab() {
  const [scenario, setScenario] = useState<'bridge' | 'river'>('bridge');
  const [bridgeStrategy, setBridgeStrategy] = useState<'naive' | 'optimal'>('optimal');
  const [riverStep, setRiverStep] = useState<number>(0);
  const [showFormula, setShowFormula] = useState<boolean>(false);

  // River crossing steps (7 steps)
  const riverSteps = [
    { title: '第 0 步：起点状态', left: '农夫、狼、羊、菜', right: '（空）', action: '准备开始' },
    { title: '第 1 步：农夫带羊过去', left: '狼、菜', right: '农夫、羊', action: '羊离开后，狼不吃菜，安全！' },
    { title: '第 2 步：农夫独自划回', left: '农夫、狼、菜', right: '羊', action: '羊单独在对岸，安全！' },
    { title: '第 3 步：农夫带狼过去', left: '菜', right: '农夫、狼、羊', action: '注意：农夫如果离开，狼会吃羊！' },
    { title: '第 4 步：关键神操作！农夫带羊划回！', left: '农夫、羊、菜', right: '狼', action: '绝妙弃保：把羊带回，留下狼单独在对岸！' },
    { title: '第 5 步：农夫带菜过去', left: '羊', right: '农夫、狼、菜', action: '留下羊在起点，狼不吃菜，对岸安全！' },
    { title: '第 6 步：农夫独自划回', left: '农夫、羊', right: '狼、菜', action: '对岸狼与菜和平共处！' },
    { title: '第 7 步：农夫带羊过去，大功告成！', left: '（空）', right: '农夫、狼、羊、菜', action: '🎉 全部安全渡河！' }
  ];

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
          趣味运筹与过河问题：狼羊过河与“提灯过桥”的最优策略
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          运筹博弈启蒙：为什么最快的人一直送灯不是最快？“把最慢的两个巨头捆绑”才是极值真理！
        </p>
      </div>

      {/* 画布展示区 */}
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
        {scenario === 'bridge' ? (
          /* 四人夜间过桥对比展示 */
          <div style={{ width: '100%', maxWidth: '520px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 16px',
              background: '#ede9fe',
              borderRadius: '8px',
              marginBottom: '14px',
              fontSize: '0.875rem',
              color: '#5b21b6',
              fontWeight: 700
            }}>
              <span>桥限两人同时过，必须带油灯</span>
              <span>四人耗时：A(1分), B(2分), C(5分), D(10分)</span>
            </div>

            {bridgeStrategy === 'optimal' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '8px 12px', background: '#ecfdf5', borderRadius: '6px', border: '1px solid #a7f3d0', fontSize: '0.8125rem' }}>
                  ① A(1分) 和 B(2分) 一起过去，耗时 <strong>2 分钟</strong>（慢者决定速度）
                </div>
                <div style={{ padding: '8px 12px', background: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}>
                  ② A(1分) 跑回送灯，耗时 <strong>1 分钟</strong>
                </div>
                <div style={{ padding: '8px 12px', background: '#fef3c7', borderRadius: '6px', border: '1px solid #fde68a', fontSize: '0.8125rem', fontWeight: 700, color: '#92400e' }}>
                  ③ 💡 核心胜负手！让最慢的 C(5分) 和 D(10分) 捆绑一起过！耗时 <strong>10 分钟</strong>（对冲慢速损耗）
                </div>
                <div style={{ padding: '8px 12px', background: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}>
                  ④ B(2分) 跑回送灯，耗时 <strong>2 分钟</strong>
                </div>
                <div style={{ padding: '8px 12px', background: '#ecfdf5', borderRadius: '6px', border: '1px solid #a7f3d0', fontSize: '0.8125rem' }}>
                  ⑤ A(1分) 和 B(2分) 再次一起过去，耗时 <strong>2 分钟</strong>
                </div>
                <div style={{ marginTop: '6px', padding: '10px', background: '#f0fdf4', borderRadius: '8px', textAlign: 'center', fontWeight: 800, color: '#166534', fontSize: '1.05rem' }}>
                  🏆 最优总时间 = 2 + 1 + 10 + 2 + 2 = <span style={{ fontSize: '1.4rem', color: '#15803d' }}>17 分钟</span>！
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '8px 12px', background: '#fee2e2', borderRadius: '6px', border: '1px solid #fecaca', fontSize: '0.8125rem' }}>
                  常人直觉：让最快的 A(1分) 当跑腿员一直来回送灯：
                </div>
                <div style={{ padding: '8px 12px', background: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}>
                  ① A 和 B 过 (2分) ➔ A 回送灯 (1分)
                </div>
                <div style={{ padding: '8px 12px', background: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}>
                  ② A 和 C 过 (5分) ➔ A 回送灯 (1分)
                </div>
                <div style={{ padding: '8px 12px', background: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}>
                  ③ A 和 D 过 (10分)
                </div>
                <div style={{ marginTop: '6px', padding: '10px', background: '#fef2f2', borderRadius: '8px', textAlign: 'center', fontWeight: 800, color: '#991b1b', fontSize: '1.05rem' }}>
                  ❌ 直觉总时间 = 2 + 1 + 5 + 1 + 10 = <span style={{ fontSize: '1.4rem', color: '#dc2626' }}>19 分钟</span>（多浪费了 2 分钟！）
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 狼羊白菜渡河演示 */
          <div style={{ width: '100%', maxWidth: '520px', textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 20px',
              background: '#eff6ff',
              borderRadius: '10px',
              border: '1px solid #bfdbfe',
              marginBottom: '16px'
            }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700 }}>左岸（起点）</span>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e3a8a' }}>{riverSteps[riverStep].left}</div>
              </div>
              <div style={{ fontSize: '1.5rem' }}>🛶 🌊 🌊</div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700 }}>右岸（终点）</span>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e3a8a' }}>{riverSteps[riverStep].right}</div>
              </div>
            </div>

            <div style={{
              padding: '14px',
              background: riverStep === 4 ? '#fef3c7' : '#ffffff',
              borderRadius: '10px',
              border: riverStep === 4 ? '2px solid #f59e0b' : '1px solid #cbd5e1'
            }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: riverStep === 4 ? '#b45309' : '#0f172a', marginBottom: '6px' }}>
                {riverSteps[riverStep].title}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                {riverSteps[riverStep].action}
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
        {/* 题目切换 */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setScenario('bridge')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: scenario === 'bridge' ? '#2563eb' : '#f1f5f9',
              color: scenario === 'bridge' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            🕯️ 四人提灯过桥 (极值博弈)
          </button>
          <button
            onClick={() => setScenario('river')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: scenario === 'river' ? '#059669' : '#f1f5f9',
              color: scenario === 'river' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            🐺 狼羊白菜渡河 (状态机)
          </button>
        </div>

        {scenario === 'bridge' ? (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setBridgeStrategy('optimal')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: bridgeStrategy === 'optimal' ? '#16a34a' : '#f8fafc',
                color: bridgeStrategy === 'optimal' ? '#fff' : '#475569',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              ⭐ 最优策略 (17分钟)
            </button>
            <button
              onClick={() => setBridgeStrategy('naive')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: bridgeStrategy === 'naive' ? '#dc2626' : '#f8fafc',
                color: bridgeStrategy === 'naive' ? '#fff' : '#475569',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              常人直觉 (19分钟)
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              disabled={riverStep === 0}
              onClick={() => setRiverStep((s) => Math.max(0, s - 1))}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                cursor: riverStep === 0 ? 'not-allowed' : 'pointer',
                fontSize: '0.8125rem'
              }}
            >
              上一步
            </button>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
              {riverStep} / {riverSteps.length - 1}
            </span>
            <button
              disabled={riverStep === riverSteps.length - 1}
              onClick={() => setRiverStep((s) => Math.min(riverSteps.length - 1, s + 1))}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#059669',
                color: '#ffffff',
                fontWeight: 700,
                cursor: riverStep === riverSteps.length - 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.8125rem'
              }}
            >
              下一步
            </button>
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
          {showFormula ? '收起秘籍' : '💡 运筹博弈思维密码'}
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
          <p style={{ margin: '0 0 6px 0', fontWeight: 800 }}>📌 运筹优化两大核心智慧：</p>
          <ol style={{ margin: 0, paddingLeft: '18px' }}>
            <li>
              <strong>提灯过桥为什么要把最慢的两个绑定？</strong>
              两个人一起过桥，耗时由较慢的人决定。如果让最慢的 10 分钟和 5 分钟分别走，就会平白产生 10 + 5 = 15 分钟的损失；如果把他们<strong>捆绑在同一趟过桥</strong>，慢速时间完全重叠，整趟只花费 10 分钟，直接白白赚取了 5 分钟！
            </li>
            <li>
              <strong>狼羊过河的“逆向回程思维”</strong>：
              大多数人以为过河只能从左往右运东西。其实当遇到矛盾僵局时，<strong>把已经渡河的羊作为筹码带回起点</strong>，实现了狼与羊、羊与菜的完全时空隔离！
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
