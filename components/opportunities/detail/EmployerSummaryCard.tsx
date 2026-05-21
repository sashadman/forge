import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { OpportunityDetailEmployer } from '@/lib/opportunities/get-opportunity-detail-data'

type EmployerSummaryCardProps = {
  employer: OpportunityDetailEmployer | null
}

export default function EmployerSummaryCard({
  employer,
}: EmployerSummaryCardProps) {
  if (!employer) return null

  return (
    <section className="content-panel">
      <p className="eyebrow">Employer</p>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="section-title mt-3">{employer.name}</h2>

          <p className="mt-2 font-semibold text-slate-600">
            {employer.industry || 'Employer profile'}
          </p>
        </div>

        <Link
          href={`/employers/${employer.slug}`}
          className="btn-outline px-5 py-2 text-sm"
        >
          View employer profile
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {employer.description && (
        <p className="lead-text mt-5">{employer.description}</p>
      )}
    </section>
  )
}
