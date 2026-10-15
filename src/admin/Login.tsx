import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { login } from '../api/auth'
import Starfield from '../components/Starfield'

const schema = z.object({
  account: z.string().min(1, '请输入账号'),
  password: z.string().min(6, '密码至少 6 位'),
})

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const from = (location.state as { from?: string } | null)?.from || '/admin'

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = schema.safeParse({ account, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    const res = await login(account, password)
    if (!res.ok) {
      setError(res.msg || '登录失败')
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <Starfield />
      <form onSubmit={submit} className="relative z-10 w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-8">
        <h1 className="text-xl font-bold">后台登录</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">默认账号 admin，默认密码 admin123</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="account">账号</label>
            <input id="account" className="input" value={account} onChange={(e) => setAccount(e.target.value)} autoComplete="username" />
          </div>
          <div>
            <label className="label" htmlFor="password">密码</label>
            <input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
        </div>
        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
        <button type="submit" className="btn-primary mt-6 w-full">登 录</button>
        <Link to="/" className="mt-4 block text-center text-xs text-[var(--muted)] hover:text-[var(--text)]">← 返回前台</Link>
      </form>
    </div>
  )
}
