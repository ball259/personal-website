import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function PostsAdmin() {
  const [posts, setPosts] = useState(() => api.getPosts(true))

  const remove = (id: string) => {
    if (!confirm('确定删除这篇文章吗？删除后不可恢复。')) return
    api.deletePost(id)
    setPosts(api.getPosts(true))
  }

  const togglePublish = (id: string) => {
    const post = api.getPost(id)
    if (!post) return
    api.savePost({ ...post, published: !post.published })
    setPosts(api.getPosts(true))
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">博客管理</h1>
        <Link to="/admin/posts/new" className="btn-primary">✍️ 写新文章</Link>
      </div>

      <div className="card mt-6 divide-y divide-[var(--border)]">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold">{p.title || '（无标题）'}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${p.published ? 'bg-emerald-900/40 text-emerald-400' : 'bg-[var(--bg-soft)] text-[var(--muted)]'}`}>
                  {p.published ? '已发布' : '草稿'}
                </span>
              </div>
              <div className="mt-0.5 truncate text-xs text-[var(--muted)]">{p.date} · {p.tags.join(' / ')}</div>
            </div>
            <button className="btn-ghost !py-1.5 text-xs" onClick={() => togglePublish(p.id)}>
              {p.published ? '转草稿' : '发布'}
            </button>
            <Link to={`/admin/posts/${p.id}`} className="btn-ghost !py-1.5 text-xs">编辑</Link>
            <button className="btn-danger" onClick={() => remove(p.id)}>删除</button>
          </div>
        ))}
        {posts.length === 0 && <p className="p-8 text-center text-sm text-[var(--muted)]">还没有文章，点击右上角写一篇。</p>}
      </div>
    </div>
  )
}
