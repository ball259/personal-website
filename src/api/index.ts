import type { Profile, Settings, Skill, Project, Post } from '../types'
import { KEYS, ensureSeeded, read, write, uid, seedSettings } from './db'

// 统一 API 层：先以 localStorage 模拟，后续可无缝替换为真实后端

export const api = {
  getProfile(): Profile {
    ensureSeeded()
    return read<Profile>(KEYS.profile, {} as Profile)
  },
  saveProfile(p: Profile) {
    write(KEYS.profile, p)
  },

  getSkills(): Skill[] {
    ensureSeeded()
    return read<Skill[]>(KEYS.skills, [])
  },
  saveSkills(list: Skill[]) {
    write(KEYS.skills, list)
  },

  getProjects(includeDraft = false): Project[] {
    ensureSeeded()
    const list = read<Project[]>(KEYS.projects, [])
    return [...list].sort((a, b) => b.date.localeCompare(a.date))
  },
  getProject(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id)
  },
  saveProject(p: Project) {
    const list = read<Project[]>(KEYS.projects, [])
    const i = list.findIndex((x) => x.id === p.id)
    if (i >= 0) list[i] = p
    else list.unshift(p)
    write(KEYS.projects, list)
  },
  deleteProject(id: string) {
    write(KEYS.projects, read<Project[]>(KEYS.projects, []).filter((p) => p.id !== id))
  },

  getPosts(includeDraft = false): Post[] {
    ensureSeeded()
    const list = read<Post[]>(KEYS.posts, [])
    const filtered = includeDraft ? list : list.filter((p) => p.published)
    return filtered.sort((a, b) => b.date.localeCompare(a.date))
  },
  getPost(id: string): Post | undefined {
    return read<Post[]>(KEYS.posts, []).find((p) => p.id === id)
  },
  savePost(p: Post) {
    const list = read<Post[]>(KEYS.posts, [])
    const i = list.findIndex((x) => x.id === p.id)
    if (i >= 0) list[i] = p
    else list.unshift(p)
    write(KEYS.posts, list)
  },
  deletePost(id: string) {
    write(KEYS.posts, read<Post[]>(KEYS.posts, []).filter((p) => p.id !== id))
  },

  getSettings(): Settings {
    ensureSeeded()
    return read<Settings>(KEYS.settings, seedSettings)
  },
  saveSettings(s: Settings) {
    write(KEYS.settings, s)
  },
}

export { uid }
