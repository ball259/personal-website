import { useState } from 'react'
import { api, uid } from '../api'
import type { Profile } from '../types'

export default function ProfileAdmin() {
  const [profile, setProfile] = useState<Profile>(() => api.getProfile())
  const [saved, setSaved] = useState(false)

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setProfile((p) => ({ ...p, [key]: value }))
    setSaved(false)
  }

  const save = () => {
    api.saveProfile(profile)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">个人信息管理</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">修改后前台立即生效。</p>

      <div className="card mt-6 space-y-5 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">姓名</label>
            <input className="input" value={profile.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label className="label">职位头衔</label>
            <input className="input" value={profile.title} onChange={(e) => set('title', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">头像图片 URL（留空显示首字母）</label>
          <input className="input" value={profile.avatar} onChange={(e) => set('avatar', e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className="label">个人简介</label>
          <textarea className="input min-h-20" value={profile.bio} onChange={(e) => set('bio', e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">联系邮箱</label>
            <input className="input" value={profile.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <label className="label">简历链接</label>
            <input className="input" value={profile.resumeUrl} onChange={(e) => set('resumeUrl', e.target.value)} />
          </div>
        </div>

        {/* 社交链接 */}
        <div>
          <div className="flex items-center justify-between">
            <label className="label !mb-0">社交链接</label>
            <button
              className="btn-ghost !py-1 text-xs"
              onClick={() => set('socials', [...profile.socials, { platform: '', url: '' }])}
            >
              + 添加
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {profile.socials.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="input !w-32"
                  value={s.platform}
                  placeholder="平台名"
                  onChange={(e) => {
                    const arr = [...profile.socials]
                    arr[i] = { ...arr[i], platform: e.target.value }
                    set('socials', arr)
                  }}
                />
                <input
                  className="input"
                  value={s.url}
                  placeholder="https://..."
                  onChange={(e) => {
                    const arr = [...profile.socials]
                    arr[i] = { ...arr[i], url: e.target.value }
                    set('socials', arr)
                  }}
                />
                <button
                  className="btn-danger shrink-0"
                  onClick={() => {
                    if (confirm('确定删除这条社交链接吗？')) set('socials', profile.socials.filter((_, j) => j !== i))
                  }}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 工作经历 */}
        <div>
          <div className="flex items-center justify-between">
            <label className="label !mb-0">工作经历</label>
            <button
              className="btn-ghost !py-1 text-xs"
              onClick={() => set('experiences', [...profile.experiences, { company: '', role: '', period: '', desc: '' }])}
            >
              + 添加
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {profile.experiences.map((e, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <input className="input" value={e.company} placeholder="公司" onChange={(ev) => updateExp(i, 'company', ev.target.value)} />
                  <input className="input" value={e.role} placeholder="职位" onChange={(ev) => updateExp(i, 'role', ev.target.value)} />
                  <input className="input" value={e.period} placeholder="时间段" onChange={(ev) => updateExp(i, 'period', ev.target.value)} />
                </div>
                <textarea className="input mt-3 min-h-16" value={e.desc} placeholder="工作内容描述" onChange={(ev) => updateExp(i, 'desc', ev.target.value)} />
                <button
                  className="btn-danger mt-3"
                  onClick={() => {
                    if (confirm('确定删除这段经历吗？')) set('experiences', profile.experiences.filter((_, j) => j !== i))
                  }}
                >
                  删除此经历
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 教育背景 */}
        <div>
          <div className="flex items-center justify-between">
            <label className="label !mb-0">教育背景</label>
            <button
              className="btn-ghost !py-1 text-xs"
              onClick={() => set('educations', [...profile.educations, { school: '', degree: '', period: '' }])}
            >
              + 添加
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {profile.educations.map((e, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_120px_auto]">
                <input className="input" value={e.school} placeholder="学校" onChange={(ev) => updateEdu(i, 'school', ev.target.value)} />
                <input className="input" value={e.degree} placeholder="学位 / 专业" onChange={(ev) => updateEdu(i, 'degree', ev.target.value)} />
                <input className="input" value={e.period} placeholder="时间段" onChange={(ev) => updateEdu(i, 'period', ev.target.value)} />
                <button
                  className="btn-danger"
                  onClick={() => {
                    if (confirm('确定删除这条教育经历吗？')) set('educations', profile.educations.filter((_, j) => j !== i))
                  }}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-[var(--border)] pt-5">
          <button className="btn-primary" onClick={save}>保存修改</button>
          {saved && <span className="text-sm text-emerald-400">已保存 ✓ 前台刷新即可看到</span>}
        </div>
      </div>
    </div>
  )

  function updateExp(i: number, key: 'company' | 'role' | 'period' | 'desc', value: string) {
    const arr = [...profile.experiences]
    arr[i] = { ...arr[i], [key]: value }
    set('experiences', arr)
  }
  function updateEdu(i: number, key: 'school' | 'degree' | 'period', value: string) {
    const arr = [...profile.educations]
    arr[i] = { ...arr[i], [key]: value }
    set('educations', arr)
  }
}

// uid 供扩展使用
void uid
