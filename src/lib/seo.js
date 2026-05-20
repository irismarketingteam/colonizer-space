import { SITE } from './constants'

export function buildArticleMeta(article) {
  const title = article.seo_title || article.title
  const description = article.seo_description || article.excerpt || ''
  const url = `${SITE.url}/${article.section}/${article.slug}`
  const image = article.cover_image_url || `${SITE.url}/og/${article.slug}.png`

  return {
    title: `${title} — ${SITE.name}`,
    description,
    url,
    image,
    publishedAt: article.published_at,
    section: article.section,
  }
}

export function buildSectionMeta(section) {
  return {
    title: `${section.name} — ${SITE.name}`,
    description: section.description,
    url: `${SITE.url}/${section.slug}`,
  }
}
