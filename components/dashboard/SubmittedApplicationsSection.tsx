import Link from 'next/link'
import { ArrowRight, BriefcaseBusiness, CheckCircle2 } from 'lucide-react'
import type { ApplicationStatus } from '@/lib/supabase/app-types'
import DashboardEmptyState from '@/components/dashboard/DashboardEmptyState'
import DashboardSectionHeader from '@/components/dashboard/DashboardSectionHeader'

export type SubmittedApplicationItem = {
  id: string
  status: ApplicationStatus
  submittedAt: string
  readinessScoreAtApply: number
  opportunityTitle: string
  opportunitySlug: string
  employerName: string
}

type SubmittedApplicationsSectionProps = {
  applications: SubmittedApplicationItem[]
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: 'Submitted',
  reviewed: 'Reviewed',
  contacted: 'Contacted',
  interviewing: 'Interviewing',
  offered: 'Offered',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export default function SubmittedApplicationsSection({
  applications,
}: SubmittedApplicationsSectionProps) {
  return (
    <section className="content-panel">
      <DashboardSectionHeader
        eyebrow="Applications"
        title="Submitted applications"
        description="Track official applications you submitted through the platform."
        href="/opportunities"
        action="Find opportunities"
      />

      {applications.length > 0 ? (
        <div className="mt-8 grid gap-5">
          {applications.map((application) => (
            <div key={application.id} className="card bg-slate-50">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge-orange">
                      {STATUS_LABELS[application.status]}
                    </span>

                    <span className="badge-slate">
                      {application.readinessScoreAtApply}% readiness
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-slate-950">
                    {application.opportunityTitle}
                  </h3>

                  <p className="mt-2 font-semibold text-slate-600">
                    {application.employerName}
                  </p>

                  <p className="mt-3 text-sm text-slate-500">
                    Submitted on{' '}
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </p>
                </div>

                <Link
                  href={`/opportunities/${application.opportunitySlug}`}
                  className="btn-outline px-5 py-2 text-sm"
                >
                  View listing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                {application.status === 'withdrawn' ? (
                  <BriefcaseBusiness className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                ) : (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                )}

                <p className="text-sm leading-6 text-slate-600">
                  This is an official application record. Future employer review
                  tools will use this application history and readiness snapshot.
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DashboardEmptyState
          title="No submitted applications yet"
          description="When you apply to an opportunity through the platform, your application will appear here."
          href="/opportunities"
          action="Browse opportunities"
        />
      )}
    </section>
  )
}