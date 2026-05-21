import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

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
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
          {icon}
        </div>
      )}

      <h3 className="mt-5 text-2xl font-bold text-slate-950">{title}</h3>

      <p className="muted-text mt-3 max-w-2xl">{description}</p>

      {(primaryHref || secondaryHref) && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
  )
}