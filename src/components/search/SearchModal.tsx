'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, BookOpen } from 'lucide-react';
import { SearchTopicItem } from '@/types';
import { STAGES, SUBJECTS } from '@/data/constants';
import styles from '@/styles/search.module.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: SearchTopicItem[];
}

const HOT_TAGS = [
  '燕尾模型',
  '鸡兔同笼',
  '经济利润',
  '整除特征',
  '蝴蝶模型',
  '植树问题',
  '时钟追及',
  '等差数列',
  '分解质因数',
  '方阵问题',
  '牛吃草',
  '浮力',
];

export default function SearchModal({ isOpen, onClose, topics }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 打开弹窗时自动聚焦输入框 & 锁定页面滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedIndex(0);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 搜索过滤计算
  const trimmed = query.trim().toLowerCase();
  const filteredTopics = trimmed
    ? topics.filter((t) => {
        const titleMatch = t.title.toLowerCase().includes(trimmed);
        const subMatch = t.subtitle.toLowerCase().includes(trimmed);
        const summaryMatch = t.summary.toLowerCase().includes(trimmed);
        const gradeMatch = t.grade.toLowerCase().includes(trimmed);
        const subjectMatch = (SUBJECTS[t.subject]?.name || '').toLowerCase().includes(trimmed);
        const tagsMatch = t.tags.some((tag) => tag.toLowerCase().includes(trimmed));
        return titleMatch || subMatch || summaryMatch || gradeMatch || subjectMatch || tagsMatch;
      })
    : topics.slice(0, 6); // 空输入时展示最新推荐前 6 个

  // 键盘快捷键监听 (Esc, ArrowUp, ArrowDown, Enter)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredTopics.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTopics.length - 1));
      } else if (e.key === 'Enter') {
        if (filteredTopics.length > 0 && selectedIndex < filteredTopics.length) {
          e.preventDefault();
          const target = filteredTopics[selectedIndex];
          router.push(`/${target.stage}/${target.subject}/${target.slug}`);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTopics, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* 顶部搜索输入条 */}
        <div className={styles.searchHeader}>
          <Search size={20} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="搜索知识点、考点、年级、模型（如：燕尾、利润、鸡兔同笼...）"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          {query && (
            <button
              className={styles.clearBtn}
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              title="清空输入"
            >
              <X size={16} />
            </button>
          )}
          <span className={styles.escBadge} onClick={onClose} title="点击关闭">
            ESC
          </span>
        </div>

        {/* 热门搜索标签 */}
        {!trimmed && (
          <div className={styles.hotTagsSection}>
            <div className={styles.hotTagsTitle}>
              <Sparkles size={14} color="#ea580c" />
              <span>热门常考考点：</span>
            </div>
            <div className={styles.hotTagsList}>
              {HOT_TAGS.map((tag) => (
                <button
                  key={tag}
                  className={styles.hotTagPill}
                  onClick={() => {
                    setQuery(tag);
                    setSelectedIndex(0);
                    inputRef.current?.focus();
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 搜索结果列表 */}
        <div className={styles.resultsList}>
          {filteredTopics.length > 0 ? (
            <>
              <div style={{ padding: '6px 8px 10px 8px', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>
                {trimmed ? `找到 ${filteredTopics.length} 个相关知识点：` : '最新上线与核心推荐：'}
              </div>

              {filteredTopics.map((topic, idx) => {
                const stage = STAGES[topic.stage];
                const subject = SUBJECTS[topic.subject];
                const isSelected = idx === selectedIndex;
                const href = `/${topic.stage}/${topic.subject}/${topic.slug}`;

                return (
                  <Link
                    key={topic.slug}
                    href={href}
                    className={`${styles.resultItem} ${isSelected ? styles.resultItemActive : ''}`}
                    onClick={onClose}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className={styles.resultContent}>
                      <div className={styles.resultTitleRow}>
                        <span className={styles.resultTitle}>{topic.title}</span>
                        <span className="badge badge-blue" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                          {stage?.name}
                        </span>
                        <span
                          className="badge"
                          style={{
                            fontSize: '0.68rem',
                            padding: '1px 6px',
                            background: `${subject?.color}15`,
                            color: subject?.color,
                            border: `1px solid ${subject?.color}30`,
                          }}
                        >
                          {subject?.name}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          {topic.grade}
                        </span>
                      </div>
                      <div className={styles.resultSummary}>
                        {topic.summary || topic.subtitle}
                      </div>
                    </div>

                    <div className={styles.resultAction}>
                      {isSelected ? <CornerDownLeft size={16} /> : <ArrowRight size={16} />}
                    </div>
                  </Link>
                );
              })}
            </>
          ) : (
            <div className={styles.emptyState}>
              <BookOpen size={40} style={{ color: '#cbd5e1', margin: '0 auto' }} />
              <div className={styles.emptyStateTitle}>未找到与 “{query}” 相关的知识点</div>
              <div className={styles.emptyStateText}>
                建议尝试更简短的关键词，例如：“面积”、“方阵”、“追及”、“时钟”、“分数”
              </div>
            </div>
          )}
        </div>

        {/* 底部按键提示 */}
        <div className={styles.searchFooter}>
          <span>
            共收录 <strong>{topics.length}</strong> 个交互式动画知识点
          </span>
          <div className={styles.footerShortcuts}>
            <span className={styles.shortcutItem}>
              <kbd>↑</kbd> <kbd>↓</kbd> 切换
            </span>
            <span className={styles.shortcutItem}>
              <kbd>↵</kbd> 打开
            </span>
            <span className={styles.shortcutItem}>
              <kbd>Esc</kbd> 关闭
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

