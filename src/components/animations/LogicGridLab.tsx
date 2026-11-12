'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Sparkles, RotateCcw, Check, X, HelpCircle, CheckCircle2 } from 'lucide-react';

type CellValue = '' | '✓' | '✗';

export default function LogicGridLab() {
  // 人物: 0:小明, 1:小华, 2:小强
  const people = ['小明', '小华', '小强'];
  // 衣服颜色: 0:红, 1:蓝, 2:绿
  const colors = ['红衣', '蓝衣', '绿衣'];
  // 宠物: 0:猫, 1:狗, 2:鸟
  const pets = ['养猫', '养狗', '养鸟'];

  // 网格状态：people vs colors (3x3), people vs pets (3x3)
  const [gridColor, setGridColor] = useState<CellValue[][]>([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);

  const [gridPet, setGridPet] = useState<CellValue[][]>([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);

  // 点击单元格循环切换：空 -> ✓ -> ✗ -> 空
  const toggleCell = (
    grid: 'color' | 'pet',
    row: number,
    col: number
  ) => {
    const currentVal = grid === 'color' ? gridColor[row][col] : gridPet[row][col];
    let nextVal: CellValue = '';
    if (currentVal === '') nextVal = '✓';
    else if (currentVal === '✓') nextVal = '✗';
    else nextVal = '';

    if (grid === 'color') {
      const newG = gridColor.map((r) => [...r]);
      newG[row][col] = nextVal;
      // 若设为 ✓，自动对同行同列其余格设为 ✗ (十字排他律)
      if (nextVal === '✓') {
        for (let c = 0; c < 3; c++) if (c !== col && newG[row][c] === '') newG[row][c] = '✗';
        for (let r = 0; r < 3; r++) if (r !== row && newG[r][col] === '') newG[r][col] = '✗';
      }
      setGridColor(newG);
    } else {
      const newG = gridPet.map((r) => [...r]);
      newG[row][col] = nextVal;
      if (nextVal === '✓') {
        for (let c = 0; c < 3; c++) if (c !== col && newG[row][c] === '') newG[row][c] = '✗';
        for (let r = 0; r < 3; r++) if (r !== row && newG[r][col] === '') newG[r][col] = '✗';
      }
      setGridPet(newG);
    }
  };

  // 重置网格
  const resetGrid = () => {
    setGridColor([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
    setGridPet([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
  };

  // 一键正确答案 (供学习对比)
  // 正确答案：
  // 小明: 红衣, 养狗 (小明不喜欢绿且养狗穿红)
  // 小华: 蓝衣, 养猫 (小华养猫，穿剩下蓝衣)
  // 小强: 绿衣, 养鸟 (小强穿绿，养剩下鸟)
  const fillSolution = () => {
    setGridColor([
      ['✓', '✗', '✗'],
      ['✗', '✓', '✗'],
      ['✗', '✗', '✓'],
    ]);
    setGridPet([
      ['✗', '✓', '✗'],
      ['✓', '✗', '✗'],
      ['✗', '✗', '✓'],
    ]);
  };

  // 检查是否完成并正确
  const isSolved =
    gridColor[0][0] === '✓' &&
    gridColor[1][1] === '✓' &&
    gridColor[2][2] === '✓' &&
    gridPet[0][1] === '✓' &&
    gridPet[1][0] === '✓' &&
    gridPet[2][2] === '✓';

  return (
    <div className={styles.container}>
      {/* 标题栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            逻辑网格与交叉排除推导实验室
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            爱因斯坦谜题同款解法：打勾（✓）即行排他与列排他，打叉（✗）链式消除
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fillSolution}
            className="px-3 py-1.5 text-xs font-semibold rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100"
          >
            显示标准答案
          </button>
          <button
            onClick={resetGrid}
            className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg border border-slate-200 dark:border-slate-700"
            title="清空格子"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 线索列表 */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-indigo-500" /> 侦探线索档案（请根据线索在下方网格点击填入 ✓ 或 ✗）：
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            📌 线索 1：<strong>小明不养猫</strong>，且<strong>不喜欢绿色</strong>。
          </div>
          <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            📌 线索 2：<strong>养狗的人穿红衣服</strong>。
          </div>
          <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            📌 线索 3：<strong>小强穿绿衣服</strong>。
          </div>
          <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            📌 线索 4：<strong>小华养猫</strong>。
          </div>
        </div>
      </div>

      {/* 双网格联合互动面板 */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-6 flex flex-col items-center overflow-x-auto">
        <div className="min-w-[480px]">
          {/* 表头：衣服颜色 与 宠物类别 */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs mb-1">
            <div className="col-span-1 p-2 text-slate-400">人物</div>
            <div className="col-span-3 p-1.5 bg-indigo-950/60 text-indigo-400 rounded-t border border-indigo-900/60">
              衣服颜色
            </div>
            <div className="col-span-3 p-1.5 bg-emerald-950/60 text-emerald-400 rounded-t border border-emerald-900/60">
              饲养宠物
            </div>
          </div>

          {/* 子表头 */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-1">
            <div className="col-span-1"></div>
            {colors.map((c) => (
              <div key={c} className="p-1 font-medium bg-slate-800/80 rounded">{c}</div>
            ))}
            {pets.map((p) => (
              <div key={p} className="p-1 font-medium bg-slate-800/80 rounded">{p}</div>
            ))}
          </div>

          {/* 行数据：三位人物 */}
          {people.map((person, rIdx) => (
            <div key={person} className="grid grid-cols-7 gap-1 items-center mb-1">
              {/* 人物名 */}
              <div className="p-2.5 text-center font-bold text-xs bg-slate-800 text-slate-200 rounded">
                {person}
              </div>

              {/* 颜色属性 3 格 */}
              {colors.map((_, cIdx) => {
                const val = gridColor[rIdx][cIdx];
                return (
                  <button
                    key={`c-${rIdx}-${cIdx}`}
                    onClick={() => toggleCell('color', rIdx, cIdx)}
                    className={`h-11 rounded text-sm font-black transition-all flex items-center justify-center border ${
                      val === '✓'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-inner'
                        : val === '✗'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-slate-800/40 text-slate-600 border-slate-700/60 hover:bg-slate-700/50'
                    }`}
                  >
                    {val}
                  </button>
                );
              })}

              {/* 宠物属性 3 格 */}
              {pets.map((_, pIdx) => {
                const val = gridPet[rIdx][pIdx];
                return (
                  <button
                    key={`p-${rIdx}-${pIdx}`}
                    onClick={() => toggleCell('pet', rIdx, pIdx)}
                    className={`h-11 rounded text-sm font-black transition-all flex items-center justify-center border ${
                      val === '✓'
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-inner'
                        : val === '✗'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-slate-800/40 text-slate-600 border-slate-700/60 hover:bg-slate-700/50'
                    }`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* 提示说明 */}
        <div className="mt-4 text-xs text-slate-400 flex items-center gap-3">
          <span>💡 点击单元格切换状态：<strong>空</strong> $\to$ <strong>✓ (是)</strong> $\to$ <strong>✗ (否)</strong></span>
          <span>(标 ✓ 时会自动触发十字排他律)</span>
        </div>
      </div>

      {/* 状态与成果反馈 */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-500">当前推理状态</span>
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {isSolved ? (
              <span className="text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" /> 完美破案！所有人物与属性完全契合！
              </span>
            ) : (
              <span className="text-slate-600 dark:text-slate-300">
                尚未完全解出，请根据四条线索继续排除或点击“显示标准答案”学习。
              </span>
            )}
          </div>
        </div>

        {isSolved && (
          <div className="flex gap-2 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              小明：红衣 + 养狗
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              小华：蓝衣 + 养猫
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              小强：绿衣 + 养鸟
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

