import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Starfield from '../components/Starfield'
import { api } from '../api'

export default function BlogList() {
  const posts = api.getPosts()
  return (
    <div className="relative min-h-screen">
      <Starfield />
      <Navbar />
      <main className="relative z-10 mx-auto max-w-[1200px] px-4 pb-16 pt-24">
        <h1 className="text-3xl font-bold">博客</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">共 {posts.length} 篇文章</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="card block p-6">
              <div className="text-xs text-[var(--muted)]">{post.date}</div>
              <h2 className="mt-2 text-lg font-semibold">{post.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">{post.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
        {posts.length === 0 && (
          <p className="mt-16 text-center text-sm text-[var(--muted)]">还没有发布文章，快去后台写一篇吧。</p>
        )}
      </main>
      <Footer />
    </div>
  )
}
