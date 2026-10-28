'use client';

import React, { useState, useMemo } from 'react';
import styles from '@/styles/animations.module.css';

export default function ArithmeticProgressionLab() {
  const [a1, setA1] = useState<number>(1); // 首项
  const [d, setD] = useState<number>(1);  // 公差
  const [n, setN] = useState<number>(6);  // 项数 (3 ~ 10)
  const [viewMode, setViewMode] = useState<'rainbow' | 'pairBlock'>('pairBlock');
  const [isCombined, setIsCombined] = useState<boolean>(true); // 是否两副积木拼合成大长方形

  // 计算数列项：a_k = a_1 + (k - 1) * d
  const series = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < n; i++) {
      list.push(a1 + i * d);
    }
    return list;
  }, [a1, d, n]);

  const an = series[series.length - 1]; // 末项
  const pairSum = a1 + an;              // 首尾和
  const totalSum = (pairSum * n) / 2;   // 总和

  return (
    <div className={styles.container} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 头部标题 */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', color: '#1e293b' }}>
          🧮 等差数列与高斯求和：倒序相加与阶梯拼图
        </h3>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>
          为什么求和公式一定要“除以 2”？项数公式为什么一定要“加 1”？看懂两副阶梯积木合体的几何奇迹！
        </p>
      </div>

      {/* 动态可视化主舞台 */}
      <div
        style={{
          width: '100%',
          minHeight: '370px',
          background: 'radial-gradient(circle at 50% 50%, #f8fafc 0%, #edf2f7 100%)',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          padding: '24px 18px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        {viewMode === 'pairBlock' ? (
          /* ================= 视角 1：双积木倒扣拼合大长方形 ================= */
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569', marginBottom: '14px' }}>
              {isCombined
                ? `🧩 两副阶梯积木紧密咬合，化身为宽 ${n}、长 (${a1} + ${an} = ${pairSum}) 的标准大长方形！`
                : `两副完全相同的阶梯积木：蓝色为原数列，红色为倒序数列`}
            </div>

            {/* 阶梯积木绘制区 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '16px 20px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '2px solid #cbd5e1',
                boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
              }}
            >
              {series.map((val, rowIdx) => {
                const invertedVal = series[n - 1 - rowIdx]; // 倒序配对值
                const unitWidth = Math.min(24, Math.floor(400 / pairSum)); // 自适应方块宽度

                return (
                  <div
                    key={rowIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: isCombined ? '0px' : '20px',
                      transition: 'gap 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  >
                    {/* 左侧行号 */}
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', width: '38px', textAlign: 'right' }}>
                      第{rowIdx + 1}行:
                    </span>

                    {/* 蓝色正向积木排 */}
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: val }).map((_, bIdx) => (
                        <div
                          key={`blue-${bIdx}`}
                          style={{
                            width: `${unitWidth}px`,
                            height: '22px',
                            background: '#3b82f6',
                            borderRadius: '3px',
                            border: '1px solid #1d4ed8',
                            boxSizing: 'border-box',
                          }}
                        />
                      ))}
                    </div>

                    {/* 红色倒序拼合积木排 */}
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: invertedVal }).map((_, rIdx) => (
                        <div
                          key={`red-${rIdx}`}
                          style={{
                            width: `${unitWidth}px`,
                            height: '22px',
                            background: '#f87171',
                            borderRadius: '3px',
                            border: '1px solid #dc2626',
                            boxSizing: 'border-box',
                          }}
                        />
                      ))}
                    </div>

                    {/* 单行总和标注 */}
                    <span
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#1e293b',
                        marginLeft: '8px',
                        background: '#f1f5f9',
                        padding: '1px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {val} + {invertedVal} = {val + invertedVal}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 几何大长方形面积说明 */}
            <div
              style={{
                marginTop: '16px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                fontSize: '0.92rem',
                color: '#1e3a8a',
                textAlign: 'center',
              }}
            >
              大长方形总积木数 = 长 × 宽 = ({a1} + {an}) × {n} = <strong>{pairSum * n} 块</strong>。<br />
              蓝色原数列只有一半，所以必须<strong>除以 2</strong>：
              <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '1.05rem', marginLeft: '6px' }}>
                {pairSum * n} ÷ 2 = {totalSum}
              </span>
            </div>
          </div>
        ) : (
          /* ================= 视角 2：小高斯彩虹对对碰（首尾对称求和） ================= */
          <div style={{ width: '100%', maxWidth: '720px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '20px' }}>
              🌈 高斯配对法：首项与末项拉手、第2项与倒数第2项拉手，每一对的和完全相等！
            </div>

            {/* 数列数字卡片行 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '28px',
              }}
            >
              {series.map((val, idx) => {
                const pairIndex = n - 1 - idx;
                const isLeftHalf = idx < Math.floor(n / 2);
                const isCenter = n % 2 === 1 && idx === Math.floor(n / 2);

                return (
                  <div
                    key={idx}
                    style={{
                      minWidth: '50px',
                      height: '62px',
                      borderRadius: '12px',
                      background: isCenter ? '#fef08a' : '#ffffff',
                      border: `2px solid ${isCenter ? '#ca8a04' : '#3b82f6'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>#{idx + 1}</span>
                    <strong style={{ fontSize: '1.25rem', color: isCenter ? '#854d0e' : '#1e3a8a' }}>
                      {val}
                    </strong>
                  </div>
                );
              })}
            </div>

            {/* 配对汇总卡片 */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                padding: '16px',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                配对分析：
              </div>
              <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.7 }}>
                • 每一对首尾和：{a1} + {an} = <strong style={{ color: '#2563eb' }}>{pairSum}</strong><br />
                • 能够配成多少对：{n} 项 ÷ 2 = <strong style={{ color: '#16a34a' }}>{n / 2} 对</strong>
                {n % 2 === 1 && (
                  <span style={{ color: '#ca8a04', marginLeft: '6px' }}>
                    （中间单出中位数 {series[Math.floor(n / 2)]}，正好等于半对！）
                  </span>
                )}
                <br />
                • 数列总和 = {pairSum} × {n / 2} ={' '}
                <strong style={{ color: '#dc2626', fontSize: '1.1rem' }}>{totalSum}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 紧贴画布的控制区 (严格遵循黄金近邻与弹性换行原则) */}
      <div
        style={{
          marginTop: '16px',
          background: '#ffffff',
          borderRadius: '14px',
          padding: '16px 18px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        {/* 第一行：视觉模式与拼合按钮 */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingBottom: '14px',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#334155' }}>
              👁️ 透视角度：
            </span>
            <button
              onClick={() => setViewMode('pairBlock')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: viewMode === 'pairBlock' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: viewMode === 'pairBlock' ? '#eff6ff' : '#ffffff',
                color: viewMode === 'pairBlock' ? '#1d4ed8' : '#475569',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
              }}
            >
              🧩 几何积木拼图 (为什么除以2)
            </button>
            <button
              onClick={() => setViewMode('rainbow')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: viewMode === 'rainbow' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: viewMode === 'rainbow' ? '#eff6ff' : '#ffffff',
                color: viewMode === 'rainbow' ? '#1d4ed8' : '#475569',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
              }}
            >
              🌈 高斯配对法则 (首尾拉手)
            </button>
          </div>

          {viewMode === 'pairBlock' && (
            <button
              onClick={() => setIsCombined(!isCombined)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #2563eb',
                background: isCombined ? '#2563eb' : '#ffffff',
                color: isCombined ? '#ffffff' : '#2563eb',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              {isCombined ? '🔓 拆开两副积木' : '🔒 咬合拼成大长方形'}
            </button>
          )}
        </div>

        {/* 第二行：滑块调节与典型预设 */}
        <div
          style={{
            marginTop: '14px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* 项数 n 调节 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>项数 (n):</span>
            <input
              type="range"
              min="3"
              max="9"
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              style={{ accentColor: '#2563eb', cursor: 'pointer', width: '90px' }}
            />
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2563eb', minWidth: '24px' }}>
              {n}
            </span>
          </div>

          {/* 首项 a1 调节 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>首项 (a1):</span>
            <input
              type="range"
              min="1"
              max="5"
              value={a1}
              onChange={(e) => setA1(Number(e.target.value))}
              style={{ accentColor: '#2563eb', cursor: 'pointer', width: '80px' }}
            />
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2563eb', minWidth: '24px' }}>
              {a1}
            </span>
          </div>

          {/* 公差 d 调节 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>公差 (d):</span>
            <input
              type="range"
              min="1"
              max="4"
              value={d}
              onChange={(e) => setD(Number(e.target.value))}
              style={{ accentColor: '#2563eb', cursor: 'pointer', width: '80px' }}
            />
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2563eb', minWidth: '24px' }}>
              {d}
            </span>
          </div>

          {/* 预设典型数列 */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setA1(1);
                setD(1);
                setN(6);
              }}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              自然数 1~6
            </button>
            <button
              onClick={() => {
                setA1(1);
                setD(2);
                setN(5);
              }}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              连续奇数 1~9
            </button>
            <button
              onClick={() => {
                setA1(2);
                setD(2);
                setN(6);
              }}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              连续偶数 2~12
            </button>
          </div>
        </div>
      </div>

      {/* 算理与公式精粹对照卡片 */}
      <div
        style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.98rem', marginBottom: '6px' }}>
            📐 为什么项数公式要“加 1”？
          </div>
          <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6 }}>
            项数 = (末项 - 首项) ÷ 公差 + 1<br />
            本质是<strong>植树问题的两端都栽模型</strong>：从首项到末项共有 (末项 - 首项) ÷ 公差 个<strong>间隔（指缝）</strong>，要求包含头尾所有数字（树），必须把第 1 项自己加上！
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.98rem', marginBottom: '6px' }}>
            ✂️ 为什么求和公式要“除以 2”？
          </div>
          <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6 }}>
            求和 = (首项 + 末项) × 项数 ÷ 2<br />
            将两份一模一样的阶梯积木倒扣拼合，刚好构成一个长为 (首项+末项)、宽为项数的大长方形（这也是梯形面积公式 S = (a+b)h÷2 的几何来源），求单份必须<strong>除以 2</strong>！
          </div>
        </div>
      </div>
    </div>
  );
}
