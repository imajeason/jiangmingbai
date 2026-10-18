'use client';

import React, { useState } from 'react';
import { Volume2, RotateCcw, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import styles from '@/styles/animations.module.css';

interface Preset {
  name: string;
  chickens: number;
  rabbits: number;
  desc: string;
}

const PRESETS: Preset[] = [
  { name: '经典入门', chickens: 3, rabbits: 5, desc: '头 8 个，脚 26 只' },
  { name: '提高进阶', chickens: 4, rabbits: 6, desc: '头 10 个，脚 32 只' },
  { name: '孙子算经原题', chickens: 23, rabbits: 12, desc: '头 35 个，脚 94 只' },
];

export default function ChickenRabbitLab() {
  const [chickenCount, setChickenCount] = useState<number>(3);
  const [rabbitCount, setRabbitCount] = useState<number>(5);

  // 吹哨步骤：0: 正常站立, 1: 吹一次哨(抬1只脚), 2: 吹两次哨(抬2只脚, 鸡屁股着地/脚归零, 兔剩2脚)
  const [whistleStep, setWhistleStep] = useState<number>(0);

  const totalHeads = chickenCount + rabbitCount;
  const initialFeet = chickenCount * 2 + rabbitCount * 4;

  // 当前地面上的脚数
  const currentFeet = initialFeet - whistleStep * totalHeads;

  // 吹哨动作
  const handleWhistle = () => {
    if (whistleStep < 2) {
      setWhistleStep((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setWhistleStep(0);
  };

  const handleApplyPreset = (p: Preset) => {
    setChickenCount(p.chickens);
    setRabbitCount(p.rabbits);
    setWhistleStep(0);
  };

  // 渲染动物小图标 (当数量较多时按比例或展示最多前 12 只，其余折叠汇总提示)
  const maxDisplayAnimals = 12;
  const displayChickens = Math.min(chickenCount, maxDisplayAnimals);
  const displayRabbits = Math.min(rabbitCount, maxDisplayAnimals);

  return (
    <div className={styles.labContainer}>
      {/* 顶部标题 */}
      <div className={styles.labHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.3rem' }}>🐔🐇</span>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            鸡兔同笼实验室：“吹哨抬腿法”神技秒杀
          </h2>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          吹两声口哨，让所有的鸡脚归零，看穿剩下的全是兔子！
        </span>
      </div>

      {/* 核心状态指示条 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        padding: '14px 20px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        textAlign: 'center',
      }}>
        <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>笼中总头数</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e293b' }}>{totalHeads} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>个</span></div>
        </div>
        <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>初始总脚数</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#dc2626' }}>{initialFeet} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>只</span></div>
        </div>
        <div style={{ background: '#eff6ff', padding: '8px 12px', borderRadius: '10px', border: '2px solid #bfdbfe' }}>
          <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>地面剩余着地脚数</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2563eb' }}>{currentFeet} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>只</span></div>
        </div>
      </div>

      <div className={styles.canvasWrapper} style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '24px 20px', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
        {/* 口哨戏剧阶段提示条 */}
        <div style={{ textAlign: 'center', marginBottom: '20px', width: '100%', maxWidth: '620px' }}>
          <span style={{
            display: 'inline-block',
            padding: '8px 20px',
            borderRadius: '20px',
            background: whistleStep === 0 ? '#f1f5f9' : whistleStep === 1 ? '#dbeafe' : '#fef08a',
            color: whistleStep === 0 ? '#475569' : whistleStep === 1 ? '#1d4ed8' : '#854d0e',
            fontSize: '0.925rem',
            fontWeight: 800,
            border: whistleStep === 2 ? '2px solid #eab308' : '1px solid transparent',
            boxShadow: whistleStep === 2 ? '0 4px 12px rgba(234,179,8,0.2)' : 'none',
          }}>
            {whistleStep === 0 && '📢 初始状态：小动物们都安稳站立在草地上（鸡有 2 只脚，兔有 4 只脚）。'}
            {whistleStep === 1 && '🎵 吹响第 1 声哨：每个动物抬起 1 只脚！地上的脚减少了总头数！'}
            {whistleStep === 2 && '🎉 吹响第 2 声哨：每个动物再抬 1 只脚！鸡的脚全悬空（归零）！地上剩下的全是兔子的后脚！'}
          </span>
        </div>

        {/* 动物乐园 SVG 动画舞台 */}
        <div style={{
          width: '100%',
          maxWidth: '640px',
          background: '#ecfdf5',
          border: '2px solid #a7f3d0',
          borderRadius: '20px',
          padding: '24px 16px',
          margin: '0 auto',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)',
        }}>
          {/* 小鸡群展示区 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#065f46', marginBottom: '10px' }}>
              <span>🐥 小鸡小分队：共 {chickenCount} 只</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: whistleStep === 2 ? '#dc2626' : '#059669', background: '#ffffff', padding: '1px 8px', borderRadius: '10px' }}>
                {whistleStep === 0 && '每只踩地 2 脚'}
                {whistleStep === 1 && '金鸡独立 踩地 1 脚 (抬起 1 脚)'}
                {whistleStep === 2 && '两脚全部抬起！着地脚数 = 0 只！'}
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              {Array.from({ length: displayChickens }).map((_, i) => (
                <div
                  key={`c-${i}`}
                  style={{
                    width: '44px',
                    height: '52px',
                    background: '#fef08a',
                    border: '2px solid #facc15',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'all 0.4s ease',
                    transform: whistleStep === 2 ? 'translateY(-6px) rotate(-6deg)' : whistleStep === 1 ? 'translateY(-3px)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🐥</span>
                  <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: whistleStep === 2 ? '#dc2626' : '#854d0e',
                    marginTop: '2px',
                  }}>
                    {whistleStep === 0 ? '2脚' : whistleStep === 1 ? '1脚' : '0脚!'}
                  </div>
                </div>
              ))}
              {chickenCount > maxDisplayAnimals && (
                <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700, padding: '8px' }}>
                  ...等共 {chickenCount} 只鸡
                </div>
              )}
            </div>
          </div>

          {/* 小兔群展示区 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#065f46', marginBottom: '10px' }}>
              <span>🐰 小兔小分队：共 {rabbitCount} 只</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', background: '#ffffff', padding: '1px 8px', borderRadius: '10px' }}>
                {whistleStep === 0 && '每只踩地 4 脚'}
                {whistleStep === 1 && '抬起 1 前爪，踩地 3 脚'}
                {whistleStep === 2 && '两前爪举胸前，稳稳踩地 2 脚！'}
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              {Array.from({ length: displayRabbits }).map((_, i) => (
                <div
                  key={`r-${i}`}
                  style={{
                    width: '44px',
                    height: '52px',
                    background: '#ffffff',
                    border: '2px solid #bfdbfe',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'all 0.4s ease',
                    boxShadow: whistleStep === 2 ? '0 0 10px rgba(59,130,246,0.3)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🐰</span>
                  <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: whistleStep === 2 ? '#2563eb' : '#64748b',
                    marginTop: '2px',
                  }}>
                    {whistleStep === 0 ? '4脚' : whistleStep === 1 ? '3脚' : '剩2腿'}
                  </div>
                </div>
              ))}
              {rabbitCount > maxDisplayAnimals && (
                <div style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: 700, padding: '8px' }}>
                  ...等共 {rabbitCount} 只兔
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 核心算式拆解与顿悟卡片 */}
        <div style={{
          width: '100%',
          maxWidth: '620px',
          margin: '22px auto 0',
          background: '#ffffff',
          borderRadius: '16px',
          border: '2px solid #bfdbfe',
          padding: '18px 22px',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
            吹哨 2 次后的神奇推算：
          </div>

          {whistleStep === 2 ? (
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>
                地上剩下的脚数：{initialFeet} - ({totalHeads} × 2) = <span style={{ color: '#2563eb', fontSize: '1.4rem' }}>{currentFeet}</span> 只
              </div>
              <div style={{
                background: '#eff6ff',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #bfdbfe',
                display: 'inline-block',
                textAlign: 'left',
                fontSize: '0.95rem',
                color: '#1e40af',
                lineHeight: 1.6,
              }}>
                <div>• 因为鸡的两只脚都抬起来了（贡献 0 只脚），所以地上剩下的 {currentFeet} 只脚<strong>全是兔子的后腿</strong>！</div>
                <div>• 每只兔子正好剩 2 只脚，所以：<strong>兔子 = {currentFeet} ÷ 2 = <span style={{ color: '#dc2626', fontSize: '1.2rem', fontWeight: 800 }}>{rabbitCount}</span> 只！</strong></div>
                <div>• 算出兔子后，<strong>鸡 = {totalHeads} - {rabbitCount} = <span style={{ color: '#16a34a', fontSize: '1.2rem', fontWeight: 800 }}>{chickenCount}</span> 只！</strong></div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '16px 0', color: '#64748b', fontSize: '0.95rem' }}>
              点击下方按钮<strong>“吹响第 {whistleStep + 1} 声口哨”</strong>，观察地面脚数的变化！
            </div>
          )}
        </div>
      </div>

      {/* 底部控制台 */}
      <div className={styles.controlsGrid} style={{ marginTop: '20px' }}>
        {/* 预设 */}
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
            选择经典题型案例：
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {PRESETS.map((p) => {
              const isActive = chickenCount === p.chickens && rabbitCount === p.rabbits;
              return (
                <button
                  key={p.name}
                  onClick={() => handleApplyPreset(p)}
                  className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.825rem', padding: '6px 14px' }}
                >
                  {p.name} ({p.desc})
                </button>
              );
            })}
          </div>
        </div>

        {/* 吹哨与复位操作 */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
          <button
            onClick={handleWhistle}
            disabled={whistleStep >= 2}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', fontSize: '0.9rem' }}
          >
            <Volume2 size={18} />
            {whistleStep === 0 && '吹第 1 声哨（每只抬 1 脚）'}
            {whistleStep === 1 && '吹第 2 声哨（鸡全悬空，秒破兔子！）'}
            {whistleStep === 2 && '✨ 已完成 2 次吹哨！'}
          </button>

          <button
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}
          >
            <RotateCcw size={16} />
            动物们放平双脚（复位）
          </button>
        </div>
      </div>
    </div>
  );
}
