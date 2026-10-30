'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type LabMode = 'elimination' | 'substitution';

interface FruitProblem {
  name: string;
  itemA: { icon: string; name: string; price: number };
  itemB: { icon: string; name: string; price: number };
  plan1: { countA: number; countB: number };
  plan2: { countA: number; countB: number };
}

const PROBLEMS: FruitProblem[] = [
  {
    name: '西瓜与葡萄 (买水果常考题)',
    itemA: { icon: '🍉', name: '西瓜', price: 14 },
    itemB: { icon: '🍇', name: '葡萄', price: 6 },
    plan1: { countA: 3, countB: 2 }, // 3*14 + 2*6 = 54
    plan2: { countA: 1, countB: 2 }, // 1*14 + 2*6 = 26
  },
  {
    name: '文具店：钢笔与笔记本',
    itemA: { icon: '🖋️', name: '钢笔', price: 12 },
    itemB: { icon: '📒', name: '笔记本', price: 5 },
    plan1: { countA: 2, countB: 3 }, // 2*12 + 3*5 = 39
    plan2: { countA: 2, countB: 1 }, // 2*12 + 1*5 = 29
  },
  {
    name: '苹果与梨子 (经典入门)',
    itemA: { icon: '🍎', name: '苹果', price: 4 },
    itemB: { icon: '🍐', name: '梨子', price: 3 },
    plan1: { countA: 4, countB: 2 }, // 4*4 + 2*3 = 22
    plan2: { countA: 1, countB: 2 }, // 1*4 + 2*3 = 10
  },
];

export default function SubstitutionEliminationLab() {
  const [mode, setMode] = useState<LabMode>('elimination');
  const [problemIndex, setProblemIndex] = useState<number>(0);

  // 模式1：消元步骤进度 (0: 初始展示, 1: 对齐抵消, 2: 算得单价A, 3: 回代算得单价B)
  const [step, setStep] = useState<number>(1);

  // 模式2：等量代换状态 (0: 初始天平, 1: 代换展开)
  const [subStep, setSubStep] = useState<number>(0);

  const prob = PROBLEMS[problemIndex];
  const total1 = prob.plan1.countA * prob.itemA.price + prob.plan1.countB * prob.itemB.price;
  const total2 = prob.plan2.countA * prob.itemA.price + prob.plan2.countB * prob.itemB.price;

  // 差额
  const diffA = Math.abs(prob.plan1.countA - prob.plan2.countA);
  const diffB = Math.abs(prob.plan1.countB - prob.plan2.countB);
  const diffMoney = Math.abs(total1 - total2);

  // 哪个被消掉了？
  const isEliminateB = prob.plan1.countB === prob.plan2.countB;

  return (
    <div className={styles.container} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 头部标题 */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', color: '#1e293b' }}>
          ⚖️ 消元法与等量代换：天平上的数学超市
        </h3>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>
          两个未知数不用猜！看懂“上下做减法消去相同量”与“等量替换统一兵种”，从算术直通代数！
        </p>
      </div>

      {/* 可视化动画主舞台 */}
      <div
        style={{
          width: '100%',
          minHeight: '380px',
          background: 'radial-gradient(circle at 50% 50%, #f8fafc 0%, #edf2f7 100%)',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          padding: '24px 18px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        {mode === 'elimination' ? (
          /* ================= 模式 1：加减消元法（水果购物篮） ================= */
          <div style={{ width: '100%', maxWidth: '780px' }}>
            {/* 上购物篮（方案1） */}
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #3b82f6',
                borderRadius: '14px',
                padding: '16px 20px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1d4ed8' }}>
                  🛒 购物篮 ①：
                </span>
                {/* 物品A */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {Array.from({ length: prob.plan1.countA }).map((_, i) => (
                    <span key={`a-${i}`} style={{ fontSize: '26px' }}>
                      {prob.itemA.icon}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: '18px', color: '#94a3b8' }}>+</span>
                {/* 物品B (消元时变透明划线) */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {Array.from({ length: prob.plan1.countB }).map((_, i) => (
                    <span
                      key={`b-${i}`}
                      style={{
                        fontSize: '26px',
                        opacity: step >= 1 && isEliminateB ? 0.25 : 1,
                        textDecoration: step >= 1 && isEliminateB ? 'line-through' : 'none',
                        transition: 'all 0.4s ease',
                      }}
                    >
                      {prob.itemB.icon}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e3a8a' }}>
                共 {total1} 元
              </div>
            </div>

            {/* 减法抵消箭头标示 */}
            {step >= 1 && (
              <div style={{ textAlign: 'center', margin: '-4px 0 10px 0' }}>
                <span
                  style={{
                    background: '#fee2e2',
                    color: '#b91c1c',
                    border: '1px solid #f87171',
                    padding: '3px 14px',
                    borderRadius: '20px',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                  }}
                >
                  ✂️ 两篮相减：相同数量的 {isEliminateB ? prob.itemB.name : prob.itemA.name} 相互抵消！
                </span>
              </div>
            )}

            {/* 下购物篮（方案2） */}
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #10b981',
                borderRadius: '14px',
                padding: '16px 20px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#047857' }}>
                  🛒 购物篮 ②：
                </span>
                {/* 物品A */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {Array.from({ length: prob.plan2.countA }).map((_, i) => (
                    <span key={`a2-${i}`} style={{ fontSize: '26px' }}>
                      {prob.itemA.icon}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: '18px', color: '#94a3b8' }}>+</span>
                {/* 物品B (消元时变透明划线) */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {Array.from({ length: prob.plan2.countB }).map((_, i) => (
                    <span
                      key={`b2-${i}`}
                      style={{
                        fontSize: '26px',
                        opacity: step >= 1 && isEliminateB ? 0.25 : 1,
                        textDecoration: step >= 1 && isEliminateB ? 'line-through' : 'none',
                        transition: 'all 0.4s ease',
                      }}
                    >
                      {prob.itemB.icon}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#065f46' }}>
                共 {total2} 元
              </div>
            </div>

            {/* 消元推导结果展台 */}
            <div
              style={{
                background: '#f8fafc',
                border: '2px dashed #94a3b8',
                borderRadius: '14px',
                padding: '16px 20px',
                textAlign: 'center',
              }}
            >
              {step === 0 && (
                <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  观察两组购物清单，看看哪个物品的数量完全相同？点击下方“一键抵消消元”！
                </div>
              )}

              {step >= 1 && (
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                    差额全由多出来的【{diffA} 个 {prob.itemA.name}】造成：
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#2563eb', marginBottom: '6px' }}>
                    {diffA} 个 {prob.itemA.name} = {total1} - {total2} = {diffMoney} 元
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16a34a' }}>
                    ➔ 1 个 {prob.itemA.name} = {diffMoney} ÷ {diffA} ={' '}
                    <span style={{ fontSize: '1.3rem', textDecoration: 'underline' }}>
                      {prob.itemA.price} 元
                    </span>
                  </div>

                  {step >= 2 && (
                    <div
                      style={{
                        marginTop: '10px',
                        paddingTop: '10px',
                        borderTop: '1px solid #cbd5e1',
                        fontSize: '0.95rem',
                        color: '#b45309',
                        fontWeight: 700,
                      }}
                    >
                      💡 回代计算：代入购物篮②，1个{prob.itemA.name}({prob.itemA.price}元) + {prob.plan2.countB}个{prob.itemB.name} = {total2}元
                      <br />
                      ➔ 1 个 {prob.itemB.name} = ({total2} - {prob.itemA.price}) ÷ {prob.plan2.countB} ={' '}
                      <span style={{ fontSize: '1.25rem', color: '#d97706', textDecoration: 'underline' }}>
                        {prob.itemB.price} 元
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================= 模式 2：等量代换（小动物跷跷板） ================= */
          <div style={{ width: '100%', maxWidth: '720px', textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>
              🐻 森林动物天平秤重：大置换魔法
            </div>

            {/* 两个等量关系展示卡片 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  background: '#ffffff',
                  border: '2px solid #3b82f6',
                  borderRadius: '12px',
                  padding: '14px',
                }}
              >
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>已知条件 ①</div>
                <div style={{ fontSize: '28px', margin: '6px 0' }}>1 🐷 = 2 🐑</div>
                <div style={{ fontSize: '0.85rem', color: '#1d4ed8' }}>1 头小猪的重量 ＝ 2 只小羊</div>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '2px solid #10b981',
                  borderRadius: '12px',
                  padding: '14px',
                }}
              >
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>已知条件 ②</div>
                <div style={{ fontSize: '28px', margin: '6px 0' }}>1 🐑 = 3 🐰</div>
                <div style={{ fontSize: '0.85rem', color: '#047857' }}>1 只小羊的重量 ＝ 3 只小兔</div>
              </div>
            </div>

            {/* 提问与代换动画 */}
            <div
              style={{
                background: '#ffffff',
                border: '2px dashed #6366f1',
                borderRadius: '14px',
                padding: '20px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.08)',
              }}
            >
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#4338ca', marginBottom: '12px' }}>
                问题：1 头小猪 🐷 相当于多少只小兔 🐰 的重量？
              </div>

              {subStep === 0 ? (
                <div>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                    1 🐷 ＝ 🐑 ＋ 🐑
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
                    点击下方“一键等量代换”，把每只小羊替换成 3 只小兔！
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '32px', marginBottom: '10px', color: '#15803d' }}>
                    1 🐷 ＝ (🐰🐰🐰) ＋ (🐰🐰🐰) ＝ 6 只 🐰！
                  </div>
                  <div style={{ fontSize: '0.92rem', color: '#15803d', fontWeight: 700 }}>
                    代入法真谛：把‘小羊’用‘3只小兔’代换进去，算式瞬间统一成单一种类（2 × 3 = 6）！
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 紧贴画布的控制区 (严格遵循黄金近邻与弹性换行原则) */}
      <div
        style={{
          marginTop: '16px',
          background: '#ffffff',
          borderRadius: '14px',
          padding: '16px 18px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        {/* 第一行：方法模式切换 */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingBottom: '14px',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#334155' }}>
              ⚖️ 解题心法：
            </span>
            <button
              onClick={() => setMode('elimination')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: mode === 'elimination' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: mode === 'elimination' ? '#eff6ff' : '#ffffff',
                color: mode === 'elimination' ? '#1d4ed8' : '#475569',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              🛒 加减消元法 (对比购物篮消去相同项)
            </button>
            <button
              onClick={() => setMode('substitution')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: mode === 'substitution' ? '2px solid #10b981' : '1px solid #cbd5e1',
                background: mode === 'substitution' ? '#f0fdf4' : '#ffffff',
                color: mode === 'substitution' ? '#047857' : '#475569',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              🔄 代入代换法 (以物换物统一兵种)
            </button>
          </div>
        </div>

        {/* 第二行：分步控制与题型切换 */}
        {mode === 'elimination' ? (
          <div
            style={{
              marginTop: '14px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            {/* 典型考题切换 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>题型切换:</span>
              {PROBLEMS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setProblemIndex(idx);
                    setStep(1);
                  }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: problemIndex === idx ? '1px solid #2563eb' : '1px solid #cbd5e1',
                    background: problemIndex === idx ? '#eff6ff' : '#ffffff',
                    color: problemIndex === idx ? '#1d4ed8' : '#475569',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* 步骤演进按钮组 */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setStep(step === 2 ? 1 : 2)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid #2563eb',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {step >= 2 ? '🔄 重新抵消' : '✨ 第二步：回代算第二件物品'}
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              marginTop: '14px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <button
              onClick={() => setSubStep(subStep === 0 ? 1 : 0)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #10b981',
                background: '#10b981',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {subStep === 0 ? '🔄 一键等量代换 (小羊变小兔)' : '⏪ 还原为小羊'}
            </button>
          </div>
        )}
      </div>

      {/* 算理与考场避坑对照卡片 */}
      <div
        style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.98rem', marginBottom: '6px' }}>
            🛒 加减消元：抓差额
          </div>
          <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6 }}>
            当两种物品数量不同时，寻找<strong>数量相同的那个物品</strong>。两组条件上下做减法，相同的物品瞬间对消为零，剩下的总钱数差额全部由多出来的另一个物品承担！
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontWeight: 700, color: '#059669', fontSize: '0.98rem', marginBottom: '6px' }}>
            🔄 代入代换：统一番号
          </div>
          <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6 }}>
            题目中出现“1个A等于几个B”时，坚决执行<strong>以物换物</strong>。把整个题目中所有A全部用B换掉，多兵种混战立刻变成单兵种独白，直接用除法秒杀！
          </div>
        </div>
      </div>
    </div>
  );
}

