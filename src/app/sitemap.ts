import { MetadataRoute } from 'next';
import { STAGES, SUBJECTS } from '@/data/constants';
import { getAllTopics } from '@/lib/topics';
import { StageKey, SubjectKey } from '@/types';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jiangmingbai.pages.dev';

  // 1. 首页
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. 学段分类页
  (Object.keys(STAGES) as StageKey[]).forEach((stage) => {
    routes.push({
      url: `${baseUrl}/${stage}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });

  // 3. 学段 + 学科复合分类页
  (Object.keys(STAGES) as StageKey[]).forEach((stage) => {
    (Object.keys(SUBJECTS) as SubjectKey[]).forEach((subject) => {
      routes.push({
        url: `${baseUrl}/${stage}/${subject}/`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    });
  });

  // 4. 所有知识点详情页
  getAllTopics().forEach((topic) => {
    routes.push({
      url: `${baseUrl}/${topic.stage}/${topic.subject}/${topic.slug}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.95,
    });
  });

  return routes;
}
