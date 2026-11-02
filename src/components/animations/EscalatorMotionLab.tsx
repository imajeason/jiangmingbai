'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/animations.module.css';
import { Footprints, Play, Pause, RotateCcw, ArrowUp, ArrowDown, Activity, Sparkles, HelpCircle } from 'lucide-react';

export default function EscalatorMotionLab() {
  const [motionMode, setMotionMode] = useState<'with' | 'against' | 'stand'>('with');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); // 0 to 100%

  // 常量设定：露在外面的总台阶数 N = 60 级
  const totalStepsN = 60;
  const personSpeed = 2; // 人迈步速度：2 级/秒
  const escalatorSpeed = 1; // 扶梯自身速度：1 级/秒 (向上运送)

  // 顺行：合速度 2 + 1 = 3 级/秒，用时 20 秒，人数了 40 步，电梯送了 20 步
  // 逆行：合速度 2 - 1 = 1 级/秒，用时 60 秒，人数了 120 步，电梯倒退了 60 步
  // 站立：合速度 0 + 1 = 1 级/秒，用时 60 秒，人数了 0 步，电梯送了 60 步

  const durationSec = motionMode === 'with' ? 20 : 60;
  const personCount = motionMode === 'with' ? 40 : motionMode === 'against' ? 120 : 0;
  const escalatorCount = motionMode === 'with' ? 20 : motionMode === 'against' ? 60 : 60;

  // 动画计时器
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const stepInterval = 100 / (durationSec * 30); // 30fps
      animId = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + stepInterval;
        });
      }, 33);
    }
    return () => clearInterval(animId);
  }, [isPlaying, durationSec]);

  const handleModeChange = (mode: 'with' | 'against' | 'stand') => {
    setMotionMode(mode);
    setIsPlaying(false);
    setProgress(0);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  // 当前实时数据
  const currentTotalWalked = (progress / 100) * totalStepsN;
  const currentPersonSteps = Math.round((progress / 100) * personCount);
  const currentEscalatorSteps = Math.round((progress / 100) * escalatorCount);

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Activity size={18} style={{ color: '#0284c7' }} />
          <span>行程问题压轴之王：自动扶梯问题（隐形流水行船）</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${motionMode === 'with' ? styles.controlBtnActive : ''}`}
            onClick={() => handleModeChange('with')}
          >
            <ArrowUp size={14} />
            <span>顺行向上 (电梯助力，数得少)</span>
          </button>
          <button
            className={`${styles.controlBtn} ${motionMode === 'against' ? styles.controlBtnActive : ''}`}
            onClick={() => handleModeChange('against')}
          >
            <ArrowDown size={14} />
            <span>逆行向下 (电梯拖累，数得多)</span>
          </button>
          <button
            className={`${styles.controlBtn} ${motionMode === 'stand' ? styles.controlBtnActive : ''}`}
            onClick={() => handleModeChange('stand')}
          >
            <Footprints size={14} />
            <span>站立不动 (全靠电梯送)</span>
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* 核心扶梯仿真画布 */}
        <div style={{
          width: '100%',
          maxWidth: '640px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <svg viewBox="0 0 500 240" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
            <defs>
              <linearGradient id="stairGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>

            {/* 楼层地基 */}
            <rect x="20" y="195" width="100" height="25" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" rx="4" />
            <text x="70" y="212" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#64748b">1 楼地面</text>

            <rect x="380" y="45" width="100" height="25" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" rx="4" />
            <text x="430" y="62" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#64748b">2 楼地面</text>

            {/* 扶梯斜坡骨架 (总跨度从 (120, 195) 到 (380, 70)) */}
            <line x1="120" y1="205" x2="380" y2="70" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" />
            <line x1="120" y1="195" x2="380" y2="60" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

            {/* 扶梯运动方向指示箭头 */}
            <g transform="translate(230, 115) rotate(-27)">
              <rect x="-40" y="-12" width="80" height="24" rx="12" fill="#0284c7" opacity="0.9" />
              <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff">
                扶梯向上 ↑ 1级/秒
              </text>
            </g>

            {/* 扶梯台阶锯齿线 */}
            {Array.from({ length: 12 }).map((_, idx) => {
              const ratio = idx / 11;
              const sx = 120 + ratio * (380 - 120);
              const sy = 195 - ratio * (195 - 70);
              return (
                <rect
                  key={idx}
                  x={sx - 10}
                  y={sy - 6}
                  width="18"
                  height="10"
                  fill="url(#stairGrad)"
                  stroke="#64748b"
                  strokeWidth="1"
                  rx="1"
                />
              );
            })}

            {/* 小明人物坐标计算 */}
            {(() => {
              // 顺行：从 1 楼 (120, 195) 走向 2 楼 (380, 70)
              // 逆行：从 2 楼 (380, 70) 走向 1 楼 (120, 195)
              // 站立：从 1 楼 (120, 195) 随扶梯运到 2 楼
              const p = progress / 100;
              let px = 120 + p * (380 - 120);
              let py = 195 - p * (195 - 70) - 26;

              if (motionMode === 'against') {
                px = 380 - p * (380 - 120);
                py = 70 + p * (195 - 70) - 26;
              }

              return (
                <g transform={`translate(${px}, ${py})`}>
                  {/* 人物身体卡通 */}
                  <circle cx="0" cy="0" r="10" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
                  <rect x="-6" y="10" width="12" height="16" rx="3" fill="#3b82f6" />
                  {/* 小腿 */}
                  <line x1="-3" y1="26" x2="-3" y2="34" stroke="#1e293b" strokeWidth="2.5" />
                  <line x1="3" y1="26" x2="3" y2="34" stroke="#1e293b" strokeWidth="2.5" />
                  
                  {/* 计步器发光气泡 */}
                  <g transform="translate(0, -22)">
                    <rect x="-38" y="-12" width="76" height="20" rx="10" fill="#0f172a" />
                    <text x="0" y="2" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#38bdf8">
                      已走 {currentPersonSteps} 步
                    </text>
                  </g>
                </g>
              );
            })()}

            {/* 终点指示文字 */}
            <text x="250" y="232" textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="600">
              露在外面的扶梯总台阶数：恒为 N = 60 级
            </text>
          </svg>

          {/* 核心步数拆解仪表盘 */}
          <div style={{
            marginTop: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px'
          }}>
            {/* 人走的步数 */}
            <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>小明脚踩的步数 (自己数出来的)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1d4ed8', marginTop: '2px' }}>
                {currentPersonSteps} <span style={{ fontSize: '0.8rem' }}>/ {personCount} 步</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                速度：{motionMode === 'stand' ? '0' : personSpeed} 级/秒
              </div>
            </div>

            {/* 扶梯贡献的步数 */}
            <div style={{ background: '#fff7ed', padding: '12px', borderRadius: '8px', border: '1px solid #fed7aa' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9a3412' }}>
                扶梯自身运送/倒退的步数
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#c2410c', marginTop: '2px' }}>
                {motionMode === 'against' ? `倒退 -${currentEscalatorSteps}` : `助力 +${currentEscalatorSteps}`}{' '}
                <span style={{ fontSize: '0.8rem' }}>/ {escalatorCount} 步</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                速度：{escalatorSpeed} 级/秒
              </div>
            </div>

            {/* 总台阶守恒公式 */}
            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>露在外面的总台阶数 N</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#166534', marginTop: '2px' }}>
                {totalStepsN} 级 (绝对守恒)
              </div>
              <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600 }}>
                {motionMode === 'with' && '40 (人走) + 20 (梯送) = 60 级'}
                {motionMode === 'against' && '120 (人走) - 60 (梯退) = 60 级'}
                {motionMode === 'stand' && '0 (人走) + 60 (梯送) = 60 级'}
              </div>
            </div>
          </div>

          {/* 流水行船本质对比卡 */}
          <div style={{
            marginTop: '14px',
            padding: '12px 14px',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '0.825rem',
            color: '#334155',
            lineHeight: 1.6
          }}>
            <strong>💡 一眼看透“流水行船”孪生兄弟：</strong>
            <br />
            • <strong>顺行向上</strong>：好比“顺水行船”！扶梯在后面推着你，你每走一步电梯帮你往前送一步，所以<strong>自己数的步数少</strong>（只有 40 步）；
            <br />
            • <strong>逆行向下</strong>：好比“逆水行舟”！扶梯在不断把你往后拉，你必须多迈出整整 60 步去对冲电梯的倒退，所以<strong>自己数的步数翻倍多</strong>（高达 120 步）！
          </div>
        </div>

        {/* 播放控制与重置栏 */}
        <div style={{
          marginTop: '16px',
          width: '100%',
          maxWidth: '640px',
          background: '#ffffff',
          padding: '14px 18px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              <span>全程进度滑块：</span>
              <span style={{ color: '#0284c7' }}>{progress.toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => {
                setProgress(Number(e.target.value));
                setIsPlaying(false);
              }}
              style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className={`${styles.controlBtn} ${isPlaying ? styles.controlBtnActive : ''}`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? '暂停' : progress >= 100 ? '重新播放' : '开始跑动'}</span>
            </button>
            <button className={styles.controlBtn} onClick={handleReset}>
              <RotateCcw size={14} />
              <span>回到起点</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

