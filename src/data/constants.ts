import { StageInfo, StageKey, SubjectInfo, SubjectKey } from '@/types';

export const STAGES: Record<StageKey, StageInfo> = {
  xiaoxue: {
    key: 'xiaoxue',
    name: '小学',
    badge: '1-6年级',
    description: '重在具象化思维启蒙、生活经验连接与直观观察。',
  },
  chuzhong: {
    key: 'chuzhong',
    name: '初中',
    badge: '7-9年级',
    description: '数理化启蒙关键期，从直观经验过渡到逻辑推导与物理模型。',
  },
  gaozhong: {
    key: 'gaozhong',
    name: '高中',
    badge: '高一至高三',
    description: '深度数理逻辑抽象，微积分思想、微观与场模型的可视化。',
  },
};

export const SUBJECTS: Record<SubjectKey, SubjectInfo> = {
  math: {
    key: 'math',
    name: '数学',
    color: '#2563eb',
    iconName: 'Calculator',
    description: '数形结合、几何割补拼图、函数图像动态变化',
  },
  physics: {
    key: 'physics',
    name: '物理',
    color: '#0891b2',
    iconName: 'Atom',
    description: '力学受力平衡、光学折射反射、电磁感应直观实验',
  },
  chemistry: {
    key: 'chemistry',
    name: '化学',
    color: '#059669',
    iconName: 'FlaskConical',
    description: '分子原子微观重组、溶液离子反应、元素周期律',
  },
  biology: {
    key: 'biology',
    name: '生物',
    color: '#16a34a',
    iconName: 'Dna',
    description: '细胞分裂、光合作用过程、血液循环系统动图',
  },
  geography: {
    key: 'geography',
    name: '地理',
    color: '#d97706',
    iconName: 'Globe',
    description: '地球自转公转与昼夜交替、等高线地形图三维投影',
  },
};
