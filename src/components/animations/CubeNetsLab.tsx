'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Play, Pause, RotateCcw, Sparkles, CheckCircle2, AlertTriangle, Layers, HelpCircle } from 'lucide-react';
import styles from '@/styles/animations.module.css';

// 11 种正方体展开图及常见陷阱图
interface NetPattern {
  id: string;
  name: string;
  category: '1-4-1' | '2-3-1' | '2-2-2' | '3-3' | 'trap';
  isValid: boolean;
  desc: string;
  trapReason?: string;
  // 6 个面的相对关系：底面 (bottom) 保持不动，其余 5 个面相对连接折叠
  // 为了通俗直观，我们重点支持几种最经典的展开折叠联动
}

const PATTERNS: NetPattern[] = [
  // 1-4-1 型（最经典，占 6 种）
  {
    id: '1-4-1-center',
    name: '1-4-1 型（中间对称）',
    category: '1-4-1',
    isValid: true,
    desc: '中间 4 连方排成一列，上下两侧各单挂 1 个面。最稳妥经典的考场展开图！',
  },
  {
    id: '1-4-1-skew',
    name: '1-4-1 型（两端错开）',
    category: '1-4-1',
    isValid: true,
    desc: '中间 4 连方不变，上下两面分别错落在左右两侧，同样能完美折叠。',
  },
  // 2-3-1 型（3 种）
  {
    id: '2-3-1',
    name: '2-3-1 型（二阶三阶一阶）',
    category: '2-3-1',
    isValid: true,
    desc: '第一行 2 个，第二行 3 个，第三行 1 个。像一把菜刀，二三一顺次排开。',
  },
  // 2-2-2 型（1 种）
  {
    id: '2-2-2',
    name: '2-2-2 型（楼梯台阶型）',
    category: '2-2-2',
    isValid: true,
    desc: '每行 2 个面，三行像楼梯一样整齐错开，折叠后也是严丝合缝的正方体！',
  },
  // 3-3 型（1 种）
  {
    id: '3-3',
    name: '3-3 型（双阶梯型）',
    category: '3-3',
    isValid: true,
    desc: '两行各 3 个，像两层台阶一样错开 1 格。只有这一种！',
  },
  // ❌ 常见考场陷阱图
  {
    id: 'trap-tian',
    name: '❌ 陷阱：“田”字型（绝不能成）',
    category: 'trap',
    isValid: false,
    desc: '只要出现 4 个正方形拼成 2×2 的“田”字，必有两个面折叠撞车重合，死活围不成正方体！',
    trapReason: '“一线不过四，田凹不能成”。田字格里的四个面折起时会发生面面重叠，必定缺面！',
  },
  {
    id: 'trap-ao',
    name: '❌ 陷阱：“凹”字型（绝不能成）',
    category: 'trap',
    isValid: false,
    desc: '出现像“凹”字一样的缺口，折叠时两侧面会重叠在同一个位置。',
    trapReason: '凹字型的两侧翻起后会打架重叠在同一个顶部，导致对侧开天窗！',
  },
];

export default function CubeNetsLab() {
  const [selectedId, setSelectedId] = useState<string>('1-4-1-center');
  const [foldProgress, setFoldProgress] = useState<number>(0); // 0: 完全平铺展开 (0°), 100: 完全闭合折叠 (90°)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [rotX, setRotX] = useState<number>(20);
  const [rotY, setRotY] = useState<number>(-35);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastPointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const curPattern = PATTERNS.find((p) => p.id === selectedId) || PATTERNS[0];

  // 鼠标 / 触摸拖拽 3D 旋转
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPointerPos.current.x;
    const dy = e.clientY - lastPointerPos.current.y;
    lastPointerPos.current = { x: e.clientX, y: e.clientY };

    setRotY((prev) => (prev + dx * 0.7) % 360);
    setRotX((prev) => Math.max(-85, Math.min(85, prev - dy * 0.7)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // 动画播放
  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setFoldProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleTogglePlay = () => {
    if (foldProgress >= 100) {
      setFoldProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setFoldProgress(0);
  };

  // 折叠角度：0° (平铺) 到 90° (垂直立起)
  // 如果是陷阱图，折叠到后期会“重合碰撞警报”
  const foldAngle = (foldProgress / 100) * 90;

  // 面大小 (px)
  const S = 64;

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Box size={18} color="#2563eb" />
          <span>正方体 11 种展开图实验室：3D 动态折叠与“一线不过四、田凹不能成”</span>
        </div>
        <div className={styles.labControls}>
          <button
            className={`${styles.controlBtn} ${isPlaying ? styles.controlBtnActive : ''}`}
            onClick={handleTogglePlay}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? '暂停' : foldProgress >= 100 ? '重新折叠' : '动态折叠'}</span>
          </button>
          <button className={styles.controlBtn} onClick={handleReset}>
            <RotateCcw size={14} />
            <span>平铺展开</span>
          </button>
        </div>
      </div>

      {/* 展开图分类选择胶囊 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '12px 20px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          justifyContent: 'center',
        }}
      >
        {PATTERNS.map((p) => {
          const isSelected = p.id === selectedId;
          const isTrap = !p.isValid;
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedId(p.id);
                setFoldProgress(0);
                setIsPlaying(false);
              }}
              className={`${styles.controlBtn} ${isSelected ? styles.controlBtnActive : ''}`}
              style={{
                fontSize: '0.8rem',
                borderColor: isSelected ? (isTrap ? '#ef4444' : '#2563eb') : isTrap ? '#fca5a5' : '#cbd5e1',
                background: isSelected ? (isTrap ? '#ef4444' : '#2563eb') : isTrap ? '#fff5f5' : '#ffffff',
                color: isSelected ? '#ffffff' : isTrap ? '#b91c1c' : '#334155',
                fontWeight: isSelected ? 800 : 600,
              }}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      {/* 核心 3D 渲染画布 */}
      <div
        className={styles.canvasWrapper}
        style={{
          minHeight: '440px',
          padding: '20px',
          perspective: '1000px',
          background: 'radial-gradient(circle at center, #ffffff 0%, #f1f5f9 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 顶部状态提示条 */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 18px',
              borderRadius: '20px',
              background: curPattern.isValid ? (foldProgress >= 95 ? '#ecfdf5' : '#eff6ff') : '#fff1f2',
              color: curPattern.isValid ? (foldProgress >= 95 ? '#065f46' : '#1e40af') : '#9f1239',
              fontSize: '0.875rem',
              fontWeight: 700,
              border: `1px solid ${curPattern.isValid ? (foldProgress >= 95 ? '#a7f3d0' : '#bfdbfe') : '#fecdd3'}`,
            }}
          >
            {curPattern.isValid ? (
              foldProgress >= 95 ? (
                <>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>🎉 完美闭合成正方体！6个面各就各位，互不冲突！</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} color="#2563eb" />
                  <span>{curPattern.desc}（当前折叠进度：{Math.round(foldProgress)}%）</span>
                </>
              )
            ) : (
              <>
                <AlertTriangle size={16} color="#e11d48" />
                <span>{curPattern.trapReason}</span>
              </>
            )}
          </span>
        </div>

        {/* 3D 舞台容器 - 支持鼠标/触控拖拽 360° 旋转 */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            width: '360px',
            height: '300px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            touchAction: 'none',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          {/* 以“底面 (Bottom Face)”为锚点根节点 */}
          {/* 面颜色标配：底面灰蓝、顶面天蓝、前红、后橙、左绿、右紫 */}
          <div
            style={{
              width: `${S}px`,
              height: `${S}px`,
              background: '#475569',
              border: '2px solid #ffffff',
              borderRadius: '6px',
              position: 'relative',
              transformStyle: 'preserve-3d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            底面
            {/* 1. 向前翻折面 (Front) - 红色 */}
            <div
              style={{
                width: `${S}px`,
                height: `${S}px`,
                background: '#ef4444',
                border: '2px solid #ffffff',
                borderRadius: '6px',
                position: 'absolute',
                top: `${S}px`,
                left: 0,
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                transform: `rotateX(${-foldAngle}deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '14px',
              }}
            >
              前
              {/* 如果是 1-4-1 结构，前方还可以继续连着顶面 */}
              {selectedId.startsWith('1-4-1') && (
                <div
                  style={{
                    width: `${S}px`,
                    height: `${S}px`,
                    background: '#0284c7',
                    border: '2px solid #ffffff',
                    borderRadius: '6px',
                    position: 'absolute',
                    top: `${S}px`,
                    left: 0,
                    transformOrigin: 'top center',
                    transform: `rotateX(${-foldAngle}deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '14px',
                  }}
                >
                  顶面
                </div>
              )}
            </div>
            {/* 2. 向后翻折面 (Back) - 橙黄色 (凹字型此处为缺口，不渲染) */}
            {selectedId !== 'trap-ao' && (
              <div
                style={{
                  width: `${S}px`,
                  height: `${S}px`,
                  background: '#f97316',
                  border: '2px solid #ffffff',
                  borderRadius: '6px',
                  position: 'absolute',
                  top: `-${S}px`,
                  left: selectedId === '1-4-1-skew' ? `${S}px` : 0,
                  transformOrigin: 'bottom center',
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${foldAngle}deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '14px',
                }}
              >
                后
              </div>
            )}
            {/* 3. 向左翻折面 (Left) - 翡翠绿 */}
            <div
              style={{
                width: `${S}px`,
                height: `${S}px`,
                background: '#10b981',
                border: '2px solid #ffffff',
                borderRadius: '6px',
                position: 'absolute',
                top: 0,
                left: `-${S}px`,
                transformOrigin: 'right center',
                transformStyle: 'preserve-3d',
                transform: `rotateY(${-foldAngle}deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '14px',
              }}
            >
              左
              {/* 如果是 3-3 或 2-3-1 或非 1-4-1，顶面在左端连挂 */}
              {!selectedId.startsWith('1-4-1') && !selectedId.startsWith('trap') && (
                <div
                  style={{
                    width: `${S}px`,
                    height: `${S}px`,
                    background: '#0284c7',
                    border: '2px solid #ffffff',
                    borderRadius: '6px',
                    position: 'absolute',
                    top: 0,
                    left: `-${S}px`,
                    transformOrigin: 'right center',
                    transform: `rotateY(${-foldAngle}deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '14px',
                  }}
                >
                  顶面
                </div>
              )}
              {/* 如果是凹字型陷阱：左翼带凹左耳，折起后向后翻折 */}
              {selectedId === 'trap-ao' && (
                <div
                  style={{
                    width: `${S}px`,
                    height: `${S}px`,
                    background: '#ec4899',
                    border: '2px solid #ffffff',
                    borderRadius: '6px',
                    position: 'absolute',
                    top: `-${S}px`,
                    left: 0,
                    transformOrigin: 'bottom center',
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${foldAngle}deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '11px',
                    boxShadow: foldProgress > 60 ? '0 0 16px #ef4444' : 'none',
                  }}
                >
                  {foldProgress > 60 ? '💥撞车重叠' : '凹左耳'}
                </div>
              )}
            </div>
            {/* 4. 向右翻折面 (Right) - 紫色 */}
            <div
              style={{
                width: `${S}px`,
                height: `${S}px`,
                background: '#8b5cf6',
                border: '2px solid #ffffff',
                borderRadius: '6px',
                position: 'absolute',
                top: 0,
                left: `${S}px`,
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                transform: `rotateY(${foldAngle}deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '14px',
              }}
            >
              右
              {/* 如果是田字格陷阱：右面旁边直接贴着一个面，折起时打架碰撞！ */}
              {selectedId === 'trap-tian' && (
                <div
                  style={{
                    width: `${S}px`,
                    height: `${S}px`,
                    background: '#ec4899',
                    border: '2px solid #ffffff',
                    borderRadius: '6px',
                    position: 'absolute',
                    top: `-${S}px`,
                    left: 0,
                    transformOrigin: 'bottom center',
                    transform: `rotateX(${foldAngle}deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '11px',
                    boxShadow: foldProgress > 60 ? '0 0 16px #ef4444' : 'none',
                  }}
                >
                  {foldProgress > 60 ? '💥撞车重叠' : '田字面'}
                </div>
              )}
              {/* 如果是凹字型陷阱：右翼带凹右耳，折起后也向后翻折抢占同一面！ */}
              {selectedId === 'trap-ao' && (
                <div
                  style={{
                    width: `${S}px`,
                    height: `${S}px`,
                    background: '#f43f5e',
                    border: '2px solid #ffffff',
                    borderRadius: '6px',
                    position: 'absolute',
                    top: `-${S}px`,
                    left: 0,
                    transformOrigin: 'bottom center',
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${foldAngle}deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '11px',
                    boxShadow: foldProgress > 60 ? '0 0 16px #ef4444' : 'none',
                  }}
                >
                  {foldProgress > 60 ? '💥撞车重叠' : '凹右耳'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3D 视角拖拽/旋转提示 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', fontSize: '0.8rem', color: '#64748b' }}>
          <span>💡 鼠标/手指在 3D 区域按住拖拽可任意角度自由旋转，或选择预设视角：</span>
          <button
            onClick={() => { setRotX(20); setRotY(-35); }}
            style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontSize: '0.75rem' }}
          >
            正面俯视
          </button>
          <button
            onClick={() => { setRotX(65); setRotY(-20); }}
            style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontSize: '0.75rem' }}
          >
            高空鸟瞰
          </button>
          <button
            onClick={() => { setRotX(0); setRotY(90); }}
            style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontSize: '0.75rem' }}
          >
            侧面透视
          </button>
        </div>
      </div>

      {/* 底部控制台：连续折叠进度滑块 */}
      <div className={styles.sliderPanel}>
        <div className={styles.sliderGroup} style={{ flex: '2 1 300px' }}>
          <span className={styles.sliderLabel}>折叠开合进度 (0° ~ 90°):</span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={foldProgress}
            onChange={(e) => {
              setIsPlaying(false);
              setFoldProgress(Number(e.target.value));
            }}
            className={styles.sliderInput}
          />
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2563eb', minWidth: '45px' }}>
            {Math.round(foldProgress)}%
          </span>

          <button
            onClick={() => setFoldProgress(100)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            一键闭合成箱
          </button>
        </div>

        {/* 考场口诀提示 */}
        <div style={{ fontSize: '0.825rem', color: '#b45309', fontWeight: 700 }}>
          💡 口诀：一线不过四，田凹不能成；间二、拐角是相对！
        </div>
      </div>
    </div>
  );
}
