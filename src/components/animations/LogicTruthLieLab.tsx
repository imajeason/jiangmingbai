'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { ShieldAlert, UserCheck, AlertTriangle, CheckCircle, HelpCircle, Key, RefreshCw } from 'lucide-react';

export default function LogicTruthLieLab() {
  const [testSuspect, setTestSuspect] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [showContradiction, setShowContradiction] = useState<boolean>(false);

  // 设定情景：打碎花瓶的人是谁？
  // 规则：四人中【只有 1 个人说了真话】，另外 3 人都在说谎！
  // 四人的证词：
  // 甲：“是乙打碎的。”
  // 乙：“是丁打碎的。”
  // 丙：“不是我打碎的。”
  // 丁：“乙在说谎（不是我打碎的）。”

  // 判断每个人在假设 culprit 下说的是真是假
  const evaluateStatements = (culprit: 'A' | 'B' | 'C' | 'D') => {
    const isA_True = culprit === 'B'; // 甲说：是乙
    const isB_True = culprit === 'D'; // 乙说：是丁
    const isC_True = culprit !== 'C'; // 丙说：不是我
    const isD_True = culprit !== 'D'; // 丁说：不是我（乙说谎）

    const trueCount = [isA_True, isB_True, isC_True, isD_True].filter(Boolean).length;
    return {
      A: isA_True,
      B: isB_True,
      C: isC_True,
      D: isD_True,
      trueCount,
      isValid: trueCount === 1,
    };
  };

  const currentResult = testSuspect ? evaluateStatements(testSuspect) : null;

  return (
    <div className={styles.labContainer}>
      {/* 顶部工具栏 */}
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <ShieldAlert size={18} style={{ color: '#dc2626' }} />
          <span>逻辑推理：矛盾法则与假设法（神探断案）</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`${styles.controlBtn} ${showContradiction ? styles.controlBtnActive : ''}`}
            onClick={() => setShowContradiction(!showContradiction)}
          >
            <Key size={14} />
            <span>{showContradiction ? '隐藏矛盾透视镜' : '开启【矛盾对立】神技'}</span>
          </button>
          <button
            className={styles.controlBtn}
            onClick={() => { setTestSuspect(null); setShowContradiction(false); }}
          >
            <RefreshCw size={14} />
            <span>重置案件</span>
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* 案情看板 */}
        <div style={{
          width: '100%',
          maxWidth: '640px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            background: '#fef2f2',
            padding: '12px 14px',
            borderRadius: '8px',
            borderLeft: '4px solid #ef4444',
            fontSize: '0.875rem',
            color: '#991b1b',
            lineHeight: 1.6
          }}>
            <strong>【案发现场】：</strong>
            教室的花瓶被打碎了。老师询问甲、乙、丙、丁四人，已知<strong>四人中只有 1 人说了真话</strong>，另外 3 人全都在说谎！
            到底是谁打碎了花瓶？
          </div>

          {/* 矛盾法则提示高亮卡 */}
          {showContradiction && (
            <div style={{
              marginTop: '12px',
              padding: '12px 14px',
              background: '#fefce8',
              borderRadius: '8px',
              border: '1.5px dashed #eab308',
              fontSize: '0.825rem',
              color: '#854d0e',
              lineHeight: 1.6
            }}>
              <div style={{ fontWeight: 800, color: '#a16207', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={16} />
                <span>侦探绝杀招式：寻找“互相对立”的一对！</span>
              </div>
              <div style={{ marginTop: '4px' }}>
                仔细看 <strong>乙</strong>（“是丁干的”）和 <strong>丁</strong>（“不是我干的”）：
                他们两个说的话<strong>非此即彼、不可调和</strong>！
                <br />
                因此：<strong>乙和丁之间必定【一真一假】</strong>！
                <br />
                既然全场【唯一的真话】已经被乙或丁占去了，那么 <strong>甲 和 丙 说的必定全是假话</strong>！
                <br />
                👉 丙说“不是我打碎的”是假话，反过来就是：<strong>花瓶正是丙打碎的</strong>！一步直接抓出真凶！
              </div>
            </div>
          )}

          {/* 四位嫌疑人证词卡片 */}
          <div style={{
            marginTop: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '12px'
          }}>
            {/* 甲 */}
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1.5px solid',
              borderColor: currentResult ? (currentResult.A ? '#22c55e' : '#ef4444') : '#e2e8f0',
              background: currentResult ? (currentResult.A ? '#f0fdf4' : '#fef2f2') : '#f8fafc',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>嫌疑人 甲</span>
                {currentResult && (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    color: '#fff',
                    background: currentResult.A ? '#16a34a' : '#dc2626'
                  }}>
                    {currentResult.A ? '真话 ✔️' : '谎话 ❌'}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '6px' }}>
                “是 <strong>乙</strong> 打碎的。”
              </div>
            </div>

            {/* 乙 */}
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1.5px solid',
              borderColor: showContradiction ? '#eab308' : currentResult ? (currentResult.B ? '#22c55e' : '#ef4444') : '#e2e8f0',
              background: showContradiction ? '#fffbeb' : currentResult ? (currentResult.B ? '#f0fdf4' : '#fef2f2') : '#f8fafc',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                  嫌疑人 乙 {showContradiction && <span style={{ color: '#d97706', fontSize: '0.75rem' }}>(矛盾对立方1)</span>}
                </span>
                {currentResult && (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    color: '#fff',
                    background: currentResult.B ? '#16a34a' : '#dc2626'
                  }}>
                    {currentResult.B ? '真话 ✔️' : '谎话 ❌'}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '6px' }}>
                “是 <strong>丁</strong> 打碎的。”
              </div>
            </div>

            {/* 丙 */}
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1.5px solid',
              borderColor: currentResult ? (currentResult.C ? '#22c55e' : '#ef4444') : '#e2e8f0',
              background: currentResult ? (currentResult.C ? '#f0fdf4' : '#fef2f2') : '#f8fafc',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>嫌疑人 丙</span>
                {currentResult && (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    color: '#fff',
                    background: currentResult.C ? '#16a34a' : '#dc2626'
                  }}>
                    {currentResult.C ? '真话 ✔️' : '谎话 ❌'}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '6px' }}>
                “<strong>不是我</strong> 打碎的。”
              </div>
            </div>

            {/* 丁 */}
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1.5px solid',
              borderColor: showContradiction ? '#eab308' : currentResult ? (currentResult.D ? '#22c55e' : '#ef4444') : '#e2e8f0',
              background: showContradiction ? '#fffbeb' : currentResult ? (currentResult.D ? '#f0fdf4' : '#fef2f2') : '#f8fafc',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                  嫌疑人 丁 {showContradiction && <span style={{ color: '#d97706', fontSize: '0.75rem' }}>(矛盾对立方2)</span>}
                </span>
                {currentResult && (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    color: '#fff',
                    background: currentResult.D ? '#16a34a' : '#dc2626'
                  }}>
                    {currentResult.D ? '真话 ✔️' : '谎话 ❌'}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '6px' }}>
                “乙在说谎（<strong>不是我</strong> 打碎的）。”
              </div>
            </div>
          </div>

          {/* 假设推导校验面板 */}
          {testSuspect && currentResult && (
            <div style={{
              marginTop: '16px',
              padding: '14px',
              borderRadius: '8px',
              border: `1.5px solid ${currentResult.isValid ? '#22c55e' : '#ef4444'}`,
              background: currentResult.isValid ? '#f0fdf4' : '#fef2f2'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {currentResult.isValid ? (
                  <CheckCircle size={20} style={{ color: '#16a34a' }} />
                ) : (
                  <AlertTriangle size={20} style={{ color: '#dc2626' }} />
                )}
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: currentResult.isValid ? '#15803d' : '#991b1b' }}>
                  {currentResult.isValid
                    ? `【假设成立！】真凶正是：${testSuspect}！`
                    : `【逻辑矛盾！排除假设】此时共有 ${currentResult.trueCount} 个人说了真话！`}
                </span>
              </div>
              <div style={{ fontSize: '0.825rem', marginTop: '6px', color: currentResult.isValid ? '#166534' : '#7f1d1d', lineHeight: 1.6 }}>
                {currentResult.isValid ? (
                  <span>
                    当犯人是 <strong>丙</strong> 时：
                    甲说谎（说乙）、乙说谎（说丁）、丙说谎（谎称不是自己）、<strong>只有丁说了真话（确实不是丁）</strong>！
                    完美符合“只有 1 人说了真话”的约束条件，案情破获！
                  </span>
                ) : (
                  <span>
                    题目明确规定【只有 1 人说真话】。当假设是 <strong>{testSuspect}</strong> 时，
                    出现了 <strong>{currentResult.trueCount} 个真话</strong>，与题目已知条件产生不可调和的逻辑冲突！因此断定不是 {testSuspect}！
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 假设法交互控制器 */}
        <div style={{
          marginTop: '16px',
          width: '100%',
          maxWidth: '640px',
          background: '#ffffff',
          padding: '14px 18px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
            🕵️ 动手使用【假设法】逐一排查嫌疑人：
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className={`${styles.controlBtn} ${testSuspect === 'A' ? styles.controlBtnActive : ''}`}
              onClick={() => setTestSuspect('A')}
            >
              假设是【甲】打碎的
            </button>
            <button
              className={`${styles.controlBtn} ${testSuspect === 'B' ? styles.controlBtnActive : ''}`}
              onClick={() => setTestSuspect('B')}
            >
              假设是【乙】打碎的
            </button>
            <button
              className={`${styles.controlBtn} ${testSuspect === 'C' ? styles.controlBtnActive : ''}`}
              onClick={() => setTestSuspect('C')}
            >
              假设是【丙】打碎的 (锁定真凶)
            </button>
            <button
              className={`${styles.controlBtn} ${testSuspect === 'D' ? styles.controlBtnActive : ''}`}
              onClick={() => setTestSuspect('D')}
            >
              假设是【丁】打碎的
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

