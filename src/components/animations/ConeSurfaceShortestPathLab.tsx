'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/animations.module.css';
import { Compass, Play, Pause, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ConeSurfaceShortestPathLab() {
  // 圆锥参数
  // 经典预设 1: r=1, L=4 => θ=90° (直角三角形, 弦长 = √2 * 4 ≈ 5.66)
  // 经典预设 2: r=1, L=6 => θ=60° (等边三角形, 弦长 = 6)
  // 经典预设 3: r=1, L=3 => θ=120° (钝角三角形, 弦长 = √3 * 3 ≈ 5.20)
  const [preset, setPreset] = useState<'theta90' | 'theta60' | 'theta120'>('theta90');
  const [r, setR] = useState<number>(1);
  const [L, setL] = useState<number>(4);

  // 展开动画进度 (0: 完全闭合为3D圆锥, 1: 完全展开为2D平面扇形)
  const [unfoldProgress, setUnfoldProgress] = useState<number>(1); // 默认展示展开态便于理解
  // 蚂蚁爬行进度 (0 ~ 1)
  const [antProgress, setAntProgress] = useState<number>(0.5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // 切换预设
  const applyPreset = (type: 'theta90' | 'theta60' | 'theta120') => {
    setPreset(type);
    if (type === 'theta90') {
      setR(1);
      setL(4);
    } else if (type === 'theta60') {
      setR(1);
      setL(6);
    } else {
      setR(1);
      setL(3);
    }
    setAntProgress(0);
  };

  // 展开圆心角
  const thetaDeg = (360 * r) / L;
  const thetaRad = (thetaDeg * Math.PI) / 180;

  // 展开图上弦长（最短路程）: 由余弦定理 c² = L² + L² - 2L²cosθ = 2L²(1 - cosθ) => c = 2L sin(θ/2)
  const shortestDist = 2 * L * Math.sin(thetaRad / 2);

  // 蚂蚁自动爬行定时器
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const step = () => {
        setAntProgress((prev) => {
          if (prev >= 1) return 0;
          return Math.min(1, prev + 0.008);
        });
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // 2D 展开扇形几何绘图参数 (SVG 视口 320 x 280)
  const ox = 160;
  const oy = 40;
  const scaleL = 180; // 母线在 SVG 中的像素长度

  // 扇形起始角和终止角 (居中对称向上展开)
  const halfAngle = thetaRad / 2;
  const startAngle = Math.PI / 2 - halfAngle;
  const endAngle = Math.PI / 2 + halfAngle;

  const ax = ox - scaleL * Math.sin(halfAngle);
  const ay = oy + scaleL * Math.cos(halfAngle);
  const apx = ox + scaleL * Math.sin(halfAngle);
  const apy = oy + scaleL * Math.cos(halfAngle);

  // 展开图上的蚂蚁坐标 (沿线段 AA' 匀速爬行)
  const antX = ax + (apx - ax) * antProgress;
  const antY = ay + (apy - ay) * antProgress;

  // 3D 视角圆锥几何参数 (SVG 视口 260 x 280)
  const coneApexX = 130;
  const coneApexY = 40;
  const coneBaseCenterX = 130;
  const coneBaseCenterY = 210;
  const coneRx = 70;
  const coneRy = 22;

  // 3D 上蚂蚁当前位置拟合
  // 蚂蚁在展开图上距顶点 O 的距离 d(t) 以及极角 alpha(t)
  const currentDx = antX - ox;
  const currentDy = antY - oy;
  const currentDistFromApex = Math.sqrt(currentDx * currentDx + currentDy * currentDy);
  // 在圆锥侧面的相对高度比 (0在顶点, 1在底面圆)
  const heightRatio = currentDistFromApex / scaleL;
  // 绕圆锥的旋转角 (0 到 2π)
  const coneRotAngle = antProgress * 2 * Math.PI;

  const ant3DX = coneBaseCenterX + coneRx * heightRatio * Math.cos(coneRotAngle - Math.PI / 2);
  const ant3DY =
    coneApexY +
    (coneBaseCenterY - coneApexY) * heightRatio +
    coneRy * heightRatio * Math.sin(coneRotAngle - Math.PI / 2);

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass className={styles.icon} />
          <h2 className={styles.title}>圆锥侧面展开与蚂蚁最短路径实验室</h2>
        </div>
        <p className={styles.description}>
          三维立体曲面化为二维平面！理解“两点之间线段最短”在空间曲面中的神奇运用，掌握展开角公式 θ = 360° × (r/L)。
        </p>
      </div>

      {/* 经典预设选择 */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <button
          onClick={() => applyPreset('theta90')}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: preset === 'theta90' ? '#4f46e5' : '#f1f5f9',
            color: preset === 'theta90' ? '#ffffff' : '#475569',
          }}
        >
          🌟 经典直角：r=1, L=4 (θ=90°, 等腰直角)
        </button>
        <button
          onClick={() => applyPreset('theta60')}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: preset === 'theta60' ? '#059669' : '#f1f5f9',
            color: preset === 'theta60' ? '#ffffff' : '#475569',
          }}
        >
          🔺 经典等边：r=1, L=6 (θ=60°, 等边三角形)
        </button>
        <button
          onClick={() => applyPreset('theta120')}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: preset === 'theta120' ? '#ea580c' : '#f1f5f9',
            color: preset === 'theta120' ? '#ffffff' : '#475569',
          }}
        >
          📐 钝角展开：r=1, L=3 (θ=120°)
        </button>
      </div>

      {/* 双重视角主画板：左边 3D 圆锥，右边 2D 展开扇形 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* 左侧：3D 立体圆锥透视 */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
            🏔️ 3D 立体视角（曲面盘旋爬行）
          </div>
          <svg width="260" height="260" viewBox="0 0 260 260">
            <defs>
              <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* 圆锥底面后半虚线 */}
            <path
              d={`M ${coneBaseCenterX - coneRx} ${coneBaseCenterY} A ${coneRx} ${coneRy} 0 0 1 ${coneBaseCenterX + coneRx} ${coneBaseCenterY}`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />

            {/* 圆锥侧面主体 */}
            <path
              d={`M ${coneApexX} ${coneApexY} L ${coneBaseCenterX - coneRx} ${coneBaseCenterY} A ${coneRx} ${coneRy} 0 0 0 ${coneBaseCenterX + coneRx} ${coneBaseCenterY} Z`}
              fill="url(#coneGrad)"
              stroke="#3b82f6"
              strokeWidth="2"
            />

            {/* 圆锥底面前半实线 */}
            <path
              d={`M ${coneBaseCenterX - coneRx} ${coneBaseCenterY} A ${coneRx} ${coneRy} 0 0 0 ${coneBaseCenterX + coneRx} ${coneBaseCenterY}`}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
            />

            {/* 底面圆中心与半径虚线 */}
            <line
              x1={coneBaseCenterX}
              y1={coneBaseCenterY}
              x2={coneBaseCenterX + coneRx}
              y2={coneBaseCenterY}
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
            <text x={coneBaseCenterX + coneRx / 2} y={coneBaseCenterY - 4} fontSize="11" fill="#475569" fontWeight="bold">
              r={r}
            </text>

            {/* 母线 L 标注 */}
            <text x={coneBaseCenterX - coneRx / 2 - 25} y={coneApexY + 80} fontSize="12" fill="#2563eb" fontWeight="bold">
              母线 L={L}
            </text>

            {/* 出发点 A 标记 */}
            <circle cx={coneBaseCenterX} cy={coneBaseCenterY + coneRy} r="5" fill="#dc2626" />
            <text x={coneBaseCenterX - 20} y={coneBaseCenterY + coneRy + 16} fontSize="12" fill="#dc2626" fontWeight="bold">
              起点 A
            </text>

            {/* 爬行轨迹螺旋线（根据 antProgress 拟合） */}
            <circle cx={ant3DX} cy={ant3DY} r="7" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
            <text x={ant3DX + 8} y={ant3DY - 2} fontSize="16">
              🐜
            </text>
          </svg>
          <span style={{ fontSize: '11px', color: '#64748b', textAlign: 'center' }}>
            在立体曲面上，蚂蚁走的是一条看似弯曲的螺旋线
          </span>
        </div>

        {/* 右侧：2D 平面展开扇形 */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
            📐 2D 展开扇形（两点之间线段最短）
          </div>
          <svg width="280" height="260" viewBox="0 0 320 260">
            <defs>
              <linearGradient id="sectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fde68a" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* 展开扇形 */}
            <path
              d={`M ${ox} ${oy} L ${ax} ${ay} A ${scaleL} ${scaleL} 0 0 1 ${apx} ${apy} Z`}
              fill="url(#sectorGrad)"
              stroke="#d97706"
              strokeWidth="2"
            />

            {/* 展开角 θ 弧线 */}
            <path
              d={`M ${ox - 24 * Math.sin(halfAngle)} ${oy + 24 * Math.cos(halfAngle)} A 24 24 0 0 1 ${ox + 24 * Math.sin(halfAngle)} ${oy + 24 * Math.cos(halfAngle)}`}
              fill="none"
              stroke="#ea580c"
              strokeWidth="2"
            />
            <text x={ox - 16} y={oy + 44} fontSize="12" fill="#ea580c" fontWeight="bold">
              θ={thetaDeg.toFixed(0)}°
            </text>

            {/* 顶角 O */}
            <circle cx={ox} cy={oy} r="4" fill="#475569" />
            <text x={ox - 6} y={oy - 8} fontSize="13" fill="#1e293b" fontWeight="bold">
              顶点 O
            </text>

            {/* 两点之间的直线段 AA' (真正的最短路径) */}
            <line x1={ax} y1={ay} x2={apx} y2={apy} stroke="#dc2626" strokeWidth="3" strokeDasharray="5,3" />

            {/* 点 A 与点 A' */}
            <circle cx={ax} cy={ay} r="5" fill="#dc2626" />
            <text x={ax - 18} y={ay + 16} fontSize="12" fill="#dc2626" fontWeight="bold">
              A
            </text>

            <circle cx={apx} cy={apy} r="5" fill="#dc2626" />
            <text x={apx + 8} y={apy + 16} fontSize="12" fill="#dc2626" fontWeight="bold">
              A'
            </text>

            {/* 展开图上线段长度标注 */}
            <text x={(ax + apx) / 2 - 35} y={(ay + apy) / 2 + 18} fontSize="12" fill="#dc2626" fontWeight="bold">
              最短线段 = {shortestDist.toFixed(2)} cm
            </text>

            {/* 展开图上的蚂蚁 */}
            <circle cx={antX} cy={antY} r="7" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
            <text x={antX + 8} y={antY - 2} fontSize="16">
              🐜
            </text>
          </svg>
          <span style={{ fontSize: '11px', color: '#059669', textAlign: 'center', fontWeight: 600 }}>
            展开后，两点之间直线线段最短！线段 AA&apos; 就是爬行最短路线！
          </span>
        </div>
      </div>

      {/* 爬行动画控制器 */}
      <div
        style={{
          marginTop: '16px',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isPlaying ? '#f59e0b' : '#4f46e5',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? '暂停爬行' : '自动爬行演示'}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setAntProgress(0);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={16} /> 回到起点
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>爬行进度:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={antProgress}
            onChange={(e) => {
              setIsPlaying(false);
              setAntProgress(parseFloat(e.target.value));
            }}
            style={{ flex: 1, cursor: 'pointer' }}
          />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', width: '40px' }}>
            {Math.round(antProgress * 100)}%
          </span>
        </div>
      </div>

      {/* 算式与原理解析 */}
      <div
        style={{
          marginTop: '16px',
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles color="#4f46e5" size={18} />
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>核心推导公式与计算步骤</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>第一步：算展开圆心角 θ</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#4f46e5', marginTop: '4px' }}>
              θ = 360° × (r / L) = 360° × ({r} / {L}) = {thetaDeg}°
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
              原理：扇形弧长 = 底面周长 (2πL × θ/360° = 2πr)
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>第二步：求等腰三角形底边 AA&apos;</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#059669', marginTop: '4px' }}>
              {thetaDeg === 90 && `直角等腰: √(4² + 4²) = 4√2 ≈ ${shortestDist.toFixed(2)} cm`}
              {thetaDeg === 60 && `等边三角形: AA' = 母线长 L = ${L} cm`}
              {thetaDeg === 120 && `120°钝角: 2 × 3 × sin(60°) = 3√3 ≈ ${shortestDist.toFixed(2)} cm`}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
              公理：平面上两点之间线段最短
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
