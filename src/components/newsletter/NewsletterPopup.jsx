import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { SITE } from '../../lib/constants'

const STORAGE_KEY = 'colonizer_popup_dismissed'
const DELAY_MS = 15000

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return

    const timer = setTimeout(() => setVisible(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, Date.now().toString())
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return

    setStatus('submitting')

    if (supabase) {
      const { error } = await supabase.from('subscribers').insert({ email })
      if (error && error.code === '23505') {
        setStatus('duplicate')
      } else if (error) {
        setStatus('error')
      } else {
        setStatus('success')
      }
    } else {
      setStatus('success')
    }

    if (status !== 'error') {
      setTimeout(dismiss, 2500)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-void/60" onClick={dismiss} />
      <div className="relative w-full max-w-md bg-surface border border-subtle p-8">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-text-tertiary hover:text-text-primary transition-colors p-1"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>

        <h3 className="font-display text-h2 text-text-primary mb-2">{SITE.tagline}</h3>
        <p className="text-caption text-text-secondary mb-6">
          Weekly briefings on the built environment of space. No fluff.
        </p>

        {status === 'success' ? (
          <p className="text-caption text-signal-live">You're in. First dispatch incoming.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 bg-elevated border border-subtle text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="px-5 py-3 bg-accent text-white font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 shrink-0"
            >
              {status === 'submitting' ? '...' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'duplicate' && (
          <p className="text-caption text-signal-alert mt-3">Already subscribed.</p>
        )}
        {status === 'error' && (
          <p className="text-caption text-signal-critical mt-3">Something went wrong. Try again.</p>
        )}
      </div>
    </div>
  )
}
