'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/animations.module.css';
import { Clock, RotateCcw, FastForward, Play, Pause, Sparkles, HelpCircle } from 'lucide-react';

export default function FastSlowClockLab() {
  const [elapsedStandardHours, setElapsedStandardHours] = useState<number>(6); // 经过的标准小时数 (0 ~ 24)
  const [clockErrorMinPerHour, setClockErrorMinPerHour] = useState<number>(5); // 每小时快/慢多少分钟 (默认 5 分钟)
  const [clockType, setClockType] = useState<'slow' | 'fast'>('slow');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'forward' | 'reverse'>('forward'); // forward: 给定标准看坏钟; reverse: 考题倒推 (坏钟指到特定点)

  // 基础起始校准时间：早晨 8:00 (480 分钟)
  const BASE_HOUR = 8;
  const BASE_MINUTES = BASE_HOUR * 60;

  // 走速比计算
  // 标准钟走 60 分钟时，慢钟走 (60 - error) 分钟，快钟走 (60 + error) 分钟
  const brokenSpeedMinutes = clockType === 'slow' ? 60 - clockErrorMinPerHour : 60 + clockErrorMinPerHour;
  const speedRatio = brokenSpeedMinutes / 60; // 坏钟走速 / 标准走速

  // 动态自动走针定时器
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedStandardHours((prev) => {
          const next = prev + 0.05;
          if (next >= 24) return 0;
          return parseFloat(next.toFixed(2));
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // 标准钟与坏钟的分钟数
  const standardElapsedMinutes = elapsedStandardHours * 60;
  const brokenElapsedMinutes = standardElapsedMinutes * speedRatio;

  // 从午夜 0:00 起算的绝对分钟数（保证指针角度与表盘读数 100% 同步）
  const stdTotalMinutes = BASE_MINUTES + standardElapsedMinutes;
  const brokenTotalMinutes = BASE_MINUTES + brokenElapsedMinutes;

  // 指针角度计算 (12小时一圈 360°，顺时针方向，0° 垂直向上指向 12)
  const getHandAngles = (totalMinsFromMidnight: number) => {
    // 分针：每 60 分钟转 360° (6° / 分)
    const minuteAngle = ((totalMinsFromMidnight % 60) + 60) % 60 * 6;
    // 时针：每 720 分钟转 360° (0.5° / 分)
    const hourAngle = ((totalMinsFromMidnight % 720) + 720) % 720 * 0.5;
    return { hourAngle, minuteAngle };
  };

  const stdAngles = getHandAngles(stdTotalMinutes);
  const brokenAngles = getHandAngles(brokenTotalMinutes);

  // 格式化时间为 HH:MM
  const formatTime = (totalMins: number) => {
    const minsNormalized = ((Math.round(totalMins) % 1440) + 1440) % 1440;
    const h = Math.floor(minsNormalized / 60);
    const m = Math.floor(minsNormalized % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // 差距分钟数
  const diffMinutes = Math.abs(standardElapsedMinutes - brokenElapsedMinutes);

  // 经典考题真题倒推：当坏表指到下午 2:00 (14:00，坏表走了 6 小时)
  const examBrokenElapsedHours = 6;
  const examBrokenElapsedMins = examBrokenElapsedHours * 60;
  const examTrueElapsedMins = examBrokenElapsedMins / speedRatio;
  const examTrueElapsedH = Math.floor(examTrueElapsedMins / 60);
  const examTrueElapsedRemM = (examTrueElapsedMins % 60).toFixed(1);

  // 渲染单个时钟表盘组件
  const renderClock = (
    title: string,
    badgeColor: string,
    bgColor: string,
    borderColor: string,
    hourAngle: number,
    minuteAngle: number,
    timeStr: string,
    subText: string,
    handColor: string
  ) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: 800,
          color: badgeColor,
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {title}
        </div>

        <svg width="160" height="160" viewBox="0 0 160 160" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))' }}>
          {/* 表盘底色与外圈 */}
          <circle cx="80" cy="80" r="74" fill={bgColor} stroke={borderColor} strokeWidth="3.5" />
          <circle cx="80" cy="80" r="68" fill="none" stroke="#e2e8f0" strokeWidth="1" />

          {/* 60 个刻度线 */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 6 * Math.PI) / 180;
            const isHourTick = i % 5 === 0;
            const r1 = isHourTick ? 60 : 64;
            const r2 = 67;
            return (
              <line
                key={i}
                x1={80 + r1 * Math.sin(angle)}
                y1={80 - r1 * Math.cos(angle)}
                x2={80 + r2 * Math.sin(angle)}
                y2={80 - r2 * Math.cos(angle)}
                stroke={isHourTick ? '#334155' : '#cbd5e1'}
                strokeWidth={isHourTick ? 2 : 1}
              />
            );
          })}

          {/* 12 个时钟数字标牌 */}
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const rText = 50;
            return (
              <text
                key={num}
                x={80 + rText * Math.sin(angle)}
                y={80 - rText * Math.cos(angle) + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#475569"
              >
                {num}
              </text>
            );
          })}

          {/* 时针 (Hour Hand) */}
          <line
            x1="80"
            y1="80"
            x2={80 + 32 * Math.sin((hourAngle * Math.PI) / 180)}
            y2={80 - 32 * Math.cos((hourAngle * Math.PI) / 180)}
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* 分针 (Minute Hand) */}
          <line
            x1="80"
            y1="80"
            x2={80 + 48 * Math.sin((minuteAngle * Math.PI) / 180)}
            y2={80 - 48 * Math.cos((minuteAngle * Math.PI) / 180)}
            stroke={handColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* 轴心金属帽 */}
          <circle cx="80" cy="80" r="4.5" fill="#0f172a" />
          <circle cx="80" cy="80" r="2" fill="#ffffff" />
        </svg>

        {/* 电子时间与说明 */}
        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: badgeColor, marginTop: '8px' }}>
          {timeStr}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
          {subText}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Clock size={18} style={{ color: '#2563eb' }} />
          <span>时钟问题进阶：快慢钟与标准时间走速比</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${clockType === 'slow' ? styles.controlBtnActive : ''}`}
            onClick={() => setClockType('slow')}
          >
            慢钟模式 (每小时慢 {clockErrorMinPerHour} 分)
          </button>
          <button
            className={`${styles.controlBtn} ${clockType === 'fast' ? styles.controlBtnActive : ''}`}
            onClick={() => setClockType('fast')}
          >
            快钟模式 (每小时快 {clockErrorMinPerHour} 分)
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
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          {/* 视角切换 Tab */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            <button
              className={`${styles.controlBtn} ${activeTab === 'forward' ? styles.controlBtnActive : ''}`}
              onClick={() => setActiveTab('forward')}
            >
              ⏱ 走针速度动态比对
            </button>
            <button
              className={`${styles.controlBtn} ${activeTab === 'reverse' ? styles.controlBtnActive : ''}`}
              onClick={() => setActiveTab('reverse')}
            >
              🎯 考场真题倒推还原
            </button>
          </div>

          {activeTab === 'forward' ? (
            <>
              {/* 核心走速比提示卡 */}
              <div style={{
                background: clockType === 'slow' ? '#eff6ff' : '#fef2f2',
                padding: '10px 14px',
                borderRadius: '8px',
                borderLeft: `4px solid ${clockType === 'slow' ? '#3b82f6' : '#ef4444'}`,
                fontSize: '0.85rem',
                color: clockType === 'slow' ? '#1e40af' : '#991b1b',
                lineHeight: 1.6
              }}>
                <strong>【早晨 08:00 同时校准发车】：</strong>
                <br />
                标准表走 60 分钟时，该钟只走 <strong>{brokenSpeedMinutes} 分钟</strong>。
                走速比为 <strong>标准 : 坏钟 = 60 : {brokenSpeedMinutes}</strong>。
                指针旋转角度严格按 8:00 基准起点同步，快慢一目了然！
              </div>

              {/* 双表盘并列比对 */}
              <div style={{
                marginTop: '16px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                {renderClock(
                  '🟢 标准表 (真时间)',
                  '#15803d',
                  '#f0fdf4',
                  '#16a34a',
                  stdAngles.hourAngle,
                  stdAngles.minuteAngle,
                  formatTime(stdTotalMinutes),
                  `真时间已走 ${elapsedStandardHours.toFixed(1)} 小时`,
                  '#16a34a'
                )}

                {renderClock(
                  clockType === 'slow' ? '🔵 慢钟 (走得慢)' : '🔴 快钟 (走得快)',
                  clockType === 'slow' ? '#1d4ed8' : '#dc2626',
                  clockType === 'slow' ? '#eff6ff' : '#fef2f2',
                  clockType === 'slow' ? '#3b82f6' : '#ef4444',
                  brokenAngles.hourAngle,
                  brokenAngles.minuteAngle,
                  formatTime(brokenTotalMinutes),
                  clockType === 'slow'
                    ? `落后 ${diffMinutes.toFixed(1)} 分钟`
                    : `超前 ${diffMinutes.toFixed(1)} 分钟`,
                  clockType === 'slow' ? '#2563eb' : '#dc2626'
                )}
              </div>
            </>
          ) : (
            /* 考场真题倒推还原模式 */
            <div>
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                padding: '12px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                color: '#92400e'
              }}>
                <strong>【经典小升初真题】：</strong>
                <br />
                早上 8:00 将慢钟校准（每小时慢 5 分）。当坏钟走到 <strong>下午 2:00 (14:00)</strong> 时，真正的标准时间是几点？
              </div>

              <div style={{
                marginTop: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '0.85rem',
                lineHeight: 1.8
              }}>
                <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                  💡 走速比秒杀拆解：
                </div>
                <div>1. 坏表自身走过的表盘时间：14:00 - 8:00 = <strong>6 小时 (360 坏表分)</strong></div>
                <div>2. 确立走速比：标准钟走 60 分 ➔ 慢表走 55 分，走速比 = <strong>60 : 55 = 12 : 11</strong></div>
                <div>3. 还原真实时间：真实分钟 = 360 ÷ 11 × 12 = <strong>4320 / 11 = 392⁸⁄₁₁ 分钟</strong> (即 6小时 32⁸⁄₁₁分)</div>
                <div style={{ marginTop: '6px', padding: '8px 12px', background: '#ecfdf5', borderRadius: '6px', color: '#065f46', fontWeight: 800 }}>
                  👉 正确答案：下午 2 点 32⁸⁄₁₁ 分（切勿直觉误算成 2 点 30 分！）
                </div>
              </div>
            </div>
          )}

          {/* 走速比公式总结栏 */}
          <div style={{
            marginTop: '16px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.8rem',
            color: '#475569',
            lineHeight: 1.5
          }}>
            🔑 <strong>核心走速比原则：</strong>
            真实标准时间 = 坏钟走过的格子数 ÷ (坏钟走速 / 60)。坏钟跑出来的不是时间，是缩放后的刻度！
          </div>
        </div>

        {/* 交互控制器 */}
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
          {/* 滑块控制 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              <span>调整标准时间经过时长：</span>
              <span style={{ color: '#2563eb', fontWeight: 800 }}>{elapsedStandardHours.toFixed(1)} 小时</span>
            </div>
            <input
              type="range"
              min="0"
              max="16"
              step="0.1"
              value={elapsedStandardHours}
              onChange={(e) => {
                setIsPlaying(false);
                setElapsedStandardHours(Number(e.target.value));
              }}
              style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
            />
          </div>

          {/* 快捷按钮与播放控制 */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              className={`${styles.controlBtn} ${isPlaying ? styles.controlBtnActive : ''}`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? '暂停' : '▶ 动态运转走针'}</span>
            </button>

            <button
              className={styles.controlBtn}
              onClick={() => {
                setIsPlaying(false);
                setElapsedStandardHours(0);
              }}
            >
              <RotateCcw size={14} />
              <span>回 08:00 起点</span>
            </button>

            <button
              className={`${styles.controlBtn} ${elapsedStandardHours === 6 ? styles.controlBtnActive : ''}`}
              onClick={() => {
                setIsPlaying(false);
                setElapsedStandardHours(6);
              }}
            >
              经过 6 小时 (14:00)
            </button>

            <button
              className={`${styles.controlBtn} ${elapsedStandardHours === 12 ? styles.controlBtnActive : ''}`}
              onClick={() => {
                setIsPlaying(false);
                setElapsedStandardHours(12);
              }}
            >
              经过 12 小时 (20:00)
            </button>
          </div>

          {/* 调节快慢偏差值 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
            <span>调整每小时偏差分：</span>
            {[3, 5, 10].map((errVal) => (
              <button
                key={errVal}
                style={{
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: clockErrorMinPerHour === errVal ? '1px solid #2563eb' : '1px solid #cbd5e1',
                  background: clockErrorMinPerHour === errVal ? '#eff6ff' : '#ffffff',
                  color: clockErrorMinPerHour === errVal ? '#1d4ed8' : '#475569',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: clockErrorMinPerHour === errVal ? 700 : 500
                }}
                onClick={() => setClockErrorMinPerHour(errVal)}
              >
                {errVal} 分钟/小时
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
