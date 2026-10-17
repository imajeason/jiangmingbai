import React from 'react';
import { TopicItem } from '@/types';
import { HeartHandshake, AlertCircle, MessageCircleQuestion, Lightbulb, BookmarkCheck } from 'lucide-react';
import styles from '@/styles/parentGuide.module.css';

interface ParentGuideBoxProps {
  topic: TopicItem;
}

export default function ParentGuideBox({ topic }: ParentGuideBoxProps) {
  const { parentGuide } = topic;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <HeartHandshake size={22} />
          </div>
          <div>
            <h3 className={styles.title}>家长辅导锦囊</h3>
            <p className={styles.subtitle}>如何用 5 分钟帮孩子建立直观想象，告别死记硬背</p>
          </div>
        </div>
        <div className="badge badge-orange">
          启发式教学法
        </div>
      </div>

      {/* 1. 孩子常见的认知卡点 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <AlertCircle size={18} color="#e11d48" />
          <span>孩子卡在哪里？（先理解孩子的直觉盲区）</span>
        </div>
        <div className={styles.painPointBox}>
          {parentGuide.painPoint}
        </div>
      </div>

      {/* 2. 启发式提问三步法 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <MessageCircleQuestion size={18} color="#2563eb" />
          <span>提问三步法（引导孩子自己说出答案）</span>
        </div>
        <div className={styles.stepsGrid}>
          {parentGuide.steps.map((step) => (
            <div key={step.stepNumber} className={styles.stepCard}>
              <div className={styles.stepNum}>{step.stepNumber}</div>
              <div className={styles.stepContent}>
                <div className={styles.stepQuestion}>{step.question}</div>
                <div className={styles.stepGuide}>👉 辅导提示：{step.guide}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 生活中有什么对应原型 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Lightbulb size={18} color="#059669" />
          <span>生活原型连接（用孩子看得见的生活例子类比）</span>
        </div>
        <div className={styles.realLifeBox}>
          {parentGuide.realLifeExample}
        </div>
      </div>

      {/* 4. 一句话核心金句 */}
      <div className={styles.takeawayBanner}>
        <BookmarkCheck size={22} />
        <div>
          <span style={{ opacity: 0.85, fontSize: '0.85rem', display: 'block' }}>核心一句话讲明白：</span>
          <span>{parentGuide.keyTakeaway}</span>
        </div>
      </div>
    </div>
  );
}
