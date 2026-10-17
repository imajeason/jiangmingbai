'use client';

import React, { useState } from 'react';
import { Eye, Layers, Sparkles, Box, RotateCcw, CheckCircle2 } from 'lucide-react';
import styles from '@/styles/animations.module.css';

interface CubePos {
  x: number; // 0, 1, 2
  y: number; // 0, 1, 2
  z: number; // 0 (底层), 1 (中层), 2 (顶层)
  isHidden?: boolean; // 是否是正面视角被完全或部分遮挡的暗块
}

interface PresetModel {
  name: string;
  desc: string;
  cubes: CubePos[];
  topView: number[][]; // 3x3 俯视标数
}

const PRESETS: PresetModel[] = [
  {
    name: '题型一：经典阶梯塔',
    desc: '最容易漏数最高柱子底下的“垫脚石”',
    cubes: [
      // 底层 z=0 (共 4 块)
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 1, y: 1, z: 0, isHidden: true },
      // 第二层 z=1 (共 2 块)
      { x: 0, y: 0, z: 1 },
      { x: 1, y: 0, z: 1 },
      // 第三层 z=2 (共 1 块)
      { x: 0, y: 0, z: 2 },
    ],
    topView: [
      [3, 2],
      [1, 1],
    ],
  },
  {
    name: '题型二：转角暗房',
    desc: '拐角背后藏着完全看不见的小立方体',
    cubes: [
      // 底层 z=0 (共 5 块)
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 2, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 0, y: 2, z: 0 },
      // 第二层 z=1 (共 3 块)
      { x: 0, y: 0, z: 1 },
      { x: 1, y: 0, z: 1 },
      { x: 0, y: 1, z: 1 },
      // 第三层 z=2 (共 1 块)
      { x: 0, y: 0, z: 2 },
    ],
    topView: [
      [3, 2, 1],
      [2, 0, 0],
      [1, 0, 0],
    ],
  },
  {
    name: '题型三：高空悬浮陷阱',
    desc: '空中不会悬空浮着积木，悬在 3 楼底下必有 2 楼和 1 楼！',
    cubes: [
      // 底层 z=0
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 2, y: 0, z: 0 },
      { x: 1, y: 1, z: 0, isHidden: true },
      // 第二层 z=1
      { x: 0, y: 0, z: 1 },
      { x: 1, y: 0, z: 1, isHidden: true },
      { x: 1, y: 1, z: 1 },
      // 第三层 z=2
      { x: 1, y: 0, z: 2 },
    ],
    topView: [
      [2, 3, 1],
      [0, 2, 0],
    ],
  },
];

export default function HiddenCubesLab() {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'normal' | 'xray' | 'exploded' | 'topView'>('normal');
  const [explodeGap, setExplodeGap] = useState<number>(45);

  const model = PRESETS[selectedPresetIdx];
  const totalCubes = model.cubes.length;

  // 各层积木统计
  const layer0Count = model.cubes.filter((c) => c.z === 0).length;
  const layer1Count = model.cubes.filter((c) => c.z === 1).length;
  const layer2Count = model.cubes.filter((c) => c.z === 2).length;

  // 等轴测投影几何参数
  const originX = 260;
  const originY = 220;
  const isoWidth = 44;
  const isoHeight = 25;
  const cubeHeight = 38;

  // 排序绘制顺序：后方的、低层的先画（从背面 (x+y 最小) 到正面 (x+y 最大)，从 z 最小到 z 最大）
  const sortedCubes = [...model.cubes].sort((a, b) => {
    if (a.z !== b.z) return a.z - b.z;
    return a.x + a.y - (b.x + b.y);
  });

  return (
    <div className={styles.labContainer}>
      {/* 顶部标题 */}
      <div className={styles.labHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Box size={20} color="#2563eb" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            数正方体积木实验室：看穿被压在底下的“隐形积木”
          </h2>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          空中不能悬空！掌握“升降机分层法”与“俯视标数法”，一个也不漏
        </span>
      </div>

      {/* 核心视角模式切换 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        <button
          onClick={() => setViewMode('normal')}
          className={`btn ${viewMode === 'normal' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.825rem', padding: '6px 14px' }}
        >
          👀 试卷正面视角（眼睛直接看到的）
        </button>
        <button
          onClick={() => setViewMode('xray')}
          className={`btn ${viewMode === 'xray' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.825rem', padding: '6px 14px' }}
        >
          🔍 透视 X 光模式（高亮暗块）
        </button>
        <button
          onClick={() => setViewMode('exploded')}
          className={`btn ${viewMode === 'exploded' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.825rem', padding: '6px 14px' }}
        >
          🚀 升降机分层拆解（一层一层数）
        </button>
        <button
          onClick={() => setViewMode('topView')}
          className={`btn ${viewMode === 'topView' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.825rem', padding: '6px 14px' }}
        >
          📐 俯视标数法（最快满分秘诀）
        </button>
      </div>

      <div className={styles.canvasWrapper} style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '24px 20px', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
        {/* 提示醒目标签 */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '20px',
            background: viewMode === 'xray' ? '#fee2e2' : viewMode === 'exploded' ? '#eff6ff' : viewMode === 'topView' ? '#fef3c7' : '#e2e8f0',
            color: viewMode === 'xray' ? '#b91c1c' : viewMode === 'exploded' ? '#1d4ed8' : viewMode === 'topView' ? '#92400e' : '#334155',
            fontSize: '0.9rem',
            fontWeight: 700,
          }}>
            {viewMode === 'normal' && '⚠️ 试卷视角：很多孩子脱口而出数出的答案往往偏少！因为被挡住的积木眼睛看不到！'}
            {viewMode === 'xray' && '✨ 透视开启：黄色/红色发光的是完全被挡在背后的“暗块”！它们是承受上面重力的根基！'}
            {viewMode === 'exploded' && '🚀 分层拆解：像切蛋糕一样把每一层抬起！第1层 + 第2层 + 第3层 = 总数！'}
            {viewMode === 'topView' && '📐 俯视标数法：从头顶往下看，每一栋柱子有几层就标几，加起来就是答案！'}
          </span>
        </div>

        {/* 3D 轴测等轴正方体渲染舞台 */}
        {viewMode !== 'topView' ? (
          <div style={{ width: '100%', maxWidth: '540px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
            <svg viewBox="0 0 520 380" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              <defs>
                <filter id="cubeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.1" />
                </filter>
              </defs>

              {/* 地面阴影基座 */}
              <ellipse cx="260" cy="270" rx="160" ry="40" fill="#e2e8f0" opacity="0.6" />

              {/* 渲染所有小正方体 */}
              {sortedCubes.map((cube, idx) => {
                // 计算当前高度偏移（如果是 exploded 模式，随 z 提升）
                const layerOffset = viewMode === 'exploded' ? cube.z * explodeGap : 0;
                
                // 等轴投影坐标
                const cx = originX + (cube.y - cube.x) * isoWidth;
                const cy = originY + (cube.x + cube.y) * isoHeight - cube.z * cubeHeight - layerOffset;

                // 顶点计算
                const topP0 = `${cx},${cy - isoHeight}`;
                const topP1 = `${cx + isoWidth},${cy}`;
                const topP2 = `${cx},${cy + isoHeight}`;
                const topP3 = `${cx - isoWidth},${cy}`;

                const leftP0 = `${cx - isoWidth},${cy}`;
                const leftP1 = `${cx},${cy + isoHeight}`;
                const leftP2 = `${cx},${cy + isoHeight + cubeHeight}`;
                const leftP3 = `${cx - isoWidth},${cy + cubeHeight}`;

                const rightP0 = `${cx},${cy + isoHeight}`;
                const rightP1 = `${cx + isoWidth},${cy}`;
                const rightP2 = `${cx + isoWidth},${cy + cubeHeight}`;
                const rightP3 = `${cx},${cy + isoHeight + cubeHeight}`;

                // 颜色体系
                const isXray = viewMode === 'xray';
                const isHiddenBlock = cube.isHidden;

                let topColor = '#93c5fd';
                let leftColor = '#3b82f6';
                let rightColor = '#1d4ed8';
                let opacity = 1;

                if (isXray) {
                  if (isHiddenBlock) {
                    // 暗块高亮发光
                    topColor = '#fde047';
                    leftColor = '#eab308';
                    rightColor = '#ca8a04';
                    opacity = 0.95;
                  } else {
                    // 前表面积木半透明
                    opacity = 0.35;
                  }
                } else if (viewMode === 'exploded') {
                  // 分层不同色
                  if (cube.z === 0) {
                    topColor = '#86efac';
                    leftColor = '#22c55e';
                    rightColor = '#15803d';
                  } else if (cube.z === 1) {
                    topColor = '#93c5fd';
                    leftColor = '#3b82f6';
                    rightColor = '#1d4ed8';
                  } else {
                    topColor = '#fca5a5';
                    leftColor = '#ef4444';
                    rightColor = '#b91c1c';
                  }
                }

                return (
                  <g key={`${cube.x}-${cube.y}-${cube.z}`} opacity={opacity} filter="url(#cubeGlow)" style={{ transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                    {/* 左侧面 (中度阴影) */}
                    <polygon points={`${leftP0} ${leftP1} ${leftP2} ${leftP3}`} fill={leftColor} stroke="#ffffff" strokeWidth="1.5" />
                    {/* 右侧面 (深度阴影) */}
                    <polygon points={`${rightP0} ${rightP1} ${rightP2} ${rightP3}`} fill={rightColor} stroke="#ffffff" strokeWidth="1.5" />
                    {/* 顶面 (受光面) */}
                    <polygon points={`${topP0} ${topP1} ${topP2} ${topP3}`} fill={topColor} stroke="#ffffff" strokeWidth="1.5" />

                    {/* 暗块标记提示 */}
                    {isXray && isHiddenBlock && (
                      <text x={cx} y={cy + 4} textAnchor="middle" fill="#78350f" fontSize="11" fontWeight="900">
                        暗块
                      </text>
                    )}

                    {/* 分层拆解时的层级编号 */}
                    {viewMode === 'exploded' && (
                      <text x={cx} y={cy + 4} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="800">
                        第{cube.z + 1}层
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          /* 俯视 3x3 标数法网格展示 */
          <div style={{ maxWidth: '420px', margin: '0 auto', padding: '16px 20px', background: '#ffffff', borderRadius: '16px', border: '2px solid #fed7aa', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9a3412', textAlign: 'center', marginBottom: '12px' }}>
              从正上方往下俯视：每一列数出“叠了多高”
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${model.topView[0].length}, 60px)`, gap: '10px', justifyContent: 'center', margin: '14px 0' }}>
              {model.topView.map((row, rIdx) =>
                row.map((height, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '12px',
                      background: height > 0 ? '#eff6ff' : '#f1f5f9',
                      border: height > 0 ? '2px solid #3b82f6' : '1px dashed #cbd5e1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                    }}
                  >
                    {height > 0 ? (
                      <>
                        <span style={{ fontSize: '1.4rem', color: '#1d4ed8' }}>{height}</span>
                        <span style={{ fontSize: '0.65rem', color: '#64748b' }}>层</span>
                      </>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>空</span>
                    )}
                  </div>
                ))
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.9rem', color: '#475569' }}>
              把所有柱高直接加起来：
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#b45309', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                {model.topView.flat().filter(h => h > 0).join(' + ')} = {totalCubes} 个！
              </div>
            </div>
          </div>
        )}

        {/* 算式与分层统计卡片 */}
        <div style={{
          maxWidth: '560px',
          width: '100%',
          margin: '20px auto 0',
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
            升降机分层数数法：
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1e293b', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: '#16a34a' }}>第1层({layer0Count}块)</span> +{' '}
            <span style={{ color: '#2563eb' }}>第2层({layer1Count}块)</span>
            {layer2Count > 0 && <span style={{ color: '#dc2626' }}> + 第3层({layer2Count}块)</span>} ={' '}
            <span style={{ color: '#d97706', fontSize: '1.6rem' }}>{totalCubes}</span> 块正方体
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>
            牢记黄金铁律：<strong>“二楼底下必有一楼，三楼底下必有二楼和一楼！”</strong> 顺着顶上往下摸底，一个暗块都漏不掉！
          </div>
        </div>
      </div>

      {/* 底部控制台 */}
      <div className={styles.controlsGrid} style={{ marginTop: '20px' }}>
        {/* 题型预设 */}
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
            选择经典考试积木模型：
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {PRESETS.map((p, idx) => (
              <button
                key={p.name}
                onClick={() => { setSelectedPresetIdx(idx); setViewMode('normal'); }}
                className={`btn ${selectedPresetIdx === idx ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.825rem', padding: '6px 14px' }}
              >
                {p.name} ({p.cubes.length}块)
              </button>
            ))}
          </div>
        </div>

        {/* 分层拆解高度微调滑块 (仅在 exploded 模式有效) */}
        {viewMode === 'exploded' && (
          <div className={styles.controlItem} style={{ gridColumn: '1 / -1' }}>
            <div className={styles.controlLabel}>
              <span>层与层之间的拉开距离：</span>
              <span className={styles.controlValue}>{explodeGap} px</span>
            </div>
            <input
              type="range"
              min="20"
              max="70"
              value={explodeGap}
              onChange={(e) => setExplodeGap(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        )}

        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
          <button
            onClick={() => setViewMode('normal')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={16} />
            还原默认正面视角
          </button>
        </div>
      </div>
    </div>
  );
}
