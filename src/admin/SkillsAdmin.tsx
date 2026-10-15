import { useState } from 'react'
import { api, uid } from '../api'
import type { Skill } from '../types'

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>(() => api.getSkills())
  const [saved, setSaved] = useState(false)

  const update = (id: string, patch: Partial<Skill>) => {
    setSkills((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)))
    setSaved(false)
  }

  const add = () => {
    setSkills((list) => [...list, { id: uid(), category: '新分类', name: '新技能', level: 3 }])
    setSaved(false)
  }

  const remove = (id: string) => {
    if (!confirm('确定删除这个技能吗？')) return
    setSkills((list) => list.filter((s) => s.id !== id))
    setSaved(false)
  }

  const save = () => {
    api.saveSkills(skills)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const categories = [...new Set(skills.map((s) => s.category))]

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">技能管理</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">按分类增删改技能，熟练度 1-5。</p>

      <div className="card mt-6 p-6">
        {categories.map((cat) => (
          <div key={cat} className="mb-6">
            <h2 className="text-sm font-semibold text-[var(--accent)]">{cat}</h2>
            <div className="mt-3 space-y-2">
              {skills.filter((s) => s.category === cat).map((s) => (
                <div key={s.id} className="grid items-center gap-2 sm:grid-cols-[1fr_140px_auto]">
                  <input className="input" value={s.name} onChange={(e) => update(s.id, { name: e.target.value })} />
                  <select className="input" value={s.level} onChange={(e) => update(s.id, { level: Number(e.target.value) })}>
                    {[1, 2, 3, 4, 5].map((l) => (
                      <option key={l} value={l}>熟练度 {l}</option>
                    ))}
                  </select>
                  <button className="btn-danger" onClick={() => remove(s.id)}>删除</button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-4 border-t border-[var(--border)] pt-5">
          <button className="btn-ghost" onClick={add}>+ 添加技能</button>
          <button className="btn-primary" onClick={save}>保存全部</button>
          {saved && <span className="text-sm text-emerald-400">已保存 ✓</span>}
        </div>
      </div>
    </div>
  )
}
