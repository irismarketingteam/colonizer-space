import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../hooks/useAuth'
import { SITE } from '../lib/constants'
import Dashboard from '../components/admin/Dashboard'
import ReviewQueue from '../components/admin/ReviewQueue'
import ArticleList from '../components/admin/ArticleList'
import ArticleEditor from '../components/admin/ArticleEditor'
import PipelineMonitor from '../components/admin/PipelineMonitor'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'review', label: 'Review' },
  { id: 'articles', label: 'Articles' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'editor', label: '+ New' },
]

export default function AdminPage() {
  const { user, loading, signIn, signOut } = useAuth()
  const [tab, setTab] = useState('dashboard')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [articleFilter, setArticleFilter] = useState(null)

  function navigate(tabId, filter) {
    if (tabId === 'editor') {
      setEditingId(null)
    }
    if (filter) setArticleFilter(filter)
    else setArticleFilter(null)
    setTab(tabId)
  }

  function handleEdit(id) {
    setEditingId(id)
    setTab('editor')
  }

  function handleSave() {
    setEditingId(null)
    setTab('articles')
  }

  function handleCancelEdit() {
    setEditingId(null)
    setTab(editingId ? 'articles' : 'dashboard')
  }

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
        <Helmet><title>Admin — {SITE.name}</title></Helmet>
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
              className="admin-input w-full"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="admin-input w-full"
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

  const activeTab = tab

  return (
    <>
      <Helmet><title>Admin — {SITE.name}</title></Helmet>

      <div className="py-8 px-[clamp(1rem,3vw,3rem)]">
        <div className="max-w-[90rem] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display text-h2 text-text-primary">Admin</h1>
            <div className="flex items-center gap-4">
              <span className="font-mono text-micro text-text-tertiary hidden sm:block">{user.email}</span>
              <button
                onClick={signOut}
                className="font-mono text-micro text-text-tertiary hover:text-text-primary transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mb-8 border-b border-subtle overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(t.id)}
                className={`px-4 py-2 font-mono text-caption whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === t.id
                    ? 'text-accent border-accent'
                    : 'text-text-secondary border-transparent hover:text-text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {activeTab === 'review' && <ReviewQueue onEdit={handleEdit} />}
          {activeTab === 'articles' && <ArticleList initialFilter={articleFilter} onEdit={handleEdit} />}
          {activeTab === 'pipeline' && <PipelineMonitor />}
          {activeTab === 'editor' && (
            <ArticleEditor
              articleId={editingId}
              onSave={handleSave}
              onCancel={handleCancelEdit}
            />
          )}
        </div>
      </div>
    </>
  )
}
