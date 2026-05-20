import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { SECTIONS } from '../../lib/constants'
import { formatDate } from '../../lib/format'

const STATUS_STYLES = {
  published: 'text-signal-live bg-signal-live/10',
  review: 'text-signal-alert bg-signal-alert/10',
  scheduled: 'text-accent bg-accent/10',
  draft: 'text-text-tertiary bg-elevated',
  archived: 'text-text-tertiary bg-elevated line-through',
}

export default function ArticleList({ initialFilter, onEdit }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState(initialFilter || 'all')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [statusFilter, sectionFilter])

  async function fetchArticles() {
    if (!supabase) { setLoading(false); return }
    setLoading(true)

    let query = supabase
      .from('articles')
      .select('id, title, section, status, slug, excerpt, published_at, created_at, reading_time_min, cover_image_url')
      .order('created_at', { ascending: false })
      .limit(100)

    if (statusFilter !== 'all') query = query.eq('status', statusFilter)
    if (sectionFilter !== 'all') query = query.eq('section', sectionFilter)

    const { data } = await query
    setArticles(data || [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    if (!supabase) return
    const updates = { status }
    if (status === 'published') updates.published_at = new Date().toISOString()
    await supabase.from('articles').update(updates).eq('id', id)
    fetchArticles()
  }

  async function deleteArticle(id) {
    if (!supabase) return
    await supabase.from('articles').delete().eq('id', id)
    fetchArticles()
  }

  const filtered = searchQuery
    ? articles.filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : articles

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-input w-auto"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="review">In Review</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="admin-input w-auto"
        >
          <option value="all">All Sections</option>
          {SECTIONS.map((s) => (
            <option key={s.slug} value={s.slug}>{s.name}</option>
          ))}
        </select>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search titles..."
          className="admin-input flex-1 min-w-[200px]"
        />

        <span className="font-mono text-micro text-text-tertiary">{filtered.length} articles</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-text-tertiary font-mono text-caption animate-pulse">Loading articles...</div>
      ) : filtered.length === 0 ? (
        <div className="text-text-tertiary font-mono text-caption py-8 text-center">No articles found.</div>
      ) : (
        <div className="border border-subtle divide-y divide-subtle">
          {filtered.map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-4 py-3 hover:bg-elevated/50 transition-colors group">
              <span className={`font-mono text-micro uppercase px-2 py-0.5 rounded shrink-0 ${STATUS_STYLES[a.status] || 'text-text-tertiary'}`}>
                {a.status}
              </span>
              <span className="section-tag shrink-0">{a.section}</span>
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => onEdit(a.id)}
                  className="text-caption text-text-primary hover:text-accent transition-colors text-left truncate block w-full"
                >
                  {a.title}
                </button>
              </div>
              {a.reading_time_min && (
                <span className="font-mono text-micro text-text-tertiary hidden sm:block shrink-0">{a.reading_time_min}m</span>
              )}
              <span className="font-mono text-micro text-text-tertiary hidden md:block shrink-0">
                {formatDate(a.published_at || a.created_at)}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {a.status !== 'published' && (
                  <button
                    onClick={() => updateStatus(a.id, 'published')}
                    className="px-2 py-1 text-micro bg-signal-live/20 text-signal-live hover:bg-signal-live/30 transition-colors"
                    title="Publish"
                  >
                    Publish
                  </button>
                )}
                {a.status === 'published' && (
                  <button
                    onClick={() => updateStatus(a.id, 'draft')}
                    className="px-2 py-1 text-micro bg-signal-alert/20 text-signal-alert hover:bg-signal-alert/30 transition-colors"
                    title="Unpublish"
                  >
                    Unpublish
                  </button>
                )}
                <button
                  onClick={() => onEdit(a.id)}
                  className="px-2 py-1 text-micro bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
                  title="Edit"
                >
                  Edit
                </button>
                {a.status !== 'published' && (
                  <button
                    onClick={() => { if (confirm('Delete this article?')) deleteArticle(a.id) }}
                    className="px-2 py-1 text-micro bg-signal-critical/20 text-signal-critical hover:bg-signal-critical/30 transition-colors"
                    title="Delete"
                  >
                    Del
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
