'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Layers, Sparkles, Wand2, Info } from 'lucide-react';

export default function PascalYangHuiLab() {
  const [maxRows, setMaxRows] = useState<number>(7); // 4 ~ 8 行 (第 0 行到第 maxRows-1 行)
  const [mode, setMode] = useState<'shoulders' | 'rowSum' | 'hockeyStick' | 'sierpinski'>('shoulders');
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number }>({ r: 4, c: 2 }); // 默认 C(4,2)=6

  // 组合数计算 C(n, k)
  const comb = (n: number, k: number): number => {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    let res = 1;
    for (let i = 1; i <= k; i++) {
      res = (res * (n - i + 1)) / i;
    }
    return Math.round(res);
  };

  // 生成杨辉三角二维数组
  const triangle: number[][] = [];
  for (let r = 0; r < maxRows; r++) {
    const row: number[] = [];
    for (let c = 0; c <= r; c++) {
      row.push(comb(r, c));
    }
    triangle.push(row);
  }

  // 冰球杆恒等式预设路径 (以加到 C(5, 2) 为例: C(2,2)+C(3,2)+C(4,2) = C(5,3) => 1 + 3 + 6 = 10)
  // 或者 C(1,1)+C(2,1)+C(3,1)+C(4,1) = C(5,2) => 1 + 2 + 3 + 4 = 10
  const isHockeyStickStem = (r: number, c: number) => {
    // 示范: (1,1)=1, (2,1)=2, (3,1)=3, (4,1)=4
    return c === 1 && r >= 1 && r <= 4 && maxRows >= 6;
  };
  const isHockeyStickHead = (r: number, c: number) => {
    // 弯折到 (5, 2)=10
    return r === 5 && c === 2 && maxRows >= 6;
  };

  // 两肩判断
  const isSelected = (r: number, c: number) => selectedCell.r === r && selectedCell.c === c;
  const isParentLeft = (r: number, c: number) =>
    selectedCell.r > 0 && selectedCell.c > 0 && selectedCell.r - 1 === r && selectedCell.c - 1 === c;
  const isParentRight = (r: number, c: number) =>
    selectedCell.r > 0 && selectedCell.c < selectedCell.r && selectedCell.r - 1 === r && selectedCell.c === c;

  const currentVal = comb(selectedCell.r, selectedCell.c);
  const leftParentVal = selectedCell.c > 0 ? comb(selectedCell.r - 1, selectedCell.c - 1) : null;
  const rightParentVal = selectedCell.c < selectedCell.r ? comb(selectedCell.r - 1, selectedCell.c) : null;

  return (
    <div className={styles.container}>
      {/* 头部标题与模式切换 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers className={styles.icon} />
          <h2 className={styles.title}>杨辉三角与组合数可视化实验室</h2>
        </div>
        <p className={styles.description}>
          探索中国宋代贾宪、杨辉发现的宝塔数阵！点击数球观察两肩相加，探索行和 2ⁿ 规律、冰球杆恒等式与奇偶分形。
        </p>
      </div>

      {/* 模式选择导航 */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <button
          onClick={() => setMode('shoulders')}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: mode === 'shoulders' ? '#4f46e5' : '#f1f5f9',
            color: mode === 'shoulders' ? '#ffffff' : '#475569',
            transition: 'all 0.2s',
          }}
        >
          👆 两肩相加规律
        </button>
        <button
          onClick={() => setMode('rowSum')}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: mode === 'rowSum' ? '#059669' : '#f1f5f9',
            color: mode === 'rowSum' ? '#ffffff' : '#475569',
            transition: 'all 0.2s',
          }}
        >
          📈 行和 2ⁿ 翻倍
        </button>
        <button
          onClick={() => {
            setMode('hockeyStick');
            if (maxRows < 6) setMaxRows(6);
          }}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: mode === 'hockeyStick' ? '#ea580c' : '#f1f5f9',
            color: mode === 'hockeyStick' ? '#ffffff' : '#475569',
            transition: 'all 0.2s',
          }}
        >
          🏒 冰球杆恒等式
        </button>
        <button
          onClick={() => {
            setMode('sierpinski');
            if (maxRows < 8) setMaxRows(8);
          }}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: mode === 'sierpinski' ? '#db2777' : '#f1f5f9',
            color: mode === 'sierpinski' ? '#ffffff' : '#475569',
            transition: 'all 0.2s',
          }}
        >
          🎨 奇偶染色分形
        </button>
      </div>

      {/* 动态杨辉三角主画板 */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          padding: '24px 16px',
          border: '1px solid #e2e8f0',
          position: 'relative',
          overflowX: 'auto',
          minHeight: '360px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {triangle.map((row, r) => {
          const rowSum = row.reduce((a, b) => a + b, 0);

          return (
            <div
              key={r}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                position: 'relative',
              }}
            >
              {/* 行号与行和信息 (在行和模式或普通模式时显示) */}
              <div
                style={{
                  position: 'absolute',
                  right: 'calc(100% + 12px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: mode === 'rowSum' ? '#059669' : '#94a3b8',
                }}
              >
                <span>第{r}行</span>
              </div>

              {/* 该行的每个数字小球 */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {row.map((val, c) => {
                  const selected = isSelected(r, c);
                  const parentL = isParentLeft(r, c);
                  const parentR = isParentRight(r, c);
                  const inStickStem = mode === 'hockeyStick' && isHockeyStickStem(r, c);
                  const inStickHead = mode === 'hockeyStick' && isHockeyStickHead(r, c);
                  const isOdd = val % 2 !== 0;

                  // 样式计算
                  let bg = '#ffffff';
                  let border = '2px solid #cbd5e1';
                  let textColor = '#1e293b';
                  let shadow = '0 2px 4px rgba(0,0,0,0.04)';
                  let transform = 'scale(1)';

                  if (mode === 'shoulders') {
                    if (selected) {
                      bg = '#4f46e5';
                      border = '2px solid #3730a3';
                      textColor = '#ffffff';
                      shadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
                      transform = 'scale(1.15)';
                    } else if (parentL || parentR) {
                      bg = '#e0e7ff';
                      border = '2px solid #6366f1';
                      textColor = '#312e81';
                      shadow = '0 4px 10px rgba(99, 102, 241, 0.3)';
                      transform = 'scale(1.1)';
                    }
                  } else if (mode === 'rowSum') {
                    bg = '#ecfdf5';
                    border = '2px solid #a7f3d0';
                    textColor = '#065f46';
                  } else if (mode === 'hockeyStick') {
                    if (inStickStem) {
                      bg = '#ffedd5';
                      border = '2px solid #f97316';
                      textColor = '#9a3412';
                      transform = 'scale(1.08)';
                    } else if (inStickHead) {
                      bg = '#ea580c';
                      border = '2px solid #c2410c';
                      textColor = '#ffffff';
                      transform = 'scale(1.15)';
                      shadow = '0 4px 12px rgba(234, 88, 12, 0.4)';
                    }
                  } else if (mode === 'sierpinski') {
                    if (isOdd) {
                      bg = '#ec4899';
                      border = '2px solid #db2777';
                      textColor = '#ffffff';
                    } else {
                      bg = '#f8fafc';
                      border = '1px dashed #cbd5e1';
                      textColor = '#94a3b8';
                    }
                  }

                  return (
                    <button
                      key={c}
                      onClick={() => {
                        if (r > 0 && c > 0 && c < r) {
                          setSelectedCell({ r, c });
                        } else if (r > 0) {
                          setSelectedCell({ r, c });
                        }
                      }}
                      style={{
                        width: maxRows > 7 ? '36px' : '42px',
                        height: maxRows > 7 ? '36px' : '42px',
                        borderRadius: '50%',
                        backgroundColor: bg,
                        border: border,
                        color: textColor,
                        fontWeight: 700,
                        fontSize: val >= 100 ? '11px' : val >= 20 ? '13px' : '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: shadow,
                        transform: transform,
                        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        userSelect: 'none',
                      }}
                      title={`第${r}行 第${c}项: C(${r}, ${c}) = ${val}`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>

              {/* 行和在右侧 */}
              <div
                style={{
                  position: 'absolute',
                  left: 'calc(100% + 12px)',
                  whiteSpace: 'nowrap',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: mode === 'rowSum' ? '#059669' : '#64748b',
                }}
              >
                {mode === 'rowSum' && (
                  <span
                    style={{
                      background: '#d1fae5',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid #a7f3d0',
                    }}
                  >
                    和 = {rowSum} (2^{r})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 动态状态与算式解析面板 */}
      <div
        style={{
          marginTop: '16px',
          padding: '16px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        }}
      >
        {mode === 'shoulders' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={18} color="#4f46e5" />
              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>
                两肩相加演示：C({selectedCell.r}, {selectedCell.c}) = {currentVal}
              </span>
            </div>
            {selectedCell.c === 0 || selectedCell.c === selectedCell.r ? (
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>
                这是杨辉三角的外边缘项（C({selectedCell.r}, {selectedCell.c}) = 1）。
                试着点击数阵<b>中间的任意数字</b>，查看它是如何由左肩和右肩相加得到的！
              </p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div
                  style={{
                    background: '#f1f5f9',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#334155',
                  }}
                >
                  <span style={{ color: '#4338ca' }}>{leftParentVal}</span> (左肩) +{' '}
                  <span style={{ color: '#4338ca' }}>{rightParentVal}</span> (右肩) ={' '}
                  <span style={{ color: '#4f46e5', fontSize: '18px' }}>{currentVal}</span> (脚底)
                </div>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  组合数公式：C({selectedCell.r - 1}, {selectedCell.c - 1}) + C({selectedCell.r - 1},{' '}
                  {selectedCell.c}) = C({selectedCell.r}, {selectedCell.c})
                </span>
              </div>
            )}
          </div>
        )}

        {mode === 'rowSum' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={18} color="#059669" />
              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>
                每一行的总和，恰好是 2 的次方！
              </span>
            </div>
            <p style={{ margin: '0 0 8px 0', color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
              观察右侧的每行求和：1, 2, 4, 8, 16, 32, 64, 128... 每一行总和都是上一行的整整 <b>2 倍</b>！
            </p>
            <div style={{ fontSize: '13px', color: '#047857', background: '#ecfdf5', padding: '8px 12px', borderRadius: '6px' }}>
              💡 <b>原理解密</b>：因为下一行的每个数都是上一行两肩相加生成的，上一行的每一个数字在下一行都正好被“左下”与“右下”使用了两次，因此总和必定翻倍！
            </div>
          </div>
        )}

        {mode === 'hockeyStick' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={18} color="#ea580c" />
              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>
                冰球杆恒等式（曲棍球棒定理 Hockey-stick Identity）
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                background: '#fff7ed',
                padding: '8px 16px',
                borderRadius: '8px',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#c2410c' }}>
                1 + 2 + 3 + 4 (杆身斜线) = 10 (球棒拐头)
              </span>
              <span style={{ fontSize: '13px', color: '#9a3412' }}>
                公式：C(1,1) + C(2,1) + C(3,1) + C(4,1) = C(5,2)
              </span>
            </div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
              从边缘的 1 出发沿任何斜线一路相加，末尾拐弯直角处的数字必定等于整条斜线上所有数字的总和！
            </p>
          </div>
        )}

        {mode === 'sierpinski' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={18} color="#db2777" />
              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>
                奇偶数染色的分形奇迹：谢尔宾斯基三角形
              </span>
            </div>
            <p style={{ margin: 0, color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
              粉色高亮为<b>奇数</b>，虚线框为<b>偶数</b>。当行数无限扩展时，奇数的倒三角孔洞会形成大名鼎鼎的自相似分形——谢尔宾斯基三角形（Sierpinski
              Triangle）！
            </p>
          </div>
        )}
      </div>

      {/* 控制条 */}
      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: '#f8fafc',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>展示层数 (4~8 行):</span>
          <input
            type="range"
            min={4}
            max={8}
            value={maxRows}
            onChange={(e) => setMaxRows(Number(e.target.value))}
            style={{ width: '120px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{maxRows} 行</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              setMode('shoulders');
              setSelectedCell({ r: 4, c: 2 });
            }}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            看 6 = 3 + 3
          </button>
          <button
            onClick={() => {
              setMode('shoulders');
              if (maxRows < 6) setMaxRows(6);
              setSelectedCell({ r: 5, c: 2 });
            }}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            看 10 = 4 + 6
          </button>
        </div>
      </div>
    </div>
  );
}
