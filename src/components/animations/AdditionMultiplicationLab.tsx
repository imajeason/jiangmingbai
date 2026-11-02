'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type PrincipleMode = 'compare' | 'burger' | 'coloring';

export default function AdditionMultiplicationLab() {
  const [mode, setMode] = useState<PrincipleMode>('compare');

  // Mode 2: 汉堡套餐组合参数
  const [burgerCount, setBurgerCount] = useState<number>(3); // 主食种数 (2~4)
  const [drinkCount, setDrinkCount] = useState<number>(2); // 饮料种数 (2~3)
  const [snackCount, setSnackCount] = useState<number>(2); // 小食种数 (1~3)

  const totalCombos = burgerCount * drinkCount * snackCount;

  // Mode 3: 地图染色参数 (A, B, C, D 4个区域，3种或4种颜色)
  const [colorNum, setColorNum] = useState<number>(4);

  // 地图染色算理：A区4种，B与A不同3种，C与A、B不同2种，D与A、C不同2种
  const mapWays = colorNum === 4 ? 4 * 3 * 2 * 2 : 3 * 2 * 1 * 1;

  return (
    <div className={styles.labContainer}>
      {/* 顶部模式切换 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <button
          className={`${styles.stepButton} ${mode === 'compare' ? styles.active : ''}`}
          onClick={() => setMode('compare')}
        >
          ⚖️ 分类加法 vs 分步乘法核心对比
        </button>
        <button
          className={`${styles.stepButton} ${mode === 'burger' ? styles.active : ''}`}
          onClick={() => setMode('burger')}
        >
          🍔 套餐搭配生成器（乘法连乘树）
        </button>
        <button
          className={`${styles.stepButton} ${mode === 'coloring' ? styles.active : ''}`}
          onClick={() => setMode('coloring')}
        >
          🎨 地图染色（小升初实战抉择）
        </button>
      </div>

      {/* 启发说明条 */}
      <div style={{ background: '#fdf4ff', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #c026d3', marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, color: '#a21caf', fontSize: '0.95rem' }}>
          💡 判定口诀：“分类互斥，一步搞定用加法；分步连环，缺一不可用乘法！”
        </div>
        <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
          做题第一问自己：“选了这个方法，事情做完了吗？”做完了就是【分类加法】；还没做完、还要继续选下一步，就是【分步乘法】！
        </div>
      </div>

      {/* MODE 1: 加乘对比 */}
      {mode === 'compare' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* 左侧：加法原理 (分类) */}
            <div style={{ background: '#eff6ff', border: '2px solid #3b82f6', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>➕</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e40af' }}>加法原理（分类计数）</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#1d4ed8', fontWeight: 700, marginBottom: '10px' }}>
                核心标志：独立成事，非此即彼，任选一个就通关！
              </div>
              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                <strong>生活原型：从北京到上海出差</strong><br />
                • 高铁：有 3 趟班次可选<br />
                • 飞机：有 2 趟航班可选<br />
                • 驾车：有 1 条高速可选<br />
                只要坐上一趟，就能独立到达上海！<br />
                <span style={{ color: '#2563eb', fontWeight: 900, fontSize: '1.05rem', display: 'block', marginTop: '6px' }}>
                  总方法数 = 3 + 2 + 1 = 6 种！
                </span>
              </div>
            </div>

            {/* 右侧：乘法原理 (分步) */}
            <div style={{ background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>✖️</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803d' }}>乘法原理（分步计数）</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700, marginBottom: '10px' }}>
                核心标志：环环相扣，缺一不可，每步选完才算完！
              </div>
              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                <strong>生活原型：出门穿衣服搭配</strong><br />
                • 上衣：有 3 件可选（短袖、衬衫、毛衣）<br />
                • 裤子：有 2 条可选（牛仔裤、运动裤）<br />
                出门必须既穿上衣又穿裤子，分两步！<br />
                每件上衣都可以配 2 条裤子：<br />
                <span style={{ color: '#16a34a', fontWeight: 900, fontSize: '1.05rem', display: 'block', marginTop: '6px' }}>
                  总方法数 = 3 × 2 = 6 种搭配！
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: 汉堡套餐组合生成器 */}
      {mode === 'burger' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          {/* 总计结果展示 */}
          <div style={{ textAlign: 'center', marginBottom: '20px', padding: '16px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
            <div style={{ fontSize: '0.9rem', color: '#92400e', fontWeight: 700 }}>套餐组合总数计算：</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#b45309', margin: '6px 0' }}>
              {burgerCount} (主食) × {drinkCount} (饮料) × {snackCount} (小食) = <span style={{ color: '#ea580c' }}>{totalCombos} 种不同搭配！</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#78350f' }}>
              分三步完成：第一步选主食，第二步选饮料，第三步选小食，每一步互不排斥，必须连乘！
            </div>
          </div>

          {/* 交互调控滑块 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '520px', margin: '0 auto 20px auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                🍔 第 1 步：主食汉堡种数 ({burgerCount} 种)
              </span>
              <input
                type="range"
                min="2"
                max="4"
                value={burgerCount}
                onChange={(e) => setBurgerCount(Number(e.target.value))}
                style={{ width: '160px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                🥤 第 2 步：饮料品类种数 ({drinkCount} 种)
              </span>
              <input
                type="range"
                min="2"
                max="3"
                value={drinkCount}
                onChange={(e) => setDrinkCount(Number(e.target.value))}
                style={{ width: '160px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                🍟 第 3 步：休闲小食种数 ({snackCount} 种)
              </span>
              <input
                type="range"
                min="1"
                max="3"
                value={snackCount}
                onChange={(e) => setSnackCount(Number(e.target.value))}
                style={{ width: '160px', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* 阵列小标签展示 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '160px', overflowY: 'auto', padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            {Array.from({ length: totalCombos }).map((_, i) => (
              <span key={i} style={{ fontSize: '0.72rem', background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', color: '#475569' }}>
                套餐 #{i + 1}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* MODE 3: 地图染色问题 */}
      {mode === 'coloring' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', marginBottom: '6px' }}>
              🎨 经典奥数大题：相邻区域不能涂同一种颜色，有几种涂法？
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
              假设有一块由 A、B、C、D 四个相邻格子组成的小地图（A 与 B、C 相邻；B 与 A、C、D 相邻；C 与 A、B、D 相邻）。<br />
              我们用【分步乘法原理】分四步涂色：
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>选用可选颜色数量：</span>
            {[
              { num: 4, label: '4 种颜色可用 (红/黄/蓝/绿)' },
              { num: 3, label: '3 种颜色可用 (极限挑战)' },
            ].map((item) => (
              <button
                key={item.num}
                onClick={() => setColorNum(item.num)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: colorNum === item.num ? 800 : 500,
                  border: colorNum === item.num ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                  background: colorNum === item.num ? '#faf5ff' : '#ffffff',
                  color: colorNum === item.num ? '#6b21a8' : '#334155',
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ background: '#faf5ff', padding: '16px', borderRadius: '10px', border: '1px solid #e9d5ff' }}>
            <div style={{ fontSize: '0.9rem', color: '#6b21a8', lineHeight: 1.7 }}>
              {colorNum === 4 ? (
                <>
                  ① <strong>涂 A 区</strong>：4 种颜色任意选，有 <strong>4 种</strong>；<br />
                  ② <strong>涂 B 区</strong>：不能和 A 同色，剩下 <strong>3 种</strong>；<br />
                  ③ <strong>涂 C 区</strong>：既不能和 A 同色，也不能和 B 同色，剩下 <strong>2 种</strong>；<br />
                  ④ <strong>涂 D 区</strong>：只和 B、C 相邻，剩下 <strong>2 种</strong>（可与 A 相同）；<br />
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#7c3aed', display: 'block', marginTop: '6px' }}>
                    总涂色方法 = 4 × 3 × 2 × 2 = {mapWays} 种！
                  </span>
                </>
              ) : (
                <>
                  ① <strong>涂 A 区</strong>：3 种颜色可选，有 <strong>3 种</strong>；<br />
                  ② <strong>涂 B 区</strong>：剩下 <strong>2 种</strong>；<br />
                  ③ <strong>涂 C 区</strong>：剩下 <strong>1 种</strong>；<br />
                  ④ <strong>涂 D 区</strong>：剩下 <strong>1 种</strong>；<br />
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#7c3aed', display: 'block', marginTop: '6px' }}>
                    总涂色方法 = 3 × 2 × 1 × 1 = {mapWays} 种！
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

