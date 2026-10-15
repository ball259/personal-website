import { Link } from 'react-router-dom'
import { api } from '../api'

export default function Footer() {
  const profile = api.getProfile()
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 border-t border-[var(--border)] py-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3 px-4 text-sm text-[var(--muted)]">
        <div className="flex gap-5">
          {profile.socials.map((s) => (
            <a key={s.platform} href={s.url} target="_blank" rel="noreferrer" className="hover:text-[var(--text)]">
              {s.platform}
            </a>
          ))}
        </div>
        <div>
          © {year} {profile.name} · Powered by React + Vite ·{' '}
          <Link to="/admin" className="hover:text-[var(--text)]">
            后台
          </Link>
        </div>
      </div>
    </footer>
  )
}
