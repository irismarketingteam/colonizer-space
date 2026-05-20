import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDate } from '../../lib/format'

export default function ReviewQueue() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQueue()
  }, [])

  async function fetchQueue() {
    if (!supabase) {
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'review')
      .order('created_at', { ascending: false })

    setArticles(data || [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    if (!supabase) return
    const updates = { status }
    if (status === 'scheduled') {
      updates.published_at = new Date().toISOString()
    }
    await supabase.from('articles').update(updates).eq('id', id)
    fetchQueue()
  }

  if (loading) return <div className="text-text-tertiary font-mono text-caption">Loading queue...</div>
  if (!articles.length) return <div className="text-text-tertiary font-mono text-caption">Queue empty.</div>

  return (
    <div className="space-y-4">
      {articles.map((a) => (
        <div key={a.id} className="border border-subtle p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="section-tag">{a.section}</span>
              <h4 className="font-display text-h3 text-text-primary mt-1">{a.title}</h4>
              <p className="text-caption text-text-secondary mt-1">{a.excerpt}</p>
              <p className="font-mono text-micro text-text-tertiary mt-2">Created {formatDate(a.created_at)}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => updateStatus(a.id, 'scheduled')}
                className="px-3 py-1.5 text-micro font-medium bg-signal-live/20 text-signal-live hover:bg-signal-live/30 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(a.id, 'archived')}
                className="px-3 py-1.5 text-micro font-medium bg-signal-critical/20 text-signal-critical hover:bg-signal-critical/30 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
