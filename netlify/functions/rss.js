const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY
const SITE_URL = 'https://colonizer.space'
const SITE_NAME = 'Colonizer'
const SITE_DESC = 'The publication of record for humans living and working beyond Earth.'

async function query(table, params) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`)
  url.search = new URLSearchParams(params).toString()
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  return res.json()
}

function escapeXml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default async (req) => {
  const url = new URL(req.url)
  const sectionMatch = url.pathname.match(/^\/(\w+)\/feed\.xml$/)
  const section = sectionMatch ? sectionMatch[1] : null

  const params = {
    select: 'title,slug,section,excerpt,published_at,author,cover_image_url',
    status: 'eq.published',
    published_at: `lte.${new Date().toISOString()}`,
    order: 'published_at.desc',
    limit: '50',
  }
  if (section) params.section = `eq.${section}`

  const articles = await query('articles', params)

  const channelTitle = section
    ? `${SITE_NAME} — ${section.charAt(0).toUpperCase() + section.slice(1)}`
    : SITE_NAME

  const items = (articles || []).map((a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_URL}/${a.section}/${a.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/${a.section}/${a.slug}</guid>
      <description>${escapeXml(a.excerpt)}</description>
      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>
      <category>${escapeXml(a.section)}</category>
      ${a.author ? `<dc:creator>${escapeXml(a.author)}</dc:creator>` : ''}
      ${a.cover_image_url ? `<media:content url="${escapeXml(a.cover_image_url)}" medium="image" />` : ''}
    </item>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}${url.pathname}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}

export const config = {
  path: ['/feed.xml', '/:section/feed.xml'],
}
