'use client';

import React, { useState, useMemo } from 'react';
import styles from '@/styles/animations.module.css';

export default function PigeonholePrincipleLab() {
  const [mode, setMode] = useState<'pigeons' | 'worstCase'>('pigeons');

  // 模式1：鸽巢均分参数
  const [pigeonCount, setPigeonCount] = useState<number>(5);
  const [holeCount, setHoleCount] = useState<number>(4);
  const [distribution, setDistribution] = useState<number[]>([]);
  const [isEvenlyDistributed, setIsEvenlyDistributed] = useState<boolean>(true);

  // 模式2：最不利原则（盲盒摸球）参数
  // 3种颜色球：红 6, 蓝 4, 黄 3
  const [targetType, setTargetType] = useState<'sameColor' | 'diffColor'>('sameColor');
  const [drawnCount, setDrawnCount] = useState<number>(0);

  // 计算除法与商、余数
  const quotient = Math.floor(pigeonCount / holeCount);
  const remainder = pigeonCount % holeCount;
  const atLeastCount = remainder === 0 ? quotient : quotient + 1;

  // 动态均匀分配计算
  const holesData = useMemo(() => {
    const arr = new Array(holeCount).fill(0);
    if (isEvenlyDistributed) {
      for (let i = 0; i < pigeonCount; i++) {
        arr[i % holeCount]++;
      }
    } else if (distribution.length === holeCount) {
      return distribution;
    } else {
      // 随机分配
      arr[0] = pigeonCount;
    }
    return arr;
  }, [pigeonCount, holeCount, isEvenlyDistributed, distribution]);

  // 最大笼子里的鸽子数
  const maxInHole = Math.max(...holesData);

  // 模式2球池配置
  const ballsConfig = {
    red: 6,
    blue: 4,
    yellow: 3,
  };
  const totalBalls = ballsConfig.red + ballsConfig.blue + ballsConfig.yellow; // 13

  // 最不利情况计算
  // 目标1：保证有 2 个同色球。最不利：每种颜色各摸 1 个（3个），再摸 1 个必同色 = 3 + 1 = 4个
  // 目标2：保证有 2 个不同色球。最不利：把数量最多的一种颜色（红6）全摸光，再摸1个必不同色 = 6 + 1 = 7个
  const threshold = targetType === 'sameColor' ? 3 + 1 : 6 + 1;
  const isGuaranteed = drawnCount >= threshold;

  return (
    <div className={styles.container} style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* 头部标题 */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', color: '#1e293b' }}>
          🕊️ 抽屉原理（鸽巢原理）：最不利原则与必胜把握
        </h3>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>
          5 只鸽子飞进 4 个笼子，为什么<span style={{ fontWeight: 700, color: '#2563eb' }}>至少有 1 个笼子至少有 2 只鸽子</span>？透视均分模型与倒霉蛋思维！
        </p>
      </div>

      {/* 动态可视化主舞台 */}
      <div
        style={{
          width: '100%',
          minHeight: '360px',
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
        {mode === 'pigeons' ? (
          /* ================= 模式1：鸽巢分布图 ================= */
          <div style={{ width: '100%', maxWidth: '780px' }}>
            {/* 上部：鸽群展示 */}
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                待分配的鸽子总数（物体数 m = {pigeonCount}）：
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {Array.from({ length: pigeonCount }).map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      border: '2px solid #3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      boxShadow: '0 2px 6px rgba(59, 130, 246, 0.25)',
                      animation: 'bounce 0.5s ease',
                    }}
                  >
                    🕊️
                  </div>
                ))}
              </div>
            </div>

            {/* 下部：笼子网格 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${holeCount}, 1fr)`,
                gap: '12px',
                marginTop: '12px',
              }}
            >
              {holesData.map((count, holeIdx) => {
                const isOverCrowded = count >= atLeastCount && count > 0;
                return (
                  <div
                    key={holeIdx}
                    style={{
                      background: isOverCrowded ? '#eff6ff' : '#ffffff',
                      border: `2px ${isOverCrowded ? 'solid #2563eb' : 'dashed #cbd5e1'}`,
                      borderRadius: '12px',
                      padding: '12px 8px',
                      minHeight: '150px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                      boxShadow: isOverCrowded ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {/* 笼子标签 */}
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                      笼子 #{holeIdx + 1}
                    </div>

                    {/* 笼子内的鸽子 */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '6px',
                        flex: 1,
                        alignItems: 'center',
                      }}
                    >
                      {Array.from({ length: count }).map((_, pIdx) => (
                        <span
                          key={pIdx}
                          style={{
                            fontSize: '22px',
                            display: 'inline-block',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                          }}
                        >
                          🕊️
                        </span>
                      ))}
                      {count === 0 && (
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>（空空如也）</span>
                      )}
                    </div>

                    {/* 计数底栏 */}
                    <div
                      style={{
                        marginTop: '8px',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        background: isOverCrowded ? '#2563eb' : '#f1f5f9',
                        color: isOverCrowded ? '#ffffff' : '#475569',
                      }}
                    >
                      {count} 只
                      {isOverCrowded && ' 👑'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 结论动态横幅 */}
            <div
              style={{
                marginTop: '18px',
                padding: '10px 16px',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <span style={{ color: '#1e3a8a', fontSize: '0.92rem', fontWeight: 600 }}>
                💡 算理推导：{pigeonCount} ÷ {holeCount} = {quotient} (商) ... {remainder} (余数)
              </span>
              <span style={{ color: '#15803d', fontSize: '0.94rem', fontWeight: 800 }}>
                必有至少 1 个笼子 ≥ {atLeastCount} 只鸽子！(当前最大: {maxInHole}只)
              </span>
            </div>
          </div>
        ) : (
          /* ================= 模式2：最不利原则（盲盒摸球） ================= */
          <div style={{ width: '100%', maxWidth: '780px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
              🎁 盲盒摸球箱（红球 6 个、蓝球 4 个、黄球 3 个，共 13 个）
            </div>

            {/* 球箱视觉 */}
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #94a3b8',
                borderRadius: '16px',
                padding: '16px',
                maxWidth: '480px',
                margin: '0 auto 16px auto',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px' }}>🔴</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626' }}>红球: 6个</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px' }}>🔵</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb' }}>蓝球: 4个</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px' }}>🟡</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ca8a04' }}>黄球: 3个</div>
              </div>
            </div>

            {/* 当前摸球状态展示 */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '8px' }}>
                已摸出球数: <strong style={{ fontSize: '1.2rem', color: '#2563eb' }}>{drawnCount}</strong> / 13
              </div>

              {/* 模拟最不利摸出的序列 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  minHeight: '44px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {Array.from({ length: drawnCount }).map((_, idx) => {
                  let ballColor = '🔴';
                  if (targetType === 'sameColor') {
                    // 最不利顺序：红、蓝、黄，然后第4个撞车红
                    const colors = ['🔴', '🔵', '🟡', '🔴', '🔵', '🟡'];
                    ballColor = colors[idx] || '🔴';
                  } else {
                    // 保证不同色：最不利把红色摸光（6个），第7个摸出蓝
                    ballColor = idx < 6 ? '🔴' : '🔵';
                  }
                  return (
                    <div
                      key={idx}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        border: '2px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                      }}
                    >
                      {ballColor}
                    </div>
                  );
                })}
                {drawnCount === 0 && (
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>点击下方“摸 1 个”开始倒霉蛋推演</span>
                )}
              </div>
            </div>

            {/* 达标状态徽章 */}
            <div
              style={{
                display: 'inline-block',
                padding: '8px 20px',
                borderRadius: '20px',
                background: isGuaranteed ? '#dcfce7' : '#fee2e2',
                border: `2px solid ${isGuaranteed ? '#16a34a' : '#ef4444'}`,
                color: isGuaranteed ? '#15803d' : '#b91c1c',
                fontWeight: 800,
                fontSize: '0.96rem',
              }}
            >
              {isGuaranteed
                ? `🎉 100% 绝对保证！已达到阈值 (${threshold} 个)`
                : `⚠️ 运气最差时仍可能不满足（还需摸 ${threshold - drawnCount} 个才能 100% 保证）`}
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
        {/* 第一行：主模式切换 */}
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
              🕹️ 实验视角：
            </span>
            <button
              onClick={() => setMode('pigeons')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: mode === 'pigeons' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: mode === 'pigeons' ? '#eff6ff' : '#ffffff',
                color: mode === 'pigeons' ? '#1d4ed8' : '#475569',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
              }}
            >
              🕊️ 鸽巢分配模型 (算理除法)
            </button>
            <button
              onClick={() => setMode('worstCase')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: mode === 'worstCase' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: mode === 'worstCase' ? '#eff6ff' : '#ffffff',
                color: mode === 'worstCase' ? '#1d4ed8' : '#475569',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
              }}
            >
              🎲 最不利原则 (摸球倒霉蛋)
            </button>
          </div>
        </div>

        {/* 第二行：参数调节区 */}
        {mode === 'pigeons' ? (
          <div
            style={{
              marginTop: '14px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {/* 鸽子数调节 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>鸽子数:</span>
              <input
                type="range"
                min="2"
                max="12"
                value={pigeonCount}
                onChange={(e) => setPigeonCount(Number(e.target.value))}
                style={{ accentColor: '#2563eb', cursor: 'pointer', width: '100px' }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2563eb', minWidth: '24px' }}>
                {pigeonCount}
              </span>
            </div>

            {/* 笼子数调节 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>笼子数:</span>
              <input
                type="range"
                min="2"
                max="6"
                value={holeCount}
                onChange={(e) => setHoleCount(Number(e.target.value))}
                style={{ accentColor: '#2563eb', cursor: 'pointer', width: '90px' }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2563eb', minWidth: '24px' }}>
                {holeCount}
              </span>
            </div>

            {/* 预设经典场景 */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setPigeonCount(5);
                  setHoleCount(4);
                  setIsEvenlyDistributed(true);
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
                5鸽4笼 (课本经典)
              </button>
              <button
                onClick={() => {
                  setPigeonCount(7);
                  setHoleCount(3);
                  setIsEvenlyDistributed(true);
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
                7鸽3笼 (商2余1)
              </button>
              <button
                onClick={() => {
                  setPigeonCount(8);
                  setHoleCount(4);
                  setIsEvenlyDistributed(true);
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
                8鸽4笼 (整除余0)
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              marginTop: '14px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            {/* 目标切换 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>挑战目标：</span>
              <button
                onClick={() => {
                  setTargetType('sameColor');
                  setDrawnCount(0);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  border: targetType === 'sameColor' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: targetType === 'sameColor' ? '#eff6ff' : '#ffffff',
                  color: targetType === 'sameColor' ? '#1d4ed8' : '#334155',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                目标 A：至少 2 个同色球 (阈值: 4个)
              </button>
              <button
                onClick={() => {
                  setTargetType('diffColor');
                  setDrawnCount(0);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  border: targetType === 'diffColor' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: targetType === 'diffColor' ? '#eff6ff' : '#ffffff',
                  color: targetType === 'diffColor' ? '#1d4ed8' : '#334155',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                目标 B：至少 2 个不同色球 (阈值: 7个)
              </button>
            </div>

            {/* 摸球操作按钮组 */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setDrawnCount((prev) => Math.min(totalBalls, prev + 1))}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid #2563eb',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                👉 摸 1 个球
              </button>
              <button
                onClick={() => setDrawnCount(threshold)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #16a34a',
                  background: '#f0fdf4',
                  color: '#15803d',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                ⚡ 一键达到必胜阈值 ({threshold}个)
              </button>
              <button
                onClick={() => setDrawnCount(0)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                🔄 放回重置
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 核心算理提炼卡片 */}
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
            📌 算式核心：除法商与余数
          </div>
          <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6 }}>
            物体数 m ÷ 抽屉数 n = 商 q ... 余数 r：<br />
            - 若有余数（r &gt; 0），至少有一个抽屉有 <strong>q + 1</strong> 个；<br />
            - 若能整除（r = 0），至少有一个抽屉有 <strong>q</strong> 个。
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
            🎯 考场绝招：倒霉蛋原则
          </div>
          <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6 }}>
            问“至少取多少个<strong>才能保证</strong>满足条件”时：<br />
            把自己想象成世界上最倒霉的人，先经历所有<strong>最不利情况</strong>，在此基础上 <strong>+ 1</strong>，即可 100% 稳赢！
          </div>
        </div>
      </div>
    </div>
  );
}
