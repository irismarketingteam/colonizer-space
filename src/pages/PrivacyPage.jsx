import { Helmet } from 'react-helmet-async'
import { SITE } from '../lib/constants'

export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — {SITE.name}</title>
      </Helmet>
      <div className="py-16 px-[clamp(1rem,3vw,3rem)]">
        <div className="reading-column">
          <h1 className="font-display font-bold text-text-primary mb-8" style={{ fontSize: 'var(--text-h1)' }}>
            Privacy Policy
          </h1>
          <div className="space-y-6 text-text-secondary leading-relaxed">
            <p>Last updated: May 2026</p>
            <h2 className="font-display text-h2 text-text-primary pt-4">What We Collect</h2>
            <p>If you subscribe to our newsletter, we store your email address. That is the only personal data we collect directly.</p>
            <h2 className="font-display text-h2 text-text-primary pt-4">Analytics</h2>
            <p>We use privacy-first analytics that do not use cookies and do not track individual users. We collect aggregate page view and referrer data only.</p>
            <h2 className="font-display text-h2 text-text-primary pt-4">Cookies</h2>
            <p>{SITE.name} does not set tracking cookies. Authentication cookies are set only for admin access.</p>
            <h2 className="font-display text-h2 text-text-primary pt-4">Third Parties</h2>
            <p>We use Supabase for data storage and Google Fonts for typography. These services may collect standard server logs. We do not sell or share your data with any third parties.</p>
            <h2 className="font-display text-h2 text-text-primary pt-4">Data Retention</h2>
            <p>Newsletter subscriber email addresses are retained until you unsubscribe. Upon unsubscription, your email is marked inactive but retained for bounce prevention. You may request full deletion by emailing us.</p>
            <h2 className="font-display text-h2 text-text-primary pt-4">Contact</h2>
            <p>For privacy inquiries, reach us at <a href="mailto:hello@colonizer.space" className="text-accent hover:text-accent-hover">hello@colonizer.space</a>.</p>
          </div>
        </div>
      </div>
    </>
  )
}
