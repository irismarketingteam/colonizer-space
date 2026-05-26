import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useArticle } from '../hooks/useArticle'
import { buildArticleMeta } from '../lib/seo'
import { SITE } from '../lib/constants'
import ArticleBody from '../components/articles/ArticleBody'
import RelatedArticles from '../components/articles/RelatedArticles'
import NewsletterCTA from '../components/newsletter/NewsletterCTA'

export default function ArticlePage() {
  const { section, slug } = useParams()
  const { article, related, loading } = useArticle(section, slug)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="font-mono text-caption text-text-tertiary animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h1 className="font-display text-h2 text-text-primary mb-2">Article not found</h1>
          <p className="text-caption text-text-secondary">This article may have been removed or the URL is incorrect.</p>
        </div>
      </div>
    )
  }

  const meta = buildArticleMeta(article)

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:url" content={meta.url} />
        <meta property="og:site_name" content={SITE.name} />
        <meta property="article:published_time" content={meta.publishedAt} />
        <meta property="article:section" content={meta.section} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title,
            datePublished: meta.publishedAt,
            author: { '@type': 'Organization', name: SITE.name },
            publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
            image: meta.image,
            articleSection: meta.section,
          })}
        </script>
      </Helmet>

      <div className="pt-8 pb-16">
        <ArticleBody article={article} />
      </div>

      <RelatedArticles articles={related} />
      <NewsletterCTA />
    </>
  )
}
