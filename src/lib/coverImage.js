// Section-themed fallback images so every article feature on the homepage
// always renders a featured image, even when cover_image_url is null
// (pipeline failures, missing press photos, Unsplash rate limits, etc.).

const SECTION_FALLBACKS = {
  moon:    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1200&h=675&fit=crop&q=80',
  mars:    'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=1200&h=675&fit=crop&q=80',
  orbit:   'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&h=675&fit=crop&q=80',
  rockets: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&h=675&fit=crop&q=80',
  tech:    'https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=1200&h=675&fit=crop&q=80',
  economy: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=1200&h=675&fit=crop&q=80',
  players: 'https://images.unsplash.com/photo-1454789591675-556c287e39e2?w=1200&h=675&fit=crop&q=80',
  opinion: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=675&fit=crop&q=80',
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=675&fit=crop&q=80'

/**
 * Returns the best available cover image URL for an article.
 * Falls back to a section-themed image if `cover_image_url` is unset.
 */
export function getCoverImage(article) {
  if (!article) return DEFAULT_FALLBACK
  if (article.cover_image_url) return article.cover_image_url
  return SECTION_FALLBACKS[article.section] || DEFAULT_FALLBACK
}

/**
 * Returns the alt text for an article's cover image, falling back to title.
 */
export function getCoverAlt(article) {
  if (!article) return ''
  return article.cover_image_alt || article.title || ''
}
