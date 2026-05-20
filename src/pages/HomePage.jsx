import { Helmet } from 'react-helmet-async'
import { useArticles, useLatestBySection } from '../hooks/useArticles'
import { SECTIONS, SITE } from '../lib/constants'
import ArticleHero from '../components/articles/ArticleHero'
import ArticleCard from '../components/articles/ArticleCard'
import SectionFeed from '../components/sections/SectionFeed'
import NewsletterCTA from '../components/newsletter/NewsletterCTA'

export default function HomePage() {
  const { articles, loading } = useArticles(null, 20)
  const { sections } = useLatestBySection(4)

  if (loading) return <Loading />

  const hero = articles[0]
  const featured = articles[1]
  const secondary = articles.slice(2, 5)

  return (
    <>
      <Helmet>
        <title>{SITE.name} — {SITE.tagline}</title>
        <meta name="description" content={SITE.description} />
        <link rel="canonical" href={SITE.url} />
        <meta property="og:title" content={`${SITE.name} — ${SITE.tagline}`} />
        <meta property="og:description" content={SITE.description} />
        <meta property="og:url" content={SITE.url} />
        <meta property="og:type" content="website" />
      </Helmet>

      {hero && <ArticleHero article={hero} />}

      <section className="px-[clamp(1rem,3vw,3rem)] pb-12">
        <div className="max-w-[90rem] mx-auto">
          <div className="site-grid">
            {featured && (
              <div className="col-span-12 md:col-span-8">
                <ArticleCard article={featured} featured />
              </div>
            )}
            <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
              {secondary.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {SECTIONS.filter((s) => sections[s.slug]?.length).map((s) => (
        <SectionFeed key={s.slug} section={s} articles={sections[s.slug]} />
      ))}

      <NewsletterCTA />
    </>
  )
}

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="font-mono text-caption text-text-tertiary animate-pulse">Loading...</div>
    </div>
  )
}
