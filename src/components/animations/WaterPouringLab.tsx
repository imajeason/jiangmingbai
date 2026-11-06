'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, Play, CheckCircle2, ArrowRight } from 'lucide-react';

interface JugState {
  a: number; // 8L 杯
  b: number; // 5L 杯
  c: number; // 3L 杯
}

export default function WaterPouringLab() {
  const caps = { a: 8, b: 5, c: 3 };
  const [state, setState] = useState<JugState>({ a: 8, b: 0, c: 0 });
  const [selectedJug, setSelectedJug] = useState<'a' | 'b' | 'c' | null>(null);
  const [history, setHistory] = useState<JugState[]>([{ a: 8, b: 0, c: 0 }]);
  const [autoStep, setAutoStep] = useState<number>(-1);

  // 经典最优 7 步序列
  const optimalSteps: { state: JugState; desc: string }[] = [
    { state: { a: 8, b: 0, c: 0 }, desc: '初始状态：8升大瓶倒满，5升与3升为空' },
    { state: { a: 3, b: 5, c: 0 }, desc: '第 1 步：A 倒满 B（A 剩 3L，B 有 5L）' },
    { state: { a: 3, b: 2, c: 3 }, desc: '第 2 步：B 倒满 C（B 剩 2L，C 有 3L）' },
    { state: { a: 6, b: 2, c: 0 }, desc: '第 3 步：C 全部倒回 A（A 变 6L，C 清空）' },
    { state: { a: 6, b: 0, c: 2 }, desc: '第 4 步：B 的 2L 全部倒入 C（C 有 2L，B 清空）' },
    { state: { a: 1, b: 5, c: 2 }, desc: '第 5 步：A 倒满 B（A 剩 1L，B 有 5L）' },
    { state: { a: 1, b: 4, c: 3 }, desc: '第 6 步：B 倒入 C 补满（只需1L，B 惊喜出现 4L！）' },
    { state: { a: 4, b: 4, c: 0 }, desc: '第 7 步：C 全部倒回 A（A 与 B 均得 4L，大功告成！）' },
  ];

  // 自动演示定时器
  useEffect(() => {
    if (autoStep >= 0 && autoStep < optimalSteps.length - 1) {
      const timer = setTimeout(() => {
        setAutoStep((prev) => prev + 1);
        const nextState = optimalSteps[autoStep + 1].state;
        setState(nextState);
        setHistory((h) => [...h, nextState]);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [autoStep]);

  // 手动倒水逻辑
  const pour = (from: 'a' | 'b' | 'c', to: 'a' | 'b' | 'c') => {
    if (from === to) return;
    const fromVal = state[from];
    const toVal = state[to];
    const toCap = caps[to];

    if (fromVal === 0 || toVal === toCap) return; // 倒不出或装不下

    const pourAmount = Math.min(fromVal, toCap - toVal);
    const newState = {
      ...state,
      [from]: fromVal - pourAmount,
      [to]: toVal + pourAmount,
    };

    setState(newState);
    setHistory((prev) => [...prev, newState]);
    setSelectedJug(null);
  };

  const handleJugClick = (jug: 'a' | 'b' | 'c') => {
    if (selectedJug === null) {
      if (state[jug] > 0) {
        setSelectedJug(jug);
      }
    } else {
      if (selectedJug === jug) {
        setSelectedJug(null); // 取消选择
      } else {
        pour(selectedJug, jug);
      }
    }
  };

  const reset = () => {
    setAutoStep(-1);
    const initial = { a: 8, b: 0, c: 0 };
    setState(initial);
    setHistory([initial]);
    setSelectedJug(null);
  };

  const startAutoDemo = () => {
    reset();
    setAutoStep(0);
  };

  // 检查是否达成目标（A 或 B 为 4L）
  const isSuccess = state.a === 4 || state.b === 4;

  // 渲染量杯组件
  const renderFlask = (jug: 'a' | 'b' | 'c', label: string, cap: number) => {
    const current = state[jug];
    const pct = (current / cap) * 100;
    const isSel = selectedJug === jug;

    // 高度比例
    const flaskHeight = cap === 8 ? 160 : cap === 5 ? 130 : 100;

    return (
      <div
        onClick={() => handleJugClick(jug)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '12px',
          borderRadius: '16px',
          backgroundColor: isSel ? '#e0e7ff' : '#ffffff',
          border: isSel ? '2px solid #4f46e5' : '1px solid #e2e8f0',
          boxShadow: isSel ? '0 4px 12px rgba(79, 70, 229, 0.2)' : '0 2px 4px rgba(0,0,0,0.03)',
          transition: 'all 0.2s',
          minWidth: '100px',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
          {label} ({cap}L)
        </div>

        {/* 柱状量杯容器 */}
        <div
          style={{
            width: '64px',
            height: `${flaskHeight}px`,
            border: '3px solid #334155',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            backgroundColor: '#f8fafc',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          {/* 水位填充 */}
          <div
            style={{
              width: '100%',
              height: `${pct}%`,
              backgroundColor: current === 4 ? '#10b981' : '#38bdf8',
              backgroundImage:
                current === 4
                  ? 'linear-gradient(180deg, #34d399 0%, #059669 100%)'
                  : 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
              transition: 'height 0.4s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />

          {/* 刻度线 */}
          {Array.from({ length: cap - 1 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                bottom: `${((i + 1) / cap) * 100}%`,
                right: 0,
                width: '8px',
                height: '1px',
                backgroundColor: '#94a3b8',
              }}
            />
          ))}

          {/* 水量大字提示 */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 800,
              fontSize: '18px',
              color: pct > 40 ? '#ffffff' : '#1e293b',
              textShadow: pct > 40 ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
              pointerEvents: 'none',
            }}
          >
            {current}L
          </div>
        </div>

        <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 600, color: current === 4 ? '#059669' : '#64748b' }}>
          {current === 4 ? '🎉 目标 4L！' : `${current} / ${cap} 升`}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles className={styles.icon} />
          <h2 className={styles.title}>泊松分酒与量水问题逻辑实验室</h2>
        </div>
        <p className={styles.description}>
          体验数学大师泊松的启蒙难题！三个无刻度容器（8L、5L、3L），通过“满”与“空”的状态转移，精确分出 4L 酒！
        </p>
      </div>

      {/* 交互分水操作台 */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          padding: '24px 16px',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* 操作指导栏 */}
        <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
          {selectedJug === null ? (
            <span>👆 第一步：点击选择一个<b>有水的杯子</b>作为“倒水来源”</span>
          ) : (
            <span style={{ color: '#4f46e5' }}>
              🎯 已选中 <b>{selectedJug.toUpperCase()} 瓶</b>，现在点击另一个杯子倒入！
            </span>
          )}
        </div>

        {/* 三只水杯展示 */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
          {renderFlask('a', '大瓶 A', 8)}
          {renderFlask('b', '中瓶 B', 5)}
          {renderFlask('c', '小瓶 C', 3)}
        </div>

        {/* 达成提示或当前步提示 */}
        <div
          style={{
            marginTop: '20px',
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: isSuccess ? '#ecfdf5' : '#ffffff',
            border: `1px solid ${isSuccess ? '#a7f3d0' : '#e2e8f0'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isSuccess ? (
              <>
                <CheckCircle2 color="#059669" size={20} />
                <span style={{ fontWeight: 700, color: '#047857', fontSize: '14px' }}>
                  🎉 成功分出 4 升！[A={state.a}L, B={state.b}L, C={state.c}L]
                </span>
              </>
            ) : (
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                当前步数: {history.length - 1} 步 | 当前状态: [{state.a}, {state.b}, {state.c}]
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={startAutoDemo}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <Play size={14} /> 一键自动演示最优 7 步
            </button>
            <button
              onClick={reset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={14} /> 重置
            </button>
          </div>
        </div>

        {/* 自动演示当前步骤描述 */}
        {autoStep >= 0 && (
          <div
            style={{
              marginTop: '10px',
              padding: '8px 14px',
              background: '#e0e7ff',
              borderRadius: '8px',
              color: '#3730a3',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            🎬 {optimalSteps[autoStep].desc}
          </div>
        )}
      </div>

      {/* 倒水路径与数论本质卡片 */}
      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* 最优 7 步状态图 */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px', marginBottom: '8px' }}>
            🗺️ 最优 7 步状态演进图谱
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            {optimalSteps.map((step, idx) => {
              const isCurrent = state.a === step.state.a && state.b === step.state.b && state.c === step.state.c;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: isCurrent ? '#fef3c7' : '#f8fafc',
                    color: isCurrent ? '#92400e' : '#475569',
                    fontWeight: isCurrent ? 700 : 500,
                  }}
                >
                  <span style={{ width: '45px', fontWeight: 700 }}>
                    [{step.state.a},{step.state.b},{step.state.c}]
                  </span>
                  <span>{step.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 裴蜀定理数论卡片 */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px', marginBottom: '8px' }}>
            💡 倒水背后的数论本质：裴蜀定理
          </div>
          <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 6px 0' }}>
              两个容器（容积为 a 和 b）互相倾倒，所能测量出的任何水量，本质上都是形如：
            </p>
            <div style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '6px', fontWeight: 700, color: '#334155' }}>
              d = a · x + b · y
            </div>
            <p style={{ margin: '6px 0 0 0' }}>
              根据<b>裴蜀定理</b>，能够量出的体积必须是 <b>gcd(a, b)</b> 的整数倍！
              因为 gcd(5, 3) = 1，所以 1 到 8 升的任何整数都可以量出！
              7 步分酒本质就是：<b>2 × 5 - 2 × 3 = 4 升！</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
