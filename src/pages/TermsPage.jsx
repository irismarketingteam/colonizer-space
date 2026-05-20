import { Helmet } from 'react-helmet-async'
import { SITE } from '../lib/constants'

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Use — {SITE.name}</title>
      </Helmet>
      <div className="py-16 px-[clamp(1rem,3vw,3rem)]">
        <div className="reading-column">
          <h1 className="font-display font-bold text-text-primary mb-8" style={{ fontSize: 'var(--text-h1)' }}>
            Terms of Use
          </h1>
          <div className="space-y-6 text-text-secondary leading-relaxed">
            <p>Last updated: May 2026</p>
            <h2 className="font-display text-h2 text-text-primary pt-4">Acceptance of Terms</h2>
            <p>By accessing colonizer.space, you agree to these terms. If you do not agree, do not use the site.</p>
            <h2 className="font-display text-h2 text-text-primary pt-4">Use of Content</h2>
            <p>All content on {SITE.name} is protected by copyright. You may share links and brief excerpts with attribution. You may not reproduce full articles without written permission.</p>
            <h2 className="font-display text-h2 text-text-primary pt-4">AI-Generated Content</h2>
            <p>Articles on this site are drafted with AI assistance and reviewed by our editorial team. While we strive for accuracy, we do not guarantee that all information is error-free. Verify critical facts through primary sources.</p>
            <h2 className="font-display text-h2 text-text-primary pt-4">Newsletter</h2>
            <p>By subscribing to our newsletter, you consent to receive periodic emails. You may unsubscribe at any time using the link provided in each email.</p>
            <h2 className="font-display text-h2 text-text-primary pt-4">Limitation of Liability</h2>
            <p>{SITE.name} is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of this site.</p>
            <h2 className="font-display text-h2 text-text-primary pt-4">Changes</h2>
            <p>We may update these terms at any time. Continued use of the site constitutes acceptance of updated terms.</p>
          </div>
        </div>
      </div>
    </>
  )
}
