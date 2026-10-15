# TECH_DESIGN — 个人展示网站技术设计文档

## 一、技术栈选择

| 层 | 选型 | 理由 |
|---|---|---|
| 前端框架 | React 18 + TypeScript | 组件化、类型安全、生态成熟 |
| 构建工具 | Vite | 启动快、HMR、静态产物适合托管平台 |
| 样式 | Tailwind CSS v4 | 原子化、与深色主题变量配合好 |
| 路由 | react-router-dom v6 | 前台 / 后台路由分组 + 路由守卫 |
| 表单校验 | zod | 轻量，登录与表单校验共用 |
| Markdown 渲染 | marked | 轻量无依赖，渲染博客正文 |
| 数据库 | 暂无（localStorage 模拟数据层） | 纯静态部署零成本；API 层统一，后续可无缝切换 Supabase / 后端 |
| 部署 | Vercel / Cloudflare Pages | 免费托管，绑定 GitHub 自动部署 |

## 二、项目结构

```
personal-website/
├── PRD.md / TECH_DESIGN.md / AGENTS.md
├── index.html
├── package.json
├── vite.config.ts
└── src/
    ├── main.tsx              # 入口 + 路由
    ├── index.css             # Tailwind + 主题变量 + 全局样式
    ├── types.ts              # Profile/Skill/Project/Post 等数据模型
    ├── components/           # 前台通用组件
    │   ├── Starfield.tsx     # 星空 Canvas 背景
    │   ├── Navbar.tsx        # 吸顶毛玻璃导航（移动端汉堡菜单）
    │   ├── Footer.tsx
    │   └── Section.tsx       # 通用分节容器
    ├── pages/                # 前台页面
    │   ├── Home.tsx          # Hero / 关于 / 技能 / 项目 / 联系（锚点分节）
    │   ├── BlogList.tsx
    │   ├── BlogDetail.tsx
    │   └── ProjectDetail.tsx
    ├── admin/                # 后台（独立布局：侧边栏 + 顶栏）
    │   ├── AdminLayout.tsx   # 布局 + 登录态守卫
    │   ├── Login.tsx
    │   ├── Dashboard.tsx
    │   ├── ProfileAdmin.tsx
    │   ├── SkillsAdmin.tsx
    │   ├── ProjectsAdmin.tsx
    │   ├── PostsAdmin.tsx
    │   ├── PostEdit.tsx      # Markdown 编辑器 + 实时预览
    │   └── SettingsAdmin.tsx
    └── api/                  # 统一数据访问层（localStorage 实现）
        ├── db.ts             # 读写 / 种子数据 / 订阅刷新
        ├── auth.ts           # 登录、token、路由守卫依据
        └── index.ts          # profile/skills/projects/posts/settings 增删改查
```

## 三、数据模型

```ts
Profile {
  name: string; title: string; avatar: string; bio: string;
  email: string; resumeUrl: string;
  socials: { platform: string; url: string }[];
  experiences: { company: string; role: string; period: string; desc: string }[];
  educations: { school: string; degree: string; period: string }[];
}

Skill   { id: string; category: string; name: string; level: number }   // level 1-5

Project {
  id: string; title: string; cover: string; summary: string; content: string;
  tags: string[]; repoUrl?: string; demoUrl?: string; date: string;
}

Post    {
  id: string; title: string; summary: string; cover: string;
  content: string /* markdown */; tags: string[]; date: string; published: boolean;
}

Settings { siteTitle: string; accentColor: string; passwordHash: string }
```

存储键：`pw.profile / pw.skills / pw.projects / pw.posts / pw.settings`；登录态：`pw.token`。

## 四、关键技术点

1. **星空背景性能**：Canvas 2D + requestAnimationFrame；粒子数按屏宽分档（移动端 ~80，桌面 ~200）；监听 `prefers-reduced-motion` 时只绘制一帧静态星空；页面不可见时暂停。
2. **路由守卫**：`AdminLayout` 挂载时校验 `pw.token` 是否存在，未登录 `<Navigate to="/admin/login">`；前台路由与 `/admin` 路由完全隔离。
3. **数据一致性**：前台与后台共用 `src/api` 层与 `types.ts`；后台每次写操作后写入 localStorage 并触发通知，前台读取时永远拿最新值。
4. **密码安全**：密码使用 SHA-256 哈希后存于 settings，登录成功后生成随机 token 存 localStorage，密码本身不落盘明文。
5. **Markdown 编辑器**：textarea + marked 实时渲染预览（分栏），代码块等宽字体展示。
6. **删除保护**：所有删除操作走二次确认弹窗。
7. **SEO/静态部署**：SPA 静态构建；托管平台需将所有路径 fallback 到 `index.html`（Vercel 自动，Cloudflare Pages 自动）。

## 五、风险与对策

| 风险 | 对策 |
|---|---|
| localStorage 容量/清除风险 | 文章配图用外链 URL；后续切换 Supabase 仅需替换 api 层实现 |
| 刷新后数据"不生效"错觉 | 统一从 api 层读取而非组件内缓存 |
| 密码哈希在客户端 | 本期为演示站点可接受；v2 切换真实后端鉴权 |
