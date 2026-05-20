export default function SectionHeader({ section }) {
  return (
    <div className="py-12 px-[clamp(1rem,3vw,3rem)]">
      <div className="max-w-[90rem] mx-auto">
        <h1 className="font-display font-bold uppercase tracking-tight text-text-primary" style={{ fontSize: 'var(--text-hero)' }}>
          {section.name}
        </h1>
        <p className="mt-3 text-lg text-text-secondary max-w-2xl">
          {section.description}
        </p>
      </div>
    </div>
  )
}
