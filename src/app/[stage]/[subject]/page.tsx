import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { STAGES, SUBJECTS, getTopicsByFilter } from '@/data/topics';
import { StageKey, SubjectKey } from '@/types';
import Sidebar from '@/components/layout/Sidebar';
import TopicCard from '@/components/common/TopicCard';
import { ChevronRight } from 'lucide-react';
import styles from '@/styles/home.module.css';

interface PageProps {
  params: Promise<{
    stage: string;
    subject: string;
  }>;
}

export function generateStaticParams() {
  const paramsList: { stage: string; subject: string }[] = [];
  const stages = Object.keys(STAGES) as StageKey[];
  const subjects = Object.keys(SUBJECTS) as SubjectKey[];

  for (const stage of stages) {
    for (const subject of subjects) {
      paramsList.push({ stage, subject });
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { stage: stageKey, subject: subjectKey } = await params;
  const stage = STAGES[stageKey as StageKey];
  const subject = SUBJECTS[subjectKey as SubjectKey];

  if (!stage || !subject) return { title: '未找到分类' };

  return {
    title: `${stage.name}${subject.name}知识点动画演示与家长辅导指南`,
    description: `为您呈现精选${stage.name}${subject.name}核心知识点动画互动实验。${subject.description}，家长陪伴孩子自主探究，一键讲明白。`,
    keywords: [
      `${stage.name}${subject.name}动画`,
      `${stage.name}${subject.name}辅导`,
      `${subject.name}直观实验`,
      '中考知识点动画',
      '讲明白',
    ],
  };
}

export default async function SubjectCategoryPage({ params }: PageProps) {
  const { stage: stageKey, subject: subjectKey } = await params;
  const stage = STAGES[stageKey as StageKey];
  const subject = SUBJECTS[subjectKey as SubjectKey];

  if (!stage || !subject) {
    notFound();
  }

  const topics = getTopicsByFilter(stage.key, subject.key);

  return (
    <div className="container" style={{ paddingTop: '32px' }}>
      {/* 面包屑导航 */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#64748b', marginBottom: '20px' }}>
        <Link href="/" style={{ color: '#64748b' }}>首页</Link>
        <ChevronRight size={14} />
        <Link href={`/${stage.key}`} style={{ color: '#64748b' }}>{stage.name}专区</Link>
        <ChevronRight size={14} />
        <span style={{ color: subject.color, fontWeight: 700 }}>{subject.name}</span>
      </nav>

      <div style={{ display: 'flex', gap: '32px' }}>
        {/* 侧边栏 */}
        <Sidebar currentStage={stage.key} currentSubject={subject.key} />

        {/* 主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '28px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span className="badge badge-blue">{stage.name}</span>
              <span className="badge" style={{ background: `${subject.color}15`, color: subject.color, border: `1px solid ${subject.color}30` }}>
                {subject.name}
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
              {stage.name}{subject.name} · 知识点可视化互动实验室
            </h1>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {subject.description}。把晦涩抽象的数理公式通过交互式动画呈现，帮助家长在家庭辅导中用直观现象打破孩子的认知死角。
            </p>
          </div>

          {topics.length > 0 ? (
            <div className={styles.grid}>
              {topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          ) : (
            <div style={{ background: '#ffffff', padding: '48px 24px', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>该学科更多精彩动画正在制作中</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '20px' }}>
                我们正在持续整理并制作{stage.name}{subject.name}教材中的经典抽象知识点！
              </p>
              <Link href={`/${stage.key}`} className="btn btn-secondary">
                查看{stage.name}其它学科
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
