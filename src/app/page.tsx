import React from 'react';
import { getAllTopics } from '@/lib/topics';
import HomeFilterSection from '@/components/home/HomeFilterSection';
import { Sparkles, BrainCircuit, HeartHandshake, Eye } from 'lucide-react';
import styles from '@/styles/home.module.css';

export default function HomePage() {
  const allTopics = getAllTopics();

  return (
    <div className="container">
      {/* 1. 首页 Hero 宣传与辅导痛点定位 */}
      <section className={styles.hero}>
        <div className={styles.heroTag}>
          <Sparkles size={15} />
          <span>专为中小学数理化打造 · 家长辅导神器</span>
        </div>

        <h1 className={styles.heroTitle}>
          把抽象的中小学知识点<br />
          用交互动画 <span className={styles.heroHighlight}>一秒讲明白</span>
        </h1>

        <p className={styles.heroSubtitle}>
          告别死记硬背与家庭辅导“干着急”。通过动手拖拽改变参数的纯 JS 动画，
          配合启发式提问三步法，让孩子亲眼看见数理本质，自己推导出正确答案！
        </p>
      </section>

      {/* 2. 首页核心：即时筛选器与交互知识点网格 */}
      <HomeFilterSection initialTopics={allTopics} />

      {/* 3. 家长专属：辅导方法论模块 */}
      <section className={styles.philosophy}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <div className="badge badge-orange" style={{ marginBottom: '12px' }}>
            家长辅导理念
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
            为什么给孩子讲题总是“听懂了但又不会做”？
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>
            孩子的大脑是以“具象形象”为先导的。传统辅导直接念公式、套题型，孩子脑中没有画面支撑。“讲明白”倡导三步认知飞跃：
          </p>
        </div>

        <div className={styles.philosophyGrid}>
          <div className={styles.philosophyCard}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Eye size={22} color="#38bdf8" />
            </div>
            <h4>第一步：动手感知</h4>
            <p>
              不先背公式。让孩子滑动滑块、改变浸入深度或切分圆周，亲眼看到图形如何变形、指针如何随深度摆动，建立最初的物理/几何直觉。
            </p>
          </div>

          <div className={styles.philosophyCard}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <HeartHandshake size={22} color="#10b981" />
            </div>
            <h4>第二步：启发提问</h4>
            <p>
              家长依照每个知识点配备的“提问三步法”，不批评、不直接揭晓答案，通过递进式的小问题，引导孩子自己说出发现的规律。
            </p>
          </div>

          <div className={styles.philosophyCard}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(129, 140, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <BrainCircuit size={22} color="#818cf8" />
            </div>
            <h4>第三步：融会贯通</h4>
            <p>
              将动画直观规律与课本标准公式、中考常见几何模型对齐，让孩子在做试卷压轴题时，脑海中能瞬间浮现出动态推导过程。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
