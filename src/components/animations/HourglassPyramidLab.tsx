'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Triangle, ArrowRight, Sparkles, Sliders, Layers } from 'lucide-react';

export default function HourglassPyramidLab() {
  const [modelType, setModelType] = useState<'hourglass' | 'pyramid'>('hourglass');
  const [ratioPresetIdx, setRatioPresetIdx] = useState<number>(0);

  const presets = [
    { label: '2 : 3 (经典小升初题例)', a: 2, b: 3 },
    { label: '1 : 2 (底边翻倍)', a: 1, b: 2 },
    { label: '1 : 3 (底边三倍)', a: 1, b: 3 },
    { label: '3 : 4 (高阶分数比)', a: 3, b: 4 },
  ];

  const currentPreset = presets[ratioPresetIdx];
  const { a, b } = currentPreset;

  // 面积份数计算
  const sTopShares = a * a; // a^2
  const sBottomShares = b * b; // b^2
  const sWingShares = a * b; // a * b
  const sTrapezoidTotalShares = sTopShares + sBottomShares + sWingShares * 2; // (a + b)^2
  const sPyramidBottomShares = sBottomShares - sTopShares; // b^2 - a^2

  // SVG 尺寸与坐标动态计算
  const svgWidth = 380;
  const svgHeight = 260;

  // 顶边与底边在沙漏中的参数
  const totalH = 180;
  const hTop = (a / (a + b)) * totalH;
  const hBottom = (b / (a + b)) * totalH;

  const topWidth = (a / b) * 180; // 顶边长度
  const bottomWidth = 240; // 底边固定长度

  const cx = svgWidth / 2;
  const topY = 40;
  const bottomY = topY + totalH;
  const crossY = topY + hTop;

  // 沙漏四个顶点
  const ptA = { x: cx - topWidth / 2, y: topY };
  const ptB = { x: cx + topWidth / 2, y: topY };
  const ptC = { x: cx + bottomWidth / 2, y: bottomY };
  const ptD = { x: cx - bottomWidth / 2, y: bottomY };
  const ptO = { x: cx, y: crossY };

  // 金字塔顶点
  const pyrApex = { x: cx, y: 35 };
  const pyrBaseL = { x: cx - 130, y: 225 };
  const pyrBaseR = { x: cx + 130, y: 225 };
  const pyrMidY = pyrApex.y + (a / b) * (pyrBaseL.y - pyrApex.y);
  const pyrMidL = { x: cx - (a / b) * 130, y: pyrMidY };
  const pyrMidR = { x: cx + (a / b) * 130, y: pyrMidY };

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Triangle size={18} style={{ color: '#7c3aed' }} />
          <span>几何五大模型：沙漏模型与金字塔模型</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${modelType === 'hourglass' ? styles.controlBtnActive : ''}`}
            onClick={() => setModelType('hourglass')}
          >
            ⏳ 沙漏模型 (对顶相似)
          </button>
          <button
            className={`${styles.controlBtn} ${modelType === 'pyramid' ? styles.controlBtnActive : ''}`}
            onClick={() => setModelType('pyramid')}
          >
            🔺 金字塔模型 (嵌套相似)
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
          {/* 模型精髓导读 */}
          <div style={{
            width: '100%',
            background: modelType === 'hourglass' ? '#faf5ff' : '#eff6ff',
            padding: '10px 14px',
            borderRadius: '8px',
            borderLeft: `4px solid ${modelType === 'hourglass' ? '#7c3aed' : '#2563eb'}`,
            fontSize: '0.85rem',
            color: modelType === 'hourglass' ? '#581c87' : '#1e40af',
            lineHeight: 1.6
          }}>
            {modelType === 'hourglass' ? (
              <>
                <strong>【沙漏模型核心特征 (Hourglass Model)】：</strong>
                <br />
                上下两底平行（$AB \parallel CD$），对角线交于 $O$ 点。
                <br />
                底边比为 <strong>{a} : {b}</strong> ➔ 相似比为 <strong>{a} : {b}</strong> ➔ 面积份数比为 <strong>{sTopShares} ({a}²) : {sBottomShares} ({b}²)</strong>，两翼各为 <strong>{sWingShares} ({a}×{b})</strong> 份！
              </>
            ) : (
              <>
                <strong>【金字塔模型核心特征 (Pyramid Model)】：</strong>
                <br />
                截线与底边平行（$DE \parallel BC$），同角嵌套。
                <br />
                小三角形与大三角形相似比为 <strong>{a} : {b}</strong> ➔ 面积比为 <strong>{sTopShares} ({a}²) : {sBottomShares} ({b}²)</strong>，下方梯形截面占 <strong>{sPyramidBottomShares} ({b}² - {a}²)</strong> 份！
              </>
            )}
          </div>

          {/* 交互动态 SVG 画布 */}
          <div style={{ marginTop: '16px', width: '100%', maxWidth: '380px' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              {modelType === 'hourglass' ? (
                /* 沙漏模型渲染 */
                <g>
                  {/* 平行线辅助虚线 */}
                  <line x1="20" y1={topY} x2={svgWidth - 20} y2={topY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
                  <line x1="20" y1={bottomY} x2={svgWidth - 20} y2={bottomY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />

                  {/* 上三角形 (a^2 份) */}
                  <polygon
                    points={`${ptA.x},${ptA.y} ${ptB.x},${ptB.y} ${ptO.x},${ptO.y}`}
                    fill="#3b82f6"
                    fillOpacity="0.3"
                    stroke="#2563eb"
                    strokeWidth="2"
                  />
                  {/* 下三角形 (b^2 份) */}
                  <polygon
                    points={`${ptD.x},${ptD.y} ${ptC.x},${ptC.y} ${ptO.x},${ptO.y}`}
                    fill="#10b981"
                    fillOpacity="0.3"
                    stroke="#059669"
                    strokeWidth="2"
                  />
                  {/* 左翼 (ab 份) */}
                  <polygon
                    points={`${ptA.x},${ptA.y} ${ptD.x},${ptD.y} ${ptO.x},${ptO.y}`}
                    fill="#f59e0b"
                    fillOpacity="0.15"
                    stroke="#d97706"
                    strokeWidth="1.5"
                  />
                  {/* 右翼 (ab 份) */}
                  <polygon
                    points={`${ptB.x},${ptB.y} ${ptC.x},${ptC.y} ${ptO.x},${ptO.y}`}
                    fill="#f59e0b"
                    fillOpacity="0.15"
                    stroke="#d97706"
                    strokeWidth="1.5"
                  />

                  {/* 顶点圆点 */}
                  {[ptA, ptB, ptC, ptD, ptO].map((p, idx) => (
                    <circle key={idx} cx={p.x} cy={p.y} r="3.5" fill="#1e293b" />
                  ))}

                  {/* 顶点标签 */}
                  <text x={ptA.x - 12} y={ptA.y + 4} fontSize="12" fontWeight="800" fill="#1e293b">A</text>
                  <text x={ptB.x + 8} y={ptB.y + 4} fontSize="12" fontWeight="800" fill="#1e293b">B</text>
                  <text x={ptC.x + 8} y={ptC.y + 5} fontSize="12" fontWeight="800" fill="#1e293b">C</text>
                  <text x={ptD.x - 15} y={ptD.y + 5} fontSize="12" fontWeight="800" fill="#1e293b">D</text>
                  <text x={ptO.x + 8} y={ptO.y - 4} fontSize="12" fontWeight="800" fill="#7c3aed">O</text>

                  {/* 面积份数文字 */}
                  <text x={cx} y={topY + hTop * 0.55} textAnchor="middle" fontSize="11" fontWeight="800" fill="#1d4ed8">
                    S₁ = {sTopShares}份 ({a}²)
                  </text>
                  <text x={cx} y={crossY + hBottom * 0.55} textAnchor="middle" fontSize="12" fontWeight="800" fill="#047857">
                    S₂ = {sBottomShares}份 ({b}²)
                  </text>
                  <text x={(ptA.x + ptD.x) / 2 + 15} y={crossY + 2} textAnchor="middle" fontSize="10" fontWeight="700" fill="#b45309">
                    {sWingShares}份
                  </text>
                  <text x={(ptB.x + ptC.x) / 2 - 15} y={crossY + 2} textAnchor="middle" fontSize="10" fontWeight="700" fill="#b45309">
                    {sWingShares}份
                  </text>

                  {/* 边长标注 */}
                  <text x={cx} y={topY - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="#2563eb">
                    上底 a = {a}
                  </text>
                  <text x={cx} y={bottomY + 16} textAnchor="middle" fontSize="11" fontWeight="700" fill="#059669">
                    下底 b = {b}
                  </text>
                </g>
              ) : (
                /* 金字塔模型渲染 */
                <g>
                  {/* 大三角形底色 */}
                  <polygon
                    points={`${pyrApex.x},${pyrApex.y} ${pyrBaseL.x},${pyrBaseL.y} ${pyrBaseR.x},${pyrBaseR.y}`}
                    fill="#10b981"
                    fillOpacity="0.2"
                    stroke="#059669"
                    strokeWidth="2.5"
                  />
                  {/* 顶部小三角形截面 */}
                  <polygon
                    points={`${pyrApex.x},${pyrApex.y} ${pyrMidL.x},${pyrMidL.y} ${pyrMidR.x},${pyrMidR.y}`}
                    fill="#3b82f6"
                    fillOpacity="0.4"
                    stroke="#2563eb"
                    strokeWidth="2"
                  />

                  {/* 平行截线 DE */}
                  <line x1={pyrMidL.x} y1={pyrMidL.y} x2={pyrMidR.x} y2={pyrMidR.y} stroke="#2563eb" strokeWidth="2.5" />

                  {/* 顶点标签 */}
                  <text x={pyrApex.x} y={pyrApex.y - 8} textAnchor="middle" fontSize="12" fontWeight="800" fill="#1e293b">A</text>
                  <text x={pyrMidL.x - 14} y={pyrMidL.y + 4} fontSize="12" fontWeight="800" fill="#2563eb">D</text>
                  <text x={pyrMidR.x + 6} y={pyrMidR.y + 4} fontSize="12" fontWeight="800" fill="#2563eb">E</text>
                  <text x={pyrBaseL.x - 14} y={pyrBaseL.y + 6} fontSize="12" fontWeight="800" fill="#059669">B</text>
                  <text x={pyrBaseR.x + 6} y={pyrBaseR.y + 6} fontSize="12" fontWeight="800" fill="#059669">C</text>

                  {/* 面积文字 */}
                  <text x={cx} y={pyrApex.y + (pyrMidY - pyrApex.y) * 0.65} textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e40af">
                    S_ADE = {sTopShares}份 ({a}²)
                  </text>
                  <text x={cx} y={pyrMidY + (pyrBaseL.y - pyrMidY) * 0.55} textAnchor="middle" fontSize="12" fontWeight="800" fill="#047857">
                    下层梯形 = {sPyramidBottomShares}份 ({b}² - {a}²)
                  </text>

                  {/* 边长比例 */}
                  <text x={(pyrApex.x + pyrMidL.x) / 2 - 14} y={(pyrApex.y + pyrMidY) / 2} fontSize="10" fontWeight="700" fill="#2563eb">
                    {a}
                  </text>
                  <text x={(pyrMidL.x + pyrBaseL.x) / 2 - 18} y={(pyrMidY + pyrBaseL.y) / 2} fontSize="10" fontWeight="700" fill="#059669">
                    {b - a}
                  </text>
                  <text x={cx} y={pyrBaseL.y + 16} textAnchor="middle" fontSize="11" fontWeight="700" fill="#059669">
                    底边 BC = {b} 份
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* 比例与面积份数看板 */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}>
            <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '8px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>相似比 a : b</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d4ed8', marginTop: '2px' }}>
                {a} : {b}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>底边比 = 对应高之比</div>
            </div>

            <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '8px', border: '1px solid #a7f3d0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46' }}>面积比 a² : b²</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#047857', marginTop: '2px' }}>
                {sTopShares} : {sBottomShares}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>面积比等于相似比平方</div>
            </div>

            <div style={{ background: '#faf5ff', padding: '10px', borderRadius: '8px', border: '1px solid #e9d5ff', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b21a8' }}>
                {modelType === 'hourglass' ? '总梯形份数' : '大三角形总份数'}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#7c3aed', marginTop: '2px' }}>
                {modelType === 'hourglass' ? `${sTrapezoidTotalShares} 份` : `${sBottomShares} 份`}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {modelType === 'hourglass' ? `(${a}+${b})² = ${sTrapezoidTotalShares}` : `整体基准份数`}
              </div>
            </div>
          </div>
        </div>

        {/* 预设比例调节 */}
        <div style={{
          marginTop: '16px',
          width: '100%',
          maxWidth: '640px',
          background: '#ffffff',
          padding: '12px 16px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155' }}>
            选择经典边长比例（观察面积平方关系）：
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {presets.map((p, idx) => (
              <button
                key={idx}
                className={`${styles.controlBtn} ${ratioPresetIdx === idx ? styles.controlBtnActive : ''}`}
                onClick={() => setRatioPresetIdx(idx)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

