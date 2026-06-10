
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
    <div className="empty-state-panel mt-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-950">
              {title}
            </h3>

            <p className="mt-2 max-w-2xl text-base font-semibold leading-7 text-slate-600">
              {description}
            </p>

            <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
              This dashboard only shows real saved or submitted items. As you
              explore Ara Skills, save the career paths, training programs, jobs, and
              apprenticeships you want to compare or act on later.
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
