import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SITE } from '../lib/constants'

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 — {SITE.name}</title>
      </Helmet>

      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="font-mono text-micro uppercase tracking-widest text-text-tertiary mb-4">404</p>
          <h1 className="font-display font-bold text-h1 text-text-primary mb-4">Signal Lost</h1>
          <p className="text-text-secondary mb-8">This page doesn't exist or has been moved.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 border border-accent/30 text-accent hover:bg-accent/10 transition-colors font-medium"
          >
            Return to base
          </Link>
        </div>
      </div>
    </>
  )
}
