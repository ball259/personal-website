import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { isLoggedIn, logout } from '../api/auth'

const menu = [
  { to: '/admin', label: '📊 仪表盘', end: true },
  { to: '/admin/profile', label: '👤 个人信息' },
  { to: '/admin/skills', label: '🛠 技能管理' },
  { to: '/admin/projects', label: '🚀 项目管理' },
  { to: '/admin/posts', label: '✍️ 博客管理' },
  { to: '/admin/settings', label: '⚙️ 站点设置' },
]

/** 后台布局 + 路由守卫：未登录重定向到登录页 */
export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      {/* 侧边栏 */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-56 border-r border-[var(--border)] bg-[var(--bg-soft)] p-4 transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-2 py-3 text-sm font-bold text-[var(--accent)]">✦ 网站后台</div>
        <nav className="mt-2 space-y-1">
          {menu.map((m) => (
            <NavLinkItem key={m.to} to={m.to} label={m.label} end={m.end} onNavigate={() => setOpen(false)} />
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Link to="/" className="block rounded-lg px-3 py-2 text-xs text-[var(--muted)] hover:text-[var(--text)]">
            ← 返回前台
          </Link>
          <button
            onClick={() => {
              logout()
              window.location.href = '/admin/login'
            }}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)] hover:text-[var(--text)]"
          >
            退出登录
          </button>
        </div>
      </aside>

      {/* 内容区 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--border)] px-4">
          <button className="md:hidden" aria-label="切换菜单" onClick={() => setOpen(!open)}>
            ☰
          </button>
          <span className="text-sm text-[var(--muted)]">内容管理系统</span>
          <span className="text-xs text-[var(--muted)]">admin</span>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { NavLink } from 'react-router-dom'
function NavLinkItem({ to, label, end, onNavigate }: { to: string; label: string; end?: boolean; onNavigate: () => void }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `block rounded-lg px-3 py-2.5 text-sm transition-colors ${
          isActive ? 'bg-[var(--accent)]/15 text-[var(--accent)] font-medium' : 'text-[var(--muted)] hover:text-[var(--text)]'
        }`
      }
    >
      {label}
    </NavLink>
  )
}
