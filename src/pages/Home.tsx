import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Section from '../components/Section'
import Starfield from '../components/Starfield'
import { api } from '../api'

function SkillBar({ level }: { level: number }) {
  return (
    <div className="flex gap-1" aria-label={`熟练度 ${level} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 w-5 rounded-full ${i < level ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const profile = api.getProfile()
  const skills = api.getSkills()
  const projects = api.getProjects()
  const posts = api.getPosts().slice(0, 3)
  const [copied, setCopied] = useState(false)

  const categories = [...new Set(skills.map((s) => s.category))]

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* 忽略 */
    }
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <Starfield />
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[1200px] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--accent)] bg-[var(--panel)] text-3xl font-bold">
          {profile.avatar ? (
            <img src={profile.avatar} alt={`${profile.name}的头像`} className="h-full w-full object-cover" />
          ) : (
            profile.name.slice(0, 1)
          )}
        </div>
        <h1 className="text-4xl font-bold md:text-5xl">
          你好，我是 <span className="text-[var(--accent)]">{profile.name}</span>
        </h1>
        <p className="mt-3 text-lg text-[var(--muted)] md:text-xl">{profile.title}</p>
        <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)] md:text-base">{profile.bio}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a href="#projects" className="btn-primary">看我的项目 →</a>
          <a href={profile.resumeUrl || '#'} className="btn-ghost">下载简历</a>
          <a href="#contact" className="btn-ghost">联系我</a>
        </div>
      </section>

      {/* 关于 */}
      <Section id="about" title="关于我" subtitle="简介、经历与教育背景">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="font-semibold text-[var(--accent)]">工作经历</h3>
            <div className="mt-5 space-y-6">
              {profile.experiences.map((e, i) => (
                <div key={i} className="relative border-l border-[var(--border)] pl-4">
                  <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                  <div className="text-sm font-semibold">{e.company} · {e.role}</div>
                  <div className="mt-0.5 text-xs text-[var(--muted)]">{e.period}</div>
                  <p className="mt-1.5 text-sm text-[var(--muted)]">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-[var(--accent)]">教育背景</h3>
            <div className="mt-5 space-y-5">
              {profile.educations.map((e, i) => (
                <div key={i} className="relative border-l border-[var(--border)] pl-4">
                  <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                  <div className="text-sm font-semibold">{e.school}</div>
                  <div className="mt-0.5 text-xs text-[var(--muted)]">{e.degree} · {e.period}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 技能 */}
      <Section id="skills" title="技能展示" subtitle="按分类展示，熟练度 1-5">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat} className="card p-6">
              <h3 className="font-semibold text-[var(--accent)]">{cat}</h3>
              <ul className="mt-4 space-y-4">
                {skills.filter((s) => s.category === cat).map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3">
                    <span className="text-sm">{s.name}</span>
                    <SkillBar level={s.level} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* 项目 */}
      <Section id="projects" title="项目展示" subtitle="精选作品，点击卡片查看详情">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`} className="card block overflow-hidden">
              <div className="flex h-36 items-center justify-center bg-[var(--bg-soft)] text-3xl">
                {p.cover ? (
                  <img src={p.cover} alt={`${p.title}封面`} className="h-full w-full object-cover" />
                ) : (
                  '🚀'
                )}
              </div>
              <div className="p-5">
                <div className="font-semibold">{p.title}</div>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{p.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* 最新博客 */}
      <Section id="blog" title="最新博客" subtitle="记录思考与学习">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="card block p-5">
              <div className="text-xs text-[var(--muted)]">{post.date}</div>
              <div className="mt-2 font-semibold">{post.title}</div>
              <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{post.summary}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/blog" className="btn-ghost inline-block">查看全部文章 →</Link>
        </div>
      </Section>

      {/* 联系 */}
      <Section id="contact" title="联系我" subtitle="欢迎交流与合作">
        <div className="card mx-auto max-w-xl p-6">
          <ContactForm copied={copied} onCopy={copyEmail} email={profile.email} />
          <div className="mt-5 flex flex-wrap gap-4 border-t border-[var(--border)] pt-5">
            {profile.socials.map((s) => (
              <a key={s.platform} href={s.url} target="_blank" rel="noreferrer" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">
                {s.platform} ↗
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  )
}

function ContactForm({ copied, onCopy, email }: { copied: boolean; onCopy: () => void; email: string }) {
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !msg.trim()) {
      setStatus('err')
      return
    }
    setStatus('ok')
    setName('')
    setMsg('')
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-3">
        <span className="truncate text-sm">{email}</span>
        <button onClick={onCopy} className="btn-ghost shrink-0 !py-1.5 text-xs">
          {copied ? '已复制 ✓' : '复制邮箱'}
        </button>
      </div>
      <form className="mt-4 space-y-4" onSubmit={submit}>
        <div>
          <label className="label" htmlFor="c-name">你的称呼</label>
          <input id="c-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="怎么称呼你？" />
        </div>
        <div>
          <label className="label" htmlFor="c-msg">想说的话</label>
          <textarea id="c-msg" className="input min-h-24" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="合作意向、问题或建议…" />
        </div>
        <button type="submit" className="btn-primary w-full">发送消息</button>
        {status === 'ok' && <p className="text-center text-sm text-emerald-400">发送成功！我会尽快回复你 ✓</p>}
        {status === 'err' && <p className="text-center text-sm text-rose-400">请填写完整的称呼和内容</p>}
      </form>
    </div>
  )
}
