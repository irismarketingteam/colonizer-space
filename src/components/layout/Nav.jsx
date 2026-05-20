import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { SECTIONS, SITE } from '../../lib/constants'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center transition-all duration-300 ${
        scrolled ? 'bg-glass border-b border-subtle' : 'bg-transparent'
      }`}
    >
      <div className="w-full max-w-[90rem] mx-auto px-[clamp(1rem,3vw,3rem)] flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-lg tracking-tight text-text-primary hover:text-text-primary">
          {SITE.name}
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {SECTIONS.map((s) => (
            <NavLink
              key={s.slug}
              to={`/${s.slug}`}
              className={({ isActive }) =>
                `font-mono text-micro uppercase tracking-widest transition-colors ${
                  isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
                }`
              }
            >
              {s.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            to="/newsletter"
            className="px-4 py-1.5 text-caption font-medium border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
          >
            Subscribe
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-text-secondary p-2"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? (
              <path d="M4 4l12 12M16 4L4 16" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-glass border-b border-subtle py-4 px-[clamp(1rem,3vw,3rem)]">
          <div className="flex flex-col gap-3">
            {SECTIONS.map((s) => (
              <NavLink
                key={s.slug}
                to={`/${s.slug}`}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `font-mono text-caption uppercase tracking-widest ${
                    isActive ? 'text-accent' : 'text-text-secondary'
                  }`
                }
              >
                {s.name}
              </NavLink>
            ))}
            <Link
              to="/newsletter"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-4 py-2 text-center text-caption font-medium border border-accent/30 text-accent"
            >
              Subscribe
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
