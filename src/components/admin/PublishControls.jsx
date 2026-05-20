import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDate } from '../../lib/format'

export default function PublishControls() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  async function fetchArticles() {
    if (!supabase) {
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('articles')
      .select('id, title, section, status, published_at, created_at')
      .in('status', ['scheduled', 'published', 'draft'])
      .order('created_at', { ascending: false })
      .limit(30)

    setArticles(data || [])
    setLoading(false)
  }

  async function publish(id) {
    if (!supabase) return
    await supabase.from('articles').update({ status: 'published', published_at: new Date().toISOString() }).eq('id', id)
    fetchArticles()
  }

  async function unpublish(id) {
    if (!supabase) return
    await supabase.from('articles').update({ status: 'draft' }).eq('id', id)
    fetchArticles()
  }

  if (loading) return <div className="text-text-tertiary font-mono text-caption">Loading...</div>
  if (!articles.length) return <div className="text-text-tertiary font-mono text-caption">No articles.</div>

  return (
    <div className="space-y-2">
      {articles.map((a) => (
        <div key={a.id} className="flex items-center gap-4 py-3 border-b border-subtle">
          <span className={`font-mono text-micro uppercase w-20 ${
            a.status === 'published' ? 'text-signal-live' : a.status === 'scheduled' ? 'text-signal-alert' : 'text-text-tertiary'
          }`}>
            {a.status}
          </span>
          <span className="section-tag w-16">{a.section}</span>
          <span className="text-caption text-text-primary flex-1 truncate">{a.title}</span>
          <span className="font-mono text-micro text-text-tertiary">{formatDate(a.created_at)}</span>
          <div className="flex gap-2">
            {a.status !== 'published' && (
              <button
                onClick={() => publish(a.id)}
                className="px-2 py-1 text-micro bg-signal-live/20 text-signal-live hover:bg-signal-live/30 transition-colors"
              >
                Publish
              </button>
            )}
            {a.status === 'published' && (
              <button
                onClick={() => unpublish(a.id)}
                className="px-2 py-1 text-micro bg-signal-critical/20 text-signal-critical hover:bg-signal-critical/30 transition-colors"
              >
                Unpublish
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
