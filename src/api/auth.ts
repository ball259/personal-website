import { KEYS, ensureSeeded, read, sha256 } from './db'
import type { Settings } from '../types'

const TOKEN_KEY = KEYS.token

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

export async function login(account: string, password: string): Promise<{ ok: boolean; msg?: string }> {
  ensureSeeded()
  if (account !== 'admin') return { ok: false, msg: '账号或密码错误' }
  const settings = read<Settings>(KEYS.settings, {
    siteTitle: '', accentColor: '', passwordHash: '',
  })
  const hash = await sha256(password)
  if (hash !== settings.passwordHash) return { ok: false, msg: '账号或密码错误' }
  // 生成随机 token，密码不明文保存
  const token = crypto.randomUUID()
  localStorage.setItem(TOKEN_KEY, token)
  return { ok: true }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}
