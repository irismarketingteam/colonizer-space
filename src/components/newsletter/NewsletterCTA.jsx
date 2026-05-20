import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { SITE } from '../../lib/constants'

export default function NewsletterCTA({ compact = false }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

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

    setEmail('')
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="flex-1 px-3 py-2 bg-elevated border border-subtle text-caption text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="px-4 py-2 bg-accent text-white text-caption font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {status === 'submitting' ? '...' : 'Go'}
        </button>
        {status === 'success' && <p className="text-micro text-signal-live mt-1">Subscribed.</p>}
        {status === 'duplicate' && <p className="text-micro text-signal-alert mt-1">Already subscribed.</p>}
      </form>
    )
  }

  return (
    <section className="border-t border-b border-subtle py-16">
      <div className="max-w-xl mx-auto text-center px-[clamp(1rem,3vw,3rem)]">
        <h3 className="font-display text-h2 text-text-primary mb-2">{SITE.tagline}</h3>
        <p className="text-text-secondary mb-8">
          Weekly briefings on the built environment of space. No fluff, no filler.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-3 bg-surface border border-subtle text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50"
          />
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="px-6 py-3 bg-accent text-white font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {status === 'success' && (
          <p className="text-caption text-signal-live mt-4">You're in. First dispatch incoming.</p>
        )}
        {status === 'duplicate' && (
          <p className="text-caption text-signal-alert mt-4">You're already subscribed.</p>
        )}
        {status === 'error' && (
          <p className="text-caption text-signal-critical mt-4">Something went wrong. Try again.</p>
        )}
      </div>
    </section>
  )
}
