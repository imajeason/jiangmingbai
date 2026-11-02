'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type MeetMode = 'step' | 'unfold' | 'challenge';

export default function RepeatedMeetingLab() {
  const [mode, setMode] = useState<MeetMode>('step');

  // 控制参数
  const [speedA, setSpeedA] = useState<number>(60); // 甲车速度 (km/h)
  const [speedB, setSpeedB] = useState<number>(40); // 乙车速度 (km/h)
  const totalS = 100; // 两地单程全程 100 km

  // 当前观察第几次相遇 (1, 2, 3)
  const [meetCount, setMeetCount] = useState<number>(2);

  // 计算派生值
  // 第 n 次相遇总路程 = (2n - 1) * totalS
  const totalSumDist = (2 * meetCount - 1) * totalS;
  const timeHours = totalSumDist / (speedA + speedB);
  const distA = Math.round(speedA * timeHours);
  const distB = Math.round(speedB * timeHours);

  // 第一次相遇时的数据 (基准 1 份)
  const baseTime = totalS / (speedA + speedB);
  const baseDistA = Math.round(speedA * baseTime);
  const baseDistB = Math.round(speedB * baseTime);

  // 挑战题状态
  const [chalChoice, setChalChoice] = useState<number | null>(null);
  const [chalSubmitted, setChalSubmitted] = useState<boolean>(false);

  return (
    <div className={styles.labContainer}>
      {/* 顶部模式切换 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <button
          className={`${styles.stepButton} ${mode === 'step' ? styles.active : ''}`}
          onClick={() => setMode('step')}
        >
          🚗 往返轨迹与多圈相遇演练
        </button>
        <button
          className={`${styles.stepButton} ${mode === 'unfold' ? styles.active : ''}`}
          onClick={() => setMode('unfold')}
        >
          📏 线段拉直（看透 1S, 3S, 5S 算理）
        </button>
        <button
          className={`${styles.stepButton} ${mode === 'challenge' ? styles.active : ''}`}
          onClick={() => {
            setMode('challenge');
            setChalSubmitted(false);
            setChalChoice(null);
          }}
        >
          🎯 小升初多次相遇实战
        </button>
      </div>

      {/* 启发说明条 */}
      <div style={{ background: '#eff6ff', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #2563eb', marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '0.95rem' }}>
          💡 多次相遇核心黄金律：“第 1 次相遇合走 1 个全程，之后每次相遇各掉头合走 2 个全程！”
        </div>
        <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
          第 n 次相遇总路程 = (2n - 1) × 全程 S！每辆车自身走过的路程，也必定严格等于它第一次所走路程的 (2n - 1) 倍！
        </div>
      </div>

      {/* MODE 1: 往返折返真实跑道 */}
      {mode === 'step' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          {/* 第几次相遇选择胶囊 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>切换相遇轮次：</span>
            {[
              { count: 1, label: '第 1 次相遇 (合走 1S)' },
              { count: 2, label: '第 2 次相遇 (合走 3S) ★必考' },
              { count: 3, label: '第 3 次相遇 (合走 5S)' },
            ].map((item) => (
              <button
                key={item.count}
                onClick={() => setMeetCount(item.count)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: meetCount === item.count ? 800 : 500,
                  border: meetCount === item.count ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: meetCount === item.count ? '#eff6ff' : '#ffffff',
                  color: meetCount === item.count ? '#1d4ed8' : '#334155',
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 跑道图示 */}
          <div style={{ background: '#f8fafc', padding: '24px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 800 }}>
              <span style={{ color: '#2563eb' }}>A 地 (甲出发点)</span>
              <span style={{ color: '#64748b' }}>全程 S = {totalS} km</span>
              <span style={{ color: '#ea580c' }}>B 地 (乙出发点)</span>
            </div>

            {/* 真实跑道模拟 */}
            <div style={{ position: 'relative', height: '48px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              {/* 甲车路程示意 */}
              <div
                style={{
                  position: 'absolute',
                  top: '6px',
                  left: '6px',
                  background: '#2563eb',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  zIndex: 2,
                }}
              >
                甲 (速度 {speedA}) 累计跑了 {distA} km
              </div>

              {/* 乙车路程示意 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  right: '6px',
                  background: '#ea580c',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  zIndex: 2,
                }}
              >
                乙 (速度 {speedB}) 累计跑了 {distB} km
              </div>
            </div>

            {/* 统计指标卡 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '16px' }}>
              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700 }}>两车合走总路程</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1d4ed8', margin: '4px 0' }}>
                  {2 * meetCount - 1} × S = {totalSumDist} km
                </div>
                <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>
                  是第 1 次的 {2 * meetCount - 1} 倍！
                </div>
              </div>

              <div style={{ background: '#fff7ed', padding: '12px', borderRadius: '8px', border: '1px solid #fed7aa', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 700 }}>甲单独走过的路程</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#c2410c', margin: '4px 0' }}>
                  {distA} km
                </div>
                <div style={{ fontSize: '0.75rem', color: '#ea580c' }}>
                  第 1 次 ({baseDistA} km) × {2 * meetCount - 1}
                </div>
              </div>

              <div style={{ background: '#fdf2f8', padding: '12px', borderRadius: '8px', border: '1px solid #fbcfe8', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#9d174d', fontWeight: 700 }}>乙单独走过的路程</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#be185d', margin: '4px 0' }}>
                  {distB} km
                </div>
                <div style={{ fontSize: '0.75rem', color: '#db2777' }}>
                  第 1 次 ({baseDistB} km) × {2 * meetCount - 1}
                </div>
              </div>
            </div>
          </div>

          {/* 黄金近邻控制滑块 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', minWidth: '120px' }}>
                甲车速度：{speedA} km/h
              </span>
              <input
                type="range"
                min="30"
                max="90"
                step="5"
                value={speedA}
                onChange={(e) => setSpeedA(Number(e.target.value))}
                style={{ width: '180px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', minWidth: '120px' }}>
                乙车速度：{speedB} km/h
              </span>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={speedB}
                onChange={(e) => setSpeedB(Number(e.target.value))}
                style={{ width: '180px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: 线段拉直对比算理 */}
      {mode === 'unfold' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', marginBottom: '14px' }}>
            📏 为什么是 1S ➔ 3S ➔ 5S？看拉直后的路程拆解：
          </div>

          {/* 1S 展开 */}
          <div style={{ marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              <span>① 第一次相遇：合走 1 个全程 (S)</span>
              <span style={{ color: '#2563eb' }}>总共 = 1S</span>
            </div>
            <div style={{ height: '22px', background: '#cbd5e1', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '60%', background: '#2563eb', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                甲 (S₁)
              </div>
              <div style={{ width: '40%', background: '#ea580c', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                乙
              </div>
            </div>
          </div>

          {/* 3S 展开 */}
          <div style={{ marginBottom: '16px', padding: '12px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, color: '#1e40af', marginBottom: '6px' }}>
              <span>② 第二次相遇：从第 1 次相遇到第 2 次相遇，两人背向各自掉头，合走了 2S！</span>
              <span style={{ color: '#1d4ed8' }}>累计总共 = 1S + 2S = 3S</span>
            </div>
            <div style={{ height: '22px', background: '#cbd5e1', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '33.3%', background: '#93c5fd', borderRight: '1px dashed #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#1e3a8a' }}>
                第 1 次 (1S)
              </div>
              <div style={{ width: '66.7%', background: '#3b82f6', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                各自掉头折返合跑 (2S)
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#1e40af', marginTop: '6px', fontWeight: 700 }}>
              结论：总时间是第 1 次的 3 倍，甲走的路程是第 1 次的 3 倍，乙走的路程也是第 1 次的 3 倍！
            </div>
          </div>

          {/* 5S 展开 */}
          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              <span>③ 第三次相遇：再各掉头合跑 2S</span>
              <span style={{ color: '#059669' }}>累计总共 = 3S + 2S = 5S</span>
            </div>
            <div style={{ height: '22px', background: '#cbd5e1', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '60%', background: '#93c5fd', borderRight: '1px dashed #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#1e3a8a' }}>
                前两次 (3S)
              </div>
              <div style={{ width: '40%', background: '#10b981', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                再次掉头合跑 (2S)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: 挑战模式 */}
      {mode === 'challenge' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ fontWeight: 800, color: '#b45309', fontSize: '1rem', marginBottom: '8px' }}>
              📝 小升初经典真题秒杀：
            </div>
            <div style={{ fontSize: '0.9rem', color: '#78350f', lineHeight: 1.6 }}>
              甲、乙两车同时从 A、B 两地相向而行，在距 A 地 <strong>40 千米</strong> 处第一次相遇。
              相遇后两车继续前进，各自到达目的地后立即折返，在距 B 地 <strong>20 千米</strong> 处第二次相遇。
              请问：A、B 两地的全程距离是多少千米？
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', margin: '20px 0' }}>
            {[80, 100, 120, 140].map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setChalChoice(opt);
                  setChalSubmitted(true);
                }}
                style={{
                  padding: '8px 24px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: chalChoice === opt ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: chalChoice === opt ? '#eff6ff' : '#ffffff',
                  color: chalChoice === opt ? '#1d4ed8' : '#334155',
                }}
              >
                {opt} 千米
              </button>
            ))}
          </div>

          {chalSubmitted && (
            <div style={{ padding: '14px', borderRadius: '8px', background: chalChoice === 100 ? '#dcfce7' : '#fee2e2', color: chalChoice === 100 ? '#166534' : '#991b1b', lineHeight: 1.6 }}>
              {chalChoice === 100 ? (
                <div>
                  <strong>🎉 恭喜回答完全正确！</strong><br />
                  秒杀破局法：<br />
                  ① 第一次相遇时，甲从 A 地出发走了 <strong>40 千米</strong>；<br />
                  ② 第二次相遇时，合走 3S，所以甲累计走了 <strong>40 × 3 = 120 千米</strong>；<br />
                  ③ 甲走完了一个全程加折返的 20 千米，所以：全程 S + 20 = 120 千米，得出 <strong>S = 100 千米</strong>！口算秒杀！
                </div>
              ) : (
                <div>
                  <strong>🤔 答案不正确。</strong><br />
                  提示：第二次相遇时，两车合走 3 个全程，甲走的路程也必然是第一次的 3 倍（40 × 3 = 120 千米）。甲到达 B 地折返了 20 千米，全程 = 120 - 20 千米！再试一次！
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

