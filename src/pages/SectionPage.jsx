import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useArticles } from '../hooks/useArticles'
import { SECTIONS, SITE } from '../lib/constants'
import { buildSectionMeta } from '../lib/seo'
import SectionHeader from '../components/sections/SectionHeader'
import ArticleCard from '../components/articles/ArticleCard'
import ArticleRow from '../components/articles/ArticleRow'

export default function SectionPage() {
  const { section: sectionSlug } = useParams()
  const section = SECTIONS.find((s) => s.slug === sectionSlug)
  const { articles, loading } = useArticles(sectionSlug, 30)

  if (!section) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="font-mono text-caption text-text-tertiary">Section not found.</p>
      </div>
    )
  }

  const meta = buildSectionMeta(section)
  const lead = articles[0]
  const sidebar = articles.slice(1, 4)
  const feed = articles.slice(4)

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.url} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.url} />
      </Helmet>

      <SectionHeader section={section} />

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="font-mono text-caption text-text-tertiary animate-pulse">Loading...</div>
        </div>
      ) : articles.length === 0 ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <p className="font-mono text-caption text-text-tertiary">No articles yet.</p>
        </div>
      ) : (
        <>
          <section className="px-[clamp(1rem,3vw,3rem)] pb-12">
            <div className="max-w-[90rem] mx-auto">
              <div className="site-grid">
                {lead && (
                  <div className="col-span-12 md:col-span-8">
                    <ArticleCard article={lead} featured />
                  </div>
                )}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
                  {sidebar.map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {feed.length > 0 && (
            <section className="px-[clamp(1rem,3vw,3rem)] pb-16">
              <div className="max-w-3xl mx-auto">
                {feed.map((a) => (
                  <ArticleRow key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  )
}
