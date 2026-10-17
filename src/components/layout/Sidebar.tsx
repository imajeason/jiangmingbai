import React from 'react';
import Link from 'next/link';
import { STAGES, SUBJECTS } from '@/data/constants';
import { StageKey, SubjectKey, TopicItem } from '@/types';
import styles from '@/styles/layout.module.css';

interface SidebarProps {
  currentStage?: StageKey;
  currentSubject?: SubjectKey;
  currentSlug?: string;
  topics?: TopicItem[];
}

export default function Sidebar({ currentStage, currentSubject, currentSlug, topics = [] }: SidebarProps) {
  // 过滤出当前分类或相关的知识点
  const filteredTopics = topics.filter((t) => {
    if (currentStage && t.stage !== currentStage) return false;
    if (currentSubject && t.subject !== currentSubject) return false;
    return true;
  });

  return (
    <aside className={styles.sidebar}>
      {/* 学段切换 */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarTitle}>选择学段</div>
        <ul className={styles.sidebarList}>
          {(Object.keys(STAGES) as StageKey[]).map((stKey) => {
            const st = STAGES[stKey];
            const isActive = currentStage === stKey;
            const targetHref = currentSubject 
              ? `/${stKey}/${currentSubject}` 
              : `/${stKey}`;

            return (
              <li key={stKey}>
                <Link
                  href={targetHref}
                  className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
                >
                  <span>{st.name}专区</span>
                  <span className={styles.sidebarTopicTag}>{st.badge}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 学科切换 */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarTitle}>核心学科</div>
        <ul className={styles.sidebarList}>
          {(Object.keys(SUBJECTS) as SubjectKey[]).map((subKey) => {
            const sub = SUBJECTS[subKey];
            const isActive = currentSubject === subKey;
            const targetStage = currentStage || 'chuzhong';
            const targetHref = `/${targetStage}/${subKey}`;

            return (
              <li key={subKey}>
                <Link
                  href={targetHref}
                  className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
                >
                  <span>{sub.name}</span>
                  <span style={{ fontSize: '0.75rem', color: sub.color }}>●</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 知识点目录树 */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarTitle}>
          {currentStage ? `${STAGES[currentStage]?.name}` : ''}
          {currentSubject ? `${SUBJECTS[currentSubject]?.name}` : ''}
          知识点清单
        </div>
        <ul className={styles.sidebarList}>
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => {
              const isActive = currentSlug === topic.slug;
              return (
                <li key={topic.id}>
                  <Link
                    href={`/${topic.stage}/${topic.subject}/${topic.slug}`}
                    className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
                    title={topic.title}
                  >
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {topic.title}
                    </span>
                    <span className={styles.sidebarTopicTag}>{topic.durationMinutes}m</span>
                  </Link>
                </li>
              );
            })
          ) : (
            <li style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
              该分类下更多动画正在制作中...
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
}
