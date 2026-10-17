'use client';

import React, { useState } from 'react';
import { RotateCw, Sparkles, Layers, Grid, RotateCcw } from 'lucide-react';
import styles from '@/styles/animations.module.css';

interface Preset {
  rows: number;
  cols: number;
  label: string;
}

const PRESETS: Preset[] = [
  { rows: 3, cols: 4, label: '经典：3 × 4 与 4 × 3' },
  { rows: 2, cols: 5, label: '经典：2 × 5 与 5 × 2' },
  { rows: 3, cols: 6, label: '三六十八' },
  { rows: 4, cols: 5, label: '四五二十' },
];

export default function MultiplicationArrayLab() {
  const [rows, setRows] = useState<number>(3);
  const [cols, setCols] = useState<number>(4);
  const [isRotated, setIsRotated] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'row' | 'col' | 'all'>('row');

  // 当前有效行列（考虑旋转）
  const displayRows = isRotated ? cols : rows;
  const displayCols = isRotated ? rows : cols;
  const total = displayRows * displayCols;

  // 旋转 90 度
  const handleToggleRotate = () => {
    setIsRotated((prev) => !prev);
  };

  // 重置
  const handleReset = () => {
    setRows(3);
    setCols(4);
    setIsRotated(false);
    setViewMode('row');
  };

  const handleApplyPreset = (p: Preset) => {
    setRows(p.rows);
    setCols(p.cols);
    setIsRotated(false);
  };

  return (
    <div className={styles.labContainer}>
      {/* 顶部标题与说明 */}
      <div className={styles.labHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Grid size={20} color="#2563eb" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            乘法点阵实验室：为什么 3 × 4 等于 4 × 3？
          </h2>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          转动点阵矩阵，亲眼见证乘法交换律的几何视觉本质
        </span>
      </div>

      {/* 观察视角切换 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        <button
          onClick={() => setViewMode('row')}
          className={`btn ${viewMode === 'row' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '6px 14px' }}
        >
          👀 按横排看：{displayRows} 排，每排 {displayCols} 颗
        </button>
        <button
          onClick={() => setViewMode('col')}
          className={`btn ${viewMode === 'col' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '6px 14px' }}
        >
          👀 按竖列看：{displayCols} 列，每列 {displayRows} 颗
        </button>
        <button
          onClick={() => setViewMode('all')}
          className={`btn ${viewMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '6px 14px' }}
        >
          🌟 查看点阵整体 ({total} 颗)
        </button>
      </div>

      <div className={styles.canvasWrapper} style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '28px 20px', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
        {/* 动态双重视角算式高亮卡 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          width: '100%',
          maxWidth: '620px',
          margin: '0 auto 24px',
        }}>
          {/* 横排视角算式 */}
          <div style={{
            background: viewMode === 'row' ? '#eff6ff' : '#ffffff',
            border: viewMode === 'row' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '14px 16px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
          }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
              视角一：按【横排】数加法
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d4ed8' }}>
              {Array(displayRows).fill(displayCols).join(' + ')} = {total}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#2563eb', marginTop: '4px', fontWeight: 700 }}>
              写成乘法：{displayRows} × {displayCols} = {total}
            </div>
          </div>

          {/* 竖列视角算式 */}
          <div style={{
            background: viewMode === 'col' ? '#fdf2f8' : '#ffffff',
            border: viewMode === 'col' ? '2px solid #ec4899' : '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '14px 16px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
          }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
              视角二：按【竖列】数加法
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#be185d' }}>
              {Array(displayCols).fill(displayRows).join(' + ')} = {total}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#db2777', marginTop: '4px', fontWeight: 700 }}>
              写成乘法：{displayCols} × {displayRows} = {total}
            </div>
          </div>
        </div>

        {/* 核心矩阵动画展示舞台 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '260px',

          perspective: '1000px',
        }}>
          <div
            style={{
              display: 'inline-grid',
              gridTemplateRows: `repeat(${displayRows}, 48px)`,
              gridTemplateColumns: `repeat(${displayCols}, 48px)`,
              gap: '12px',
              padding: '24px',
              background: '#ffffff',
              borderRadius: '20px',
              border: '2px solid #e2e8f0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: isRotated ? 'rotate(90deg)' : 'none',
            }}
          >
            {Array.from({ length: displayRows }).map((_, rIdx) =>
              Array.from({ length: displayCols }).map((_, cIdx) => {
                const isRowActive = viewMode === 'row';
                const isColActive = viewMode === 'col';
                const ballIndex = rIdx * displayCols + cIdx + 1;

                // 颜色变化
                let bgColor = '#3b82f6';
                if (isRowActive) {
                  const rowColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
                  bgColor = rowColors[rIdx % rowColors.length];
                } else if (isColActive) {
                  const colColors = ['#f43f5e', '#8b5cf6', '#0ea5e9', '#10b981', '#eab308', '#f97316'];
                  bgColor = colColors[cIdx % colColors.length];
                }

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.875rem',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                      transition: 'all 0.3s ease',
                      transform: isRotated ? 'rotate(-90deg)' : 'none', // 保持数字朝向正向
                    }}
                  >
                    {ballIndex}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 旋转 90 度结论说明卡 */}
        <div style={{
          width: '100%',
          maxWidth: '580px',
          margin: '24px auto 0',
          padding: '16px 20px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '14px',
          textAlign: 'center',
        }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 800, color: '#92400e', marginBottom: '6px' }}>
            <Sparkles size={16} color="#d97706" />
            <span>核心视觉顿悟：一颗球也没多，一颗球也没少！</span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#78350f', lineHeight: 1.6 }}>
            当我们把 {displayRows} × {displayCols} 的点阵<strong>顺时针旋转 90 度</strong>时：
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#b45309', margin: '4px 0' }}>
              {displayRows} × {displayCols} 变成了 {displayCols} × {displayRows}
            </div>
            总数始终是 <strong>{total}</strong> 颗！这就是乘法交换律的几何铁证：<strong>a × b = b × a</strong>！
          </div>
        </div>
      </div>

      {/* 底部控制台 */}
      <div className={styles.controlsGrid} style={{ marginTop: '20px' }}>
        {/* 预设按钮 */}
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
            选择经典乘法口诀案例：
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {PRESETS.map((p) => {
              const isActive = rows === p.rows && cols === p.cols;
              return (
                <button
                  key={p.label}
                  onClick={() => handleApplyPreset(p)}
                  className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.825rem', padding: '6px 12px' }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 行列滑块调节 */}
        <div className={styles.controlItem}>
          <div className={styles.controlLabel}>
            <span>横排数（行数）：</span>
            <span className={styles.controlValue}>{rows} 行</span>
          </div>
          <input
            type="range"
            min="2"
            max="6"
            value={rows}
            onChange={(e) => { setRows(Number(e.target.value)); setIsRotated(false); }}
            className={styles.slider}
          />
        </div>

        <div className={styles.controlItem}>
          <div className={styles.controlLabel}>
            <span>每排个数（列数）：</span>
            <span className={styles.controlValue}>{cols} 列</span>
          </div>
          <input
            type="range"
            min="2"
            max="6"
            value={cols}
            onChange={(e) => { setCols(Number(e.target.value)); setIsRotated(false); }}
            className={styles.slider}
          />
        </div>

        {/* 操作动作 */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
          <button
            onClick={handleToggleRotate}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCw size={16} />
            {isRotated ? '转回原状（还原角度）' : '旋转 90 度（验证乘法交换律）'}
          </button>

          <button
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}
          >
            <RotateCcw size={16} />
            还原默认点阵
          </button>
        </div>
      </div>
    </div>
  );
}
