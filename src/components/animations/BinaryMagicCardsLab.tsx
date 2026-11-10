'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Wand2, Sparkles, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';

export default function BinaryMagicCardsLab() {
  // 5 张卡片对应的位权面值
  const cardWeights = [1, 2, 4, 8, 16];
  // 用户勾选的卡片集合 (索引 0~4)
  const [selectedCards, setSelectedCards] = useState<number[]>([0, 1, 4]); // 默认选 1, 2, 16 => 19
  const [secretRevealed, setSecretRevealed] = useState<boolean>(true);

  // 生成每张卡片上的数字 (1~31 中该位二进制为 1 的数)
  const getCardNumbers = (weight: number) => {
    const list: number[] = [];
    for (let i = 1; i <= 31; i++) {
      if ((i & weight) !== 0) {
        list.push(i);
      }
    }
    return list;
  };

  const cardsData = cardWeights.map((w) => ({
    weight: w,
    numbers: getCardNumbers(w),
  }));

  // 切换勾选某张卡片
  const toggleCard = (idx: number) => {
    if (selectedCards.includes(idx)) {
      setSelectedCards(selectedCards.filter((c) => c !== idx));
    } else {
      setSelectedCards([...selectedCards, idx].sort((a, b) => a - b));
    }
    setSecretRevealed(true);
  };

  // 根据选中的卡片计算心算数字 (即首数之和)
  const guessedNumber = selectedCards.reduce((acc, cIdx) => acc + cardWeights[cIdx], 0);

  // 快速指定一个目标数字并自动点亮卡片
  const pickTargetNumber = (target: number) => {
    const newSelected: number[] = [];
    for (let i = 0; i < 5; i++) {
      if ((target & cardWeights[i]) !== 0) {
        newSelected.push(i);
      }
    }
    setSelectedCards(newSelected);
    setSecretRevealed(true);
  };

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wand2 className={styles.icon} />
          <h2 className={styles.title}>二进制神奇猜数卡片与读心魔术</h2>
        </div>
        <p className={styles.description}>
          心里默想一个 1~31 的数字，点击包含该数字的卡片，魔术师立刻将左上角第一个数字相加读出你的心！
        </p>
      </div>

      {/* 快捷选数预设 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>快速体验目标数字：</span>
        {[7, 11, 13, 19, 25, 31].map((val) => (
          <button
            key={val}
            onClick={() => pickTargetNumber(val)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: guessedNumber === val ? '2px solid #4f46e5' : '1px solid #cbd5e1',
              backgroundColor: guessedNumber === val ? '#e0e7ff' : '#ffffff',
              color: guessedNumber === val ? '#3730a3' : '#334155',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {val}
          </button>
        ))}
      </div>

      {/* 5 张魔术卡片展示区 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        {cardsData.map((card, idx) => {
          const isSelected = selectedCards.includes(idx);

          return (
            <div
              key={card.weight}
              onClick={() => toggleCard(idx)}
              style={{
                borderRadius: '12px',
                border: isSelected ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                backgroundColor: isSelected ? '#eef2ff' : '#ffffff',
                boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
                padding: '12px 10px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* 卡片头部与领头数字 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                  卡片 {['①', '②', '③', '④', '⑤'][idx]}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 900,
                    color: isSelected ? '#4338ca' : '#ea580c',
                    backgroundColor: isSelected ? '#c7d2fe' : '#ffedd5',
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                  title="左上角首数（位权）"
                >
                  {card.weight}
                </span>
              </div>

              {/* 卡片数字网格 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '4px',
                  fontSize: '10px',
                  textAlign: 'center',
                  fontWeight: 600,
                  color: isSelected ? '#312e81' : '#475569',
                }}
              >
                {card.numbers.map((num) => (
                  <span
                    key={num}
                    style={{
                      padding: '2px 0',
                      borderRadius: '3px',
                      backgroundColor: num === guessedNumber ? '#fde047' : 'transparent',
                      color: num === guessedNumber ? '#854d0e' : 'inherit',
                      fontWeight: num === guessedNumber ? 900 : 'normal',
                    }}
                  >
                    {num}
                  </span>
                ))}
              </div>

              <div
                style={{
                  marginTop: '8px',
                  textAlign: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isSelected ? '#4f46e5' : '#94a3b8',
                }}
              >
                {isSelected ? '✅ 已包含' : '⚪ 点击包含'}
              </div>
            </div>
          );
        })}
      </div>

      {/* 读心术揭秘结果看板 */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles color="#4f46e5" size={18} />
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>
            魔术师读心结果：你默想的数字是
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 900,
              color: '#4f46e5',
              backgroundColor: '#ffffff',
              padding: '6px 24px',
              borderRadius: '12px',
              border: '2px solid #6366f1',
              boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)',
            }}
          >
            {guessedNumber === 0 ? '?' : guessedNumber}
          </div>

          <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
            {selectedCards.length > 0 ? (
              <div>
                <b>心算公式（选中的各卡片首数相加）：</b>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                  {selectedCards.map((cIdx) => cardWeights[cIdx]).join(' + ')} = {guessedNumber}！
                </div>
              </div>
            ) : (
              <span style={{ color: '#94a3b8' }}>请点击上方卡片指出哪些包含你的目标数</span>
            )}
          </div>
        </div>

        {/* 二进制位权对应解析 */}
        <div
          style={{
            marginTop: '14px',
            padding: '10px 14px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '12px',
            color: '#475569',
          }}
        >
          💡 <b>二进制唯一分解本质</b>：数字 {guessedNumber} 的二进制为{' '}
          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#4f46e5' }}>
            ({guessedNumber.toString(2).padStart(5, '0')})₂
          </span>
          。观众指认卡片的过程，实际上是在把该数字每个二进制位是 0 还是 1 直接报给了魔术师！
        </div>
      </div>
    </div>
  );
}
