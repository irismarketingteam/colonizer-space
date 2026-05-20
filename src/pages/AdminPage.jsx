import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../hooks/useAuth'
import { SITE } from '../lib/constants'
import ReviewQueue from '../components/admin/ReviewQueue'
import PipelineMonitor from '../components/admin/PipelineMonitor'
import PublishControls from '../components/admin/PublishControls'

const TABS = [
  { id: 'review', label: 'Review Queue' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'publish', label: 'Publish' },
]

export default function AdminPage() {
  const { user, loading, signIn, signOut } = useAuth()
  const [tab, setTab] = useState('review')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="font-mono text-caption text-text-tertiary animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Admin — {SITE.name}</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-[60vh]">
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setAuthError('')
              const { error } = await signIn(email, password) || {}
              if (error) setAuthError(error.message)
            }}
            className="w-full max-w-sm space-y-4"
          >
            <h1 className="font-display text-h2 text-text-primary text-center mb-8">Admin</h1>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 bg-surface border border-subtle text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-surface border border-subtle text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
            >
              Sign In
            </button>
            {authError && <p className="text-caption text-signal-critical text-center">{authError}</p>}
          </form>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Admin — {SITE.name}</title>
      </Helmet>

      <div className="py-8 px-[clamp(1rem,3vw,3rem)]">
        <div className="max-w-[90rem] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-h2 text-text-primary">Admin</h1>
            <button
              onClick={signOut}
              className="font-mono text-micro text-text-tertiary hover:text-text-primary transition-colors"
            >
              Sign out
            </button>
          </div>

          <div className="flex gap-1 mb-8 border-b border-subtle">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 font-mono text-caption transition-colors border-b-2 -mb-px ${
                  tab === t.id
                    ? 'text-accent border-accent'
                    : 'text-text-secondary border-transparent hover:text-text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'review' && <ReviewQueue />}
          {tab === 'pipeline' && <PipelineMonitor />}
          {tab === 'publish' && <PublishControls />}
        </div>
      </div>
    </>
  )
}
