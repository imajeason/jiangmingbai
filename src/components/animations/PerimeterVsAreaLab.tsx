'use client';

import React, { useState } from 'react';
import { Maximize2, Sparkles, TrendingUp, HelpCircle, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';
import styles from '@/styles/animations.module.css';

interface Config {
  perimeter: number; // e.g. 24
  label: string;
}

const CONFIGS: Config[] = [
  { perimeter: 24, label: '周长 24 cm (半周长 12)' },
  { perimeter: 20, label: '周长 20 cm (半周长 10)' },
  { perimeter: 16, label: '周长 16 cm (半周长 8)' },
];

export default function PerimeterVsAreaLab() {
  const [totalPerimeter, setTotalPerimeter] = useState<number>(24);
  const halfPerimeter = totalPerimeter / 2; // e.g. 12

  // 宽 b (从 1 到 halfPerimeter / 2)
  const [widthB, setWidthB] = useState<number>(3);

  // 长 a = 半周长 - 宽
  const lengthA = halfPerimeter - widthB;
  const area = lengthA * widthB;
  const diff = Math.abs(lengthA - widthB);

  // 正方形的边长
  const squareSide = halfPerimeter / 2;
  const maxArea = squareSide * squareSide;
  const isSquare = lengthA === widthB;

  // 生成该周长下所有整数长宽组合
  const allCombos = [];
  for (let b = 1; b <= Math.floor(halfPerimeter / 2); b++) {
    const a = halfPerimeter - b;
    allCombos.push({
      a,
      b,
      diff: a - b,
      area: a * b,
      isMax: a === b,
    });
  }

  // 画布尺寸换算 (1 cm = scale px)
  const scale = 22; // 22px per cm
  const rectW = lengthA * scale;
  const rectH = widthB * scale;

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Maximize2 size={18} color="#2563eb" />
          <span>周长与面积实验室：周长相等，为什么正方形面积最大？</span>
        </div>
        <div className={styles.labControls}>
          {CONFIGS.map((cfg) => (
            <button
              key={cfg.perimeter}
              className={`${styles.controlBtn} ${totalPerimeter === cfg.perimeter ? styles.controlBtnActive : ''}`}
              onClick={() => {
                setTotalPerimeter(cfg.perimeter);
                setWidthB(Math.max(1, Math.floor(cfg.perimeter / 4) - 1));
              }}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* 主画布与对比看板 */}
      <div className={styles.canvasWrapper} style={{ minHeight: '440px', padding: '20px' }}>
        {/* 口诀高亮指示条 */}
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 18px',
              borderRadius: '20px',
              background: isSquare ? '#ecfdf5' : '#fef3c7',
              color: isSquare ? '#065f46' : '#92400e',
              fontSize: '0.9rem',
              fontWeight: 700,
              border: `1px solid ${isSquare ? '#a7f3d0' : '#fde68a'}`,
              transition: 'all 0.3s ease',
            }}
          >
            <Sparkles size={16} color={isSquare ? '#059669' : '#d97706'} />
            <span>
              {isSquare
                ? `🎉 长宽相等变成正方形 (${lengthA}×${widthB})！长宽差为 0，面积达到最大峰值 ${area} cm²！`
                : `💡 当前长 ${lengthA}cm，宽 ${widthB}cm（长宽差 ${diff}cm），面积是 ${area} cm²。越接近正方形，面积越大！`}
            </span>
          </span>
        </div>

        {/* 双栏布局：左侧拉伸闭合绳圈，右侧面积柱状对比图 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', width: '100%', maxWidth: '720px' }}>
          {/* 左侧：动态绳圈拉伸矩形 */}
          <div
            style={{
              flex: '1 1 360px',
              minHeight: '340px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: '12px', left: '16px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
              🧶 闭合绳圈（周长始终固定为 {totalPerimeter} cm）
            </div>

            <svg viewBox="0 0 340 260" width="100%" height="260" style={{ maxWidth: '340px' }}>
              <defs>
                {/* 面积网格图案 */}
                <pattern id="unitTile" width={scale} height={scale} patternUnits="userSpaceOnUse">
                  <rect width={scale} height={scale} fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
                </pattern>
                {/* 绳索纹理 */}
                <linearGradient id="ropeGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>

              <g transform="translate(170, 130)">
                {/* 矩形主体（平滑形变过渡） */}
                <g
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  {/* 矩形内部网格面积 */}
                  <rect
                    x={-rectW / 2}
                    y={-rectH / 2}
                    width={rectW}
                    height={rectH}
                    fill={isSquare ? '#dcfce7' : 'url(#unitTile)'}
                    stroke={isSquare ? '#10b981' : '#3b82f6'}
                    strokeWidth="1.5"
                    rx="4"
                  />

                  {/* 外部闭合绳圈边框（高亮金黄色绳索） */}
                  <rect
                    x={-rectW / 2}
                    y={-rectH / 2}
                    width={rectW}
                    height={rectH}
                    fill="none"
                    stroke="url(#ropeGrad)"
                    strokeWidth="4"
                    strokeDasharray="8 3"
                    rx="4"
                  />

                  {/* 面积居中数字 */}
                  <g>
                    <rect
                      x="-38"
                      y="-16"
                      width="76"
                      height="32"
                      rx="6"
                      fill="#ffffff"
                      fillOpacity="0.95"
                      stroke={isSquare ? '#10b981' : '#3b82f6'}
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="5"
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="900"
                      fill={isSquare ? '#047857' : '#1d4ed8'}
                    >
                      {area} cm²
                    </text>
                  </g>

                  {/* 顶部标注长 a */}
                  <text
                    x="0"
                    y={-rectH / 2 - 10}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="800"
                    fill="#1e293b"
                  >
                    长 a = {lengthA} cm
                  </text>

                  {/* 右侧标注宽 b */}
                  <text
                    x={rectW / 2 + 12}
                    y="4"
                    textAnchor="start"
                    fontSize="12"
                    fontWeight="800"
                    fill="#b45309"
                  >
                    宽 b = {widthB} cm
                  </text>
                </g>
              </g>
            </svg>

            {/* 状态徽章 */}
            <div style={{ fontSize: '0.8rem', color: '#475569', textAlign: 'center', marginTop: '6px' }}>
              周长公式：<code style={{ color: '#d97706', fontWeight: 800 }}>({lengthA} + {widthB}) × 2 = {totalPerimeter} cm</code>
            </div>
          </div>

          {/* 右侧：长宽差与面积变化曲线图表 */}
          <div
            style={{
              flex: '1 1 320px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '16px 20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
                <TrendingUp size={16} color="#2563eb" />
                <span>长宽差越小，面积越大对比表</span>
              </div>

              {/* 柱状进度对比 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {allCombos.map((item) => {
                  const isCurrent = item.b === widthB;
                  const barWidthPercent = (item.area / maxArea) * 100;

                  return (
                    <div
                      key={item.b}
                      onClick={() => setWidthB(item.b)}
                      style={{
                        cursor: 'pointer',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: isCurrent ? (item.isMax ? '#ecfdf5' : '#eff6ff') : '#f8fafc',
                        border: isCurrent ? `2px solid ${item.isMax ? '#10b981' : '#3b82f6'}` : '1px solid #e2e8f0',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: isCurrent ? 800 : 600, color: isCurrent ? '#1e293b' : '#64748b', marginBottom: '3px' }}>
                        <span>
                          {item.a} × {item.b} {item.isMax ? '（正方形）' : `(差 ${item.diff})`}
                        </span>
                        <span style={{ color: item.isMax ? '#059669' : '#2563eb' }}>
                          面积 = {item.area} cm²
                        </span>
                      </div>

                      {/* 柱状进度条 */}
                      <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${barWidthPercent}%`,
                            height: '100%',
                            background: item.isMax ? 'linear-gradient(90deg, #34d399, #059669)' : 'linear-gradient(90deg, #60a5fa, #2563eb)',
                            borderRadius: '4px',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 考场避坑核心法则卡 */}
            <div
              style={{
                marginTop: '14px',
                padding: '10px 12px',
                background: '#fffbeb',
                borderRadius: '8px',
                borderLeft: '4px solid #f59e0b',
                fontSize: '0.8rem',
                color: '#78350f',
                lineHeight: 1.5,
              }}
            >
              <strong>🚨 考场秒杀口诀：</strong>
              <div style={{ marginTop: '2px' }}>
                “周长相等比面积，长宽差小面积大；<br />
                两数相等成正方，面积最大谁怕它！”
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部滑块控制台 */}
      <div className={styles.sliderPanel}>
        <div className={styles.sliderGroup} style={{ flex: '2 1 300px' }}>
          <span className={styles.sliderLabel}>拉伸绳圈（调整宽 b）：</span>
          <input
            type="range"
            min="1"
            max={Math.floor(halfPerimeter / 2)}
            step="1"
            value={widthB}
            onChange={(e) => setWidthB(Number(e.target.value))}
            className={styles.sliderInput}
          />
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2563eb', minWidth: '85px' }}>
            宽 {widthB}cm (长 {lengthA}cm)
          </span>

          <button
            onClick={() => setWidthB(Math.floor(halfPerimeter / 2))}
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
            一键变正方形（面积最大）
          </button>
        </div>

        <button
          onClick={() => setWidthB(1)}
          className={styles.controlBtn}
          style={{ fontSize: '0.8rem' }}
        >
          <RotateCcw size={14} />
          <span>拉成极端细长</span>
        </button>
      </div>
    </div>
  );
}
