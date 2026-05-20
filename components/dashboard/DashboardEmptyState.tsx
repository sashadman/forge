import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

type DashboardEmptyStateProps = {
  title: string
  description: string
  href: string
  action: string
  variant?: 'dark' | 'orange'
}

export default function DashboardEmptyState({
  title,
  description,
  href,
  action,
  variant = 'dark',
}: DashboardEmptyStateProps) {
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-950">{title}</h3>

            <p className="muted-text mt-2 max-w-2xl">{description}</p>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              This dashboard only shows real saved items here. As you explore the
              platform, save the trades, programs, and opportunities you want to
              compare later.
            </p>
          </div>
        </div>

        <Link
          href={href}
          className={
            variant === 'orange' ? 'btn-primary shrink-0' : 'btn-dark shrink-0'
          }
        >
          {action}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}