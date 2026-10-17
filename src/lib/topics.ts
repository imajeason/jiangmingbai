import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { StageKey, SubjectKey, TopicItem } from '@/types';

const TOPICS_DIR = path.join(process.cwd(), 'content', 'topics');

/**
 * 从 content/topics/*.md 目录读取并解析所有知识点 Markdown 文件 (Server-only)
 */
export function getAllTopics(): TopicItem[] {
  if (!fs.existsSync(TOPICS_DIR)) {
    return [];
  }

  const fileNames = fs.readdirSync(TOPICS_DIR);
  const topics: TopicItem[] = [];

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;

    const fullPath = path.join(TOPICS_DIR, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const topicItem: TopicItem = {
      id: data.id || fileName.replace(/\.md$/, ''),
      slug: data.slug || fileName.replace(/\.md$/, ''),
      title: data.title || '',
      subtitle: data.subtitle || '',
      stage: data.stage as StageKey,
      grade: data.grade || '',
      subject: data.subject as SubjectKey,
      difficulty: Number(data.difficulty || 1) as 1 | 2 | 3,
      durationMinutes: Number(data.durationMinutes || 3),
      summary: data.summary || '',
      coreFormula: data.coreFormula,
      parentGuide: data.parentGuide || {
        painPoint: '',
        steps: [],
        realLifeExample: '',
        keyTakeaway: '',
      },
      tags: Array.isArray(data.tags) ? data.tags : [],
      animationType: data.animationType,
      content: content.trim(),
    };

    topics.push(topicItem);
  }

  return topics;
}

export function getTopicBySlug(slug: string): TopicItem | undefined {
  const all = getAllTopics();
  return all.find((t) => t.slug === slug);
}

export function getTopicsByFilter(stage?: StageKey, subject?: SubjectKey): TopicItem[] {
  const all = getAllTopics();
  return all.filter((t) => {
    if (stage && t.stage !== stage) return false;
    if (subject && t.subject !== subject) return false;
    return true;
  });
}
