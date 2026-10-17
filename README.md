# 讲明白 (JiangMingBai) - 中小学知识点可视化互动实验室

> **让抽象晦涩的中小学数理化知识点，用纯 JS 交互动画一键讲明白。**  
> 专为**家庭辅导场景下的家长**打造，配有**“启发提问三步法”**与生活原型类比，帮助孩子告别死记硬背，自己推导出正确答案。

---

## 🌟 核心特色与架构

1. **面向家长辅导的核心价值**：
   - **痛点直击**：每个知识点详细剖析“孩子卡在哪个直觉盲区”。
   - **启发提问三步法**：不直接灌输答案，通过 3 个层层递进的小问题引导孩子主动思考。
   - **生活原型连接**：用孩子看得见的生活例子类比抽象概念。
2. **首页即时多维筛选**：
   - 支持按**学段**（小学/初中/高中）、**学科**（数学/物理/化学/生物/地理）以及关键字即时无刷新过滤。
3. **完善的分类页体系**：
   - `/[stage]`：学段分类页（如 `/chuzhong/`）
   - `/[stage]/[subject]`：学段+学科复合分类页（如 `/chuzhong/physics/`）
   - `/explore`：全站系统化知识地图
4. **极致 SEO 优化**：
   - **纯静态 HTML 预渲染 (SSG)**：每个页面和知识点均为静态 HTML，百度/Google 爬虫零门槛秒级抓取。
   - **动态 TDK 模板**与内部语义链接网。
   - **结构化数据**：自动注入 Schema.org `LearningResource` 与 `FAQPage`，提升富媒体卡片展示几率。
   - 自动生成静态 `sitemap.xml` 与 `robots.txt`。
5. **现代模块化 UI 结构**：
   - 包含规范的 **Header**（顶导+学段胶囊）、**Footer**（家长理念+站点地图+Cloudflare标识）、**Sidebar**（知识树目录导航）。

---

## 🚀 首批内置样板动画

| 学科 | 知识点 | 核心交互与动画演示 |
| :--- | :--- | :--- |
| **小学数学** | [圆面积推导：切拼长方形法](src/components/animations/CircleAreaLab.tsx) | 8~64等分无限切割、展开动态变形、长(πr)与宽(r)对应关系 |
| **初中数学** | [勾股定理：赵爽弦图证明](src/components/animations/PythagoreanTheoremLab.tsx) | 拖拽直角边 a/b 参数、四三角弦图模式与平移割补为 a²+b² 证明 |
| **初中物理** | [阿基米德浮力与排水实验](src/components/animations/BuoyancyArchimedesLab.tsx) | 调节下放深度、弹簧测力计拉力减小与量筒排水量同步模拟、受力平衡 |

---

## 🛠️ 本地开发运行

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务 (带热更新)
npm run dev
# 浏览器访问 http://localhost:3000

# 3. 本地打包验证静态产物 (输出至 /out 目录)
npm run build
```

---

## ☁️ 部署到 GitHub & Cloudflare Pages（自动同步更新）

### 第一步：推送到 GitHub 仓库

如果您已经创建好 GitHub 仓库（例如 `https://github.com/your-username/jiangmingbai.git`）：

```bash
# 1. 查看并添加文件
git add .
git commit -m "feat: init jiangmingbai nextjs static site architecture"

# 2. 如果要切换或绑定到 GitHub 远程仓库：
git remote add github https://github.com/<your-username>/jangmingbai.git

# 3. 推送到 GitHub main 分支
git branch -M main
git push -u github main
```

---

### 第二步：在 Cloudflare Pages 绑定自动构建

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 进入左侧菜单：**Workers 和 Pages (Workers & Pages)** $\rightarrow$ **创建 (Create application)** $\rightarrow$ **Pages**。
3. 选择 **连接到 Git (Connect to Git)**，授权并选择您的 GitHub 仓库 `jangmingbai`。
4. 在构建设置中填入以下配置：
   - **Framework preset (框架预设)**: `Next.js (Static HTML Export)` 或留空
   - **Build command (构建命令)**: `npm run build`
   - **Build output directory (构建输出目录)**: `out`
5. 在 **环境变量 (Environment variables)** 中添加（推荐）：
   - 变量名：`NODE_VERSION`
   - 变量值：`20`
6. 点击 **保存并部署 (Save and Deploy)**。

🎉 **后续工作流**：  
每次您在本地编写新的知识点或动画，只需执行：
```bash
git add .
git commit -m "add new animation: xxx"
git push
```
Cloudflare Pages 会在 1 分钟内自动触发构建，并完成全球全球 CDN 静态毫秒级更新！

---

## 📂 如何新增一个知识点动画？

仅需两步：
1. **编写动画组件**：在 `src/components/animations/` 目录下创建一个新的 React/Canvas/SVG 组件（可参考 `CircleAreaLab.tsx`）。
2. **注册数据与家长指南**：在 `src/data/topics.ts` 中追加条目，包含：
   - 学段与学科归属
   - 孩子常卡点、提问三步法、生活原型举例
   - 对应动画类型。
3. 系统在下一次构建时会自动生成对应的分类页面和独立静态详情页，并将其包含在 `sitemap.xml` 中！
