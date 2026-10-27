'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  FastForward, 
  Compass, 
  Gauge, 
  Milestone
} from 'lucide-react';
import styles from '@/styles/animations.module.css';

interface Preset {
  id: string;
  name: string;
  mode: 'chase' | 'meet';
  trackLength: number;
  vA: number;
  vB: number;
  title: string;
  desc: string;
}

const PRESETS: Preset[] = [
  {
    id: 'standard-chase',
    name: '经典题型一：400米跑道同向追及',
    mode: 'chase',
    trackLength: 400,
    vA: 6, // 快者 6 m/s
    vB: 4, // 慢者 4 m/s
    title: '同向起跑：快者何时第一次套圈追上慢者？',
    desc: '环形追及本质：快者必须比慢者多跑整整一圈（400米）！速度差为 6 - 4 = 2 m/s，时间 = 400 ÷ 2 = 200 秒。',
  },
  {
    id: 'standard-meet',
    name: '经典题型二：400米跑道反向相遇',
    mode: 'meet',
    trackLength: 400,
    vA: 5,
    vB: 3,
    title: '背向而跑：两人何时第一次迎面相遇？',
    desc: '环形相遇本质：两人从同一点背向跑，相遇时两人跑过的路程合起来正好等于一整圈（400米）！时间 = 400 ÷ (5 + 3) = 50 秒。',
  },
  {
    id: 'lap2-chase',
    name: '经典题型三：第二次追上（套两圈）',
    mode: 'chase',
    trackLength: 300,
    vA: 7,
    vB: 4,
    title: '300米操场：第二次套圈追上需要多久？',
    desc: '每追上一次多跑一圈（300m），追上第二次多跑两整圈（600m）！时间 = 600 ÷ (7 - 4) = 200 秒。',
  },
  {
    id: 'bike-walk',
    name: '经典题型四：骑车与步行相遇',
    mode: 'meet',
    trackLength: 600,
    vA: 8, // 骑车 8m/s
    vB: 2, // 步行 2m/s
    title: '600米环湖路：骑车与步行何时相遇？',
    desc: '速度和为 8 + 2 = 10 m/s，两人合跑 600 米相向而行，时间 = 600 ÷ 10 = 60 秒。',
  },
];

export default function CircularTrackLab() {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [mode, setMode] = useState<'chase' | 'meet'>('chase');
  const [trackLength, setTrackLength] = useState<number>(400); // 跑道周长 L (m)
  const [vA, setVA] = useState<number>(6); // 快者 A 速度 (m/s)
  const [vB, setVB] = useState<number>(4); // 慢者 B 速度 (m/s)
  const [simTime, setSimTime] = useState<number>(0); // 仿真时间 (秒)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showStraightView, setShowStraightView] = useState<boolean>(true); // 是否展示“剪开拉直”展开视图
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(2); // 播放倍速

  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // 关键物理量计算
  const deltaV = mode === 'chase' ? Math.max(0.1, vA - vB) : vA + vB;
  // 第一次达成所需理论时间
  const firstEventTime = trackLength / deltaV;

  // 切换预设
  const handleSelectPreset = (p: Preset) => {
    setSelectedPreset(p);
    setMode(p.mode);
    setTrackLength(p.trackLength);
    setVA(p.vA);
    setVB(p.vB);
    setSimTime(0);
    setIsPlaying(false);
  };

  // 动画计时器循环
  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const onFrame = (now: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = now;
      }
      const dt = (now - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = now;

      setSimTime((prev) => {
        const next = prev + dt * speedMultiplier;
        // 如果达到两倍事件时间后自动暂停
        if (next >= firstEventTime * 2.2) {
          setIsPlaying(false);
          return firstEventTime * 2.2;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(onFrame);
    };

    animFrameRef.current = requestAnimationFrame(onFrame);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, speedMultiplier, firstEventTime]);

  // 计算当前路程与跑道位置
  const distA = vA * simTime;
  const distB = vB * simTime;

  // 圈数
  const lapsA = distA / trackLength;
  const lapsB = distB / trackLength;

  // 在圆周上的角度 (弧度)
  // 起点在正上方 ( -PI/2 )
  const angleA = -Math.PI / 2 + (distA / trackLength) * 2 * Math.PI;
  const angleB = mode === 'chase' 
    ? -Math.PI / 2 + (distB / trackLength) * 2 * Math.PI
    : -Math.PI / 2 - (distB / trackLength) * 2 * Math.PI;

  // 差距或合路程
  const diffOrSum = mode === 'chase' ? distA - distB : distA + distB;
  const currentRatio = diffOrSum / trackLength; // 完成了几圈的差/和
  const isFirstEventReached = currentRatio >= 1.0;
  const isSecondEventReached = currentRatio >= 2.0;

  // 跑道圆参数
  const cx = 150;
  const cy = 150;
  const radius = 105;

  // 坐标
  const posAx = cx + radius * Math.cos(angleA);
  const posAy = cy + radius * Math.sin(angleA);

  const posBx = cx + radius * Math.cos(angleB);
  const posBy = cy + radius * Math.sin(angleB);

  return (
    <div className={styles.labContainer} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 顶部标题栏 */}
      <div className={styles.labToolbar} style={{ flexWrap: 'wrap', gap: '10px' }}>
        <div className={styles.labTitle}>
          <Compass className="w-5 h-5 text-indigo-600" />
          <span>环形跑道实验室：同向追上一圈，反向合跑一圈</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          四年级数学 · 行程问题核心模型
        </div>
      </div>

      {/* 预设题型选择栏（换行流式排列） */}
      <div style={{ padding: '12px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
          选择常考题型预设：
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {PRESETS.map((p) => {
            const isSel = p.id === selectedPreset.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                style={{
                  flex: '1 1 200px',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: isSel ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                  background: isSel ? '#eef2ff' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: isSel ? '0 2px 8px rgba(79, 70, 229, 0.15)' : 'none',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isSel ? '#3730a3' : '#1e293b' }}>
                  {p.name.split('：')[0]}
                </div>
                <div style={{ fontSize: '0.74rem', color: isSel ? '#4f46e5' : '#64748b', marginTop: '2px' }}>
                  {p.mode === 'chase' ? '🏃‍♂️➡️ 同向追及' : '🏃‍♂️⬅️ 反向相遇'} | 周长 {p.trackLength}m
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 题意引导条 */}
      <div
        style={{
          padding: '12px 20px',
          background: '#fffbeb',
          borderBottom: '1px solid #fef3c7',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0" style={{ marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#92400e' }}>
            {selectedPreset.title}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#b45309', marginTop: '3px' }}>
            💡 核心思维：{selectedPreset.desc}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 核心动效与控制大舞台（控制按钮紧贴动画正下方，直观好找！） */}
      {/* ======================================================== */}
      <div style={{ padding: '20px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        {/* 视点切换提示栏 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Gauge className="w-4 h-4 text-indigo-600" />
            <span>【跑道动效主舞台】圆形跑道实时跑动 + 剪开拉直线段图</span>
          </div>

          <button
            onClick={() => setShowStraightView(!showStraightView)}
            style={{
              fontSize: '0.8rem',
              color: '#4f46e5',
              background: '#eef2ff',
              border: '1px solid #c7d2fe',
              borderRadius: '6px',
              padding: '4px 10px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {showStraightView ? '收起拉直展开图' : '展开“剪开拉直”透视图'}
          </button>
        </div>

        {/* 动画主视觉：圆形跑道 + 剪开拉直图 */}
        <div style={{ display: 'grid', gridTemplateColumns: showStraightView ? 'repeat(auto-fit, minmax(290px, 1fr))' : '1fr', gap: '18px', alignItems: 'center' }}>
          {/* 圆形跑道俯瞰视图 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid #e2e8f0',
            }}
          >
            <svg width="280" height="280" viewBox="0 0 300 300">
              <defs>
                <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ecfdf5" />
                  <stop offset="100%" stopColor="#d1fae5" />
                </radialGradient>
              </defs>

              {/* 操场内部草坪 */}
              <circle cx={cx} cy={cy} r={radius} fill="url(#fieldGrad)" />

              {/* 红色标准塑胶跑道外环与内环 */}
              <circle cx={cx} cy={cy} r={radius + 18} fill="none" stroke="#fed7aa" strokeWidth="36" />
              <circle cx={cx} cy={cy} r={radius + 36} fill="none" stroke="#ea580c" strokeWidth="2" opacity="0.4" />
              <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#ea580c" strokeWidth="2" opacity="0.4" />

              {/* 跑道白色中心参考虚线 */}
              <circle
                cx={cx}
                cy={cy}
                r={radius + 18}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="6 6"
                opacity="0.8"
              />

              {/* 起点标志线 🏁 (正上方) */}
              <line
                x1={cx}
                y1={cy - radius - 36}
                x2={cx}
                y2={cy - radius}
                stroke="#ffffff"
                strokeWidth="4"
              />
              <text x={cx + 8} y={cy - radius - 18} fontSize="11" fontWeight="bold" fill="#78350f">
                起点 🏁 (0m)
              </text>

              {/* 跑步者 B (小亮 橙色) */}
              <circle cx={posBx} cy={posBy} r="10" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
              <text
                x={posBx}
                y={posBy - 14}
                fontSize="11"
                fontWeight="bold"
                fill="#ea580c"
                textAnchor="middle"
              >
                亮
              </text>

              {/* 跑步者 A (小明 蓝色) */}
              <circle cx={posAx} cy={posAy} r="12" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
              <text
                x={posAx}
                y={posAy - 16}
                fontSize="11"
                fontWeight="bold"
                fill="#2563eb"
                textAnchor="middle"
              >
                明
              </text>
            </svg>

            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px', textAlign: 'center' }}>
              周长 L = {trackLength} 米 | {mode === 'chase' ? '两人顺时针同向奔跑' : '明顺时针、亮逆时针相向背跑'}
            </div>
          </div>

          {/* 剪开拉直展开线段图 */}
          {showStraightView && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid #cbd5e1',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                  ✂️ 跑道剪开拉直成线段图：
                </span>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  每格 = 1个跑道周长 ({trackLength}m)
                </span>
              </div>

              {/* 标尺与展开跑道 */}
              <div style={{ marginTop: '14px', position: 'relative' }}>
                {/* 跑道格：第1圈、第2圈、第3圈 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginBottom: '12px' }}>
                  <div style={{ background: '#f1f5f9', border: '1px dashed #94a3b8', borderRadius: '6px', padding: '4px', textAlign: 'center', fontSize: '0.72rem', color: '#64748b' }}>
                    第 1 圈 ({trackLength}m)
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '6px', padding: '4px', textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8' }}>
                    第 2 圈 ({trackLength * 2}m)
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '6px', padding: '4px', textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8' }}>
                    第 3 圈 ({trackLength * 3}m)
                  </div>
                </div>

                {/* 小明 (蓝) 展开跑过的总路程条 */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 700, color: '#2563eb' }}>🏃‍♂️ 小明 (快)：{distA.toFixed(1)} 米</span>
                    <span style={{ color: '#64748b' }}>{lapsA.toFixed(2)} 圈</span>
                  </div>
                  <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, (distA / (trackLength * 3)) * 100)}%`,
                        background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                        borderRadius: '6px',
                        transition: 'width 0.1s linear',
                      }}
                    />
                  </div>
                </div>

                {/* 小亮 (橙) 展开跑过的总路程条 */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 700, color: '#ea580c' }}>🏃‍♀️ 小亮 (慢)：{distB.toFixed(1)} 米</span>
                    <span style={{ color: '#64748b' }}>{lapsB.toFixed(2)} 圈</span>
                  </div>
                  <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, (distB / (trackLength * 3)) * 100)}%`,
                        background: 'linear-gradient(90deg, #fb923c, #ea580c)',
                        borderRadius: '6px',
                        transition: 'width 0.1s linear',
                      }}
                    />
                  </div>
                </div>

                {/* 差距或总和金色几何卡尺 */}
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#92400e' }}>
                    {mode === 'chase' ? '📏 路程差量标尺（差距）：' : '🤝 路程和量标尺（合跑）：'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#b45309', marginTop: '2px' }}>
                    {mode === 'chase' ? (
                      <span>
                        当前小明比小亮多跑 <strong>{(distA - distB).toFixed(1)} 米</strong>。
                        {distA - distB >= trackLength ? (
                          <strong style={{ color: '#15803d', marginLeft: '4px' }}>
                            达到 1 圈！正好在环形跑道上与小亮重叠套圈！
                          </strong>
                        ) : (
                          <span>
                            还差 <strong>{(trackLength - (distA - distB)).toFixed(1)} 米</strong> 追上！
                          </span>
                        )}
                      </span>
                    ) : (
                      <span>
                        两人共跑了 <strong>{(distA + distB).toFixed(1)} 米</strong>。
                        {distA + distB >= trackLength ? (
                          <strong style={{ color: '#15803d', marginLeft: '4px' }}>
                            两人线段正好拼成一整圈 ({trackLength}m)！相遇！
                          </strong>
                        ) : (
                          <span>
                            还需合跑 <strong>{(trackLength - (distA + distB)).toFixed(1)} 米</strong> 相撞！
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================= */}
        {/* 紧挨着动画的核心控制面板：播放、快进、重置、滑块、倍速 */}
        {/* ======================================================= */}
        <div
          style={{
            marginTop: '16px',
            padding: '14px 18px',
            background: '#f8fafc',
            borderRadius: '14px',
            border: '2px solid #e0e7ff',
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.06)',
          }}
        >
          {/* 控制按钮第一行：主播放 + 直达 + 重置 + 倍速（换行流式布局） */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
              {/* 大号播放/暂停按钮 */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: isPlaying ? '#dc2626' : '#4f46e5',
                  color: '#ffffff',
                  boxShadow: isPlaying ? '0 2px 6px rgba(220, 38, 38, 0.3)' : '0 2px 6px rgba(79, 70, 229, 0.3)',
                  transition: 'all 0.15s ease',
                }}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? '暂停跑动' : '开始运动'}</span>
              </button>

              {/* 直达关键点 */}
              <button
                onClick={() => {
                  setSimTime(firstEventTime);
                  setIsPlaying(false);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid #fde68a',
                  background: '#fffbeb',
                  color: '#92400e',
                  cursor: 'pointer',
                }}
                title="一键快进到第一次追上/相遇的黄金时刻"
              >
                <FastForward className="w-4 h-4 text-amber-600" />
                <span>直达第1次{mode === 'chase' ? '追上' : '相遇'}</span>
              </button>

              {/* 重置 */}
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setSimTime(0);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  cursor: 'pointer',
                }}
                title="重置到起点"
              >
                <RotateCcw className="w-4 h-4" />
                <span>重置起点</span>
              </button>
            </div>

            {/* 播放倍速切换 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>倍速：</span>
              {[1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeedMultiplier(spd)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: speedMultiplier === spd ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                    background: speedMultiplier === spd ? '#eef2ff' : '#ffffff',
                    color: speedMultiplier === spd ? '#4f46e5' : '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* 控制按钮第二行：时间滑块（拖拽联动小人跑动） */}
          <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', minWidth: '70px' }}>
              运动时间：
            </span>
            <input
              type="range"
              min="0"
              max={Math.ceil(firstEventTime * 2)}
              step="0.5"
              value={simTime}
              onChange={(e) => {
                setSimTime(parseFloat(e.target.value));
                setIsPlaying(false);
              }}
              style={{ flex: '1 1 200px', accentColor: '#4f46e5', cursor: 'pointer' }}
            />
            <span
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#4f46e5',
                padding: '2px 10px',
                background: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #c7d2fe',
                minWidth: '70px',
                textAlign: 'center',
              }}
            >
              {simTime.toFixed(1)} 秒
            </span>
          </div>
        </div>

        {/* ======================================================= */}
        {/* 参数调控区（换行分组布局，避免内容过多拥挤在一起） */}
        {/* ======================================================= */}
        <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
          {/* 分组 1：运动方向 */}
          <div style={{ flex: '1 1 240px', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              运动方向模式：
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setMode('chase');
                  setSimTime(0);
                  setIsPlaying(false);
                }}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid',
                  cursor: 'pointer',
                  borderColor: mode === 'chase' ? '#4f46e5' : '#cbd5e1',
                  background: mode === 'chase' ? '#4f46e5' : '#ffffff',
                  color: mode === 'chase' ? '#ffffff' : '#475569',
                }}
              >
                🏃‍♂️➡️ 同向跑 (追及)
              </button>
              <button
                onClick={() => {
                  setMode('meet');
                  setSimTime(0);
                  setIsPlaying(false);
                }}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid',
                  cursor: 'pointer',
                  borderColor: mode === 'meet' ? '#0891b2' : '#cbd5e1',
                  background: mode === 'meet' ? '#0891b2' : '#ffffff',
                  color: mode === 'meet' ? '#ffffff' : '#475569',
                }}
              >
                🏃‍♂️⬅️ 反向跑 (相遇)
              </button>
            </div>
          </div>

          {/* 分组 2：跑道周长 */}
          <div style={{ flex: '1 1 240px', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              跑道周长 L：
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[200, 300, 400, 600].map((len) => (
                <button
                  key={len}
                  onClick={() => {
                    setTrackLength(len);
                    setSimTime(0);
                    setIsPlaying(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '5px 4px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: trackLength === len ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                    background: trackLength === len ? '#eef2ff' : '#ffffff',
                    color: trackLength === len ? '#4f46e5' : '#475569',
                    cursor: 'pointer',
                  }}
                >
                  {len}m
                </button>
              ))}
            </div>
          </div>

          {/* 分组 3：双方速度调节（单独成行或并列） */}
          <div style={{ flex: '2 1 320px', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              奔跑速度调节：
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1 1 140px' }}>
                <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 700 }}>小明 (蓝)：</span>
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="0.5"
                  value={vA}
                  onChange={(e) => {
                    setVA(parseFloat(e.target.value));
                    setSimTime(0);
                  }}
                  style={{ flex: 1, accentColor: '#2563eb' }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: '42px' }}>{vA}m/s</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1 1 140px' }}>
                <span style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 700 }}>小亮 (橙)：</span>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={vB}
                  onChange={(e) => {
                    setVB(parseFloat(e.target.value));
                    setSimTime(0);
                  }}
                  style={{ flex: 1, accentColor: '#ea580c' }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: '42px' }}>{vB}m/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 实时公式与事件达成立体面板 */}
      <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* 左侧：公式拆解与实时数值 */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '2px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>
              📐 核心数学公式推导与实时量测
            </div>

            <div style={{ marginTop: '8px', fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.7 }}>
              <div>
                • <strong style={{ color: '#2563eb' }}>小明 (蓝)</strong> 跑了：
                <span style={{ fontWeight: 700 }}>{distA.toFixed(1)} 米</span>
                <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: '6px' }}>
                  ({lapsA.toFixed(2)} 圈)
                </span>
              </div>
              <div>
                • <strong style={{ color: '#ea580c' }}>小亮 (橙)</strong> 跑了：
                <span style={{ fontWeight: 700 }}>{distB.toFixed(1)} 米</span>
                <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: '6px' }}>
                  ({lapsB.toFixed(2)} 圈)
                </span>
              </div>

              <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #cbd5e1' }}>
                {mode === 'chase' ? (
                  <div>
                    • <strong>路程差 (Δs)</strong> = {distA.toFixed(1)} - {distB.toFixed(1)} ={' '}
                    <strong style={{ color: '#4f46e5', fontSize: '1.05rem' }}>{(distA - distB).toFixed(1)} 米</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      当路程差正好累积到 <strong>{trackLength} 米（1整圈）</strong>时，快者完成套圈追上！
                    </div>
                  </div>
                ) : (
                  <div>
                    • <strong>路程和 (s和)</strong> = {distA.toFixed(1)} + {distB.toFixed(1)} ={' '}
                    <strong style={{ color: '#0891b2', fontSize: '1.05rem' }}>{(distA + distB).toFixed(1)} 米</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      当两人跑的总路程合起来达到 <strong>{trackLength} 米（1整圈）</strong>时，两人迎面相遇！
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：事件触发与理论计算卡片 */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: isFirstEventReached ? '#f0fdf4' : '#fffbeb',
              border: isFirstEventReached ? '2px solid #86efac' : '2px solid #fde68a',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isFirstEventReached ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <Milestone className="w-5 h-5 text-amber-600" />
              )}
              <span
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: isFirstEventReached ? '#166534' : '#92400e',
                }}
              >
                {mode === 'chase' ? '🏃‍♂️ 同向追及套圈状态' : '🤝 反向相向相遇状态'}
              </span>
            </div>

            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>
                第一次{mode === 'chase' ? '追上' : '相遇'}需要：
                <span style={{ color: '#4f46e5', fontSize: '1.25rem' }}> {firstEventTime.toFixed(1)} 秒</span>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '6px', lineHeight: 1.6 }}>
                {mode === 'chase' ? (
                  <>
                    计算：时间 = 跑道周长 ÷ 速度差<br />
                    t = {trackLength} ÷ ({vA} - {vB}) = {trackLength} ÷ {deltaV.toFixed(1)} ={' '}
                    <strong>{firstEventTime.toFixed(1)}</strong> 秒
                  </>
                ) : (
                  <>
                    计算：时间 = 跑道周长 ÷ 速度和<br />
                    t = {trackLength} ÷ ({vA} + {vB}) = {trackLength} ÷ {deltaV.toFixed(1)} ={' '}
                    <strong>{firstEventTime.toFixed(1)}</strong> 秒
                  </>
                )}
              </div>

              {/* 当前状态播报 */}
              <div
                style={{
                  marginTop: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: isFirstEventReached ? '#dcfce7' : '#fef3c7',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: isFirstEventReached ? '#15803d' : '#b45309',
                }}
              >
                {isSecondEventReached ? (
                  <span>🎉 已经完成第 2 次{mode === 'chase' ? '套圈追上' : '迎面相遇'}！</span>
                ) : isFirstEventReached ? (
                  <span>🏆 成功达成第 1 次{mode === 'chase' ? '套圈追上！领先整整 1 圈！' : '相遇！合跑整整 1 圈！'}</span>
                ) : (
                  <span>
                    ⏳ 正在奔跑中……还差{' '}
                    <strong style={{ color: '#dc2626' }}>
                      {(trackLength - diffOrSum).toFixed(1)} 米
                    </strong>{' '}
                    达成第 1 次{mode === 'chase' ? '追上' : '相遇'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部破局思维金句 */}
      <div
        style={{
          padding: '14px 20px',
          background: '#faf5ff',
          borderTop: '1px solid #f3e8ff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
        <div style={{ fontSize: '0.85rem', color: '#6b21a8' }}>
          <strong>环形跑道黄金破局口诀：</strong>
          <span>“环形跑道剪开拉直，同向追及差一圈，反向相遇合一圈；速度差算追上时，速度和算相遇期！”</span>
        </div>
      </div>
    </div>
  );
}
