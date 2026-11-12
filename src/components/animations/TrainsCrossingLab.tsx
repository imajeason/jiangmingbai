'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/animations.module.css';
import { Train, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

export default function TrainsCrossingLab() {
  const [mode, setMode] = useState<'opposite' | 'overtake' | 'passenger'>('opposite');
  // 参数设定
  const [L1, setL1] = useState<number>(150); // 甲车长 (米)
  const [v1, setV1] = useState<number>(25); // 甲车速 (米/秒)
  const [L2, setL2] = useState<number>(250); // 乙车长 (米)
  const [v2, setV2] = useState<number>(15); // 乙车速 (米/秒)

  // 物理计算
  const relDist = mode === 'passenger' ? L1 : L1 + L2;
  const relSpeed = mode === 'overtake' ? v1 - v2 : v1 + v2;
  const safeRelSpeed = Math.max(1, relSpeed);
  const totalTime = relDist / safeRelSpeed;

  // 动画时间进度 (0 到 totalTime)
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const step = () => {
        setCurrentTime((prev) => {
          if (prev >= totalTime) {
            setIsPlaying(false);
            return totalTime;
          }
          return Math.min(totalTime, prev + 0.08);
        });
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, totalTime]);

  // 动画位置计算 (采用相对运动参照系或者地面参照系)
  // 以相对运动展示最直观：把乙车固定在中央 (x=200 ~ 450)，甲车从左/右驶过
  // 视口宽度 700px
  const scale = 0.8; // 1米 = 0.8px

  // 乙车 (慢车) 固定位置 (中央)
  const train2Left = 240;
  const train2Width = L2 * scale;

  // 甲车 (快车) 当前车头 X 坐标
  let train1HeadX = 0;
  if (mode === 'opposite') {
    // 迎面错车：从 t=0 时车头刚好对碰 (train1HeadX = train2Left) 到 t=totalTime 车尾彻底离开 (train1TailX = train2Left + train2Width)
    // 即甲车车头从 train2Left 向右开到 train2Left + train2Width + L1*scale
    const startHeadX = train2Left - 60;
    const endHeadX = train2Left + train2Width + L1 * scale;
    train1HeadX = startHeadX + (currentTime / totalTime) * (endHeadX - startHeadX);
  } else if (mode === 'overtake') {
    // 同向超车：从甲车车头到达乙车车尾 (train1HeadX = train2Left) 到甲车车尾离开乙车车头 (train1HeadX = train2Left + train2Width + L1*scale)
    const startHeadX = train2Left - 40;
    const endHeadX = train2Left + train2Width + L1 * scale;
    train1HeadX = startHeadX + (currentTime / totalTime) * (endHeadX - startHeadX);
  } else {
    // 乘客视角：小明在乙车车头 (train2Left 处)，甲车从车头驶到车尾
    const startHeadX = train2Left - 20;
    const endHeadX = train2Left + L1 * scale;
    train1HeadX = startHeadX + (currentTime / totalTime) * (endHeadX - startHeadX);
  }

  const train1Width = L1 * scale;
  const train1Left = train1HeadX - train1Width;

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Train className={styles.icon} />
          <h2 className={styles.title}>双火车错车与超车动态实验室</h2>
        </div>
        <p className={styles.description}>
          两列有长度的火车相对运动！相向错车相对速度为两车速度和，同向超车为速度差，相对位移永远是两车长之和。
        </p>
      </div>

      {/* 模式选择 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            setMode('opposite');
            setCurrentTime(0);
            setIsPlaying(false);
          }}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: mode === 'opposite' ? '#4f46e5' : '#f1f5f9',
            color: mode === 'opposite' ? '#ffffff' : '#475569',
          }}
        >
          🚂 迎面相向错车（速度和）
        </button>
        <button
          onClick={() => {
            setMode('overtake');
            setCurrentTime(0);
            setIsPlaying(false);
          }}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: mode === 'overtake' ? '#ea580c' : '#f1f5f9',
            color: mode === 'overtake' ? '#ffffff' : '#475569',
          }}
        >
          🚄 同向追赶超车（速度差）
        </button>
        <button
          onClick={() => {
            setMode('passenger');
            setCurrentTime(0);
            setIsPlaying(false);
          }}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: mode === 'passenger' ? '#059669' : '#f1f5f9',
            color: mode === 'passenger' ? '#ffffff' : '#475569',
          }}
        >
          👤 窗口乘客看车（只看对向车长）
        </button>
      </div>

      {/* 动画主画板 */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          padding: '20px 16px',
          border: '1px solid #e2e8f0',
          position: 'relative',
          overflowX: 'auto',
        }}
      >
        <svg width="700" height="210" viewBox="0 0 700 210" style={{ width: '100%', minWidth: '650px' }}>
          {/* 上铁轨（甲车车道） */}
          <line x1="20" y1="75" x2="680" y2="75" stroke="#94a3b8" strokeWidth="3" />
          {/* 下铁轨（乙车车道） */}
          <line x1="20" y1="145" x2="680" y2="145" stroke="#94a3b8" strokeWidth="3" />

          {/* 枕木 */}
          {Array.from({ length: 30 }).map((_, i) => (
            <React.Fragment key={i}>
              <line x1={40 + i * 22} y1="68" x2={40 + i * 22} y2="82" stroke="#cbd5e1" strokeWidth="2" />
              <line x1={40 + i * 22} y1="138" x2={40 + i * 22} y2="152" stroke="#cbd5e1" strokeWidth="2" />
            </React.Fragment>
          ))}

          {/* 乙车 (慢车，下方车道) */}
          <g transform={`translate(${train2Left}, 125)`}>
            <rect
              x="0"
              y="0"
              width={train2Width}
              height="32"
              rx="5"
              fill="#bfdbfe"
              stroke="#2563eb"
              strokeWidth="2"
            />
            <text x={train2Width / 2} y="20" fontSize="11" fill="#1e40af" fontWeight="bold" textAnchor="middle">
              乙车 (长 {L2}m, 速度 {v2}m/s)
            </text>
            {/* 乘客标记 (如果在乘客模式) */}
            {mode === 'passenger' && (
              <g transform="translate(10, -8)">
                <circle cx="0" cy="0" r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <text x="0" y="3" fontSize="10" textAnchor="middle">
                  👤
                </text>
                <text x="25" y="4" fontSize="10" fill="#b45309" fontWeight="bold">
                  小明 (窗口质点)
                </text>
              </g>
            )}
          </g>

          {/* 甲车 (快车，上方车道) */}
          <g transform={`translate(${train1Left}, 55)`}>
            <rect
              x="0"
              y="0"
              width={train1Width}
              height="32"
              rx="5"
              fill="#fed7aa"
              stroke="#ea580c"
              strokeWidth="2"
            />
            <text x={train1Width / 2} y="20" fontSize="11" fill="#9a3412" fontWeight="bold" textAnchor="middle">
              甲车 (长 {L1}m, 速度 {v1}m/s ➡️)
            </text>
            {/* 车头与车尾标记 */}
            <circle cx={train1Width} cy="16" r="4" fill="#dc2626" />
            <circle cx="0" cy="16" r="4" fill="#64748b" />
          </g>

          {/* 相对路程标注卡尺 (L1 + L2) */}
          <line x1={train2Left} y1="185" x2={train2Left + relDist * scale} y2="185" stroke="#4f46e5" strokeWidth="2" />
          <line x1={train2Left} y1="178" x2={train2Left} y2="192" stroke="#4f46e5" strokeWidth="2" />
          <line
            x1={train2Left + relDist * scale}
            y1="178"
            x2={train2Left + relDist * scale}
            y2="192"
            stroke="#4f46e5"
            strokeWidth="2"
          />
          <text
            x={train2Left + (relDist * scale) / 2}
            y="180"
            fontSize="11"
            fill="#4338ca"
            fontWeight="bold"
            textAnchor="middle"
          >
            相对路程 S = {relDist} 米 {mode === 'passenger' ? '(仅甲车长)' : `(${L1}m + ${L2}m)`}
          </text>
        </svg>

        {/* 动画控制器 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            background: '#ffffff',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isPlaying ? '#f59e0b' : '#4f46e5',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? '暂停' : currentTime >= totalTime ? '重新回放' : '播放错车动画'}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentTime(0);
              }}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>时间进度:</span>
            <input
              type="range"
              min="0"
              max={totalTime}
              step="0.05"
              value={currentTime}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentTime(parseFloat(e.target.value));
              }}
              style={{ flex: 1, cursor: 'pointer' }}
            />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', width: '60px' }}>
              {currentTime.toFixed(1)} / {totalTime.toFixed(1)}秒
            </span>
          </div>
        </div>
      </div>

      {/* 算式与原理解析 */}
      <div
        style={{
          marginTop: '16px',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles color="#4f46e5" size={18} />
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>
            {mode === 'opposite' && '相向错车：相对路程 = 两车长之和，相对速度 = 速度之和'}
            {mode === 'overtake' && '同向超车：相对路程 = 两车长之和，相对速度 = 速度之差'}
            {mode === 'passenger' && '乘客看车：乘客无长度，相对路程 = 单列对方车长'}
          </span>
        </div>
        <div
          style={{
            background: '#f8fafc',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 700,
            color: '#1e293b',
          }}
        >
          时间 t = {relDist} 米 ÷ {safeRelSpeed} 米/秒 ={' '}
          <span style={{ color: '#4f46e5', fontSize: '18px' }}>{totalTime.toFixed(2)} 秒</span>
        </div>
      </div>
    </div>
  );
}

