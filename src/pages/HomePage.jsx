import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useArticles, useLatestBySection } from '../hooks/useArticles'
import { SECTIONS, SITE } from '../lib/constants'
import { formatTimeAgo } from '../lib/format'
import ArticleCard from '../components/articles/ArticleCard'
import NewsletterCTA from '../components/newsletter/NewsletterCTA'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=900&fit=crop&q=80'

export default function HomePage() {
  const { articles, loading } = useArticles(null, 40)
  const { sections } = useLatestBySection(4)

  const latest = articles[0]

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

      {/* Hero */}
      <section className="relative h-[85vh] min-h-[500px] max-h-[900px] flex items-end overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Earth from space"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />
        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-[clamp(1rem,3vw,3rem)] pb-16">
          <p className="font-mono text-micro uppercase tracking-[0.2em] text-accent mb-4">
            {SITE.tagline}
          </p>
          <h1 className="font-display font-bold text-text-primary leading-[1.05] max-w-3xl" style={{ fontSize: 'var(--text-hero)' }}>
            The publication of record for humans beyond Earth
          </h1>
          <p className="mt-6 text-lg text-text-secondary max-w-xl">
            Coverage of the built environment of space. Habitats, stations, surface structures, transport, and the economy that supports it all.
          </p>
        </div>
      </section>

      {/* Latest Article Feature */}
      {latest && !loading && (
        <section className="py-16 px-[clamp(1rem,3vw,3rem)]">
          <div className="max-w-[90rem] mx-auto">
            <h2 className="font-mono text-micro uppercase tracking-widest text-text-secondary mb-8">Latest</h2>
            <div className="site-grid">
              <div className="col-span-12 md:col-span-7">
                {latest.cover_image_url && (
                  <Link to={`/${latest.section}/${latest.slug}`} className="block overflow-hidden mb-6">
                    <img
                      src={latest.cover_image_url}
                      alt={latest.cover_image_alt || latest.title}
                      className="w-full aspect-video object-cover hover:scale-[1.02] transition-transform duration-500"
                    />
                  </Link>
                )}
              </div>
              <div className="col-span-12 md:col-span-5 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="section-tag">{latest.section}</span>
                  {latest.reading_time_min && (
                    <span className="font-mono text-micro text-text-tertiary">{latest.reading_time_min} min read</span>
                  )}
                  <span className="font-mono text-micro text-text-tertiary">{formatTimeAgo(latest.published_at)}</span>
                </div>
                <Link to={`/${latest.section}/${latest.slug}`}>
                  <h3 className="font-display font-bold text-h1 text-text-primary hover:text-accent transition-colors mb-4">
                    {latest.title}
                  </h3>
                </Link>
                {latest.subtitle && (
                  <p className="text-lg text-text-secondary mb-4">{latest.subtitle}</p>
                )}
                {latest.excerpt && (
                  <p className="text-caption text-text-secondary">{latest.excerpt}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section Samples */}
      {!loading && SECTIONS.filter((s) => sections[s.slug]?.length).map((s) => (
        <section key={s.slug} className="py-12 px-[clamp(1rem,3vw,3rem)] border-t border-subtle">
          <div className="max-w-[90rem] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Link to={`/${s.slug}`} className="font-display font-semibold text-h2 text-text-primary hover:text-accent transition-colors">
                  {s.name}
                </Link>
                <p className="text-caption text-text-secondary mt-1">{s.description}</p>
              </div>
              <Link
                to={`/${s.slug}`}
                className="hidden sm:block font-mono text-micro text-text-tertiary hover:text-accent transition-colors shrink-0"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sections[s.slug].slice(0, 4).map((article) => (
                <SectionArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Newsletter CTA (inline, bottom of page) */}
      <NewsletterCTA />

      {loading && <Loading />}
    </>
  )
}

function SectionArticleCard({ article }) {
  const url = `/${article.section}/${article.slug}`
  return (
    <article className="group">
      {article.cover_image_url && (
        <Link to={url} className="block overflow-hidden mb-3">
          <img
            src={article.cover_image_url}
            alt={article.cover_image_alt || article.title}
            className="w-full aspect-[3/2] object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500"
            loading="lazy"
          />
        </Link>
      )}
      <Link to={url}>
        <h4 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors text-[0.95rem] leading-snug mb-2">
          {article.title}
        </h4>
      </Link>
      {article.excerpt && (
        <p className="text-micro text-text-secondary line-clamp-2">{article.excerpt}</p>
      )}
      <p className="font-mono text-micro text-text-tertiary mt-2">{formatTimeAgo(article.published_at)}</p>
    </article>
  )
}

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="font-mono text-caption text-text-tertiary animate-pulse">Loading...</div>
    </div>
  )
}
