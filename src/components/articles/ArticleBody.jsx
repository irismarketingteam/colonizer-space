import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { renderMarkdown } from '../../lib/markdown'
import { formatDate } from '../../lib/format'
import { getCoverImage, getCoverAlt } from '../../lib/coverImage'

export default function ArticleBody({ article }) {
  const html = useMemo(() => {
    if (article.body_html) return article.body_html
    return renderMarkdown(article.body_md)
  }, [article.body_html, article.body_md])

  return (
    <article>
      <div className="relative w-full aspect-video mb-8">
        <img
          src={getCoverImage(article)}
          alt={getCoverAlt(article)}
          className="w-full h-full object-cover"
        />
        {article.cover_image_credit && (
          <span className="absolute bottom-2 right-3 font-mono text-micro text-text-tertiary/60">
            {article.cover_image_credit}
          </span>
        )}
      </div>

      <div className="reading-column px-[clamp(1rem,3vw,3rem)]">
        <div className="flex items-center gap-3 mb-4">
          <Link to={`/${article.section}`} className="section-tag hover:text-accent-hover">
            {article.section}
          </Link>
          {article.reading_time_min && (
            <span className="font-mono text-micro text-text-tertiary">
              {article.reading_time_min} min read
            </span>
          )}
        </div>

        <h1 className="font-display font-bold text-text-primary mb-3" style={{ fontSize: 'var(--text-h1)' }}>
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-lg text-text-secondary mb-6">{article.subtitle}</p>
        )}

        <div className="flex items-center gap-3 font-mono text-caption text-text-tertiary pb-8 mb-8 border-b border-subtle">
          <span>{article.author || 'Colonizer Staff'}</span>
          <span>&middot;</span>
          <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
        </div>

        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {article.source_urls?.length > 0 && (
          <div className="mt-12 pt-8 border-t border-subtle">
            <h4 className="font-mono text-micro uppercase tracking-widest text-text-secondary mb-3">Sources</h4>
            <ul className="space-y-1">
              {article.source_urls.map((url, i) => (
                <li key={i}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caption text-accent hover:text-accent-hover break-all"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {article.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-elevated text-micro font-mono text-text-secondary">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
