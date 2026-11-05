'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Gamepad2, Sparkles, Trophy, RotateCcw, Swords, CheckCircle2 } from 'lucide-react';

export default function BashGameLab() {
  const [targetNumber, setTargetNumber] = useState<number>(30); // 目标数字 (如抢 30)
  const [maxPickup, setMaxPickup] = useState<number>(3); // 每次最多报几个数 (1 ~ 3)
  const [currentNum, setCurrentNum] = useState<number>(0);
  const [history, setHistory] = useState<{ player: '玩家' | '电脑'; count: number; reached: number }[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<'玩家' | '电脑' | null>(null);

  const cycle = maxPickup + 1; // 控制周期 m + 1
  const remainder = targetNumber % cycle; // 先手必胜第一步

  // 计算所有的安全地标列表
  const safeLandmarks: number[] = [];
  let cur = remainder === 0 ? cycle : remainder;
  while (cur <= targetNumber) {
    safeLandmarks.push(cur);
    cur += cycle;
  }

  // 重置游戏
  const handleReset = (newTarget: number = targetNumber, newMax: number = maxPickup) => {
    setTargetNumber(newTarget);
    setMaxPickup(newMax);
    setCurrentNum(0);
    setHistory([]);
    setGameOver(false);
    setWinner(null);
  };

  // 电脑出招 AI 逻辑
  const makeAIMove = (fromNum: number) => {
    const neededToNextLandmark = safeLandmarks.find(lm => lm > fromNum);
    let aiPick = 1;

    if (neededToNextLandmark && neededToNextLandmark - fromNum <= maxPickup) {
      aiPick = neededToNextLandmark - fromNum; // 完美抢占安全地标！
    } else {
      // 若处于被动，随机或挑 1 个
      aiPick = Math.min(maxPickup, Math.max(1, (targetNumber - fromNum) % cycle || 1));
    }

    const nextVal = fromNum + aiPick;
    const newHist = [
      ...history,
      { player: '电脑' as const, count: aiPick, reached: nextVal }
    ];

    setCurrentNum(nextVal);
    setHistory(newHist);

    if (nextVal >= targetNumber) {
      setGameOver(true);
      setWinner('电脑');
    }
  };

  // 玩家走一步
  const handlePlayerMove = (pick: number) => {
    if (gameOver || currentNum + pick > targetNumber) return;

    const nextVal = currentNum + pick;
    const newHist = [
      ...history,
      { player: '玩家' as const, count: pick, reached: nextVal }
    ];

    setCurrentNum(nextVal);
    setHistory(newHist);

    if (nextVal >= targetNumber) {
      setGameOver(true);
      setWinner('玩家');
      return;
    }

    // 延时让电脑走一步
    setTimeout(() => {
      makeAIMove(nextVal);
    }, 400);
  };

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Gamepad2 size={18} style={{ color: '#ea580c' }} />
          <span>巴什博弈与抢数游戏：必胜态与周期余数</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${targetNumber === 30 && maxPickup === 3 ? styles.controlBtnActive : ''}`}
            onClick={() => handleReset(30, 3)}
          >
            经典抢 30 (每次1~3)
          </button>
          <button
            className={`${styles.controlBtn} ${targetNumber === 21 && maxPickup === 3 ? styles.controlBtnActive : ''}`}
            onClick={() => handleReset(21, 3)}
          >
            21 颗石子 (每次1~3)
          </button>
          <button
            className={`${styles.controlBtn} ${targetNumber === 15 && maxPickup === 4 ? styles.controlBtnActive : ''}`}
            onClick={() => handleReset(15, 4)}
          >
            15 颗石子 (每次1~4)
          </button>
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
          {/* 策略核心看板 */}
          <div style={{
            width: '100%',
            background: '#fff7ed',
            padding: '12px 14px',
            borderRadius: '8px',
            borderLeft: '4px solid #ea580c',
            fontSize: '0.85rem',
            color: '#9a3412',
            lineHeight: 1.6
          }}>
            <strong>【巴什博弈必胜数学法则】：</strong>
            <br />
            周期 = 每次上限 + 1 = {maxPickup} + 1 = <strong>{cycle}</strong>。
            总数 {targetNumber} ÷ {cycle} = {Math.floor(targetNumber / cycle)} ... 余 <strong>{remainder}</strong>。
            <br />
            {remainder !== 0 ? (
              <span style={{ color: '#c2410c', fontWeight: 800 }}>
                👉 余数是 {remainder}！先手第一步抢占 {remainder}，之后每轮与对手凑成 {cycle}，先手 100% 必胜！
              </span>
            ) : (
              <span style={{ color: '#047857', fontWeight: 800 }}>
                👉 余数为 0！后手方每一轮与先手凑成 {cycle}，后手 100% 必胜！
              </span>
            )}
          </div>

          {/* 安全地标导航条 */}
          <div style={{
            marginTop: '14px',
            width: '100%',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '10px 14px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
              🎯 必胜安全地标链（谁抢到谁赢）：
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {safeLandmarks.map((lm) => {
                const isPassed = currentNum >= lm;
                const isCurrent = currentNum === lm;
                return (
                  <span
                    key={lm}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      background: isCurrent ? '#ea580c' : isPassed ? '#fed7aa' : '#ffffff',
                      color: isCurrent ? '#ffffff' : isPassed ? '#9a3412' : '#64748b',
                      border: isCurrent ? '1px solid #ea580c' : '1px solid #cbd5e1'
                    }}
                  >
                    {lm}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 实时对局大数字 */}
          <div style={{
            marginTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: '#fafaf9',
            borderRadius: '12px',
            border: '1px solid #e7e5e4',
            width: '100%'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#78716c' }}>当前报数累计到达 / 剩余未报</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: currentNum >= targetNumber ? '#16a34a' : '#ea580c', margin: '4px 0' }}>
              {currentNum} <span style={{ fontSize: '1.2rem', color: '#a8a29e' }}>/ {targetNumber}</span>
            </div>

            {gameOver ? (
              <div style={{
                marginTop: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                background: winner === '玩家' ? '#dcfce7' : '#fee2e2',
                color: winner === '玩家' ? '#15803d' : '#b91c1c',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Trophy size={16} />
                <span>🎉 对决结束：{winner} 成功抢下 {targetNumber}，赢得胜利！</span>
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#0284c7', marginTop: '4px' }}>
                轮到您出招，选择报出几个数（每次 1 ~ {maxPickup} 个）：
              </div>
            )}
          </div>

          {/* 玩家出招控制台 */}
          <div style={{
            marginTop: '14px',
            display: 'flex',
            gap: '10px',
            width: '100%',
            justifyContent: 'center'
          }}>
            {Array.from({ length: maxPickup }).map((_, i) => {
              const val = i + 1;
              const disabled = gameOver || currentNum + val > targetNumber;
              return (
                <button
                  key={val}
                  disabled={disabled}
                  style={{
                    flex: 1,
                    maxWidth: '120px',
                    padding: '10px 0',
                    borderRadius: '8px',
                    border: '1.5px solid #ea580c',
                    background: disabled ? '#f5f5f4' : '#fff7ed',
                    color: disabled ? '#a8a29e' : '#c2410c',
                    fontSize: '1rem',
                    fontWeight: 800,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    boxShadow: disabled ? 'none' : '0 2px 4px rgba(234, 88, 12, 0.15)'
                  }}
                  onClick={() => handlePlayerMove(val)}
                >
                  +{val} (报到 {currentNum + val})
                </button>
              );
            })}

            <button
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onClick={() => handleReset()}
            >
              <RotateCcw size={15} />
              重玩
            </button>
          </div>

          {/* 走步历史记录 */}
          {history.length > 0 && (
            <div style={{
              marginTop: '14px',
              width: '100%',
              maxHeight: '120px',
              overflowY: 'auto',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '0.75rem',
              color: '#475569',
              lineHeight: 1.6
            }}>
              <strong>出招轨迹：</strong>
              {history.map((h, i) => (
                <span key={i} style={{ marginRight: '8px' }}>
                  [{h.player} +{h.count} ➔ <strong>{h.reached}</strong>]
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

