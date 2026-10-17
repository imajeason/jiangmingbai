'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import styles from '@/styles/animations.module.css';

export default function CircleAreaLab() {
  const [slices, setSlices] = useState<number>(16); // 份数：8, 16, 32, 64
  const [progress, setProgress] = useState<number>(100); // 0 (圆) 到 100 (拼成长方形)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      animId = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
    }
    return () => clearInterval(animId);
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const radius = 90;
  const t = progress / 100; // 0 ~ 1

  return (
    <div className={styles.labContainer}>
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Sparkles size={18} color="#2563eb" />
          <span>圆面积推导实验室：无限分割与转化</span>
        </div>
        <div className={styles.labControls}>
          <button
            className={`${styles.controlBtn} ${isPlaying ? styles.controlBtnActive : ''}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? '暂停' : '动态展开演示'}</span>
          </button>
          <button className={styles.controlBtn} onClick={handleReset}>
            <RotateCcw size={14} />
            <span>复位原圆</span>
          </button>
        </div>
      </div>

      <div className={styles.canvasWrapper} style={{ minHeight: '400px' }}>
        <svg viewBox="0 0 700 360" width="100%" height="360" style={{ maxWidth: '700px' }}>
          <defs>
            <linearGradient id="sliceGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="sliceGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>

          {/* 背景辅助网格 */}
          <line x1="50" y1="310" x2="650" y2="310" stroke="#e2e8f0" strokeDasharray="4 4" />

          {/* 绘制切片变换 */}
          <g transform="translate(350, 180)">
            {Array.from({ length: slices }).map((_, idx) => {
              const anglePerSlice = (2 * Math.PI) / slices;
              const isUpper = idx % 2 === 0;

              // 原始在圆上的中心角度
              const circleAngle = idx * anglePerSlice;
              const origX = 0;
              const origY = 0;
              const origRot = (circleAngle * 180) / Math.PI;

              // 展开为长方形后的目标位置
              // 总长度约为 半圆周 = Math.PI * radius
              const totalWidth = Math.PI * radius;
              const sliceWidth = totalWidth / slices;
              const targetX = -totalWidth / 2 + idx * sliceWidth + sliceWidth / 2;
              const targetY = isUpper ? -radius / 2 : radius / 2;
              const targetRot = isUpper ? 180 : 0;

              // 插值插算
              const curX = origX * (1 - t) + targetX * t;
              const curY = origY * (1 - t) + targetY * t;
              const curRot = origRot * (1 - t) + targetRot * t;

              // 生成单个扇形切片路径
              const halfAngle = anglePerSlice / 2;
              const p1X = radius * Math.sin(-halfAngle);
              const p1Y = -radius * Math.cos(-halfAngle);
              const p2X = radius * Math.sin(halfAngle);
              const p2Y = -radius * Math.cos(halfAngle);

              const pathD = `M 0 0 L ${p1X} ${p1Y} A ${radius} ${radius} 0 0 1 ${p2X} ${p2Y} Z`;

              return (
                <path
                  key={idx}
                  d={pathD}
                  fill={isUpper ? 'url(#sliceGrad1)' : 'url(#sliceGrad2)'}
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  transform={`translate(${curX}, ${curY}) rotate(${curRot})`}
                  style={{ transition: isPlaying ? 'none' : 'transform 0.2s ease-out' }}
                />
              );
            })}
          </g>

          {/* 当展开到达后期时显示标注线与说明 */}
          {progress > 70 && (
            <g style={{ opacity: (progress - 70) / 30 }}>
              {/* 长方形下底标注 (πr) */}
              <line
                x1={350 - (Math.PI * radius) / 2}
                y1={290}
                x2={350 + (Math.PI * radius) / 2}
                y2={290}
                stroke="#2563eb"
                strokeWidth="2"
              />
              <text
                x="350"
                y="315"
                textAnchor="middle"
                fill="#2563eb"
                fontSize="14"
                fontWeight="700"
              >
                底边长 ≈ 半圆周长 (πr)
              </text>

              {/* 长方形高标注 (r) */}
              <line
                x1={350 + (Math.PI * radius) / 2 + 15}
                y1={180 - radius / 2}
                x2={350 + (Math.PI * radius) / 2 + 15}
                y2={180 + radius / 2}
                stroke="#0891b2"
                strokeWidth="2"
              />
              <text
                x={350 + (Math.PI * radius) / 2 + 30}
                y="185"
                textAnchor="start"
                fill="#0891b2"
                fontSize="14"
                fontWeight="700"
              >
                高 ≈ 半径 (r)
              </text>
            </g>
          )}

          {/* 实时公式推导提示 */}
          <rect x="20" y="20" width="220" height="58" rx="8" fill="#ffffff" stroke="#e2e8f0" />
          <text x="32" y="42" fontSize="12" fill="#64748b" fontWeight="500">转化结论 (极限思想)</text>
          <text x="32" y="64" fontSize="15" fill="#0f172a" fontWeight="700">
            S = 底 × 高 = πr × r = πr²
          </text>
        </svg>
      </div>

      <div className={styles.sliderPanel}>
        <div className={styles.sliderGroup}>
          <span className={styles.sliderLabel}>等分份数 (体验无限逼近):</span>
          <select
            className={styles.controlBtn}
            value={slices}
            onChange={(e) => setSlices(Number(e.target.value))}
          >
            <option value="8">8等分 (边缘明显波浪)</option>
            <option value="16">16等分 (初具长方形)</option>
            <option value="32">32等分 (接近直线)</option>
            <option value="64">64等分 (近乎完美长方形)</option>
          </select>
        </div>

        <div className={styles.sliderGroup}>
          <span className={styles.sliderLabel}>拼接进度:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => {
              setIsPlaying(false);
              setProgress(Number(e.target.value));
            }}
            className={styles.sliderInput}
          />
          <span className={styles.sliderValue}>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
