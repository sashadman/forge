import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

type NextStepPanelProps = {
  eyebrow?: string
  title: string
  description: string
  primaryHref: string
  primaryLabel: string
  secondaryHref?: string
  secondaryLabel?: string
  icon?: ReactNode
}

export default function NextStepPanel({
  eyebrow = 'Next step',
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  icon,
}: NextStepPanelProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              {icon}
            </div>
          )}

          <div>
            <p className="eyebrow">{eyebrow}</p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
              {title}
            </h2>

            <p className="muted-text mt-3 max-w-3xl">{description}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          {secondaryHref && secondaryLabel && (
            <Link href={secondaryHref} className="btn-outline">
              {secondaryLabel}
            </Link>
          )}

          <Link href={primaryHref} className="btn-primary">
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}