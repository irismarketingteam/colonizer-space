import { Helmet } from 'react-helmet-async'
import { useSearch } from '../hooks/useSearch'
import { SITE } from '../lib/constants'
import ArticleRow from '../components/articles/ArticleRow'

export default function SearchPage() {
  const { results, loading, query, search } = useSearch()

  return (
    <>
      <Helmet>
        <title>Search — {SITE.name}</title>
      </Helmet>

      <div className="py-16 px-[clamp(1rem,3vw,3rem)]">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display font-bold text-text-primary mb-8" style={{ fontSize: 'var(--text-h1)' }}>
            Search
          </h1>

          <div className="mb-12">
            <input
              type="text"
              value={query}
              onChange={(e) => search(e.target.value)}
              placeholder="Search articles..."
              className="w-full px-4 py-3 bg-surface border border-subtle text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50 font-body"
              autoFocus
            />
          </div>

          {loading && (
            <div className="font-mono text-caption text-text-tertiary animate-pulse">Searching...</div>
          )}

          {!loading && query && results.length === 0 && (
            <p className="font-mono text-caption text-text-tertiary">No results for "{query}"</p>
          )}

          {results.map((a) => (
            <ArticleRow key={a.id} article={a} />
          ))}
        </div>
      </div>
    </>
  )
}
