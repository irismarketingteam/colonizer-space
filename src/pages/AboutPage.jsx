import { Helmet } from 'react-helmet-async'
import { SITE } from '../lib/constants'

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About — {SITE.name}</title>
        <meta name="description" content={SITE.description} />
      </Helmet>

      <div className="py-16 px-[clamp(1rem,3vw,3rem)]">
        <div className="reading-column">
          <h1 className="font-display font-bold text-text-primary mb-8" style={{ fontSize: 'var(--text-h1)' }}>
            About {SITE.name}
          </h1>

          <div className="space-y-6 text-text-secondary leading-relaxed">
            <p>
              {SITE.name} is the publication of record for humans living and working beyond Earth. We cover the built environment of space: habitats, stations, surface structures, transport, and the economy that supports it all.
            </p>

            <p>
              Our editorial focus is the frontier. Not what happened in space last century, but what gets built next. Who lives there. What the economy looks like. We write for commercial space operators, engineers, investors, and enthusiasts who want signal over noise.
            </p>

            <h2 className="font-display text-h2 text-text-primary pt-8">What We Cover</h2>

            <p>
              Lunar and Martian surface development. Commercial space stations. Launch vehicle evolution. In-space manufacturing and infrastructure. The cislunar economy. The companies and people building humanity's off-world future.
            </p>

            <h2 className="font-display text-h2 text-text-primary pt-8">Our Approach</h2>

            <p>
              We state what is known. We analyze what it means. We move on. No excitement-inflation, no speculation-hedging, no press release regurgitation. Technical but accessible. Authoritative but not academic.
            </p>

            <h2 className="font-display text-h2 text-text-primary pt-8">AI Disclosure</h2>

            <p>
              Articles on {SITE.name} are drafted with AI assistance using Anthropic's Claude and reviewed by our editorial team. We believe this approach lets us cover more ground with higher quality than a traditional skeleton crew newsroom.
            </p>

            <h2 className="font-display text-h2 text-text-primary pt-8">Contact</h2>

            <p>
              Reach us at <a href="mailto:hello@colonizer.space" className="text-accent hover:text-accent-hover">hello@colonizer.space</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
