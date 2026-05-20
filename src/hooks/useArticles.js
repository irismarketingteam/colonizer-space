import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SEED_ARTICLES } from '../lib/seed'

export function useArticles(section = null, limit = 20) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      if (!supabase) {
        let data = SEED_ARTICLES
        if (section) data = data.filter((a) => a.section === section)
        setArticles(data.slice(0, limit))
        setLoading(false)
        return
      }

      let query = supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })
        .limit(limit)

      if (section) query = query.eq('section', section)

      const { data } = await query
      setArticles(data || [])
      setLoading(false)
    }
    fetch()
  }, [section, limit])

  return { articles, loading }
}

export function useLatestBySection(limit = 4) {
  const [sections, setSections] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      if (!supabase) {
        const grouped = {}
        for (const a of SEED_ARTICLES) {
          if (!grouped[a.section]) grouped[a.section] = []
          if (grouped[a.section].length < limit) grouped[a.section].push(a)
        }
        setSections(grouped)
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })
        .limit(100)

      const grouped = {}
      for (const a of data || []) {
        if (!grouped[a.section]) grouped[a.section] = []
        if (grouped[a.section].length < limit) grouped[a.section].push(a)
      }
      setSections(grouped)
      setLoading(false)
    }
    fetch()
  }, [limit])

  return { sections, loading }
}
