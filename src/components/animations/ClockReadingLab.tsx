'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw, AlertTriangle, Sparkles, CheckCircle2, Eye, EyeOff, HelpCircle, Award, Compass } from 'lucide-react';
import styles from '@/styles/animations.module.css';

// 预设高频经典考题时间
interface TimePreset {
  label: string;
  minutesTotal: number; // 0 ~ 719
  type: 'danger' | 'half' | 'exact' | 'over';
  desc: string;
  commonMistake?: string;
}

const PRESETS: TimePreset[] = [
  {
    label: '7:55 (快到8点)',
    minutesTotal: 475,
    type: 'danger',
    desc: '时针几乎贴在数字8上，极易误读成 8:55！但时针还没踩过8的门槛，仍在7的房间！',
    commonMistake: '最容易看成 8:55（错因：只看时针靠近8，忽略分针还没到12）',
  },
  {
    label: '8:58 (差2分9点)',
    minutesTotal: 538,
    type: 'danger',
    desc: '时针与9几乎重合，但差2分钟才到9点！依然属于8点钟！',
    commonMistake: '容易看成 9:58',
  },
  {
    label: '3:30 (半点居中)',
    minutesTotal: 210,
    type: 'half',
    desc: '分针走了半圈停在6，时针必须走在3和4的正中央，绝不能停在正3上！',
    commonMistake: '画钟面时容易把时针画在正对3的位置（画错直接扣分）',
  },
  {
    label: '12:05 (刚过12点)',
    minutesTotal: 5,
    type: 'over',
    desc: '分针指在数字1上，走了一大格是5分钟，不是12点01分！',
    commonMistake: '容易误读为 12:01（混淆了钟面数字与分钟数）',
  },
  {
    label: '6:30 (两针共线)',
    minutesTotal: 390,
    type: 'half',
    desc: '分针指在6，时针在6和7的正中间，两根针并不是重合的！',
    commonMistake: '容易误以为时针和分针都指向6',
  },
  {
    label: '9:00 (标准整点)',
    minutesTotal: 540,
    type: 'exact',
    desc: '分针直直指着12，时针精准指着9。整点是认表的基础锚点。',
    commonMistake: '最标准状态，分针指12时针指几就是几点',
  },
];

// 闯关测试题库
interface QuizItem {
  minutesTotal: number;
  options: string[];
  correct: string;
  trap: string;
  analysis: string;
}

const QUIZ_BANK: QuizItem[] = [
  {
    minutesTotal: 475, // 7:55
    options: ['7:55', '8:55', '7:11'],
    correct: '7:55',
    trap: '8:55',
    analysis: '虽然时针非常靠近8，但分针指在11（差5分到12），时针还没跨过8的门槛，依然属于【7点的房间】！',
  },
  {
    minutesTotal: 210, // 3:30
    options: ['3:30', '3:06', '4:30'],
    correct: '3:30',
    trap: '3:06',
    analysis: '分针指着数字6，每一大格是5分，6×5 = 30分钟！时针在3和4正中间，是【3点半】！',
  },
  {
    minutesTotal: 5, // 12:05
    options: ['12:05', '12:01', '1:00'],
    correct: '12:05',
    trap: '12:01',
    analysis: '分针指着数字1代表走过了1个大格（5个小格），是5分钟，千万不能读成12点01分！',
  },
  {
    minutesTotal: 718, // 11:58
    options: ['11:58', '12:58', '11:10'],
    correct: '11:58',
    trap: '12:58',
    analysis: '时针几乎和12贴在一起了，但分针还差2小格到12，还是【11点58分】！',
  },
];

// 连续角度计算：根据当前角度计算到达目标模360角度的最短顺畅角度，避免在 360° -> 0° 时产生逆时针倒转
function getNextContinuousAngle(currentAngle: number, targetDegMod360: number): number {
  const currentMod = ((currentAngle % 360) + 360) % 360;
  let diff = targetDegMod360 - currentMod;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return currentAngle + diff;
}

export default function ClockReadingLab() {
  // 当前总分钟数：0 ~ 719 (以 12 小时制循环)
  // 默认设置为 7:55 (475 分)
  const [totalMinutes, setTotalMinutes] = useState<number>(475);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [showRooms, setShowRooms] = useState<boolean>(true); // 是否高亮显示“小时的房间”扇区
  const [hideDigital, setHideDigital] = useState<boolean>(false); // 遮挡电子时间测试模式
  const [activeTab, setActiveTab] = useState<'explore' | 'quiz'>('explore');

  // 连续指针角度状态（确保任何时候顺时针前进都不会倒转）
  const [hourHandAngle, setHourHandAngle] = useState<number>((475 / 60) * 30);
  const [minuteHandAngle, setMinuteHandAngle] = useState<number>((475 % 60) * 6);

  // 答题模式状态
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // SVG 拖拽交互
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastAngleRef = useRef<number | null>(null);
  const accumulatedAngleRef = useRef<number>(0);

  // 自动走针计时器
  useEffect(() => {
    let timer: number;
    if (isAutoPlaying) {
      timer = window.setInterval(() => {
        setTotalMinutes((prev) => (prev + 1) % 720);
      }, 70);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // 时间换算
  const normalizedMinutes = ((totalMinutes % 720) + 720) % 720;
  const rawHours = Math.floor(normalizedMinutes / 60); // 0 ~ 11
  const displayHours = rawHours === 0 ? 12 : rawHours;
  const minutes = normalizedMinutes % 60;

  // 保持时针与分针角度平滑连续（跨越 12 点时绝不逆时针倒退）
  useEffect(() => {
    const targetHourMod = (normalizedMinutes / 60) * 30;
    const targetMinMod = (normalizedMinutes % 60) * 6;

    setHourHandAngle((prev) => getNextContinuousAngle(prev, targetHourMod));
    setMinuteHandAngle((prev) => getNextContinuousAngle(prev, targetMinMod));
  }, [normalizedMinutes]);

  // 当前时针所在的“小时房间” (1 ~ 12)
  const currentRoom = rawHours === 0 ? 12 : rawHours;
  const nextRoom = (rawHours + 1) % 12 === 0 ? 12 : (rawHours + 1) % 12;

  // 易错区间：分钟在 45~59 之间（接近下一个小时）
  const isTricky = minutes >= 45;

  // 辅助：获取鼠标/触控在表盘上的当前角度 (以正上方12点为 0 度)
  const getPointerAngle = (e: React.PointerEvent<SVGSVGElement>): number | null => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 680 / rect.width;
    const scaleY = 410 / rect.height;
    const clientX = (e.clientX - rect.left) * scaleX;
    const clientY = (e.clientY - rect.top) * scaleY;

    const centerX = 210;
    const centerY = 205;
    const dx = clientX - centerX;
    const dy = clientY - centerY;

    // 只有在表盘内部（半径 185 以内）才响应拨钟，避免误触右侧看板
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 185) return null;

    let rad = Math.atan2(dx, -dy);
    if (rad < 0) rad += 2 * Math.PI;
    return (rad * 180) / Math.PI;
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const deg = getPointerAngle(e);
    if (deg === null) return;
    setIsAutoPlaying(false);
    setIsDragging(true);
    lastAngleRef.current = deg;
    accumulatedAngleRef.current = 0;
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging || lastAngleRef.current === null) return;
    const currentDeg = getPointerAngle(e);
    if (currentDeg === null) return;

    let diff = currentDeg - lastAngleRef.current;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    accumulatedAngleRef.current += diff;
    lastAngleRef.current = currentDeg;

    // 每移动 6 度对应 1 分钟，连续驱动小时与分针，跨过12点时平滑进位
    if (Math.abs(accumulatedAngleRef.current) >= 6) {
      const deltaMinutes = Math.trunc(accumulatedAngleRef.current / 6);
      accumulatedAngleRef.current -= deltaMinutes * 6;
      setTotalMinutes((prev) => {
        let next = (prev + deltaMinutes) % 720;
        if (next < 0) next += 720;
        return next;
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDragging) {
      setIsDragging(false);
      lastAngleRef.current = null;
      accumulatedAngleRef.current = 0;
      try {
        (e.target as Element).releasePointerCapture?.(e.pointerId);
      } catch (_) {}
    }
  };

  // 闯关测试逻辑
  const curQuiz = QUIZ_BANK[quizIdx];
  const handleSelectQuizOption = (opt: string) => {
    if (quizAnswered) return;
    setQuizSelected(opt);
    setQuizAnswered(true);
  };

  const handleNextQuiz = () => {
    setQuizSelected(null);
    setQuizAnswered(false);
    const next = (quizIdx + 1) % QUIZ_BANK.length;
    setQuizIdx(next);
    setTotalMinutes(QUIZ_BANK[next].minutesTotal);
  };

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Clock size={18} color="#2563eb" />
          <span>认识钟表实验室：时针分针齿轮联动与“小时的房间”</span>
        </div>
        <div className={styles.labControls}>
          <button
            className={`${styles.controlBtn} ${activeTab === 'explore' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            🧭 自由拨钟探索
          </button>
          <button
            className={`${styles.controlBtn} ${activeTab === 'quiz' ? styles.controlBtnActive : ''}`}
            onClick={() => {
              setActiveTab('quiz');
              setIsAutoPlaying(false);
              setTotalMinutes(curQuiz.minutesTotal);
              setQuizSelected(null);
              setQuizAnswered(false);
            }}
          >
            🎯 考场易错闯关
          </button>

          <button
            className={`${styles.controlBtn} ${isAutoPlaying ? styles.controlBtnActive : ''}`}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            title="齿轮连续平滑走动"
          >
            {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isAutoPlaying ? '暂停' : '连续走针'}</span>
          </button>
        </div>
      </div>

      {/* SVG 画布工作区 */}
      <div className={styles.canvasWrapper} style={{ minHeight: '430px', padding: '16px 20px' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 680 410"
          width="100%"
          height="410"
          style={{ maxWidth: '680px', userSelect: 'none', cursor: isDragging ? 'grabbing' : 'default', touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <defs>
            {/* 表盘金属拉丝外圈 */}
            <radialGradient id="dialGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="85%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </radialGradient>

            {/* 小时房间彩虹渐变 */}
            <linearGradient id="currentRoomGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.25" />
            </linearGradient>

            {/* 陷阱警报房间渐变 */}
            <linearGradient id="trapRoomGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fecdd3" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.3" />
            </linearGradient>

            {/* 齿轮金属渐变 */}
            <linearGradient id="gearGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>

          {/* ===================== 左侧：精巧机械表盘 ===================== */}
          <g transform="translate(210, 205)">
            {/* 1. 表盘外壳与立体阴影 */}
            <circle cx="0" cy="0" r="172" fill="#0f172a" opacity="0.08" />
            <circle cx="0" cy="0" r="168" fill="url(#dialGrad)" stroke="#334155" strokeWidth="7" />
            <circle cx="0" cy="0" r="154" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* 2. 【核心亮点】小时的领地房间扇区渲染 */}
            {showRooms && (() => {
              // 7 点房间是从 7 到 8 (即 7*30° 到 8*30°)
              const startAngle = (rawHours * 30 - 90) * (Math.PI / 180);
              const endAngle = ((rawHours + 1) * 30 - 90) * (Math.PI / 180);
              const r = 153;
              const x1 = r * Math.cos(startAngle);
              const y1 = r * Math.sin(startAngle);
              const x2 = r * Math.cos(endAngle);
              const y2 = r * Math.sin(endAngle);

              // 下一个小时门槛的分界线
              return (
                <g>
                  {/* 当前小时整个房间高亮 */}
                  <path
                    d={`M 0 0 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                    fill={isTricky ? 'url(#trapRoomGrad)' : 'url(#currentRoomGrad)'}
                    stroke={isTricky ? '#e11d48' : '#2563eb'}
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  {/* 房门分界线（起跑线）高亮标记 */}
                  <line
                    x1="0"
                    y1="0"
                    x2={x2}
                    y2={y2}
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* 门槛文字标签 */}
                  <g transform={`translate(${x2 * 0.75}, ${y2 * 0.75})`}>
                    <rect x="-30" y="-10" width="60" height="20" rx="4" fill="#ef4444" />
                    <text x="0" y="4" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#ffffff">
                      {nextRoom}点门槛
                    </text>
                  </g>
                </g>
              );
            })()}

            {/* 3. 中心的机械咬合齿轮动画（装饰，体现 1:12 齿轮联动机制） */}
            <g opacity="0.35">
              {/* 大时针齿轮 */}
              <circle cx="-15" cy="15" r="32" fill="none" stroke="url(#gearGrad)" strokeWidth="6" strokeDasharray="6 4" />
              {/* 小分针快速齿轮 */}
              <circle cx="18" cy="-18" r="16" fill="none" stroke="url(#gearGrad)" strokeWidth="4" strokeDasharray="4 3" />
            </g>

            {/* 4. 60 个外圈刻度线 */}
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i * 6 * Math.PI) / 180;
              const isMajor = i % 5 === 0;
              const rInner = isMajor ? 138 : 146;
              const rOuter = 152;
              return (
                <line
                  key={i}
                  x1={rInner * Math.sin(angle)}
                  y1={-rInner * Math.cos(angle)}
                  x2={rOuter * Math.sin(angle)}
                  y2={-rOuter * Math.cos(angle)}
                  stroke={isMajor ? '#0f172a' : '#94a3b8'}
                  strokeWidth={isMajor ? 2.5 : 1}
                />
              );
            })}

            {/* 5. 12 个小时数字与房间标牌 */}
            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const rText = 120;
              const x = rText * Math.sin(angle);
              const y = -rText * Math.cos(angle) + 7;
              const isCurrent = num === currentRoom;
              const isNext = num === nextRoom;

              return (
                <g key={num}>
                  {/* 当前房间数字的光环 */}
                  {isCurrent && (
                    <circle cx={x} cy={y - 7} r="16" fill="#bfdbfe" fillOpacity="0.8" />
                  )}
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fontSize={isCurrent ? '22' : '17'}
                    fontWeight={isCurrent ? '900' : '700'}
                    fill={isCurrent ? '#1e40af' : isNext && isTricky ? '#b91c1c' : '#1e293b'}
                  >
                    {num}
                  </text>
                </g>
              );
            })}

            {/* 6. 外圈微缩分钟提示数字 (05, 10, 15... 55) */}
            {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 0].map((m, i) => {
              const angle = ((i + 1) * 30 * Math.PI) / 180;
              const rMin = 163;
              const x = rMin * Math.sin(angle);
              const y = -rMin * Math.cos(angle) + 4;
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="600"
                  fill="#64748b"
                >
                  {String(m).padStart(2, '0')}
                </text>
              );
            })}

            {/* 7. 时针（红色短粗指针） */}
            <g
              transform={`rotate(${hourHandAngle})`}
              style={{ transition: isDragging ? 'none' : 'transform 0.15s ease-out' }}
            >
              <line x1="0" y1="16" x2="0" y2="-82" stroke="#dc2626" strokeWidth="8" strokeLinecap="round" />
              <polygon points="-8,-76 0,-96 8,-76" fill="#dc2626" />
              <rect x="-14" y="-55" width="28" height="16" rx="3" fill="#ffffff" stroke="#dc2626" strokeWidth="1" />
              <text x="0" y="-43" textAnchor="middle" fill="#dc2626" fontSize="9.5" fontWeight="800">时针</text>
            </g>

            {/* 8. 分针（蓝色长细指针，外带可拖拽圆形手柄） */}
            <g
              transform={`rotate(${minuteHandAngle})`}
              style={{ transition: isDragging ? 'none' : 'transform 0.15s ease-out' }}
            >
              <line x1="0" y1="20" x2="0" y2="-128" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
              <polygon points="-6,-122 0,-140 6,-122" fill="#2563eb" />
              <rect x="-14" y="-95" width="28" height="16" rx="3" fill="#ffffff" stroke="#2563eb" strokeWidth="1" />
              <text x="0" y="-83" textAnchor="middle" fill="#2563eb" fontSize="9.5" fontWeight="800">分针</text>

              {/* 针尖拖拽发光手柄 */}
              <circle cx="0" cy="-140" r="9" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
            </g>

            {/* 9. 中心轴盖 */}
            <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="4" fill="#fbbf24" />
          </g>

          {/* ===================== 右侧：仪表状态看板与启发卡 ===================== */}
          <g transform="translate(420, 25)">
            {/* 电子表与读时大卡片 */}
            <rect x="0" y="0" width="245" height="100" rx="14" fill="#ffffff" stroke="#e2e8f0" />
            
            <g transform="translate(18, 22)">
              <text x="0" y="0" fontSize="12" fill="#64748b" fontWeight="700">电子时间显示：</text>
              
              {hideDigital ? (
                <g transform="translate(0, 10)">
                  <rect x="0" y="0" width="160" height="42" rx="8" fill="#f1f5f9" stroke="#cbd5e1" strokeDasharray="3 3" />
                  <text x="80" y="26" textAnchor="middle" fontSize="13" fill="#64748b" fontWeight="700">
                    🙈 已遮挡，猜猜几点？
                  </text>
                </g>
              ) : (
                <g transform="translate(0, 10)">
                  <text x="0" y="32" fontSize="30" fill="#0f172a" fontWeight="900" fontFamily="var(--font-mono)">
                    {String(displayHours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
                  </text>
                  <text x="105" y="30" fontSize="15" fill="#2563eb" fontWeight="800">
                    {displayHours} 点 {minutes} 分
                  </text>
                </g>
              )}
            </g>

            {/* 遮挡切换眼睛按钮 */}
            <g
              transform="translate(195, 18)"
              cursor="pointer"
              onClick={() => setHideDigital(!hideDigital)}
            >
              <rect x="-6" y="-6" width="32" height="32" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
              {hideDigital ? (
                <EyeOff size={18} color="#2563eb" />
              ) : (
                <Eye size={18} color="#64748b" />
              )}
            </g>

            {/* “小时的房间”领地诊断提示盒 */}
            <g transform="translate(0, 114)">
              <rect
                x="0"
                y="0"
                width="245"
                height="136"
                rx="14"
                fill={isTricky ? '#fff1f2' : '#f0fdf4'}
                stroke={isTricky ? '#fecdd3' : '#bbf7d0'}
                strokeWidth="1.5"
              />

              <g transform="translate(16, 26)">
                {isTricky ? (
                  <AlertTriangle size={18} color="#e11d48" />
                ) : (
                  <CheckCircle2 size={18} color="#16a34a" />
                )}
                <text x="24" y="14" fontSize="13.5" fill={isTricky ? '#9f1239' : '#166534'} fontWeight="800">
                  {isTricky ? '⚠️ 极易犯错陷阱时段！' : '✅ 正常读取时段'}
                </text>
              </g>

              {/* 房间领地结论 */}
              <g transform="translate(16, 68)">
                <text x="0" y="0" fontSize="12" fill="#334155">
                  时针当前所在的房间：
                </text>
                <text x="0" y="20" fontSize="14" fill="#1d4ed8" fontWeight="800">
                  🏠 【{currentRoom} 点的房间】
                </text>

                <text x="0" y="44" fontSize="11" fill="#475569" width="210">
                  {isTricky
                    ? `时针虽逼近 ${nextRoom}，但未迈过红线门槛！`
                    : `时针稳稳走在 ${currentRoom} 到 ${nextRoom} 的路上。`}
                </text>
              </g>
            </g>

            {/* 经典考点快速体验 (4个胶囊按钮) */}
            <g transform="translate(0, 264)">
              <text x="0" y="0" fontSize="11.5" fill="#64748b" fontWeight="700">经典期末考点一键跳转：</text>

              <g transform="translate(0, 10)">
                {PRESETS.slice(0, 4).map((p, idx) => {
                  const isCur = totalMinutes === p.minutesTotal;
                  const row = Math.floor(idx / 2);
                  const col = idx % 2;
                  return (
                    <g
                      key={idx}
                      transform={`translate(${col * 126}, ${row * 36})`}
                      cursor="pointer"
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setTotalMinutes(p.minutesTotal);
                      }}
                    >
                      <rect
                        x="0"
                        y="0"
                        width="120"
                        height="30"
                        rx="6"
                        fill={isCur ? (p.type === 'danger' ? '#fee2e2' : '#dbeafe') : '#f8fafc'}
                        stroke={isCur ? (p.type === 'danger' ? '#ef4444' : '#2563eb') : '#cbd5e1'}
                        strokeWidth={isCur ? '2' : '1'}
                      />
                      <text
                        x="60"
                        y="19"
                        textAnchor="middle"
                        fontSize="11.5"
                        fontWeight={isCur ? '800' : '600'}
                        fill={isCur ? (p.type === 'danger' ? '#991b1b' : '#1e40af') : '#334155'}
                      >
                        {p.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            </g>
          </g>
        </svg>

        {/* 底部功能栏与闯关面板 */}
        {activeTab === 'quiz' && (
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              marginTop: '12px',
              padding: '16px 20px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '2px solid #3b82f6',
              boxShadow: '0 4px 14px rgba(37,99,235,0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e40af', background: '#dbeafe', padding: '3px 10px', borderRadius: '12px' }}>
                认表小达人闯关 · 第 {quizIdx + 1} / {QUIZ_BANK.length} 题
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                请观察上方钟表指针，选出正确时间
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', margin: '14px 0' }}>
              {curQuiz.options.map((opt) => {
                const isSelected = quizSelected === opt;
                const isCorrect = opt === curQuiz.correct;

                let bg = '#f8fafc';
                let border = '#cbd5e1';
                let color = '#1e293b';

                if (quizAnswered) {
                  if (isCorrect) {
                    bg = '#ecfdf5';
                    border = '#10b981';
                    color = '#065f46';
                  } else if (isSelected) {
                    bg = '#fef2f2';
                    border = '#ef4444';
                    color = '#991b1b';
                  }
                }

                return (
                  <button
                    key={opt}
                    disabled={quizAnswered}
                    onClick={() => handleSelectQuizOption(opt)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: `2px solid ${border}`,
                      background: bg,
                      color: color,
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      cursor: quizAnswered ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {quizAnswered && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: quizSelected === curQuiz.correct ? '#f0fdf4' : '#fffbeb',
                  border: `1px solid ${quizSelected === curQuiz.correct ? '#86efac' : '#fde68a'}`,
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  color: '#334155',
                  marginBottom: '10px',
                }}
              >
                <strong>{quizSelected === curQuiz.correct ? '🎉 太棒了，完全正确！' : '💡 错因剖析：'}</strong>{' '}
                {curQuiz.analysis}
              </div>
            )}

            {quizAnswered && (
              <button
                onClick={handleNextQuiz}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                下一题 ➔
              </button>
            )}
          </div>
        )}
      </div>

      {/* 底部控制台：手摇滑动条与房间开关 */}
      <div className={styles.sliderPanel}>
        <div className={styles.sliderGroup} style={{ flex: '2 1 300px' }}>
          <span className={styles.sliderLabel}>拨动时间轴 (看时针与分针 1:12 齿轮联动):</span>
          <input
            type="range"
            min="0"
            max="719"
            value={totalMinutes}
            onChange={(e) => {
              setIsAutoPlaying(false);
              setTotalMinutes(Number(e.target.value));
            }}
            className={styles.sliderInput}
          />
          <span className={styles.sliderValue}>
            {String(displayHours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
          </span>

          <button
            onClick={() => {
              setIsAutoPlaying(false);
              setTotalMinutes(475); // 复位到 7:55
            }}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              cursor: 'pointer',
              color: '#64748b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
            }}
            title="复位到经典 7:55"
          >
            <RotateCcw size={14} />
            <span>复位7:55</span>
          </button>
        </div>

        {/* 开关：显示小时房间 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: '#475569', cursor: 'pointer', fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={showRooms}
              onChange={(e) => setShowRooms(e.target.checked)}
              style={{ accentColor: '#2563eb' }}
            />
            <span>高亮“小时的房间”与门槛</span>
          </label>
        </div>
      </div>
    </div>
  );
}
