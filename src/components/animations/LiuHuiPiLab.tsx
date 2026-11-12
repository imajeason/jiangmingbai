'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Compass, Sparkles, ZoomIn, RotateCcw } from 'lucide-react';

export default function LiuHuiPiLab() {
  // 割圆边数阶梯: 6 -> 12 -> 24 -> 48 -> 96 -> 192
  const stepSides = [6, 12, 24, 48, 96, 192];
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [zoomIn, setZoomIn] = useState<boolean>(false);

  const n = stepSides[stepIdx];
  const R = 100; // 圆半径 (像素)

  // 几何计算：正 n 边形边长与周长
  // 单角 alpha = 2pi / n, 边长 s_n = 2 * R * sin(pi / n)
  const sn = 2 * R * Math.sin(Math.PI / n);
  const perimeter = n * sn;
  const piApprox = perimeter / (2 * R);
  const truePi = Math.PI;
  const error = Math.abs(truePi - piApprox);

  // SVG 视口 340 x 300
  const cx = 170;
  const cy = 150;

  // 生成正 n 边形顶点坐标
  const polygonPoints = Array.from({ length: n })
    .map((_, i) => {
      const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
      const x = cx + R * Math.cos(angle);
      const y = cy + R * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // 历史里程碑文案
  const getHistoricalNote = () => {
    if (n === 6) return '【周三径一】正六边形边长恰好等于圆半径 R，算得 π ≈ 3.0000。';
    if (n === 12) return '【第一割】正 12 边形，缝隙显著缩小，算得 π ≈ 3.1058。';
    if (n === 24) return '【第二割】正 24 边形，已经十分接近圆，算得 π ≈ 3.1326。';
    if (n === 48) return '【第三割】正 48 边形，算得 π ≈ 3.1393。';
    if (n === 96) return '【刘徽徽率】正 96 边形，刘徽求出 3.1410 < π < 3.1427，定下 3.14！';
    return '【徽率进阶】正 192 边形，刘徽算得 3.1416；后祖冲之推进至 24576 边形创下七位小数千古纪录！';
  };

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass className={styles.icon} />
          <h2 className={styles.title}>刘徽割圆术与圆周率逼近实验室</h2>
        </div>
        <p className={styles.description}>
          “割之弥细，所失弥少，割之又割，以至于不可割，则与圆周合体而无所失矣。” 亲身体会以直代曲的极限计算！
        </p>
      </div>

      {/* 边数阶梯切换按钮 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {stepSides.map((sides, idx) => (
          <button
            key={sides}
            onClick={() => setStepIdx(idx)}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: stepIdx === idx ? '#4f46e5' : '#f1f5f9',
              color: stepIdx === idx ? '#ffffff' : '#475569',
              transition: 'all 0.15s',
            }}
          >
            正 {sides} 边形
          </button>
        ))}
      </div>

      {/* 主画布：左侧或中间正多边形逼近 */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <svg width="340" height="300" viewBox="0 0 340 300">
          <defs>
            <radialGradient id="circleGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.1" />
            </radialGradient>
          </defs>

          {/* 外接标准圆 */}
          <circle cx={cx} cy={cy} r={R} fill="url(#circleGlow)" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3,3" />

          {/* 圆内接正多边形 */}
          <polygon
            points={polygonPoints}
            fill="rgba(79, 70, 229, 0.12)"
            stroke="#4338ca"
            strokeWidth={n >= 96 ? '1.5' : '2'}
            strokeLinejoin="round"
          />

          {/* 圆心点 */}
          <circle cx={cx} cy={cy} r="4" fill="#312e81" />
          <line x1={cx} y1={cy} x2={cx + R} y2={cy} stroke="#64748b" strokeWidth="1.5" strokeDasharray="2,2" />
          <text x={cx + 45} y={cy - 6} fontSize="11" fill="#475569" fontWeight="bold">
            半径 R
          </text>

          {/* 当边数为 6 时展示正六边形等边三角形网格 */}
          {n === 6 && (
            <>
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={cx + R * Math.cos(angle)}
                    y2={cy + R * Math.sin(angle)}
                    stroke="#818cf8"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                );
              })}
              <text x={cx} y={cy + 70} textAnchor="middle" fontSize="11" fill="#4338ca" fontWeight="bold">
                6 个等边三角形 (边长 s = R)
              </text>
            </>
          )}

          {/* 顶点圆点（在小边数时清晰呈现） */}
          {n <= 24 &&
            Array.from({ length: n }).map((_, i) => {
              const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
              return (
                <circle
                  key={i}
                  cx={cx + R * Math.cos(angle)}
                  cy={cy + R * Math.sin(angle)}
                  r={n === 6 ? 4 : 2.5}
                  fill="#ea580c"
                />
              );
            })}
        </svg>

        {/* 动态历史注解横幅 */}
        <div
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '13px',
            fontWeight: 600,
            color: '#1e293b',
            textAlign: 'center',
            maxWidth: '500px',
          }}
        >
          {getHistoricalNote()}
        </div>
      </div>

      {/* 实时逼近数据卡片 */}
      <div
        style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}
      >
        <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>当前多边形边数</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#4f46e5', marginTop: '4px' }}>
            正 {n} 边形
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>割圆计算估算值 π</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
            {piApprox.toFixed(5)}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
            真实值: {truePi.toFixed(7)}
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>与圆周绝对误差 (所失)</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#ea580c', marginTop: '4px' }}>
            {error < 0.0001 ? '< 0.0001' : error.toFixed(4)}
          </div>
          <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>
            {n >= 96 ? '🎉 误差极其微小，与圆融为一体！' : '随边数翻倍急速收敛'}
          </div>
        </div>
      </div>
    </div>
  );
}

