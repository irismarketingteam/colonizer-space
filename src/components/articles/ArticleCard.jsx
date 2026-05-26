import { Link } from 'react-router-dom'
import { formatTimeAgo } from '../../lib/format'
import { getCoverImage, getCoverAlt } from '../../lib/coverImage'

export default function ArticleCard({ article, featured = false }) {
  const url = `/${article.section}/${article.slug}`

  return (
    <article className={`group border border-subtle hover:border-accent/20 transition-colors ${featured ? '' : ''}`}>
      <Link to={url} className="block overflow-hidden">
        <img
          src={getCoverImage(article)}
          alt={getCoverAlt(article)}
          className="w-full aspect-video object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500"
          loading="lazy"
        />
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="section-tag">{article.section}</span>
          {article.reading_time_min && (
            <span className="font-mono text-micro text-text-tertiary">
              {article.reading_time_min} min
            </span>
          )}
        </div>
        <Link to={url}>
          <h3 className={`font-display font-semibold text-text-primary group-hover:text-accent transition-colors mb-2 ${
            featured ? 'text-h2' : 'text-h3'
          }`}>
            {article.title}
          </h3>
        </Link>
        {article.excerpt && (
          <p className="text-caption text-text-secondary line-clamp-2">{article.excerpt}</p>
        )}
        <div className="mt-4 font-mono text-micro text-text-tertiary">
          {formatTimeAgo(article.published_at)}
        </div>
      </div>
    </article>
  )
}
