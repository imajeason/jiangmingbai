'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Grid, Sparkles, CheckCircle2, RotateCcw, Lightbulb, Eye } from 'lucide-react';

interface Puzzle {
  name: string;
  initial: (number | null)[][];
  solution: number[][];
  desc: string;
}

export default function MiniSudokuLogicLab() {
  const puzzles: Puzzle[] = [
    {
      name: '关卡一：唯一数入门',
      initial: [
        [1, null, 3, 4],
        [3, 4, null, null],
        [null, null, 4, 3],
        [4, 3, null, 1]
      ],
      solution: [
        [1, 2, 3, 4],
        [3, 4, 1, 2],
        [2, 1, 4, 3],
        [4, 3, 2, 1]
      ],
      desc: '第一行有1,3,4，空缺只能是2！三维扫描逐个击破！'
    },
    {
      name: '关卡二：十字排除进阶',
      initial: [
        [null, 2, 4, null],
        [1, null, null, 3],
        [4, null, null, 2],
        [null, 1, 3, null]
      ],
      solution: [
        [3, 2, 4, 1],
        [1, 4, 2, 3],
        [4, 3, 1, 2],
        [2, 1, 3, 4]
      ],
      desc: '用行列交叉激光枪排除宫格死路，寻找唯一容身之所！'
    }
  ];

  const [puzzleIdx, setPuzzleIdx] = useState<number>(0);
  const curPuzzle = puzzles[puzzleIdx];

  // 当前棋盘状态
  const [board, setBoard] = useState<(number | null)[][]>(curPuzzle.initial);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>({ r: 0, c: 1 });

  // 切换关卡
  const handleSwitchPuzzle = (idx: number) => {
    setPuzzleIdx(idx);
    setBoard(puzzles[idx].initial);
    setSelectedCell({ r: 0, c: 1 });
  };

  // 重置当前关
  const handleReset = () => {
    setBoard(curPuzzle.initial);
    setSelectedCell({ r: 0, c: 1 });
  };

  // 填入数字
  const handleInputNumber = (val: number | null) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    if (curPuzzle.initial[r][c] !== null) return; // 初始题目不可修改

    const newBoard = board.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );
    setBoard(newBoard);
  };

  // 一键填充正确答案
  const handleSolve = () => {
    setBoard(curPuzzle.solution);
  };

  // 计算当前选中格子的雷达扫描信息 (行、列、宫中已有数字)
  const getRadarInfo = () => {
    if (!selectedCell) return null;
    const { r, c } = selectedCell;

    const rowNums = new Set<number>();
    for (let ci = 0; ci < 4; ci++) {
      if (board[r][ci] !== null && ci !== c) rowNums.add(board[r][ci]!);
    }

    const colNums = new Set<number>();
    for (let ri = 0; ri < 4; ri++) {
      if (board[ri][c] !== null && ri !== r) colNums.add(board[ri][c]!);
    }

    const blockNums = new Set<number>();
    const startR = Math.floor(r / 2) * 2;
    const startC = Math.floor(c / 2) * 2;
    for (let ri = startR; ri < startR + 2; ri++) {
      for (let ci = startC; ci < startC + 2; ci++) {
        if (board[ri][ci] !== null && !(ri === r && ci === c)) {
          blockNums.add(board[ri][ci]!);
        }
      }
    }

    const allSeen = new Set<number>([...rowNums, ...colNums, ...blockNums]);
    const candidates = [1, 2, 3, 4].filter(n => !allSeen.has(n));

    return { rowNums: Array.from(rowNums), colNums: Array.from(colNums), blockNums: Array.from(blockNums), allSeen: Array.from(allSeen), candidates };
  };

  const radar = getRadarInfo();

  // 检查是否全对胜利
  const isSolved = board.every((row, r) =>
    row.every((cell, c) => cell === curPuzzle.solution[r][c])
  );

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Grid size={18} style={{ color: '#0284c7' }} />
          <span>逻辑推理高阶：数独四宫格与排除法</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {puzzles.map((p, idx) => (
            <button
              key={idx}
              className={`${styles.controlBtn} ${puzzleIdx === idx ? styles.controlBtnActive : ''}`}
              onClick={() => handleSwitchPuzzle(idx)}
            >
              {p.name}
            </button>
          ))}
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
          {/* 原则导读 */}
          <div style={{
            width: '100%',
            background: '#f0f9ff',
            padding: '12px 14px',
            borderRadius: '8px',
            borderLeft: '4px solid #0284c7',
            fontSize: '0.85rem',
            color: '#075985',
            lineHeight: 1.6
          }}>
            <strong>【数独第一原则：绝对不靠瞎猜度！】：</strong>
            <br />
            点击任意一个空格，下方会自动启动<strong>“三维雷达”</strong>，扫描行、列、宫已被占用的数字，一秒揪出<strong>唯一可能</strong>！
          </div>

          {/* 4x4 数独棋盘 */}
          <div style={{
            marginTop: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 56px)',
            gridTemplateRows: 'repeat(4, 56px)',
            gap: '2px',
            background: '#334155',
            padding: '4px',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isInitial = curPuzzle.initial[r][c] !== null;
                const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                const isInRadar = selectedCell && (selectedCell.r === r || selectedCell.c === c || (Math.floor(selectedCell.r / 2) === Math.floor(r / 2) && Math.floor(selectedCell.c / 2) === Math.floor(c / 2)));

                // 2x2 宫格粗边框判断
                const borderRight = c === 1 ? '3px solid #0f172a' : '1px solid #e2e8f0';
                const borderBottom = r === 1 ? '3px solid #0f172a' : '1px solid #e2e8f0';

                return (
                  <button
                    key={`${r}-${c}`}
                    style={{
                      width: '56px',
                      height: '56px',
                      background: isSelected
                        ? '#fed7aa'
                        : isInRadar
                        ? '#eff6ff'
                        : '#ffffff',
                      borderRight,
                      borderBottom,
                      borderTop: 'none',
                      borderLeft: 'none',
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      color: isInitial ? '#0f172a' : '#2563eb',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                    onClick={() => setSelectedCell({ r, c })}
                  >
                    {cell ?? ''}
                  </button>
                );
              })
            )}
          </div>

          {/* 逻辑雷达透视分析卡 */}
          {selectedCell && radar && (
            <div style={{
              marginTop: '16px',
              width: '100%',
              background: '#fafaf9',
              border: '1.5px solid #e7e5e4',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '0.8rem',
              color: '#44403c',
              lineHeight: 1.6
            }}>
              <div style={{ fontWeight: 800, color: '#1c1917', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={16} color="#0284c7" />
                <span>
                  当前雷达锁定格：第 {selectedCell.r + 1} 行，第 {selectedCell.c + 1} 列
                </span>
              </div>
              <div style={{ marginTop: '4px' }}>
                • 同行同列同宫已见数字：
                <strong style={{ color: '#dc2626' }}>
                  {radar.allSeen.length > 0 ? radar.allSeen.sort().join('、') : '无'}
                </strong>
              </div>
              <div style={{ marginTop: '2px' }}>
                • 剩余合法候选数：
                <strong style={{ color: '#059669', fontSize: '0.95rem' }}>
                  {radar.candidates.join('、')}
                </strong>
                {radar.candidates.length === 1 && (
                  <span style={{ marginLeft: '8px', padding: '2px 8px', background: '#ecfdf5', borderRadius: '4px', color: '#15803d', fontWeight: 800 }}>
                    🎯 触发唯一数法则！必须填 {radar.candidates[0]}！
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 数字填入键盘 */}
          <div style={{ marginTop: '14px', display: 'flex', gap: '8px', width: '100%', justifyContent: 'center' }}>
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                style={{
                  flex: 1,
                  maxWidth: '70px',
                  padding: '10px 0',
                  borderRadius: '8px',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
                }}
                onClick={() => handleInputNumber(num)}
              >
                {num}
              </button>
            ))}
            <button
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#f1f5f9',
                color: '#475569',
                fontWeight: 700,
                border: '1px solid #cbd5e1',
                cursor: 'pointer'
              }}
              onClick={() => handleInputNumber(null)}
            >
              擦除
            </button>
          </div>

          {/* 结案确认与控制按钮 */}
          <div style={{ marginTop: '14px', width: '100%', display: 'flex', gap: '8px' }}>
            <button
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
              onClick={handleSolve}
            >
              💡 演示完整答案
            </button>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onClick={handleReset}
            >
              <RotateCcw size={14} />
              重开本关
            </button>
          </div>

          {isSolved && (
            <div style={{
              marginTop: '12px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#dcfce7',
              border: '1px solid #86efac',
              color: '#15803d',
              fontWeight: 800,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={16} />
              <span>🎉 恭喜！所有行、列、宫严密闭环，完美通关！</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
