import React from 'react';
import { Metadata } from 'next';
import { STAGES, SUBJECTS } from '@/data/constants';
import { getAllTopics } from '@/lib/topics';
import SitemapClientView from '@/components/sitemap/SitemapClientView';

export const metadata: Metadata = {
  title: '网站地图 (Sitemap) - 中小学数理化知识点全站索引与交互实验导航 - 讲明白',
  description:
    '讲明白 (jiangmb.com) 完整网站地图。涵盖小学趣味数学、初中数理化所有可交互动画实验室、各学段分类索引、认知技能树及搜索引擎规范文件，方便快速检索与导航。',
  keywords: [
    '网站地图',
    'Sitemap',
    '讲明白知识点',
    '小学数学知识点目录',
    '初中物理实验列表',
    '初中数学定理动图',
    '中小学数理化学习导航',
  ],
  alternates: {
    canonical: 'https://jiangmb.com/sitemap/',
  },
  openGraph: {
    title: '网站地图 (Sitemap) - 讲明白知识点可视化实验室',
    description:
      '全站所有主干页面、学段专区、学科聚合以及全部交互动画实验与家长辅导指南的一览式导航目录。',
    url: 'https://jiangmb.com/sitemap/',
    siteName: '讲明白 JiangMingBai',
    locale: 'zh_CN',
    type: 'website',
  },
};

export default function SitemapPage() {
  const allTopics = getAllTopics();

  // 结构化数据 (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    name: '讲明白 - 网站地图',
    description: '讲明白中小学数理化可视化实验室全站内容索引与知识点目录',
    url: 'https://jiangmb.com/sitemap/',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '首页',
          item: 'https://jiangmb.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '网站地图',
          item: 'https://jiangmb.com/sitemap/',
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SitemapClientView topics={allTopics} stages={STAGES} subjects={SUBJECTS} />
    </>
  );
}
