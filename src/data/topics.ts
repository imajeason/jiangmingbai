import { StageInfo, StageKey, SubjectInfo, SubjectKey, TopicItem } from '@/types';

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

export const TOPICS: TopicItem[] = [
  {
    id: 'circle-area',
    slug: 'circle-area',
    title: '圆的面积推导：切拼长方形法',
    subtitle: '极限与转化思想的第一次相遇，看圆如何神奇化为长方形',
    stage: 'xiaoxue',
    grade: '小学六年级上册',
    subject: 'math',
    difficulty: 1,
    durationMinutes: 3,
    summary: '通过把圆等分成多份扇形，交错拼成近似长方形。当分成的份数越多，拼成的图形越接近长方形，从而直观推导出 S = πr²。',
    coreFormula: 'S = πr × r = πr²',
    parentGuide: {
      painPoint: '孩子死记硬背 S = πr²，做应用题时不知道为什么半径平方要乘以 3.14，一旦题目稍微变形（如求环形或半圆展开）就乱了阵脚。',
      steps: [
        {
          stepNumber: 1,
          question: '“宝贝你看，如果把一张圆形比萨切成8瓣，交错排成一排，它像什么图形？”',
          guide: '先引导孩子观察拼图的上下起伏边缘，让孩子发现它已经隐约有了长方形的轮廓。'
        },
        {
          stepNumber: 2,
          question: '“如果我们把它切成 16 瓣、32 瓣、甚至无数细瓣，波浪边会变得怎么样？”',
          guide: '让孩子拉动滑动条观察：份数越多，上下波浪边缘越直，左右两条边越陡直，最终完全变成标准长方形。'
        },
        {
          stepNumber: 3,
          question: '“这个拼出的长方形，它的‘宽’等于圆的什么？它的‘长’又是圆的哪一部分？”',
          guide: '长方形的宽正好是圆的半径 r；长正好是圆周长的一半（因为上下各占半个圆周），即 2πr ÷ 2 = πr。长方形面积 = 长 × 宽 = πr × r = πr²！'
        }
      ],
      realLifeExample: '家里切橙子或者西瓜切片排开，或者把一本厚厚的字典弯折展开，体会“体积/面积不变，形态转化”的守恒原理。',
      keyTakeaway: '“化曲为直，割补转化”——长方形的宽是半径 r，长是半个周长 πr，相乘就是 πr²。'
    },
    tags: ['圆', '面积推导', '极限转化', '几何图形'],
    animationType: 'circle-area'
  },
  {
    id: 'pythagorean-theorem',
    slug: 'pythagorean-theorem',
    title: '勾股定理：赵爽弦图面积拼图证明',
    subtitle: '无需枯燥代数，动动手拼一拼，千古定理尽收眼底',
    stage: 'chuzhong',
    grade: '初中八年级下册',
    subject: 'math',
    difficulty: 2,
    durationMinutes: 4,
    summary: '利用4个全等的直角三角形拼成大正方形，中间留一个小正方形。通过大正方形面积与拆分面积的恒等关系，以形证数，一目了然看懂 a² + b² = c²。',
    coreFormula: 'a² + b² = c²',
    parentGuide: {
      painPoint: '很多学生知道勾三股四弦五，但遇到几何压轴题中求线段长、作垂线构造勾股方程时，缺乏对“面积割补与直角三角形边长关系”的几何直觉。',
      steps: [
        {
          stepNumber: 1,
          question: '“你看外面的大正方形边长是斜边 c，它的面积是多少？”',
          guide: '孩子一眼能看出：大正方形面积就是 c²。'
        },
        {
          stepNumber: 2,
          question: '“这个大正方形是由哪几块拼出来的？”',
          guide: '引导孩子数数：4 个相同的直角三角形（每个面积是 1/2 × a × b），加上正中间边长为 (b - a) 的小正方形。'
        },
        {
          stepNumber: 3,
          question: '“把 4 个三角形挪一挪位置，看看能不能拼成两个以 a 和 b 为边长的正方形？”',
          guide: '点击动画中的“拼图转换”按钮，直观看到总面积正好对应 a² + b²，因此 c² = a² + b² 成立！'
        }
      ],
      realLifeExample: '木工量直角时常做 3:4:5 的木架子；测量高楼/大树高度时的影子投影直角三角测量法。',
      keyTakeaway: '“弦图面积拼一拼，斜边平方等于两直角边平方和。”'
    },
    tags: ['勾股定理', '几何证明', '赵爽弦图', '直角三角形'],
    animationType: 'pythagorean-theorem'
  },
  {
    id: 'buoyancy-archimedes',
    slug: 'buoyancy-archimedes',
    title: '阿基米德原理：浮力与排开液体重力的动态平衡',
    subtitle: '沉底和漂浮到底受多大浮力？溢水杯与弹簧测力计的同步实验',
    stage: 'chuzhong',
    grade: '初中八年级下册',
    subject: 'physics',
    difficulty: 2,
    durationMinutes: 5,
    summary: '交互式沉浸模拟：将浸入物块逐步下放进入盛满水的溢水杯中，弹簧测力计拉力减小值，正好等于右侧量筒中排开水的重力，直观验证 F浮 = G排 = ρ液gV排。',
    coreFormula: 'F_浮 = G - F\' = G_排 = ρ_液 · g · V_排',
    parentGuide: {
      painPoint: '初中物理第一道大坎就是浮力。孩子常误以为“越重的物体受浮力越大”或者“沉入水底的物体不受浮力”。',
      steps: [
        {
          stepNumber: 1,
          question: '“我们把铁块慢慢放进水里，你看弹簧秤的数字变小了多少？”',
          guide: '让孩子拖动物块下沉，观察弹簧秤示数从 5N 降到 3N，少了 2N，引导孩子思考：少的这 2N 力去哪了？'
        },
        {
          stepNumber: 2,
          question: '“仔细看右边接水的小量筒，流出来的水有多重？”',
          guide: '让孩子看量筒：流出来的水正好也是 2N！原来水给铁块向上顶了 2N 的浮力，同时被挤出来的水正好也是 2N 重！'
        },
        {
          stepNumber: 3,
          question: '“如果物体完全浸没后，再继续往下放，弹簧秤还会变小吗？”',
          guide: '让孩子继续拖拽到杯底：示数不再变化！因为排开的水体积不再增加，说明浮力只跟排开液体的体积有关，跟浸入深度无关！'
        }
      ],
      realLifeExample: '人在游泳池里抱膝浮起；大轮船是钢铁做的却能浮在海面上（因为内部空心排开了巨量的海水）。',
      keyTakeaway: '“浸在液体里的物体受到的浮力，大小等于它排开液体受到的重力（F浮 = G排）。”'
    },
    tags: ['阿基米德原理', '浮力', '排水法', '力学实验'],
    animationType: 'buoyancy-archimedes'
  }
];

export function getAllTopics(): TopicItem[] {
  return TOPICS;
}

export function getTopicBySlug(slug: string): TopicItem | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

export function getTopicsByFilter(stage?: StageKey, subject?: SubjectKey): TopicItem[] {
  return TOPICS.filter((t) => {
    if (stage && t.stage !== stage) return false;
    if (subject && t.subject !== subject) return false;
    return true;
  });
}
