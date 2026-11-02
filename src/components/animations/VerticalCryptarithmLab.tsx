'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { KeyRound, Sparkles, HelpCircle, CheckCircle2, ArrowRight, Lightbulb, Search } from 'lucide-react';

export default function VerticalCryptarithmLab() {
  const [activeTab, setActiveTab] = useState<'multiplication' | 'addition'>('multiplication');

  // 乘法数谜状态：2 [A] 6 × [B] = 1 8 8 8
  // 目标解：A = 3, B = 8
  const [multStep, setMultStep] = useState<number>(0);

  // 加法数谜状态：两个三位数相加得四位数
  //   [ A ] [ B ] [ C ]
  // + [ D ] [ E ] [ F ]
  // -------------------
  // [ 1 ] [ ... ]
  const [addStep, setAddStep] = useState<number>(0);

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <KeyRound size={18} style={{ color: '#8b5cf6' }} />
          <span>竖式数谜与虫食算：突破首尾两端的数字密码</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${activeTab === 'multiplication' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('multiplication')}
          >
            <Sparkles size={14} />
            <span>乘法数谜 (首尾夹击法)</span>
          </button>
          <button
            className={`${styles.controlBtn} ${activeTab === 'addition' ? styles.controlBtnActive : ''}`}
            onClick={() => setActiveTab('addition')}
          >
            <Lightbulb size={14} />
            <span>加法数谜 (最高位进位只能是1)</span>
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* TAB 1: 乘法数谜首尾夹击 */}
        {activeTab === 'multiplication' && (
          <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              width: '100%'
            }}>
              <div style={{
                background: '#faf5ff',
                padding: '10px 14px',
                borderRadius: '8px',
                borderLeft: '4px solid #a855f7',
                fontSize: '0.875rem',
                color: '#6b21a8',
                lineHeight: 1.6
              }}>
                <strong>【经典乘法虫食算】：</strong>
                请破解竖式中的空格 A 和 B，每个方框代表一个 0~9 的数字：
                <br />
                <strong>2 [ A ] 6 × [ B ] = 1 8 8 8</strong>。
                很多孩子不知道从哪看起，在草稿纸上从 1 试到 9。其实只要“看个位”加“看首位”，2 秒直接秒杀！
              </div>

              {/* 竖式大黑板 */}
              <div style={{
                marginTop: '16px',
                padding: '20px',
                background: '#0f172a',
                borderRadius: '12px',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontFamily: 'monospace'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '220px' }}>
                  {/* 第 1 行：被乘数 2 [A] 6 */}
                  <div style={{ display: 'flex', gap: '8px', fontSize: '1.8rem', fontWeight: 800 }}>
                    <span style={{ width: '32px', textAlign: 'center', color: '#94a3b8' }}>2</span>
                    <span style={{
                      width: '36px',
                      height: '42px',
                      textAlign: 'center',
                      lineHeight: '42px',
                      borderRadius: '6px',
                      background: multStep >= 3 ? '#22c55e' : '#334155',
                      color: multStep >= 3 ? '#ffffff' : '#facc15',
                      border: '2px dashed #94a3b8'
                    }}>
                      {multStep >= 3 ? '3' : 'A'}
                    </span>
                    <span style={{ width: '32px', textAlign: 'center', color: '#94a3b8' }}>6</span>
                  </div>

                  {/* 第 2 行：乘数 × [B] */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
                    <span style={{ color: '#cbd5e1' }}>×</span>
                    <span style={{ width: '32px', textAlign: 'center', opacity: 0 }}></span>
                    <span style={{
                      width: '36px',
                      height: '42px',
                      textAlign: 'center',
                      lineHeight: '42px',
                      borderRadius: '6px',
                      background: multStep >= 2 ? '#3b82f6' : (multStep === 1 ? '#854d0e' : '#334155'),
                      color: '#ffffff',
                      border: multStep === 1 ? '2px solid #eab308' : '2px dashed #94a3b8'
                    }}>
                      {multStep >= 2 ? '8' : (multStep === 1 ? '3/8?' : 'B')}
                    </span>
                  </div>

                  {/* 分割线 */}
                  <div style={{ width: '100%', height: '3px', background: '#64748b', margin: '12px 0' }}></div>

                  {/* 积：1 8 8 8 */}
                  <div style={{ display: 'flex', gap: '8px', fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8' }}>
                    <span style={{ width: '32px', textAlign: 'center' }}>1</span>
                    <span style={{ width: '32px', textAlign: 'center' }}>8</span>
                    <span style={{ width: '32px', textAlign: 'center' }}>8</span>
                    <span style={{ width: '32px', textAlign: 'center' }}>8</span>
                  </div>
                </div>
              </div>

              {/* 侦探破案三步指南 */}
              <div style={{
                marginTop: '16px',
                padding: '14px',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                {multStep === 0 && (
                  <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>侦探第一步：千万别乱猜！从哪里撕开缺口？</div>
                    面对竖式数谜，<strong>最脆弱的永远是【个位】和【最高位】</strong>！
                    点击下方【第 1 步：看个位尾数】，看看乘法口诀怎么帮你缩小嫌疑人范围。
                  </div>
                )}

                {multStep === 1 && (
                  <div style={{ fontSize: '0.85rem', color: '#1e293b', lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 700, color: '#854d0e', fontSize: '0.9rem' }}>第 1 步：末位突破（6 × B 尾数是 8）</div>
                    想一想 6 的乘法口诀，谁乘 6 的尾数是 8？
                    <br />
                    • 3 × 6 = 18（尾数是 8）
                    <br />
                    • 8 × 6 = 48（尾数也是 8）
                    <br />
                    👉 嫌疑人立刻从 10 个人缩窄到了 <strong>两个可能：B 只能是 3 或者 8</strong>！
                  </div>
                )}

                {multStep === 2 && (
                  <div style={{ fontSize: '0.85rem', color: '#1e40af', lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '0.9rem' }}>第 2 步：首位极值限制（2 × B 怎么变成 18？）</div>
                    看最高位：被乘数是两百多（2xx），乘出来的积高达一千八百多（1888）！
                    <br />
                    • 如果 B = 3：200 × 3 只有 600，就算加上全部进位也撑死到八九百，<strong>绝对不可能达到 1800</strong>！
                    <br />
                    • 因此：<strong>B 绝不能是 3，只能是 8</strong>！
                    <br />
                    👉 乘数 B = <strong>8</strong> 锁定！
                  </div>
                )}

                {multStep === 3 && (
                  <div style={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.9rem' }}>第 3 步：十位逆推算 A（1888 ÷ 8 一步还原）</div>
                    既然知道了乘数是 8，整个竖式直接变成一道简单的除法：
                    <br />
                    2 [ A ] 6 = 1888 ÷ 8 = <strong>236</strong>！
                    <br />
                    👉 空格 A = <strong>3</strong>，空格 B = <strong>8</strong>！
                    <br />
                    验算：236 × 8 = 1888，严丝合缝，全盘破译！
                  </div>
                )}
              </div>
            </div>

            {/* 控制器 */}
            <div style={{
              marginTop: '16px',
              width: '100%',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <button
                className={`${styles.controlBtn} ${multStep === 0 ? styles.controlBtnActive : ''}`}
                onClick={() => setMultStep(0)}
              >
                0. 原始谜题
              </button>
              <button
                className={`${styles.controlBtn} ${multStep === 1 ? styles.controlBtnActive : ''}`}
                onClick={() => setMultStep(1)}
              >
                1. 末位定候选 (B是3或8)
              </button>
              <button
                className={`${styles.controlBtn} ${multStep === 2 ? styles.controlBtnActive : ''}`}
                onClick={() => setMultStep(2)}
              >
                2. 首位极值定 B (B必为8)
              </button>
              <button
                className={`${styles.controlBtn} ${multStep === 3 ? styles.controlBtnActive : ''}`}
                onClick={() => setMultStep(3)}
              >
                3. 还原求出 A (A=3)
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: 加法数谜进位只能是1 */}
        {activeTab === 'addition' && (
          <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              width: '100%'
            }}>
              <div style={{
                background: '#eff6ff',
                padding: '10px 14px',
                borderRadius: '8px',
                borderLeft: '4px solid #3b82f6',
                fontSize: '0.875rem',
                color: '#1e40af',
                lineHeight: 1.6
              }}>
                <strong>【加法数谜的第一铁律】：</strong>
                两个三位数相加，结果变成了一个四位数：
                <br />
                <strong>[ A ][ B ][ C ] + [ D ][ E ][ F ] = [ G ][ H ][ I ][ J ]</strong>
                <br />
                请问：最高位 G 可能是几？
              </div>

              {/* 动效展示：极值极限推演 */}
              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  极限思维：假设每个数位都是最大的数字 9
                </div>

                <div style={{
                  marginTop: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  fontFamily: 'monospace',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: '#0f172a'
                }}>
                  <div>&nbsp; 9 9 9</div>
                  <div>+ 9 9 9</div>
                  <div style={{ width: '120px', height: '2px', background: '#0f172a', margin: '6px 0' }}></div>
                  <div style={{ color: '#dc2626' }}>
                    <span style={{
                      background: '#fee2e2',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid #ef4444'
                    }}>
                      1
                    </span> 9 9 8
                  </div>
                </div>

                <div style={{
                  marginTop: '16px',
                  padding: '12px 14px',
                  background: '#fef2f2',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                  fontSize: '0.825rem',
                  color: '#991b1b',
                  lineHeight: 1.6,
                  width: '100%'
                }}>
                  <strong>🔥 黄金铁律结论：</strong>
                  哪怕每一位都取最大的 9，999 + 999 也不过才 <strong>1998</strong>！
                  <br />
                  两个数相加，任何数位最多只能向上一位<strong>进 1</strong>，绝对不可能进 2！
                  <br />
                  👉 所以：<strong>只要位数膨胀（三位数加三位数变四位数），最高位千位必定是 1</strong>！
                  这是所有汉字数谜（如“兵兵乓乓 + 乒乒乓乓”）的第一凿！
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

