export interface Social { platform: string; url: string }
export interface Experience { company: string; role: string; period: string; desc: string }
export interface Education { school: string; degree: string; period: string }

export interface Profile {
  name: string
  title: string
  avatar: string
  bio: string
  email: string
  resumeUrl: string
  socials: Social[]
  experiences: Experience[]
  educations: Education[]
}

export interface Skill {
  id: string
  category: string
  name: string
  level: number // 1-5
}

export interface Project {
  id: string
  title: string
  cover: string
  summary: string
  content: string
  tags: string[]
  repoUrl?: string
  demoUrl?: string
  date: string
}

export interface Post {
  id: string
  title: string
  summary: string
  cover: string
  content: string // markdown
  tags: string[]
  date: string
  published: boolean
}

export interface Settings {
  siteTitle: string
  accentColor: string
  passwordHash: string
}
