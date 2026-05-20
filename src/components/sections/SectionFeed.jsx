import { Link } from 'react-router-dom'
import ArticleCard from '../articles/ArticleCard'

export default function SectionFeed({ section, articles }) {
  if (!articles?.length) return null

  return (
    <section className="py-8 px-[clamp(1rem,3vw,3rem)]">
      <div className="max-w-[90rem] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-mono text-micro uppercase tracking-widest text-text-secondary">
            {section.name}
          </h3>
          <Link
            to={`/${section.slug}`}
            className="font-mono text-micro text-text-tertiary hover:text-accent transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none">
          {articles.map((article) => (
            <div key={article.id} className="min-w-[300px] max-w-[340px] shrink-0">
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
