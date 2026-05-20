import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const STATUS_COLORS = {
  discovered: 'text-text-tertiary',
  filtered_out: 'text-text-tertiary',
  queued: 'text-signal-alert',
  drafting: 'text-signal-alert',
  drafted: 'text-accent',
  review: 'text-accent',
  published: 'text-signal-live',
}

export default function PipelineMonitor() {
  const [stats, setStats] = useState({})
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    if (!supabase) {
      setStats({ discovered: 0, filtered_out: 0, queued: 0, drafted: 0, review: 0, published: 0 })
      setLoading(false)
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: pipeline } = await supabase
      .from('pipeline_runs')
      .select('*')
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false })
      .limit(50)

    const counts = {}
    for (const r of pipeline || []) {
      counts[r.status] = (counts[r.status] || 0) + 1
    }

    setStats(counts)
    setRuns(pipeline || [])
    setLoading(false)
  }

  if (loading) return <div className="text-text-tertiary font-mono text-caption">Loading pipeline...</div>

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        {['discovered', 'filtered_out', 'queued', 'drafted', 'review', 'published'].map((s) => (
          <div key={s} className="border border-subtle p-3 text-center">
            <p className="font-mono text-h2 text-text-primary">{stats[s] || 0}</p>
            <p className="font-mono text-micro uppercase tracking-widest text-text-tertiary">{s.replace('_', ' ')}</p>
          </div>
        ))}
      </div>

      {runs.length > 0 && (
        <div className="space-y-2">
          {runs.slice(0, 20).map((r) => (
            <div key={r.id} className="flex items-center gap-4 py-2 border-b border-subtle">
              <span className={`font-mono text-micro uppercase ${STATUS_COLORS[r.status] || 'text-text-tertiary'}`}>
                {r.status}
              </span>
              <span className="text-caption text-text-primary flex-1 truncate">{r.source_title || r.source_url}</span>
              {r.relevance_score != null && (
                <span className="font-mono text-micro text-text-tertiary">{(r.relevance_score * 100).toFixed(0)}%</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
