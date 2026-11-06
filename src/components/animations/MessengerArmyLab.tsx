'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/animations.module.css';
import { Compass, Play, Pause, RotateCcw, Sparkles, Flag, ArrowRight } from 'lucide-react';

export default function MessengerArmyLab() {
  // 参数配置
  const [L, setL] = useState<number>(400); // 队伍长 (米)
  const [v1, setV1] = useState<number>(50); // 队伍行进速度 (米/分)
  const [v2, setV2] = useState<number>(150); // 传令兵速度 (米/分)

  // 物理与时间推导
  // 阶段 1：追及队首 (速度差)
  const t1 = L / (v2 - v1);
  const s1_messenger = v2 * t1; // 传令兵去程路程
  const s1_troop = v1 * t1; // 队伍去程位移

  // 阶段 2：迎面相遇队尾 (速度和)
  const t2 = L / (v2 + v1);
  const s2_messenger = v2 * t2; // 传令兵回程路程
  const s2_troop = v1 * t2; // 队伍回程位移

  const totalTime = t1 + t2;
  const totalMessengerDist = s1_messenger + s2_messenger;
  const totalTroopDist = s1_troop + s2_troop;

  // 动画状态：当前时间 t (0 ~ totalTime)
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // 动画播放循环
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const step = () => {
        setCurrentTime((prev) => {
          if (prev >= totalTime) {
            setIsPlaying(false);
            return totalTime;
          }
          return Math.min(totalTime, prev + 0.04);
        });
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, totalTime]);

  // 计算当前瞬间的位置 (以初始队尾在地面 0米处为坐标原点)
  const troopTailPos = v1 * currentTime;
  const troopHeadPos = troopTailPos + L;

  let messengerPos = 0;
  let isGoingForward = true;

  if (currentTime <= t1) {
    // 阶段1：向前追赶
    isGoingForward = true;
    messengerPos = v2 * currentTime;
  } else {
    // 阶段2：向后迎遇
    isGoingForward = false;
    const timeInPhase2 = currentTime - t1;
    messengerPos = s1_messenger - v2 * timeInPhase2;
  }

  // 画布坐标映射 (0米 ~ 1100米 映射到 50px ~ 750px)
  const maxMeters = 1100;
  const mapX = (meters: number) => 50 + (meters / maxMeters) * 700;

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flag className={styles.icon} />
          <h2 className={styles.title}>传令兵与队伍行进问题动态实验室</h2>
        </div>
        <p className={styles.description}>
          队伍向前行进，通信员从队尾疾驰到队首再返回！去程是“追及（速度差）”，回程是“相遇（速度和）”。
        </p>
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
        {/* 顶部阶段提示 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                backgroundColor: currentTime <= t1 ? '#e0e7ff' : '#fee2e2',
                color: currentTime <= t1 ? '#4338ca' : '#b91c1c',
              }}
            >
              {currentTime <= t1 ? '🚩 阶段一：去程追及队首 (速度差)' : '🔄 阶段二：回程相遇队尾 (速度和)'}
            </span>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
              当前时间: {currentTime.toFixed(2)} 分钟 / 总时长 {totalTime.toFixed(2)} 分钟
            </span>
          </div>

          <div style={{ fontSize: '12px', fontWeight: 600, color: '#059669' }}>
            队伍长 L={L}m | 队速={v1}m/分 | 兵速={v2}m/分
          </div>
        </div>

        {/* 物理运动矢量图 (SVG) */}
        <svg width="800" height="240" viewBox="0 0 800 240" style={{ width: '100%', minWidth: '700px' }}>
          {/* 地面参考线与刻度 */}
          <line x1="50" y1="200" x2="750" y2="200" stroke="#94a3b8" strokeWidth="2" />
          {[0, 200, 400, 600, 800, 1000].map((m) => (
            <g key={m} transform={`translate(${mapX(m)}, 200)`}>
              <line x1="0" y1="0" x2="0" y2="8" stroke="#64748b" strokeWidth="1.5" />
              <text x="0" y="22" fontSize="11" fill="#64748b" textAnchor="middle" fontWeight="bold">
                {m}m
              </text>
            </g>
          ))}

          {/* 队伍行进长条 (矩形方阵) */}
          <g>
            <rect
              x={mapX(troopTailPos)}
              y="70"
              width={mapX(troopHeadPos) - mapX(troopTailPos)}
              height="45"
              rx="6"
              fill="#bfdbfe"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            {/* 队伍内部士兵队列点缀 */}
            <text
              x={(mapX(troopTailPos) + mapX(troopHeadPos)) / 2}
              y="97"
              fontSize="13"
              fill="#1e40af"
              fontWeight="bold"
              textAnchor="middle"
            >
              行进方队 (长 {L}m, 速度 {v1}m/分 ➡️)
            </text>

            {/* 队尾标记 */}
            <line
              x1={mapX(troopTailPos)}
              y1="60"
              x2={mapX(troopTailPos)}
              y2="125"
              stroke="#2563eb"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
            <text x={mapX(troopTailPos)} y="55" fontSize="11" fill="#2563eb" textAnchor="middle" fontWeight="bold">
              队尾 ({Math.round(troopTailPos)}m)
            </text>

            {/* 队首标记与旗帜 */}
            <line
              x1={mapX(troopHeadPos)}
              y1="60"
              x2={mapX(troopHeadPos)}
              y2="125"
              stroke="#2563eb"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
            <text x={mapX(troopHeadPos)} y="55" fontSize="11" fill="#2563eb" textAnchor="middle" fontWeight="bold">
              🚩 队首 ({Math.round(troopHeadPos)}m)
            </text>
          </g>

          {/* 传令兵轨迹指示线 */}
          <line
            x1={mapX(0)}
            y1="160"
            x2={mapX(messengerPos)}
            y2="160"
            stroke={isGoingForward ? '#f97316' : '#ec4899'}
            strokeWidth="3"
            strokeDasharray="4,2"
          />

          {/* 传令兵动体 */}
          <g transform={`translate(${mapX(messengerPos)}, 160)`}>
            <circle cx="0" cy="0" r="14" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
            <text x="0" y="4" fontSize="14" textAnchor="middle">
              {isGoingForward ? '🚴‍♂️' : '🚴'}
            </text>
            <text x="0" y="28" fontSize="11" fill="#ea580c" textAnchor="middle" fontWeight="bold">
              传令兵 ({Math.round(messengerPos)}m)
            </text>
            {/* 方向箭头 */}
            <text x={isGoingForward ? 22 : -22} y="4" fontSize="14" fill="#ea580c">
              {isGoingForward ? '➡️' : '⬅️'}
            </text>
          </g>

          {/* 关键位移地标 (地面里程点) */}
          {/* 去程相遇点: 600m */}
          <circle cx={mapX(s1_messenger)} cy="200" r="4" fill="#4f46e5" />
          <text x={mapX(s1_messenger)} y="190" fontSize="10" fill="#4f46e5" textAnchor="middle" fontWeight="bold">
            追到队首处 ({s1_messenger}m)
          </text>

          {/* 最终相遇点: 300m */}
          <circle cx={mapX(totalTroopDist)} cy="200" r="4" fill="#16a34a" />
          <text x={mapX(totalTroopDist)} y="190" fontSize="10" fill="#16a34a" textAnchor="middle" fontWeight="bold">
            返回队尾终点 ({totalTroopDist}m)
          </text>
        </svg>

        {/* 动画播放控制器 */}
        <div
          style={{
            marginTop: '12px',
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
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              {isPlaying ? '暂停' : currentTime >= totalTime ? '重新回放' : '播放行进动画'}
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

          {/* 时间进度滑块 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>时间进度:</span>
            <input
              type="range"
              min="0"
              max={totalTime}
              step="0.01"
              value={currentTime}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentTime(parseFloat(e.target.value));
              }}
              style={{ flex: 1, cursor: 'pointer' }}
            />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', width: '55px' }}>
              {currentTime.toFixed(1)}分
            </span>
          </div>
        </div>
      </div>

      {/* 分阶段推导与严谨算式 */}
      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* 阶段 1 卡片 */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>🏃</span>
            <span style={{ fontWeight: 700, color: '#4338ca', fontSize: '14px' }}>
              阶段一：去程追及队首 (速度差)
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
            <div>
              • 相对速度（速度差）：{v2} - {v1} = <b>{v2 - v1} 米/分</b>
            </div>
            <div>
              • 追及耗时：t₁ = {L} ÷ {v2 - v1} = <b>{t1.toFixed(1)} 分钟</b>
            </div>
            <div>
              • 传令兵跑程：S₁ = {v2} × {t1} = <b>{s1_messenger} 米</b>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              此时队伍队首已前移至 {s1_messenger} 米处！
            </div>
          </div>
        </div>

        {/* 阶段 2 卡片 */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>🚴</span>
            <span style={{ fontWeight: 700, color: '#b91c1c', fontSize: '14px' }}>
              阶段二：回程相遇队尾 (速度和)
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
            <div>
              • 相对速度（速度和）：{v2} + {v1} = <b>{v2 + v1} 米/分</b>
            </div>
            <div>
              • 相遇耗时：t₂ = {L} ÷ {v2 + v1} = <b>{t2.toFixed(1)} 分钟</b>
            </div>
            <div>
              • 传令兵跑程：S₂ = {v2} × {t2} = <b>{s2_messenger} 米</b>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              传令兵迎风往回跑，仅用 2 分钟便与迎面而来的队尾相遇！
            </div>
          </div>
        </div>
      </div>

      {/* 最终结果汇总大条 */}
      <div
        style={{
          marginTop: '16px',
          background: '#f0fdf4',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #bbf7d0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles color="#16a34a" size={20} />
          <div>
            <div style={{ fontWeight: 700, color: '#15803d', fontSize: '15px' }}>
              核心答案汇总：通信员总路程 = {totalMessengerDist} 米，队伍前进 = {totalTroopDist} 米
            </div>
            <div style={{ fontSize: '13px', color: '#166534', marginTop: '2px' }}>
              总时间 = {t1} + {t2} = {totalTime} 分钟 | 通信员总路程 = {v2} × {totalTime} = {totalMessengerDist} 米
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
