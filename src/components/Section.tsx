import type { ReactNode } from 'react'

interface Props {
  id: string
  title: string
  subtitle?: string
  children: ReactNode
}

export default function Section({ id, title, subtitle, children }: Props) {
  return (
    <section id={id} className="relative z-10 mx-auto max-w-[1200px] scroll-mt-20 px-4 py-16">
      <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p>}
      <div className="mt-8">{children}</div>
    </section>
  )
}
