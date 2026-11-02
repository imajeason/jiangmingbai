import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { STAGES, SUBJECTS } from '@/data/constants';
import { getAllTopics } from '@/lib/topics';
import { StageKey, SubjectKey } from '@/types';
import { ArrowRight } from 'lucide-react';
import ExploreDualView from '@/components/explore/ExploreDualView';

export const metadata: Metadata = {
  title: '全站知识大目录与认知图谱 - 讲明白',
  description: '中小学数理化知识点全景体系大目录与前置依赖技能树。涵盖 5 大思维体系、47+ 交互实验与溯源进阶拓扑。',
  alternates: {
    canonical: 'https://jiangmb.com/explore/',
  },
};

export default function ExplorePage() {
  const allTopics = getAllTopics();
  const stages = Object.keys(STAGES) as StageKey[];
  const subjects = Object.keys(SUBJECTS) as SubjectKey[];

  return (
    <>
      {/* 核心双模协同视图：体系大目录 + 认知拓扑技能树 */}
      <ExploreDualView topics={allTopics} />

      {/* 底部：按学段与学科系统化索引矩阵 (便于搜索引擎抓取与传统学段浏览) */}
      <div className="container" style={{ paddingBottom: '60px' }}>
        <div style={{ marginTop: '20px', marginBottom: '28px', borderTop: '1px solid var(--color-border)', paddingTop: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
            按学段与学科纵向聚合索引
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            直接进入学段学科专区，按教材年级与课标要求逐课探索。
          </p>
        </div>

        {stages.map((stageKey) => {
          const stage = STAGES[stageKey];
          return (
            <div key={stageKey} style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--color-border)', paddingBottom: '10px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{stage.name}专区</h3>
                  <span className="badge badge-blue">{stage.badge}</span>
                </div>
                <Link href={`/${stageKey}`} style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  进入{stage.name}专区 <ArrowRight size={14} />
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {subjects.map((subKey) => {
                  const sub = SUBJECTS[subKey];
                  const count = allTopics.filter((t) => t.stage === stageKey && t.subject === subKey).length;

                  return (
                    <Link
                      key={subKey}
                      href={`/${stageKey}/${subKey}`}
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.15s ease',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>{sub.name}</span>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: sub.color }} />
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4, flex: 1, marginBottom: '10px' }}>
                        {sub.description}
                      </p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                        {count > 0 ? `${count} 个交互动画已上线` : '筹备制作中'}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
