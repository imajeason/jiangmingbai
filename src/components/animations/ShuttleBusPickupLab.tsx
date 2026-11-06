'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Bus, Sparkles, CheckCircle2, TrendingUp, RotateCcw, Clock } from 'lucide-react';

export default function ShuttleBusPickupLab() {
  const [busSpeed, setBusSpeed] = useState<number>(40); // 车速 km/h
  const [walkSpeed, setWalkSpeed] = useState<number>(8); // 人速 km/h
  const [totalDistance, setTotalDistance] = useState<number>(100); // 总路程 km

  // 速度比 k = v_车 / v_人
  const speedRatio = busSpeed / walkSpeed;

  // 徒步比例推导：(2S - 3x) / x = k  ==> 2S - 3x = kx ==> (k + 3)x = 2S ==> x = 2S / (k + 3)
  const walkRatio = 2 / (speedRatio + 3);
  const walkDist = totalDistance * walkRatio; // 每队徒步距离 x
  const rideDist = totalDistance - walkDist;  // 每队乘车距离 S - x

  // 关键坐标点
  const dropoffPointC = rideDist; // 甲队下车点
  const pickupPointD = walkDist;   // 乙队接应点

  // 时间计算
  const tBusToC = dropoffPointC / busSpeed; // 校车送甲队到 C 点时间
  const tWalkRest = walkDist / walkSpeed;   // 甲队下车后步行走完 x 的时间
  const totalTimeHours = tBusToC + tWalkRest; // 总到达时间

  // 相比全员纯步行的优化提速
  const pureWalkTimeHours = totalDistance / walkSpeed;
  const timeSavedHours = pureWalkTimeHours - totalTimeHours;

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Bus size={18} style={{ color: '#ea580c' }} />
          <span>行程与运筹大题：校车往返接送与人车同时到达</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${busSpeed === 40 && walkSpeed === 8 && totalDistance === 100 ? styles.controlBtnActive : ''}`}
            onClick={() => {
              setBusSpeed(40);
              setWalkSpeed(8);
              setTotalDistance(100);
            }}
          >
            华杯赛经典真题 (40/8/100)
          </button>
          <button
            className={`${styles.controlBtn} ${busSpeed === 50 && walkSpeed === 10 && totalDistance === 80 ? styles.controlBtnActive : ''}`}
            onClick={() => {
              setBusSpeed(50);
              setWalkSpeed(10);
              setTotalDistance(80);
            }}
          >
            近郊夏令营 (50/10/80)
          </button>
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
          {/* 最优对称理论卡 */}
          <div style={{
            width: '100%',
            background: '#fff7ed',
            padding: '12px 14px',
            borderRadius: '8px',
            borderLeft: '4px solid #ea580c',
            fontSize: '0.85rem',
            color: '#9a3412',
            lineHeight: 1.6
          }}>
            <strong>【两大铁律：同时到达 + 徒步对称】：</strong>
            <br />
            • 要想耗时最短，两队必须<strong>同时到达终点</strong>（绝无人提前闲等）；
            <br />
            • 两队徒步距离严格相等（各走 <strong>{walkDist.toFixed(1)} km</strong>），乘车距离严格相等（各坐 <strong>{rideDist.toFixed(1)} km</strong>）！
            <br />
            • 速度比 <strong>k = {busSpeed} ÷ {walkSpeed} = {speedRatio.toFixed(1)}</strong> ➔ 徒步占比为 <strong>2 / ({speedRatio.toFixed(1)} + 3) = {(walkRatio * 100).toFixed(1)}%</strong>！
          </div>

          {/* 时空折线图 SVG (Spacetime Diagram) */}
          <div style={{ marginTop: '16px', width: '100%', maxWidth: '480px' }}>
            <svg viewBox="0 0 460 220" style={{ width: '100%', height: 'auto', overflow: 'visible', background: '#fafaf9', borderRadius: '8px', border: '1px solid #e7e5e4' }}>
              {/* 坐标轴与背景网格 */}
              <line x1="50" y1="180" x2="420" y2="180" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="50" y1="30" x2="50" y2="180" stroke="#94a3b8" strokeWidth="1.5" />

              {/* 轴标签 */}
              <text x="430" y="184" fontSize="10" fontWeight="700" fill="#64748b">时间 t</text>
              <text x="50" y="20" fontSize="10" fontWeight="700" fill="#64748b" textAnchor="middle">路程 s (km)</text>

              {/* 刻度标记 */}
              <text x="42" y="184" fontSize="9" fill="#94a3b8" textAnchor="end">0</text>
              <text x="42" y="38" fontSize="9" fill="#94a3b8" textAnchor="end">{totalDistance}km</text>

              {/* 下车点 C 与 接应点 D 虚线 */}
              {(() => {
                const chartH = 150;
                const chartW = 340;
                const y0 = 180;
                const x0 = 50;

                const yC = y0 - (dropoffPointC / totalDistance) * chartH;
                const yD = y0 - (pickupPointD / totalDistance) * chartH;
                const yEnd = y0 - chartH;

                const tMeetD = (2 * dropoffPointC - pickupPointD) / busSpeed; // 校车掉头与乙队在D相遇时间

                const xC = x0 + (tBusToC / totalTimeHours) * chartW;
                const xD = x0 + (tMeetD / totalTimeHours) * chartW;
                const xEnd = x0 + chartW;

                return (
                  <g>
                    {/* 水平辅助虚线 */}
                    <line x1={x0} y1={yC} x2={xEnd} y2={yC} stroke="#cbd5e1" strokeDasharray="3 3" />
                    <text x="42" y={yC + 3} fontSize="8" fill="#2563eb" textAnchor="end">C:{dropoffPointC.toFixed(0)}</text>

                    <line x1={x0} y1={yD} x2={xEnd} y2={yD} stroke="#cbd5e1" strokeDasharray="3 3" />
                    <text x="42" y={yD + 3} fontSize="8" fill="#16a34a" textAnchor="end">D:{pickupPointD.toFixed(0)}</text>

                    {/* 校车行驶折线 (橙色虚线: 去程 -> 折返接乙 -> 冲向终点) */}
                    <polyline
                      points={`${x0},${y0} ${xC},${yC} ${xD},${yD} ${xEnd},${yEnd}`}
                      fill="none"
                      stroke="#ea580c"
                      strokeWidth="2.5"
                      strokeDasharray="5 3"
                    />

                    {/* 甲队轨迹 (蓝色实线: 乘车至C -> 徒步至终点) */}
                    <polyline
                      points={`${x0},${y0} ${xC},${yC} ${xEnd},${yEnd}`}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                    />

                    {/* 乙队轨迹 (绿色实线: 徒步至D -> 乘车至终点) */}
                    <polyline
                      points={`${x0},${y0} ${xD},${yD} ${xEnd},${yEnd}`}
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="2.5"
                    />

                    {/* 节点关键圆点 */}
                    <circle cx={xC} cy={yC} r="4" fill="#2563eb" />
                    <circle cx={xD} cy={yD} r="4" fill="#16a34a" />
                    <circle cx={xEnd} cy={yEnd} r="5" fill="#ea580c" />

                    <text x={xEnd} y={yEnd - 8} textAnchor="middle" fontSize="10" fontWeight="900" fill="#ea580c">
                      🎉 同时到达 ({totalTimeHours.toFixed(1)}h)
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* 图例 */}
          <div style={{ display: 'flex', gap: '14px', marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
            <span style={{ color: '#2563eb', fontWeight: 700 }}>━ 甲队轨迹 (先车后步)</span>
            <span style={{ color: '#16a34a', fontWeight: 700 }}>━ 乙队轨迹 (先步后车)</span>
            <span style={{ color: '#ea580c', fontWeight: 700 }}>┅ 校车轨迹 (去-返-去)</span>
          </div>

          {/* 实时数据看板 */}
          <div style={{
            marginTop: '14px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}>
            <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>下车点 C</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1d4ed8', marginTop: '2px' }}>
                {dropoffPointC.toFixed(1)} <span style={{ fontSize: '0.75rem' }}>km</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>甲队在此下车徒步</div>
            </div>

            <div style={{ background: '#ecfdf5', padding: '8px', borderRadius: '8px', border: '1px solid #a7f3d0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46' }}>接应点 D</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#047857', marginTop: '2px' }}>
                {pickupPointD.toFixed(1)} <span style={{ fontSize: '0.75rem' }}>km</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>校车折返在此接乙队</div>
            </div>

            <div style={{ background: '#fff7ed', padding: '8px', borderRadius: '8px', border: '1px solid #fed7aa', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c2410c' }}>全员最短总耗时</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ea580c', marginTop: '2px' }}>
                {totalTimeHours.toFixed(2)} <span style={{ fontSize: '0.75rem' }}>小时</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#15803d', fontWeight: 700 }}>
                比纯徒步省 {timeSavedHours.toFixed(1)}h
              </div>
            </div>
          </div>

          {/* 交互参数滑块控制 */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            background: '#ffffff',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
                <span>校车速度 v_车：</span>
                <span style={{ color: '#ea580c' }}>{busSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="30"
                max="60"
                step="2"
                value={busSpeed}
                onChange={(e) => setBusSpeed(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ea580c', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
                <span>学生步行速度 v_人：</span>
                <span style={{ color: '#059669' }}>{walkSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="5"
                max="12"
                step="1"
                value={walkSpeed}
                onChange={(e) => setWalkSpeed(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
                <span>全程总距离 S：</span>
                <span style={{ color: '#2563eb' }}>{totalDistance} km</span>
              </div>
              <input
                type="range"
                min="60"
                max="120"
                step="5"
                value={totalDistance}
                onChange={(e) => setTotalDistance(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

