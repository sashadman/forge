import { CheckCircle2 } from 'lucide-react'
import type { OpportunityDetail } from '@/lib/opportunities/get-opportunity-detail-data'

type OpportunityOverviewProps = {
  opportunity: OpportunityDetail
}

export default function OpportunityOverview({
  opportunity,
}: OpportunityOverviewProps) {
  return (
    <section className="content-panel">
      <p className="eyebrow">Opportunity overview</p>

      <h2 className="section-title mt-3">What this opportunity offers</h2>

      <p className="lead-text mt-5">{opportunity.description}</p>

      {opportunity.benefits && opportunity.benefits.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-950">Benefits</h3>

          <div className="mt-5 grid gap-3">
            {opportunity.benefits.map((benefit) => (
              <div key={benefit} className="mini-card flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                <p className="leading-7 text-slate-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}