'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { HelpCircle, Sparkles, CheckCircle2, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface QuestionDef {
  title: string;
  targetDesc: string;
  worstCaseDesc: string;
  worstCaseItems: { color: string; name: string; count: number }[];
  finalSteps: { color: string; name: string; count: number };
  totalNeeded: number;
  formula: string;
}

export default function WorstCasePigeonholeLab() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [stepIndex, setStepIndex] = useState<number>(0); // 摸球模拟步数

  // 球池配置：红10、黄8、蓝6、绿4
  const questions: QuestionDef[] = [
    {
      title: '🎯 目标一：保证 2 个球颜色相同 (凑成一双)',
      targetDesc: '手里必须有任意一双同色球 (2红 或 2黄 或 2蓝 或 2绿)',
      worstCaseDesc: '最倒霉：每种颜色各摸 1 个，偏偏全都是单只！',
      worstCaseItems: [
        { color: '#ef4444', name: '红球', count: 1 },
        { color: '#eab308', name: '黄球', count: 1 },
        { color: '#3b82f6', name: '蓝球', count: 1 },
        { color: '#10b981', name: '绿球', count: 1 },
      ],
      finalSteps: { color: '#8b5cf6', name: '任意第5球', count: 1 },
      totalNeeded: 5,
      formula: '4 (颜色种类数) × 1 + 1 = 5 个'
    },
    {
      title: '🎨 目标二：保证有 2 种不同颜色',
      targetDesc: '手里必须至少包含 2 种不同的颜色',
      worstCaseDesc: '最倒霉：掉入单色陷阱，把数量最多的一整窝全摸光了！',
      worstCaseItems: [
        { color: '#ef4444', name: '红球 (全部摸空)', count: 10 }
      ],
      finalSteps: { color: '#06b6d4', name: '任意杂色球', count: 1 },
      totalNeeded: 11,
      formula: '10 (红球最大户) + 1 = 11 个'
    },
    {
      title: '🔴 目标三：保证摸出 5 个红球',
      targetDesc: '手里必须至少有 5 个红球',
      worstCaseDesc: '最倒霉：老天爷跟你作对，把所有的杂色球一股脑全塞给你！',
      worstCaseItems: [
        { color: '#eab308', name: '黄球 (全摸光)', count: 8 },
        { color: '#3b82f6', name: '蓝球 (全摸光)', count: 6 },
        { color: '#10b981', name: '绿球 (全摸光)', count: 4 },
      ],
      finalSteps: { color: '#ef4444', name: '必是红球', count: 5 },
      totalNeeded: 23,
      formula: '(8 + 6 + 4) (所有非红球) + 5 = 23 个'
    }
  ];

  const curQ = questions[activeTab];

  // 计算当前已摸出的球列表
  const allSteps = [...curQ.worstCaseItems, curQ.finalSteps];
  const isCompleted = stepIndex >= allSteps.length;

  let currentDrawnCount = 0;
  for (let i = 0; i < stepIndex && i < allSteps.length; i++) {
    currentDrawnCount += allSteps[i].count;
  }

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <ShieldCheck size={18} style={{ color: '#059669' }} />
          <span>最不利原则与保底摸球：运气最差假设法</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {questions.map((q, idx) => (
            <button
              key={idx}
              className={`${styles.controlBtn} ${activeTab === idx ? styles.controlBtnActive : ''}`}
              onClick={() => {
                setActiveTab(idx);
                setStepIndex(0);
              }}
            >
              问题 {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '640px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* 箱内配置卡 */}
          <div style={{
            width: '100%',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#475569',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span>📦 箱内总球数：<strong>28 个</strong></span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: '#dc2626', fontWeight: 700 }}>🔴 红: 10</span>
              <span style={{ color: '#d97706', fontWeight: 700 }}>🟡 黄: 8</span>
              <span style={{ color: '#2563eb', fontWeight: 700 }}>🔵 蓝: 6</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>🟢 绿: 4</span>
            </div>
          </div>

          {/* 当前挑战目标与最不利逻辑卡 */}
          <div style={{
            marginTop: '12px',
            width: '100%',
            background: '#ecfdf5',
            padding: '12px 14px',
            borderRadius: '8px',
            borderLeft: '4px solid #10b981',
            fontSize: '0.85rem',
            color: '#065f46',
            lineHeight: 1.6
          }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#047857', marginBottom: '2px' }}>
              {curQ.title}
            </div>
            <div>• <strong>达成要求</strong>：{curQ.targetDesc}</div>
            <div style={{ color: '#b45309' }}>• <strong>最不利假设</strong>：{curQ.worstCaseDesc}</div>
          </div>

          {/* 摸球进度大仪表盘 */}
          <div style={{
            marginTop: '14px',
            width: '100%',
            background: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>当前摸球总累计数</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: isCompleted ? '#16a34a' : '#d97706', margin: '4px 0' }}>
              {currentDrawnCount} <span style={{ fontSize: '1.1rem', color: '#94a3b8' }}>/ {curQ.totalNeeded} 个</span>
            </div>

            {/* 摸出的球轨迹展台 */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
              {allSteps.slice(0, stepIndex).map((st, i) => (
                <div
                  key={i}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: st.color,
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  +{st.count} {st.name}
                </div>
              ))}
            </div>

            {isCompleted ? (
              <div style={{
                marginTop: '12px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: '#dcfce7',
                border: '1px solid #86efac',
                color: '#15803d',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CheckCircle2 size={16} />
                <span>🎉 倒霉情况全部耗尽！再加关键一步，100% 绝对保证达成！</span>
              </div>
            ) : (
              <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '8px' }}>
                ⚠️ 倒霉阶段还在继续，随时可能依然凑不成...
              </div>
            )}
          </div>

          {/* 公式与答案卡 */}
          <div style={{
            marginTop: '14px',
            width: '100%',
            background: '#faf5ff',
            border: '1px solid #e9d5ff',
            borderRadius: '8px',
            padding: '12px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 700 }}>最不利原则保底算式：</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#7c3aed' }}>
                {curQ.formula}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#6b21a8' }}>保证必胜最少摸球数</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#6b21a8' }}>
                {curQ.totalNeeded} 个
              </div>
            </div>
          </div>

          {/* 控制按钮 */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', width: '100%' }}>
            <button
              disabled={isCompleted}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: '8px',
                background: isCompleted ? '#94a3b8' : '#059669',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: isCompleted ? 'not-allowed' : 'pointer'
              }}
              onClick={() => setStepIndex(prev => prev + 1)}
            >
              {isCompleted ? '已达到保底必胜！' : `🎲 经历下一步最倒霉摸球 (${stepIndex + 1}/${allSteps.length})`}
            </button>

            <button
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#475569',
                border: '1px solid #cbd5e1',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onClick={() => setStepIndex(0)}
            >
              <RotateCcw size={15} />
              重置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
