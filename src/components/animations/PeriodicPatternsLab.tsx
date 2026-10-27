'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Search, 
  Plus, 
  Minus,
  PackageCheck
} from 'lucide-react';
import styles from '@/styles/animations.module.css';

interface PatternItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

interface PresetPattern {
  id: string;
  title: string;
  subtitle: string;
  items: PatternItem[];
  defaultN: number;
  highlightIndex: number;
  description: string;
  question: string;
}

const PRESETS: PresetPattern[] = [
  {
    id: 'flags',
    title: '例题一：校园彩旗排布（周期 4）',
    subtitle: '红、黄、蓝、绿 4 种颜色依次循环插旗',
    items: [
      { id: 'f-red', name: '红旗', icon: '🚩', color: '#ef4444', bgColor: '#fee2e2' },
      { id: 'f-yellow', name: '黄旗', icon: '🟡', color: '#f59e0b', bgColor: '#fef3c7' },
      { id: 'f-blue', name: '蓝旗', icon: '🔷', color: '#3b82f6', bgColor: '#dbeafe' },
      { id: 'f-green', name: '绿旗', icon: '🍀', color: '#10b981', bgColor: '#d1fae5' },
    ],
    defaultN: 23,
    highlightIndex: 0,
    description: '每 4 面旗帜为一组周期。求第 23 面是什么旗？前 23 面里有几面红旗？',
    question: '操场边按“红、黄、蓝、绿”的顺序插了一排彩旗。第 23 面旗是什么颜色？前 23 面里一共有几面红旗？',
  },
  {
    id: 'beads',
    title: '例题二：手串黑白珠链（周期 5）',
    subtitle: '两颗白珠、三颗黑珠交替穿成一串',
    items: [
      { id: 'b-w1', name: '白珠', icon: '⚪', color: '#64748b', bgColor: '#f8fafc' },
      { id: 'b-w2', name: '白珠', icon: '⚪', color: '#64748b', bgColor: '#f8fafc' },
      { id: 'b-b1', name: '黑珠', icon: '⚫', color: '#0f172a', bgColor: '#e2e8f0' },
      { id: 'b-b2', name: '黑珠', icon: '⚫', color: '#0f172a', bgColor: '#e2e8f0' },
      { id: 'b-b3', name: '黑珠', icon: '⚫', color: '#0f172a', bgColor: '#e2e8f0' },
    ],
    defaultN: 28,
    highlightIndex: 2,
    description: '一个周期包含 2 颗白珠和 3 颗黑珠。求第 28 颗是什么颜色？前 28 颗里共有几颗黑珠？',
    question: '小红串手链，按照“2 白 3 黑”的规律穿珠子。第 28 颗珠子是什么颜色？前 28 颗里一共有几颗黑珠？',
  },
  {
    id: 'weekdays',
    title: '例题三：日历星期循环（周期 7）',
    subtitle: '从周一开始，每 7 天为一个完整循环',
    items: [
      { id: 'w-1', name: '周一', icon: '1️⃣', color: '#2563eb', bgColor: '#eff6ff' },
      { id: 'w-2', name: '周二', icon: '2️⃣', color: '#2563eb', bgColor: '#eff6ff' },
      { id: 'w-3', name: '周三', icon: '3️⃣', color: '#2563eb', bgColor: '#eff6ff' },
      { id: 'w-4', name: '周四', icon: '4️⃣', color: '#2563eb', bgColor: '#eff6ff' },
      { id: 'w-5', name: '周五', icon: '5️⃣', color: '#2563eb', bgColor: '#eff6ff' },
      { id: 'w-6', name: '周六', icon: '6️⃣', color: '#8b5cf6', bgColor: '#f5f3ff' },
      { id: 'w-7', name: '周日', icon: '7️⃣', color: '#ec4899', bgColor: '#fdf2f8' },
    ],
    defaultN: 35,
    highlightIndex: 6,
    description: '日历星期是典型的“余数看周末”问题。余 0 代表整除，正好是周期的最后一天（周日）！',
    question: '如果某个月的 1 号是周一，请问该月的第 35 天（或连续第 35 天）是星期几？',
  },
  {
    id: 'zodiac',
    title: '例题四：十二生肖大轮回（周期 12）',
    subtitle: '子鼠、丑牛、寅虎、卯兔... 12年循环一次',
    items: [
      { id: 'z-1', name: '鼠', icon: '🐭', color: '#6366f1', bgColor: '#eef2ff' },
      { id: 'z-2', name: '牛', icon: '🐮', color: '#b45309', bgColor: '#fef3c7' },
      { id: 'z-3', name: '虎', icon: '🐯', color: '#ea580c', bgColor: '#ffedd5' },
      { id: 'z-4', name: '兔', icon: '🐰', color: '#ec4899', bgColor: '#fce7f3' },
      { id: 'z-5', name: '龙', icon: '🐲', color: '#059669', bgColor: '#d1fae5' },
      { id: 'z-6', name: '蛇', icon: '🐍', color: '#16a34a', bgColor: '#dcfce7' },
      { id: 'z-7', name: '马', icon: '🐴', color: '#ca8a04', bgColor: '#fef9c3' },
      { id: 'z-8', name: '羊', icon: '🐑', color: '#0284c7', bgColor: '#e0f2fe' },
      { id: 'z-9', name: '猴', icon: '🐵', color: '#9333ea', bgColor: '#f3e8ff' },
      { id: 'z-10', name: '鸡', icon: '🐔', color: '#dc2626', bgColor: '#fee2e2' },
      { id: 'z-11', name: '狗', icon: '🐶', color: '#78350f', bgColor: '#fef3c7' },
      { id: 'z-12', name: '猪', icon: '🐷', color: '#db2777', bgColor: '#fce7f3' },
    ],
    defaultN: 28,
    highlightIndex: 3,
    description: '生肖循环周期为 12。推算几十年后的生肖，除以 12 看余数即可瞬间识破。',
    question: '从鼠年开始算起，第 28 个年头是什么生肖？第 24 个年头又是什么生肖？',
  },
];

export default function PeriodicPatternsLab() {
  const [selectedPreset, setSelectedPreset] = useState<PresetPattern>(PRESETS[0]);
  const [targetN, setTargetN] = useState<number>(PRESETS[0].defaultN);
  const [inspectMode, setInspectMode] = useState<'position' | 'count'>('position');
  const [targetCountItemIndex, setTargetCountItemIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showFormulaDetail, setShowFormulaDetail] = useState<boolean>(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelectPreset = (preset: PresetPattern) => {
    setSelectedPreset(preset);
    setTargetN(preset.defaultN);
    setTargetCountItemIndex(preset.highlightIndex);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTargetN((prev) => {
          if (prev >= 45) {
            setIsPlaying(false);
            return 1;
          }
          return prev + 1;
        });
      }, 700);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const cycleLength = selectedPreset.items.length;
  const quotient = Math.floor(targetN / cycleLength);
  const remainder = targetN % cycleLength;

  const targetElementIndex = remainder === 0 ? cycleLength - 1 : remainder - 1;
  const targetElement = selectedPreset.items[targetElementIndex];

  const targetCountItem = selectedPreset.items[targetCountItemIndex];
  const countInSingleCycle = selectedPreset.items.filter(
    (item) => item.id === targetCountItem.id || item.name === targetCountItem.name
  ).length;

  let countInRemainder = 0;
  if (remainder > 0) {
    for (let i = 0; i < remainder; i++) {
      if (selectedPreset.items[i].id === targetCountItem.id || selectedPreset.items[i].name === targetCountItem.name) {
        countInRemainder++;
      }
    }
  }

  const totalTargetCount = quotient * countInSingleCycle + countInRemainder;

  const totalBoxes = remainder > 0 ? quotient + 1 : quotient;
  const boxes = [];
  for (let b = 0; b < totalBoxes; b++) {
    const isLastBox = b === totalBoxes - 1;
    const boxItemsCount = isLastBox && remainder > 0 ? remainder : cycleLength;
    const boxItems = [];
    for (let pos = 0; pos < boxItemsCount; pos++) {
      const globalIndex = b * cycleLength + pos + 1;
      const patternItem = selectedPreset.items[pos];
      const isTarget = globalIndex === targetN;
      const isMatchCounting = patternItem.id === targetCountItem.id || patternItem.name === targetCountItem.name;
      boxItems.push({
        globalIndex,
        localIndex: pos + 1,
        item: patternItem,
        isTarget,
        isMatchCounting,
      });
    }
    boxes.push({
      boxIndex: b + 1,
      isFull: boxItemsCount === cycleLength,
      items: boxItems,
    });
  }

  return (
    <div className={styles.labContainer} style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* 顶部标题栏 */}
      <div className={styles.labToolbar} style={{ flexWrap: 'wrap', gap: '10px' }}>
        <div className={styles.labTitle}>
          <Layers className="w-5 h-5 text-indigo-600" />
          <span>周期与余数实验机：传送带分箱与循环密码</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          三年级数学 · 数论模运算启蒙
        </div>
      </div>

      {/* 预设题型选择栏（换行流式布局） */}
      <div style={{ padding: '12px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
          选择常考题型预设：
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPreset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                style={{
                  flex: '1 1 200px',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                  background: isSelected ? '#eef2ff' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(79, 70, 229, 0.15)' : 'none',
                }}
              >
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: isSelected ? '#3730a3' : '#1e293b' }}>
                  {preset.title.split('：')[0]}
                </div>
                <div style={{ fontSize: '0.74rem', color: isSelected ? '#4f46e5' : '#64748b', marginTop: '3px' }}>
                  {preset.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 题意引导条 */}
      <div
        style={{
          padding: '12px 20px',
          background: '#fffbeb',
          borderBottom: '1px solid #fef3c7',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0" style={{ marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#92400e' }}>
            {selectedPreset.question}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#b45309', marginTop: '4px' }}>
            💡 核心秘诀：{selectedPreset.description}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 核心动效区：传送带分箱实景图（放在上方核心视觉舞台） */}
      {/* ======================================================== */}
      <div style={{ padding: '18px 20px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PackageCheck className="w-4 h-4 text-indigo-600" />
            <span>【传送带装箱动效】按每箱 {cycleLength} 个分装打包</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            共分成 <strong style={{ color: '#4f46e5' }}>{totalBoxes}</strong> 箱
            {remainder > 0 ? ` (前 ${quotient} 箱已满，最后 1 箱未满)` : ' (全部满箱整除)'}
          </div>
        </div>

        {/* 箱子排列容器 */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'flex-start',
            padding: '10px 4px',
            maxHeight: '380px',
            overflowY: 'auto',
          }}
        >
          {boxes.map((box) => {
            const isRemainderBox = !box.isFull;
            const hasTargetInBox = box.items.some((item) => item.isTarget);

            return (
              <div
                key={box.boxIndex}
                style={{
                  background: isRemainderBox ? '#fff7ed' : '#f8fafc',
                  border: isRemainderBox
                    ? '2px dashed #fb923c'
                    : hasTargetInBox
                    ? '2px solid #6366f1'
                    : '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '10px 12px',
                  boxShadow: hasTargetInBox ? '0 4px 12px rgba(99, 102, 241, 0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
                  minWidth: `${cycleLength * 52 + 24}px`,
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                {/* 箱子标题栏 */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    paddingBottom: '6px',
                    borderBottom: '1px solid',
                    borderColor: isRemainderBox ? '#fed7aa' : '#e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: isRemainderBox ? '#ea580c' : '#4f46e5',
                        color: '#ffffff',
                      }}
                    >
                      第 {box.boxIndex} 组
                    </span>
                    {isRemainderBox ? (
                      <span style={{ fontSize: '0.72rem', color: '#c2410c', fontWeight: 600 }}>
                        (余数箱：未满 {remainder} 个)
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        (满箱 {cycleLength} 个)
                      </span>
                    )}
                  </div>
                </div>

                {/* 箱内元素 */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {box.items.map((cell) => (
                    <div
                      key={cell.globalIndex}
                      style={{
                        width: '44px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                      }}
                    >
                      {/* 目标指向小标牌 */}
                      {cell.isTarget && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-24px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            animation: 'bounce 1s infinite',
                          }}
                        >
                          <span style={{ fontSize: '0.8rem' }}>👑</span>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#4f46e5' }}>目标</span>
                        </div>
                      )}

                      {/* 元素方块 */}
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background: cell.item.bgColor,
                          border: cell.isTarget
                            ? '3px solid #4f46e5'
                            : cell.isMatchCounting && inspectMode === 'count'
                            ? '2px solid #0891b2'
                            : `1px solid ${cell.item.color}40`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: cell.item.icon.length > 2 ? '0.75rem' : '1.3rem',
                          fontWeight: 700,
                          color: cell.item.color,
                          boxShadow: cell.isTarget
                            ? '0 0 0 3px rgba(79, 70, 229, 0.3)'
                            : cell.isMatchCounting && inspectMode === 'count'
                            ? '0 0 0 2px rgba(8, 145, 178, 0.2)'
                            : 'none',
                          transform: cell.isTarget ? 'scale(1.08)' : 'scale(1)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {cell.item.icon}
                      </div>

                      {/* 全局绝对序号 */}
                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: cell.isTarget ? 800 : 500,
                          color: cell.isTarget ? '#4f46e5' : '#64748b',
                          marginTop: '4px',
                        }}
                      >
                        #{cell.globalIndex}
                      </div>

                      {/* 周期内局部序号 */}
                      <div
                        style={{
                          fontSize: '0.62rem',
                          color: '#94a3b8',
                          marginTop: '1px',
                        }}
                      >
                        第{cell.localIndex}个
                      </div>

                      {/* 模式 B 计数标记 */}
                      {inspectMode === 'count' && cell.isMatchCounting && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-2px',
                            background: '#0891b2',
                            color: '#ffffff',
                            borderRadius: '50%',
                            width: '14px',
                            height: '14px',
                            fontSize: '0.6rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* 紧挨动画的控制栏：播放、重置、滑块、模式（换行流式） */}
        {/* ======================================================== */}
        <div
          style={{
            marginTop: '16px',
            padding: '14px 18px',
            background: '#f8fafc',
            borderRadius: '14px',
            border: '2px solid #e0e7ff',
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.06)',
          }}
        >
          {/* 第 1 行：播放、重置、滑动条调节总项数 N */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: isPlaying ? '#dc2626' : '#4f46e5',
                  color: '#ffffff',
                  boxShadow: isPlaying ? '0 2px 6px rgba(220, 38, 38, 0.3)' : '0 2px 6px rgba(79, 70, 229, 0.3)',
                }}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? '暂停递增' : '自动递增演示'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setTargetN(selectedPreset.defaultN);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>重置</span>
              </button>
            </div>

            {/* 项数滑块与微调按钮 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 280px', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap' }}>
                目标第 N 项：
              </span>
              <button
                onClick={() => setTargetN(Math.max(1, targetN - 1))}
                disabled={targetN <= 1}
                style={{
                  padding: '5px 8px',
                  borderRadius: '6px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  cursor: targetN <= 1 ? 'not-allowed' : 'pointer',
                }}
              >
                <Minus className="w-3.5 h-3.5 text-slate-700" />
              </button>
              <input
                type="range"
                min="1"
                max="45"
                value={targetN}
                onChange={(e) => setTargetN(parseInt(e.target.value) || 1)}
                style={{ flex: 1, minWidth: '80px', accentColor: '#4f46e5', cursor: 'pointer' }}
              />
              <button
                onClick={() => setTargetN(Math.min(45, targetN + 1))}
                disabled={targetN >= 45}
                style={{
                  padding: '5px 8px',
                  borderRadius: '6px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  cursor: targetN >= 45 ? 'not-allowed' : 'pointer',
                }}
              >
                <Plus className="w-3.5 h-3.5 text-slate-700" />
              </button>
              <span
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#4f46e5',
                  padding: '2px 8px',
                  background: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #c7d2fe',
                  minWidth: '40px',
                  textAlign: 'center',
                }}
              >
                {targetN}
              </span>
            </div>
          </div>

          {/* 第 2 行：模式切换与速试考点（换行排布） */}
          <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>探究模式：</span>
              <button
                onClick={() => setInspectMode('position')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid',
                  cursor: 'pointer',
                  borderColor: inspectMode === 'position' ? '#4f46e5' : '#cbd5e1',
                  background: inspectMode === 'position' ? '#4f46e5' : '#ffffff',
                  color: inspectMode === 'position' ? '#ffffff' : '#475569',
                }}
              >
                <Search className="w-3 h-3" />
                <span>模式 A：问“第 N 项是什么”</span>
              </button>
              <button
                onClick={() => setInspectMode('count')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid',
                  cursor: 'pointer',
                  borderColor: inspectMode === 'count' ? '#0891b2' : '#cbd5e1',
                  background: inspectMode === 'count' ? '#0891b2' : '#ffffff',
                  color: inspectMode === 'count' ? '#ffffff' : '#475569',
                }}
              >
                <PackageCheck className="w-3 h-3" />
                <span>模式 B：问“前 N 项里有几个某物”</span>
              </button>
            </div>

            {/* 典型考点快跳 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.76rem', color: '#64748b' }}>速试考点：</span>
              {[
                cycleLength * 2,
                cycleLength * 3,
                cycleLength * 2 + 1,
                cycleLength * 2 + (cycleLength > 2 ? 2 : 1),
              ].map((testVal) => (
                <button
                  key={testVal}
                  onClick={() => setTargetN(testVal)}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '5px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    background: targetN === testVal ? '#312e81' : '#ffffff',
                    color: targetN === testVal ? '#ffffff' : '#475569',
                    border: '1px solid #cbd5e1',
                    cursor: 'pointer',
                  }}
                >
                  第 {testVal} 项{testVal % cycleLength === 0 ? ' (整除)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* 如果是模式 B，统计物品选项 */}
          {inspectMode === 'count' && (
            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', padding: '6px 10px', background: '#ecfeff', borderRadius: '8px', border: '1px solid #a5f3fc' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0e7490' }}>统计目标：</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {selectedPreset.items.map((item, idx) => {
                  const isCur = idx === targetCountItemIndex;
                  return (
                    <button
                      key={item.id + idx}
                      onClick={() => setTargetCountItemIndex(idx)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: isCur ? '2px solid #0891b2' : '1px solid #cbd5e1',
                        background: isCur ? '#ffffff' : '#f8fafc',
                        cursor: 'pointer',
                      }}
                    >
                      {item.icon} {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 实时除法拆解与规律核心展示面板 */}
      <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'center' }}>
          {/* 大字数学除法算式 */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '2px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📐 核心除法算式拆解 (总数 ÷ 周期长 = 组数 ... 余数)
            </div>
            <div
              style={{
                marginTop: '10px',
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ color: '#4f46e5' }}>{targetN}</span>
              <span style={{ color: '#94a3b8' }}>÷</span>
              <span style={{ color: '#059669' }}>{cycleLength}</span>
              <span style={{ color: '#94a3b8' }}>=</span>
              <span style={{ color: '#0284c7' }}>{quotient}</span>
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>组 (完整箱)</span>
              <span style={{ color: '#94a3b8' }}>……</span>
              <span
                style={{
                  color: remainder === 0 ? '#d97706' : '#ea580c',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: remainder === 0 ? '#fef3c7' : '#ffedd5',
                  border: remainder === 0 ? '1px solid #fde68a' : '1px solid #fed7aa',
                }}
              >
                {remainder}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>个 (余数)</span>
            </div>

            {/* 算式拆解注解 */}
            <div style={{ marginTop: '10px', fontSize: '0.78rem', color: '#475569', lineHeight: 1.6 }}>
              <div>• <strong>周期长 {cycleLength}</strong>：每 {cycleLength} 个元素重复出现一整轮</div>
              <div>• <strong>商 {quotient}</strong>：表示排满了整整 <strong>{quotient} 个大箱</strong></div>
              <div>• <strong>余数 {remainder}</strong>：
                {remainder === 0 ? (
                  <span style={{ color: '#b45309', fontWeight: 700 }}>
                    整除无余数！说明恰好落在最后一组的【末尾】（第 {cycleLength} 个）！
                  </span>
                ) : (
                  <span style={{ color: '#ea580c', fontWeight: 700 }}>
                    余 {remainder}，说明装满 {quotient} 箱后，落在下一箱的第 {remainder} 个！
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 实时结论与避坑卡片 */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: remainder === 0 ? '#fffbeb' : '#f0fdf4',
              border: remainder === 0 ? '2px solid #fde68a' : '2px solid #bbf7d0',
            }}
          >
            {inspectMode === 'position' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {remainder === 0 ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: remainder === 0 ? '#92400e' : '#166534' }}>
                    {remainder === 0 ? '🚨 整除无余数！高频避坑关键！' : '🎯 第 N 项定位成功'}
                  </span>
                </div>

                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: targetElement.bgColor,
                      border: `2px solid ${targetElement.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem',
                    }}
                  >
                    {targetElement.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>
                      第 {targetN} 项是：<span style={{ color: targetElement.color }}>{targetElement.name}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      {remainder === 0
                        ? `整除余 0，它属于第 ${quotient} 箱的最后 1 个（第 ${cycleLength} 项）！`
                        : `余数是 ${remainder}，它属于第 ${quotient + 1} 箱里的第 ${remainder} 项！`}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f766e' }}>
                    📊 累积个数统计公式
                  </span>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>
                    前 {targetN} 项中共有{' '}
                    <span style={{ color: '#0891b2', fontSize: '1.25rem' }}>{totalTargetCount}</span> 个 {targetCountItem.icon}{' '}
                    {targetCountItem.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                    计算方法：{quotient} (组) × {countInSingleCycle} (每组个数) + {countInRemainder} (余数内个数) ={' '}
                    <strong>{totalTargetCount}</strong> 个
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 周期魔法小结口诀卡 */}
      <div
        style={{
          padding: '14px 20px',
          background: '#faf5ff',
          borderTop: '1px solid #f3e8ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
          <div style={{ fontSize: '0.85rem', color: '#6b21a8' }}>
            <strong>周期问题金牌速记口诀：</strong>
            <span>“总数除以周期长，商是完整箱数全；余几就是第几个，整除零余看末尾！”</span>
          </div>
        </div>

        <button
          onClick={() => setShowFormulaDetail(!showFormulaDetail)}
          style={{
            fontSize: '0.78rem',
            color: '#7e22ce',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {showFormulaDetail ? '收起解题秘籍' : '展开解题秘籍'}
        </button>
      </div>

      {/* 展开的秘籍解析 */}
      {showFormulaDetail && (
        <div style={{ padding: '14px 20px', background: '#fdf4ff', borderTop: '1px dashed #f0abfc', fontSize: '0.8rem', color: '#581c87', lineHeight: 1.7 }}>
          <div style={{ fontWeight: 700, marginBottom: '4px' }}>📚 孩子必须吃透的 3 个关键点：</div>
          <div>1. <strong>找准周期长 (T)</strong>：仔细观察连续重复的一组里到底有几个元素，不漏不重。</div>
          <div>2. <strong>余数决定定位 (R)</strong>：余 1 是这一周期的第 1 个，余 2 是第 2 个……</div>
          <div>3. <strong>牢记零余数陷阱</strong>：算出来余数为 0，<strong>绝不是第 0 个，而是这一周期的最后一个</strong>（因为刚好把最后一箱装满了）！</div>
        </div>
      )}
    </div>
  );
}
