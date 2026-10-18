import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { STAGES, SUBJECTS } from '@/data/constants';
import { getAllTopics, getTopicBySlug } from '@/lib/topics';
import Sidebar from '@/components/layout/Sidebar';
import AnimationPlayer from '@/components/animations/AnimationPlayer';
import ParentGuideBox from '@/components/common/ParentGuideBox';
import TopicPrerequisitesBox from '@/components/common/TopicPrerequisitesBox';
import { ChevronRight, Clock, Award, BookCheck, Share2 } from 'lucide-react';
import { parseMarkdown } from '@/lib/markdown';
import markdownStyles from '@/styles/markdown.module.css';
import TopicNavigation from '@/components/common/TopicNavigation';



interface PageProps {
  params: Promise<{
    stage: string;
    subject: string;
    slug: string;
  }>;
}

export function generateStaticParams() {
  const topics = getAllTopics();
  return topics.map((topic) => ({
    stage: topic.stage,
    subject: topic.subject,
    slug: topic.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return { title: '未找到知识点' };

  const stage = STAGES[topic.stage];
  const subject = SUBJECTS[topic.subject];

  return {
    title: `${topic.title}_${stage.name}${subject.name}动画演示与家长怎么讲 - 讲明白`,
    description: `${topic.summary} 本文提供互动动画实验室、家长启发提问三步法以及生活中的现象类比，帮家长彻底给孩子讲明白${topic.title}。`,
    keywords: [
      topic.title,
      `${stage.name}${subject.name}`,
      `${topic.title}怎么讲`,
      `${topic.title}动画演示`,
      ...topic.tags,
      '讲明白',
    ],
  };
}

export default async function TopicDetailPage({ params }: PageProps) {
  const { stage: stageKey, subject: subjectKey, slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic || topic.stage !== stageKey || topic.subject !== subjectKey) {
    notFound();
  }

  const stage = STAGES[topic.stage];
  const subject = SUBJECTS[topic.subject];

  // 构造 Schema.org 结构化数据 (EducationalResource & FAQPage)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: topic.title,
    description: topic.summary,
    educationalLevel: topic.grade,
    learningResourceType: 'Interactive Simulation',
    about: {
      '@type': 'Thing',
      name: topic.title,
    },
    educationalAlignment: {
      '@type': 'AlignmentObject',
      alignmentType: 'educationalSubject',
      targetName: `${stage.name}${subject.name}`,
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: topic.parentGuide.steps.map((step) => ({
      '@type': 'Question',
      name: step.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: step.guide,
      },
    })),
  };

  const contentHtml = topic.content ? parseMarkdown(topic.content) : '';

  return (
    <>
      {/* 注入 SEO 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container" style={{ paddingTop: '28px' }}>
        {/* 面包屑导航 */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#64748b' }}>首页</Link>
          <ChevronRight size={14} />
          <Link href={`/${stage.key}`} style={{ color: '#64748b' }}>{stage.name}专区</Link>
          <ChevronRight size={14} />
          <Link href={`/${stage.key}/${subject.key}`} style={{ color: subject.color }}>{subject.name}</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{topic.title}</span>
        </nav>

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* 左侧侧边栏知识树 */}
          <Sidebar currentStage={stage.key} currentSubject={subject.key} currentSlug={topic.slug} topics={getAllTopics()} />

          {/* 右侧主工作台 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* 知识点标题区域 */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span className="badge badge-blue">{stage.name}</span>
                <span className="badge" style={{ background: `${subject.color}15`, color: subject.color }}>
                  {subject.name}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{topic.grade}</span>
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.825rem', color: '#64748b' }}>
                  <Clock size={13} />
                  预计 {topic.durationMinutes} 分钟讲透
                </span>
              </div>

              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1.25, marginBottom: '8px' }}>
                {topic.title}
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {topic.subtitle}
              </p>
            </div>

            {/* 1. 核心互动动画工作台 */}
            <div style={{ marginBottom: '28px' }}>
              <AnimationPlayer type={topic.animationType} />
            </div>

            {/* 2. 核心考点与公式提炼 */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <BookCheck size={18} color="#2563eb" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>核心考点与数学物理模型</h3>
              </div>
              <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '14px' }}>
                {topic.summary}
              </p>
              {topic.coreFormula && (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>核心公式：</span>
                  <code style={{ fontSize: '1.15rem', color: '#2563eb', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                    {topic.coreFormula}
                  </code>
                </div>
              )}
            </div>

            {/* 3. 家长辅导锦囊（核心受众专区） */}
            <ParentGuideBox topic={topic} />

            {/* 4. 认知图谱与前置/进阶短板排查 (启发自 Marble Skill Taxonomy) */}
            <TopicPrerequisitesBox topic={topic} allTopics={getAllTopics()} />

            {/* 5. 深度拓展与思维延伸 (来自独立 Markdown 正文，经过富文本与公式渲染) */}
            {contentHtml && (
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '28px 32px', boxShadow: 'var(--shadow-sm)', marginTop: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '1.25rem' }}>📖</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>
                    知识深度解析与原理背景
                  </h3>
                </div>
                <div
                  className={markdownStyles.markdownBody}
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              </div>
            )}

            {/* 5. 上一篇 / 下一篇 知识点进阶翻页导航 */}
            <TopicNavigation currentTopic={topic} allTopics={getAllTopics()} />
          </div>

        </div>
      </div>
    </>
  );
}
