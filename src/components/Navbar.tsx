import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

const links = [
  { href: '/#about', label: '关于' },
  { href: '/#skills', label: '技能' },
  { href: '/#projects', label: '项目' },
  { href: '/blog', label: '博客' },
  { href: '/#contact', label: '联系' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const settings = api.getSettings()

  return (
    <header className="glass fixed top-0 left-0 right-0 z-40 border-b border-[var(--border)]">
      <nav className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4">
        <Link to="/" className="text-base font-bold tracking-wide" onClick={() => setOpen(false)}>
          ✦ {settings.siteTitle.split('·')[0].trim()}
        </Link>

        {/* 桌面菜单 */}
        <ul className="hidden items-center gap-7 text-sm text-[var(--muted)] md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link to={l.href} className="transition-colors hover:text-[var(--text)]">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/admin"
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
            >
              后台管理
            </Link>
          </li>
        </ul>

        {/* 移动端汉堡按钮 */}
        <button
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="打开菜单"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className={`h-0.5 w-5 bg-[var(--text)] transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-5 bg-[var(--text)] transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-5 bg-[var(--text)] transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* 移动端抽屉 */}
      {open && (
        <ul className="glass border-t border-[var(--border)] px-6 py-4 text-sm md:hidden">
          {links.map((l) => (
            <li key={l.href} className="py-2.5">
              <Link to={l.href} className="block text-[var(--muted)]" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
          <li className="py-2.5">
            <Link to="/admin" className="block text-[var(--muted)]" onClick={() => setOpen(false)}>
              后台管理
            </Link>
          </li>
        </ul>
      )}
    </header>
  )
}
