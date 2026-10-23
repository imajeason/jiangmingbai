'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Users, 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Flame,
  Volume2
} from 'lucide-react';
import styles from '@/styles/animations.module.css';

export default function InclusionExclusionLab() {
  // 核心参数
  const [countA, setCountA] = useState<number>(14); // A队人数 (例如足球)
  const [countB, setCountB] = useState<number>(12); // B队人数 (例如篮球)
  const [countBoth, setCountBoth] = useState<number>(6); // 两队都参加的人数
  
  // 视图模式：'explore' (自由调节), 'rollcall' (教练点名动画), 'quiz' (实战闯关)
  const [activeTab, setActiveTab] = useState<'explore' | 'rollcall' | 'quiz'>('explore');

  // 点名动画状态 (0: 未开始, 1: A队点名, 2: B队点名并撞车, 3: 容斥去重揭秘)
  const [rollCallStep, setRollCallStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  // 保证 countBoth 不能超过 min(countA, countB)
  const maxOverlap = Math.min(countA, countB);
  const safeBoth = Math.min(countBoth, maxOverlap);

  // 分块计算
  const onlyA = countA - safeBoth;
  const onlyB = countB - safeBoth;
  const totalStudents = onlyA + safeBoth + onlyB; // 即 countA + countB - safeBoth

  // 闯关测试题目状态
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');

  // 自动播放点名动画
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying) {
      if (rollCallStep < 3) {
        timer = setTimeout(() => {
          setRollCallStep((prev) => prev + 1);
        }, 1800);
      } else {
        setIsAutoPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, rollCallStep]);

  // 预设情境
  const applyPreset = (a: number, b: number, both: number) => {
    setCountA(a);
    setCountB(b);
    setCountBoth(both);
    setRollCallStep(0);
    setIsAutoPlaying(false);
  };

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Layers size={18} color="var(--color-primary)" />
          <span>容斥原理与重叠问题：韦恩图点名实验室</span>
          <span className="badge badge-blue">三年级数学广角·集合</span>
        </div>

        {/* 模式切换 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`${styles.controlBtn} ${activeTab === 'explore' ? styles.controlBtnActive : ''}`}
            onClick={() => { setActiveTab('explore'); setRollCallStep(0); setIsAutoPlaying(false); }}
          >
            <Users size={14} />
            <span>自由调节</span>
          </button>
          <button
            className={`${styles.controlBtn} ${activeTab === 'rollcall' ? styles.controlBtnActive : ''}`}
            onClick={() => { setActiveTab('rollcall'); setRollCallStep(1); }}
          >
            <Volume2 size={14} />
            <span>现场点名排查</span>
          </button>
          <button
            className={`${styles.controlBtn} ${activeTab === 'quiz' ? styles.controlBtnActive : ''}`}
            onClick={() => { setActiveTab('quiz'); setQuizScore(null); setUserAnswer(''); }}
          >
            <HelpCircle size={14} />
            <span>思维小挑战</span>
          </button>
        </div>
      </div>

      {/* 画布核心展示区 */}
      <div className={styles.canvasWrapper} style={{ minHeight: '440px', padding: '24px 16px' }}>
        {/* 场景说明标签 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          width: '100%', 
          maxWidth: '780px',
          marginBottom: '16px',
          background: '#ffffff',
          padding: '10px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          fontSize: '0.875rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#2563eb' }} />
            <span>足球队：<strong>{countA}</strong> 人</span>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#ea580c' }} />
            <span>篮球队：<strong>{countB}</strong> 人</span>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
            <span>两队都报：<strong>{safeBoth}</strong> 人</span>
          </div>
          <div style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            全班实际总人数：{totalStudents} 人
          </div>
        </div>

        {/* 韦恩图主体 (SVG 矢量发光渲染) */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '780px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 780 280" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              {/* 左圆渐变 */}
              <radialGradient id="circleAGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={rollCallStep === 1 || rollCallStep === 3 ? 0.45 : 0.25} />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={rollCallStep === 1 || rollCallStep === 3 ? 0.3 : 0.15} />
              </radialGradient>
              {/* 右圆渐变 */}
              <radialGradient id="circleBGrad" cx="60%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#f97316" stopOpacity={rollCallStep === 2 || rollCallStep === 3 ? 0.45 : 0.25} />
                <stop offset="100%" stopColor="#c2410c" stopOpacity={rollCallStep === 2 || rollCallStep === 3 ? 0.3 : 0.15} />
              </radialGradient>
              {/* 中间交集高亮发光滤镜 */}
              <filter id="glowOverlap" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 左大圆：A集合 (足球队) - 圆心 (290, 140), 半径 130 */}
            <circle
              cx="290"
              cy="140"
              r="125"
              fill="url(#circleAGrad)"
              stroke="#2563eb"
              strokeWidth={rollCallStep === 1 ? '4' : '2.5'}
              strokeDasharray={rollCallStep === 1 ? '6 4' : 'none'}
              style={{ transition: 'all 0.3s ease' }}
            />

            {/* 右大圆：B集合 (篮球队) - 圆心 (490, 140), 半径 130 */}
            <circle
              cx="490"
              cy="140"
              r="125"
              fill="url(#circleBGrad)"
              stroke="#ea580c"
              strokeWidth={rollCallStep === 2 ? '4' : '2.5'}
              strokeDasharray={rollCallStep === 2 ? '6 4' : 'none'}
              style={{ transition: 'all 0.3s ease' }}
            />

            {/* 中间重叠区遮罩或发光高亮指示 */}
            {safeBoth > 0 && (
              <ellipse
                cx="390"
                cy="140"
                rx="65"
                ry="95"
                fill={rollCallStep === 2 || rollCallStep === 3 ? '#10b981' : '#a855f7'}
                fillOpacity={rollCallStep === 2 ? 0.4 : 0.22}
                stroke={rollCallStep === 3 ? '#10b981' : '#a855f7'}
                strokeWidth={rollCallStep === 2 || rollCallStep === 3 ? '3' : '1.5'}
                filter={rollCallStep === 2 ? 'url(#glowOverlap)' : 'none'}
                style={{ transition: 'all 0.3s ease' }}
              />
            )}

            {/* 左侧文字标注：只踢足球 */}
            <text x="220" y="70" textAnchor="middle" fill="#1e3a8a" fontWeight="800" fontSize="17">
              ⚽ 足球队
            </text>
            <text x="220" y="95" textAnchor="middle" fill="#3b82f6" fontWeight="700" fontSize="14">
              全部 {countA} 人
            </text>
            <rect x="175" y="115" width="90" height="52" rx="8" fill="#ffffff" stroke="#bfdbfe" />
            <text x="220" y="137" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">
              只踢足球
            </text>
            <text x="220" y="158" textAnchor="middle" fill="#1d4ed8" fontSize="18" fontWeight="800">
              {onlyA} 人
            </text>

            {/* 中间文字标注：两样都参加 (交集) */}
            <rect 
              x="345" 
              y={safeBoth > 0 ? "105" : "120"} 
              width="90" 
              height={safeBoth > 0 ? "70" : "40"} 
              rx="8" 
              fill={rollCallStep === 2 ? "#fef3c7" : "#ffffff"} 
              stroke={rollCallStep === 2 ? "#f59e0b" : "#cbd5e1"} 
              strokeWidth="2"
            />
            <text x="390" y={safeBoth > 0 ? "125" : "145"} textAnchor="middle" fill="#7c3aed" fontSize="11" fontWeight="700">
              两样都报
            </text>
            <text x="390" y="150" textAnchor="middle" fill="#15803d" fontSize="20" fontWeight="800">
              {safeBoth} 人
            </text>
            {safeBoth > 0 && rollCallStep === 2 && (
              <text x="390" y="167" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="700">
                ⚠️ 被数了2次!
              </text>
            )}

            {/* 右侧文字标注：只打篮球 */}
            <text x="560" y="70" textAnchor="middle" fill="#7c2d12" fontWeight="800" fontSize="17">
              🏀 篮球队
            </text>
            <text x="560" y="95" textAnchor="middle" fill="#ea580c" fontWeight="700" fontSize="14">
              全部 {countB} 人
            </text>
            <rect x="515" y="115" width="90" height="52" rx="8" fill="#ffffff" stroke="#fed7aa" />
            <text x="560" y="137" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">
              只打篮球
            </text>
            <text x="560" y="158" textAnchor="middle" fill="#c2410c" fontSize="18" fontWeight="800">
              {onlyB} 人
            </text>

            {/* 底部点名过程提示条 */}
            {activeTab === 'rollcall' && (
              <g transform="translate(190, 245)">
                <rect x="0" y="0" width="400" height="32" rx="16" fill="#1e293b" />
                <text x="200" y="21" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="600">
                  {rollCallStep === 1 && `第 1 步：足球教练点名，叫到了 ${countA} 个名字（含中间 ${safeBoth} 人）`}
                  {rollCallStep === 2 && `第 2 步：篮球教练点名，又叫了 ${countB} 个名字！中间 ${safeBoth} 人起立了两次！`}
                  {rollCallStep === 3 && `第 3 步：多算了一次！${countA} + ${countB} - ${safeBoth} = ${totalStudents} 人，完美去重！`}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* 下方算理直观对比栏：分类相加 vs 容斥去重 */}
        <div style={{
          width: '100%',
          maxWidth: '780px',
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px'
        }}>
          {/* 算理 1：分类拼图法 (不重不漏) */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              <Sparkles size={15} color="#2563eb" />
              <span>算理一：分类相加法 (切成3块，绝不重复)</span>
            </div>
            <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '10px' }}>
              只踢足球 + 两样都报 + 只打篮球
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '1.05rem', 
              fontWeight: 800,
              color: '#0f172a'
            }}>
              <span style={{ color: '#2563eb' }}>{onlyA}</span>
              <span>+</span>
              <span style={{ color: '#10b981', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>{safeBoth}</span>
              <span>+</span>
              <span style={{ color: '#ea580c' }}>{onlyB}</span>
              <span>=</span>
              <span style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>{totalStudents} 人</span>
            </div>
          </div>

          {/* 算理 2：容斥原理公式法 (两队相加减去重复) */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #93c5fd',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '8px' }}>
              <Flame size={15} color="#ea580c" />
              <span>算理二：容斥原理标准公式 (加全集 - 扣重合)</span>
            </div>
            <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '10px' }}>
              足球队总人数 + 篮球队总人数 - 重复点名人数
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '1.05rem', 
              fontWeight: 800,
              color: '#0f172a'
            }}>
              <span style={{ color: '#2563eb' }}>{countA}</span>
              <span>+</span>
              <span style={{ color: '#ea580c' }}>{countB}</span>
              <span>-</span>
              <span style={{ color: '#ef4444', background: '#fef2f2', padding: '2px 6px', borderRadius: '4px' }}>{safeBoth}</span>
              <span>=</span>
              <span style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>{totalStudents} 人</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部控制面板 */}
      {activeTab === 'explore' && (
        <div className={styles.sliderPanel}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
            {/* 快捷经典预设 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b' }}>经典考题预设：</span>
              <button 
                className={styles.controlBtn} 
                onClick={() => applyPreset(14, 12, 6)}
                style={{ fontSize: '0.78rem' }}
              >
                ① 课间球类统计 (14+12-6)
              </button>
              <button 
                className={styles.controlBtn} 
                onClick={() => applyPreset(18, 16, 8)}
                style={{ fontSize: '0.78rem' }}
              >
                ② 语数双优小组 (18+16-8)
              </button>
              <button 
                className={styles.controlBtn} 
                onClick={() => applyPreset(10, 5, 5)}
                style={{ fontSize: '0.78rem' }}
              >
                ③ 包含特例 (大圈包小圈 B全部重合)
              </button>
              <button 
                className={styles.controlBtn} 
                onClick={() => applyPreset(10, 10, 0)}
                style={{ fontSize: '0.78rem' }}
              >
                ④ 互斥独立 (无重叠 直接相加)
              </button>
            </div>

            {/* 3个独立调节滑块 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px' }}>
                  <span>⚽ 足球队人数 (A)</span>
                  <strong style={{ color: '#2563eb' }}>{countA} 人</strong>
                </div>
                <input
                  type="range"
                  min="6"
                  max="20"
                  value={countA}
                  onChange={(e) => setCountA(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#2563eb' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px' }}>
                  <span>🏀 篮球队人数 (B)</span>
                  <strong style={{ color: '#ea580c' }}>{countB} 人</strong>
                </div>
                <input
                  type="range"
                  min="6"
                  max="20"
                  value={countB}
                  onChange={(e) => setCountB(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#ea580c' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px' }}>
                  <span>✨ 两样都报人数 (A ∩ B)</span>
                  <strong style={{ color: '#10b981' }}>{safeBoth} 人 (上限 {maxOverlap})</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxOverlap}
                  value={safeBoth}
                  onChange={(e) => setCountBoth(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#10b981' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 点名模式控制条 */}
      {activeTab === 'rollcall' && (
        <div className={styles.sliderPanel} style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setRollCallStep(1);
                setIsAutoPlaying(true);
              }}
              disabled={isAutoPlaying}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Play size={15} />
              <span>{isAutoPlaying ? '点名演示中...' : '开始自动点名演示'}</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => {
                setRollCallStep(0);
                setIsAutoPlaying(false);
              }}
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              <RotateCcw size={15} />
              <span>重置状态</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`${styles.controlBtn} ${rollCallStep === 1 ? styles.controlBtnActive : ''}`}
              onClick={() => { setRollCallStep(1); setIsAutoPlaying(false); }}
            >
              第 1 步：足球点名
            </button>
            <button
              className={`${styles.controlBtn} ${rollCallStep === 2 ? styles.controlBtnActive : ''}`}
              onClick={() => { setRollCallStep(2); setIsAutoPlaying(false); }}
            >
              第 2 步：篮球点名 (撞车)
            </button>
            <button
              className={`${styles.controlBtn} ${rollCallStep === 3 ? styles.controlBtnActive : ''}`}
              onClick={() => { setRollCallStep(3); setIsAutoPlaying(false); }}
            >
              第 3 步：扣除重复
            </button>
          </div>
        </div>
      )}

      {/* 闯关测试模式 */}
      {activeTab === 'quiz' && (
        <div className={styles.sliderPanel} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px', color: '#1e293b' }}>
            📝 经典易错挑战：
          </div>
          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '14px', lineHeight: 1.6 }}>
            三年级二班有 <strong>32</strong> 人，其中喜欢语文的有 <strong>20</strong> 人，喜欢数学的有 <strong>18</strong> 人，每人至少喜欢一门。请问：<strong>两门学科都喜欢的同学有几人？</strong>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="number"
              placeholder="输入你的答案"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              style={{
                padding: '8px 14px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                width: '150px',
                outline: 'none'
              }}
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                const ans = Number(userAnswer.trim());
                // 20 + 18 - 32 = 6
                if (ans === 6) {
                  setQuizScore(1);
                  applyPreset(20, 18, 6);
                } else {
                  setQuizScore(0);
                }
              }}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              提交验证
            </button>

            {quizScore === 1 && (
              <span style={{ color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} /> 太棒了！回答正确！公式：20 + 18 - 32 = 6 人！
              </span>
            )}
            {quizScore === 0 && (
              <span style={{ color: '#dc2626', fontWeight: 600, fontSize: '0.875rem' }}>
                ❌ 不对哦。提示：如果直接相加 20 + 18 = 38 人，比全班 32 人多出来的 6 人是谁呢？
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
