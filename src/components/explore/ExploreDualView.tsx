'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  FolderTree, 
  Network, 
  Search, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Lightbulb, 
  X,
  Layers,
  GraduationCap
} from 'lucide-react';
import { TopicItem } from '@/types';
import { STAGES, SUBJECTS } from '@/data/constants';
import { MODULE_CATEGORIES, TOPOLOGY_EDGES, ModuleCategory } from '@/data/knowledgeGraph';
import styles from '@/styles/explore.module.css';

interface ExploreDualViewProps {
  topics: TopicItem[];
}

type GradeFilter = 'all' | 'low' | 'mid' | 'high' | 'chuzhong';

export default function ExploreDualView({ topics }: ExploreDualViewProps) {
  const [viewMode, setViewMode] = useState<'catalog' | 'graph'>('catalog');
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlug, setSelectedSlug] = useState<string | null>('swallowtail-model-geometry');

  // 映射字典，方便按 slug 快速查找
  const topicMap = useMemo(() => {
    const map = new Map<string, TopicItem>();
    topics.forEach((t) => map.set(t.slug, t));
    return map;
  }, [topics]);

  // 匹配年级过滤判断
  const matchGrade = (topic: TopicItem, filter: GradeFilter): boolean => {
    if (filter === 'all') return true;
    if (filter === 'chuzhong') return topic.stage === 'chuzhong' || topic.grade.includes('初');
    if (filter === 'low') return topic.grade.includes('一年级') || topic.grade.includes('二年级') || topic.grade.includes('一/二年级');
    if (filter === 'mid') return topic.grade.includes('三年级') || topic.grade.includes('四年级') || topic.grade.includes('三/四年级');
    if (filter === 'high') return topic.grade.includes('五年级') || topic.grade.includes('六年级') || topic.grade.includes('五/六年级');
    return true;
  };

  // 本地关键字过滤
  const matchSearch = (topic: TopicItem, query: string): boolean => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      topic.title.toLowerCase().includes(q) ||
      topic.subtitle.toLowerCase().includes(q) ||
      topic.summary.toLowerCase().includes(q) ||
      topic.grade.toLowerCase().includes(q) ||
      topic.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  };

  // 当前选中的知识点（拓扑图抽屉展示）
  const selectedTopic = selectedSlug ? topicMap.get(selectedSlug) : null;

  // 计算当前选中节点的前置和后置依赖
  const { incomingEdges, outgoingEdges } = useMemo(() => {
    if (!selectedSlug) return { incomingEdges: [], outgoingEdges: [] };
    const incoming = TOPOLOGY_EDGES.filter((e) => e.to === selectedSlug);
    const outgoing = TOPOLOGY_EDGES.filter((e) => e.from === selectedSlug);
    return { incomingEdges: incoming, outgoingEdges: outgoing };
  }, [selectedSlug]);

  // 拓扑图节点分布与布局 (按 4 层纵向展开，自适应排列)
  const graphNodes = useMemo(() => {
    const tiers: Record<number, string[]> = {
      1: [], // 1~2 年级启蒙
      2: [], // 3~4 年级模型
      3: [], // 5~6 年级高阶
      4: [], // 初中数理
    };

    topics.forEach((t) => {
      if (t.stage === 'chuzhong' || t.grade.includes('初')) {
        tiers[4].push(t.slug);
      } else if (t.grade.includes('一年级') || t.grade.includes('二年级') || t.grade.includes('一/二年级')) {
        tiers[1].push(t.slug);
      } else if (t.grade.includes('三年级') || t.grade.includes('四年级') || t.grade.includes('三/四年级')) {
        tiers[2].push(t.slug);
      } else {
        tiers[3].push(t.slug);
      }
    });

    const nodeCoords = new Map<string, { x: number; y: number; tier: number }>();
    const canvasWidth = 1040;
    const tierY = { 1: 90, 2: 240, 3: 410, 4: 580 };

    Object.entries(tiers).forEach(([tierStr, slugs]) => {
      const tierNum = Number(tierStr) as 1 | 2 | 3 | 4;
      const count = slugs.length;
      const padding = 70;
      const step = count > 1 ? (canvasWidth - padding * 2) / (count - 1) : canvasWidth / 2;

      slugs.forEach((slug, idx) => {
        // 轻微上下波浪错开，避免水平遮挡
        const jitterY = (idx % 2 === 0 ? -12 : 12);
        nodeCoords.set(slug, {
          x: padding + idx * step,
          y: tierY[tierNum] + jitterY,
          tier: tierNum,
        });
      });
    });

    return nodeCoords;
  }, [topics]);

  return (
    <div className={`container ${styles.exploreContainer}`}>
      {/* 顶部 Hero 标头 */}
      <div className={styles.heroSection}>
        <div className={`badge badge-blue ${styles.heroBadge}`}>
          <Compass size={15} />
          <span>全站知识地图与认知导航</span>
        </div>
        <h1 className={styles.heroTitle}>中小学数理思维全景知识大目录</h1>
        <p className={styles.heroSubtitle}>
          告别孤立刷题！将全站所有交互式动画按 5 大核心思维体系与认知前置依赖全景串联。
          查漏补缺看前置，进阶提优看后续，让每个考点都有迹可循。
        </p>

        {/* 统计指标横幅 */}
        <div className={styles.statsBanner}>
          <div className={styles.statItem}>
            <Sparkles size={18} color="#2563eb" />
            <span>已收录</span>
            <span className={styles.statNumber}>{topics.length}</span>
            <span>个交互实验</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <Layers size={18} color="#7c3aed" />
            <span>划分为</span>
            <span className={styles.statNumber}>5</span>
            <span>大核心思维专题</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <GraduationCap size={18} color="#059669" />
            <span>覆盖</span>
            <span className={styles.statNumber}>1 ~ 9</span>
            <span>完整年级阶梯</span>
          </div>
        </div>
      </div>

      {/* 核心功能：双模式切换开关 */}
      <div className={styles.switchWrapper}>
        <div className={styles.switchPill}>
          <button
            className={`${styles.switchBtn} ${viewMode === 'catalog' ? styles.switchBtnActive : ''}`}
            onClick={() => setViewMode('catalog')}
          >
            <FolderTree size={16} />
            <span>📁 体系大目录视图</span>
          </button>
          <button
            className={`${styles.switchBtn} ${viewMode === 'graph' ? styles.switchBtnActive : ''}`}
            onClick={() => setViewMode('graph')}
          >
            <Network size={16} />
            <span>🕸️ 认知拓扑技能树</span>
          </button>
        </div>
      </div>

      {/* 筛选与本地搜索栏 */}
      <div className={styles.filterBar}>
        <div className={styles.gradeFilters}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, alignSelf: 'center' }}>
            年级分阶：
          </span>
          {[
            { key: 'all', label: '全部年级' },
            { key: 'low', label: '低年级启蒙 (1~2年级)' },
            { key: 'mid', label: '中年级模型 (3~4年级)' },
            { key: 'high', label: '高年级压轴 (5~6年级)' },
            { key: 'chuzhong', label: '初中数理公理' },
          ].map((item) => (
            <button
              key={item.key}
              className={`${styles.gradePill} ${gradeFilter === item.key ? styles.gradePillActive : ''}`}
              onClick={() => setGradeFilter(item.key as GradeFilter)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 快速即时搜索 */}
        <div className={styles.localSearch}>
          <Search size={15} color="#94a3b8" />
          <input
            type="text"
            placeholder="在当前视图筛选知识点..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <X size={14} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
          )}
        </div>
      </div>

      {/* ================= 视图 1：体系大目录 (Catalog Mode) ================= */}
      {viewMode === 'catalog' && (
        <div className={styles.catalogView}>
          {MODULE_CATEGORIES.map((cat: ModuleCategory) => {
            // 获取该模块下匹配年级和搜索词的所有知识点
            const moduleTopics = cat.slugs
              .map((slug) => topicMap.get(slug))
              .filter((t): t is TopicItem => Boolean(t))
              .filter((t) => matchGrade(t, gradeFilter))
              .filter((t) => matchSearch(t, searchQuery));

            if (moduleTopics.length === 0) return null;

            return (
              <section key={cat.id} className={styles.moduleSection}>
                <div className={styles.moduleHeader} style={{ background: cat.bgColor }}>
                  <div className={styles.moduleHeaderLeft}>
                    <div className={styles.moduleIcon} style={{ background: '#ffffff', border: `1px solid ${cat.borderColor}` }}>
                      {cat.icon}
                    </div>
                    <div className={styles.moduleTitleRow}>
                      <h2 style={{ color: cat.color }}>{cat.name}</h2>
                      <div className={styles.moduleDesc}>{cat.description}</div>
                    </div>
                  </div>
                  <div
                    className={styles.moduleTopicCount}
                    style={{ background: '#ffffff', color: cat.color, border: `1px solid ${cat.borderColor}` }}
                  >
                    已收录 {moduleTopics.length} 个考点
                  </div>
                </div>

                <div className={styles.topicsGrid}>
                  {moduleTopics.map((topic) => {
                    const stage = STAGES[topic.stage];
                    const subject = SUBJECTS[topic.subject];
                    const href = `/${topic.stage}/${topic.subject}/${topic.slug}`;

                    return (
                      <Link key={topic.slug} href={href} className={styles.catalogTopicCard}>
                        <div>
                          <div className={styles.topicMetaRow}>
                            <span className="badge badge-blue" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                              {stage?.name}
                            </span>
                            <span
                              className="badge"
                              style={{
                                fontSize: '0.7rem',
                                padding: '1px 6px',
                                background: `${subject?.color}15`,
                                color: subject?.color,
                                border: `1px solid ${subject?.color}30`,
                              }}
                            >
                              {subject?.name}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {topic.grade}
                            </span>
                          </div>

                          <h3 className={styles.topicCardTitle}>{topic.title}</h3>
                          <p className={styles.topicCardSummary}>{topic.summary}</p>

                          {topic.parentGuide?.keyTakeaway && (
                            <div style={{ fontSize: '0.76rem', color: '#b45309', background: '#fef3c7', padding: '4px 8px', borderRadius: '4px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Lightbulb size={12} style={{ flexShrink: 0 }} />
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <strong>核心：</strong>{topic.parentGuide.keyTakeaway}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className={styles.topicCardFooter}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />
                            约 {topic.durationMinutes} 分钟
                          </span>
                          <span className={styles.topicEnterLink}>
                            进入实验 <ArrowRight size={13} />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* ================= 视图 2：认知拓扑技能树 (Graph Mode) ================= */}
      {viewMode === 'graph' && (
        <div className={styles.graphContainer}>
          {/* 左上角图例 */}
          <div className={styles.graphToolbar}>
            <div className={styles.legendIndicator}>
              <span className={styles.legendDot} style={{ background: '#ea580c' }} />
              <span>橙色连线：前置基础（卡壳必补）</span>
            </div>
            <div className={styles.legendIndicator}>
              <span className={styles.legendDot} style={{ background: '#2563eb' }} />
              <span>蓝色连线：进阶延伸（学通提优）</span>
            </div>
          </div>

          {/* SVG 拓扑画布 */}
          <div style={{ width: '100%', overflowX: 'auto', padding: '20px 0' }}>
            <svg
              viewBox="0 0 1040 680"
              style={{ width: '100%', minWidth: '960px', height: '680px', display: 'block' }}
            >
              {/* 年级分层背景横带 */}
              <rect x="20" y="30" width="1000" height="120" rx="12" fill="#f8fafc" stroke="#f1f5f9" />
              <text x="36" y="54" fontSize="12" fontWeight="800" fill="#94a3b8">LEVEL 1 · 低年级数感与空间启蒙 (一至二年级)</text>

              <rect x="20" y="170" width="1000" height="140" rx="12" fill="#f8fafc" stroke="#f1f5f9" />
              <text x="36" y="194" fontSize="12" fontWeight="800" fill="#94a3b8">LEVEL 2 · 中年级模型建立与转化 (三至四年级)</text>

              <rect x="20" y="330" width="1000" height="160" rx="12" fill="#f8fafc" stroke="#f1f5f9" />
              <text x="36" y="354" fontSize="12" fontWeight="800" fill="#94a3b8">LEVEL 3 · 高年级几何五大模型与综合压轴 (五至六年级)</text>

              <rect x="20" y="510" width="1000" height="140" rx="12" fill="#f8fafc" stroke="#f1f5f9" />
              <text x="36" y="534" fontSize="12" fontWeight="800" fill="#94a3b8">LEVEL 4 · 初中数理定理证明与物理公理 (七至九年级)</text>

              {/* 渲染连接边 */}
              {TOPOLOGY_EDGES.map((edge, idx) => {
                const fromNode = graphNodes.get(edge.from);
                const toNode = graphNodes.get(edge.to);
                if (!fromNode || !toNode) return null;

                const isIncoming = selectedSlug === edge.to;
                const isOutgoing = selectedSlug === edge.from;
                const isHighlighted = isIncoming || isOutgoing;

                // 曲线贝塞尔路径
                const midY = (fromNode.y + toNode.y) / 2;
                const pathData = `M ${fromNode.x} ${fromNode.y} C ${fromNode.x} ${midY}, ${toNode.x} ${midY}, ${toNode.x} ${toNode.y}`;

                return (
                  <g key={idx}>
                    <path
                      d={pathData}
                      fill="none"
                      stroke={
                        isIncoming ? '#ea580c' : isOutgoing ? '#2563eb' : selectedSlug ? '#e2e8f0' : '#cbd5e1'
                      }
                      strokeWidth={isHighlighted ? 3 : 1.2}
                      strokeDasharray={isHighlighted ? 'none' : '4 3'}
                      opacity={selectedSlug && !isHighlighted ? 0.35 : 1}
                      markerEnd="url(#arrow)"
                    />
                    {isHighlighted && (
                      <text
                        x={(fromNode.x + toNode.x) / 2}
                        y={midY}
                        fontSize="10"
                        fontWeight="700"
                        fill={isIncoming ? '#c2410c' : '#1d4ed8'}
                        textAnchor="middle"
                        style={{ background: '#fff' }}
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* 箭头标记定义 */}
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#94a3b8" />
                </marker>
              </defs>

              {/* 渲染所有知识点圆圈节点 */}
              {topics.map((t) => {
                const coord = graphNodes.get(t.slug);
                if (!coord) return null;

                const isSelected = selectedSlug === t.slug;
                const isIncomingSource = incomingEdges.some((e) => e.from === t.slug);
                const isOutgoingTarget = outgoingEdges.some((e) => e.to === t.slug);
                const isRelated = isSelected || isIncomingSource || isOutgoingTarget;

                // 节点颜色（按学科区分）
                const nodeColor =
                  t.stage === 'chuzhong'
                    ? '#7c3aed'
                    : isSelected
                    ? '#2563eb'
                    : isIncomingSource
                    ? '#ea580c'
                    : isOutgoingTarget
                    ? '#0284c7'
                    : '#334155';

                return (
                  <g
                    key={t.slug}
                    onClick={() => setSelectedSlug(t.slug)}
                    style={{ cursor: 'pointer' }}
                    opacity={selectedSlug && !isRelated ? 0.35 : 1}
                  >
                    {/* 选中高亮光环 */}
                    {isSelected && (
                      <circle cx={coord.x} cy={coord.y} r="26" fill="#eff6ff" stroke="#2563eb" strokeWidth="2.5" />
                    )}

                    {/* 前置节点橙色呼吸环 */}
                    {isIncomingSource && (
                      <circle cx={coord.x} cy={coord.y} r="22" fill="#fff7ed" stroke="#ea580c" strokeWidth="2" strokeDasharray="3 3" />
                    )}

                    {/* 实体圆心 */}
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={isSelected ? 16 : 12}
                      fill={nodeColor}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />

                    {/* 节点名称文字 */}
                    <text
                      x={coord.x}
                      y={coord.y + 24}
                      textAnchor="middle"
                      fontSize={isSelected ? '12' : '10'}
                      fontWeight={isSelected ? '800' : '600'}
                      fill={isSelected ? '#1e40af' : '#1e293b'}
                    >
                      {t.title.length > 8 ? t.title.slice(0, 8) + '...' : t.title}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 侧边弹出详情抽屉 */}
          {selectedTopic && (
            <div className={styles.drawerCard}>
              <div className={styles.drawerHeader}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                    {STAGES[selectedTopic.stage]?.name}
                  </span>
                  <span
                    className="badge"
                    style={{
                      fontSize: '0.72rem',
                      background: `${SUBJECTS[selectedTopic.subject]?.color}15`,
                      color: SUBJECTS[selectedTopic.subject]?.color,
                    }}
                  >
                    {selectedTopic.grade}
                  </span>
                </div>
                <button className={styles.drawerCloseBtn} onClick={() => setSelectedSlug(null)}>
                  <X size={18} />
                </button>
              </div>

              <h3 className={styles.drawerTitle}>{selectedTopic.title}</h3>
              <p className={styles.drawerSummary}>{selectedTopic.summary}</p>

              {/* 前置依赖溯源列表 */}
              <div className={styles.drawerSectionTitle}>
                <span>🚨 前置必修根基（做题卡壳先查这里）：</span>
              </div>
              <div className={styles.depList}>
                {incomingEdges.length > 0 ? (
                  incomingEdges.map((edge) => {
                    const pre = topicMap.get(edge.from);
                    if (!pre) return null;
                    return (
                      <div
                        key={edge.from}
                        className={`${styles.depItem} ${styles.depItemPre}`}
                        onClick={() => setSelectedSlug(edge.from)}
                      >
                        <strong>{pre.title}</strong>
                        <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>关联：{edge.label}</span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', padding: '4px 0' }}>
                    该知识点为底层基础启蒙，无前置门槛，可直接开始！
                  </div>
                )}
              </div>

              {/* 进阶延伸列表 */}
              <div className={styles.drawerSectionTitle}>
                <span>🚀 学通后可进阶（知识树生长方向）：</span>
              </div>
              <div className={styles.depList}>
                {outgoingEdges.length > 0 ? (
                  outgoingEdges.map((edge) => {
                    const next = topicMap.get(edge.to);
                    if (!next) return null;
                    return (
                      <div
                        key={edge.to}
                        className={`${styles.depItem} ${styles.depItemNext}`}
                        onClick={() => setSelectedSlug(edge.to)}
                      >
                        <strong>{next.title}</strong>
                        <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>进阶：{edge.label}</span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', padding: '4px 0' }}>
                    已是该分支当前的压轴巅峰考点！
                  </div>
                )}
              </div>

              {/* 跳转进入该知识点详情页 */}
              <Link
                href={`/${selectedTopic.stage}/${selectedTopic.subject}/${selectedTopic.slug}`}
                className={styles.drawerEnterBtn}
              >
                <span>进入交互实验室</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
