'use client';

import React from 'react';
import Link from 'next/link';
import { GitFork, CheckCircle2, ArrowRight, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { PrerequisiteRef, TopicItem } from '@/types';

interface TopicPrerequisitesBoxProps {
  topic: TopicItem;
  allTopics: TopicItem[];
}

export default function TopicPrerequisitesBox({ topic, allTopics }: TopicPrerequisitesBoxProps) {
  const hasPrereqs = topic.prerequisites && topic.prerequisites.length > 0;
  const hasNextSteps = topic.nextSteps && topic.nextSteps.length > 0;
  const hasEvidence = topic.evidence && topic.evidence.length > 0;

  if (!hasPrereqs && !hasNextSteps && !hasEvidence) {
    return null;
  }

  // 辅助函数：根据 slug 查找站内知识点链接
  const findTopicLink = (slug?: string) => {
    if (!slug) return null;
    const target = allTopics.find((t) => t.slug === slug);
    if (!target) return null;
    return `/${target.stage}/${target.subject}/${target.slug}`;
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '28px',
      }}
    >
      {/* 顶部标题栏 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb',
          }}
        >
          <GitFork size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>
            认知图谱与查漏补缺 (Learning Path)
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
            孩子学不会切忌盲目灌输，依循认知链条溯源前置盲区
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 1. 前置依赖知识点 */}
        {hasPrereqs && (
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertCircle size={16} color="#d97706" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#92400e' }}>
                学不会？先查前置短板 (Prerequisites)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {topic.prerequisites?.map((prereq, idx) => {
                const link = findTopicLink(prereq.slug);
                return (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      {link ? (
                        <Link
                          href={link}
                          style={{
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            color: '#2563eb',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span>{prereq.title}</span>
                          <ArrowRight size={13} />
                        </Link>
                      ) : (
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                          {prereq.title}
                        </span>
                      )}

                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: prereq.strength === 'hard' ? '#fee2e2' : '#fef3c7',
                          color: prereq.strength === 'hard' ? '#b91c1c' : '#b45309',
                          fontWeight: 600,
                        }}
                      >
                        {prereq.strength === 'hard' ? '硬核基础' : '辅助认知'}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                      <strong>卡点剖析：</strong>{prereq.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. 怎么判定孩子真正掌握了（Mastery Evidence） */}
        {hasEvidence && (
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <CheckCircle2 size={16} color="#16a34a" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534' }}>
                家长检测标尺：孩子真正掌握的 3 个标志 (Mastery Evidence)
              </span>
            </div>

            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.825rem', color: '#374151', lineHeight: 1.6 }}>
              {topic.evidence?.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>
                  {item}
                </li>
              ))}
            </ul>

            {topic.assessmentPrompt && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: '#ffffff',
                  border: '1px solid #86efac',
                  fontSize: '0.8rem',
                  color: '#15803d',
                }}
              >
                <strong>💬 睡前口头测试：</strong>“{topic.assessmentPrompt}”
              </div>
            )}
          </div>
        )}

        {/* 3. 后继进阶能力 */}
        {hasNextSteps && (
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={16} color="#2563eb" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e40af' }}>
                已搞懂？进阶挑战下一关 (Next Steps)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {topic.nextSteps?.map((next, idx) => {
                const link = findTopicLink(next.slug);
                return (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      {link ? (
                        <Link
                          href={link}
                          style={{
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            color: '#2563eb',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span>{next.title}</span>
                          <ArrowRight size={13} />
                        </Link>
                      ) : (
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                          {next.title}
                        </span>
                      )}

                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: '#e0f2fe',
                          color: '#0369a1',
                          fontWeight: 600,
                        }}
                      >
                        高阶跃迁
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                      <strong>进阶意义：</strong>{next.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
