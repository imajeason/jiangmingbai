'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles, HelpCircle, CheckCircle, ArrowRight, Layers, Sliders } from 'lucide-react';
import styles from '@/styles/animations.module.css';

type TriangleType = 'acute' | 'right' | 'obtuse';

interface Preset {
  id: TriangleType;
  label: string;
  baseVal: number; // in cm
  heightVal: number; // in cm
  offsetRatio: number; // 0 to 1+ for apex position
  description: string;
}

const PRESETS: Preset[] = [
  {
    id: 'acute',
    label: '锐角三角形',
    baseVal: 8,
    heightVal: 5,
    offsetRatio: 0.45,
    description: '高在三角形内部，最常见的经典题型。',
  },
  {
    id: 'right',
    label: '直角三角形',
    baseVal: 8,
    heightVal: 5,
    offsetRatio: 0,
    description: '两直角边即底和高，旋转拼接后直接得到长方形！',
  },
  {
    id: 'obtuse',
    label: '钝角三角形',
    baseVal: 6,
    heightVal: 5,
    offsetRatio: 1.4,
    description: '高在三角形外部（需作底的延长线），拼成平行四边形依然严丝合缝！',
  },
];

export default function TriangleAreaLab() {
  const [triangleType, setTriangleType] = useState<TriangleType>('acute');
  const [baseCm, setBaseCm] = useState<number>(8);
  const [heightCm, setHeightCm] = useState<number>(5);
  const [offsetRatio, setOffsetRatio] = useState<number>(0.45);

  // 拼接进度 0 ~ 100
  const [progress, setProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1); // 1: 原始, 2: 复制, 3: 旋转, 4: 拼合, 5: 揭晓公式
  const animRef = useRef<number | null>(null);

  // 根据预设切换
  const handleSelectPreset = (preset: Preset) => {
    setIsPlaying(false);
    setTriangleType(preset.id);
    setBaseCm(preset.baseVal);
    setHeightCm(preset.heightVal);
    setOffsetRatio(preset.offsetRatio);
    setProgress(0);
    setStep(1);
  };

  // 播放控制
  useEffect(() => {
    if (isPlaying) {
      animRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            setStep(5);
            return 100;
          }
          const next = prev + 2;
          if (next >= 85) setStep(5);
          else if (next >= 60) setStep(4);
          else if (next >= 25) setStep(3);
          else if (next > 0) setStep(2);
          return next;
        });
      }, 30);
    } else if (animRef.current) {
      clearInterval(animRef.current);
    }
    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [isPlaying]);

  // 分步切换
  const handleSetStep = (newStep: number) => {
    setIsPlaying(false);
    setStep(newStep);
    if (newStep === 1) setProgress(0);
    if (newStep === 2) setProgress(15);
    if (newStep === 3) setProgress(50);
    if (newStep === 4) setProgress(80);
    if (newStep === 5) setProgress(100);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setStep(1);
  };

  const handleTogglePlay = () => {
    if (progress >= 100) {
      setProgress(0);
      setStep(1);
    }
    setIsPlaying(!isPlaying);
  };

  // 几何计算 (SVG 画布尺寸: 760 x 360)
  const scale = 25; // 1 cm = 25 px
  const basePx = baseCm * scale;
  const heightPx = heightCm * scale;
  const offsetPx = basePx * offsetRatio;

  // 画布原点定位
  const originX = 140;
  const baseY = 270;

  // 三角形 1 的三个顶点: P1(左底), P2(右底), P3(顶点)
  const p1 = { x: originX, y: baseY };
  const p2 = { x: originX + basePx, y: baseY };
  const p3 = { x: originX + offsetPx, y: baseY - heightPx };

  // 垂足点
  const foot = { x: originX + offsetPx, y: baseY };

  // 旋转中心 M: 取右侧边 P2-P3 的中点
  const midM = {
    x: (p2.x + p3.x) / 2,
    y: (p2.y + p3.y) / 2,
  };

  // 规范化进度 t: 0 -> 1
  const t = progress / 100;

  // 三角形 2 的变换计算
  // 当 t = 0 时，三角形 2 在旁边（带一定分离偏移 dx, dy），旋转角度为 0°
  // 当 t 从 0 到 1 时，旋转角度从 0° 平滑过渡到 180°
  // 分离向量从初始值过渡到 0，最终严丝合缝贴合到边 P2-P3，形成完整平行四边形
  const rotAngle = t * 180;
  const sepDist = (1 - t) * 90; // 分离距离
  // 分离方向：向右上方
  const sepX = (1 - t) * 110;
  const sepY = (1 - t) * -60;

  // 平行四边形第四个顶点（合体后的右上顶点 P4）
  const p4 = {
    x: p2.x + p3.x - p1.x,
    y: p2.y + p3.y - p1.y,
  };

  // 数值计算
  const parallelogramArea = (baseCm * heightCm).toFixed(1);
  const triangleArea = (Number(parallelogramArea) / 2).toFixed(1);

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Sparkles size={18} color="#2563eb" />
          <span>三角形面积实验室：为什么公式里一定要“除以 2”？</span>
        </div>
        <div className={styles.labControls}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className={`${styles.controlBtn} ${triangleType === p.id ? styles.controlBtnActive : ''}`}
              onClick={() => handleSelectPreset(p)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG 动画主画布 */}
      <div className={styles.canvasWrapper} style={{ minHeight: '400px', padding: '16px' }}>
        <svg viewBox="0 0 760 360" width="100%" height="360" style={{ maxWidth: '760px', overflow: 'visible' }}>
          <defs>
            {/* 三角形 1 的科技蓝渐变 */}
            <linearGradient id="tri1Grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9" />
            </linearGradient>

            {/* 三角形 2 的翡翠绿渐变 */}
            <linearGradient id="tri2Grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.9" />
            </linearGradient>

            {/* 拼接完成后的合体边框虚线 */}
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>

            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" />
            </marker>
          </defs>

          {/* 背景轻网格 */}
          <rect x="0" y="0" width="760" height="360" fill="url(#gridPattern)" />

          {/* 钝角三角形底边延长虚线（当高落在底边外时显示） */}
          {(offsetRatio < 0 || offsetRatio > 1) && (
            <line
              x1={offsetRatio > 1 ? p2.x : p1.x}
              y1={baseY}
              x2={foot.x}
              y2={baseY}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}

          {/* 高的垂线 (虚线) */}
          <line
            x1={p3.x}
            y1={p3.y}
            x2={foot.x}
            y2={foot.y}
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray="5 3"
          />

          {/* 直角符号 (高与底垂直) */}
          {triangleType !== 'right' && (
            <path
              d={`M ${foot.x + (offsetRatio > 0.5 ? -12 : 12)} ${foot.y} 
                  L ${foot.x + (offsetRatio > 0.5 ? -12 : 12)} ${foot.y - 12} 
                  L ${foot.x} ${foot.y - 12}`}
              fill="none"
              stroke="#ef4444"
              strokeWidth="1.5"
            />
          )}

          {/* ===================== 三角形 1（原始三角形，蓝色） ===================== */}
          <polygon
            points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
            fill="url(#tri1Grad)"
            stroke="#1e3a8a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* 三角形 1 的标签文字 */}
          <g transform={`translate(${(p1.x + p2.x + p3.x) / 3}, ${(p1.y + p2.y + p3.y) / 3})`}>
            <circle cx="0" cy="0" r="16" fill="#ffffff" fillOpacity="0.9" />
            <text x="0" y="5" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1e40af">
              ①
            </text>
          </g>

          {/* ===================== 三角形 2（复制体，旋转拼接动画） ===================== */}
          {(progress > 0 || step >= 2) && (
            <g
              transform={`
                translate(${sepX}, ${sepY}) 
                rotate(${rotAngle}, ${midM.x}, ${midM.y})
              `}
              style={{ transition: isPlaying ? 'none' : 'transform 0.2s ease-out' }}
            >
              <polygon
                points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
                fill="url(#tri2Grad)"
                stroke="#064e3b"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeDasharray={t < 0.9 ? '4 2' : 'none'}
              />
              <g transform={`translate(${(p1.x + p2.x + p3.x) / 3}, ${(p1.y + p2.y + p3.y) / 3})`}>
                <circle cx="0" cy="0" r="16" fill="#ffffff" fillOpacity="0.9" />
                <text x="0" y="5" textAnchor="middle" fontSize="13" fontWeight="800" fill="#047857">
                  ②
                </text>
              </g>
            </g>
          )}

          {/* 旋转中心标记 M */}
          {progress > 5 && progress < 95 && (
            <g>
              <circle cx={midM.x} cy={midM.y} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
              <text x={midM.x + 10} y={midM.y - 8} fontSize="11" fill="#b45309" fontWeight="700">
                中心旋转点 (180°)
              </text>
            </g>
          )}

          {/* 底长标注 (双向箭头与尺寸) */}
          <g>
            <line
              x1={p1.x}
              y1={baseY + 22}
              x2={p2.x}
              y2={baseY + 22}
              stroke="#475569"
              strokeWidth="1.5"
              markerStart="url(#arrow)"
              markerEnd="url(#arrow)"
            />
            <rect x={(p1.x + p2.x) / 2 - 42} y={baseY + 12} width="84" height="20" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x={(p1.x + p2.x) / 2} y={baseY + 26} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e293b">
              底 a = {baseCm} cm
            </text>
          </g>

          {/* 高标注 (高度文字与箭头) */}
          <g>
            <rect
              x={foot.x + (offsetRatio > 0.5 ? -95 : 12)}
              y={baseY - heightPx / 2 - 12}
              width="82"
              height="24"
              rx="4"
              fill="#fef2f2"
              stroke="#fca5a5"
              strokeWidth="1"
            />
            <text
              x={foot.x + (offsetRatio > 0.5 ? -54 : 53)}
              y={baseY - heightPx / 2 + 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill="#dc2626"
            >
              高 h = {heightCm} cm
            </text>
          </g>

          {/* 顶端全景平行四边形轮廓高光 (合体完成后强化视觉) */}
          {progress >= 95 && (
            <polygon
              points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p4.x},${p4.y} ${p3.x},${p3.y}`}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="3.5"
              strokeDasharray="6 4"
            />
          )}

          {/* 状态徽章提示 */}
          <g transform="translate(30, 35)">
            <rect
              x="0"
              y="0"
              width={progress >= 95 ? "320" : "280"}
              height="36"
              rx="8"
              fill={progress >= 95 ? "#ecfdf5" : "#eff6ff"}
              stroke={progress >= 95 ? "#10b981" : "#3b82f6"}
              strokeWidth="1.5"
            />
            <text
              x="16"
              y="23"
              fontSize="13"
              fontWeight="700"
              fill={progress >= 95 ? "#065f46" : "#1e40af"}
            >
              {progress >= 95
                ? `🎉 拼成大平行四边形（由 2 个三角形组成）`
                : progress > 0
                ? `🔄 正在旋转 180° 贴合并拢 (${Math.round(progress)}%)`
                : `🔍 观察单三角形：底 a = ${baseCm}cm，高 h = ${heightCm}cm`}
            </text>
          </g>
        </svg>

        {/* 底部醒目公式揭秘卡片 */}
        <div
          style={{
            width: '100%',
            maxWidth: '720px',
            marginTop: '12px',
            padding: '16px 20px',
            borderRadius: '12px',
            background: progress >= 90 ? 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)' : '#f8fafc',
            border: progress >= 90 ? '2px solid #3b82f6' : '1px solid #e2e8f0',
            boxShadow: progress >= 90 ? '0 4px 12px rgba(59, 130, 246, 0.15)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            {/* 左侧：公式推导对比 */}
            <div style={{ flex: '1 1 340px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '4px',
                    background: progress >= 90 ? '#10b981' : '#64748b',
                    color: '#ffffff',
                  }}
                >
                  {progress >= 90 ? '大平行四边形 = 2 个三角形' : '推导核心'}
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                  {triangleType === 'right' ? '直角三角形拼成长方形' : '两个相同三角形合体拼成平行四边形'}
                </span>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
                <div>
                  🟩 <strong>平行四边形面积</strong> = 底 × 高 = {baseCm} × {heightCm} ={' '}
                  <span style={{ color: '#047857', fontWeight: 800 }}>{parallelogramArea} cm²</span>
                </div>
                <div style={{ marginTop: '4px' }}>
                  🟦 <strong>单个三角形面积</strong> = 平行四边形面积 <strong>÷ 2</strong> ={' '}
                  <span style={{ color: '#2563eb', fontWeight: 800, fontSize: '1.05rem' }}>{triangleArea} cm²</span>
                </div>
              </div>
            </div>

            {/* 右侧：避坑口诀 */}
            <div
              style={{
                flex: '1 1 280px',
                padding: '10px 14px',
                background: '#ffffff',
                borderRadius: '8px',
                borderLeft: '4px solid #f59e0b',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#b45309' }}>
                <HelpCircle size={15} />
                <span>考场高频失分警报（40%学生漏写除以2）</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                算完 “底 × 高” 之后，立刻提醒孩子：“<strong>{baseCm} × {heightCm} 算出来的是一整个平行四边形（两只手合体）</strong>，题目只要一个三角形，必须马上 <strong>÷ 2</strong>！”
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5 步递进导航按钮 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '12px 20px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          justifyContent: 'center',
        }}
      >
        <button
          className={`${styles.controlBtn} ${step === 1 ? styles.controlBtnActive : ''}`}
          onClick={() => handleSetStep(1)}
        >
          第1步：观察单三角形
        </button>
        <button
          className={`${styles.controlBtn} ${step === 2 ? styles.controlBtnActive : ''}`}
          onClick={() => handleSetStep(2)}
        >
          第2步：复制完全同款
        </button>
        <button
          className={`${styles.controlBtn} ${step === 3 ? styles.controlBtnActive : ''}`}
          onClick={() => handleSetStep(3)}
        >
          第3步：旋转 180 度
        </button>
        <button
          className={`${styles.controlBtn} ${step === 4 ? styles.controlBtnActive : ''}`}
          onClick={() => handleSetStep(4)}
        >
          第4步：严密贴合拼图
        </button>
        <button
          className={`${styles.controlBtn} ${step === 5 ? styles.controlBtnActive : ''}`}
          onClick={() => handleSetStep(5)}
        >
          第5步：揭秘为什么除以 2
        </button>
      </div>

      {/* 底部控制台：连续平滑滑动条与参数调整 */}
      <div className={styles.sliderPanel}>
        {/* 动态拼合进度滑块 */}
        <div className={styles.sliderGroup} style={{ flex: '2 1 300px' }}>
          <button
            onClick={handleTogglePlay}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: isPlaying ? '#ef4444' : '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? '暂停' : progress >= 100 ? '重放' : '动态合体'}</span>
          </button>

          <span className={styles.sliderLabel}>拼合进度:</span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={progress}
            onChange={(e) => {
              setIsPlaying(false);
              const val = Number(e.target.value);
              setProgress(val);
              if (val >= 90) setStep(5);
              else if (val >= 60) setStep(4);
              else if (val >= 25) setStep(3);
              else if (val > 0) setStep(2);
              else setStep(1);
            }}
            className={styles.sliderInput}
          />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb', minWidth: '45px' }}>
            {Math.round(progress)}%
          </span>

          <button
            onClick={handleReset}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              cursor: 'pointer',
              color: '#64748b',
            }}
            title="重置"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* 调整底与高 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#475569' }}>底长 a:</span>
            <input
              type="range"
              min="5"
              max="12"
              value={baseCm}
              onChange={(e) => setBaseCm(Number(e.target.value))}
              style={{ width: '80px', accentColor: '#2563eb' }}
            />
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#2563eb' }}>{baseCm}cm</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#475569' }}>高度 h:</span>
            <input
              type="range"
              min="3"
              max="7"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              style={{ width: '80px', accentColor: '#ef4444' }}
            />
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ef4444' }}>{heightCm}cm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
