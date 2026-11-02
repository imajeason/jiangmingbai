import { StageKey, SubjectKey } from '@/types';

export interface ModuleCategory {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  slugs: string[];
}

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
  reason?: string;
}

export const MODULE_CATEGORIES: ModuleCategory[] = [
  {
    id: 'number-sense-theory',
    name: '数感数论与计算巧算专题',
    shortName: '数论与巧算',
    icon: '🔢',
    color: '#0284c7',
    bgColor: '#f0f9ff',
    borderColor: '#bae6fd',
    description: '从十进制与加减数感启蒙，迈向分解质因数、模运算周期、整除密码与裂项对消高阶巧算。',
    slugs: [
      'ten-frame-addition-subtraction',
      'multiplication-array',
      'periodic-patterns',
      'magic-square-number-array',
      'arithmetic-progression-gauss',
      'distributive-law-area',
      'prime-factorization-lcm-gcd',
      'divisibility-rules-math',
      'fraction-telescoping-sum',
    ],
  },
  {
    id: 'geometry-five-models',
    name: '空间几何与五大模型专题',
    shortName: '几何五大模型',
    icon: '📐',
    color: '#7c3aed',
    bgColor: '#faf5ff',
    borderColor: '#e9d5ff',
    description: '从方向积木与周长面积认知，进阶平行四边形割补、正方体展开、鸟头、蝴蝶、燕尾模型与圆面积极限。',
    slugs: [
      'front-back-left-right',
      'compass-directions',
      'hidden-cubes-counting',
      'perimeter-vs-area',
      'irregular-perimeter-translation',
      'triangle-area-parallelogram',
      'cube-nets-folding',
      'cube-coloring-cutting',
      'bird-head-model-geometry',
      'butterfly-model-geometry',
      'swallowtail-model-geometry',
      'circle-area',
      'cylinder-cone-volume',
      'pythagorean-theorem',
    ],
  },
  {
    id: 'motion-pursuit',
    name: '运动与行程模型专题',
    shortName: '行程与追及',
    icon: '🏃',
    color: '#ea580c',
    bgColor: '#fff7ed',
    borderColor: '#fed7aa',
    description: '从时钟齿轮联动启蒙，直面相遇追及、实物火车过桥、流水速度合成、环形跑道套圈与时钟夹角经典大题。',
    slugs: [
      'clock-reading',
      'tree-planting-intervals',
      'speed-meeting-chasing',
      'train-bridge-crossing',
      'river-boat-motion',
      'circular-track-problem',
      'clock-angle-pursuit',
    ],
  },
  {
    id: 'word-problems-models',
    name: '典型应用题与思维模型专题',
    shortName: '应用题模型',
    icon: '⚖️',
    color: '#059669',
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    description: '涵盖移多补少、和差倍、盈亏双重分配、消元代换、鸡兔假设、倒推逆向、方阵圈层与抽屉原理必考模型。',
    slugs: [
      'transfer-and-balance',
      'line-up-ordering',
      'sum-difference-multiple',
      'reverse-thinking-reduction',
      'age-difference-problem',
      'counting-segments-handshakes',
      'square-formation-problem',
      'substitution-elimination-method',
      'average-benchmark',
      'chicken-rabbit-cage',
      'surplus-and-deficiency',
      'pigeonhole-principle',
    ],
  },
  {
    id: 'fractions-algebra-apps',
    name: '分数比率、代数方程与综合商业专题',
    shortName: '代数与商业应用',
    icon: '📈',
    color: '#db2777',
    bgColor: '#fdf2f8',
    borderColor: '#fbcfe8',
    description: '从分数直观切分、天平方程等式性质，进阶单位“1”工程合作、牛吃草动态追及、十字交叉浓度、经济利润打折与浮力物理实验。',
    slugs: [
      'fractions-basics',
      'algebraic-equations-basics',
      'work-rate-problem',
      'newton-cow-pasture',
      'ratio-concentration-problem',
      'profit-loss-discount',
      'buoyancy-archimedes',
    ],
  },
];

// 知识点前置依赖拓扑拓扑边 (全量 47 个知识点依赖拓扑)
export const TOPOLOGY_EDGES: GraphEdge[] = [
  // 几何主线
  { from: 'front-back-left-right', to: 'compass-directions', label: '空间方位基础' },
  { from: 'compass-directions', to: 'hidden-cubes-counting', label: '多视角方位投影' },
  { from: 'hidden-cubes-counting', to: 'cube-nets-folding', label: '立体积木到面展开' },
  { from: 'cube-nets-folding', to: 'cube-coloring-cutting', label: '面折叠到立体剥切' },
  { from: 'multiplication-array', to: 'perimeter-vs-area', label: '点阵乘积即矩形面积' },
  { from: 'perimeter-vs-area', to: 'irregular-perimeter-translation', label: '矩形周长到凹凸平移' },
  { from: 'perimeter-vs-area', to: 'triangle-area-parallelogram', label: '矩形面积到三角形割补' },
  { from: 'triangle-area-parallelogram', to: 'bird-head-model-geometry', label: '等高比例到共角乘积' },
  { from: 'triangle-area-parallelogram', to: 'butterfly-model-geometry', label: '等底等高到梯形对顶翅膀' },
  { from: 'triangle-area-parallelogram', to: 'swallowtail-model-geometry', label: '等高大减小到燕尾两翼比' },
  { from: 'triangle-area-parallelogram', to: 'circle-area', label: '无限割补拼合化曲为直' },
  { from: 'circle-area', to: 'cylinder-cone-volume', label: '底面积到立体柱锥三分之一' },
  { from: 'triangle-area-parallelogram', to: 'pythagorean-theorem', label: '直角面积到弦图拼合' },

  // 数论与计算主线
  { from: 'ten-frame-addition-subtraction', to: 'multiplication-array', label: '相同加数累加为乘法' },
  { from: 'multiplication-array', to: 'periodic-patterns', label: '循环打包到模运算' },
  { from: 'multiplication-array', to: 'distributive-law-area', label: '矩阵行列拆分到分配律' },
  { from: 'multiplication-array', to: 'prime-factorization-lcm-gcd', label: '因数倍数到质因数积木' },
  { from: 'prime-factorization-lcm-gcd', to: 'divisibility-rules-math', label: '位值展开到整除密码' },
  { from: 'distributive-law-area', to: 'arithmetic-progression-gauss', label: '配对乘积到梯形高斯求和' },
  { from: 'fractions-basics', to: 'fraction-telescoping-sum', label: '通分基础到拆项相消' },

  // 行程与时间主线
  { from: 'clock-reading', to: 'clock-angle-pursuit', label: '齿轮联动到夹角追及' },
  { from: 'line-up-ordering', to: 'tree-planting-intervals', label: '排队计数到指缝间隔' },
  { from: 'tree-planting-intervals', to: 'speed-meeting-chasing', label: '离散间隔到连续路程轴' },
  { from: 'speed-meeting-chasing', to: 'train-bridge-crossing', label: '质点追及到位移车长' },
  { from: 'speed-meeting-chasing', to: 'river-boat-motion', label: '基准速度到水流矢量和差' },
  { from: 'speed-meeting-chasing', to: 'circular-track-problem', label: '线段追及到环形封闭套圈' },
  { from: 'speed-meeting-chasing', to: 'clock-angle-pursuit', label: '同向追及到两针追及' },

  // 应用题与代数主线
  { from: 'ten-frame-addition-subtraction', to: 'transfer-and-balance', label: '基准数增减与平衡' },
  { from: 'transfer-and-balance', to: 'sum-difference-multiple', label: '去多补少到线段图一份量' },
  { from: 'transfer-and-balance', to: 'average-benchmark', label: '两数平摊到多元移多补少' },
  { from: 'transfer-and-balance', to: 'algebraic-equations-basics', label: '杠杆天平到方程等式性质' },
  { from: 'sum-difference-multiple', to: 'age-difference-problem', label: '差倍模型到年龄恒差' },
  { from: 'sum-difference-multiple', to: 'surplus-and-deficiency', label: '单份差量到盈亏总差' },
  { from: 'sum-difference-multiple', to: 'substitution-elimination-method', label: '一份量代换到加减消元' },
  { from: 'sum-difference-multiple', to: 'chicken-rabbit-cage', label: '总差量分摊到吹哨抬腿假设' },
  { from: 'counting-segments-handshakes', to: 'pigeonhole-principle', label: '配对去重到最不利组合' },
  { from: 'square-formation-problem', to: 'arithmetic-progression-gauss', label: '同心圈差8到等差数列' },
  { from: 'reverse-thinking-reduction', to: 'algebraic-equations-basics', label: '倒推逆运算到代数移项' },

  // 分数、比率与高阶综合
  { from: 'fractions-basics', to: 'work-rate-problem', label: '部分占整体到工作总量单位1' },
  { from: 'speed-meeting-chasing', to: 'work-rate-problem', label: '合速度到合工效' },
  { from: 'speed-meeting-chasing', to: 'newton-cow-pasture', label: '追及相消到老草与新草' },
  { from: 'work-rate-problem', to: 'newton-cow-pasture', label: '工作效率到牛吃草速率' },
  { from: 'sum-difference-multiple', to: 'ratio-concentration-problem', label: '溶质不变与杠杆十字交叉' },
  { from: 'fractions-basics', to: 'profit-loss-discount', label: '百分数折扣到成本基准单位1' },
  { from: 'river-boat-motion', to: 'buoyancy-archimedes', label: '水流浮力与排开液体体积' },
];
