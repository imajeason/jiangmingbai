'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/animations.module.css';
import { FastForward, Sparkles, Play, Pause, RotateCcw, CheckCircle2, Award } from 'lucide-react';

interface Preset {
  label: string;
  dogFreq: number; // 狗步频
  rabFreq: number; // 兔步频
  dogStepDistEquiv: number; // 狗多少步
  rabStepDistEquiv: number; // 相当于兔多少步
  rabbitLeadSteps: number;  // 兔领先多少兔步
  desc: string;
}

export default function HoundPursuesRabbitLab() {
  const presets: Preset[] = [
    {
      label: '经典真题 (狗跑180步追及)',
      dogFreq: 2,
      rabFreq: 3,
      dogStepDistEquiv: 3,
      rabStepDistEquiv: 5,
      rabbitLeadSteps: 30,
      desc: '狗跑2步兔跑3步；狗跑3步距离等于兔跑5步；兔领先30兔步'
    },
    {
      label: '高频变式 (步长比 4:3)',
      dogFreq: 3,
      rabFreq: 4,
      dogStepDistEquiv: 3,
      rabStepDistEquiv: 4,
      rabbitLeadSteps: 24,
      desc: '狗跑3步兔跑4步；狗跑3步等于兔跑4步；兔领先24兔步'
    },
    {
      label: '速战速决 (大步幅飞跃)',
      dogFreq: 3,
      rabFreq: 5,
      dogStepDistEquiv: 2,
      rabStepDistEquiv: 4,
      rabbitLeadSteps: 15,
      desc: '狗步长是兔的2倍，速度碾压！'
    }
  ];

  const [presetIdx, setPresetIdx] = useState<number>(0);
  const cur = presets[presetIdx];

  // 步长设定 (以最小公倍数求步长整数值)
  // dogStepDistEquiv * L_dog = rabStepDistEquiv * L_rab
  const dogLength = cur.rabStepDistEquiv;
  const rabbitLength = cur.dogStepDistEquiv;

  // 速度合成
  const dogSpeed = cur.dogFreq * dogLength;
  const rabbitSpeed = cur.rabFreq * rabbitLength;
  const netGainPerRound = dogSpeed - rabbitSpeed;

  // 初始差距 (单位化路程)
  const initialDistanceGap = cur.rabbitLeadSteps * rabbitLength;
  const totalRoundsNeeded = netGainPerRound > 0 ? initialDistanceGap / netGainPerRound : 0;
  const totalDogStepsNeeded = totalRoundsNeeded * cur.dogFreq;
  const totalRabbitStepsRan = totalRoundsNeeded * cur.rabFreq;

  // 动态奔跑动画状态
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentRound(prev => {
          if (prev >= totalRoundsNeeded) {
            setIsPlaying(false);
            return totalRoundsNeeded;
          }
          return Math.min(totalRoundsNeeded, prev + 1);
        });
      }, 150);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalRoundsNeeded]);

  const dogCurrentPos = currentRound * dogSpeed;
  const rabbitCurrentPos = initialDistanceGap + currentRound * rabbitSpeed;
  const remainingGap = Math.max(0, rabbitCurrentPos - dogCurrentPos);
  const isCaught = currentRound >= totalRoundsNeeded;

  const totalCourseLength = initialDistanceGap + totalRoundsNeeded * rabbitSpeed + 20;

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <FastForward size={18} style={{ color: '#ea580c' }} />
          <span>行程问题进阶：猎狗追兔与步长步频比</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {presets.map((p, idx) => (
            <button
              key={idx}
              className={`${styles.controlBtn} ${presetIdx === idx ? styles.controlBtnActive : ''}`}
              onClick={() => {
                setPresetIdx(idx);
                setCurrentRound(0);
                setIsPlaying(false);
              }}
            >
              {p.label.split(' ')[0]}
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
          {/* 原题情境卡 */}
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
            <strong>【破题核心：合速度 = 步频 × 步长】：</strong>
            <br />
            • 步长比（迈多大）：狗一步 {dogLength} 单位，兔一步 {rabbitLength} 单位；
            <br />
            • 步频比（跑多勤）：狗每轮跑 {cur.dogFreq} 步，兔每轮跑 {cur.rabFreq} 步；
            <br />
            • 速度比：狗速度 {dogSpeed} : 兔速度 {rabbitSpeed}！<strong>每轮净追 {netGainPerRound} 单位</strong>！
          </div>

          {/* 跑道仿真动画 SVG */}
          <div style={{ marginTop: '16px', width: '100%', maxWidth: '580px' }}>
            <svg viewBox="0 0 580 150" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              {/* 跑道草坪底色 */}
              <rect x="10" y="20" width="560" height="100" rx="10" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />

              {/* 跑道跑线 */}
              <line x1="20" y1="50" x2="560" y2="50" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="20" y1="90" x2="560" y2="90" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

              {/* 起跑线与终点捕获线 */}
              <line x1="40" y1="20" x2="40" y2="120" stroke="#334155" strokeWidth="2" />
              <text x="40" y="16" fontSize="10" fontWeight="700" fill="#64748b" textAnchor="middle">起跑 0</text>

              {/* 猎狗跑道 (上方跑道 y=50) */}
              {(() => {
                const dogPercent = Math.min(1, dogCurrentPos / totalCourseLength);
                const dogX = 40 + dogPercent * 480;
                return (
                  <g transform={`translate(${dogX}, 45)`}>
                    <circle cx="0" cy="0" r="14" fill="#ea580c" />
                    <text x="0" y="4" textAnchor="middle" fontSize="12" fill="#ffffff">🐕</text>
                    <text x="0" y="-18" textAnchor="middle" fontSize="9" fontWeight="800" fill="#c2410c">
                      猎狗 ({Math.round(currentRound * cur.dogFreq)}步)
                    </text>
                  </g>
                );
              })()}

              {/* 野兔跑道 (下方跑道 y=90) */}
              {(() => {
                const rabPercent = Math.min(1, rabbitCurrentPos / totalCourseLength);
                const rabX = 40 + rabPercent * 480;
                return (
                  <g transform={`translate(${rabX}, 85)`}>
                    <circle cx="0" cy="0" r="14" fill="#0284c7" />
                    <text x="0" y="4" textAnchor="middle" fontSize="12" fill="#ffffff">🐇</text>
                    <text x="0" y="24" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0369a1">
                      野兔 (+{Math.round(currentRound * cur.rabFreq)}步)
                    </text>
                  </g>
                );
              })()}

              {/* 捕获特效 */}
              {isCaught && (
                <g transform="translate(520, 68)">
                  <rect x="-40" y="-14" width="80" height="28" rx="6" fill="#dc2626" />
                  <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="900" fill="#ffffff">
                    🎉 成功捉住！
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* 实时动态仪表盘 */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}>
            <div style={{ background: '#fff7ed', padding: '10px', borderRadius: '8px', border: '1px solid #fed7aa', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c2410c' }}>猎狗已跑总步数</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ea580c', marginTop: '2px' }}>
                {Math.round(currentRound * cur.dogFreq)} <span style={{ fontSize: '0.8rem' }}>/ {totalDogStepsNeeded} 步</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>每轮跑 {cur.dogFreq} 步</div>
            </div>

            <div style={{ background: '#f0f9ff', padding: '10px', borderRadius: '8px', border: '1px solid #bae6fd', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>当前剩余距离差距</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>
                {remainingGap} <span style={{ fontSize: '0.8rem' }}>单位</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>开局差 {initialDistanceGap} 单位</div>
            </div>

            <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '8px', border: '1px solid #86efac', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46' }}>推进轮次进阶</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#16a34a', marginTop: '2px' }}>
                {currentRound} <span style={{ fontSize: '0.8rem' }}>/ {totalRoundsNeeded} 轮</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 700 }}>
                {isCaught ? '已成功追及' : `还需 ${totalRoundsNeeded - currentRound} 轮`}
              </div>
            </div>
          </div>

          {/* 控制按钮组 */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', width: '100%' }}>
            <button
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: '8px',
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span>{isPlaying ? '暂停奔跑' : '▶ 动态模拟追赶'}</span>
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
              onClick={() => {
                setIsPlaying(false);
                setCurrentRound(0);
              }}
            >
              <RotateCcw size={15} />
              重置起点
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

