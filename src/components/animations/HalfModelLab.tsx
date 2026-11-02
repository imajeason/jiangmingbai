'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Layers, RefreshCw, Sparkles, MoveHorizontal, Compass, HelpCircle } from 'lucide-react';

export default function HalfModelLab() {
  const [activeTab, setActiveTab] = useState<'slide' | 'cross' | 'puzzle'>('slide');
  
  // 模式1：对边滑动参数
  const [slideX, setSlideX] = useState<number>(180); // 0 to 360
  const [shapeType, setShapeType] = useState<'rect' | 'parallelogram'>('rect');

  // 模式2：内部任意点参数
  const [crossX, setCrossX] = useState<number>(160); // 20 to 340
  const [crossY, setCrossY] = useState<number>(90);  // 15 to 165
  const [showProofLines, setShowProofLines] = useState<boolean>(true);

  // 模式3：实战解密关卡
  const [puzzleStep, setPuzzleStep] = useState<number>(0);

  // 几何常量
  const rectW = 360;
  const rectH = 180;
  const totalArea = 72; // 设定长方形总面积为 72 平方厘米 (360x180 比例缩放)

  // 模式1 面积计算
  const mainTriArea = totalArea / 2; // 36
  const leftTriArea = ((slideX / rectW) * (totalArea / 2));
  const rightTriArea = (((rectW - slideX) / rectW) * (totalArea / 2));

  // 模式2 面积计算
  const topTriArea = ((crossY / rectH) * (totalArea / 2));
  const bottomTriArea = (((rectH - crossY) / rectH) * (totalArea / 2));
  const sumVertical = topTriArea + bottomTriArea; // 36

  const leftTriAreaP = ((crossX / rectW) * (totalArea / 2));
  const rightTriAreaP = (((rectW - crossX) / rectW) * (totalArea / 2));
  const sumHorizontal = leftTriAreaP + rightTriAreaP; // 36

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Layers size={18} style={{ color: '#2563eb' }} />
          <span>几何核心模型：一半模型与等积变形探索</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${activeTab === 'slide' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('slide')}
          >
            <MoveHorizontal size={14} />
            <span>对边滑动型 (顶点平移)</span>
          </button>
          <button
            className={`${styles.controlBtn} ${activeTab === 'cross' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('cross')}
          >
            <Compass size={14} />
            <span>内部任意点 (上下左右各占一半)</span>
          </button>
          <button
            className={`${styles.controlBtn} ${activeTab === 'puzzle' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('puzzle')}
          >
            <Sparkles size={14} />
            <span>小升初真题破解</span>
          </button>
        </div>
      </div>

      {/* 动画交互工作台 */}
      <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* TAB 1: 顶点在对边滑动 */}
        {activeTab === 'slide' && (
          <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <svg viewBox="0 0 460 250" style={{ width: '100%', maxWidth: '520px', height: 'auto', overflow: 'visible' }}>
                <defs>
                  {/* 阴影与网格 */}
                  <pattern id="gridHalf" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                  </pattern>
                  <linearGradient id="mainTriGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.95" />
                  </linearGradient>
                  <linearGradient id="sideTriGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#fde047" stopOpacity="0.75" />
                  </linearGradient>
                </defs>

                {/* 背景网格 */}
                <rect x="10" y="10" width="440" height="230" fill="url(#gridHalf)" rx="8" />

                {/* 坐标偏移 */}
                {(() => {
                  const ox = 50;
                  const oy = 40;
                  const skew = shapeType === 'parallelogram' ? 40 : 0;
                  
                  // 顶点坐标
                  const A = { x: ox, y: oy + rectH };
                  const B = { x: ox + rectW, y: oy + rectH };
                  const C = { x: ox + rectW + skew, y: oy };
                  const D = { x: ox + skew, y: oy };
                  const P = { x: ox + skew + slideX, y: oy };

                  return (
                    <g>
                      {/* 外框四边形背景 */}
                      <polygon
                        points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`}
                        fill="#f8fafc"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                      />

                      {/* 左侧空白三角形 */}
                      <polygon
                        points={`${A.x},${A.y} ${D.x},${D.y} ${P.x},${P.y}`}
                        fill="url(#sideTriGrad)"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeDasharray="4,3"
                      />

                      {/* 右侧空白三角形 */}
                      <polygon
                        points={`${B.x},${B.y} ${C.x},${C.y} ${P.x},${P.y}`}
                        fill="url(#sideTriGrad)"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeDasharray="4,3"
                      />

                      {/* 核心一半模型三角形 PAB */}
                      <polygon
                        points={`${A.x},${A.y} ${B.x},${B.y} ${P.x},${P.y}`}
                        fill="url(#mainTriGrad)"
                        stroke="#1e40af"
                        strokeWidth="2.5"
                      />

                      {/* 顶部滑动导轨平行虚线 */}
                      <line
                        x1={D.x - 30}
                        y1={oy}
                        x2={C.x + 30}
                        y2={oy}
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                      />

                      {/* 顶点 P 动效与把手 */}
                      <circle cx={P.x} cy={P.y} r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
                      <circle cx={P.x} cy={P.y} r="13" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6">
                        <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <text x={P.x} y={P.y - 14} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#ef4444">
                        顶点 P (可自由滑动)
                      </text>

                      {/* 高 h 的垂直指示线 */}
                      <line x1={P.x} y1={P.y} x2={P.x} y2={A.y} stroke="#f87171" strokeWidth="1.5" strokeDasharray="3,3" />
                      <rect x={P.x < ox + rectW ? P.x : P.x - 10} y={A.y - 10} width="10" height="10" fill="none" stroke="#f87171" strokeWidth="1" />
                      <text x={P.x + 6} y={oy + rectH / 2} fontSize="12" fill="#ef4444" fontWeight="600">
                        高 h (恒定)
                      </text>

                      {/* 顶点标注 */}
                      <text x={A.x - 14} y={A.y + 6} fontSize="14" fontWeight="bold" fill="#475569">A</text>
                      <text x={B.x + 8} y={B.y + 6} fontSize="14" fontWeight="bold" fill="#475569">B</text>
                      <text x={C.x + 8} y={C.y - 4} fontSize="14" fontWeight="bold" fill="#475569">C</text>
                      <text x={D.x - 16} y={D.y - 4} fontSize="14" fontWeight="bold" fill="#475569">D</text>

                      {/* 底边 a 标注 */}
                      <path d={`M ${A.x} ${A.y + 16} L ${B.x} ${B.y + 16}`} stroke="#2563eb" strokeWidth="2" markerEnd="url(#arrow)" />
                      <text x={(A.x + B.x) / 2} y={A.y + 32} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#2563eb">
                        公共底边 a (恒定固定)
                      </text>

                      {/* 内部面积文字 */}
                      <text x={(A.x + B.x + P.x) / 3} y={(A.y * 2 + P.y) / 3 + 10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ffffff">
                        S = 36 cm² (正好 50%)
                      </text>
                    </g>
                  );
                })()}
              </svg>

              {/* 实时动态数据看板 */}
              <div style={{
                marginTop: '12px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px'
              }}>
                <div style={{ background: '#eff6ff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '0.78rem', color: '#1d4ed8', fontWeight: 600 }}>核心蓝色三角形 S_△PAB</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e40af', marginTop: '2px' }}>
                    {mainTriArea.toFixed(1)} <span style={{ fontSize: '0.8rem' }}>cm² (50.0%)</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                    底边 a 不变，垂直高 h 不变，面积恒守恒！
                  </div>
                </div>

                <div style={{ background: '#fefce8', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fef08a' }}>
                  <div style={{ fontSize: '0.78rem', color: '#854d0e', fontWeight: 600 }}>两侧黄色空白面积之和 (S₁+S₂)</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a16207', marginTop: '2px' }}>
                    {(leftTriArea + rightTriArea).toFixed(1)} <span style={{ fontSize: '0.8rem' }}>cm² ({leftTriArea.toFixed(1)} + {rightTriArea.toFixed(1)})</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                    左边缩小多少，右边正好补回多少！
                  </div>
                </div>
              </div>
            </div>

            {/* 控制器 */}
            <div style={{
              marginTop: '16px',
              width: '100%',
              background: '#ffffff',
              padding: '14px 18px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  <span>拖动顶部顶点 P 在对边上平移滑动：</span>
                  <span style={{ color: '#2563eb' }}>x = {slideX} px ({slideX === 0 ? '到达左端点 D' : slideX === 360 ? '到达右端点 C' : slideX === 180 ? '正居中央' : '任意位置'})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={slideX}
                  onChange={(e) => setSlideX(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
                />
              </div>

              {/* 预设位置与外框切换 */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button className={styles.controlBtn} onClick={() => setSlideX(0)}>
                    移到最左端 D (直角三角形)
                  </button>
                  <button className={styles.controlBtn} onClick={() => setSlideX(180)}>
                    移到正中央 (等腰三角形)
                  </button>
                  <button className={styles.controlBtn} onClick={() => setSlideX(360)}>
                    移到最右端 C (直角三角形)
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className={`${styles.controlBtn} ${shapeType === 'rect' ? styles.controlBtnActive : ''}`}
                    onClick={() => setShapeType('rect')}
                  >
                    长方形外框
                  </button>
                  <button
                    className={`${styles.controlBtn} ${shapeType === 'parallelogram' ? styles.controlBtnActive : ''}`}
                    onClick={() => setShapeType('parallelogram')}
                  >
                    平行四边形外框
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 内部任意点 P 十字型 */}
        {activeTab === 'cross' && (
          <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <svg viewBox="0 0 460 250" style={{ width: '100%', maxWidth: '520px', height: 'auto', overflow: 'visible' }}>
                <defs>
                  {/* 上下蓝色渐变 */}
                  <linearGradient id="verticalTriGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.95" />
                  </linearGradient>
                  {/* 左右橙色渐变 */}
                  <linearGradient id="horizontalTriGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fb923c" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity="0.95" />
                  </linearGradient>
                </defs>

                {(() => {
                  const ox = 50;
                  const oy = 35;
                  
                  // 长方形四个顶点
                  const D = { x: ox, y: oy };
                  const C = { x: ox + rectW, y: oy };
                  const B = { x: ox + rectW, y: oy + rectH };
                  const A = { x: ox, y: oy + rectH };
                  
                  // 内部动点 P
                  const P = { x: ox + crossX, y: oy + crossY };

                  return (
                    <g>
                      {/* 上下两个蓝色三角形 */}
                      {/* 上三角形 △PDC */}
                      <polygon
                        points={`${D.x},${D.y} ${C.x},${C.y} ${P.x},${P.y}`}
                        fill="url(#verticalTriGrad)"
                        stroke="#1d4ed8"
                        strokeWidth="1.5"
                      />
                      {/* 下三角形 △PAB */}
                      <polygon
                        points={`${A.x},${A.y} ${B.x},${B.y} ${P.x},${P.y}`}
                        fill="url(#verticalTriGrad)"
                        stroke="#1d4ed8"
                        strokeWidth="1.5"
                      />

                      {/* 左右两个橙色三角形 */}
                      {/* 左三角形 △PDA */}
                      <polygon
                        points={`${D.x},${D.y} ${A.x},${A.y} ${P.x},${P.y}`}
                        fill="url(#horizontalTriGrad)"
                        stroke="#c2410c"
                        strokeWidth="1.5"
                      />
                      {/* 右三角形 △PCB */}
                      <polygon
                        points={`${C.x},${C.y} ${B.x},${B.y} ${P.x},${P.y}`}
                        fill="url(#horizontalTriGrad)"
                        stroke="#c2410c"
                        strokeWidth="1.5"
                      />

                      {/* 辅助线：过 P 的水平和垂直高 */}
                      {showProofLines && (
                        <g>
                          {/* 垂直分割线（上下两个高） */}
                          <line x1={P.x} y1={oy} x2={P.x} y2={P.y} stroke="#ffffff" strokeWidth="2" strokeDasharray="3,3" />
                          <line x1={P.x} y1={P.y} x2={P.x} y2={oy + rectH} stroke="#ffffff" strokeWidth="2" strokeDasharray="3,3" />
                          <text x={P.x + 4} y={oy + crossY / 2} fill="#ffffff" fontSize="11" fontWeight="bold">h₁</text>
                          <text x={P.x + 4} y={oy + crossY + (rectH - crossY) / 2} fill="#ffffff" fontSize="11" fontWeight="bold">h₂</text>

                          {/* 水平分割线（左右两个高） */}
                          <line x1={ox} y1={P.y} x2={P.x} y2={P.y} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2,2" />
                          <line x1={P.x} y1={P.y} x2={ox + rectW} y2={P.y} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2,2" />
                        </g>
                      )}

                      {/* 长方形外边框 */}
                      <rect x={ox} y={oy} width={rectW} height={rectH} fill="none" stroke="#0f172a" strokeWidth="2.5" />

                      {/* 动点 P */}
                      <circle cx={P.x} cy={P.y} r="7" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
                      <circle cx={P.x} cy={P.y} r="12" fill="none" stroke="#facc15" strokeWidth="1.5" opacity="0.8">
                        <animate attributeName="r" values="7;13;7" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <text x={P.x} y={P.y - 12} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0f172a">
                        P 点 ({crossX}, {crossY})
                      </text>

                      {/* 顶点标签 */}
                      <text x={A.x - 14} y={A.y + 6} fontSize="14" fontWeight="bold" fill="#334155">A</text>
                      <text x={B.x + 8} y={B.y + 6} fontSize="14" fontWeight="bold" fill="#334155">B</text>
                      <text x={C.x + 8} y={C.y - 4} fontSize="14" fontWeight="bold" fill="#334155">C</text>
                      <text x={D.x - 14} y={D.y - 4} fontSize="14" fontWeight="bold" fill="#334155">D</text>

                      {/* 三角形内文字 */}
                      <text x={ox + rectW / 2} y={oy + 24} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                        S_上 = {topTriArea.toFixed(1)} cm²
                      </text>
                      <text x={ox + rectW / 2} y={oy + rectH - 12} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                        S_下 = {bottomTriArea.toFixed(1)} cm²
                      </text>
                      <text x={ox + 25} y={oy + rectH / 2} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                        S_左
                      </text>
                      <text x={ox + rectW - 25} y={oy + rectH / 2} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                        S_右
                      </text>
                    </g>
                  );
                })()}
              </svg>

              {/* 守恒对照面板 */}
              <div style={{
                marginTop: '12px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px'
              }}>
                <div style={{ background: '#eff6ff', padding: '12px 14px', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 700 }}>上下两三角形之和 (蓝色)</span>
                    <span style={{ fontSize: '0.75rem', background: '#2563eb', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                      恒为 50%
                    </span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e3a8a', marginTop: '4px' }}>
                    {sumVertical.toFixed(1)} <span style={{ fontSize: '0.85rem' }}>cm²</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                    S_上 + S_下 = ½·W·(h₁ + h₂) = ½·W·H = 36 cm²
                  </div>
                </div>

                <div style={{ background: '#fff7ed', padding: '12px 14px', borderRadius: '8px', border: '1px solid #fdba74' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#9a3412', fontWeight: 700 }}>左右两三角形之和 (橙色)</span>
                    <span style={{ fontSize: '0.75rem', background: '#ea580c', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                      恒为 50%
                    </span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7c2d12', marginTop: '4px' }}>
                    {sumHorizontal.toFixed(1)} <span style={{ fontSize: '0.85rem' }}>cm²</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                    S_左 + S_右 = ½·H·(w₁ + w₂) = ½·H·W = 36 cm²
                  </div>
                </div>
              </div>
            </div>

            {/* 控制器 */}
            <div style={{
              marginTop: '16px',
              width: '100%',
              background: '#ffffff',
              padding: '14px 18px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  <span>左右移动 P 点 (改变左右高)：</span>
                  <span style={{ color: '#ea580c' }}>x = {crossX} px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="340"
                  step="5"
                  value={crossX}
                  onChange={(e) => setCrossX(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#ea580c', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  <span>上下移动 P 点 (改变上下高)：</span>
                  <span style={{ color: '#2563eb' }}>y = {crossY} px</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="165"
                  step="5"
                  value={crossY}
                  onChange={(e) => setCrossY(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button className={styles.controlBtn} onClick={() => { setCrossX(180); setCrossY(90); }}>
                    重置到正中心 (9, 9, 9, 9)
                  </button>
                  <button className={styles.controlBtn} onClick={() => { setCrossX(60); setCrossY(40); }}>
                    偏左上方极限位
                  </button>
                  <button className={styles.controlBtn} onClick={() => { setCrossX(300); setCrossY(140); }}>
                    偏右下方极限位
                  </button>
                </div>
                <button
                  className={styles.controlBtn}
                  onClick={() => setShowProofLines(!showProofLines)}
                >
                  {showProofLines ? '隐藏高线标注' : '显示高线证明'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 小升初实战真题破解 */}
        {activeTab === 'puzzle' && (
          <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                background: '#f1f5f9',
                padding: '10px 14px',
                borderRadius: '8px',
                width: '100%',
                marginBottom: '14px',
                fontSize: '0.875rem',
                color: '#1e293b'
              }}>
                <span style={{ fontWeight: 700, color: '#2563eb' }}>【小升初真题速递】：</span>
                长方形 ABCD 总面积为 80 cm²，E 为 CD 上任意一点，连接 AE、BE。已知阴影三角形 △ADE 面积为 15 cm²，求 △BCE 的面积是多少？
              </div>

              <svg viewBox="0 0 420 220" style={{ width: '100%', maxWidth: '480px', height: 'auto' }}>
                {(() => {
                  const ox = 30;
                  const oy = 25;
                  const pw = 360;
                  const ph = 160;
                  const ex = ox + 130; // E 点位置

                  const A = { x: ox, y: oy + ph };
                  const B = { x: ox + pw, y: oy + ph };
                  const C = { x: ox + pw, y: oy };
                  const D = { x: ox, y: oy };
                  const E = { x: ex, y: oy };

                  return (
                    <g>
                      {/* 背景长方形 */}
                      <rect x={ox} y={oy} width={pw} height={ph} fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />

                      {/* △ADE 阴影 (已知 15) */}
                      <polygon
                        points={`${A.x},${A.y} ${D.x},${D.y} ${E.x},${E.y}`}
                        fill="#fecaca"
                        stroke="#dc2626"
                        strokeWidth="2"
                      />

                      {/* △BCE 目标求面积 (黄/绿) */}
                      <polygon
                        points={`${B.x},${B.y} ${C.x},${C.y} ${E.x},${E.y}`}
                        fill={puzzleStep >= 2 ? '#bbf7d0' : '#fed7aa'}
                        stroke={puzzleStep >= 2 ? '#16a34a' : '#ea580c'}
                        strokeWidth="2"
                      />

                      {/* 中间核心一半模型 △ABE */}
                      <polygon
                        points={`${A.x},${A.y} ${B.x},${B.y} ${E.x},${E.y}`}
                        fill={puzzleStep >= 1 ? '#93c5fd' : '#f1f5f9'}
                        stroke="#2563eb"
                        strokeWidth={puzzleStep >= 1 ? '2.5' : '1.5'}
                        strokeDasharray={puzzleStep >= 1 ? 'none' : '4,3'}
                        opacity={puzzleStep >= 1 ? '0.75' : '0.5'}
                      />

                      {/* 顶点文字 */}
                      <text x={A.x - 14} y={A.y + 6} fontSize="14" fontWeight="bold" fill="#334155">A</text>
                      <text x={B.x + 8} y={B.y + 6} fontSize="14" fontWeight="bold" fill="#334155">B</text>
                      <text x={C.x + 8} y={C.y - 4} fontSize="14" fontWeight="bold" fill="#334155">C</text>
                      <text x={D.x - 14} y={D.y - 4} fontSize="14" fontWeight="bold" fill="#334155">D</text>
                      <text x={E.x} y={E.y - 8} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#dc2626">E</text>

                      {/* 面积文字 */}
                      <text x={ox + 45} y={oy + 90} fontSize="12" fontWeight="bold" fill="#991b1b">
                        15 cm²
                      </text>
                      <text x={ox + pw - 65} y={oy + 90} fontSize="12" fontWeight="bold" fill={puzzleStep >= 2 ? '#15803d' : '#c2410c'}>
                        {puzzleStep >= 2 ? '25 cm² !' : 'S = ?'}
                      </text>

                      {puzzleStep >= 1 && (
                        <text x={ox + pw / 2} y={oy + ph - 25} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e40af">
                          隐藏的一半模型：S_△ABE = 80 ÷ 2 = 40 cm²
                        </text>
                      )}
                    </g>
                  );
                })()}
              </svg>

              {/* 解题步骤卡 */}
              <div style={{
                marginTop: '16px',
                width: '100%',
                background: '#f8fafc',
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                {puzzleStep === 0 && (
                  <div>
                    <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>第 1 步：常规思维的困惑</div>
                    <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '4px', lineHeight: 1.6 }}>
                      题目没有给出底边 DE、EC 的具体长度，孩子往往想“算 DE 的长度”却算不出来。
                      点击下方【点亮隐藏的一半模型】，看如何一秒破局！
                    </div>
                  </div>
                )}

                {puzzleStep === 1 && (
                  <div>
                    <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.9rem' }}>第 2 步：锁定核心中间三角形 △ABE</div>
                    <div style={{ fontSize: '0.825rem', color: '#334155', marginTop: '4px', lineHeight: 1.6 }}>
                      以长方形底边 AB 为底，顶点 E 在对边 CD 上滑动，因此无论 E 在哪，
                      <strong> S_△ABE 永远恒定等于长方形总面积的一半</strong>！
                      <br />
                      即：S_△ABE = 80 ÷ 2 = <strong>40 cm²</strong>。
                    </div>
                  </div>
                )}

                {puzzleStep === 2 && (
                  <div>
                    <div style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.9rem' }}>第 3 步：整体减中间，秒出答案！</div>
                    <div style={{ fontSize: '0.825rem', color: '#166534', marginTop: '4px', lineHeight: 1.6 }}>
                      因为中间蓝色占了 40 cm²，所以剩下的两个角三角形之和也必定占一半（40 cm²）！
                      <br />
                      S_△ADE + S_△BCE = 40 cm²
                      <br />
                      所以：S_△BCE = 40 - 15 = <strong>25 cm²</strong>！根本不需要求任何线段长度！
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 控制器 */}
            <div style={{
              marginTop: '14px',
              width: '100%',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <button
                className={`${styles.controlBtn} ${puzzleStep === 0 ? styles.controlBtnActive : ''}`}
                onClick={() => setPuzzleStep(0)}
              >
                1. 原始题目
              </button>
              <button
                className={`${styles.controlBtn} ${puzzleStep === 1 ? styles.controlBtnActive : ''}`}
                onClick={() => setPuzzleStep(1)}
              >
                2. 点亮“一半模型”
              </button>
              <button
                className={`${styles.controlBtn} ${puzzleStep === 2 ? styles.controlBtnActive : ''}`}
                onClick={() => setPuzzleStep(2)}
              >
                3. 秒杀求出答案
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

