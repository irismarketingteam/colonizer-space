import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { SECTIONS } from '../../lib/constants'
import { renderMarkdown } from '../../lib/markdown'

export default function ArticleEditor({ articleId = null, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    section: 'orbit',
    slug: '',
    body_md: '',
    excerpt: '',
    tags: '',
    cover_image_url: '',
    cover_image_alt: '',
    cover_image_credit: '',
    author: 'Colonizer Staff',
    status: 'draft',
    seo_title: '',
    seo_description: '',
  })
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!!articleId)
  const [error, setError] = useState('')

  useEffect(() => {
    if (articleId) loadArticle()
  }, [articleId])

  async function loadArticle() {
    if (!supabase) return
    const { data } = await supabase.from('articles').select('*').eq('id', articleId).single()
    if (data) {
      setForm({
        title: data.title || '',
        subtitle: data.subtitle || '',
        section: data.section || 'orbit',
        slug: data.slug || '',
        body_md: data.body_md || '',
        excerpt: data.excerpt || '',
        tags: (data.tags || []).join(', '),
        cover_image_url: data.cover_image_url || '',
        cover_image_alt: data.cover_image_alt || '',
        cover_image_credit: data.cover_image_credit || '',
        author: data.author || 'Colonizer Staff',
        status: data.status || 'draft',
        seo_title: data.seo_title || '',
        seo_description: data.seo_description || '',
      })
    }
    setLoading(false)
  }

  function updateField(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'title' && !articleId) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      }
      return next
    })
  }

  async function handleSave(publishNow = false) {
    if (!supabase) return
    setError('')
    setSaving(true)

    const record = {
      title: form.title,
      subtitle: form.subtitle || null,
      section: form.section,
      slug: form.slug,
      body_md: form.body_md,
      excerpt: form.excerpt || null,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      cover_image_url: form.cover_image_url || null,
      cover_image_alt: form.cover_image_alt || null,
      cover_image_credit: form.cover_image_credit || null,
      author: form.author,
      seo_title: form.seo_title || form.title,
      seo_description: form.seo_description || form.excerpt || null,
      reading_time_min: Math.ceil((form.body_md.split(/\s+/).length) / 238),
    }

    if (publishNow) {
      record.status = 'published'
      record.published_at = new Date().toISOString()
    } else {
      record.status = form.status === 'published' ? 'published' : form.status
    }

    let result
    if (articleId) {
      result = await supabase.from('articles').update(record).eq('id', articleId).select()
    } else {
      result = await supabase.from('articles').insert(record).select()
    }

    setSaving(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    if (onSave) onSave(result.data?.[0])
  }

  if (loading) return <div className="text-text-tertiary font-mono text-caption animate-pulse">Loading article...</div>

  const wordCount = form.body_md.trim() ? form.body_md.trim().split(/\s+/).length : 0
  const readingTime = Math.ceil(wordCount / 238)

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onCancel && (
            <button onClick={onCancel} className="font-mono text-micro text-text-tertiary hover:text-text-primary transition-colors">
              &larr; Back
            </button>
          )}
          <h2 className="font-display text-h3 text-text-primary">
            {articleId ? 'Edit Article' : 'New Article'}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreview(!preview)}
            className={`px-3 py-1.5 font-mono text-micro border transition-colors ${
              preview ? 'border-accent text-accent' : 'border-subtle text-text-tertiary hover:text-text-primary'
            }`}
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving || !form.title || !form.body_md}
            className="px-4 py-1.5 font-mono text-micro border border-subtle text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving || !form.title || !form.body_md || !form.slug}
            className="px-4 py-1.5 font-mono text-micro bg-signal-live text-white hover:bg-signal-live/80 transition-colors disabled:opacity-30"
          >
            {saving ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      </div>

      {error && <p className="text-caption text-signal-critical border border-signal-critical/30 px-4 py-2">{error}</p>}

      {preview ? (
        /* Preview mode */
        <div className="border border-subtle p-8 max-w-3xl">
          {form.cover_image_url && (
            <img src={form.cover_image_url} alt={form.cover_image_alt || form.title} className="w-full aspect-video object-cover mb-6" />
          )}
          <div className="flex items-center gap-3 mb-4">
            <span className="section-tag">{form.section}</span>
            <span className="font-mono text-micro text-text-tertiary">{readingTime} min read</span>
          </div>
          <h1 className="font-display font-bold text-h1 text-text-primary mb-2">{form.title || 'Untitled'}</h1>
          {form.subtitle && <p className="text-lg text-text-secondary mb-6">{form.subtitle}</p>}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(form.body_md) }}
          />
        </div>
      ) : (
        /* Edit mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            <Field label="Title" required>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Article headline"
                className="admin-input"
              />
            </Field>

            <Field label="Subtitle">
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => updateField('subtitle', e.target.value)}
                placeholder="One-sentence subheading"
                className="admin-input"
              />
            </Field>

            <Field label={`Body (Markdown) — ${wordCount} words, ~${readingTime} min read`} required>
              <textarea
                value={form.body_md}
                onChange={(e) => updateField('body_md', e.target.value)}
                placeholder="Write your article in Markdown..."
                rows={20}
                className="admin-input font-mono text-[0.85rem] leading-relaxed"
              />
            </Field>

            <Field label="Excerpt (meta description)">
              <textarea
                value={form.excerpt}
                onChange={(e) => updateField('excerpt', e.target.value)}
                placeholder="160-character summary for SEO"
                rows={2}
                maxLength={200}
                className="admin-input"
              />
              <span className="font-mono text-micro text-text-tertiary">{form.excerpt.length}/160</span>
            </Field>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Field label="Section" required>
              <select
                value={form.section}
                onChange={(e) => updateField('section', e.target.value)}
                className="admin-input"
              >
                {SECTIONS.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Slug" required>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="url-friendly-slug"
                className="admin-input font-mono text-[0.85rem]"
              />
            </Field>

            <Field label="Tags (comma-separated)">
              <input
                type="text"
                value={form.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                placeholder="spacex, starship, mars"
                className="admin-input"
              />
            </Field>

            <Field label="Cover Image URL">
              <input
                type="url"
                value={form.cover_image_url}
                onChange={(e) => updateField('cover_image_url', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="admin-input font-mono text-[0.85rem]"
              />
              {form.cover_image_url && (
                <img src={form.cover_image_url} alt="Cover preview" className="mt-2 w-full aspect-video object-cover border border-subtle" />
              )}
            </Field>

            <Field label="Cover Image Alt">
              <input
                type="text"
                value={form.cover_image_alt}
                onChange={(e) => updateField('cover_image_alt', e.target.value)}
                placeholder="Descriptive alt text"
                className="admin-input"
              />
            </Field>

            <Field label="Image Credit">
              <input
                type="text"
                value={form.cover_image_credit}
                onChange={(e) => updateField('cover_image_credit', e.target.value)}
                placeholder="Photo by Name on Unsplash"
                className="admin-input"
              />
            </Field>

            <Field label="Author">
              <input
                type="text"
                value={form.author}
                onChange={(e) => updateField('author', e.target.value)}
                className="admin-input"
              />
            </Field>

            <Field label="SEO Title (optional override)">
              <input
                type="text"
                value={form.seo_title}
                onChange={(e) => updateField('seo_title', e.target.value)}
                placeholder={form.title || 'Defaults to title'}
                className="admin-input"
              />
            </Field>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="font-mono text-micro text-text-secondary mb-1 block">
        {label}{required && <span className="text-signal-critical ml-1">*</span>}
      </span>
      {children}
    </label>
  )
}
