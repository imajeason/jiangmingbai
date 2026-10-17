'use client';

import React, { useState, useMemo } from 'react';
import { StageKey, SubjectKey, TopicItem } from '@/types';
import { STAGES, SUBJECTS } from '@/data/topics';
import TopicCard from '@/components/common/TopicCard';
import { Search, Filter, Sparkles, BookOpen, RotateCcw } from 'lucide-react';
import styles from '@/styles/home.module.css';

interface HomeFilterSectionProps {
  initialTopics: TopicItem[];
}

export default function HomeFilterSection({ initialTopics }: HomeFilterSectionProps) {
  const [selectedStage, setSelectedStage] = useState<StageKey | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 响应式即时过滤计算
  const filteredTopics = useMemo(() => {
    return initialTopics.filter((topic) => {
      if (selectedStage !== 'all' && topic.stage !== selectedStage) {
        return false;
      }
      if (selectedSubject !== 'all' && topic.subject !== selectedSubject) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = topic.title.toLowerCase().includes(query);
        const matchSummary = topic.summary.toLowerCase().includes(query);
        const matchTags = topic.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchTitle && !matchSummary && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [initialTopics, selectedStage, selectedSubject, searchQuery]);

  const handleReset = () => {
    setSelectedStage('all');
    setSelectedSubject('all');
    setSearchQuery('');
  };

  return (
    <section>
      {/* 首页交互多维筛选面板 */}
      <div className={styles.filterContainer}>
        {/* 1. 学段筛选 */}
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>学段：</span>
          <div className={styles.filterButtonGroup}>
            <button
              className={`${styles.filterBtn} ${selectedStage === 'all' ? styles.filterBtnActive : ''}`}
              onClick={() => setSelectedStage('all')}
            >
              全部学段
            </button>
            {(Object.keys(STAGES) as StageKey[]).map((stKey) => {
              const st = STAGES[stKey];
              const isSelected = selectedStage === stKey;
              return (
                <button
                  key={stKey}
                  className={`${styles.filterBtn} ${isSelected ? styles.filterBtnActive : ''}`}
                  onClick={() => setSelectedStage(stKey)}
                >
                  <span>{st.name}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({st.badge})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. 学科筛选 */}
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>学科：</span>
          <div className={styles.filterButtonGroup}>
            <button
              className={`${styles.filterBtn} ${selectedSubject === 'all' ? styles.filterBtnActive : ''}`}
              onClick={() => setSelectedSubject('all')}
            >
              全部学科
            </button>
            {(Object.keys(SUBJECTS) as SubjectKey[]).map((subKey) => {
              const sub = SUBJECTS[subKey];
              const isSelected = selectedSubject === subKey;
              return (
                <button
                  key={subKey}
                  className={`${styles.filterBtn} ${isSelected ? styles.filterBtnActive : ''}`}
                  onClick={() => setSelectedSubject(subKey)}
                >
                  <span style={{ color: isSelected ? '#ffffff' : sub.color }}>●</span>
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. 搜索与重置 */}
        <div className={styles.filterRow} style={{ marginTop: '8px' }}>
          <div className={styles.filterSearchInput}>
            <Search size={16} color="var(--color-text-light)" />
            <input
              type="text"
              placeholder="搜索知识点、考点、定理（如：圆面积、勾股定理、浮力）..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                ✕
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
              匹配到 <strong style={{ color: 'var(--color-primary)' }}>{filteredTopics.length}</strong> 个互动动画
            </span>
            {(selectedStage !== 'all' || selectedSubject !== 'all' || searchQuery) && (
              <button
                onClick={handleReset}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <RotateCcw size={13} />
                <span>重置筛选</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 知识点卡片网格列表 */}
      {filteredTopics.length > 0 ? (
        <div className={styles.grid}>
          {filteredTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            marginBottom: '60px',
          }}
        >
          <Filter size={40} color="#cbd5e1" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>未找到匹配的知识点动画</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            尝试切换学段或学科，或者点击重置查看所有精彩内容。
          </p>
          <button onClick={handleReset} className="btn btn-primary">
            查看全部精选动画
          </button>
        </div>
      )}
    </section>
  );
}
