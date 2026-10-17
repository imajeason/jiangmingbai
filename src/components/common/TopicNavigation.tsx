'use client';

import React from 'react';
import Link from 'next/link';
import { TopicItem } from '@/types';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

interface TopicNavigationProps {
  currentTopic: TopicItem;
  allTopics: TopicItem[];
}

export default function TopicNavigation({ currentTopic, allTopics }: TopicNavigationProps) {
  // 优先在同【学段+学科】内寻找上一篇和下一篇
  let groupTopics = allTopics.filter(
    (t) => t.stage === currentTopic.stage && t.subject === currentTopic.subject
  );

  // 如果同分类只有1个，则在同学段内寻找
  if (groupTopics.length <= 1) {
    groupTopics = allTopics.filter((t) => t.stage === currentTopic.stage);
  }

  // 如果同学段还是只有1个，则在全站所有知识点内导航
  if (groupTopics.length <= 1) {
    groupTopics = allTopics;
  }

  const currentIndex = groupTopics.findIndex((t) => t.slug === currentTopic.slug);
  const prevTopic = currentIndex > 0 ? groupTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < groupTopics.length - 1 ? groupTopics[currentIndex + 1] : null;

  if (!prevTopic && !nextTopic) return null;

  return (
    <div style={{ marginTop: '36px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
        <BookOpen size={16} color="#2563eb" />
        <span>知识点进阶翻页</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* 上一个知识点 */}
        {prevTopic ? (
          <Link
            href={`/${prevTopic.stage}/${prevTopic.subject}/${prevTopic.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '18px 20px',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#93c5fd';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(37,99,235,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ArrowLeft size={18} color="#2563eb" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '3px' }}>
                ← 上一个知识点
              </div>
              <div style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {prevTopic.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                {prevTopic.grade}
              </div>
            </div>
          </Link>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '18px 20px',
            background: '#f8fafc',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed #cbd5e1',
            color: '#94a3b8',
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ArrowLeft size={18} color="#94a3b8" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>已是本模块起点</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>第一课</div>
            </div>
          </div>
        )}

        {/* 下一个知识点 */}
        {nextTopic ? (
          <Link
            href={`/${nextTopic.stage}/${nextTopic.subject}/${nextTopic.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              padding: '18px 20px',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
              textDecoration: 'none',
              textAlign: 'right',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#93c5fd';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(37,99,235,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '3px' }}>
                下一个知识点 →
              </div>
              <div style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {nextTopic.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                {nextTopic.grade}
              </div>
            </div>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ArrowRight size={18} color="#2563eb" />
            </div>
          </Link>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            padding: '18px 20px',
            background: '#f8fafc',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed #cbd5e1',
            color: '#94a3b8',
            textAlign: 'right',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>已是本模块末尾</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>更多动画制作中</div>
            </div>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ArrowRight size={18} color="#94a3b8" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
