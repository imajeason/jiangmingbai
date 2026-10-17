'use client';

import React, { useState } from 'react';
import { Layers, Sparkles, RefreshCw } from 'lucide-react';
import styles from '@/styles/animations.module.css';

export default function PythagoreanTheoremLab() {
  const [a, setA] = useState<number>(80); // 直角边 a
  const [b, setB] = useState<number>(110); // 直角边 b
  const [mode, setMode] = useState<'chord' | 'split'>('chord'); // chord: 赵爽弦图, split: a^2 + b^2 拼图

  const c = Math.sqrt(a * a + b * b);
  const diff = Math.abs(b - a);

  return (
    <div className={styles.labContainer}>
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Sparkles size={18} color="#2563eb" />
          <span>勾股定理实验室：赵爽弦图以形证数</span>
        </div>
        <div className={styles.labControls}>
          <button
            className={`${styles.controlBtn} ${mode === 'chord' ? styles.controlBtnActive : ''}`}
            onClick={() => setMode('chord')}
          >
            <Layers size={14} />
            <span>弦图模型 (c²)</span>
          </button>
          <button
            className={`${styles.controlBtn} ${mode === 'split' ? styles.controlBtnActive : ''}`}
            onClick={() => setMode('split')}
          >
            <RefreshCw size={14} />
            <span>割补转化为 (a² + b²)</span>
          </button>
        </div>
      </div>

      <div className={styles.canvasWrapper} style={{ minHeight: '420px' }}>
        <svg viewBox="0 0 700 380" width="100%" height="380" style={{ maxWidth: '700px' }}>
          <defs>
            <linearGradient id="triGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            <linearGradient id="triGrad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="triGrad3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="triGrad4" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {mode === 'chord' ? (
            /* 赵爽弦图展示 */
            <g transform="translate(350, 190)">
              {/* 大正方形外轮廓 (c x c) */}
              <rect
                x={-c / 2}
                y={-c / 2}
                width={c}
                height={c}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="6 6"
              />

              {/* 4 个直角三角形围绕中心 */}
              {/* 顺时针旋转 4 个 */}
              {[0, 90, 180, 270].map((rot, i) => {
                const colors = ['url(#triGrad1)', 'url(#triGrad2)', 'url(#triGrad3)', 'url(#triGrad4)'];
                // 三角形顶点：(0,0), (b, 0), (b, a)
                return (
                  <polygon
                    key={i}
                    points={`0,0 ${b},0 ${b},${a}`}
                    fill={colors[i]}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    transform={`rotate(${rot}) translate(${-b / 2 + diff / 2}, ${-a / 2 - diff / 2})`}
                    opacity="0.9"
                  />
                );
              })}

              {/* 中心黄色小正方形 (b - a)^2 */}
              <rect
                x={-diff / 2}
                y={-diff / 2}
                width={diff}
                height={diff}
                fill="#fef08a"
                stroke="#ca8a04"
                strokeWidth="1.5"
              />
              {diff > 20 && (
                <text x="0" y="5" textAnchor="middle" fontSize="11" fill="#854d0e" fontWeight="700">
                  (b-a)²
                </text>
              )}

              {/* 弦图说明标注 */}
              <text x="0" y={c / 2 + 30} textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="700">
                大正方形面积 S = c²
              </text>
            </g>
          ) : (
            /* 割补转化演示模式：分解为 a^2 与 b^2 */
            <g transform="translate(200, 190)">
              {/* a^2 正方形 */}
              <rect
                x={-a / 2}
                y={-a / 2}
                width={a}
                height={a}
                fill="#dbeafe"
                stroke="#2563eb"
                strokeWidth="2"
              />
              <text x="0" y="5" textAnchor="middle" fill="#1d4ed8" fontSize="16" fontWeight="800">
                a² = {(a * a / 100).toFixed(0)}
              </text>
              <text x="0" y={a / 2 + 24} textAnchor="middle" fill="#64748b" fontSize="13">
                以直角边 a 为边的正方形
              </text>

              {/* 加上 + 符号 */}
              <text x={a / 2 + 45} y="10" textAnchor="middle" fill="#0f172a" fontSize="28" fontWeight="700">
                +
              </text>

              {/* b^2 正方形 */}
              <g transform={`translate(${a / 2 + 90 + b / 2}, 0)`}>
                <rect
                  x={-b / 2}
                  y={-b / 2}
                  width={b}
                  height={b}
                  fill="#cffafe"
                  stroke="#0891b2"
                  strokeWidth="2"
                />
                <text x="0" y="5" textAnchor="middle" fill="#0e7490" fontSize="16" fontWeight="800">
                  b² = {(b * b / 100).toFixed(0)}
                </text>
                <text x="0" y={b / 2 + 24} textAnchor="middle" fill="#64748b" fontSize="13">
                  以直角边 b 为边的正方形
                </text>
              </g>

              {/* 等号与 c^2 */}
              <text x={a / 2 + 90 + b + 45} y="10" textAnchor="middle" fill="#0f172a" fontSize="28" fontWeight="700">
                =
              </text>
              <text x={a / 2 + 90 + b + 90} y="8" textAnchor="start" fill="#15803d" fontSize="18" fontWeight="800">
                c² = {(c * c / 100).toFixed(0)}
              </text>
            </g>
          )}

          {/* 右上角参数卡片 */}
          <rect x="20" y="20" width="220" height="74" rx="8" fill="#ffffff" stroke="#e2e8f0" />
          <text x="32" y="42" fontSize="12" fill="#64748b">边长实时计算</text>
          <text x="32" y="62" fontSize="14" fill="#0f172a" fontWeight="700">
            a={a} | b={b} → 斜边 c={c.toFixed(1)}
          </text>
          <text x="32" y="82" fontSize="12" fill="#2563eb" fontWeight="600">
            公式验证：a² + b² = c²
          </text>
        </svg>
      </div>

      <div className={styles.sliderPanel}>
        <div className={styles.sliderGroup}>
          <span className={styles.sliderLabel}>直角边 a:</span>
          <input
            type="range"
            min="50"
            max="100"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className={styles.sliderInput}
          />
          <span className={styles.sliderValue}>{a}</span>
        </div>

        <div className={styles.sliderGroup}>
          <span className={styles.sliderLabel}>直角边 b:</span>
          <input
            type="range"
            min="90"
            max="140"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className={styles.sliderInput}
          />
          <span className={styles.sliderValue}>{b}</span>
        </div>
      </div>
    </div>
  );
}
