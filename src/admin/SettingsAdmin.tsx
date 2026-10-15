import { useState } from 'react'
import { api } from '../api'
import { sha256 } from '../api/db'
import type { Settings } from '../types'

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Settings>(() => api.getSettings())
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }))
    setMsg(null)
  }

  const saveSite = () => {
    api.saveSettings(settings)
    document.title = settings.siteTitle
    setMsg({ ok: true, text: '站点设置已保存 ✓' })
  }

  const changePwd = async () => {
    const oldHash = await sha256(oldPwd)
    if (oldHash !== settings.passwordHash) {
      setMsg({ ok: false, text: '原密码错误' })
      return
    }
    if (newPwd.length < 6) {
      setMsg({ ok: false, text: '新密码至少 6 位' })
      return
    }
    const hash = await sha256(newPwd)
    const next = { ...settings, passwordHash: hash }
    setSettings(next)
    api.saveSettings(next)
    setOldPwd('')
    setNewPwd('')
    setMsg({ ok: true, text: '密码修改成功 ✓（哈希存储，不明文保存）' })
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">站点设置</h1>

      <div className="card mt-6 space-y-5 p-6">
        <div>
          <label className="label">站点标题</label>
          <input className="input" value={settings.siteTitle} onChange={(e) => set('siteTitle', e.target.value)} />
        </div>
        <div>
          <label className="label">强调色</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              className="h-9 w-14 cursor-pointer rounded-lg border border-[var(--border)] bg-transparent"
              value={settings.accentColor}
              onChange={(e) => set('accentColor', e.target.value)}
            />
            <input className="input !w-36" value={settings.accentColor} onChange={(e) => set('accentColor', e.target.value)} />
          </div>
        </div>
        <div className="border-t border-[var(--border)] pt-5">
          <button className="btn-primary" onClick={saveSite}>保存站点设置</button>
        </div>
      </div>

      <div className="card mt-6 space-y-4 p-6">
        <h2 className="font-semibold">修改后台密码</h2>
        <div>
          <label className="label">原密码</label>
          <input className="input" type="password" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} autoComplete="current-password" />
        </div>
        <div>
          <label className="label">新密码（至少 6 位）</label>
          <input className="input" type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} autoComplete="new-password" />
        </div>
        <button className="btn-primary" onClick={changePwd}>修改密码</button>
      </div>

      {msg && <p className={`mt-4 text-sm ${msg.ok ? 'text-emerald-400' : 'text-rose-400'}`}>{msg.text}</p>}
    </div>
  )
}
