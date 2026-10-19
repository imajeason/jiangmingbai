'use client';

import React, { useState } from 'react';
import { Compass, RotateCw, RotateCcw, RefreshCw, Sun, Moon, Sparkles, HelpCircle, CheckCircle2, Award, FileText } from 'lucide-react';
import styles from '@/styles/animations.module.css';

type Direction = 'east' | 'south' | 'west' | 'north';

interface DirInfo {
  key: Direction;
  name: string;
  pinyin: string;
  angle: number; // 0: 北, 90: 东, 180: 南, 270: 西
  front: string;
  back: string;
  left: string;
  right: string;
  landmark: string;
  icon: string;
  mnemonic: string;
}

const DIRECTIONS: Record<Direction, DirInfo> = {
  north: {
    key: 'north',
    name: '北',
    pinyin: 'BĚI',
    angle: 0,
    front: '北 (面向北极星)',
    back: '南 (后背朝暖阳)',
    left: '西 (左手指向西)',
    right: '东 (右手指向东)',
    landmark: '北极星 / 寒风吹来的方向',
    icon: '⭐',
    mnemonic: '面向北方最开心：正好和地图完全一样！前面是北、后面是南、左西右东！',
  },
  east: {
    key: 'east',
    name: '东',
    pinyin: 'DŌNG',
    angle: 90,
    front: '东 (迎着早晨朝阳)',
    back: '西 (后背是夕阳)',
    left: '北 (左手指向北)',
    right: '南 (右手指向南)',
    landmark: '早晨太阳升起的地方',
    icon: '☀️',
    mnemonic: '早晨起来，面向太阳：前东、后西、左北、右南！顺时针转一步是南！',
  },
  south: {
    key: 'south',
    name: '南',
    pinyin: 'NÁN',
    angle: 180,
    front: '南 (中午向阳最温暖)',
    back: '北 (后背是北极星)',
    left: '东 (左手指向东)',
    right: '西 (右手指向西)',
    landmark: '正午太阳照射的方向',
    icon: '🔥',
    mnemonic: '面朝南方最容易错：和地图正好“面对面”！左右手完全颠倒：左东右西！',
  },
  west: {
    key: 'west',
    name: '西',
    pinyin: 'XĪ',
    angle: 270,
    front: '西 (傍晚面对夕阳)',
    back: '东 (后背是朝阳)',
    left: '南 (左手指向南)',
    right: '北 (右手指向北)',
    landmark: '傍晚太阳落下的地方',
    icon: '🌅',
    mnemonic: '傍晚面对落日：前面是西、后面是东！顺时针再转一步回到北！',
  },
};

const ORDER: Direction[] = ['north', 'east', 'south', 'west'];

interface QuizQuestion {
  prompt: string;
  facing: Direction;
  targetAsk: 'front' | 'back' | 'left' | 'right';
  targetAskLabel: string;
  correctDir: Direction;
  correctName: string;
  explanation: string;
}

const QUIZ_LIST: QuizQuestion[] = [
  {
    prompt: '小明早晨去上学，迎着朝阳走（面朝东）。这时老师让他向右转，他现在面向哪一面？',
    facing: 'east',
    targetAsk: 'right',
    targetAskLabel: '右手方向',
    correctDir: 'south',
    correctName: '南',
    explanation: '面朝东时，顺时针右转 90°，右手方向必然是【南】！',
  },
  {
    prompt: '操场升旗时，全校同学面朝正南方。请问小明的左手指向哪一面？',
    facing: 'south',
    targetAsk: 'left',
    targetAskLabel: '左手方向',
    correctDir: 'east',
    correctName: '东',
    explanation: '面朝南时，人与地图面对面，左右正好颠倒！右手是西，左手是【东】！',
  },
  {
    prompt: '放学时面对傍晚落下的夕阳（面朝西），小明的背后是哪一面？',
    facing: 'west',
    targetAsk: 'back',
    targetAskLabel: '后背方向',
    correctDir: 'east',
    correctName: '东',
    explanation: '东和西永远是对着的！面前是西，后背必定是【东】！',
  },
  {
    prompt: '在野外迷路了，晚上看到北极星（面朝北）。向后转 180 度后，小明的右面是哪一面？',
    facing: 'south',
    targetAsk: 'right',
    targetAskLabel: '右面',
    correctDir: 'west',
    correctName: '西',
    explanation: '面向北向后转，就变成了面向南！面向南时右手指向【西】！',
  },
];

export default function CompassDirectionsLab() {
  const [facing, setFacing] = useState<Direction>('east');
  const [rotatePaperMode, setRotatePaperMode] = useState<boolean>(false); // 考场转卷子神器模式
  const [activeTab, setActiveTab] = useState<'ground' | 'map' | 'quiz'>('ground');

  // 答题模式状态
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Direction | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const cur = DIRECTIONS[facing];

  // 顺时针右转 90 度
  const handleTurnRight = () => {
    const curIdx = ORDER.indexOf(facing);
    const nextIdx = (curIdx + 1) % 4;
    setFacing(ORDER[nextIdx]);
  };

  // 逆时针左转 90 度
  const handleTurnLeft = () => {
    const curIdx = ORDER.indexOf(facing);
    const nextIdx = (curIdx + 3) % 4;
    setFacing(ORDER[nextIdx]);
  };

  // 向后转 180 度
  const handleTurnBack = () => {
    const curIdx = ORDER.indexOf(facing);
    const nextIdx = (curIdx + 2) % 4;
    setFacing(ORDER[nextIdx]);
  };

  // 答题处理
  const currentQuiz = QUIZ_LIST[quizIdx];
  const handleAnswerQuiz = (dir: Direction) => {
    if (isAnswered) return;
    setSelectedAnswer(dir);
    setIsAnswered(true);
    // 联动让操场小人转到对应题意朝向
    setFacing(currentQuiz.facing);
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    const next = (quizIdx + 1) % QUIZ_LIST.length;
    setQuizIdx(next);
    setFacing(QUIZ_LIST[next].facing);
  };

  return (
    <div className={styles.labContainer}>
      {/* 顶部标题栏 */}
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Compass size={18} color="#2563eb" />
          <span>认识东南西北实验室：转身之后，怎么找方向？</span>
        </div>
        <div className={styles.labControls}>
          <button
            className={`${styles.controlBtn} ${activeTab === 'ground' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('ground')}
          >
            🧭 操场实景罗盘
          </button>
          <button
            className={`${styles.controlBtn} ${activeTab === 'map' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('map')}
          >
            🗺️ 地图上北下南
          </button>
          <button
            className={`${styles.controlBtn} ${activeTab === 'quiz' ? styles.controlBtnActive : ''}`}
            onClick={() => {
              setActiveTab('quiz');
              setFacing(currentQuiz.facing);
            }}
          >
            🎯 考场实战闯关
          </button>
        </div>
      </div>

      {/* 主画布工作区 */}
      <div className={styles.canvasWrapper} style={{ minHeight: '440px', padding: '20px' }}>
        {/* 口诀标语指示条 */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 18px',
              borderRadius: '20px',
              background: '#fef3c7',
              color: '#92400e',
              fontSize: '0.9rem',
              fontWeight: 700,
              border: '1px solid #fde68a',
            }}
          >
            <Sparkles size={15} color="#d97706" />
            <span>{cur.mnemonic}</span>
          </span>
        </div>

        {/* ======================= Tab 1: 操场实景罗盘 ======================= */}
        {activeTab === 'ground' && (
          <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* 转试卷模式开关 */}
            <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setRotatePaperMode(!rotatePaperMode)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: rotatePaperMode ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: rotatePaperMode ? '#eff6ff' : '#ffffff',
                  color: rotatePaperMode ? '#1e40af' : '#475569',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: rotatePaperMode ? '0 2px 8px rgba(37,99,235,0.15)' : 'none',
                }}
              >
                <FileText size={15} color={rotatePaperMode ? '#2563eb' : '#64748b'} />
                <span>考场神器：模拟“转试卷法”（{rotatePaperMode ? '已开启：朝向永远在上方' : '未开启：大地不动视角'}）</span>
              </button>
            </div>

            {/* 360 度罗盘与旋转人物 SVG 容器 */}
            <div
              style={{
                position: 'relative',
                width: '360px',
                height: '360px',
                margin: '0 auto',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #ffffff 40%, #f8fafc 85%, #f1f5f9 100%)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 0 0 1px #e2e8f0',
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: rotatePaperMode ? `rotate(${-cur.angle}deg)` : 'none',
              }}
            >
              <svg viewBox="0 0 360 360" width="100%" height="100%">
                <defs>
                  {/* 视线探照光锥渐变 */}
                  <radialGradient id="viewConeGrad" cx="50%" cy="100%" r="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                  </radialGradient>

                  {/* 罗盘刻度外圈 */}
                  <linearGradient id="compassRing" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>
                </defs>

                {/* 罗盘底盘圆环 */}
                <circle cx="180" cy="180" r="170" fill="none" stroke="url(#compassRing)" strokeWidth="6" />
                <circle cx="180" cy="180" r="160" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="180" cy="180" r="110" fill="none" stroke="#f1f5f9" strokeWidth="1.5" />

                {/* 十字方位轴线 */}
                <line x1="180" y1="20" x2="180" y2="340" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="20" y1="180" x2="340" y2="180" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* 顺时针旋转箭头提示弧线 */}
                <path
                  d="M 230 130 A 70 70 0 0 1 230 230"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />

                {/* ===================== 四个固定地球绝对方位标 ===================== */}
                {/* 北 (上方) */}
                <g transform="translate(180, 24)">
                  <circle cx="0" cy="0" r="16" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                  <text x="0" y="5" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1d4ed8">北</text>
                  <text x="0" y="-20" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="700">⭐ 北极星</text>
                </g>

                {/* 东 (右方) */}
                <g transform="translate(336, 180)">
                  <circle cx="0" cy="0" r="16" fill="#fefce8" stroke="#eab308" strokeWidth="2" />
                  <text x="0" y="5" textAnchor="middle" fontSize="13" fontWeight="900" fill="#a16207">东</text>
                  <text x="0" y="26" textAnchor="middle" fontSize="10" fill="#ca8a04" fontWeight="700">☀️ 晨曦升起</text>
                </g>

                {/* 南 (下方) */}
                <g transform="translate(180, 336)">
                  <circle cx="0" cy="0" r="16" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" />
                  <text x="0" y="5" textAnchor="middle" fontSize="13" fontWeight="900" fill="#b91c1c">南</text>
                  <text x="0" y="24" textAnchor="middle" fontSize="10" fill="#dc2626" fontWeight="700">🔥 向阳温暖</text>
                </g>

                {/* 西 (左方) */}
                <g transform="translate(24, 180)">
                  <circle cx="0" cy="0" r="16" fill="#faf5ff" stroke="#a855f7" strokeWidth="2" />
                  <text x="0" y="5" textAnchor="middle" fontSize="13" fontWeight="900" fill="#7e22ce">西</text>
                  <text x="0" y="26" textAnchor="middle" fontSize="10" fill="#9333ea" fontWeight="700">🌅 夕阳西下</text>
                </g>

                {/* ===================== 中心站立的小朋友（随朝向旋转） ===================== */}
                <g
                  transform={`translate(180, 180) rotate(${cur.angle})`}
                  style={{ transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                  {/* 视线探照光锥 (朝前发射扇形高光) */}
                  <polygon points="0,-25 -70,-150 70,-150" fill="url(#viewConeGrad)" />

                  {/* 前进视线虚线与箭头 */}
                  <line x1="0" y1="-25" x2="0" y2="-140" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" />
                  <polygon points="0,-146 -6,-134 6,-134" fill="#f59e0b" />

                  {/* 身体底座阴影 */}
                  <ellipse cx="0" cy="5" rx="30" ry="12" fill="#94a3b8" fillOpacity="0.25" />

                  {/* 身体外衣 (科技蓝) */}
                  <rect x="-24" y="-12" width="48" height="34" rx="10" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2.5" />

                  {/* 左手手臂 (向左伸展，戴醒目蓝色手环) */}
                  <g transform="translate(-24, 4)">
                    <rect x="-24" y="-6" width="24" height="12" rx="5" fill="#93c5fd" stroke="#2563eb" strokeWidth="1.5" />
                    <rect x="-18" y="-6" width="6" height="12" fill="#2563eb" />
                    <text x="-12" y="18" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1e40af">左手</text>
                  </g>

                  {/* 右手手臂 (向右伸展，戴醒目红色手环) */}
                  <g transform="translate(24, 4)">
                    <rect x="0" y="-6" width="24" height="12" rx="5" fill="#fca5a5" stroke="#dc2626" strokeWidth="1.5" />
                    <rect x="12" y="-6" width="6" height="12" fill="#ef4444" />
                    <text x="12" y="18" textAnchor="middle" fontSize="9" fontWeight="800" fill="#b91c1c">右手</text>
                  </g>

                  {/* 头部 (俯视/侧微俯) */}
                  <circle cx="0" cy="-6" r="20" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />

                  {/* 头发 */}
                  <path d="M -16 -12 Q 0 -26 16 -12 Q 0 -18 -16 -12" fill="#475569" />

                  {/* 眼睛与视线朝向 (向前看) */}
                  <circle cx="-6" cy="-12" r="2.5" fill="#1e293b" />
                  <circle cx="6" cy="-12" r="2.5" fill="#1e293b" />
                  {/* 可爱的向前视线红鼻子 */}
                  <polygon points="0,-16 -3,-12 3,-12" fill="#f87171" />

                  {/* 前后左右随身标签 */}
                  <g transform="translate(0, -42)">
                    <rect x="-22" y="-9" width="44" height="18" rx="4" fill="#f59e0b" />
                    <text x="0" y="4" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#ffffff">前面</text>
                  </g>
                  <g transform="translate(0, 36)">
                    <rect x="-22" y="-9" width="44" height="18" rx="4" fill="#64748b" />
                    <text x="0" y="4" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#ffffff">后面</text>
                  </g>
                </g>
              </svg>
            </div>

            {/* 当前身前身后左右四向对应卡片 (大字高光展示) */}
            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px',
                marginTop: '20px',
              }}
            >
              <div style={{ background: '#ffffff', border: '2px solid #f59e0b', borderRadius: '12px', padding: '12px 10px', textAlign: 'center', boxShadow: '0 2px 6px rgba(245,158,11,0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>👀 眼睛前面是</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#b45309', margin: '4px 0 2px' }}>{cur.front.split(' ')[0]}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{cur.front.split(' ')[1] || ''}</div>
              </div>

              <div style={{ background: '#ffffff', border: '2px solid #64748b', borderRadius: '12px', padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>🎒 后背后面是</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#334155', margin: '4px 0 2px' }}>{cur.back.split(' ')[0]}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{cur.back.split(' ')[1] || ''}</div>
              </div>

              <div style={{ background: '#ffffff', border: '2px solid #2563eb', borderRadius: '12px', padding: '12px 10px', textAlign: 'center', boxShadow: '0 2px 6px rgba(37,99,235,0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>✋ 蓝色左手是</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d4ed8', margin: '4px 0 2px' }}>{cur.left.split(' ')[0]}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{cur.left.split(' ')[1] || ''}</div>
              </div>

              <div style={{ background: '#ffffff', border: '2px solid #ef4444', borderRadius: '12px', padding: '12px 10px', textAlign: 'center', boxShadow: '0 2px 6px rgba(239,68,68,0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: 600 }}>👉 红色右手是</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#dc2626', margin: '4px 0 2px' }}>{cur.right.split(' ')[0]}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{cur.right.split(' ')[1] || ''}</div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= Tab 2: 地图上北下南网格 ======================= */}
        {activeTab === 'map' && (
          <div style={{ width: '100%', maxWidth: '640px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '0.9rem', color: '#475569' }}>
              🌍 地图平面规则：<strong>“上北下南，左西右东”</strong>（以中间的学校为参照中心）
            </div>

            {/* 3x3 互动地图小镇 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'repeat(3, 95px)',
                gap: '12px',
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid #cbd5e1',
              }}
            >
              {/* (0,0) */}
              <div style={{ background: '#ffffff', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1' }}>
                <span style={{ fontSize: '1.2rem' }}>🌲</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>西北森林</span>
              </div>

              {/* 正北：动物园 */}
              <div style={{ background: '#eff6ff', border: '2px solid #3b82f6', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>🐼</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1d4ed8' }}>动物园 (正北)</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>学校的正上方</span>
              </div>

              {/* (0,2) */}
              <div style={{ background: '#ffffff', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1' }}>
                <span style={{ fontSize: '1.2rem' }}>🎡</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>东北乐园</span>
              </div>

              {/* 正西：少年宫 */}
              <div style={{ background: '#fdf4ff', border: '2px solid #a855f7', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>🎨</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#7e22ce' }}>少年宫 (正西)</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>学校的正左方</span>
              </div>

              {/* 中心：学校 */}
              <div style={{ background: '#fef08a', border: '3px solid #ca8a04', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(202,138,4,0.18)' }}>
                <span style={{ fontSize: '1.6rem' }}>🏫</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#854d0e' }}>我的学校 (中心)</span>
                <span style={{ fontSize: '0.7rem', color: '#a16207' }}>以我为观察起点</span>
              </div>

              {/* 正东：图书馆 */}
              <div style={{ background: '#fefce8', border: '2px solid #eab308', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>📚</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#a16207' }}>图书馆 (正东)</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>学校的正右方</span>
              </div>

              {/* (2,0) */}
              <div style={{ background: '#ffffff', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1' }}>
                <span style={{ fontSize: '1.2rem' }}>🌊</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>西南湖泊</span>
              </div>

              {/* 正南：体育馆 */}
              <div style={{ background: '#fef2f2', border: '2px solid #ef4444', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>⚽</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#b91c1c' }}>体育馆 (正南)</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>学校的正下方</span>
              </div>

              {/* (2,2) */}
              <div style={{ background: '#ffffff', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1' }}>
                <span style={{ fontSize: '1.2rem' }}>🏥</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>东南医院</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: '#eff6ff', fontSize: '0.85rem', color: '#1e40af', lineHeight: 1.6 }}>
              💡 <strong>看图提问法</strong>：“从学校出发去动物园往哪走？”（向上走是北）；“去少年宫往哪走？”（向左走是西）；“体育馆在学校的哪一面？”（在下方即南面）。
            </div>
          </div>
        )}

        {/* ======================= Tab 3: 考场实战闯关 ======================= */}
        {activeTab === 'quiz' && (
          <div style={{ width: '100%', maxWidth: '640px' }}>
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #3b82f6',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 16px rgba(37,99,235,0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: '#dbeafe', color: '#1d4ed8' }}>
                  第 {quizIdx + 1} / {QUIZ_LIST.length} 题 · 二年级期中真题
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  观察左侧或下方人物朝向联动
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', lineHeight: 1.5, marginBottom: '20px' }}>
                {currentQuiz.prompt}
              </h3>

              {/* 选项按钮 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {ORDER.map((dir) => {
                  const dInfo = DIRECTIONS[dir];
                  const isSelected = selectedAnswer === dir;
                  const isCorrect = dir === currentQuiz.correctDir;

                  let btnBg = '#f8fafc';
                  let btnBorder = '#cbd5e1';
                  let btnColor = '#1e293b';

                  if (isAnswered) {
                    if (isCorrect) {
                      btnBg = '#ecfdf5';
                      btnBorder = '#10b981';
                      btnColor = '#065f46';
                    } else if (isSelected) {
                      btnBg = '#fef2f2';
                      btnBorder = '#ef4444';
                      btnColor = '#991b1b';
                    }
                  }

                  return (
                    <button
                      key={dir}
                      disabled={isAnswered}
                      onClick={() => handleAnswerQuiz(dir)}
                      style={{
                        padding: '14px 10px',
                        borderRadius: '10px',
                        border: `2px solid ${btnBorder}`,
                        background: btnBg,
                        color: btnColor,
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        cursor: isAnswered ? 'default' : 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {dInfo.name} ({dInfo.pinyin})
                    </button>
                  );
                })}
              </div>

              {/* 答案解析提示卡 */}
              {isAnswered && (
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: '10px',
                    background: selectedAnswer === currentQuiz.correctDir ? '#f0fdf4' : '#fffbeb',
                    border: `1px solid ${selectedAnswer === currentQuiz.correctDir ? '#86efac' : '#fde68a'}`,
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.95rem', color: selectedAnswer === currentQuiz.correctDir ? '#15803d' : '#b45309' }}>
                    {selectedAnswer === currentQuiz.correctDir ? '🎉 恭喜你答对了！' : '💡 别灰心，再想一想：'}
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                    {currentQuiz.explanation}
                  </p>
                </div>
              )}

              {isAnswered && (
                <button
                  onClick={handleNextQuiz}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                  }}
                >
                  下一道挑战题 ➔
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部控制台：快速转身操作栏 */}
      <div className={styles.sliderPanel}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', width: '100%' }}>
          {/* 四个绝对朝向切换 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>点选朝向：</span>
            {ORDER.map((dir) => (
              <button
                key={dir}
                onClick={() => setFacing(dir)}
                className={`${styles.controlBtn} ${facing === dir ? styles.controlBtnActive : ''}`}
                style={{ fontSize: '0.825rem' }}
              >
                {DIRECTIONS[dir].icon} 面向{DIRECTIONS[dir].name}
              </button>
            ))}
          </div>

          {/* 顺时针/逆时针/转身按钮 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleTurnLeft}
              className={styles.controlBtn}
              title="向左转 90° (逆时针)"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <RotateCcw size={15} color="#2563eb" />
              <span>向左转 90°</span>
            </button>
            <button
              onClick={handleTurnRight}
              className={styles.controlBtn}
              title="向右转 90° (顺时针)"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <RotateCw size={15} color="#d97706" />
              <span>向右转 90° (顺时针)</span>
            </button>
            <button
              onClick={handleTurnBack}
              className={styles.controlBtn}
              title="向后转 180°"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <RefreshCw size={15} color="#ef4444" />
              <span>向后转 180°</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
