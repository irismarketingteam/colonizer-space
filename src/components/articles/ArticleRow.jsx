import { Link } from 'react-router-dom'
import { formatTimeAgo } from '../../lib/format'
import { getCoverImage, getCoverAlt } from '../../lib/coverImage'

export default function ArticleRow({ article }) {
  const url = `/${article.section}/${article.slug}`

  return (
    <article className="group py-6 border-b border-subtle">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="section-tag">{article.section}</span>
            <span className="font-mono text-micro text-text-tertiary">
              {formatTimeAgo(article.published_at)}
            </span>
          </div>
          <Link to={url}>
            <h3 className="font-display font-semibold text-h3 text-text-primary group-hover:text-accent transition-colors mb-1">
              {article.title}
            </h3>
          </Link>
          {article.excerpt && (
            <p className="text-caption text-text-secondary line-clamp-2">{article.excerpt}</p>
          )}
          <div className="mt-2 font-mono text-micro text-text-tertiary">
            {article.reading_time_min && <span>{article.reading_time_min} min read</span>}
          </div>
        </div>
        <Link to={url} className="hidden sm:block shrink-0">
          <img
            src={getCoverImage(article)}
            alt={getCoverAlt(article)}
            className="w-32 h-20 object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all"
            loading="lazy"
          />
        </Link>
      </div>
    </article>
  )
}
