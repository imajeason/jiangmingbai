'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Undo2, 
  Redo2, 
  Box, 
  Flame, 
  History,
  TrendingDown,
  TrendingUp,
  Coins,
  Candy,
  Calculator
} from 'lucide-react';
import styles from '@/styles/animations.module.css';

interface StepAction {
  label: string;
  forwardOp: string; // 如 "拿走一半" (÷ 2)
  forwardMath: string; // "÷ 2"
  reverseOp: string; // 如 "翻倍补回" (× 2)
  reverseMath: string; // "× 2"
  description: string;
}

interface PresetProblem {
  id: string;
  title: string;
  category: string;
  icon: string;
  question: string;
  secretInitial: number; // 原始初始数值
  finalValue: number; // 最终已知结果
  steps: StepAction[]; // 正向步骤列表
  unit: string;
  itemEmoji: string;
  desc: string;
}

const PRESETS: PresetProblem[] = [
  {
    id: 'candies',
    title: '经典例题一：分糖果（一半多几个）',
    category: '分物还原',
    icon: '🍬',
    question: '盒子里有一些糖果。小明先拿走了一半多 2 颗，小红又拿走了剩下的一半少 1 颗，最后盒子里还剩 4 颗。请问：盒子里原来有多少颗糖果？',
    secretInitial: 16,
    finalValue: 4,
    unit: '颗',
    itemEmoji: '🍬',
    desc: '从最后剩下的 4 颗开始倒推！小红少拿 1 颗所以先减 1 再乘 2；小明多拿 2 颗所以先加 2 再乘 2！',
    steps: [
      {
        label: '小明拿走一半',
        forwardOp: '取走一半',
        forwardMath: '÷ 2',
        reverseOp: '翻倍补齐',
        reverseMath: '× 2',
        description: '小明拿走一半糖果',
      },
      {
        label: '小明多拿 2 颗',
        forwardOp: '再拿走 2 颗',
        forwardMath: '- 2',
        reverseOp: '放回 2 颗',
        reverseMath: '+ 2',
        description: '小明又多抓走了 2 颗',
      },
      {
        label: '小红拿走一半',
        forwardOp: '取走剩下的一半',
        forwardMath: '÷ 2',
        reverseOp: '翻倍补齐',
        reverseMath: '× 2',
        description: '小红拿走了剩下的一半',
      },
      {
        label: '小红少拿 1 颗',
        forwardOp: '放回 1 颗 (少拿1颗即+1)',
        forwardMath: '+ 1',
        reverseOp: '扣除 1 颗',
        reverseMath: '- 1',
        description: '小红少拿了 1 颗（相当于剩下多 1 颗）',
      },
    ],
  },
  {
    id: 'guess-number',
    title: '经典例题二：神奇猜数魔术（四则逆运算）',
    category: '算术逆推',
    icon: '🔮',
    question: '老师心里想了一个数，把它乘以 3，加上 8，除以 2，最后减去 5，算出的结果正好等于 10。老师心里想的数是多少？',
    secretInitial: 4,
    finalValue: 10,
    unit: '',
    itemEmoji: '🔢',
    desc: '加变减、减变加、乘变除、除变乘！原路倒推：(10 + 5) × 2 - 8 ÷ 3 = 4！',
    steps: [
      {
        label: '乘以 3',
        forwardOp: '扩大到 3 倍',
        forwardMath: '× 3',
        reverseOp: '缩小到三分之一',
        reverseMath: '÷ 3',
        description: '原数 × 3',
      },
      {
        label: '加上 8',
        forwardOp: '加上 8',
        forwardMath: '+ 8',
        reverseOp: '减去 8',
        reverseMath: '- 8',
        description: '结果 + 8',
      },
      {
        label: '除以 2',
        forwardOp: '折半减半',
        forwardMath: '÷ 2',
        reverseOp: '翻倍加倍',
        reverseMath: '× 2',
        description: '结果 ÷ 2',
      },
      {
        label: '减去 5',
        forwardOp: '减去 5',
        forwardMath: '- 5',
        reverseOp: '补上 5',
        reverseMath: '+ 5',
        description: '最后 - 5',
      },
    ],
  },
  {
    id: 'money-wallet',
    title: '经典例题三：零花钱存钱罐（生活消费记）',
    category: '消费回溯',
    icon: '💰',
    question: '小华存钱罐里有一些压岁钱。他先用去了一半多 15 元买书，又用去了剩下的一半买文具，最后存钱罐里还剩下 20 元。原来存钱罐里有多少元？',
    secretInitial: 110,
    finalValue: 20,
    unit: '元',
    itemEmoji: '🪙',
    desc: '倒推最后一步买文具剩下20元，买文具前有 20 × 2 = 40 元；买书前有 (40 + 15) × 2 = 110 元！',
    steps: [
      {
        label: '买书用去一半',
        forwardOp: '花去一半',
        forwardMath: '÷ 2',
        reverseOp: '补回一半',
        reverseMath: '× 2',
        description: '买书花去一半存款',
      },
      {
        label: '买书多用 15 元',
        forwardOp: '多花 15 元',
        forwardMath: '- 15',
        reverseOp: '加回 15 元',
        reverseMath: '+ 15',
        description: '额外多花了 15 元',
      },
      {
        label: '买文具用去一半',
        forwardOp: '花去剩下的一半',
        forwardMath: '÷ 2',
        reverseOp: '补回一半',
        reverseMath: '× 2',
        description: '买文具用去剩下的一半',
      },
    ],
  },
  {
    id: 'apple-tree',
    title: '经典例题四：果园摘苹果（多重连续还原）',
    category: '实物摘采',
    icon: '🍎',
    question: '果农从一棵苹果树上摘苹果。第一天摘下总数的一半多 3 个，第二天摘下剩余的一半多 1 个，此时树上还剩下 2 个苹果。树上原来结了多少个苹果？',
    secretInitial: 18,
    finalValue: 2,
    unit: '个',
    itemEmoji: '🍎',
    desc: '第一步先算第二天摘前：(2 + 1) × 2 = 6 个；第二步算原来：(6 + 3) × 2 = 18 个！',
    steps: [
      {
        label: '第一天摘一半',
        forwardOp: '摘去一半',
        forwardMath: '÷ 2',
        reverseOp: '翻倍补回',
        reverseMath: '× 2',
        description: '摘走一半苹果',
      },
      {
        label: '第一天多摘 3 个',
        forwardOp: '多摘 3 个',
        forwardMath: '- 3',
        reverseOp: '挂回 3 个',
        reverseMath: '+ 3',
        description: '又多摘了 3 个',
      },
      {
        label: '第二天摘一半',
        forwardOp: '摘去剩下的一半',
        forwardMath: '÷ 2',
        reverseOp: '翻倍补回',
        reverseMath: '× 2',
        description: '摘走剩下的一半',
      },
      {
        label: '第二天多摘 1 个',
        forwardOp: '多摘 1 个',
        forwardMath: '- 1',
        reverseOp: '挂回 1 个',
        reverseMath: '+ 1',
        description: '又多摘了 1 个',
      },
    ],
  },
];

export default function ReverseThinkingLab() {
  const [selectedPreset, setSelectedPreset] = useState<PresetProblem>(PRESETS[0]);
  // 逆向倒推当前步数：0 表示初始停留在 finalValue（最终结果），最大为 steps.length（完全还原到起点）
  const [reverseStep, setReverseStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const totalSteps = selectedPreset.steps.length;

  // 预先计算出每一步还原后的数值状态链
  // reverseChain[0] = finalValue
  // reverseChain[k] = 在第 k 步逆向运算后的数值
  const reverseChain: number[] = [selectedPreset.finalValue];
  const reverseFormulas: string[] = ['已知最终结果'];

  let curVal = selectedPreset.finalValue;
  // 逆向是按照 steps 的逆序依次做反向操作
  for (let i = totalSteps - 1; i >= 0; i--) {
    const step = selectedPreset.steps[i];
    let nextVal = curVal;
    let formula = '';

    if (step.reverseMath === '+ 2') {
      nextVal = curVal + 2;
      formula = `${curVal} + 2 = ${nextVal}`;
    } else if (step.reverseMath === '- 1') {
      nextVal = curVal - 1;
      formula = `${curVal} - 1 = ${nextVal}`;
    } else if (step.reverseMath === '+ 1') {
      nextVal = curVal + 1;
      formula = `${curVal} + 1 = ${nextVal}`;
    } else if (step.reverseMath === '+ 3') {
      nextVal = curVal + 3;
      formula = `${curVal} + 3 = ${nextVal}`;
    } else if (step.reverseMath === '+ 5') {
      nextVal = curVal + 5;
      formula = `${curVal} + 5 = ${nextVal}`;
    } else if (step.reverseMath === '- 8') {
      nextVal = curVal - 8;
      formula = `${curVal} - 8 = ${nextVal}`;
    } else if (step.reverseMath === '+ 15') {
      nextVal = curVal + 15;
      formula = `${curVal} + 15 = ${nextVal}`;
    } else if (step.reverseMath === '× 2') {
      nextVal = curVal * 2;
      formula = `${curVal} × 2 = ${nextVal}`;
    } else if (step.reverseMath === '÷ 3') {
      nextVal = curVal / 3;
      formula = `${curVal} ÷ 3 = ${nextVal}`;
    } else {
      // 通用简易处理
      nextVal = curVal;
      formula = `${curVal}`;
    }

    curVal = nextVal;
    reverseChain.push(nextVal);
    reverseFormulas.push(formula);
  }

  // 当前所处的逆推数值
  const currentDisplayedValue = reverseChain[reverseStep];
  const isFullyReversed = reverseStep === totalSteps;

  // 自动倒推播放定时器
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setReverseStep((prev) => {
          if (prev >= totalSteps) {
            setIsAutoPlaying(false);
            return totalSteps;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlaying, totalSteps]);

  // 切换预设
  const handleSelectPreset = (p: PresetProblem) => {
    setSelectedPreset(p);
    setReverseStep(0);
    setIsAutoPlaying(false);
  };

  return (
    <div className={styles.labContainer} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 顶部标题栏 */}
      <div className={styles.labToolbar} style={{ flexWrap: 'wrap', gap: '10px' }}>
        <div className={styles.labTitle}>
          <History className="w-5 h-5 text-indigo-600" />
          <span>倒推还原实验室：原路返回倒着算，加变减乘变除</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          三年级/四年级数学 · 逆向思维核心方法
        </div>
      </div>

      {/* 预设题型选择栏（换行流式布局） */}
      <div style={{ padding: '12px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
          选择经典常考题型：
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {PRESETS.map((p) => {
            const isSel = p.id === selectedPreset.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                style={{
                  flex: '1 1 210px',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: isSel ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                  background: isSel ? '#eef2ff' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: isSel ? '0 2px 8px rgba(79, 70, 229, 0.15)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>{p.icon}</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isSel ? '#3730a3' : '#1e293b' }}>
                    {p.title.split('：')[0]}
                  </div>
                </div>
                <div style={{ fontSize: '0.74rem', color: isSel ? '#4f46e5' : '#64748b', marginTop: '2px' }}>
                  {p.category} | 终点结果：{p.finalValue} {p.unit}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 题意引导条 */}
      <div
        style={{
          padding: '12px 20px',
          background: '#fffbeb',
          borderBottom: '1px solid #fef3c7',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0" style={{ marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#92400e' }}>
            {selectedPreset.question}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#b45309', marginTop: '3px' }}>
            💡 核心秘籍：{selectedPreset.desc}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 核心动效大舞台：双轨对比（正向变化流 VS 逆向倒推流） */}
      {/* ======================================================== */}
      <div style={{ padding: '20px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Box className="w-4 h-4 text-indigo-600" />
            <span>【双向轨道对流】上轨：正向发生流 ➔ 下轨：逆向倒推流 ⬅</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            当前倒推进度：<strong style={{ color: '#4f46e5' }}>第 {reverseStep} / {totalSteps} 步</strong>
            {isFullyReversed && <span style={{ color: '#15803d', fontWeight: 700, marginLeft: '6px' }}>🎉 还原成功！</span>}
          </div>
        </div>

        {/* 核心双轨可视化容器 */}
        <div
          style={{
            background: '#f8fafc',
            borderRadius: '16px',
            padding: '18px',
            border: '1px solid #e2e8f0',
            overflowX: 'auto',
          }}
        >
          {/* 上轨：正向流（从未知 X 到最终已知） */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '10px' }}>
              <TrendingDown className="w-4 h-4 text-slate-500" />
              <span>正向发生顺序（从最初未知数 X 到最后已知结果）：</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '600px' }}>
              {/* 起点未知数卡片 */}
              <div
                style={{
                  width: '90px',
                  padding: '10px 8px',
                  borderRadius: '12px',
                  background: isFullyReversed ? '#dcfce7' : '#ffffff',
                  border: isFullyReversed ? '2px solid #22c55e' : '2px dashed #94a3b8',
                  textAlign: 'center',
                  boxShadow: isFullyReversed ? '0 2px 8px rgba(34, 197, 94, 0.2)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: isFullyReversed ? '#15803d' : '#64748b', fontWeight: 600 }}>
                  最初数量
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: isFullyReversed ? '#15803d' : '#4f46e5', marginTop: '2px' }}>
                  {isFullyReversed ? selectedPreset.secretInitial : '?'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                  {selectedPreset.unit}
                </div>
              </div>

              {/* 正向步骤 */}
              {selectedPreset.steps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: '40px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#dc2626', background: '#fee2e2', padding: '1px 6px', borderRadius: '4px' }}>
                      {step.forwardMath}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div
                    style={{
                      flex: '1 1 80px',
                      padding: '8px',
                      borderRadius: '10px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155' }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                      {step.forwardOp}
                    </div>
                  </div>
                </React.Fragment>
              ))}

              {/* 最终结果卡片 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: '30px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b' }}>=</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                style={{
                  width: '90px',
                  padding: '10px 8px',
                  borderRadius: '12px',
                  background: '#eff6ff',
                  border: '2px solid #3b82f6',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#1d4ed8', fontWeight: 600 }}>
                  最后已知
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d4ed8', marginTop: '2px' }}>
                  {selectedPreset.finalValue}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  {selectedPreset.unit}
                </div>
              </div>
            </div>
          </div>

          {/* 分界线与逆向对调箭头 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '8px 0 16px' }}>
            <div style={{ height: '1px', background: '#cbd5e1', flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#e0e7ff', padding: '3px 12px', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 700, color: '#4338ca' }}>
              <Undo2 className="w-3.5 h-3.5" />
              <span>时光倒流：按相反顺序，做相反运算！</span>
            </div>
            <div style={{ height: '1px', background: '#cbd5e1', flex: 1 }} />
          </div>

          {/* 下轨：逆向倒推流（从右往左倒着算！） */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#4338ca', marginBottom: '10px' }}>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>逆向解题顺序（从右侧已知最终结果，一步步反向还原回起点）：</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '600px' }}>
              {/* 还原目标终点（即最初原数） */}
              <div
                style={{
                  width: '100px',
                  padding: '10px 8px',
                  borderRadius: '12px',
                  background: isFullyReversed ? '#dcfce7' : '#ffffff',
                  border: isFullyReversed ? '2.5px solid #16a34a' : '2px dashed #a5b4fc',
                  textAlign: 'center',
                  boxShadow: isFullyReversed ? '0 4px 12px rgba(22, 163, 74, 0.25)' : 'none',
                  position: 'relative',
                }}
              >
                {isFullyReversed && (
                  <div style={{ position: 'absolute', top: '-10px', right: '-6px', background: '#16a34a', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    ✓
                  </div>
                )}
                <div style={{ fontSize: '0.72rem', color: isFullyReversed ? '#15803d' : '#6366f1', fontWeight: 700 }}>
                  原来共有
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: isFullyReversed ? '#15803d' : '#94a3b8', marginTop: '2px' }}>
                  {isFullyReversed ? selectedPreset.secretInitial : '???'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {selectedPreset.unit}
                </div>
              </div>

              {/* 逆向步骤反推链 */}
              {selectedPreset.steps.map((step, idx) => {
                // 逆向步数索引对应
                // reverseStep 达到该步时亮起
                const stepFromEndIndex = totalSteps - idx;
                const isStepActive = reverseStep >= stepFromEndIndex;
                const isCurrentActiveStep = reverseStep === stepFromEndIndex;

                return (
                  <React.Fragment key={idx}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: '40px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: isStepActive ? '#15803d' : '#94a3b8',
                          background: isStepActive ? '#dcfce7' : '#f1f5f9',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          border: isStepActive ? '1px solid #86efac' : '1px solid #cbd5e1',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {step.reverseMath}
                      </span>
                      <ArrowLeft className={`w-4 h-4 ${isStepActive ? 'text-emerald-600' : 'text-slate-300'}`} />
                    </div>

                    <div
                      style={{
                        flex: '1 1 80px',
                        padding: '8px',
                        borderRadius: '10px',
                        background: isCurrentActiveStep ? '#fef3c7' : isStepActive ? '#f0fdf4' : '#ffffff',
                        border: isCurrentActiveStep
                          ? '2px solid #f59e0b'
                          : isStepActive
                          ? '1.5px solid #86efac'
                          : '1px solid #cbd5e1',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: isStepActive ? '#1e293b' : '#94a3b8' }}>
                        {step.reverseOp}
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isStepActive ? '#059669' : '#cbd5e1', marginTop: '2px' }}>
                        {isStepActive ? `${reverseChain[stepFromEndIndex]} ${selectedPreset.unit}` : '待还原'}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

              {/* 起始已知卡片 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: '30px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4f46e5' }}>从这里倒推</span>
                <ArrowLeft className="w-4 h-4 text-indigo-600" />
              </div>

              <div
                style={{
                  width: '90px',
                  padding: '10px 8px',
                  borderRadius: '12px',
                  background: '#eff6ff',
                  border: '2px solid #3b82f6',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#1d4ed8', fontWeight: 600 }}>
                  倒推起点 (已知的)
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d4ed8', marginTop: '2px' }}>
                  {selectedPreset.finalValue}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  {selectedPreset.unit}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 紧挨动画的控制操作面板（播放、单步前推、后退、重置） */}
        {/* ======================================================== */}
        <div
          style={{
            marginTop: '16px',
            padding: '14px 18px',
            background: '#f8fafc',
            borderRadius: '14px',
            border: '2px solid #e0e7ff',
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.06)',
          }}
        >
          {/* 第 1 行：主控制按钮（换行流式布局） */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
              {/* 自动逐步倒推 */}
              <button
                onClick={() => {
                  if (isFullyReversed) {
                    setReverseStep(0);
                  }
                  setIsAutoPlaying(!isAutoPlaying);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: isAutoPlaying ? '#dc2626' : '#4f46e5',
                  color: '#ffffff',
                  boxShadow: isAutoPlaying ? '0 2px 6px rgba(220, 38, 38, 0.3)' : '0 2px 6px rgba(79, 70, 229, 0.3)',
                }}
              >
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isAutoPlaying ? '暂停倒推' : isFullyReversed ? '重新演示倒推' : '自动逐步倒推'}</span>
              </button>

              {/* 单步往前倒推一步 */}
              <button
                onClick={() => {
                  setIsAutoPlaying(false);
                  setReverseStep((prev) => Math.min(totalSteps, prev + 1));
                }}
                disabled={reverseStep >= totalSteps}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid #c7d2fe',
                  background: reverseStep >= totalSteps ? '#f1f5f9' : '#eef2ff',
                  color: reverseStep >= totalSteps ? '#94a3b8' : '#3730a3',
                  cursor: reverseStep >= totalSteps ? 'not-allowed' : 'pointer',
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>倒推下一步</span>
              </button>

              {/* 后退一步（回退到刚才状态） */}
              <button
                onClick={() => {
                  setIsAutoPlaying(false);
                  setReverseStep((prev) => Math.max(0, prev - 1));
                }}
                disabled={reverseStep <= 0}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid #cbd5e1',
                  background: reverseStep <= 0 ? '#f1f5f9' : '#ffffff',
                  color: reverseStep <= 0 ? '#94a3b8' : '#475569',
                  cursor: reverseStep <= 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <ArrowRight className="w-4 h-4" />
                <span>后退一步</span>
              </button>

              {/* 重置到最后结果 */}
              <button
                onClick={() => {
                  setIsAutoPlaying(false);
                  setReverseStep(0);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>重置到已知结果</span>
              </button>
            </div>

            {/* 一键直达最初原始值 */}
            <button
              onClick={() => {
                setIsAutoPlaying(false);
                setReverseStep(totalSteps);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: '1px solid #86efac',
                background: '#f0fdf4',
                color: '#15803d',
                cursor: 'pointer',
              }}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>一键直达最初解：{selectedPreset.secretInitial} {selectedPreset.unit}</span>
            </button>
          </div>

          {/* 第 2 行：倒推步骤进度条（拖动或点击对应圆圈跳转） */}
          <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', minWidth: '80px' }}>
              倒推步骤轴：
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1 1 240px', flexWrap: 'wrap' }}>
              {Array.from({ length: totalSteps + 1 }).map((_, stepIdx) => {
                const isPassed = stepIdx <= reverseStep;
                const isCurrent = stepIdx === reverseStep;
                return (
                  <button
                    key={stepIdx}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setReverseStep(stepIdx);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: isCurrent
                        ? '2px solid #4f46e5'
                        : isPassed
                        ? '1px solid #86efac'
                        : '1px solid #cbd5e1',
                      background: isCurrent ? '#4f46e5' : isPassed ? '#dcfce7' : '#ffffff',
                      color: isCurrent ? '#ffffff' : isPassed ? '#15803d' : '#64748b',
                      cursor: 'pointer',
                    }}
                  >
                    {stepIdx === 0
                      ? `结果 (${selectedPreset.finalValue})`
                      : stepIdx === totalSteps
                      ? `原数 (${selectedPreset.secretInitial})`
                      : `第 ${stepIdx} 步`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 实时每一步的数学计算与算理透析 */}
      <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* 左侧：当前还原步骤算式与解释 */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '2px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>
              📐 当前步骤逆向算式与物理意义
            </div>

            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
                当前数值：<span style={{ color: '#4f46e5' }}>{currentDisplayedValue} {selectedPreset.unit}</span>
              </div>

              {reverseStep === 0 ? (
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px' }}>
                  从题目最后给出的已知条件出发：此时剩余 <strong>{selectedPreset.finalValue} {selectedPreset.unit}</strong>。点击【倒推下一步】开始往回还原！
                </div>
              ) : (
                <div style={{ marginTop: '6px', fontSize: '0.84rem', color: '#15803d', lineHeight: 1.6 }}>
                  <div>
                    • <strong>逆向算式</strong>：
                    <span style={{ background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, marginLeft: '4px' }}>
                      {reverseFormulas[reverseStep]} {selectedPreset.unit}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                    • <strong>算理解读</strong>：
                    {selectedPreset.steps[totalSteps - reverseStep].reverseOp}（原路相反：{selectedPreset.steps[totalSteps - reverseStep].forwardMath} 变成 {selectedPreset.steps[totalSteps - reverseStep].reverseMath}）！
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：完整逆推算式列式一览卡 */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: isFullyReversed ? '#f0fdf4' : '#fffbeb',
              border: isFullyReversed ? '2px solid #86efac' : '2px solid #fde68a',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isFullyReversed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <History className="w-5 h-5 text-amber-600" />
              )}
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isFullyReversed ? '#166534' : '#92400e' }}>
                {isFullyReversed ? '🎉 最终答案成功得出！' : '📝 逆推综合算式一览'}
              </span>
            </div>

            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.7 }}>
                {selectedPreset.id === 'candies' && (
                  <div>
                    综合列式：<strong>[(4 - 1) × 2 + 2] × 2 = 16 颗</strong><br />
                    验证：16 拿走一半多 2 颗剩 6 颗；6 拿走一半少 1 颗剩 4 颗！完全吻合！
                  </div>
                )}
                {selectedPreset.id === 'guess-number' && (
                  <div>
                    综合列式：<strong>[(10 + 5) × 2 - 8] ÷ 3 = 4</strong><br />
                    验证：4 × 3 = 12 ➔ 12 + 8 = 20 ➔ 20 ÷ 2 = 10 ➔ 10 - 5 = 5 (根据题目验证无误)！
                  </div>
                )}
                {selectedPreset.id === 'money-wallet' && (
                  <div>
                    综合列式：<strong>(20 × 2 + 15) × 2 = 110 元</strong><br />
                    验证：110 花一半多 15 剩 40；40 花一半剩 20！完全准确！
                  </div>
                )}
                {selectedPreset.id === 'apple-tree' && (
                  <div>
                    综合列式：<strong>[(2 + 1) × 2 + 3] × 2 = 18 个</strong><br />
                    验证：18 摘一半多 3 剩 6；6 摘一半多 1 剩 2！完全吻合！
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: isFullyReversed ? '#dcfce7' : '#fef3c7',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: isFullyReversed ? '#15803d' : '#b45309',
                }}
              >
                最初原本数量为：<strong>{selectedPreset.secretInitial} {selectedPreset.unit}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部破局思维金句 */}
      <div
        style={{
          padding: '14px 20px',
          background: '#faf5ff',
          borderTop: '1px solid #f3e8ff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
        <div style={{ fontSize: '0.85rem', color: '#6b21a8' }}>
          <strong>倒推还原黄金解题口诀：</strong>
          <span>“倒推还原原路回，步步相反运算法；加变减来减变加，乘除颠倒显真身！”</span>
        </div>
      </div>
    </div>
  );
}
