import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { STAGES, SUBJECTS } from '@/data/constants';
import { getAllTopics } from '@/lib/topics';
import { StageKey, SubjectKey } from '@/types';
import { Compass, BookOpen, ArrowRight, Network } from 'lucide-react';
import styles from '@/styles/home.module.css';
import LearningSkillTree from '@/components/explore/LearningSkillTree';

export const metadata: Metadata = {
  title: '全部分类与知识图谱浏览 - 讲明白',
  description: '小学、初中、高中数理化知识点全部分类索引。查看所有可交互动画与针对家长的辅导方案。',
};

export default function ExplorePage() {
  const allTopics = getAllTopics();
  const stages = Object.keys(STAGES) as StageKey[];
  const subjects = Object.keys(SUBJECTS) as SubjectKey[];

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div className="badge badge-blue" style={{ marginBottom: '12px' }}>
          <Compass size={14} />
          <span>全站知识地图与认知图谱</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px' }}>
          中小学数理思维技能树 & 前置拓扑图谱
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
          每一个难点都有其前置根基。点击图中任意知识点，实时排查前置短板与进阶路径，看透数理能力的生长脉络。
        </p>
      </div>

      {/* 核心亮点：交互式认知技能树 */}
      <LearningSkillTree topics={allTopics} />

      {/* 下方：按学段与学科分类矩阵 */}
      <div style={{ marginTop: '48px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
          按学段与学科系统化索引
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '28px' }}>
          覆盖小学、初中经典考点与核心定理，支持按学科分门别类探索。
        </p>
      </div>

      {stages.map((stageKey) => {
        const stage = STAGES[stageKey];
        return (
          <div key={stageKey} style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--color-border)', paddingBottom: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{stage.name}专区</h2>
                <span className="badge badge-blue">{stage.badge}</span>
              </div>
              <Link href={`/${stageKey}`} style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.15s ease',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{sub.name}</span>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: sub.color }} />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, flex: 1, marginBottom: '12px' }}>
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
  );
}
