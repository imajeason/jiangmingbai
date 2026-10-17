'use client';

import React, { useState } from 'react';
import { Compass, Sun, RotateCw, MapPin, Navigation, Sparkles } from 'lucide-react';
import styles from '@/styles/animations.module.css';

type Direction = 'east' | 'south' | 'west' | 'north';

interface DirInfo {
  key: Direction;
  name: string;
  angle: number; // 旋转角度：面向东 90度, 面向南 180度, 面向西 270度, 面向北 0度
  front: string;
  back: string;
  left: string;
  right: string;
  hint: string;
}

const DIRECTIONS: Record<Direction, DirInfo> = {
  east: {
    key: 'east',
    name: '东',
    angle: 90,
    front: '东 (迎着朝阳)',
    back: '西 (背对夕阳)',
    left: '北',
    right: '南',
    hint: '早晨起来，面对太阳：前东、后西、左北、右南！',
  },
  south: {
    key: 'south',
    name: '南',
    angle: 180,
    front: '南 (最温暖)',
    back: '北 (冷风吹来)',
    left: '东',
    right: '西',
    hint: '面朝南方：前面是南、后面是北、左边是东、右边是西！',
  },
  west: {
    key: 'west',
    name: '西',
    angle: 270,
    front: '西 (面对夕阳)',
    back: '东 (背对朝阳)',
    left: '南',
    right: '北',
    hint: '傍晚面对夕阳：前面是西、后面是东、左边是南、右边是北！',
  },
  north: {
    key: 'north',
    name: '北',
    angle: 0,
    front: '北 (面向北极星)',
    back: '南 (后背朝阳)',
    left: '西',
    right: '东',
    hint: '面向北方：正好和地图一致！前面是北、后面是南、左西右东！',
  },
};

export default function CompassDirectionsLab() {
  const [facing, setFacing] = useState<Direction>('east');
  const [viewMode, setViewMode] = useState<'ground' | 'map'>('ground');

  const cur = DIRECTIONS[facing];

  // 顺时针旋转到下一个方向：东 -> 南 -> 西 -> 北
  const handleRotateClockwise = () => {
    const order: Direction[] = ['east', 'south', 'west', 'north'];
    const nextIdx = (order.indexOf(facing) + 1) % 4;
    setFacing(order[nextIdx]);
  };

  return (
    <div className={styles.labContainer}>
      {/* 顶部标题与说明 */}
      <div className={styles.labHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={20} color="#2563eb" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            认识东南西北实验室：转身后，怎么找方向？
          </h2>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          牢记“顺时针：东 ➔ 南 ➔ 西 ➔ 北”，身体怎么转都不怕！
        </span>
      </div>

      {/* 视图模式切换 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <button
          onClick={() => setViewMode('ground')}
          className={`btn ${viewMode === 'ground' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '6px 16px' }}
        >
          🧍 实景身体视角（人在操场上转）
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '6px 16px' }}
        >
          🗺️ 地图俯视罗盘（上北下南左西右东）
        </button>
      </div>

      <div className={styles.canvasWrapper} style={{ padding: '24px 20px', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
        {/* 口诀高亮条 */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <span style={{
            display: 'inline-block',
            padding: '6px 18px',
            borderRadius: '20px',
            background: '#fef3c7',
            color: '#92400e',
            fontSize: '0.925rem',
            fontWeight: 700,
            border: '1px solid #fde68a',
          }}>
            🌟 {cur.hint}
          </span>
        </div>

        {/* 1. 地面实景身体视角 */}
        {viewMode === 'ground' && (
          <div style={{ position: 'relative', maxWidth: '560px', margin: '0 auto', minHeight: '340px' }}>
            {/* 罗盘与四个固定绝对方位 */}
            <div style={{
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              border: '3px dashed #cbd5e1',
              margin: '0 auto',
              position: 'relative',
              background: '#f8fafc',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.03)',
            }}>
              {/* 四个固定绝对方向标签（天地之间固定不动） */}
              {/* 北（上方） */}
              <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem' }}>
                  北 (N)
                </span>
              </div>
              {/* 南（下方） */}
              <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <span style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem' }}>
                  南 (S)
                </span>
              </div>
              {/* 西（左方） */}
              <div style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', textAlign: 'center' }}>
                <span style={{ background: '#f3e8ff', color: '#6b21a8', padding: '3px 10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem' }}>
                  西 (W)
                </span>
              </div>
              {/* 东（右方） */}
              <div style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', textAlign: 'center' }}>
                <span style={{ background: '#fef08a', color: '#854d0e', padding: '3px 10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem' }}>
                  东 (E) ☀️
                </span>
              </div>

              {/* 中间站立旋转的小人 SVG */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${cur.angle}deg)`,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                width: '120px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg viewBox="0 0 100 100" width="100" height="100">
                  {/* 身体 */}
                  <circle cx="50" cy="50" r="28" fill="#3b82f6" />
                  {/* 面朝前方的箭头鼻标 */}
                  <polygon points="50,14 42,26 58,26" fill="#ef4444" />
                  {/* 头部 */}
                  <circle cx="50" cy="50" r="18" fill="#fed7aa" />
                  {/* 两只眼睛 */}
                  <circle cx="44" cy="45" r="2.5" fill="#1e293b" />
                  <circle cx="56" cy="45" r="2.5" fill="#1e293b" />
                  {/* 伸出的左手臂（向左伸展） */}
                  <rect x="14" y="46" width="16" height="8" rx="4" fill="#60a5fa" />
                  {/* 伸出的右手臂（向右伸展） */}
                  <rect x="70" y="46" width="16" height="8" rx="4" fill="#f87171" />
                </svg>
              </div>

              {/* 身体前后左右对应指示 */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', width: '220px', height: '220px' }}>
                {/* 随着面向动态变化的 4 根虚线发射标 */}
              </div>
            </div>

            {/* 当前身前身后左右四向对应卡片 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              maxWidth: '520px',
              margin: '20px auto 0',
            }}>
              <div style={{ background: '#ffffff', border: '2px solid #3b82f6', borderRadius: '10px', padding: '10px 6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>前面是</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1d4ed8' }}>{cur.front}</div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>后面是</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#475569' }}>{cur.back}</div>
              </div>
              <div style={{ background: '#ffffff', border: '2px solid #10b981', borderRadius: '10px', padding: '10px 6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>左面是</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#047857' }}>{cur.left}</div>
              </div>
              <div style={{ background: '#ffffff', border: '2px solid #ef4444', borderRadius: '10px', padding: '10px 6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>右面是</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#b91c1c' }}>{cur.right}</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. 地图俯视网格探索视角 */}
        {viewMode === 'map' && (
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '12px', fontSize: '0.85rem', color: '#64748b' }}>
              地图看图金律：<strong>“上北下南，左西右东”</strong>
            </div>

            {/* 3x3 地图网格 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(3, 85px)',
              gap: '10px',
              background: '#f1f5f9',
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid #cbd5e1',
            }}>
              {/* (0,0) */}
              <div style={{ background: '#ffffff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                西北 (NW)
              </div>
              {/* 正北：动物园 */}
              <div style={{ background: '#eff6ff', border: '2px solid #93c5fd', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.3rem' }}>🐼</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e40af' }}>动物园 (正北)</span>
              </div>
              {/* (0,2) */}
              <div style={{ background: '#ffffff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                东北 (NE)
              </div>

              {/* 正西：少年宫 */}
              <div style={{ background: '#fdf4ff', border: '2px solid #f0abfc', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.3rem' }}>🎨</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#86198f' }}>少年宫 (正西)</span>
              </div>
              {/* 中心：学校 (我家) */}
              <div style={{ background: '#fef08a', border: '2px solid #ca8a04', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '1.4rem' }}>🏫</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#854d0e' }}>我的学校 (中心)</span>
              </div>
              {/* 正东：图书馆 */}
              <div style={{ background: '#fefce8', border: '2px solid #fde047', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.3rem' }}>📚</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a16207' }}>图书馆 (正东)</span>
              </div>

              {/* (2,0) */}
              <div style={{ background: '#ffffff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                西南 (SW)
              </div>
              {/* 正南：体育馆 */}
              <div style={{ background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.3rem' }}>⚽</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#991b1b' }}>体育馆 (正南)</span>
              </div>
              {/* (2,2) */}
              <div style={{ background: '#ffffff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                东南 (SE)
              </div>
            </div>
          </div>
        )}

        {/* 核心秘诀：顺时针转圈口诀提示卡 */}
        <div style={{
          marginTop: '20px',
          padding: '14px 18px',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '12px',
          maxWidth: '560px',
          margin: '20px auto 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#065f46', fontSize: '0.875rem', marginBottom: '6px' }}>
            <Sparkles size={16} color="#059669" />
            终生受用的判断绝招：顺时针法则
          </div>
          <div style={{ fontSize: '0.85rem', color: '#047857', lineHeight: 1.6 }}>
            不管你朝向哪里，只要按<strong>顺时针方向（右转 90 度）</strong>走一圈，四个方向的顺序永远是：
            <div style={{ fontWeight: 800, marginTop: '4px', fontSize: '0.95rem' }}>
              ➡️ 东 ➔ 南 ➔ 西 ➔ 北 ➔ 东（像钟表指针一样循环！）
            </div>
          </div>
        </div>
      </div>

      {/* 底部朝向选择控制器 */}
      <div className={styles.controlsGrid} style={{ marginTop: '20px' }}>
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>切换人站立的朝向：</span>
          <button
            onClick={() => setFacing('east')}
            className={`btn ${facing === 'east' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.825rem' }}
          >
            面朝东 (迎着早晨太阳)
          </button>
          <button
            onClick={() => setFacing('south')}
            className={`btn ${facing === 'south' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.825rem' }}
          >
            面朝南 (中午向阳)
          </button>
          <button
            onClick={() => setFacing('west')}
            className={`btn ${facing === 'west' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.825rem' }}
          >
            面朝西 (傍晚面对夕阳)
          </button>
          <button
            onClick={() => setFacing('north')}
            className={`btn ${facing === 'north' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.825rem' }}
          >
            面朝北 (面向北极星)
          </button>

          <button
            onClick={handleRotateClockwise}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb', borderColor: '#bfdbfe' }}
          >
            <RotateCw size={15} />
            顺时针转 90°
          </button>
        </div>
      </div>
    </div>
  );
}
