export type StageKey = 'xiaoxue' | 'chuzhong' | 'gaozhong';

export type SubjectKey = 'math' | 'physics' | 'chemistry' | 'biology' | 'geography';

export interface StageInfo {
  key: StageKey;
  name: string;
  badge: string;
  description: string;
}

export interface SubjectInfo {
  key: SubjectKey;
  name: string;
  color: string;
  iconName: string;
  description: string;
}

export interface ParentGuideStep {
  stepNumber: number;
  question: string;
  guide: string;
}

export interface PrerequisiteRef {
  slug?: string;
  title: string;
  reason: string;
  strength?: 'hard' | 'soft';
}

export interface TopicItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  stage: StageKey;
  grade: string;
  subject: SubjectKey;
  difficulty: 1 | 2 | 3; // 1: 基础认知, 2: 核心考点, 3: 拓展进阶
  durationMinutes: number;
  summary: string;
  coreFormula?: string;
  parentGuide: {
    painPoint: string;
    steps: ParentGuideStep[];
    realLifeExample: string;
    keyTakeaway: string;
  };
  tags: string[];
  animationType: 'circle-area' | 'pythagorean-theorem' | 'buoyancy-archimedes' | 'clock-reading' | string;
  prerequisites?: PrerequisiteRef[];
  nextSteps?: PrerequisiteRef[];
  evidence?: string[];
  assessmentPrompt?: string;
  content?: string;
}
