'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/animations.module.css';
import { Bus, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

export default function BusDispatchIntervalLab() {
  // 题目参数
  const [tChase, setTChase] = useState<number>(6); // 背后追上时间间隔 (分钟)
  const [tMeet, setTMeet] = useState<number>(3); // 迎面相遇时间间隔 (分钟)

  // 严格要求 tChase > tMeet (追及相对速度小，耗时必然更长)
  const safeTChase = Math.max(tChase, tMeet + 1);

  // 计算速度比与发车间隔
  // 速度差 / 速度和 = tMeet / safeTChase
  // vBus : vPerson = (safeTChase + tMeet) : (safeTChase - tMeet)
  const speedRatio = (safeTChase + tMeet) / (safeTChase - tMeet);
  // 真实发车时间 (倍率调和平均)
  const trueDispatchT = (2 * safeTChase * tMeet) / (safeTChase + tMeet);

  // 动画时间模拟
  const [simTime, setSimTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const step = () => {
        setSimTime((prev) => (prev + 0.05) % 36); // 36分钟大循环
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // SVG 道路模拟
  // 设定人速度 = 10, 车速度 = 10 * speedRatio
  const vPerson = 15;
  const vBus = vPerson * speedRatio;
  const busDist = vBus * trueDispatchT; // 前后两车间距

  // 行人在道路中心 x = 300 处
  // 背后的车向东开 (从左向右)，对面的车向西开 (从右向左)
  const personPos = (vPerson * simTime) % 600;

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bus className={styles.icon} />
          <h2 className={styles.title}>公共汽车发车间隔问题实验室</h2>
        </div>
        <p className={styles.description}>
          背后追上一辆、迎面开来一辆！抓住前后两车“车距恒定不变量”，揭秘车速人速比例与发车间隔调和公式。
        </p>
      </div>

      {/* 参数滑块与快速预设 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginBottom: '16px',
          background: '#f8fafc',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
            背后追上间隔 t_追: <span style={{ color: '#4f46e5' }}>{safeTChase} 分钟</span>
          </div>
          <input
            type="range"
            min="4"
            max="12"
            value={safeTChase}
            onChange={(e) => setTChase(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
            迎面相遇间隔 t_迎: <span style={{ color: '#ea580c' }}>{tMeet} 分钟</span>
          </div>
          <input
            type="range"
            min="2"
            max="5"
            value={tMeet}
            onChange={(e) => setTMeet(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              setTChase(6);
              setTMeet(3);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            经典题目 (6分 / 3分)
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: isPlaying ? '#f59e0b' : '#4f46e5',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? '暂停' : '播放'}
          </button>
        </div>
      </div>

      {/* 动态街道仿真画布 */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          padding: '20px 16px',
          border: '1px solid #e2e8f0',
          position: 'relative',
          overflowX: 'auto',
        }}
      >
        <svg width="700" height="200" viewBox="0 0 700 200" style={{ width: '100%', minWidth: '600px' }}>
          {/* 双向马路道路背景 */}
          <rect x="20" y="40" width="660" height="120" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
          {/* 道路中心黄色虚线 */}
          <line x1="20" y1="100" x2="680" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="12,8" />

          {/* 上半车道：反向迎面开来的公交车 (向西 ⬅️) */}
          {[-1, 0, 1, 2, 3].map((idx) => {
            const rawX = 680 - ((simTime * vBus * 0.8 + idx * 160) % 800);
            return (
              <g key={`opp-${idx}`} transform={`translate(${rawX}, 55)`}>
                <rect x="0" y="0" width="46" height="26" rx="4" fill="#ea580c" />
                <rect x="6" y="5" width="12" height="12" rx="2" fill="#ffedd5" />
                <rect x="24" y="5" width="16" height="12" rx="2" fill="#ffedd5" />
                <text x="23" y="15" fontSize="8" fill="#ffffff" fontWeight="bold" textAnchor="middle">
                  🚌 ⬅️
                </text>
              </g>
            );
          })}

          {/* 下半车道：同向追及公交车 (向东 ➡️) */}
          {[-1, 0, 1, 2, 3].map((idx) => {
            const rawX = ((simTime * vBus * 0.8 + idx * 160) % 800) - 50;
            return (
              <g key={`chase-${idx}`} transform={`translate(${rawX}, 115)`}>
                <rect x="0" y="0" width="46" height="26" rx="4" fill="#4f46e5" />
                <rect x="6" y="5" width="16" height="12" rx="2" fill="#e0e7ff" />
                <rect x="28" y="5" width="12" height="12" rx="2" fill="#e0e7ff" />
                <text x="23" y="15" fontSize="8" fill="#ffffff" fontWeight="bold" textAnchor="middle">
                  ➡️ 🚌
                </text>
              </g>
            );
          })}

          {/* 行人小明 (人行道上匀速向前步行 🚶‍♂️) */}
          <g transform={`translate(${200 + personPos * 0.4}, 90)`}>
            <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#059669" strokeWidth="2" />
            <text x="0" y="4" fontSize="14" textAnchor="middle">
              🚶‍♂️
            </text>
            <text x="0" y="24" fontSize="10" fill="#059669" fontWeight="bold" textAnchor="middle">
              小明 (向前步行)
            </text>
          </g>
        </svg>

        {/* 核心不变量车距展示 */}
        <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
          💡 <b>车距守恒定律</b>：无论行人往哪个方向走，前后两辆公交车之间的空间距离永远是恒定值 S = v车 × T发车！
        </div>
      </div>

      {/* 推导公式与严谨计算结果卡片 */}
      <div
        style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px',
        }}
      >
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#4f46e5', marginBottom: '6px' }}>
            步骤一：由追及与相遇求速度比
          </div>
          <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
            <div>
              • 追及路程差：S = (v车 - v人) × {safeTChase} 分钟
            </div>
            <div>
              • 相遇路程和：S = (v车 + v人) × {tMeet} 分钟
            </div>
            <div style={{ marginTop: '4px', fontWeight: 700, color: '#1e293b' }}>
              车速是人速的：({safeTChase} + {tMeet}) ÷ ({safeTChase} - {tMeet}) ={' '}
              <span style={{ color: '#4f46e5', fontSize: '15px' }}>{speedRatio.toFixed(1)} 倍</span>
            </div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#059669', marginBottom: '6px' }}>
            步骤二：套用黄金调和发车公式
          </div>
          <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
            <div style={{ background: '#ecfdf5', padding: '6px 10px', borderRadius: '6px', fontWeight: 700, color: '#047857' }}>
              T = (2 × t追 × t迎) ÷ (t追 + t迎)
            </div>
            <div style={{ marginTop: '6px' }}>
              T = (2 × {safeTChase} × {tMeet}) ÷ ({safeTChase} + {tMeet}) ={' '}
              <span style={{ color: '#059669', fontSize: '16px', fontWeight: 800 }}>
                {trueDispatchT.toFixed(1)} 分钟
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              （绝不是直觉误区里的加权平均数 {(safeTChase + tMeet) / 2} 分钟！）
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

