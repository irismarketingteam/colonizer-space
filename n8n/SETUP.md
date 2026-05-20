# Colonizer Content Engine — Setup Guide

## Architecture

```
RSS Feeds (14 sources)
    ↓ every 30 min
Scout (n8n cron + RSS nodes)
    ↓
Filter Agent (Claude Sonnet) — scores 0.0–1.0
    ↓ >= 0.6 passes
Writer Agent (Claude Sonnet) — 600–1200 word article
    ↓
Editor Agent (Claude Sonnet) — fact-check + polish
    ↓
Cover Image (Unsplash API)
    ↓
Publish API → Supabase articles table
```

## Required Environment Variables

### Netlify (already set unless noted)

| Variable | Where to find | Status |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase > Settings > API | ✅ Set |
| `VITE_SUPABASE_ANON_KEY` | Supabase > Settings > API | ✅ Set |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Settings > API > service_role key | ❌ **Needs setup** |
| `PIPELINE_SECRET` | Auto-generated | ✅ Set |

### n8n Cloud Environment Variables

Set these in n8n > Settings > Environment Variables:

| Variable | Value |
|---|---|
| `PIPELINE_SECRET` | `e99fa764580de8a07fe7b68a38f4b65f2a6ea85f48e77d712c1560044a244527` |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `UNSPLASH_ACCESS_KEY` | Register at unsplash.com/developers, create app, get Access Key |
| `SUPABASE_URL` | `https://gyggbhepbfocvaeyemuu.supabase.co` |

## Setup Steps

### 1. Supabase Service Role Key

1. Go to supabase.com > colonizer project > Settings > API
2. Copy the `service_role` key (NOT the anon key)
3. Run: `npx netlify-cli env:set SUPABASE_SERVICE_ROLE_KEY "your-key-here"`
4. Redeploy: `npx netlify-cli deploy --prod --build`

### 2. Unsplash API

1. Go to unsplash.com/developers
2. Create a new application (free tier: 50 req/hr)
3. Copy the Access Key
4. Add as n8n environment variable

### 3. Import n8n Workflow

1. Open n8n Cloud
2. Go to Workflows > Import from File
3. Select `n8n/workflow-colonizer-pipeline.json`
4. The workflow will appear with all nodes pre-configured
5. Verify environment variables are set in n8n Settings
6. Activate the workflow

### 4. DNS Setup (colonizer.space)

Point your domain registrar DNS to Netlify:

**Option A: Netlify DNS (recommended)**
- Change nameservers at your registrar to Netlify's nameservers
- Netlify auto-provisions SSL

**Option B: External DNS**
- Add CNAME record: `colonizer.space` → `colonizer-space.netlify.app`
- Add CNAME record: `www.colonizer.space` → `colonizer-space.netlify.app`
- Note: CNAME on apex domain requires ALIAS/ANAME support from registrar

### 5. Plausible Analytics

1. Sign up at plausible.io
2. Add site: `colonizer.space`
3. Script tag is already in index.html — starts collecting immediately

## API Endpoints

### POST /api/publish
Inserts a new article into Supabase.

```bash
curl -X POST https://colonizer.space/api/publish \
  -H "Authorization: Bearer $PIPELINE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "section": "orbit",
    "slug": "test-article",
    "body_md": "# Test\n\nThis is a test article.",
    "excerpt": "A test article for the pipeline.",
    "tags": ["test"],
    "status": "review"
  }'
```

### POST /api/pipeline
Logs a discovered source to pipeline_runs.

### PATCH /api/pipeline
Updates an existing pipeline run (score, status, article_id).

### GET /api/pipeline?status=queued
Lists pipeline runs by status.

## Content Volume

Default config: 30-min scout cycle, ~14 RSS feeds, 0.6 relevance threshold.

Expected output: 3–8 articles per day depending on news cycle. All land in "review" status by default. Change to "published" in the editor agent or manually approve via Supabase dashboard.

## Manual Override

To publish directly without the pipeline:

```bash
curl -X POST https://colonizer.space/api/publish \
  -H "Authorization: Bearer $PIPELINE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Your Title Here",
    "section": "moon",
    "slug": "your-slug-here",
    "body_md": "Full markdown content...",
    "excerpt": "Meta description...",
    "status": "published",
    "tags": ["artemis", "nasa"]
  }'
```
