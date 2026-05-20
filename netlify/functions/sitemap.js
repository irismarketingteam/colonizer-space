const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY
const SITE_URL = 'https://colonizer.space'
const SECTIONS = ['moon', 'mars', 'orbit', 'rockets', 'tech', 'economy', 'players', 'opinion']

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
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export default async () => {
  const articles = await query('articles', {
    select: 'slug,section,published_at,updated_at',
    status: 'eq.published',
    published_at: `lte.${new Date().toISOString()}`,
    order: 'published_at.desc',
    limit: '5000',
  })

  const staticPages = [
    { loc: SITE_URL, priority: '1.0', changefreq: 'hourly' },
    { loc: `${SITE_URL}/about`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${SITE_URL}/newsletter`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${SITE_URL}/search`, priority: '0.3', changefreq: 'monthly' },
  ]

  const sectionPages = SECTIONS.map((s) => ({
    loc: `${SITE_URL}/${s}`,
    priority: '0.8',
    changefreq: 'hourly',
  }))

  const articlePages = (articles || []).map((a) => ({
    loc: `${SITE_URL}/${a.section}/${a.slug}`,
    priority: '0.7',
    changefreq: 'weekly',
    lastmod: a.updated_at || a.published_at,
  }))

  const allPages = [...staticPages, ...sectionPages, ...articlePages]

  const urls = allPages.map((p) => `
  <url>
    <loc>${escapeXml(p.loc)}</loc>
    ${p.lastmod ? `<lastmod>${new Date(p.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

export const config = {
  path: '/sitemap.xml',
}
