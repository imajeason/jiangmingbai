'use client';

import React, { useState } from 'react';
import styles from '@/styles/animations.module.css';
import { Divide, Sparkles, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface DecimalPreset {
  label: string;
  type: 'pure' | 'mixed' | 'proof9';
  display: string;
  nonRepeatStr: string; // 不循环部分，如 "1" 或 ""
  repeatStr: string;    // 循环节，如 "6" 或 "3"
  m1: number;           // 放大倍数1 (10^(m+k))
  m2: number;           // 放大倍数2 (10^m)
  num: number;          // 分子未约分
  den: number;          // 分母未约分
  simplifiedNum: number;// 最简分子
  simplifiedDen: number;// 最简分母
  desc: string;
}

export default function RepeatingDecimalFractionLab() {
  const presets: DecimalPreset[] = [
    {
      label: '0.333... (纯循环基石)',
      type: 'pure',
      display: '0.3̇',
      nonRepeatStr: '',
      repeatStr: '3',
      m1: 10,
      m2: 1,
      num: 3,
      den: 9,
      simplifiedNum: 1,
      simplifiedDen: 3,
      desc: '单数字纯循环：放大 10 倍减 1 倍，分母恰好为 9！'
    },
    {
      label: '0.999... = 1 (震撼证明)',
      type: 'proof9',
      display: '0.9̇',
      nonRepeatStr: '',
      repeatStr: '9',
      m1: 10,
      m2: 1,
      num: 9,
      den: 9,
      simplifiedNum: 1,
      simplifiedDen: 1,
      desc: '10x - x = 9x = 9 ➔ x = 1！数学上 0.999... 与 1 完全严格同一！'
    },
    {
      label: '0.1818... (双位纯循环)',
      type: 'pure',
      display: '0.1̇8̇',
      nonRepeatStr: '',
      repeatStr: '18',
      m1: 100,
      m2: 1,
      num: 18,
      den: 99,
      simplifiedNum: 2,
      simplifiedDen: 11,
      desc: '两位循环节：放大 100 倍错位相减，分母为 99！'
    },
    {
      label: '0.1666... (经典混循环)',
      type: 'mixed',
      display: '0.16̇',
      nonRepeatStr: '1',
      repeatStr: '6',
      m1: 100,
      m2: 10,
      num: 15,
      den: 90,
      simplifiedNum: 1,
      simplifiedDen: 6,
      desc: '不循环占1位，循环占1位：分子 16-1=15，分母 90，化简为 1/6！'
    },
    {
      label: '0.2777... (混循环考题)',
      type: 'mixed',
      display: '0.27̇',
      nonRepeatStr: '2',
      repeatStr: '7',
      m1: 100,
      m2: 10,
      num: 25,
      den: 90,
      simplifiedNum: 5,
      simplifiedDen: 18,
      desc: '分子 27-2=25，分母 90，约分得 5/18！'
    },
    {
      label: '0.4166... (高阶混循环)',
      type: 'mixed',
      display: '0.416̇',
      nonRepeatStr: '41',
      repeatStr: '6',
      m1: 1000,
      m2: 100,
      num: 375,
      den: 900,
      simplifiedNum: 5,
      simplifiedDen: 12,
      desc: '不循环占2位，循环占1位：分子 416-41=375，分母 900，化简为 5/12！'
    }
  ];

  const [presetIdx, setPresetIdx] = useState<number>(0);
  const [showSubtracted, setShowSubtracted] = useState<boolean>(true);
  const cur = presets[presetIdx];

  // 拼接展开显示的小数尾巴
  const expandDecimal = (nonRep: string, rep: string, count: number = 3) => {
    let s = '0.' + nonRep;
    for (let i = 0; i < count; i++) {
      s += rep;
    }
    return s + '...';
  };

  const val1Str = () => {
    if (cur.type === 'pure' || cur.type === 'proof9') {
      return `${cur.repeatStr}.${cur.repeatStr}${cur.repeatStr}${cur.repeatStr}...`;
    }
    return `${cur.nonRepeatStr}${cur.repeatStr}.${cur.repeatStr}${cur.repeatStr}${cur.repeatStr}...`;
  };

  const val2Str = () => {
    if (cur.type === 'pure' || cur.type === 'proof9') {
      return `0.${cur.repeatStr}${cur.repeatStr}${cur.repeatStr}...`;
    }
    return `${cur.nonRepeatStr}.${cur.repeatStr}${cur.repeatStr}${cur.repeatStr}...`;
  };

  return (
    <div className={styles.labContainer}>
      <div className={styles.labHeader}>
        <div className={styles.labTitle}>
          <Divide size={18} style={{ color: '#0284c7' }} />
          <span>循环小数化分数：分母全9的秘密与借位相消</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {presets.map((p, idx) => (
            <button
              key={idx}
              className={`${styles.controlBtn} ${presetIdx === idx ? styles.controlBtnActive : ''}`}
              onClick={() => {
                setPresetIdx(idx);
                setShowSubtracted(true);
              }}
            >
              {p.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '640px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* 原题展示大看板 */}
          <div style={{
            width: '100%',
            background: cur.type === 'proof9' ? '#fef2f2' : '#f0f9ff',
            padding: '12px 16px',
            borderRadius: '10px',
            borderLeft: `4px solid ${cur.type === 'proof9' ? '#ef4444' : '#0284c7'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: cur.type === 'proof9' ? '#991b1b' : '#0369a1', fontWeight: 700 }}>
                当前探索循环小数：
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: cur.type === 'proof9' ? '#dc2626' : '#0284c7' }}>
                x = {expandDecimal(cur.nonRepeatStr, cur.repeatStr)}
              </div>
            </div>

            <div style={{
              background: '#ffffff',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>目标分数形式</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#16a34a' }}>
                {cur.simplifiedNum === cur.simplifiedDen ? '1' : `${cur.simplifiedNum} / ${cur.simplifiedDen}`}
              </div>
            </div>
          </div>

          {/* 代数错位相减逐步拆解 */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px',
            fontFamily: 'monospace'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '10px', fontFamily: 'sans-serif' }}>
              ✂️ 核心消元法：让无限小尾巴完全对齐并相减归零
            </div>

            {/* 式子1 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: 800, color: '#1d4ed8' }}>① {cur.m1}x</span>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>= {val1Str()}</span>
            </div>

            <div style={{ textAlign: 'center', color: '#ef4444', fontWeight: 900, fontSize: '0.9rem', margin: '4px 0' }}>
              － (减去)
            </div>

            {/* 式子2 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: 800, color: '#0369a1' }}>② {cur.m2 === 1 ? '' : cur.m2}x</span>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>= {val2Str()}</span>
            </div>

            {/* 横线与相减结果 */}
            <div style={{ height: '2px', background: '#3b82f6', margin: '10px 0' }} />

            <div style={{
              padding: '10px 14px',
              background: '#ecfdf5',
              borderRadius: '8px',
              border: '1.5px solid #86efac',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#065f46', fontFamily: 'sans-serif', fontWeight: 700 }}>
                  无限小尾巴完全抵消：
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#15803d' }}>
                  ({cur.m1} - {cur.m2})x = {cur.den}x = {cur.num}
                </div>
              </div>

              <div style={{ textAlign: 'right', fontFamily: 'sans-serif' }}>
                <span style={{ fontSize: '0.75rem', color: '#065f46' }}>化简解得</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#166534' }}>
                  x = {cur.simplifiedNum === cur.simplifiedDen ? '1' : `${cur.simplifiedNum}/${cur.simplifiedDen}`}
                </div>
              </div>
            </div>
          </div>

          {/* 公式提炼速查卡 */}
          <div style={{
            marginTop: '14px',
            width: '100%',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            padding: '12px 14px',
            borderRadius: '8px',
            fontSize: '0.825rem',
            color: '#92400e',
            lineHeight: 1.6
          }}>
            <strong>【速算极速心诀】：</strong>
            <br />
            • <strong>分母规则</strong>：循环节有几位写几个 <strong>9</strong>，不循环部分有几位添几个 <strong>0</strong>；
            <br />
            • <strong>分子规则</strong>：全部有效数字减去 <strong>不循环部分数字</strong>（即 {cur.type === 'pure' ? `${cur.num} - 0 = ${cur.num}` : `${cur.nonRepeatStr}${cur.repeatStr} - ${cur.nonRepeatStr} = ${cur.num}`}）；
            <br />
            • 本例套用：{cur.num} / {cur.den} = <strong>{cur.simplifiedNum === cur.simplifiedDen ? '1' : `${cur.simplifiedNum}/${cur.simplifiedDen}`}</strong>！
          </div>
        </div>
      </div>
    </div>
  );
}

