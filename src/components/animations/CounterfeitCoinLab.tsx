'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Scale, Sparkles, CheckCircle2, RotateCcw, HelpCircle, ArrowRight } from 'lucide-react';

export default function CounterfeitCoinLab() {
  const [fakeCoinIdx, setFakeCoinIdx] = useState<number>(3); // 默认假币是 3号硬币 (0-indexed)
  const [leftPan, setLeftPan] = useState<number[]>([]);
  const [rightPan, setRightPan] = useState<number[]>([]);
  const [weighCount, setWeighCount] = useState<number>(0);
  const [tiltAngle, setTiltAngle] = useState<number>(0); // -12: 左轻右重; +12: 右轻左重; 0: 平衡
  const [weighResultLog, setWeighResultLog] = useState<string>('请将硬币放入天平两端，点击“称重”按钮');
  const [identifiedCoin, setIdentifiedCoin] = useState<number | null>(null);

  const totalCoins = 8;
  const coins = Array.from({ length: totalCoins }, (_, i) => i + 1);

  // 硬币在哪个位置
  const getCoinLocation = (coinNum: number) => {
    if (leftPan.includes(coinNum)) return 'left';
    if (rightPan.includes(coinNum)) return 'right';
    return 'table';
  };

  // 移动硬币
  const moveCoin = (coinNum: number, target: 'left' | 'right' | 'table') => {
    setLeftPan(prev => prev.filter(c => c !== coinNum));
    setRightPan(prev => prev.filter(c => c !== coinNum));
    if (target === 'left') setLeftPan(prev => [...prev, coinNum]);
    if (target === 'right') setRightPan(prev => [...prev, coinNum]);
    setTiltAngle(0);
  };

  // 重置天平
  const handleReset = (newFake?: number) => {
    setLeftPan([]);
    setRightPan([]);
    setWeighCount(0);
    setTiltAngle(0);
    setIdentifiedCoin(null);
    setWeighResultLog('天平已清空，请分堆称重');
    if (newFake !== undefined) {
      setFakeCoinIdx(newFake);
    }
  };

  // 一键摆放为最优三分法堆
  const applyOptimalPreset = (step: 1 | 2) => {
    if (step === 1) {
      // 第1次：左放 1,2,3，右放 4,5,6，桌上留 7,8
      setLeftPan([1, 2, 3]);
      setRightPan([4, 5, 6]);
      setTiltAngle(0);
      setWeighResultLog('已摆放为第一阶段最优三分堆：左盘 3 枚 vs 右盘 3 枚（桌上留 2 枚）');
    } else {
      // 第2次示范
      // 如果假币在 7或8 (fakeCoinIdx >= 6)
      if (fakeCoinIdx === 6 || fakeCoinIdx === 7) {
        setLeftPan([7]);
        setRightPan([8]);
      } else if (fakeCoinIdx < 3) {
        // 假币在前3枚
        setLeftPan([1]);
        setRightPan([2]);
      } else {
        // 假币在 4,5,6
        setLeftPan([4]);
        setRightPan([5]);
      }
      setTiltAngle(0);
      setWeighResultLog('已摆放为第二阶段最终判定堆！');
    }
  };

  // 执行称重
  const handleWeigh = () => {
    if (leftPan.length === 0 && rightPan.length === 0) return;
    if (leftPan.length !== rightPan.length) {
      setWeighResultLog('⚠️ 两盘硬币数量不相等，无法准确对比重量！请放相同数量硬币。');
      return;
    }

    const hasFakeInLeft = leftPan.includes(fakeCoinIdx + 1);
    const hasFakeInRight = rightPan.includes(fakeCoinIdx + 1);

    let angle = 0;
    let log = '';

    if (hasFakeInLeft) {
      angle = -10; // 左轻 (天平左端翘起)
      log = `【第 ${weighCount + 1} 次】左盘翘起（左盘更轻）➔ 假币锁定在左盘的 ${leftPan.join('、')} 号中！`;
    } else if (hasFakeInRight) {
      angle = 10; // 右轻 (天平右端翘起)
      log = `【第 ${weighCount + 1} 次】右盘翘起（右盘更轻）➔ 假币锁定在右盘的 ${rightPan.join('、')} 号中！`;
    } else {
      angle = 0; // 平衡
      const tableCoins = coins.filter(c => !leftPan.includes(c) && !rightPan.includes(c));
      log = `【第 ${weighCount + 1} 次】天平完全平衡！➔ 天平上的全部为真币，假币必定在桌上的 ${tableCoins.join('、')} 号中！`;
    }

    setTiltAngle(angle);
    setWeighCount(prev => prev + 1);
    setWeighResultLog(log);
  };

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Scale size={18} style={{ color: '#059669' }} />
          <span>天平称假币问题：三分法思维与信息量极限</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={styles.controlBtn}
            onClick={() => applyOptimalPreset(1)}
          >
            💡 第一步：(3, 3, 2) 最优分堆
          </button>
          <button
            className={styles.controlBtn}
            onClick={() => applyOptimalPreset(2)}
          >
            🎯 第二步：最终 1 次决胜
          </button>
          <button
            className={styles.controlBtn}
            onClick={() => handleReset((fakeCoinIdx + 1) % 8)}
          >
            <RotateCcw size={14} />
            换个假币重新测
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
          {/* 三分法与信息论原理卡 */}
          <div style={{
            width: '100%',
            background: '#ecfdf5',
            padding: '12px 14px',
            borderRadius: '8px',
            borderLeft: '4px solid #10b981',
            fontSize: '0.85rem',
            color: '#065f46',
            lineHeight: 1.6
          }}>
            <strong>【天平的 3 种物理状态 = 3 倍效率】：</strong>
            <br />
            天平不仅有“左倾”和“右倾”，更有珍贵的<strong>“完全平衡”</strong>！
            因此每次能将范围缩小为原来的 <strong>1/3</strong>。
            8 枚硬币在 $3^2 = 9$ 范围内，<strong>只需 2 次必定 100% 揪出假币！</strong>
          </div>

          {/* 天平交互 SVG 画布 */}
          <div style={{ marginTop: '16px', width: '100%', maxWidth: '420px' }}>
            <svg viewBox="0 0 420 220" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              {/* 天平底座支架 */}
              <polygon points="195,210 225,210 215,90 205,90" fill="#64748b" />
              <circle cx="210" cy="90" r="7" fill="#334155" stroke="#ffffff" strokeWidth="2" />

              {/* 天平横梁与托盘 (根据 tiltAngle 动态倾斜) */}
              <g transform={`rotate(${tiltAngle}, 210, 90)`} style={{ transition: 'transform 0.4s ease-out' }}>
                {/* 主横梁 */}
                <line x1="60" y1="90" x2="360" y2="90" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                <circle cx="60" cy="90" r="4" fill="#0f172a" />
                <circle cx="360" cy="90" r="4" fill="#0f172a" />

                {/* 左托盘吊绳与托盘 */}
                <line x1="60" y1="90" x2="35" y2="145" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="60" y1="90" x2="85" y2="145" stroke="#94a3b8" strokeWidth="1.5" />
                <path d="M 25,145 Q 60,165 95,145 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />

                {/* 右托盘吊绳与托盘 */}
                <line x1="360" y1="90" x2="335" y2="145" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="360" y1="90" x2="385" y2="145" stroke="#94a3b8" strokeWidth="1.5" />
                <path d="M 325,145 Q 360,165 395,145 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />

                {/* 左盘硬币文字标记 */}
                <text x="60" y="140" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e40af">
                  {leftPan.length > 0 ? `${leftPan.length} 枚` : '空'}
                </text>

                {/* 右盘硬币文字标记 */}
                <text x="360" y="140" textAnchor="middle" fontSize="11" fontWeight="800" fill="#047857">
                  {rightPan.length > 0 ? `${rightPan.length} 枚` : '空'}
                </text>
              </g>

              {/* 状态徽章 */}
              <text x="210" y="45" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1e293b">
                已称量：{weighCount} 次 {weighCount <= 2 ? '（在最优 2 次内）' : '（已超次）'}
              </text>
            </svg>
          </div>

          {/* 实时称重反馈条 */}
          <div style={{
            marginTop: '10px',
            width: '100%',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.825rem',
            color: '#334155',
            lineHeight: 1.6
          }}>
            <strong>⚖️ 称量结果报告：</strong>
            <br />
            {weighResultLog}
          </div>

          {/* 硬币托盘控制区 */}
          <div style={{
            marginTop: '14px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: '6px'
          }}>
            {coins.map((coinNum) => {
              const loc = getCoinLocation(coinNum);
              const isFake = coinNum === fakeCoinIdx + 1;
              return (
                <div
                  key={coinNum}
                  style={{
                    background: loc === 'left' ? '#dbeafe' : loc === 'right' ? '#dcfce7' : '#fef9c3',
                    border: loc === 'left' ? '1.5px solid #2563eb' : loc === 'right' ? '1.5px solid #16a34a' : '1.5px solid #ca8a04',
                    borderRadius: '8px',
                    padding: '6px 2px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#1e293b' }}>
                    #{coinNum}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
                    {loc === 'left' ? '左盘' : loc === 'right' ? '右盘' : '桌上'}
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', padding: '0 2px' }}>
                    <button
                      style={{ fontSize: '0.65rem', padding: '1px 0', border: '1px solid #cbd5e1', borderRadius: '3px', background: '#fff', cursor: 'pointer' }}
                      onClick={() => moveCoin(coinNum, 'left')}
                    >
                      放左
                    </button>
                    <button
                      style={{ fontSize: '0.65rem', padding: '1px 0', border: '1px solid #cbd5e1', borderRadius: '3px', background: '#fff', cursor: 'pointer' }}
                      onClick={() => moveCoin(coinNum, 'right')}
                    >
                      放右
                    </button>
                    <button
                      style={{ fontSize: '0.65rem', padding: '1px 0', border: '1px solid #cbd5e1', borderRadius: '3px', background: '#fff', cursor: 'pointer' }}
                      onClick={() => moveCoin(coinNum, 'table')}
                    >
                      下桌
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 称重主按钮 */}
          <div style={{ marginTop: '14px', width: '100%', display: 'flex', gap: '10px' }}>
            <button
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: '8px',
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.2)'
              }}
              onClick={handleWeigh}
            >
              ⚖️ 开始称重对比
            </button>
            <button
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#475569',
                border: '1px solid #cbd5e1',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
              onClick={() => handleReset()}
            >
              清空盘子
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

