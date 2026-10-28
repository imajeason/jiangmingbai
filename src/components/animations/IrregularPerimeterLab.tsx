'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type ShapeType = 'stairs' | 'concave' | 'notch' | 'convex';

interface ShapeConfig {
  name: string;
  desc: string;
  baseWidth: number;
  baseHeight: number;
}

const SHAPES: Record<ShapeType, ShapeConfig> = {
  stairs: {
    name: '阶梯楼梯形',
    desc: '台阶虽多，每一级横线向外推平＝底，竖线向上推平＝高！',
    baseWidth: 12,
    baseHeight: 8,
  },
  concave: {
    name: '凹字形 (常考避坑王)',
    desc: '底向上推平变成大长方形，但注意凹陷进去的两条内壁必须加倍补算！',
    baseWidth: 14,
    baseHeight: 9,
  },
  notch: {
    name: '缺角拐角形',
    desc: '右上角缺了一块，两条缺口边直接向外平移，严丝合缝变回大长方形！',
    baseWidth: 12,
    baseHeight: 8,
  },
  convex: {
    name: '凸字形',
    desc: '顶部凸起部分两侧横边推下，顶边推平，周长同样等同于大长方形！',
    baseWidth: 14,
    baseHeight: 10,
  },
};

export default function IrregularPerimeterLab() {
  const [shape, setShape] = useState<ShapeType>('concave');
  const [progress, setProgress] = useState<number>(60); // 0 ~ 100%
  const [showFormula, setShowFormula] = useState<boolean>(true);

  // 凹槽深度
  const [concaveDepth, setConcaveDepth] = useState<number>(4);

  const cfg = SHAPES[shape];
  const t = progress / 100; // 0 to 1

  // 计算周长
  let normalRectPerimeter = (cfg.baseWidth + cfg.baseHeight) * 2;
  let extraPerimeter = 0;
  if (shape === 'concave') {
    extraPerimeter = concaveDepth * 2;
  }
  const totalPerimeter = normalRectPerimeter + extraPerimeter;

  // 画布坐标映射 (SVG viewBox: 0 0 540 320)
  const scale = 20;
  const startX = 110;
  const startY = 60;
  const w = cfg.baseWidth * scale;
  const h = cfg.baseHeight * scale;

  return (
    <div className={styles.container} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 头部标题 */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', color: '#1e293b' }}>
          📐 巧求不规则图形周长：平移法变形记
        </h3>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>
          遇到凹凸拐角不知道小边长怎么算？拖动“平移推平”滑块，见证线段向外吸附还原大长方形！
        </p>
      </div>

      {/* 可视化动画主舞台 */}
      <div
        style={{
          width: '100%',
          minHeight: '380px',
          background: 'radial-gradient(circle at 50% 50%, #f8fafc 0%, #edf2f7 100%)',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          padding: '20px 14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        <svg viewBox="0 0 540 320" width="100%" height="320" style={{ overflow: 'visible' }}>
          <defs>
            {/* 网格背景 */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            </pattern>
            {/* 渐变 */}
            <linearGradient id="shapeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* 网格底纸 */}
          <rect x="20" y="20" width="500" height="280" fill="url(#grid)" rx="8" />

          {/* 目标参考大长方形 (虚线框) */}
          <rect
            x={startX}
            y={startY}
            width={w}
            height={h}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            rx="2"
          />

          {/* 尺寸外标 */}
          <g transform={`translate(${startX}, ${startY - 14})`}>
            <line x1="0" y1="0" x2={w} y2="0" stroke="#475569" strokeWidth="1.2" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#475569" strokeWidth="1.2" />
            <line x1={w} y1="-4" x2={w} y2="4" stroke="#475569" strokeWidth="1.2" />
            <text x={w / 2} y="-6" textAnchor="middle" fontSize="12" fill="#1e293b" fontWeight="700">
              总长 = {cfg.baseWidth} cm
            </text>
          </g>

          <g transform={`translate(${startX - 14}, ${startY})`}>
            <line x1="0" y1="0" x2="0" y2={h} stroke="#475569" strokeWidth="1.2" />
            <line x1="-4" y1="0" x2="4" y2="0" stroke="#475569" strokeWidth="1.2" />
            <line x1="-4" y1={h} x2="4" y2={h} stroke="#475569" strokeWidth="1.2" />
            <text
              x="-6"
              y={h / 2}
              textAnchor="middle"
              fontSize="12"
              fill="#1e293b"
              fontWeight="700"
              transform={`rotate(-90, -6, ${h / 2})`}
            >
              总宽 = {cfg.baseHeight} cm
            </text>
          </g>

          {/* ==================== 1. 阶梯形动画 ==================== */}
          {shape === 'stairs' && (
            <g>
              {/* 多边形浅蓝底色 */}
              <polygon
                points={`
                  ${startX},${startY} 
                  ${startX + w / 3},${startY} 
                  ${startX + w / 3},${startY + h / 3} 
                  ${startX + (2 * w) / 3},${startY + h / 3} 
                  ${startX + (2 * w) / 3},${startY + (2 * h) / 3} 
                  ${startX + w},${startY + (2 * h) / 3} 
                  ${startX + w},${startY + h} 
                  ${startX},${startY + h}
                `}
                fill="url(#shapeFill)"
              />

              {/* 外圈静止实线 (左、底) */}
              <line x1={startX} y1={startY} x2={startX} y2={startY + h} stroke="#2563eb" strokeWidth="3" />
              <line x1={startX} y1={startY + h} x2={startX + w} y2={startY + h} stroke="#2563eb" strokeWidth="3" />

              {/* 阶梯竖直小段 1, 2 向右平移推平 */}
              {/* 竖线1 (x: startX + w/3, y: startY -> startY + h/3) */}
              <line
                x1={startX + w / 3 + t * ((2 * w) / 3)}
                y1={startY}
                x2={startX + w / 3 + t * ((2 * w) / 3)}
                y2={startY + h / 3}
                stroke={t > 0 ? '#ef4444' : '#2563eb'}
                strokeWidth="3"
              />
              {/* 平移轨迹线 */}
              {t > 0 && (
                <line
                  x1={startX + w / 3}
                  y1={startY + h / 6}
                  x2={startX + w / 3 + t * ((2 * w) / 3)}
                  y2={startY + h / 6}
                  stroke="#ef4444"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
              )}

              {/* 竖线2 (x: startX + 2w/3, y: startY + h/3 -> startY + 2h/3) */}
              <line
                x1={startX + (2 * w) / 3 + t * (w / 3)}
                y1={startY + h / 3}
                x2={startX + (2 * w) / 3 + t * (w / 3)}
                y2={startY + (2 * h) / 3}
                stroke={t > 0 ? '#ef4444' : '#2563eb'}
                strokeWidth="3"
              />
              {t > 0 && (
                <line
                  x1={startX + (2 * w) / 3}
                  y1={startY + h / 2}
                  x2={startX + (2 * w) / 3 + t * (w / 3)}
                  y2={startY + h / 2}
                  stroke="#ef4444"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
              )}

              {/* 竖线3 本来就在最右侧 */}
              <line
                x1={startX + w}
                y1={startY + (2 * h) / 3}
                x2={startX + w}
                y2={startY + h}
                stroke="#2563eb"
                strokeWidth="3"
              />

              {/* 阶梯水平小段 1, 2, 3 (向上推平) */}
              {/* 横线1 本来就在顶端 */}
              <line x1={startX} y1={startY} x2={startX + w / 3} y2={startY} stroke="#2563eb" strokeWidth="3" />

              {/* 横线2 (y: startY + h/3 向上推平到 startY) */}
              <line
                x1={startX + w / 3}
                y1={startY + h / 3 - t * (h / 3)}
                x2={startX + (2 * w) / 3}
                y2={startY + h / 3 - t * (h / 3)}
                stroke={t > 0 ? '#10b981' : '#2563eb'}
                strokeWidth="3"
              />
              {t > 0 && (
                <line
                  x1={startX + w / 2}
                  y1={startY + h / 3}
                  x2={startX + w / 2}
                  y2={startY + h / 3 - t * (h / 3)}
                  stroke="#10b981"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
              )}

              {/* 横线3 (y: startY + 2h/3 向上推平到 startY) */}
              <line
                x1={startX + (2 * w) / 3}
                y1={startY + (2 * h) / 3 - t * ((2 * h) / 3)}
                x2={startX + w}
                y2={startY + (2 * h) / 3 - t * ((2 * h) / 3)}
                stroke={t > 0 ? '#10b981' : '#2563eb'}
                strokeWidth="3"
              />
              {t > 0 && (
                <line
                  x1={startX + (5 * w) / 6}
                  y1={startY + (2 * h) / 3}
                  x2={startX + (5 * w) / 6}
                  y2={startY + (2 * h) / 3 - t * ((2 * h) / 3)}
                  stroke="#10b981"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
              )}
            </g>
          )}

          {/* ==================== 2. 凹字形动画 (重点避坑) ==================== */}
          {shape === 'concave' && (
            <g>
              {/* 凹陷多边形底色 */}
              {(() => {
                const cLeft = startX + w * 0.35;
                const cRight = startX + w * 0.65;
                const cBottom = startY + concaveDepth * scale;
                return (
                  <>
                    <polygon
                      points={`
                        ${startX},${startY} 
                        ${cLeft},${startY} 
                        ${cLeft},${cBottom} 
                        ${cRight},${cBottom} 
                        ${cRight},${startY} 
                        ${startX + w},${startY} 
                        ${startX + w},${startY + h} 
                        ${startX},${startY + h}
                      `}
                      fill="url(#shapeFill)"
                    />

                    {/* 大长方形三面外框 (左、右、底、顶部的左右耳) */}
                    <line x1={startX} y1={startY} x2={startX} y2={startY + h} stroke="#2563eb" strokeWidth="3" />
                    <line x1={startX} y1={startY + h} x2={startX + w} y2={startY + h} stroke="#2563eb" strokeWidth="3" />
                    <line x1={startX + w} y1={startY} x2={startX + w} y2={startY + h} stroke="#2563eb" strokeWidth="3" />
                    <line x1={startX} y1={startY} x2={cLeft} y2={startY} stroke="#2563eb" strokeWidth="3" />
                    <line x1={cRight} y1={startY} x2={startX + w} y2={startY} stroke="#2563eb" strokeWidth="3" />

                    {/* 凹底横线 (向上推平填满顶部缺口) */}
                    <line
                      x1={cLeft}
                      y1={cBottom - t * (concaveDepth * scale)}
                      x2={cRight}
                      y2={cBottom - t * (concaveDepth * scale)}
                      stroke="#10b981"
                      strokeWidth="3.5"
                    />
                    {t > 0 && (
                      <line
                        x1={(cLeft + cRight) / 2}
                        y1={cBottom}
                        x2={(cLeft + cRight) / 2}
                        y2={cBottom - t * (concaveDepth * scale)}
                        stroke="#10b981"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* 关键警示线：凹进去的两条竖线 (无法向外推平，永远留在内部！) */}
                    <line
                      x1={cLeft}
                      y1={startY}
                      x2={cLeft}
                      y2={cBottom}
                      stroke="#dc2626"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <line
                      x1={cRight}
                      y1={startY}
                      x2={cRight}
                      y2={cBottom}
                      stroke="#dc2626"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    {/* 红色警示文字标签 */}
                    <g transform={`translate(${cLeft - 8}, ${startY + (concaveDepth * scale) / 2})`}>
                      <text x="-6" y="4" textAnchor="end" fontSize="11" fill="#dc2626" fontWeight="800">
                        深度 {concaveDepth}cm
                      </text>
                    </g>
                    <g transform={`translate(${cRight + 8}, ${startY + (concaveDepth * scale) / 2})`}>
                      <text x="6" y="4" textAnchor="start" fontSize="11" fill="#dc2626" fontWeight="800">
                        深度 {concaveDepth}cm
                      </text>
                    </g>

                    {/* 凹陷警示徽章 */}
                    <g transform={`translate(${(cLeft + cRight) / 2}, ${cBottom + 20})`}>
                      <rect x="-85" y="-12" width="170" height="24" rx="12" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
                      <text x="0" y="4" textAnchor="middle" fontSize="10.5" fill="#b91c1c" fontWeight="800">
                        ⚠️ 这 2 条红线无法推平！必须加算
                      </text>
                    </g>
                  </>
                );
              })()}
            </g>
          )}

          {/* ==================== 3. 缺角拐角形 ==================== */}
          {shape === 'notch' && (
            <g>
              {(() => {
                const nw = w * 0.4;
                const nh = h * 0.45;
                const cornerX = startX + w - nw;
                const cornerY = startY + nh;

                return (
                  <>
                    <polygon
                      points={`
                        ${startX},${startY} 
                        ${cornerX},${startY} 
                        ${cornerX},${cornerY} 
                        ${startX + w},${cornerY} 
                        ${startX + w},${startY + h} 
                        ${startX},${startY + h}
                      `}
                      fill="url(#shapeFill)"
                    />

                    <line x1={startX} y1={startY} x2={startX} y2={startY + h} stroke="#2563eb" strokeWidth="3" />
                    <line x1={startX} y1={startY + h} x2={startX + w} y2={startY + h} stroke="#2563eb" strokeWidth="3" />
                    <line x1={startX} y1={startY} x2={cornerX} y2={startY} stroke="#2563eb" strokeWidth="3" />
                    <line x1={startX + w} y1={cornerY} x2={startX + w} y2={startY + h} stroke="#2563eb" strokeWidth="3" />

                    {/* 缺角内部竖线向右推平 */}
                    <line
                      x1={cornerX + t * nw}
                      y1={startY}
                      x2={cornerX + t * nw}
                      y2={cornerY}
                      stroke="#ef4444"
                      strokeWidth="3.5"
                    />
                    {t > 0 && (
                      <line
                        x1={cornerX}
                        y1={(startY + cornerY) / 2}
                        x2={cornerX + t * nw}
                        y2={(startY + cornerY) / 2}
                        stroke="#ef4444"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* 缺角内部横线向上推平 */}
                    <line
                      x1={cornerX}
                      y1={cornerY - t * nh}
                      x2={startX + w}
                      y2={cornerY - t * nh}
                      stroke="#10b981"
                      strokeWidth="3.5"
                    />
                    {t > 0 && (
                      <line
                        x1={cornerX + nw / 2}
                        y1={cornerY}
                        x2={cornerX + nw / 2}
                        y2={cornerY - t * nh}
                        stroke="#10b981"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                      />
                    )}
                  </>
                );
              })()}
            </g>
          )}

          {/* ==================== 4. 凸字形 ==================== */}
          {shape === 'convex' && (
            <g>
              {(() => {
                const tLeft = startX + w * 0.3;
                const tRight = startX + w * 0.7;
                const topH = h * 0.35;
                const shoulderY = startY + topH;

                return (
                  <>
                    <polygon
                      points={`
                        ${tLeft},${startY} 
                        ${tRight},${startY} 
                        ${tRight},${shoulderY} 
                        ${startX + w},${shoulderY} 
                        ${startX + w},${startY + h} 
                        ${startX},${startY + h} 
                        ${startX},${shoulderY} 
                        ${tLeft},${shoulderY}
                      `}
                      fill="url(#shapeFill)"
                    />

                    {/* 外圈各边 */}
                    <line x1={startX} y1={shoulderY} x2={startX} y2={startY + h} stroke="#2563eb" strokeWidth="3" />
                    <line x1={startX} y1={startY + h} x2={startX + w} y2={startY + h} stroke="#2563eb" strokeWidth="3" />
                    <line x1={startX + w} y1={shoulderY} x2={startX + w} y2={startY + h} stroke="#2563eb" strokeWidth="3" />
                    <line x1={tLeft} y1={startY} x2={tRight} y2={startY} stroke="#2563eb" strokeWidth="3" />

                    {/* 凸起竖直双边 (向两侧推平到左右边界) */}
                    <line
                      x1={tLeft - t * (w * 0.3)}
                      y1={startY}
                      x2={tLeft - t * (w * 0.3)}
                      y2={shoulderY}
                      stroke="#ef4444"
                      strokeWidth="3.5"
                    />
                    <line
                      x1={tRight + t * (w * 0.3)}
                      y1={startY}
                      x2={tRight + t * (w * 0.3)}
                      y2={shoulderY}
                      stroke="#ef4444"
                      strokeWidth="3.5"
                    />

                    {/* 肩膀水平线向上推平 */}
                    <line
                      x1={startX}
                      y1={shoulderY - t * topH}
                      x2={tLeft}
                      y2={shoulderY - t * topH}
                      stroke="#10b981"
                      strokeWidth="3.5"
                    />
                    <line
                      x1={tRight}
                      y1={shoulderY - t * topH}
                      x2={startX + w}
                      y2={shoulderY - t * topH}
                      stroke="#10b981"
                      strokeWidth="3.5"
                    />
                  </>
                );
              })()}
            </g>
          )}
        </svg>

        {/* 动态计算结果与结论横幅 */}
        <div
          style={{
            width: '100%',
            maxWidth: '680px',
            marginTop: '8px',
            padding: '12px 18px',
            borderRadius: '12px',
            background: '#ffffff',
            border: '1px solid #bfdbfe',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>
            {shape === 'concave' ? (
              <span>
                凹字形周长 = 大长方形周长 + 2 条内壁凹深 = ({cfg.baseWidth} + {cfg.baseHeight}) × 2 + {concaveDepth} × 2 ={' '}
                <strong style={{ color: '#dc2626', fontSize: '1.2rem' }}>{totalPerimeter} cm</strong>
              </span>
            ) : (
              <span>
                {cfg.name}周长 ≡ 大长方形周长 = ({cfg.baseWidth} + {cfg.baseHeight}) × 2 ={' '}
                <strong style={{ color: '#2563eb', fontSize: '1.2rem' }}>{normalRectPerimeter} cm</strong>
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
            {cfg.desc}
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
        {/* 第一行：不规则图形种类切换 */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingBottom: '14px',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#334155' }}>
              📐 经典考题模型：
            </span>
            {(Object.keys(SHAPES) as ShapeType[]).map((st) => (
              <button
                key={st}
                onClick={() => setShape(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: shape === st ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: shape === st ? '#eff6ff' : '#ffffff',
                  color: shape === st ? '#1d4ed8' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {SHAPES[st].name}
              </button>
            ))}
          </div>
        </div>

        {/* 第二行：平移展开推平滑块与参数 */}
        <div
          style={{
            marginTop: '14px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* 平移进度滑块 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 260px', maxWidth: '420px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>
              🚀 平移推平动效:
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#2563eb', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#2563eb', minWidth: '42px' }}>
              {progress}%
            </span>
          </div>

          {/* 凹字形深度滑块 */}
          {shape === 'concave' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#dc2626' }}>
                凹槽深度 (h):
              </span>
              <input
                type="range"
                min="2"
                max="6"
                value={concaveDepth}
                onChange={(e) => setConcaveDepth(Number(e.target.value))}
                style={{ accentColor: '#dc2626', cursor: 'pointer', width: '80px' }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#dc2626', minWidth: '24px' }}>
                {concaveDepth}cm
              </span>
            </div>
          )}

          {/* 快捷按钮组 */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setProgress(progress === 100 ? 0 : 100)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #2563eb',
                background: '#2563eb',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              {progress === 100 ? '⏪ 还原原图' : '⏩ 一键推平到位'}
            </button>
          </div>
        </div>
      </div>

      {/* 算理与避坑指南对照卡片 */}
      <div
        style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.98rem', marginBottom: '6px' }}>
            🎯 核心秘诀：向外平移推平
          </div>
          <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6 }}>
            所有朝上的横线向上推、朝右的竖线向右推。楼梯形、缺角形、凸字形的所有折线刚好完整拼接成大长方形的 4 条外框，因此<strong>周长与大长方形完全相等</strong>！
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '14px',
            border: '2px solid #fecaca',
            boxShadow: '0 2px 6px rgba(239, 68, 68, 0.05)',
          }}
        >
          <div style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.98rem', marginBottom: '6px' }}>
            ⚠️ 考场头号杀手：凹字形要多算 2 边！
          </div>
          <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6 }}>
            凹字形的底部横线推平上去补齐了顶边，但<strong>凹陷进去的两侧垂直内壁</strong>无法向外推平，白白多出了两段位移！公式必须加算：<br />
            <strong>总周长 = 大长方形周长 + 凹深 × 2</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
