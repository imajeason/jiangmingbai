'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/animations.module.css';
import { Ship, Waves, Play, Pause, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

export default function BoatDriftReferenceLab() {
  const [frame, setFrame] = useState<'ground' | 'water'>('water');
  const [awayTimeMin, setAwayTimeMin] = useState<number>(30); // 离开时间 (分钟)
  const [boatSpeed, setBoatSpeed] = useState<number>(20); // 静水船速 km/h
  const [streamSpeed, setStreamSpeed] = useState<number>(4); // 水流速度 km/h

  // 动画时间进度: 0 到 2 * awayTimeMin
  const totalTimeMin = awayTimeMin * 2;
  const [simTimeMin, setSimTimeMin] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setSimTimeMin(prev => {
          if (prev >= totalTimeMin) {
            setIsPlaying(false);
            return totalTimeMin;
          }
          return Math.min(totalTimeMin, prev + 0.5);
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalTimeMin]);

  // 计算位置 (km)
  // 地面参考系：
  // 0 ~ t_away: 船顺流 (boatSpeed + streamSpeed), 草帽 (streamSpeed)
  // t_away ~ 2*t_away: 船逆流 (boatSpeed - streamSpeed), 草帽 (streamSpeed)
  const tAwayHours = awayTimeMin / 60;
  const tSimHours = simTimeMin / 60;

  // 草帽位置 (以掉落点为0)
  const hatPosGround = streamSpeed * tSimHours;

  // 轮船位置 (地面系)
  let boatPosGround = 0;
  if (tSimHours <= tAwayHours) {
    boatPosGround = (boatSpeed + streamSpeed) * tSimHours;
  } else {
    const posAtTurn = (boatSpeed + streamSpeed) * tAwayHours;
    const tReturn = tSimHours - tAwayHours;
    boatPosGround = posAtTurn - (boatSpeed - streamSpeed) * tReturn;
  }

  // 水流参考系：
  // 草帽永远在 0
  // 船去程向右 boatSpeed * t, 返程向左回来
  const hatPosWater = 0;
  let boatPosWater = 0;
  if (tSimHours <= tAwayHours) {
    boatPosWater = boatSpeed * tSimHours;
  } else {
    const posAtTurnWater = boatSpeed * tAwayHours;
    boatPosWater = posAtTurnWater - boatSpeed * (tSimHours - tAwayHours);
  }

  const isReturned = simTimeMin >= totalTimeMin;

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Ship size={18} style={{ color: '#0284c7' }} />
          <span>流水行舟进阶：掉头追草帽与水流参照系</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${frame === 'water' ? styles.controlBtnActive : ''}`}
            onClick={() => setFrame('water')}
          >
            🌊 水流静止参考系 (降维一秒出解)
          </button>
          <button
            className={`${styles.controlBtn} ${frame === 'ground' ? styles.controlBtnActive : ''}`}
            onClick={() => setFrame('ground')}
          >
            🏞️ 地面河岸参考系 (传统物理视角)
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
          {/* 破题精髓卡 */}
          <div style={{
            width: '100%',
            background: frame === 'water' ? '#eff6ff' : '#f8fafc',
            padding: '12px 14px',
            borderRadius: '8px',
            borderLeft: `4px solid ${frame === 'water' ? '#2563eb' : '#64748b'}`,
            fontSize: '0.85rem',
            color: frame === 'water' ? '#1e40af' : '#334155',
            lineHeight: 1.6
          }}>
            {frame === 'water' ? (
              <>
                <strong>【水流参照系核心思想（以水为镜）】：</strong>
                <br />
                在水的眼里，<strong>草帽自始至终静止在水面上（速度为 0）</strong>！
                <br />
                轮船靠自身马力以静水速度离开 {awayTimeMin} 分钟，掉头后以同样马力开回来，<strong>追赶时间必然严格等于离开时间 ({awayTimeMin} 分钟)！与水速大小毫无关系！</strong>
              </>
            ) : (
              <>
                <strong>【地面河岸参照系（传统视角）】：</strong>
                <br />
                顺水离开速度为 (v + u)，逆水迎面合速度为 (v - u) + u = v。
                <br />
                推导可知水速 u 必然被分子分母完全抵消，依然证明 <strong>t追 = t去 = {awayTimeMin} 分钟</strong>！
              </>
            )}
          </div>

          {/* 动态航道 SVG 动画 */}
          <div style={{ marginTop: '16px', width: '100%', maxWidth: '560px' }}>
            <svg viewBox="0 0 540 160" style={{ width: '100%', height: 'auto', overflow: 'visible', background: '#f0fdf4', borderRadius: '10px', border: '1.5px solid #86efac' }}>
              {/* 河道流水水波 */}
              <rect x="10" y="25" width="520" height="110" fill="#e0f2fe" rx="8" />
              {Array.from({ length: 6 }).map((_, i) => (
                <line
                  key={i}
                  x1={30 + i * 85}
                  y1={80}
                  x2={80 + i * 85}
                  y2={80}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                />
              ))}

              {/* 参照系说明标签 */}
              <text x="30" y="45" fontSize="10" fontWeight="800" fill={frame === 'water' ? '#0369a1' : '#475569'}>
                {frame === 'water' ? '🌊 视角：水流静止 (草帽锚定在 0 处不动)' : '🏞️ 视角：河岸地面 (草帽以水速顺流漂移)'}
              </text>

              {/* 草帽 👒 渲染 */}
              {(() => {
                const maxRange = (boatSpeed + streamSpeed) * (awayTimeMin / 60) * 1.2 + 2;
                const pos = frame === 'water' ? hatPosWater : hatPosGround;
                const x = 70 + (pos / maxRange) * 380;
                return (
                  <g transform={`translate(${x}, 95)`}>
                    <circle cx="0" cy="0" r="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                    <text x="0" y="4" textAnchor="middle" fontSize="11">👒</text>
                    <text x="0" y="20" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#854d0e">
                      草帽 {frame === 'ground' ? `(${hatPosGround.toFixed(1)}km)` : '(静止)'}
                    </text>
                  </g>
                );
              })()}

              {/* 机动客轮 🚢 渲染 */}
              {(() => {
                const maxRange = (boatSpeed + streamSpeed) * (awayTimeMin / 60) * 1.2 + 2;
                const pos = frame === 'water' ? boatPosWater : boatPosGround;
                const x = 70 + (pos / maxRange) * 380;
                const isHeadingRight = simTimeMin <= awayTimeMin;
                return (
                  <g transform={`translate(${x}, 65)`}>
                    <rect x="-18" y="-10" width="36" height="20" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
                    <text x="0" y="4" textAnchor="middle" fontSize="12" fill="#ffffff">
                      {isHeadingRight ? '🚢➔' : '⬅️🚢'}
                    </text>
                    <text x="0" y="-16" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#0369a1">
                      轮船 {isHeadingRight ? '(去程)' : '(掉头追)'}
                    </text>
                  </g>
                );
              })()}

              {/* 追回重合庆祝 */}
              {isReturned && (
                <g transform="translate(270, 45)">
                  <rect x="-50" y="-12" width="100" height="24" rx="6" fill="#16a34a" />
                  <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="900" fill="#ffffff">
                    🎉 成功捞回草帽！
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* 实时仪表盘 */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}>
            <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '8px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>离开耗时</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d4ed8', marginTop: '2px' }}>
                {awayTimeMin} <span style={{ fontSize: '0.75rem' }}>分钟</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>发觉前顺流开行</div>
            </div>

            <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '8px', border: '1.5px solid #86efac', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46' }}>掉头追回耗时</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#16a34a', marginTop: '2px' }}>
                {awayTimeMin} <span style={{ fontSize: '0.75rem' }}>分钟</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#15803d', fontWeight: 700 }}>
                必定与离开耗时相等！
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>草帽漂流总时长</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                {totalTimeMin} <span style={{ fontSize: '0.75rem' }}>分钟</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>漂流 {(totalTimeMin / 60 * streamSpeed).toFixed(1)} km</div>
            </div>
          </div>

          {/* 控制按钮与滑块 */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', width: '100%' }}>
            <button
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: '8px',
                background: '#0284c7',
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
              <span>{isPlaying ? '暂停' : '▶ 动态模拟航行'}</span>
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
                setSimTimeMin(0);
              }}
            >
              <RotateCcw size={15} />
              重置
            </button>
          </div>

          <div style={{
            marginTop: '12px',
            width: '100%',
            background: '#ffffff',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
              调整离开时间：{awayTimeMin} 分钟
            </span>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={awayTimeMin}
              onChange={(e) => {
                setIsPlaying(false);
                setAwayTimeMin(Number(e.target.value));
                setSimTimeMin(0);
              }}
              style={{ width: '180px', accentColor: '#0284c7', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
