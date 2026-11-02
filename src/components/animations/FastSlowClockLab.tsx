'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Clock, RotateCcw, Sparkles, FastForward, Play, Pause, AlertCircle } from 'lucide-react';

export default function FastSlowClockLab() {
  const [elapsedStandardHours, setElapsedStandardHours] = useState<number>(6); // 0 to 24 hours
  const [clockErrorMinPerHour, setClockErrorMinPerHour] = useState<number>(5); // 慢钟每小时慢 5 分钟 (或快钟快 5 分钟)
  const [clockType, setClockType] = useState<'slow' | 'fast'>('slow');

  // 计算快慢钟走过的分钟数与标准时间的比率
  // 标准表走 60 分钟，慢表走 (60 - error) 分钟，快表走 (60 + error) 分钟
  const standardTotalMinutes = elapsedStandardHours * 60;
  const speedRatio = clockType === 'slow' 
    ? (60 - clockErrorMinPerHour) / 60 
    : (60 + clockErrorMinPerHour) / 60;

  const brokenClockTotalMinutes = standardTotalMinutes * speedRatio;
  const differenceMinutes = Math.abs(standardTotalMinutes - brokenClockTotalMinutes);

  // 指针角度计算 (12小时制，360度)
  // 分针：每 60 分钟转 360 度 (6 度/分)
  // 时针：每 12 小时转 360 度 (0.5 度/分)
  const getHandAngles = (totalMins: number) => {
    const minuteAngle = (totalMins % 60) * 6;
    const hourAngle = ((totalMins % 720) * 0.5);
    return { hourAngle, minuteAngle };
  };

  const stdAngles = getHandAngles(standardTotalMinutes);
  const brokenAngles = getHandAngles(brokenClockTotalMinutes);

  const formatClockTime = (totalMins: number) => {
    const baseHour = 8; // 设定从早晨 8:00 开始校准
    const currentTotalMins = (baseHour * 60 + totalMins) % 1440;
    const h = Math.floor(currentTotalMins / 60);
    const m = Math.floor(currentTotalMins % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
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
            慢钟模式 (每小时慢 {clockErrorMinPerHour} 分钟)
          </button>
          <button
            className={`${styles.controlBtn} ${clockType === 'fast' ? styles.controlBtnActive : ''}`}
            onClick={() => setClockType('fast')}
          >
            快钟模式 (每小时快 {clockErrorMinPerHour} 分钟)
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
          {/* 破题提问情境 */}
          <div style={{
            background: clockType === 'slow' ? '#eff6ff' : '#fef2f2',
            padding: '10px 14px',
            borderRadius: '8px',
            borderLeft: `4px solid ${clockType === 'slow' ? '#3b82f6' : '#ef4444'}`,
            fontSize: '0.875rem',
            color: clockType === 'slow' ? '#1e40af' : '#991b1b',
            lineHeight: 1.6
          }}>
            <strong>【典型快慢钟谜题】：</strong>
            早晨 8:00 准时将一个坏钟校准。已知该钟<strong>每小时{clockType === 'slow' ? '慢' : '快'} {clockErrorMinPerHour} 分钟</strong>。
            <br />
            当坏钟指到 {formatClockTime(brokenClockTotalMinutes)} 时，<strong>真正的标准时间到底是几点几分？</strong>
            （切记：坏钟走的不是真时间，要用【走速比】换算！）
          </div>

          {/* 双钟并列对比图 */}
          <div style={{
            marginTop: '16px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            {/* 标准钟表 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803d', marginBottom: '6px' }}>
                🟢 标准正确表 (真时间)
              </div>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="62" fill="#f0fdf4" stroke="#16a34a" strokeWidth="3" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x1 = 70 + 52 * Math.sin(angle);
                  const y1 = 70 - 52 * Math.cos(angle);
                  const x2 = 70 + 58 * Math.sin(angle);
                  const y2 = 70 - 58 * Math.cos(angle);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#16a34a" strokeWidth="2" />;
                })}
                {/* 时针 */}
                <line
                  x1="70"
                  y1="70"
                  x2={70 + 32 * Math.sin((stdAngles.hourAngle * Math.PI) / 180)}
                  y2={70 - 32 * Math.cos((stdAngles.hourAngle * Math.PI) / 180)}
                  stroke="#166534"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* 分针 */}
                <line
                  x1="70"
                  y1="70"
                  x2={70 + 46 * Math.sin((stdAngles.minuteAngle * Math.PI) / 180)}
                  y2={70 - 46 * Math.cos((stdAngles.minuteAngle * Math.PI) / 180)}
                  stroke="#16a34a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="70" cy="70" r="4" fill="#166534" />
              </svg>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#166534', marginTop: '6px' }}>
                {formatClockTime(standardTotalMinutes)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>标准已走 {elapsedStandardHours} 小时</div>
            </div>

            {/* 坏钟表 (快或慢) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: clockType === 'slow' ? '#2563eb' : '#dc2626', marginBottom: '6px' }}>
                {clockType === 'slow' ? '🔵 慢钟 (走得慢)' : '🔴 快钟 (走得快)'}
              </div>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="62" fill={clockType === 'slow' ? '#eff6ff' : '#fef2f2'} stroke={clockType === 'slow' ? '#2563eb' : '#dc2626'} strokeWidth="3" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x1 = 70 + 52 * Math.sin(angle);
                  const y1 = 70 - 52 * Math.cos(angle);
                  const x2 = 70 + 58 * Math.sin(angle);
                  const y2 = 70 - 58 * Math.cos(angle);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="2" />;
                })}
                {/* 时针 */}
                <line
                  x1="70"
                  y1="70"
                  x2={70 + 32 * Math.sin((brokenAngles.hourAngle * Math.PI) / 180)}
                  y2={70 - 32 * Math.cos((brokenAngles.hourAngle * Math.PI) / 180)}
                  stroke={clockType === 'slow' ? '#1e3a8a' : '#991b1b'}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* 分针 */}
                <line
                  x1="70"
                  y1="70"
                  x2={70 + 46 * Math.sin((brokenAngles.minuteAngle * Math.PI) / 180)}
                  y2={70 - 46 * Math.cos((brokenAngles.minuteAngle * Math.PI) / 180)}
                  stroke={clockType === 'slow' ? '#2563eb' : '#dc2626'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="70" cy="70" r="4" fill="#0f172a" />
              </svg>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: clockType === 'slow' ? '#1d4ed8' : '#b91c1c', marginTop: '6px' }}>
                {formatClockTime(brokenClockTotalMinutes)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {clockType === 'slow' ? `落后 ${differenceMinutes.toFixed(0)} 分钟` : `超前 ${differenceMinutes.toFixed(0)} 分钟`}
              </div>
            </div>
          </div>

          {/* 走速比破局公式卡 */}
          <div style={{
            marginTop: '16px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '0.85rem',
            lineHeight: 1.6
          }}>
            <div style={{ fontWeight: 800, color: '#0f172a' }}>
              🔑 快慢钟解题核心：锁定【走速比】
            </div>
            <div style={{ marginTop: '4px', color: '#334155' }}>
              • 标准钟走 60 分钟时，该钟只走 <strong>{clockType === 'slow' ? 60 - clockErrorMinPerHour : 60 + clockErrorMinPerHour}</strong> 分钟！
              <br />
              • 走速比：<strong>标准时间 : 坏钟时间 = 60 : {clockType === 'slow' ? 60 - clockErrorMinPerHour : 60 + clockErrorMinPerHour}</strong>
              <br />
              • 还原真实时间：<strong>标准时间 = 坏钟走过的格数 ÷ 走速比</strong>！
            </div>
          </div>
        </div>

        {/* 控制器 */}
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
              <span>调整标准时间经过小时数：</span>
              <span style={{ color: '#2563eb' }}>{elapsedStandardHours} 小时</span>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              value={elapsedStandardHours}
              onChange={(e) => setElapsedStandardHours(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className={styles.controlBtn} onClick={() => setElapsedStandardHours(6)}>
              经过 6 小时 (半天)
            </button>
            <button className={styles.controlBtn} onClick={() => setElapsedStandardHours(12)}>
              经过 12 小时 (半圈)
            </button>
            <button className={styles.controlBtn} onClick={() => setElapsedStandardHours(24)}>
              经过 24 小时 (整整一天)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

