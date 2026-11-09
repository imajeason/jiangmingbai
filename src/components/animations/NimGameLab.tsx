'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, Play, RotateCcw, CheckCircle2, AlertCircle, Bot, User } from 'lucide-react';

export default function NimGameLab() {
  // 三堆火柴数量 (A, B, C)
  const [piles, setPiles] = useState<number[]>([3, 4, 5]);
  const [selectedPile, setSelectedPile] = useState<number | null>(null);
  const [takeCount, setTakeCount] = useState<number>(1);
  const [turn, setTurn] = useState<'player' | 'ai'>('player');
  const [winner, setWinner] = useState<string | null>(null);
  const [log, setLog] = useState<string>('游戏开始！轮到你拿火柴。');

  // 计算异或和 (Nim-Sum)
  const nimSum = piles.reduce((acc, curr) => acc ^ curr, 0);

  // 二进制 3 位展开 (最大值不超过 7，位权 4, 2, 1)
  const toBinaryArray = (num: number) => {
    return [(num >> 2) & 1, (num >> 1) & 1, num & 1];
  };

  const binA = toBinaryArray(piles[0]);
  const binB = toBinaryArray(piles[1]);
  const binC = toBinaryArray(piles[2]);

  // 统计每列 1 的个数
  const colCounts = [binA[0] + binB[0] + binC[0], binA[1] + binB[1] + binC[1], binA[2] + binB[2] + binC[2]];

  // 寻找必胜拿法 (让异或和归零)
  const findWinningMove = (): { pileIdx: number; newAmount: number; takeAmount: number } | null => {
    if (nimSum === 0) return null; // 已经是必败态，无法一招制胜
    for (let i = 0; i < piles.length; i++) {
      const target = piles[i] ^ nimSum;
      if (target < piles[i]) {
        return {
          pileIdx: i,
          newAmount: target,
          takeAmount: piles[i] - target,
        };
      }
    }
    return null;
  };

  const bestMove = findWinningMove();

  // 玩家拿取火柴
  const handlePlayerTake = () => {
    if (selectedPile === null || takeCount <= 0 || takeCount > piles[selectedPile]) return;

    const newPiles = [...piles];
    newPiles[selectedPile] -= takeCount;
    setPiles(newPiles);
    const pileNames = ['A', 'B', 'C'];
    setLog(`你从堆 ${pileNames[selectedPile]} 拿走了 ${takeCount} 根火柴。`);
    setSelectedPile(null);
    setTakeCount(1);

    // 检查是否结束
    if (newPiles.every((p) => p === 0)) {
      setWinner('恭喜你获得胜利！🎉');
      return;
    }

    // 轮到 AI
    setTurn('ai');
    setTimeout(() => {
      aiMove(newPiles);
    }, 700);
  };

  // AI 智能拿取
  const aiMove = (currentPiles: number[]) => {
    const currentSum = currentPiles.reduce((acc, curr) => acc ^ curr, 0);
    const pileNames = ['A', 'B', 'C'];
    let move: { pIdx: number; tCount: number } | null = null;

    if (currentSum !== 0) {
      // 处于必胜态，AI 使用异或和必胜法
      for (let i = 0; i < currentPiles.length; i++) {
        const target = currentPiles[i] ^ currentSum;
        if (target < currentPiles[i]) {
          move = { pIdx: i, tCount: currentPiles[i] - target };
          break;
        }
      }
    }

    if (!move) {
      // 处于必败态，随便从一个有火柴的堆拿 1 根
      const available = currentPiles.map((p, idx) => (p > 0 ? idx : -1)).filter((idx) => idx !== -1);
      const chosen = available[Math.floor(Math.random() * available.length)];
      move = { pIdx: chosen, tCount: 1 };
    }

    const nextPiles = [...currentPiles];
    nextPiles[move.pIdx] -= move.tCount;
    setPiles(nextPiles);
    setLog(`🤖 AI 从堆 ${pileNames[move.pIdx]} 拿走了 ${move.tCount} 根火柴。`);

    if (nextPiles.every((p) => p === 0)) {
      setWinner('AI 拿走了最后一根火柴，AI 获胜！');
      return;
    }

    setTurn('player');
  };

  const resetGame = (customPiles?: number[]) => {
    const p = customPiles || [3, 4, 5];
    setPiles(p);
    setSelectedPile(null);
    setTakeCount(1);
    setTurn('player');
    setWinner(null);
    setLog('游戏已重置！轮到你先手。');
  };

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles className={styles.icon} />
          <h2 className={styles.title}>尼姆博弈与二进制异或实验室</h2>
        </div>
        <p className={styles.description}>
          体验博弈论史上的绝世奇迹！观察火柴堆转换为二进制展开，掌握将“异或和 Nim-Sum 变为 0”的必胜秘籍。
        </p>
      </div>

      {/* 状态与预设 */}
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
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => resetGame([3, 4, 5])}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            经典开局 (3, 4, 5)
          </button>
          <button
            onClick={() => resetGame([1, 4, 5])}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            必败平衡态 (1, 4, 5)
          </button>
          <button
            onClick={() => resetGame()}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> 重新开始
          </button>
        </div>

        {/* 异或和局势胶囊 */}
        <div
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 700,
            backgroundColor: nimSum === 0 ? '#dcfce7' : '#fee2e2',
            color: nimSum === 0 ? '#15803d' : '#b91c1c',
            border: `1px solid ${nimSum === 0 ? '#86efac' : '#fca5a5'}`,
          }}
        >
          {nimSum === 0 ? '🛡️ 异或和 S = 0（P态 / 平衡必败态）' : `⚔️ 异或和 S = ${nimSum} ≠ 0（N态 / 必胜态）`}
        </div>
      </div>

      {/* 火柴对弈区 */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* 三堆火柴展示 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {piles.map((count, idx) => {
            const isSel = selectedPile === idx;
            const pileName = ['堆 A', '堆 B', '堆 C'][idx];

            return (
              <div
                key={idx}
                onClick={() => {
                  if (count > 0 && turn === 'player' && !winner) {
                    setSelectedPile(idx);
                    setTakeCount(1);
                  }
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  backgroundColor: isSel ? '#e0e7ff' : '#ffffff',
                  border: isSel ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                  boxShadow: isSel ? '0 4px 12px rgba(79, 70, 229, 0.25)' : '0 1px 3px rgba(0,0,0,0.05)',
                  cursor: count > 0 && turn === 'player' && !winner ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  minWidth: '110px',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  {pileName}
                </div>

                {/* 火柴图标列表 */}
                <div style={{ display: 'flex', gap: '4px', minHeight: '44px', alignItems: 'center' }}>
                  {count > 0 ? (
                    Array.from({ length: count }).map((_, mIdx) => (
                      <div
                        key={mIdx}
                        style={{
                          width: '8px',
                          height: '38px',
                          backgroundColor: '#f59e0b',
                          borderRadius: '2px',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            width: '10px',
                            height: '10px',
                            backgroundColor: '#dc2626',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '-5px',
                            left: '-1px',
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>[已拿光]</span>
                  )}
                </div>

                <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>
                  {count} 根
                </div>
              </div>
            );
          })}
        </div>

        {/* 拿取操作栏 */}
        {winner ? (
          <div
            style={{
              padding: '12px',
              textAlign: 'center',
              backgroundColor: '#ecfdf5',
              borderRadius: '8px',
              color: '#065f46',
              fontWeight: 800,
              fontSize: '16px',
            }}
          >
            {winner}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#ffffff',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                {selectedPile !== null
                  ? `已选 ${['堆 A', '堆 B', '堆 C'][selectedPile]}，拿取根数：`
                  : '👆 请点击选择上面某一堆火柴：'}
              </span>

              {selectedPile !== null && (
                <div style={{ display: 'flex', gap: '6px' }}>
                  {Array.from({ length: piles[selectedPile] }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setTakeCount(i + 1)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: takeCount === i + 1 ? '#4f46e5' : '#f1f5f9',
                        color: takeCount === i + 1 ? '#ffffff' : '#334155',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handlePlayerTake}
              disabled={selectedPile === null || turn !== 'player'}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: selectedPile !== null && turn === 'player' ? '#4f46e5' : '#cbd5e1',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: selectedPile !== null && turn === 'player' ? 'pointer' : 'not-allowed',
              }}
            >
              确定拿走
            </button>
          </div>
        )}

        <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
          📢 当前动态：{log}
        </div>
      </div>

      {/* 二进制展开与异或和算式表格 */}
      <div
        style={{
          marginTop: '16px',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sparkles color="#4f46e5" size={18} />
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>
            二进制展开与不进位加法（异或运算表）
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '6px', textAlign: 'left' }}>火柴堆</th>
                <th style={{ padding: '6px' }}>十进制</th>
                <th style={{ padding: '6px' }}>2² (4位)</th>
                <th style={{ padding: '6px' }}>2¹ (2位)</th>
                <th style={{ padding: '6px' }}>2⁰ (1位)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '6px', textAlign: 'left', fontWeight: 600 }}>堆 A</td>
                <td style={{ padding: '6px', fontWeight: 700 }}>{piles[0]}</td>
                <td style={{ padding: '6px', fontFamily: 'monospace' }}>{binA[0]}</td>
                <td style={{ padding: '6px', fontFamily: 'monospace' }}>{binA[1]}</td>
                <td style={{ padding: '6px', fontFamily: 'monospace' }}>{binA[2]}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '6px', textAlign: 'left', fontWeight: 600 }}>堆 B</td>
                <td style={{ padding: '6px', fontWeight: 700 }}>{piles[1]}</td>
                <td style={{ padding: '6px', fontFamily: 'monospace' }}>{binB[0]}</td>
                <td style={{ padding: '6px', fontFamily: 'monospace' }}>{binB[1]}</td>
                <td style={{ padding: '6px', fontFamily: 'monospace' }}>{binB[2]}</td>
              </tr>
              <tr style={{ borderBottom: '2px solid #cbd5e1' }}>
                <td style={{ padding: '6px', textAlign: 'left', fontWeight: 600 }}>堆 C</td>
                <td style={{ padding: '6px', fontWeight: 700 }}>{piles[2]}</td>
                <td style={{ padding: '6px', fontFamily: 'monospace' }}>{binC[0]}</td>
                <td style={{ padding: '6px', fontFamily: 'monospace' }}>{binC[1]}</td>
                <td style={{ padding: '6px', fontFamily: 'monospace' }}>{binC[2]}</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc', fontWeight: 700 }}>
                <td style={{ padding: '8px 6px', textAlign: 'left', color: '#4f46e5' }}>异或和 (Nim-Sum)</td>
                <td style={{ padding: '8px 6px', color: '#4f46e5', fontSize: '15px' }}>{nimSum}</td>
                <td style={{ padding: '8px 6px', color: colCounts[0] % 2 === 0 ? '#10b981' : '#ef4444' }}>
                  {colCounts[0] % 2}
                </td>
                <td style={{ padding: '8px 6px', color: colCounts[1] % 2 === 0 ? '#10b981' : '#ef4444' }}>
                  {colCounts[1] % 2}
                </td>
                <td style={{ padding: '8px 6px', color: colCounts[2] % 2 === 0 ? '#10b981' : '#ef4444' }}>
                  {colCounts[2] % 2}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 大师必胜提示 */}
        {bestMove && (
          <div
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              backgroundColor: '#fff7ed',
              borderRadius: '8px',
              border: '1px solid #fed7aa',
              fontSize: '13px',
              color: '#9a3412',
            }}
          >
            💡 <b>必胜秘籍：</b>当前为 N 态！从 <b>{['堆 A', '堆 B', '堆 C'][bestMove.pileIdx]}</b> 里拿走{' '}
            <b>{bestMove.takeAmount} 根</b>（使其变为 {bestMove.newAmount} 根），异或和瞬间归零，锁定胜局！
          </div>
        )}
      </div>
    </div>
  );
}

