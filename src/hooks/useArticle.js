import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SEED_ARTICLES } from '../lib/seed'

export function useArticle(section, slug) {
  const [article, setArticle] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      if (!supabase) {
        const found = SEED_ARTICLES.find((a) => a.section === section && a.slug === slug)
        setArticle(found || null)
        setRelated(SEED_ARTICLES.filter((a) => a.section === section && a.slug !== slug).slice(0, 3))
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('section', section)
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (data) {
        setArticle(data)
        const { data: rel } = await supabase
          .from('articles')
          .select('*')
          .eq('section', section)
          .eq('status', 'published')
          .neq('id', data.id)
          .order('published_at', { ascending: false })
          .limit(3)

        setRelated(rel?.length ? rel : SEED_ARTICLES.filter((a) => a.section === section && a.slug !== slug).slice(0, 3))
      } else {
        const found = SEED_ARTICLES.find((a) => a.section === section && a.slug === slug)
        setArticle(found || null)
        setRelated(SEED_ARTICLES.filter((a) => a.section === section && a.slug !== slug).slice(0, 3))
      }
      setLoading(false)
    }
    fetch()
  }, [section, slug])

  return { article, related, loading }
}
