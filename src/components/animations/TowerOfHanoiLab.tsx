'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/animations.module.css';
import { Layers, Play, Pause, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

export default function TowerOfHanoiLab() {
  const [diskCount, setDiskCount] = useState<number>(3); // 3 ~ 5 片盘
  // 三根柱子上的盘子数组 (存盘子尺寸 1, 2, 3...)，数组末尾为最上层的盘子
  const [pegs, setPegs] = useState<number[][]>([[3, 2, 1], [], []]);
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [stepCount, setStepCount] = useState<number>(0);
  const [autoStepIdx, setAutoStepIdx] = useState<number>(-1);
  const [autoMoves, setAutoMoves] = useState<{ from: number; to: number }[]>([]);

  // 最少移动步数 2^n - 1
  const minSteps = Math.pow(2, diskCount) - 1;

  // 重置指定盘数
  const initDisks = (count: number) => {
    setDiskCount(count);
    const initialA = Array.from({ length: count }, (_, i) => count - i);
    setPegs([initialA, [], []]);
    setSelectedPeg(null);
    setStepCount(0);
    setAutoStepIdx(-1);
    setAutoMoves([]);
  };

  // 递归生成汉诺塔解法序列
  const generateHanoiMoves = (n: number, from: number, to: number, aux: number): { from: number; to: number }[] => {
    if (n === 1) return [{ from, to }];
    return [
      ...generateHanoiMoves(n - 1, from, aux, to),
      { from, to },
      ...generateHanoiMoves(n - 1, aux, to, from),
    ];
  };

  // 开始自动演示
  const startAutoPlay = () => {
    initDisks(diskCount);
    const moves = generateHanoiMoves(diskCount, 0, 2, 1);
    setAutoMoves(moves);
    setAutoStepIdx(0);
  };

  // 自动演示定时器
  useEffect(() => {
    if (autoStepIdx >= 0 && autoStepIdx < autoMoves.length) {
      const timer = setTimeout(() => {
        const move = autoMoves[autoStepIdx];
        setPegs((prev) => {
          const newPegs = prev.map((p) => [...p]);
          const disk = newPegs[move.from].pop();
          if (disk !== undefined) {
            newPegs[move.to].push(disk);
          }
          return newPegs;
        });
        setStepCount((s) => s + 1);
        setAutoStepIdx((idx) => idx + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [autoStepIdx, autoMoves]);

  // 手动点击柱子
  const handlePegClick = (pegIdx: number) => {
    if (autoStepIdx >= 0 && autoStepIdx < autoMoves.length) return; // 自动播放中禁止点击

    if (selectedPeg === null) {
      // 拿起顶层盘子
      if (pegs[pegIdx].length > 0) {
        setSelectedPeg(pegIdx);
      }
    } else {
      if (selectedPeg === pegIdx) {
        setSelectedPeg(null); // 取消选择
      } else {
        // 尝试放到新柱子
        const sourceDisk = pegs[selectedPeg][pegs[selectedPeg].length - 1];
        const targetTopDisk = pegs[pegIdx].length > 0 ? pegs[pegIdx][pegs[pegIdx].length - 1] : Infinity;

        if (sourceDisk < targetTopDisk) {
          // 合法放置：大盘不能压小盘
          const newPegs = pegs.map((p) => [...p]);
          newPegs[selectedPeg].pop();
          newPegs[pegIdx].push(sourceDisk);
          setPegs(newPegs);
          setStepCount((s) => s + 1);
          setSelectedPeg(null);
        } else {
          // 非法操作抖动提醒或取消
          setSelectedPeg(null);
        }
      }
    }
  };

  // 盘子宽度映射
  const getDiskWidth = (val: number) => 36 + val * 22;
  const diskColors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

  const isSuccess = pegs[2].length === diskCount;

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers className={styles.icon} />
          <h2 className={styles.title}>汉诺塔与指数递归实验室</h2>
        </div>
        <p className={styles.description}>
          体验古印度 64 片黄金盘的数学神话！理解“大盘绝不压小盘”的规则，推导最少移动步数公式 T(n) = 2ⁿ - 1。
        </p>
      </div>

      {/* 盘数选择与操作栏 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>圆盘数量：</span>
          {[3, 4, 5].map((cnt) => (
            <button
              key={cnt}
              onClick={() => initDisks(cnt)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                backgroundColor: diskCount === cnt ? '#4f46e5' : '#f1f5f9',
                color: diskCount === cnt ? '#ffffff' : '#475569',
              }}
            >
              {cnt} 片盘（需 {Math.pow(2, cnt) - 1} 步）
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={startAutoPlay}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Play size={14} /> 自动演示最少步数
          </button>
          <button
            onClick={() => initDisks(diskCount)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> 重置
          </button>
        </div>
      </div>

      {/* 汉诺塔互动主展台 */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          padding: '24px 16px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '180px' }}>
          {pegs.map((disks, pIdx) => {
            const isSel = selectedPeg === pIdx;
            const pegLabel = ['A 柱 (起点)', 'B 柱 (中转)', 'C 柱 (目标)'][pIdx];

            return (
              <div
                key={pIdx}
                onClick={() => handlePegClick(pIdx)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '160px',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {/* 选中的浮空高亮指示 */}
                {isSel && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-26px',
                      fontSize: '12px',
                      color: '#4f46e5',
                      fontWeight: 700,
                    }}
                  >
                    👆 已选中
                  </div>
                )}

                {/* 柱子立柱 */}
                <div
                  style={{
                    width: '10px',
                    height: '130px',
                    backgroundColor: isSel ? '#4f46e5' : '#94a3b8',
                    borderRadius: '5px 5px 0 0',
                    position: 'absolute',
                    bottom: '10px',
                    zIndex: 1,
                  }}
                />

                {/* 盘子堆叠 */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    alignItems: 'center',
                    minHeight: '130px',
                    zIndex: 2,
                    marginBottom: '10px',
                    width: '100%',
                  }}
                >
                  {disks.map((diskVal, dIdx) => {
                    const isTopAndSelected = isSel && dIdx === disks.length - 1;
                    return (
                      <div
                        key={dIdx}
                        style={{
                          width: `${getDiskWidth(diskVal)}px`,
                          height: '20px',
                          backgroundColor: diskColors[diskVal - 1],
                          borderRadius: '6px',
                          border: '1px solid rgba(0,0,0,0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: 800,
                          marginBottom: '2px',
                          transform: isTopAndSelected ? 'translateY(-14px)' : 'none',
                          boxShadow: isTopAndSelected ? '0 4px 12px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.1)',
                          transition: 'all 0.15s ease-out',
                        }}
                      >
                        {diskVal}
                      </div>
                    );
                  })}
                </div>

                {/* 柱子底座 */}
                <div
                  style={{
                    width: '120px',
                    height: '10px',
                    backgroundColor: '#475569',
                    borderRadius: '5px',
                    zIndex: 3,
                  }}
                />
                <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  {pegLabel}
                </div>
              </div>
            );
          })}
        </div>

        {/* 状态反馈条 */}
        <div
          style={{
            marginTop: '20px',
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: isSuccess ? '#ecfdf5' : '#ffffff',
            border: `1px solid ${isSuccess ? '#86efac' : '#e2e8f0'}`,
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
                  🎉 目标达成！在 {stepCount} 步内成功把所有圆盘转移到 C 柱！
                </span>
              </>
            ) : (
              <span style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
                当前移动步数：<b>{stepCount}</b> 步 ｜ 最少理论步数：<b>{minSteps}</b> 步 (2^{diskCount} - 1)
              </span>
            )}
          </div>

          <div style={{ fontSize: '12px', color: '#64748b' }}>
            规则：每次移一片，大盘绝不可压小盘！
          </div>
        </div>
      </div>

      {/* 递推与指数爆炸卡片 */}
      <div
        style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px',
        }}
      >
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#4f46e5', marginBottom: '6px' }}>
            三步递归哲学：T(n) = 2T(n-1) + 1
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
            将前 n-1 个盘移走（T(n-1)步） $\to$ 移最大底盘（1步） $\to$ 将 n-1 个盘移回（T(n-1)步）。每增加一个盘子，步数翻倍加一！
          </p>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#b91c1c', marginBottom: '6px' }}>
            梵天神庙 64 片圆盘的终局
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
            T(64) = 2⁶⁴ - 1 ≈ 1.84 × 10¹⁹ 步。即使每秒移动一次日夜不休，也需要 <b>5845 亿年</b>，远超太阳系寿命！
          </p>
        </div>
      </div>
    </div>
  );
}
