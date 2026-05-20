import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      setQuery('')
      setResults([])
    }
  }, [open])

  useEffect(() => {
    if (!query.trim() || !supabase) {
      setResults([])
      return
    }

    const timeout = setTimeout(async () => {
      setLoading(true)
      const { data } = await supabase
        .from('articles')
        .select('id, title, slug, section, excerpt, published_at')
        .textSearch('title', query, { type: 'websearch' })
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(10)

      setResults(data || [])
      setLoading(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  function handleSelect(article) {
    navigate(`/${article.section}/${article.slug}`)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-void/80" />
      <div
        className="relative w-full max-w-xl bg-surface border border-subtle"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-subtle px-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary shrink-0">
            <circle cx="6.5" cy="6.5" r="5" />
            <path d="M10.5 10.5L15 15" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="flex-1 px-3 py-4 bg-transparent text-text-primary placeholder:text-text-tertiary focus:outline-none"
          />
          <kbd className="text-micro text-text-tertiary border border-subtle px-1.5 py-0.5">ESC</kbd>
        </div>

        {loading && (
          <div className="px-4 py-8 text-center text-caption text-text-tertiary">Searching...</div>
        )}

        {!loading && results.length > 0 && (
          <div className="max-h-[40vh] overflow-y-auto">
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelect(r)}
                className="w-full text-left px-4 py-3 hover:bg-elevated transition-colors border-b border-subtle last:border-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="section-tag">{r.section}</span>
                </div>
                <p className="text-text-primary text-caption font-medium">{r.title}</p>
                {r.excerpt && (
                  <p className="text-micro text-text-tertiary mt-1 line-clamp-1">{r.excerpt}</p>
                )}
              </button>
            ))}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="px-4 py-8 text-center text-caption text-text-tertiary">
            No results for "{query}"
          </div>
        )}
      </div>
    </div>
  )
}
