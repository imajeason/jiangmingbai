'use client';

import React, { useState } from 'react';

export default function RadiantNumberArrayLab() {
  const [modelType, setModelType] = useState<'triangle' | 'cross'>('triangle');
  const [vertexChoice, setVertexChoice] = useState<'min' | 'max'>('min');
  const [showFormula, setShowFormula] = useState<boolean>(false);

  // Triangle configuration with 1~6:
  // If min: vertices are 1, 2, 3; remaining are 4, 5, 6
  // Edges: between 1 and 2 is 6 (sum = 9)
  // between 2 and 3 is 4 (sum = 9)
  // between 3 and 1 is 5 (sum = 9)
  // If max: vertices are 4, 5, 6; remaining are 1, 2, 3
  // Edges: between 4 and 5 is 3 (sum = 12)
  // between 5 and 6 is 1 (sum = 12)
  // between 6 and 4 is 2 (sum = 12)

  const isMin = vertexChoice === 'min';
  const triV1 = isMin ? 1 : 4;
  const triV2 = isMin ? 2 : 5;
  const triV3 = isMin ? 3 : 6;
  const triE12 = isMin ? 6 : 3;
  const triE23 = isMin ? 4 : 1;
  const triE31 = isMin ? 5 : 2;
  const triSideSum = isMin ? 9 : 12;

  // Cross configuration with 1~5:
  // center can be 1, 3, 5
  // If center=3: horizontal=1,3,5 (sum 9), vertical=2,3,4 (sum 9)
  // If center=1: horizontal=2,1,5 (sum 8), vertical=3,1,4 (sum 8)
  // If center=5: horizontal=1,5,4 (sum 10), vertical=2,5,3 (sum 10)
  const [crossCenter, setCrossCenter] = useState<number>(3);
  const getCrossArms = (center: number) => {
    if (center === 1) return { h1: 2, h2: 5, v1: 3, v2: 4, sum: 8 };
    if (center === 5) return { h1: 1, h2: 4, v1: 2, v2: 3, sum: 10 };
    return { h1: 1, h2: 5, v1: 2, v2: 4, sum: 9 };
  };
  const crossData = getCrossArms(crossCenter);

  return (
    <div style={{
      width: '100%',
      maxWidth: '780px',
      margin: '0 auto',
      padding: '20px',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* 头部标题 */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: '0 0 6px 0' }}>
          数阵图与交叉点法则：为什么公共数决定全局？
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          三角形数阵与十字星辐射：交叉点被重复计算了一次！抓住“重叠数方程”，秒杀奥数数阵图。
        </p>
      </div>

      {/* 画布区域 */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '340px'
      }}>
        {modelType === 'triangle' ? (
          /* 三角形数阵图 */
          <svg viewBox="0 0 320 280" style={{ width: '100%', maxWidth: '320px', overflow: 'visible' }}>
            {/* 三角形连线 */}
            <line x1="160" y1="40" x2="60" y2="220" stroke="#cbd5e1" strokeWidth="4" />
            <line x1="160" y1="40" x2="260" y2="220" stroke="#cbd5e1" strokeWidth="4" />
            <line x1="60" y1="220" x2="260" y2="220" stroke="#cbd5e1" strokeWidth="4" />

            {/* 三条边的和标记 */}
            <text x="90" y="115" fill="#2563eb" fontSize="12" fontWeight="800">和={triSideSum}</text>
            <text x="210" y="115" fill="#2563eb" fontSize="12" fontWeight="800">和={triSideSum}</text>
            <text x="160" y="245" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="800">和={triSideSum}</text>

            {/* 顶点圆圈（被算2次，高亮橙色） */}
            <circle cx="160" cy="40" r="18" fill="#ea580c" stroke="#c2410c" strokeWidth="2.5" />
            <text x="160" y="46" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="800">{triV1}</text>
            <text x="160" y="18" textAnchor="middle" fill="#ea580c" fontSize="10" fontWeight="700">顶点(重复算2次)</text>

            <circle cx="60" cy="220" r="18" fill="#ea580c" stroke="#c2410c" strokeWidth="2.5" />
            <text x="60" y="226" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="800">{triV2}</text>

            <circle cx="260" cy="220" r="18" fill="#ea580c" stroke="#c2410c" strokeWidth="2.5" />
            <text x="260" y="226" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="800">{triV3}</text>

            {/* 边中点圆圈（只算1次，蓝色） */}
            <circle cx="110" cy="130" r="16" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
            <text x="110" y="136" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="800">{triE12}</text>

            <circle cx="210" cy="130" r="16" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
            <text x="210" y="136" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="800">{triE31}</text>

            <circle cx="160" cy="220" r="16" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
            <text x="160" y="226" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="800">{triE23}</text>
          </svg>
        ) : (
          /* 十字星数阵图 */
          <svg viewBox="0 0 320 280" style={{ width: '100%', maxWidth: '320px', overflow: 'visible' }}>
            {/* 交叉十字线 */}
            <line x1="60" y1="140" x2="260" y2="140" stroke="#cbd5e1" strokeWidth="4" />
            <line x1="160" y1="40" x2="160" y2="240" stroke="#cbd5e1" strokeWidth="4" />

            {/* 横线和竖线和 */}
            <text x="270" y="145" fill="#059669" fontSize="12" fontWeight="800">横和={crossData.sum}</text>
            <text x="160" y="265" textAnchor="middle" fill="#059669" fontSize="12" fontWeight="800">竖和={crossData.sum}</text>

            {/* 中心交叉点（被算2次，高亮橙色） */}
            <circle cx="160" cy="140" r="20" fill="#ea580c" stroke="#c2410c" strokeWidth="3" />
            <text x="160" y="147" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="800">{crossCenter}</text>
            <text x="160" y="112" textAnchor="middle" fill="#ea580c" fontSize="10" fontWeight="700">中心数(横竖共享)</text>

            {/* 四周端点（只算1次，绿色） */}
            <circle cx="80" cy="140" r="16" fill="#10b981" stroke="#059669" strokeWidth="2" />
            <text x="80" y="146" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="800">{crossData.h1}</text>

            <circle cx="240" cy="140" r="16" fill="#10b981" stroke="#059669" strokeWidth="2" />
            <text x="240" y="146" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="800">{crossData.h2}</text>

            <circle cx="160" cy="60" r="16" fill="#10b981" stroke="#059669" strokeWidth="2" />
            <text x="160" y="66" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="800">{crossData.v1}</text>

            <circle cx="160" cy="220" r="16" fill="#10b981" stroke="#059669" strokeWidth="2" />
            <text x="160" y="226" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="800">{crossData.v2}</text>
          </svg>
        )}

        {/* 算理方程条 */}
        <div style={{
          marginTop: '16px',
          padding: '12px 18px',
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          width: '100%',
          maxWidth: '520px',
          textAlign: 'center'
        }}>
          {modelType === 'triangle' ? (
            <div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '4px' }}>
                总和方程：3 条边相加 = (1+2+3+4+5+6) + 3个顶点数 = 21 + ({triV1}+{triV2}+{triV3}) = {3 * triSideSum}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1d4ed8' }}>
                每条边之和 = {3 * triSideSum} ÷ 3 = <span style={{ fontSize: '1.35rem', color: '#ea580c' }}>{triSideSum}</span>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '4px' }}>
                总和方程：横线 + 竖线 = (1+2+3+4+5) + 中心数 = 15 + {crossCenter} = {2 * crossData.sum}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#047857' }}>
                每条线之和 = (15 + {crossCenter}) ÷ 2 = <span style={{ fontSize: '1.35rem', color: '#ea580c' }}>{crossData.sum}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 控制栏 */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* 模型切换 */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setModelType('triangle')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: modelType === 'triangle' ? '#2563eb' : '#f1f5f9',
              color: modelType === 'triangle' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            📐 三角形数阵 (1~6填入)
          </button>
          <button
            onClick={() => setModelType('cross')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: modelType === 'cross' ? '#059669' : '#f1f5f9',
              color: modelType === 'cross' ? '#fff' : '#334155',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            ➕ 十字星数阵 (1~5填入)
          </button>
        </div>

        {/* 顶点/中心切换 */}
        {modelType === 'triangle' ? (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setVertexChoice('min')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: isMin ? '#ea580c' : '#f8fafc',
                color: isMin ? '#fff' : '#475569',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              顶点填最小数 (1,2,3 ➔ 边和9)
            </button>
            <button
              onClick={() => setVertexChoice('max')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: !isMin ? '#ea580c' : '#f8fafc',
                color: !isMin ? '#fff' : '#475569',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              顶点填最大数 (4,5,6 ➔ 边和12)
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>中心数:</span>
            {[1, 3, 5].map((c) => (
              <button
                key={c}
                onClick={() => setCrossCenter(c)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: crossCenter === c ? '#ea580c' : '#f1f5f9',
                  color: crossCenter === c ? '#fff' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer'
                }}
              >
                {c} (线和{c === 1 ? 8 : c === 3 ? 9 : 10})
              </button>
            ))}
          </div>
        )}

        {/* 原理提示 */}
        <button
          onClick={() => setShowFormula(!showFormula)}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: showFormula ? '#fef3c7' : '#f8fafc',
            color: showFormula ? '#92400e' : '#64748b',
            fontWeight: 700,
            fontSize: '0.8125rem',
            cursor: 'pointer'
          }}
        >
          {showFormula ? '收起秘籍' : '💡 数阵图公共数秒杀口诀'}
        </button>
      </div>

      {/* 原理卡片 */}
      {showFormula && (
        <div style={{
          marginTop: '16px',
          padding: '14px',
          background: '#fffbeb',
          borderRadius: '10px',
          border: '1px solid #fde68a',
          fontSize: '0.8125rem',
          color: '#78350f',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: '0 0 6px 0', fontWeight: 800 }}>📌 数阵图破局核心：抓住“多算了一次的重叠数”！</p>
          <ol style={{ margin: 0, paddingLeft: '18px' }}>
            <li>
              <strong>求总和方程</strong>：
              数阵图中，普通位置的数只参与 1 条线的求和；而<strong>顶点、交叉点</strong>由于被多条线共用，在把所有线相加时被计算了 2 次（或更多次）！
            </li>
            <li>
              <strong>极值对应法则</strong>：
              - 要求每条线之和<strong>最大</strong>，重叠交叉点就必须填<strong>最大的数字</strong>！
              - 要求每条线之和<strong>最小</strong>，重叠交叉点就必须填<strong>最小的数字</strong>！
            </li>
            <li>
              <strong>整除约束过滤</strong>：
              总和必须能被线的条数整除！例如十字星 15 + 中心数 必须是 2 的倍数，因此中心数只能是奇数（1, 3, 5），偶数（2, 4）直接排除！
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
