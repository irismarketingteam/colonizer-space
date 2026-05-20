import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { SEED_ARTICLES } from '../lib/seed'

export function useSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  async function search(q) {
    setQuery(q)
    if (!q.trim()) {
      setResults([])
      return
    }

    setLoading(true)

    if (!supabase) {
      const lower = q.toLowerCase()
      const filtered = SEED_ARTICLES.filter(
        (a) => a.title.toLowerCase().includes(lower) || a.body_md?.toLowerCase().includes(lower)
      )
      setResults(filtered)
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .textSearch('title', q, { type: 'websearch' })
      .order('published_at', { ascending: false })
      .limit(20)

    setResults(data || [])
    setLoading(false)
  }

  return { results, loading, query, search }
}
