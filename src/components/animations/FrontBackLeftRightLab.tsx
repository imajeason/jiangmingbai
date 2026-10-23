'use client';

import React, { useState } from 'react';
import { RotateCw, Sparkles, ArrowLeft, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';
import styles from '@/styles/animations.module.css';

export default function FrontBackLeftRightLab() {
  // 视角：'back'（背对我们，同向），'front'（面对我们，对向）
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  
  // 动作举手：'none' | 'left' | 'right' | 'both'
  const [raisedHand, setRaisedHand] = useState<'none' | 'left' | 'right' | 'both'>('left');

  // 左右两侧放置的物品
  const [leftItem, setLeftItem] = useState<string>('🍎 苹果');
  const [rightItem, setRightItem] = useState<string>('🍌 香蕉');

  // 切换转身
  const handleToggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  // 举手
  const isLeftHandRaised = raisedHand === 'left' || raisedHand === 'both';
  const isRightHandRaised = raisedHand === 'right' || raisedHand === 'both';

  return (
    <div className={styles.labContainer}>
      {/* 顶部标题与说明 */}
      <div className={styles.labToolbar}>
        <div className={styles.labTitle}>
          <Eye size={18} color="#2563eb" />
          <span>前后左右实验室：面对面时，左右为什么会反过来？</span>
          <span className="badge badge-blue">相对空间认知</span>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          观察乐乐转身时手环的相对位置
        </span>
      </div>

      {/* 核心视角切换控制器 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <button
          onClick={() => setFacing('back')}
          className={`btn ${facing === 'back' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span style={{ fontSize: '1.1rem' }}>🎒</span>
          背对我们（同向视角：与我方向相同）
        </button>
        <button
          onClick={() => setFacing('front')}
          className={`btn ${facing === 'front' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span style={{ fontSize: '1.1rem' }}>🙋</span>
          面对我们（面对面视角：左右刚好相反）
        </button>
      </div>

      <div className={styles.canvasWrapper} style={{ padding: '24px 20px', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
        {/* 当前状态醒目条 */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '20px',
            background: facing === 'back' ? '#dbeafe' : '#fef08a',
            color: facing === 'back' ? '#1e40af' : '#854d0e',
            fontSize: '0.925rem',
            fontWeight: 700,
          }}>
            {facing === 'back'
              ? '✅ 乐乐背对着你：乐乐的左手在左边，右手在右边（和你一模一样！）'
              : '⚠️ 乐乐面对着你：乐乐转过身来了！乐乐的右手在你的左边，左手在你的右边！'}
          </span>
        </div>

        {/* 角色与物品展示台 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px 1fr', alignItems: 'center', maxWidth: '620px', margin: '0 auto', minHeight: '260px' }}>
          {/* 屏幕左侧的区域 */}
          <div style={{
            background: '#f1f5f9',
            border: '2px dashed #94a3b8',
            borderRadius: '16px',
            padding: '20px 14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
              你的屏幕【左侧】
            </div>
            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
              {leftItem}
            </div>
            <div style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              color: facing === 'back' ? '#2563eb' : '#dc2626',
              background: facing === 'back' ? '#eff6ff' : '#fef2f2',
              padding: '4px 8px',
              borderRadius: '8px',
            }}>
              {facing === 'back' ? '在乐乐的【左边】' : '在乐乐的【右边】!'}
            </div>
          </div>

          {/* 中间角色 SVG (乐乐) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <svg viewBox="0 0 200 240" width="180" height="220" style={{ overflow: 'visible' }}>
              {/* 阴影 */}
              <ellipse cx="100" cy="220" rx="45" ry="10" fill="#cbd5e1" opacity="0.6" />

              {/* 身体躯干 */}
              <rect x="70" y="90" width="60" height="75" rx="14" fill="#3b82f6" />
              {/* 领口/背包 */}
              {facing === 'back' ? (
                // 背包
                <rect x="80" y="98" width="40" height="50" rx="8" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="2" />
              ) : (
                // 前胸扣子
                <g>
                  <circle cx="100" cy="110" r="3" fill="#ffffff" />
                  <circle cx="100" cy="125" r="3" fill="#ffffff" />
                  <circle cx="100" cy="140" r="3" fill="#ffffff" />
                </g>
              )}

              {/* 双腿 */}
              <rect x="76" y="160" width="18" height="48" rx="6" fill="#1e293b" />
              <rect x="106" y="160" width="18" height="48" rx="6" fill="#1e293b" />
              {/* 鞋子 */}
              <rect x="72" y="202" width="24" height="12" rx="4" fill="#475569" />
              <rect x="104" y="202" width="24" height="12" rx="4" fill="#475569" />

              {/* 头部 */}
              <circle cx="100" cy="55" r="32" fill="#fed7aa" />
              {/* 头发 */}
              <path d="M 68 50 Q 100 20 132 50 Q 120 28 100 28 Q 80 28 68 50 Z" fill="#451a03" />

              {/* 面部表情：如果是 front 绘制眼睛嘴巴，如果是 back 绘制后脑勺 */}
              {facing === 'front' ? (
                <g>
                  {/* 眼睛 */}
                  <circle cx="88" cy="52" r="3.5" fill="#1e293b" />
                  <circle cx="112" cy="52" r="3.5" fill="#1e293b" />
                  {/* 腮红 */}
                  <circle cx="82" cy="62" r="5" fill="#fca5a5" opacity="0.6" />
                  <circle cx="118" cy="62" r="5" fill="#fca5a5" opacity="0.6" />
                  {/* 微笑嘴巴 */}
                  <path d="M 94 65 Q 100 72 106 65" stroke="#991b1b" strokeWidth="2" fill="none" strokeLinecap="round" />
                </g>
              ) : (
                // 后脑勺头发纹理
                <path d="M 70 45 C 80 70 120 70 130 45 Z" fill="#451a03" />
              )}

              {/* 核心手臂系统：
                  乐乐的【左臂】：戴蓝色手环 (手表)
                  乐乐的【右臂】：戴红色手环 (手串)
                  注意：当背对时，乐乐的左臂在左边(x < 100)；
                  当面对时，乐乐的左臂在右边(x > 100)！
              */}

              {/* 乐乐的真实左手 (蓝色手环) */}
              <g
                style={{
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transformOrigin: facing === 'back' ? '60px 102px' : '140px 102px',
                  transform: isLeftHandRaised
                    ? (facing === 'back' ? 'rotate(155deg)' : 'rotate(-155deg)')
                    : 'none',
                }}
              >
                {facing === 'back' ? (
                  // 背向：左臂在左侧
                  <>
                    <rect x="52" y="94" width="16" height="50" rx="8" fill="#fed7aa" />
                    {/* 蓝色手环标记 */}
                    <rect x="50" y="128" width="20" height="8" rx="2" fill="#2563eb" />
                    <circle cx="60" cy="150" r="9" fill="#fed7aa" />
                    {isLeftHandRaised && (
                      <g stroke="#ea580c" strokeWidth="2" strokeLinecap="round" opacity="0.7">
                        <line x1="56" y1="158" x2="56" y2="163" />
                        <line x1="60" y1="159" x2="60" y2="165" />
                        <line x1="64" y1="158" x2="64" y2="163" />
                      </g>
                    )}
                  </>
                ) : (
                  // 正向：真实左臂在屏幕右侧
                  <>
                    <rect x="132" y="94" width="16" height="50" rx="8" fill="#fed7aa" />
                    {/* 蓝色手环标记 */}
                    <rect x="130" y="128" width="20" height="8" rx="2" fill="#2563eb" />
                    <circle cx="140" cy="150" r="9" fill="#fed7aa" />
                    {isLeftHandRaised && (
                      <g stroke="#ea580c" strokeWidth="2" strokeLinecap="round" opacity="0.7">
                        <line x1="136" y1="158" x2="136" y2="163" />
                        <line x1="140" y1="159" x2="140" y2="165" />
                        <line x1="144" y1="158" x2="144" y2="163" />
                      </g>
                    )}
                  </>
                )}
              </g>

              {/* 乐乐的真实右手 (红色手环) */}
              <g
                style={{
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transformOrigin: facing === 'back' ? '140px 102px' : '60px 102px',
                  transform: isRightHandRaised
                    ? (facing === 'back' ? 'rotate(-155deg)' : 'rotate(155deg)')
                    : 'none',
                }}
              >
                {facing === 'back' ? (
                  // 背向：右臂在右侧
                  <>
                    <rect x="132" y="94" width="16" height="50" rx="8" fill="#fed7aa" />
                    {/* 红色手环标记 */}
                    <rect x="130" y="128" width="20" height="8" rx="2" fill="#dc2626" />
                    <circle cx="140" cy="150" r="9" fill="#fed7aa" />
                    {isRightHandRaised && (
                      <g stroke="#ea580c" strokeWidth="2" strokeLinecap="round" opacity="0.7">
                        <line x1="136" y1="158" x2="136" y2="163" />
                        <line x1="140" y1="159" x2="140" y2="165" />
                        <line x1="144" y1="158" x2="144" y2="163" />
                      </g>
                    )}
                  </>
                ) : (
                  // 正向：真实右臂在屏幕左侧
                  <>
                    <rect x="52" y="94" width="16" height="50" rx="8" fill="#fed7aa" />
                    {/* 红色手环标记 */}
                    <rect x="50" y="128" width="20" height="8" rx="2" fill="#dc2626" />
                    <circle cx="60" cy="150" r="9" fill="#fed7aa" />
                    {isRightHandRaised && (
                      <g stroke="#ea580c" strokeWidth="2" strokeLinecap="round" opacity="0.7">
                        <line x1="56" y1="158" x2="56" y2="163" />
                        <line x1="60" y1="159" x2="60" y2="165" />
                        <line x1="64" y1="158" x2="64" y2="163" />
                      </g>
                    )}
                  </>
                )}
              </g>
            </svg>

            {/* 手环提示标签 */}
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', fontWeight: 700, marginTop: '4px' }}>
              <span style={{ color: '#2563eb', background: '#dbeafe', padding: '2px 6px', borderRadius: '4px' }}>
                🔵 蓝环 = 乐乐的左手
              </span>
              <span style={{ color: '#dc2626', background: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>
                🔴 红环 = 乐乐的右手
              </span>
            </div>
          </div>

          {/* 屏幕右侧的区域 */}
          <div style={{
            background: '#f1f5f9',
            border: '2px dashed #94a3b8',
            borderRadius: '16px',
            padding: '20px 14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
              你的屏幕【右侧】
            </div>
            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
              {rightItem}
            </div>
            <div style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              color: facing === 'back' ? '#dc2626' : '#2563eb',
              background: facing === 'back' ? '#fef2f2' : '#eff6ff',
              padding: '4px 8px',
              borderRadius: '8px',
            }}>
              {facing === 'back' ? '在乐乐的【右边】' : '在乐乐的【左边】!'}
            </div>
          </div>
        </div>

        {/* 屏幕下方的“你自己的双手”参照卡片 */}
        <div style={{
          maxWidth: '560px',
          margin: '24px auto 0',
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px', textAlign: 'center' }}>
            ✋ 伸出你自己的双手来比一比：
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', padding: '8px 16px', background: '#eff6ff', borderRadius: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>🤚</span>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#2563eb' }}>这是你的左手</div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', maxWidth: '240px', textAlign: 'center' }}>
              {facing === 'back'
                ? '乐乐和你面朝同一个方向，乐乐的左手和你的左手在同一边！'
                : '乐乐转过来面对你，乐乐的右手正好对着你的左手！（像握手一样）'}
            </div>
            <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fef2f2', borderRadius: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>✋</span>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#dc2626' }}>这是你的右手</div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部动作控制台 */}
      <div className={styles.controlsGrid} style={{ marginTop: '20px' }}>
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
          <button
            onClick={handleToggleFacing}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px' }}
          >
            <RotateCw size={16} />
            让乐乐转个身（180° 转头）
          </button>

          <button
            onClick={() => setRaisedHand(raisedHand === 'left' ? 'none' : 'left')}
            className={`btn ${raisedHand === 'left' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem' }}
          >
            🙋 举起左手 (蓝手环)
          </button>

          <button
            onClick={() => setRaisedHand(raisedHand === 'right' ? 'none' : 'right')}
            className={`btn ${raisedHand === 'right' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem' }}
          >
            🙋 举起右手 (红手环)
          </button>

          <button
            onClick={() => setRaisedHand(raisedHand === 'both' ? 'none' : 'both')}
            className={`btn ${raisedHand === 'both' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem' }}
          >
            🙌 双手举起
          </button>

          <button
            onClick={() => setRaisedHand('none')}
            className={`btn ${raisedHand === 'none' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem' }}
          >
            放下双手
          </button>
        </div>
      </div>
    </div>
  );
}
