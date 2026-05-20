import { Link } from 'react-router-dom'
import { SECTIONS, SITE } from '../../lib/constants'
import NewsletterCTA from '../newsletter/NewsletterCTA'

export default function Footer() {
  return (
    <footer className="border-t border-subtle mt-20">
      <div className="max-w-[90rem] mx-auto px-[clamp(1rem,3vw,3rem)] py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="font-mono text-micro uppercase tracking-widest text-text-secondary mb-4">Sections</h4>
            <div className="grid grid-cols-2 gap-2">
              {SECTIONS.map((s) => (
                <Link
                  key={s.slug}
                  to={`/${s.slug}`}
                  className="text-caption text-text-secondary hover:text-text-primary transition-colors"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-micro uppercase tracking-widest text-text-secondary mb-4">About</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-caption text-text-secondary hover:text-text-primary transition-colors">
                About Colonizer
              </Link>
              <Link to="/newsletter" className="text-caption text-text-secondary hover:text-text-primary transition-colors">
                Newsletter
              </Link>
              <a href="/feed.xml" className="text-caption text-text-secondary hover:text-text-primary transition-colors">
                RSS Feed
              </a>
              <Link to="/terms" className="text-caption text-text-secondary hover:text-text-primary transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-caption text-text-secondary hover:text-text-primary transition-colors">
                Privacy
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-micro uppercase tracking-widest text-text-secondary mb-4">Newsletter</h4>
            <p className="text-caption text-text-secondary mb-4">{SITE.tagline}</p>
            <NewsletterCTA compact />
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-micro text-text-tertiary">
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="text-micro text-text-tertiary">
            Articles on this site are drafted with AI assistance and reviewed by our editorial team.
          </p>
        </div>
      </div>
    </footer>
  )
}
