import type { OpportunityDetail } from '@/lib/opportunities/get-opportunity-detail-data'

type OpportunityRequirementsProps = {
  opportunity: OpportunityDetail
}

export default function OpportunityRequirements({
  opportunity,
}: OpportunityRequirementsProps) {
  if (!opportunity.requirements || opportunity.requirements.length === 0) {
    return null
  }

  return (
    <section className="content-panel">
      <p className="eyebrow">Requirements</p>

      <h2 className="section-title mt-3">What to review before applying</h2>

      <div className="mt-6 grid gap-3">
        {opportunity.requirements.map((requirement) => (
          <div key={requirement} className="mini-card">
            <p className="leading-7 text-slate-700">{requirement}</p>
          </div>
        ))}
      </div>
    </section>
  )
}