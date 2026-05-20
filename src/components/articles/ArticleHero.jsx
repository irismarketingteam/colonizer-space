import { Link } from 'react-router-dom'
import { formatTimeAgo, isRecent } from '../../lib/format'

export default function ArticleHero({ article }) {
  if (!article) return null

  const url = `/${article.section}/${article.slug}`
  const recent = isRecent(article.published_at, 2)

  return (
    <section className="py-16 px-[clamp(1rem,3vw,3rem)]">
      <div className="max-w-[90rem] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          {recent && <span className="live-dot" />}
          <span className="section-tag">
            {recent ? 'Latest' : article.section}
          </span>
        </div>
        <Link to={url}>
          <h1 className="font-display font-bold text-text-primary leading-[1.05]" style={{ fontSize: 'var(--text-hero)' }}>
            {article.title}
          </h1>
        </Link>
        <div className="mt-6 h-px bg-subtle w-24" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
        {article.subtitle && (
          <p className="mt-6 text-lg text-text-secondary max-w-2xl">{article.subtitle}</p>
        )}
        <div className="mt-4 flex items-center gap-4 font-mono text-caption text-text-tertiary">
          <Link to={`/${article.section}`} className="text-text-tertiary hover:text-accent transition-colors">
            {article.section}
          </Link>
          <span>&middot;</span>
          {article.reading_time_min && <span>{article.reading_time_min} min read</span>}
          <span>&middot;</span>
          <span>{formatTimeAgo(article.published_at)}</span>
        </div>
      </div>
    </section>
  )
}
