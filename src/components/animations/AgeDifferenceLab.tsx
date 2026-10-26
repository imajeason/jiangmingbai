'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw, Sparkles, HelpCircle, CheckCircle2, ArrowRight, Lock, Users, Calendar } from 'lucide-react';
import styles from '@/styles/animations.module.css';

interface Preset {
  id: string;
  name: string;
  roleA: string;
  roleB: string;
  ageA: number; // 今年 A 年龄
  ageB: number; // 今年 B 年龄
  targetMultiple?: number;
  question: string;
  desc: string;
}

const PRESETS: Preset[] = [
  {
    id: 'future-mult',
    name: '题型一：几年后成倍数？',
    roleA: '爸爸',
    roleB: '小明',
    ageA: 32,
    ageB: 4,
    targetMultiple: 3,
    question: '爸爸今年 32 岁，小明今年 4 岁。几年后，爸爸的年龄是小明的 3 倍？',
    desc: '抓住年龄差 32 - 4 = 28 岁永远不变！3倍时差值对应 2 份。',
  },
  {
    id: 'past-mult',
    name: '题型二：几年前成倍数？',
    roleA: '妈妈',
    roleB: '小红',
    ageA: 36,
    ageB: 12,
    targetMultiple: 4,
    question: '妈妈今年 36 岁，小红今年 12 岁。几年前，妈妈的年龄是小红的 4 倍？',
    desc: '年龄差 36 - 12 = 24 岁永远不变！4倍时差值对应 3 份。',
  },
  {
    id: 'sum-diff',
    name: '题型三：年龄和与年龄差',
    roleA: '叔叔',
    roleB: '侄子',
    ageA: 37,
    ageB: 11,
    question: '叔叔和侄子年龄和是 48 岁，叔叔比侄子大 26 岁。两人今年各多少岁？',
    desc: '和差问题变形：(和 + 差) ÷ 2 = 较大者，(和 - 差) ÷ 2 = 较小者。',
  },
  {
    id: 'brothers',
    name: '题型四：兄弟相伴成长',
    roleA: '哥哥',
    roleB: '弟弟',
    ageA: 14,
    ageB: 8,
    targetMultiple: 2,
    question: '哥哥今年 14 岁，弟弟今年 8 岁。弟弟几岁时，哥哥正好是弟弟的 2 倍？',
    desc: '两兄弟永远相差 6 岁！2倍时哥哥2份弟弟1份，差值即为弟弟1份的岁数。',
  },
];

export default function AgeDifferenceLab() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('future-mult');
  
  // 基础数据
  const [roleA, setRoleA] = useState<string>('爸爸');
  const [roleB, setRoleB] = useState<string>('小明');
  const [baseAgeA, setBaseAgeA] = useState<number>(32);
  const [baseAgeB, setBaseAgeB] = useState<number>(4);

  // 时光偏移量 (年)：负数代表过去，正数代表未来
  const [yearOffset, setYearOffset] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const animRef = useRef<number | null>(null);

  // 观察模式：'timeline' (时光穿梭机) | 'deduction' (线段图差倍推演)
  const [activeTab, setActiveTab] = useState<'timeline' | 'deduction'>('timeline');

  // 当前年份状态
  const curAgeA = baseAgeA + yearOffset;
  const curAgeB = baseAgeB + yearOffset;
  const ageDiff = baseAgeA - baseAgeB; // 永远不变的恒定差值
  const currentRatio = curAgeB > 0 ? (curAgeA / curAgeB) : 0;
  const isExactRatio = curAgeB > 0 && curAgeA % curAgeB === 0;
  const exactMultiplier = isExactRatio ? curAgeA / curAgeB : null;

  // 目标几倍时的推算解
  const curPreset = PRESETS.find(p => p.id === selectedPresetId);
  const targetK = curPreset?.targetMultiple || 3;
  // 几倍时：B的年龄 = ageDiff / (k - 1)
  const targetAgeB = (targetK > 1 && ageDiff % (targetK - 1) === 0) ? ageDiff / (targetK - 1) : null;
  const targetYearOffset = targetAgeB !== null ? targetAgeB - baseAgeB : null;

  // 切换预设
  const handleSelectPreset = (p: Preset) => {
    setSelectedPresetId(p.id);
    setRoleA(p.roleA);
    setRoleB(p.roleB);
    setBaseAgeA(p.ageA);
    setBaseAgeB(p.ageB);
    setYearOffset(0);
    setIsPlaying(false);
  };

  // 播放动画自动巡航
  useEffect(() => {
    if (isPlaying) {
      animRef.current = window.setInterval(() => {
        setYearOffset(prev => {
          if (prev >= 20) {
            setIsPlaying(false);
            return 20;
          }
          return prev + 1;
        });
      }, 500);
    } else if (animRef.current) {
      clearInterval(animRef.current);
    }
    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [isPlaying]);

  const handleTogglePlay = () => {
    if (yearOffset >= 20) {
      setYearOffset(-5);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setYearOffset(0);
  };

  // SVG 线段图几何参数
  const maxDisplayAge = 60;
  const barMaxWidth = 420;
  const scale = barMaxWidth / maxDisplayAge; // px per year

  const barWidthA = Math.max(10, Math.min(barMaxWidth, curAgeA * scale));
  const barWidthB = Math.max(10, Math.min(barMaxWidth, curAgeB * scale));
  const diffWidth = barWidthA - barWidthB;

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Clock size={18} color="#2563eb" />
          <span>年龄问题实验室：永远不变的“年龄差”，看穿倍数变化</span>
        </div>
        <div className={styles.labControls}>
          <button
            className={`${styles.controlBtn} ${isPlaying ? styles.controlBtnActive : ''}`}
            onClick={handleTogglePlay}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? '暂停' : '时光巡航'}</span>
          </button>
          <button className={styles.controlBtn} onClick={handleReset}>
            <RotateCcw size={14} />
            <span>回到今年</span>
          </button>
        </div>
      </div>

      {/* 题型预设胶囊 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '12px 20px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          justifyContent: 'center',
        }}
      >
        {PRESETS.map((p) => {
          const isSelected = p.id === selectedPresetId;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className={`${styles.controlBtn} ${isSelected ? styles.controlBtnActive : ''}`}
              style={{ fontSize: '0.825rem' }}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      {/* 主展示区 */}
      <div className={styles.canvasWrapper} style={{ minHeight: '440px', padding: '24px 20px' }}>
        {/* 当前题型题目与提示 */}
        {curPreset && (
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              padding: '12px 18px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
              📝 经典考题：{curPreset.question}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              💡 关键突破口：{curPreset.desc}
            </div>
          </div>
        )}

        {/* 核心状态指示横幅：黄金锁定差值 */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 22px',
              borderRadius: '30px',
              background: exactMultiplier ? '#fef3c7' : '#eff6ff',
              color: exactMultiplier ? '#92400e' : '#1d4ed8',
              border: `2px solid ${exactMultiplier ? '#f59e0b' : '#93c5fd'}`,
              fontSize: '0.925rem',
              fontWeight: 800,
              boxShadow: exactMultiplier ? '0 4px 14px rgba(245, 158, 11, 0.25)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <Lock size={16} color={exactMultiplier ? '#d97706' : '#2563eb'} />
            <span>
              🔒 全宇宙恒定法则：两人的年龄差永远是{' '}
              <strong style={{ fontSize: '1.1rem', color: '#dc2626' }}>{ageDiff}</strong> 岁（无论过多少年都不变！）
            </span>
            {exactMultiplier && (
              <span style={{ background: '#f59e0b', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
                🎉 正好是整 {exactMultiplier} 倍！
              </span>
            )}
          </span>
        </div>

        {/* SVG 新加坡线段图与时光差值卡尺 */}
        <div
          style={{
            width: '100%',
            maxWidth: '680px',
            background: '#ffffff',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px 20px',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
          }}
        >
          {/* 时光机状态标头 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="#2563eb" />
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>
                {yearOffset === 0
                  ? '📅 当前：今年（基准时刻）'
                  : yearOffset > 0
                  ? `🚀 时光穿梭：${yearOffset} 年后（未来）`
                  : `⏪ 时光倒流：${Math.abs(yearOffset)} 年前（过去）`}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              倍数关系：<strong>{curAgeA} ÷ {curAgeB} ≈ {currentRatio.toFixed(2)} 倍</strong>
            </div>
          </div>

          <svg viewBox="0 0 640 230" width="100%" height="230" style={{ overflow: 'visible' }}>
            <defs>
              {/* 角色 A 科技蓝渐变 */}
              <linearGradient id="barGradA" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>

              {/* 角色 B 暖橙渐变 */}
              <linearGradient id="barGradB" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>

              {/* 金色差值卡尺纹理 */}
              <pattern id="caliperHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#f59e0b" strokeWidth="2.5" opacity="0.4" />
              </pattern>
            </defs>

            {/* 原点基准竖线 (岁数起点 0) */}
            <line x1="120" y1="20" x2="120" y2="190" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
            <text x="120" y="15" textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="700">0 岁</text>

            {/* 角色 A 线段条 */}
            <g transform="translate(120, 35)">
              {/* 名字标签 */}
              <text x="-15" y="24" textAnchor="end" fontSize="13" fontWeight="800" fill="#1e40af">
                {roleA} ({curAgeA}岁)
              </text>
              {/* 年龄条形 */}
              <rect
                x="0"
                y="5"
                width={barWidthA}
                height="28"
                rx="6"
                fill="url(#barGradA)"
                style={{ transition: isPlaying ? 'none' : 'width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              />
              {/* 年龄数字徽标 */}
              <text
                x={barWidthA - 10}
                y="24"
                textAnchor="end"
                fontSize="12"
                fontWeight="900"
                fill="#ffffff"
              >
                {curAgeA} 岁
              </text>
            </g>

            {/* 角色 B 线段条 */}
            <g transform="translate(120, 95)">
              {/* 名字标签 */}
              <text x="-15" y="24" textAnchor="end" fontSize="13" fontWeight="800" fill="#c2410c">
                {roleB} ({curAgeB}岁)
              </text>
              {/* 年龄条形 */}
              <rect
                x="0"
                y="5"
                width={barWidthB}
                height="28"
                rx="6"
                fill="url(#barGradB)"
                style={{ transition: isPlaying ? 'none' : 'width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              />
              {/* 年龄数字徽标 */}
              <text
                x={Math.max(25, barWidthB - 10)}
                y="24"
                textAnchor="end"
                fontSize="12"
                fontWeight="900"
                fill="#ffffff"
              >
                {curAgeB} 岁
              </text>
            </g>

            {/* 永远不变的金色差值锁定卡尺 */}
            <g transform={`translate(${120 + barWidthB}, 40)`}>
              {/* 虚线连接对齐线 */}
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="85"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <line
                x1={diffWidth}
                y1="0"
                x2={diffWidth}
                y2="85"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 2"
              />

              {/* 阴影差值矩形 */}
              <rect
                x="0"
                y="0"
                width={diffWidth}
                height="83"
                rx="4"
                fill="url(#caliperHatch)"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />

              {/* 卡尺中间的锁定标签 */}
              <g transform={`translate(${diffWidth / 2}, 42)`}>
                <rect
                  x="-55"
                  y="-14"
                  width="110"
                  height="28"
                  rx="14"
                  fill="#fffbeb"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  filter="drop-shadow(0 2px 4px rgba(245,158,11,0.15))"
                />
                <text x="0" y="4" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b45309">
                  差值 = {ageDiff} 岁 (恒定)
                </text>
              </g>
            </g>

            {/* 刻度底轴 */}
            <g transform="translate(120, 180)">
              <line x1="0" y1="0" x2={barMaxWidth + 20} y2="0" stroke="#cbd5e1" strokeWidth="1.5" />
              {[0, 10, 20, 30, 40, 50, 60].map((age) => (
                <g key={age} transform={`translate(${age * scale}, 0)`}>
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="0" y="18" textAnchor="middle" fontSize="10" fill="#94a3b8">
                    {age}
                  </text>
                </g>
              ))}
              <text x={barMaxWidth + 40} y="4" textAnchor="start" fontSize="10" fill="#94a3b8" fontWeight="600">
                岁
              </text>
            </g>
          </svg>

          {/* 差倍分析核心结论卡 */}
          <div
            style={{
              marginTop: '16px',
              padding: '14px 18px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                当前状态速览：
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', marginTop: '2px' }}>
                {roleA} {curAgeA} 岁，{roleB} {curAgeB} 岁 ➔ 相差 {ageDiff} 岁（比值：{currentRatio.toFixed(2)}倍）
              </div>
            </div>

            {targetYearOffset !== null && (
              <div
                style={{
                  background: yearOffset === targetYearOffset ? '#dcfce7' : '#eff6ff',
                  border: `1.5px solid ${yearOffset === targetYearOffset ? '#22c55e' : '#bfdbfe'}`,
                  borderRadius: '10px',
                  padding: '8px 14px',
                  textAlign: 'right',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  目标成 {targetK} 倍的年份推算：
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: yearOffset === targetYearOffset ? '#15803d' : '#1d4ed8' }}>
                  {targetYearOffset === 0
                    ? '今年正好成倍数！'
                    : targetYearOffset > 0
                    ? `${targetYearOffset} 年后正好是 ${targetK} 倍！`
                    : `${Math.abs(targetYearOffset)} 年前正好是 ${targetK} 倍！`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部解题推演公式卡 (可折叠切换推导) */}
        <div
          style={{
            width: '100%',
            maxWidth: '680px',
            marginTop: '16px',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '14px',
            padding: '16px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#92400e', fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px' }}>
            <Sparkles size={16} color="#d97706" />
            <span>差倍问题核心心法：一秒算出几年后（或几年前）成倍数</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#78350f', lineHeight: 1.6 }}>
            <div>
              1. <strong>第一步：求永恒差值</strong> ➔ 年龄差 = {baseAgeA} - {baseAgeB} = <strong>{ageDiff} 岁</strong>（时间再变，差值不变）。
            </div>
            <div>
              2. <strong>第二步：求差值对应份数</strong> ➔ 当 {roleA} 是 {roleB} 的 {targetK} 倍时，{roleA} 是 {targetK} 份，{roleB} 是 1 份，相差 <strong>{targetK} - 1 = {targetK - 1} 份</strong>。
            </div>
            <div>
              3. <strong>第三步：求倍数时刻的较小者年龄</strong> ➔ 那一年 {roleB} 的年龄 = {ageDiff} ÷ {targetK - 1} = <strong>{targetAgeB !== null ? targetAgeB : '?'} 岁</strong>。
            </div>
            <div>
              4. <strong>第四步：与今年对比求经过年数</strong> ➔ 年份差 = {targetAgeB !== null ? targetAgeB : '?'} - {baseAgeB} = <strong>{targetYearOffset !== null ? targetYearOffset : '?'} 年</strong>！
            </div>
          </div>
        </div>
      </div>

      {/* 底部时空穿梭滑块控制台 */}
      <div className={styles.sliderPanel}>
        <div className={styles.sliderGroup} style={{ flex: '2 1 320px' }}>
          <span className={styles.sliderLabel}>时光穿梭调速轮：</span>
          <input
            type="range"
            min="-10"
            max="25"
            step="1"
            value={yearOffset}
            onChange={(e) => {
              setIsPlaying(false);
              setYearOffset(Number(e.target.value));
            }}
            className={styles.sliderInput}
          />
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2563eb', minWidth: '95px' }}>
            {yearOffset === 0 ? '今年 (0年)' : yearOffset > 0 ? `+${yearOffset} 年后` : `${yearOffset} 年前`}
          </span>

          {targetYearOffset !== null && (
            <button
              onClick={() => setYearOffset(targetYearOffset)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: '#f59e0b',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              直接跃迁到 {targetK} 倍时刻
            </button>
          )}
        </div>

        {/* 快捷基准年龄微调 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{roleA}今年:</span>
            <input
              type="number"
              min="10"
              max="60"
              value={baseAgeA}
              onChange={(e) => setBaseAgeA(Math.max(baseAgeB + 1, Number(e.target.value)))}
              style={{ width: '56px', padding: '3px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{roleB}今年:</span>
            <input
              type="number"
              min="1"
              max="50"
              value={baseAgeB}
              onChange={(e) => setBaseAgeB(Math.min(baseAgeA - 1, Math.max(1, Number(e.target.value))))}
              style={{ width: '56px', padding: '3px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
