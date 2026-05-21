import type { ReactNode } from 'react'

type PageHeroProps = {
  eyebrow: string
  title: string
  description: string
  backHref?: string
  backLabel?: string
  actions?: ReactNode
}

export default function PageHero({
  eyebrow,
  title,
  description,
  actions,
}: PageHeroProps) {
  return (
    <section className="hero-dark">
      <div className="hero-fade" />

      <div className="section-shell relative py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">{eyebrow}</p>

            <h1 className="page-title-dark mt-6">{title}</h1>

            <p className="lead-text-dark mt-6 max-w-3xl">{description}</p>
          </div>

          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      </div>
    </section>
  )
}