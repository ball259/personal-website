import { Link } from 'react-router-dom'
import { api } from '../api'

export default function Dashboard() {
  const posts = api.getPosts(true)
  const projects = api.getProjects()
  const skills = api.getSkills()
  const profile = api.getProfile()

  const stats = [
    { label: '博客文章', value: posts.length, to: '/admin/posts', icon: '✍️' },
    { label: '项目作品', value: projects.length, to: '/admin/projects', icon: '🚀' },
    { label: '技能条目', value: skills.length, to: '/admin/skills', icon: '🛠' },
    { label: '社交链接', value: profile.socials.length, to: '/admin/profile', icon: '🔗' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold">仪表盘</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">欢迎回来，{profile.name}！这里是你站点内容的概览。</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="card block p-6">
            <div className="text-2xl">{s.icon}</div>
            <div className="mt-3 text-3xl font-bold">{s.value}</div>
            <div className="mt-1 text-xs text-[var(--muted)]">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-semibold">最近文章</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {posts.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3">
                <span className="truncate">{p.title}</span>
                <span className={`shrink-0 text-xs ${p.published ? 'text-emerald-400' : 'text-[var(--muted)]'}`}>
                  {p.published ? '已发布' : '草稿'}
                </span>
              </li>
            ))}
            {posts.length === 0 && <li className="text-[var(--muted)]">暂无文章</li>}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold">快捷操作</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/admin/posts/new" className="btn-primary">✍️ 写新文章</Link>
            <Link to="/admin/projects" className="btn-ghost">🚀 添加项目</Link>
            <Link to="/admin/profile" className="btn-ghost">👤 修改个人信息</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
