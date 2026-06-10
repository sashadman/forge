
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
}

export default function EmptyState({
  icon,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: EmptyStateProps) {
  return (
    <div className="empty-state-panel">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200">
            {icon || <ShieldCheck className="h-7 w-7" />}
          </div>

          <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
            {title}
          </h3>

          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-600">
            {description}
          </p>

          <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
            Forge keeps these sections honest: records appear only when they are
            real, active, reviewed, or saved through the correct workflow.
          </p>
        </div>

        {(primaryHref || secondaryHref) && (
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
            {primaryHref && primaryLabel && (
              <Link href={primaryHref} className="btn-dark">
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}

            {secondaryHref && secondaryLabel && (
              <Link href={secondaryHref} className="btn-outline">
                {secondaryLabel}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}