'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/animations.module.css';
import { Circle, Play, Pause, RotateCcw, Sparkles, Layers } from 'lucide-react';

export default function RollingCircleLab() {
  const [shape, setShape] = useState<'rect' | 'triangle' | 'pentagon'>('rect');
  const [showAssembly, setShowAssembly] = useState<boolean>(false); // 拼合拐角扇形为一个大圆
  const [progress, setProgress] = useState<number>(0); // 滚动进度 0 ~ 1
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // 参数：多边形与硬币半径
  const r = 16; // 硬币半径 (像素)
  const d = 2 * r; // 硬币直径 32px

  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const step = () => {
        setProgress((prev) => (prev >= 1 ? 0 : prev + 0.005));
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // 长方形参数：长 160, 宽 100, 位于 (110, 80)
  // 周长 = (160 + 100) * 2 = 520
  // 直边带面积 = 520 * 32
  // 拐角大圆面积 = pi * (32)^2

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Circle className={styles.icon} />
          <h2 className={styles.title}>硬币滚过多边形与拐角拼圆实验室</h2>
        </div>
        <p className={styles.description}>
          外圈滚过扫过直带，拐角画出圆弧扇形！因为任意凸多边形外角和永远为 360°，所有拐角扇形剪下必拼成一个完整的整圆！
        </p>
      </div>

      {/* 形状选择与拼合按钮 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => {
            setShape('rect');
            setProgress(0);
          }}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: shape === 'rect' ? '#4f46e5' : '#f1f5f9',
            color: shape === 'rect' ? '#ffffff' : '#475569',
          }}
        >
          长方形 (4个90°直角)
        </button>
        <button
          onClick={() => {
            setShape('triangle');
            setProgress(0);
          }}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: shape === 'triangle' ? '#ea580c' : '#f1f5f9',
            color: shape === 'triangle' ? '#ffffff' : '#475569',
          }}
        >
          等边三角形 (3个120°外角)
        </button>

        <button
          onClick={() => setShowAssembly(!showAssembly)}
          style={{
            marginLeft: 'auto',
            padding: '6px 14px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: showAssembly ? '#10b981' : '#f3e8ff',
            color: showAssembly ? '#ffffff' : '#7e22ce',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Layers size={15} />
          {showAssembly ? '返回现场分解视图' : '✨ 神奇一键：所有拐角拼成整圆'}
        </button>
      </div>

      {/* 几何图形画板 */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <svg width="400" height="260" viewBox="0 0 400 260">
          <defs>
            <linearGradient id="stripGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="cornerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde68a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {shape === 'rect' && !showAssembly && (
            <>
              {/* 长方形 4 个拐角的扇形 (半径为 2r = 32px，外角 90度) */}
              {/* 左上角 (120, 70) */}
              <path d="M 120 70 L 120 38 A 32 32 0 0 0 88 70 Z" fill="url(#cornerGrad)" stroke="#d97706" />
              {/* 右上角 (280, 70) */}
              <path d="M 280 70 L 312 70 A 32 32 0 0 0 280 38 Z" fill="url(#cornerGrad)" stroke="#d97706" />
              {/* 右下角 (280, 190) */}
              <path d="M 280 190 L 280 222 A 32 32 0 0 0 312 190 Z" fill="url(#cornerGrad)" stroke="#d97706" />
              {/* 左下角 (120, 190) */}
              <path d="M 120 190 L 88 190 A 32 32 0 0 0 120 222 Z" fill="url(#cornerGrad)" stroke="#d97706" />

              {/* 4 条直边上的矩形带 (高 32px) */}
              {/* 上直带 */}
              <rect x="120" y="38" width="160" height="32" fill="url(#stripGrad)" stroke="#3b82f6" />
              {/* 下直带 */}
              <rect x="120" y="190" width="160" height="32" fill="url(#stripGrad)" stroke="#3b82f6" />
              {/* 左直带 */}
              <rect x="88" y="70" width="32" height="120" fill="url(#stripGrad)" stroke="#3b82f6" />
              {/* 右直带 */}
              <rect x="280" y="70" width="32" height="120" fill="url(#stripGrad)" stroke="#3b82f6" />

              {/* 中间核心长方形 (160 x 120) */}
              <rect x="120" y="70" width="160" height="120" rx="2" fill="#334155" stroke="#0f172a" strokeWidth="2" />
              <text x="200" y="135" fill="#ffffff" fontWeight="bold" fontSize="13" textAnchor="middle">
                中心长方形 (长 a, 宽 b)
              </text>
            </>
          )}

          {/* 神奇拼合视图：将所有拐角扇形平移拼成一个整圆 */}
          {showAssembly && (
            <g transform="translate(200, 130)">
              <circle cx="0" cy="0" r="54" fill="url(#cornerGrad)" stroke="#ea580c" strokeWidth="3" />
              <line x1="-54" y1="0" x2="54" y2="0" stroke="#b45309" strokeWidth="1.5" strokeDasharray="3,3" />
              <line x1="0" y1="-54" x2="0" y2="54" stroke="#b45309" strokeWidth="1.5" strokeDasharray="3,3" />
              <text x="0" y="-8" fill="#9a3412" fontWeight="bold" fontSize="13" textAnchor="middle">
                所有拐角扇形拼合！
              </text>
              <text x="0" y="14" fill="#9a3412" fontWeight="bold" fontSize="11" textAnchor="middle">
                整整一个圆：S = π(2r)²
              </text>
            </g>
          )}

          {/* 滚动中的硬币 */}
          {!showAssembly && shape === 'rect' && (
            <g transform="translate(190, 54)">
              <circle cx="0" cy="0" r="16" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="4" fontSize="10" fill="#78350f" fontWeight="bold" textAnchor="middle">
                🪙
              </text>
            </g>
          )}
        </svg>

        <span style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', marginTop: '6px' }}>
          {showAssembly
            ? '🎯 无论原本多边形有几个角，根据外角和公理（∑θ=360°），所有外圈扇形拼合必为整圆！'
            : '直边直带总和 = 多边形周长 × 2r；4个角画出4个四分之一圆！'}
        </span>
      </div>

      {/* 算式与结论卡片 */}
      <div
        style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px',
        }}
      >
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#4f46e5', marginBottom: '6px' }}>
            ① 扫过总面积黄金定理
          </div>
          <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', fontWeight: 700, color: '#1e293b' }}>
            S = 多边形周长 × (2r) + π(2r)²
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
            直边矩形带面积之和 + 拐角拼成的完整大圆面积！
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#059669', marginBottom: '6px' }}>
            ② 圆心轨迹周长定理
          </div>
          <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', fontWeight: 700, color: '#1e293b' }}>
            L圆心 = 多边形周长 + 2πr
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
            直边平移周长 + 拐角圆心弧拼成一个半径为 r 的完整圆周！
          </div>
        </div>
      </div>
    </div>
  );
}
