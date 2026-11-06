'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Droplet, Sparkles, CheckCircle2, ArrowRight, Layers } from 'lucide-react';

export default function SubmergedVolumeLab() {
  const [mode, setMode] = useState<'full' | 'partial'>('full');

  // 容器底面积固定为 100 cm²，初始水深 10 cm，水体积 1000 cm³
  const sContainer = 100;
  const initialH = 10;
  const initialWaterVol = sContainer * initialH; // 1000 cm³

  // 模式1参数：完全沉入铁块体积 (50 ~ 400 cm³)
  const [ironVolume, setIronVolume] = useState<number>(200);

  // 模式2参数：直立长圆钢底面积 (10 ~ 40 cm²) 与高度 (25 cm)
  const [steelBaseArea, setSteelBaseArea] = useState<number>(20);
  const steelHeight = 25; // 足够高，始终露在水面上

  // 模式1计算：上升高度 Δh
  const deltaHFull = ironVolume / sContainer;
  const finalHFull = initialH + deltaHFull;

  // 模式2计算：有效底面积与最终水深
  const effectiveBaseArea = sContainer - steelBaseArea;
  const finalHPartial = initialWaterVol / effectiveBaseArea;
  const deltaHPartial = finalHPartial - initialH;

  // SVG 视觉坐标缩放参数
  const maxVisualH = 30; // 容器高度标定 30 cm
  const svgBeakerH = 180; // 像素高度
  const scaleY = svgBeakerH / maxVisualH; // 每 cm 对应的像素数 (6px/cm)

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Droplet size={18} style={{ color: '#0284c7' }} />
          <span>圆柱容器浸水与排水法：水面升降与不规则体积</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${mode === 'full' ? styles.controlBtnActive : ''}`}
            onClick={() => setMode('full')}
          >
            💧 完全浸没模型 (铁块沉底)
          </button>
          <button
            className={`${styles.controlBtn} ${mode === 'partial' ? styles.controlBtnActive : ''}`}
            onClick={() => setMode('partial')}
          >
            📏 未完全浸没模型 (直立圆钢)
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '640px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* 原理提示卡 */}
          <div style={{
            width: '100%',
            background: mode === 'full' ? '#f0f9ff' : '#ecfdf5',
            padding: '12px 14px',
            borderRadius: '8px',
            borderLeft: `4px solid ${mode === 'full' ? '#0284c7' : '#10b981'}`,
            fontSize: '0.85rem',
            color: mode === 'full' ? '#075985' : '#065f46',
            lineHeight: 1.6
          }}>
            {mode === 'full' ? (
              <>
                <strong>【完全浸没：阿基米德排水法】：</strong>
                <br />
                物体全部进入水中，<strong>排开水的体积 = 物体本身总体积</strong>！
                <br />
                <strong>水面上升 Δh = V物 ÷ S容底 = {ironVolume} ÷ 100 = {deltaHFull.toFixed(1)} cm！</strong>
              </>
            ) : (
              <>
                <strong>【未完全浸没：直立圆钢有效底面积法】：</strong>
                <br />
                圆钢露在水面外，切勿套用圆钢全长！<strong>水体积 1000 cm³ 不变，但住的地方变挤了！</strong>
                <br />
                <strong>有效底面积 S有效 = 100 - {steelBaseArea} = {effectiveBaseArea} cm² ➔ 新水深 = 1000 ÷ {effectiveBaseArea} = {finalHPartial.toFixed(1)} cm！</strong>
              </>
            )}
          </div>

          {/* 容器浸水动画 SVG */}
          <div style={{ marginTop: '16px', width: '100%', maxWidth: '380px' }}>
            <svg viewBox="0 0 340 240" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              {/* 烧杯外壁 */}
              <rect x="80" y="30" width="180" height={svgBeakerH} fill="none" stroke="#475569" strokeWidth="3" rx="4" />
              <line x1="75" y1="30" x2="85" y2="30" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              <line x1="255" y1="30" x2="265" y2="30" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

              {/* 刻度虚线 (初始水深 10cm) */}
              <line
                x1="80"
                y1={210 - initialH * scaleY}
                x2="260"
                y2={210 - initialH * scaleY}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text x="65" y={210 - initialH * scaleY + 4} fontSize="9" fontWeight="700" fill="#64748b" textAnchor="end">
                10cm
              </text>

              {mode === 'full' ? (
                /* 完全浸没状态 */
                <g>
                  {/* 水体填充 */}
                  <rect
                    x="81.5"
                    y={210 - finalHFull * scaleY}
                    width="177"
                    height={finalHFull * scaleY}
                    fill="#38bdf8"
                    fillOpacity="0.35"
                  />
                  {/* 上升的水柱层高亮 */}
                  <rect
                    x="81.5"
                    y={210 - finalHFull * scaleY}
                    width="177"
                    height={deltaHFull * scaleY}
                    fill="#0ea5e9"
                    fillOpacity="0.4"
                  />

                  {/* 沉底铁块 */}
                  <rect
                    x="145"
                    y={210 - 32}
                    width="50"
                    height="30"
                    rx="4"
                    fill="#475569"
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />
                  <text x="170" y="200" textAnchor="middle" fontSize="9" fontWeight="800" fill="#ffffff">
                    铁块 {ironVolume}cm³
                  </text>

                  {/* 升高高度标记 */}
                  <line x1="268" y1={210 - initialH * scaleY} x2="268" y2={210 - finalHFull * scaleY} stroke="#0284c7" strokeWidth="2" />
                  <text x="274" y={210 - (initialH + deltaHFull / 2) * scaleY + 3} fontSize="10" fontWeight="800" fill="#0284c7">
                    +Δh={deltaHFull.toFixed(1)}cm
                  </text>
                </g>
              ) : (
                /* 直立圆钢部分浸没状态 */
                <g>
                  {/* 水体填充 */}
                  <rect
                    x="81.5"
                    y={210 - finalHPartial * scaleY}
                    width="177"
                    height={finalHPartial * scaleY}
                    fill="#10b981"
                    fillOpacity="0.3"
                  />

                  {/* 直立插入的长圆钢 (底面积 steelBaseArea 映射宽度) */}
                  <rect
                    x={170 - (steelBaseArea * 1.5) / 2}
                    y={210 - steelHeight * scaleY}
                    width={steelBaseArea * 1.5}
                    height={steelHeight * scaleY}
                    fill="#64748b"
                    stroke="#1e293b"
                    strokeWidth="1.5"
                    rx="3"
                  />
                  <text x="170" y={210 - steelHeight * scaleY - 6} textAnchor="middle" fontSize="9" fontWeight="800" fill="#334155">
                    直立长圆钢 (底面 {steelBaseArea}cm²)
                  </text>

                  {/* 新水深标记 */}
                  <line x1="268" y1={210} x2="268" y2={210 - finalHPartial * scaleY} stroke="#059669" strokeWidth="2" />
                  <text x="274" y={210 - (finalHPartial / 2) * scaleY + 3} fontSize="10" fontWeight="800" fill="#059669">
                    新水深 {finalHPartial.toFixed(1)}cm
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* 实时仪表盘 */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}>
            <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>容器底面积</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e293b', marginTop: '2px' }}>
                {sContainer} <span style={{ fontSize: '0.75rem' }}>cm²</span>
              </div>
            </div>

            <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>
                {mode === 'full' ? '铁块自身体积' : '有效容水底面积'}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1d4ed8', marginTop: '2px' }}>
                {mode === 'full' ? `${ironVolume} cm³` : `${effectiveBaseArea} cm²`}
              </div>
            </div>

            <div style={{ background: '#ecfdf5', padding: '8px', borderRadius: '8px', border: '1.5px solid #86efac', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46' }}>
                {mode === 'full' ? '上升高度 Δh' : '浸入后总水深'}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#15803d', marginTop: '2px' }}>
                {mode === 'full' ? `${deltaHFull.toFixed(1)} cm` : `${finalHPartial.toFixed(1)} cm`}
              </div>
            </div>
          </div>

          {/* 交互滑块控制区 */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            background: '#ffffff',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {mode === 'full' ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  <span>调整完全沉入铁块体积：</span>
                  <span style={{ color: '#0284c7' }}>{ironVolume} cm³</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="400"
                  step="25"
                  value={ironVolume}
                  onChange={(e) => setIronVolume(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
                />
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  <span>调整直立长圆钢底面积：</span>
                  <span style={{ color: '#059669' }}>{steelBaseArea} cm² (占容器 {(steelBaseArea / sContainer * 100).toFixed(0)}%)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={steelBaseArea}
                  onChange={(e) => setSteelBaseArea(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

