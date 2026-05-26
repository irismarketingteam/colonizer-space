/**
 * Article publish endpoint — called by n8n pipeline.
 * Accepts article JSON, validates, inserts into Supabase, tracks pipeline run.
 *
 * Auth: Bearer token = PIPELINE_SECRET env var
 *
 * POST /api/publish
 * Body: { title, subtitle, section, body_md, excerpt, tags, slug, reading_time_min, source_urls, cover_image_url, cover_image_alt, cover_image_credit, pipeline_run_id? }
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const PIPELINE_SECRET = process.env.PIPELINE_SECRET

const VALID_SECTIONS = ['moon', 'mars', 'orbit', 'rockets', 'tech', 'economy', 'players', 'opinion']

function supaFetch(path, opts = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...opts,
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...opts.headers,
    },
  })
}

export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 204,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' },
    })
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  // Auth check
  const auth = req.headers.get('authorization')
  if (!PIPELINE_SECRET || auth !== `Bearer ${PIPELINE_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return Response.json({ error: 'Server misconfigured — missing Supabase credentials' }, { status: 500 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Validate required fields
  const { title, section, body_md, slug } = body
  const missing = []
  if (!title) missing.push('title')
  if (!section) missing.push('section')
  if (!body_md) missing.push('body_md')
  if (!slug) missing.push('slug')

  if (missing.length) {
    return Response.json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 })
  }

  if (!VALID_SECTIONS.includes(section)) {
    return Response.json({ error: `Invalid section: ${section}. Must be one of: ${VALID_SECTIONS.join(', ')}` }, { status: 400 })
  }

  // Build article record — ensure slug is unique by appending -2, -3, etc. if needed
  let baseSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
  let finalSlug = baseSlug
  let slugSuffix = 1
  while (true) {
    const existing = await supaFetch(`/articles?slug=eq.${finalSlug}&select=id`)
    if (!existing.ok) break
    const rows = await existing.json()
    if (rows.length === 0) break
    slugSuffix += 1
    finalSlug = `${baseSlug}-${slugSuffix}`
    if (slugSuffix > 50) {
      return Response.json({ error: 'Could not generate unique slug after 50 attempts' }, { status: 500 })
    }
  }

  const article = {
    slug: finalSlug,
    title,
    subtitle: body.subtitle || null,
    section,
    body_md,
    excerpt: body.excerpt || null,
    cover_image_url: body.cover_image_url || null,
    cover_image_alt: body.cover_image_alt || null,
    cover_image_credit: body.cover_image_credit || null,
    author: body.author || 'Colonizer Staff',
    status: body.status || 'review',
    seo_title: body.seo_title || title,
    seo_description: body.seo_description || body.excerpt || null,
    seo_keyword: body.seo_keyword || null,
    tags: body.tags || [],
    source_urls: body.source_urls || [],
    reading_time_min: body.reading_time_min || Math.ceil((body_md.split(/\s+/).length) / 238),
    published_at: body.status === 'published' ? new Date().toISOString() : null,
  }

  // Insert article
  const res = await supaFetch('/articles', {
    method: 'POST',
    body: JSON.stringify(article),
  })

  if (!res.ok) {
    const err = await res.text()
    return Response.json({ error: 'Failed to insert article', details: err }, { status: 500 })
  }

  const [inserted] = await res.json()

  // Update pipeline_runs if pipeline_run_id provided
  if (body.pipeline_run_id) {
    await supaFetch(`/pipeline_runs?id=eq.${body.pipeline_run_id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        article_id: inserted.id,
        status: article.status === 'published' ? 'published' : 'review',
      }),
    })
  }

  return Response.json({
    success: true,
    article: {
      id: inserted.id,
      slug: inserted.slug,
      section: inserted.section,
      status: inserted.status,
      url: `https://colonizer.space/${inserted.section}/${inserted.slug}`,
    },
  }, { status: 201 })
}
