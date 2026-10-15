# AGENTS.md — AI 开发规范

## 一、项目概述
个人展示网站：前台展示（个人介绍 / 技能 / 项目 / 博客 / 联系）+ 后台管理（/admin）。
深色星空主题、简洁现代、多端适配。纯前端静态项目，数据层用 localStorage 模拟，API 层统一可替换。

## 二、技术栈约束
- React 18 + TypeScript + Vite + Tailwind CSS v4
- react-router-dom v6、zod、marked
- **禁止引入重型 UI 库**（Ant Design / MUI 等），不新增其他依赖除非必要并说明理由

## 三、代码风格
- TypeScript 严格模式；组件用函数组件 + hooks；禁止 any
- 文件/组件命名：组件 PascalCase，工具函数 camelCase；常量 UPPER_SNAKE_CASE
- 每个组件一个文件；import 顺序：三方库 → api → 组件/工具 → 类型
- 样式只用 Tailwind 类，不写全局内联 style（Canvas 动画除外）；颜色取自 index.css 主题变量

## 四、架构规范
- 所有数据读写必须经 `src/api/` 层，组件不得直接操作 localStorage
- 前台与后台路由隔离：前台 `/`，后台统一挂 `/admin`，后台用独立布局（侧边栏 + 顶栏），不复用前台 Navbar
- 数据类型统一在 `src/types.ts` 定义，前后台共用
- 后台所有删除操作必须二次确认；所有表单用 zod 校验

## 五、安全要求
- 登录密码不明文存 localStorage，密码哈希存储、登录态用随机 token
- 未登录访问 /admin/* 一律重定向 /admin/login
- 不使用 eval / innerHTML 渲染不可信内容；Markdown 渲染结果须转义处理

## 六、测试要求
- 每完成一个功能：`npm run build` 必须通过、无 TypeScript 报错
- 手动验收：375px 宽无横向滚动；后台修改数据后前台刷新可见；未登录访问后台被拦截

## 七、注意事项
- 提交信息格式：`feat: xxx` / `fix: xxx` / `docs: xxx` / `style: xxx`
- 分步迭代：先跑通框架 → 核心功能 → 细节打磨；每次只做一个功能
- 文案用中文；UI 文案简短友好；错误提示通俗易懂
