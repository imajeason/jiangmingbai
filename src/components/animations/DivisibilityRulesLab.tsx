'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type ModeType = 'sum39' | 'tail' | 'eleven' | 'challenge';

interface NumberPreset39 {
  label: string;
  num: number;
}

const PRESETS_39: NumberPreset39[] = [
  { label: '357 (能被3整除，不能被9整除)', num: 357 },
  { label: '864 (能同时被3和9整除)', num: 864 },
  { label: '1245 (四位数整除演示)', num: 1245 },
  { label: '9783 (大数拆解)', num: 9783 },
];

const PRESETS_11 = [
  { label: '8492 (经典四位数)', num: 8492 },
  { label: '1331 (11的三次方)', num: 1331 },
  { label: '2816 (能被11整除)', num: 2816 },
  { label: '7194 (差为11的倍数)', num: 7194 },
];

const CHALLENGES = [
  { prefix: '4', suffix: '71', divisor: 9, targetWord: '9', answer: 6, explain: '4 + 6 + 7 + 1 = 18 是 9 的倍数' },
  { prefix: '5', suffix: '2', divisor: 3, targetWord: '3', answer: 2, explain: '5 + 2 + 2 = 9 是 3 的倍数（也可填 5 或 8）' },
  { prefix: '7', suffix: '54', divisor: 11, targetWord: '11', answer: 8, explain: '奇数位 (4+8=12)，偶数位 (5+7=12)，差为 0 能被 11 整除' },
  { prefix: '38', suffix: '', divisor: 4, targetWord: '4', answer: 4, explain: '末两位 84 能被 4 整除（也可填 0 或 8）' },
];

export default function DivisibilityRulesLab() {
  const [mode, setMode] = useState<ModeType>('sum39');

  // Mode 1: 3 & 9
  const [currentNum39, setCurrentNum39] = useState<number>(357);
  const [step39, setStep39] = useState<number>(2); // 0: 原数, 1: 拆出99..9, 2: 汇总数字和

  // Mode 2: Tail family
  const [tailDivisor, setTailDivisor] = useState<number>(4);
  const [tailInput, setTailInput] = useState<number>(3724);

  // Mode 3: 11
  const [currentNum11, setCurrentNum11] = useState<number>(8492);

  // Mode 4: Challenge
  const [chalIndex, setChalIndex] = useState<number>(0);
  const [userDigit, setUserDigit] = useState<number | null>(null);

  // Helpers for Mode 1
  const digits39 = String(currentNum39).split('').map(Number);
  const digitSum39 = digits39.reduce((acc, curr) => acc + curr, 0);
  const isDiv3 = digitSum39 % 3 === 0;
  const isDiv9 = digitSum39 % 9 === 0;

  // Helpers for Mode 2
  const tailStr = String(tailInput);
  let tailCheckDigits = 1;
  let baseUnit = 10;
  if (tailDivisor === 4 || tailDivisor === 25) {
    tailCheckDigits = 2;
    baseUnit = 100;
  } else if (tailDivisor === 8 || tailDivisor === 125) {
    tailCheckDigits = 3;
    baseUnit = 1000;
  }
  const checkSubStr = tailStr.slice(-tailCheckDigits);
  const checkSubNum = parseInt(checkSubStr, 10);
  const isTailDivisible = checkSubNum % tailDivisor === 0;

  // Helpers for Mode 3 (11)
  const digits11 = String(currentNum11).split('').map(Number);
  // 从右往左数位：第1位是个位(奇位)，第2位是十位(偶位)...
  const revDigits = [...digits11].reverse();
  const oddDigits: { digit: number; place: number }[] = [];
  const evenDigits: { digit: number; place: number }[] = [];
  revDigits.forEach((d, idx) => {
    if ((idx + 1) % 2 === 1) {
      oddDigits.push({ digit: d, place: idx + 1 });
    } else {
      evenDigits.push({ digit: d, place: idx + 1 });
    }
  });
  const oddSum = oddDigits.reduce((acc, curr) => acc + curr.digit, 0);
  const evenSum = evenDigits.reduce((acc, curr) => acc + curr.digit, 0);
  const diff11 = Math.abs(oddSum - evenSum);
  const isDiv11 = diff11 % 11 === 0;

  // Helpers for Challenge
  const curChal = CHALLENGES[chalIndex];
  const isChalCorrect = userDigit !== null && (
    curChal.divisor === 3 ? (parseInt(`${curChal.prefix}${userDigit}${curChal.suffix}`, 10) % 3 === 0) :
    curChal.divisor === 4 ? (parseInt(`${curChal.prefix}${userDigit}${curChal.suffix}`, 10) % 4 === 0) :
    curChal.divisor === 9 ? (parseInt(`${curChal.prefix}${userDigit}${curChal.suffix}`, 10) % 9 === 0) :
    curChal.divisor === 11 ? (parseInt(`${curChal.prefix}${userDigit}${curChal.suffix}`, 10) % 11 === 0) : false
  );

  return (
    <div className={styles.labContainer}>
      {/* 顶部模式切换 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <button
          className={`${styles.stepButton} ${mode === 'sum39' ? styles.active : ''}`}
          onClick={() => setMode('sum39')}
        >
          🌟 3 与 9 的数字和密码
        </button>
        <button
          className={`${styles.stepButton} ${mode === 'tail' ? styles.active : ''}`}
          onClick={() => setMode('tail')}
        >
          🔍 末位家族 (2/5, 4/25, 8/125)
        </button>
        <button
          className={`${styles.stepButton} ${mode === 'eleven' ? styles.active : ''}`}
          onClick={() => setMode('eleven')}
        >
          ⚖️ 11 的奇偶位跷跷板
        </button>
        <button
          className={`${styles.stepButton} ${mode === 'challenge' ? styles.active : ''}`}
          onClick={() => {
            setMode('challenge');
            setUserDigit(null);
          }}
        >
          🎯 缺数字破解挑战
        </button>
      </div>

      {/* MODE 1: 3 & 9 数字和原理 */}
      {mode === 'sum39' && (
        <div>
          {/* 交互说明条 */}
          <div style={{ background: '#f0f9ff', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #0284c7', marginBottom: '16px' }}>
            <div style={{ fontWeight: 700, color: '#0369a1', fontSize: '0.95rem' }}>
              💡 核心破局点：100=99+1，1000=999+1！每个数位都悄悄脱下一件 99..9 的“外衣”
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
              所有 99...9 必定是 9 和 3 的铁倍数，剩下的就是每位上的【单块积木 1】！所以原数能否被 3 或 9 整除，全由各位数字之和一锤定音！
            </div>
          </div>

          {/* 画布大舞台 */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', minHeight: '320px' }}>
            {/* 顶部原数展示 */}
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <span style={{ fontSize: '1rem', color: '#64748b' }}>当前观察数字：</span>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', marginLeft: '8px', letterSpacing: '2px' }}>
                {currentNum39}
              </span>
            </div>

            {/* 数位拆解动效 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '640px', margin: '0 auto' }}>
              {digits39.map((digit, idx) => {
                const power = digits39.length - 1 - idx;
                const placeVal = Math.pow(10, power);
                const ninesVal = placeVal - 1;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    {/* 左侧：数位展开 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                        {placeVal === 1000 ? '千位' : placeVal === 100 ? '百位' : placeVal === 10 ? '十位' : '个位'}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>
                        {digit} × {placeVal}
                      </span>
                    </div>

                    {/* 中间/右侧：剥离算理 */}
                    {step39 === 0 && (
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        = {digit * placeVal}
                      </span>
                    )}

                    {step39 >= 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                        <span>=</span>
                        {ninesVal > 0 ? (
                          <>
                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              {digit} × {ninesVal} (9的倍数)
                            </span>
                            <span>+</span>
                          </>
                        ) : null}
                        <span style={{ background: '#fed7aa', color: '#c2410c', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                          {digit} × 1 ({digit})
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 步骤 2：沉淀汇总卡片 */}
            {step39 === 2 && (
              <div style={{ marginTop: '20px', padding: '16px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 700 }}>
                      所有【99..9部分】已全部被 9 和 3 整除！最终剩余只需检验：
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#92400e', marginTop: '4px' }}>
                      各位数字之和：{digits39.join(' + ')} = <span style={{ fontSize: '1.3rem', color: '#c2410c' }}>{digitSum39}</span>
                    </div>
                  </div>

                  {/* 检验结果标签 */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ padding: '6px 12px', borderRadius: '6px', fontWeight: 800, fontSize: '0.9rem', background: isDiv3 ? '#dcfce7' : '#fee2e2', color: isDiv3 ? '#166534' : '#991b1b' }}>
                      {isDiv3 ? '✅ 能被 3 整除' : '❌ 不能被 3 整除'} ({digitSum39} ÷ 3 {isDiv3 ? `= ${digitSum39 / 3}` : `余 ${digitSum39 % 3}`})
                    </div>
                    <div style={{ padding: '6px 12px', borderRadius: '6px', fontWeight: 800, fontSize: '0.9rem', background: isDiv9 ? '#dcfce7' : '#fee2e2', color: isDiv9 ? '#166534' : '#991b1b' }}>
                      {isDiv9 ? '✅ 能被 9 整除' : '❌ 不能被 9 整除'} ({digitSum39} ÷ 9 {isDiv9 ? `= ${digitSum39 / 9}` : `余 ${digitSum39 % 9}`})
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 黄金近邻控制区：紧贴正下方 */}
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* 步骤控制 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>推导步进：</span>
              <button
                className={`${styles.stepButton} ${step39 === 0 ? styles.active : ''}`}
                onClick={() => setStep39(0)}
              >
                ① 观察数位
              </button>
              <button
                className={`${styles.stepButton} ${step39 === 1 ? styles.active : ''}`}
                onClick={() => setStep39(1)}
              >
                ② 剥离 99...9 外衣
              </button>
              <button
                className={`${styles.stepButton} ${step39 === 2 ? styles.active : ''}`}
                onClick={() => setStep39(2)}
              >
                ③ 汇聚各位数字之和
              </button>
            </div>

            {/* 预设数字切换 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>经典预设：</span>
              {PRESETS_39.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentNum39(p.num);
                    setStep39(2);
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: currentNum39 === p.num ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: currentNum39 === p.num ? '#eff6ff' : '#ffffff',
                    fontWeight: currentNum39 === p.num ? 700 : 500,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: 末位家族 (2/5, 4/25, 8/125) */}
      {mode === 'tail' && (
        <div>
          <div style={{ background: '#f0fdf4', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #16a34a', marginBottom: '16px' }}>
            <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.95rem' }}>
              💡 核心破局点：10=2×5，100=4×25，1000=8×125！
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
              任何多位数的“前缀部分”全是整十、整百或整千，天生就能被整除！因此无论前面的数字有多大多长，只需检查末几位！
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            {/* 目标除数切换 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>选择检验除数：</span>
              {[
                { div: 2, label: '除以 2 (看末1位)' },
                { div: 5, label: '除以 5 (看末1位)' },
                { div: 4, label: '除以 4 (看末2位)' },
                { div: 25, label: '除以 25 (看末2位)' },
                { div: 8, label: '除以 8 (看末3位)' },
                { div: 125, label: '除以 125 (看末3位)' },
              ].map((item) => (
                <button
                  key={item.div}
                  onClick={() => setTailDivisor(item.div)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    border: tailDivisor === item.div ? '2px solid #16a34a' : '1px solid #cbd5e1',
                    background: tailDivisor === item.div ? '#dcfce7' : '#ffffff',
                    fontWeight: tailDivisor === item.div ? 800 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* 数值前缀与末尾高亮拆解 */}
            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '8px' }}>
                正在检验：{tailInput} 是否能被 {tailDivisor} 整除
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', background: '#f8fafc', padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                {/* 前缀部分 */}
                <div style={{ textAlign: 'center', padding: '0 12px', borderRight: '2px dashed #cbd5e1' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#94a3b8' }}>
                    {tailStr.slice(0, -tailCheckDigits) || '0'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                    前缀整{baseUnit === 10 ? '十' : baseUnit === 100 ? '百' : '千'} (必整除)
                  </div>
                </div>

                {/* 末尾关键位 */}
                <div style={{ textAlign: 'center', padding: '0 16px' }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#dc2626' }}>
                    {checkSubStr}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 800 }}>
                    末 {tailCheckDigits} 位核心判定区
                  </div>
                </div>
              </div>
            </div>

            {/* 结论卡片 */}
            <div style={{ background: isTailDivisible ? '#f0fdf4' : '#fef2f2', border: `1px solid ${isTailDivisible ? '#bbf7d0' : '#fecaca'}`, borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: isTailDivisible ? '#15803d' : '#991b1b' }}>
                {isTailDivisible
                  ? `🎉 整除！末 ${tailCheckDigits} 位【${checkSubStr}】是 ${tailDivisor} 的倍数 (${checkSubNum} ÷ ${tailDivisor} = ${checkSubNum / tailDivisor})`
                  : `❌ 不能整除！末 ${tailCheckDigits} 位【${checkSubStr}】不能被 ${tailDivisor} 整除 (${checkSubNum} ÷ ${tailDivisor} = ${Math.floor(checkSubNum / tailDivisor)} 余 ${checkSubNum % tailDivisor})`}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '6px' }}>
                无论在前面添加多少位数字（如 99999{tailStr}），只要末尾 {checkSubStr} 不变，被 {tailDivisor} 整除的结果绝对恒定不变！
              </div>
            </div>
          </div>

          {/* 控制条 */}
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>换个测试数：</span>
            {[3724, 5160, 1875, 4032, 9218].map((n) => (
              <button
                key={n}
                onClick={() => setTailInput(n)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: tailInput === n ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  background: tailInput === n ? '#e0f2fe' : '#ffffff',
                  fontWeight: tailInput === n ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MODE 3: 11 的奇偶位跷跷板 */}
      {mode === 'eleven' && (
        <div>
          <div style={{ background: '#faf5ff', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #9333ea', marginBottom: '16px' }}>
            <div style={{ fontWeight: 700, color: '#7e22ce', fontSize: '0.95rem' }}>
              💡 核心破局点：10 = 11 - 1 (欠1)，100 = 99 + 1 (多1)，1000 = 1001 - 1 (欠1)！
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
              数位权值呈现 +1 与 -1 的交替正负波动！奇数位（个位、百位、万位）与偶数位（十位、千位）正好分别坐上跷跷板的两端，两端之差为 0 或 11 的倍数即整除！
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>待检验数字：</span>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: '#581c87', marginLeft: '8px' }}>
                {currentNum11}
              </span>
            </div>

            {/* 跷跷板具象模拟 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              {/* 奇数位盘 */}
              <div style={{ background: '#eff6ff', border: '2px solid #3b82f6', borderRadius: '10px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: '#1e40af' }}>🔵 奇数位之和 (个、百、万...)</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1d4ed8' }}>{oddSum}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>
                  包含数字：{oddDigits.map((d) => `第${d.place}位[${d.digit}]`).join(' + ')}
                </div>
              </div>

              {/* 偶数位盘 */}
              <div style={{ background: '#fdf2f8', border: '2px solid #ec4899', borderRadius: '10px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: '#9d174d' }}>🔴 偶数位之和 (十、千、十万...)</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#be185d' }}>{evenSum}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>
                  包含数字：{evenDigits.map((d) => `第${d.place}位[${d.digit}]`).join(' + ')}
                </div>
              </div>
            </div>

            {/* 差额与天平平衡 */}
            <div style={{ textAlign: 'center', padding: '16px', background: isDiv11 ? '#f0fdf4' : '#fff1f2', borderRadius: '10px', border: `1px solid ${isDiv11 ? '#86efac' : '#fecdd3'}` }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
                奇偶位相差：|{oddSum} - {evenSum}| = <span style={{ fontSize: '1.4rem', color: isDiv11 ? '#15803d' : '#e11d48' }}>{diff11}</span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.95rem', fontWeight: 700, color: isDiv11 ? '#166534' : '#9f1239' }}>
                {isDiv11
                  ? `🎉 差值为 ${diff11}（是 11 的倍数），故 ${currentNum11} 能被 11 整除！(${currentNum11} ÷ 11 = ${currentNum11 / 11})`
                  : `❌ 差值为 ${diff11}（不是 11 的倍数），故 ${currentNum11} 不能被 11 整除！`}
              </div>
            </div>
          </div>

          {/* 预设按钮 */}
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>预设数字：</span>
            {PRESETS_11.map((p, i) => (
              <button
                key={i}
                onClick={() => setCurrentNum11(p.num)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: currentNum11 === p.num ? '2px solid #9333ea' : '1px solid #cbd5e1',
                  background: currentNum11 === p.num ? '#f3e8ff' : '#ffffff',
                  fontWeight: currentNum11 === p.num ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MODE 4: 缺数字特工密码挑战 */}
      {mode === 'challenge' && (
        <div>
          <div style={{ background: '#fff7ed', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #ea580c', marginBottom: '16px' }}>
            <div style={{ fontWeight: 700, color: '#c2410c', fontSize: '0.95rem' }}>
              🎯 特工密码破译：填入数字 □ 使其满足整除条件！
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
              小升初与竞赛必考题型！运用刚刚掌握的“数字和、末位、奇偶位差”原理，秒杀空缺数字！
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '6px' }}>
              挑战第 {chalIndex + 1} / {CHALLENGES.length} 题
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>
              若多位数 <span style={{ fontFamily: 'monospace', letterSpacing: '2px', fontSize: '1.6rem', color: '#2563eb' }}>{curChal.prefix}[ □ ]{curChal.suffix}</span> 能被 <strong>{curChal.targetWord}</strong> 整除，□ 可以填入几？
            </div>

            {/* 0-9 键盘按钮 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '420px', margin: '0 auto 20px' }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <button
                  key={digit}
                  onClick={() => setUserDigit(digit)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: userDigit === digit ? '2px solid #ea580c' : '1px solid #cbd5e1',
                    background: userDigit === digit ? '#ffedd5' : '#f8fafc',
                    color: userDigit === digit ? '#c2410c' : '#1e293b',
                  }}
                >
                  {digit}
                </button>
              ))}
            </div>

            {/* 验证反馈卡片 */}
            {userDigit !== null && (
              <div style={{ background: isChalCorrect ? '#f0fdf4' : '#fef2f2', border: `1px solid ${isChalCorrect ? '#86efac' : '#fca5a5'}`, borderRadius: '10px', padding: '16px', maxWidth: '520px', margin: '0 auto' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isChalCorrect ? '#15803d' : '#991b1b' }}>
                  {isChalCorrect ? `🎉 恭喜破译成功！填入 ${userDigit}` : `🤔 填入 ${userDigit} 暂不满足，再试一个！`}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '6px' }}>
                  验证：{curChal.prefix}{userDigit}{curChal.suffix}
                  {isChalCorrect ? ` 满足条件！解析：${curChal.explain}` : ` 不能被 ${curChal.targetWord} 整除`}
                </div>
              </div>
            )}
          </div>

          {/* 切换题目 */}
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>题号切换：</span>
            {CHALLENGES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setChalIndex(i);
                  setUserDigit(null);
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: chalIndex === i ? '2px solid #ea580c' : '1px solid #cbd5e1',
                  background: chalIndex === i ? '#ffedd5' : '#ffffff',
                  fontWeight: chalIndex === i ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                第 {i + 1} 题 ({CHALLENGES[i].targetWord}的倍数)
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

