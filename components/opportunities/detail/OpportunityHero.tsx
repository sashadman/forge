import BackLink from '@/components/ui/BackLink'
import type {
  OpportunityDetail,
  OpportunityDetailEmployer,
} from '@/lib/opportunities/get-opportunity-detail-data'
import { formatOpportunityType } from '@/lib/opportunities/get-opportunity-detail-data'

type OpportunityHeroProps = {
  opportunity: OpportunityDetail
  employer: OpportunityDetailEmployer | null
}

export default function OpportunityHero({
  opportunity,
  employer,
}: OpportunityHeroProps) {
  return (
    <section className="hero-dark">
      <div className="hero-fade" />

      <div className="section-shell relative py-20">
        <BackLink
          href="/opportunities"
          label="Back to jobs & apprenticeships"
          variant="light"
        />

        <div className="mt-10 max-w-4xl">
          <p className="eyebrow-dark">
            {formatOpportunityType(opportunity.opportunity_type)}
          </p>

          <h1 className="page-title-dark mt-6">{opportunity.title}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p className="text-xl font-semibold text-orange-300">
              {employer?.name || 'Employer listing'}
            </p>

            {employer && (
              <span
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                  employer.is_verified
                    ? 'bg-green-400/15 text-green-200 ring-1 ring-green-300/30'
                    : 'bg-white/10 text-slate-200 ring-1 ring-white/15'
                }`}
              >
                {employer.is_verified
                  ? 'Verified employer'
                  : 'Employer not yet verified'}
              </span>
            )}
          </div>

          <p className="lead-text-dark mt-6 max-w-3xl">
            {opportunity.description}
          </p>

          <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-400">
            Review the employer, requirements, and application details before
            submitting. Directory details can change, so confirm external
            application instructions when provided.
          </p>
        </div>
      </div>
    </section>
  )
}