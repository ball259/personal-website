import type { Profile, Settings, Skill, Project, Post } from '../types'

const K = {
  profile: 'pw.profile',
  skills: 'pw.skills',
  projects: 'pw.projects',
  posts: 'pw.posts',
  settings: 'pw.settings',
  token: 'pw.token',
}

export const KEYS = K

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/** 简易字符串哈希（SHA-256 异步版本见 auth.ts） */
export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// ---------- 种子数据 ----------

export const seedProfile: Profile = {
  name: '星野',
  title: '全栈开发工程师',
  avatar: '',
  bio: '热爱用代码构建有趣的产品，专注于 Web 全栈开发与 AI 应用。相信好的工具能放大每个人的创造力。',
  email: 'hello@example.com',
  resumeUrl: '#',
  socials: [
    { platform: 'GitHub', url: 'https://github.com' },
    { platform: '掘金', url: 'https://juejin.cn' },
    { platform: 'Bilibili', url: 'https://bilibili.com' },
  ],
  experiences: [
    {
      company: '某互联网公司',
      role: '前端开发工程师',
      period: '2023 - 至今',
      desc: '负责核心业务前端架构设计与性能优化，主导组件库建设。',
    },
    {
      company: '某科技公司',
      role: '全栈开发实习生',
      period: '2022 - 2023',
      desc: '参与 SaaS 平台开发，独立完成数据看板模块。',
    },
  ],
  educations: [
    { school: '某大学', degree: '计算机科学与技术 · 本科', period: '2018 - 2022' },
  ],
}

export const seedSkills: Skill[] = [
  { id: uid(), category: '前端', name: 'React', level: 5 },
  { id: uid(), category: '前端', name: 'TypeScript', level: 5 },
  { id: uid(), category: '前端', name: 'Tailwind CSS', level: 4 },
  { id: uid(), category: '后端', name: 'Node.js', level: 4 },
  { id: uid(), category: '后端', name: 'PostgreSQL', level: 3 },
  { id: uid(), category: '工具', name: 'Git', level: 5 },
  { id: uid(), category: '工具', name: 'Docker', level: 3 },
  { id: uid(), category: '其他', name: 'AI 应用开发', level: 4 },
]

export const seedProjects: Project[] = [
  {
    id: uid(),
    title: '个人展示网站',
    cover: '',
    summary: '你正在看的这个网站：深色星空主题，含完整后台管理系统。',
    content:
      '## 项目介绍\n\n这是一个深色星空主题的个人展示网站，包含前台展示与后台管理。\n\n## 技术亮点\n\n- Canvas 星空粒子背景，性能优化\n- React Router 路由守卫\n- localStorage 数据层，可无缝切换后端\n- Markdown 编辑器 + 实时预览\n\n## 我的角色\n\n独立完成设计与开发。',
    tags: ['React', 'TypeScript', 'Tailwind'],
    repoUrl: 'https://github.com',
    demoUrl: '#',
    date: '2026-10-01',
  },
  {
    id: uid(),
    title: '电商图片提取插件',
    cover: '',
    summary: 'Chrome 扩展：一键提取电商详情页图片，批量转 PNG 打包下载。',
    content:
      '## 项目介绍\n\n一款 Chrome 浏览器扩展（Manifest V3），帮助电商运营快速提取商品图片。\n\n## 核心功能\n\n- 详情页右下角悬浮按钮，一键提取全部图片\n- 自动过滤 icon / 缩略图，还原 CDN 原图\n- 批量转 PNG 并打包 ZIP 下载',
    tags: ['Chrome 扩展', 'React', 'Canvas'],
    repoUrl: 'https://github.com',
    date: '2026-06-15',
  },
  {
    id: uid(),
    title: '记账小助手',
    cover: '',
    summary: '轻量级记账应用，支持收支记录、分类统计与月度报表。',
    content:
      '## 项目介绍\n\n一个简洁的记账应用，帮用户快速记录日常收支。\n\n## 功能\n\n- 添加 / 编辑 / 删除记录\n- 分类统计与月度报表\n- 数据本地存储，隐私安全',
    tags: ['Vue', 'ECharts'],
    demoUrl: '#',
    date: '2026-03-20',
  },
]

export const seedPosts: Post[] = [
  {
    id: uid(),
    title: 'AI 时代的高效项目开发流程',
    summary: '从需求研究到部署上线，分享我用 AI 完整开发一个项目的五步工作法。',
    cover: '',
    content:
      '## 为什么需要流程\n\nAI 让写代码变快了，但项目失败往往不是因为代码，而是因为需求不清、方向跑偏。\n\n## 五步走\n\n1. **需求研究**：明确目标，调研类似产品\n2. **PRD**：把想法整理成正式文档，明确做与不做\n3. **技术设计**：确定技术栈与项目结构\n4. **开发规范（AGENTS.md）**：告诉 AI 你的规矩\n5. **迭代开发 + 部署上线**\n\n## 小结\n\n清晰的流程可以让 AI 准确理解你的意图，避免项目失控。',
    tags: ['AI', '方法论'],
    date: '2026-10-10',
    published: true,
  },
  {
    id: uid(),
    title: 'Canvas 星空背景的性能优化实践',
    summary: '如何在移动端保持 50fps 以上的星空粒子动画？记录一次优化过程。',
    cover: '',
    content:
      '## 问题\n\n直接画 500 个粒子，手机上帧率直接掉到 30fps。\n\n## 优化手段\n\n- 粒子数按屏幕宽度分档\n- `requestAnimationFrame` + 页面不可见时暂停\n- 尊重 `prefers-reduced-motion`\n- 避免每帧创建对象，复用数组\n\n## 结果\n\n移动端稳定在 55fps 以上。',
    tags: ['Canvas', '性能'],
    date: '2026-09-02',
    published: true,
  },
  {
    id: uid(),
    title: '草稿：我的 2026 年度计划（未发布）',
    summary: '这篇是草稿，只有后台能看到。',
    cover: '',
    content: '## 计划\n\n- 学完 Rust\n- 做一个开源项目拿到 100 star\n- 坚持写博客',
    tags: ['随笔'],
    date: '2026-10-14',
    published: false,
  },
]

export const seedSettings: Settings = {
  siteTitle: '星野 · 个人网站',
  accentColor: '#6366f1',
  // 默认密码 admin123 的 SHA-256
  passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
}

// ---------- 初始化 ----------
export function ensureSeeded() {
  if (!localStorage.getItem(K.profile)) write(K.profile, seedProfile)
  if (!localStorage.getItem(K.skills)) write(K.skills, seedSkills)
  if (!localStorage.getItem(K.projects)) write(K.projects, seedProjects)
  if (!localStorage.getItem(K.posts)) write(K.posts, seedPosts)
  if (!localStorage.getItem(K.settings)) write(K.settings, seedSettings)
}
