const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

async function query(table, params) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`)
  url.search = new URLSearchParams(params).toString()
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  const data = await res.json()
  return Array.isArray(data) ? data[0] : data
}

export default async (req) => {
  const url = new URL(req.url)
  const slug = url.pathname.replace('/og/', '').replace('.png', '')

  const article = await query('articles', {
    select: 'title,section,excerpt',
    slug: `eq.${slug}`,
    limit: '1',
  })

  const title = article?.title || 'Colonizer'
  const section = article?.section?.toUpperCase() || ''

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#05070A"/>
    <rect x="0" y="0" width="1200" height="4" fill="#3B82F6"/>
    ${section ? `<text x="60" y="200" font-family="system-ui, sans-serif" font-size="16" font-weight="500" fill="#3B82F6" letter-spacing="4">${section}</text>` : ''}
    <text x="60" y="${section ? '280' : '260'}" font-family="system-ui, sans-serif" font-size="52" font-weight="700" fill="#E8ECF1">
      ${wrapText(title, 22).map((line, i) => `<tspan x="60" dy="${i === 0 ? 0 : 62}">${escapeXml(line)}</tspan>`).join('')}
    </text>
    <text x="60" y="580" font-family="monospace" font-size="14" fill="#4A5568">colonizer.space</text>
    <text x="1140" y="580" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#3B82F6" text-anchor="end">C</text>
  </svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

function wrapText(text, maxCharsPerLine) {
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxCharsPerLine && current) {
      lines.push(current.trim())
      current = word
    } else {
      current = current ? current + ' ' + word : word
    }
  }
  if (current) lines.push(current.trim())
  return lines.slice(0, 4)
}

function escapeXml(str) {
  if (!str) return ''
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export const config = {
  path: '/og/*',
}
