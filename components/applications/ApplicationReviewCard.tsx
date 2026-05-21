import Link from 'next/link'
import {
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import type { ApplicationReviewItem } from '@/lib/employers/get-employer-applications-page-data'
import ApplicationStatusBadge from './ApplicationStatusBadge'
import ApplicationReadinessSnapshotCard from './ApplicationReadinessSnapshotCard'
import ApplicationTimeline from './ApplicationTimeline'
import ApplicationStatusUpdateForm from './ApplicationStatusUpdateForm'

type ApplicationReviewCardProps = {
  application: ApplicationReviewItem
  viewer: 'employer' | 'admin'
}

function formatDate(value: string | null) {
  if (!value) return 'Not set'
  return new Date(value).toLocaleDateString()
}

export default function ApplicationReviewCard({
  application,
  viewer,
}: ApplicationReviewCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <ApplicationStatusBadge status={application.status} />

            <span className="badge-orange">
              {application.readiness_score_at_apply}% readiness
            </span>

            <span className="badge-slate">
              Applicant ID: {application.user_id.slice(0, 8)}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-bold text-slate-950">
            {application.opportunity?.title || 'Opportunity missing'}
          </h3>

          <p className="mt-2 font-semibold text-slate-600">
            {application.employer?.name || 'Employer'} ·{' '}
            {application.opportunity?.trade_slug || 'trade'}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoBox
              icon={<CalendarDays className="h-4 w-4" />}
              label="Submitted"
              value={formatDate(application.submitted_at)}
            />

            <InfoBox
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Readiness"
              value={`${application.readiness_required_completed_at_apply}/${application.readiness_required_total_at_apply} required`}
            />

            <InfoBox
              icon={<BriefcaseBusiness className="h-4 w-4" />}
              label="Location"
              value={
                application.opportunity
                  ? `${application.opportunity.location}, ${application.opportunity.state}`
                  : 'Not set'
              }
            />

            <InfoBox
              icon={<UserRound className="h-4 w-4" />}
              label="Viewer"
              value={viewer === 'admin' ? 'Admin review' : 'Employer review'}
            />
          </div>

          {application.intro_message && (
            <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Applicant intro message
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                {application.intro_message}
              </p>
            </section>
          )}

          {application.experience_summary && (
            <section className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Experience summary
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                {application.experience_summary}
              </p>
            </section>
          )}

          <section className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Readiness snapshot</p>
                <h4 className="mt-2 text-xl font-bold text-slate-950">
                  Submitted application package
                </h4>
              </div>

              <span className="badge-slate">
                {application.snapshots.length} items
              </span>
            </div>

            {application.snapshots.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {application.snapshots.map((snapshot) => (
                  <ApplicationReadinessSnapshotCard
                    key={snapshot.id}
                    snapshot={snapshot}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-500">
                  No readiness snapshot items were captured for this application.
                </p>
              </div>
            )}
          </section>

          <div className="mt-6">
            <ApplicationTimeline
              events={application.events}
              submittedAt={application.submitted_at}
            />
          </div>
        </div>

        <aside className="w-full shrink-0 space-y-4 xl:w-96">
          <ApplicationStatusUpdateForm
            applicationId={application.id}
            currentStatus={application.status}
            employerNotes={application.employer_notes}
          />

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold text-slate-950">Quick links</p>

            <div className="mt-4 grid gap-3">
              {application.opportunity && (
                <Link
                  href={`/opportunities/${application.opportunity.slug}`}
                  className="btn-outline px-5 py-3 text-sm"
                >
                  Public opportunity
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}

              {application.employer && (
                <Link
                  href={`/employers/${application.employer.slug}`}
                  className="btn-outline px-5 py-3 text-sm"
                >
                  Employer profile
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="font-semibold text-orange-900">Privacy note</p>
            <p className="mt-2 text-sm leading-6 text-orange-900/80">
              Seeker private notes are intentionally not shown here. This page
              shows the submitted application package and review notes only.
            </p>
          </div>
        </aside>
      </div>
    </article>
  )
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="mini-card-white">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      </div>

      <p className="mt-2 font-bold text-slate-950">{value}</p>
    </div>
  )
}