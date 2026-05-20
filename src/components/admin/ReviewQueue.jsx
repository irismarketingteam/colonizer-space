import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDate } from '../../lib/format'
import { renderMarkdown } from '../../lib/markdown'

export default function ReviewQueue({ onEdit }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    fetchQueue()
  }, [])

  async function fetchQueue() {
    if (!supabase) { setLoading(false); return }
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'review')
      .order('created_at', { ascending: false })

    setArticles(data || [])
    setLoading(false)
  }

  async function approve(id) {
    if (!supabase) return
    await supabase.from('articles').update({
      status: 'published',
      published_at: new Date().toISOString(),
    }).eq('id', id)
    setArticles((prev) => prev.filter((a) => a.id !== id))
  }

  async function reject(id) {
    if (!supabase) return
    await supabase.from('articles').update({ status: 'archived' }).eq('id', id)
    setArticles((prev) => prev.filter((a) => a.id !== id))
  }

  if (loading) return <div className="text-text-tertiary font-mono text-caption animate-pulse">Loading review queue...</div>

  if (!articles.length) {
    return (
      <div className="border border-subtle border-dashed p-12 text-center">
        <p className="font-mono text-caption text-text-tertiary">Review queue is empty.</p>
        <p className="font-mono text-micro text-text-tertiary mt-2">Articles from the pipeline land here for approval.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="font-mono text-micro text-text-tertiary">{articles.length} article{articles.length !== 1 ? 's' : ''} awaiting review</p>

      {articles.map((a) => {
        const isExpanded = expanded === a.id
        return (
          <div key={a.id} className="border border-subtle">
            {/* Header row */}
            <div className="flex items-start gap-4 p-4">
              <button
                onClick={() => setExpanded(isExpanded ? null : a.id)}
                className="mt-1 text-text-tertiary hover:text-text-primary transition-colors shrink-0"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                  className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                >
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="section-tag">{a.section}</span>
                  {a.reading_time_min && (
                    <span className="font-mono text-micro text-text-tertiary">{a.reading_time_min} min</span>
                  )}
                  <span className="font-mono text-micro text-text-tertiary">{formatDate(a.created_at)}</span>
                  {a.source_urls?.length > 0 && (
                    <a
                      href={a.source_urls[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-micro text-accent hover:text-accent-hover transition-colors"
                    >
                      Source &rarr;
                    </a>
                  )}
                </div>
                <h4 className="font-display font-semibold text-text-primary text-[1.05rem] leading-snug">{a.title}</h4>
                {a.subtitle && <p className="text-caption text-text-secondary mt-1">{a.subtitle}</p>}
                {!isExpanded && a.excerpt && (
                  <p className="text-micro text-text-tertiary mt-2 line-clamp-2">{a.excerpt}</p>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => onEdit(a.id)}
                  className="px-3 py-1.5 text-micro font-medium border border-subtle text-text-secondary hover:text-accent hover:border-accent/50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => approve(a.id)}
                  className="px-3 py-1.5 text-micro font-medium bg-signal-live/20 text-signal-live hover:bg-signal-live/30 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => reject(a.id)}
                  className="px-3 py-1.5 text-micro font-medium bg-signal-critical/20 text-signal-critical hover:bg-signal-critical/30 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div className="border-t border-subtle">
                {a.cover_image_url && (
                  <img
                    src={a.cover_image_url}
                    alt={a.cover_image_alt || a.title}
                    className="w-full max-h-64 object-cover"
                  />
                )}
                <div className="p-6 max-w-3xl">
                  <div
                    className="article-body"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(a.body_md) }}
                  />
                </div>
                {a.tags?.length > 0 && (
                  <div className="px-6 pb-4 flex flex-wrap gap-2">
                    {a.tags.map((t) => (
                      <span key={t} className="font-mono text-micro px-2 py-0.5 bg-elevated text-text-tertiary">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
