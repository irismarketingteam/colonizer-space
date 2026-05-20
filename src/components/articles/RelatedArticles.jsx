import ArticleCard from './ArticleCard'

export default function RelatedArticles({ articles }) {
  if (!articles?.length) return null

  return (
    <section className="py-16 px-[clamp(1rem,3vw,3rem)]">
      <div className="max-w-[90rem] mx-auto">
        <h3 className="font-mono text-micro uppercase tracking-widest text-text-secondary mb-8">
          Related
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
