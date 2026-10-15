# 个人展示网站（深色星空主题）

包含前台展示 + 后台管理（/admin），纯前端静态项目。

- 技术栈：React 18 + TypeScript + Vite + Tailwind CSS v4 + react-router-dom + zod + marked
- 数据层：localStorage 模拟（`src/api/` 统一接口，可无缝切换真实后端）
- 后台默认账号：`admin` / 默认密码：`admin123`（登录后可在「站点设置」修改）

## 本地开发

```bash
npm install
npm run dev      # 开发：http://localhost:5173
npm run build    # 构建：产物在 dist/
npm run preview  # 本地预览构建产物
```

## 部署到 Vercel

> 代码已推送到 https://github.com/ball259/personal-website ，可直接从第 2 步开始。

1. 代码推送到 GitHub（已完成）：
   ```bash
   git remote add origin https://github.com/ball259/personal-website.git
   git push -u origin main
   ```
2. 打开 [vercel.com](https://vercel.com)，用 GitHub 注册（选 Hobby 免费方案），跳过安全设置
3. Add New Project → 选择 `personal-website` 仓库
4. Vercel 会自动识别 Vite 框架，无需改配置（`vercel.json` 已配置 SPA 路由回退），点击 Deploy
5. 部署完成后获得域名（如 `personal-website-ball259.vercel.app`），即作业第 05 项要提交的地址

## 部署到 Cloudflare Pages

1. 代码推送到 GitHub（已完成）
2. 打开 [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create → Pages → Connect to Git
3. 选择 `personal-website` 仓库，框架预设选 **Vite**
   - 构建命令：`npm run build`
   - 输出目录：`dist`
   （`public/_redirects` 已配置 SPA 路由回退，无需额外设置）
4. 点击 Save and Deploy，完成后获得 `xxx.pages.dev` 域名

> 提交作业截图建议：03 → 分别截图 PRD.md / TECH_DESIGN.md / AGENTS.md 内容；04 → 部署后的网站页面（首页、博客、/admin 后台各来一张）；05 → 部署平台给出的域名地址。
