import { Helmet } from 'react-helmet-async'
import { SITE } from '../lib/constants'
import NewsletterCTA from '../components/newsletter/NewsletterCTA'

export default function NewsletterPage() {
  return (
    <>
      <Helmet>
        <title>Newsletter — {SITE.name}</title>
        <meta name="description" content="Subscribe to Colonizer for weekly briefings on humans living and working in space." />
      </Helmet>

      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-xl px-[clamp(1rem,3vw,3rem)] py-16 text-center">
          <h1 className="font-display font-bold text-text-primary mb-4" style={{ fontSize: 'var(--text-h1)' }}>
            {SITE.tagline}
          </h1>
          <p className="text-lg text-text-secondary mb-12">
            A weekly briefing on the built environment of space. What got launched, what got funded, what got built. No fluff.
          </p>
          <NewsletterCTA />
        </div>
      </div>
    </>
  )
}
