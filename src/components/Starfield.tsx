import { useEffect, useRef } from 'react'

/** 星空 Canvas 背景：缓慢闪烁 + 轻微视差，移动端降粒子数，尊重 prefers-reduced-motion */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let running = true
    let stars: { x: number; y: number; r: number; base: number; phase: number; speed: number; depth: number }[] = []
    let scrollY = 0

    function resize() {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
      // 按屏宽分档：移动端少、桌面多
      const count = window.innerWidth < 640 ? 80 : window.innerWidth < 1024 ? 140 : 200
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.3 + 0.3,
        base: Math.random() * 0.5 + 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.9 + 0.2,
        depth: Math.random() * 0.8 + 0.2, // 视差深度
      }))
    }

    function draw(t: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (const s of stars) {
        const tw = reduced ? s.base : s.base + Math.sin(t / 1000 * s.speed + s.phase) * 0.3
        const alpha = Math.max(0.05, Math.min(1, tw))
        const y = s.y - scrollY * s.depth * 0.15
        const yy = ((y % window.innerHeight) + window.innerHeight) % window.innerHeight
        ctx.beginPath()
        ctx.arc(s.x, yy, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(230, 234, 242, ${alpha})`
        ctx.fill()
      }
    }

    function loop(t: number) {
      if (!running) return
      draw(t)
      raf = requestAnimationFrame(loop)
    }

    const onScroll = () => {
      scrollY = window.scrollY
      if (reduced) draw(performance.now())
    }
    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!reduced) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    if (reduced) {
      draw(0) // 静态一帧
    } else {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
