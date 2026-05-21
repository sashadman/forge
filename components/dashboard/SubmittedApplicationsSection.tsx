import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react'
import type { ApplicationStatus } from '@/lib/supabase/app-types'
import DashboardEmptyState from '@/components/dashboard/DashboardEmptyState'
import DashboardSectionHeader from '@/components/dashboard/DashboardSectionHeader'
import {
  getApplicationStatusBadgeClass,
  getApplicationStatusLabel,
} from '@/lib/applications/application-review-config'

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

function getStatusMessage(status: ApplicationStatus) {
  if (status === 'submitted') {
    return 'Your application has been submitted and is waiting for review.'
  }

  if (status === 'reviewed') {
    return 'Your application has been reviewed. Watch for possible next steps.'
  }

  if (status === 'contacted') {
    return 'The employer has contacted or marked this application for follow-up.'
  }

  if (status === 'interviewing') {
    return 'This application is in an interview or screening stage.'
  }

  if (status === 'offered') {
    return 'This application has reached an offer or next-step invitation stage.'
  }

  if (status === 'rejected') {
    return 'This application is no longer moving forward.'
  }

  return 'You withdrew this application. It remains here for your records.'
}

export default function SubmittedApplicationsSection({
  applications,
}: SubmittedApplicationsSectionProps) {
  return (
    <section className="content-panel">
      <DashboardSectionHeader
        eyebrow="Applications"
        title="Submitted applications"
        description="Track official applications you submitted through the platform and watch how each one moves through the review process."
        href="/opportunities"
        action={applications.length > 0 ? 'Find more opportunities' : 'Apply to opportunities'}
      />

      {applications.length > 0 ? (
        <div className="mt-8 grid gap-5">
          {applications.map((application) => (
            <div key={application.id} className="card bg-slate-50">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getApplicationStatusBadgeClass(
                        application.status
                      )}`}
                    >
                      {getApplicationStatusLabel(application.status)}
                    </span>

                    <span className="badge-slate">
                      {application.readinessScoreAtApply}% readiness at apply
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-slate-950">
                    {application.opportunityTitle}
                  </h3>

                  <p className="mt-2 font-semibold text-slate-600">
                    {application.employerName}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Submitted{' '}
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
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
                {application.status === 'withdrawn' ||
                application.status === 'rejected' ? (
                  <BriefcaseBusiness className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                ) : (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                )}

                <p className="text-sm leading-6 text-slate-600">
                  {getStatusMessage(application.status)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DashboardEmptyState
          title="No submitted applications yet"
          description="When you apply to an opportunity through the platform, your application will appear here with its status and readiness score at the time you applied."
          href="/opportunities"
          action="Browse opportunities"
        
        />
      )}
    </section>
  )
}