import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { marked } from 'marked'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Starfield from '../components/Starfield'
import { api } from '../api'

export default function ProjectDetail() {
  const { id } = useParams()
  const project = id ? api.getProject(id) : undefined

  const html = useMemo(() => {
    if (!project) return ''
    return marked.parse(project.content, { async: false }) as string
  }, [project])

  if (!project) {
    return (
      <div className="relative min-h-screen">
        <Starfield />
        <Navbar />
        <main className="relative z-10 mx-auto max-w-[800px] px-4 pt-32 text-center">
          <p className="text-[var(--muted)]">项目不存在或已被删除。</p>
          <Link to="/#projects" className="btn-ghost mt-6 inline-block">返回项目列表</Link>
        </main>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <Starfield />
      <Navbar />
      <article className="relative z-10 mx-auto max-w-[800px] px-4 pb-16 pt-24">
        <Link to="/#projects" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">← 返回项目</Link>
        <h1 className="mt-5 text-3xl font-bold">{project.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
          <span>{project.date}</span>
          {project.tags.map((t) => (
            <span key={t} className="rounded-full border border-[var(--border)] px-2.5 py-0.5">{t}</span>
          ))}
        </div>
        <p className="mt-4 text-[var(--muted)]">{project.summary}</p>
        {(project.repoUrl || project.demoUrl) && (
          <div className="mt-5 flex gap-3">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer" className="btn-primary">在线演示 ↗</a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-ghost">源码仓库 ↗</a>
            )}
          </div>
        )}
        <div className="md mt-8 border-t border-[var(--border)] pt-8" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <Footer />
    </div>
  )
}
