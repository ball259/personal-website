import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, uid } from '../api'
import type { Project } from '../types'

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>(() => api.getProjects())
  const [editing, setEditing] = useState<Project | null>(null)

  const remove = (id: string) => {
    if (!confirm('确定删除这个项目吗？删除后不可恢复。')) return
    api.deleteProject(id)
    setProjects(api.getProjects())
  }

  const done = () => {
    setEditing(null)
    setProjects(api.getProjects())
  }

  if (editing) {
    return <ProjectForm project={editing} onDone={done} />
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">项目管理</h1>
        <button
          className="btn-primary"
          onClick={() =>
            setEditing({
              id: uid(), title: '', cover: '', summary: '', content: '## 项目介绍\n\n', tags: [], date: new Date().toISOString().slice(0, 10),
            })
          }
        >
          + 新建项目
        </button>
      </div>

      <div className="card mt-6 divide-y divide-[var(--border)]">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--bg-soft)] text-lg">
              {p.cover ? <img src={p.cover} alt="" className="h-full w-full object-cover" /> : '🚀'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{p.title || '（未命名）'}</div>
              <div className="mt-0.5 truncate text-xs text-[var(--muted)]">{p.date} · {p.tags.join(' / ')}</div>
            </div>
            <button className="btn-ghost !py-1.5 text-xs" onClick={() => setEditing(p)}>编辑</button>
            <button className="btn-danger" onClick={() => remove(p.id)}>删除</button>
          </div>
        ))}
        {projects.length === 0 && <p className="p-8 text-center text-sm text-[var(--muted)]">还没有项目，点击右上角新建。</p>}
      </div>
      <Link to="/" className="mt-4 inline-block text-xs text-[var(--muted)] hover:text-[var(--text)]">← 返回前台查看效果</Link>
    </div>
  )
}

function ProjectForm({ project, onDone }: { project: Project; onDone: () => void }) {
  const [p, setP] = useState<Project>(project)
  const set = <K extends keyof Project>(key: K, value: Project[K]) => setP((old) => ({ ...old, [key]: value }))

  const save = () => {
    if (!p.title.trim()) {
      alert('请填写项目标题')
      return
    }
    api.saveProject(p)
    onDone()
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">{project.title ? '编辑项目' : '新建项目'}</h1>
      <div className="card mt-6 space-y-5 p-6">
        <div>
          <label className="label">标题 *</label>
          <input className="input" value={p.title} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">封面图片 URL（留空显示占位）</label>
            <input className="input" value={p.cover} onChange={(e) => set('cover', e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="label">日期</label>
            <input className="input" type="date" value={p.date} onChange={(e) => set('date', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">一句话简介</label>
          <input className="input" value={p.summary} onChange={(e) => set('summary', e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">源码仓库 URL</label>
            <input className="input" value={p.repoUrl || ''} onChange={(e) => set('repoUrl', e.target.value)} placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="label">在线演示 URL</label>
            <input className="input" value={p.demoUrl || ''} onChange={(e) => set('demoUrl', e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <div>
          <label className="label">技术标签（英文逗号分隔）</label>
          <input
            className="input"
            value={p.tags.join(', ')}
            onChange={(e) => set('tags', e.target.value.split(/[,，]/).map((t) => t.trim()).filter(Boolean))}
          />
        </div>
        <div>
          <label className="label">详情内容（Markdown）</label>
          <textarea className="input min-h-48 font-mono text-xs" value={p.content} onChange={(e) => set('content', e.target.value)} />
        </div>
        <div className="flex gap-3 border-t border-[var(--border)] pt-5">
          <button className="btn-primary" onClick={save}>保存</button>
          <button className="btn-ghost" onClick={onDone}>取消</button>
        </div>
      </div>
    </div>
  )
}
