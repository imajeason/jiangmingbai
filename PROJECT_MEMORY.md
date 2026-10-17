# 讲明白 (JiangMingBai) 项目全局核心记忆与开发规范库 (PROJECT MEMORY)

> **重要提示**：本文件是“讲明白”网站的长期核心设计规范、技术准则与知识点演进路线图。  
> 任何后续的功能迭代、页面修改、新增动画与代码编写，**必须严格遵守本文件中的规范与约定**。

---

## 📌 一、 项目基础信息与线上资产

- **网站名称**：讲明白 (JiangMingBai)
- **核心定位**：中小学知识点 JS 交互可视化实验室 & 家长辅导指南
- **线上生产地址**：[https://jiang.dongvps.com/](https://jiang.dongvps.com/)
- **代码仓库**：
  - GitHub: `git@github.com:imajeason/jiangmingbai.git` (主源，用于触发 Cloudflare 持续部署)
  - 局域网 Git: `ssh://git@192.168.199.9:9022/imajeason/jangmingbai.git`
- **托管平台**：**Cloudflare Pages**（静态站点托管模式）
  - 构建命令：`npm run build`
  - 构建输出目录：`out`
  - 构建环境版本：`NODE_VERSION = 20`
- **开源与授权协议 (Dual-License)**：
  - **网站源代码**：遵循 [MIT License](LICENSE)
  - **知识点讲解、家长辅导锦囊、动画教研资产**：遵循 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.zh-Hans)（非商业性使用、相同方式共享）

---

## 🎯 二、 受众定位与产品哲学（灵魂准则）

1. **以“家长”为主，学生课后自主探索为辅**：
   - 痛点：家庭辅导时家长急躁、容易吼孩子，孩子因为抽象概念听不懂而掉眼泪。
   - 解决方案：**“动手玩动画直观感知” + “家长启发提问三步法”**。
2. **每个知识点详情页必须标配【家长辅导锦囊】(ParentGuideBox)**：
   - 🚨 **孩子卡在哪里？**（必须先剖析该年龄段孩子的直觉认知盲区，让家长理解孩子为什么会犯错）。
   - 💬 **启发提问三步法**：严禁直接灌输答案，通过 3 个层层递进的小问题引导孩子自己说出结论。
   - 🍎 **生活原型类比**：必须连接孩子看得见、摸得着的生活实例。
   - 🎯 **一句话核心金句**：易记、通俗、形象（如“化曲为直，割补转化”、“多戴了一顶帽子”）。

---

## 🛠️ 三、 技术栈规范与开发底线

### 1. 前端技术栈约定
- **框架**：**Next.js (App Router)**，强制启用纯静态模式（`output: 'export'`，产物输出至 `out/`）。
- **样式方案**：**Vanilla CSS + CSS Modules**。
  - 全局变量沉淀在 `src/styles/globals.css` 中。
  - 各组件使用专属 `*.module.css` 避免污染。
  - **禁止未经确认引入重型 UI 框架或切换 Tailwind**，保持原生 CSS 的精细、自由与极致轻量。
- **图标体系**：统一使用 `lucide-react`。
- **数学与物理公式渲染**：采用 **KaTeX** 在 SSG 构建期将 Markdown 中的 `$inline$` 与 `$$block$$` 直接编译为专业的数学排版 HTML/MathML，配备 `katex/dist/katex.min.css`，排版媲美印刷级教材且无客户端加载闪烁。


### 2. JS 交互动画开发准则
- **核心原则**：优先采用 **React 原生状态驱动 + SVG / HTML5 Canvas / requestAnimationFrame**。
- **视觉要求**：
  - 必须流畅（目标 60 FPS）、高清（适配高分屏 Retina/移动端）。
  - 色彩现代优雅，配合护眼底色。
- **必备交互要素**：
  - 必须有 **参数调节滑块 (Slider)** 或 **选项切换**，让孩子可以自由拖拽并观察即时变化。
  - 必须有 **重置/复位** 与 **播放/暂停** 功能。
  - 关键几何/物理量必须有 **动态标注线与数字高亮**。

### 3. 小学一二年级动画特殊心理学要求
- **低幼友好**：操作元素要大、色彩饱和明朗、按键手感温和。
- **具象教具化**：多用生活教具模型（如十格阵圆点、钟表齿轮、小天平、积木堆、排队小动物），杜绝冷冰冰的纯公式堆砌。
- **话术口语化**：提问要像和孩子聊天（如“咱们给小动物吹个哨让它抬抬脚”、“整盒先不动”）。

### 4. SEO 规则（不可妥协）
- 每个动态路由（`[stage]`、`[stage]/[subject]`、`[stage]/[subject]/[slug]`）**必须 export `generateStaticParams()`**。
- 每个页面必须有独立的 `generateMetadata()`，动态生成 Title、Description、Keywords、OpenGraph。
- `src/app/sitemap.ts` 和 `src/app/robots.ts` **必须包含 `export const dynamic = 'force-static';`**。
- 详情页必须注入 Schema.org 结构化数据：`LearningResource` 与 `FAQPage`。

---

## 🏗️ 四、 网站架构与目录约定

```text
src/
├── app/
│   ├── layout.tsx                     # 全局根布局 (Header + Footer + 全局Meta)
│   ├── page.tsx                       # 首页 (Hero + 即时多维筛选器 + 家长理念)
│   ├── explore/page.tsx               # 全站系统化知识地图
│   ├── [stage]/page.tsx               # 学段分类聚合页 (xiaoxue, chuzhong, gaozhong)
│   ├── [stage]/[subject]/page.tsx     # 学段+学科复合分类页 (如 chuzhong/physics)
│   ├── [stage]/[subject]/[slug]/      # 知识点动画详情页
│   ├── sitemap.ts                     # 动态全站 Sitemap (静态输出 sitemap.xml)
│   └── robots.ts                      # 动态 Robots (静态输出 robots.txt)
├── components/
│   ├── layout/                        # 核心框架布局
│   │   ├── Header.tsx                 # 顶导、学段胶囊、家长辅导标识
│   │   ├── Footer.tsx                 # 全站地图内链、双重授权、Cloudflare Pages
│   │   └── Sidebar.tsx                # 分类知识树侧边栏 (支持当前项高亮)
│   ├── common/                        # 通用业务组件
│   │   ├── TopicCard.tsx              # 知识点卡片 (带SVG动态微缩预览)
│   │   ├── ParentGuideBox.tsx         # 家长辅导锦囊 (痛点、三步提问法、生活类比)
│   │   ├── TopicNavigation.tsx        # 详情页底部上一篇/下一篇知识点翻页导航
│   │   └── PaginatedTopicList.tsx     # 列表页纯静态分页控制器 (数字页码/上一页/下一页)

│   ├── home/                          # 首页专属组件
│   │   └── HomeFilterSection.tsx      # 首页学段/学科/搜索无刷新即时筛选器
│   └── animations/                    # 知识点交互动画实验室库
│       ├── AnimationPlayer.tsx        # 动画组件路由器/分发器
│       ├── CircleAreaLab.tsx          # 小学数学：圆面积割补拼矩形
│       ├── PythagoreanTheoremLab.tsx  # 初中数学：赵爽弦图勾股定理
│       ├── BuoyancyArchimedesLab.tsx  # 初中物理：阿基米德浮力与排水实验
│       └── ... (后续新增动画均存放于此)
├── data/
│   └── topics.ts                      # 全站知识点数据库、学段/学科字典与过滤函数
├── types/
│   └── index.ts                       # TypeScript 接口规范 (Stage, Subject, TopicItem)
└── styles/                            # 样式模块 (Vanilla CSS + CSS Modules)
    ├── globals.css                    # 全局变量、设计令牌与基础样式
    ├── layout.module.css              # Header, Footer, Sidebar 样式
    ├── home.module.css                # 首页与卡片网格样式
    ├── parentGuide.module.css         # 家长辅导锦囊专用样式
    └── animations.module.css          # 动画实验室工作台与滑块控制器样式
```

---

## 🗺️ 五、 小学知识点路线图（执行优先级）

### 阶段一：小学低年级（一至二年级，急需重点突破）
1. ✅ **【一年级数学】认识钟表：时针与分针的齿轮联动** (`clock-reading`)
   - 核心解决：分针走带动时针平滑移动；辨析 `7:55` 绝不是 `8:55`（时针尚未到达 8）；整点与半点直观观察。
2. ✅ **【一年级数学】十格阵凑十法与破十法** (`ten-frame-addition-subtraction`)
   - 核心解决：$9+4$ 与 $15-8$ 告别掰手指头，十格阵整盒 10 粒弹珠吸附直观感知。
3. ✅ **【二年级数学】移多补少与天平平衡** (`transfer-and-balance`)
   - 核心解决：“哥哥给弟弟几块糖两人一样多”——相差数折半转移原理（给 1 块缩小 2 块差距），直观天平归零。

4. ✅ **【一/二年级数学】排队问题（基数与序数）** (`line-up-ordering`)
   - 核心解决：“从左数排第4，从右数排第5，一共几人？”小明身上的双重高亮与扣除重复计算（双向报数减1，前后人数加1，求中间人再减1）。
5. ✅ **【一年级数学】认识前后左右：面对面为什么左右会反？** (`front-back-left-right`)
   - 核心解决：皮亚杰空间“自我中心化”突破，可转身 180 度卡通人物与蓝红彩色手环，破解看图做题“转试卷法”。
6. ✅ **【二年级数学】认识东南西北：太阳指南针与顺时针四向** (`compass-directions`)
   - 核心解决：“早晨面对太阳前东后西左北右南”与地图“上北下南左西右东”，顺时针转圈“东➔南➔西➔北”终生不迷路法则。
7. 🌟 **【二年级数学】乘法点阵旋转（为什么 $3\times4 = 4\times3$）**
   - 核心解决：乘法本质是相同加数的累加，旋转 90 度矩阵总数不变（交换律直觉）。
8. 🌟 **【一/二年级数学】数隐藏的正方体积木（空间遮挡透视）**
   - 核心解决：多层积木背后被遮挡的暗块，层层切片升降机分解透视。


### 阶段二：小学中高年级（三至六年级，经典考点几何与应用题）
7. 📌 **【四年级数学】鸡兔同笼：“吹哨抬腿法”**（所有小动物抬起 2 只脚，只剩兔子翘着 2 只脚）。
8. 📌 **【四年级数学】三角形面积：平行四边形割补**（两块完全相同三角形合体拼图，搞懂“为什么除以2”）。
9. 📌 **【三年级数学】周长相等面积谁大？**（封闭皮筋拉伸，越接近正方形面积越大）。
10. 📌 **【五年级数学】长方体与正方体表面积展开（11 种展开图 3D 动态折叠）**。
11. 📌 **【五年级数学】动态双车相遇与追及时间轴**（相对速度与路程差）。
12. 📌 **【六年级数学】圆柱与圆锥：等底等高倒水实验**（三次精准倒满，体会三分之一）。

---

## 🚀 六、 新增一个知识点动画的标准流程（独立 Markdown 驱动）

知识点内容已与程序代码彻底解耦，存放在 `content/topics/` 目录下的独立 `.md` 文件中。

1. **第 1 步：创建动画组件**
   - 在 `src/components/animations/` 新建组件（如 `ClockReadingLab.tsx`）。
   - 在 `src/components/animations/AnimationPlayer.tsx` 增加对应的类型分支与映射。

2. **第 2 步：新建独立的知识点 Markdown 文件**
   - 在 `content/topics/` 目录下新建 `<slug>.md`（如 `clock-reading.md`）。
   - 文件结构包含 **YAML Frontmatter 元数据** 与 **正文图文解析**：
   ```markdown
   ---
   id: clock-reading
   slug: clock-reading
   title: 认识钟表：时针与分针的齿轮联动
   subtitle: 为什么 7:55 不是 8:55？看懂时针在半点和接近整点的悄悄移动
   stage: xiaoxue
   grade: 小学一年级上册
   subject: math
   difficulty: 1
   durationMinutes: 3
   summary: 通过自由拨动分针，观察时针按 1:12 悄悄滑移。专门辨析 7:55 与 8:55 等易错时间点。
   coreFormula: 1小时 = 60分，分针走一圈，时针走一大格
   tags:
     - 认识钟表
     - 时间启蒙
     - 易错题辨析
   animationType: clock-reading
   parentGuide:
     painPoint: 看到 7:55 时，时针已经快指到 8 了，孩子极容易看成 8:55。
     steps:
       - stepNumber: 1
         question: “宝贝，短针是时针，长针是分针，我们把分针转一圈，时针走了多少？”
         guide: 引导孩子观察时针从 1 挪到 2，体会分针走得快、时针走得慢。
       - stepNumber: 2
         question: “现在分针指到 11（55分），时针快要碰到 8 了，但它敲开 8 点的大门了吗？”
         guide: 提示孩子看放大镜：时针还在 7 的房间里没踏入 8，所以还是 7 点 55 分！
       - stepNumber: 3
         question: “如果是 3 点半（3:30），时针应该指在哪里？”
         guide: 时针在 3 和 4 的正中间，因为半小时走了一半的路。
     realLifeExample: 家里挂钟的齿轮咬合；每天早上上学打铃的时间刻度。
     keyTakeaway: “时针没踏过下一个数，就还是前一个小时的领地！”
   ---

   ### 课标要点与辅导延伸
   这里可以继续写长篇的图文解析、课堂思考题与拓展训练...
   ```

3. **第 3 步：一键推送到线上**
   ```bash
   git add .
   git commit -m "feat(topic): add clock reading markdown and lab"
   git push
   ```
   Cloudflare Pages 会在 30 秒内自动打包生成新的静态网页并完成全站 CDN 更新！
