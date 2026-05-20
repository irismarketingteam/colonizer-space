import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatTimeAgo } from '../../lib/format'

const STATUS_COLORS = {
  discovered: 'text-text-tertiary',
  filtered_out: 'text-text-tertiary opacity-60',
  queued: 'text-signal-alert',
  drafting: 'text-signal-alert',
  drafted: 'text-accent',
  review: 'text-accent',
  published: 'text-signal-live',
}

export default function PipelineMonitor() {
  const [runs, setRuns] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('today')

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [timeframe])

  async function fetchData() {
    if (!supabase) { setLoading(false); return }

    const cutoff = new Date()
    if (timeframe === 'today') cutoff.setHours(0, 0, 0, 0)
    else if (timeframe === 'week') cutoff.setDate(cutoff.getDate() - 7)
    else cutoff.setDate(cutoff.getDate() - 30)

    const { data } = await supabase
      .from('pipeline_runs')
      .select('*')
      .gte('created_at', cutoff.toISOString())
      .order('created_at', { ascending: false })
      .limit(200)

    const counts = {}
    for (const r of data || []) {
      counts[r.status] = (counts[r.status] || 0) + 1
    }

    setStats(counts)
    setRuns(data || [])
    setLoading(false)
  }

  if (loading) return <div className="text-text-tertiary font-mono text-caption animate-pulse">Loading pipeline data...</div>

  const total = runs.length
  const passRate = total > 0
    ? ((total - (stats.filtered_out || 0)) / total * 100).toFixed(0)
    : 0

  return (
    <div className="space-y-6">
      {/* Timeframe selector */}
      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: '7 Days' },
            { id: 'month', label: '30 Days' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id)}
              className={`px-3 py-1.5 font-mono text-micro transition-colors ${
                timeframe === t.id
                  ? 'bg-accent/20 text-accent'
                  : 'text-text-tertiary hover:text-text-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="font-mono text-micro text-text-tertiary">Auto-refreshes every 30s</span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="border border-subtle p-3 text-center">
          <p className="font-mono text-h2 text-text-primary">{total}</p>
          <p className="font-mono text-micro text-text-tertiary">total</p>
        </div>
        {['discovered', 'filtered_out', 'queued', 'drafting', 'review', 'published'].map((s) => (
          <div key={s} className="border border-subtle p-3 text-center">
            <p className={`font-mono text-h2 ${STATUS_COLORS[s]}`}>{stats[s] || 0}</p>
            <p className="font-mono text-micro text-text-tertiary">{s.replace('_', ' ')}</p>
          </div>
        ))}
      </div>

      {/* Pass rate */}
      {total > 0 && (
        <div className="flex items-center gap-4">
          <span className="font-mono text-micro text-text-tertiary">Filter pass rate:</span>
          <div className="flex-1 h-2 bg-elevated rounded-full overflow-hidden max-w-xs">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${passRate}%` }}
            />
          </div>
          <span className="font-mono text-micro text-text-secondary">{passRate}%</span>
        </div>
      )}

      {/* Run log */}
      {runs.length > 0 ? (
        <div className="border border-subtle divide-y divide-subtle">
          {runs.map((r) => (
            <div key={r.id} className="flex items-center gap-4 px-4 py-2.5">
              <span className={`font-mono text-micro uppercase w-24 shrink-0 ${STATUS_COLORS[r.status] || 'text-text-tertiary'}`}>
                {r.status.replace('_', ' ')}
              </span>
              <span className="text-caption text-text-primary flex-1 truncate min-w-0">
                {r.source_title || r.source_url}
              </span>
              {r.source_domain && (
                <span className="font-mono text-micro text-text-tertiary hidden sm:block shrink-0">{r.source_domain}</span>
              )}
              {r.relevance_score != null && (
                <span className={`font-mono text-micro shrink-0 ${
                  r.relevance_score >= 0.6 ? 'text-signal-live' : 'text-text-tertiary'
                }`}>
                  {(r.relevance_score * 100).toFixed(0)}%
                </span>
              )}
              <span className="font-mono text-micro text-text-tertiary shrink-0">
                {formatTimeAgo(r.created_at)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-subtle border-dashed p-8 text-center">
          <p className="font-mono text-caption text-text-tertiary">No pipeline activity for this timeframe.</p>
        </div>
      )}
    </div>
  )
}
