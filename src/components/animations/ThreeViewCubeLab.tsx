'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Layers, Sparkles, Wand2, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function ThreeViewCubeLab() {
  // 3x3 地基网格，每个格子堆叠 0~3 个小正方体
  // 预设为经典试题：主视 [2, 1, 0]，左视 [2, 1, 0]
  const [grid, setGrid] = useState<number[][]>([
    [2, 1, 0],
    [1, 1, 0],
    [0, 0, 0],
  ]);

  // 目标三视图设定 (以 2x2 区域为例，主视 [2, 1], 左视 [2, 1])
  const targetFront = [2, 1]; // 第 0 列高 2，第 1 列高 1
  const targetLeft = [2, 1]; // 第 0 行高 2，第 1 行高 1

  // 点击格子增加高度 (0 -> 1 -> 2 -> 3 -> 0)
  const cycleCell = (r: number, c: number) => {
    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = (newGrid[r][c] + 1) % 4;
    setGrid(newGrid);
  };

  // 一键填充“最多方块方案”（每个位置取该行该列上限）
  const setMaxScheme = () => {
    setGrid([
      [2, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ]);
  };

  // 一键填充“最少方块方案”（交叉共用最高峰）
  const setMinScheme = () => {
    setGrid([
      [2, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]);
  };

  // 计算当前总积木数
  const totalCubes = grid.flat().reduce((a, b) => a + b, 0);

  // 实时投影视图
  // 主视图（各列最大值）
  const currentFront = [
    Math.max(grid[0][0], grid[1][0], grid[2][0]),
    Math.max(grid[0][1], grid[1][1], grid[2][1]),
  ];
  // 左视图（各行最大值）
  const currentLeft = [
    Math.max(grid[0][0], grid[0][1], grid[0][2]),
    Math.max(grid[1][0], grid[1][1], grid[1][2]),
  ];

  const isFrontMatch = currentFront[0] === targetFront[0] && currentFront[1] === targetFront[1];
  const isLeftMatch = currentLeft[0] === targetLeft[0] && currentLeft[1] === targetLeft[1];
  const isValid = isFrontMatch && isLeftMatch;

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers className={styles.icon} />
          <h2 className={styles.title}>三视图与积木还原实验室</h2>
        </div>
        <p className={styles.description}>
          从俯视图地基标数法破解空间正交投影！点击地基格子加减积木高度，实时联动主视、左视与最多/最少极值推导。
        </p>
      </div>

      {/* 快捷方案与目标提示 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
            🎯 目标视图要求：主视 [高2, 高1] ｜ 左视 [高2, 高1]
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={setMaxScheme}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            🌟 一键最多方案 (5个)
          </button>
          <button
            onClick={setMinScheme}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#059669',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            💎 一键最少方案 (3个)
          </button>
          <button
            onClick={() =>
              setGrid([
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
              ])
            }
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> 清空
          </button>
        </div>
      </div>

      {/* 主工作台：左边是 3D/地基互动，右边是三视图正交投影 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* 左侧：俯视图“地基标数”互动面板 */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '12px' }}>
            🏗️ 俯视地基标数台（点击格子改变积木层数）
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              width: '210px',
              height: '210px',
            }}
          >
            {grid.map((row, r) =>
              row.map((val, c) => {
                const isInactive = r > 1 || c > 1; // 仅聚焦 2x2 区域，第三行列留白对比
                let bgColor = '#f8fafc';
                let textColor = '#64748b';
                let borderColor = '#cbd5e1';

                if (val === 1) {
                  bgColor = '#dbeafe';
                  textColor = '#1d4ed8';
                  borderColor = '#3b82f6';
                } else if (val === 2) {
                  bgColor = '#ede9fe';
                  textColor = '#6d28d9';
                  borderColor = '#8b5cf6';
                } else if (val >= 3) {
                  bgColor = '#fee2e2';
                  textColor = '#b91c1c';
                  borderColor = '#ef4444';
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => cycleCell(r, c)}
                    style={{
                      borderRadius: '8px',
                      border: `2px solid ${borderColor}`,
                      backgroundColor: bgColor,
                      color: textColor,
                      fontWeight: 800,
                      fontSize: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      boxShadow: val > 0 ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                      opacity: isInactive && val === 0 ? 0.35 : 1,
                    }}
                    title={`点击切换第${r + 1}行第${c + 1}列方块数`}
                  >
                    <span>{val}</span>
                    <span style={{ fontSize: '9px', fontWeight: 600, color: '#94a3b8' }}>
                      {val === 0 ? '空' : `${val}层`}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div style={{ marginTop: '14px', fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
            当前积木总数：<span style={{ color: '#4f46e5', fontSize: '18px' }}>{totalCubes}</span> 个
          </div>
        </div>

        {/* 右侧：主视图与左视图正交投影 */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* 主视图 (从正面看各列峰值) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                👀 正面观察（主视图，看各列最高）：
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isFrontMatch ? '#059669' : '#dc2626',
                }}
              >
                {isFrontMatch ? '✅ 符合要求 [2, 1]' : `❌ 当前 [${currentFront.join(', ')}]`}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '65px' }}>
              {[0, 1].map((colIdx) => {
                const h = currentFront[colIdx];
                return (
                  <div
                    key={colIdx}
                    style={{
                      width: '50px',
                      height: `${h * 26}px`,
                      minHeight: '4px',
                      backgroundColor: h === targetFront[colIdx] ? '#3b82f6' : '#f87171',
                      borderRadius: '4px 4px 0 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '12px',
                      transition: 'height 0.2s',
                    }}
                  >
                    {h > 0 && `${h}层`}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 左视图 (从左面看各行峰值) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                👈 左侧观察（左视图，看各行最高）：
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isLeftMatch ? '#059669' : '#dc2626',
                }}
              >
                {isLeftMatch ? '✅ 符合要求 [2, 1]' : `❌ 当前 [${currentLeft.join(', ')}]`}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '65px' }}>
              {[0, 1].map((rowIdx) => {
                const h = currentLeft[rowIdx];
                return (
                  <div
                    key={rowIdx}
                    style={{
                      width: '50px',
                      height: `${h * 26}px`,
                      minHeight: '4px',
                      backgroundColor: h === targetLeft[rowIdx] ? '#8b5cf6' : '#f87171',
                      borderRadius: '4px 4px 0 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '12px',
                      transition: 'height 0.2s',
                    }}
                  >
                    {h > 0 && `${h}层`}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 极值推导法则与解析卡片 */}
      <div
        style={{
          marginTop: '16px',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Sparkles color="#4f46e5" size={18} />
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>
            五年级必考极值解题核心口诀
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#4338ca' }}>
              求“最多用几个”（贪心填满）
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
              每个位置都填入允许的峰值上限：格子(i, j) = min(左视第i行, 主视第j列)。在本题中：2 + 1 + 1 + 1 = <b>5 个</b>！
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>
              求“最少用几个”（共用高峰）
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
              让一个高度为 2 的积木同时满足第 1 行和第 1 列的最高峰！其余位置尽量留空或填 1，最少只需 2 + 1 = <b>3 个</b>！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
