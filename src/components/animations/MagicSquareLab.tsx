'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  RotateCcw, 
  Wand2, 
  Grid3X3, 
  Layers, 
  Calculator,
  Eye,
  AlertCircle
} from 'lucide-react';
import styles from '@/styles/animations.module.css';

// 经典洛书三阶幻方标准解
// [4, 9, 2]
// [3, 5, 7]
// [8, 1, 6]
const SOLVED_GRID = [4, 9, 2, 3, 5, 7, 8, 1, 6];

interface PresetSeries {
  id: string;
  name: string;
  numbers: number[]; // 9个等差数字
  targetSum: number; // 幻和
  centerNum: number; // 中心数
  desc: string;
}

const PRESET_SERIES: PresetSeries[] = [
  {
    id: 'standard-1-9',
    name: '经典洛书：数字 1 ~ 9',
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    targetSum: 15,
    centerNum: 5,
    desc: '最著名的三阶幻方！总和 45 ÷ 3 = 15，中心数 15 ÷ 3 = 5。',
  },
  {
    id: 'even-2-18',
    name: '偶数序列：2, 4, 6 ... 18',
    numbers: [2, 4, 6, 8, 10, 12, 14, 16, 18],
    targetSum: 30,
    centerNum: 10,
    desc: '公差为 2 的偶数幻方。总和 90 ÷ 3 = 30，中心数 30 ÷ 3 = 10。',
  },
  {
    id: 'odd-1-17',
    name: '奇数序列：1, 3, 5 ... 17',
    numbers: [1, 3, 5, 7, 9, 11, 13, 15, 17],
    targetSum: 27,
    centerNum: 9,
    desc: '公差为 2 的奇数幻方。总和 81 ÷ 3 = 27，中心数 27 ÷ 3 = 9。',
  },
  {
    id: 'multiples-3',
    name: '三的倍数：3, 6, 9 ... 27',
    numbers: [3, 6, 9, 12, 15, 18, 21, 24, 27],
    targetSum: 45,
    centerNum: 15,
    desc: '公差为 3 的等差数阵。总和 135 ÷ 3 = 45，中心数 45 ÷ 3 = 15。',
  },
];

export default function MagicSquareLab() {
  const [selectedSeries, setSelectedSeries] = useState<PresetSeries>(PRESET_SERIES[0]);
  // 9个格子的填入状态，null表示空
  const [grid, setGrid] = useState<(number | null)[]>(Array(9).fill(null));
  // 选中的备选数字（待放入格子）
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  // 是否开启“中心格四线透视”高亮
  const [showCenterRays, setShowCenterRays] = useState<boolean>(false);
  // 当前透视的线条 ('row' | 'col' | 'diag1' | 'diag2' | 'all' | null)
  const [activeRay, setActiveRay] = useState<string | null>(null);

  // 根据当前序列推算出的正确解
  // 按照经典位置映射填入相应数字（0->4号元素, 1->9号元素...）
  const getSolutionForSeries = (series: PresetSeries) => {
    // series.numbers 对应 [1..9] 的第 i 个数 (0-indexed)
    return SOLVED_GRID.map((origVal) => series.numbers[origVal - 1]);
  };

  // 检查某个数字是否已经被放入棋盘
  const isNumberUsed = (num: number) => {
    return grid.includes(num);
  };

  // 点击数字备选池
  const handleSelectPoolNumber = (num: number) => {
    if (isNumberUsed(num)) return;
    if (selectedNum === num) {
      setSelectedNum(null);
    } else {
      setSelectedNum(num);
    }
  };

  // 点击九宫格中的某个格子
  const handleCellClick = (cellIndex: number) => {
    const currentVal = grid[cellIndex];

    // 如果当前选了备选数字，放入该格子
    if (selectedNum !== null) {
      const newGrid = [...grid];
      newGrid[cellIndex] = selectedNum;
      setGrid(newGrid);
      setSelectedNum(null);
      return;
    }

    // 如果格子已有数字且没选备选数字，点击则取出该数字（放回池中）
    if (currentVal !== null) {
      const newGrid = [...grid];
      newGrid[cellIndex] = null;
      setGrid(newGrid);
    }
  };

  // 一键按口诀解密填入
  const handleSolveByRhyme = () => {
    const solution = getSolutionForSeries(selectedSeries);
    setGrid(solution);
    setSelectedNum(null);
  };

  // 清空棋盘
  const handleClear = () => {
    setGrid(Array(9).fill(null));
    setSelectedNum(null);
    setShowCenterRays(false);
    setActiveRay(null);
  };

  // 切换数字序列
  const handleSelectSeries = (s: PresetSeries) => {
    setSelectedSeries(s);
    setGrid(Array(9).fill(null));
    setSelectedNum(null);
    setShowCenterRays(false);
    setActiveRay(null);
  };

  // 计算每行、每列、两条对角线的和
  // 行: 0,1,2 | 3,4,5 | 6,7,8
  const rowSums = [
    (grid[0] ?? 0) + (grid[1] ?? 0) + (grid[2] ?? 0),
    (grid[3] ?? 0) + (grid[4] ?? 0) + (grid[5] ?? 0),
    (grid[6] ?? 0) + (grid[7] ?? 0) + (grid[8] ?? 0),
  ];
  const rowFull = [
    grid[0] !== null && grid[1] !== null && grid[2] !== null,
    grid[3] !== null && grid[4] !== null && grid[5] !== null,
    grid[6] !== null && grid[7] !== null && grid[8] !== null,
  ];

  // 列: 0,3,6 | 1,4,7 | 2,5,8
  const colSums = [
    (grid[0] ?? 0) + (grid[3] ?? 0) + (grid[6] ?? 0),
    (grid[1] ?? 0) + (grid[4] ?? 0) + (grid[7] ?? 0),
    (grid[2] ?? 0) + (grid[5] ?? 0) + (grid[8] ?? 0),
  ];
  const colFull = [
    grid[0] !== null && grid[3] !== null && grid[6] !== null,
    grid[1] !== null && grid[4] !== null && grid[7] !== null,
    grid[2] !== null && grid[5] !== null && grid[8] !== null,
  ];

  // 主对角线: 0,4,8
  const diag1Sum = (grid[0] ?? 0) + (grid[4] ?? 0) + (grid[8] ?? 0);
  const diag1Full = grid[0] !== null && grid[4] !== null && grid[8] !== null;

  // 副对角线: 2,4,6
  const diag2Sum = (grid[2] ?? 0) + (grid[4] ?? 0) + (grid[6] ?? 0);
  const diag2Full = grid[2] !== null && grid[4] !== null && grid[6] !== null;

  // 检查是否全满且所有线都等于 targetSum
  const allFilled = grid.every((cell) => cell !== null);
  const allCorrect = allFilled &&
    rowSums.every((s) => s === selectedSeries.targetSum) &&
    colSums.every((s) => s === selectedSeries.targetSum) &&
    diag1Sum === selectedSeries.targetSum &&
    diag2Sum === selectedSeries.targetSum;

  // 中心格四线高亮判断函数
  const isCellInCenterRay = (idx: number) => {
    if (!showCenterRays) return false;
    if (idx === 4) return true; // 中心必亮
    if (activeRay === 'row') return idx === 3 || idx === 5;
    if (activeRay === 'col') return idx === 1 || idx === 7;
    if (activeRay === 'diag1') return idx === 0 || idx === 8;
    if (activeRay === 'diag2') return idx === 2 || idx === 6;
    if (activeRay === 'all') return true; // 全开
    return false;
  };

  return (
    <div className={styles.labContainer} style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* 顶部标题栏 */}
      <div className={styles.labToolbar} style={{ flexWrap: 'wrap', gap: '10px' }}>
        <div className={styles.labTitle}>
          <Grid3X3 className="w-5 h-5 text-indigo-600" />
          <span>九宫格与三阶幻方实验室：戴九履一，看穿数阵图的平衡密码</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          三年级/四年级数学 · 组合平衡与数论直觉
        </div>
      </div>

      {/* 预设数字序列选择栏（流式换行） */}
      <div style={{ padding: '12px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
          选择数阵图序列：
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {PRESET_SERIES.map((s) => {
            const isSel = s.id === selectedSeries.id;
            return (
              <button
                key={s.id}
                onClick={() => handleSelectSeries(s)}
                style={{
                  flex: '1 1 200px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: isSel ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                  background: isSel ? '#eef2ff' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: isSel ? '0 2px 8px rgba(79, 70, 229, 0.15)' : 'none',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isSel ? '#3730a3' : '#1e293b' }}>
                  {s.name}
                </div>
                <div style={{ fontSize: '0.74rem', color: isSel ? '#4f46e5' : '#64748b', marginTop: '2px' }}>
                  目标幻和：<strong>{s.targetSum}</strong> | 中心数：<strong>{s.centerNum}</strong>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 题意引导条 */}
      <div
        style={{
          padding: '12px 20px',
          background: '#fffbeb',
          borderBottom: '1px solid #fef3c7',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0" style={{ marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#92400e' }}>
            将这 9 个数字填入 3×3 九宫格中，使每行、每列、每条对角线上的 3 个数字之和都等于【{selectedSeries.targetSum}】！
          </div>
          <div style={{ fontSize: '0.8rem', color: '#b45309', marginTop: '3px' }}>
            💡 核心密码：{selectedSeries.desc}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 核心动效大舞台：3×3 九宫格棋盘 + 实时和值指示灯 */}
      {/* ======================================================== */}
      <div style={{ padding: '20px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>【九宫格互动棋盘】点击备选数字填入，或点击格子取回数字</span>
          </div>

          {allCorrect ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
              <CheckCircle2 className="w-4 h-4" />
              <span>🎉 恭喜！完美达成三阶幻方（所有线均等于 {selectedSeries.targetSum}）！</span>
            </div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              目标：让 3行 + 3列 + 2对角线 全变成绿色勾勾（每条线和均为 {selectedSeries.targetSum}）
            </div>
          )}
        </div>

        {/* 棋盘主体与四周和值指示灯（居中弹性布局） */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* 主对角线1指示标 (左上 ➔ 右下) */}
            <div
              style={{
                position: 'absolute',
                top: '-32px',
                left: '-32px',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: diag1Full && diag1Sum === selectedSeries.targetSum ? '#dcfce7' : '#f1f5f9',
                color: diag1Full && diag1Sum === selectedSeries.targetSum ? '#15803d' : '#64748b',
                border: diag1Full && diag1Sum === selectedSeries.targetSum ? '1.5px solid #86efac' : '1px solid #cbd5e1',
              }}
              title="主对角线和"
            >
              ↘ {diag1Sum}
            </div>

            {/* 副对角线2指示标 (右上 ➔ 左下) */}
            <div
              style={{
                position: 'absolute',
                top: '-32px',
                right: '-32px',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: diag2Full && diag2Sum === selectedSeries.targetSum ? '#dcfce7' : '#f1f5f9',
                color: diag2Full && diag2Sum === selectedSeries.targetSum ? '#15803d' : '#64748b',
                border: diag2Full && diag2Sum === selectedSeries.targetSum ? '1.5px solid #86efac' : '1px solid #cbd5e1',
              }}
              title="副对角线和"
            >
              ↙ {diag2Sum}
            </div>

            {/* 3×3 九宫格与行和列和网格 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 76px) 50px', gap: '8px', alignItems: 'center' }}>
              {/* 第 1 行 3 格 + 第 1 行行和 */}
              {[0, 1, 2].map((idx) => {
                const isHighlight = isCellInCenterRay(idx);
                const val = grid[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => handleCellClick(idx)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '12px',
                      background: isHighlight
                        ? '#fef08a'
                        : val !== null
                        ? '#eff6ff'
                        : '#f8fafc',
                      border: isHighlight
                        ? '2.5px solid #ca8a04'
                        : val !== null
                        ? '2px solid #3b82f6'
                        : '2px dashed #cbd5e1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: val !== null ? '0 3px 8px rgba(59, 130, 246, 0.15)' : 'none',
                      transition: 'all 0.15s ease',
                      userSelect: 'none',
                    }}
                  >
                    <span style={{ fontSize: val !== null ? '1.8rem' : '1rem', fontWeight: 900, color: val !== null ? '#1d4ed8' : '#cbd5e1' }}>
                      {val !== null ? val : '？'}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>
                      {idx === 0 ? '肩(左)' : idx === 1 ? '戴九(顶)' : '肩(右)'}
                    </span>
                  </div>
                );
              })}
              {/* 第 1 行和 */}
              <div
                style={{
                  padding: '6px 4px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  background: rowFull[0] && rowSums[0] === selectedSeries.targetSum ? '#dcfce7' : '#f8fafc',
                  color: rowFull[0] && rowSums[0] === selectedSeries.targetSum ? '#15803d' : '#64748b',
                  border: rowFull[0] && rowSums[0] === selectedSeries.targetSum ? '1.5px solid #86efac' : '1px solid #cbd5e1',
                }}
              >
                ={rowSums[0]}
                {rowFull[0] && rowSums[0] === selectedSeries.targetSum && '✓'}
              </div>

              {/* 第 2 行 3 格 + 第 2 行行和 */}
              {[3, 4, 5].map((idx) => {
                const isCenter = idx === 4;
                const isHighlight = isCellInCenterRay(idx);
                const val = grid[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => handleCellClick(idx)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '12px',
                      background: isCenter
                        ? (val === selectedSeries.centerNum ? '#dbeafe' : '#fef3c7')
                        : isHighlight
                        ? '#fef08a'
                        : val !== null
                        ? '#eff6ff'
                        : '#f8fafc',
                      border: isCenter
                        ? '3px solid #f59e0b'
                        : isHighlight
                        ? '2.5px solid #ca8a04'
                        : val !== null
                        ? '2px solid #3b82f6'
                        : '2px dashed #cbd5e1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: isCenter ? '0 4px 12px rgba(245, 158, 11, 0.25)' : 'none',
                      transition: 'all 0.15s ease',
                      userSelect: 'none',
                    }}
                  >
                    <span style={{ fontSize: val !== null ? '1.8rem' : '1rem', fontWeight: 900, color: isCenter ? '#b45309' : val !== null ? '#1d4ed8' : '#cbd5e1' }}>
                      {val !== null ? val : '？'}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: isCenter ? '#b45309' : '#94a3b8', fontWeight: isCenter ? 700 : 400 }}>
                      {idx === 3 ? '左三' : idx === 4 ? '👑中心格' : '右七'}
                    </span>
                  </div>
                );
              })}
              {/* 第 2 行和 */}
              <div
                style={{
                  padding: '6px 4px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  background: rowFull[1] && rowSums[1] === selectedSeries.targetSum ? '#dcfce7' : '#f8fafc',
                  color: rowFull[1] && rowSums[1] === selectedSeries.targetSum ? '#15803d' : '#64748b',
                  border: rowFull[1] && rowSums[1] === selectedSeries.targetSum ? '1.5px solid #86efac' : '1px solid #cbd5e1',
                }}
              >
                ={rowSums[1]}
                {rowFull[1] && rowSums[1] === selectedSeries.targetSum && '✓'}
              </div>

              {/* 第 3 行 3 格 + 第 3 行行和 */}
              {[6, 7, 8].map((idx) => {
                const isHighlight = isCellInCenterRay(idx);
                const val = grid[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => handleCellClick(idx)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '12px',
                      background: isHighlight
                        ? '#fef08a'
                        : val !== null
                        ? '#eff6ff'
                        : '#f8fafc',
                      border: isHighlight
                        ? '2.5px solid #ca8a04'
                        : val !== null
                        ? '2px solid #3b82f6'
                        : '2px dashed #cbd5e1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: val !== null ? '0 3px 8px rgba(59, 130, 246, 0.15)' : 'none',
                      transition: 'all 0.15s ease',
                      userSelect: 'none',
                    }}
                  >
                    <span style={{ fontSize: val !== null ? '1.8rem' : '1rem', fontWeight: 900, color: val !== null ? '#1d4ed8' : '#cbd5e1' }}>
                      {val !== null ? val : '？'}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>
                      {idx === 6 ? '足(左)' : idx === 7 ? '履一(底)' : '足(右)'}
                    </span>
                  </div>
                );
              })}
              {/* 第 3 行和 */}
              <div
                style={{
                  padding: '6px 4px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  background: rowFull[2] && rowSums[2] === selectedSeries.targetSum ? '#dcfce7' : '#f8fafc',
                  color: rowFull[2] && rowSums[2] === selectedSeries.targetSum ? '#15803d' : '#64748b',
                  border: rowFull[2] && rowSums[2] === selectedSeries.targetSum ? '1.5px solid #86efac' : '1px solid #cbd5e1',
                }}
              >
                ={rowSums[2]}
                {rowFull[2] && rowSums[2] === selectedSeries.targetSum && '✓'}
              </div>

              {/* 第 1、2、3 列列和 */}
              {[0, 1, 2].map((cIdx) => (
                <div
                  key={cIdx}
                  style={{
                    padding: '4px 6px',
                    borderRadius: '6px',
                    textAlign: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    background: colFull[cIdx] && colSums[cIdx] === selectedSeries.targetSum ? '#dcfce7' : '#f8fafc',
                    color: colFull[cIdx] && colSums[cIdx] === selectedSeries.targetSum ? '#15803d' : '#64748b',
                    border: colFull[cIdx] && colSums[cIdx] === selectedSeries.targetSum ? '1.5px solid #86efac' : '1px solid #cbd5e1',
                  }}
                >
                  ={colSums[cIdx]}
                  {colFull[cIdx] && colSums[cIdx] === selectedSeries.targetSum && '✓'}
                </div>
              ))}
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center' }}>列和</div>
            </div>
          </div>
        </div>

        {/* 备选数字池（数字磁吸栏） */}
        <div style={{ marginTop: '16px', background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
              待填入数字磁贴（点击选取，再点击上方九宫格填入）：
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {selectedNum !== null ? `已拾起数字【${selectedNum}】，请点击目标格子放入！` : '提示：也可点击已填格子放回数字'}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {selectedSeries.numbers.map((num) => {
              const used = isNumberUsed(num);
              const isPicked = selectedNum === num;

              return (
                <button
                  key={num}
                  onClick={() => handleSelectPoolNumber(num)}
                  disabled={used}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    border: isPicked
                      ? '3px solid #4f46e5'
                      : used
                      ? '1px dashed #cbd5e1'
                      : '1.5px solid #94a3b8',
                    background: isPicked
                      ? '#eef2ff'
                      : used
                      ? '#f1f5f9'
                      : '#ffffff',
                    color: used ? '#cbd5e1' : isPicked ? '#4f46e5' : '#1e293b',
                    cursor: used ? 'not-allowed' : 'pointer',
                    boxShadow: isPicked ? '0 0 0 3px rgba(79, 70, 229, 0.25)' : 'none',
                    transform: isPicked ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 紧挨动画的控制操作面板（一键口诀归位、中心透视、清空） */}
        {/* ======================================================== */}
        <div
          style={{
            marginTop: '16px',
            padding: '14px 18px',
            background: '#f8fafc',
            borderRadius: '14px',
            border: '2px solid #e0e7ff',
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.06)',
          }}
        >
          {/* 第 1 行：主操作控制（换行流式布局） */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
              {/* 一键口诀归位 */}
              <button
                onClick={handleSolveByRhyme}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: '#4f46e5',
                  color: '#ffffff',
                  boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)',
                }}
              >
                <Wand2 className="w-4 h-4" />
                <span>一键按口诀归位解密</span>
              </button>

              {/* 清空棋盘 */}
              <button
                onClick={handleClear}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>清空棋盘重来</span>
              </button>
            </div>

            {/* 中心格四线透视功能切换 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>中心透视：</span>
              <button
                onClick={() => {
                  setShowCenterRays(!showCenterRays);
                  setActiveRay(showCenterRays ? null : 'all');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: showCenterRays ? '1.5px solid #d97706' : '1px solid #cbd5e1',
                  background: showCenterRays ? '#fef3c7' : '#ffffff',
                  color: showCenterRays ? '#b45309' : '#475569',
                  cursor: 'pointer',
                }}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showCenterRays ? '关闭四线透视' : '开启穿过中心的四条线透视'}</span>
              </button>
            </div>
          </div>

          {/* 第 2 行：如果开启了中心透视，切换具体线条 */}
          {showCenterRays && (
            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', padding: '8px 12px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#92400e' }}>切换四条穿过中心的线：</span>
              {[
                { id: 'all', label: '全部 4 条线' },
                { id: 'row', label: '中间行 (左三+中+右七)' },
                { id: 'col', label: '中间列 (戴九+中+履一)' },
                { id: 'diag1', label: '主对角线 (左肩+中+右足)' },
                { id: 'diag2', label: '副对角线 (右肩+中+左足)' },
              ].map((ray) => (
                <button
                  key={ray.id}
                  onClick={() => setActiveRay(ray.id)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '5px',
                    fontSize: '0.74rem',
                    fontWeight: activeRay === ray.id ? 700 : 500,
                    border: activeRay === ray.id ? '1.5px solid #b45309' : '1px solid #fde68a',
                    background: activeRay === ray.id ? '#fef08a' : '#ffffff',
                    color: '#78350f',
                    cursor: 'pointer',
                  }}
                >
                  {ray.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 实时算理与推导解密面板 */}
      <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* 左侧：为什么中心格必须是 5（算理拆解） */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '2px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>
              📐 核心算理一：为什么中心格一定是【{selectedSeries.centerNum}】？
            </div>

            <div style={{ marginTop: '8px', fontSize: '0.82rem', color: '#334155', lineHeight: 1.6 }}>
              <div>• <strong>穿过中心格的线共有 4 条</strong>（1横、1竖、2对角线）。</div>
              <div>• 4 条线的总和 = 4 × 幻和【{selectedSeries.targetSum}】= <strong>{4 * selectedSeries.targetSum}</strong>。</div>
              <div>• 这 4 条线正好包含了 9 个数字各一次（总和 {selectedSeries.targetSum * 3}），外加中心数多算了 3 次！</div>
              <div style={{ background: '#f0fdf4', padding: '6px 10px', borderRadius: '6px', marginTop: '6px', color: '#166534', fontWeight: 700 }}>
                算式：3 × 中心数 = {4 * selectedSeries.targetSum} - {3 * selectedSeries.targetSum} = {selectedSeries.targetSum}
                <br />
                中心数 = {selectedSeries.targetSum} ÷ 3 = {selectedSeries.centerNum}！
              </div>
            </div>
          </div>

          {/* 右侧：口诀八卦图解 */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '2px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>
              📜 核心算理二：古老洛书口诀的绝妙空间密码
            </div>

            <div style={{ marginTop: '8px', fontSize: '0.82rem', color: '#334155', lineHeight: 1.6 }}>
              <div>• <strong>戴九履一</strong>：9 在最头顶（正上），1 在最脚底（正下）。</div>
              <div>• <strong>左三右七</strong>：3 在最左侧，7 在最右侧。</div>
              <div>• <strong>二四为肩</strong>：2 和 4 位于左右两个肩膀角落。</div>
              <div>• <strong>六八为足</strong>：6 和 8 位于左右两只脚底角落。</div>
              <div>• <strong>五居中央</strong>：5 稳稳坐镇正中心！</div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                💡 奇数占十字（上下左右），偶数占四角（肩足四角），对称互补！
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部黄金速记口诀 */}
      <div
        style={{
          padding: '14px 20px',
          background: '#faf5ff',
          borderTop: '1px solid #f3e8ff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
        <div style={{ fontSize: '0.85rem', color: '#6b21a8' }}>
          <strong>三阶幻方千年不传金口诀：</strong>
          <span>“九宫之义，戴九履一；左三右七，二四为肩；六八为足，五居中央！”</span>
        </div>
      </div>
    </div>
  );
}
