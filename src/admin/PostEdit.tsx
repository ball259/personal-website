import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { marked } from 'marked'
import { api, uid } from '../api'
import type { Post } from '../types'

export default function PostEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id

  const [post, setPost] = useState<Post>(() => {
    if (id) {
      const existing = api.getPost(id)
      if (existing) return existing
    }
    return {
      id: uid(),
      title: '',
      summary: '',
      cover: '',
      content: '## 正文\n\n从这里开始写作…',
      tags: [],
      date: new Date().toISOString().slice(0, 10),
      published: false,
    }
  })
  const [showPreview, setShowPreview] = useState(true)

  const html = useMemo(() => marked.parse(post.content, { async: false }) as string, [post.content])
  const set = <K extends keyof Post>(key: K, value: Post[K]) => setPost((p) => ({ ...p, [key]: value }))

  const save = (publish?: boolean) => {
    if (!post.title.trim()) {
      alert('请填写文章标题')
      return
    }
    const toSave = { ...post, published: publish === undefined ? post.published : publish }
    api.savePost(toSave)
    navigate('/admin/posts')
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isNew ? '写新文章' : '编辑文章'}</h1>
        <Link to="/admin/posts" className="text-xs text-[var(--muted)] hover:text-[var(--text)]">← 返回列表</Link>
      </div>

      <div className="card mt-6 space-y-4 p-6">
        <div>
          <label className="label">标题 *</label>
          <input className="input text-lg font-semibold" value={post.title} onChange={(e) => set('title', e.target.value)} placeholder="文章标题" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">日期</label>
            <input className="input" type="date" value={post.date} onChange={(e) => set('date', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">标签（英文逗号分隔）</label>
            <input
              className="input"
              value={post.tags.join(', ')}
              onChange={(e) => set('tags', e.target.value.split(/[,，]/).map((t) => t.trim()).filter(Boolean))}
            />
          </div>
        </div>
        <div>
          <label className="label">摘要</label>
          <input className="input" value={post.summary} onChange={(e) => set('summary', e.target.value)} placeholder="显示在列表页的一句话摘要" />
        </div>
        <div>
          <label className="label">封面图片 URL（可选）</label>
          <input className="input" value={post.cover} onChange={(e) => set('cover', e.target.value)} placeholder="https://..." />
        </div>

        {/* Markdown 编辑器 + 实时预览 */}
        <div>
          <div className="flex items-center justify-between">
            <label className="label !mb-0">正文（Markdown）</label>
            <button className="text-xs text-[var(--muted)] hover:text-[var(--text)]" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? '隐藏预览' : '显示预览'}
            </button>
          </div>
          <div className={`mt-2 grid gap-4 ${showPreview ? 'md:grid-cols-2' : ''}`}>
            <textarea
              className="input min-h-[360px] font-mono text-xs leading-6"
              value={post.content}
              onChange={(e) => set('content', e.target.value)}
              placeholder="支持 Markdown 语法…"
            />
            {showPreview && (
              <div className="md max-h-[360px] overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-4" dangerouslySetInnerHTML={{ __html: html }} />
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-[var(--border)] pt-5">
          <button className="btn-primary" onClick={() => save(true)}>保存并发布</button>
          <button className="btn-ghost" onClick={() => save(false)}>保存为草稿</button>
        </div>
      </div>
    </div>
  )
}
