'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/animations.module.css';
import { Play, Pause, RotateCcw } from 'lucide-react';

type LabMode = 'free' | 'pursuit' | 'speedDiff';

export default function ClockAnglePursuitLab() {
  const [mode, setMode] = useState<LabMode>('free');

  // -------------------- 模式1：自由拨盘与实时夹角 --------------------
  const [hour, setHour] = useState<number>(3);
  const [minute, setMinute] = useState<number>(15);

  // 计算角度 (以12点方向为0度，顺时针为正)
  // 时针每小时走 30 度，每分钟走 0.5 度
  const hourAngle = ((hour % 12) * 30 + minute * 0.5) % 360;
  // 分针每分钟走 6 度
  const minuteAngle = (minute * 6) % 360;

  // 两针夹角 (取较小角 0 ~ 180度)
  const diffAngle = Math.abs(hourAngle - minuteAngle);
  const angleBetween = diffAngle > 180 ? 360 - diffAngle : diffAngle;

  // -------------------- 模式2：追及情境动态推演 --------------------
  const [startHour, setStartHour] = useState<number>(3); // 初始整点 (1~11)
  const [targetType, setTargetType] = useState<'overlap' | 'perpendicular' | 'opposite'>('overlap');
  const [simMinute, setSimMinute] = useState<number>(0); // 模拟从整点开始经过的分钟
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  // 计算目标需要追赶的角度与理论时间
  // 整点时时针在 startHour * 30 度，分针在 0 度。初始差距：startHour * 30 度。
  const initialGap = (startHour % 12) * 30;

  let requiredPursuitAngle = 0;
  let targetExplanation = '';

  if (targetType === 'overlap') {
    // 重合：分针需要完全追上初始差距
    requiredPursuitAngle = initialGap;
    targetExplanation = `分针追上时针落后的初始差距 ${initialGap}°`;
  } else if (targetType === 'perpendicular') {
    // 垂直 (第一次成 90度)：
    // 如果初始差距 >= 90度，追赶到还差 90度时第一次垂直：pursuit = initialGap - 90
    // 如果初始差距 < 90度，追赶平起平坐后再领先 90度：pursuit = initialGap + 90
    if (initialGap >= 90) {
      requiredPursuitAngle = initialGap - 90;
      targetExplanation = `分针追赶缩短差距，直到两针相距 90° (追赶 ${requiredPursuitAngle}°)`;
    } else {
      requiredPursuitAngle = initialGap + 90;
      targetExplanation = `分针超越时针并领先 90° (追赶 ${requiredPursuitAngle}°)`;
    }
  } else {
    // 平角/成一条直线 (相距 180度)：
    // 分针追上并反超 180度：pursuit = initialGap + 180
    requiredPursuitAngle = initialGap + 180;
    targetExplanation = `分针追上时针并领先 180° 成一条直线 (追赶 ${requiredPursuitAngle}°)`;
  }

  // 理论追及耗时 (分钟) = 追赶角度 / 5.5度
  const exactMinutes = requiredPursuitAngle / 5.5;
  // 转换成十一分之几的带分数格式
  const wholePart = Math.floor(exactMinutes);
  const numerator = Math.round((exactMinutes - wholePart) * 11);

  // 动态追及推演动画
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTime = performance.now();
    const speedMultiplier = 6; // 动画速率：每秒模拟 6 分钟

    const updateSim = (now: number) => {
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;

      setSimMinute((prev) => {
        const next = prev + deltaSec * speedMultiplier;
        if (next >= exactMinutes) {
          setIsPlaying(false);
          return exactMinutes;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(updateSim);
    };

    animFrameRef.current = requestAnimationFrame(updateSim);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, exactMinutes]);

  // 模式2 当前展示的角度
  const curSimHour = startHour;
  const curSimMin = simMinute;
  const curSimHourAngle = ((curSimHour % 12) * 30 + curSimMin * 0.5) % 360;
  const curSimMinAngle = (curSimMin * 6) % 360;
  const curSimDiff = Math.abs(curSimHourAngle - curSimMinAngle);
  const curSimAngleBetween = curSimDiff > 180 ? 360 - curSimDiff : curSimDiff;

  // 重置追及
  const handleResetPursuit = () => {
    setIsPlaying(false);
    setSimMinute(0);
  };

  // 一键直达理论目标时刻
  const handleJumpToTarget = () => {
    setIsPlaying(false);
    setSimMinute(exactMinutes);
  };

  return (
    <div className={styles.container} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 头部标题区 */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', color: '#1e293b' }}>
          ⏱️ 钟表问题：时针分针的追及与夹角（重合、垂直与平角）
        </h3>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>
          钟面其实就是一条 360° 封闭环形跑道！看懂分针每分钟比时针多跑 5.5° 的追及秘密
        </p>
      </div>

      {/* 模式选择导航 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={() => {
            setMode('free');
            setIsPlaying(false);
          }}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'free' ? '#2563eb' : '#f1f5f9',
            color: mode === 'free' ? '#ffffff' : '#475569',
            boxShadow: mode === 'free' ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          🔍 场景一：自由拨盘与实时夹角（测 3:15 陷阱）
        </button>
        <button
          onClick={() => {
            setMode('pursuit');
            setIsPlaying(false);
          }}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'pursuit' ? '#059669' : '#f1f5f9',
            color: mode === 'pursuit' ? '#ffffff' : '#475569',
            boxShadow: mode === 'pursuit' ? '0 2px 8px rgba(5,150,105,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          🏃 场景二：经典追及动态模拟（重合·垂直·平角）
        </button>
        <button
          onClick={() => {
            setMode('speedDiff');
            setIsPlaying(false);
          }}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: mode === 'speedDiff' ? '#d97706' : '#f1f5f9',
            color: mode === 'speedDiff' ? '#ffffff' : '#475569',
            boxShadow: mode === 'speedDiff' ? '0 2px 8px rgba(217,119,6,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          🏎️ 场景三：速度差原理与为什么答案总有“11分之几”
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 场景一：自由拨盘与夹角测量 */}
      {/* ========================================================================= */}
      {mode === 'free' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 画布核心区 */}
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '12px' }}>
              当前时间：{hour < 10 ? `0${hour}` : hour}:{minute < 10 ? `0${minute}` : minute} · 实时两针夹角：
              <span style={{ color: '#dc2626', fontSize: '1.25rem', marginLeft: '6px' }}>
                {angleBetween.toFixed(1)}°
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* 精美 SVG 钟面渲染 */}
              <div style={{ position: 'relative', width: '260px', height: '260px' }}>
                <svg viewBox="0 0 260 260" width="260" height="260">
                  {/* 表盘底色与外圈 */}
                  <circle cx="130" cy="130" r="120" fill="#ffffff" stroke="#334155" strokeWidth="4" />
                  <circle cx="130" cy="130" r="115" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

                  {/* 刻度线 (60小格与12大格) */}
                  {Array.from({ length: 60 }).map((_, i) => {
                    const rot = i * 6;
                    const isHourTick = i % 5 === 0;
                    return (
                      <line
                        key={i}
                        x1="130"
                        y1={isHourTick ? '18' : '22'}
                        x2="130"
                        y2="28"
                        stroke={isHourTick ? '#1e293b' : '#94a3b8'}
                        strokeWidth={isHourTick ? '3' : '1'}
                        transform={`rotate(${rot} 130 130)`}
                      />
                    );
                  })}

                  {/* 1~12 数字 */}
                  {[
                    { num: 12, x: 130, y: 46 },
                    { num: 1, x: 178, y: 58 },
                    { num: 2, x: 210, y: 92 },
                    { num: 3, x: 222, y: 136 },
                    { num: 4, x: 210, y: 180 },
                    { num: 5, x: 178, y: 214 },
                    { num: 6, x: 130, y: 226 },
                    { num: 7, x: 82, y: 214 },
                    { num: 8, x: 50, y: 180 },
                    { num: 9, x: 38, y: 136 },
                    { num: 10, x: 50, y: 92 },
                    { num: 11, x: 82, y: 58 },
                  ].map((item) => (
                    <text
                      key={item.num}
                      x={item.x}
                      y={item.y}
                      fill="#334155"
                      fontSize="14"
                      fontWeight="800"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {item.num}
                    </text>
                  ))}

                  {/* 扇形夹角弧 (可视化填充) */}
                  {(() => {
                    const r = 50;
                    const radH = (hourAngle - 90) * (Math.PI / 180);
                    const radM = (minuteAngle - 90) * (Math.PI / 180);
                    const x1 = 130 + r * Math.cos(radH);
                    const y1 = 130 + r * Math.sin(radH);
                    const x2 = 130 + r * Math.cos(radM);
                    const y2 = 130 + r * Math.sin(radM);

                    const diff = (minuteAngle - hourAngle + 360) % 360;
                    const largeArc = diff > 180 ? 1 : 0;

                    return (
                      <path
                        d={`M 130 130 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill="rgba(239, 68, 68, 0.15)"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    );
                  })()}

                  {/* 时针 (短粗红色) */}
                  <line
                    x1="130"
                    y1="130"
                    x2="130"
                    y2="68"
                    stroke="#dc2626"
                    strokeWidth="6"
                    strokeLinecap="round"
                    transform={`rotate(${hourAngle} 130 130)`}
                  />

                  {/* 分针 (细长蓝色) */}
                  <line
                    x1="130"
                    y1="130"
                    x2="130"
                    y2="38"
                    stroke="#2563eb"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    transform={`rotate(${minuteAngle} 130 130)`}
                  />

                  {/* 中心轴圆心 */}
                  <circle cx="130" cy="130" r="6" fill="#1e293b" />
                  <circle cx="130" cy="130" r="2.5" fill="#f8fafc" />
                </svg>
              </div>

              {/* 右侧角度拆解与易错分析卡片 */}
              <div
                style={{
                  flex: '1',
                  minWidth: '270px',
                  maxWidth: '430px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {/* 角度计算过程 */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                    📐 指针转过角度精准拆解：
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.6' }}>
                    <div>
                      🔴 <strong>时针角度：</strong> {hour % 12}点 × 30° + {minute}分 × 0.5° ={' '}
                      <span style={{ color: '#dc2626', fontWeight: 700 }}>{hourAngle.toFixed(1)}°</span>
                    </div>
                    <div>
                      🔵 <strong>分针角度：</strong> {minute}分 × 6° ={' '}
                      <span style={{ color: '#2563eb', fontWeight: 700 }}>{minuteAngle.toFixed(1)}°</span>
                    </div>
                    <div style={{ marginTop: '4px', borderTop: '1px dashed #e2e8f0', paddingTop: '4px' }}>
                      ⚡ <strong>两针相差：</strong> |{minuteAngle.toFixed(1)}° - {hourAngle.toFixed(1)}°| ={' '}
                      <span style={{ color: '#059669', fontWeight: 800, fontSize: '1rem' }}>
                        {angleBetween.toFixed(1)}°
                      </span>
                    </div>
                  </div>
                </div>

                {/* 典型陷阱特写提示 (3:15, 6:30, 9:45) */}
                {hour === 3 && minute === 15 && (
                  <div
                    style={{
                      background: '#fef2f2',
                      border: '1.5px solid #fecaca',
                      borderRadius: '8px',
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#dc2626' }}>
                      🚨 经典考场大陷阱：3点15分两针并没有重合！
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#991b1b', marginTop: '4px' }}>
                      很多孩子误以为分针指到 3、时针也在 3，夹角就是 0°。
                      其实当分针走了 15 分钟时，时针已经被齿轮带着偷偷往前挪了{' '}
                      <strong>15 × 0.5° = 7.5°</strong>！所以夹角是 7.5°，绝不是 0°！
                    </div>
                  </div>
                )}

                {hour === 6 && minute === 30 && (
                  <div
                    style={{
                      background: '#fef2f2',
                      border: '1.5px solid #fecaca',
                      borderRadius: '8px',
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#dc2626' }}>
                      🚨 易错点：6点30分夹角不是 0° 而是 15°！
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#991b1b', marginTop: '4px' }}>
                      分针指在 6，但时针已经走到 6 与 7 的正中间，偏离了 <strong>30 × 0.5° = 15°</strong>！
                    </div>
                  </div>
                )}

                {/* 常用预设快捷按钮 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', alignSelf: 'center' }}>
                    陷阱时刻速看：
                  </span>
                  {[
                    { label: '3:15 (差7.5°)', h: 3, m: 15 },
                    { label: '6:30 (差15°)', h: 6, m: 30 },
                    { label: '9:45 (差22.5°)', h: 9, m: 45 },
                    { label: '3:00 (整点直角90°)', h: 3, m: 0 },
                    { label: '6:00 (平角180°)', h: 6, m: 0 },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setHour(p.h);
                        setMinute(p.m);
                      }}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        background: hour === p.h && minute === p.m ? '#bfdbfe' : '#ffffff',
                        fontSize: '0.78rem',
                        color: '#1e3a8a',
                        cursor: 'pointer',
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 控制条区 (紧贴画布) */}
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* 时针小时滑块 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#dc2626', minWidth: '120px' }}>
                🔴 调整时针：{hour} 点
              </span>
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                style={{ flex: '1', minWidth: '180px', accentColor: '#dc2626', cursor: 'pointer' }}
              />
            </div>

            {/* 分针分钟滑块 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2563eb', minWidth: '120px' }}>
                🔵 调整分针：{minute} 分
              </span>
              <input
                type="range"
                min="0"
                max="59"
                step="1"
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                style={{ flex: '1', minWidth: '180px', accentColor: '#2563eb', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景二：经典追及动态模拟 */}
      {/* ========================================================================= */}
      {mode === 'pursuit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 画布核心区 */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#166534', marginBottom: '8px' }}>
              环形跑道追及现场：从 {startHour}:00 整点开始追赶
            </div>
            <div style={{ fontSize: '0.85rem', color: '#15803d', marginBottom: '14px' }}>
              {targetExplanation}
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* 动态表盘 */}
              <div style={{ position: 'relative', width: '250px', height: '250px' }}>
                <svg viewBox="0 0 250 250" width="250" height="250">
                  <circle cx="125" cy="125" r="115" fill="#ffffff" stroke="#166534" strokeWidth="3.5" />

                  {/* 12大格刻度 */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line
                      key={i}
                      x1="125"
                      y1="18"
                      x2="125"
                      y2="28"
                      stroke="#1e293b"
                      strokeWidth="2.5"
                      transform={`rotate(${i * 30} 125 125)`}
                    />
                  ))}

                  {/* 数字 */}
                  {[
                    { num: 12, x: 125, y: 44 },
                    { num: 3, x: 210, y: 130 },
                    { num: 6, x: 125, y: 218 },
                    { num: 9, x: 40, y: 130 },
                  ].map((item) => (
                    <text
                      key={item.num}
                      x={item.x}
                      y={item.y}
                      fill="#334155"
                      fontSize="14"
                      fontWeight="800"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {item.num}
                    </text>
                  ))}

                  {/* 时针 (短粗红) */}
                  <line
                    x1="125"
                    y1="125"
                    x2="125"
                    y2="68"
                    stroke="#dc2626"
                    strokeWidth="6"
                    strokeLinecap="round"
                    transform={`rotate(${curSimHourAngle} 125 125)`}
                  />

                  {/* 分针 (细长蓝) */}
                  <line
                    x1="125"
                    y1="125"
                    x2="125"
                    y2="38"
                    stroke="#2563eb"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    transform={`rotate(${curSimMinAngle} 125 125)`}
                  />

                  <circle cx="125" cy="125" r="5" fill="#1e293b" />
                </svg>
              </div>

              {/* 实时状态与精确带分数卡片 */}
              <div
                style={{
                  flex: '1',
                  minWidth: '270px',
                  maxWidth: '430px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {/* 实时动态计分板 */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #86efac',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#475569' }}>已模拟行进时间：</span>
                    <span style={{ fontWeight: 800, color: '#166534' }}>
                      {curSimMin.toFixed(2)} 分钟
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '6px' }}>
                    <span style={{ color: '#475569' }}>实时两针夹角：</span>
                    <span style={{ fontWeight: 800, color: '#dc2626' }}>
                      {curSimAngleBetween.toFixed(1)}°
                    </span>
                  </div>
                </div>

                {/* 理论公式与带分数计算卡片 */}
                <div
                  style={{
                    background: '#ecfdf5',
                    border: '1.5px solid #6ee7b7',
                    borderRadius: '8px',
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#065f46', marginBottom: '6px' }}>
                    🎯 追及公式秒算理论解：
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#047857', lineHeight: '1.6' }}>
                    <div>追赶总角度 = {requiredPursuitAngle}°</div>
                    <div>速度差 = 6° - 0.5° = 5.5°/分 (即 11/2 度/分)</div>
                    <div style={{ marginTop: '4px', fontWeight: 800, fontSize: '0.95rem' }}>
                      追及时间 = {requiredPursuitAngle} ÷ 5.5 = {requiredPursuitAngle} × (2/11) ={' '}
                      <span style={{ color: '#dc2626', fontSize: '1.15rem' }}>
                        {wholePart > 0 ? `${wholePart}又` : ''}{numerator}/11 分
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                      对应精确钟点：{startHour} 点 {wholePart > 0 ? `${wholePart}又` : ''}{numerator}/11 分
                      （约合 {exactMinutes.toFixed(1)} 分）
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 控制条区 */}
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* 初始整点选择 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                选择初始整点：
              </span>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((h) => (
                <button
                  key={h}
                  onClick={() => {
                    setStartHour(h);
                    handleResetPursuit();
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: startHour === h ? '#166534' : '#ffffff',
                    color: startHour === h ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: startHour === h ? 700 : 500,
                  }}
                >
                  {h}:00
                </button>
              ))}
            </div>

            {/* 目标情境选择 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                追赶目标情境：
              </span>
              {[
                { type: 'overlap' as const, label: '两针重合 (0°)' },
                { type: 'perpendicular' as const, label: '两针垂直 (90°)' },
                { type: 'opposite' as const, label: '成一条直线 (180°)' },
              ].map((t) => (
                <button
                  key={t.type}
                  onClick={() => {
                    setTargetType(t.type);
                    handleResetPursuit();
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: targetType === t.type ? '#059669' : '#ffffff',
                    color: targetType === t.type ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: targetType === t.type ? 700 : 500,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* 动画播放与控制按钮组 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isPlaying ? '#dc2626' : '#2563eb',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                {isPlaying ? '暂停追赶' : '开始动态追赶'}
              </button>

              <button
                onClick={handleResetPursuit}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={15} />
                回到整点
              </button>

              <button
                onClick={handleJumpToTarget}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: '1px solid #059669',
                  background: '#ecfdf5',
                  color: '#065f46',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                ⚡ 一键直达目标重合时刻
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 场景三：速度差原理与 11分之几 */}
      {/* ========================================================================= */}
      {mode === 'speedDiff' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 画布核心区 */}
          <div
            style={{
              background: '#fffbeb',
              border: '1.5px solid #fef3c7',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ textAlign: 'center', fontSize: '1.05rem', fontWeight: 800, color: '#92400e' }}>
              🏎️ 速度差与“11分之几”的数学本质
            </div>

            {/* 双跑道速度直观对比 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: '#ffffff',
                padding: '16px',
                borderRadius: '8px',
                border: '1.5px solid #fde68a',
              }}
            >
              {/* 分针跑道 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, color: '#2563eb' }}>
                    🔵 分针速度（飞人）：每分钟跑 1 小格 = 6°
                  </span>
                  <span style={{ color: '#64748b' }}>60分钟跑一整圈 (360°)</span>
                </div>
                <div style={{ height: '14px', background: '#dbeafe', borderRadius: '7px', position: 'relative' }}>
                  <div style={{ width: '100%', height: '100%', background: '#2563eb', borderRadius: '7px' }} />
                </div>
              </div>

              {/* 时针跑道 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, color: '#dc2626' }}>
                    🔴 时针速度（乌龟）：每分钟跑 1/12 小格 = 0.5°
                  </span>
                  <span style={{ color: '#64748b' }}>60分钟仅跑 1 大格 (30°)</span>
                </div>
                <div style={{ height: '14px', background: '#fee2e2', borderRadius: '7px', position: 'relative' }}>
                  <div style={{ width: '8.33%', height: '100%', background: '#dc2626', borderRadius: '7px' }} />
                </div>
              </div>

              {/* 净速度差 */}
              <div style={{ marginTop: '8px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 800 }}>
                  <span style={{ color: '#059669' }}>
                    ⚡ 速度差（分针每分钟净追上时针）：
                  </span>
                  <span style={{ color: '#059669', fontSize: '1.1rem' }}>
                    1 - 1/12 = 11/12 小格 = 5.5°/分
                  </span>
                </div>
              </div>
            </div>

            {/* 为什么答案总是带分母 11 */}
            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem', marginBottom: '8px' }}>
                💡 为什么时钟应用题的答案，十有八九都带有“11分之几”？
              </div>
              <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.7' }}>
                <p style={{ margin: '0 0 6px 0' }}>
                  因为行程问题的基本公式是：
                  <strong>时间 = 路程差距 ÷ 速度差</strong>。
                </p>
                <p style={{ margin: '0 0 6px 0' }}>
                  在这里，速度差固定为 <strong>5.5° = 11/2 度</strong>（或者 <strong>11/12 格</strong>）。
                  除以一个分数等于乘以它的倒数：
                </p>
                <div
                  style={{
                    background: '#f8fafc',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: '6px 0',
                  }}
                >
                  追及时间 = 路程差距 ÷ (11/12) = 路程差距 × (12/11)
                </div>
                <p style={{ margin: 0 }}>
                  分母里的这个 <strong>11</strong> 是质数，除以 11 绝大多数情况下都无法整除，所以答案必定保留为优雅的
                  <strong>几又十一分之几分钟</strong>！
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 底部辅导口诀总结 */}
      <div
        style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '8px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'space-around',
          fontSize: '0.84rem',
          color: '#475569',
        }}
      >
        <span>🏃 <strong>环形追及：</strong>分针走一格，时针挪一点</span>
        <span>⚡ <strong>速度差铁律：</strong>每分钟净追 5.5°（即 11/12 格）</span>
        <span>⏱️ <strong>秒杀捷径：</strong>追赶角度乘 2 除以 11，带分数写答案</span>
      </div>
    </div>
  );
}
