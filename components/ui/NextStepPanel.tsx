'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTheme } from '@/components/theme/ThemeProvider'

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
  const { isLight } = useTheme()

  const panelClass = isLight
    ? 'rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm'
    : 'rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20'

  const iconClass = isLight
    ? 'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700'
    : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/20'

  const eyebrowClass = isLight
    ? 'text-xs font-bold uppercase tracking-wide text-orange-700'
    : 'text-xs font-bold uppercase tracking-wide text-orange-300'

  const titleClass = isLight
    ? 'mt-3 text-2xl font-bold tracking-tight text-slate-950'
    : 'mt-3 text-2xl font-bold tracking-tight text-white'

  const descriptionClass = isLight
    ? 'mt-3 max-w-3xl text-slate-600'
    : 'mt-3 max-w-3xl text-slate-300'

  const secondaryClass = isLight
    ? 'inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700'
    : 'inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-300/40 hover:bg-white/15'

  const primaryClass = isLight
    ? 'inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700'
    : 'inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-orange-100'

  return (
    <section className={panelClass}>
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="flex items-start gap-4">
          {icon && <div className={iconClass}>{icon}</div>}

          <div>
            <p className={eyebrowClass}>{eyebrow}</p>

            <h2 className={titleClass}>{title}</h2>

            <p className={descriptionClass}>{description}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          {secondaryHref && secondaryLabel && (
            <Link href={secondaryHref} className={secondaryClass}>
              {secondaryLabel}
            </Link>
          )}

          <Link href={primaryHref} className={primaryClass}>
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}