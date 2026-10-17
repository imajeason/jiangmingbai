import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { STAGES, SUBJECTS, getTopicsByFilter } from '@/data/topics';
import { StageKey, SubjectKey } from '@/types';
import Sidebar from '@/components/layout/Sidebar';
import TopicCard from '@/components/common/TopicCard';
import { Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import styles from '@/styles/home.module.css';

interface PageProps {
  params: Promise<{
    stage: string;
  }>;
}

export function generateStaticParams() {
  return (Object.keys(STAGES) as StageKey[]).map((stage) => ({
    stage,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { stage: stageKey } = await params;
  const stage = STAGES[stageKey as StageKey];
  if (!stage) return { title: '未找到学段' };

  return {
    title: `${stage.name}知识点动画演示与辅导指南`,
    description: `涵盖${stage.name}(${stage.badge})数理化核心知识点JS交互动画。通过直观演示与提问三步法，帮助家长给孩子讲透抽象考点。`,
    keywords: [`${stage.name}知识点动画`, `${stage.name}数理化`, `${stage.name}家长辅导`, '讲明白'],
  };
}

export default async function StagePage({ params }: PageProps) {
  const { stage: stageKey } = await params;
  const stage = STAGES[stageKey as StageKey];
  if (!stage) {
    notFound();
  }

  const topics = getTopicsByFilter(stage.key);

  return (
    <div className="container" style={{ paddingTop: '32px' }}>
      {/* 面包屑导航 */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#64748b', marginBottom: '20px' }}>
        <Link href="/" style={{ color: '#64748b' }}>首页</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{stage.name}专区</span>
      </nav>

      <div style={{ display: 'flex', gap: '32px' }}>
        {/* 侧边栏知识树 */}
        <Sidebar currentStage={stage.key} />

        {/* 主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 学段头部介绍 */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '28px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span className="badge badge-blue">{stage.badge}</span>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>分类聚合</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
              {stage.name}知识点动画实验室
            </h1>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {stage.description} 专为家长精选适合该学段的思维模型，把公式变形与定理推导变成孩子看得见、摸得着的生动画面。
            </p>

            {/* 学科快速胶囊条 */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
              {(Object.keys(SUBJECTS) as SubjectKey[]).map((subKey) => {
                const sub = SUBJECTS[subKey];
                return (
                  <Link
                    key={subKey}
                    href={`/${stage.key}/${subKey}`}
                    className="btn btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                  >
                    <span style={{ color: sub.color }}>●</span>
                    <span>{sub.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 动画卡片列表 */}
          <div className={styles.grid}>
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
