'use client';

import React, { useState, useRef } from 'react';
import { TopicItem } from '@/types';
import TopicCard from '@/components/common/TopicCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '@/styles/home.module.css';

interface PaginatedTopicListProps {
  topics: TopicItem[];
  pageSize?: number;
}

export default function PaginatedTopicList({ topics, pageSize = 6 }: PaginatedTopicListProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(topics.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentTopics = topics.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (topics.length === 0) return null;

  return (
    <div ref={containerRef}>
      {/* 知识点卡片网格 */}
      <div className={styles.grid}>
        {currentTopics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>

      {/* 翻页控制器（当知识点数量大于单页容量时显示） */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginTop: '36px',
          paddingTop: '20px',
          borderTop: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            共 <strong>{topics.length}</strong> 个知识点，当前第 <strong>{currentPage}</strong> / <strong>{totalPages}</strong> 页
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* 上一页 */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={16} />
              上一页
            </button>

            {/* 数字页码 */}
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    minWidth: '36px',
                    height: '36px',
                    padding: '0 8px',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* 下一页 */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                opacity: currentPage === totalPages ? 0.5 : 1,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              下一页
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
