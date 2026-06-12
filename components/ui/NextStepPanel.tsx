'use client'

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
    <section className="next-step-panel rounded-[2rem] p-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="flex items-start gap-4">
          {icon && <div className="next-step-icon">{icon}</div>}

          <div>
            <p className="next-step-eyebrow">{eyebrow}</p>

            <h2 className="next-step-title">{title}</h2>

            <p className="next-step-description">{description}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          {secondaryHref && secondaryLabel && (
            <Link href={secondaryHref} className="next-step-button next-step-button-secondary">
              {secondaryLabel}
            </Link>
          )}

          <Link href={primaryHref} className="next-step-button next-step-button-primary">
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
