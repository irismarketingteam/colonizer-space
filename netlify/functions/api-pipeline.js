/**
 * Pipeline tracking endpoint — called by n8n at discovery/filter stages.
 *
 * POST /api/pipeline — log a discovered source
 * PATCH /api/pipeline — update an existing pipeline run
 * GET /api/pipeline?status=queued — list runs by status
 *
 * Auth: Bearer token = PIPELINE_SECRET env var
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const PIPELINE_SECRET = process.env.PIPELINE_SECRET

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

function authCheck(req) {
  const auth = req.headers.get('authorization')
  if (!PIPELINE_SECRET || auth !== `Bearer ${PIPELINE_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 204,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PATCH', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' },
    })
  }

  const denied = authCheck(req)
  if (denied) return denied

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return Response.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  // GET — list pipeline runs by status
  if (req.method === 'GET') {
    const url = new URL(req.url)
    const status = url.searchParams.get('status') || 'queued'
    const limit = url.searchParams.get('limit') || '20'

    const res = await supaFetch(
      `/pipeline_runs?status=eq.${status}&order=created_at.desc&limit=${limit}`
    )
    const data = await res.json()
    return Response.json(data)
  }

  // POST — log a new discovery
  if (req.method === 'POST') {
    const body = await req.json()
    const record = {
      source_url: body.source_url,
      source_title: body.source_title || null,
      source_domain: body.source_domain || null,
      relevance_score: body.relevance_score || null,
      filter_reasoning: body.filter_reasoning || null,
      status: body.status || 'discovered',
    }

    const res = await supaFetch('/pipeline_runs', {
      method: 'POST',
      body: JSON.stringify(record),
    })

    if (!res.ok) {
      const err = await res.text()
      return Response.json({ error: 'Insert failed', details: err }, { status: 500 })
    }

    const [inserted] = await res.json()
    return Response.json(inserted, { status: 201 })
  }

  // PATCH — update existing run
  if (req.method === 'PATCH') {
    const body = await req.json()
    if (!body.id) {
      return Response.json({ error: 'Missing pipeline run id' }, { status: 400 })
    }

    const update = {}
    if (body.status) update.status = body.status
    if (body.relevance_score !== undefined) update.relevance_score = body.relevance_score
    if (body.filter_reasoning) update.filter_reasoning = body.filter_reasoning
    if (body.article_id) update.article_id = body.article_id

    const res = await supaFetch(`/pipeline_runs?id=eq.${body.id}`, {
      method: 'PATCH',
      body: JSON.stringify(update),
    })

    if (!res.ok) {
      const err = await res.text()
      return Response.json({ error: 'Update failed', details: err }, { status: 500 })
    }

    const [updated] = await res.json()
    return Response.json(updated)
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}
