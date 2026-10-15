import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { marked } from 'marked'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Starfield from '../components/Starfield'
import { api } from '../api'

export default function BlogDetail() {
  const { id } = useParams()
  const post = id ? api.getPost(id) : undefined

  const html = useMemo(() => {
    if (!post) return ''
    return marked.parse(post.content, { async: false }) as string
  }, [post])

  if (!post) {
    return (
      <div className="relative min-h-screen">
        <Starfield />
        <Navbar />
        <main className="relative z-10 mx-auto max-w-[800px] px-4 pt-32 text-center">
          <p className="text-[var(--muted)]">文章不存在或已被删除。</p>
          <Link to="/blog" className="btn-ghost mt-6 inline-block">返回博客列表</Link>
        </main>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <Starfield />
      <Navbar />
      <article className="relative z-10 mx-auto max-w-[800px] px-4 pb-16 pt-24">
        <Link to="/blog" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">← 返回博客</Link>
        <h1 className="mt-5 text-3xl font-bold leading-snug">{post.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
          <span>{post.date}</span>
          {post.tags.map((t) => (
            <span key={t} className="rounded-full border border-[var(--border)] px-2.5 py-0.5">{t}</span>
          ))}
        </div>
        <div className="md mt-8 border-t border-[var(--border)] pt-8" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <Footer />
    </div>
  )
}
