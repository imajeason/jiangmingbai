'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Search, 
  Home, 
  Network, 
  FileCode, 
  Bot, 
  ExternalLink, 
  BookOpen, 
  Sparkles, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FolderTree,
  Code2
} from 'lucide-react';
import { TopicItem, StageKey, SubjectKey, StageInfo, SubjectInfo } from '@/types';
import styles from '@/styles/sitemap.module.css';

interface SitemapClientViewProps {
  topics: TopicItem[];
  stages: Record<StageKey, StageInfo>;
  subjects: Record<SubjectKey, SubjectInfo>;
}

export default function SitemapClientView({ topics, stages, subjects }: SitemapClientViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤知识点
  const filteredTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter((t) => {
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchSubtitle = t.subtitle.toLowerCase().includes(q);
      const matchSummary = t.summary.toLowerCase().includes(q);
      const matchGrade = t.grade.toLowerCase().includes(q);
      const matchTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchSlug = t.slug.toLowerCase().includes(q);
      const matchSubject = subjects[t.subject]?.name.toLowerCase().includes(q);
      const matchStage = stages[t.stage]?.name.toLowerCase().includes(q);
      return matchTitle || matchSubtitle || matchSummary || matchGrade || matchTags || matchSlug || matchSubject || matchStage;
    });
  }, [topics, searchQuery, subjects, stages]);

  const stageKeys = Object.keys(stages) as StageKey[];
  const subjectKeys = Object.keys(subjects) as SubjectKey[];

  const countByStage = useMemo(() => {
    const res: Record<string, number> = {};
    topics.forEach((t) => {
      res[t.stage] = (res[t.stage] || 0) + 1;
    });
    return res;
  }, [topics]);

  // 公共主干页面
  const corePages = [
    {
      title: '讲明白 - 首页',
      url: '/',
      path: 'https://jiangmb.com/',
      desc: '专为家长与中小学生设计的数理化可视化互动实验室，纯 JS 交互动画直击本质。',
      icon: Home,
    },
    {
      title: '全部分类与认知技能树',
      url: '/explore/',
      path: 'https://jiangmb.com/explore/',
      desc: '交互式知识图谱、前置拓扑技能树与学段学科分类索引。',
      icon: Network,
    },
    {
      title: '小学专区 (1-6年级)',
      url: '/xiaoxue/',
      path: 'https://jiangmb.com/xiaoxue/',
      desc: '从直观感知到数理模型启蒙，覆盖小学趣味数学、空间认知、应用题模型。',
      icon: BookOpen,
    },
    {
      title: '初中专区 (7-9年级)',
      url: '/chuzhong/',
      path: 'https://jiangmb.com/chuzhong/',
      desc: '几何公理逻辑推导、力学与浮力实验，平稳度过初中抽象数理关卡。',
      icon: BookOpen,
    },
    {
      title: '高中专区 (高一至高三)',
      url: '/gaozhong/',
      path: 'https://jiangmb.com/gaozhong/',
      desc: '极限与微积分思想、电磁场与微观分子反应模型探索（筹备中）。',
      icon: BookOpen,
    },
    {
      title: 'HTML 网站地图 (当前页)',
      url: '/sitemap/',
      path: 'https://jiangmb.com/sitemap/',
      desc: '全站所有页面、交互动画实验、学段学科分类总目录及索引指南。',
      icon: FolderTree,
    },
    {
      title: 'XML 搜索引擎站点地图',
      url: '/sitemap.xml',
      path: 'https://jiangmb.com/sitemap.xml',
      desc: '遵循 sitemaps.org 协议标准的 XML 机器格式，供各大搜索引擎自动化抓取。',
      icon: FileCode,
    },
    {
      title: 'Robots 爬虫抓取协议',
      url: '/robots.txt',
      path: 'https://jiangmb.com/robots.txt',
      desc: '定义搜索引擎蜘蛛访问规则与站点地图索引入口配置。',
      icon: Bot,
    },
  ];

  return (
    <div className={`container ${styles.sitemapContainer}`}>
      {/* 顶部面包屑导航 */}
      <nav className={styles.breadcrumb} aria-label="面包屑导航">
        <Link href="/">首页</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>网站地图</span>
      </nav>

      {/* Hero 介绍区与数据指标 */}
      <div className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div className="badge badge-blue" style={{ marginBottom: '10px' }}>
            <Compass size={14} />
            <span>全站索引与页面地图</span>
          </div>
          <h1 className={styles.title}>讲明白 · 网站地图 (Site Map)</h1>
          <p className={styles.subtitle}>
            这里汇集了「讲明白」知识点可视化实验室的所有主干页面、学段专区、学科聚合以及全量 {topics.length} 个纯 JS 交互动画实验。为家长、学生和搜索引擎提供清晰透彻的索引目录。
          </p>
        </div>

        {/* 统计指标 */}
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{topics.length}</span>
            <span className={styles.statLabel}>已上线交互动画实验</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stageKeys.length}</span>
            <span className={styles.statLabel}>覆盖核心学段 (小/初/高)</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{subjectKeys.length}</span>
            <span className={styles.statLabel}>数理化门类完整划分</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statLabel}>纯静态预渲染 (SSG)</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>50+</span>
            <span className={styles.statLabel}>全站静态页面秒级直达</span>
          </div>
        </div>
      </div>

      {/* 快捷锚点跳转与实时搜索条 */}
      <div className={styles.quickNavSticky}>
        <div className={styles.quickNavPills}>
          <a href="#core-pages" className={styles.quickNavPill}>
            <Home size={14} />
            <span>公共主干</span>
          </a>
          {stageKeys.map((stageKey) => (
            <a key={stageKey} href={`#stage-${stageKey}`} className={styles.quickNavPill}>
              <span>{stages[stageKey].name}专区</span>
              <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>
                ({countByStage[stageKey] || 0})
              </span>
            </a>
          ))}
          <a href="#protocols" className={styles.quickNavPill}>
            <Code2 size={14} />
            <span>爬虫协议与规范</span>
          </a>
        </div>

        <div className={styles.searchBox}>
          <Search size={15} color="#94a3b8" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="搜索知识点、年级或难点..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {filteredTopics.length} 项匹配
            </span>
          )}
        </div>
      </div>

      {/* 1. 核心与公共页面 */}
      <section id="core-pages" className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 className={styles.sectionTitle}>全站核心与系统公共页面</h2>
            <span className="badge badge-blue">8 个主干页面</span>
          </div>
          <span className={styles.sectionDesc}>高权重核心路由与机器抓取协议</span>
        </div>

        <div className={styles.coreGrid}>
          {corePages.map((page) => {
            const Icon = page.icon;
            return (
              <Link key={page.url} href={page.url} className={styles.coreCard}>
                <div className={styles.coreCardTop}>
                  <div className={styles.coreIconWrap}>
                    <Icon size={18} />
                  </div>
                  <span className={styles.coreUrl}>{page.url}</span>
                </div>
                <h3 className={styles.coreTitle}>{page.title}</h3>
                <p className={styles.coreDesc}>{page.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 2. 各学段专区与知识点全览 */}
      {stageKeys.map((stageKey) => {
        const stage = stages[stageKey];
        const stageTopics = filteredTopics.filter((t) => t.stage === stageKey);
        const stageTotal = topics.filter((t) => t.stage === stageKey).length;

        return (
          <section key={stageKey} id={`stage-${stageKey}`} className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <h2 className={styles.sectionTitle}>{stage.name}专区知识地图</h2>
                <span className="badge badge-blue">{stage.badge}</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  共 {stageTotal} 个实验模型
                </span>
              </div>
              <Link 
                href={`/${stageKey}`}
                style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                进入{stage.name}聚合页 <ArrowRight size={14} />
              </Link>
            </div>

            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
              {stage.description}
            </p>

            {/* 学科分栏 */}
            {subjectKeys.map((subjectKey) => {
              const subject = subjects[subjectKey];
              const subTopics = stageTopics.filter((t) => t.subject === subjectKey);
              const allSubTopicsCount = topics.filter((t) => t.stage === stageKey && t.subject === subjectKey).length;

              if (searchQuery && subTopics.length === 0) {
                return null;
              }

              return (
                <div key={subjectKey} className={styles.subjectGroup}>
                  <div className={styles.subjectHeader}>
                    <div className={styles.subjectTitle}>
                      <span className={styles.subjectDot} style={{ background: subject.color }} />
                      <span>{stage.name}{subject.name}</span>
                      <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.72rem' }}>
                        {allSubTopicsCount > 0 ? `${allSubTopicsCount} 个实验` : '规划筹备中'}
                      </span>
                    </div>
                    <Link
                      href={`/${stageKey}/${subjectKey}`}
                      style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                    >
                      查看学科主页 <ArrowRight size={13} />
                    </Link>
                  </div>

                  {subTopics.length > 0 ? (
                    <div className={styles.topicsGrid}>
                      {subTopics.map((topic) => (
                        <Link
                          key={topic.id}
                          href={`/${topic.stage}/${topic.subject}/${topic.slug}/`}
                          className={styles.topicCard}
                        >
                          <div>
                            <div className={styles.topicCardTop}>
                              <h4 className={styles.topicTitle}>{topic.title}</h4>
                              <span className={styles.gradeBadge}>{topic.grade}</span>
                            </div>
                            <div className={styles.topicSubtitle}>{topic.subtitle}</div>

                            <p className={styles.topicSummary}>{topic.summary}</p>
                          </div>

                          <div>
                            <div className={styles.topicMeta}>
                              <span className={styles.durationBadge}>
                                <Clock size={11} />
                                {topic.durationMinutes} 分钟
                              </span>
                              <span className={styles.durationBadge}>
                                难度: {'⭐'.repeat(topic.difficulty)}
                              </span>
                              {topic.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className={styles.durationBadge} style={{ background: '#f8fafc' }}>
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            <div className={styles.topicFooter}>
                              <span>进入交互实验室</span>
                              <ArrowRight size={13} />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyTip}>
                      {allSubTopicsCount === 0
                        ? `该学科属于${stage.name}专区后续规划，敬请期待！`
                        : `未找到与“${searchQuery}”匹配的${stage.name}${subject.name}知识点`}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        );
      })}

      {/* 3. 规范协议与开发者说明 */}
      <section id="protocols" className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 className={styles.sectionTitle}>架构规范与搜索引擎协议</h2>
            <span className="badge badge-green">标准兼容</span>
          </div>
          <span className={styles.sectionDesc}>基于 Next.js 纯静态导出与 Cloudflare Edge 全球毫秒分发</span>
        </div>

        <div className={styles.protocolCard}>
          <div className={styles.protocolItem}>
            <div className={styles.protocolIcon}>
              <FileCode size={22} />
            </div>
            <div className={styles.protocolText}>
              <h4>XML 搜索引擎地图</h4>
              <p>
                专为 Google、Baidu、Bing 等网络蜘蛛提供结构化 XML 索引文件，包含所有页面的最后修改时间与抓取优先级权重。
              </p>
              <a href="/sitemap.xml" target="_blank" rel="noreferrer" className={styles.protocolLink}>
                <span>查看 sitemap.xml</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className={styles.protocolItem}>
            <div className={styles.protocolIcon}>
              <Bot size={22} />
            </div>
            <div className={styles.protocolText}>
              <h4>Robots 抓取协议规则</h4>
              <p>
                开放所有合规搜索引擎爬虫对根目录、学段分类以及知识点交互实验室的完全抓取，指引正确的站点地图入口。
              </p>
              <a href="/robots.txt" target="_blank" rel="noreferrer" className={styles.protocolLink}>
                <span>查看 robots.txt</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className={styles.protocolItem}>
            <div className={styles.protocolIcon}>
              <ShieldCheck size={22} />
            </div>
            <div className={styles.protocolText}>
              <h4>绿色无广告 & 开源知识共享</h4>
              <p>
                全站代码遵循 MIT 许可协议，演示与图解遵循 CC BY-NC-SA 4.0 知识共享协议，零广告、无弹窗、不收集个人隐私。
              </p>
              <span style={{ fontSize: '0.8rem', color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <CheckCircle2 size={13} />
                纯公益绿色学习平台
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
