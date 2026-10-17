'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import styles from '@/styles/animations.module.css';

export default function ClockReadingLab() {
  // 当前总分钟数：从 0 (0:00) 到 719 (11:59)
  // 默认设置为经典易错时间：7:55 (7*60 + 55 = 475 分钟)
  const [totalMinutes, setTotalMinutes] = useState<number>(475);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  // 自动走针效果
  useEffect(() => {
    let timer: number;
    if (isAutoPlaying) {
      timer = window.setInterval(() => {
        setTotalMinutes((prev) => (prev + 1) % 720);
      }, 80);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const hours = Math.floor(totalMinutes / 60) === 0 ? 12 : Math.floor(totalMinutes / 60);
  const rawHours = Math.floor(totalMinutes / 60); // 0 ~ 11
  const minutes = totalMinutes % 60;

  // 角度计算
  const minuteAngle = minutes * 6; // 每分钟 6 度
  const hourAngle = (rawHours % 12) * 30 + (minutes / 60) * 30; // 每小时 30 度，外加分钟平滑贡献

  // 当前时针属于哪个“小时的房间” (领地)
  const currentHourRoom = rawHours === 0 ? 12 : rawHours;
  const nextHourRoom = (rawHours + 1) % 12 === 0 ? 12 : (rawHours + 1) % 12;

  // 易错点判断
  const isTrickyTime = minutes >= 45;

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Clock size={18} color="#2563eb" />
          <span>认识钟表实验室：时针分针齿轮联动与领地观察</span>
        </div>
        <div className={styles.labControls}>
          <button
            className={`${styles.controlBtn} ${isAutoPlaying ? styles.controlBtnActive : ''}`}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          >
            {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isAutoPlaying ? '暂停' : '自动走针'}</span>
          </button>
          <button
            className={styles.controlBtn}
            onClick={() => {
              setIsAutoPlaying(false);
              setTotalMinutes(475); // 复位到 7:55
            }}
          >
            <RotateCcw size={14} />
            <span>经典易错 7:55</span>
          </button>
        </div>
      </div>

      {/* 核心 SVG 钟表交互区 */}
      <div className={styles.canvasWrapper} style={{ minHeight: '440px', padding: '10px' }}>
        <svg viewBox="0 0 680 400" width="100%" height="400" style={{ maxWidth: '680px' }}>
          <defs>
            {/* 表盘外圈高质感立体阴影 */}
            <radialGradient id="clockDialGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="90%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </radialGradient>
            {/* 时针房间高亮色彩 */}
            <linearGradient id="roomHighlight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* 左侧：精美大表盘 */}
          <g transform="translate(210, 200)">
            {/* 1. 表盘外壳 */}
            <circle cx="0" cy="0" r="160" fill="url(#clockDialGrad)" stroke="#334155" strokeWidth="6" />
            <circle cx="0" cy="0" r="148" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* 2. 当前时针所在的小时扇区高亮（小时的领地） */}
            {(() => {
              const startAngle = (rawHours * 30 - 90) * (Math.PI / 180);
              const endAngle = ((rawHours + 1) * 30 - 90) * (Math.PI / 180);
              const r = 146;
              const x1 = r * Math.cos(startAngle);
              const y1 = r * Math.sin(startAngle);
              const x2 = r * Math.cos(endAngle);
              const y2 = r * Math.sin(endAngle);
              return (
                <path
                  d={`M 0 0 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                  fill="url(#roomHighlight)"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              );
            })()}

            {/* 3. 刻度线与 1~12 数字 */}
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i * 6 * Math.PI) / 180;
              const isMajor = i % 5 === 0;
              const rInner = isMajor ? 134 : 142;
              const rOuter = 146;
              return (
                <line
                  key={i}
                  x1={rInner * Math.sin(angle)}
                  y1={-rInner * Math.cos(angle)}
                  x2={rOuter * Math.sin(angle)}
                  y2={-rOuter * Math.cos(angle)}
                  stroke={isMajor ? '#0f172a' : '#94a3b8'}
                  strokeWidth={isMajor ? 2.5 : 1}
                />
              );
            })}

            {/* 12 个大数字 */}
            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const rText = 115;
              const x = rText * Math.sin(angle);
              const y = -rText * Math.cos(angle) + 7;
              const isCurrent = num === currentHourRoom;
              return (
                <text
                  key={num}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fontSize={isCurrent ? '22' : '18'}
                  fontWeight={isCurrent ? '800' : '600'}
                  fill={isCurrent ? '#2563eb' : '#1e293b'}
                >
                  {num}
                </text>
              );
            })}

            {/* 4. 时针（红色短粗指针） */}
            <g transform={`rotate(${hourAngle})`}>
              <line x1="0" y1="14" x2="0" y2="-80" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" />
              <polygon points="-7,-75 0,-92 7,-75" fill="#ef4444" />
              <text x="14" y="-45" fill="#ef4444" fontSize="11" fontWeight="700">时针</text>
            </g>

            {/* 5. 分针（蓝色长细指针） */}
            <g transform={`rotate(${minuteAngle})`}>
              <line x1="0" y1="18" x2="0" y2="-125" stroke="#2563eb" strokeWidth="4.5" strokeLinecap="round" />
              <polygon points="-5,-120 0,-136 5,-120" fill="#2563eb" />
              <text x="10" y="-80" fill="#2563eb" fontSize="11" fontWeight="700">分针</text>
            </g>

            {/* 6. 中心齿轮圆盘 */}
            <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="4" fill="#fbbf24" />
          </g>

          {/* 右侧：状态看板与启发解读 */}
          <g transform="translate(410, 30)">
            {/* 电子钟大卡片 */}
            <rect x="0" y="0" width="250" height="90" rx="12" fill="#ffffff" stroke="#e2e8f0" />
            <text x="20" y="30" fontSize="12" fill="#64748b" fontWeight="600">当前时间直读</text>
            <text x="20" y="66" fontSize="28" fill="#0f172a" fontWeight="800" fontFamily="var(--font-mono)">
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
            </text>
            <text x="120" y="65" fontSize="14" fill="#2563eb" fontWeight="700">
              {hours} 点 {minutes} 分
            </text>

            {/* 领地判断提示卡片 */}
            <g transform="translate(0, 105)">
              <rect
                x="0"
                y="0"
                width="250"
                height="130"
                rx="12"
                fill={isTrickyTime ? '#fff1f2' : '#f0fdf4'}
                stroke={isTrickyTime ? '#fecdd3' : '#bbf7d0'}
              />
              <g transform="translate(16, 26)">
                {isTrickyTime ? (
                  <AlertTriangle size={18} color="#e11d48" />
                ) : (
                  <CheckCircle2 size={18} color="#16a34a" />
                )}
                <text x="26" y="14" fontSize="14" fill={isTrickyTime ? '#9f1239' : '#166534'} fontWeight="700">
                  {isTrickyTime ? '⚠️ 极易读错陷阱！' : '✅ 正常读取区间'}
                </text>
              </g>

              <text x="16" y="70" fontSize="12" fill="#334155">
                时针当前所在房间：
                <tspan fill="#2563eb" fontWeight="800"> 【{currentHourRoom} 点的领地】</tspan>
              </text>

              <text x="16" y="94" fontSize="12" fill="#475569">
                {isTrickyTime
                  ? `时针虽逼近 ${nextHourRoom}，但没跨过分界线！`
                  : `分针走，时针也在悄悄往前挪动。`}
              </text>
              <text x="16" y="114" fontSize="12" fill={isTrickyTime ? '#e11d48' : '#059669'} fontWeight="600">
                {isTrickyTime
                  ? `🚨 千万别误读成 ${nextHourRoom} 点 ${minutes} 分！`
                  : `当前是标准的 ${currentHourRoom} 点多。`}
              </text>
            </g>

            {/* 快速考点预设按钮组 */}
            <g transform="translate(0, 252)">
              <text x="0" y="0" fontSize="12" fill="#64748b" fontWeight="600">经典期末考点快速体验：</text>
              
              {/* 第 1 排：7:55 与 3:30 */}
              <g transform="translate(0, 12)">
                {/* 7:55 */}
                {(() => {
                  const isActive = totalMinutes === 475;
                  return (
                    <g
                      cursor="pointer"
                      onClick={() => { setIsAutoPlaying(false); setTotalMinutes(475); }}
                    >
                      <rect
                        x="0" y="0" width="118" height="34" rx="6"
                        fill={isActive ? '#fee2e2' : '#f8fafc'}
                        stroke={isActive ? '#ef4444' : '#cbd5e1'}
                        strokeWidth={isActive ? '2' : '1'}
                      />
                      <text
                        x="59" y="22" textAnchor="middle"
                        fill={isActive ? '#991b1b' : '#334155'}
                        fontSize="12"
                        fontWeight={isActive ? '800' : '600'}
                      >
                        7:55 (快到8点)
                      </text>
                    </g>
                  );
                })()}

                {/* 3:30 */}
                {(() => {
                  const isActive = totalMinutes === 210;
                  return (
                    <g
                      cursor="pointer"
                      transform="translate(130, 0)"
                      onClick={() => { setIsAutoPlaying(false); setTotalMinutes(210); }}
                    >
                      <rect
                        x="0" y="0" width="118" height="34" rx="6"
                        fill={isActive ? '#dbeafe' : '#f8fafc'}
                        stroke={isActive ? '#2563eb' : '#cbd5e1'}
                        strokeWidth={isActive ? '2' : '1'}
                      />
                      <text
                        x="59" y="22" textAnchor="middle"
                        fill={isActive ? '#1e40af' : '#334155'}
                        fontSize="12"
                        fontWeight={isActive ? '800' : '600'}
                      >
                        3:30 (半点居中)
                      </text>
                    </g>
                  );
                })()}
              </g>

              {/* 第 2 排：11:58 与 9:00 */}
              <g transform="translate(0, 54)">
                {/* 11:58 */}
                {(() => {
                  const isActive = totalMinutes === 718;
                  return (
                    <g
                      cursor="pointer"
                      onClick={() => { setIsAutoPlaying(false); setTotalMinutes(718); }}
                    >
                      <rect
                        x="0" y="0" width="118" height="34" rx="6"
                        fill={isActive ? '#ffedd5' : '#f8fafc'}
                        stroke={isActive ? '#f97316' : '#cbd5e1'}
                        strokeWidth={isActive ? '2' : '1'}
                      />
                      <text
                        x="59" y="22" textAnchor="middle"
                        fill={isActive ? '#c2410c' : '#334155'}
                        fontSize="12"
                        fontWeight={isActive ? '800' : '600'}
                      >
                        11:58 (差2分12点)
                      </text>
                    </g>
                  );
                })()}

                {/* 9:00 */}
                {(() => {
                  const isActive = totalMinutes === 540;
                  return (
                    <g
                      cursor="pointer"
                      transform="translate(130, 0)"
                      onClick={() => { setIsAutoPlaying(false); setTotalMinutes(540); }}
                    >
                      <rect
                        x="0" y="0" width="118" height="34" rx="6"
                        fill={isActive ? '#dcfce7' : '#f8fafc'}
                        stroke={isActive ? '#16a34a' : '#cbd5e1'}
                        strokeWidth={isActive ? '2' : '1'}
                      />
                      <text
                        x="59" y="22" textAnchor="middle"
                        fill={isActive ? '#166534' : '#334155'}
                        fontSize="12"
                        fontWeight={isActive ? '800' : '600'}
                      >
                        9:00 (标准整点)
                      </text>
                    </g>
                  );
                })()}
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* 底部滑块控制器 */}
      <div className={styles.sliderPanel}>
        <div className={styles.sliderGroup}>
          <span className={styles.sliderLabel}>自由拨动时间轴 (看分针带动时针平滑前进):</span>
          <input
            type="range"
            min="0"
            max="719"
            value={totalMinutes}
            onChange={(e) => {
              setIsAutoPlaying(false);
              setTotalMinutes(Number(e.target.value));
            }}
            className={styles.sliderInput}
          />
          <span className={styles.sliderValue}>
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
          </span>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
          💡 口诀：时针没踏过下一个数，就还是前一个小时的家！
        </div>
      </div>
    </div>
  );
}
