import type { ReactNode } from 'react'
import {
  BriefcaseBusiness,
  ExternalLink,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import SaveOpportunityButton from '@/components/opportunities/SaveOpportunityButton'
import type {
  OpportunityDetail,
  OpportunityDetailEmployer,
} from '@/lib/opportunities/get-opportunity-detail-data'
import { formatOpportunityType } from '@/lib/opportunities/get-opportunity-detail-data'
import {
  getOpportunityTrustDescription,
  getOpportunityTrustLabel,
  isExternalOpportunity,
} from '@/lib/opportunities/opportunity-trust'

type OpportunityDetailsCardProps = {
  opportunity: OpportunityDetail
  employer: OpportunityDetailEmployer | null
}

export default function OpportunityDetailsCard({
  opportunity,
  employer,
}: OpportunityDetailsCardProps) {
  const externalOpportunity = isExternalOpportunity(opportunity)
  const trustLabel = getOpportunityTrustLabel({
    verification_status: opportunity.verification_status,
    employerIsVerified: employer?.is_verified,
  })
  const trustDescription = getOpportunityTrustDescription({
    verification_status: opportunity.verification_status,
    employerIsVerified: employer?.is_verified,
  })
  const applyUrl = opportunity.application_url || opportunity.external_url

  return (
    <div className="content-panel">
      <p className="eyebrow">Listing details</p>

      <div className="mt-6 space-y-4">
        <DetailItem
          icon={<MapPin className="h-5 w-5" />}
          label="Location"
          value={`${opportunity.location}, ${opportunity.state}`}
        />

        <DetailItem
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          label="Opportunity type"
          value={formatOpportunityType(opportunity.opportunity_type)}
        />

        <DetailItem
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          label="Trade focus"
          value={opportunity.trade_slug}
        />

        <DetailItem
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          label="Schedule"
          value={opportunity.schedule || 'See listing'}
        />

        <DetailItem
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          label="Pay range"
          value={opportunity.pay_range || 'See listing'}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          {externalOpportunity ? (
            <ExternalLink className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
          ) : (
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
          )}

          <div>
            <p className="font-semibold text-slate-950">{trustLabel}</p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {trustDescription}
            </p>

            {externalOpportunity && (
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
                Source:{' '}
                {opportunity.source_name ||
                  employer?.name ||
                  'Trusted external hiring source'}
              </p>
            )}
          </div>
        </div>
      </div>

      {employer && !externalOpportunity && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />

            <div>
              <p className="font-semibold text-slate-950">
                {employer.is_verified
                  ? 'Verified employer'
                  : 'Employer not yet verified'}
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {employer.is_verified
                  ? 'This employer profile has been reviewed by an admin. Still confirm pay, schedule, requirements, and application details before applying.'
                  : 'This employer profile has not been verified yet. Review the employer website, application page, and listing details carefully before applying.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <SaveOpportunityButton opportunityId={opportunity.id} />
      </div>

      <p className="mt-5 text-xs leading-6 text-slate-500">
        {externalOpportunity
          ? 'This external opportunity is listed for discovery. Confirm pay, schedule, requirements, and application details on the original application page.'
          : 'This is a public Ara Skills opportunity listing. Always confirm pay, schedule, requirements, and application details directly with the employer.'}
      </p>

      {externalOpportunity && applyUrl && (
        <a
          href={applyUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-outline mt-4 w-full"
        >
          Apply on Employer Site
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="mini-card">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      </div>

      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  )
}
