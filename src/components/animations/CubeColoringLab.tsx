'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import styles from '@/styles/animations.module.css';

interface MiniCube {
  x: number; // 0 to n-1
  y: number; // 0 to n-1
  z: number; // 0 to n-1
  type: 3 | 2 | 1 | 0; // 3 faces, 2 faces, 1 face, 0 face colored
  faces: {
    top: boolean;
    bottom: boolean;
    front: boolean;
    back: boolean;
    left: boolean;
    right: boolean;
  };
}

const TYPE_CONFIG = {
  3: {
    name: '3面涂色 (顶点块)',
    color: '#ef4444',
    bgLight: 'rgba(239, 68, 68, 0.15)',
    border: '#dc2626',
    desc: '分布在 8 个顶角处',
    formula: '8 (永远固定为8个顶点)',
  },
  2: {
    name: '2面涂色 (棱上块)',
    color: '#3b82f6',
    bgLight: 'rgba(59, 130, 246, 0.15)',
    border: '#2563eb',
    desc: '分布在 12 条棱上 (去掉两端顶点)',
    formula: '12 × (n - 2)',
  },
  1: {
    name: '1面涂色 (面心块)',
    color: '#eab308',
    bgLight: 'rgba(234, 179, 8, 0.15)',
    border: '#ca8a04',
    desc: '分布在 6 个面的中心 (去掉周围一圈)',
    formula: '6 × (n - 2)²',
  },
  0: {
    name: '0面涂色 (中心核)',
    color: '#10b981',
    bgLight: 'rgba(16, 185, 129, 0.15)',
    border: '#059669',
    desc: '藏在立方体最深处内部',
    formula: '(n - 2)³',
  },
};

export default function CubeColoringLab() {
  const [n, setN] = useState<number>(3); // 2, 3, 4
  const [explode, setExplode] = useState<number>(35); // 0 to 100%
  const [activeFilter, setActiveFilter] = useState<'all' | 3 | 2 | 1 | 0>('all');
  const [rotX, setRotX] = useState<number>(-24);
  const [rotY, setRotY] = useState<number>(38);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [hoveredCube, setHoveredCube] = useState<MiniCube | null>(null);

  const isDragging = useRef(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 生成所有小立方体数据
  const cubes = useMemo(() => {
    const list: MiniCube[] = [];
    for (let x = 0; x < n; x++) {
      for (let y = 0; y < n; y++) {
        for (let z = 0; z < n; z++) {
          const isLeft = x === 0;
          const isRight = x === n - 1;
          const isBottom = y === 0;
          const isTop = y === n - 1;
          const isBack = z === 0;
          const isFront = z === n - 1;

          let outerFaceCount = 0;
          if (isLeft || isRight) outerFaceCount++;
          if (isBottom || isTop) outerFaceCount++;
          if (isBack || isFront) outerFaceCount++;

          const type = outerFaceCount as 3 | 2 | 1 | 0;

          list.push({
            x,
            y,
            z,
            type,
            faces: {
              left: isLeft,
              right: isRight,
              bottom: isBottom,
              top: isTop,
              back: isBack,
              front: isFront,
            },
          });
        }
      }
    }
    return list;
  }, [n]);

  // 统计各类方块数量
  const counts = useMemo(() => {
    const res = { 3: 0, 2: 0, 1: 0, 0: 0 };
    cubes.forEach((c) => {
      res[c.type]++;
    });
    return res;
  }, [cubes]);

  // 自动旋转动画
  useEffect(() => {
    if (!isAutoRotate) return;
    const interval = setInterval(() => {
      setRotY((prev) => (prev + 0.8) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotate]);

  // 拖拽旋转事件
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setRotY((prev) => prev + dx * 0.5);
    setRotX((prev) => Math.max(-85, Math.min(85, prev - dy * 0.5)));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // 触摸支持
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMousePos.current.x;
    const dy = e.touches[0].clientY - lastMousePos.current.y;
    setRotY((prev) => prev + dx * 0.5);
    setRotX((prev) => Math.max(-85, Math.min(85, prev - dy * 0.5)));
    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // 尺寸参数
  const cubeSize = n === 2 ? 62 : n === 3 ? 46 : 34; // 每个单方块像素宽度
  const centerOffset = (n - 1) / 2;
  const explodeDistance = (explode / 100) * (n === 2 ? 80 : n === 3 ? 70 : 60);

  return (
    <div className={styles.container} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 标题与概念速览 */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', color: '#1e293b' }}>
          🎲 大正方体涂色切块实验室：点、棱、面、心立体透视
        </h3>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>
          将外表面全部涂红的大正方体切成 <span style={{ fontWeight: 700, color: '#2563eb' }}>{n}×{n}×{n} = {n * n * n}</span> 块小正方体，拖动“爆炸展开”观察内部！
        </p>
      </div>

      {/* 3D 渲染画布 */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: '100%',
          height: '380px',
          background: 'radial-gradient(circle at 50% 50%, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging.current ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.04)',
        }}
      >
        {/* 操作手势引导浮标 */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '14px',
            fontSize: '0.82rem',
            color: '#64748b',
            background: 'rgba(255, 255, 255, 0.85)',
            padding: '5px 10px',
            borderRadius: '8px',
            backdropFilter: 'blur(4px)',
            border: '1px solid #e2e8f0',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          🖱️ 鼠标按住 / 单指拖动可 360° 旋转视角
        </div>

        {/* 右上角快捷视角 */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '14px',
            display: 'flex',
            gap: '6px',
            zIndex: 10,
          }}
        >
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            style={{
              padding: '4px 10px',
              fontSize: '0.8rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: isAutoRotate ? '#2563eb' : '#ffffff',
              color: isAutoRotate ? '#ffffff' : '#334155',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {isAutoRotate ? '⏸️ 停止旋转' : '🔄 自动旋转'}
          </button>
          <button
            onClick={() => {
              setRotX(-24);
              setRotY(38);
            }}
            style={{
              padding: '4px 10px',
              fontSize: '0.8rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            🎯 重置正交
          </button>
        </div>

        {/* 悬停信息浮层 */}
        {hoveredCube && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '14px',
              fontSize: '0.85rem',
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '6px 12px',
              borderRadius: '8px',
              border: `2px solid ${TYPE_CONFIG[hoveredCube.type].color}`,
              color: '#1e293b',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            当前选中：<strong>{TYPE_CONFIG[hoveredCube.type].name}</strong> | 坐标: ({hoveredCube.x + 1},{hoveredCube.y + 1},{hoveredCube.z + 1})
          </div>
        )}

        {/* 3D 舞台 */}
        <div
          style={{
            width: '1px',
            height: '1px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            perspective: '1200px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              transition: isDragging.current ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            {cubes.map((cube) => {
              const isFilteredOut = activeFilter !== 'all' && cube.type !== activeFilter;
              const isTypeHighlighted = activeFilter === cube.type;

              // 计算偏离中心的位移向量 (单位: 像素)
              const dx = (cube.x - centerOffset) * (cubeSize + explodeDistance);
              const dy = -(cube.y - centerOffset) * (cubeSize + explodeDistance); // CSS Y轴向下
              const dz = (cube.z - centerOffset) * (cubeSize + explodeDistance);

              const half = cubeSize / 2;

              // 各面涂色判断
              const getFaceBg = (isOuter: boolean, defaultColor: string) => {
                if (isFilteredOut) return 'rgba(226, 232, 240, 0.2)';
                if (isOuter) {
                  return defaultColor; // 外表面涂色
                }
                // 切割内表面木材原色
                return isTypeHighlighted ? '#fef08a' : '#f1f5f9';
              };

              const currentTheme = TYPE_CONFIG[cube.type];
              const outerColor = currentTheme.color;

              return (
                <div
                  key={`${cube.x}-${cube.y}-${cube.z}`}
                  onMouseEnter={() => setHoveredCube(cube)}
                  onMouseLeave={() => setHoveredCube(null)}
                  style={{
                    position: 'absolute',
                    width: `${cubeSize}px`,
                    height: `${cubeSize}px`,
                    left: `-${half}px`,
                    top: `-${half}px`,
                    transformStyle: 'preserve-3d',
                    transform: `translate3d(${dx}px, ${dy}px, ${dz}px)`,
                    opacity: isFilteredOut ? 0.18 : 1,
                    transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
                    pointerEvents: isFilteredOut ? 'none' : 'auto',
                  }}
                >
                  {/* 前面 Front (z = +half) */}
                  <div
                    style={{
                      position: 'absolute',
                      width: `${cubeSize}px`,
                      height: `${cubeSize}px`,
                      background: getFaceBg(cube.faces.front, outerColor),
                      border: `1px solid ${cube.faces.front ? currentTheme.border : '#cbd5e1'}`,
                      transform: `translateZ(${half}px)`,
                      boxSizing: 'border-box',
                    }}
                  />
                  {/* 后面 Back (z = -half) */}
                  <div
                    style={{
                      position: 'absolute',
                      width: `${cubeSize}px`,
                      height: `${cubeSize}px`,
                      background: getFaceBg(cube.faces.back, outerColor),
                      border: `1px solid ${cube.faces.back ? currentTheme.border : '#cbd5e1'}`,
                      transform: `rotateY(180deg) translateZ(${half}px)`,
                      boxSizing: 'border-box',
                    }}
                  />
                  {/* 顶面 Top (y = +half) */}
                  <div
                    style={{
                      position: 'absolute',
                      width: `${cubeSize}px`,
                      height: `${cubeSize}px`,
                      background: getFaceBg(cube.faces.top, outerColor),
                      border: `1px solid ${cube.faces.top ? currentTheme.border : '#cbd5e1'}`,
                      transform: `rotateX(90deg) translateZ(${half}px)`,
                      boxSizing: 'border-box',
                      filter: 'brightness(1.08)',
                    }}
                  />
                  {/* 底面 Bottom (y = -half) */}
                  <div
                    style={{
                      position: 'absolute',
                      width: `${cubeSize}px`,
                      height: `${cubeSize}px`,
                      background: getFaceBg(cube.faces.bottom, outerColor),
                      border: `1px solid ${cube.faces.bottom ? currentTheme.border : '#cbd5e1'}`,
                      transform: `rotateX(-90deg) translateZ(${half}px)`,
                      boxSizing: 'border-box',
                      filter: 'brightness(0.85)',
                    }}
                  />
                  {/* 左面 Left (x = -half) */}
                  <div
                    style={{
                      position: 'absolute',
                      width: `${cubeSize}px`,
                      height: `${cubeSize}px`,
                      background: getFaceBg(cube.faces.left, outerColor),
                      border: `1px solid ${cube.faces.left ? currentTheme.border : '#cbd5e1'}`,
                      transform: `rotateY(-90deg) translateZ(${half}px)`,
                      boxSizing: 'border-box',
                      filter: 'brightness(0.92)',
                    }}
                  />
                  {/* 右面 Right (x = +half) */}
                  <div
                    style={{
                      position: 'absolute',
                      width: `${cubeSize}px`,
                      height: `${cubeSize}px`,
                      background: getFaceBg(cube.faces.right, outerColor),
                      border: `1px solid ${cube.faces.right ? currentTheme.border : '#cbd5e1'}`,
                      transform: `rotateY(90deg) translateZ(${half}px)`,
                      boxSizing: 'border-box',
                      filter: 'brightness(0.96)',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 紧贴画布的控制区 (严格遵循黄金近邻与弹性换行原则) */}
      <div
        style={{
          marginTop: '16px',
          background: '#ffffff',
          borderRadius: '14px',
          padding: '16px 18px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        {/* 控制条第一行：阶数切换与爆炸滑块 */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            paddingBottom: '14px',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          {/* 阶数选择 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#334155' }}>
              🔲 每边等分数 (n)：
            </span>
            {[2, 3, 4].map((level) => (
              <button
                key={level}
                onClick={() => setN(level)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: n === level ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: n === level ? '#eff6ff' : '#ffffff',
                  color: n === level ? '#1d4ed8' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {level}×{level}×{level} ({level * level * level}块)
              </button>
            ))}
          </div>

          {/* 爆炸拉开滑块 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 260px', maxWidth: '380px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>
              💥 炸开拉伸:
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={explode}
              onChange={(e) => setExplode(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#2563eb', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2563eb', minWidth: '42px' }}>
              {explode}%
            </span>
          </div>
        </div>

        {/* 控制条第二行：分类高亮过滤器 */}
        <div style={{ marginTop: '14px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
            🔍 单独透视高亮分类：
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: activeFilter === 'all' ? '2px solid #475569' : '1px solid #cbd5e1',
                background: activeFilter === 'all' ? '#f1f5f9' : '#ffffff',
                color: '#1e293b',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              🌈 全部显示 ({n * n * n}块)
            </button>

            {([3, 2, 1, 0] as const).map((t) => {
              const cfg = TYPE_CONFIG[t];
              const isSelected = activeFilter === t;
              return (
                <button
                  key={t}
                  onClick={() => setActiveFilter(t)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: `2px solid ${isSelected ? cfg.border : 'transparent'}`,
                    background: isSelected ? cfg.bgLight : '#ffffff',
                    color: cfg.color,
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? `0 2px 8px ${cfg.bgLight}` : '0 1px 3px rgba(0,0,0,0.06)',
                    outline: isSelected ? 'none' : '1px solid #e2e8f0',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cfg.name} : <strong>{counts[t]}</strong> 块
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 考点剖析与算理公式卡片 */}
      <div
        style={{
          marginTop: '18px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
        }}
      >
        {([3, 2, 1, 0] as const).map((t) => {
          const cfg = TYPE_CONFIG[t];
          const isActive = activeFilter === 'all' || activeFilter === t;
          return (
            <div
              key={t}
              onClick={() => setActiveFilter(t)}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '14px',
                border: `2px solid ${activeFilter === t ? cfg.border : '#e2e8f0'}`,
                opacity: isActive ? 1 : 0.45,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeFilter === t ? `0 4px 14px ${cfg.bgLight}` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: cfg.color, fontSize: '0.98rem' }}>
                  {cfg.name}
                </span>
                <span
                  style={{
                    background: cfg.bgLight,
                    color: cfg.color,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                  }}
                >
                  {counts[t]} 块
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '8px' }}>
                {cfg.desc}
              </div>
              <div
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  background: '#f8fafc',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  borderLeft: `3px solid ${cfg.color}`,
                }}
              >
                公式: {cfg.formula}
              </div>
            </div>
          );
        })}
      </div>

      {/* 守恒总体验算条 */}
      <div
        style={{
          marginTop: '16px',
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'linear-gradient(90deg, #eff6ff 0%, #f0fdf4 100%)',
          border: '1px solid #bfdbfe',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          fontSize: '0.92rem',
        }}
      >
        <span style={{ color: '#1e3a8a', fontWeight: 600 }}>
          💡 总体守恒验证：
          <span style={{ color: '#dc2626' }}>{counts[3]}</span> (顶) +{' '}
          <span style={{ color: '#2563eb' }}>{counts[2]}</span> (棱) +{' '}
          <span style={{ color: '#ca8a04' }}>{counts[1]}</span> (面) +{' '}
          <span style={{ color: '#059669' }}>{counts[0]}</span> (心) ={' '}
          <strong style={{ color: '#15803d', fontSize: '1.05rem' }}>{n * n * n} 块</strong>
        </span>
        <span style={{ color: '#475569', fontSize: '0.86rem' }}>
          代数恒等式: 8 + 12(n-2) + 6(n-2)² + (n-2)³ ≡ n³
        </span>
      </div>
    </div>
  );
}
