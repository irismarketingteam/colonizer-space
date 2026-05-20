import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    if (!supabase) { setLoading(false); return }

    const [allArticles, pipelineToday] = await Promise.all([
      supabase.from('articles').select('id, status, section, created_at'),
      supabase.from('pipeline_runs').select('id, status')
        .gte('created_at', new Date(new Date().setHours(0,0,0,0)).toISOString()),
    ])

    const articles = allArticles.data || []
    const pipeline = pipelineToday.data || []

    const byStatus = {}
    const bySection = {}
    for (const a of articles) {
      byStatus[a.status] = (byStatus[a.status] || 0) + 1
      bySection[a.section] = (bySection[a.section] || 0) + 1
    }

    const pipelineStats = {}
    for (const p of pipeline) {
      pipelineStats[p.status] = (pipelineStats[p.status] || 0) + 1
    }

    setStats({ total: articles.length, byStatus, bySection, pipeline: pipelineStats, pipelineTotal: pipeline.length })
    setRecent(articles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5))
    setLoading(false)
  }

  if (loading) return <Skeleton />

  if (!stats) return <div className="text-text-tertiary font-mono text-caption">Connect Supabase to view dashboard.</div>

  return (
    <div className="space-y-8">
      {/* Status cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Published" value={stats.byStatus.published || 0} color="text-signal-live" onClick={() => onNavigate('articles', 'published')} />
        <StatCard label="In Review" value={stats.byStatus.review || 0} color="text-signal-alert" onClick={() => onNavigate('review')} />
        <StatCard label="Drafts" value={stats.byStatus.draft || 0} color="text-accent" onClick={() => onNavigate('articles', 'draft')} />
        <StatCard label="Pipeline Today" value={stats.pipelineTotal} color="text-text-secondary" onClick={() => onNavigate('pipeline')} />
      </div>

      {/* Section breakdown */}
      {Object.keys(stats.bySection).length > 0 && (
        <div>
          <h3 className="font-mono text-micro uppercase tracking-widest text-text-secondary mb-4">Articles by Section</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(stats.bySection).sort((a, b) => b[1] - a[1]).map(([section, count]) => (
              <div key={section} className="flex items-center justify-between border border-subtle px-4 py-3">
                <span className="section-tag">{section}</span>
                <span className="font-mono text-caption text-text-primary">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline today */}
      {stats.pipelineTotal > 0 && (
        <div>
          <h3 className="font-mono text-micro uppercase tracking-widest text-text-secondary mb-4">Pipeline Today</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {['discovered', 'filtered_out', 'queued', 'drafting', 'review', 'published'].map((s) => (
              <div key={s} className="border border-subtle p-3 text-center">
                <p className="font-mono text-h3 text-text-primary">{stats.pipeline[s] || 0}</p>
                <p className="font-mono text-micro text-text-tertiary">{s.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h3 className="font-mono text-micro uppercase tracking-widest text-text-secondary mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => onNavigate('review')} className="px-4 py-2 border border-subtle text-caption text-text-secondary hover:text-text-primary hover:border-accent/50 transition-colors">
            Review Queue ({stats.byStatus.review || 0})
          </button>
          <button onClick={() => onNavigate('editor')} className="px-4 py-2 border border-subtle text-caption text-text-secondary hover:text-text-primary hover:border-accent/50 transition-colors">
            + New Article
          </button>
          <button onClick={() => onNavigate('articles')} className="px-4 py-2 border border-subtle text-caption text-text-secondary hover:text-text-primary hover:border-accent/50 transition-colors">
            All Articles
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color = 'text-text-primary', onClick }) {
  return (
    <button
      onClick={onClick}
      className="border border-subtle p-4 text-left hover:border-accent/30 transition-colors"
    >
      <p className={`font-mono text-h1 ${color}`}>{value}</p>
      <p className="font-mono text-micro uppercase tracking-widest text-text-tertiary mt-1">{label}</p>
    </button>
  )
}

function Skeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border border-subtle p-4 animate-pulse">
          <div className="h-8 bg-elevated rounded w-12 mb-2" />
          <div className="h-3 bg-elevated rounded w-20" />
        </div>
      ))}
    </div>
  )
}
