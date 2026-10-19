'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';

type PlantingType = 'both' | 'one' | 'neither' | 'closed';
type LabMode = 'line' | 'hand' | 'variants' | 'quiz';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '一条长 100 米的小路，两旁从头到尾每隔 5 米栽一棵杨树（两端都栽），一共要栽多少棵树？',
    options: ['20 棵', '21 棵', '40 棵', '42 棵'],
    correctIndex: 3,
    explanation: '看清陷阱：① 一侧间隔数 = 100 ÷ 5 = 20 个；② 两端都栽，一侧棵数 = 20 + 1 = 21 棵；③ 题目说了“两旁”，所以总数 = 21 × 2 = 42 棵！'
  },
  {
    id: 2,
    question: '把一根木头锯成 5 段，每锯一次需要 3 分钟，全部锯完一共需要多少分钟？',
    options: ['15 分钟', '12 分钟', '18 分钟', '9 分钟'],
    correctIndex: 1,
    explanation: '锯木头属于“两端都不锯”的间隔模型！锯成 5 段只需要锯 5 - 1 = 4 次。总用时 = 4 × 3 = 12 分钟。千万别拿 5 × 3 = 15 分钟！'
  },
  {
    id: 3,
    question: '大钟 5 点敲响 5 下，用时 8 秒。那么 10 点敲响 10 下，需要多少秒？',
    options: ['16 秒', '18 秒', '20 秒', '24 秒'],
    correctIndex: 1,
    explanation: '敲钟算的是“响声之间的间隔”！敲 5 下有 5 - 1 = 4 个间隔，每个间隔 = 8 ÷ 4 = 2 秒；敲 10 下有 10 - 1 = 9 个间隔，用时 = 9 × 2 = 18 秒！'
  }
];

export default function TreePlantingLab() {
  const [labMode, setLabMode] = useState<LabMode>('line');
  const [plantType, setPlantType] = useState<PlantingType>('both');

  // 直线道路参数 (m)
  const [roadLength, setRoadLength] = useState(40); // 40米
  const [gapDistance, setGapDistance] = useState(10); // 10米

  // 生活变体模式选择
  const [variant, setVariant] = useState<'saw' | 'stair' | 'bell'>('saw');

  // 测验
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // 计算树与间隔
  const intervalCount = Math.floor(roadLength / gapDistance);
  let treeCount = intervalCount;
  if (plantType === 'both') treeCount = intervalCount + 1;
  else if (plantType === 'neither') treeCount = Math.max(0, intervalCount - 1);
  else if (plantType === 'one' || plantType === 'closed') treeCount = intervalCount;

  const currentQ = QUIZ_QUESTIONS[quizIndex];

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.titleBadge}>
          <span className={styles.badgeIcon}>🌲🖐️</span>
          <span className={styles.badgeText}>四年级数学广角 · 经典间隔模型</span>
        </div>
        <h2 className={styles.labTitle}>植树问题：加 1 还是减 1？伸出手指看指缝！</h2>
        <p className={styles.labSubtitle}>
          告别抓阄！用“5根手指4个缝”一秒看穿两端都栽、只栽一端、两端不栽与锯木头爬楼梯的生活本质。
        </p>
      </div>

      {/* 主模式切换 */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          className={labMode === 'line' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => setLabMode('line')}
        >
          🛣️ 模式一：直线路段栽树实验
        </button>
        <button
          className={labMode === 'hand' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => setLabMode('hand')}
        >
          🖐️ 模式二：手指与指缝秘密武器
        </button>
        <button
          className={labMode === 'variants' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => setLabMode('variants')}
        >
          🪵 模式三：锯木头·爬楼梯·敲钟声
        </button>
        <button
          className={labMode === 'quiz' ? styles.primaryBtn : styles.secondaryBtn}
          onClick={() => setLabMode('quiz')}
        >
          🎯 模式四：经典陷阱大闯关
        </button>
      </div>

      {/* 模式一：直线路段栽树 */}
      {labMode === 'line' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          {/* 类型胶囊 */}
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <button
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1.5px solid',
                borderColor: plantType === 'both' ? '#16a34a' : '#cbd5e1',
                background: plantType === 'both' ? '#dcfce7' : '#fff',
                color: plantType === 'both' ? '#15803d' : '#475569',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              onClick={() => setPlantType('both')}
            >
              🌳 类型 A：两端都栽 (+1)
            </button>
            <button
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1.5px solid',
                borderColor: plantType === 'one' ? '#2563eb' : '#cbd5e1',
                background: plantType === 'one' ? '#eff6ff' : '#fff',
                color: plantType === 'one' ? '#1d4ed8' : '#475569',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              onClick={() => setPlantType('one')}
            >
              🏠 类型 B：只栽一端 (不加不减)
            </button>
            <button
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1.5px solid',
                borderColor: plantType === 'neither' ? '#d97706' : '#cbd5e1',
                background: plantType === 'neither' ? '#fef3c7' : '#fff',
                color: plantType === 'neither' ? '#b45309' : '#475569',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              onClick={() => setPlantType('neither')}
            >
              🚪 类型 C：两端都不栽 (-1)
            </button>
            <button
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1.5px solid',
                borderColor: plantType === 'closed' ? '#9333ea' : '#cbd5e1',
                background: plantType === 'closed' ? '#f3e8ff' : '#fff',
                color: plantType === 'closed' ? '#7e22ce' : '#475569',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              onClick={() => setPlantType('closed')}
            >
              🔄 类型 D：封闭环形 (等同只栽一端)
            </button>
          </div>

          {/* 尺寸滑块 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>📏 道路总长</span>
                <span style={{ fontWeight: 800, color: '#2563eb' }}>{roadLength} 米</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="10"
                value={roadLength}
                onChange={(e) => setRoadLength(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2563eb' }}
              />
            </div>

            <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>🌲 株距 (间隔距离)</span>
                <span style={{ fontWeight: 800, color: '#16a34a' }}>{gapDistance} 米</span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="5"
                value={gapDistance}
                onChange={(e) => setGapDistance(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#16a34a' }}
              />
            </div>
          </div>

          {/* SVG 道路实景 */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1rem', overflowX: 'auto', marginBottom: '1.25rem' }}>
            <svg viewBox="0 0 760 210" style={{ width: '100%', minWidth: '600px', display: 'block' }}>
              {plantType !== 'closed' ? (
                /* 直线道路渲染 */
                <>
                  {/* 地面草坪与公路 */}
                  <rect x="40" y="80" width="680" height="40" rx="4" fill="#64748b" />
                  <line x1="40" y1="100" x2="720" y2="100" stroke="#facc15" strokeWidth="1.5" strokeDasharray="12 8" />

                  {/* 间隔区间色块标注 */}
                  {Array.from({ length: intervalCount }).map((_, idx) => {
                    const stepW = 680 / intervalCount;
                    const x = 40 + idx * stepW;
                    return (
                      <g key={idx}>
                        {/* 间隔虚线 */}
                        <line x1={x} y1="70" x2={x} y2="130" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                        {/* 间隔标签 */}
                        <rect x={x + 4} y="135" width={stepW - 8} height="22" rx="4" fill="#f1f5f9" stroke="#94a3b8" />
                        <text x={x + stepW / 2} y="150" fontSize="11" fontWeight="bold" fill="#475569" textAnchor="middle">
                          第 {idx + 1} 个间隔 ({gapDistance}m)
                        </text>
                      </g>
                    );
                  })}
                  <line x1="720" y1="70" x2="720" y2="130" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />

                  {/* 两头标志建筑（如果是两端不栽或只栽一端） */}
                  {plantType === 'one' && (
                    <g transform="translate(710, 60)">
                      <rect x="0" y="0" width="30" height="60" fill="#f87171" rx="4" />
                      <text x="15" y="35" fontSize="10" fill="#fff" fontWeight="bold" textAnchor="middle">房子</text>
                    </g>
                  )}
                  {plantType === 'neither' && (
                    <>
                      <g transform="translate(15, 60)">
                        <rect x="0" y="0" width="30" height="60" fill="#f87171" rx="4" />
                        <text x="15" y="35" fontSize="10" fill="#fff" fontWeight="bold" textAnchor="middle">大门</text>
                      </g>
                      <g transform="translate(715, 60)">
                        <rect x="0" y="0" width="30" height="60" fill="#f87171" rx="4" />
                        <text x="15" y="35" fontSize="10" fill="#fff" fontWeight="bold" textAnchor="middle">学校</text>
                      </g>
                    </>
                  )}

                  {/* 植树位置点 */}
                  {Array.from({ length: intervalCount + 1 }).map((_, idx) => {
                    const stepW = 680 / intervalCount;
                    const x = 40 + idx * stepW;

                    // 判断该点是否栽树
                    let shouldPlant = true;
                    if (plantType === 'one' && idx === intervalCount) shouldPlant = false;
                    if (plantType === 'neither' && (idx === 0 || idx === intervalCount)) shouldPlant = false;

                    if (!shouldPlant) return null;

                    return (
                      <g key={idx} transform={`translate(${x}, 72)`}>
                        {/* 树干 */}
                        <rect x="-3" y="0" width="6" height="20" fill="#78350f" />
                        {/* 绿树冠 */}
                        <circle cx="0" cy="-8" r="14" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
                        <circle cx="-5" cy="-12" r="8" fill="#22c55e" />
                        {/* 树序号 */}
                        <text x="0" y="-28" fontSize="11" fontWeight="900" fill="#15803d" textAnchor="middle">
                          🌲{idx + 1}
                        </text>
                      </g>
                    );
                  })}

                  {/* 底部总长标注 */}
                  <line x1="40" y1="185" x2="720" y2="185" stroke="#475569" strokeWidth="1.5" />
                  <text x="380" y="200" fontSize="12" fontWeight="bold" fill="#0f172a" textAnchor="middle">
                    全长 L = {roadLength} 米 共有 {intervalCount} 个间隔
                  </text>
                </>
              ) : (
                /* 封闭环形湖边渲染 */
                <g transform="translate(380, 105)">
                  {/* 环形湖泊 */}
                  <circle cx="0" cy="0" r="70" fill="#bae6fd" stroke="#0284c7" strokeWidth="12" />
                  <text x="0" y="5" fontSize="12" fontWeight="bold" fill="#0369a1" textAnchor="middle">湖泊 (封闭环形)</text>

                  {/* 环形树 */}
                  {Array.from({ length: intervalCount }).map((_, idx) => {
                    const angle = (idx * 2 * Math.PI) / intervalCount - Math.PI / 2;
                    const r = 70;
                    const tx = r * Math.cos(angle);
                    const ty = r * Math.sin(angle);
                    return (
                      <g key={idx} transform={`translate(${tx}, ${ty})`}>
                        <circle cx="0" cy="0" r="10" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
                        <text x="0" y="3" fontSize="9" fontWeight="bold" fill="#fff" textAnchor="middle">
                          {idx + 1}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>
          </div>

          {/* 实时公式推导看板 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #cbd5e1' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, marginBottom: '0.3rem' }}>
                第一步：先算间隔数 (缝隙数)
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#2563eb' }}>
                间隔数 = 全长 ÷ 株距
              </div>
              <div style={{ fontSize: '1rem', color: '#1e40af', fontWeight: 700, marginTop: '0.3rem' }}>
                = {roadLength} ÷ {gapDistance} = <span style={{ color: '#ef4444' }}>{intervalCount} 个间隔</span>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #cbd5e1' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, marginBottom: '0.3rem' }}>
                第二步：根据栽法确定棵数
              </div>
              {plantType === 'both' && (
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#16a34a' }}>
                    棵数 = 间隔数 + 1
                  </div>
                  <div style={{ fontSize: '1rem', color: '#15803d', fontWeight: 700, marginTop: '0.3rem' }}>
                    = {intervalCount} + 1 = <strong>{treeCount} 棵树</strong> (两头都有树，树比缝多1)
                  </div>
                </div>
              )}
              {plantType === 'one' && (
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#2563eb' }}>
                    棵数 = 间隔数
                  </div>
                  <div style={{ fontSize: '1rem', color: '#1d4ed8', fontWeight: 700, marginTop: '0.3rem' }}>
                    = {intervalCount} = <strong>{treeCount} 棵树</strong> (一树一间隔，一一配对)
                  </div>
                </div>
              )}
              {plantType === 'neither' && (
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#d97706' }}>
                    棵数 = 间隔数 - 1
                  </div>
                  <div style={{ fontSize: '1rem', color: '#b45309', fontWeight: 700, marginTop: '0.3rem' }}>
                    = {intervalCount} - 1 = <strong>{treeCount} 棵树</strong> (两头不能栽，树比缝少1)
                  </div>
                </div>
              )}
              {plantType === 'closed' && (
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#9333ea' }}>
                    封闭环形：棵数 = 间隔数
                  </div>
                  <div style={{ fontSize: '1rem', color: '#7e22ce', fontWeight: 700, marginTop: '0.3rem' }}>
                    = {intervalCount} = <strong>{treeCount} 棵树</strong> (首尾相连成环，正好闭合)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 模式二：手指与指缝秘密武器 */}
      {labMode === 'hand' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.2rem' }}>
            🖐️ 考场上随身携带的作弊神器——你自己的手掌！
          </h3>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.92rem', color: '#64748b' }}>
            把手指当作【树】，手指之间的缝隙当作【间隔】。伸出手看一看：
          </p>

          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'inline-block', maxWidth: '420px', width: '100%', marginBottom: '1.25rem' }}>
            <svg viewBox="0 0 320 220" style={{ width: '100%', display: 'block' }}>
              {/* 卡通手掌 */}
              {/* 手掌基座 */}
              <path d="M 60 170 C 60 140 80 120 160 120 C 240 120 260 140 260 170 Z" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
              
              {/* 5 根手指 (从大拇指到小拇指) */}
              {/* 大拇指 1 */}
              <rect x="70" y="60" width="22" height="75" rx="11" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
              <text x="81" y="50" fontSize="12" fontWeight="bold" fill="#15803d" textAnchor="middle">🌲1</text>

              {/* 食指 2 */}
              <rect x="105" y="25" width="22" height="100" rx="11" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
              <text x="116" y="15" fontSize="12" fontWeight="bold" fill="#15803d" textAnchor="middle">🌲2</text>

              {/* 中指 3 */}
              <rect x="145" y="15" width="22" height="110" rx="11" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
              <text x="156" y="5" fontSize="12" fontWeight="bold" fill="#15803d" textAnchor="middle">🌲3</text>

              {/* 无名指 4 */}
              <rect x="185" y="28" width="22" height="98" rx="11" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
              <text x="196" y="18" fontSize="12" fontWeight="bold" fill="#15803d" textAnchor="middle">🌲4</text>

              {/* 小拇指 5 */}
              <rect x="225" y="65" width="22" height="70" rx="11" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
              <text x="236" y="55" fontSize="12" fontWeight="bold" fill="#15803d" textAnchor="middle">🌲5</text>

              {/* 4 个指缝指示 */}
              <path d="M 94 95 L 103 95" stroke="#ef4444" strokeWidth="2" />
              <text x="98.5" y="115" fontSize="10" fontWeight="bold" fill="#dc2626" textAnchor="middle">缝1</text>

              <path d="M 132 80 L 140 80" stroke="#ef4444" strokeWidth="2" />
              <text x="136" y="100" fontSize="10" fontWeight="bold" fill="#dc2626" textAnchor="middle">缝2</text>

              <path d="M 172 80 L 180 80" stroke="#ef4444" strokeWidth="2" />
              <text x="176" y="100" fontSize="10" fontWeight="bold" fill="#dc2626" textAnchor="middle">缝3</text>

              <path d="M 212 95 L 220 95" stroke="#ef4444" strokeWidth="2" />
              <text x="216" y="115" fontSize="10" fontWeight="bold" fill="#dc2626" textAnchor="middle">缝4</text>
            </svg>
          </div>

          <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #bfdbfe', textAlign: 'left', maxWidth: '580px', margin: '0 auto' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1d4ed8', fontSize: '1.05rem' }}>
              💡 考场秒杀口诀：
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.92rem', color: '#1e40af', lineHeight: 1.7 }}>
              <li><strong>两端都栽（张开完整手掌）：</strong> 5 根手指、4 个指缝。手指比指缝多 1 $\rightarrow$ <strong>棵数 = 间隔 + 1</strong>！</li>
              <li><strong>两端都不栽（收起大拇指和小拇指）：</strong> 只剩中间 3 根手指，但依然有 4 个指缝。手指比指缝少 1 $\rightarrow$ <strong>棵数 = 间隔 - 1</strong>！</li>
              <li><strong>只栽一端（1根手指配1个缝）：</strong> 一对一配套 $\rightarrow$ <strong>棵数 = 间隔</strong>！</li>
            </ul>
          </div>
        </div>
      )}

      {/* 模式三：生活变形 */}
      {labMode === 'variants' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <button
              className={variant === 'saw' ? styles.primaryBtn : styles.secondaryBtn}
              onClick={() => setVariant('saw')}
            >
              🪵 锯木头问题
            </button>
            <button
              className={variant === 'stair' ? styles.primaryBtn : styles.secondaryBtn}
              onClick={() => setVariant('stair')}
            >
              🪜 爬楼梯问题
            </button>
            <button
              className={variant === 'bell' ? styles.primaryBtn : styles.secondaryBtn}
              onClick={() => setVariant('bell')}
            >
              🔔 敲钟声问题
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #cbd5e1', padding: '1.5rem', marginBottom: '1.25rem' }}>
            {variant === 'saw' && (
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#b45309', fontSize: '1.1rem' }}>
                  🪵 锯木头：锯成 5 段，需要锯几次？
                </h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>
                  木头的两头原本就是切好的，不需要锯！<strong>每一次下锯，只会多产生 1 个断口（指缝）</strong>。
                </p>
                {/* SVG 锯木头 */}
                <svg viewBox="0 0 500 100" style={{ width: '100%', maxWidth: '420px', display: 'block', margin: '0 auto 1rem' }}>
                  <rect x="20" y="35" width="460" height="30" rx="4" fill="#d97706" stroke="#78350f" strokeWidth="2" />
                  {/* 4 条锯线 */}
                  {[1, 2, 3, 4].map(idx => (
                    <g key={idx} transform={`translate(${20 + idx * 92}, 25)`}>
                      <line x1="0" y1="0" x2="0" y2="50" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 2" />
                      <text x="0" y="-5" fontSize="11" fontWeight="bold" fill="#dc2626" textAnchor="middle">
                        第{idx}刀 🔪
                      </text>
                    </g>
                  ))}
                </svg>
                <div style={{ background: '#fef3c7', padding: '0.85rem', borderRadius: '10px', fontWeight: 800, color: '#92400e', textAlign: 'center' }}>
                  锯木头本质：两端都不栽！下锯次数 = 段数 - 1 = 5 - 1 = 4 次！
                </div>
              </div>
            )}

            {variant === 'stair' && (
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1d4ed8', fontSize: '1.1rem' }}>
                  🪜 爬楼梯：从 1 楼爬到 5 楼，到底爬了几层？
                </h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>
                  1 楼是在地面上，根本不需要爬！只有从 1 楼到 2 楼才爬了第 1 阶楼梯。
                </p>
                <div style={{ background: '#eff6ff', padding: '0.85rem', borderRadius: '10px', fontWeight: 800, color: '#1e3a8a', textAlign: 'center' }}>
                  爬楼梯本质：只栽一端！爬的楼梯段数 = 目标楼层 - 1 = 5 - 1 = 4 层！
                </div>
              </div>
            )}

            {variant === 'bell' && (
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#7e22ce', fontSize: '1.1rem' }}>
                  🔔 敲钟声：敲 5 下用了 8 秒，敲 10 下用几秒？
                </h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>
                  第一声敲下去是不占时间的，<strong>时间花在敲完一下到下一下之间的“等待停顿（间隔）”</strong>！
                </p>
                <div style={{ background: '#f3e8ff', padding: '0.85rem', borderRadius: '10px', fontWeight: 800, color: '#6b21a8', textAlign: 'center' }}>
                  敲钟本质：敲 5 下只有 4 个停顿 (8÷4=2秒/个)；敲 10 下有 9 个停顿 (9×2=18秒)！
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 模式四：真题闯关 */}
      {labMode === 'quiz' && (
        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
              第 {quizIndex + 1} / {QUIZ_QUESTIONS.length} 题 · 间隔问题大闯关
            </span>
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #cbd5e1', marginBottom: '1.25rem' }}>
            <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.6 }}>
              {currentQ.question}
            </p>
          </div>

          {/* 选项组 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              let btnStyle: React.CSSProperties = {
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                background: '#fff',
                fontSize: '0.95rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s'
              };
              if (isSelected) {
                btnStyle.borderColor = '#2563eb';
                btnStyle.background = '#eff6ff';
                btnStyle.color = '#1d4ed8';
              }
              if (quizSubmitted) {
                if (idx === currentQ.correctIndex) {
                  btnStyle.borderColor = '#16a34a';
                  btnStyle.background = '#f0fdf4';
                  btnStyle.color = '#15803d';
                } else if (isSelected && idx !== currentQ.correctIndex) {
                  btnStyle.borderColor = '#dc2626';
                  btnStyle.background = '#fef2f2';
                  btnStyle.color = '#b91c1c';
                }
              }

              return (
                <button
                  key={idx}
                  style={btnStyle}
                  disabled={quizSubmitted}
                  onClick={() => setSelectedOpt(idx)}
                >
                  {String.fromCharCode(65 + idx)}. {opt}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            {!quizSubmitted ? (
              <button
                className={styles.primaryBtn}
                onClick={() => setQuizSubmitted(true)}
                disabled={selectedOpt === null}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                确认提交
              </button>
            ) : (
              <button
                className={styles.primaryBtn}
                onClick={() => {
                  setSelectedOpt(null);
                  setQuizSubmitted(false);
                  setQuizIndex((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
                }}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                下一题 ➔
              </button>
            )}
          </div>

          {/* 解析 */}
          {quizSubmitted && (
            <div style={{
              background: selectedOpt === currentQ.correctIndex ? '#f0fdf4' : '#fef2f2',
              borderRadius: '12px',
              padding: '1.25rem',
              border: `1px solid ${selectedOpt === currentQ.correctIndex ? '#86efac' : '#fca5a5'}`,
              marginTop: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>{selectedOpt === currentQ.correctIndex ? '🎉' : '❌'}</span>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: selectedOpt === currentQ.correctIndex ? '#15803d' : '#b91c1c' }}>
                  {selectedOpt === currentQ.correctIndex ? '完全正确！' : '做错了，看看这个关键陷阱：'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: selectedOpt === currentQ.correctIndex ? '#166534' : '#991b1b', lineHeight: 1.6 }}>
                {currentQ.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
